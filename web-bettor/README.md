# Web Bettor - Monero Prediction Markets

Privacy-preserving prediction markets using Fully Homomorphic Encryption (FHE) and Monero cryptocurrency. This is the web interface for placing encrypted bets and claiming winnings.

## Features

- 🔒 **Privacy-Preserving**: Bets encrypted with TFHE before submission
- 💰 **Non-Custodial**: Full client-side Monero wallet (monero-ts)
- 🎨 **Terminal Aesthetic**: WebTUI with Catppuccin Mocha theme
- 📦 **IndexedDB Storage**: Local storage for keys, bets, and nonces
- ⚡ **Client-Side WASM**: FHE and Monero operations run in browser

## Prerequisites

- **Node.js 20+** (LTS recommended)
- **npm** (comes with Node.js)
- Modern browser with WASM support

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Technology Stack

- **Framework**: SvelteKit 2 with TypeScript
- **Styling**: WebTUI (@webtui/css + @webtui/theme-catppuccin)
- **Build Tool**: Vite 7 with WASM support
- **Storage**: IndexedDB (via Dexie.js 4)
- **Wallet**: monero-ts 0.9.9 (WebAssembly)
- **FHE**: tfhe-rs 0.8 (compiled to WASM) ✅ **IMPLEMENTED**
- **Adapter**: Static adapter (client-side only)

### Project Structure

```
web-bettor/
├── src/
│   ├── lib/
│   │   ├── services/
│   │   │   └── storage.ts       # IndexedDB schema and helpers
│   │   └── stores/
│   │       ├── wallet.ts        # Wallet state management
│   │       ├── bets.ts          # Bet history management
│   │       └── markets.ts       # Market data management
│   ├── routes/
│   │   ├── +layout.svelte       # Global layout with WebTUI theme
│   │   ├── +page.svelte         # Dashboard
│   │   ├── markets/[id]/        # Market detail + bet placement
│   │   ├── bets/                # Bet history
│   │   ├── claim/[id]/          # Claim winnings
│   │   └── setup/               # Wallet setup
│   ├── app.css                  # Global styles (WebTUI imports)
│   └── app.html                 # HTML template
├── static/                      # Static assets
├── svelte.config.js             # SvelteKit configuration
├── vite.config.ts               # Vite + WASM configuration
├── tsconfig.json                # TypeScript configuration (strict mode)
└── package.json                 # Dependencies and scripts
```

### Data Flow

```
┌─────────────┐
│   Svelte    │
│  Components │
└──────┬──────┘
       │
       ├─────────► Stores (reactive state)
       │           ├─ walletStore
       │           ├─ betsStore
       │           └─ marketsStore
       │
       └─────────► Services
                   ├─ storage.ts ───► IndexedDB (Dexie)
                   ├─ fhe.ts ──────► TFHE WASM (future)
                   ├─ wallet.ts ───► monero-ts WASM (future)
                   └─ coordinator.ts ─► HTTP API (future)
```

### IndexedDB Schema

**clientKeys** table:
- `id` (primary): Key identifier (usually 'default')
- `keyData`: Serialized FHE client key (Uint8Array)
- `createdAt`: Timestamp

**wallet** table:
- `id` (primary): Wallet identifier (usually 'default')
- `seedPhrase`: 25-word Monero seed (TODO: encrypt)
- `password`: User password hash (TODO: proper hashing)
- `primaryAddress`: Monero wallet address
- `createdAt`: Timestamp
- `lastSync`: Last sync timestamp

**bets** table:
- `betId` (primary): Unique bet identifier
- `marketId`: Market this bet belongs to
- `nonce`: 32-byte commitment nonce (Uint8Array)
- `commitment`: SHA3-256 hash of nonce
- `txHash`: Monero transaction hash
- `amount`: Bet amount in XMR
- `outcome`: 'YES' or 'NO'
- `timestamp`: Bet placement timestamp
- `status`: 'pending' | 'active' | 'resolved' | 'claimed'
- `payoutAmount`: Payout in XMR (optional)
- `payoutAddress`: Claim destination (optional)

## Development

### Running the Dev Server

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Generates static site in `build/` directory.

### Type Checking

```bash
npm run check
```

## Configuration

### Vite Configuration

- **WASM Support**: vite-plugin-wasm + vite-plugin-top-level-await
- **Workers**: Configured for ES modules
- **CORS Headers**: SharedArrayBuffer support (COOP/COEP)
- **Target**: esnext (for WASM features)
- **Optimizations**: monero-ts excluded from pre-bundling

## FHE (Fully Homomorphic Encryption) Integration

### Overview

The web bettor uses TFHE (Fully Homomorphic Encryption) to encrypt bet data before sending it to the coordinator. This ensures that:

- **Privacy**: Coordinator cannot see your bet outcome (YES/NO) or amount
- **Verifiability**: You can prove your bet outcome later using a nonce
- **Fairness**: Homomorphic operations allow payout calculations without decryption

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Browser (Client)                                            │
│                                                              │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │ FHE Key Gen      │───▶│ IndexedDB        │              │
│  │ (Web Worker)     │    │ - Client Key     │              │
│  │ 10-30 seconds    │    │ - Server Key     │              │
│  └──────────────────┘    │ (~135MB total)   │              │
│                          └──────────────────┘              │
│                                  │                          │
│  ┌──────────────────┐           │                          │
│  │ Bet Encryption   │◀──────────┘                          │
│  │ - Outcome (u8)   │                                       │
│  │ - Amount (u64)   │                                       │
│  │ - Commitment     │                                       │
│  └──────────────────┘                                       │
│          │                                                   │
└──────────┼───────────────────────────────────────────────────┘
           │
           ▼ Encrypted Bet + Server Key
