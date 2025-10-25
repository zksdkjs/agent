# Privacy Cash Integration for Solana

This document explains how to integrate and use the Privacy Cash provider for Solana using the privacy-cash-sdk.

## Overview

The Privacy Cash provider enables private transactions on Solana using Zero-Knowledge compression technology. It wraps the privacy-cash-sdk to provide a standardized interface that conforms to the BasePrivacyProvider specification.

## ZK Compression Technology

Privacy Cash uses Zero-Knowledge compression to enable private transactions on Solana. This technology allows:

- **Privacy**: Transaction details are hidden using ZK proofs
- **Scalability**: Compressed accounts reduce on-chain storage
- **Interoperability**: Works with existing Solana infrastructure

## Installation

To use the Privacy Cash provider, ensure you have the required dependencies:

```bash
npm install @solana/web3.js
npm install privacycash
```

## Usage

### 1. Import and Initialize

```typescript
import { LightProtocolPrivacyProvider } from '@zksdk/light-protocol';

const provider = new LightProtocolPrivacyProvider();

await provider.initialize({
  rpcUrl: 'https://api.devnet.solana.com',
  privateKey: Uint8Array.from([/* your private key array */])
});
```

### 2. Solana Wallet Setup

The Privacy Cash provider requires a Solana Keypair for wallet operations. No wallet abstraction layer is used - the Keypair is used directly.

```typescript
import { Keypair } from '@solana/web3.js';

// Generate a new keypair
const keypair = Keypair.generate();

// Or load from existing private key
const secretKey = Uint8Array.from([/* your 64-byte secret key */]);
const keypair = Keypair.fromSecretKey(secretKey);
```

### 3. Private Transfers

Execute private transfers using the standardized transfer interface:

```typescript
const result = await provider.transfer({
  chain: 'solana',
  token: 'SOL',
  amount: '0.01', // Amount in SOL
  to: 'recipientPublicKey',
  privacy: 'anonymous'
});
```

### 4. Balance Queries

Query private balances:

```typescript
const balances = await provider.getBalances('walletAddress');
console.log(balances); // Array of token balances
```

## API Reference

### `LightProtocolPrivacyProvider`

#### Constructor
```typescript
new LightProtocolPrivacyProvider(config?: ProviderConfig)
```

#### Methods

##### `initialize(config: ProviderConfig): Promise<void>`
Initialize the provider with configuration.

**Parameters:**
- `config.rpcUrl`: Solana RPC endpoint
- `config.privateKey`: Solana private key as Uint8Array

##### `transfer(params: TransferParams): Promise<TransferResult>`
Execute a private transfer.

**Parameters:**
- `params.chain`: 'solana'
- `params.token`: Token symbol ('SOL')
- `params.amount`: Amount in token units
- `params.to`: Recipient public key
- `params.privacy`: Privacy level ('anonymous')

##### `getBalances(address: string): Promise<Balance[]>`
Get private token balances.

##### `getTransactionStatus(txHash: string): Promise<TransferResult>`
Get transaction status by hash.

## Environment Variables

Create a `.env` file with the following variables:

```env
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PRIVATE_KEY=[64-byte private key array]
HELIUS_API_KEY=your_helius_api_key
```

## Security Considerations

1. **Private Key Management**: Never expose private keys in client-side code
2. **Environment Isolation**: Use different keys for development and production
3. **Transaction Validation**: Always validate transaction parameters before execution

## Troubleshooting

### Common Issues

1. **Initialization Errors**: Ensure RPC URL is valid and accessible
2. **Transfer Failures**: Check sufficient balance and network connectivity
3. **Balance Query Issues**: Verify wallet address and network configuration

### Debugging

Enable debug logging by setting the appropriate log level in your environment.
