<script lang="ts">
	import type { PageData } from './$types';
	import { encryptBet, hasKeys } from '$lib/services/fhe';
	import { saveBet, downloadNonceFile, updateBetStatus } from '$lib/services/storage';
	import { hasWallet, createTransaction, formatXMR, getBalance } from '$lib/services/wallet';
	import { submitBet, getCoordinatorAddress } from '$lib/services/coordinator';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	// Bet form state
	let outcome = $state<'YES' | 'NO'>('YES');
	let amount = $state('');
	let encrypting = $state(false);
	let creatingTx = $state(false);
	let betPlaced = $state(false);
	let commitment = $state('');
	let betId = $state('');
	let txHash = $state('');
	let txFee = $state('');
	let errorMessage = $state('');
	let broadcasting = $state(false);
	let broadcasted = $state(false);

	// Wallet/FHE status
	let fheReady = $state(false);
	let walletReady = $state(false);
	let walletBalance = $state<bigint | null>(null);
	let unlockedBalance = $state<bigint | null>(null);
	let loadingBalance = $state(false);

	// Coordinator address (will be fetched)
	let coordinatorAddress = $state('4...'); // Placeholder

	// Store encrypted bet data for submission
	let encryptedBetData = $state<{
		outcome: Uint8Array;
		amount: Uint8Array;
	} | null>(null);

	onMount(async () => {
		fheReady = await hasKeys();
		walletReady = await hasWallet();

		if (!fheReady) {
			errorMessage = 'FHE keys not found. Please complete setup first.';
		} else if (!walletReady) {
			errorMessage = 'Wallet not found. Please complete setup first.';
		}

		// Fetch coordinator address
		try {
			coordinatorAddress = await getCoordinatorAddress();
		} catch (error) {
			console.warn('[Market] Failed to fetch coordinator address:', error);
		}

		// Fetch wallet balance
		if (walletReady) {
			try {
				loadingBalance = true;
				const balance = await getBalance(true); // Use cached balance
				walletBalance = balance.balance;
				unlockedBalance = balance.unlocked;
			} catch (error) {
				console.warn('[Market] Failed to fetch balance:', error);
			} finally {
				loadingBalance = false;
			}
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

		if (!walletReady) {
			errorMessage = 'Wallet not ready. Please complete setup first.';
			return;
		}

		// Balance validation
		if (unlockedBalance !== null) {
			const amountPiconeros = BigInt(Math.floor(amountNum * 1e12));
			const estimatedFee = BigInt(Math.floor(0.001 * 1e12)); // Estimate 0.001 XMR fee
			const required = amountPiconeros + estimatedFee;

			if (required > unlockedBalance) {
				const availableXMR = Number(unlockedBalance) / 1e12;
				errorMessage = `Insufficient balance. Available: ${availableXMR.toFixed(6)} XMR (need ${(Number(required) / 1e12).toFixed(6)} XMR including fee)`;
				return;
			}
		}

		encrypting = true;
		errorMessage = '';

		try {
			// Step 1: Encrypt the bet
			console.log(`[Market] Encrypting bet: ${outcome} ${amountNum} XMR`);
			const encrypted = await encryptBet(outcome === 'YES', amountNum);

			// Store encrypted data for later submission
			encryptedBetData = {
				outcome: encrypted.outcome,
				amount: encrypted.amount
			};

			// Convert commitment to hex for display
			commitment = Array.from(encrypted.commitment)
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('');

			// Generate bet ID (commitment hash first 16 chars)
			betId = commitment.substring(0, 16);

			// Save to IndexedDB (status: pending)
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
			encrypting = false;

			// Step 2: Create transaction (no relay for now)
			creatingTx = true;
			console.log(`[Market] Creating transaction: ${amountNum} XMR to coordinator`);

			const tx = await createTransaction(
				coordinatorAddress,
				amountNum,
				false, // Don't relay yet (Task 7 requirement)
				0 // Default priority
			);

			txHash = tx.txHash;
			txFee = formatXMR(tx.fee);

			// Update bet with transaction hash
			await updateBetStatus(betId, 'pending', { txHash });

			console.log(`[Market] Transaction created: ${txHash}, fee: ${txFee} XMR`);
			betPlaced = true;
		} catch (error) {
			console.error('[Market] Bet placement failed:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to place bet';
		} finally {
			encrypting = false;
			creatingTx = false;
		}
	}

	async function broadcastBet() {
		broadcasting = true;
		errorMessage = '';

		try {
			if (!encryptedBetData) {
				throw new Error('Encrypted bet data not found');
			}

			// Step 1: Broadcast the transaction
			console.log('[Market] Broadcasting transaction:', txHash);
			const tx = await createTransaction(
				coordinatorAddress,
				parseFloat(amount),
				true, // Relay this time!
				0
			);

			console.log('[Market] Transaction broadcasted:', tx.txHash);

			// Step 2: Submit encrypted bet to coordinator API
			console.log('[Market] Submitting bet to coordinator...');
			await submitBet({
				marketId: data.marketId,
				encryptedOutcome: encryptedBetData.outcome,
				encryptedAmount: encryptedBetData.amount,
				commitment,
				txHash: tx.txHash
			});

			// Update bet status to active
			await updateBetStatus(betId, 'active', { txHash: tx.txHash });
			broadcasted = true;

			console.log('[Market] Bet submitted successfully');
		} catch (error) {
			console.error('[Market] Broadcast failed:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to broadcast transaction';
		} finally {
			broadcasting = false;
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
		broadcasted = false;
		amount = '';
		commitment = '';
		betId = '';
		txHash = '';
		errorMessage = '';
	}
</script>

<div is-="view">
	<h1>📊 Market Details</h1>
	<p class="market-id">Market ID: <code>{data.marketId}</code></p>

	<!-- Market Info -->
	{#if data.error}
		<section class="error-box">
			<p>❌ Failed to load market</p>
			<p>{data.error}</p>
			<button is-="button" onclick={() => window.location.reload()}>Retry</button>
		</section>
	{:else if data.market}
		<section class="market-info">
			<h2>Market Question</h2>
			<p class="question">{data.market.question}</p>
			<div class="stats">
				<div class="stat">
					<span class="label">YES Pool:</span>
					<span class="value">{data.market.yesPool} XMR</span>
				</div>
				<div class="stat">
					<span class="label">NO Pool:</span>
					<span class="value">{data.market.noPool} XMR</span>
				</div>
				<div class="stat">
					<span class="label">Resolution Date:</span>
					<span class="value">{data.market.resolutionDate}</span>
				</div>
				<div class="stat">
					<span class="label">Status:</span>
					<span class="value badge-{data.market.status}">{data.market.status.toUpperCase()}</span>
				</div>
			</div>
			{#if data.market.description}
				<p class="description">{data.market.description}</p>
			{/if}
		</section>
	{:else}
		<section class="loading-box">
			<p>Loading market data...</p>
		</section>
	{/if}

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
					{#if loadingBalance}
						<p class="balance-info loading">Loading balance...</p>
					{:else if unlockedBalance !== null}
						<p class="balance-info">
							Available: {(Number(unlockedBalance) / 1e12).toFixed(6)} XMR
						</p>
					{/if}
				</div>

				{#if errorMessage}
					<div class="error-box">
						<p>❌ {errorMessage}</p>
					</div>
				{/if}

				<button
					is-="button primary large"
					onclick={placeBet}
					disabled={encrypting || creatingTx || !fheReady || !walletReady}
				>
					{#if encrypting}
						⏳ Encrypting bet...
					{:else if creatingTx}
						⏳ Creating transaction...
					{:else}
						🔒 Encrypt and Place Bet
					{/if}
				</button>

				<p class="info">
					Your bet will be encrypted using FHE and a Monero transaction will be created (not broadcasted yet).
				</p>
			{/if}
		</section>
	{:else}
		<section class="bet-success">
			<h2>✅ Bet Created Successfully</h2>

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
					<span class="label">Transaction Hash:</span>
					<a
						href="https://xmrchain.net/tx/{txHash}"
						target="_blank"
						rel="noopener noreferrer"
						class="tx-link"
					>
						<code class="hash">{txHash.substring(0, 32)}...</code> ↗
					</a>
				</div>
				<div class="info-item">
					<span class="label">Transaction Fee:</span>
					<code>{txFee} XMR</code>
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

			{#if !broadcasted}
				<div class="broadcast-section">
					<p class="warning-text">
						⚠️ Transaction created but NOT broadcasted yet. You can review the details and
						broadcast when ready.
					</p>

					{#if errorMessage}
						<div class="error-box">
							<p>❌ {errorMessage}</p>
						</div>
					{/if}

					<button
						is-="button primary large"
						onclick={broadcastBet}
						disabled={broadcasting}
					>
						{#if broadcasting}
							⏳ Broadcasting...
						{:else}
							📡 Broadcast Transaction & Submit Bet
						{/if}
					</button>
				</div>
			{:else}
				<div class="success-box">
					<p>✅ Transaction broadcasted and bet submitted to coordinator!</p>
					<p class="info">
						Your bet is now active. The coordinator will process it once the transaction confirms.
					</p>
				</div>
			{/if}

			<div class="actions">
				<button is-="button" onclick={downloadNonce}>
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

	.balance-info {
		font-size: 0.9rem;
		color: #7dff7d;
		margin-top: 0.5rem;
		font-weight: 500;
	}

	.balance-info.loading {
		color: var(--text-secondary, #999);
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

	.tx-link {
		color: var(--color-accent, #88c0d0);
		text-decoration: none;
	}

	.tx-link:hover {
		text-decoration: underline;
		color: var(--color-primary, #7dd7ff);
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

	.broadcast-section {
		margin: 1.5rem 0;
		padding: 1rem;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border);
		border-radius: 4px;
	}

	.warning-text {
		color: var(--warning, #ebcb8b);
		margin-bottom: 1rem;
	}

	.success-box {
		background: var(--bg-secondary, #1a1a1a);
		border-left: 4px solid var(--success, #a3be8c);
		padding: 1rem;
		margin: 1.5rem 0;
	}

	.success-box .info {
		color: var(--text-secondary, #999);
		margin-top: 0.5rem;
	}
</style>
