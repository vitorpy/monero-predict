//! FHE Key Management
//!
//! This module handles FHE keypair generation, serialization, and deserialization.

use anyhow::Result;
use serde::{Deserialize, Serialize};
use tfhe::{ClientKey, ServerKey};

/// FHE Key Pair containing client and server keys
///
/// - Client key: PRIVATE, used for encryption/decryption
/// - Server key: PUBLIC, used for homomorphic operations
#[derive(Serialize, Deserialize)]
pub struct FheKeyPair {
    pub(crate) client_key: ClientKey,
    pub(crate) server_key: ServerKey,
}

impl FheKeyPair {
    /// Generate new FHE keypair (takes 10-30 seconds!)
    pub fn generate() -> Result<Self> {
        use tfhe::ConfigBuilder;

        let config = ConfigBuilder::default().build();
        let (client_key, server_key) = tfhe::generate_keys(config);

        Ok(Self {
            client_key,
            server_key,
        })
    }

    /// Export client key as bytes
    pub fn export_client_key(&self) -> Result<Vec<u8>> {
        bincode::serialize(&self.client_key).map_err(Into::into)
    }

    /// Export server key as bytes
    pub fn export_server_key(&self) -> Result<Vec<u8>> {
        bincode::serialize(&self.server_key).map_err(Into::into)
    }

    /// Load keypair from serialized bytes
    pub fn from_bytes(client_bytes: &[u8], server_bytes: &[u8]) -> Result<Self> {
        let client_key = bincode::deserialize(client_bytes)?;
        let server_key = bincode::deserialize(server_bytes)?;
        Ok(Self {
            client_key,
            server_key,
        })
    }
}

#[cfg(test)]
#[cfg(not(target_arch = "wasm32"))]
mod tests {
    use super::*;

    #[test]
    fn test_key_generation() {
        // Key generation should succeed
        let keypair = FheKeyPair::generate().unwrap();

        // Keys should be exportable
        let client_bytes = keypair.export_client_key().unwrap();
        let server_bytes = keypair.export_server_key().unwrap();

        // Exported keys should not be empty
        assert!(!client_bytes.is_empty(), "Client key should not be empty");
        assert!(!server_bytes.is_empty(), "Server key should not be empty");
    }

    #[test]
    fn test_key_serialization_roundtrip() {
        // Generate keypair
        let keypair = FheKeyPair::generate().unwrap();

        // Export keys
        let client_bytes = keypair.export_client_key().unwrap();
        let server_bytes = keypair.export_server_key().unwrap();

        // Load keys from bytes
        let loaded_keypair = FheKeyPair::from_bytes(&client_bytes, &server_bytes).unwrap();

        // Re-export and compare
        let reexported_client = loaded_keypair.export_client_key().unwrap();
        let reexported_server = loaded_keypair.export_server_key().unwrap();

        assert_eq!(client_bytes, reexported_client, "Client key roundtrip failed");
        assert_eq!(server_bytes, reexported_server, "Server key roundtrip failed");
    }
}
