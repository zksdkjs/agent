# Aztec Provider for zkSDK

The Aztec provider enables privacy-preserving transactions and smart contract interactions on the Aztec network using the zkSDK.

## Overview

Aztec is a Layer 2 privacy solution for Ethereum that enables private smart contracts through:
- Zero-knowledge proofs for transaction privacy
- Private Execution Environment (PXE) for managing private state
- Noir programming language for writing private smart contracts

## Features

- **Private Transactions**: Send private value transfers between Aztec accounts
- **Account Management**: Create and manage Aztec accounts with private keys
- **Noir Contract Integration**: Deploy and interact with Noir smart contracts
- **PXE Services**: Integrated Private eXecution Environment for private state management
- **Balance Querying**: Retrieve private token balances
- **Transaction Status Tracking**: Monitor transaction progress
- **Transaction History**: Access historical transaction records
- **Multi-chain Support**: Support for Ethereum mainnet and testnets

## Installation

```bash
npm install @privacy-sdk/aztec-provider
```

## Quick Start

### Basic Setup

```typescript
import { PrivacySDK } from '@privacy-sdk/core';
import { AztecProviderConfig } from '@privacy-sdk/aztec-provider';

// Initialize SDK
const sdk = new PrivacySDK();

// Configure Aztec provider
const config: AztecProviderConfig = {
  type: 'aztec',
  chainId: 11155111, // Sepolia testnet
  networkType: 'testnet',
  rpcUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel'
};

// Register provider
const provider = await sdk.registerProvider('aztec', config);
```

## Detailed Usage Examples

### Generate Private Address

```typescript
const addressInfo = await provider.generatePrivateAddress();
console.log('New Aztec address:', addressInfo.address);
console.log('Public Key:', addressInfo.metadata?.publicKey);
```

### Send Private Transaction (Transfer)

```typescript
const transferParams = {
  from: senderAddress,
  to: recipientAddress,
  amount: '1000000000000000000', // 1 ETH in wei
  token: '0x0000000000000000000000000000000000000000', // Native token
  memo: 'Private transfer'
};

const result = await provider.transfer(transferParams);
console.log('Transaction hash:', result.transactionHash);
console.log('Status:', result.status);
```

### Deploy Noir Contract

```typescript
// Load contract artifact
import contractArtifact from './artifacts/my_contract.json';

const deployParams = {
  artifact: contractArtifact,
  constructorArgs: [name, symbol, decimals, initialSupply, owner],
  walletAddress: deployerAddress,
  sponsoredFee: false
};

const contractResult = await provider.deployContract(deployParams);
console.log('Contract deployed at:', contractResult.address);
```

### Call Contract Method

```typescript
// Load contract artifact
import contractArtifact from './artifacts/my_contract.json';

const callParams = {
  contractAddress: deployedContractAddress,
  artifact: contractArtifact,
  method: 'transfer',
  args: [recipientAddress, amount],
  walletAddress: callerAddress,
  sponsoredFee: false
};

const result = await provider.callContract(callParams);
console.log('Contract call result:', result);
```

### Query Transaction Status

```typescript
const status = await provider.getTransactionStatus(transactionHash);
console.log('Transaction status:', status.status);
console.log('Timestamp:', new Date(status.timestamp).toISOString());
```

### Get Private Balances

```typescript
const balances = await provider.getBalances(address);
console.log('Private balances:', balances);

// Or get detailed private balance information
const balanceParams = { address: userAddress, tokenAddress: tokenAddress };
const privateBalance = await provider.getPrivateBalance(balanceParams);
console.log('Detailed private balance:', privateBalance);
```

### Import/Export Private Keys

```typescript
// Import a private key
await provider.importPrivateKey(privateKey);

// Note: Export is restricted for security reasons
// await provider.exportPrivateKey(); // Throws error for security
```

## Architecture

The Aztec provider consists of several key components:

1. **PXE Service**: Manages the Private eXecution Environment
2. **Account Service**: Handles account creation and management
3. **Contract Service**: Manages Noir contract deployment and interaction
4. **Provider Core**: Implements the standard privacy provider interface

## Setting Up PXE (Private eXecution Environment)

For detailed instructions on setting up PXE for development and production, see [PXE_SETUP.md](./PXE_SETUP.md).

### Quick Local Development Setup

```bash
# Install Aztec CLI
npm install -g @aztec/cli

# Install sandbox (includes PXE)
npm install -g @aztec/aztec-sandbox

# Start sandbox
aztec sandbox
```

## Noir Contract Development

To develop Noir contracts for Aztec:

