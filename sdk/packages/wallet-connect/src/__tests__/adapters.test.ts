/**
 * Additional tests for wallet-connect adapters
 */

import { RailgunAdapter } from '../adapters/railgun-adapter';
import { AztecAdapter } from '../adapters/aztec-adapter';

describe('RailgunAdapter Additional Tests', () => {
  let railgunAdapter: RailgunAdapter;

  beforeEach(() => {
    railgunAdapter = new RailgunAdapter({
      apiKey: 'test-api-key'
    });
  });

  test('should create RailgunAdapter instance', () => {
    expect(railgunAdapter).toBeInstanceOf(RailgunAdapter);
    expect(railgunAdapter.name).toBe('Railgun');
  });

  test('should initialize RailgunAdapter', async () => {
    const config = {
      apiKey: 'test-api-key',
      walletMnemonic: 'test mnemonic'
    };
    
    await expect(railgunAdapter.initialize(config)).resolves.not.toThrow();
  });

  test('should check if adapter is ready', async () => {
    const config = {
      apiKey: 'test-api-key'
    };
    
    await railgunAdapter.initialize(config);
    const isReady = await railgunAdapter.isReady();
    
    expect(isReady).toBe(true);
  });

  test('should transfer tokens', async () => {
    const config = {
      apiKey: 'test-api-key'
    };
    
    await railgunAdapter.initialize(config);
    
    const transferParams = {
      chain: 'ethereum',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amount: '1000000',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      privacy: 'shielded' as const
    };

    const result = await railgunAdapter.transfer(transferParams);
    
    expect(result).toBeDefined();
    expect(result.transactionHash).toBeDefined();
    expect(result.status).toBeDefined();
  });

  test('should get balances', async () => {
    const config = {
      apiKey: 'test-api-key'
    };
    
    await railgunAdapter.initialize(config);
    
    const address = 'railgun:0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const balances = await railgunAdapter.getBalances(address);
    
    expect(balances).toBeDefined();
    expect(Array.isArray(balances)).toBe(true);
    expect(balances.length).toBeGreaterThan(0);
  });

  test('should get transaction status', async () => {
    const config = {
      apiKey: 'test-api-key'
    };
    
    await railgunAdapter.initialize(config);
    
    const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
    const status = await railgunAdapter.getTransactionStatus(txHash);
    
    expect(status).toBeDefined();
    expect(status.transactionHash).toBe(txHash);
    expect(status.status).toBeDefined();
  });

  test('should reject operations without initialization', async () => {
    const address = 'railgun:0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    
    await expect(railgunAdapter.getBalances(address))
      .rejects
      .toThrow('Railgun adapter not initialized. Call initialize() first.');
      
    const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
    await expect(railgunAdapter.getTransactionStatus(txHash))
      .rejects
      .toThrow('Railgun adapter not initialized. Call initialize() first.');
  });
});

describe('AztecAdapter Additional Tests', () => {
  let aztecAdapter: AztecAdapter;

  beforeEach(() => {
    aztecAdapter = new AztecAdapter({
      apiKey: 'test-api-key'
    });
  });

  test('should create AztecAdapter instance', () => {
    expect(aztecAdapter).toBeInstanceOf(AztecAdapter);
    expect(aztecAdapter.name).toBe('Aztec');
  });

  test('should initialize AztecAdapter', async () => {
    const config = {
      apiKey: 'test-api-key',
      pxeUrl: 'http://localhost:8080'
    };
    
    await expect(aztecAdapter.initialize(config)).resolves.not.toThrow();
  });

  test('should check if adapter is ready', async () => {
    const config = {
      apiKey: 'test-api-key'
    };
    
    await aztecAdapter.initialize(config);
    const isReady = await aztecAdapter.isReady();
    
    expect(isReady).toBe(true);
  });

  test('should transfer tokens', async () => {
    const config = {
      apiKey: 'test-api-key'
    };
    
    await aztecAdapter.initialize(config);
    
    const transferParams = {
      chain: 'aztec',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amount: '1000000',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      privacy: 'anonymous' as const
    };

    const result = await aztecAdapter.transfer(transferParams);
    
    expect(result).toBeDefined();
    expect(result.transactionHash).toBeDefined();
    expect(result.status).toBeDefined();
  });

  test('should get balances', async () => {
    const config = {
      apiKey: 'test-api-key'
    };
    
    await aztecAdapter.initialize(config);
    
    const address = 'aztec:0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const balances = await aztecAdapter.getBalances(address);
    
    expect(balances).toBeDefined();
    expect(Array.isArray(balances)).toBe(true);
    expect(balances.length).toBeGreaterThan(0);
  });

  test('should get transaction status', async () => {
    const config = {
      apiKey: 'test-api-key'
    };
    
    await aztecAdapter.initialize(config);
    
    const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
    const status = await aztecAdapter.getTransactionStatus(txHash);
    
    expect(status).toBeDefined();
    expect(status.transactionHash).toBe(txHash);
    expect(status.status).toBeDefined();
  });

  test('should reject operations without initialization', async () => {
    const address = 'aztec:0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    
    await expect(aztecAdapter.getBalances(address))
      .rejects
      .toThrow('Aztec adapter not initialized. Call initialize() first.');
      
    const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
    await expect(aztecAdapter.getTransactionStatus(txHash))
      .rejects
      .toThrow('Aztec adapter not initialized. Call initialize() first.');
  });
});
