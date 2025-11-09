/**
 * FHE Service Layer
 *
 * Provides high-level API for Fully Homomorphic Encryption operations.
 * Handles WASM initialization, key management, and bet encryption.
 */

import type {
	WasmFheClient,
	JsEncryptedBet
} from '$lib/wasm/monero_predict_fhe_client';
import { loadFheKeys, saveFheKeys, hasFheKeys } from './storage';

// WASM module instance (lazy-loaded)
let wasmModule: typeof import('$lib/wasm/monero_predict_fhe_client') | null = null;
let fheClient: WasmFheClient | null = null;

/**
 * Encrypted bet data (TypeScript-friendly)
 */
export interface EncryptedBet {
	outcome: Uint8Array; // Encrypted FheUint8
	amount: Uint8Array; // Encrypted FheUint64
	commitment: Uint8Array; // SHA3-256 hash (32 bytes)
	nonce: Uint8Array; // Random nonce (32 bytes)
}

/**
 * Initialize WASM module (lazy)
 */
async function initWasm(): Promise<void> {
	if (wasmModule) return;

	console.log('[FHE] Initializing WASM module...');
	try {
		wasmModule = await import('$lib/wasm/monero_predict_fhe_client');
		console.log('[FHE] WASM module loaded successfully');
	} catch (error) {
		console.error('[FHE] Failed to load WASM module:', error);
		throw new Error('Failed to initialize FHE WASM module');
	}
}

/**
 * Load FHE client from stored keys
 */
async function loadClient(): Promise<WasmFheClient> {
	if (fheClient) return fheClient;

	await initWasm();
	if (!wasmModule) throw new Error('WASM module not initialized');

	console.log('[FHE] Loading FHE client from storage...');
	const keys = await loadFheKeys();
	if (!keys) {
		throw new Error('No FHE keys found. Please generate keys first.');
	}

	try {
		fheClient = wasmModule.WasmFheClient.from_bytes(keys.clientKeyData, keys.serverKeyData);
		console.log('[FHE] FHE client loaded successfully');
		return fheClient;
	} catch (error) {
		console.error('[FHE] Failed to load FHE client:', error);
		throw new Error('Failed to load FHE keys from storage');
	}
}

/**
 * Check if FHE keys are available
 */
export async function hasKeys(): Promise<boolean> {
	return await hasFheKeys();
}

/**
 * Generate new FHE keys (slow operation: 10-30 seconds)
 *
 * ⚠️ WARNING: This blocks the main thread! Use a Web Worker instead.
 *
 * @returns Promise that resolves when keys are generated and saved
 */
export async function generateKeys(): Promise<void> {
	await initWasm();
	if (!wasmModule) throw new Error('WASM module not initialized');

	console.log('[FHE] Generating new FHE keys (this may take 10-30 seconds)...');
	const startTime = Date.now();

	try {
		const client = new wasmModule.WasmFheClient();
		const clientKeyData = client.export_client_key();
		const serverKeyData = client.export_server_key();

		await saveFheKeys(clientKeyData, serverKeyData);

		fheClient = client;
		const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
		console.log(`[FHE] Keys generated and saved in ${elapsed}s`);
	} catch (error) {
		console.error('[FHE] Key generation failed:', error);
		throw new Error('Failed to generate FHE keys');
	}
}

/**
 * Encrypt a bet
 *
 * @param outcomeYes - true for YES, false for NO
 * @param amountXMR - Bet amount in XMR (will be converted to piconeros)
 * @returns Encrypted bet data
 */
