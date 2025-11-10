import type { PageLoad } from './$types';
import { getMarket } from '$lib/services/coordinator';

export const load: PageLoad = async ({ params }) => {
	try {
		const market = await getMarket(params.id);
		return {
			marketId: params.id,
			market
		};
	} catch (error) {
		console.error('[Market Page] Failed to load market:', error);
		return {
			marketId: params.id,
			market: null,
			error: error instanceof Error ? error.message : 'Failed to load market'
		};
	}
};
