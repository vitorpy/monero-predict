# Monero Prediction Markets - Developer Documentation

**Last Updated**: 2025-11-09
**Project Status**: Epic 2 (FHE Integration) Complete ✅

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Build Instructions](#build-instructions)
4. [Development Workflow](#development-workflow)
5. [Technology Stack](#technology-stack)
6. [Key Components](#key-components)
7. [Testing](#testing)
8. [Project Structure](#project-structure)
9. [Current Status](#current-status)
10. [Common Tasks](#common-tasks)

---

## Project Overview

### What is Monero Predict?

A privacy-preserving prediction market system where users place encrypted bets on future events using Monero (XMR) cryptocurrency. The system uses Fully Homomorphic Encryption (FHE) to ensure that the coordinator cannot see individual bet outcomes or amounts, while still being able to calculate pool totals and payouts.

### Core Features

- **Privacy-Preserving Bets**: FHE ensures coordinator cannot decrypt individual bets
- **Non-Custodial Wallets**: Full client-side Monero wallet (monero-ts WASM)
- **Verifiable Claims**: SHA3-256 commitment scheme proves bet outcome
- **Web Interface**: Terminal-aesthetic web UI (WebTUI + SvelteKit)
- **CLI Interface**: Rust CLI for power users
- **Mainnet Only**: Production-focused, no testnet support

### Key Innovations

1. **Fully Homomorphic Encryption**: TFHE-rs compiled to WASM for browser usage
2. **Client-Side Everything**: Keys, wallet, encryption all happen in browser
3. **Zero-Knowledge Proofs**: Commitment scheme allows claiming without revealing early
4. **Dual Interfaces**: Both web and CLI for different user preferences

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                            CLIENT SIDE                               │
│                                                                       │
│  ┌──────────────────┐         ┌──────────────────┐                  │
│  │   Web Bettor     │         │   CLI Bettor     │                  │
│  │   (SvelteKit)    │         │   (Rust)         │                  │
│  └────────┬─────────┘         └────────┬─────────┘                  │
│           │                            │                             │
│  ┌────────▼──────────────────────────▼─────────┐                   │
│  │         FHE Client (TFHE WASM)              │                   │
│  │  - Key Generation (10-30s)                  │                   │
│  │  - Bet Encryption (FheUint8 + FheUint64)    │                   │
│  │  - Commitment (SHA3-256)                    │                   │
│  └──────────────────┬──────────────────────────┘                   │
│                     │                                                │
│  ┌─────────────────▼──────────────────────────┐                   │
│  │    IndexedDB / Local Storage                │                   │
│  │  - Client Key (~20MB)                       │                   │
│  │  - Server Key (~115MB)                      │                   │
│  │  - Nonces, Bets, Wallet Data                │                   │
│  └─────────────────────────────────────────────┘                   │
│                     │                                                │
└─────────────────────┼────────────────────────────────────────────────┘
                      │
                      │ HTTPS/JSON
                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         COORDINATOR                                  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Rust Server (Axum)                                           │  │
│  │  - Market Management                                          │  │
│  │  - Homomorphic Operations (on encrypted bets)                │  │
│  │  - Pool Calculations                                          │  │
│  │  - Payout Distribution                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                          │  │
│  │  - Markets                                                     │  │
│  │  - Encrypted Bets                                             │  │
│  │  - Transactions                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow: Placing a Bet

```
1. User generates FHE keys (one-time)
   ├─ Browser: Generate 135MB keypair
   ├─ IndexedDB: Store client key (private)
   └─ Coordinator: Upload server key (public)

2. User selects market and outcome
   ├─ Web UI: Display market question
   └─ User: Choose YES/NO + amount in XMR

3. Client encrypts bet
   ├─ Convert XMR to piconeros (1e12)
   ├─ FHE: Encrypt outcome as FheUint8 (0=YES, 1=NO)
   ├─ FHE: Encrypt amount as FheUint64
   ├─ SHA3-256: Generate commitment from random nonce
   └─ IndexedDB: Store nonce (critical for claiming!)

4. Client sends XMR payment
   ├─ monero-ts: Create transaction
   ├─ Monero Network: Broadcast transaction
   └─ Wait for confirmations

5. Client submits encrypted bet
   ├─ HTTPS POST to coordinator
   ├─ Payload: encrypted_outcome, encrypted_amount, commitment, tx_hash
   └─ Coordinator: Store encrypted bet (cannot decrypt!)

6. Market resolution
   ├─ Oracle: Provides outcome (YES or NO)
   ├─ Coordinator: Calculates payouts using FHE operations
   └─ Coordinator: Makes payout transactions

7. User claims winnings
   ├─ Client: Reveal nonce to prove outcome
   ├─ Coordinator: Verify commitment matches
   └─ Coordinator: Send payout to user's address
```

---

## Build Instructions

### Prerequisites

```bash
# System Requirements
- Rust 1.70+ (stable)
- Node.js 20+ (LTS)
- PostgreSQL 14+ (for coordinator)
- wasm-pack 0.12+
- cargo-watch (optional, for development)

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Install Node.js (use nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | sh
nvm install 20
nvm use 20
```

### Building FHE Client (Rust → WASM)

```bash
# Navigate to FHE client crate
cd crates/fhe-client

# Build for native (for testing)
cargo build --release

# Run native tests (11 tests)
cargo test

# Build WASM package
wasm-pack build --target web --features wasm

# Output: pkg/ directory with:
# - monero_predict_fhe_client_bg.wasm (1.9MB)
# - monero_predict_fhe_client.js (546KB)
# - monero_predict_fhe_client.d.ts (TypeScript definitions)
# - package.json

# Copy WASM artifacts to web-bettor
cp -r pkg/* ../../web-bettor/src/lib/wasm/
```

### Building Web Bettor (SvelteKit)

```bash
cd web-bettor

# Install dependencies
npm install

# Development server (hot reload)
npm run dev
# Opens at http://localhost:5173

# Type checking
npm run check

# Production build
npm run build
# Output: build/ directory (static site)

# Preview production build
npm run preview
```

### Building Coordinator (Rust Server)

```bash
# Build coordinator binary
cargo build --release --bin monero-predict

# Run coordinator (requires PostgreSQL)
COORDINATOR_PORT=8080 \
COORDINATOR_DATABASE_URL=postgres://user:pass@localhost/monero_predict \
./target/release/monero-predict

# Development mode with auto-reload
cargo watch -x 'run --bin monero-predict'
```

### Building CLI Bettor (Rust)

```bash
# Build CLI binary
cargo build --release --bin bettor

# Run CLI
./target/release/bettor --help

# Example: Generate FHE keys
./target/release/bettor generate-keys

# Example: Place bet
./target/release/bettor place-bet \
  --market-id "bitcoin-100k-2025" \
  --outcome YES \
  --amount 1.0
```

---

## Development Workflow

### Daily Development Commands

```bash
# FHE Client Development
cd crates/fhe-client
cargo watch -x test              # Auto-run tests on save
cargo watch -x 'check --target wasm32-unknown-unknown --features wasm'

# Web Bettor Development
cd web-bettor
npm run dev                      # Hot reload dev server
npm run check:watch             # TypeScript checking

# Coordinator Development
cargo watch -x 'run --bin monero-predict'

# Full Stack Development (use tmux/screen)
# Terminal 1: Coordinator
cargo run --bin monero-predict

# Terminal 2: Web Bettor
cd web-bettor && npm run dev

# Terminal 3: PostgreSQL
docker run -p 5432:5432 -e POSTGRES_PASSWORD=dev postgres:14
```

### Git Workflow

```bash
# Feature development
git checkout -b feature/my-feature
# ... make changes ...
git add .
git commit -m "feat: description"
git push origin feature/my-feature

# Commit message format (Conventional Commits)
# feat: new feature
# fix: bug fix
# docs: documentation
# refactor: code refactoring
# test: add tests
# chore: maintenance
```

### Testing Workflow

```bash
# Rust tests
cargo test                       # All tests
cargo test --lib                 # Library tests only
cargo test test_encryption      # Specific test

# Rust tests with output
cargo test -- --nocapture

# FHE client tests (slow, ~60 seconds)
cd crates/fhe-client
cargo test --lib

# Web integration test (manual)
cd web-bettor
npm run dev
# 1. Navigate to http://localhost:5173/setup
# 2. Generate FHE keys
# 3. Navigate to /markets/test-market
# 4. Place encrypted bet
# 5. Verify commitment hash appears
```

---

## Technology Stack

### Backend (Rust)

| Component | Version | Purpose |
|-----------|---------|---------|
| **tfhe** | 0.8.7 | Fully Homomorphic Encryption |
| **axum** | 0.7 | HTTP server framework |
| **tokio** | 1.0 | Async runtime |
| **sqlx** | 0.7 | PostgreSQL client |
| **serde** | 1.0 | Serialization |
| **bincode** | 1.3 | Binary serialization (FHE keys) |
| **sha3** | 0.10 | Commitment scheme |
| **rand** | 0.8 | Cryptographic randomness |
| **anyhow** | 1.0 | Error handling |

### Frontend (TypeScript/JavaScript)

| Component | Version | Purpose |
|-----------|---------|---------|
| **SvelteKit** | 2.0 | Web framework |
| **TypeScript** | 5.0 | Type safety |
| **Vite** | 7.2 | Build tool + WASM support |
| **Dexie.js** | 4.0 | IndexedDB wrapper |
| **monero-ts** | 0.9.9 | Monero wallet (WASM) |
| **@webtui/css** | Latest | Terminal aesthetic |
| **wasm-bindgen** | 0.2.93 | Rust ↔ JavaScript bridge |

### Database

- **PostgreSQL 14+**: Coordinator data storage
- **IndexedDB**: Client-side browser storage (135MB+ for FHE keys)

### Build Tools

- **wasm-pack**: Rust → WASM compilation
- **cargo**: Rust package manager
- **npm**: Node package manager
- **vite-plugin-wasm**: WASM loading in Vite
- **vite-plugin-top-level-await**: Top-level await support

---

## Key Components

### 1. FHE Client (`crates/fhe-client/`)

**Purpose**: Encrypt bets using TFHE before sending to coordinator

**Key Files**:
- `src/keys.rs`: FHE key generation and serialization
- `src/crypto.rs`: Bet encryption/decryption (FheUint8, FheUint64)
- `src/commitment.rs`: SHA3-256 commitment scheme
- `src/wasm.rs`: WASM bindings for JavaScript
- `Cargo.toml`: Dual-target configuration (native + WASM)

**Key Functions**:
```rust
// Generate FHE keypair (10-30 seconds)
pub fn generate() -> Result<FheKeyPair>

// Encrypt bet
pub fn encrypt_bet(
    outcome_yes: bool,      // true=YES, false=NO
    amount_piconeros: u64,  // 1 XMR = 1e12 piconeros
    keypair: &FheKeyPair
) -> Result<EncryptedBet>

// Generate commitment
pub fn compute_commitment(nonce: &[u8; 32]) -> [u8; 32]
```

**WASM API** (JavaScript):
```typescript
class WasmFheClient {
  constructor();  // Generate keys (blocking, 10-30s)
  static from_bytes(client: Uint8Array, server: Uint8Array): WasmFheClient;
  encrypt_bet(outcome_yes: boolean, amount: bigint): JsEncryptedBet;
  export_client_key(): Uint8Array;  // ~20MB
  export_server_key(): Uint8Array;  // ~115MB
}
```

### 2. Web Bettor (`web-bettor/`)

**Purpose**: Browser-based UI for placing encrypted bets

**Key Files**:
- `src/lib/services/fhe.ts`: High-level FHE API wrapper
- `src/lib/services/storage.ts`: IndexedDB operations (Dexie)
- `src/lib/workers/fhe-keygen.worker.ts`: Web Worker for key generation
- `src/lib/wasm/`: WASM artifacts (auto-generated)
- `src/routes/setup/+page.svelte`: FHE key generation UI
- `src/routes/markets/[id]/+page.svelte`: Bet placement UI

**Key Services**:
```typescript
// fhe.ts - High-level API
export async function generateKeysInWorker(
  onProgress?: (percent: number, message: string) => void
): Promise<void>

export async function encryptBet(
  outcomeYes: boolean,
  amountXMR: number
): Promise<EncryptedBet>

export async function hasKeys(): Promise<boolean>
```

**Storage Schema** (Dexie):
```typescript
interface FheKeys {
  id: string;
  clientKeyData: Uint8Array;  // ~20MB
  serverKeyData: Uint8Array;  // ~115MB
  createdAt: number;
}

interface Bet {
  betId: string;
  marketId: string;
  nonce: Uint8Array;          // Critical for claiming!
  commitment: string;         // SHA3-256 hex
  txHash: string;
  amount: number;             // XMR
  outcome: 'YES' | 'NO';
  timestamp: number;
  status: 'pending' | 'active' | 'resolved' | 'claimed';
}
```

### 3. Coordinator (`src/bin/monero-predict.rs`)

**Purpose**: HTTP server that manages markets and encrypted bets

**Key Responsibilities**:
- Market creation and management
- Accept encrypted bets (cannot decrypt!)
- Perform homomorphic operations on encrypted data
- Calculate pool totals and payouts
- Verify commitments when claiming

**API Endpoints** (planned):
```
GET  /markets              - List active markets
GET  /markets/:id          - Market details
POST /markets/:id/bets     - Submit encrypted bet
GET  /markets/:id/pools    - Get pool totals (encrypted)
POST /claim                - Claim winnings (reveal nonce)
```

### 4. CLI Bettor (`src/bin/bettor.rs`)

**Purpose**: Command-line interface for power users

**Commands** (planned):
```bash
bettor generate-keys              # Generate FHE keys
bettor list-markets               # List markets
bettor place-bet --market-id ID --outcome YES --amount 1.0
bettor list-bets                  # My bets
bettor claim --bet-id ID          # Claim winnings
```

---

## Testing

### Unit Tests (Rust)

```bash
# Run all tests
cargo test

# FHE client tests (11 tests, ~60s)
cd crates/fhe-client
cargo test --lib

# Test output:
# ✓ test_key_generation
# ✓ test_key_serialization_roundtrip
# ✓ test_encrypt_decrypt_yes_bet
# ✓ test_encrypt_decrypt_no_bet
# ✓ test_commitment_uniqueness
# ✓ test_commitment_verification
# ✓ test_edge_case_zero_amount
# ✓ test_edge_case_max_amount
# ✓ test_nonce_generation
# ✓ test_commitment_determinism
# ✓ test_commitment_uniqueness (commitment.rs)
```

### Integration Tests (Manual)

**Full Workflow Test**:
```bash
# 1. Start web bettor
cd web-bettor && npm run dev

# 2. Open browser: http://localhost:5173

# 3. Navigate to /setup
#    - Click "Generate FHE Keys"
#    - Wait 10-30 seconds
#    - Verify "Keys generated successfully"

# 4. Navigate to /markets/test-market
#    - Select outcome: YES
#    - Enter amount: 1.0 XMR
#    - Click "Encrypt and Place Bet"
#    - Wait ~500ms
#    - Verify commitment hash appears

# 5. Check IndexedDB
#    - Open DevTools → Application → IndexedDB
#    - Verify BettorDB → fheKeys exists
#    - Verify total ~135MB
#    - Check bets table for encrypted bet

# 6. Download nonce (optional)
#    - Click "Download Nonce"
#    - Verify .nonce file downloads
```

### Performance Benchmarks

```bash
# FHE key generation benchmark
cd crates/fhe-client
cargo bench --bench keygen

# Expected results (AMD Ryzen 9 5900X):
# Key generation: ~15-20 seconds
# Bet encryption: ~400-600ms
# Commitment: ~1ms
```

---

## Project Structure

```
monero-predict/
├── crates/
│   └── fhe-client/              # FHE encryption library
│       ├── src/
│       │   ├── lib.rs           # Module exports
│       │   ├── keys.rs          # Key generation
│       │   ├── crypto.rs        # Encryption/decryption
│       │   ├── commitment.rs    # SHA3-256 commitments
│       │   └── wasm.rs          # WASM bindings
│       ├── Cargo.toml           # Dual-target config
│       └── pkg/                 # WASM output (generated)
│
├── web-bettor/                  # SvelteKit web UI
│   ├── src/
│   │   ├── lib/
│   │   │   ├── services/
│   │   │   │   ├── fhe.ts       # FHE service wrapper
│   │   │   │   └── storage.ts   # IndexedDB (Dexie)
│   │   │   ├── workers/
│   │   │   │   └── fhe-keygen.worker.ts  # Non-blocking keygen
│   │   │   └── wasm/            # WASM artifacts
│   │   │       ├── monero_predict_fhe_client_bg.wasm
│   │   │       ├── monero_predict_fhe_client.js
│   │   │       └── monero_predict_fhe_client.d.ts
│   │   └── routes/
│   │       ├── +layout.svelte   # App shell
│   │       ├── +page.svelte     # Dashboard
│   │       ├── setup/           # FHE key generation
│   │       ├── markets/[id]/    # Bet placement
│   │       ├── bets/            # Bet history
│   │       └── claim/[id]/      # Claim winnings
│   ├── package.json
│   ├── vite.config.ts           # WASM configuration
│   └── svelte.config.js         # Static adapter
│
├── src/
│   ├── bin/
│   │   ├── monero-predict.rs    # Coordinator server
│   │   └── bettor.rs            # CLI bettor
│   └── lib.rs                   # Shared library
│
├── Cargo.toml                   # Workspace config
├── .beads/                      # Issue tracking (bd)
│   ├── issues.jsonl
│   └── config.yaml
├── CLAUDE.md                    # This file
└── README.md                    # User-facing docs
```

---

## Current Status

### Completed Epics ✅

**Epic 1: Project Setup & Core Infrastructure**
- ✅ SvelteKit project with TypeScript
- ✅ WebTUI theme (Catppuccin Mocha)
- ✅ WASM configuration (Vite plugins)
- ✅ IndexedDB schema (Dexie)
- ✅ Routing structure
- ✅ Svelte stores for state management

**Epic 2: FHE Integration (TFHE WASM)**
- ✅ Rust FHE client crate (dual-target)
- ✅ Key generation (native + WASM)
- ✅ Bet encryption (FheUint8 + FheUint64)
- ✅ SHA3-256 commitment scheme
- ✅ WASM bindings with TypeScript types
- ✅ Web Worker for non-blocking keygen
- ✅ IndexedDB storage (135MB keys)
- ✅ TypeScript service wrapper
- ✅ UI integration (setup + bet placement)
- ✅ Comprehensive documentation
- ✅ All tests passing (11/11)

### Remaining Epics 🚧

**Epic 3: Wallet Integration (monero-ts)** - Next
- 🚧 monero-ts WASM integration
- 🚧 Wallet creation/restoration
- 🚧 Daemon connection and sync
- 🚧 Transaction creation
- 🚧 Balance tracking

**Epic 4: Coordinator API Extensions**
- 🚧 Market management endpoints
- 🚧 Bet submission endpoint
- 🚧 Homomorphic pool calculations
- 🚧 Payout distribution

**Epic 5: Betting Flow**
- 🚧 Market browsing
- 🚧 Complete bet placement (with XMR payment)
- 🚧 Transaction broadcasting
- 🚧 Bet confirmation

**Epic 6: Claiming Flow**
- 🚧 Nonce revelation
- 🚧 Commitment verification
- 🚧 Payout calculation
- 🚧 Winnings withdrawal

**Epic 7: Polish & Documentation**
- 🚧 Error handling improvements
- 🚧 Loading states
- 🚧 User documentation
- 🚧 Deployment guide

### Project Statistics

```
Total Issues:      25
Completed:         20 (80%)
In Progress:       0
Blocked:           3
Ready:             2
Avg Lead Time:     0.6 hours
```

---

## Common Tasks

### Rebuilding WASM After Rust Changes

```bash
# 1. Navigate to FHE client
cd crates/fhe-client

# 2. Test changes in native
cargo test

# 3. Rebuild WASM
wasm-pack build --target web --features wasm

# 4. Copy to web-bettor
cp -r pkg/* ../../web-bettor/src/lib/wasm/

# 5. Test in browser
cd ../../web-bettor
npm run dev
```

### Adding a New FHE Operation

```rust
// 1. Add to crypto.rs
pub fn new_operation(data: &[u8], keypair: &FheKeyPair) -> Result<Vec<u8>> {
    // Implementation
}

// 2. Add test
#[cfg(test)]
mod tests {
    #[test]
    fn test_new_operation() {
        // Test
    }
}

// 3. Add WASM binding in wasm.rs
#[wasm_bindgen]
impl WasmFheClient {
    pub fn new_operation(&self, data: &[u8]) -> Result<Vec<u8>, JsValue> {
        crate::new_operation(data, &self.keypair)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }
}

// 4. Export in lib.rs
pub use crypto::new_operation;

// 5. Rebuild WASM (see above)

// 6. Add TypeScript wrapper in fhe.ts
export async function newOperation(data: Uint8Array): Promise<Uint8Array> {
    const client = await loadClient();
    return client.new_operation(data);
}
```

### Adding a New Route

```bash
# 1. Create route directory
mkdir -p web-bettor/src/routes/my-route

# 2. Create page
cat > web-bettor/src/routes/my-route/+page.svelte << 'EOF'
<script lang="ts">
  // Component logic
</script>

<div is-="view">
  <h1>My Route</h1>
  <!-- Content -->
</div>

<style>
  /* Styles */
</style>
EOF

# 3. Create load function (if needed)
cat > web-bettor/src/routes/my-route/+page.ts << 'EOF'
export function load({ params }) {
  return {
    // Data
  };
}
EOF

# 4. Test route
npm run dev
# Navigate to http://localhost:5173/my-route
```

### Debugging WASM Issues

```bash
# 1. Check browser console for errors
# DevTools → Console

# 2. Verify WASM file loaded
# DevTools → Network → Filter: wasm
# Should see monero_predict_fhe_client_bg.wasm (1.9MB)

# 3. Check WASM exports
# Console:
const mod = await import('/src/lib/wasm/monero_predict_fhe_client.js');
console.log(mod);

# 4. Test WASM in Node.js
cd web-bettor/src/lib/wasm
node
> const wasm = require('./monero_predict_fhe_client.js');
> // Test operations

# 5. Rebuild with debugging
cd crates/fhe-client
RUSTFLAGS="-C debuginfo=2" wasm-pack build --target web --features wasm --dev
```

### Database Migrations (Coordinator)

```bash
# Create migration
sqlx migrate add create_markets_table

# Edit migration file
# migrations/XXXXXX_create_markets_table.sql

# Run migration
DATABASE_URL=postgres://user:pass@localhost/db \
sqlx migrate run

# Revert migration
sqlx migrate revert
```

### Updating Dependencies

```bash
# Update Rust dependencies
cargo update

# Update Node dependencies
cd web-bettor
npm update

# Update specific package
npm update @webtui/css

# Check for outdated packages
npm outdated
```

---

## Development Best Practices

### Rust Code Style

```rust
// Use explicit error handling
pub fn do_something() -> Result<T> {  // ✓ Good
    // ...
}

pub fn do_something() -> T {  // ✗ Avoid
    // ...
}

// Use descriptive variable names
let encrypted_outcome = encrypt(outcome);  // ✓ Good
let enc_o = encrypt(o);  // ✗ Avoid

// Document public APIs
/// Encrypts a bet using FHE
///
/// # Arguments
/// * `outcome_yes` - true for YES, false for NO
/// * `amount` - Amount in piconeros
pub fn encrypt_bet(...) -> Result<EncryptedBet> {
```

### TypeScript Code Style

```typescript
// Use async/await (not .then())
const result = await operation();  // ✓ Good
operation().then(r => ...);  // ✗ Avoid

// Use descriptive names
async function encryptBet() { }  // ✓ Good
async function enc() { }  // ✗ Avoid

// Handle errors explicitly
try {
  await operation();
} catch (error) {
  console.error('[Context]', error);
  throw new Error('User-friendly message');
}
```

### Svelte 5 Patterns

```svelte
<script lang="ts">
  // Use $state for reactive variables
  let count = $state(0);  // ✓ Good (Svelte 5)
  let count = 0;  // ✗ Old style

  // Use onclick instead of on:click
  <button onclick={handleClick}>  // ✓ Good (Svelte 5)
  <button on:click={handleClick}>  // ✗ Deprecated

  // Use $derived for computed values
  let doubled = $derived(count * 2);  // ✓ Good
</script>
```

---

## Troubleshooting

### "WASM module not found"

```bash
# Verify WASM files exist
ls -lh web-bettor/src/lib/wasm/

# Should see:
# - monero_predict_fhe_client_bg.wasm (1.9MB)
# - monero_predict_fhe_client.js
# - monero_predict_fhe_client.d.ts

# If missing, rebuild:
cd crates/fhe-client
wasm-pack build --target web --features wasm
cp -r pkg/* ../../web-bettor/src/lib/wasm/
```

### "QuotaExceededError" in IndexedDB

```javascript
// Browser storage quota exceeded (need 135MB)
// Solution 1: Clear browser data
// DevTools → Application → Storage → Clear site data

// Solution 2: Request persistent storage
if (navigator.storage && navigator.storage.persist) {
  const isPersisted = await navigator.storage.persist();
  console.log(`Persistent storage: ${isPersisted}`);
}
```

### "Key generation takes too long"

```bash
# Expected: 10-30 seconds (CPU-dependent)
# If > 60 seconds:
# 1. Check CPU usage (should be 100% on one core)
# 2. Check browser console for errors
# 3. Try in different browser
# 4. Disable browser extensions
```

### "Tests failing after dependency update"

```bash
# Lock dependencies to known-good versions
cargo update --dry-run  # Preview updates
cargo update tfhe      # Update specific package

# If tests fail:
git checkout Cargo.lock  # Restore old versions
cargo test              # Verify tests pass
```

---

## Performance Optimization

### WASM Bundle Size

Current: 1.9MB (542KB gzipped)

```bash
# Optimize for size (already configured)
# Cargo.toml:
[profile.release]
opt-level = "z"  # Optimize for size
lto = true       # Link-time optimization

# Further optimization (experimental):
wasm-opt -Oz -o output.wasm input.wasm
```

### Key Generation Speed

Current: 10-30 seconds

```bash
# Cannot be significantly improved (cryptographic operations)
# Mitigation: Use Web Worker (already implemented)
# Future: Server-side key generation (less secure)
```

### Bet Encryption Speed

Current: ~500ms

```bash
# Already optimized with WASM
# Further optimization requires:
# 1. SIMD in WASM (experimental browser support)
# 2. WebGPU acceleration (future work)
```

---

## Security Considerations

### Critical Security Rules

1. **Client Key**: NEVER send to coordinator or share publicly
2. **Nonce**: MUST be stored securely (required for claiming)
3. **HTTPS**: Required in production for WASM/SharedArrayBuffer
4. **Wallet Encryption**: TODO - encrypt seed phrase with user password
5. **Key Backup**: TODO - implement encrypted cloud backup

### Threat Model

**What FHE Protects**:
- ✅ Bet outcome privacy (coordinator cannot see YES/NO)
- ✅ Bet amount privacy (coordinator cannot see exact amount)
- ✅ Betting strategy privacy (pattern analysis harder)

**What FHE Does NOT Protect**:
- ❌ Transaction privacy (visible on Monero blockchain)
- ❌ Timing analysis (when bets are placed)
- ❌ Client-side attacks (malicious browser extensions)

### Production Checklist

- [ ] Encrypt wallet seed phrase with user password
- [ ] Implement FHE key backup mechanism
- [ ] Add rate limiting to coordinator
- [ ] Enable HTTPS with valid certificate
- [ ] Set CORS policies properly
- [ ] Add CSP headers
- [ ] Implement session management
- [ ] Add audit logging
- [ ] Security audit of FHE implementation
- [ ] Penetration testing

---

## Useful Links

### Documentation
- TFHE-rs: https://docs.zama.ai/tfhe-rs
- SvelteKit: https://kit.svelte.dev/
- WebTUI: https://webtui.ironclad.sh/
- Dexie.js: https://dexie.org/
- monero-ts: https://github.com/monero-ecosystem/monero-ts

### Tools
- wasm-pack: https://rustwasm.github.io/wasm-pack/
- Issue Tracker (bd): https://github.com/probably-not/beads

### Project Resources
- Main README: `README.md`
- Web Bettor README: `web-bettor/README.md`
- Issue Tracking: `.beads/` (use `bd` CLI)

---

## Contact & Support

For questions or issues:
1. Check this documentation first
2. Check existing GitHub issues
3. Create new issue with detailed description
4. Include: OS, browser, error messages, steps to reproduce

---

**Last Updated**: 2025-11-09
**Next Milestone**: Epic 3 - Wallet Integration (monero-ts)
