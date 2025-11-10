// src/main.rs
use axum::{
    Router,
    routing::{get, post},
    extract::{Path, State},
    response::Json,
    http::{StatusCode, Method, header::{CONTENT_TYPE, AUTHORIZATION}},
};
use tower_http::cors::CorsLayer;
use std::sync::Arc;
use tokio::sync::RwLock;

use monero_predict::coordinator::CoordinatorState;
use monero_predict::types::*;

#[derive(Clone)]
struct AppState {
    coordinator: Arc<CoordinatorState>,
    shutdown_tx: Arc<RwLock<Option<tokio::sync::oneshot::Sender<()>>>>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt::init();

    // Create coordinator state
    let coordinator = Arc::new(CoordinatorState::new()?);

    // Create shutdown channel
    let (shutdown_tx, shutdown_rx) = tokio::sync::oneshot::channel::<()>();

    let app_state = AppState {
        coordinator,
        shutdown_tx: Arc::new(RwLock::new(Some(shutdown_tx))),
    };

    // Configure CORS for web client
    let cors = CorsLayer::new()
        .allow_origin(["http://localhost:5173".parse().unwrap()])
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([CONTENT_TYPE, AUTHORIZATION]);

    // Build API routes
    let api_routes = Router::new()
        // New endpoints
        .route("/health", get(health_check))
        .route("/markets", get(list_markets))
        .route("/market/{id}/stats", get(get_market_stats))
        .route("/coordinator/address", get(get_coordinator_address))

        // Market management
        .route("/market/create", post(create_market))
        .route("/market/{id}/info", get(get_market_info))

        // Betting
        .route("/market/{id}/bet", post(submit_bet))
        .route("/market/{id}/bets", get(list_bets))

        // Resolution
        .route("/market/{id}/resolve", post(resolve_market))
        .route("/market/{id}/result", get(get_result))

        // Claims
        .route("/market/{id}/claim", post(claim_payout))

        // FHE keys
        .route("/fhe/server_key", get(get_server_key))

        .with_state(app_state.clone());

    // Build main app with /api prefix
    let app = Router::new()
        .nest("/api", api_routes)
        // Shutdown endpoint (not under /api)
        .route("/exit", post(shutdown_server))
        .layer(cors)
        .with_state(app_state);

    // Start server with graceful shutdown
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080").await?;
    tracing::info!("Coordinator listening on http://127.0.0.1:8080");

    axum::serve(listener, app)
        .with_graceful_shutdown(async {
            shutdown_rx.await.ok();
        })
        .await?;

    Ok(())
}

async fn create_market(
    State(state): State<AppState>,
    Json(config): Json<MarketConfig>,
) -> Result<Json<String>, ApiError> {
    state.coordinator.create_market(config).await
        .map(Json)
        .map_err(|e| ApiError::from(e))
}

async fn get_market_info(
    State(state): State<AppState>,
    Path(market_id): Path<String>,
) -> Result<Json<MarketConfig>, ApiError> {
    let markets = state.coordinator.markets.read().unwrap();
    let market = markets.get(&market_id)
        .ok_or_else(|| ApiError::new("Market not found"))?;
    Ok(Json(market.config.clone()))
}

async fn submit_bet(
    State(state): State<AppState>,
    Path(market_id): Path<String>,
    Json(bet_data): Json<SubmitBetRequest>,
) -> Result<Json<SubmitBetResponse>, ApiError> {
    // Convert web client format to EncryptedBet
    let encrypted_bet = EncryptedBet {
        id: [0u8; 32], // Will be overwritten by coordinator
        outcome: bet_data.encrypted_outcome,
        amount: bet_data.encrypted_amount,
        commitment: hex::decode(&bet_data.commitment)
            .map_err(|e| ApiError::with_details("Invalid commitment hex", e.to_string()))?
            .try_into()
            .map_err(|_| ApiError::new("Commitment must be 32 bytes"))?,
        tx_proof: bet_data.tx_hash.clone(),
    };

    // Serialize for coordinator
    let encrypted_bet_data = bincode::serialize(&encrypted_bet)
        .map_err(|e| ApiError::with_details("Failed to serialize bet", e.to_string()))?;

    // Submit to coordinator
    let bet_id = state.coordinator.submit_bet(
        market_id,
        encrypted_bet_data,
        bet_data.tx_hash,
    ).await
        .map_err(|e| ApiError::from(e))?;

    Ok(Json(SubmitBetResponse {
        bet_id: hex::encode(bet_id),
    }))
}

async fn list_bets(
    State(state): State<AppState>,
    Path(market_id): Path<String>,
) -> Result<Json<BetsListResponse>, ApiError> {
    let markets = state.coordinator.markets.read().unwrap();
    let market = markets.get(&market_id)
        .ok_or_else(|| ApiError::new("Market not found"))?;
    Ok(Json(BetsListResponse {
        count: market.bets.len(),
    }))
}

async fn resolve_market(
    State(state): State<AppState>,
    Path(market_id): Path<String>,
    Json(resolution): Json<ResolveRequest>,
) -> Result<Json<MarketResult>, ApiError> {
    state.coordinator.resolve_market(
        market_id,
        resolution.winning_outcome,
        resolution.oracle_signature,
    ).await
        .map(Json)
        .map_err(|e| ApiError::from(e))
}

async fn get_result(
    State(state): State<AppState>,
    Path(market_id): Path<String>,
) -> Result<Json<MarketResult>, ApiError> {
    let markets = state.coordinator.markets.read().unwrap();
    let market = markets.get(&market_id)
        .ok_or_else(|| ApiError::new("Market not found"))?;
    market.result.clone()
        .ok_or_else(|| ApiError::new("Market not yet resolved"))
        .map(Json)
}

