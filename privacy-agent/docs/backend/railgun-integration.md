# Railgun Integration Guide

This guide explains how to integrate Railgun privacy features into your application using the zkSDK.

## Table of Contents
1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Initialization](#initialization)
5. [API Reference](#api-reference)
6. [Usage Examples](#usage-examples)
7. [Error Handling](#error-handling)
8. [Production Considerations](#production-considerations)
9. [Network-Specific Guidance](#network-specific-guidance)

## Overview

Railgun is a privacy protocol for EVM-compatible blockchains that provides transaction privacy through shielded pools and zero-knowledge proofs. The zkSDK Railgun provider offers a simplified interface for integrating Railgun privacy into your applications.

Key features:
- Private transfers with zero-knowledge proofs
- Support for multiple EVM chains (Ethereum, Polygon, Arbitrum)
- Shielded token balances
- Transaction status tracking

## Installation

```bash
npm install @zksdk/providers-railgun
```

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
RAILGUN_MNEMONIC="your twelve or twenty four word mnemonic phrase here"
ETHEREUM_RPC_URL="https://eth.llamarpc.com"
POLYGON_RPC_URL="https://polygon-rpc.com"
ARBITRUM_RPC_URL="https://arb1.arbitrum.io/rpc"
```

### Required Configuration

1. **Wallet Mnemonic**: A 12 or 24-word BIP39 mnemonic for generating the Railgun wallet
2. **RPC Endpoints**: JSON-RPC endpoints for each supported network
3. **Database Path**: Local path for the Railgun engine database

## Initialization

```typescript
import { RailgunProvider } from '@zksdk/providers/railgun';
import * as dotenv from 'dotenv';

dotenv.config();

const provider = new RailgunProvider();

await provider.initialize({
  walletMnemonic: process.env.RAILGUN_MNEMONIC!,
  engineDbPath: './railgun-db',
  rpcEndpoints: {
    ethereum: process.env.ETHEREUM_RPC_URL!,
    polygon: process.env.POLYGON_RPC_URL!,
    arbitrum: process.env.ARBITRUM_RPC_URL!
  }
});

// Check if provider is ready
const ready = await provider.isReady();
console.log(`Provider ready: ${ready}`);
```

## API Reference

### `initialize(config: RailgunConfig): Promise<void>`

Initialize the Railgun provider with configuration.

**Parameters:**
- `config.walletMnemonic` (string, optional): Wallet mnemonic for Railgun wallet
- `config.engineDbPath` (string, required): Path to Railgun engine database
- `config.rpcEndpoints` (object, required): RPC endpoints for supported networks

**Example:**
```typescript
await provider.initialize({
  walletMnemonic: 'word1 word2 ... word12',
  engineDbPath: './railgun-db',
  rpcEndpoints: {
    ethereum: 'https://eth.llamarpc.com',
    polygon: 'https://polygon-rpc.com'
  }
});
```

### `isReady(): Promise<boolean>`

Check if the provider is ready for operations.

**Returns:** Boolean indicating if provider is ready

### `transfer(params: TransferParams): Promise<TransferResult>`

Execute a private transfer.

**Parameters:**
- `params.chain` (string, required): Target network ('ethereum', 'polygon', 'arbitrum')
- `params.token` (string, required): Token address
- `params.amount` (string, required): Amount in smallest unit (wei)
- `params.to` (string, required): Recipient address
- `params.privacy` (string, required): Privacy level ('shielded')

**Returns:** TransferResult object with transaction details

### `getBalances(address: string): Promise<Balance[]>`

Get private token balances.

**Parameters:**
- `address` (string, required): Railgun address

**Returns:** Array of Balance objects

### `getTransactionStatus(txHash: string): Promise<TransferResult>`

Get transaction status.

**Parameters:**
- `txHash` (string, required): Transaction hash

**Returns:** TransferResult object with status details

## Usage Examples

### Complete Backend Example

```typescript
import { RailgunProvider } from '@zksdk/providers/railgun';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('🚂 Railgun Backend Example\n');

  try {
    // Initialize
    const provider = new RailgunProvider();
    await provider.initialize({
      walletMnemonic: process.env.RAILGUN_MNEMONIC!,
      engineDbPath: './railgun-db',
      rpcEndpoints: {
        ethereum: process.env.ETHEREUM_RPC_URL!,
        polygon: process.env.POLYGON_RPC_URL!,
        arbitrum: process.env.ARBITRUM_RPC_URL!
      }
    });

    // Check ready
    const ready = await provider.isReady();
    console.log(`Provider ready: ${ready}`);

    // Get balances
    const address = 'railgun:0x...';
    const balances = await provider.getBalances(address);
    console.log('Balances:', balances);

    // Transfer
    const result = await provider.transfer({
      chain: 'ethereum',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      amount: '1000000', // 1 USDC
      to: 'railgun:0x...',
      privacy: 'shielded'
    });

    console.log('Transfer result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
```

### Balance Checking

```typescript
const address = 'railgun:0x1234567890123456789012345678901234567890';
const balances = await provider.getBalances(address);

balances.forEach(balance => {
  console.log(`${balance.token.symbol}: ${balance.balance}`);
});
```

### Private Transfer

```typescript
const transferResult = await provider.transfer({
  chain: 'polygon',
  token: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC.e on Polygon
  amount: '1000000', // 1 USDC
  to: 'railgun:0xabcdef123456789012345678901234567890abcdef',
  privacy: 'shielded'
});

console.log(`Transaction hash: ${transferResult.transactionHash}`);
console.log(`Status: ${transferResult.status}`);
```

### Transaction Status Polling

```typescript
const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
const status = await provider.getTransactionStatus(txHash);
console.log(`Transaction status: ${status.status}`);
```

## Error Handling

The Railgun provider throws descriptive errors for various failure conditions:

```typescript
try {
  await provider.transfer(transferParams);
} catch (error) {
  if (error.message.includes('Provider not initialized')) {
    console.log('Initialize the provider first');
  } else if (error.message.includes('Unsupported network')) {
    console.log('Check network configuration');
  } else if (error.message.includes('Insufficient balance')) {
    console.log('Not enough funds for transfer');
  } else {
    console.log('Transfer failed:', error.message);
  }
}
```

Common error types:
- `Provider not initialized` - Call initialize() first
- `Unsupported network` - Network not in configuration
- `Invalid parameters` - Missing or invalid transfer parameters
- `Insufficient balance` - Not enough funds for transfer
- `RPC connection failed` - Network connectivity issues

## Production Considerations

### Database Persistence

In production, ensure the Railgun database path points to a persistent location:

```typescript
const config = {
  engineDbPath: '/var/lib/myapp/railgun-db', // Persistent path
  // ... other config
};
```

### Mnemonic Security

Never hardcode mnemonics in source code. Use secure storage mechanisms:

```typescript
// ❌ Don't do this
const mnemonic = 'word1 word2 ... word12';

// ✅ Do this instead
const mnemonic = process.env.RAILGUN_MNEMONIC;
// Or use a secure key management service
```

### Error Recovery

Implement retry logic for transient failures:

```typescript
async function retryTransfer(provider, params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await provider.transfer(params);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### Monitoring

Log important operations for monitoring:

```typescript
const result = await provider.transfer(params);
console.log(`Transfer completed: ${result.transactionHash}`, {
  chain: params.chain,
  amount: params.amount,
  fee: result.fee
});
```

## Network-Specific Guidance

### Ethereum

- Higher gas costs compared to L2s
- More established ecosystem
- Longer transaction finality times

### Polygon

- Lower gas costs
- Faster transaction finality
- Good balance of cost and security

### Arbitrum

- Low gas costs
- EVM compatibility
- Optimistic rollup security model

### Gas Cost Considerations

Railgun transactions typically require more gas than regular transfers due to zero-knowledge proof generation:

```typescript
// Estimated gas costs (varies by network and complexity)
const estimatedGas = {
  ethereum: '300000', // ~$15-30 at 20 Gwei
  polygon: '300000',  // ~$0.30-0.60
  arbitrum: '300000'  // ~$0.60-1.20
};
```

For production applications, implement gas estimation and user notifications for high-cost operations.
