/**
 * Advanced Recipe Examples - Privacy SDK
 * 
 * This example demonstrates the new recipe capabilities including
 * swaps, shield/unshield, and batch transfers.
 */

import { createPrivacySDK } from '../packages/sdk/dist/index.js';

async function advancedRecipeExamples() {
  console.log('🚀 Privacy SDK - Advanced Recipe Examples');
  
  try {
    // Create SDK with mock provider for demonstration
    const sdk = createPrivacySDK({
      provider: 'railgun-mock',
      chainId: 1,
      networkType: 'testnet'
    });
    
    await sdk.initialize();
    console.log('✅ SDK initialized successfully');
    
    // Example 1: Shield tokens (public -> private)
    console.log('\n🛡️ Example 1: Shield Tokens');
    const shieldResult = await sdk.recipes.shield({
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      amount: '1000000', // 1 USDC
      to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e'
    });
    console.log('Shield result:', shieldResult.success ? 'Success' : 'Failed');
    
    // Example 2: Private Swap
    console.log('\n🔄 Example 2: Private Token Swap');
    const swapResult = await sdk.recipes.privateSwap({
      fromToken: {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        decimals: 6,
        name: 'USD Coin'
      },
      toToken: {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        decimals: 18,
        name: 'Ethereum'
      },
      fromAmount: '1000000', // 1 USDC
      minToAmount: '0.0005', // Minimum 0.0005 ETH
      slippageTolerance: 0.5, // 0.5%
      swapProvider: 'uniswap'
    });
    console.log('Swap result:', swapResult.success ? 'Success' : 'Failed');
    
    // Example 3: Batch Transfer
    console.log('\n📦 Example 3: Batch Transfer');
    const batchResult = await sdk.recipes.batchTransfer({
      transfers: [
        {
          to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
          amount: '0.1',
          memo: 'Payment 1'
        },
        {
          to: '0x1234567890123456789012345678901234567890',
          amount: '0.2',
          memo: 'Payment 2'
        },
        {
          to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          amount: '0.15',
          token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
          memo: 'USDC Payment'
        }
      ]
    });
    console.log('Batch transfer result:', batchResult.success ? 'Success' : 'Failed');
    console.log('Transactions processed:', batchResult.transactions.length);
    
    // Example 4: Unshield tokens (private -> public)
    console.log('\n🔓 Example 4: Unshield Tokens');
    const unshieldResult = await sdk.recipes.unshield({
      token: '0x0000000000000000000000000000000000000000', // ETH
      amount: '0.05',
      to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e'
    });
    console.log('Unshield result:', unshieldResult.success ? 'Success' : 'Failed');
    
    // Example 5: Fee Estimation for different recipes
    console.log('\n💰 Example 5: Fee Estimation');
    
    const privateTransferFee = await sdk.recipes.estimateFees('private_transfer', {
      to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
      amount: '1.0'\n    });
    console.log('Private Transfer Fee:', privateTransferFee.estimatedFee, privateTransferFee.currency);
    
    const swapFee = await sdk.recipes.estimateFees('private_swap', {
      fromToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      toToken: '0x0000000000000000000000000000000000000000',
      fromAmount: '1000000'\n    });
    console.log('Private Swap Fee:', swapFee.estimatedFee, swapFee.currency);
    
    const batchFee = await sdk.recipes.estimateFees('batch_transfer', {
      transfers: [\n        { to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e', amount: '0.1' },
        { to: '0x1234567890123456789012345678901234567890', amount: '0.2' }\n      ]
    });
    console.log('Batch Transfer Fee:', batchFee.estimatedFee, batchFee.currency);
    
    // Example 6: Recipe Validation
    console.log('\n✅ Example 6: Recipe Validation');
    
    const validTransfer = sdk.recipes.validate('private_transfer', {
      to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
      amount: '1.0'\n    });
    console.log('Valid transfer:', validTransfer.valid);
    
    const invalidSwap = sdk.recipes.validate('private_swap', {
      fromToken: 'invalid',
      toToken: '0x0000000000000000000000000000000000000000',
      fromAmount: '-1.0' // Invalid negative amount\n    });
    console.log('Invalid swap:', invalidSwap.valid);
    console.log('Validation errors:', invalidSwap.errors.length);
    
    await sdk.destroy();
    console.log('\\n🧹 SDK cleanup completed');
    
  } catch (error) {
    console.error('❌ Error in advanced recipe examples:', error);
  }
}

// Run the example if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  advancedRecipeExamples().catch(console.error);
}

export { advancedRecipeExamples };
