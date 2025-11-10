<script lang="ts">
	import { onMount } from 'svelte';
	import { getAllBets, downloadNonceFile, type Bet } from '$lib/services/storage';

	let bets = $state<Bet[]>([]);
	let loading = $state(true);
	let error = $state('');

	// Group bets by status
	let pendingBets = $derived(bets.filter((b) => b.status === 'pending'));
	let activeBets = $derived(bets.filter((b) => b.status === 'active'));
	let resolvedBets = $derived(bets.filter((b) => b.status === 'resolved'));
	let claimedBets = $derived(bets.filter((b) => b.status === 'claimed'));

	onMount(async () => {
		try {
			bets = await getAllBets();
			// Sort by timestamp descending (newest first)
			bets.sort((a, b) => b.timestamp - a.timestamp);
		} catch (err) {
			console.error('[Bets] Failed to load bets:', err);
			error = err instanceof Error ? err.message : 'Failed to load bets';
		} finally {
			loading = false;
		}
	});

	async function handleDownloadNonce(betId: string) {
		try {
			await downloadNonceFile(betId);
		} catch (err) {
			console.error('[Bets] Failed to download nonce:', err);
			alert('Failed to download nonce file');
		}
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleString();
	}

	function formatTxHash(hash: string): string {
		// Show first 8 and last 8 characters
		if (hash.length <= 16) return hash;
		return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
	}

	function getTxExplorerUrl(hash: string): string {
		return `https://xmrchain.net/tx/${hash}`;
	}
</script>

