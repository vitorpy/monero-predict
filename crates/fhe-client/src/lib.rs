//! FHE Client Library for Monero Prediction Markets
//!
//! This crate provides FHE (Fully Homomorphic Encryption) operations for encrypting
//! prediction market bets. It compiles to both native Rust and WebAssembly.
//!
//! ## Features
//!
//! - Dual-target compilation (native + WASM)
//! - FHE key generation and management
//! - Bet encryption (outcome + amount)
//! - SHA3-256 commitment scheme
//! - WASM bindings for browser usage

// Module declarations
pub mod keys;
pub mod crypto;
pub mod commitment;

// WASM bindings (only compiled with --features wasm)
#[cfg(feature = "wasm")]
pub mod wasm;

// Re-export main types for convenience
pub use keys::FheKeyPair;
pub use crypto::{encrypt_bet, EncryptedBet};
pub use commitment::{generate_nonce, compute_commitment};

#[cfg(feature = "wasm")]
pub use wasm::WasmFheClient;
