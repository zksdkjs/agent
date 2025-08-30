// Tests for the PrivacySDK class

import { PrivacySDK, createTestingSDK } from '../index';
import { defaultConfigs } from '../helpers';

describe('PrivacySDK', () => {
  let sdk: PrivacySDK;
  
  beforeEach(async () => {
    // Create a testing SDK with mock providers
    sdk = createTestingSDK({
      provider: 'railgun-mock',
      chainId: 1
    });
    
    await sdk.initialize();
  });
  
  afterEach(async () => {
    await sdk.destroy();
  });
  
  test('should initialize successfully', () => {
    expect(sdk.isReady()).toBe(true);
  });
  
  test('should have default provider', () => {
    const defaultProvider = sdk.getDefaultProvider();
    expect(defaultProvider).toBeDefined();
    expect(defaultProvider.name).toBe('railgun-mock');
  });
  
  test('should list providers', () => {
    const providers = sdk.listProviders();
    expect(providers).toContain('railgun-mock');
  });
  
  test('should get provider', () => {
    const provider = sdk.getProvider('railgun-mock');
    expect(provider).toBeDefined();
    expect(provider?.name).toBe('railgun-mock');
  });
  
  test('should return undefined for non-existent provider', () => {
    const provider = sdk.getProvider('non-existent');
    expect(provider).toBeUndefined();
  });
  
  test('should set default provider', () => {
    // Add aztec provider
    sdk.addProvider('aztec', {
      type: 'aztec',
      chainId: 1,
      networkType: 'testnet'
    });
    
    // Set as default
    sdk.setDefaultProvider('aztec');
    
    // Check if default provider changed
    expect(sdk.getDefaultProvider().name).toBe('aztec');
  });
  
  test('should throw error when setting non-existent provider as default', () => {
    expect(() => {
      sdk.setDefaultProvider('non-existent');
    }).toThrow();
  });
  
  test('should remove provider', async () => {
    // Add aztec provider
    await sdk.addProvider('aztec', {
      type: 'aztec',
      chainId: 1,
      networkType: 'testnet'
    });
    
    // Verify it was added
    expect(sdk.listProviders()).toContain('aztec');
    
    // Remove it
    await sdk.removeProvider('aztec');
    
    // Verify it was removed
    expect(sdk.listProviders()).not.toContain('aztec');
  });
  
  test('should create with multi-provider config', async () => {
    const multiSdk = new PrivacySDK(defaultConfigs.testing);
    await multiSdk.initialize();
    
    expect(multiSdk.listProviders().length).toBeGreaterThan(1);
    expect(multiSdk.getDefaultProvider().name).toBe('railgun-mock');
    
    await multiSdk.destroy();
  });
});

describe('PrivacySDK Recipes', () => {
  let sdk: PrivacySDK;
  
  beforeEach(async () => {
    // Create a testing SDK with mock providers
    sdk = createTestingSDK({
      provider: 'railgun-mock',
      chainId: 1
    });
    
    await sdk.initialize();
  });
  
  afterEach(async () => {
    await sdk.destroy();
  });
  
  test('should execute privateTransfer recipe', async () => {
    const result = await sdk.recipes.privateTransfer({
      to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
      amount: '1000000000000000000', // 1 ETH
      memo: 'Test private transfer'
    });
    
    expect(result.success).toBe(true);
    expect(result.transactions.length).toBe(1);
    expect(result.transactions[0].hash).toBeDefined();
  });
  
  test('should validate recipe parameters', async () => {
    const validationResult = sdk.recipes.validate('private_transfer', {
      to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
      amount: '1000000000000000000'
    });
    
    expect(validationResult.valid).toBe(true);
  });
  
  test('should fail validation for invalid parameters', async () => {
    const validationResult = sdk.recipes.validate('private_transfer', {
      // Missing 'to' parameter
      amount: '1000000000000000000'
    });
    
    expect(validationResult.valid).toBe(false);
    expect(validationResult.errors.length).toBeGreaterThan(0);
  });
  
  test('should estimate fees for recipe', async () => {
    const feeEstimate = await sdk.recipes.estimateFees('private_transfer', {
      to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
      amount: '1000000000000000000'
    });
    
    expect(feeEstimate.estimatedFee).toBeDefined();
    expect(feeEstimate.currency).toBeDefined();
  });
});