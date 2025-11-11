import Dexie, { type EntityTable } from 'dexie';

// Database schema interfaces
export interface ClientKey {
	id: string;
	keyData: Uint8Array;
	createdAt: number;
}

export interface FheKeys {
	id: string;
	clientKeyData: Uint8Array; // ~20MB
	serverKeyData: Uint8Array; // ~115MB
	createdAt: number;
}

export interface WalletData {
	id: string;
	seedPhrase: string; // JSON-serialized EncryptedData (encrypted with user password via crypto.ts)
	password: string; // DEPRECATED: Never store password, leave empty
	primaryAddress: string;
	createdAt: number;
	lastSync: number; // Last blockchain height synced
}

export interface WalletCache {
	id: string;
	balance: string; // bigint as string
	unlockedBalance: string; // bigint as string
	syncHeight: number;
	lastUpdated: number;
}

export interface Bet {
	betId: string;
	marketId: string;
	nonce: Uint8Array;
	commitment: string;
	txHash: string;
	amount: number; // In XMR
	outcome: 'YES' | 'NO';
	timestamp: number;
	status: 'pending' | 'active' | 'resolved' | 'claimed';
	payoutAmount?: number; // In XMR, set when claimed
	payoutAddress?: string; // Set when claiming
}

// Dexie database class
class BettorDatabase extends Dexie {
	clientKeys!: EntityTable<ClientKey, 'id'>;
	fheKeys!: EntityTable<FheKeys, 'id'>;
	wallet!: EntityTable<WalletData, 'id'>;
	walletCache!: EntityTable<WalletCache, 'id'>;
	bets!: EntityTable<Bet, 'betId'>;

	constructor() {
		super('BettorDB');

		// Version 1: Initial schema
		this.version(1).stores({
			clientKeys: 'id, createdAt',
			wallet: 'id, primaryAddress, lastSync',
			bets: 'betId, marketId, timestamp, status, [marketId+status]'
		});

		// Version 2: Add FHE keys table for large binary data (~135MB total)
		this.version(2).stores({
			clientKeys: 'id, createdAt',
			fheKeys: 'id, createdAt',
			wallet: 'id, primaryAddress, lastSync',
			bets: 'betId, marketId, timestamp, status, [marketId+status]'
		});

		// Version 3: Add wallet cache for performance
		this.version(3).stores({
			clientKeys: 'id, createdAt',
			fheKeys: 'id, createdAt',
			wallet: 'id, primaryAddress, lastSync',
			walletCache: 'id, lastUpdated',
			bets: 'betId, marketId, timestamp, status, [marketId+status]'
		});
	}
}

// Export singleton instance
export const db = new BettorDatabase();

// Helper functions for common operations

export async function saveClientKey(keyData: Uint8Array): Promise<void> {
	await db.clientKeys.put({
		id: 'default',
		keyData,
		createdAt: Date.now()
	});
}

export async function getClientKey(): Promise<ClientKey | undefined> {
	return await db.clientKeys.get('default');
}

// FHE key management
export async function saveFheKeys(
	clientKeyData: Uint8Array,
	serverKeyData: Uint8Array
): Promise<void> {
	const totalSize = clientKeyData.byteLength + serverKeyData.byteLength;
	console.log(
		`[Storage] Saving FHE keys: client=${(clientKeyData.byteLength / 1024 / 1024).toFixed(1)}MB, server=${(serverKeyData.byteLength / 1024 / 1024).toFixed(1)}MB, total=${(totalSize / 1024 / 1024).toFixed(1)}MB`
	);

	try {
		await db.fheKeys.put({
			id: 'default',
			clientKeyData,
			serverKeyData,
			createdAt: Date.now()
		});
		console.log('[Storage] FHE keys saved successfully');
	} catch (error) {
		if (error instanceof Error && error.name === 'QuotaExceededError') {
			console.error('[Storage] Quota exceeded! FHE keys are ~135MB. Check browser storage limits.');
			throw new Error(
				'Storage quota exceeded. FHE keys require ~135MB. Please free up space or use a different browser.'
			);
		}
		throw error;
	}
}