<div is-="view">
	<h1>📊 My Bets</h1>
	<p>View your bet history, download nonce proofs, and check bet status.</p>

	{#if loading}
		<div class="loading-box">
			<p>Loading bets...</p>
		</div>
	{:else if error}
		<div class="error-box">
			<p>❌ {error}</p>
			<button is-="button" onclick={() => window.location.reload()}>Retry</button>
		</div>
	{:else if bets.length === 0}
		<div class="empty-box">
			<p>📭 No bets placed yet</p>
			<p>Visit the markets page to place your first encrypted bet.</p>
			<a href="/markets"><button is-="button primary">Browse Markets</button></a>
		</div>
	{:else}
		<!-- Pending Bets -->
		{#if pendingBets.length > 0}
			<section class="bet-section">
				<h2>⏳ Pending Bets ({pendingBets.length})</h2>
				<p class="section-hint">Bets that are being created or awaiting transaction confirmation</p>
				<div class="bets-grid">
					{#each pendingBets as bet (bet.betId)}
						<article class="bet-card pending">
							<div class="bet-header">
								<span class="bet-outcome {bet.outcome.toLowerCase()}">{bet.outcome}</span>
								<span class="bet-amount">{bet.amount.toFixed(6)} XMR</span>
							</div>
							<div class="bet-details">
								<div class="detail-row">
									<span class="label">Market:</span>
									<span class="value">{bet.marketId}</span>
								</div>
								<div class="detail-row">
									<span class="label">Bet ID:</span>
									<span class="value mono">{bet.betId}</span>
								</div>
								<div class="detail-row">
									<span class="label">TX Hash:</span>
									<a
										href={getTxExplorerUrl(bet.txHash)}
										target="_blank"
										rel="noopener noreferrer"
										class="tx-link"
									>
										{formatTxHash(bet.txHash)} ↗
									</a>
								</div>
								<div class="detail-row">
									<span class="label">Placed:</span>
									<span class="value">{formatDate(bet.timestamp)}</span>
								</div>
							</div>
							<div class="bet-actions">
								<button
									is-="button secondary small"
									onclick={() => handleDownloadNonce(bet.betId)}
								>
									💾 Download Nonce
								</button>
								<a href="/markets/{bet.marketId}">
									<button is-="button secondary small">View Market</button>
								</a>
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Active Bets -->
		{#if activeBets.length > 0}
			<section class="bet-section">
				<h2>🎲 Active Bets ({activeBets.length})</h2>
				<p class="section-hint">Bets confirmed and waiting for market resolution</p>
				<div class="bets-grid">
					{#each activeBets as bet (bet.betId)}
						<article class="bet-card active">
							<div class="bet-header">
								<span class="bet-outcome {bet.outcome.toLowerCase()}">{bet.outcome}</span>
								<span class="bet-amount">{bet.amount.toFixed(6)} XMR</span>
							</div>
							<div class="bet-details">
								<div class="detail-row">
									<span class="label">Market:</span>
									<span class="value">{bet.marketId}</span>
								</div>
								<div class="detail-row">
									<span class="label">Bet ID:</span>
									<span class="value mono">{bet.betId}</span>
								</div>
								<div class="detail-row">
									<span class="label">TX Hash:</span>
									<a
										href={getTxExplorerUrl(bet.txHash)}
										target="_blank"
										rel="noopener noreferrer"
										class="tx-link"
									>
										{formatTxHash(bet.txHash)} ↗
									</a>
								</div>
								<div class="detail-row">
									<span class="label">Placed:</span>
									<span class="value">{formatDate(bet.timestamp)}</span>
								</div>
							</div>
							<div class="bet-actions">
								<button
									is-="button secondary small"
									onclick={() => handleDownloadNonce(bet.betId)}
								>
									💾 Download Nonce
								</button>
								<a href="/markets/{bet.marketId}">
									<button is-="button secondary small">View Market</button>
								</a>
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Resolved Bets -->
		{#if resolvedBets.length > 0}
			<section class="bet-section">
				<h2>✅ Resolved Bets ({resolvedBets.length})</h2>
				<p class="section-hint">Markets have been resolved, ready to claim winnings</p>
				<div class="bets-grid">
					{#each resolvedBets as bet (bet.betId)}
						<article class="bet-card resolved">
							<div class="bet-header">
								<span class="bet-outcome {bet.outcome.toLowerCase()}">{bet.outcome}</span>
								<span class="bet-amount">{bet.amount.toFixed(6)} XMR</span>
							</div>
							<div class="bet-details">
								<div class="detail-row">
									<span class="label">Market:</span>
									<span class="value">{bet.marketId}</span>
								</div>
								<div class="detail-row">
									<span class="label">Bet ID:</span>
									<span class="value mono">{bet.betId}</span>
								</div>
								<div class="detail-row">
									<span class="label">TX Hash:</span>
									<a
										href={getTxExplorerUrl(bet.txHash)}
										target="_blank"
										rel="noopener noreferrer"
										class="tx-link"
									>
										{formatTxHash(bet.txHash)} ↗
									</a>
								</div>
								<div class="detail-row">
									<span class="label">Placed:</span>
									<span class="value">{formatDate(bet.timestamp)}</span>
								</div>
							</div>
							<div class="bet-actions">
								<button
									is-="button secondary small"
									onclick={() => handleDownloadNonce(bet.betId)}
								>
									💾 Download Nonce
								</button>
								<a href="/claim/{bet.betId}">
									<button is-="button primary small">Claim Winnings</button>
								</a>
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Claimed Bets -->
		{#if claimedBets.length > 0}
			<section class="bet-section">
				<h2>💰 Claimed Bets ({claimedBets.length})</h2>
				<p class="section-hint">Completed bets with payouts claimed</p>
				<div class="bets-grid">
					{#each claimedBets as bet (bet.betId)}
						<article class="bet-card claimed">
							<div class="bet-header">
								<span class="bet-outcome {bet.outcome.toLowerCase()}">{bet.outcome}</span>
								<span class="bet-amount">{bet.amount.toFixed(6)} XMR</span>
							</div>
							<div class="bet-details">
								<div class="detail-row">
									<span class="label">Market:</span>
									<span class="value">{bet.marketId}</span>
								</div>
								<div class="detail-row">
									<span class="label">Bet ID:</span>
									<span class="value mono">{bet.betId}</span>
								</div>
								{#if bet.payoutAmount}
									<div class="detail-row">
										<span class="label">Payout:</span>
										<span class="value payout">{bet.payoutAmount.toFixed(6)} XMR</span>
									</div>
								{/if}
								<div class="detail-row">
									<span class="label">Placed:</span>
									<span class="value">{formatDate(bet.timestamp)}</span>
								</div>
							</div>
							<div class="bet-actions">
								<button
									is-="button secondary small"
									onclick={() => handleDownloadNonce(bet.betId)}
								>
									💾 Download Nonce
								</button>
								<a href="/markets/{bet.marketId}">
									<button is-="button secondary small">View Market</button>
								</a>
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>

<style>
	.loading-box,
	.error-box,
	.empty-box {
		text-align: center;
		padding: 3rem 2rem;
		border: 1px solid var(--color-border, #444);
		border-radius: 4px;
		margin: 2rem 0;
	}

	.error-box {
		background: rgba(255, 0, 0, 0.1);
	}

	.empty-box {
		background: var(--color-bg-secondary, #1a1a1a);
	}

	.bet-section {
		margin: 2rem 0;
	}

	.bet-section h2 {
		margin-bottom: 0.5rem;
	}

	.section-hint {
		color: var(--text-secondary, #999);
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.bets-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.bet-card {
		border: 2px solid var(--color-border, #444);
		padding: 1.25rem;
		border-radius: 4px;
		background: var(--color-bg-secondary, #1a1a1a);
	}

	.bet-card.pending {
		border-color: #ffd77d;
	}

	.bet-card.active {
		border-color: #7dd7ff;
	}

	.bet-card.resolved {
		border-color: #7dff7d;
	}

	.bet-card.claimed {
		border-color: #888;
	}

	.bet-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--color-border, #444);
	}

	.bet-outcome {
		font-size: 1.2rem;
		font-weight: bold;
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
	}

	.bet-outcome.yes {
		background: #2d5a2d;
		color: #7dff7d;
	}

	.bet-outcome.no {
		background: #5a2d2d;
		color: #ff7d7d;
	}

	.bet-amount {
		font-size: 1.1rem;
		font-weight: bold;
		font-family: monospace;
		color: var(--color-accent, #88c0d0);
	}

	.bet-details {
		margin: 1rem 0;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin: 0.5rem 0;
		font-size: 0.9rem;
	}

	.detail-row .label {
		color: var(--text-secondary, #999);
		font-weight: 500;
	}

	.detail-row .value {
		text-align: right;
		word-break: break-all;
	}

	.detail-row .value.mono {
		font-family: monospace;
		font-size: 0.85rem;
	}

	.detail-row .value.payout {
		color: #7dff7d;
		font-weight: bold;
	}

	.bet-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border, #444);
		flex-wrap: wrap;
	}

	.bet-actions button,
	.bet-actions a {
		flex: 1;
		min-width: 140px;
	}

	.bet-actions a {
		text-decoration: none;
	}

	.tx-link {
		font-family: monospace;
		font-size: 0.85rem;
		color: var(--color-accent, #88c0d0);
		text-decoration: none;
		word-break: break-all;
	}

	.tx-link:hover {
		text-decoration: underline;
		color: var(--color-primary, #7dd7ff);
	}
</style>
