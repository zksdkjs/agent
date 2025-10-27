/**
 * Additional tests for RailgunProvider to improve coverage
 */

import { RailgunProvider } from '../index';

describe('RailgunProvider Additional Tests', () => {
  let railgunProvider: RailgunProvider;

  beforeEach(() => {
    railgunProvider = new RailgunProvider();
  });

  it('should transfer tokens successfully', async () => {
    const config = {
      rpcEndpoints: {
        ethereum: 'https://mainnet.infura.io/v3/test',
        polygon: 'https://polygon-rpc.com'
      },
      engineDbPath: './test-db'
    };

    await railgunProvider.initialize(config);

    const transferParams = {
      chain: 'ethereum',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amount: '1000000',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      privacy: 'shielded' as const
    };

    const result = await railgunProvider.transfer(transferParams);
    
    expect(result).toBeDefined();
    expect(result.transactionHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.status).toBe('pending');
  });

  it('should get balances successfully', async () => {
    const config = {
      rpcEndpoints: {
        ethereum: 'https://mainnet.infura.io/v3/test',
        polygon: 'https://polygon-rpc.com'
      },
      engineDbPath: './test-db'
    };

    await railgunProvider.initialize(config);

    const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const balances = await railgunProvider.getBalances(address);
    
    expect(balances).toBeDefined();
    expect(Array.isArray(balances)).toBe(true);
    expect(balances.length).toBeGreaterThan(0);
    
    const balance = balances[0];
    expect(balance.token).toBeDefined();
    expect(balance.token.address).toBeDefined();
    expect(balance.token.symbol).toBeDefined();
    expect(balance.token.decimals).toBeDefined();
    expect(balance.balance).toBeDefined();
  });

  it('should get transaction status successfully', async () => {
    const config = {
      rpcEndpoints: {
        ethereum: 'https://mainnet.infura.io/v3/test',
        polygon: 'https://polygon-rpc.com'
      },
      engineDbPath: './test-db'
    };

    await railgunProvider.initialize(config);

    const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
    const status = await railgunProvider.getTransactionStatus(txHash);
    
    expect(status).toBeDefined();
    expect(status.transactionHash).toBe(txHash);
    expect(status.status).toBe('success');
  });

  it('should reject transfer without initialization', async () => {
    const transferParams = {
      chain: 'ethereum',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amount: '1000000',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      privacy: 'shielded' as const
    };

    await expect(railgunProvider.transfer(transferParams))
      .rejects
      .toThrow('Provider not initialized. Call initialize() first.');
  });

  it('should reject getBalances without initialization', async () => {
    const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    
    await expect(railgunProvider.getBalances(address))
      .rejects
      .toThrow('Provider not initialized. Call initialize() first.');
  });

  it('should reject getTransactionStatus without initialization', async () => {
    const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
    
    await expect(railgunProvider.getTransactionStatus(txHash))
      .rejects
      .toThrow('Provider not initialized. Call initialize() first.');
  });

  it('should validate supported networks correctly', async () => {
    const config = {
      rpcEndpoints: {
        ethereum: 'https://mainnet.infura.io/v3/test',
        polygon: 'https://polygon-rpc.com'
      },
      engineDbPath: './test-db'
    };

    await railgunProvider.initialize(config);

    // Test supported networks
    const supportedNetworks = ['ethereum', 'polygon', 'arbitrum'];
    for (const network of supportedNetworks) {
      const transferParams = {
        chain: network,
        token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        amount: '1000000',
        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        privacy: 'shielded' as const
      };

      // Should not throw for supported networks
      await expect(railgunProvider.transfer(transferParams)).resolves.not.toThrow();
    }

    // Test unsupported network
    const transferParams = {
      chain: 'unsupported-network',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amount: '1000000',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      privacy: 'shielded' as const
    };

    await expect(railgunProvider.transfer(transferParams))
      .rejects
      .toThrow('Unsupported network: unsupported-network');
  });

  it('should validate base transfer parameters', async () => {
    const config = {
      rpcEndpoints: {
        ethereum: 'https://mainnet.infura.io/v3/test',
        polygon: 'https://polygon-rpc.com'
      },
      engineDbPath: './test-db'
    };

    await railgunProvider.initialize(config);

    // Test missing chain
    await expect(railgunProvider.transfer({
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amount: '1000000',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      privacy: 'shielded' as const
    } as any)).rejects.toThrow('Chain is required');

    // Test missing token
    await expect(railgunProvider.transfer({
      chain: 'ethereum',
      amount: '1000000',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      privacy: 'shielded' as const
    } as any)).rejects.toThrow('Token is required');

    // Test missing amount
    await expect(railgunProvider.transfer({
      chain: 'ethereum',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      privacy: 'shielded' as const
    } as any)).rejects.toThrow('Amount must be greater than 0');

    // Test missing recipient
    await expect(railgunProvider.transfer({
      chain: 'ethereum',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amount: '1000000',
      privacy: 'shielded' as const
    } as any)).rejects.toThrow('Recipient address is required');
  });

  it('should get explorer URL for different networks', () => {
    // Test private method through reflection
    const getExplorerUrl = (railgunProvider as any).getExplorerUrl.bind(railgunProvider);
    
    expect(getExplorerUrl('ethereum', '0xtx')).toContain('etherscan.io');
    expect(getExplorerUrl('polygon', '0xtx')).toContain('polygonscan.com');
    expect(getExplorerUrl('arbitrum', '0xtx')).toContain('arbiscan.io');
    expect(getExplorerUrl('unsupported', '0xtx')).toContain('etherscan.io');
  });

  it('should map network names correctly', () => {
    // Test private method through reflection
    const getRailgunNetwork = (railgunProvider as any).getRailgunNetwork.bind(railgunProvider);
    
    expect(getRailgunNetwork('ethereum')).toEqual(expect.anything()); // Should return NetworkName.Ethereum
    expect(getRailgunNetwork('polygon')).toEqual(expect.anything());  // Should return NetworkName.Polygon
    expect(getRailgunNetwork('arbitrum')).toEqual(expect.anything()); // Should return NetworkName.Arbitrum
    expect(getRailgunNetwork('unsupported')).toBeNull();
  });
});
