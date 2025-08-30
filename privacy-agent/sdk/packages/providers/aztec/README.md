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

## Installation

```bash
npm install @privacy-sdk/aztec-provider
```

## Usage

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

### Generate Private Address

```typescript
const addressInfo = await provider.generatePrivateAddress();
console.log('New Aztec address:', addressInfo.address);
```

### Send Private Transaction

```typescript
const result = await provider.sendPrivateTransaction({
  fromAddress: senderAddress,
  toAddress: recipientAddress,
  amount: '1000000000000000000', // 1 ETH in wei
  memo: 'Private transfer'
});
```

### Deploy Noir Contract

```typescript
const contractResult = await provider.deployContract({
  artifact: contractArtifact, // Noir contract artifact
  constructorArgs: [name, symbol, decimals, initialSupply, owner],
  walletAddress: deployerAddress
});
```

### Call Contract Method

```typescript
const result = await provider.callContract({
  contractAddress: deployedContractAddress,
  artifact: contractArtifact,
  method: 'transfer',
  args: [recipientAddress, amount],
  walletAddress: callerAddress
});
```

### Query Transaction Status

```typescript
const status = await provider.getTransactionStatus(transactionHash);
console.log('Transaction status:', status.status);
```

### Get Private Balances

```typescript
const balances = await provider.getBalances(address);
console.log('Private balances:', balances);
```

## Architecture

The Aztec provider consists of several key components:

1. **PXE Service**: Manages the Private eXecution Environment
2. **Account Service**: Handles account creation and management
3. **Contract Service**: Manages Noir contract deployment and interaction
4. **Provider Core**: Implements the standard privacy provider interface

## Noir Contract Development

To develop Noir contracts for Aztec:

1. Install the Aztec CLI: `npm install -g @aztec/aztec-cli`
2. Create a new Noir project: `aztec-cli init my-contract`
3. Write your contract in Noir syntax
4. Compile the contract: `aztec-cli compile`
5. Deploy using the zkSDK Aztec provider

## Example Contracts

The provider includes a simple token contract (`simple_token.nr`) that demonstrates:

- Private token transfers with nullifier management
- Balance tracking with encrypted storage
- Allowance system for delegated transfers
- Public view functions for token metadata

## Testing

Run the test suite:

```bash
npm test aztec-provider
```

## Configuration

### PXE Configuration

The PXE service can be configured with:

```typescript
const pxeConfig: PXEConfig = {
  nodeUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel',
  pxeHost: '127.0.0.1',
  pxePort: 8080,
  useExisting: true, // Connect to existing PXE if available
  dataDirectory: './.privacy-sdk/aztec-data'
};
```

## Supported Networks

- Ethereum Mainnet (chainId: 1)
- Goerli Testnet (chainId: 5)
- Sepolia Testnet (chainId: 11155111)

## Security Considerations

- Private keys are managed securely within the PXE
- All private transactions are encrypted and only visible to participants
- Contract logic is executed in private and only proofs are published
- Follow best practices for key management and access control

## Resources

- [Aztec Documentation](https://docs.aztec.network)
- [Noir Language Documentation](https://noir-lang.github.io/book)
- [Aztec GitHub](https://github.com/AztecProtocol/aztec-packages)
