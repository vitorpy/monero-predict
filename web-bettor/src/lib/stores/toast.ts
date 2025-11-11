import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration: number;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	return {
		subscribe,
		show: (message: string, type: ToastType = 'info', duration: number = 3000) => {
			const id = `${Date.now()}-${Math.random()}`;
			const toast: Toast = { id, message, type, duration };

			update((toasts) => [...toasts, toast]);

			// Auto-remove after duration
			if (duration > 0) {
				setTimeout(() => {
					update((toasts) => toasts.filter((t) => t.id !== id));
				}, duration);
			}
		},
		dismiss: (id: string) => {
			update((toasts) => toasts.filter((t) => t.id !== id));
		},
		clear: () => {
			update(() => []);
		}
	};
}

export const toasts = createToastStore();

// Convenience functions
export const showSuccess = (message: string, duration?: number) =>
	toasts.show(message, 'success', duration);
export const showError = (message: string, duration?: number) =>
	toasts.show(message, 'error', duration);
export const showInfo = (message: string, duration?: number) =>
	toasts.show(message, 'info', duration);
export const showWarning = (message: string, duration?: number) =>
	toasts.show(message, 'warning', duration);
