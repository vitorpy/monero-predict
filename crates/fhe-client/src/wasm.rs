//! WASM Bindings
//!
//! This module provides WebAssembly bindings for FHE operations.
//! Only compiled when the "wasm" feature is enabled.

use wasm_bindgen::prelude::*;
use crate::{FheKeyPair, EncryptedBet};

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
    #[wasm_bindgen(constructor)]
    pub fn generate() -> Result<WasmFheClient, JsValue> {
        // TODO: Implement actual key generation
        // For now, return error to indicate not yet implemented
        Err(JsValue::from_str("Key generation not yet implemented. Complete task 2 first."))
    }

    /// Load keypair from stored bytes
    #[wasm_bindgen]
    pub fn from_bytes(client_bytes: &[u8], server_bytes: &[u8]) -> Result<WasmFheClient, JsValue> {
        let keypair = FheKeyPair::from_bytes(client_bytes, server_bytes)
            .map_err(|e| JsValue::from_str(&format!("Failed to load keys: {}", e)))?;
        Ok(Self { keypair })
    }

    /// Export client key (PRIVATE - never share!)
    #[wasm_bindgen]
    pub fn export_client_key(&self) -> Result<Vec<u8>, JsValue> {
        self.keypair.export_client_key()
            .map_err(|e| JsValue::from_str(&format!("Failed to export client key: {}", e)))
    }

    /// Export server key (PUBLIC - safe to send to coordinator)
    #[wasm_bindgen]
    pub fn export_server_key(&self) -> Result<Vec<u8>, JsValue> {
        self.keypair.export_server_key()
            .map_err(|e| JsValue::from_str(&format!("Failed to export server key: {}", e)))
    }

    /// Encrypt a bet
    ///
    /// # Arguments
    /// * `outcome_yes` - true for YES, false for NO
    /// * `amount_piconeros` - Bet amount in piconeros (1 XMR = 1e12 piconeros)
    #[wasm_bindgen]
    pub fn encrypt_bet(&self, outcome_yes: bool, amount_piconeros: u64) -> Result<JsValue, JsValue> {
        // TODO: Implement actual encryption
        // For now, return error to indicate not yet implemented
        Err(JsValue::from_str("Encryption not yet implemented. Complete task 2 first."))
    }
}
