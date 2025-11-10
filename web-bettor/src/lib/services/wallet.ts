/**
 * Wallet Service Layer
 *
 * High-level API for Monero wallet operations via Web Worker.
 * Handles wallet creation, restoration, syncing, and transactions.
 */

import type {
	WalletWorkerRequest,
	WalletWorkerResponse
} from '$lib/workers/wallet.worker';
import { encrypt, decrypt, type EncryptedData } from '$lib/utils/crypto';
import { getWallet, saveWallet, saveWalletCache, getWalletCache } from './storage';

// Wallet worker instance (lazy-loaded)
let walletWorker: Worker | null = null;

/**
 * Wallet state
 */
export interface WalletState {
	primaryAddress: string;
	balance: bigint;
	unlockedBalance: bigint;
	syncing: boolean;
	syncProgress: number;
	syncHeight: number;
	isInitialized: boolean;
}

/**
 * Transaction result
 */
export interface TransactionResult {
	txHash: string;
	fee: bigint;
	relayed: boolean;
}

/**
 * Initialize wallet worker
 */
async function initWorker(): Promise<Worker> {
	if (walletWorker) return walletWorker;

	console.log('[Wallet] Initializing wallet worker...');
	walletWorker = new Worker(
		new URL('$lib/workers/wallet.worker.ts', import.meta.url),
		{ type: 'module' }
	);

	// Wait for init complete
	await sendRequest({ type: 'init' });

	console.log('[Wallet] Wallet worker initialized');
	return walletWorker;
}

/**
 * Send request to wallet worker and wait for response
 */
function sendRequest(request: WalletWorkerRequest): Promise<WalletWorkerResponse> {
	return new Promise((resolve, reject) => {
		if (!walletWorker) {
			reject(new Error('Wallet worker not initialized'));
			return;
		}

		const handleMessage = (event: MessageEvent<WalletWorkerResponse>) => {
			const response = event.data;

			// Handle progress updates (don't resolve promise)
			if (response.type === 'sync_progress') {
				// Progress updates are handled separately
				return;
			}

			// Handle errors
			if (response.type === 'error') {
				walletWorker?.removeEventListener('message', handleMessage);
				reject(new Error(response.error));
				return;
			}

			// Resolve with response
			walletWorker?.removeEventListener('message', handleMessage);
			resolve(response);
		};

		walletWorker.addEventListener('message', handleMessage);
		walletWorker.postMessage(request);
	});
}

/**
 * Check if wallet is initialized in storage
 */
export async function hasWallet(): Promise<boolean> {
	const wallet = await getWallet();
	return wallet !== undefined;
}

/**
 * Create new wallet
 *
 * @param password - Password to encrypt seed phrase
 * @returns Promise with seed phrase and primary address
 */
export async function createWallet(
	password: string,
	networkType: 'mainnet' | 'testnet' | 'stagenet' = 'mainnet',
	daemonUri: string = 'https://node.vern.cc:18081'
): Promise<{ seed: string; primaryAddress: string }> {
	await initWorker();

	console.log('[Wallet] Creating new wallet...');

	const response = (await sendRequest({
		type: 'create_wallet',
		password,
		networkType,
		daemonUri
	})) as Extract<WalletWorkerResponse, { type: 'wallet_created' }>;

	// Encrypt and save seed phrase
	const encryptedSeed = await encrypt(response.seed, password);
	await saveWallet({
		seedPhrase: JSON.stringify(encryptedSeed), // Store encrypted
		password: '', // Don't store password
		primaryAddress: response.primaryAddress,
		lastSync: 0
	});

	console.log('[Wallet] Wallet created:', response.primaryAddress);

	return {
		seed: response.seed,
		primaryAddress: response.primaryAddress
	};
}

/**
 * Restore wallet from seed phrase
 *
 * @param seed - 25-word Monero seed phrase
 * @param password - Password to encrypt seed phrase
 * @param restoreHeight - Blockchain height to start scanning from
 * @returns Promise with primary address
 */
export async function restoreWallet(
	seed: string,
	password: string,
	restoreHeight: number = 0,
	networkType: 'mainnet' | 'testnet' | 'stagenet' = 'mainnet',
	daemonUri: string = 'https://node.vern.cc:18081'
): Promise<{ primaryAddress: string }> {
	await initWorker();

	console.log('[Wallet] Restoring wallet from seed...');

	const response = (await sendRequest({
		type: 'restore_wallet',
		seed,
		password,
		restoreHeight,
		networkType,
		daemonUri
	})) as Extract<WalletWorkerResponse, { type: 'wallet_restored' }>;

	// Encrypt and save seed phrase
	const encryptedSeed = await encrypt(seed, password);
	await saveWallet({
		seedPhrase: JSON.stringify(encryptedSeed), // Store encrypted
		password: '', // Don't store password
		primaryAddress: response.primaryAddress,
		lastSync: restoreHeight
	});

	console.log('[Wallet] Wallet restored:', response.primaryAddress);

	return {
		primaryAddress: response.primaryAddress
	};
}

/**
 * Close wallet
 */
export async function closeWallet(): Promise<void> {
	if (!walletWorker) return;

	await sendRequest({ type: 'close_wallet' });
	console.log('[Wallet] Wallet closed');
}

/**
 * Sync wallet with blockchain
 *
 * @param onProgress - Callback for sync progress updates
 * @returns Promise that resolves when sync is complete
 */
