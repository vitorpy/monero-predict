// src/types.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarketConfig {
    pub id: String,
    pub question: String,
    pub outcomes: Vec<String>, // ["YES", "NO"]
    pub bet_deadline: u64,     // block height
    pub resolve_deadline: u64,
    pub multisig_address: String,
    pub oracle_pubkey: String,
}

// Encrypted bet with serialized FHE values
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EncryptedBet {
    pub id: [u8; 32],           // SHA3-256(tx_id || output_index)
    pub outcome: Vec<u8>,        // Serialized FheUint8
    pub amount: Vec<u8>,         // Serialized FheUint64
    pub commitment: [u8; 32],    // For later claiming
    pub tx_proof: String,        // Monero tx hash
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlaintextBet {
    pub outcome: u8,
    pub amount: u64,
    pub nonce: [u8; 32],
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarketResult {
    pub winning_outcome: u8,
    pub total_pool: u64,
    pub total_winners: u64,
    pub total_losers: u64,
    pub oracle_signature: Vec<u8>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PayoutClaim {
    pub bet_id: [u8; 32],
    pub nonce: [u8; 32],        // Proves knowledge of bet
    pub payout_address: String,  // Monero address
}
