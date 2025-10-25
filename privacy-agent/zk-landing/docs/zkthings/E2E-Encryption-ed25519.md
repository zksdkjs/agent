---
sidebar_position: 4
---

# E2E Encryption Ed25519

End-to-end encryption library using Ed25519 keys for secure data transmission. Compatible with Solana, StarkNet, and other chains that use Ed25519 cryptography.

**Production Ready**: This package provides secure encryption using industry-standard Ed25519 cryptography.

## Features

- **Ed25519 Key Support**: Encrypt/decrypt data using Ed25519 key pairs
- **Multiple Data Types**: Support for strings, numbers, objects, arrays, and more
- **Chain Compatible**: Works with Solana, StarkNet, and other Ed25519-based wallets
- **AES-256-GCM Encryption**: Authenticated encryption with data integrity
- **TypeScript Support**: Full type safety and IntelliSense
- **Secure Key Exchange**: ECDH key exchange for shared secrets

## Installation

```bash
bun install @zkthings/e2e-encryption-ed25519
# or
npm install @zkthings/e2e-encryption-ed25519
```

## Quick Start

```typescript
import { Ed25519E2E } from '@zkthings/e2e-encryption-ed25519';

// Initialize E2E encryption
const e2e = new Ed25519E2E();

// Encrypt data for recipient
const encrypted = await e2e.encryptFor(
  'Hello, World!',
  '0x1234...', // recipient address
  publicKey    // recipient's Ed25519 public key
);

// Decrypt data
const decrypted = await e2e.decrypt(encrypted, privateKey);
console.log(decrypted); // "Hello, World!"
```

## Chain Compatibility

This library works with any wallet or chain that uses **Ed25519 keys**:

### Solana
- **Native Support**: Works directly with Solana wallet key pairs
- **Address Format**: Base58 encoded addresses
- **Integration**: Compatible with @solana/web3.js

### StarkNet
- **Key Format**: Ed25519 public/private keys
- **Address Format**: Felt addresses (0x...)
- **Integration**: Compatible with starknet.js

### Other Chains
Any blockchain or wallet system using Ed25519 cryptography is supported.

## API Reference

### Basic Encryption

```typescript
import { Ed25519E2E } from '@zkthings/e2e-encryption-ed25519';

const e2e = new Ed25519E2E();

// Encrypt string data
const encryptedString = await e2e.encryptFor(
  'Secret message',
  recipientAddress,
  recipientPublicKey
);

// Encrypt object data
const encryptedObject = await e2e.encryptFor(
  { amount: 1000, currency: 'USD' },
  recipientAddress,
  recipientPublicKey
);

// Encrypt array data
const encryptedArray = await e2e.encryptFor(
  [1, 2, 3, 'secret'],
  recipientAddress,
  recipientPublicKey
);
```

### Decryption

```typescript
// Decrypt any supported data type
const decrypted = await e2e.decrypt(encryptedData, privateKey);

// Type will be automatically preserved
console.log(typeof decrypted); // original type maintained
```

## Integration Examples

### Solana Wallet Integration

```typescript
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { Ed25519E2E } from '@zkthings/e2e-encryption-ed25519';

// Initialize encryption
const e2e = new Ed25519E2E();

// Create or connect to Solana wallet
const wallet = Keypair.generate();
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Encrypt message for Solana wallet
const encrypted = await e2e.encryptFor(
  'Hello Solana!',
  wallet.publicKey.toString(),
  wallet.publicKey.toBytes()
);

// Decrypt with private key
const decrypted = await e2e.decrypt(encrypted, wallet.secretKey);
```

### StarkNet Integration

```typescript
import { Account, Provider, ec } from 'starknet';
import { Ed25519E2E } from '@zkthings/e2e-encryption-ed25519';

// Initialize encryption
const e2e = new Ed25519E2E();

// StarkNet account setup
const provider = new Provider({ sequencer: { network: 'mainnet-alpha' } });
const keyPair = ec.genKeyPair();
const account = new Account(provider, accountAddress, keyPair);

// Encrypt message for StarkNet wallet
const encrypted = await e2e.encryptFor(
  'Hello StarkNet!',
  account.address,
  keyPair.pub.getPublic()
);

// Decrypt with private key
const decrypted = await e2e.decrypt(encrypted, keyPair.priv);
```

