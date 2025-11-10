import type { PageLoad } from './$types';
import { getMarkets } from '$lib/services/coordinator';

export const load: PageLoad = async () => {
	try {
		const markets = await getMarkets();
		return {
			markets
		};
	} catch (error) {
		console.error('[Markets List] Failed to load markets:', error);
		return {
			markets: [],
			error: error instanceof Error ? error.message : 'Failed to load markets'
		};
	}
};
