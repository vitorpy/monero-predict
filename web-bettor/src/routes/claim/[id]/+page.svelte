<script lang="ts">
	import type { PageData } from './$types';
	import { submitClaim } from '$lib/services/coordinator';
	import { updateBetStatus } from '$lib/services/storage';
	import { getPrimaryAddress } from '$lib/services/wallet';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	// Form state
	let nonceSource = $state<'stored' | 'upload'>('stored');
	let uploadedNonce = $state<Uint8Array | null>(null);
	let payoutAddress = $state('');
	let loadingAddress = $state(false);
	let submitting = $state(false);
	let claimed = $state(false);
	let errorMessage = $state('');
	let payoutAmount = $state('');
	let payoutStatus = $state('');

	onMount(async () => {
		// Auto-fill payout address from wallet
		try {
			loadingAddress = true;
			const address = await getPrimaryAddress();
			if (address) {
				payoutAddress = address;
			}
		} catch (error) {
			console.warn('[Claim] Failed to load wallet address:', error);
		} finally {
			loadingAddress = false;
		}
	});

	async function handleNonceFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		try {
			const arrayBuffer = await file.arrayBuffer();
			const bytes = new Uint8Array(arrayBuffer);

			if (bytes.length !== 32) {
				errorMessage = `Invalid nonce file: expected 32 bytes, got ${bytes.length} bytes`;
				return;
			}

			uploadedNonce = bytes;
			nonceSource = 'upload';
			errorMessage = '';
			console.log('[Claim] Nonce file uploaded successfully');
		} catch (error) {
			console.error('[Claim] Failed to read nonce file:', error);
			errorMessage = 'Failed to read nonce file';
		}
	}

	async function submitClaimForm() {
		if (!data.bet) {
			errorMessage = 'Bet data not available';
			return;
		}

		if (!payoutAddress) {
			errorMessage = 'Please enter a payout address';
			return;
		}

		// Validate payout address (basic check for Monero address length)
		if (payoutAddress.length < 95 || payoutAddress.length > 106) {
			errorMessage = 'Invalid Monero address format';
			return;
		}

		// Get nonce (from storage or upload)
		let nonce: Uint8Array;
		if (nonceSource === 'upload') {
			if (!uploadedNonce) {
				errorMessage = 'Please upload a nonce file';
				return;
			}
			nonce = uploadedNonce;
		} else {
			nonce = data.bet.nonce;
		}

		// Convert commitment hex string to bytes for bet_id
		const betId = new Uint8Array(
			data.bet.commitment.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
		);

		submitting = true;
		errorMessage = '';

		try {
			console.log('[Claim] Submitting claim...');
			const response = await submitClaim(data.bet.marketId, {
				betId,
				nonce,
				payoutAddress
			});

			payoutAmount = response.amountXMR;
			payoutStatus = response.status;

			// Update bet status in IndexedDB
			await updateBetStatus(data.betId, 'claimed', {
				payoutAmount: parseFloat(response.amountXMR),
				payoutAddress
			});

			claimed = true;
			console.log('[Claim] Claim submitted successfully:', response);
		} catch (error) {
			console.error('[Claim] Claim submission failed:', error);

			// Provide helpful error messages
			if (error instanceof Error) {
				if (error.message.includes('commitment')) {
					errorMessage = `Commitment verification failed: ${error.message}. The nonce may not match this bet.`;
				} else if (error.message.includes('not found') || error.message.includes('404')) {
					errorMessage = 'Bet not found on coordinator. The bet may not have been submitted successfully.';
				} else if (error.message.includes('already claimed')) {
					errorMessage = 'This bet has already been claimed.';
				} else if (error.message.includes('not resolved')) {
					errorMessage = 'Market has not been resolved yet. Please wait for resolution.';
				} else if (error.message.includes('coordinator')) {
					errorMessage = `Coordinator error: ${error.message}. Make sure the coordinator is running.`;
				} else {
					errorMessage = `Claim failed: ${error.message}`;
				}
			} else {
				errorMessage = 'Failed to submit claim. Please try again.';
			}
		} finally {
			submitting = false;
		}
	}

	function viewBets() {
		goto('/bets');
	}
</script>

