import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
	plugins: [
		sveltekit(),
		wasm(),
		topLevelAwait()
	],

	// Enable WASM and worker support
	worker: {
		format: 'es',
		plugins: () => [wasm(), topLevelAwait()]
	},

	// Optimize dependencies, exclude WASM modules from pre-bundling
	optimizeDeps: {
		exclude: ['monero-ts'],
		esbuildOptions: {
			target: 'esnext'
		}
	},

	build: {
		target: 'esnext'
	},

	server: {
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp'
		},
		fs: {
			allow: ['..']
		}
	}
});
