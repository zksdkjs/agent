// Tests for Aztec provider implementations

import { PrivacySDK, createTestingSDK } from '../../../helpers';
import { AztecProvider } from '../aztec-provider';
import { resetPXEService, resetAccountService, resetContractService } from '../services';

describe('AztecProvider', () => {
  let mockProvider: AztecProvider;
  
  beforeEach(async () => {
    // Reset services to ensure clean state
    resetPXEService();
    resetAccountService();
    resetContractService();
    
    // Create a mock provider for testing
    mockProvider = new AztecProvider();
    await mockProvider.initialize({
      type: 'aztec',
      chainId: 11155111, // Sepolia testnet
      networkType: 'testnet'
    });
  });
  
  afterEach(async () => {
    await mockProvider.destroy();
  });
  
  test('should initialize successfully', () => {
    expect(mockProvider.isReady()).toBe(true);
    expect(mockProvider.getStatus()).toBe('ready');
  });
  
  test('should validate configuration', () => {
    const provider = new AztecProvider();
    
    // Should throw error for invalid type
    expect(async () => {
      await provider.initialize({
        type: 'invalid',
        chainId: 11155111
      } as any);
    }).rejects.toThrow();
    
    // Should throw error for unsupported chain
    expect(async () => {
      await provider.initialize({
        type: 'aztec',
        chainId: 999 // Unsupported chain
      } as any);
    }).rejects.toThrow();
  });
  
  test('should get provider info', () => {
    const info = mockProvider.getProviderInfo();
    expect(info.name).toBe('aztec');
    expect(info.supportedChains.length).toBeGreaterThan(0);
    expect(info.capabilities.length).toBeGreaterThan(0);
    expect(info.description).toBe('Aztec Privacy Protocol Provider');
  });
  
  test('should get supported operations', () => {
    const operations = mockProvider.getSupportedOperations();
    expect(operations.length).toBeGreaterThan(0);
    expect(operations.find(op => op.name === 'sendPrivateTransaction')).toBeDefined();
    expect(operations.find(op => op.name === 'getPrivateBalance')).toBeDefined();
    expect(operations.find(op => op.name === 'generatePrivateAddress')).toBeDefined();
  });
  
  test('should generate private address', async () => {
    const addressInfo = await mockProvider.generatePrivateAddress();
    expect(addressInfo.address).toBeDefined();
    expect(addressInfo.address.startsWith('0x')).toBe(true);
    expect(addressInfo.metadata).toBeDefined();
    expect(addressInfo.metadata?.provider).toBe('aztec');
  });
  
  test('should send private transaction', async () => {
    const result = await mockProvider.sendPrivateTransaction({
      type: 'transfer',
      to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
      amount: '1000000000000000000', // 1 ETH
      memo: 'Test private transfer'
    });
    
    expect(result.hash).toBeDefined();
    expect(result.status).toBe('pending');
    expect(result.provider).toBe('aztec');
    expect(result.chainId).toBe(11155111);
    expect(result.transactions.length).toBe(1);
    expect(result.success).toBe(true);
  });
  
  test('should get private balance', async () => {
    const balance = await mockProvider.getPrivateBalance({
      address: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e'
    });
    
    expect(balance.address).toBeDefined();
    expect(balance.lastUpdated).toBeDefined();
  });
  
  test('should get transaction history', async () => {
    const history = await mockProvider.getTransactionHistory({
      address: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e'
    });
    
    expect(Array.isArray(history)).toBe(true);
  });
  
  test('should import private key', async () => {
    // This should throw an error as it's not implemented for security reasons
    await expect(mockProvider.importPrivateKey('0x1234567890abcdef')).rejects.toThrow();
  });
});

describe('Aztec Provider via SDK', () => {
  test('should create SDK with aztec provider', async () => {
    const sdk = createTestingSDK({
      provider: 'aztec',
      chainId: 11155111
    });
    
    await sdk.initialize();
    expect(sdk.isReady()).toBe(true);
    expect(sdk.getDefaultProvider().name).toBe('aztec');
    
    await sdk.destroy();
  });
  
  test('should execute privateTransfer recipe with aztec provider', async () => {
    const sdk = createTestingSDK({
      provider: 'aztec',
      chainId: 11155111
    });
    
    await sdk.initialize();
    
    const result = await sdk.recipes.privateTransfer({
      to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
      amount: '1000000000000000000', // 1 ETH
      memo: 'Test private transfer via SDK'
    });
    
    expect(result.success).toBe(true);
    expect(result.transactions.length).toBe(1);
    expect(result.transactions[0].hash).toBeDefined();
    expect(result.transactions[0].provider).toBe('aztec');
    
    await sdk.destroy();
  });
  
  test('should execute shield recipe with aztec provider', async () => {
    const sdk = createTestingSDK({
      provider: 'aztec',
      chainId: 11155111
    });
    
    await sdk.initialize();
    
    const result = await sdk.recipes.shield({
      token: '0x0000000000000000000000000000000000000000', // ETH
      amount: '1000000000000000000', // 1 ETH
      fromAddress: '0x1234567890123456789012345678901234567890',
      toAddress: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e'
    });
    
    expect(result.success).toBe(true);
    expect(result.transactions.length).toBe(1);
    expect(result.transactions[0].hash).toBeDefined();
    expect(result.transactions[0].provider).toBe('aztec');
    
    await sdk.destroy();
  });
});

// Integration tests with actual Aztec network
// These tests would require actual connection to Aztec testnet
// and should only be run in environments where the network is available
describe.skip('AztecProvider Integration', () => {
  let aztecProvider: AztecProvider;
  
  beforeEach(async () => {
    // Reset services to ensure clean state
    resetPXEService();
    resetAccountService();
    resetContractService();
    
    // Create an Aztec provider for testing with real network
    aztecProvider = new AztecProvider();
    await aztecProvider.initialize({
      type: 'aztec',
      chainId: 11155111, // Sepolia testnet
      networkType: 'testnet',
      rpcUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel',
      pxeConfig: {
        useExisting: true // Try to connect to an existing PXE service first
      }
    });
  });
  
  afterEach(async () => {
    await aztecProvider.destroy();
  });
  
  test('should initialize successfully with real network', () => {
    expect(aztecProvider.isReady()).toBe(true);
    expect(aztecProvider.getStatus()).toBe('ready');
  });
  
  test('should generate private address with real network', async () => {
    const addressInfo = await aztecProvider.generatePrivateAddress();
    expect(addressInfo.address).toBeDefined();
    expect(addressInfo.address.startsWith('0x')).toBe(true);
    expect(addressInfo.metadata).toBeDefined();
  });
  
  // Additional integration tests would go here
  // These would require actual accounts and funds on the testnet
});