1. Install the Aztec CLI: `npm install -g @aztec/aztec-cli`
2. Create a new Noir project: `aztec-cli init my-contract`
3. Write your contract in Noir syntax
4. Compile the contract: `aztec-cli compile`
5. Deploy using the zkSDK Aztec provider

### Example Simple Token Contract

The provider includes a simple token contract artifact (`artifacts/simple_token.json`) that demonstrates:

- Private token transfers with nullifier management
- Balance tracking with encrypted storage
- Public view functions for token metadata

## Testing

Run the test suite:

```bash
npm test aztec-provider
```

### Running Specific Tests

```bash
# Run only Aztec provider tests
npm test -- --testPathPattern=aztec-provider

# Run tests with coverage
npm test -- --coverage --testPathPattern=aztec-provider

# Run tests in watch mode
npm test -- --watch --testPathPattern=aztec-provider
```

## Configuration Options

### Provider Configuration

```typescript
interface AztecProviderConfig extends ProviderConfig {
  type: 'aztec';
  chainId: ChainId;
  networkType: 'mainnet' | 'testnet' | 'devnet';
  rpcUrl?: string;
  apiKey?: string;
  pxeConfig?: PXEConfig;
}
```

### PXE Configuration

```typescript
interface PXEConfig {
  nodeUrl?: string;
  pxeHost?: string;
  pxePort?: number;
  useExisting?: boolean;
  dataDirectory?: string;
  logLevel?: string;
}
```

### Configuration Examples

#### Development Environment
```typescript
const devConfig: AztecProviderConfig = {
  type: 'aztec',
  chainId: 11155111, // Sepolia testnet
  networkType: 'testnet',
  rpcUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel',
  pxeConfig: {
    nodeUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel',
    useExisting: false
  }
};
```

#### Production Environment
```typescript
const prodConfig: AztecProviderConfig = {
  type: 'aztec',
  chainId: 1, // Ethereum mainnet
  networkType: 'mainnet',
  rpcUrl: 'https://api.aztec.network/aztec-mainnet/falafel',
  pxeConfig: {
    nodeUrl: 'https://api.aztec.network/aztec-mainnet/falafel',
    pxeHost: '127.0.0.1',
    pxePort: 8080,
    useExisting: true,
    dataDirectory: '/var/lib/privacy-sdk/aztec-data'
  }
};
```

## Supported Networks

- Ethereum Mainnet (chainId: 1)
- Goerli Testnet (chainId: 5)
- Sepolia Testnet (chainId: 11155111)

## Provider Info and Capabilities

```typescript
const providerInfo = provider.getProviderInfo();
console.log('Provider capabilities:', providerInfo.capabilities);

const operations = provider.getSupportedOperations();
console.log('Supported operations:', operations.map(op => op.name));
```

## Error Handling

The Aztec provider throws specific error types for different failure modes:

```typescript
import { ProviderError, ValidationError } from './errors';

try {
  await provider.initialize(config);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Configuration validation error:', error.message);
  } else if (error instanceof ProviderError) {
    console.error('Aztec provider error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Security Considerations

- Private keys are managed securely within the PXE
- All private transactions are encrypted and only visible to participants
- Contract logic is executed in private and only proofs are published
- Follow best practices for key management and access control
- Regularly update Aztec dependencies to patch security vulnerabilities

## Performance Optimization

### Connection Pooling

For high-throughput applications, consider reusing provider instances:

```typescript
// Reuse provider instance across multiple operations
const provider = await sdk.registerProvider('aztec', config);

// Perform multiple operations with the same provider
const address1 = await provider.generatePrivateAddress();
const address2 = await provider.generatePrivateAddress();
const balances = await provider.getBalances(address1.address);
```

### Batch Operations

When possible, batch related operations to reduce network overhead:

```typescript
// Instead of multiple individual calls
const balances = await Promise.all([
  provider.getBalances(address1),
  provider.getBalances(address2),
  provider.getBalances(address3)
]);
```

## Migration Guide

### From Previous Versions

If upgrading from a previous version of the Aztec provider:

1. Update configuration structure to match new `AztecProviderConfig`
2. Replace deprecated methods with new standardized API calls
3. Update contract artifacts to latest format
4. Review breaking changes in CHANGELOG.md

## Resources

- [Aztec Documentation](https://docs.aztec.network)
- [Noir Language Documentation](https://noir-lang.github.io/book)
- [Aztec GitHub](https://github.com/AztecProtocol/aztec-packages)
- [PXE Setup Guide](./PXE_SETUP.md)
- [Comprehensive Example](./comprehensive-example.ts)

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for information on how to contribute to this provider.

## License

This provider is licensed under the MIT License. See [LICENSE](../../LICENSE) for more information.
