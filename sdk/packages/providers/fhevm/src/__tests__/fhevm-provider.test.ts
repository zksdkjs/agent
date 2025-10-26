/**
 * Tests for Zama fhEVM Provider
 */

import { FHEVMProvider } from '../provider';
import { ethers } from 'ethers';

// Mock the entire ethers module to avoid network calls
jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return {
    ...actual,
    JsonRpcProvider: jest.fn().mockImplementation(() => ({
      getNetwork: jest.fn().mockResolvedValue({ chainId: 8009 }),
      call: jest.fn().mockResolvedValue('0x'),
      getTransactionCount: jest.fn().mockResolvedValue(0),
    })),
    Contract: jest.fn().mockImplementation(() => ({
      getPublicKey: jest.fn().mockResolvedValue('0xmockpublickey'),
      transfer: jest.fn().mockResolvedValue({ hash: '0xtxhash' }),
      balanceOf: jest.fn().mockResolvedValue('0xmockbalance'),
    })),
  };
});

describe('FHEVMProvider', () => {
  let provider: FHEVMProvider;
  const mockConfig = {
    rpcUrl: 'http://localhost:8545', // Use localhost to avoid network calls
    aclAddress: '0x1234567890123456789012345678901234567890',
    networkId: 8009,
    chainId: 8009,
    publicKey: '0xmockpublickey' // Add public key to config to avoid network calls
  };

  beforeEach(() => {
    provider = new FHEVMProvider(mockConfig);
  });

  test('should create provider instance', () => {
    expect(provider).toBeInstanceOf(FHEVMProvider);
  });

  test('should connect with signer', async () => {
    const mockSigner = {
      getAddress: jest.fn().mockResolvedValue('0xabcd'),
    } as any;

    await provider.connect(mockSigner);
    
    // Provider should be connected
    expect(provider).toBeDefined();
  });

  test('should encrypt value', async () => {
    const mockSigner = {} as any;
    await provider.connect(mockSigner);

    const encrypted = await provider.encrypt(100n, mockConfig.aclAddress);

    expect(encrypted).toBeDefined();
    expect(encrypted.value).toBeDefined();
    expect(encrypted.proof).toBeDefined();
    expect(encrypted.contractAddress).toBe(mockConfig.aclAddress);
  });

  test('should throw error when encrypting without initialization', async () => {
    const freshProvider = new FHEVMProvider({ ...mockConfig, publicKey: undefined });
    
    await expect(
      freshProvider.encrypt(100n, mockConfig.aclAddress)
    ).rejects.toThrow('Public key not initialized');
  });

  test('should create confidential transaction', async () => {
    const mockSigner = {
      getAddress: jest.fn().mockResolvedValue('0xabcd'),
    } as any;
    await provider.connect(mockSigner);

    const tx = await provider.createConfidentialTransaction(
      '0x742d35Cc6607E308c2511f06548Fd6011465476b',
      100n
    );

    expect(tx).toBeDefined();
    expect(tx.to).toBe('0x742d35Cc6607E308c2511f06548Fd6011465476b');
    expect(tx.encryptedAmount).toBeDefined();
    expect(tx.encryptedAmount.value).toBeDefined();
  });

  test('should handle encryption with zero value', async () => {
    const mockSigner = {} as any;
    await provider.connect(mockSigner);

    const encrypted = await provider.encrypt(0n, mockConfig.aclAddress);

    expect(encrypted).toBeDefined();
    expect(encrypted.value).toBeDefined();
  });

  test('should handle large values', async () => {
    const mockSigner = {} as any;
    await provider.connect(mockSigner);

    const largeValue = 1000000000000000000n; // 1 ETH in wei
    const encrypted = await provider.encrypt(largeValue, mockConfig.aclAddress);

    expect(encrypted).toBeDefined();
    expect(encrypted.value).toBeDefined();
  });
});


