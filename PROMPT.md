# Building a Private Prediction Market on Monero with TFHE-rs

## Simplified Architecture
- **Coordinator**: Runs FHE computations, holds decryption key (trusted but can't steal)
- **Oracle**: Reports outcomes (trusted)
- **Monero Multisig**: 2-of-2 between Coordinator and Oracle (prevents theft)
- **TFHE**: Hides individual bets while computing fair payouts

Let's build it!

## Project Structure

```fish
# Create the project
cargo new monero-predict --bin
cd monero-predict

# Add dependencies
cargo add tfhe
cargo add tokio --features full
cargo add serde --features derive
cargo add serde_json
cargo add monero
cargo add sha3
cargo add anyhow
cargo add axum  # for the coordinator API
cargo add tower
cargo add tracing
cargo add tracing-subscriber
```

## Core Types

```rust
// src/types.rs
use serde::{Deserialize, Serialize};
use tfhe::{FheUint64, FheUint8};

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

#[derive(Debug, Clone)]
pub struct EncryptedBet {
    pub id: [u8; 32],           // SHA3-256(tx_id || output_index)
    pub outcome: FheUint8,       // Encrypted outcome choice
    pub amount: FheUint64,       // Encrypted amount in piconeros
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
```

## FHE Setup

```rust
// src/fhe.rs
use tfhe::{
    prelude::*,
    ConfigBuilder, ClientKey, ServerKey, CompressedServerKey,
    FheUint64, FheUint8, FheBool,
};
use serde::{Serialize, Deserialize};
use anyhow::Result;

pub struct FheContext {
    pub client_key: ClientKey,
    pub server_key: ServerKey,
}

impl FheContext {
    pub fn new() -> Result<Self> {
        // Use parameters suitable for financial calculations
        let config = ConfigBuilder::default()
            .use_custom_parameters(
                tfhe::shortint::parameters::PARAM_MESSAGE_2_CARRY_2_KS_PBS,
                None,
            )
            .build();
        
        let (client_key, server_key) = generate_keys(config);
        
        Ok(Self {
            client_key,
            server_key,
        })
    }
    
    pub fn export_server_key(&self) -> Result<Vec<u8>> {
        // Compress and serialize for sharing
        let compressed = CompressedServerKey::new(&self.server_key);
        bincode::serialize(&compressed).map_err(Into::into)
    }
}

pub struct PayoutCalculator {
    server_key: ServerKey,
}

impl PayoutCalculator {
    pub fn new(server_key: ServerKey) -> Self {
        set_server_key(server_key);
        Self { server_key }
    }
    
    pub fn compute_payouts(
        &self,
        bets: &[EncryptedBet],
        winning_outcome: u8,
    ) -> Result<Vec<FheUint64>> {
        // Set the server key for this thread
        set_server_key(self.server_key.clone());
        
        // First pass: calculate totals
        let mut total_winning_amount = FheUint64::try_encrypt_trivial(0u64)?;
        let mut total_pool = FheUint64::try_encrypt_trivial(0u64)?;
        
        let winner_value = FheUint8::try_encrypt_trivial(winning_outcome)?;
        
        for bet in bets {
            let is_winner: FheBool = bet.outcome.eq(&winner_value);
            let winning_contribution = is_winner.if_then_else(
                &bet.amount,
                &FheUint64::try_encrypt_trivial(0u64)?
            );
            
            total_winning_amount = &total_winning_amount + &winning_contribution;
            total_pool = &total_pool + &bet.amount;
        }
        
        // Second pass: calculate individual payouts
        let payouts = bets.iter().map(|bet| {
            let is_winner = bet.outcome.eq(&winner_value);
            
            // Proportional payout: (bet_amount / total_winning) * total_pool
            // To avoid division by zero in FHE, we do:
            // payout = (bet_amount * total_pool) / total_winning
            
            let numerator = &bet.amount * &total_pool;
            // FHE division is expensive but exact
            let payout = &numerator / &total_winning_amount;
            
            is_winner.if_then_else(
                &payout,
                &FheUint64::try_encrypt_trivial(0u64)?
            )
        }).collect::<Result<Vec<_>>>()?;
        
        Ok(payouts)
    }
}
```

## Coordinator Service

```rust
// src/coordinator.rs
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
};
use sha3::{Digest, Sha3_256};
use crate::types::*;
use crate::fhe::*;

pub struct CoordinatorState {
    markets: Arc<RwLock<HashMap<String, Market>>>,
    fhe_context: Arc<FheContext>,
}

pub struct Market {
    config: MarketConfig,
    bets: Vec<EncryptedBet>,
    result: Option<MarketResult>,
    payouts: Option<Vec<u64>>, // Decrypted payouts
}

impl CoordinatorState {
    pub fn new() -> Result<Self> {
        Ok(Self {
            markets: Arc::new(RwLock::new(HashMap::new())),
            fhe_context: Arc::new(FheContext::new()?),
        })
    }
    
    pub async fn create_market(&self, config: MarketConfig) -> Result<String> {
        let mut markets = self.markets.write().unwrap();
        let market = Market {
            config: config.clone(),
            bets: Vec::new(),
            result: None,
            payouts: None,
        };
        markets.insert(config.id.clone(), market);
        Ok(config.id)
    }
    
    pub async fn submit_bet(
        &self,
        market_id: String,
        encrypted_bet_data: Vec<u8>,
        tx_proof: String,
    ) -> Result<[u8; 32]> {
        // Verify Monero transaction exists and pays to multisig
        // (In production, would check via monero-rpc)
        
        // Deserialize encrypted bet
        let encrypted_bet: EncryptedBet = bincode::deserialize(&encrypted_bet_data)?;
        
        // Generate bet ID
        let mut hasher = Sha3_256::new();
        hasher.update(&tx_proof);
        hasher.update(&encrypted_bet.commitment);
        let bet_id: [u8; 32] = hasher.finalize().into();
        
        // Store bet
        let mut markets = self.markets.write().unwrap();
        let market = markets.get_mut(&market_id)
            .ok_or_else(|| anyhow::anyhow!("Market not found"))?;
        
        market.bets.push(EncryptedBet {
            id: bet_id,
            outcome: encrypted_bet.outcome,
            amount: encrypted_bet.amount,
            commitment: encrypted_bet.commitment,
            tx_proof,
        });
        
        Ok(bet_id)
    }
    
    pub async fn resolve_market(
        &self,
        market_id: String,
        winning_outcome: u8,
        oracle_signature: Vec<u8>,
    ) -> Result<MarketResult> {
        let mut markets = self.markets.write().unwrap();
        let market = markets.get_mut(&market_id)
            .ok_or_else(|| anyhow::anyhow!("Market not found"))?;
        
        // Verify oracle signature
        // (In production, would verify signature properly)
        
        // Compute payouts homomorphically
        let calculator = PayoutCalculator::new(self.fhe_context.server_key.clone());
        let encrypted_payouts = calculator.compute_payouts(&market.bets, winning_outcome)?;
        
        // Decrypt payouts (coordinator has the key in this simplified version)
        let mut total_pool = 0u64;
        let mut total_winners = 0u64;
        let mut decrypted_payouts = Vec::new();
        
        for (bet, encrypted_payout) in market.bets.iter().zip(encrypted_payouts.iter()) {
            let decrypted_amount: u64 = bet.amount.decrypt(&self.fhe_context.client_key);
            let decrypted_outcome: u8 = bet.outcome.decrypt(&self.fhe_context.client_key);
            let payout: u64 = encrypted_payout.decrypt(&self.fhe_context.client_key);
            
            total_pool += decrypted_amount;
            if decrypted_outcome == winning_outcome {
                total_winners += decrypted_amount;
            }
            
            decrypted_payouts.push(payout);
        }
        
        let result = MarketResult {
            winning_outcome,
            total_pool,
            total_winners,
            total_losers: total_pool - total_winners,
            oracle_signature,
        };
        
        market.result = Some(result.clone());
        market.payouts = Some(decrypted_payouts);
        
        Ok(result)
    }
    
    pub async fn claim_payout(
        &self,
        market_id: String,
        claim: PayoutClaim,
    ) -> Result<u64> {
        let markets = self.markets.read().unwrap();
        let market = markets.get(&market_id)
            .ok_or_else(|| anyhow::anyhow!("Market not found"))?;
        
        // Verify the claim
        let mut hasher = Sha3_256::new();
        hasher.update(&claim.nonce);
        let commitment: [u8; 32] = hasher.finalize().into();
        
        // Find the bet with matching commitment
        let (bet_index, _) = market.bets.iter()
            .enumerate()
            .find(|(_, bet)| bet.commitment == commitment)
            .ok_or_else(|| anyhow::anyhow!("Invalid claim"))?;
        
        // Get the payout amount
        let payout = market.payouts.as_ref()
            .and_then(|p| p.get(bet_index))
            .ok_or_else(|| anyhow::anyhow!("Market not resolved"))?;
        
        // In production: trigger Monero multisig payout here
        println!("Payout {} piconeros to {}", payout, claim.payout_address);
        
        Ok(*payout)
    }
}
```

## Client Library

```rust
// src/client.rs
use tfhe::{prelude::*, ClientKey, FheUint64, FheUint8};
use sha3::{Digest, Sha3_256};
use rand::RngCore;
use crate::types::*;

pub struct BettorClient {
    client_key: ClientKey,
}

impl BettorClient {
    pub fn new(client_key: ClientKey) -> Self {
        Self { client_key }
    }
    
    pub fn create_bet(
        &self,
        outcome: u8,
        amount: u64, // in piconeros
    ) -> Result<(Vec<u8>, [u8; 32], [u8; 32])> {
        // Generate nonce for later claiming
        let mut nonce = [0u8; 32];
        rand::thread_rng().fill_bytes(&mut nonce);
        
        // Create commitment H(nonce)
        let mut hasher = Sha3_256::new();
        hasher.update(&nonce);
        let commitment: [u8; 32] = hasher.finalize().into();
        
        // Encrypt the bet data
        let encrypted_outcome = FheUint8::encrypt(outcome, &self.client_key);
        let encrypted_amount = FheUint64::encrypt(amount, &self.client_key);
        
        let encrypted_bet = EncryptedBet {
            id: [0u8; 32], // Will be set by coordinator
            outcome: encrypted_outcome,
            amount: encrypted_amount,
            commitment,
            tx_proof: String::new(), // Will be set after Monero tx
        };
        
        let serialized = bincode::serialize(&encrypted_bet)?;
        
        Ok((serialized, commitment, nonce))
    }
}
```

## API Routes

```rust
// src/main.rs
use axum::{
    Router,
    routing::{get, post},
    extract::{Path, State},
    response::Json,
    http::StatusCode,
};
use std::sync::Arc;
use tower::ServiceBuilder;
use tracing_subscriber;

mod types;
mod fhe;
mod coordinator;
mod client;

use coordinator::CoordinatorState;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt::init();
    
    // Create coordinator state
    let state = Arc::new(CoordinatorState::new()?);
    
    // Build router
    let app = Router::new()
        // Market management
        .route("/market/create", post(create_market))
        .route("/market/:id/info", get(get_market_info))
        
        // Betting
        .route("/market/:id/bet", post(submit_bet))
        .route("/market/:id/bets", get(list_bets))
        
        // Resolution
        .route("/market/:id/resolve", post(resolve_market))
        .route("/market/:id/result", get(get_result))
        
        // Claims
        .route("/market/:id/claim", post(claim_payout))
        
        // FHE keys
        .route("/fhe/server_key", get(get_server_key))
        
        .with_state(state);
    
    // Start server
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080").await?;
    tracing::info!("Coordinator listening on http://127.0.0.1:8080");
    axum::serve(listener, app).await?;
    
    Ok(())
}

async fn create_market(
    State(state): State<Arc<CoordinatorState>>,
    Json(config): Json<MarketConfig>,
) -> Result<Json<String>, StatusCode> {
    state.create_market(config).await
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

async fn submit_bet(
    State(state): State<Arc<CoordinatorState>>,
    Path(market_id): Path<String>,
    Json(bet_data): Json<SubmitBetRequest>,
) -> Result<Json<SubmitBetResponse>, StatusCode> {
    let bet_id = state.submit_bet(
        market_id,
        bet_data.encrypted_bet,
        bet_data.tx_proof,
    ).await
        .map_err(|_| StatusCode::BAD_REQUEST)?;
    
    Ok(Json(SubmitBetResponse {
        bet_id: hex::encode(bet_id),
    }))
}

async fn resolve_market(
    State(state): State<Arc<CoordinatorState>>,
    Path(market_id): Path<String>,
    Json(resolution): Json<ResolveRequest>,
) -> Result<Json<MarketResult>, StatusCode> {
    state.resolve_market(
        market_id,
        resolution.winning_outcome,
        resolution.oracle_signature,
    ).await
        .map(Json)
        .map_err(|_| StatusCode::BAD_REQUEST)
}

async fn claim_payout(
    State(state): State<Arc<CoordinatorState>>,
    Path(market_id): Path<String>,
    Json(claim): Json<PayoutClaim>,
) -> Result<Json<PayoutResponse>, StatusCode> {
    let amount = state.claim_payout(market_id, claim).await
        .map_err(|_| StatusCode::BAD_REQUEST)?;
    
    Ok(Json(PayoutResponse {
        amount_piconeros: amount,
        status: "pending_multisig".to_string(),
    }))
}

// Request/Response types
#[derive(serde::Deserialize)]
struct SubmitBetRequest {
    encrypted_bet: Vec<u8>,
    tx_proof: String,
}

#[derive(serde::Serialize)]
struct SubmitBetResponse {
    bet_id: String,
}

#[derive(serde::Deserialize)]
struct ResolveRequest {
    winning_outcome: u8,
    oracle_signature: Vec<u8>,
}

#[derive(serde::Serialize)]
struct PayoutResponse {
    amount_piconeros: u64,
    status: String,
}
```

## CLI Client

```rust
// src/bin/bettor.rs
use monero_predict::{client::BettorClient, types::*};
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "monero-predict")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Place a bet
    Bet {
        #[arg(short, long)]
        market_id: String,
        
        #[arg(short, long)]
        outcome: String, // "YES" or "NO"
        
        #[arg(short, long)]
        amount: f64, // XMR amount
    },
    
    /// Claim winnings
    Claim {
        #[arg(short, long)]
        market_id: String,
        
        #[arg(short, long)]
        nonce_file: String,
        
        #[arg(short, long)]
        payout_address: String,
    },
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();
    
    match cli.command {
        Commands::Bet { market_id, outcome, amount } => {
            // Convert outcome to u8
            let outcome_value = match outcome.as_str() {
                "YES" => 0u8,
                "NO" => 1u8,
                _ => anyhow::bail!("Invalid outcome"),
            };
            
            // Convert XMR to piconeros
            let amount_piconeros = (amount * 1e12) as u64;
            
            // Load or generate FHE keys
            let client_key = load_or_generate_client_key()?;
            let client = BettorClient::new(client_key);
            
            // Create encrypted bet
            let (encrypted_bet, commitment, nonce) = 
                client.create_bet(outcome_value, amount_piconeros)?;
            
            // Save nonce for later claiming
            std::fs::write(
                format!("bet_{}.nonce", hex::encode(commitment)),
                nonce
            )?;
            
            // Send Monero transaction (simplified)
            println!("Send {} XMR to market multisig address", amount);
            println!("Transaction hash: <paste here>");
            let tx_hash = read_line()?;
            
            // Submit to coordinator
            let response = reqwest::Client::new()
                .post(format!("http://localhost:8080/market/{}/bet", market_id))
                .json(&serde_json::json!({
                    "encrypted_bet": base64::encode(&encrypted_bet),
                    "tx_proof": tx_hash,
                }))
                .send()
                .await?;
            
            let bet_id: String = response.json().await?;
            println!("Bet submitted! ID: {}", bet_id);
        }
        
        Commands::Claim { market_id, nonce_file, payout_address } => {
            // Load nonce
            let nonce = std::fs::read(nonce_file)?;
            
            // Submit claim
            let response = reqwest::Client::new()
                .post(format!("http://localhost:8080/market/{}/claim", market_id))
                .json(&PayoutClaim {
                    bet_id: [0u8; 32], // Not used in simplified version
                    nonce: nonce.try_into()?,
                    payout_address,
                })
                .send()
                .await?;
            
            let payout: PayoutResponse = response.json().await?;
            println!("Payout approved: {} piconeros", payout.amount_piconeros);
        }
    }
    
    Ok(())
}
```

## Testing the System

```fish
# Terminal 1: Start coordinator
cargo run --release

# Terminal 2: Create a market
curl -X POST http://localhost:8080/market/create \
  -H "Content-Type: application/json" \
  -d '{
    "id": "btc-100k-2025",
    "question": "Will BTC hit $100k by Jan 2025?",
    "outcomes": ["YES", "NO"],
    "bet_deadline": 1234567,
    "resolve_deadline": 2345678,
    "multisig_address": "monero:...",
    "oracle_pubkey": "..."
  }'

# Terminal 3: Place bets
cargo run --bin bettor -- bet \
  --market-id btc-100k-2025 \
  --outcome YES \
  --amount 10.5

cargo run --bin bettor -- bet \
  --market-id btc-100k-2025 \
  --outcome NO \
  --amount 5.0

# After oracle resolution
curl -X POST http://localhost:8080/market/btc-100k-2025/resolve \
  -H "Content-Type: application/json" \
  -d '{
    "winning_outcome": 0,
    "oracle_signature": "..."
  }'

# Claim winnings
cargo run --bin bettor -- claim \
  --market-id btc-100k-2025 \
  --nonce-file bet_xxx.nonce \
  --payout-address monero:...
```

