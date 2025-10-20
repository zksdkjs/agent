/**
 * Tests for Railgun Provider
 */

import { RailgunProvider } from '../index';
import { PrivacyLevel } from '@zksdk/core';

describe('RailgunProvider', () => {
  let provider: RailgunProvider;

  beforeEach(() => {
    provider = new RailgunProvider();
  });

  test('should create provider instance', () => {
    expect(provider).toBeInstanceOf(RailgunProvider);
    expect(provider.name).toBe('Railgun');
  });

  test('should throw error when transferring without initialization', async () => {
    const transferParams = {
      chain: 'ethereum',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amount: '1000000',
      to: '0x742d35Cc66343434343434343434343434343434',
      privacy: 'anonymous' as PrivacyLevel
    };

    await expect(provider.transfer(transferParams)).rejects.toThrow('Provider not initialized');
  });

  test('should validate transfer parameters', async () => {
    const provider = new RailgunProvider();
    // @ts-ignore - accessing protected method for testing
    expect(() => provider.validateTransferParams({} as any)).toThrow('Chain is required');
    
    // @ts-ignore
    expect(() => provider.validateTransferParams({ chain: 'ethereum' } as any)).toThrow('Token is required');
    
    // @ts-ignore
    expect(() => provider.validateTransferParams({ chain: 'ethereum', token: '0x123' } as any)).toThrow('Amount must be greater than 0');
  });
});
