# @privacy-sdk/core

> Core Privacy SDK package for unified Web3 privacy operations

[![NPM Version](https://img.shields.io/npm/v/@privacy-sdk/core.svg)](https://www.npmjs.com/package/@privacy-sdk/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The Privacy SDK provides a unified TypeScript interface for building privacy-preserving applications across multiple Web3 privacy systems. Think of it as the "LangChain of Privacy" - a single, developer-friendly API that abstracts away the complexity of different privacy protocols, allowing you to integrate private transactions into your DApps with ease.

## 🚀 Installation

```bash
npm install @privacy-sdk/core
```

## 📋 Requirements

- Node.js 16.0 or higher
- TypeScript 4.5 or higher (optional but recommended)
- Modern browser with BigInt support

## ⚡ Quick Start

```typescript
import { createPrivacySDK } from '@privacy-sdk/core';

// Simple setup
const sdk = createPrivacySDK({
  provider: 'railgun',
  chainId: 1
});

await sdk.initialize();

// Execute private transfer
const result = await sdk.recipes.privateTransfer({
  to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
  amount: '1000000000000000000', // 1 ETH
  memo: 'Private payment'
});
```

## 🏗️ Architecture

### Core Components

- **PrivacySDK**: Main SDK class for managing providers and recipes
- **Privacy Providers**: Plugin implementations for different privacy systems
- **Recipe System**: Pre-built solutions for common privacy operations
- **Event System**: Real-time transaction and provider status updates
- **Type System**: Comprehensive TypeScript definitions

### Supported Providers

| Provider | Description | Chains | Status |
|----------|-------------|--------|--------|
| Railgun | EVM privacy with zkSNARKs | Ethereum, Polygon, Arbitrum, Optimism, BSC, Avalanche, Celo | ✅ Production |
| Aztec | Next-gen private computation | Ethereum | 🚧 In Development |

### Coming Soon

| Provider | Description | Status |
|----------|-------------|--------|
| Mina | zkApps for private computation | 🔍 Research |
| Zama FHEVM | Fully Homomorphic Encryption | 🔍 Research |
| Penumbra | Shielded transactions for Cosmos | 🔍 Research |
| Namada | Interchain privacy | 🔍 Research |
| IronFish | Private cryptocurrency | 🔍 Research |

## 📚 API Reference

### PrivacySDK

#### Constructor

```typescript
const sdk = new PrivacySDK({
  defaultProvider: 'railgun',
  providers: {
    railgun: {
      type: 'railgun',
      chainId: 1,
      networkType: 'mainnet'
    }
  }
});
```

#### Methods

- `initialize(): Promise<void>` - Initialize all providers
- `getProvider(name: string): PrivacyProvider` - Get specific provider
- `isReady(): boolean` - Check if SDK is ready
- `destroy(): Promise<void>` - Clean up resources
- `setDefaultProvider(name: string): void` - Change the default provider
- `addProvider(name: string, config: ProviderConfig): Promise<void>` - Add a new provider
- `removeProvider(name: string): Promise<void>` - Remove a provider

### Recipe System

#### Private Transfer

```typescript
await sdk.recipes.privateTransfer({
  to: '0x...',
  amount: '1000000000000000000',
  token: { 
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    decimals: 18
  },
  memo: 'Payment description'
});
```

#### Coming Soon

Additional recipes like private swaps, anonymous voting, and private messaging will be added in future releases.

### Event Handling

```typescript
sdk.on('transaction_confirmed', (data) => {
  console.log('Transaction confirmed:', data.transactionHash);
});

sdk.on('error', (data) => {
  console.error('SDK error:', data);
});
```

### Utility Functions

```typescript
import { formatAmount, parseAmount, validateEthereumAddress } from '@privacy-sdk/core';

// Format amount for display
const display = formatAmount('1000000000000000000', 18); // "1.0"

// Parse amount for transactions
const amount = parseAmount('1.5', 18); // "1500000000000000000"

// Validate address
const isValid = validateEthereumAddress('0x742d35Cc...');
```

## 🔧 Configuration

### Basic Configuration

```typescript
import { createPrivacySDK } from '@privacy-sdk/core';

const sdk = createPrivacySDK({
  provider: 'railgun', // or 'mina', 'semaphore'
  chainId: 1
});
```

### Advanced Configuration

```typescript
import { PrivacySDK } from '@privacy-sdk/core';

const sdk = new PrivacySDK({
  defaultProvider: 'railgun',
  providers: {
    railgun: {
      type: 'railgun',
      chainId: 1,
      networkType: 'mainnet',
      networkName: 'ethereum',
      rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/your-api-key'
    },
    mina: {
      type: 'mina',
      chainId: 'mina-mainnet',
      networkType: 'mainnet',
      networkId: 'mainnet'
    }
  },
  keyManagement: {
    storage: 'local',
    encryption: true
  }
});
```

### Provider-Specific Configuration

#### Railgun

```typescript
{
  type: 'railgun',
  chainId: 1, // 1 (Ethereum), 137 (Polygon), 42161 (Arbitrum), etc.
  networkType: 'mainnet', // 'mainnet', 'testnet', or 'devnet'
  relayerUrl: 'https://railgun-relayer.example.com', // Optional
  nodeUrl: 'https://eth-mainnet.alchemyapi.io/v2/your-api-key', // Optional
  useRelayer: true, // Optional, defaults to true
  proofGenerationMode: 'local' // 'local' or 'remote', defaults to 'local'
}
```

#### Aztec (In Development)

```typescript
{
  type: 'aztec',
  chainId: 1, // Currently only supports Ethereum Mainnet
  networkType: 'mainnet', // 'mainnet', 'testnet', or 'devnet'
  rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/your-api-key' // Optional
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🛠️ Building

```bash
# Build the package
npm run build

# Build with type checking
npm run build:types

# Development build with watch
npm run dev
```

## 📄 TypeScript Support

The package includes comprehensive TypeScript definitions. No additional @types packages are needed.

```typescript
import type {
  PrivacySDK,
  PrivacyProvider,
  PrivateTransactionParams,
  TransactionResult,
  RecipeResult
} from '@privacy-sdk/core';
```

## 🔒 Security Considerations

- Private keys are handled securely by the underlying provider SDKs
- Zero-knowledge proofs are generated client-side
- Network requests use encrypted connections
- Sensitive configuration should use environment variables

## ⚠️ Important Notes

- This is a demo implementation for educational purposes
- Real provider integrations require proper API keys and configuration
- Always test thoroughly before deploying to production
- Follow security best practices for key management

## 📚 Further Reading

- [Privacy SDK Documentation](https://privacy-sdk.dev)
- [Railgun Documentation](https://docs.railgun.org)
- [Mina Protocol Documentation](https://docs.minaprotocol.com)
- [Semaphore Documentation](https://docs.semaphore.appliedzkp.org)

## 📄 License

MIT - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by MiniMax Agent**