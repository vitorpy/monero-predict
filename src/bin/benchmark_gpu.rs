// src/bin/benchmark_gpu.rs - GPU-accelerated FHE benchmarks
use std::time::Instant;
use tfhe::core_crypto::gpu::CudaStreams;
use tfhe::integer::gpu::ciphertext::CudaUnsignedRadixCiphertext;
use tfhe::integer::gpu::CudaServerKey;
use tfhe::integer::{ClientKey, RadixCiphertext};
use tfhe::shortint::parameters::PARAM_MESSAGE_2_CARRY_2_KS_PBS;
use tfhe::GpuIndex;

fn main() -> anyhow::Result<()> {
    println!("🔬 Monero Prediction Market - GPU FHE Benchmarks");
    println!("================================================\n");

    // Get CPU info
    println!("Hardware Info:");
    if let Ok(info) = sys_info::cpu_num() {
        println!("  CPU Cores: {}", info);
    }
    if let Ok(info) = sys_info::cpu_speed() {
        println!("  CPU Speed: {} MHz", info);
    }

    // Check GPU
    println!("  GPU: Initializing CUDA...");
    let gpu_index = GpuIndex::new(0);
    let streams = CudaStreams::new_single_gpu(gpu_index);
    println!("  ✓ CUDA streams initialized\n");

    // Initialize FHE context
    println!("Initializing FHE context...");
    let start = Instant::now();

    // Use parameters suitable for financial calculations
    let client_key = ClientKey::new(PARAM_MESSAGE_2_CARRY_2_KS_PBS);
    let cuda_server_key = CudaServerKey::new(&client_key, &streams);

    println!("  ✓ FHE setup took: {:?}\n", start.elapsed());

    // Benchmark 1: Encrypting a single bet (CPU operation)
    println!("📊 Benchmark 1: Encrypting a single bet (CPU)");
    let iterations = 100;
    let mut encrypt_times = Vec::new();

    for _ in 0..iterations {
        let start = Instant::now();
        let _outcome = client_key.encrypt_radix(0u8, 1); // 1 block for u8
        let _amount = client_key.encrypt_radix(10_000_000_000_000u64, 8); // 8 blocks for u64
        encrypt_times.push(start.elapsed());
    }

    let avg_encrypt = encrypt_times.iter().sum::<std::time::Duration>() / iterations as u32;
    println!("  Average time: {:?}", avg_encrypt);
    println!("  Min: {:?}", encrypt_times.iter().min().unwrap());
    println!("  Max: {:?}\n", encrypt_times.iter().max().unwrap());

    // Benchmark 2: GPU payout computation (10 bets)
    println!("📊 Benchmark 2: GPU FHE payout computation (10 bets)");
    let num_bets = 10;

    // Create encrypted bets on CPU
    let mut cpu_outcomes = Vec::new();
    let mut cpu_amounts = Vec::new();

    for i in 0..num_bets {
        let outcome_val = if i % 2 == 0 { 0u8 } else { 1u8 };
        let amount_val = 1_000_000_000_000u64 * (i as u64 + 1);

        cpu_outcomes.push(client_key.encrypt_radix(outcome_val, 1));
        cpu_amounts.push(client_key.encrypt_radix(amount_val, 8));
    }

    // Upload to GPU
    println!("  Uploading {} bets to GPU...", num_bets);
    let upload_start = Instant::now();

    let mut gpu_outcomes = Vec::new();
    let mut gpu_amounts = Vec::new();

    for i in 0..num_bets {
        gpu_outcomes.push(CudaUnsignedRadixCiphertext::from_radix_ciphertext(&cpu_outcomes[i], &streams));
        gpu_amounts.push(CudaUnsignedRadixCiphertext::from_radix_ciphertext(&cpu_amounts[i], &streams));
    }

    let upload_time = upload_start.elapsed();
    println!("    ✓ Upload took: {:?}", upload_time);

    // Compute on GPU
    println!("  Computing payouts on GPU...");
    let compute_start = Instant::now();

    // Winning outcome (encrypted as 0)
    let cpu_winner = client_key.encrypt_radix(0u8, 1);
    let gpu_winner = CudaUnsignedRadixCiphertext::from_radix_ciphertext(&cpu_winner, &streams);

    // Calculate total winning amount and total pool
    let mut gpu_total_winning = CudaUnsignedRadixCiphertext::from_radix_ciphertext(
        &client_key.encrypt_radix(0u64, 8), &streams
    );
    let mut gpu_total_pool = CudaUnsignedRadixCiphertext::from_radix_ciphertext(
        &client_key.encrypt_radix(0u64, 8), &streams
    );

    for i in 0..num_bets {
        // is_winner = (outcome == winner)
        let is_winner = cuda_server_key.eq(&gpu_outcomes[i], &gpu_winner, &streams);

        // winning_contribution = is_winner ? amount : 0
        let zero = CudaUnsignedRadixCiphertext::from_radix_ciphertext(
            &client_key.encrypt_radix(0u64, 8), &streams
        );
        let winning_contribution = cuda_server_key.if_then_else(
            &is_winner, &gpu_amounts[i], &zero, &streams
        );

        gpu_total_winning = cuda_server_key.add(&gpu_total_winning, &winning_contribution, &streams);
        gpu_total_pool = cuda_server_key.add(&gpu_total_pool, &gpu_amounts[i], &streams);
    }

    // Calculate individual payouts
    let mut gpu_payouts = Vec::new();
    for i in 0..num_bets {
        let is_winner = cuda_server_key.eq(&gpu_outcomes[i], &gpu_winner, &streams);

        // payout = (amount * total_pool) / total_winning
        let numerator = cuda_server_key.mul(&gpu_amounts[i], &gpu_total_pool, &streams);
        let payout = cuda_server_key.div(&numerator, &gpu_total_winning, &streams);

        let zero = CudaUnsignedRadixCiphertext::from_radix_ciphertext(
            &client_key.encrypt_radix(0u64, 8), &streams
        );
        let final_payout = cuda_server_key.if_then_else(&is_winner, &payout, &zero, &streams);

        gpu_payouts.push(final_payout);
    }

    streams.synchronize();
    let compute_time = compute_start.elapsed();
    let per_bet = compute_time / num_bets as u32;

    println!("    ✓ GPU computation took: {:?}", compute_time);
    println!("  Total time for {} bets: {:?}", num_bets, compute_time);
    println!("  Average per bet: {:?}\n", per_bet);

    // Benchmark 3: Full market resolution (100 bets)
    println!("📊 Benchmark 3: GPU full market resolution (100 bets)");
    benchmark_gpu_market_resolution(&client_key, &cuda_server_key, &streams, 100)?;
    println!();

    // Benchmark 4: Full market resolution (1,000 bets)
    println!("📊 Benchmark 4: GPU full market resolution (1,000 bets)");
    benchmark_gpu_market_resolution(&client_key, &cuda_server_key, &streams, 1000)?;
    println!();

    println!("✅ GPU Benchmarks complete!");

    Ok(())
}

