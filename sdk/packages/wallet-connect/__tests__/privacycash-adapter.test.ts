/**
 * Test suite for PrivacyCashAdapter
 */

import { PrivacyCashAdapter } from '../adapters/privacycash-adapter';

describe('PrivacyCashAdapter', () => {
  let adapter: PrivacyCashAdapter;
  let config: any;

  beforeEach(() => {
    config = {
      rpcEndpoint: 'https://api.devnet.solana.com',
      commitment: 'confirmed',
      cluster: 'devnet'
    };
    
    adapter = new PrivacyCashAdapter(config);
  });

  describe('Initialization', () => {
    it('should create an instance with configuration', () => {
      expect(adapter).toBeDefined();
      expect(adapter.name).toBe('PrivacyCash');
    });

    it('should initialize with configuration', async () => {
      await adapter.initialize(config);
      // Since this is a wrapper, we're testing that it doesn't throw
      expect(true).toBe(true);
    });
  });

  describe('Transfer Operations', () => {
    beforeEach(async () => {
      await adapter.initialize(config);
    });

    it('should execute a private transfer', async () => {
      const transferParams: any = {
        to: '9WPLRbG2qGm5RRYEN6ZYbrqtSGPs4y2u2UjnHP3c3dJp',
        amount: '1000000000', // 1 USDC
        token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint
        chain: 'solana',
        privacy: 'anonymous'
      };

      const result = await adapter.transfer(transferParams);
      expect(result.transactionHash).toBeDefined();
      expect(result.status).toBe('success');
      expect(result.explorerUrl).toContain('solscan.io');
      expect(result.fee).toBe('0.00005');
    });
  });

  describe('Balance Operations', () => {
    beforeEach(async () => {
      await adapter.initialize(config);
    });

    it('should get compressed token balances', async () => {
      const testAddress = '9WPLRbG2qGm5RRYEN6ZYbrqtSGPs4y2u2UjnHP3c3dJp';
      
      const result = await adapter.getBalances(testAddress);
      expect(result).toHaveLength(2);
      expect(result[0].token.symbol).toBe('SOL');
      expect(result[1].token.symbol).toBe('USDC');
      expect(result[0].balance).toBe('1500000000');
      expect(result[1].balance).toBe('1000000000');
    });
  });

  describe('Transaction Status', () => {
    beforeEach(async () => {
      await adapter.initialize(config);
    });

    it('should get transaction status', async () => {
      const txHash = '4tERNS2qTvzwpur17wo9XfwNjtYcKrWsJMT4ZyvkpZZywT1p1mktTB43zCZRFrzF2jGRG3qzxPUsQjyp47Qb11ix';
      
      const result = await adapter.getTransactionStatus(txHash);
      expect(result.transactionHash).toBe(txHash);
      expect(result.status).toBe('success');
      expect(result.explorerUrl).toContain('solscan.io');
      expect(result.fee).toBe('0.00005');
    });
  });
});