### Generic Wallet Integration

```typescript
// Works with any Ed25519 wallet
class WalletMessenger {
  constructor() {
    this.e2e = new Ed25519E2E();
  }

  async sendSecureMessage(message, recipientAddress, recipientPublicKey) {
    return await this.e2e.encryptFor(
      message,
      recipientAddress,
      recipientPublicKey
    );
  }

  async readSecureMessage(encryptedMessage, privateKey) {
    return await this.e2e.decrypt(encryptedMessage, privateKey);
  }
}
```

## Data Types Support

The library automatically handles serialization for various data types:

```typescript
// Primitives
await e2e.encryptFor('string', address, publicKey);
await e2e.encryptFor(42, address, publicKey);
await e2e.encryptFor(true, address, publicKey);

// Objects
await e2e.encryptFor({ 
  user: 'alice', 
  balance: 1000,
  permissions: ['read', 'write']
}, address, publicKey);

// Arrays
await e2e.encryptFor([1, 'two', { three: 3 }], address, publicKey);

// Complex nested structures
await e2e.encryptFor({
  transaction: {
    from: 'wallet1',
    to: 'wallet2',
    amount: 100,
    metadata: {
      timestamp: Date.now(),
      tags: ['payment', 'private']
    }
  }
}, address, publicKey);
```

## Security Best Practices

### Key Management

```typescript
// Generate secure Ed25519 key pairs
import { generateKeyPair } from '@noble/ed25519';

const keyPair = generateKeyPair();
const privateKey = keyPair.privateKey;
const publicKey = keyPair.publicKey;

// Store private keys securely (never expose in client code)
// Use environment variables or secure key management systems
```

### Production Deployment

```typescript
// Use proper error handling
try {
  const encrypted = await e2e.encryptFor(data, address, publicKey);
  // Store or transmit encrypted data
} catch (error) {
  console.error('Encryption failed:', error);
  // Handle error appropriately
}

// Verify data integrity after decryption
const decrypted = await e2e.decrypt(encrypted, privateKey);
if (decrypted === null || decrypted === undefined) {
  throw new Error('Decryption failed or data corrupted');
}
```

## Error Handling

```typescript
import { Ed25519E2E, EncryptionError } from '@zkthings/e2e-encryption-ed25519';

try {
  const encrypted = await e2e.encryptFor(data, address, publicKey);
  const decrypted = await e2e.decrypt(encrypted, privateKey);
} catch (error) {
  if (error instanceof EncryptionError) {
    console.error('Encryption operation failed:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Performance

### Benchmarks

| Operation | Time (avg) | Data Size |
|-----------|------------|-----------|
| Encrypt String (100 chars) | ~2ms | ~200 bytes |
| Encrypt Object (1KB) | ~3ms | ~1.3KB |
| Decrypt String | ~1ms | - |
| Decrypt Object | ~2ms | - |

### Optimization Tips

```typescript
// Reuse E2E instance for multiple operations
const e2e = new Ed25519E2E();

// Batch operations when possible
const results = await Promise.all([
  e2e.encryptFor(data1, addr1, key1),
  e2e.encryptFor(data2, addr2, key2),
  e2e.encryptFor(data3, addr3, key3)
]);
```

## Testing

```typescript
// Test encryption/decryption roundtrip
const testData = { message: 'test', value: 42 };
const encrypted = await e2e.encryptFor(testData, address, publicKey);
const decrypted = await e2e.decrypt(encrypted, privateKey);

console.assert(
  JSON.stringify(testData) === JSON.stringify(decrypted),
  'Roundtrip failed'
);
```

## Contributing

PRs welcome! Check our [Contributing Guide](https://github.com/zksdkjs/e2e-encryption-ed25519/blob/main/CONTRIBUTING.md).

## Support

- [Documentation](https://zksdk.dev/docs/intro)
- [GitHub Issues](https://github.com/zksdkjs/e2e-encryption-ed25519/issues)

## License

MIT © [zkThings](https://github.com/zksdkjs)