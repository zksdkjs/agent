/**
 * Tests for Light Protocol Provider
 */

import { LightProtocolProvider } from '../provider';
import { PublicKey } from '@solana/web3.js';

// Mock @solana/web3.js
jest.mock('@solana/web3.js', () => ({
  Connection: jest.fn().mockImplementation(() => ({
    sendRpcRequest: jest.fn().mockResolvedValue({}),
    getLatestBlockhash: jest.fn().mockResolvedValue({ blockhash: 'mock', lastValidBlockHeight: 100 }),
  })),
  PublicKey: jest.fn().mockImplementation((key) => ({
    toBase58: () => key,
    toBuffer: () => Buffer.from(key),
  })),
  Transaction: jest.fn(),
  TransactionSignature: jest.fn(),
}));

describe('LightProtocolProvider', () => {
  let provider: LightProtocolProvider;
  const mockRpcEndpoint = 'https://devnet.helius-rpc.com';

  beforeEach(() => {
    provider = new LightProtocolProvider(mockRpcEndpoint);
  });

  test('should create provider instance', () => {
    expect(provider).toBeInstanceOf(LightProtocolProvider);
  });

  test('should get compressed account', async () => {
    const mockAddress = new PublicKey('11111111111111111111111111111111');
    
    const result = await provider.getCompressedAccount(mockAddress);

    expect(result).toBeDefined();
    expect(result.account).toBeDefined();
    expect(result.proof).toBeDefined();
  });

  test('should get compressed balance', async () => {
    const mockAddress = new PublicKey('11111111111111111111111111111111');
    
    const result = await provider.getCompressedBalance(mockAddress);

    expect(result).toBeDefined();
    expect(result.balance).toBeDefined();
    expect(typeof result.balance).toBe('number');
  });

  test('should get compressed token balance', async () => {
    const mockAddress = new PublicKey('11111111111111111111111111111111');
    const mockMint = new PublicKey('So11111111111111111111111111111111111111112');
    
    const result = await provider.getCompressedTokenBalance(mockAddress, mockMint);

    expect(result).toBeDefined();
    expect(result.amount).toBeDefined();
    expect(typeof result.amount).toBe('bigint');
  });

  test('should handle errors gracefully', async () => {
    const invalidAddress = new PublicKey('invalid');
    
    await expect(
      provider.getCompressedAccount(invalidAddress)
    ).resolves.toBeDefined(); // Should not throw, returns empty result
  });

  test('should initialize with different commitment levels', () => {
    const confirmedProvider = new LightProtocolProvider(mockRpcEndpoint, 'confirmed');
    const finalizedProvider = new LightProtocolProvider(mockRpcEndpoint, 'finalized');

    expect(confirmedProvider).toBeInstanceOf(LightProtocolProvider);
    expect(finalizedProvider).toBeInstanceOf(LightProtocolProvider);
  });
});


