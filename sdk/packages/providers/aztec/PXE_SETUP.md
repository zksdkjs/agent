# Aztec Provider PXE Setup Guide

This guide explains how to set up the Aztec Private eXecution Environment (PXE) for development and production use with the zkSDK Aztec provider.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Option 1: Using Remote Nodes (Easiest)](#option-1-using-remote-nodes-easiest)
4. [Option 2: Running Local PXE](#option-2-running-local-pxe)
5. [Configuration Options](#configuration-options)
6. [Troubleshooting](#troubleshooting)

## Overview

The Aztec PXE (Private eXecution Environment) is responsible for:
- Managing private account keys
- Constructing private transactions
- Maintaining private state
- Interacting with the Aztec network

The zkSDK Aztec provider can work with either:
1. Remote Aztec nodes (easiest for development)
2. Locally running PXE instances (recommended for production)

## Prerequisites

Before setting up PXE, ensure you have:

- Node.js v18 or higher
- npm or yarn package manager
- Access to an Aztec network (mainnet, testnet, or devnet)
- Docker (only required for advanced local setups)

## Option 1: Using Remote Nodes (Easiest)

For development and testing, you can connect directly to public Aztec nodes without running a local PXE.

### Available Networks

| Network | URL | Chain ID |
|---------|-----|----------|
| Sepolia Testnet | https://api.aztec.network/aztec-connect-testnet/falafel | 11155111 |
| Devnet | https://api.aztec.network/aztec-devnet/falafel | N/A |

### Configuration Example

```typescript
import { PrivacySDK } from '@zksdk/core';
import { AztecProviderConfig } from './aztec-provider';

async function setupWithRemoteNode() {
  const sdk = new PrivacySDK();
  
  const config: AztecProviderConfig = {
    type: 'aztec',
    chainId: 11155111, // Sepolia testnet
    networkType: 'testnet',
    rpcUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel',
    pxeConfig: {
      nodeUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel',
      useExisting: false // Don't try to connect to local PXE
    }
  };
  
  const provider = await sdk.registerProvider('aztec', config);
  return provider;
}
```

## Option 2: Running Local PXE

For production environments or advanced development scenarios, run your own PXE instance.

### Installation

1. Install Aztec CLI:
```bash
npm install -g @aztec/cli
```

2. Install sandbox (includes PXE):
```bash
npm install -g @aztec/aztec-sandbox
```

### Starting PXE

Start a local sandbox (includes PXE):

```bash
# Start sandbox with default settings
aztec sandbox

# Or start with custom ports
aztec sandbox --port 8080 --network sepolya
```

This starts:
- Aztec Node on port 8545
- PXE on port 8080
- Archiver service

### Configuration Example

```typescript
import { PrivacySDK } from '@zksdk/core';
import { AztecProviderConfig } from './aztec-provider';

async function setupWithLocalPXE() {
  const sdk = new PrivacySDK();
  
  const config: AztecProviderConfig = {
    type: 'aztec',
    chainId: 11155111, // Sepolia testnet
    networkType: 'testnet',
    rpcUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel',
    pxeConfig: {
      nodeUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel',
      pxeHost: '127.0.0.1', // Local PXE host
      pxePort: 8080,        // Local PXE port
      useExisting: true,    // Connect to existing local PXE
      dataDirectory: './.privacy-sdk/aztec-data'
    }
  };
  
  const provider = await sdk.registerProvider('aztec', config);
  return provider;
}
```

## Configuration Options

### PXE Configuration Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `nodeUrl` | string | https://api.aztec.network/aztec-connect-testnet/falafel | URL of the Aztec node |
| `pxeHost` | string | 127.0.0.1 | Host where PXE is running |
| `pxePort` | number | 8080 | Port where PXE is listening |
| `useExisting` | boolean | false | Whether to connect to existing PXE |
| `dataDirectory` | string | ./.privacy-sdk/aztec-data | Directory for storing PXE data |
| `logLevel` | string | info | Logging level (debug, info, warn, error) |

### Environment-Specific Configurations

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

## Troubleshooting

### Common Issues

#### 1. Connection Refused
Problem: Cannot connect to PXE or node
Solution:
- Verify PXE is running: `curl http://127.0.0.1:8080`
- Check firewall settings
- Ensure correct host/port configuration

#### 2. Account Not Found
Problem: "Account not found" errors
Solution:
- Generate a new account: `aztec-cli generate-private-key`
- Import account to PXE: `aztec-cli import-account [private-key]`

#### 3. Network Issues
Problem: Slow or failing transactions
Solution:
- Check network connectivity
- Verify node URL is correct
- Try different network endpoint

#### 4. Insufficient Funds
Problem: Transactions failing due to lack of funds
Solution:
- Fund your Aztec address with test ETH
- Check balance before sending transactions

### Logs and Debugging

Enable debug logging:
```typescript
const config: AztecProviderConfig = {
  // ... other config
  pxeConfig: {
    // ... other PXE config
    logLevel: 'debug'
  }
};
```

Check PXE logs:
```bash
# If running with docker
docker logs aztec_pxe_1

# If running with aztec-cli
# Logs are printed to stdout
```

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Network Access**: Restrict access to PXE endpoints in production
3. **Data Storage**: Secure the data directory used by PXE
4. **Updates**: Keep Aztec software updated to latest versions

## Further Resources

- [Aztec Documentation](https://docs.aztec.network)
- [Aztec CLI Reference](https://docs.aztec.network/reference/cli)
- [Aztec Sandbox GitHub](https://github.com/AztecProtocol/aztec-packages)
- [zkSDK Documentation](./README.md)
