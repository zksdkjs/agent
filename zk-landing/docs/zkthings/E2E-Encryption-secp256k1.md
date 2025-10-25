---
sidebar_position: 3
---
# E2E Encryption with secp256k1

End-to-end encryption library using secp256k1 - **compatible with EVM key pairs** (Ethereum, Polygon, BSC). Perfect for Web3 apps that need private data.

[![npm version](https://badge.fury.io/js/%40zkthings%2Fe2e-encryption-secp256k1.svg)](https://www.npmjs.com/package/@zkthings/e2e-encryption-secp256k1)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Key Features

- Uses secp256k1 keys (EVM compatible format)
- Store encrypted data anywhere (IPFS, traditional DB, any chain)
- Uses EVM-style addresses and keys
- End-to-end encryption using ECDH + AES-256-GCM
- Works with any data type (objects, arrays, primitives)
- Data integrity verification built-in
- Supports notary pattern (dual access encryption)

## Installation

```bash
bun add @zkthings/e2e-encryption-secp256k1
# or
npm install @zkthings/e2e-encryption-secp256k1
```

## Quick Start

```javascript
const { Secp256k1E2E } = require('@zkthings/e2e-encryption-secp256k1');

// Initialize
const e2e = new Secp256k1E2E();

// Encrypt data for a recipient
const encrypted = await e2e.encryptFor(
    { secret: "sensitive data" },
    "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // EVM format address
    recipientPublicKey // secp256k1 public key
);

// Later: Recipient decrypts
const decrypted = await e2e.decrypt(encrypted, recipientPrivateKey);
```

## API Reference

### Node.js Usage (Secp256k1E2E)

```javascript
const { Secp256k1E2E } = require('@zkthings/e2e-encryption-secp256k1');
const e2e = new Secp256k1E2E();
```

#### `encryptFor(data, recipientAddress, recipientPublicKey)`
Encrypts data for a specific Ethereum address.

- `data`: Any JSON-serializable data
- `recipientAddress`: Ethereum address (with or without '0x' prefix)
- `recipientPublicKey`: secp256k1 public key
- Returns: `Promise<{ publicSignals: {...} }>`

#### `decrypt({ publicSignals, privateKey })`
Decrypts data using a private key.

- `publicSignals`: Encrypted data object
- `privateKey`: secp256k1 private key (with '0x' prefix)
- Returns: `Promise<any>` - Original data

### Browser Usage (Secp256k1E2EBrowser)

```javascript
const { Secp256k1E2EBrowser } = require('@zkthings/e2e-encryption-secp256k1');
const e2e = new Secp256k1E2EBrowser();
```

Same API as Node.js version, but with browser-compatible implementations.

### Advanced Features

#### Notary Access
Encrypt data with dual access (both user and notary can decrypt):

```javascript
const encrypted = await e2e.encryptWithNotary(
    data,
    userAddress,
    userPublicKey,
    notaryAddress,
    notaryPublicKey
);

// User decryption
const userDecrypted = await e2e.decrypt({
    publicSignals: encrypted.publicSignals,
    privateKey: userPrivateKey,
    type: 'user'
});

// Notary decryption
const notaryDecrypted = await e2e.decrypt({
    publicSignals: encrypted.publicSignals,
    privateKey: notaryPrivateKey,
    type: 'notary'
});
```

#### Batch Decryption
Decrypt multiple encrypted items efficiently:

```javascript
const decryptedItems = await e2e.decryptMyMany(
    encryptedItems,
    privateKey
);
```

## Security

- Uses industry-standard ECDH for key exchange
- AES-256-GCM for symmetric encryption
- Includes authentication data to prevent tampering
- Ephemeral keys for perfect forward secrecy
- Secure key derivation using HKDF

## Error Handling

The library throws descriptive errors for common issues:

```javascript
try {
    await e2e.encryptFor(data, invalidAddress, publicKey);
} catch (error) {
    // Handles: Invalid address format, invalid keys, etc.
    console.error(error.message);
}
```

## Browser Compatibility

The browser version (`Secp256k1E2EBrowser`) is specifically designed for browser environments:
- Uses `crypto.subtle` when available
- Falls back to polyfills when needed
- Handles browser-specific crypto API differences

## Contributing

Want to contribute? Join our community and help us build the future of private data!

- GitHub: https://github.com/zksdkjs/e2e-encryption-secp256k1
- Twitter: https://x.com/zksdk_dev

## License

This project is licensed under the MIT License.
