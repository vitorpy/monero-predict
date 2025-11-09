<script lang="ts">
	import { onMount } from 'svelte';
	import { hasKeys, generateKeysInWorker } from '$lib/services/fhe';
	import { goto } from '$app/navigation';

	let fheStatus = $state<'checking' | 'not_started' | 'generating' | 'complete' | 'error'>(
		'checking'
	);
	let fheProgress = $state(0);
	let fheMessage = $state('');
	let errorMessage = $state('');

	onMount(async () => {
		// Check if keys already exist
		const keysExist = await hasKeys();
		fheStatus = keysExist ? 'complete' : 'not_started';
	});

	async function generateFheKeys() {
		fheStatus = 'generating';
		fheProgress = 0;
		fheMessage = 'Starting...';
		errorMessage = '';

		try {
			await generateKeysInWorker((percent, message) => {
				fheProgress = percent;
				fheMessage = message;
			});

			fheStatus = 'complete';
			fheMessage = 'Keys generated successfully!';
		} catch (error) {
			fheStatus = 'error';
			errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			console.error('[Setup] FHE key generation failed:', error);
		}
	}

	function continueToMarkets() {
		goto('/');
	}
</script>

<div is-="view">
	<h1>⚙️ Setup</h1>
	<p>Complete these steps to start using the prediction market bettor.</p>

	<!-- Step 1: FHE Keys -->
	<section>
		<h2>Step 1: Initialize FHE Keys</h2>
		<p>
			FHE (Fully Homomorphic Encryption) keys allow you to place encrypted bets that the
			coordinator cannot decrypt. This ensures your betting strategy remains private.
		</p>

		{#if fheStatus === 'checking'}
			<p>⏳ Checking for existing keys...</p>
		{:else if fheStatus === 'not_started'}
			<div class="status-box">
				<p>❌ No FHE keys found</p>
				<button is-="button primary" on:click={generateFheKeys}>Generate FHE Keys</button>
				<p class="warning">
					⚠️ This will take 10-30 seconds. Please don't close this tab during generation.
				</p>
			</div>
		{:else if fheStatus === 'generating'}
			<div class="status-box">
				<p>⏳ {fheMessage}</p>
				<div class="progress-container">
					<div class="progress-bar" style="width: {fheProgress}%"></div>
				</div>
				<p class="progress-text">{fheProgress}%</p>
				<p class="info">
					This takes 10-30 seconds. The keys will be stored locally in your browser (~135MB).
				</p>
			</div>
		{:else if fheStatus === 'complete'}
			<div class="status-box success">
				<p>✅ FHE keys generated and saved</p>
				<p class="info">Keys are stored securely in IndexedDB (~135MB)</p>
			</div>
		{:else if fheStatus === 'error'}
			<div class="status-box error">
				<p>❌ Error: {errorMessage}</p>
				<button is-="button" on:click={generateFheKeys}>Retry</button>
			</div>
		{/if}
	</section>

	<!-- Step 2: Wallet (placeholder) -->
	<section>
		<h2>Step 2: Create/Import Wallet</h2>
		<p class="muted">Status: Coming soon (will use monero-ts)</p>
		<p>You'll be able to create a new Monero wallet or import an existing one.</p>
	</section>

	<!-- Step 3: Daemon (placeholder) -->
	<section>
		<h2>Step 3: Connect to Daemon</h2>
		<p class="muted">Status: Coming soon</p>
		<p>The wallet will sync with a Monero mainnet daemon to check balances and submit transactions.</p>
	</section>

	<!-- Continue button -->
	{#if fheStatus === 'complete'}
		<div class="continue-section">
			<button is-="button primary large" on:click={continueToMarkets}>
				Continue to Markets →
			</button>
		</div>
	{/if}
</div>

<style>
	section {
		margin: 2rem 0;
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: 4px;
	}

	.status-box {
		padding: 1rem;
		margin: 1rem 0;
		background: var(--bg-secondary, #1a1a1a);
		border-left: 4px solid var(--primary, #88c0d0);
	}

	.status-box.success {
		border-left-color: var(--success, #a3be8c);
	}

	.status-box.error {
		border-left-color: var(--error, #bf616a);
	}

	.progress-container {
		width: 100%;
		height: 24px;
		background: var(--bg-tertiary, #0a0a0a);
		border: 1px solid var(--border);
		border-radius: 4px;
		overflow: hidden;
		margin: 0.5rem 0;
	}

	.progress-bar {
		height: 100%;
		background: var(--primary, #88c0d0);
		transition: width 0.3s ease;
	}

	.progress-text {
		text-align: center;
		font-weight: bold;
		margin: 0.5rem 0;
	}

	.warning {
		color: var(--warning, #ebcb8b);
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	.info {
		color: var(--text-secondary, #999);
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	.muted {
		color: var(--text-secondary, #999);
		font-style: italic;
	}

	.continue-section {
		margin-top: 2rem;
		text-align: center;
	}

	button {
		margin: 0.5rem 0;
	}
</style>
