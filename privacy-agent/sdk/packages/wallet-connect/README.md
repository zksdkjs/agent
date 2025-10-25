# zkWalletConnect - Unified Wallet Interface

The WalletConnect-style unified interface for zkSDK - making privacy as easy as connecting a regular wallet.

## Overview

zkWalletConnect provides a single, unified interface for connecting to any privacy provider in the zkSDK ecosystem. It automatically detects and uses the best available privacy provider based on your configuration and requirements.

## Features

- **Auto Provider Selection**: Automatically detects and connects to the best available privacy provider
- **Unified API**: Single interface for all privacy providers
- **Provider Adapters**: Specialized adapters for each privacy system
- **Easy Integration**: Simple setup with minimal configuration
- **TypeScript Support**: Full type safety and IntelliSense support

## Installation

```bash
npm install @zksdk/wallet-connect
```

## Usage

### Basic Auto Provider Usage

```typescript
import { ZkSDK, AutoPrivacyProvider } from '@zksdk/core';

// Create the auto provider
const autoProvider = new AutoPrivacyProvider({
  providers: {
    railgun: {
      rpcEndpoints: {
        ethereum: 'https://eth.llamarpc.com',
        polygon: 'https://polygon-rpc.com'
      },
      engineDbPath: './railgun-db'
    },
    aztec: {
      pxeUrl: 'http://localhost:8080'
    }
  },
  defaultProvider: 'railgun'
});

// Initialize the provider
await autoProvider.initialize({});

// Create SDK instance
const sdk = new ZkSDK({
  providers: {
    auto: autoProvider
  },
  defaultProvider: 'auto'
});

// Execute private transfers - automatically uses the best provider
const result = await sdk.transfer({
  chain: 'ethereum',
  token: 'USDC',
  amount: '1000000', // 1 USDC
  to: '0x742d35Cc6634C434C434C434C434C434C434C434',
  privacy: 'shielded'
});
```

### Direct WalletConnect Usage

```typescript
import { ZkWalletConnect } from '@zksdk/wallet-connect';

// Create wallet connect instance
const walletConnect = new ZkWalletConnect({
  providers: {
    railgun: {
      rpcEndpoints: {
        ethereum: 'https://eth.llamarpc.com'
      },
      engineDbPath: './railgun-db'
    }
  }
});

// Connect to the best available provider
const connection = await walletConnect.connect('auto');
if (connection.connected) {
  console.log(`Connected to ${connection.provider} with address: ${connection.address}`);
  
  // Get balances
  const balances = await walletConnect.getBalances();
  console.log('Balances:', balances);
  
  // Execute transfer
  const transferResult = await walletConnect.transfer({
    chain: 'ethereum',
    token: 'ETH',
    amount: '1000000000000000000', // 1 ETH
    to: '0x742d35Cc6634C434C434C434C434C434C434C434',
    privacy: 'anonymous'
  });
}
```

## Supported Providers

- **Railgun**: Ethereum/Polygon private transactions
- **Aztec**: Noir-based private contracts
- **Solana**: ZK compression (coming soon)
- **Bitcoin**: Silent Payments (coming soon)
- **FHEVM**: Fully Homomorphic Encryption (coming soon)

## Configuration

### AutoPrivacyProvider Configuration

```typescript
{
  providers: {
    // Railgun configuration
    railgun: {
      rpcEndpoints: {
        ethereum: 'https://eth.llamarpc.com',
        polygon: 'https://polygon-rpc.com'
      },
      engineDbPath: './railgun-db',
      walletMnemonic: 'your-wallet-mnemonic' // Optional
    },
    
    // Aztec configuration
    aztec: {
      pxeUrl: 'http://localhost:8080',
      privateKey: 'your-private-key' // Optional
    }
  },
  
  // Default provider to use if auto-detection fails
  defaultProvider: 'railgun'
}
```

## API Reference

### ZkWalletConnect

#### `connect(provider: string = 'auto')`
Connect to a privacy provider. Use 'auto' for automatic detection.

#### `transfer(params: TransferParams)`
Execute a private transfer using the connected provider.

#### `getBalances(address?: string)`
Get private balances from the connected provider.

#### `getTransactionStatus(txHash: string)`
Get the status of a transaction.

### AutoPrivacyProvider

Implements the `BasePrivacyProvider` interface and can be used directly with the zkSDK.

## Examples

See the `examples/` directory for complete usage examples.

## Contributing

We welcome contributions! See the main zkSDK repository for contribution guidelines.
