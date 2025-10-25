/**
 * Comprehensive test suite for zkSDK Core
 */

import { ZkSDK, BasePrivacyProvider, TransferParams, TransferResult, Balance, ProviderConfig } from '../src/sdk';

// Mock provider implementation for testing
class MockPrivacyProvider extends BasePrivacyProvider {
  name = 'MockProvider';
  
  constructor(config: ProviderConfig = {}) {
    super(config);
  }

  async initialize(config: ProviderConfig): Promise<void> {
    this.config = { ...this.config, ...config };
    return Promise.resolve();
  }

  async transfer(params: TransferParams): Promise<TransferResult> {
    // Validate params first
    this.validateTransferParams(params);
    
    return {
      transactionHash: '0x123456789abcdef',
      status: 'success',
      explorerUrl: 'https://etherscan.io/tx/0x123456789abcdef',
      fee: '0.001',
      timestamp: Date.now()
    };
  }

  async getBalances(address: string): Promise<Balance[]> {
    if (!address) {
      throw new Error('Address is required');
    }
    
    return [
      {
        token: {
          address: '0xTokenAddress',
          symbol: 'ETH',
          decimals: 18,
          name: 'Ethereum'
        },
        balance: '1000000000000000000' // 1 ETH in wei
      }
    ];
  }

  async getTransactionStatus(txHash: string): Promise<TransferResult> {
    if (!txHash) {
      throw new Error('Transaction hash is required');
    }
    
    return {
      transactionHash: txHash,
      status: 'success',
      explorerUrl: `https://etherscan.io/tx/${txHash}`,
      fee: '0.001',
      timestamp: Date.now()
    };
  }
}

describe('ZkSDK', () => {
  let mockProvider: MockPrivacyProvider;
  let sdk: ZkSDK;

  beforeEach(() => {
    mockProvider = new MockPrivacyProvider({ apiKey: 'test-key' });
    sdk = new ZkSDK({
      providers: {
        mock: mockProvider
      },
      defaultProvider: 'mock'
    });
  });

  describe('Initialization', () => {
    it('should create an instance with providers', () => {
      expect(sdk).toBeDefined();
      expect(typeof sdk.addProvider).toBe('function');
      expect(typeof sdk.getProvider).toBe('function');
    });

    it('should add a provider', () => {
      const newProvider = new MockPrivacyProvider();
      sdk.addProvider('newProvider', newProvider);
      
      const retrievedProvider = sdk.getProvider('newProvider');
      expect(retrievedProvider).toBe(newProvider);
    });

    it('should retrieve a provider by name', () => {
      const provider = sdk.getProvider('mock');
      expect(provider).toBe(mockProvider);
    });

    it('should throw an error when retrieving a non-existent provider', () => {
      expect(() => {
        sdk.getProvider('nonExistent');
      }).toThrow("Provider 'nonExistent' not found");
    });
  });

  describe('Transfers', () => {
    const validTransferParams: TransferParams = {
      chain: 'ethereum',
      token: 'ETH',
      amount: '1000000000000000000', // 1 ETH in wei
      to: '0xRecipientAddress',
      privacy: 'anonymous'
    };

    it('should execute a transfer with specified provider', async () => {
      const result = await sdk.transfer(validTransferParams, 'mock');
      
      expect(result).toBeDefined();
      expect(result.transactionHash).toBe('0x123456789abcdef');
      expect(result.status).toBe('success');
      expect(result.fee).toBe('0.001');
    });

    it('should execute a transfer with default provider', async () => {
      const result = await sdk.transfer(validTransferParams);
      
      expect(result).toBeDefined();
      expect(result.transactionHash).toBe('0x123456789abcdef');
      expect(result.status).toBe('success');
    });

    it('should throw an error when no provider is specified and no default is set', async () => {
      const sdkWithoutDefault = new ZkSDK({
        providers: { mock: mockProvider }
        // No defaultProvider specified
      });

      await expect(sdkWithoutDefault.transfer(validTransferParams))
        .rejects
        .toThrow('No provider specified and no default provider set');
    });

    it('should validate transfer parameters', async () => {
      // Test missing chain
      const paramsWithoutChain = { ...validTransferParams, chain: undefined };
      await expect(sdk.transfer(paramsWithoutChain as any))
        .rejects
        .toThrow('Chain is required');

      // Test missing token
      const paramsWithoutToken = { ...validTransferParams, token: undefined };
      await expect(sdk.transfer(paramsWithoutToken as any))
        .rejects
        .toThrow('Token is required');

      // Test missing amount
      const paramsWithoutAmount = { ...validTransferParams, amount: undefined };
      await expect(sdk.transfer(paramsWithoutAmount as any))
        .rejects
        .toThrow('Amount must be greater than 0');

      // Test zero amount
      const paramsWithZeroAmount = { ...validTransferParams, amount: '0' };
      await expect(sdk.transfer(paramsWithZeroAmount))
        .rejects
        .toThrow('Amount must be greater than 0');

      // Test missing recipient
      const paramsWithoutRecipient = { ...validTransferParams, to: undefined };
      await expect(sdk.transfer(paramsWithoutRecipient as any))
        .rejects
        .toThrow('Recipient address is required');

      // Test missing privacy
      const paramsWithoutPrivacy = { ...validTransferParams, privacy: undefined };
      await expect(sdk.transfer(paramsWithoutPrivacy as any))
        .rejects
        .toThrow('Privacy level is required');
    });
  });

  describe('Balance Queries', () => {
    it('should get balances from a provider', async () => {
      const balances = await sdk.getBalances('mock', '0xTestAddress');
      
      expect(balances).toBeDefined();
      expect(Array.isArray(balances)).toBe(true);
      expect(balances.length).toBe(1);
      
      const balance = balances[0];
      expect(balance.token.symbol).toBe('ETH');
      expect(balance.balance).toBe('1000000000000000000');
    });

    it('should throw an error when getting balances with invalid address', async () => {
      await expect(sdk.getBalances('mock', ''))
        .rejects
        .toThrow('Address is required');
    });
  });

  describe('Transaction Status', () => {
    it('should get transaction status', async () => {
      const txHash = '0xTransactionHash';
      const result = await sdk.getTransactionStatus('mock', txHash);
      
      expect(result).toBeDefined();
      expect(result.transactionHash).toBe(txHash);
      expect(result.status).toBe('success');
      expect(result.explorerUrl).toBe(`https://etherscan.io/tx/${txHash}`);
    });

    it('should throw an error when getting transaction status with invalid hash', async () => {
      await expect(sdk.getTransactionStatus('mock', ''))
        .rejects
        .toThrow('Transaction hash is required');
    });
  });
});

