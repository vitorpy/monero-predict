// src/bin/bettor.rs
use monero_predict::client::BettorClient;
use clap::{Parser, Subcommand};
use anyhow::Result;
use std::io::{self, Write};

#[derive(Parser)]
#[command(name = "monero-predict")]
#[command(about = "Private prediction market bettor CLI")]
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
async fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Bet { market_id, outcome, amount } => {
            place_bet(market_id, outcome, amount).await?;
        }

        Commands::Claim { market_id, nonce_file, payout_address } => {
            claim_payout(market_id, nonce_file, payout_address).await?;
        }
    }

    Ok(())
}

async fn place_bet(market_id: String, outcome: String, amount: f64) -> Result<()> {
    // Convert outcome to u8
    let outcome_value = match outcome.as_str() {
        "YES" => 0u8,
        "NO" => 1u8,
        _ => anyhow::bail!("Invalid outcome. Use YES or NO"),
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
    let nonce_filename = format!("bet_{}.nonce", hex::encode(commitment));
    std::fs::write(&nonce_filename, nonce)?;
    println!("✓ Nonce saved to: {}", nonce_filename);

    // Prompt for Monero transaction
    println!("\n📤 Send {} XMR to the market multisig address", amount);
    print!("Enter transaction hash: ");
    io::stdout().flush()?;
    let mut tx_hash = String::new();
    io::stdin().read_line(&mut tx_hash)?;
    let tx_hash = tx_hash.trim().to_string();

    // Submit to coordinator
    let client = reqwest::Client::new();
    let response = client
        .post(format!("http://localhost:8080/market/{}/bet", market_id))
        .json(&serde_json::json!({
            "encrypted_bet": encrypted_bet,
            "tx_proof": tx_hash,
        }))
        .send()
        .await?;

    if response.status().is_success() {
        let result: serde_json::Value = response.json().await?;
        println!("✓ Bet submitted successfully!");
        println!("  Bet ID: {}", result["bet_id"]);
        println!("  Keep your nonce file safe to claim winnings!");
    } else {
        anyhow::bail!("Failed to submit bet: {}", response.status());
    }

    Ok(())
}

async fn claim_payout(market_id: String, nonce_file: String, payout_address: String) -> Result<()> {
    // Load nonce
    let nonce_bytes = std::fs::read(&nonce_file)?;
    let nonce: [u8; 32] = nonce_bytes.try_into()
        .map_err(|_| anyhow::anyhow!("Invalid nonce file"))?;

    // Submit claim
    let client = reqwest::Client::new();
    let bet_id = [0u8; 32];
    let response = client
        .post(format!("http://localhost:8080/market/{}/claim", market_id))
        .json(&serde_json::json!({
            "bet_id": bet_id,
            "nonce": nonce,
            "payout_address": payout_address,
        }))
        .send()
        .await?;

    if response.status().is_success() {
        let result: serde_json::Value = response.json().await?;
        let amount_piconeros = result["amount_piconeros"].as_u64().unwrap_or(0);
        let amount_xmr = amount_piconeros as f64 / 1e12;

        println!("✓ Payout approved!");
        println!("  Amount: {} XMR ({} piconeros)", amount_xmr, amount_piconeros);
        println!("  Status: {}", result["status"]);
        println!("  Address: {}", payout_address);
    } else {
        anyhow::bail!("Failed to claim payout: {}", response.status());
    }

    Ok(())
}

fn load_or_generate_client_key() -> Result<tfhe::ClientKey> {
    use tfhe::ConfigBuilder;

    let key_path = "client_key.bin";

    // Try to load existing key
    if let Ok(key_bytes) = std::fs::read(key_path) {
        println!("Loading existing FHE client key...");
        return Ok(bincode::deserialize(&key_bytes)?);
    }

    // Generate new key
    println!("Generating new FHE client key (this may take a moment)...");
    let config = ConfigBuilder::default().build();
    let (client_key, _server_key) = tfhe::generate_keys(config);

    // Save for future use
    let key_bytes = bincode::serialize(&client_key)?;
    std::fs::write(key_path, key_bytes)?;
    println!("✓ Client key saved to: {}", key_path);

    Ok(client_key)
}
