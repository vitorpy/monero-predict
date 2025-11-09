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
- **FHE**: tfhe-rs (compiled to WASM, future)
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

## Security Considerations

⚠️ **Current Security Status**: Development build only

1. **Wallet Encryption**: Seed phrases stored in plaintext
   - TODO: Encrypt with user password
2. **HTTPS Required**: Production needs HTTPS for WASM/SharedArrayBuffer
3. **Key Management**: FHE keys stored locally without backup
4. **Nonce Backup**: Critical for claiming - implement backup system

## Next Steps

See main project README for development roadmap:
- Epic 2: FHE Integration (TFHE WASM)
- Epic 3: Wallet Integration (monero-ts)
- Epic 4: Coordinator API Extensions
- Epic 5: Betting Flow
- Epic 6: Claiming Flow
- Epic 7: Polish & Documentation

## Links

- Main Project: ../README.md
- CLI Bettor: ../src/bin/bettor.rs
- Coordinator: ../src/bin/monero-predict.rs
