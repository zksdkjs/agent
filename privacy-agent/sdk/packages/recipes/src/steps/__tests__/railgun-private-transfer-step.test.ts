import { RailgunPrivateTransferStep } from '../railgun-private-transfer-step';
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

describe('RailgunPrivateTransferStep', () => {
  let railgunProvider: RailgunProvider;
  let step: RailgunPrivateTransferStep;

  beforeEach(() => {
    railgunProvider = new MockRailgunProvider();
    step = new RailgunPrivateTransferStep(railgunProvider);
  });

  it('should have correct configuration', () => {
    expect(step.config.name).toBe('Railgun Private Transfer');
    expect(step.config.description).toBe('Execute a private transfer using Railgun EVM privacy system');
  });

  it('should execute private transfer successfully', async () => {
    const input = {
      network: 'ethereum',
      walletAddress: '0x1234567890123456789012345678901234567890',
      context: {},
      transferParams: {
        chain: 'ethereum',
        token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        amount: '1000000', // 1 USDC
        to: '0xabcdef123456789012345678901234567890abcdef'
      }
    };

    const result = await step.execute(input);
    
    expect(result.result.transactionHash).toBe('0x1234567890abcdef');
    expect(result.result.status).toBe('success');
    expect(result.effects.proofGenerated).toBe(true);
    expect(result.effects.feesPaid).toBe('0.01');
  });

  it('should validate input correctly', async () => {
    const input = {
      network: 'ethereum',
      walletAddress: '0x1234567890123456789012345678901234567890',
      context: {},
      transferParams: {
        chain: 'ethereum',
        token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        amount: '0', // Invalid amount
        to: '0xabcdef123456789012345678901234567890abcdef'
      }
    };

    await expect(step.execute(input)).rejects.toThrow('Amount must be greater than 0');
  });
});
