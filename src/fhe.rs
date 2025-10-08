// src/fhe.rs
use tfhe::{
    ConfigBuilder, ClientKey, ServerKey, CompressedServerKey,
    FheUint64, FheUint8,
};
use tfhe::prelude::*;
use anyhow::Result;
use crate::types::EncryptedBet;

// GPU support requires building tfhe-rs from source with GPU features
// See README_CUDA.md for instructions

pub struct FheContext {
    pub client_key: ClientKey,
    pub server_key: ServerKey,
}

impl FheContext {
    pub fn new() -> Result<Self> {
        // Use parameters suitable for financial calculations
        // SIMD optimizations are automatically enabled on x86_64
        let config = ConfigBuilder::default().build();
        let (client_key, server_key) = tfhe::generate_keys(config);

        #[cfg(feature = "gpu")]
        {
            println!("🚀 GPU acceleration requested - ensure tfhe-rs built with GPU support");
            println!("   See README_CUDA.md for build instructions");
        }

        Ok(Self {
            client_key,
            server_key,
        })
    }

    pub fn export_server_key(&self) -> Result<Vec<u8>> {
        // Compress and serialize for sharing
        let compressed = CompressedServerKey::new(&self.client_key);
        bincode::serialize(&compressed).map_err(Into::into)
    }
}

pub struct PayoutCalculator {
    server_key: ServerKey,
    batch_size: usize,
}

impl PayoutCalculator {
    pub fn new(server_key: ServerKey) -> Self {
        tfhe::set_server_key(server_key.clone());
        Self {
            server_key,
            batch_size: 1000, // Default batch size for GPU memory management
        }
    }

    pub fn with_batch_size(mut self, batch_size: usize) -> Self {
        self.batch_size = batch_size;
        self
    }

    pub fn compute_payouts(
        &self,
        bets: &[EncryptedBet],
        winning_outcome: u8,
    ) -> Result<Vec<Vec<u8>>> {
        // Set the server key for this thread
        tfhe::set_server_key(self.server_key.clone());

        if bets.len() <= self.batch_size {
            // Small enough to process in one batch
            self.compute_payouts_single_batch(bets, winning_outcome)
        } else {
            // Use batch processing for large markets
            self.compute_payouts_batched(bets, winning_outcome)
        }
    }

    fn compute_payouts_single_batch(
        &self,
        bets: &[EncryptedBet],
        winning_outcome: u8,
    ) -> Result<Vec<Vec<u8>>> {
        // Deserialize all bet amounts and outcomes
        let mut deserialized_bets = Vec::new();
        for bet in bets {
            let outcome: FheUint8 = bincode::deserialize(&bet.outcome)?;
            let amount: FheUint64 = bincode::deserialize(&bet.amount)?;
            deserialized_bets.push((outcome, amount));
        }

        // First pass: calculate totals
        let mut total_winning_amount = FheUint64::try_encrypt_trivial(0u64)?;
        let mut total_pool = FheUint64::try_encrypt_trivial(0u64)?;

        let winner_value = FheUint8::try_encrypt_trivial(winning_outcome)?;

        for (outcome, amount) in &deserialized_bets {
            let is_winner = outcome.eq(&winner_value);
            let winning_contribution = is_winner.if_then_else(
                amount,
                &FheUint64::try_encrypt_trivial(0u64)?
            );

            total_winning_amount = &total_winning_amount + &winning_contribution;
            total_pool = &total_pool + amount;
        }

        // Second pass: calculate individual payouts
        let mut payouts = Vec::new();
        for (outcome, amount) in &deserialized_bets {
            let is_winner = outcome.eq(&winner_value);

            // Proportional payout: (bet_amount / total_winning) * total_pool
            // payout = (bet_amount * total_pool) / total_winning
            let numerator = amount * &total_pool;
            let payout = &numerator / &total_winning_amount;

            let final_payout = is_winner.if_then_else(
                &payout,
                &FheUint64::try_encrypt_trivial(0u64)?
            );

            payouts.push(bincode::serialize(&final_payout)?);
        }

        Ok(payouts)
    }

    fn compute_payouts_batched(
        &self,
        bets: &[EncryptedBet],
        winning_outcome: u8,
    ) -> Result<Vec<Vec<u8>>> {
        // First, compute global totals across all batches
        let (total_pool, total_winning) = self.compute_totals(bets, winning_outcome)?;

        // Then process payouts in batches
        let mut all_payouts = Vec::new();

        for (batch_idx, batch) in bets.chunks(self.batch_size).enumerate() {
            println!("  Processing batch {}/{} ({} bets)...",
                batch_idx + 1,
                (bets.len() + self.batch_size - 1) / self.batch_size,
                batch.len()
            );

            let batch_payouts = self.compute_batch_payouts(
                batch,
                winning_outcome,
                &total_pool,
                &total_winning
            )?;

            all_payouts.extend(batch_payouts);
        }

        Ok(all_payouts)
    }

    fn compute_totals(
        &self,
        bets: &[EncryptedBet],
        winning_outcome: u8,
    ) -> Result<(FheUint64, FheUint64)> {
        let mut total_winning_amount = FheUint64::try_encrypt_trivial(0u64)?;
        let mut total_pool = FheUint64::try_encrypt_trivial(0u64)?;
        let winner_value = FheUint8::try_encrypt_trivial(winning_outcome)?;

        // Process in batches to avoid memory issues
        for batch in bets.chunks(self.batch_size) {
            for bet in batch {
                let outcome: FheUint8 = bincode::deserialize(&bet.outcome)?;
                let amount: FheUint64 = bincode::deserialize(&bet.amount)?;

                let is_winner = outcome.eq(&winner_value);
                let winning_contribution = is_winner.if_then_else(
                    &amount,
                    &FheUint64::try_encrypt_trivial(0u64)?
                );

                total_winning_amount = &total_winning_amount + &winning_contribution;
                total_pool = &total_pool + &amount;
            }
        }

        Ok((total_pool, total_winning_amount))
    }

    fn compute_batch_payouts(
        &self,
        batch: &[EncryptedBet],
        winning_outcome: u8,
        total_pool: &FheUint64,
        total_winning: &FheUint64,
    ) -> Result<Vec<Vec<u8>>> {
        let winner_value = FheUint8::try_encrypt_trivial(winning_outcome)?;
        let mut payouts = Vec::new();

        for bet in batch {
            let outcome: FheUint8 = bincode::deserialize(&bet.outcome)?;
            let amount: FheUint64 = bincode::deserialize(&bet.amount)?;

            let is_winner = outcome.eq(&winner_value);
            let numerator = &amount * total_pool;
            let payout = &numerator / total_winning;

            let final_payout = is_winner.if_then_else(
                &payout,
                &FheUint64::try_encrypt_trivial(0u64)?
            );

            payouts.push(bincode::serialize(&final_payout)?);
        }

        Ok(payouts)
    }
}
