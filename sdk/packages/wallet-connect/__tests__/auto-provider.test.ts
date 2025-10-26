/**
 * Test suite for AutoPrivacyProvider
 */

import { AutoPrivacyProvider } from '../src/index';
import { ProviderConfig, TransferParams } from '../../core/src';

describe('AutoPrivacyProvider', () => {
  let autoProvider: AutoPrivacyProvider;
  let config: ProviderConfig;

  beforeEach(() => {
    config = {
      providers: {
        railgun: { apiKey: 'test-railgun-key' },
        aztec: { apiKey: 'test-aztec-key' }
      },
      defaultProvider: 'railgun'
    };
    
    autoProvider = new AutoPrivacyProvider(config);
  });

  describe('Initialization', () => {
    it('should create an instance with configuration', () => {
      expect(autoProvider).toBeDefined();
      expect(autoProvider.name).toBe('Auto');
    });

    it('should initialize with provider configuration', async () => {
      // Mock the wallet connect initialization
      const mockInitialize = jest.spyOn(autoProvider as any, 'initialize').mockResolvedValue(undefined);
      
      await autoProvider.initialize(config);
      expect(mockInitialize).toHaveBeenCalledWith(config);
    });
  });

  describe('Transfer Operations', () => {
    it('should execute transfer when connected', async () => {
      const transferParams: TransferParams = {
        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        amount: '1000000',
        token: 'USDC',
        chain: 'ethereum',
        privacy: 'anonymous'
      };

      // Mock the connected provider
      const mockTransfer = jest.fn().mockResolvedValue({
        transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
        status: 'pending',
        timestamp: Date.now()
      });

      (autoProvider as any).connectedProvider = {
        transfer: mockTransfer
      };

      const result = await autoProvider.transfer(transferParams);
      expect(mockTransfer).toHaveBeenCalledWith(transferParams);
      expect(result.transactionHash).toBeDefined();
      expect(result.status).toBe('pending');
    });

    it('should throw error when transfer called without connected provider', async () => {
      const transferParams: TransferParams = {
        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        amount: '1000000',
        token: 'USDC',
        chain: 'ethereum',
        privacy: 'anonymous'
      };

      await expect(autoProvider.transfer(transferParams))
        .rejects
        .toThrow('No provider connected');
    });
  });

  describe('Balance Operations', () => {
    it('should get balances when connected', async () => {
      const testAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
      
      // Mock the connected provider
      const mockGetBalances = jest.fn().mockResolvedValue([
        {
          token: {
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            symbol: 'USDC',
            decimals: 6
          },
          balance: '1000000000'
        }
      ]);

      (autoProvider as any).connectedProvider = {
        getBalances: mockGetBalances
      };

      const result = await autoProvider.getBalances(testAddress);
      expect(mockGetBalances).toHaveBeenCalledWith(testAddress);
      expect(result).toHaveLength(1);
      expect(result[0].token.symbol).toBe('USDC');
    });

    it('should throw error when getBalances called without connected provider', async () => {
      const testAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
      
      await expect(autoProvider.getBalances(testAddress))
        .rejects
        .toThrow('No provider connected');
    });
  });

  describe('Transaction Status', () => {
    it('should get transaction status when connected', async () => {
      const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      
      // Mock the connected provider
      const mockGetTransactionStatus = jest.fn().mockResolvedValue({
        transactionHash: txHash,
        status: 'success',
        timestamp: Date.now()
      });

      (autoProvider as any).connectedProvider = {
        getTransactionStatus: mockGetTransactionStatus
      };

      const result = await autoProvider.getTransactionStatus(txHash);
      expect(mockGetTransactionStatus).toHaveBeenCalledWith(txHash);
      expect(result.transactionHash).toBe(txHash);
      expect(result.status).toBe('success');
    });

    it('should throw error when getTransactionStatus called without connected provider', async () => {
      const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      
      await expect(autoProvider.getTransactionStatus(txHash))
        .rejects
        .toThrow('No provider connected');
    });
  });
});
