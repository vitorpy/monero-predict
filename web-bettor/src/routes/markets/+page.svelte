<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div is-="view">
	<h1>📈 Active Markets</h1>
	<p>Browse all prediction markets and place encrypted bets.</p>

	{#if data.error}
		<!-- Error state -->
		<section class="error-box">
			<p>❌ Failed to load markets</p>
			<p>{data.error}</p>
			<p class="muted">Make sure the coordinator is running on localhost:8080</p>
			<button is-="button" onclick={() => window.location.reload()}>Retry</button>
		</section>
	{:else if data.markets.length === 0}
		<!-- Empty state -->
		<section class="empty-box">
			<p>📭 No markets available</p>
			<p>Markets will appear here once they are created by the coordinator.</p>
		</section>
	{:else}
		<!-- Markets list -->
		<section class="markets-grid">
			{#each data.markets as market (market.id)}
				<article class="market-card">
					<div class="market-header">
						<h2>{market.question}</h2>
						<span class="status-badge badge-{market.status}">{market.status.toUpperCase()}</span>
					</div>

					<div class="market-stats">
						<div class="pool">
							<span class="pool-label">YES Pool</span>
							<span class="pool-value yes">{market.yesPool} XMR</span>
						</div>
						<div class="pool">
							<span class="pool-label">NO Pool</span>
							<span class="pool-value no">{market.noPool} XMR</span>
						</div>
					</div>

					<div class="market-footer">
						<span class="resolution-date">Resolves: {market.resolutionDate}</span>
						<a href="/markets/{market.id}">
							<button is-="button primary">Place Bet</button>
						</a>
					</div>
				</article>
			{/each}
		</section>
	{/if}
</div>

<style>
	.markets-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.market-card {
		border: 1px solid var(--color-border, #444);
		padding: 1.5rem;
		border-radius: 4px;
		background: var(--color-bg-secondary, #1a1a1a);
	}

	.market-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.market-header h2 {
		font-size: 1.1rem;
		margin: 0;
		flex: 1;
		line-height: 1.4;
	}

	.status-badge {
		padding: 0.25rem 0.5rem;
		border-radius: 3px;
		font-size: 0.75rem;
		font-weight: bold;
		white-space: nowrap;
	}

	.status-badge.badge-open {
		background: #2d5a2d;
		color: #7dff7d;
	}

	.status-badge.badge-closed {
		background: #5a4d2d;
		color: #ffd77d;
	}

	.status-badge.badge-resolved {
		background: #2d4d5a;
		color: #7dd7ff;
	}

	.market-stats {
		display: flex;
		gap: 2rem;
		margin: 1.5rem 0;
	}

	.pool {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.pool-label {
		font-size: 0.85rem;
		color: var(--color-text-muted, #888);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.pool-value {
		font-size: 1.25rem;
		font-weight: bold;
		font-family: 'Courier New', monospace;
	}

	.pool-value.yes {
		color: #7dff7d;
	}

	.pool-value.no {
		color: #ff7d7d;
	}

	.market-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border, #444);
	}

	.resolution-date {
		font-size: 0.85rem;
		color: var(--color-text-muted, #888);
	}

	.error-box,
	.empty-box {
		text-align: center;
		padding: 3rem 2rem;
		border: 1px solid var(--color-border, #444);
		border-radius: 4px;
		margin-top: 2rem;
	}

	.error-box {
		background: rgba(255, 0, 0, 0.1);
	}

	.empty-box {
		background: var(--color-bg-secondary, #1a1a1a);
	}

	.muted {
		color: var(--color-text-muted, #888);
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}
</style>
