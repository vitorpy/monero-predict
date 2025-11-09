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
	seedPhrase: string; // TODO: Encrypt with user password
	password: string; // TODO: Hash this
	primaryAddress: string;
	createdAt: number;
	lastSync: number;
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

	const blob = new Blob([bet.nonce], { type: 'application/octet-stream' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `bet_${betId.substring(0, 8)}.nonce`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export async function clearAllData(): Promise<void> {
	await db.clientKeys.clear();
	await db.fheKeys.clear();
	await db.wallet.clear();
	await db.bets.clear();
	console.log('[Storage] All data cleared');
}
