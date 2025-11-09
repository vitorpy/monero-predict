//! Commitment Scheme
//!
//! This module implements the SHA3-256 commitment scheme for bet nonces.

use anyhow::Result;
use rand::Rng;
use sha3::{Digest, Sha3_256};

/// Generate a cryptographically secure random 32-byte nonce
pub fn generate_nonce() -> Result<[u8; 32]> {
    let mut rng = rand::thread_rng();
    let mut nonce = [0u8; 32];
    rng.fill(&mut nonce);
    Ok(nonce)
}

/// Compute SHA3-256 commitment hash of a nonce
pub fn compute_commitment(nonce: &[u8; 32]) -> [u8; 32] {
    let mut hasher = Sha3_256::new();
    hasher.update(nonce);
    let result = hasher.finalize();

    let mut commitment = [0u8; 32];
    commitment.copy_from_slice(&result);
    commitment
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_nonce_generation() {
        let nonce1 = generate_nonce().unwrap();
        let nonce2 = generate_nonce().unwrap();

        // Nonces should be different
        assert_ne!(nonce1, nonce2);
    }

    #[test]
    fn test_commitment_determinism() {
        let nonce = [42u8; 32];
        let commitment1 = compute_commitment(&nonce);
        let commitment2 = compute_commitment(&nonce);

        // Same nonce should produce same commitment
        assert_eq!(commitment1, commitment2);
    }

    #[test]
    fn test_commitment_uniqueness() {
        let nonce1 = [1u8; 32];
        let nonce2 = [2u8; 32];
        let commitment1 = compute_commitment(&nonce1);
        let commitment2 = compute_commitment(&nonce2);

        // Different nonces should produce different commitments
        assert_ne!(commitment1, commitment2);
    }
}
