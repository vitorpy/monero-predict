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

/// Decrypt outcome for testing
pub fn decrypt_outcome(ciphertext: &[u8], keypair: &FheKeyPair) -> Result<bool> {
    use tfhe::prelude::*;
    use tfhe::FheUint8;

    let encrypted: FheUint8 = bincode::deserialize(ciphertext)?;
    let decrypted: u8 = encrypted.decrypt(&keypair.client_key);
    Ok(decrypted == 0)
}

/// Decrypt amount for testing
pub fn decrypt_amount(ciphertext: &[u8], keypair: &FheKeyPair) -> Result<u64> {
    use tfhe::prelude::*;
    use tfhe::FheUint64;

    let encrypted: FheUint64 = bincode::deserialize(ciphertext)?;
    let decrypted: u64 = encrypted.decrypt(&keypair.client_key);
    Ok(decrypted)
}

#[cfg(test)]
#[cfg(not(target_arch = "wasm32"))]
mod tests {
    use super::*;
    use crate::keys::FheKeyPair;

    #[test]
    fn test_encrypt_decrypt_yes_bet() {
        // Generate keypair (slow operation!)
        let keypair = FheKeyPair::generate().unwrap();

        // Encrypt a YES bet for 1 XMR (1e12 piconeros)
        let amount = 1_000_000_000_000u64;
        let encrypted = encrypt_bet(true, amount, &keypair).unwrap();

        // Verify encrypted data is not empty
        assert!(!encrypted.outcome.is_empty(), "Encrypted outcome should not be empty");
        assert!(!encrypted.amount.is_empty(), "Encrypted amount should not be empty");

        // Decrypt and verify
        let decrypted_outcome = decrypt_outcome(&encrypted.outcome, &keypair).unwrap();
        let decrypted_amount = decrypt_amount(&encrypted.amount, &keypair).unwrap();

        assert_eq!(decrypted_outcome, true, "Outcome should decrypt to YES (true)");
        assert_eq!(decrypted_amount, amount, "Amount should decrypt correctly");
    }

    #[test]
    fn test_encrypt_decrypt_no_bet() {
        // Generate keypair
        let keypair = FheKeyPair::generate().unwrap();

        // Encrypt a NO bet for 0.5 XMR
        let amount = 500_000_000_000u64;
        let encrypted = encrypt_bet(false, amount, &keypair).unwrap();

        // Decrypt and verify
        let decrypted_outcome = decrypt_outcome(&encrypted.outcome, &keypair).unwrap();
        let decrypted_amount = decrypt_amount(&encrypted.amount, &keypair).unwrap();

        assert_eq!(decrypted_outcome, false, "Outcome should decrypt to NO (false)");
        assert_eq!(decrypted_amount, amount, "Amount should decrypt correctly");
    }

    #[test]
    fn test_commitment_uniqueness() {
        let keypair = FheKeyPair::generate().unwrap();

        // Encrypt two identical bets
        let bet1 = encrypt_bet(true, 1000, &keypair).unwrap();
        let bet2 = encrypt_bet(true, 1000, &keypair).unwrap();

        // Nonces should be different (randomized)
        assert_ne!(bet1.nonce, bet2.nonce, "Nonces should be unique");

        // Commitments should be different
        assert_ne!(bet1.commitment, bet2.commitment, "Commitments should be unique");
    }

    #[test]
    fn test_commitment_verification() {
        let keypair = FheKeyPair::generate().unwrap();
        let encrypted = encrypt_bet(true, 1000, &keypair).unwrap();

        // Recompute commitment from nonce
        let recomputed = crate::commitment::compute_commitment(&encrypted.nonce);

        // Should match the stored commitment
        assert_eq!(encrypted.commitment, recomputed, "Commitment should be verifiable from nonce");
    }

    #[test]
    fn test_edge_case_zero_amount() {
        let keypair = FheKeyPair::generate().unwrap();

        // Encrypt a bet with zero amount (edge case)
        let encrypted = encrypt_bet(true, 0, &keypair).unwrap();
        let decrypted_amount = decrypt_amount(&encrypted.amount, &keypair).unwrap();

        assert_eq!(decrypted_amount, 0, "Zero amount should round-trip correctly");
    }

    #[test]
    fn test_edge_case_max_amount() {
        let keypair = FheKeyPair::generate().unwrap();

        // Encrypt a bet with maximum u64 value (edge case)
        let max_amount = u64::MAX;
        let encrypted = encrypt_bet(false, max_amount, &keypair).unwrap();
        let decrypted_amount = decrypt_amount(&encrypted.amount, &keypair).unwrap();

        assert_eq!(decrypted_amount, max_amount, "Max amount should round-trip correctly");
    }
}
