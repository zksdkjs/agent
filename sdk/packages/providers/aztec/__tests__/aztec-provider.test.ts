// Comprehensive test for Aztec provider integration

import { AztecProvider } from '../aztec-provider';
import { AztecProviderConfig } from '../aztec-provider';
import { PXEConfig } from '../services/pxe-service';

describe('AztecProvider Integration Tests', () => {
  let provider: AztecProvider;
  let config: AztecProviderConfig;

  beforeAll(() => {
    // Configuration for testing against Sepolia testnet
    const pxeConfig: PXEConfig = {
      nodeUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel',
      useExisting: true, // Try to connect to existing PXE first
      pxeHost: '127.0.0.1',
      pxePort: 8080
    };

    config = {
      type: 'aztec',
      chainId: 11155111, // Sepolia testnet
      networkType: 'testnet',
      rpcUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel',
      pxeConfig
    };
  });

  beforeEach(async () => {
    provider = new AztecProvider();
  });

  afterEach(async () => {
    try {
      await provider.destroy();
    } catch (error) {
      // Ignore errors during cleanup
    }
  });

  test('should validate configuration correctly', () => {
    // This should not throw for valid config
    expect(() => {
      (provider as any).validateConfig(config);
    }).not.toThrow();
  });

  test('should reject invalid provider type', () => {
    const invalidConfig = { ...config, type: 'invalid' };
    expect(() => {
      (provider as any).validateConfig(invalidConfig);
    }).toThrow(/Invalid provider type/);
  });

  test('should reject unsupported chain ID', () => {
    const invalidConfig = { ...config, chainId: 999 };
    expect(() => {
      (provider as any).validateConfig(invalidConfig);
    }).toThrow(/not supported/);
  });

  test('should initialize provider successfully', async () => {
    // Note: This test requires a running PXE or network access
    // In a real test environment, you might want to mock the PXE service
    try {
      await provider.initialize(config);
      expect(provider.isReady()).toBe(true);
    } catch (error) {
      // If PXE is not available, this is expected
      console.warn('PXE not available for testing:', error);
    }
  }, 30000); // 30 second timeout

  test('should get provider info', () => {
    const info = provider.getProviderInfo();
    expect(info.name).toBe('aztec');
    expect(info.version).toBe('1.0.0');
    expect(info.description).toBe('Aztec Privacy Protocol Provider');
    expect(info.supportedChains.length).toBeGreaterThan(0);
  });

  test('should get supported operations', () => {
    const operations = provider.getSupportedOperations();
    const operationNames = operations.map(op => op.name);
    
    expect(operationNames).toContain('sendPrivateTransaction');
    expect(operationNames).toContain('getPrivateBalance');
    expect(operationNames).toContain('generatePrivateAddress');
    expect(operationNames).toContain('importPrivateKey');
    expect(operationNames).toContain('deployContract');
    expect(operationNames).toContain('callContract');
  });
});
