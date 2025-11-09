import { writable, derived, type Readable } from 'svelte/store';
import { type Bet, getAllBets, getBetsByStatus } from '$lib/services/storage';

export interface BetsState {
	all: Bet[];
	loading: boolean;
	error: string | null;
}

const initialState: BetsState = {
	all: [],
	loading: false,
	error: null
};

// Main bets state store
export const betsStore = writable<BetsState>(initialState);

// Derived stores for filtering bets by status
export const activeBets: Readable<Bet[]> = derived(betsStore, ($bets) =>
	$bets.all.filter((bet) => bet.status === 'active' || bet.status === 'pending')
);

export const resolvedBets: Readable<Bet[]> = derived(betsStore, ($bets) =>
	$bets.all.filter((bet) => bet.status === 'resolved')
);

export const claimedBets: Readable<Bet[]> = derived(betsStore, ($bets) =>
	$bets.all.filter((bet) => bet.status === 'claimed')
);

export const betCount: Readable<number> = derived(betsStore, ($bets) => $bets.all.length);

// Load all bets from IndexedDB
export async function loadBets(): Promise<void> {
	betsStore.update((state) => ({ ...state, loading: true, error: null }));

	try {
		const bets = await getAllBets();
		betsStore.update((state) => ({
			...state,
			all: bets,
			loading: false
		}));
	} catch (error) {
		betsStore.update((state) => ({
			...state,
			loading: false,
			error: error instanceof Error ? error.message : 'Failed to load bets'
		}));
	}
}

// Add a new bet to the store
export function addBet(bet: Bet): void {
	betsStore.update((state) => ({
		...state,
		all: [bet, ...state.all]
	}));
}

// Update an existing bet
export function updateBet(betId: string, updates: Partial<Bet>): void {
	betsStore.update((state) => ({
		...state,
		all: state.all.map((bet) => (bet.betId === betId ? { ...bet, ...updates } : bet))
	}));
}

// Remove a bet
export function removeBet(betId: string): void {
	betsStore.update((state) => ({
		...state,
		all: state.all.filter((bet) => bet.betId !== betId)
	}));
}

// Reset bets store
export function resetBetsStore(): void {
	betsStore.set(initialState);
}
