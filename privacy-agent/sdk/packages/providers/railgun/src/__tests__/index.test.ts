import { RailgunProvider } from '../index';

describe('RailgunProvider', () => {
  let railgunProvider: RailgunProvider;

  beforeEach(() => {
    railgunProvider = new RailgunProvider();
  });

  it('should initialize with proper configuration', async () => {
    const config = {
      rpcEndpoints: {
        ethereum: 'https://mainnet.infura.io/v3/test',
        polygon: 'https://polygon-rpc.com'
      },
      engineDbPath: './test-db'
    };

    await expect(railgunProvider.initialize(config)).resolves.not.toThrow();
    expect(await railgunProvider.isReady()).toBe(false); // Still false because no wallet
  });

  it('should reject initialization without required config', async () => {
    const config = {
      // Missing rpcEndpoints and engineDbPath
    };

    await expect(railgunProvider.initialize(config as any)).rejects.toThrow('RPC endpoints configuration is required');
  });

  it('should validate transfer parameters correctly', async () => {
    // This test would require mocking the Railgun SDK
    // For now, we'll test the validation logic
    expect(() => {
      (railgunProvider as any).validateTransferParams({
        chain: 'unsupported-network',
        token: '0x123',
        amount: '1000',
        to: '0x456'
      });
    }).toThrow('Unsupported network: unsupported-network');
  });

  it('should map network names correctly', () => {
    expect((railgunProvider as any).getRailgunNetwork('ethereum')).toBe('ethereum');
    expect((railgunProvider as any).getRailgunNetwork('polygon')).toBe('polygon');
    expect((railgunProvider as any).getRailgunNetwork('arbitrum')).toBe('arbitrum');
    expect((railgunProvider as any).getRailgunNetwork('unsupported')).toBeNull();
  });
});
