// src/fhe.rs
use tfhe::{
    ConfigBuilder, ClientKey, ServerKey, CompressedServerKey,
    FheUint64, FheUint8,
};
use tfhe::prelude::*;
use anyhow::Result;
use crate::types::EncryptedBet;

pub struct FheContext {
    pub client_key: ClientKey,
    pub server_key: ServerKey,
}

impl FheContext {
    pub fn new() -> Result<Self> {
        // Use parameters suitable for financial calculations
        let config = ConfigBuilder::default().build();
        let (client_key, server_key) = tfhe::generate_keys(config);

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
}

impl PayoutCalculator {
    pub fn new(server_key: ServerKey) -> Self {
        tfhe::set_server_key(server_key.clone());
        Self { server_key }
    }

    pub fn compute_payouts(
        &self,
        bets: &[EncryptedBet],
        winning_outcome: u8,
    ) -> Result<Vec<Vec<u8>>> {
        // Set the server key for this thread
        tfhe::set_server_key(self.server_key.clone());

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
}
