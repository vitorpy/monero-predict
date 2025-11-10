<script lang="ts">
	import { onMount } from 'svelte';
	import { hasWallet, getBalance, formatXMR } from '$lib/services/wallet';
	import { hasKeys } from '$lib/services/fhe';

	let walletReady = $state(false);
	let fheReady = $state(false);
	let balance = $state('0.000000');
	let unlockedBalance = $state('0.000000');
	let loadingBalance = $state(false);

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
		<a href="/markets/test-market"><button variant-="primary">Browse Markets</button></a>
		<a href="/bets"><button variant-="secondary">My Bets</button></a>
		<a href="/claim/test-market"><button variant-="secondary">Claim</button></a>
		<a href="/setup"><button variant-="accent">Setup Wallet</button></a>
	</nav>

	<hr />

	<h2>Active Markets</h2>
	<p>No markets available yet. Connect to coordinator to see markets.</p>

	<div style="margin-top: 1em;">
		<span is-="badge" variant-="green">Coordinator: Disconnected</span>
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
</style>

