<script lang="ts">
	import { onMount } from 'svelte';
	import { hasWallet, getBalance, formatXMR } from '$lib/services/wallet';
	import { hasKeys } from '$lib/services/fhe';
	import { getMarkets, pingCoordinator, type Market } from '$lib/services/coordinator';

	let walletReady = $state(false);
	let fheReady = $state(false);
	let balance = $state('0.000000');
	let unlockedBalance = $state('0.000000');
	let loadingBalance = $state(false);
	let coordinatorOnline = $state(false);
	let markets = $state<Market[]>([]);
	let loadingMarkets = $state(false);

	onMount(async () => {
		// Check if wallet exists
		walletReady = await hasWallet();
		fheReady = await hasKeys();

		// Load cached balance if wallet exists
		if (walletReady) {
			loadingBalance = true;
			try {
				const bal = await getBalance(true); // Use cached balance
				balance = formatXMR(bal.balance);
				unlockedBalance = formatXMR(bal.unlocked);
			} catch (error) {
				console.error('[Home] Failed to load balance:', error);
			} finally {
				loadingBalance = false;
			}
		}

		// Ping coordinator
		coordinatorOnline = await pingCoordinator();

		// Load markets if coordinator is online
		if (coordinatorOnline) {
			loadingMarkets = true;
			try {
				const allMarkets = await getMarkets();
				// Show only first 3 markets as preview
				markets = allMarkets.slice(0, 3);
			} catch (error) {
				console.error('[Home] Failed to load markets:', error);
			} finally {
				loadingMarkets = false;
			}
		}
	});

	async function refreshBalance() {
		if (!walletReady) return;

		loadingBalance = true;
		try {
			const bal = await getBalance(false); // Fetch fresh balance
			balance = formatXMR(bal.balance);
			unlockedBalance = formatXMR(bal.unlocked);
		} catch (error) {
			console.error('[Home] Failed to refresh balance:', error);
			alert('Failed to refresh balance. Make sure wallet is synced.');
		} finally {
			loadingBalance = false;
		}
	}
</script>

<div is-="view">
	<h1>MONERO PREDICTION MARKETS</h1>
	<p>Privacy-preserving prediction markets using FHE and Monero</p>

	<!-- Wallet Status -->
	{#if walletReady}
		<div class="wallet-info">
			<div class="balance-display">
				<div class="balance-item">
					<span class="label">Balance:</span>
					<span class="amount">{balance} XMR</span>
				</div>
				<div class="balance-item">
					<span class="label">Unlocked:</span>
					<span class="amount unlocked">{unlockedBalance} XMR</span>
				</div>
				<button
					is-="button"
					onclick={refreshBalance}
					disabled={loadingBalance}
					style="font-size: 0.8em; padding: 0.3em 0.6em;"
				>
					{loadingBalance ? '⏳' : '🔄'} Refresh
				</button>
			</div>
		</div>
	{/if}

	<nav>
		<a href="/markets"><button variant-="primary">Browse Markets</button></a>
		<a href="/bets"><button variant-="secondary">My Bets</button></a>
		<a href="/setup"><button variant-="accent">Setup Wallet</button></a>
	</nav>

	<hr />

	<h2>Active Markets</h2>
	{#if loadingMarkets}
		<p>Loading markets...</p>
	{:else if !coordinatorOnline}
		<p>Coordinator offline. Start the coordinator to see markets.</p>
		<p class="hint">Run: <code>cargo run --bin monero-predict</code></p>
	{:else if markets.length === 0}
		<p>No markets available yet.</p>
	{:else}
		<div class="markets-preview">
			{#each markets as market (market.id)}
				<article class="market-card-mini">
					<h3>{market.question}</h3>
					<div class="pools-mini">
						<span class="pool yes">YES: {market.yesPool} XMR</span>
						<span class="pool no">NO: {market.noPool} XMR</span>
					</div>
					<a href="/markets/{market.id}">
						<button variant-="secondary small">Place Bet →</button>
					</a>
				</article>
			{/each}
		</div>
		<p style="text-align: center; margin-top: 1rem;">
			<a href="/markets"><button variant-="primary">View All Markets</button></a>
		</p>
	{/if}

	<div style="margin-top: 1em;">
		<span is-="badge" variant-={coordinatorOnline ? 'green' : 'red'}>
			Coordinator: {coordinatorOnline ? 'Online' : 'Offline'}
		</span>
		<span is-="badge" variant-={walletReady ? 'green' : 'yellow'}>
			Wallet: {walletReady ? 'Ready' : 'Not Initialized'}
		</span>
		<span is-="badge" variant-={fheReady ? 'green' : 'yellow'}>
			FHE: {fheReady ? 'Ready' : 'Not Initialized'}
		</span>
	</div>
</div>

<style>
	nav {
		display: flex;
		gap: 0.5em;
		margin: 1em 0;
		flex-wrap: wrap;
	}

	nav a {
		text-decoration: none;
	}

	.wallet-info {
		margin: 1.5rem 0;
		padding: 1rem;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border);
		border-radius: 4px;
	}

	.balance-display {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.balance-item {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}

	.label {
		color: var(--text-secondary, #999);
		font-size: 0.9rem;
	}

	.amount {
		font-family: monospace;
		font-size: 1.1rem;
		font-weight: bold;
		color: var(--primary, #88c0d0);
	}

	.amount.unlocked {
		color: var(--success, #a3be8c);
	}

	.markets-preview {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
		margin: 1rem 0;
	}

	.market-card-mini {
		border: 1px solid var(--border, #444);
		padding: 1rem;
		border-radius: 4px;
		background: var(--bg-secondary, #1a1a1a);
	}

	.market-card-mini h3 {
		font-size: 1rem;
		margin: 0 0 0.75rem 0;
		line-height: 1.3;
	}

	.pools-mini {
		display: flex;
		gap: 1rem;
		margin: 0.75rem 0;
		font-size: 0.85rem;
	}

	.pools-mini .pool {
		font-family: monospace;
		font-weight: 500;
	}

	.pools-mini .pool.yes {
		color: #7dff7d;
	}

	.pools-mini .pool.no {
		color: #ff7d7d;
	}

	.hint {
		color: var(--text-secondary, #999);
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	.hint code {
		background: var(--bg-secondary, #1a1a1a);
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: monospace;
	}
</style>

