// src/coordinator.rs
use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
};
use sha3::{Digest, Sha3_256};
use anyhow::Result;
use crate::types::*;
use crate::fhe::*;

pub struct CoordinatorState {
    pub markets: Arc<RwLock<HashMap<String, Market>>>,
    pub fhe_context: Arc<FheContext>,
}

pub struct Market {
    pub config: MarketConfig,
    pub bets: Vec<EncryptedBet>,
    pub result: Option<MarketResult>,
    pub payouts: Option<Vec<u64>>, // Decrypted payouts
}

impl CoordinatorState {
    pub fn new() -> Result<Self> {
        Ok(Self {
            markets: Arc::new(RwLock::new(HashMap::new())),
            fhe_context: Arc::new(FheContext::new()?),
        })
    }

    pub async fn create_market(&self, config: MarketConfig) -> Result<String> {
        let mut markets = self.markets.write().unwrap();
        let market = Market {
            config: config.clone(),
            bets: Vec::new(),
            result: None,
            payouts: None,
        };
        markets.insert(config.id.clone(), market);
        Ok(config.id)
    }

    pub async fn submit_bet(
        &self,
        market_id: String,
        encrypted_bet_data: Vec<u8>,
        tx_proof: String,
    ) -> Result<[u8; 32]> {
        // Verify Monero transaction exists and pays to multisig
        // (In production, would check via monero-rpc)

        // Deserialize encrypted bet
        let encrypted_bet: EncryptedBet = bincode::deserialize(&encrypted_bet_data)?;

        // Generate bet ID
        let mut hasher = Sha3_256::new();
        hasher.update(&tx_proof);
        hasher.update(&encrypted_bet.commitment);
        let bet_id: [u8; 32] = hasher.finalize().into();

        // Store bet
        let mut markets = self.markets.write().unwrap();
        let market = markets.get_mut(&market_id)
            .ok_or_else(|| anyhow::anyhow!("Market not found"))?;

        market.bets.push(EncryptedBet {
            id: bet_id,
            outcome: encrypted_bet.outcome,
            amount: encrypted_bet.amount,
            commitment: encrypted_bet.commitment,
            tx_proof,
        });

        Ok(bet_id)
    }

    pub async fn resolve_market(
        &self,
        market_id: String,
        winning_outcome: u8,
        oracle_signature: Vec<u8>,
    ) -> Result<MarketResult> {
        use tfhe::prelude::*;
        use tfhe::{FheUint64, FheUint8};

        let mut markets = self.markets.write().unwrap();
        let market = markets.get_mut(&market_id)
            .ok_or_else(|| anyhow::anyhow!("Market not found"))?;

        // Verify oracle signature
        // (In production, would verify signature properly)

        // Compute payouts homomorphically
        let calculator = PayoutCalculator::new(self.fhe_context.server_key.clone());
        let encrypted_payouts = calculator.compute_payouts(&market.bets, winning_outcome)?;

        // Decrypt payouts (coordinator has the key in this simplified version)
        let mut total_pool = 0u64;
        let mut total_winners = 0u64;
        let mut decrypted_payouts = Vec::new();

        for (bet, encrypted_payout_bytes) in market.bets.iter().zip(encrypted_payouts.iter()) {
            // Deserialize and decrypt bet amount and outcome
            let amount_fhe: FheUint64 = bincode::deserialize(&bet.amount)?;
            let outcome_fhe: FheUint8 = bincode::deserialize(&bet.outcome)?;
            let payout_fhe: FheUint64 = bincode::deserialize(encrypted_payout_bytes)?;

            let decrypted_amount: u64 = amount_fhe.decrypt(&self.fhe_context.client_key);
            let decrypted_outcome: u8 = outcome_fhe.decrypt(&self.fhe_context.client_key);
            let payout: u64 = payout_fhe.decrypt(&self.fhe_context.client_key);

            total_pool += decrypted_amount;
            if decrypted_outcome == winning_outcome {
                total_winners += decrypted_amount;
            }

            decrypted_payouts.push(payout);
        }

        let result = MarketResult {
            winning_outcome,
            total_pool,
            total_winners,
            total_losers: total_pool - total_winners,
            oracle_signature,
        };

        market.result = Some(result.clone());
        market.payouts = Some(decrypted_payouts);

        Ok(result)
    }

    pub async fn claim_payout(
        &self,
        market_id: String,
        claim: PayoutClaim,
    ) -> Result<u64> {
        let markets = self.markets.read().unwrap();
        let market = markets.get(&market_id)
            .ok_or_else(|| anyhow::anyhow!("Market not found"))?;

        // Verify the claim
        let mut hasher = Sha3_256::new();
        hasher.update(&claim.nonce);
        let commitment: [u8; 32] = hasher.finalize().into();

        // Find the bet with matching commitment
        let (bet_index, _) = market.bets.iter()
            .enumerate()
            .find(|(_, bet)| bet.commitment == commitment)
            .ok_or_else(|| anyhow::anyhow!("Invalid claim"))?;

        // Get the payout amount
        let payout = market.payouts.as_ref()
            .and_then(|p| p.get(bet_index))
            .ok_or_else(|| anyhow::anyhow!("Market not resolved"))?;

        // In production: trigger Monero multisig payout here
        println!("Payout {} piconeros to {}", payout, claim.payout_address);

        Ok(*payout)
    }
}
