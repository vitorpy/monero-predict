//! FHE Encryption Operations
//!
//! This module handles bet encryption and decryption.

use anyhow::Result;
use serde::{Deserialize, Serialize};
use crate::keys::FheKeyPair;

/// Encrypted bet data
#[derive(Serialize, Deserialize, Clone)]
pub struct EncryptedBet {
    /// Encrypted outcome (FheUint8 serialized): YES=0, NO=1
    pub outcome: Vec<u8>,
    /// Encrypted amount (FheUint64 serialized): piconeros
    pub amount: Vec<u8>,
    /// SHA3-256 commitment hash
    pub commitment: [u8; 32],
    /// Random nonce (for commitment)
    pub nonce: [u8; 32],
}

/// Encrypt a bet (outcome + amount)
///
/// # Arguments
/// * `outcome_yes` - true for YES, false for NO
/// * `amount_piconeros` - Bet amount in piconeros (1 XMR = 1e12 piconeros)
/// * `keypair` - FHE keypair for encryption
pub fn encrypt_bet(
    outcome_yes: bool,
    amount_piconeros: u64,
    keypair: &FheKeyPair,
) -> Result<EncryptedBet> {
    #[cfg(not(target_arch = "wasm32"))]
    {
        use tfhe::prelude::*;
        use tfhe::{FheUint8, FheUint64};

        // Set server key for FHE operations
        tfhe::set_server_key(keypair.server_key.clone());

        // Encrypt outcome (0 or 1)
        let outcome_val = if outcome_yes { 0u8 } else { 1u8 };
        let enc_outcome = FheUint8::encrypt(outcome_val, &keypair.client_key);

        // Encrypt amount
        let enc_amount = FheUint64::encrypt(amount_piconeros, &keypair.client_key);

        // Generate commitment
        let nonce = crate::commitment::generate_nonce()?;
        let commitment = crate::commitment::compute_commitment(&nonce);

        Ok(EncryptedBet {
            outcome: bincode::serialize(&enc_outcome)?,
            amount: bincode::serialize(&enc_amount)?,
            commitment,
            nonce,
        })
    }

    #[cfg(target_arch = "wasm32")]
    {
        anyhow::bail!("Use WasmFheClient for encryption in WASM")
    }
}

/// Decrypt outcome for testing
#[cfg(not(target_arch = "wasm32"))]
pub fn decrypt_outcome(ciphertext: &[u8], keypair: &FheKeyPair) -> Result<bool> {
    use tfhe::prelude::*;
    use tfhe::FheUint8;

    let encrypted: FheUint8 = bincode::deserialize(ciphertext)?;
    let decrypted: u8 = encrypted.decrypt(&keypair.client_key);
    Ok(decrypted == 0)
}

/// Decrypt amount for testing
#[cfg(not(target_arch = "wasm32"))]
pub fn decrypt_amount(ciphertext: &[u8], keypair: &FheKeyPair) -> Result<u64> {
    use tfhe::prelude::*;
    use tfhe::FheUint64;

    let encrypted: FheUint64 = bincode::deserialize(ciphertext)?;
    let decrypted: u64 = encrypted.decrypt(&keypair.client_key);
    Ok(decrypted)
}