async fn claim_payout(
    State(state): State<AppState>,
    Path(market_id): Path<String>,
    Json(claim): Json<PayoutClaim>,
) -> Result<Json<PayoutResponse>, ApiError> {
    let amount = state.coordinator.claim_payout(market_id, claim).await
        .map_err(|e| ApiError::from(e))?;

    Ok(Json(PayoutResponse {
        amount_piconeros: amount,
        status: "pending_multisig".to_string(),
    }))
}

async fn get_server_key(
    State(state): State<AppState>,
) -> Result<Json<ServerKeyResponse>, ApiError> {
    use base64::Engine;
    let server_key_bytes = state.coordinator.fhe_context.export_server_key()
        .map_err(|e| ApiError::with_details("Failed to export server key", e.to_string()))?;
    Ok(Json(ServerKeyResponse {
        server_key: base64::engine::general_purpose::STANDARD.encode(&server_key_bytes),
    }))
}

async fn shutdown_server(
    State(state): State<AppState>,
) -> Result<Json<String>, StatusCode> {
    tracing::info!("Shutdown requested via /exit endpoint");

    let mut tx_lock = state.shutdown_tx.write().await;
    if let Some(tx) = tx_lock.take() {
        let _ = tx.send(());
        Ok(Json("Shutting down...".to_string()))
    } else {
        Err(StatusCode::CONFLICT)
    }
}

// New API endpoints

async fn health_check() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

async fn get_coordinator_address(
    State(state): State<AppState>,
) -> Result<Json<CoordinatorAddressResponse>, ApiError> {
    // Get coordinator address from first market config, or use default
    let markets = state.coordinator.markets.read().unwrap();
    let address = markets.values().next()
        .map(|m| m.config.multisig_address.clone())
        .unwrap_or_else(|| "4...".to_string()); // Placeholder

    Ok(Json(CoordinatorAddressResponse { address }))
}

async fn list_markets(
    State(state): State<AppState>,
) -> Result<Json<Vec<MarketSummary>>, ApiError> {
    let markets = state.coordinator.markets.read().unwrap();

    let mut summaries = Vec::new();
    for market in markets.values() {
        // Compute pool statistics (Option A: Decrypt for MVP)
        let (yes_pool, no_pool) = compute_market_pools(&market, &state.coordinator)?;

        // Determine market status
        let status = if market.result.is_some() {
            "resolved"
        } else {
            "open" // TODO: Check bet_deadline for "closed"
        };

        summaries.push(MarketSummary {
            id: market.config.id.clone(),
            question: market.config.question.clone(),
            description: format!("{} outcomes", market.config.outcomes.len()),
            resolution_date: market.config.resolve_deadline.to_string(),
            yes_pool: piconeros_to_xmr(yes_pool),
            no_pool: piconeros_to_xmr(no_pool),
            status: status.to_string(),
        });
    }

    Ok(Json(summaries))
}

async fn get_market_stats(
    State(state): State<AppState>,
    Path(market_id): Path<String>,
) -> Result<Json<MarketStats>, ApiError> {
    let markets = state.coordinator.markets.read().unwrap();
    let market = markets.get(&market_id)
        .ok_or_else(|| ApiError::new("Market not found"))?;

    let (yes_pool, no_pool) = compute_market_pools(&market, &state.coordinator)?;

    let status = if market.result.is_some() {
        "resolved"
    } else {
        "open"
    };

    Ok(Json(MarketStats {
        id: market.config.id.clone(),
        question: market.config.question.clone(),
        description: format!("{} bets placed", market.bets.len()),
        yes_pool: piconeros_to_xmr(yes_pool),
        no_pool: piconeros_to_xmr(no_pool),
        total_bets: market.bets.len(),
        status: status.to_string(),
        resolution_date: market.config.resolve_deadline.to_string(),
    }))
}

// Helper function to compute market pools
fn compute_market_pools(
    market: &monero_predict::coordinator::Market,
    coordinator: &CoordinatorState,
) -> Result<(u64, u64), ApiError> {
    use tfhe::{FheUint8, FheUint64};
    use tfhe::prelude::*;

    let mut yes_pool: u64 = 0;
    let mut no_pool: u64 = 0;

    for encrypted_bet in &market.bets {
        // Decrypt outcome (0 = YES, 1 = NO)
        let outcome_encrypted: FheUint8 = bincode::deserialize(&encrypted_bet.outcome)
            .map_err(|e| ApiError::with_details("Failed to deserialize outcome", e.to_string()))?;

        let outcome: u8 = outcome_encrypted.decrypt(&coordinator.fhe_context.client_key);

        // Decrypt amount
        let amount_encrypted: FheUint64 = bincode::deserialize(&encrypted_bet.amount)
            .map_err(|e| ApiError::with_details("Failed to deserialize amount", e.to_string()))?;

        let amount: u64 = amount_encrypted.decrypt(&coordinator.fhe_context.client_key);

        // Add to appropriate pool
        if outcome == 0 {
            yes_pool += amount;
        } else {
            no_pool += amount;
        }
    }

    Ok((yes_pool, no_pool))
}

// Request/Response types
#[derive(serde::Deserialize)]
struct SubmitBetRequest {
    encrypted_outcome: Vec<u8>,
    encrypted_amount: Vec<u8>,
    commitment: String,  // Hex string
    tx_hash: String,
    #[serde(default)]
    server_key: Option<Vec<u8>>,  // Optional server key upload
}

#[derive(serde::Serialize)]
struct SubmitBetResponse {
    bet_id: String,
}

#[derive(serde::Serialize)]
struct BetsListResponse {
    count: usize,
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

#[derive(serde::Serialize)]
struct ServerKeyResponse {
    server_key: String,
}
