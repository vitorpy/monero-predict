<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div is-="view">
	<h1>Market Details</h1>
	<p>Market ID: {data.marketId}</p>
	<p>Placeholder for market detail page with bet placement form</p>
</div>
