// src/types.rs
use serde::{Deserialize, Serialize};
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};

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

// API Response Types

#[derive(Debug, Serialize)]
pub struct ApiError {
    pub error: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<String>,
}

impl ApiError {
    pub fn new(error: impl Into<String>) -> Self {
        Self {
            error: error.into(),
            details: None,
        }
    }

    pub fn with_details(error: impl Into<String>, details: impl Into<String>) -> Self {
        Self {
            error: error.into(),
            details: Some(details.into()),
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let status = StatusCode::INTERNAL_SERVER_ERROR;
        (status, Json(self)).into_response()
    }
}

impl From<anyhow::Error> for ApiError {
    fn from(err: anyhow::Error) -> Self {
        ApiError::new(format!("Internal error: {}", err))
    }
}

#[derive(Debug, Serialize)]
pub struct MarketSummary {
    pub id: String,
    pub question: String,
    pub description: String,
    pub resolution_date: String,
    pub yes_pool: String,  // XMR format
    pub no_pool: String,   // XMR format
    pub status: String,    // "open" | "closed" | "resolved"
}

#[derive(Debug, Serialize)]
pub struct MarketStats {
    pub id: String,
    pub question: String,
    pub description: String,
    pub yes_pool: String,
    pub no_pool: String,
    pub total_bets: usize,
    pub status: String,
    pub resolution_date: String,
}

#[derive(Debug, Serialize)]
pub struct CoordinatorAddressResponse {
    pub address: String,
}

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: String,
    pub version: String,
}

// Utility Functions

/// Convert piconeros to XMR string (12 decimal places)
pub fn piconeros_to_xmr(piconeros: u64) -> String {
    let xmr = piconeros as f64 / 1e12;
    format!("{:.12}", xmr)
}
