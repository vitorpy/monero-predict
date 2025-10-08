// src/bin/benchmark.rs
use monero_predict::fhe::{FheContext, PayoutCalculator};
use monero_predict::types::EncryptedBet;
use std::time::Instant;
use tfhe::prelude::*;
use tfhe::{FheUint8, FheUint64};

fn main() -> anyhow::Result<()> {
    println!("🔬 Monero Prediction Market - FHE Benchmarks");
    println!("============================================\n");

    // Get CPU info
    println!("Hardware Info:");
    if let Ok(info) = sys_info::cpu_num() {
        println!("  CPU Cores: {}", info);
    }
    if let Ok(info) = sys_info::cpu_speed() {
        println!("  CPU Speed: {} MHz", info);
    }
    println!();

    // Initialize FHE context
    println!("Initializing FHE context...");
    let start = Instant::now();
    let fhe_ctx = FheContext::new()?;
    println!("  ✓ FHE setup took: {:?}\n", start.elapsed());

    // Benchmark 1: Encrypting a single bet
    println!("📊 Benchmark 1: Encrypting a single bet");
    let iterations = 100;
    let mut encrypt_times = Vec::new();

    for _ in 0..iterations {
        let start = Instant::now();
        let outcome = FheUint8::encrypt(0u8, &fhe_ctx.client_key);
        let amount = FheUint64::encrypt(10_000_000_000_000u64, &fhe_ctx.client_key);
        encrypt_times.push(start.elapsed());

        // Keep them alive to prevent optimization
        drop(outcome);
        drop(amount);
    }

    let avg_encrypt = encrypt_times.iter().sum::<std::time::Duration>() / iterations as u32;
    println!("  Average time: {:?}", avg_encrypt);
    println!("  Min: {:?}", encrypt_times.iter().min().unwrap());
    println!("  Max: {:?}", encrypt_times.iter().max().unwrap());
    println!();

    // Benchmark 2: FHE payout computation per bet
    println!("📊 Benchmark 2: FHE payout computation (10 bets)");
    let num_bets = 10;
    let mut bets = Vec::new();

    // Create test bets
    for i in 0..num_bets {
        let outcome_val = if i % 2 == 0 { 0u8 } else { 1u8 };
        let amount_val = 1_000_000_000_000u64 * (i as u64 + 1);

        let outcome = FheUint8::encrypt(outcome_val, &fhe_ctx.client_key);
        let amount = FheUint64::encrypt(amount_val, &fhe_ctx.client_key);

        bets.push(EncryptedBet {
            id: [i as u8; 32],
            outcome: bincode::serialize(&outcome)?,
            amount: bincode::serialize(&amount)?,
            commitment: [i as u8; 32],
            tx_proof: format!("tx_{}", i),
        });
    }

    let calculator = PayoutCalculator::new(fhe_ctx.server_key.clone());
    let start = Instant::now();
    let _payouts = calculator.compute_payouts(&bets, 0)?;
    let total_time = start.elapsed();
    let per_bet = total_time / num_bets as u32;

    println!("  Total time for {} bets: {:?}", num_bets, total_time);
    println!("  Average per bet: {:?}", per_bet);
    println!();

    // Benchmark 3: Full market resolution (100 bets)
    println!("📊 Benchmark 3: Full market resolution (100 bets)");
    benchmark_market_resolution(&fhe_ctx, 100)?;
    println!();

    // Benchmark 4: Full market resolution (1,000 bets)
    println!("📊 Benchmark 4: Full market resolution (1,000 bets)");
    benchmark_market_resolution(&fhe_ctx, 1000)?;
    println!();

    // Benchmark 5: Full market resolution (10,000 bets) - Skipped by default
    println!("📊 Benchmark 5: Full market resolution (10,000 bets)");
    println!("  ⏭️  Skipped (would take 30-60 minutes)");
    println!("  To run: cargo run --release --bin benchmark --features large-bench");
    println!();

    println!("✅ Benchmarks complete!");

    Ok(())
}

fn benchmark_market_resolution(fhe_ctx: &FheContext, num_bets: usize) -> anyhow::Result<()> {
    println!("  Creating {} encrypted bets...", num_bets);
    let create_start = Instant::now();

    let mut bets = Vec::new();
    for i in 0..num_bets {
        let outcome_val = if i % 3 == 0 { 0u8 } else { 1u8 }; // ~33% YES, ~67% NO
        let amount_val = 1_000_000_000_000u64 + (i as u64 * 100_000_000); // Varying amounts

        let outcome = FheUint8::encrypt(outcome_val, &fhe_ctx.client_key);
        let amount = FheUint64::encrypt(amount_val, &fhe_ctx.client_key);

        bets.push(EncryptedBet {
            id: [(i % 256) as u8; 32],
            outcome: bincode::serialize(&outcome)?,
            amount: bincode::serialize(&amount)?,
            commitment: [(i % 256) as u8; 32],
            tx_proof: format!("tx_{}", i),
        });

        if (i + 1) % 1000 == 0 {
            println!("    Created {}/{} bets...", i + 1, num_bets);
        }
    }

    let create_time = create_start.elapsed();
    println!("    ✓ Bet creation: {:?}", create_time);

    println!("  Computing payouts with batch processing...");
    let batch_size = if num_bets > 5000 { 1000 } else { num_bets };
    println!("    Batch size: {} bets", batch_size);

    let calculator = PayoutCalculator::new(fhe_ctx.server_key.clone())
        .with_batch_size(batch_size);

    let compute_start = Instant::now();
    let _payouts = calculator.compute_payouts(&bets, 0)?;
    let compute_time = compute_start.elapsed();

    println!("    ✓ Payout computation: {:?}", compute_time);
    println!("    Per bet: {:?}", compute_time / num_bets as u32);
    println!("  Total time: {:?}", create_time + compute_time);

    Ok(())
}
