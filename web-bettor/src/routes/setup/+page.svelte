<script lang="ts">
	import { onMount } from 'svelte';
	import { hasKeys, generateKeysInWorker } from '$lib/services/fhe';
	import { hasWallet, createWallet, restoreWallet, syncWallet } from '$lib/services/wallet';
	import { validatePassword } from '$lib/utils/crypto';
	import { goto } from '$app/navigation';

	let fheStatus = $state<'checking' | 'not_started' | 'generating' | 'complete' | 'error'>(
		'checking'
	);
	let fheProgress = $state(0);
	let fheMessage = $state('');
	let errorMessage = $state('');

	let walletStatus = $state<'checking' | 'not_started' | 'creating' | 'restoring' | 'complete' | 'error'>(
		'checking'
	);
	let walletError = $state('');
	let walletMode = $state<'create' | 'restore'>('create');
	let walletPassword = $state('');
	let walletPasswordConfirm = $state('');
	let walletSeed = $state(''); // For restoration
	let walletAddress = $state('');
	let generatedSeed = $state(''); // For showing new wallet seed
	let showSeed = $state(false);

	let syncStatus = $state<'not_started' | 'syncing' | 'complete' | 'error'>('not_started');
	let syncProgress = $state(0);
	let syncHeight = $state(0);
	let syncMessage = $state('');
	let syncError = $state('');

	onMount(async () => {
		// Check if keys already exist
		const keysExist = await hasKeys();
		fheStatus = keysExist ? 'complete' : 'not_started';

		// Check if wallet exists
		const walletExists = await hasWallet();
		walletStatus = walletExists ? 'complete' : 'not_started';
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

	async function handleCreateWallet() {
		// Validate password
		const validation = validatePassword(walletPassword);
		if (!validation.valid) {
			walletError = validation.errors.join(', ');
			return;
		}

		if (walletPassword !== walletPasswordConfirm) {
			walletError = 'Passwords do not match';
			return;
		}

		walletStatus = 'creating';
		walletError = '';

		try {
			const result = await createWallet(walletPassword);
			walletAddress = result.primaryAddress;
			generatedSeed = result.seed;
			walletStatus = 'complete';
			showSeed = true;
			console.log('[Setup] Wallet created:', walletAddress);
		} catch (error) {
			walletStatus = 'error';
			walletError = error instanceof Error ? error.message : 'Failed to create wallet';
			console.error('[Setup] Wallet creation failed:', error);
		}
	}

	async function handleRestoreWallet() {
		// Validate password
		const validation = validatePassword(walletPassword);
		if (!validation.valid) {
			walletError = validation.errors.join(', ');
			return;
		}

		if (!walletSeed.trim()) {
			walletError = 'Please enter your 25-word seed phrase';
			return;
		}

		walletStatus = 'restoring';
		walletError = '';

		try {
			const result = await restoreWallet(walletSeed.trim(), walletPassword);
			walletAddress = result.primaryAddress;
			walletStatus = 'complete';
			console.log('[Setup] Wallet restored:', walletAddress);
		} catch (error) {
			walletStatus = 'error';
			walletError = error instanceof Error ? error.message : 'Failed to restore wallet';
			console.error('[Setup] Wallet restoration failed:', error);
		}
	}

	async function handleSyncWallet() {
		syncStatus = 'syncing';
		syncProgress = 0;
		syncHeight = 0;
		syncMessage = 'Connecting to daemon...';
		syncError = '';

		try {
			const finalHeight = await syncWallet((progress, height, message) => {
				syncProgress = Math.round(progress * 100);
				syncHeight = height;
				syncMessage = message;
			});

			syncStatus = 'complete';
			syncHeight = finalHeight;
			syncMessage = `Sync complete at height ${finalHeight}`;
			console.log('[Setup] Wallet synced to height:', finalHeight);
		} catch (error) {
			syncStatus = 'error';
			syncError = error instanceof Error ? error.message : 'Failed to sync wallet';
			console.error('[Setup] Wallet sync failed:', error);
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
				<button is-="button primary" onclick={generateFheKeys}>Generate FHE Keys</button>
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
				<button is-="button" onclick={generateFheKeys}>Retry</button>
			</div>
		{/if}
	</section>

	<!-- Step 2: Wallet -->
	<section>
		<h2>Step 2: Create/Import Wallet</h2>
		<p>
			Your Monero wallet will be created locally in your browser. The seed phrase will be encrypted
			with your password.
		</p>

		{#if walletStatus === 'checking'}
			<p>⏳ Checking for existing wallet...</p>
		{:else if walletStatus === 'not_started'}
			<div class="status-box">
				<p>❌ No wallet found</p>

				<!-- Mode selector -->
				<div class="mode-selector">
					<button
						is-="button {walletMode === 'create' ? 'primary' : ''}"
						onclick={() => (walletMode = 'create')}
					>
						Create New Wallet
					</button>
					<button
						is-="button {walletMode === 'restore' ? 'primary' : ''}"
						onclick={() => (walletMode = 'restore')}
					>
						Restore from Seed
					</button>
				</div>

				{#if walletMode === 'create'}
					<!-- Create wallet form -->
					<div class="form-group">
						<label for="password">Password:</label>
						<input
							is-="input"
							type="password"
							id="password"
							bind:value={walletPassword}
							placeholder="Min 8 chars, uppercase, lowercase, number"
						/>
					</div>

					<div class="form-group">
						<label for="password-confirm">Confirm Password:</label>
						<input
							is-="input"
							type="password"
							id="password-confirm"
							bind:value={walletPasswordConfirm}
							placeholder="Re-enter password"
						/>
					</div>

					<button is-="button primary" onclick={handleCreateWallet}>
						Create Wallet
					</button>
				{:else}
					<!-- Restore wallet form -->
					<div class="form-group">
						<label for="seed">Seed Phrase (25 words):</label>
						<textarea
							is-="input"
							id="seed"
							bind:value={walletSeed}
							rows="3"
							placeholder="Enter your 25-word Monero seed phrase"
						></textarea>
					</div>

					<div class="form-group">
						<label for="restore-password">Password:</label>
						<input
							is-="input"
							type="password"
							id="restore-password"
							bind:value={walletPassword}
							placeholder="Password to encrypt wallet"
						/>
					</div>

					<button is-="button primary" onclick={handleRestoreWallet}>
						Restore Wallet
					</button>
				{/if}

				{#if walletError}
					<p class="error-text">⚠️ {walletError}</p>
				{/if}
			</div>
		{:else if walletStatus === 'creating'}
			<div class="status-box">
				<p>⏳ Creating wallet...</p>
				<p class="info">This may take a few seconds.</p>
			</div>
		{:else if walletStatus === 'restoring'}
			<div class="status-box">
				<p>⏳ Restoring wallet from seed...</p>
				<p class="info">This may take a few seconds.</p>
			</div>
		{:else if walletStatus === 'complete'}
			<div class="status-box success">
				<p>✅ Wallet ready</p>
				<p class="info">Address: <code>{walletAddress}</code></p>

				{#if showSeed && generatedSeed}
					<div class="seed-display">
						<p class="warning">⚠️ IMPORTANT: Save your seed phrase!</p>
						<p class="warning">
							This is the ONLY way to recover your wallet. Write it down and store it securely.
						</p>
						<div class="seed-box">
							<code>{generatedSeed}</code>
						</div>
						<button
							is-="button"
							onclick={() => {
								navigator.clipboard.writeText(generatedSeed);
								alert('Seed phrase copied to clipboard!');
							}}
						>
							📋 Copy Seed Phrase
						</button>
					</div>
				{/if}
			</div>
		{:else if walletStatus === 'error'}
			<div class="status-box error">
				<p>❌ Error: {walletError}</p>
				<button is-="button" onclick={() => (walletStatus = 'not_started')}>
					Try Again
				</button>
			</div>
		{/if}
	</section>

	<!-- Step 3: Sync Wallet -->
	<section>
		<h2>Step 3: Sync with Blockchain</h2>
		<p>
			Connect to a Monero mainnet daemon and sync your wallet to check balances and enable
			transactions.
		</p>

		{#if syncStatus === 'not_started'}
			<div class="status-box">
				<p>❌ Wallet not synced</p>
				<p class="info">
					Daemon: <code>https://node.vern.cc:18081</code>
				</p>
				<button
					is-="button primary"
					onclick={handleSyncWallet}
					disabled={walletStatus !== 'complete'}
				>
					Start Sync
				</button>
				{#if walletStatus !== 'complete'}
					<p class="warning">⚠️ Complete wallet setup first</p>
				{:else}
					<p class="warning">⚠️ First sync may take several minutes</p>
				{/if}
			</div>
		{:else if syncStatus === 'syncing'}
			<div class="status-box">
				<p>⏳ {syncMessage}</p>
				<div class="progress-container">
					<div class="progress-bar" style="width: {syncProgress}%"></div>
				</div>
				<p class="progress-text">{syncProgress}% - Height: {syncHeight}</p>
				<p class="info">This may take 5-15 minutes depending on wallet age and network speed.</p>
			</div>
		{:else if syncStatus === 'complete'}
			<div class="status-box success">
				<p>✅ Wallet synced</p>
				<p class="info">Height: {syncHeight}</p>
				<p class="info">{syncMessage}</p>
			</div>
		{:else if syncStatus === 'error'}
			<div class="status-box error">
				<p>❌ Error: {syncError}</p>
				<button is-="button" onclick={handleSyncWallet}>Retry Sync</button>
			</div>
		{/if}
	</section>

	<!-- Continue button -->
	{#if fheStatus === 'complete' && walletStatus === 'complete' && syncStatus === 'complete'}
		<div class="continue-section">
			<button is-="button primary large" onclick={continueToMarkets}>
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

	.mode-selector {
		display: flex;
		gap: 0.5rem;
		margin: 1rem 0;
	}

	.form-group {
		margin: 1rem 0;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		max-width: 500px;
	}

	.error-text {
		color: var(--error, #bf616a);
		margin-top: 0.5rem;
	}

	.seed-display {
		margin-top: 1.5rem;
		padding: 1rem;
		background: var(--bg-tertiary, #0a0a0a);
		border: 2px solid var(--warning, #ebcb8b);
		border-radius: 4px;
	}

	.seed-box {
		padding: 1rem;
		background: var(--bg-secondary, #1a1a1a);
		border: 1px solid var(--border);
		border-radius: 4px;
		margin: 1rem 0;
		font-family: monospace;
		word-wrap: break-word;
		user-select: all;
	}

	.seed-box code {
		display: block;
		line-height: 1.6;
	}
</style>
