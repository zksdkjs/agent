/**
 * Tests for zkWalletConnect
 */

import { ZkWalletConnect, AutoPrivacyProvider } from '../index';

describe('ZkWalletConnect', () => {
  let walletConnect: ZkWalletConnect;

  beforeEach(() => {
    walletConnect = new ZkWalletConnect({
      providers: {
        railgun: {
          rpcEndpoints: {
            ethereum: 'https://eth.llamarpc.com'
          },
          engineDbPath: './test-db'
        }
      }
    });
  });

  test('should create wallet connect instance', () => {
    expect(walletConnect).toBeInstanceOf(ZkWalletConnect);
  });

  test('should get available providers', () => {
    const providers = walletConnect.getAvailableProviders();
    expect(providers).toContain('railgun');
  });

  test('should check if provider is available', () => {
    expect(walletConnect.isProviderAvailable('railgun')).toBe(true);
    expect(walletConnect.isProviderAvailable('nonexistent')).toBe(false);
  });

  test('should return mock address', async () => {
    const address = await walletConnect.getAddress('railgun');
    expect(address).toContain('railgun:');
  });
});

describe('AutoPrivacyProvider', () => {
  let autoProvider: AutoPrivacyProvider;

  beforeEach(() => {
    autoProvider = new AutoPrivacyProvider({
      providers: {
        railgun: {
          rpcEndpoints: {
            ethereum: 'https://eth.llamarpc.com'
          },
          engineDbPath: './test-db'
        }
      }
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
});
