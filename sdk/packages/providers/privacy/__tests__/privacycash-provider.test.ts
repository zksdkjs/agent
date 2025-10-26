// Recipe: zkSDK Developer Agent
// File: sdk/packages/providers/privacy/__tests__/privacycash-provider.test.ts

import { PrivacyCashProvider } from '../src/privacycash-provider';
import { Keypair } from '@solana/web3.js';

describe('PrivacyCashProvider', () => {
  let provider: PrivacyCashProvider;
  let config: any;
  let mockKeypair: Keypair;

  beforeEach(() => {
    // Create a mock keypair for testing
    mockKeypair = Keypair.generate();
    
    config = {
      rpcEndpoint: 'https://api.devnet.solana.com',
      commitment: 'confirmed',
      cluster: 'devnet',
      keypair: mockKeypair
    };
    
    provider = new PrivacyCashProvider(config);
  });

  describe('Initialization', () => {
    it('should create an instance with configuration', () => {
      expect(provider).toBeDefined();
      expect(provider.name).toBe('PrivacyCash');
      expect((provider as any).config.rpcEndpoint).toBe('https://api.devnet.solana.com');
    });

    it('should initialize with configuration', async () => {
      await provider.initialize(config);
      expect((provider as any).initialized).toBe(true);
    });

    it('should throw error when initialized without config', async () => {
      const emptyProvider = new PrivacyCashProvider();
      await expect(emptyProvider.initialize({}))
        .rejects
        .toThrow('RPC endpoint is required for Privacy Cash provider');
    });
  });

  describe('Transfer Operations', () => {
    beforeEach(async () => {
      await provider.initialize(config);
    });

    it('should execute a private transfer', async () => {
      const transferParams: any = {
        to: '9WPLRbG2qGm5RRYEN6ZYbrqtSGPs4y2u2UjnHP3c3dJp',
        amount: '1000000000', // 1 USDC
        token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint
        chain: 'solana',
        privacy: 'anonymous'
      };

      const result = await provider.transfer(transferParams);
      expect(result.transactionHash).toBeDefined();
      expect(result.status).toBe('success');
      expect(result.explorerUrl).toContain('solscan.io');
      expect(result.fee).toBe('0.00005');
    });

    it('should validate transfer parameters', async () => {
      const invalidParams = {
        to: '',
        amount: '0',
        token: '',
        chain: 'solana',
        privacy: 'anonymous'
      };

      await expect(provider.transfer(invalidParams as any))
        .rejects
        .toThrow('Recipient address is required');
    });

    it('should throw error when transfer called without initialization', async () => {
      const uninitializedProvider = new PrivacyCashProvider(config);
      
      const transferParams: any = {
        to: '9WPLRbG2qGm5RRYEN6ZYbrqtSGPs4y2u2UjnHP3c3dJp',
        amount: '1000000000',
        token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        chain: 'solana',
        privacy: 'anonymous'
      };

      await expect(uninitializedProvider.transfer(transferParams))
        .rejects
        .toThrow('Privacy Cash provider not initialized');
    });

    it('should throw error when transfer called without keypair', async () => {
      const providerWithoutKeypair = new PrivacyCashProvider({
        rpcEndpoint: 'https://api.devnet.solana.com',
        commitment: 'confirmed',
        cluster: 'devnet'
        // No keypair provided
      });
      
      await providerWithoutKeypair.initialize({
        rpcEndpoint: 'https://api.devnet.solana.com',
        commitment: 'confirmed',
        cluster: 'devnet'
        // No keypair provided
      });
      
      const transferParams: any = {
        to: '9WPLRbG2qGm5RRYEN6ZYbrqtSGPs4y2u2UjnHP3c3dJp',
        amount: '1000000000',
        token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        chain: 'solana',
        privacy: 'anonymous'
      };

      await expect(providerWithoutKeypair.transfer(transferParams))
        .rejects
        .toThrow('Keypair is required for signing transactions');
    });
  });

  describe('Balance Operations', () => {
    beforeEach(async () => {
      await provider.initialize(config);
    });

    it('should get compressed token balances', async () => {
      const testAddress = '9WPLRbG2qGm5RRYEN6ZYbrqtSGPs4y2u2UjnHP3c3dJp';
      
      const result = await provider.getBalances(testAddress);
      expect(result).toHaveLength(2);
      expect(result[0].token.symbol).toBe('SOL');
      expect(result[1].token.symbol).toBe('USDC');
      expect(result[0].balance).toBe('1500000000');
      expect(result[1].balance).toBe('1000000000');
    });

    it('should throw error when getBalances called without initialization', async () => {
      const uninitializedProvider = new PrivacyCashProvider(config);
      
      await expect(uninitializedProvider.getBalances('test-address'))
        .rejects
        .toThrow('Privacy Cash provider not initialized');
    });
  });

  describe('Transaction Status', () => {
    beforeEach(async () => {
      await provider.initialize(config);
    });

    it('should get transaction status', async () => {
      const txHash = '4tERNS2qTvzwpur17wo9XfwNjtYcKrWsJMT4ZyvkpZZywT1p1mktTB43zCZRFrzF2jGRG3qzxPUsQjyp47Qb11ix';
      
      const result = await provider.getTransactionStatus(txHash);
      expect(result.transactionHash).toBe(txHash);
      expect(result.status).toBe('success');
      expect(result.explorerUrl).toContain('solscan.io');
      expect(result.fee).toBe('0.00005');
    });

    it('should throw error when getTransactionStatus called without initialization', async () => {
      const uninitializedProvider = new PrivacyCashProvider(config);
      
      await expect(uninitializedProvider.getTransactionStatus('test-tx-hash'))
        .rejects
        .toThrow('Privacy Cash provider not initialized');
    });
  });

  describe('Compressed Token Operations', () => {
    beforeEach(async () => {
      await provider.initialize(config);
    });

    it('should get compressed token accounts', async () => {
      const testAddress = '9WPLRbG2qGm5RRYEN6ZYbrqtSGPs4y2u2UjnHP3c3dJp';
      
      const result = await provider.getCompressedTokenAccounts(testAddress);
      expect(result).toHaveLength(2);
      expect(result[0].mint).toBe('So11111111111111111111111111111111111111112');
      expect(result[1].mint).toBe('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
      expect(result[0].owner).toBe(testAddress);
    });
  });
});