┌─────────────────────────────────────────────────────────────┐
│ Coordinator (Server)                                        │
│                                                              │
│  ┌──────────────────┐                                       │
│  │ Homomorphic Ops  │                                       │
│  │ - Pool totals    │ (Cannot decrypt individual bets)     │
│  │ - Payout calc    │                                       │
│  └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
```

### Security Model

#### Client Key (Private)
- **Size**: ~20MB
- **Purpose**: Encrypt and decrypt bet data
- **Storage**: IndexedDB (encrypted in future)
- **Sharing**: **NEVER** send to coordinator or anyone else

#### Server Key (Public)
- **Size**: ~115MB
- **Purpose**: Homomorphic operations on encrypted data
- **Storage**: IndexedDB + sent to coordinator
- **Sharing**: Safe to share publicly

#### Commitment Scheme
- **Hash**: SHA3-256 of a random 32-byte nonce
- **Purpose**: Prove bet outcome without revealing it early
- **Verification**: Reveal nonce after market resolution to claim winnings

### Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| Key Generation | 10-30 seconds | Done once in Web Worker (non-blocking) |
| Bet Encryption | ~500ms | Main thread (brief UI lag) |
| WASM Load | ~200ms | Lazy-loaded on first use |
| Storage (IndexedDB) | ~100ms | For 135MB keys |

### Storage Requirements

| Item | Size | Storage |
|------|------|---------|
| Client Key | ~20MB | IndexedDB |
| Server Key | ~115MB | IndexedDB |
| WASM Bundle | 1.9MB (542KB gzip) | Browser cache |
| Bet Metadata | <1KB per bet | IndexedDB |

**Total**: ~135MB in IndexedDB (one-time)

### Usage Example

```typescript
import { generateKeysInWorker, encryptBet } from '$lib/services/fhe';

// Step 1: Generate keys (one-time setup)
await generateKeysInWorker((percent, message) => {
  console.log(`${percent}%: ${message}`);
});

// Step 2: Encrypt a bet
const encrypted = await encryptBet(
  true,        // outcome: YES
  1.0          // amount: 1 XMR
);

// Step 3: Save encrypted bet
await saveBet({
  betId: '...',
  marketId: '...',
  nonce: encrypted.nonce,
  commitment: encrypted.commitment,
  outcome: encrypted.outcome,
  amount: encrypted.amount,
  // ... other fields
});
```

### Implementation Details

#### Rust TFHE Client (`crates/fhe-client`)
- Dual-target compilation (native + WASM)
- `keys.rs`: Key generation and serialization
- `crypto.rs`: Bet encryption/decryption
- `commitment.rs`: SHA3-256 commitment scheme
- `wasm.rs`: WASM bindings for JavaScript

#### TypeScript FHE Service (`src/lib/services/fhe.ts`)
- Lazy WASM initialization
- High-level API: `encryptBet()`, `hasKeys()`, etc.
- XMR to piconeros conversion (1 XMR = 1e12 piconeros)
- Error handling with user-friendly messages

#### Web Worker (`src/lib/workers/fhe-keygen.worker.ts`)
- Non-blocking key generation
- Progress reporting (0-100%)
- Transferable objects for efficient 135MB data transfer

#### IndexedDB Storage (`src/lib/services/storage.ts`)
- Dexie.js wrapper
- `fheKeys` table with version 2 schema migration
- Quota exceeded error handling

### Known Limitations

1. **Key Generation Time**: 10-30 seconds (CPU-dependent)
   - Mitigation: Web Worker prevents UI blocking
2. **Storage Size**: 135MB required in IndexedDB
   - Mitigation: Most browsers allow 500MB-1GB per origin
3. **No Key Backup**: Keys lost if browser cache cleared
   - TODO: Implement encrypted cloud backup
4. **Single-Device**: Keys not synced across devices
   - TODO: Add key export/import feature

### Browser Compatibility

- ✅ Chrome/Edge 89+
- ✅ Firefox 89+
- ✅ Safari 15.2+
- ❌ Internet Explorer (no WASM support)

### Testing

```bash
# Run Rust tests (native)
cd ../crates/fhe-client
cargo test

# Run web dev server
npm run dev

# Test in browser:
# 1. Navigate to http://localhost:5173/setup
# 2. Click "Generate FHE Keys"
# 3. Wait 10-30 seconds
# 4. Navigate to a market page
# 5. Place an encrypted bet
# 6. Verify commitment hash appears
```

## Security Considerations

⚠️ **Current Security Status**: Development build only

1. **Wallet Encryption**: Seed phrases stored in plaintext
   - TODO: Encrypt with user password
2. **HTTPS Required**: Production needs HTTPS for WASM/SharedArrayBuffer
3. **Key Management**: FHE keys stored locally without backup
4. **Nonce Backup**: Critical for claiming - implement backup system

## Next Steps

See main project README for development roadmap:
- ✅ **Epic 2: FHE Integration** - Complete! (TFHE WASM)
- 🚧 Epic 3: Wallet Integration (monero-ts)
- 🚧 Epic 4: Coordinator API Extensions
- 🚧 Epic 5: Betting Flow
- 🚧 Epic 6: Claiming Flow
- 🚧 Epic 7: Polish & Documentation

## Links

- Main Project: ../README.md
- CLI Bettor: ../src/bin/bettor.rs
- Coordinator: ../src/bin/monero-predict.rs
