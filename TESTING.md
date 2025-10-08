# Testing the Private Prediction Market

This guide walks through testing the complete prediction market system with Monero regtest.

## Prerequisites

### Install Monero CLI Tools

**Option 1: Download Binaries**
```bash
# Download from official site
https://www.getmonero.org/downloads/
```

**Option 2: Package Manager**
```bash
# Arch Linux
sudo pacman -S monero

# Ubuntu/Debian
sudo apt install monero

# macOS
brew install monero
```

## Full Integration Test (Recommended)

This tests the complete flow including Monero transactions.

### Terminal 1: Start Monero Regtest

```bash
./setup_monero_regtest.sh
```

This starts `monerod` in regtest mode (like `solana-test-validator`).

### Terminal 2: Start Coordinator Server

```bash
cargo run --release --bin monero-predict
```

### Terminal 3: Run Full Flow Test

```bash
./test_full_flow.sh
```

This will:
1. ✅ Create a market with real multisig address
2. ✅ Create wallets for 3 bettors
3. ✅ Mine blocks for testing
4. ✅ Show how to place encrypted bets
5. ✅ Resolve the market

---

## Quick API Test (No Monero Required)

### Terminal 1: Start Coordinator

```bash
cargo run --release --bin monero-predict
```

### Terminal 2: Test API

```bash
./test_market.sh
```

---

## Manual Testing with Monero Regtest

## Step 1: Create a Market

```bash
curl -X POST http://localhost:8080/market/create \
  -H "Content-Type: application/json" \
  -d '{
    "id": "btc-100k-2025",
    "question": "Will BTC hit $100k by Jan 2025?",
    "outcomes": ["YES", "NO"],
    "bet_deadline": 1234567,
    "resolve_deadline": 2345678,
    "multisig_address": "monero:test123",
    "oracle_pubkey": "oracle_pubkey_123"
  }'
```

Expected response: `"btc-100k-2025"`

## Step 2: Check Market Info

```bash
curl http://localhost:8080/market/btc-100k-2025/info | jq
```

## Step 3: Place Bets Using CLI

**Bet 1: Alice bets 10 XMR on YES**

```bash
cargo run --bin bettor -- bet \
  --market-id btc-100k-2025 \
  --outcome YES \
  --amount 10.0
```

When prompted, enter a mock transaction hash: `tx_alice_001`

This will:
- Generate FHE client keys (first time only)
- Encrypt the bet (outcome=YES, amount=10 XMR)
- Save a nonce file like `bet_<commitment>.nonce`
- Submit the encrypted bet to the coordinator

**Bet 2: Bob bets 5 XMR on NO**

```bash
cargo run --bin bettor -- bet \
  --market-id btc-100k-2025 \
  --outcome NO \
  --amount 5.0
```

Transaction hash: `tx_bob_002`

**Bet 3: Charlie bets 3 XMR on YES**

```bash
cargo run --bin bettor -- bet \
  --market-id btc-100k-2025 \
  --outcome YES \
  --amount 3.0
```

Transaction hash: `tx_charlie_003`

## Step 4: Check Number of Bets

```bash
curl http://localhost:8080/market/btc-100k-2025/bets | jq
```

Should show: `{"count": 3}`

## Step 5: Resolve the Market