describe('BasePrivacyProvider', () => {
  let provider: MockPrivacyProvider;

  beforeEach(() => {
    provider = new MockPrivacyProvider();
  });

  describe('Validation', () => {
    it('should validate correct transfer parameters', () => {
      const validParams: TransferParams = {
        chain: 'ethereum',
        token: 'ETH',
        amount: '1000000000000000000',
        to: '0xRecipient',
        privacy: 'anonymous'
      };

      expect(() => {
        provider['validateTransferParams'](validParams);
      }).not.toThrow();
    });

    it('should reject missing chain', () => {
      const invalidParams = {
        token: 'ETH',
        amount: '1000000000000000000',
        to: '0xRecipient',
        privacy: 'anonymous'
      } as TransferParams;

      expect(() => {
        provider['validateTransferParams'](invalidParams);
      }).toThrow('Chain is required');
    });

    it('should reject missing token', () => {
      const invalidParams = {
        chain: 'ethereum',
        amount: '1000000000000000000',
        to: '0xRecipient',
        privacy: 'anonymous'
      } as TransferParams;

      expect(() => {
        provider['validateTransferParams'](invalidParams);
      }).toThrow('Token is required');
    });

    it('should reject missing amount', () => {
      const invalidParams = {
        chain: 'ethereum',
        token: 'ETH',
        to: '0xRecipient',
        privacy: 'anonymous'
      } as TransferParams;

      expect(() => {
        provider['validateTransferParams'](invalidParams);
      }).toThrow('Amount must be greater than 0');
    });

    it('should reject zero amount', () => {
      const invalidParams: TransferParams = {
        chain: 'ethereum',
        token: 'ETH',
        amount: '0',
        to: '0xRecipient',
        privacy: 'anonymous'
      };

      expect(() => {
        provider['validateTransferParams'](invalidParams);
      }).toThrow('Amount must be greater than 0');
    });

    it('should reject missing recipient', () => {
      const invalidParams = {
        chain: 'ethereum',
        token: 'ETH',
        amount: '1000000000000000000',
        privacy: 'anonymous'
      } as TransferParams;

      expect(() => {
        provider['validateTransferParams'](invalidParams);
      }).toThrow('Recipient address is required');
    });

    it('should reject missing privacy level', () => {
      const invalidParams = {
        chain: 'ethereum',
        token: 'ETH',
        amount: '1000000000000000000',
        to: '0xRecipient'
      } as TransferParams;

      expect(() => {
        provider['validateTransferParams'](invalidParams);
      }).toThrow('Privacy level is required');
    });
  });
});
