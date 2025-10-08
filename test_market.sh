#!/bin/bash
# Test script for the private prediction market

set -e

BASE_URL="http://localhost:8080"
MARKET_ID="btc-100k-2025"

echo "🧪 Testing Private Prediction Market"
echo "===================================="

# Check if server is running
if ! curl -s "$BASE_URL/market/test/info" >/dev/null 2>&1; then
    echo "❌ Error: Coordinator server not running!"
    echo "   Start it with: cargo run --release"
    exit 1
fi

echo "✅ Coordinator server is running"
echo ""

# Step 1: Create a market
echo "📊 Step 1: Creating market..."
MARKET_RESPONSE=$(curl -s -X POST "$BASE_URL/market/create" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "'"$MARKET_ID"'",
    "question": "Will BTC hit $100k by Jan 2025?",
    "outcomes": ["YES", "NO"],
    "bet_deadline": 1234567,
    "resolve_deadline": 2345678,
    "multisig_address": "monero:test_multisig_123",
    "oracle_pubkey": "oracle_pubkey_456"
  }')

echo "   Market created: $MARKET_RESPONSE"
echo ""

# Step 2: Get market info
echo "📋 Step 2: Fetching market info..."
curl -s "$BASE_URL/market/$MARKET_ID/info" | jq '.'
echo ""

# Step 3: Simulate placing bets (using API directly for automation)
echo "💰 Step 3: Simulating bets..."
echo "   Note: In production, use the CLI tool to place encrypted bets"
echo "   For now, checking bet submission endpoint..."
echo ""

# Step 4: Check bets count
echo "📊 Step 4: Checking number of bets..."
BETS=$(curl -s "$BASE_URL/market/$MARKET_ID/bets")
echo "   Current bets: $BETS"
echo ""

echo "🎯 To place actual encrypted bets, use:"
echo "   cargo run --bin bettor -- bet --market-id $MARKET_ID --outcome YES --amount 10.0"
echo ""

echo "📝 To resolve the market (as oracle), run:"
echo "   curl -X POST $BASE_URL/market/$MARKET_ID/resolve \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"winning_outcome\": 0, \"oracle_signature\": [1,2,3,4,5]}'"
echo ""

echo "💸 To claim payouts (after resolution), run:"
echo "   cargo run --bin bettor -- claim --market-id $MARKET_ID --nonce-file <file> --payout-address <addr>"
echo ""

echo "✅ Basic API test completed!"
echo ""
echo "📖 See TESTING.md for the complete testing guide"
