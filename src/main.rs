// src/main.rs
use axum::{
    Router,
    routing::{get, post},
    extract::{Path, State},
    response::Json,
    http::StatusCode,
};
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

    // Build router
    let app = Router::new()
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

        // Shutdown
        .route("/exit", post(shutdown_server))

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
) -> Result<Json<String>, StatusCode> {
    state.coordinator.create_market(config).await
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

async fn get_market_info(
    State(state): State<AppState>,
    Path(market_id): Path<String>,
) -> Result<Json<MarketConfig>, StatusCode> {
    let markets = state.coordinator.markets.read().unwrap();
    let market = markets.get(&market_id)
        .ok_or(StatusCode::NOT_FOUND)?;
    Ok(Json(market.config.clone()))
}

async fn submit_bet(
    State(state): State<AppState>,
    Path(market_id): Path<String>,
    Json(bet_data): Json<SubmitBetRequest>,
) -> Result<Json<SubmitBetResponse>, StatusCode> {
    let bet_id = state.coordinator.submit_bet(
        market_id,
        bet_data.encrypted_bet,
        bet_data.tx_proof,
    ).await
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    Ok(Json(SubmitBetResponse {
        bet_id: hex::encode(bet_id),
    }))
}

async fn list_bets(
    State(state): State<AppState>,
    Path(market_id): Path<String>,
) -> Result<Json<BetsListResponse>, StatusCode> {
    let markets = state.coordinator.markets.read().unwrap();
    let market = markets.get(&market_id)
        .ok_or(StatusCode::NOT_FOUND)?;
    Ok(Json(BetsListResponse {
        count: market.bets.len(),
    }))
}

async fn resolve_market(
    State(state): State<AppState>,
    Path(market_id): Path<String>,
    Json(resolution): Json<ResolveRequest>,
) -> Result<Json<MarketResult>, StatusCode> {
    state.coordinator.resolve_market(
        market_id,
        resolution.winning_outcome,
        resolution.oracle_signature,
    ).await
        .map(Json)
        .map_err(|_| StatusCode::BAD_REQUEST)
}

async fn get_result(
    State(state): State<AppState>,
    Path(market_id): Path<String>,
) -> Result<Json<MarketResult>, StatusCode> {
    let markets = state.coordinator.markets.read().unwrap();
    let market = markets.get(&market_id)
        .ok_or(StatusCode::NOT_FOUND)?;
    market.result.clone()
        .ok_or(StatusCode::NOT_FOUND)
        .map(Json)
}

async fn claim_payout(
    State(state): State<AppState>,
    Path(market_id): Path<String>,
    Json(claim): Json<PayoutClaim>,
) -> Result<Json<PayoutResponse>, StatusCode> {
    let amount = state.coordinator.claim_payout(market_id, claim).await
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    Ok(Json(PayoutResponse {
        amount_piconeros: amount,
        status: "pending_multisig".to_string(),
    }))
}

async fn get_server_key(
    State(state): State<AppState>,
) -> Result<Json<ServerKeyResponse>, StatusCode> {
    use base64::Engine;
    let server_key_bytes = state.coordinator.fhe_context.export_server_key()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
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
