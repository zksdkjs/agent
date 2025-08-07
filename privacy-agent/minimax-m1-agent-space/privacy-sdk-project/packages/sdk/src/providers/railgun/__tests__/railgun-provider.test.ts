// Tests for Railgun provider implementations

import { PrivacySDK, createTestingSDK, createPrivacySDK } from '../../../helpers';
import { RailgunProvider } from '../railgun-provider';
import { RailgunSDKProvider } from '../railgun-sdk-provider';

describe('RailgunProvider', () => {
  let mockProvider: RailgunProvider;
  
  beforeEach(async () => {
    // Create a mock provider for testing
    mockProvider = new RailgunProvider();
    await mockProvider.initialize({
      type: 'railgun',
      chainId: 1,
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
  
  test('should get provider info', () => {
    const info = mockProvider.getProviderInfo();
    expect(info.name).toBe('railgun');
    expect(info.supportedChains.length).toBeGreaterThan(0);
    expect(info.capabilities.length).toBeGreaterThan(0);
  });
  
  test('should get supported operations', () => {
    const operations = mockProvider.getSupportedOperations();
    expect(operations.length).toBeGreaterThan(0);
    expect(operations.find(op => op.name === 'sendPrivateTransaction')).toBeDefined();
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
    expect(result.provider).toBe('railgun');
    expect(result.chainId).toBe(1);
  });
  
  test('should get private balance', async () => {
    const balance = await mockProvider.getPrivateBalance({
      address: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e'
    });
    
    expect(balance.address).toBeDefined();
    expect(balance.balances.length).toBeGreaterThan(0);
    expect(balance.lastUpdated).toBeDefined();
  });
  
  test('should generate private address', async () => {
    const addressInfo = await mockProvider.generatePrivateAddress();
    expect(addressInfo.address).toBeDefined();
    expect(addressInfo.address.startsWith('0x')).toBe(true);
  });
});

describe('Railgun Provider via SDK', () => {
  test('should create SDK with mock provider', async () => {
    const sdk = createTestingSDK({
      provider: 'railgun-mock',
      chainId: 1
    });
    
    await sdk.initialize();
    expect(sdk.isReady()).toBe(true);
    expect(sdk.getDefaultProvider().name).toBe('railgun-mock');
    
    await sdk.destroy();
  });
  
  test('should execute privateTransfer recipe with mock provider', async () => {
    const sdk = createTestingSDK({
      provider: 'railgun-mock',
      chainId: 1
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
    expect(result.transactions[0].provider).toBe('railgun-mock');
    
    await sdk.destroy();
  });
});

// Integration tests with actual SDK
// These tests would require actual connection to Railgun SDK
// and should only be run in environments where the SDK is available
describe.skip('RailgunSDKProvider Integration', () => {
  let sdkProvider: RailgunSDKProvider;
  
  beforeEach(async () => {
    // Create an SDK provider for testing
    sdkProvider = new RailgunSDKProvider();
    await sdkProvider.initialize({
      type: 'railgun',
      chainId: 5, // Goerli testnet
      networkType: 'testnet',
      walletSource: 'privacy-sdk-test',
      // Other configuration would be added here for actual testing
    });
  });
  
  afterEach(async () => {
    await sdkProvider.destroy();
  });
  
  test('should initialize successfully', () => {
    expect(sdkProvider.isReady()).toBe(true);
    expect(sdkProvider.getStatus()).toBe('ready');
  });
  
  test('should send private transaction', async () => {
    const result = await sdkProvider.sendPrivateTransaction({
      type: 'transfer',
      to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
      amount: '1000000000000000000', // 1 ETH
      memo: 'Test private transfer'
    });
    
    expect(result.hash).toBeDefined();
    expect(result.status).toBe('pending');
    expect(result.provider).toBe('railgun');
  });
});

// Integration tests with the SDK via the PrivacySDK class
describe.skip('PrivacySDK with RailgunSDKProvider Integration', () => {
  test('should create SDK with real provider', async () => {
    const sdk = createPrivacySDK({
      provider: 'railgun',
      chainId: 5, // Goerli testnet
      networkType: 'testnet',
      walletSource: 'privacy-sdk-test',
      // Other configuration would be added here for actual testing
    });
    
    await sdk.initialize();
    expect(sdk.isReady()).toBe(true);
    expect(sdk.getDefaultProvider().name).toBe('railgun');
    
    await sdk.destroy();
  });
});