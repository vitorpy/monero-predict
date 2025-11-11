/**
 * Cryptographic utilities for secure seed phrase storage
 *
 * Uses Web Crypto API for strong encryption:
 * - PBKDF2 for password-based key derivation (100k iterations)
 * - AES-GCM for authenticated encryption
 * - Unique salt and IV per encryption
 */

const PBKDF2_ITERATIONS = 100_000;
const SALT_LENGTH = 32; // bytes
const IV_LENGTH = 12; // bytes (96 bits for GCM)
const KEY_LENGTH = 256; // bits

/**
 * Encrypted data structure
 */
export interface EncryptedData {
	ciphertext: Uint8Array;
	salt: Uint8Array;
	iv: Uint8Array;
}

// Type helper to ensure ArrayBuffer (not SharedArrayBuffer)
type StrictUint8Array = Uint8Array & { buffer: ArrayBuffer };

/**
 * Derive encryption key from password using PBKDF2
 *
 * @param password - User password
 * @param salt - Cryptographic salt (32 bytes)
 * @returns CryptoKey for AES-GCM encryption
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
	// Convert password to key material
	const encoder = new TextEncoder();
	const passwordBuffer = encoder.encode(password);

	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		passwordBuffer,
		'PBKDF2',
		false,
		['deriveBits', 'deriveKey']
	);

	// Derive AES-GCM key (cast salt to fix ArrayBuffer type)
	return crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: salt as StrictUint8Array,
			iterations: PBKDF2_ITERATIONS,
			hash: 'SHA-256'
		},
		keyMaterial,
		{
			name: 'AES-GCM',
			length: KEY_LENGTH
		},
		false,
		['encrypt', 'decrypt']
	);
}

/**
 * Encrypt data with password
 *
 * @param data - Data to encrypt (typically seed phrase)
 * @param password - User password
 * @returns Encrypted data with salt and IV
 */
export async function encrypt(data: string, password: string): Promise<EncryptedData> {
	// Generate random salt and IV (ensure ArrayBuffer, not SharedArrayBuffer)
	const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH)) as StrictUint8Array;
	const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH)) as StrictUint8Array;

	// Derive key from password
	const key = await deriveKey(password, salt);

	// Encrypt data
	const encoder = new TextEncoder();
	const dataBuffer = encoder.encode(data);

	const ciphertext = await crypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv
		},
		key,
		dataBuffer
	);

	return {
		ciphertext: new Uint8Array(ciphertext),
		salt,
		iv
	};
}

/**
 * Decrypt data with password
 *
 * @param encrypted - Encrypted data structure
 * @param password - User password
 * @returns Decrypted data
 * @throws Error if password is incorrect or data is corrupted
 */
export async function decrypt(encrypted: EncryptedData, password: string): Promise<string> {
	// Derive key from password
	const key = await deriveKey(password, encrypted.salt);

	try {
		// Decrypt data (cast iv and ciphertext to fix ArrayBuffer type)
		const decrypted = await crypto.subtle.decrypt(
			{
				name: 'AES-GCM',
				iv: encrypted.iv as StrictUint8Array
			},
			key,
			encrypted.ciphertext as StrictUint8Array
		);

		// Convert to string
		const decoder = new TextDecoder();
		return decoder.decode(decrypted);
	} catch (error) {
		throw new Error('Decryption failed. Incorrect password or corrupted data.');
	}
}

/**
 * Validate password strength (simplified to 4-digit PIN)
 *
 * @param password - Password/PIN to validate
 * @returns Validation result with errors
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	// Simplified: just require 4 digits
	if (password.length !== 4) {
		errors.push('PIN must be exactly 4 digits');
	}

	if (!/^\d+$/.test(password)) {
		errors.push('PIN must contain only numbers');
	}

	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Generate random password (for testing)
 *
 * @param length - Password length (default 16)
 * @returns Random password
 */
export function generateRandomPassword(length: number = 16): string {
	const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
	const randomValues = crypto.getRandomValues(new Uint8Array(length));
	return Array.from(randomValues)
		.map((value) => charset[value % charset.length])
		.join('');
}

/**
 * Hash password for comparison (non-reversible)
 *
 * Useful for verifying password without storing it.
 *
 * @param password - Password to hash
 * @returns SHA-256 hash as hex string
 */
export async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
