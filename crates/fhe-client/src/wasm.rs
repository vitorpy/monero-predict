//! WASM Bindings
//!
//! This module provides WebAssembly bindings for FHE operations.
//! Only compiled when the "wasm" feature is enabled.

use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use crate::{FheKeyPair, EncryptedBet};

/// Encrypted bet data for JavaScript
#[derive(Serialize, Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct JsEncryptedBet {
    /// Encrypted outcome (serialized FheUint8)
    pub outcome: Vec<u8>,
    /// Encrypted amount (serialized FheUint64)
    pub amount: Vec<u8>,
    /// SHA3-256 commitment hash (32 bytes)
    pub commitment: Vec<u8>,
    /// Random nonce for commitment (32 bytes)
    pub nonce: Vec<u8>,
}

impl From<EncryptedBet> for JsEncryptedBet {
    fn from(bet: EncryptedBet) -> Self {
        Self {
            outcome: bet.outcome,
            amount: bet.amount,
            commitment: bet.commitment.to_vec(),
            nonce: bet.nonce.to_vec(),
        }
    }
}

/// WASM wrapper for FheKeyPair
#[wasm_bindgen]
pub struct WasmFheClient {
    keypair: FheKeyPair,
}

#[wasm_bindgen]
impl WasmFheClient {
    /// Generate new FHE keypair
    ///
    /// ⚠️ Warning: This takes 10-30 seconds! Show a progress indicator.
    ///
    /// # Example (JavaScript)
    /// ```javascript
    /// const client = new WasmFheClient();
    /// ```
    #[wasm_bindgen(constructor)]
    pub fn generate() -> Result<WasmFheClient, JsValue> {
        let keypair = FheKeyPair::generate()
            .map_err(|e| JsValue::from_str(&format!("Key generation failed: {}", e)))?;
        Ok(Self { keypair })
    }

    /// Load keypair from stored bytes
    ///
    /// # Example (JavaScript)
    /// ```javascript
    /// const client = WasmFheClient.from_bytes(clientKeyBytes, serverKeyBytes);
    /// ```
    #[wasm_bindgen]
    pub fn from_bytes(client_bytes: &[u8], server_bytes: &[u8]) -> Result<WasmFheClient, JsValue> {
        let keypair = FheKeyPair::from_bytes(client_bytes, server_bytes)
            .map_err(|e| JsValue::from_str(&format!("Failed to load keys: {}", e)))?;
        Ok(Self { keypair })
    }

    /// Export client key (PRIVATE - never share!)
    ///
    /// # Example (JavaScript)
    /// ```javascript
    /// const clientKeyBytes = client.export_client_key();
    /// // Store securely in IndexedDB, encrypted
    /// ```
    #[wasm_bindgen]
    pub fn export_client_key(&self) -> Result<Vec<u8>, JsValue> {
        self.keypair
            .export_client_key()
            .map_err(|e| JsValue::from_str(&format!("Failed to export client key: {}", e)))
    }

    /// Export server key (PUBLIC - safe to send to coordinator)
    ///
    /// # Example (JavaScript)
    /// ```javascript
    /// const serverKeyBytes = client.export_server_key();
    /// // Send to coordinator via POST /register
    /// ```
    #[wasm_bindgen]
    pub fn export_server_key(&self) -> Result<Vec<u8>, JsValue> {
        self.keypair
            .export_server_key()
            .map_err(|e| JsValue::from_str(&format!("Failed to export server key: {}", e)))
    }

    /// Encrypt a bet
    ///
    /// # Arguments
    /// * `outcome_yes` - true for YES, false for NO
    /// * `amount_piconeros` - Bet amount in piconeros (1 XMR = 1e12 piconeros)
    ///
    /// # Example (JavaScript)
    /// ```javascript
    /// const encryptedBet = client.encrypt_bet(true, 1000000000000n); // 1 XMR on YES
    /// ```
    #[wasm_bindgen]
    pub fn encrypt_bet(
        &self,
        outcome_yes: bool,
        amount_piconeros: u64,
    ) -> Result<JsEncryptedBet, JsValue> {
        let encrypted = crate::encrypt_bet(outcome_yes, amount_piconeros, &self.keypair)
            .map_err(|e| JsValue::from_str(&format!("Encryption failed: {}", e)))?;
        Ok(encrypted.into())
    }

    /// Decrypt outcome (for testing/verification only)
    #[wasm_bindgen]
    pub fn decrypt_outcome(&self, ciphertext: &[u8]) -> Result<bool, JsValue> {
        crate::decrypt_outcome(ciphertext, &self.keypair)
            .map_err(|e| JsValue::from_str(&format!("Decryption failed: {}", e)))
    }

    /// Decrypt amount (for testing/verification only)
    #[wasm_bindgen]
    pub fn decrypt_amount(&self, ciphertext: &[u8]) -> Result<u64, JsValue> {
        crate::decrypt_amount(ciphertext, &self.keypair)
            .map_err(|e| JsValue::from_str(&format!("Decryption failed: {}", e)))
    }
}
