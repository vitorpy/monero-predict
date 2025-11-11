<script lang="ts">
	import {
		exportAllData,
		importAllData,
		getExportStats,
		clearAllData
	} from '$lib/services/storage';
	import { showSuccess, showError, showWarning } from '$lib/stores/toast';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let stats = $state({
		hasFheKeys: false,
		hasWallet: false,
		betCount: 0,
		estimatedSizeMB: 0
	});
	let loading = $state(false);
	let exporting = $state(false);
	let importing = $state(false);
	let clearing = $state(false);

	onMount(async () => {
		await loadStats();
	});

	async function loadStats() {
		loading = true;
		try {
			stats = await getExportStats();
		} catch (error) {
			console.error('[Data] Failed to load stats:', error);
			showError('Failed to load data statistics');
		} finally {
			loading = false;
		}
	}

	async function handleExport() {
		exporting = true;
		try {
			const blob = await exportAllData();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `monero-predict-backup-${Date.now()}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			showSuccess('Data exported successfully!');
		} catch (error) {
			console.error('[Data] Export failed:', error);
			showError(error instanceof Error ? error.message : 'Failed to export data');
		} finally {
			exporting = false;
		}
	}

	async function handleImport(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		importing = true;
		try {
			await importAllData(file);
			await loadStats();
			showSuccess('Data imported successfully!');

			// Reset file input
			input.value = '';
		} catch (error) {
			console.error('[Data] Import failed:', error);
			showError(error instanceof Error ? error.message : 'Failed to import data');
		} finally {
			importing = false;
		}
	}

	async function handleClearAll() {
		const confirmed = confirm(
			'⚠️ WARNING: This will permanently delete ALL data including FHE keys, wallet, and bets.\n\nMake sure you have exported a backup first!\n\nAre you absolutely sure?'
		);

		if (!confirmed) return;

		const doubleConfirm = confirm('This action cannot be undone. Continue?');
		if (!doubleConfirm) return;

		clearing = true;
		try {
			await clearAllData();
			await loadStats();
			showWarning('All data cleared');

			// Redirect to setup after clearing
			setTimeout(() => {
				goto('/setup');
			}, 2000);
		} catch (error) {
			console.error('[Data] Clear failed:', error);
			showError(error instanceof Error ? error.message : 'Failed to clear data');
		} finally {
			clearing = false;
		}
	}
</script>

<div is-="view">
	<h1>💾 Data Management</h1>
	<p>Export, import, or clear your local data</p>

	<!-- Data Statistics -->
	<section class="stats-section">
		<h2>Current Data</h2>
		{#if loading}
			<p>Loading statistics...</p>
		{:else}
			<div class="stats-grid">
				<div class="stat-card">
					<span class="stat-icon">🔐</span>
					<div class="stat-content">
						<span class="stat-label">FHE Keys</span>
						<span class="stat-value {stats.hasFheKeys ? 'success' : 'muted'}">
							{stats.hasFheKeys ? '✓ Present' : '✗ Not Found'}
						</span>
					</div>
				</div>

				<div class="stat-card">
					<span class="stat-icon">👛</span>
					<div class="stat-content">
						<span class="stat-label">Wallet</span>
						<span class="stat-value {stats.hasWallet ? 'success' : 'muted'}">
							{stats.hasWallet ? '✓ Present' : '✗ Not Found'}
						</span>
					</div>
				</div>

				<div class="stat-card">
					<span class="stat-icon">🎲</span>
					<div class="stat-content">
						<span class="stat-label">Bets</span>
						<span class="stat-value">{stats.betCount}</span>
					</div>
				</div>

				<div class="stat-card">
					<span class="stat-icon">📊</span>
					<div class="stat-content">
						<span class="stat-label">Est. Size</span>
						<span class="stat-value">{stats.estimatedSizeMB.toFixed(2)} MB</span>
					</div>
				</div>
			</div>
		{/if}
	</section>

	<!-- Export Data -->
	<section class="action-section">
		<h2>Export Data</h2>
		<p class="section-hint">
			Download all your data (FHE keys, wallet, bets) as a JSON backup file. Store this file
			securely!
		</p>

		<div class="warning-box">
			<p>⚠️ Important Security Notes:</p>
			<ul>
				<li>The export contains your encrypted wallet seed phrase</li>
				<li>Store the backup file in a secure location</li>
				<li>Never share this file with anyone</li>
				<li>FHE keys are ~135MB, so the file may be large</li>
			</ul>
		</div>

		<button
			is-="button primary"
			onclick={handleExport}
			disabled={exporting || (!stats.hasFheKeys && !stats.hasWallet && stats.betCount === 0)}
		>
			{#if exporting}
				⏳ Exporting...
			{:else}
				💾 Export All Data
			{/if}
		</button>
	</section>

	<!-- Import Data -->
	<section class="action-section">
		<h2>Import Data</h2>
		<p class="section-hint">
			Restore data from a previous backup file. This will overwrite all existing data!
		</p>

		<div class="warning-box error">
			<p>⚠️ WARNING: Importing will delete all current data!</p>
			<ul>
				<li>All current FHE keys will be replaced</li>
				<li>All current wallet data will be replaced</li>
				<li>All current bets will be replaced</li>
				<li>Make sure you have a backup before proceeding</li>
			</ul>
		</div>

		<div class="file-input-wrapper">
			<input
				type="file"
				accept=".json"
				onchange={handleImport}
				id="import-file"
				disabled={importing}
			/>
			<label for="import-file" class="file-label">
				{#if importing}
					⏳ Importing...
				{:else}
					📂 Choose Backup File
				{/if}
			</label>
		</div>
	</section>

	<!-- Clear All Data -->
	<section class="action-section danger">
		<h2>⚠️ Danger Zone</h2>
		<p class="section-hint">Permanently delete all data. This action cannot be undone!</p>

		<div class="warning-box error">
			<p>🚨 DANGER: This will permanently delete:</p>
			<ul>
				<li>All FHE keys (~135MB)</li>
				<li>Wallet data (encrypted seed phrase)</li>
				<li>All bet history and nonces</li>
			</ul>
			<p><strong>Make sure you have exported a backup first!</strong></p>
		</div>

		<button is-="button error" onclick={handleClearAll} disabled={clearing}>
			{#if clearing}
				⏳ Clearing...
			{:else}
				🗑️ Clear All Data
			{/if}
		</button>
	</section>
</div>

<style>
	.stats-section {
		margin: 2rem 0;
		padding: 1.5rem;
		border: 1px solid var(--color-border, #444);
		border-radius: 4px;
		background: var(--color-bg-secondary, #1a1a1a);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-bg, #000);
		border: 1px solid var(--color-border, #444);
		border-radius: 4px;
	}

	.stat-icon {
		font-size: 2rem;
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-label {
		font-size: 0.85rem;
		color: var(--color-text-muted, #888);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stat-value {
		font-size: 1.1rem;
		font-weight: bold;
	}

	.stat-value.success {
		color: #7dff7d;
	}

	.stat-value.muted {
		color: var(--color-text-muted, #888);
	}

	.action-section {
		margin: 2rem 0;
		padding: 1.5rem;
		border: 1px solid var(--color-border, #444);
		border-radius: 4px;
		background: var(--color-bg-secondary, #1a1a1a);
	}

	.action-section.danger {
		border-color: #ff7d7d;
		border-left: 4px solid #ff7d7d;
	}

	.section-hint {
		margin: 0.5rem 0 1rem;
		font-size: 0.9rem;
		color: var(--color-text-muted, #888);
	}

	.warning-box {
		background: rgba(255, 215, 125, 0.1);
		border: 1px solid #ffd77d;
		border-left: 4px solid #ffd77d;
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 4px;
	}

	.warning-box.error {
		background: rgba(255, 125, 125, 0.1);
		border-color: #ff7d7d;
		border-left-color: #ff7d7d;
	}

	.warning-box p {
		margin: 0.5rem 0;
		font-weight: bold;
	}

	.warning-box ul {
		margin: 0.5rem 0 0.5rem 1.5rem;
		font-size: 0.9rem;
	}

	.warning-box li {
		margin: 0.25rem 0;
	}

	.file-input-wrapper {
		margin-top: 1rem;
	}

	.file-input-wrapper input[type='file'] {
		display: none;
	}

	.file-label {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: var(--color-primary, #7dff7d);
		color: var(--color-bg, #000);
		border: none;
		border-radius: 4px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s;
		font-family: 'Courier New', monospace;
	}

	.file-label:hover {
		background: var(--color-primary-hover, #6ee76e);
		transform: translateY(-1px);
	}

	.file-label:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
