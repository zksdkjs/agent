/**
 * Cryptographic utilities
 */

/**
 * Generate a random hex string
 */
export function generateRandomHex(length: number): string {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * Generate a random transaction hash
 */
export function generateTransactionHash(): string {
  return generateRandomHex(64);
}

/**
 * Generate a random address
 */
export function generateRandomAddress(): string {
  return generateRandomHex(40);
}

/**
 * Hash a string using a simple hash function (for demo purposes)
 */
export function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Check if a string is a valid hex format
 */
export function isHexString(str: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(str);
}

/**
 * Convert hex string to bytes (for demo purposes)
 */
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Convert bytes to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return '0x' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}