The oracle determines the outcome (let's say YES wins):

```bash
curl -X POST http://localhost:8080/market/btc-100k-2025/resolve \
  -H "Content-Type: application/json" \
  -d '{
    "winning_outcome": 0,
    "oracle_signature": [1, 2, 3, 4, 5]
  }'
```

Expected response:
```json
{
  "winning_outcome": 0,
  "total_pool": 18000000000000,
  "total_winners": 13000000000000,
  "total_losers": 5000000000000,
  "oracle_signature": [1, 2, 3, 4, 5]
}
```

Note: Amounts are in piconeros (1 XMR = 1e12 piconeros)

## Step 6: Check Market Result

```bash
curl http://localhost:8080/market/btc-100k-2025/result | jq
```

## Step 7: Claim Payouts

**Alice claims her winnings** (she bet 10 XMR on YES):

```bash
# Find Alice's nonce file
ls bet_*.nonce

# Claim using the nonce file
cargo run --bin bettor -- claim \
  --market-id btc-100k-2025 \
  --nonce-file bet_<alice_commitment>.nonce \
  --payout-address monero:alice_address_123
```

Expected payout calculation:
- Total pool: 18 XMR
- Alice's bet: 10 XMR on YES
- Total winning bets: 13 XMR (10 + 3)
- Alice's share: (10/13) * 18 = ~13.85 XMR

**Charlie claims** (he bet 3 XMR on YES):

```bash
cargo run --bin bettor -- claim \
  --market-id btc-100k-2025 \
  --nonce-file bet_<charlie_commitment>.nonce \
  --payout-address monero:charlie_address_456
```

Expected payout: (3/13) * 18 = ~4.15 XMR

**Bob tries to claim** (he bet on NO, which lost):

```bash
cargo run --bin bettor -- claim \
  --market-id btc-100k-2025 \
  --nonce-file bet_<bob_commitment>.nonce \
  --payout-address monero:bob_address_789
```

Expected payout: 0 XMR (losing bet)

## Advanced Testing

### Test with Python Script

Create `test_market.py`:

```python
#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:8080"

# Create market
market = {
    "id": "eth-5k-2025",
    "question": "Will ETH hit $5k by Dec 2025?",
    "outcomes": ["YES", "NO"],
    "bet_deadline": 2000000,
    "resolve_deadline": 3000000,
    "multisig_address": "monero:multisig_addr",
    "oracle_pubkey": "oracle_key"
}

response = requests.post(f"{BASE_URL}/market/create", json=market)
print(f"Market created: {response.text}")

# Check market info
info = requests.get(f"{BASE_URL}/market/eth-5k-2025/info").json()
print(f"Market info: {json.dumps(info, indent=2)}")

# Check bets
bets = requests.get(f"{BASE_URL}/market/eth-5k-2025/bets").json()
print(f"Number of bets: {bets['count']}")
```

Run: `python3 test_market.py`

### Test Error Handling

**Try to claim with wrong nonce:**
```bash
echo "invalid_nonce_data" > wrong_nonce.bin
cargo run --bin bettor -- claim \
  --market-id btc-100k-2025 \
  --nonce-file wrong_nonce.bin \
  --payout-address monero:test
```

**Try to get result before resolution:**
```bash
curl http://localhost:8080/market/btc-100k-2025/result
```

Should return 404.

### Performance Test

Test FHE computation time with multiple bets:

```bash
# Place 10 bets quickly
for i in {1..10}; do
  cargo run --bin bettor -- bet \
    --market-id btc-100k-2025 \
    --outcome YES \
    --amount $i.0 &
done
wait
```

## Understanding the Output

### FHE Key Generation
First run will show:
```
Generating new FHE client key (this may take a moment)...
✓ Client key saved to: client_key.bin
```

### Bet Submission
```
✓ Nonce saved to: bet_a1b2c3d4...nonce
📤 Send 10.0 XMR to the market multisig address
Enter transaction hash: tx_001
✓ Bet submitted successfully!
  Bet ID: 5f6e7d8c...
  Keep your nonce file safe to claim winnings!
```

### Payout Claim
```
✓ Payout approved!
  Amount: 13.846153846153847 XMR (13846153846154 piconeros)
  Status: pending_multisig
  Address: monero:alice_address_123
```

## Cleanup

```bash
# Remove test files
rm bet_*.nonce
rm client_key.bin

# Stop coordinator (Ctrl+C in terminal 1)
```

## Next Steps

1. **Monero Integration**: Replace mock tx hashes with real Monero wallet integration
2. **Oracle System**: Implement proper oracle signature verification
3. **Multisig**: Add actual Monero multisig payout execution
4. **Web UI**: Build a frontend for easier interaction
5. **Testing Suite**: Add automated integration tests

## Troubleshooting

**Server won't start:**
- Check port 8080 is available: `lsof -i :8080`
- Try a different port in `src/main.rs`

**FHE operations slow:**
- Use `--release` flag: `cargo run --release`
- TFHE computations are CPU-intensive

**Bet submission fails:**
- Ensure coordinator is running
- Check network connectivity: `curl http://localhost:8080/market/test/info`