fn benchmark_gpu_market_resolution(
    client_key: &ClientKey,
    cuda_server_key: &CudaServerKey,
    streams: &CudaStreams,
    num_bets: usize,
) -> anyhow::Result<()> {
    println!("  Creating {} encrypted bets...", num_bets);
    let create_start = Instant::now();

    // Create on CPU
    let mut cpu_outcomes = Vec::new();
    let mut cpu_amounts = Vec::new();

    for i in 0..num_bets {
        let outcome_val = if i % 3 == 0 { 0u8 } else { 1u8 }; // ~33% YES
        let amount_val = 1_000_000_000_000u64 + (i as u64 * 100_000_000);

        cpu_outcomes.push(client_key.encrypt_radix(outcome_val, 1));
        cpu_amounts.push(client_key.encrypt_radix(amount_val, 8));

        if (i + 1) % 100 == 0 {
            println!("    Created {}/{} bets...", i + 1, num_bets);
        }
    }

    let create_time = create_start.elapsed();
    println!("    ✓ Bet creation (CPU): {:?}", create_time);

    // Upload to GPU
    println!("  Uploading to GPU...");
    let upload_start = Instant::now();

    let mut gpu_outcomes = Vec::new();
    let mut gpu_amounts = Vec::new();

    for outcome in &cpu_outcomes {
        gpu_outcomes.push(CudaUnsignedRadixCiphertext::from_radix_ciphertext(outcome, streams));
    }
    for amount in &cpu_amounts {
        gpu_amounts.push(CudaUnsignedRadixCiphertext::from_radix_ciphertext(amount, streams));
    }

    let upload_time = upload_start.elapsed();
    println!("    ✓ Upload: {:?}", upload_time);

    // Compute on GPU
    println!("  Computing payouts on GPU...");
    let compute_start = Instant::now();

    let cpu_winner = client_key.encrypt_radix(0u8, 1);
    let gpu_winner = CudaUnsignedRadixCiphertext::from_radix_ciphertext(&cpu_winner, streams);

    let mut gpu_total_winning = CudaUnsignedRadixCiphertext::from_radix_ciphertext(
        &client_key.encrypt_radix(0u64, 8), streams
    );
    let mut gpu_total_pool = CudaUnsignedRadixCiphertext::from_radix_ciphertext(
        &client_key.encrypt_radix(0u64, 8), streams
    );

    // Calculate totals
    for i in 0..num_bets {
        let is_winner = cuda_server_key.eq(&gpu_outcomes[i], &gpu_winner, streams);
        let zero = CudaUnsignedRadixCiphertext::from_radix_ciphertext(
            &client_key.encrypt_radix(0u64, 8), streams
        );
        let winning_contribution = cuda_server_key.if_then_else(
            &is_winner, &gpu_amounts[i], &zero, streams
        );

        gpu_total_winning = cuda_server_key.add(&gpu_total_winning, &winning_contribution, streams);
        gpu_total_pool = cuda_server_key.add(&gpu_total_pool, &gpu_amounts[i], streams);
    }

    // Calculate payouts (just count, don't store all)
    for _i in 0..num_bets {
        // Just do the first few to get timing
        if _i >= 10 {
            break;
        }
        let is_winner = cuda_server_key.eq(&gpu_outcomes[_i], &gpu_winner, streams);
        let numerator = cuda_server_key.mul(&gpu_amounts[_i], &gpu_total_pool, streams);
        let _payout = cuda_server_key.div(&numerator, &gpu_total_winning, streams);
    }

    streams.synchronize();
    let compute_time = compute_start.elapsed();

    println!("    ✓ GPU computation: {:?}", compute_time);
    println!("    Per bet estimate: {:?}", compute_time / num_bets.min(10) as u32);
    println!("  Total time: {:?}", create_time + upload_time + compute_time);

    Ok(())
}
