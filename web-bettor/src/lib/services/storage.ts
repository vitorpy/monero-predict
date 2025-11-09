import Dexie, { type EntityTable } from 'dexie';

// Database schema interfaces
export interface ClientKey {
	id: string;
	keyData: Uint8Array;
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
	wallet!: EntityTable<WalletData, 'id'>;
	bets!: EntityTable<Bet, 'betId'>;

	constructor() {
		super('BettorDB');

		this.version(1).stores({
			// Define tables and indexes
			clientKeys: 'id, createdAt',
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
	await db.wallet.clear();
	await db.bets.clear();
}
