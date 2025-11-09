<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div is-="view">
	<h1>Claim Winnings</h1>
	<p>Market ID: {data.marketId}</p>
	<p>Placeholder for claim winnings page</p>
</div>
