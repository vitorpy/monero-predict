/**
 * Wallet Web Worker
 *
 * Handles monero-ts wallet operations off the main thread.
 * Prevents UI blocking during sync and transaction creation.
 */

import type {
	MoneroWalletFull,
	MoneroWalletConfig,
	MoneroTxConfig,
	MoneroSyncResult
} from 'monero-ts';

// Worker message types
export type WalletWorkerRequest =
	| { type: 'init' }
	| {
			type: 'create_wallet';
			password: string;
			networkType?: 'mainnet' | 'testnet' | 'stagenet';
			daemonUri?: string;
	  }
	| {
			type: 'restore_wallet';
			seed: string;
			password: string;
			restoreHeight?: number;
			networkType?: 'mainnet' | 'testnet' | 'stagenet';
			daemonUri?: string;
	  }
	| { type: 'close_wallet' }
	| { type: 'sync'; startHeight?: number }
	| { type: 'get_balance' }
	| { type: 'get_primary_address' }
	| { type: 'get_seed' }
	| {
			type: 'create_tx';
			address: string;
			amount: bigint;
			priority?: number;
			relay: boolean;
	  };

export type WalletWorkerResponse =
	| { type: 'init_complete' }
	| {
			type: 'wallet_created';
			seed: string;
			primaryAddress: string;
	  }
	| {
			type: 'wallet_restored';
			primaryAddress: string;
	  }
	| { type: 'wallet_closed' }
	| {
			type: 'sync_progress';
			height: number;
			startHeight: number;
			endHeight: number;
			percentDone: number;
			message: string;
	  }
	| {
			type: 'sync_complete';
			height: number;
	  }
	| {
			type: 'balance';
			balance: string; // bigint as string for serialization
			unlocked: string;
	  }
	| {
			type: 'address';
			address: string;
	  }
	| {
			type: 'seed';
			seed: string;
	  }
	| {
			type: 'tx_created';
			txHash: string;
			fee: string; // bigint as string
			relayed: boolean;
	  }
	| {
			type: 'error';
			error: string;
	  };

// Worker context
const ctx: Worker = self as any;

// Wallet instance
let wallet: MoneroWalletFull | null = null;
let moneroTs: typeof import('monero-ts') | null = null;

// Handle incoming messages
ctx.addEventListener('message', async (event: MessageEvent<WalletWorkerRequest>) => {
	try {
		await handleMessage(event.data);
	} catch (error) {
		console.error('[Wallet Worker] Error:', error);
		ctx.postMessage({
			type: 'error',
			error: error instanceof Error ? error.message : 'Unknown error'
		} satisfies WalletWorkerResponse);
	}
});

async function handleMessage(request: WalletWorkerRequest): Promise<void> {
	switch (request.type) {
		case 'init':
			await initMoneroTs();
			break;

		case 'create_wallet':
			await createWallet(request.password, request.networkType, request.daemonUri);
			break;

		case 'restore_wallet':
			await restoreWallet(
				request.seed,
				request.password,
				request.restoreHeight,
				request.networkType,
				request.daemonUri
			);
			break;

		case 'close_wallet':
			await closeWallet();
			break;

		case 'sync':
			await syncWallet(request.startHeight);
			break;

		case 'get_balance':
			await getBalance();
			break;

		case 'get_primary_address':
			await getPrimaryAddress();
			break;

		case 'get_seed':
			await getSeed();
			break;

		case 'create_tx':
			await createTransaction(request.address, request.amount, request.priority, request.relay);
			break;

		default:
			throw new Error(`Unknown request type: ${(request as any).type}`);
	}
}

/**
 * Initialize monero-ts WASM
 */
async function initMoneroTs(): Promise<void> {
	console.log('[Wallet Worker] Initializing monero-ts...');

	// Import monero-ts (dynamic import for WASM)
	moneroTs = await import('monero-ts');

	console.log('[Wallet Worker] monero-ts initialized');

	ctx.postMessage({ type: 'init_complete' } satisfies WalletWorkerResponse);
}

/**
 * Create new wallet
 */
async function createWallet(
	password: string,
	networkType: 'mainnet' | 'testnet' | 'stagenet' = 'mainnet',
	daemonUri: string = 'https://node.vern.cc:18081'
): Promise<void> {
	if (!moneroTs) throw new Error('monero-ts not initialized');
	if (wallet) throw new Error('Wallet already open');

	console.log(`[Wallet Worker] Creating wallet (${networkType})...`);

	// Type assertion needed: monero-ts types are incomplete
	const config = {
		password,
		networkType,
		server: daemonUri,
		proxyToWorker: false // Already in worker!
	} as unknown as MoneroWalletConfig;

	wallet = await moneroTs.createWalletFull(config);

	const seed = await wallet.getSeed();
	const primaryAddress = await wallet.getPrimaryAddress();

	console.log('[Wallet Worker] Wallet created:', primaryAddress);

	ctx.postMessage({
		type: 'wallet_created',
		seed,
		primaryAddress
	} satisfies WalletWorkerResponse);
}

