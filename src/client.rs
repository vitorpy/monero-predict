// src/client.rs
use tfhe::{ClientKey, FheUint64, FheUint8};
use tfhe::prelude::*;
use sha3::{Digest, Sha3_256};
use rand::RngCore;
use anyhow::Result;
use crate::types::EncryptedBet;

pub struct BettorClient {
    client_key: ClientKey,
}

impl BettorClient {
    pub fn new(client_key: ClientKey) -> Self {
        Self { client_key }
    }

    pub fn create_bet(
        &self,
        outcome: u8,
        amount: u64, // in piconeros
    ) -> Result<(Vec<u8>, [u8; 32], [u8; 32])> {
        // Generate nonce for later claiming
        let mut nonce = [0u8; 32];
        rand::thread_rng().fill_bytes(&mut nonce);

        // Create commitment H(nonce)
        let mut hasher = Sha3_256::new();
        hasher.update(&nonce);
        let commitment: [u8; 32] = hasher.finalize().into();

        // Encrypt the bet data
        let encrypted_outcome = FheUint8::encrypt(outcome, &self.client_key);
        let encrypted_amount = FheUint64::encrypt(amount, &self.client_key);

        // Serialize the encrypted values
        let serialized_outcome = bincode::serialize(&encrypted_outcome)?;
        let serialized_amount = bincode::serialize(&encrypted_amount)?;

        let encrypted_bet = EncryptedBet {
            id: [0u8; 32], // Will be set by coordinator
            outcome: serialized_outcome,
            amount: serialized_amount,
            commitment,
            tx_proof: String::new(), // Will be set after Monero tx
        };

        let serialized = bincode::serialize(&encrypted_bet)?;

        Ok((serialized, commitment, nonce))
    }
}
