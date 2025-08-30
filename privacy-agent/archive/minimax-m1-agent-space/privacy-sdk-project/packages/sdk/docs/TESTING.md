# Privacy SDK Testing Guide

This document outlines the testing strategy for the Privacy SDK, including unit tests, integration tests, and real blockchain testing.

## Testing Architecture

The Privacy SDK uses a layered testing approach:

1. **Unit Tests** - Tests for individual components using mock implementations
2. **Integration Tests** - Tests for interoperability between components
3. **Blockchain Tests** - Tests against real blockchain networks

## Test Environment Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Jest testing framework

### Installation

```bash
cd /workspace/privacy-sdk-project/packages/sdk
npm install
```

## Running Tests

### Unit Tests

Unit tests are located in `__tests__` directories throughout the codebase:

```bash
npm test
```

### Specific Test Suites

To run specific test suites:

```bash
npm test -- --testPathPattern=privacy-sdk.test.ts
npm test -- --testPathPattern=railgun-provider.test.ts
```

### Test Coverage

To generate test coverage reports:

```bash
npm test -- --coverage
```

## Mock vs. Real Testing

### Mock Testing (For CI/CD and Quick Verification)

The SDK includes mock providers for fast, reliable testing without blockchain connections:

```typescript
import { createTestingSDK } from '@privacy-sdk/core';

const sdk = createTestingSDK({
  provider: 'railgun-mock',
  chainId: 1
});
```

### Real Blockchain Testing

For testing with real blockchain networks, use the integration example:

```bash
# Set up environment variables
export RPC_URL=https://goerli.infura.io/v3/YOUR_INFURA_KEY
export CHAIN_ID=5
export NETWORK_TYPE=testnet
export WALLET_ID=your-wallet-id
export WALLET_PASSWORD=your-wallet-password

# Run integration example
cd /workspace/privacy-sdk-project
node examples/railgun-integration.js
```

## Writing Tests for Recipes

### Recipe Test Template

```typescript
import { PrivacySDK, createTestingSDK } from '../index';
import { PrivateSwapRecipe } from '../recipes';

describe('PrivateSwap Recipe', () => {
  let sdk: PrivacySDK;
  
  beforeEach(async () => {
    sdk = createTestingSDK({
      provider: 'railgun-mock',
      chainId: 1
    });
    
    await sdk.initialize();
  });
  
  afterEach(async () => {
    await sdk.destroy();
  });
  
  test('should validate swap parameters correctly', async () => {
    // Arrange
    const recipe = new PrivateSwapRecipe();
    const params = {
      fromToken: {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        decimals: 18
      },
      toToken: {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        decimals: 6
      },
      fromAmount: '1000000000000000000', // 1 ETH
      minToAmount: '1800000000', // 1800 USDC
      slippageTolerance: 0.5 // 0.5%
    };
    
    // Act
    const validation = recipe.validate(params);
    
    // Assert
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });
  
  test('should execute swap through SDK interface', async () => {
    // Arrange
    const params = {
      fromToken: {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        decimals: 18
      },
      toToken: {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        decimals: 6
      },
      fromAmount: '1000000000000000000', // 1 ETH
      minToAmount: '1800000000', // 1800 USDC
      slippageTolerance: 0.5 // 0.5%
    };
    
    // Act
    const result = await sdk.recipes.privateSwap(params);
    
    // Assert
    expect(result.success).toBe(true);
    expect(result.transactions).toHaveLength(1);
    expect(result.metadata?.swapType).toBe('private');
  });
});
```

### Integration Test Template

```typescript
// These tests are skipped by default since they require real connections
describe.skip('Real Network Integration', () => {
  test('should perform private swap on testnet', async () => {
    const sdk = createPrivacySDK({
      provider: 'railgun',
      chainId: 5, // Goerli testnet
      networkType: 'testnet',
      rpcURL: process.env.RPC_URL,
      walletId: process.env.WALLET_ID,
      walletPassword: process.env.WALLET_PASSWORD
    });
    
    await sdk.initialize();
    expect(sdk.isReady()).toBe(true);
    
    // Test private swap
    const result = await sdk.recipes.privateSwap({
      fromToken: { /* test token */ },
      toToken: { /* test token */ },
      fromAmount: '1000000000000000000',
      minToAmount: '1800000000',
      slippageTolerance: 1.0
    });
    
    expect(result.success).toBe(true);
    expect(result.transactions.length).toBeGreaterThan(0);
    
    await sdk.destroy();
  });
});
```

## Testing Cross-Provider Operations

For cross-provider operations, special care needs to be taken to test both the source and destination providers:

```typescript
describe('CrossProvider Recipe', () => {
  let sdk: PrivacySDK;
  
  beforeEach(async () => {
    sdk = createTestingSDK({
      defaultProvider: 'railgun-mock',
      providers: {
        'railgun-mock': {
          type: 'mock',
          chainId: 1,
          networkType: 'testnet'
        },
        'aztec-mock': {
          type: 'mock',
          chainId: 1,
          networkType: 'testnet'
        }
      }
    });
    
    await sdk.initialize();
  });
  
  afterEach(async () => {
    await sdk.destroy();
  });
  
  test('should validate cross-provider parameters', async () => {
    const recipe = new CrossProviderRecipe();
    const params = {
      sourceProvider: 'railgun-mock',
      destinationProvider: 'aztec-mock',
      sourceAddress: 'source-private-address',
      destinationAddress: 'destination-private-address',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amount: '1000000000'
    };
    
    const validation = recipe.validate(params);
    expect(validation.valid).toBe(true);
  });
  
  test('should execute cross-provider transfer', async () => {
    const result = await sdk.recipes.crossProviderTransfer({
      sourceProvider: 'railgun-mock',
      destinationProvider: 'aztec-mock',
      sourceAddress: 'source-private-address',
      destinationAddress: 'destination-private-address',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amount: '1000000000'
    });
    
    expect(result.success).toBe(true);
    expect(result.transactions).toHaveLength(2); // Unshield + Shield
  });
});
```

## Test Coverage Targets

Aim for the following test coverage levels:

- Core interfaces: 95%+
- Provider implementations: 90%+
- Recipe system: 90%+
- Utility functions: 95%+
- Overall coverage: 90%+

## Testing Gotchas

1. **Async Functions** - Always use async/await pattern and proper error handling
2. **Cleanup** - Always destroy SDK instances in afterEach to prevent memory leaks
3. **Mocks** - Reset mocks between tests to prevent cross-test pollution
4. **Test Isolation** - Keep tests independent to prevent order dependencies
5. **Blockchain Tests** - Mark with `.skip` to prevent running in CI environments

## Continuous Integration

GitHub Actions is configured to run tests on every push and pull request. The workflow:

1. Sets up Node.js environment
2. Installs dependencies
3. Builds the SDK
4. Runs all unit tests (but skips real blockchain tests)
5. Generates coverage reports

## License

MIT