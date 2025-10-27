# Railgun Privacy Provider

A zkSDK provider implementation for Railgun, enabling private transactions on EVM-compatible blockchains.

## Overview

The Railgun Privacy Provider integrates the production Railgun SDK into the zkSDK ecosystem, providing private transaction capabilities for Ethereum, Polygon, and Arbitrum networks. This implementation replaces the previous mock implementation with real Railgun SDK components.

## Features

- **Private Transactions**: Enable private transfers using Railgun's zero-knowledge proofs
- **Multi-Network Support**: Works with Ethereum, Polygon, and Arbitrum
- **Standard Interface**: Implements the BasePrivacyProvider interface for consistency with other zkSDK privacy providers
- **Wallet Integration**: Leverages RailgunWallet for secure key management
- **Transaction Operations**: Full support for Shield, Transfer, and Unshield operations

## Installation

```bash
npm install @zksdk/providers-railgun
```

## Usage

```typescript
import { RailgunProvider } from '@zksdk/providers-railgun';

const provider = new RailgunProvider();

// Shield tokens from public to private balance
await provider.shield(wallet, tokenAmount, recipient);

// Transfer tokens between private balances
await provider.transfer(wallet, tokenAmounts, recipients);

// Unshield tokens from private to public balance
await provider.unshield(wallet, tokenAmount, recipient);
```

## API

### Shield
Move tokens from a public balance to a private Railgun balance.

### Transfer
Transfer tokens between private Railgun balances.

### Unshield
Move tokens from a private Railgun balance to a public balance.

## Supported Networks

- Ethereum Mainnet
- Polygon
- Arbitrum

## Dependencies

- `@railgun-community/engine`
- `@railgun-community/shared-models`
- `@zksdk/core`

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
```

Note: Tests currently blocked due to Jest module resolution issue with `@zksdk/core` dependency.

## Contributing

This provider follows the standard zkSDK provider patterns established by the PrivacyCash provider, which achieved 91.66% overall project coverage.