export async function encryptBet(outcomeYes: boolean, amountXMR: number): Promise<EncryptedBet> {
	if (amountXMR <= 0) {
		throw new Error('Bet amount must be positive');
	}

	const client = await loadClient();

	// Convert XMR to piconeros (1 XMR = 1e12 piconeros)
	const piconeros = Math.floor(amountXMR * 1e12);

	if (piconeros > Number.MAX_SAFE_INTEGER) {
		throw new Error('Bet amount too large (exceeds safe integer limit)');
	}

	console.log(
		`[FHE] Encrypting bet: outcome=${outcomeYes ? 'YES' : 'NO'}, amount=${amountXMR} XMR (${piconeros} piconeros)`
	);

	try {
		const encrypted = client.encrypt_bet(outcomeYes, piconeros);

		// Convert JsEncryptedBet to EncryptedBet
		return {
			outcome: encrypted.outcome,
			amount: encrypted.amount,
			commitment: encrypted.commitment,
			nonce: encrypted.nonce
		};
	} catch (error) {
		console.error('[FHE] Encryption failed:', error);
		throw new Error('Failed to encrypt bet');
	}
}

/**
 * Decrypt outcome (for testing/verification only)
 *
 * @param ciphertext - Encrypted outcome bytes
 * @returns true for YES, false for NO
 */
export async function decryptOutcome(ciphertext: Uint8Array): Promise<boolean> {
	const client = await loadClient();

	try {
		return client.decrypt_outcome(ciphertext);
	} catch (error) {
		console.error('[FHE] Outcome decryption failed:', error);
		throw new Error('Failed to decrypt outcome');
	}
}

/**
 * Decrypt amount (for testing/verification only)
 *
 * @param ciphertext - Encrypted amount bytes
 * @returns Amount in piconeros
 */
export async function decryptAmount(ciphertext: Uint8Array): Promise<number> {
	const client = await loadClient();

	try {
		return client.decrypt_amount(ciphertext);
	} catch (error) {
		console.error('[FHE] Amount decryption failed:', error);
		throw new Error('Failed to decrypt amount');
	}
}

/**
 * Export server key for coordinator registration
 *
 * @returns Server key bytes (safe to send to coordinator)
 */
export async function exportServerKey(): Promise<Uint8Array> {
	const client = await loadClient();

	try {
		return client.export_server_key();
	} catch (error) {
		console.error('[FHE] Server key export failed:', error);
		throw new Error('Failed to export server key');
	}
}

/**
 * Reset FHE client (clear cached instance)
 *
 * Call this after deleting keys or generating new keys.
 */
export function resetClient(): void {
	fheClient = null;
	console.log('[FHE] Client cache cleared');
}

/**
 * Generate keys in a Web Worker (non-blocking)
 *
 * This is the recommended way to generate keys as it doesn't block the UI.
 *
 * @param onProgress - Callback for progress updates (0-100%)
 * @returns Promise that resolves when keys are generated and saved
 */
export async function generateKeysInWorker(
	onProgress?: (percent: number, message: string) => void
): Promise<void> {
	return new Promise((resolve, reject) => {
		console.log('[FHE] Starting key generation in Web Worker...');

		// Create worker
		const worker = new Worker(
			new URL('$lib/workers/fhe-keygen.worker.ts', import.meta.url),
			{ type: 'module' }
		);

		// Handle worker messages
		worker.addEventListener('message', async (event) => {
			const message = event.data;

			if (message.type === 'progress') {
				console.log(`[FHE] ${message.percent}% - ${message.message}`);
				onProgress?.(message.percent, message.message);
			} else if (message.type === 'success') {
				try {
					await saveFheKeys(message.clientKey, message.serverKey);
					resetClient(); // Clear cache to force reload
					worker.terminate();
					console.log('[FHE] Keys saved successfully');
					resolve();
				} catch (error) {
					worker.terminate();
					reject(error);
				}
			} else if (message.type === 'error') {
				worker.terminate();
				reject(new Error(message.error));
			}
		});

		// Handle worker errors
		worker.addEventListener('error', (error) => {
			console.error('[FHE] Worker error:', error);
			worker.terminate();
			reject(new Error('Worker failed: ' + error.message));
		});

		// Start generation
		worker.postMessage({ type: 'generate' });
	});
}
