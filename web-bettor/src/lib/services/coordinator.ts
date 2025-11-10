/**
 * Coordinator API Client
 *
 * Handles communication with the coordinator server.
 * For now, this is a stub - actual API endpoints will be implemented when coordinator is ready.
 */

export interface CoordinatorConfig {
	apiUrl: string;
}

// Default configuration
const defaultConfig: CoordinatorConfig = {
	apiUrl: import.meta.env.VITE_COORDINATOR_API_URL || 'http://localhost:8080/api'
};

/**
 * Market information from coordinator
 */
export interface Market {
	id: string;
	question: string;
	description: string;
	resolutionDate: string;
	yesPool: string; // In XMR
	noPool: string; // In XMR
	status: 'open' | 'closed' | 'resolved';
}

/**
 * Bet submission payload
 */
export interface BetSubmission {
	marketId: string;
	encryptedOutcome: Uint8Array;
	encryptedAmount: Uint8Array;
	commitment: string;
	txHash: string;
	serverKey?: Uint8Array; // Include if first bet from this user
}

/**
 * Get list of active markets
 *
 * @returns Promise with array of markets
 */
export async function getMarkets(config: CoordinatorConfig = defaultConfig): Promise<Market[]> {
	// TODO: Implement actual API call
	console.log('[Coordinator] Would fetch markets from:', config.apiUrl);

	// Return placeholder data for now
	return [
		{
			id: 'test-market',
			question: 'Will Bitcoin reach $100k by end of 2025?',
			description: 'Market resolves YES if Bitcoin (BTC) trades at or above $100,000 on any major exchange by December 31, 2025 23:59:59 UTC.',
			resolutionDate: '2025-12-31',
			yesPool: '100.5',
			noPool: '50.2',
			status: 'open'
		}
	];
}

/**
 * Get market details
 *
 * @param marketId - Market ID
 * @returns Promise with market details
 */
export async function getMarket(
	marketId: string,
	config: CoordinatorConfig = defaultConfig
): Promise<Market> {
	// TODO: Implement actual API call
	console.log('[Coordinator] Would fetch market:', marketId, 'from:', config.apiUrl);

	// Return placeholder data
	return {
		id: marketId,
		question: 'Will Bitcoin reach $100k by end of 2025?',
		description: 'Market resolves YES if Bitcoin (BTC) trades at or above $100,000 on any major exchange by December 31, 2025 23:59:59 UTC.',
		resolutionDate: '2025-12-31',
		yesPool: '100.5',
		noPool: '50.2',
		status: 'open'
	};
}

/**
 * Submit encrypted bet to coordinator
 *
 * @param bet - Bet submission data
 * @returns Promise that resolves when bet is accepted
 */
export async function submitBet(
	bet: BetSubmission,
	config: CoordinatorConfig = defaultConfig
): Promise<void> {
	// TODO: Implement actual API call
	console.log('[Coordinator] Would submit bet to:', config.apiUrl);
	console.log('[Coordinator] Bet data:', {
		marketId: bet.marketId,
		commitment: bet.commitment,
		txHash: bet.txHash,
		encryptedOutcomeSize: bet.encryptedOutcome.length,
		encryptedAmountSize: bet.encryptedAmount.length
	});

	// Simulate API call
	await new Promise((resolve) => setTimeout(resolve, 500));

	// For now, just log success
	console.log('[Coordinator] Bet submitted successfully (placeholder)');
}

/**
 * Get coordinator's Monero address
 *
 * @returns Promise with coordinator address
 */
export async function getCoordinatorAddress(
	config: CoordinatorConfig = defaultConfig
): Promise<string> {
	// TODO: Implement actual API call
	console.log('[Coordinator] Would fetch coordinator address from:', config.apiUrl);

	// Return placeholder address
	return '4...'; // TODO: Return actual Monero address from coordinator
}

/**
 * Register FHE server key with coordinator
 *
 * @param serverKey - FHE server key bytes
 * @returns Promise that resolves when key is registered
 */
export async function registerServerKey(
	serverKey: Uint8Array,
	config: CoordinatorConfig = defaultConfig
): Promise<void> {
	// TODO: Implement actual API call
	console.log('[Coordinator] Would register server key at:', config.apiUrl);
	console.log('[Coordinator] Server key size:', serverKey.length, 'bytes');

	// Simulate API call
	await new Promise((resolve) => setTimeout(resolve, 200));

	console.log('[Coordinator] Server key registered (placeholder)');
}

/**
 * Check if coordinator is online
 *
 * @returns Promise with boolean indicating if coordinator is reachable
 */
export async function pingCoordinator(
	config: CoordinatorConfig = defaultConfig
): Promise<boolean> {
	try {
		// TODO: Implement actual health check endpoint
		console.log('[Coordinator] Would ping:', config.apiUrl);

		// For now, return false (not implemented)
		return false;
	} catch (error) {
		console.error('[Coordinator] Ping failed:', error);
		return false;
	}
}
