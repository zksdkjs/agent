/**
 * Tests for zkWalletConnect
 */

import { ZkWalletConnect, AutoPrivacyProvider, WalletConnectConfig } from '../index';

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
    test('should create wallet connect instance', () => {
      expect(walletConnect).toBeInstanceOf(ZkWalletConnect);
    });

    test('should create an instance with default configuration', () => {
      const wc = new ZkWalletConnect();
      expect(wc).toBeDefined();
      expect(typeof wc.connect).toBe('function');
      expect(typeof wc.getAvailableProviders).toBe('function');
    });

    test('should create an instance with custom configuration', () => {
      expect(walletConnect).toBeDefined();
    });

    test('should initialize adapters based on configuration', () => {
      const providers = walletConnect.getAvailableProviders();
      // Should have railgun and aztec adapters
      expect(providers).toContain('railgun');
      expect(providers).toContain('aztec');
    });
  });

  describe('Provider Management', () => {
    test('should get available providers', () => {
      const providers = walletConnect.getAvailableProviders();
      expect(providers).toContain('railgun');
      expect(providers).toContain('aztec');
    });

    test('should check if a provider is available', () => {
      expect(walletConnect.isProviderAvailable('railgun')).toBe(true);
      expect(walletConnect.isProviderAvailable('aztec')).toBe(true);
      expect(walletConnect.isProviderAvailable('nonexistent')).toBe(false);
    });

    test('should get the connected provider', () => {
      // Initially no provider should be connected
      expect(walletConnect.getConnectedProvider()).toBeNull();
    });
  });

  describe('Connection', () => {
    test('should connect to a specific provider', async () => {
      const result = await walletConnect.connect('railgun');
      expect(result.connected).toBe(true);
      expect(result.provider).toBe('railgun');
      expect(result.address).toContain('railgun:');
    });

    test('should handle connection failure gracefully', async () => {
      const result = await walletConnect.connect('nonexistent');
      expect(result.connected).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should attempt auto-connection', async () => {
      const result = await walletConnect.connect('auto');
      expect(result.connected).toBe(true);
      // Should connect to one of the available providers
      expect(['railgun', 'aztec']).toContain(result.provider);
    });

    test('should disconnect from provider', async () => {
      // First connect
      await walletConnect.connect('railgun');
      expect(walletConnect.getConnectedProvider()).toBe('railgun');
      
      // Then disconnect
      walletConnect.disconnect();
      expect(walletConnect.getConnectedProvider()).toBeNull();
    });
  });

  describe('Address Management', () => {
    test('should get address from connected provider', async () => {
      await walletConnect.connect('railgun');
      const address = await walletConnect.getAddress();
      expect(address).toContain('railgun:');
    });

    test('should get address from specific provider', async () => {
      const address = await walletConnect.getAddress('aztec');
      expect(address).toContain('aztec:');
    });

    test('should throw error when getting address without connection', async () => {
      await expect(walletConnect.getAddress())
        .rejects
        .toThrow('No provider connected');
    });
  });

  describe('Transfer Operations', () => {
    test('should execute transfer with connected provider', async () => {
      await walletConnect.connect('railgun');
      
      const transferParams = {
        chain: 'ethereum',
        token: 'ETH',
        amount: '1000000000000000000',
        to: '0xRecipient',
        privacy: 'anonymous' as const
      };
      
      const result = await walletConnect.transfer(transferParams);
      expect(result).toBeDefined();
      expect(result.transactionHash).toBeDefined();
      expect(result.status).toBeDefined();
    });

    test('should throw error when transferring without connection', async () => {
      const transferParams = {
        chain: 'ethereum',
        token: 'ETH',
        amount: '1000000000000000000',
        to: '0xRecipient',
        privacy: 'anonymous' as const
      };
      
      await expect(walletConnect.transfer(transferParams))
        .rejects
        .toThrow('No provider connected. Call connect() first.');
    });
  });

  describe('Balance Operations', () => {
    test('should get balances with connected provider', async () => {
      await walletConnect.connect('railgun');
      
      const balances = await walletConnect.getBalances();
      expect(balances).toBeDefined();
      expect(Array.isArray(balances)).toBe(true);
    });

    test('should throw error when getting balances without connection', async () => {
      await expect(walletConnect.getBalances())
        .rejects
        .toThrow('No provider connected. Call connect() first.');
    });
  });

  describe('Transaction Status', () => {
    test('should get transaction status with connected provider', async () => {
      await walletConnect.connect('railgun');
      
      const txHash = '0x123456789abcdef';
      const result = await walletConnect.getTransactionStatus(txHash);
      expect(result).toBeDefined();
      expect(result.transactionHash).toBe(txHash);
    });

    test('should throw error when getting transaction status without connection', async () => {
      const txHash = '0x123456789abcdef';
      
      await expect(walletConnect.getTransactionStatus(txHash))
        .rejects
        .toThrow('No provider connected. Call connect() first.');
    });
  });
});

describe('AutoPrivacyProvider', () => {
  let autoProvider: AutoPrivacyProvider;

  beforeEach(() => {
    autoProvider = new AutoPrivacyProvider({
      providers: {
        railgun: { apiKey: 'test-railgun-key' },
        aztec: { apiKey: 'test-aztec-key' }
      },
      defaultProvider: 'railgun'
    });
  });

  test('should create auto provider instance', () => {
    expect(autoProvider).toBeInstanceOf(AutoPrivacyProvider);
    expect(autoProvider.name).toBe('Auto');
  });

  test('should throw error when transferring without initialization', async () => {
    const transferParams = {
      chain: 'ethereum',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amount: '1000000',
      to: '0x742d35Cc66343434343434343434343434343434',
      privacy: 'anonymous' as any
    };

    await expect(autoProvider.transfer(transferParams)).rejects.toThrow('No provider connected');
  });

  test('should initialize and connect to a provider', async () => {
    await expect(autoProvider.initialize({})).resolves.not.toThrow();
  });

  test('should execute transfer after initialization', async () => {
    await autoProvider.initialize({});
    
    const transferParams = {
      chain: 'ethereum',
      token: 'ETH',
      amount: '1000000000000000000',
      to: '0xRecipient',
      privacy: 'anonymous' as const
    };
    
    const result = await autoProvider.transfer(transferParams);
    expect(result).toBeDefined();
    expect(result.transactionHash).toBeDefined();
    expect(result.status).toBeDefined();
  });

  test('should get balances after initialization', async () => {
    await autoProvider.initialize({});
    
    const address = '0xTestAddress';
    const balances = await autoProvider.getBalances(address);
    expect(balances).toBeDefined();
    expect(Array.isArray(balances)).toBe(true);
  });

  test('should get transaction status after initialization', async () => {
    await autoProvider.initialize({});
    
    const txHash = '0x123456789abcdef';
    const result = await autoProvider.getTransactionStatus(txHash);
    expect(result).toBeDefined();
    expect(result.transactionHash).toBe(txHash);
  });
});