<div is-="view">
	<h1>💰 Claim Winnings</h1>
	<p>Submit your claim to receive your payout</p>

	{#if data.error}
		<!-- Error state -->
		<section class="error-box">
			<p>❌ {data.error}</p>
			<a href="/bets"><button is-="button">Back to Bets</button></a>
		</section>
	{:else if !data.bet}
		<!-- No bet found -->
		<section class="error-box">
			<p>❌ Bet not found</p>
			<p>The bet may not exist in your local storage.</p>
			<a href="/bets"><button is-="button">Back to Bets</button></a>
		</section>
	{:else if claimed}
		<!-- Claim successful -->
		<section class="success-box">
			<h2>✅ Claim Submitted Successfully</h2>

			<div class="payout-info">
				<div class="payout-item">
					<span class="label">Payout Amount:</span>
					<span class="value large">{payoutAmount} XMR</span>
				</div>
				<div class="payout-item">
					<span class="label">Payout Address:</span>
					<code class="address">{payoutAddress}</code>
				</div>
				<div class="payout-item">
					<span class="label">Status:</span>
					<span class="value">{payoutStatus}</span>
				</div>
			</div>

			<p class="info">
				Your payout has been submitted to the coordinator. The transaction will be processed
				using multisig and sent to your address.
			</p>

			<button is-="button primary" onclick={viewBets}>View All Bets</button>
		</section>
	{:else}
		<!-- Bet info -->
		<section class="bet-info">
			<h2>Bet Details</h2>
			<div class="info-grid">
				<div class="info-item">
					<span class="label">Bet ID:</span>
					<code>{data.betId}</code>
				</div>
				<div class="info-item">
					<span class="label">Market:</span>
					<span>{data.market?.question || data.bet.marketId}</span>
				</div>
				<div class="info-item">
					<span class="label">Your Outcome:</span>
					<span class="outcome-{data.bet.outcome.toLowerCase()}">{data.bet.outcome}</span>
				</div>
				<div class="info-item">
					<span class="label">Bet Amount:</span>
					<span>{data.bet.amount} XMR</span>
				</div>
				<div class="info-item">
					<span class="label">Status:</span>
					<span class="status-badge badge-{data.bet.status}"
						>{data.bet.status.toUpperCase()}</span
					>
				</div>
			</div>

			{#if data.market && data.market.status !== 'resolved'}
				<div class="warning-box">
					<p>⚠️ Market Not Resolved</p>
					<p>This market has not been resolved yet. You cannot claim winnings until resolution.</p>
					<p class="muted">Market status: {data.market.status.toUpperCase()}</p>
				</div>
			{/if}
		</section>

		<!-- Claim form -->
		{#if !data.market || data.market.status === 'resolved'}
			<section class="claim-form">
				<h2>Submit Claim</h2>

				<!-- Nonce selection -->
				<div class="form-group">
					<label>Nonce Proof</label>
					<div class="nonce-options">
						<button
							is-="button {nonceSource === 'stored' ? 'primary' : ''}"
							onclick={() => (nonceSource = 'stored')}
						>
							Use Stored Nonce
						</button>
						<button
							is-="button {nonceSource === 'upload' ? 'primary' : ''}"
							onclick={() => (nonceSource = 'upload')}
						>
							Upload Nonce File
						</button>
					</div>

					{#if nonceSource === 'stored'}
						<p class="hint">✓ Nonce found in local storage (32 bytes)</p>
					{:else}
						<div class="file-upload">
							<input
								type="file"
								accept=".nonce"
								onchange={handleNonceFileUpload}
								id="nonce-file"
							/>
							<label for="nonce-file" class="file-label">
								{uploadedNonce ? '✓ Nonce file uploaded' : 'Choose nonce file'}
							</label>
							{#if uploadedNonce}
								<p class="hint success">✓ Valid nonce file (32 bytes)</p>
							{/if}
						</div>
					{/if}
				</div>

				<!-- Payout address -->
				<div class="form-group">
					<label for="address">Payout Address</label>
					<input
						is-="input"
						type="text"
						id="address"
						bind:value={payoutAddress}
						placeholder="4..."
						disabled={loadingAddress || submitting}
					/>
					{#if loadingAddress}
						<p class="hint">Loading address from wallet...</p>
					{:else}
						<p class="hint">Monero mainnet address (auto-filled from your wallet)</p>
					{/if}
				</div>

				<!-- Error message -->
				{#if errorMessage}
					<div class="error-box">
						<p>❌ {errorMessage}</p>
						<button is-="button secondary small" onclick={() => (errorMessage = '')}>
							Dismiss
						</button>
					</div>
				{/if}

				<!-- Submit button -->
				<button
					is-="button primary large"
					onclick={submitClaimForm}
					disabled={submitting || !payoutAddress || (nonceSource === 'upload' && !uploadedNonce)}
				>
					{#if submitting}
						⏳ Submitting Claim...
					{:else}
						💰 Submit Claim
					{/if}
				</button>

				<p class="info">
					By submitting this claim, you are revealing your nonce to prove ownership of this bet.
					The coordinator will verify your commitment and calculate your payout.
				</p>
			</section>
		{/if}
	{/if}
</div>

<style>
	.bet-info,
	.claim-form,
	.success-box {
		margin: 2rem 0;
		padding: 1.5rem;
		border: 1px solid var(--color-border, #444);
		border-radius: 4px;
		background: var(--color-bg-secondary, #1a1a1a);
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
		margin: 1rem 0;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.info-item .label {
		color: var(--color-text-muted, #888);
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.info-item code {
		font-family: 'Courier New', monospace;
		background: var(--color-bg, #000);
		padding: 0.25rem 0.5rem;
		border-radius: 3px;
	}

	.outcome-yes {
		color: #7dff7d;
		font-weight: bold;
	}

	.outcome-no {
		color: #ff7d7d;
		font-weight: bold;
	}

	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		font-size: 0.85rem;
		font-weight: bold;
		display: inline-block;
	}

	.status-badge.badge-pending {
		background: #5a5a2d;
		color: #ffff7d;
	}

	.status-badge.badge-active {
		background: #2d5a5a;
		color: #7dffff;
	}

	.status-badge.badge-resolved {
		background: #2d4d5a;
		color: #7dd7ff;
	}

	.status-badge.badge-claimed {
		background: #2d5a2d;
		color: #7dff7d;
	}

	.form-group {
		margin: 1.5rem 0;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
	}

	.nonce-options {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.file-upload {
		margin-top: 1rem;
	}

	.file-upload input[type='file'] {
		display: none;
	}

	.file-label {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: var(--color-bg, #000);
		border: 1px solid var(--color-border, #444);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.file-label:hover {
		background: var(--color-bg-secondary, #1a1a1a);
		border-color: var(--color-primary, #7dff7d);
	}

	.hint {
		font-size: 0.85rem;
		color: var(--color-text-muted, #888);
		margin-top: 0.5rem;
	}

	.hint.success {
		color: #7dff7d;
	}

	.info {
		font-size: 0.9rem;
		color: var(--color-text-muted, #888);
		margin-top: 1rem;
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 4px;
	}

	.error-box {
		background: var(--color-bg-secondary, #1a1a1a);
		border-left: 4px solid var(--color-error, #bf616a);
		padding: 1rem;
		margin: 1rem 0;
	}

	.warning-box {
		background: var(--color-bg-secondary, #1a1a1a);
		border-left: 4px solid #ffd77d;
		padding: 1rem;
		margin: 1rem 0;
	}

	.muted {
		color: var(--color-text-muted, #888);
		font-size: 0.9rem;
	}

	.payout-info {
		margin: 2rem 0;
	}

	.payout-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		margin: 0.5rem 0;
		background: var(--color-bg, #000);
		border-radius: 4px;
	}

	.payout-item .label {
		color: var(--color-text-muted, #888);
		font-weight: bold;
	}

	.payout-item .value {
		font-weight: bold;
	}

	.payout-item .value.large {
		font-size: 1.5rem;
		color: #7dff7d;
	}

	.address {
		font-family: 'Courier New', monospace;
		font-size: 0.85rem;
		word-break: break-all;
		background: var(--color-bg, #000);
		padding: 0.5rem;
		border-radius: 3px;
	}

	.success-box {
		border-left: 4px solid #7dff7d;
	}
</style>
