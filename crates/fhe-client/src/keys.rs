//! FHE Key Management
//!
//! This module handles FHE keypair generation, serialization, and deserialization.

use anyhow::Result;
use serde::{Deserialize, Serialize};

#[cfg(not(target_arch = "wasm32"))]
use tfhe::{ClientKey, ServerKey};

/// FHE Key Pair containing client and server keys
///
/// - Client key: PRIVATE, used for encryption/decryption
/// - Server key: PUBLIC, used for homomorphic operations
#[derive(Serialize, Deserialize)]
pub struct FheKeyPair {
    #[cfg(not(target_arch = "wasm32"))]
    pub(crate) client_key: ClientKey,
    #[cfg(not(target_arch = "wasm32"))]
    pub(crate) server_key: ServerKey,

    // For WASM, we store serialized keys
    #[cfg(target_arch = "wasm32")]
    pub(crate) client_key_bytes: Vec<u8>,
    #[cfg(target_arch = "wasm32")]
    pub(crate) server_key_bytes: Vec<u8>,
}

impl FheKeyPair {
    /// Generate new FHE keypair (takes 10-30 seconds!)
    pub fn generate() -> Result<Self> {
        #[cfg(not(target_arch = "wasm32"))]
        {
            use tfhe::ConfigBuilder;

            let config = ConfigBuilder::default().build();
            let (client_key, server_key) = tfhe::generate_keys(config);

            Ok(Self { client_key, server_key })
        }

        #[cfg(target_arch = "wasm32")]
        {
            anyhow::bail!("Use WasmFheClient for key generation in WASM")
        }
    }

    /// Export client key as bytes
    pub fn export_client_key(&self) -> Result<Vec<u8>> {
        #[cfg(not(target_arch = "wasm32"))]
        {
            bincode::serialize(&self.client_key).map_err(Into::into)
        }

        #[cfg(target_arch = "wasm32")]
        {
            Ok(self.client_key_bytes.clone())
        }
    }

    /// Export server key as bytes
    pub fn export_server_key(&self) -> Result<Vec<u8>> {
        #[cfg(not(target_arch = "wasm32"))]
        {
            bincode::serialize(&self.server_key).map_err(Into::into)
        }

        #[cfg(target_arch = "wasm32")]
        {
            Ok(self.server_key_bytes.clone())
        }
    }

    /// Load keypair from serialized bytes
    pub fn from_bytes(client_bytes: &[u8], server_bytes: &[u8]) -> Result<Self> {
        #[cfg(not(target_arch = "wasm32"))]
        {
            let client_key = bincode::deserialize(client_bytes)?;
            let server_key = bincode::deserialize(server_bytes)?;
            Ok(Self { client_key, server_key })
        }

        #[cfg(target_arch = "wasm32")]
        {
            Ok(Self {
                client_key_bytes: client_bytes.to_vec(),
                server_key_bytes: server_bytes.to_vec(),
            })
        }
    }
}
