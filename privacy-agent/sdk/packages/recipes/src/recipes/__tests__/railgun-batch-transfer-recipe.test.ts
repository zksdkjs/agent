import { RailgunBatchTransferRecipe } from '../railgun-batch-transfer-recipe';
import { RailgunProvider } from '../../../../../providers/railgun/src/index';

// Mock RailgunProvider for testing
class MockRailgunProvider extends RailgunProvider {
  async transfer(params: any): Promise<any> {
    return {
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      status: 'success',
      explorerUrl: 'https://etherscan.io/tx/0x1234567890abcdef',
      fee: '0.01',
      timestamp: Date.now()
    };
  }
}

describe('RailgunBatchTransferRecipe', () => {
  let railgunProvider: RailgunProvider;
  let recipe: RailgunBatchTransferRecipe;

  beforeEach(() => {
    railgunProvider = new MockRailgunProvider();
    recipe = new RailgunBatchTransferRecipe(railgunProvider);
  });

  it('should have correct configuration', () => {
    expect(recipe.config.name).toBe('Railgun Batch Transfer Recipe');
    expect(recipe.config.description).toBe('Execute multiple private transfers in a batch using Railgun EVM privacy system');
    expect(recipe.config.maxTransfersPerBatch).toBe(10);
  });

  it('should execute batch transfer recipe successfully', async () => {
    const input = {
      network: 'ethereum',
      walletAddress: '0x1234567890123456789012345678901234567890',
      transfers: [
        {
          token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
          amount: '1000000', // 1 USDC
          to: '0xabcdef123456789012345678901234567890abcdef'
        },
        {
          token: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
          amount: '2000000', // 2 USDT
          to: '0xfedcba0987654321fedcba0987654321fedcba09'
        }
      ],
      memo: 'Batch transfer test'
    };

    const result = await recipe.execute(input);
    
    expect(result.name).toBe('Railgun Batch Transfer Recipe');
    expect(result.result).toHaveLength(2);
    expect(result.result[0].status).toBe('success');
    expect(result.result[1].status).toBe('success');
    expect(result.errors).toBeUndefined();
  });

  it('should validate batch size correctly', async () => {
    const transfers = [];
    for (let i = 0; i < 15; i++) {
      transfers.push({
        token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        amount: '1000000', // 1 USDC
        to: `0x${i.toString().padStart(40, '0')}`
      });
    }

    const input = {
      network: 'ethereum',
      walletAddress: '0x1234567890123456789012345678901234567890',
      transfers
    };

    await expect(recipe.execute(input)).rejects.toThrow('Maximum 10 transfers allowed per batch');
  });

  it('should require at least one transfer', async () => {
    const input = {
      network: 'ethereum',
      walletAddress: '0x1234567890123456789012345678901234567890',
      transfers: []
    };

    await expect(recipe.execute(input)).rejects.toThrow('At least one transfer is required');
  });
});
