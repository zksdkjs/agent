/**
 * Privacy SDK tests
 */

import { PrivacySDK, createPrivacySDK, defaultConfigs } from '../index';
import { ConfigurationError } from '../types/errors';

describe('PrivacySDK', () => {
  describe('Constructor', () => {
    it('should create SDK instance with valid config', () => {
      const config = {
        defaultProvider: 'railgun',
        providers: {
          railgun: {
            type: 'railgun',
            chainId: 1,
            networkType: 'mainnet' as const,
            networkName: 'ethereum'
          }
        }
      };

      const sdk = new PrivacySDK(config);
      expect(sdk).toBeInstanceOf(PrivacySDK);
      expect(sdk.isReady()).toBe(false);
    });

    it('should throw error with invalid config', () => {
      expect(() => {
        new PrivacySDK({
          defaultProvider: '',
          providers: {}
        });
      }).toThrow();
    });
  });

  describe('Provider Management', () => {
    let sdk: PrivacySDK;

    beforeEach(() => {
      sdk = new PrivacySDK(defaultConfigs.ethereumRailgun);
    });

    afterEach(async () => {
      await sdk.destroy();
    });

    it('should list available providers', () => {
      const providers = sdk.listProviders();
      expect(Array.isArray(providers)).toBe(true);
    });

    it('should get provider status', () => {
      const status = sdk.getProviderStatus('railgun');
      expect(['uninitialized', 'initializing', 'ready', 'error']).toContain(status);
    });
  });

  describe('Recipe System', () => {
    let sdk: PrivacySDK;

    beforeEach(() => {
      sdk = new PrivacySDK(defaultConfigs.ethereumRailgun);
    });

    afterEach(async () => {
      await sdk.destroy();
    });

    it('should list available recipes', () => {
      const recipes = sdk.recipes.list();
      expect(Array.isArray(recipes)).toBe(true);
      expect(recipes.length).toBeGreaterThan(0);
    });

    it('should get recipes for specific provider', () => {
      const railgunRecipes = sdk.recipes.forProvider('railgun');
      expect(Array.isArray(railgunRecipes)).toBe(true);
    });
  });

  describe('Configuration', () => {
    it('should get and update configuration', () => {
      const sdk = new PrivacySDK(defaultConfigs.ethereumRailgun);
      
      const config = sdk.getConfig();
      expect(config.defaultProvider).toBe('railgun');
      
      sdk.updateConfig({ defaultProvider: 'mina' });
      const updatedConfig = sdk.getConfig();
      expect(updatedConfig.defaultProvider).toBe('mina');
    });
  });
});

describe('createPrivacySDK', () => {
  it('should create SDK with minimal config', () => {
    const sdk = createPrivacySDK({
      provider: 'railgun',
      chainId: 1
    });

    expect(sdk).toBeInstanceOf(PrivacySDK);
    expect(sdk.getConfig().defaultProvider).toBe('railgun');
  });

  it('should create SDK for different providers', () => {
    const railgunSDK = createPrivacySDK({ provider: 'railgun', chainId: 1 });
    const minaSDK = createPrivacySDK({ provider: 'mina', chainId: 'mina-mainnet' });
    const semaphoreSDK = createPrivacySDK({ provider: 'semaphore', chainId: 1 });

    expect(railgunSDK.getConfig().defaultProvider).toBe('railgun');
    expect(minaSDK.getConfig().defaultProvider).toBe('mina');
    expect(semaphoreSDK.getConfig().defaultProvider).toBe('semaphore');
  });
});

describe('Default Configurations', () => {
  it('should have valid ethereum railgun config', () => {
    const config = defaultConfigs.ethereumRailgun;
    expect(config.defaultProvider).toBe('railgun');
    expect(config.providers.railgun.chainId).toBe(1);
  });

  it('should have valid multi-provider config', () => {
    const config = defaultConfigs.multiProvider;
    expect(config.providers.railgun).toBeDefined();
    expect(config.providers.mina).toBeDefined();
    expect(config.providers.semaphore).toBeDefined();
  });
});