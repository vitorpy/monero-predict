import { writable, derived, type Readable } from 'svelte/store';
import { db, getWallet, type WalletData } from '$lib/services/storage';
import { liveQuery } from 'dexie';

export interface WalletState {
	initialized: boolean;
	address: string | null;
	balance: bigint; // In atomic units (piconeros)
	unlockedBalance: bigint; // In atomic units
	syncHeight: number;
	daemonHeight: number;
	syncing: boolean;
	syncProgress: number; // 0-100
}

const initialState: WalletState = {
	initialized: false,
	address: null,
	balance: 0n,
	unlockedBalance: 0n,
	syncHeight: 0,
	daemonHeight: 0,
	syncing: false,
	syncProgress: 0
};

// Main wallet state store
export const walletStore = writable<WalletState>(initialState);

// Derived stores for convenient access
export const walletAddress: Readable<string | null> = derived(
	walletStore,
	($wallet) => $wallet.address
);

export const walletBalance: Readable<number> = derived(walletStore, ($wallet) => {
	// Convert piconeros to XMR (1 XMR = 1e12 piconeros)
	return Number($wallet.balance) / 1e12;
});

export const walletUnlockedBalance: Readable<number> = derived(walletStore, ($wallet) => {
	return Number($wallet.unlockedBalance) / 1e12;
});

export const walletSyncing: Readable<boolean> = derived(walletStore, ($wallet) => $wallet.syncing);

export const walletSyncProgress: Readable<number> = derived(
	walletStore,
	($wallet) => $wallet.syncProgress
);

// Load wallet from IndexedDB on init
export async function initWalletStore(): Promise<void> {
	const walletData = await getWallet();
	if (walletData) {
		walletStore.update((state) => ({
			...state,
			initialized: true,
			address: walletData.primaryAddress
		}));
	}
}

// Update wallet state
export function updateWalletState(updates: Partial<WalletState>): void {
	walletStore.update((state) => ({ ...state, ...updates }));
}

// Reset wallet state
export function resetWalletStore(): void {
	walletStore.set(initialState);
}
