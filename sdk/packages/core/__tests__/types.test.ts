/**
 * Test suite for zkSDK Core Types and Interfaces
 */

import { 
  BasePrivacyProvider, 
  TransferParams, 
  TransferResult, 
  Balance, 
  Token, 
  ProviderConfig,
  Network,
  PrivacyLevel
} from '../src/index';

// Mock provider implementation for testing the abstract class
class ConcretePrivacyProvider extends BasePrivacyProvider {
  name = 'ConcreteProvider';
  
  constructor(config: ProviderConfig = {}) {
    super(config);
  }

  async initialize(config: ProviderConfig): Promise<void> {
    this.config = { ...this.config, ...config };
    return Promise.resolve();
  }

  async transfer(params: TransferParams): Promise<TransferResult> {
    this.validateTransferParams(params);
    
    return {
      transactionHash: '0xabc123',
      status: 'success',
      timestamp: Date.now()
    };
  }

  async getBalances(address: string): Promise<Balance[]> {
    return [];
  }

  async getTransactionStatus(txHash: string): Promise<TransferResult> {
    return {
      transactionHash: txHash,
      status: 'pending',
      timestamp: Date.now()
    };
  }
}

describe('Core Types and Interfaces', () => {
  describe('Type Definitions', () => {
    it('should define Network type with expected values', () => {
      const networks: Network[] = [
        'ethereum',
        'polygon', 
        'arbitrum',
        'base',
        'optimism',
        'solana',
        'aztec',
        'midnight',
        'custom-network' // Should accept custom strings
      ];
      
      // This test primarily ensures the type is correctly defined
      expect(networks.length).toBeGreaterThan(0);
    });

    it('should define PrivacyLevel type with expected values', () => {
      const privacyLevels: PrivacyLevel[] = [
        'anonymous',
        'shielded',
        'public'
      ];
      
      expect(privacyLevels).toContain('anonymous');
      expect(privacyLevels).toContain('shielded');
      expect(privacyLevels).toContain('public');
    });

    it('should define Token interface', () => {
      const token: Token = {
        address: '0xTokenAddress',
        symbol: 'ETH',
        decimals: 18,
        name: 'Ethereum'
      };
      
      expect(token.address).toBe('0xTokenAddress');
      expect(token.symbol).toBe('ETH');
      expect(token.decimals).toBe(18);
      expect(token.name).toBe('Ethereum');
    });

    it('should define TransferParams interface', () => {
      const transferParams: TransferParams = {
        chain: 'ethereum',
        token: 'ETH',
        amount: '1000000000000000000',
        to: '0xRecipient',
        privacy: 'anonymous',
        memo: 'Test transfer'
      };
      
      expect(transferParams.chain).toBe('ethereum');
      expect(transferParams.token).toBe('ETH');
      expect(transferParams.amount).toBe('1000000000000000000');
      expect(transferParams.to).toBe('0xRecipient');
      expect(transferParams.privacy).toBe('anonymous');
      expect(transferParams.memo).toBe('Test transfer');
    });

    it('should define TransferResult interface', () => {
      const timestamp = Date.now();
      const transferResult: TransferResult = {
        transactionHash: '0xTxHash',
        status: 'success',
        explorerUrl: 'https://etherscan.io/tx/0xTxHash',
        fee: '0.001',
        timestamp: timestamp
      };
      
      expect(transferResult.transactionHash).toBe('0xTxHash');
      expect(transferResult.status).toBe('success');
      expect(transferResult.explorerUrl).toBe('https://etherscan.io/tx/0xTxHash');
      expect(transferResult.fee).toBe('0.001');
      expect(transferResult.timestamp).toBe(timestamp);
    });

    it('should define Balance interface', () => {
      const token: Token = {
        address: '0xTokenAddress',
        symbol: 'ETH',
        decimals: 18
      };
      
      const balance: Balance = {
        token: token,
        balance: '1000000000000000000',
        usdValue: 1234.56
      };
      
      expect(balance.token).toBe(token);
      expect(balance.balance).toBe('1000000000000000000');
      expect(balance.usdValue).toBe(1234.56);
    });

    it('should define ProviderConfig interface', () => {
      const config: ProviderConfig = {
        apiKey: 'test-api-key',
        rpcUrl: 'https://rpc.example.com',
        network: 'ethereum',
        customField: 'custom-value'
      };
      
      expect(config.apiKey).toBe('test-api-key');
      expect(config.rpcUrl).toBe('https://rpc.example.com');
      expect(config.network).toBe('ethereum');
      expect(config.customField).toBe('custom-value');
    });
  });

  describe('BasePrivacyProvider', () => {
    let provider: ConcretePrivacyProvider;

    beforeEach(() => {
      provider = new ConcretePrivacyProvider({
        apiKey: 'test-key',
        network: 'ethereum'
      });
    });

    it('should be instantiable', () => {
      expect(provider).toBeInstanceOf(BasePrivacyProvider);
      expect(provider).toBeInstanceOf(ConcretePrivacyProvider);
    });

    it('should have a name property', () => {
      expect(provider.name).toBe('ConcreteProvider');
    });

    it('should store configuration', () => {
      expect(provider['config'].apiKey).toBe('test-key');
      expect(provider['config'].network).toBe('ethereum');
    });

    it('should initialize with new configuration', async () => {
      await provider.initialize({
        apiKey: 'new-key',
        rpcUrl: 'https://new-rpc.example.com'
      });
      
      expect(provider['config'].apiKey).toBe('new-key');
      expect(provider['config'].rpcUrl).toBe('https://new-rpc.example.com');
    });

    it('should execute transfer method', async () => {
      const params: TransferParams = {
        chain: 'ethereum',
        token: 'ETH',
        amount: '1000000000000000000',
        to: '0xRecipient',
        privacy: 'anonymous'
      };
      
      const result = await provider.transfer(params);
      expect(result.transactionHash).toBe('0xabc123');
      expect(result.status).toBe('success');
    });

    it('should get balances', async () => {
      const balances = await provider.getBalances('0xTestAddress');
      expect(Array.isArray(balances)).toBe(true);
    });

    it('should get transaction status', async () => {
      const result = await provider.getTransactionStatus('0xTestTx');
      expect(result.transactionHash).toBe('0xTestTx');
      expect(result.status).toBe('pending');
    });

    it('should validate transfer parameters', () => {
      const validParams: TransferParams = {
        chain: 'ethereum',
        token: 'ETH',
        amount: '1000000000000000000',
        to: '0xRecipient',
        privacy: 'anonymous'
      };
      
      // Should not throw for valid params
      expect(() => {
        provider['validateTransferParams'](validParams);
      }).not.toThrow();
    });
  });
});
