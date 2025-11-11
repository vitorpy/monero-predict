<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { fade, fly } from 'svelte/transition';

	function getIcon(type: string): string {
		switch (type) {
			case 'success':
				return '✓';
			case 'error':
				return '✗';
			case 'warning':
				return '⚠';
			case 'info':
				return 'ℹ';
			default:
				return '•';
		}
	}
</script>

<div class="toast-container">
	{#each $toasts as toast (toast.id)}
		<div
			class="toast toast-{toast.type}"
			transition:fly={{ y: -20, duration: 300 }}
			role="alert"
		>
			<span class="toast-icon">{getIcon(toast.type)}</span>
			<span class="toast-message">{toast.message}</span>
			<button class="toast-close" onclick={() => toasts.dismiss(toast.id)} aria-label="Close">
				×
			</button>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 400px;
	}

	.toast {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		background: var(--color-bg-secondary, #1a1a1a);
		border: 1px solid;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
		font-size: 0.9rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
		min-width: 300px;
	}

	.toast-success {
		border-color: #7dff7d;
		background: linear-gradient(135deg, rgba(125, 255, 125, 0.1) 0%, var(--color-bg-secondary, #1a1a1a) 100%);
	}

	.toast-error {
		border-color: #ff7d7d;
		background: linear-gradient(135deg, rgba(255, 125, 125, 0.1) 0%, var(--color-bg-secondary, #1a1a1a) 100%);
	}

	.toast-warning {
		border-color: #ffd77d;
		background: linear-gradient(135deg, rgba(255, 215, 125, 0.1) 0%, var(--color-bg-secondary, #1a1a1a) 100%);
	}

	.toast-info {
		border-color: #7dd7ff;
		background: linear-gradient(135deg, rgba(125, 215, 255, 0.1) 0%, var(--color-bg-secondary, #1a1a1a) 100%);
	}

	.toast-icon {
		font-size: 1.25rem;
		font-weight: bold;
		flex-shrink: 0;
		width: 1.5rem;
		text-align: center;
	}

	.toast-success .toast-icon {
		color: #7dff7d;
	}

	.toast-error .toast-icon {
		color: #ff7d7d;
	}

	.toast-warning .toast-icon {
		color: #ffd77d;
	}

	.toast-info .toast-icon {
		color: #7dd7ff;
	}

	.toast-message {
		flex: 1;
		line-height: 1.4;
	}

	.toast-close {
		background: none;
		border: none;
		color: var(--color-text, #fff);
		font-size: 1.5rem;
		line-height: 1;
		padding: 0;
		width: 1.5rem;
		height: 1.5rem;
		cursor: pointer;
		opacity: 0.6;
		transition: opacity 0.2s;
		flex-shrink: 0;
	}

	.toast-close:hover {
		opacity: 1;
	}

	/* Mobile responsiveness */
	@media (max-width: 480px) {
		.toast-container {
			right: 0.5rem;
			left: 0.5rem;
			max-width: none;
		}

		.toast {
			min-width: 0;
		}
	}
</style>
