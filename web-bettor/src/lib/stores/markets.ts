import { writable, type Readable, derived } from 'svelte/store';

export interface Market {
	id: string;
	title: string;
	description: string;
	resolutionDate: string;
	totalPool: number; // In XMR
	status: 'active' | 'resolved' | 'cancelled';
	oracleType: string;
	multisigAddress: string;
	resolvedOutcome?: 'YES' | 'NO';
}

export interface MarketsState {
	all: Market[];
	loading: boolean;
	error: string | null;
	lastFetch: number;
}

const initialState: MarketsState = {
	all: [],
	loading: false,
	error: null,
	lastFetch: 0
};

// Main markets state store
export const marketsStore = writable<MarketsState>(initialState);

// Derived stores for filtering markets
export const activeMarkets: Readable<Market[]> = derived(marketsStore, ($markets) =>
	$markets.all.filter((market) => market.status === 'active')
);

export const resolvedMarkets: Readable<Market[]> = derived(marketsStore, ($markets) =>
	$markets.all.filter((market) => market.status === 'resolved')
);

export const marketCount: Readable<number> = derived(marketsStore, ($markets) => $markets.all.length);

// Fetch markets from coordinator API
export async function fetchMarkets(coordinatorUrl: string = 'http://localhost:8080'): Promise<void> {
	marketsStore.update((state) => ({ ...state, loading: true, error: null }));

	try {
		const response = await fetch(`${coordinatorUrl}/markets`);
		if (!response.ok) {
			throw new Error(`Failed to fetch markets: ${response.statusText}`);
		}

		const markets: Market[] = await response.json();
		marketsStore.update((state) => ({
			...state,
			all: markets,
			loading: false,
			lastFetch: Date.now()
		}));
	} catch (error) {
		marketsStore.update((state) => ({
			...state,
			loading: false,
			error: error instanceof Error ? error.message : 'Failed to fetch markets'
		}));
	}
}

// Get a single market by ID
export async function fetchMarket(
	marketId: string,
	coordinatorUrl: string = 'http://localhost:8080'
): Promise<Market | null> {
	try {
		const response = await fetch(`${coordinatorUrl}/market/${marketId}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch market: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching market:', error);
		return null;
	}
}

// Update a market in the store
export function updateMarket(marketId: string, updates: Partial<Market>): void {
	marketsStore.update((state) => ({
		...state,
		all: state.all.map((market) => (market.id === marketId ? { ...market, ...updates } : market))
	}));
}

// Reset markets store
export function resetMarketsStore(): void {
	marketsStore.set(initialState);
}