/**
 * Restore wallet from seed phrase
 */
async function restoreWallet(
	seed: string,
	password: string,
	restoreHeight: number = 0,
	networkType: 'mainnet' | 'testnet' | 'stagenet' = 'mainnet',
	daemonUri: string = 'https://node.vern.cc:18081'
): Promise<void> {
	if (!moneroTs) throw new Error('monero-ts not initialized');
	if (wallet) throw new Error('Wallet already open');

	console.log(`[Wallet Worker] Restoring wallet from seed (${networkType})...`);

	// Type assertion needed: monero-ts types are incomplete
	const config = {
		password,
		networkType,
		server: daemonUri,
		seed,
		restoreHeight,
		proxyToWorker: false // Already in worker!
	} as unknown as MoneroWalletConfig;

	wallet = await moneroTs.createWalletFull(config);

	const primaryAddress = await wallet.getPrimaryAddress();

	console.log('[Wallet Worker] Wallet restored:', primaryAddress);

	ctx.postMessage({
		type: 'wallet_restored',
		primaryAddress
	} satisfies WalletWorkerResponse);
}

/**
 * Close wallet
 */
async function closeWallet(): Promise<void> {
	if (!wallet) throw new Error('No wallet open');

	await wallet.close();
	wallet = null;

	console.log('[Wallet Worker] Wallet closed');

	ctx.postMessage({ type: 'wallet_closed' } satisfies WalletWorkerResponse);
}

/**
 * Sync wallet with blockchain
 */
async function syncWallet(startHeight?: number): Promise<void> {
	if (!wallet) throw new Error('No wallet open');

	console.log('[Wallet Worker] Starting sync...');

	// Sync with progress listener (pass as MoneroWalletListener)
	const listener = {
		onSyncProgress: (height: number, startHeight: number, endHeight: number, percentDone: number, message: string) => {
			ctx.postMessage({
				type: 'sync_progress',
				height,
				startHeight,
				endHeight,
				percentDone,
				message
			} satisfies WalletWorkerResponse);
		}
	} as any;

	const result = await wallet.sync(listener, startHeight);

	// MoneroSyncResult is the numeric height
	const syncHeight = typeof result === 'number' ? result : (result as any)?.height ?? 0;
	console.log('[Wallet Worker] Sync complete at height:', syncHeight);

	ctx.postMessage({
		type: 'sync_complete',
		height: syncHeight
	} satisfies WalletWorkerResponse);
}

/**
 * Get wallet balance
 */
async function getBalance(): Promise<void> {
	if (!wallet) throw new Error('No wallet open');

	const balance = await wallet.getBalance();
	const unlocked = await wallet.getUnlockedBalance();

	ctx.postMessage({
		type: 'balance',
		balance: balance.toString(),
		unlocked: unlocked.toString()
	} satisfies WalletWorkerResponse);
}

/**
 * Get primary address
 */
async function getPrimaryAddress(): Promise<void> {
	if (!wallet) throw new Error('No wallet open');

	const address = await wallet.getPrimaryAddress();

	ctx.postMessage({
		type: 'address',
		address
	} satisfies WalletWorkerResponse);
}

/**
 * Get seed phrase
 */
async function getSeed(): Promise<void> {
	if (!wallet) throw new Error('No wallet open');

	const seed = await wallet.getSeed();

	ctx.postMessage({
		type: 'seed',
		seed
	} satisfies WalletWorkerResponse);
}

/**
 * Create transaction
 */
async function createTransaction(
	address: string,
	amount: bigint,
	priority: number = 0,
	relay: boolean
): Promise<void> {
	if (!wallet) throw new Error('No wallet open');
	if (!moneroTs) throw new Error('monero-ts not initialized');

	console.log(`[Wallet Worker] Creating tx: ${amount} to ${address} (relay=${relay})`);

	const config = new moneroTs.MoneroTxConfig({
		accountIndex: 0,
		address,
		amount,
		priority,
		relay
	});

	const tx = await wallet.createTx(config);

	const txHash = tx.getHash();
	const fee = tx.getFee();

	console.log(`[Wallet Worker] Transaction created: ${txHash}, fee: ${fee}`);

	ctx.postMessage({
		type: 'tx_created',
		txHash,
		fee: fee.toString(),
		relayed: relay
	} satisfies WalletWorkerResponse);
}
