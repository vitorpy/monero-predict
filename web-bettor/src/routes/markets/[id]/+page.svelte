<script lang="ts">
	import type { PageData } from './$types';
	import { encryptBet, hasKeys } from '$lib/services/fhe';
	import { saveBet, downloadNonceFile } from '$lib/services/storage';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	// Bet form state
	let outcome = $state<'YES' | 'NO'>('YES');
	let amount = $state('');
	let encrypting = $state(false);
	let betPlaced = $state(false);
	let commitment = $state('');
	let betId = $state('');
	let errorMessage = $state('');

	// FHE status
	let fheReady = $state(false);

	onMount(async () => {
		fheReady = await hasKeys();
		if (!fheReady) {
			errorMessage = 'FHE keys not found. Please complete setup first.';
		}
	});

	async function placeBet() {
		// Validate
		const amountNum = parseFloat(amount);
		if (!amountNum || amountNum <= 0) {
			errorMessage = 'Please enter a valid bet amount';
			return;
		}

		if (!fheReady) {
			errorMessage = 'FHE keys not ready. Please complete setup first.';
			return;
		}

		encrypting = true;
		errorMessage = '';

		try {
			// Encrypt the bet
			console.log(`[Market] Encrypting bet: ${outcome} ${amountNum} XMR`);
			const encrypted = await encryptBet(outcome === 'YES', amountNum);

			// Convert commitment to hex for display
			commitment = Array.from(encrypted.commitment)
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('');

			// Generate bet ID (commitment hash first 16 chars)
			betId = commitment.substring(0, 16);

			// Save to IndexedDB
			await saveBet({
				betId,
				marketId: data.marketId,
				nonce: encrypted.nonce,
				commitment,
				txHash: '', // Will be set after transaction
				amount: amountNum,
				outcome,
				timestamp: Date.now(),
				status: 'pending'
			});

			console.log(`[Market] Bet encrypted and saved: ${betId}`);
			betPlaced = true;
		} catch (error) {
			console.error('[Market] Bet encryption failed:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to encrypt bet';
		} finally {
			encrypting = false;
		}
	}

	function downloadNonce() {
		downloadNonceFile(betId);
	}

	function viewBets() {
		goto('/bets');
	}

	function reset() {
		betPlaced = false;
		amount = '';
		commitment = '';
		betId = '';
		errorMessage = '';
	}
</script>

<div is-="view">
	<h1>📊 Market Details</h1>
	<p class="market-id">Market ID: <code>{data.marketId}</code></p>

	<!-- Market Info (placeholder) -->
	<section class="market-info">
		<h2>Market Question</h2>
		<p class="question">Will Bitcoin reach $100k by end of 2025?</p>
		<div class="stats">
			<div class="stat">
				<span class="label">YES Pool:</span>
				<span class="value">~50 XMR</span>
			</div>
			<div class="stat">
				<span class="label">NO Pool:</span>
				<span class="value">~50 XMR</span>
			</div>
			<div class="stat">
				<span class="label">Resolution Date:</span>
				<span class="value">2025-12-31</span>
			</div>
		</div>
		<p class="muted">Note: This is placeholder data. Actual market data will come from coordinator API.</p>
	</section>

	<!-- Bet Placement Form -->
	{#if !betPlaced}
		<section class="bet-form">
			<h2>Place Encrypted Bet</h2>

			{#if !fheReady}
				<div class="warning-box">
					<p>⚠️ FHE keys not found</p>
					<p>You need to complete the setup first to place bets.</p>
					<button is-="button primary" onclick={() => goto('/setup')}>Go to Setup</button>
				</div>
			{:else}
				<div class="form-group">
					<label for="outcome">Outcome</label>
					<div class="outcome-buttons">
						<button
							is-="button {outcome === 'YES' ? 'primary' : ''}"
							onclick={() => (outcome = 'YES')}
						>
							YES
						</button>
						<button
							is-="button {outcome === 'NO' ? 'primary' : ''}"
							onclick={() => (outcome = 'NO')}
						>
							NO
						</button>
					</div>
				</div>

				<div class="form-group">
					<label for="amount">Amount (XMR)</label>
					<input
						is-="input"
						type="number"
						id="amount"
						bind:value={amount}
						placeholder="0.0"
						step="0.001"
						min="0"
						disabled={encrypting}
					/>
					<p class="hint">Minimum: 0.001 XMR</p>
				</div>

				{#if errorMessage}
					<div class="error-box">
						<p>❌ {errorMessage}</p>
					</div>
				{/if}

				<button is-="button primary large" onclick={placeBet} disabled={encrypting || !fheReady}>
					{#if encrypting}
						⏳ Encrypting bet...
					{:else}
						🔒 Encrypt and Place Bet
					{/if}
				</button>

				<p class="info">
					Your bet will be encrypted using FHE. The coordinator cannot see your outcome or amount.
				</p>
			{/if}
		</section>
	{:else}
		<section class="bet-success">
			<h2>✅ Bet Encrypted Successfully</h2>

			<div class="info-box">
				<div class="info-item">
					<span class="label">Bet ID:</span>
					<code>{betId}</code>
				</div>
				<div class="info-item">
					<span class="label">Commitment Hash:</span>
					<code class="hash">{commitment.substring(0, 32)}...</code>
				</div>
				<div class="info-item">
					<span class="label">Outcome:</span>
					<span class="value">{outcome}</span>
				</div>
				<div class="info-item">
					<span class="label">Amount:</span>
					<span class="value">{amount} XMR</span>
				</div>
			</div>

			<div class="actions">
				<button is-="button primary" onclick={downloadNonce}>
					💾 Download Nonce (Optional)
				</button>
				<button is-="button" onclick={viewBets}>View All Bets</button>
				<button is-="button" onclick={reset}>Place Another Bet</button>
			</div>

			<div class="warning-box">
				<p>⚠️ Next Step: Send Payment</p>
				<p>
					You need to send <strong>{amount} XMR</strong> to the coordinator's address to activate this
					bet. The payment feature will be implemented in Epic 3 (Wallet Integration).
				</p>
			</div>
		</section>
	{/if}
</div>

<style>
	section {
		margin: 2rem 0;
		padding: 1.5rem;
		border: 1px solid var(--border);
		border-radius: 4px;
	}

	.market-id {
		color: var(--text-secondary, #999);
	}

	.question {
		font-size: 1.2rem;
		font-weight: bold;
		margin: 1rem 0;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin: 1rem 0;
	}

	.stat {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem;
		background: var(--bg-secondary, #1a1a1a);
		border-radius: 4px;
	}

	.stat .label {
		color: var(--text-secondary, #999);
	}

	.stat .value {
		font-weight: bold;
	}

	.form-group {
		margin: 1.5rem 0;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
	}

	.outcome-buttons {
		display: flex;
		gap: 1rem;
	}

	.outcome-buttons button {
		flex: 1;
	}

	.hint {
		font-size: 0.9rem;
		color: var(--text-secondary, #999);
		margin-top: 0.25rem;
	}

	.info {
		font-size: 0.9rem;
		color: var(--text-secondary, #999);
		margin-top: 1rem;
		text-align: center;
	}

	.info-box {
		background: var(--bg-secondary, #1a1a1a);
		padding: 1rem;
		border-radius: 4px;
		margin: 1rem 0;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		margin: 0.5rem 0;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border);
	}

	.info-item:last-child {
		border-bottom: none;
	}

	.info-item .label {
		color: var(--text-secondary, #999);
	}

	.info-item .value {
		font-weight: bold;
	}

	.info-item code {
		background: var(--bg-tertiary, #0a0a0a);
		padding: 0.25rem 0.5rem;
		border-radius: 2px;
		font-size: 0.9rem;
	}

	.hash {
		word-break: break-all;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin: 1.5rem 0;
	}

	.actions button {
		flex: 1;
		min-width: 150px;
	}

	.warning-box {
		background: var(--bg-secondary, #1a1a1a);
		border-left: 4px solid var(--warning, #ebcb8b);
		padding: 1rem;
		margin: 1rem 0;
	}

	.error-box {
		background: var(--bg-secondary, #1a1a1a);
		border-left: 4px solid var(--error, #bf616a);
		padding: 1rem;
		margin: 1rem 0;
	}

	.muted {
		color: var(--text-secondary, #999);
		font-size: 0.9rem;
		font-style: italic;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