export async function loadFheKeys(): Promise<FheKeys | null> {
	const keys = await db.fheKeys.get('default');
	if (keys) {
		const totalSize = keys.clientKeyData.byteLength + keys.serverKeyData.byteLength;
		console.log(`[Storage] Loaded FHE keys: ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
	}
	return keys ?? null;
}

export async function deleteFheKeys(): Promise<void> {
	await db.fheKeys.delete('default');
	console.log('[Storage] FHE keys deleted');
}

export async function hasFheKeys(): Promise<boolean> {
	const keys = await db.fheKeys.get('default');
	return keys !== undefined;
}

export async function saveWallet(data: Omit<WalletData, 'id' | 'createdAt'>): Promise<void> {
	await db.wallet.put({
		id: 'default',
		...data,
		createdAt: Date.now()
	});
}

export async function getWallet(): Promise<WalletData | undefined> {
	return await db.wallet.get('default');
}

export async function saveBet(bet: Bet): Promise<void> {
	await db.bets.put(bet);
}

export async function getBet(betId: string): Promise<Bet | undefined> {
	return await db.bets.get(betId);
}

export async function getBetsByMarket(marketId: string): Promise<Bet[]> {
	return await db.bets.where('marketId').equals(marketId).toArray();
}

export async function getBetsByStatus(status: Bet['status']): Promise<Bet[]> {
	return await db.bets.where('status').equals(status).sortBy('timestamp');
}

export async function getAllBets(): Promise<Bet[]> {
	return await db.bets.orderBy('timestamp').reverse().toArray();
}

export async function updateBetStatus(
	betId: string,
	status: Bet['status'],
	updates?: Partial<Bet>
): Promise<void> {
	await db.bets.update(betId, { status, ...updates });
}

export async function downloadNonceFile(betId: string): Promise<void> {
	const bet = await getBet(betId);
	if (!bet) {
		throw new Error('Bet not found');
	}

	// Create blob from Uint8Array
	const blob = new Blob([bet.nonce as BlobPart], { type: 'application/octet-stream' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `bet_${betId.substring(0, 8)}.nonce`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

// Wallet cache management
export async function saveWalletCache(
	balance: bigint,
	unlockedBalance: bigint,
	syncHeight: number
): Promise<void> {
	await db.walletCache.put({
		id: 'default',
		balance: balance.toString(),
		unlockedBalance: unlockedBalance.toString(),
		syncHeight,
		lastUpdated: Date.now()
	});
}

export async function getWalletCache(): Promise<WalletCache | undefined> {
	return await db.walletCache.get('default');
}

export async function clearWalletCache(): Promise<void> {
	await db.walletCache.delete('default');
	console.log('[Storage] Wallet cache cleared');
}

export async function clearAllData(): Promise<void> {
	await db.clientKeys.clear();
	await db.fheKeys.clear();
	await db.wallet.clear();
	await db.walletCache.clear();
	await db.bets.clear();
	console.log('[Storage] All data cleared');
}

// Data export/import for backup/restore
export interface ExportData {
	version: number;
	exportDate: number;
	fheKeys?: FheKeys;
	wallet?: WalletData;
	walletCache?: WalletCache;
	bets: Bet[];
}

export async function exportAllData(): Promise<Blob> {
	console.log('[Storage] Exporting all data...');

	const exportData: ExportData = {
		version: 1,
		exportDate: Date.now(),
		fheKeys: (await db.fheKeys.get('default')) || undefined,
		wallet: (await db.wallet.get('default')) || undefined,
		walletCache: (await db.walletCache.get('default')) || undefined,
		bets: await db.bets.toArray()
	};

	// Convert Uint8Arrays to base64 for JSON serialization
	const serialized = JSON.stringify(
		exportData,
		(key, value) => {
			if (value instanceof Uint8Array) {
				return {
					__type: 'Uint8Array',
					data: Array.from(value)
				};
			}
			return value;
		},
		2
	);

	const blob = new Blob([serialized], { type: 'application/json' });
	const sizeMB = (blob.size / 1024 / 1024).toFixed(2);
	console.log(`[Storage] Export complete: ${sizeMB}MB`);

	return blob;
}

export async function importAllData(file: File): Promise<void> {
	console.log('[Storage] Importing data from file...');

	const text = await file.text();
	const parsed = JSON.parse(text, (key, value) => {
		// Restore Uint8Arrays from base64
		if (value && typeof value === 'object' && value.__type === 'Uint8Array') {
			return new Uint8Array(value.data);
		}
		return value;
	});

	const data = parsed as ExportData;

	// Validate version
	if (data.version !== 1) {
		throw new Error(`Unsupported export version: ${data.version}`);
	}

	// Clear existing data first
	console.log('[Storage] Clearing existing data...');
	await clearAllData();

	// Import FHE keys
	if (data.fheKeys) {
		await db.fheKeys.put(data.fheKeys);
		console.log('[Storage] FHE keys imported');
	}

	// Import wallet
	if (data.wallet) {
		await db.wallet.put(data.wallet);
		console.log('[Storage] Wallet imported');
	}

	// Import wallet cache
	if (data.walletCache) {
		await db.walletCache.put(data.walletCache);
		console.log('[Storage] Wallet cache imported');
	}

	// Import bets
	if (data.bets && data.bets.length > 0) {
		await db.bets.bulkPut(data.bets);
		console.log(`[Storage] ${data.bets.length} bets imported`);
	}

	console.log('[Storage] Import complete');
}

export async function getExportStats(): Promise<{
	hasFheKeys: boolean;
	hasWallet: boolean;
	betCount: number;
	estimatedSizeMB: number;
}> {
	const fheKeys = await db.fheKeys.get('default');
	const wallet = await db.wallet.get('default');
	const betCount = await db.bets.count();

	let estimatedSize = 0;
	if (fheKeys) {
		estimatedSize += fheKeys.clientKeyData.byteLength + fheKeys.serverKeyData.byteLength;
	}
	if (wallet) {
		estimatedSize += wallet.seedPhrase.length * 2; // Rough estimate
	}
	estimatedSize += betCount * 1000; // ~1KB per bet estimate

	return {
		hasFheKeys: !!fheKeys,
		hasWallet: !!wallet,
		betCount,
		estimatedSizeMB: estimatedSize / 1024 / 1024
	};
}
