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
	const response = await fetch(`${config.apiUrl}/markets`);

	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: 'Unknown error' }));
		throw new Error(`Failed to fetch markets: ${error.error || response.statusText}`);
	}

	const data = await response.json();

	// Map snake_case from Rust to camelCase for TypeScript
	return data.map((market: any) => ({
		id: market.id,
		question: market.question,
		description: market.description,
		resolutionDate: market.resolution_date,
		yesPool: market.yes_pool,
		noPool: market.no_pool,
		status: market.status
	}));
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
	const response = await fetch(`${config.apiUrl}/market/${marketId}/stats`);

	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: 'Unknown error' }));
		throw new Error(`Failed to fetch market: ${error.error || response.statusText}`);
	}

	const data = await response.json();

	// Map snake_case from Rust to camelCase for TypeScript
	return {
		id: data.id,
		question: data.question,
		description: data.description,
		resolutionDate: data.resolution_date,
		yesPool: data.yes_pool,
		noPool: data.no_pool,
		status: data.status
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
	const response = await fetch(`${config.apiUrl}/market/${bet.marketId}/bet`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			encrypted_outcome: Array.from(bet.encryptedOutcome),
			encrypted_amount: Array.from(bet.encryptedAmount),
			commitment: bet.commitment,
			tx_hash: bet.txHash,
			server_key: bet.serverKey ? Array.from(bet.serverKey) : undefined
		})
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: 'Unknown error' }));
		throw new Error(`Failed to submit bet: ${error.error || response.statusText}`);
	}

	const data = await response.json();
	console.log('[Coordinator] Bet submitted successfully. Bet ID:', data.bet_id);
}

/**
 * Get coordinator's Monero address
 *
 * @returns Promise with coordinator address
 */
export async function getCoordinatorAddress(
	config: CoordinatorConfig = defaultConfig
): Promise<string> {
	const response = await fetch(`${config.apiUrl}/coordinator/address`);

	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: 'Unknown error' }));
		throw new Error(`Failed to fetch coordinator address: ${error.error || response.statusText}`);
	}

	const data = await response.json();
	return data.address;
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
		const response = await fetch(`${config.apiUrl}/health`, {
			method: 'GET',
			signal: AbortSignal.timeout(5000) // 5 second timeout
		});

		if (!response.ok) {
			return false;
		}

		const data = await response.json();
		return data.status === 'ok';
	} catch (error) {
		console.error('[Coordinator] Ping failed:', error);
		return false;
	}
}
