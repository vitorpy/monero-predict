import type { PageLoad } from './$types';
import { getBet } from '$lib/services/storage';
import { getMarket } from '$lib/services/coordinator';

export const load: PageLoad = async ({ params }) => {
	const betId = params.id;

	try {
		// Load bet from IndexedDB
		const bet = await getBet(betId);

		if (!bet) {
			return {
				betId,
				bet: null,
				market: null,
				error: 'Bet not found in local storage'
			};
		}

		// Load market details from coordinator
		try {
			const market = await getMarket(bet.marketId);
			return {
				betId,
				bet,
				market,
				error: null
			};
		} catch (marketError) {
			console.warn('[Claim] Failed to load market:', marketError);
			return {
				betId,
				bet,
				market: null,
				error: null // Still allow claiming even if market fetch fails
			};
		}
	} catch (error) {
		console.error('[Claim] Failed to load bet:', error);
		return {
			betId,
			bet: null,
			market: null,
			error: error instanceof Error ? error.message : 'Failed to load bet'
		};
	}
};
