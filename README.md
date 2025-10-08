# Monero Private Prediction Market

A privacy-preserving prediction market built with TFHE (Fully Homomorphic Encryption) and Monero multisig.

## Features

- 🔒 **Private Betting**: Bets are encrypted using FHE - individual amounts and choices remain private
- 🧮 **Fair Payouts**: Homomorphic computation ensures fair payout distribution without revealing individual bets
- 💰 **Monero Integration**: Designed to use Monero multisig for trustless fund custody
- 🔐 **Cryptographic Claims**: Commitment-based system allows only legitimate winners to claim payouts
- 🚀 **High-Level API**: Easy-to-use REST API and CLI tools

## Architecture

```
┌─────────┐         ┌──────────────┐         ┌────────┐
│ Bettor  │ ◄─────► │  Coordinator │ ◄─────► │ Oracle │
└─────────┘         └──────────────┘         └────────┘
     │                      │                      │
     │                      │                      │
     ▼                      ▼                      ▼
[FHE Keys]          [Computes Payouts]     [Signs Results]
                    [Holds FHE Keys]
                           │
                           ▼
                  [Monero Multisig 2-of-2]
```

## Quick Start

### 1. Build the Project

```bash
cargo build --release
```

### 2. Quick API Test (Works Out of the Box)

**Terminal 1:**
```bash
cargo run --release --bin monero-predict
```

**Terminal 2:**
```bash
./test_market.sh
```

### 4. Manual Testing

See [TESTING.md](TESTING.md) for detailed testing guide.

## CLI Usage

### Place a Bet

```bash
cargo run --bin bettor -- bet \
  --market-id btc-100k-2025 \
  --outcome YES \
  --amount 10.5
```

This will:
1. Generate/load FHE client keys
2. Encrypt your bet (outcome + amount)
3. Save a nonce file for claiming later
4. Submit the encrypted bet to the coordinator

### Claim Winnings

```bash
cargo run --bin bettor -- claim \
  --market-id btc-100k-2025 \
  --nonce-file bet_<commitment>.nonce \
  --payout-address monero:your_address
```

## API Endpoints

### Market Management

- `POST /market/create` - Create a new prediction market
- `GET /market/:id/info` - Get market information

### Betting

- `POST /market/:id/bet` - Submit an encrypted bet
- `GET /market/:id/bets` - Get bet count

### Resolution

- `POST /market/:id/resolve` - Resolve market with oracle signature
- `GET /market/:id/result` - Get market result

### Claims

- `POST /market/:id/claim` - Claim payout with commitment proof

### FHE Keys

- `GET /fhe/server_key` - Get compressed server key for verification

## Project Structure

```
src/
├── lib.rs              # Library exports
├── main.rs             # Axum server
├── types.rs            # Core data structures
├── fhe.rs              # FHE context and payout calculator
├── client.rs           # Bettor client
├── coordinator.rs      # Market coordination logic
└── bin/
    └── bettor.rs       # CLI tool
```

## How It Works

### 1. Bet Placement

1. Bettor generates FHE client keys
2. Encrypts outcome (0 for YES, 1 for NO) and amount (in piconeros)
3. Creates commitment: `H(nonce)`
4. Sends Monero to market multisig address
5. Submits encrypted bet + tx proof to coordinator

### 2. Market Resolution

1. Oracle determines the winning outcome
2. Signs the result
3. Coordinator receives oracle signature
4. Computes payouts homomorphically:
   - Total pool = sum of all bets
   - Total winning = sum of winning bets
   - Individual payout = (bet_amount / total_winning) * total_pool
5. All computations happen on encrypted data!

### 3. Payout Claims

1. Winner reveals their nonce
2. Coordinator verifies: `H(nonce) == commitment`
3. Coordinator checks bet outcome matches winning outcome
4. Triggers Monero multisig payout

## Security Model

### Trust Assumptions

- **Coordinator**: Trusted to compute correctly but cannot steal funds (multisig)
- **Oracle**: Trusted to report accurate outcomes
- **Monero Multisig**: 2-of-2 between Coordinator and Oracle prevents unilateral fund access

### Privacy Guarantees

- ✅ Individual bet amounts are hidden
- ✅ Individual outcome choices are hidden
- ✅ Only aggregate statistics revealed (total pool, total winners)
- ✅ Winners can claim anonymously with commitment proof

### Limitations

- Coordinator knows the decryption key (simplified version)
- No prevention of Coordinator revealing bets (would need threshold FHE)
- Oracle is trusted (could use multiple oracles + voting)

## Future Enhancements

- [ ] Threshold FHE to distribute decryption key
- [ ] Multi-oracle system with dispute resolution
- [ ] Actual Monero wallet integration (currently mock)
- [ ] Web frontend
- [ ] Support for multiple outcomes (not just YES/NO)
- [ ] Automated market maker (AMM) for dynamic odds
- [ ] Zero-knowledge proofs for enhanced privacy

## Development

### Run Tests

```bash
cargo test
```

### Build Documentation

```bash
cargo doc --open
```

### Check Code

```bash
cargo clippy
cargo fmt
```

## Dependencies

- **tfhe** - Fully homomorphic encryption
- **axum** - Web framework
- **tokio** - Async runtime
- **monero** - Monero library
- **sha3** - Cryptographic hashing
- **clap** - CLI argument parsing

## License

This is a research/educational project. See [PROMPT.md](PROMPT.md) for the original specification.

## Contributing

This project demonstrates FHE-based privacy for prediction markets. Contributions welcome for:

- Additional privacy features
- Better Monero integration
- UI/UX improvements
- Documentation
- Test coverage

## Resources

- [TFHE-rs Documentation](https://docs.zama.ai/tfhe-rs)
- [Monero Documentation](https://www.getmonero.org/resources/developer-guides/)
- [Testing Guide](TESTING.md)
