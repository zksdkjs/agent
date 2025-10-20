import { RailgunPrivateTransferRecipe } from '../railgun-private-transfer-recipe';
import { RailgunProvider } from '@zksdk/providers/railgun';

// Mock RailgunProvider for testing
class MockRailgunProvider extends RailgunProvider {
  async transfer(params: any): Promise<any> {
    return {
      transactionHash: '0x1234567890abcdef',
      status: 'success',
      explorerUrl: 'https://etherscan.io/tx/0x1234567890abcdef',
      fee: '0.01',
      timestamp: Date.now()
    };
  }
}

describe('RailgunPrivateTransferRecipe', () => {
  let railgunProvider: RailgunProvider;
  let recipe: RailgunPrivateTransferRecipe;

  beforeEach(() => {
    railgunProvider = new MockRailgunProvider();
    recipe = new RailgunPrivateTransferRecipe(railgunProvider);
  });

  it('should have correct configuration', () => {
    expect(recipe.config.name).toBe('Railgun Private Transfer Recipe');
    expect(recipe.config.description).toBe('Execute a private transfer using Railgun EVM privacy system');
    expect(recipe.config.supportedNetworks).toContain('ethereum');
    expect(recipe.config.supportedNetworks).toContain('polygon');
    expect(recipe.config.supportedNetworks).toContain('arbitrum');
  });

  it('should execute private transfer recipe successfully', async () => {
    const input = {
      network: 'ethereum',
      walletAddress: '0x1234567890123456789012345678901234567890',
      transferParams: {
        token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        amount: '1000000', // 1 USDC
        to: '0xabcdef123456789012345678901234567890abcdef'
      },
      memo: 'Test transfer'
    };

    const result = await recipe.execute(input);
    
    expect(result.name).toBe('Railgun Private Transfer Recipe');
    expect(result.result.transactionHash).toBe('0x1234567890abcdef');
    expect(result.result.status).toBe('success');
    expect(result.errors).toBeUndefined();
  });

  it('should validate network correctly', async () => {
    const input = {
      network: 'unsupported-network',
      walletAddress: '0x1234567890123456789012345678901234567890',
      transferParams: {
        token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        amount: '1000000', // 1 USDC
        to: '0xabcdef123456789012345678901234567890abcdef'
      }
    };

    await expect(recipe.execute(input)).rejects.toThrow('Network unsupported-network is not supported by this recipe');
  });
});
