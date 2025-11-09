/**
 * FHE Key Generation Web Worker
 *
 * Runs FHE key generation off the main thread to prevent UI blocking.
 * Key generation takes 10-30 seconds and is CPU-intensive.
 */

// Worker message types
export interface KeygenStartMessage {
	type: 'generate';
}

export interface KeygenProgressMessage {
	type: 'progress';
	percent: number;
	message: string;
}

export interface KeygenSuccessMessage {
	type: 'success';
	clientKey: Uint8Array;
	serverKey: Uint8Array;
}

export interface KeygenErrorMessage {
	type: 'error';
	error: string;
}

export type KeygenWorkerMessage =
	| KeygenProgressMessage
	| KeygenSuccessMessage
	| KeygenErrorMessage;

// Worker context
const ctx: Worker = self as any;

// Handle incoming messages
ctx.addEventListener('message', async (event: MessageEvent<KeygenStartMessage>) => {
	if (event.data.type === 'generate') {
		await generateKeys();
	}
});

async function generateKeys(): Promise<void> {
	try {
		// Progress: Initializing WASM
		ctx.postMessage({
			type: 'progress',
			percent: 10,
			message: 'Initializing WASM module...'
		} satisfies KeygenProgressMessage);

		// Import WASM module
		const wasmModule = await import('$lib/wasm/monero_predict_fhe_client');

		// Progress: Generating keys
		ctx.postMessage({
			type: 'progress',
			percent: 30,
			message: 'Generating FHE keys (this takes 10-30 seconds)...'
		} satisfies KeygenProgressMessage);

		// Generate keys (blocking operation)
		const startTime = Date.now();
		const client = new wasmModule.WasmFheClient();

		// Progress: Exporting keys
		ctx.postMessage({
			type: 'progress',
			percent: 70,
			message: 'Exporting keys...'
		} satisfies KeygenProgressMessage);

		// Export keys as Uint8Array
		const clientKey = client.export_client_key();
		const serverKey = client.export_server_key();

		const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
		console.log(
			`[Worker] Key generation completed in ${elapsed}s (client: ${(clientKey.byteLength / 1024 / 1024).toFixed(1)}MB, server: ${(serverKey.byteLength / 1024 / 1024).toFixed(1)}MB)`
		);

		// Progress: Complete
		ctx.postMessage({
			type: 'progress',
			percent: 100,
			message: 'Keys generated successfully!'
		} satisfies KeygenProgressMessage);

		// Send keys back to main thread using Transferable (zero-copy)
		ctx.postMessage(
			{
				type: 'success',
				clientKey,
				serverKey
			} satisfies KeygenSuccessMessage,
			// Transfer ownership to main thread (more efficient than copying)
			[clientKey.buffer, serverKey.buffer]
		);

		// Worker will be terminated by main thread
	} catch (error) {
		console.error('[Worker] Key generation failed:', error);

		ctx.postMessage({
			type: 'error',
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		} satisfies KeygenErrorMessage);
	}
}
