// Integration tests for Privacy SDK

import { PrivacySDK, createMockSDK } from '../privacy-sdk';
import { PrivateTransferParams } from '../recipes';
import { ProviderConfig } from '../types';

describe('Privacy SDK Integration Tests', () => {
  let sdk: PrivacySDK;

  beforeEach(async () => {
    // Create SDK with mock provider for testing
    sdk = createMockSDK('test-provider');
    await sdk.initialize();
  });

  afterEach(async () => {
    if (sdk) {
      await sdk.destroy();
    }
  });

  describe('SDK Initialization', () => {
    it('should initialize successfully with mock provider', async () => {
      expect(sdk).toBeDefined();
      expect(sdk.getDefaultProvider()).toBeDefined();
      expect(sdk.isProviderReady('test-provider')).toBe(true);
    });

    it('should list available providers', () => {
      const providers = sdk.listProviders();
      expect(providers).toContain('test-provider');
      expect(providers.length).toBeGreaterThan(0);
    });

    it('should get provider by name', () => {
      const provider = sdk.getProvider('test-provider');
      expect(provider).toBeDefined();
      expect(provider!.name).toBe('test-provider');
    });
  });

  describe('Recipe System', () => {
    it('should validate private transfer parameters', () => {
      const validParams: PrivateTransferParams = {
        to: '0x1234567890123456789012345678901234567890',
        amount: '1.0'
      };

      const validation = sdk.recipes.validate('private_transfer', validParams);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject invalid private transfer parameters', () => {
      const invalidParams = {
        to: '', // Invalid: empty address
        amount: '-1' // Invalid: negative amount
      };

      const validation = sdk.recipes.validate('private_transfer', invalidParams);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should execute private transfer recipe', async () => {
      const params: PrivateTransferParams = {
        to: '0x1234567890123456789012345678901234567890',
        amount: '1.0',
        memo: 'Test transfer'
      };

      const result = await sdk.recipes.privateTransfer(params);
      
      expect(result.success).toBe(true);
      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0].hash).toBeDefined();
      expect(result.executionTime).toBeGreaterThan(0);
    });

    it('should estimate fees for private transfer', async () => {
      const params: PrivateTransferParams = {
        to: '0x1234567890123456789012345678901234567890',
        amount: '1.0'
      };

      const feeEstimate = await sdk.recipes.estimateFees('private_transfer', params);
      
      expect(feeEstimate.estimatedFee).toBeDefined();
      expect(feeEstimate.currency).toBeDefined();
      expect(feeEstimate.confidence).toBeDefined();
    });
  });

  describe('Provider Management', () => {
    it('should add new provider', async () => {
      const newConfig: ProviderConfig = {
        type: 'mock',
        chainId: 137,
        networkType: 'mainnet'
      };

      await sdk.addProvider('new-provider', newConfig);
      
      expect(sdk.getProvider('new-provider')).toBeDefined();
      expect(sdk.isProviderReady('new-provider')).toBe(true);
    });

    it('should remove provider', async () => {
      const newConfig: ProviderConfig = {
        type: 'mock',
        chainId: 137,
        networkType: 'mainnet'
      };

      await sdk.addProvider('temp-provider', newConfig);
      expect(sdk.getProvider('temp-provider')).toBeDefined();

      await sdk.removeProvider('temp-provider');
      expect(sdk.getProvider('temp-provider')).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid configuration', () => {
      expect(() => {
        new PrivacySDK({
          defaultProvider: 'nonexistent',
          providers: {
            'other': {
              type: 'mock',
              chainId: 1,
              networkType: 'testnet'
            }
          }
        });
      }).toThrow();
    });

    it('should handle provider not found', () => {
      expect(sdk.getProvider('nonexistent')).toBeUndefined();
    });

    it('should handle recipe not found', async () => {
      await expect(
        sdk.recipes.estimateFees('nonexistent_recipe', {})
      ).rejects.toThrow();
    });
  });

  describe('Configuration', () => {
    it('should return configuration', () => {
      const config = sdk.getConfig();
      
      expect(config.defaultProvider).toBe('test-provider');
      expect(config.providers['test-provider']).toBeDefined();
      expect(config.keyManagement).toBeDefined();
      expect(config.logging).toBeDefined();
    });
  });
});

// Helper function to create test scenarios
export function createTestScenarios() {
  return {
    validTransferParams: {
      to: '0x1234567890123456789012345678901234567890',
      amount: '1.0'
    } as PrivateTransferParams,
    
    invalidTransferParams: {
      to: '',
      amount: '-1'
    },
    
    mockProviderConfig: {
      type: 'mock',
      chainId: 1,
      networkType: 'testnet'
    } as ProviderConfig
  };
}
