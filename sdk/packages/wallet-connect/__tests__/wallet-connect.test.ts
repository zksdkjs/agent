/**
 * Test suite for ZkWalletConnect
 */

import { ZkWalletConnect, WalletConnectConfig } from '../src/index';

// Mock adapters to avoid dependencies on actual provider implementations
jest.mock('../src/adapters/railgun-adapter');
jest.mock('../src/adapters/aztec-adapter');

describe('ZkWalletConnect', () => {
  let walletConnect: ZkWalletConnect;
  let config: WalletConnectConfig;

  beforeEach(() => {
    config = {
      autoDetect: true,
      providers: {
        railgun: { apiKey: 'test-railgun-key' },
        aztec: { apiKey: 'test-aztec-key' }
      },
      defaultProvider: 'railgun'
    };
    
    walletConnect = new ZkWalletConnect(config);
  });

  describe('Initialization', () => {
    it('should create an instance with default configuration', () => {
      const wc = new ZkWalletConnect();
      expect(wc).toBeDefined();
      expect(typeof wc.connect).toBe('function');
      expect(typeof wc.getAvailableProviders).toBe('function');
    });

    it('should create an instance with custom configuration', () => {
      expect(walletConnect).toBeDefined();
    });

    it('should initialize adapters based on configuration', () => {
      const providers = walletConnect.getAvailableProviders();
      // Should have railgun and aztec adapters
      expect(providers).toContain('railgun');
      expect(providers).toContain('aztec');
    });
  });

  describe('Provider Management', () => {
    it('should get available providers', () => {
      const providers = walletConnect.getAvailableProviders();
      expect(providers).toContain('railgun');
      expect(providers).toContain('aztec');
    });

    it('should check if a provider is available', () => {
      expect(walletConnect.isProviderAvailable('railgun')).toBe(true);
      expect(walletConnect.isProviderAvailable('aztec')).toBe(true);
      expect(walletConnect.isProviderAvailable('nonexistent')).toBe(false);
    });

    it('should get the connected provider', () => {
      // Initially no provider should be connected
      expect(walletConnect.getConnectedProvider()).toBeNull();
    });
  });

  describe('Connection', () => {
    it('should connect to a specific provider', async () => {
      const result = await walletConnect.connect('railgun');
      expect(result.connected).toBe(true);
      expect(result.provider).toBe('railgun');
      expect(result.address).toContain('railgun:');
    });

    it('should handle connection failure gracefully', async () => {
      const result = await walletConnect.connect('nonexistent');
      expect(result.connected).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should attempt auto-connection', async () => {
      const result = await walletConnect.connect('auto');
      expect(result.connected).toBe(true);
      // Should connect to one of the available providers
      expect(['railgun', 'aztec']).toContain(result.provider);
    });

    it('should disconnect from provider', async () => {
      // First connect
      await walletConnect.connect('railgun');
      expect(walletConnect.getConnectedProvider()).toBe('railgun');
      
      // Then disconnect
      walletConnect.disconnect();
      expect(walletConnect.getConnectedProvider()).toBeNull();
    });
  });

  describe('Address Management', () => {
    it('should get address from connected provider', async () => {
      await walletConnect.connect('railgun');
      const address = await walletConnect.getAddress();
      expect(address).toContain('railgun:');
    });

    it('should get address from specific provider', async () => {
      const address = await walletConnect.getAddress('aztec');
      expect(address).toContain('aztec:');
    });

    it('should throw error when getting address without connection', async () => {
      await expect(walletConnect.getAddress())
        .rejects
        .toThrow('No provider connected');
    });
  });
});

describe('AutoPrivacyProvider', () => {
  // We'll test this more thoroughly when we create integration tests
  // For now, we're focusing on the main ZkWalletConnect class
  it('should be importable', async () => {
    // This test ensures the export works correctly
    const { AutoPrivacyProvider } = await import('../src/index');
    expect(AutoPrivacyProvider).toBeDefined();
  });
});