export async function syncWallet(
	onProgress?: (progress: number, height: number, message: string) => void
): Promise<number> {
	await initWorker();

	console.log('[Wallet] Starting wallet sync...');

	return new Promise((resolve, reject) => {
		if (!walletWorker) {
			reject(new Error('Wallet worker not initialized'));
			return;
		}

		const handleMessage = async (event: MessageEvent<WalletWorkerResponse>) => {
			const response = event.data;

			if (response.type === 'sync_progress') {
				onProgress?.(response.percentDone, response.height, response.message);
			} else if (response.type === 'sync_complete') {
				walletWorker?.removeEventListener('message', handleMessage);
				console.log('[Wallet] Sync complete at height:', response.height);

				// Fetch and cache balance after sync
				try {
					const balance = await getBalance();
					await saveWalletCache(balance.balance, balance.unlocked, response.height);
					console.log('[Wallet] Balance cached:', balance);
				} catch (error) {
					console.warn('[Wallet] Failed to cache balance after sync:', error);
				}

				resolve(response.height);
			} else if (response.type === 'error') {
				walletWorker?.removeEventListener('message', handleMessage);
				reject(new Error(response.error));
			}
		};

		walletWorker.addEventListener('message', handleMessage);
		walletWorker.postMessage({ type: 'sync' } satisfies WalletWorkerRequest);
	});
}

/**
 * Get wallet balance
 *
 * @param useCache - If true, return cached balance if available (faster)
 * @returns Promise with balance and unlocked balance in atomic units (piconeros)
 */
export async function getBalance(
	useCache: boolean = false
): Promise<{ balance: bigint; unlocked: bigint }> {
	// Return cached balance if requested and available
	if (useCache) {
		const cached = await getWalletCache();
		if (cached) {
			return {
				balance: BigInt(cached.balance),
				unlocked: BigInt(cached.unlockedBalance)
			};
		}
	}

	await initWorker();

	const response = (await sendRequest({
		type: 'get_balance'
	})) as Extract<WalletWorkerResponse, { type: 'balance' }>;

	const balance = {
		balance: BigInt(response.balance),
		unlocked: BigInt(response.unlocked)
	};

	// Update cache
	const cached = await getWalletCache();
	await saveWalletCache(balance.balance, balance.unlocked, cached?.syncHeight ?? 0);

	return balance;
}

/**
 * Get primary wallet address
 *
 * @returns Promise with primary address
 */
export async function getPrimaryAddress(): Promise<string> {
	await initWorker();

	const response = (await sendRequest({
		type: 'get_primary_address'
	})) as Extract<WalletWorkerResponse, { type: 'address' }>;

	return response.address;
}

/**
 * Get seed phrase (decrypted)
 *
 * @param password - Password to decrypt seed phrase
 * @returns Promise with 25-word seed phrase
 */
export async function getSeedPhrase(password: string): Promise<string> {
	const walletData = await getWallet();
	if (!walletData) {
		throw new Error('No wallet found in storage');
	}

	// Decrypt seed phrase
	const encryptedSeed = JSON.parse(walletData.seedPhrase) as EncryptedData;
	const seed = await decrypt(encryptedSeed, password);

	return seed;
}

/**
 * Create transaction
 *
 * @param address - Recipient address
 * @param amount - Amount in XMR (will be converted to piconeros)
 * @param relay - Whether to broadcast transaction (true) or just create it (false)
 * @returns Promise with transaction hash and fee
 */
export async function createTransaction(
	address: string,
	amountXMR: number,
	relay: boolean = false,
	priority: number = 0
): Promise<TransactionResult> {
	await initWorker();

	// Convert XMR to piconeros (1 XMR = 1e12 piconeros)
	const piconeros = Math.floor(amountXMR * 1e12);

	if (piconeros > Number.MAX_SAFE_INTEGER) {
		throw new Error('Amount too large (exceeds safe integer limit)');
	}

	console.log(
		`[Wallet] Creating transaction: ${amountXMR} XMR (${piconeros} piconeros) to ${address}`
	);

	const response = (await sendRequest({
		type: 'create_tx',
		address,
		amount: BigInt(piconeros),
		priority,
		relay
	})) as Extract<WalletWorkerResponse, { type: 'tx_created' }>;

	console.log(`[Wallet] Transaction created: ${response.txHash}, fee: ${response.fee}`);

	return {
		txHash: response.txHash,
		fee: BigInt(response.fee),
		relayed: response.relayed
	};
}

/**
 * Reset wallet worker (clear cached instance)
 *
 * Call this after restoring from a different seed or changing networks.
 */
export function resetWorker(): void {
	if (walletWorker) {
		walletWorker.terminate();
		walletWorker = null;
		console.log('[Wallet] Worker terminated');
	}
}

/**
 * Format piconeros to XMR
 *
 * @param piconeros - Amount in piconeros (atomic units)
 * @returns Amount in XMR as string (6 decimal places)
 */
export function formatXMR(piconeros: bigint): string {
	const xmr = Number(piconeros) / 1e12;
	return xmr.toFixed(6);
}

/**
 * Parse XMR to piconeros
 *
 * @param xmr - Amount in XMR
 * @returns Amount in piconeros (atomic units)
 */
export function parseXMR(xmr: number): bigint {
	return BigInt(Math.floor(xmr * 1e12));
}
