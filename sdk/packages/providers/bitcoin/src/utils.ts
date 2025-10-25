import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';

/**
 * Utility functions for Bitcoin Silent Payments
 */

/**
 * Calculate the shared secret using ECDH
 * shared_secret = a * B_scan = b_scan * A
 * @param publicKey - Public key (B_scan or A)
 * @param privateKey - Private key (a or b_scan)
 * @returns Shared secret point (compressed public key format)
 */
export function calculateSharedSecret(publicKey: Buffer, privateKey: Buffer): Buffer {
  // ECDH: shared_secret = private_key * public_key
  const sharedPoint = ecc.pointMultiply(publicKey, privateKey);
  if (!sharedPoint) {
    throw new Error('ECDH computation failed');
  }
  return Buffer.from(sharedPoint);
}

/**
 * Tagged hash function as defined in BIP340
 * @param tag - The tag to use for hashing
 * @param data - The data to hash
 * @returns Hashed data
 */
export function taggedHash(tag: string, data: Buffer): Buffer {
  const tagHash = bitcoin.crypto.sha256(Buffer.from(tag, 'utf8'));
  return bitcoin.crypto.sha256(Buffer.concat([tagHash, tagHash, data]));
}

/**
 * Hash function for BIP352/Inputs tag
 * @param data - Data to hash
 * @returns Hashed data
 */
export function hashBIP0352Inputs(data: Buffer): Buffer {
  return taggedHash('BIP0352/Inputs', data);
}

/**
 * Hash function for BIP352/SharedSecret tag
 * @param data - Data to hash
 * @returns Hashed data
 */
export function hashBIP0352SharedSecret(data: Buffer): Buffer {
  return taggedHash('BIP0352/SharedSecret', data);
}

/**
 * Hash function for BIP352/Label tag
 * @param data - Data to hash
 * @returns Hashed data
 */
export function hashBIP0352Label(data: Buffer): Buffer {
  return taggedHash('BIP0352/Label', data);
}

/**
 * Serialize a 32-bit unsigned integer (most significant byte first)
 * @param i - Integer to serialize
 * @returns Serialized buffer
 */
export function ser32(i: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeUInt32BE(i, 0);
  return buf;
}

/**
 * Serialize a 256-bit integer (most significant byte first)
 * @param p - Buffer to serialize
 * @returns Serialized buffer
 */
export function ser256(p: Buffer): Buffer {
  if (p.length !== 32) {
    throw new Error('ser256 expects 32-byte buffer');
  }
  return Buffer.from(p);
}

/**
 * Serialize a point in compressed form (SEC1)
 * @param P - Point to serialize
 * @returns Serialized buffer
 */
export function serP(P: Buffer): Buffer {
  // Already in compressed form from tiny-secp256k1
  return Buffer.from(P);
}

/**
 * Check if a scalar is valid (0 < scalar < n)
 * @param scalar - Scalar to validate
 * @returns True if valid, false otherwise
 */
export function isValidScalar(scalar: Buffer): boolean {
  // Curve order for secp256k1
  const n = Buffer.from('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 'hex');
  
  // Check if scalar is zero
  if (scalar.equals(Buffer.alloc(32))) {
    return false;
  }
  
  // Check if scalar >= n
  if (scalar.length > 32) {
    return false;
  }
  
  // Pad scalar to 32 bytes for comparison
  const paddedScalar = Buffer.alloc(32);
  if (scalar.length < 32) {
    scalar.copy(paddedScalar, 32 - scalar.length);
  } else {
    scalar.copy(paddedScalar);
  }
  
  // Compare with curve order
  return paddedScalar.compare(n) < 0;
}

/**
 * Convert a public key to x-only format (32 bytes)
 * @param publicKey - Public key in compressed format (33 bytes)
 * @returns X-only public key (32 bytes)
 */
export function toXOnly(publicKey: Buffer): Buffer {
  if (publicKey.length !== 33) {
    throw new Error('Expected compressed public key (33 bytes)');
  }
  return publicKey.slice(1, 33);
}

/**
 * Negate a private key if needed to ensure even Y coordinate
 * @param privateKey - Private key to check/negate
 * @param publicKey - Corresponding public key
 * @returns Negated private key if needed
 */
export function negateIfOddY(privateKey: Buffer, publicKey: Buffer): Buffer {
  if (publicKey.length !== 33) {
    throw new Error('Expected compressed public key (33 bytes)');
  }
  
  // Check if Y coordinate is odd (first byte is 0x03)
  if (publicKey[0] === 0x03) {
    // Negate the private key (n - privateKey)
    const n = Buffer.from('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 'hex');
    const privateKeyBN = BigInt('0x' + privateKey.toString('hex'));
    const nBN = BigInt('0x' + n.toString('hex'));
    const negatedBN = (nBN - privateKeyBN) % nBN;
    
    // Convert BigInt back to 32-byte buffer
    const negatedHex = negatedBN.toString(16).padStart(64, '0');
    return Buffer.from(negatedHex, 'hex');
  }
  
  return Buffer.from(privateKey);
}
