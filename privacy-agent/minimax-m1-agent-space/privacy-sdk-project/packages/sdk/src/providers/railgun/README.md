# Railgun Provider for Privacy SDK

This directory contains the Railgun provider implementation for the Privacy SDK. It includes two separate providers:

1. **RailgunProvider** - A mock implementation for testing and development purposes.
2. **RailgunSDKProvider** - A real implementation that connects to the Railgun SDK for actual blockchain interactions.

## Features

- Private transactions
- Shield/unshield operations
- Balance tracking
- Transaction history
- Multi-chain support

## Supported Chains

- Ethereum Mainnet (Chain ID: 1)
- Polygon (Chain ID: 137)
- Arbitrum (Chain ID: 42161)
- Optimism (Chain ID: 10)
- Binance Smart Chain (Chain ID: 56)
- Avalanche (Chain ID: 43114)
- Celo (Chain ID: 42220)

## Configuration

### Mock Provider Configuration

```typescript
{
  type: 'railgun-mock',
  chainId: 1,
  networkType: 'mainnet'
}
```

### SDK Provider Configuration

```typescript
{
  type: 'railgun',
  chainId: 1,
  networkType: 'mainnet',
  walletSource: 'privacy-sdk', // Name for your wallet implementation
  walletId: 'your-wallet-id', // Optional: ID of the wallet to use
  walletPassword: 'your-password', // Required if walletId is provided
  relayerURL: 'https://railgun-relayer.example.com', // Optional
  rpcURL: 'https://eth-mainnet.alchemyapi.io/v2/your-api-key', // Optional
  useRelayer: true, // Optional, defaults to true
  proofGenerationMode: 'local' // 'local' or 'remote', defaults to 'local'
}
```

## Usage

### Basic Usage with Mock Provider (for testing)

```typescript
import { createTestingSDK } from '@privacy-sdk/core';

// Create SDK with mock provider
const sdk = createTestingSDK({
  provider: 'railgun-mock',
  chainId: 1
});

await sdk.initialize();

// Execute private transfer
const result = await sdk.recipes.privateTransfer({
  to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
  amount: '1000000000000000000', // 1 ETH
  memo: 'Private payment'
});

console.log('Transaction hash:', result.transactions[0].hash);
```

### Production Usage with Real SDK Provider

```typescript
import { createPrivacySDK } from '@privacy-sdk/core';

// Create SDK with real provider
const sdk = createPrivacySDK({
  provider: 'railgun',
  chainId: 1,
  walletSource: 'my-app',
  rpcURL: 'https://eth-mainnet.alchemyapi.io/v2/your-api-key'
});

await sdk.initialize();

// Execute private transfer
const result = await sdk.recipes.privateTransfer({
  to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
  amount: '1000000000000000000', // 1 ETH
  memo: 'Private payment'
});

console.log('Transaction hash:', result.transactions[0].hash);
```

### Shield/Unshield Operations

```typescript
// Shield tokens (public to private)
const shieldResult = await provider.shield(
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC token address
  '1000000', // 1 USDC (6 decimals)
  '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e' // Recipient private address
);

// Unshield tokens (private to public)
const unshieldResult = await provider.unshield(
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC token address
  '1000000', // 1 USDC (6 decimals)
  '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e' // Recipient public address
);
```

## Testing

The provider comes with tests for both the mock implementation and integration tests for the real SDK implementation.

```bash
# Run tests for mock provider
npm test -- --testPathPattern=railgun-provider.test.ts

# Run integration tests (requires real API keys and blockchain connections)
# These tests are skipped by default
```

## Implementation Details

### RailgunProvider (Mock)

- Simple mock implementation for testing
- Doesn't require blockchain connections
- Returns mock data for all operations

### RailgunSDKProvider (Real)

- Connects to actual Railgun SDK
- Supports real blockchain operations
- Requires proper configuration and credentials
- Implements the full feature set of the Railgun protocol

## Dependencies

- `@railgun-community/engine`: The core Railgun engine
- `@railgun-community/shared-models`: Shared types and models for Railgun
- `ethers`: Ethereum library for blockchain interactions

## License

MIT