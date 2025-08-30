/**
 * Advanced Example: Using the Recipe→Step→ComboMeal pattern with Railgun
 * 
 * This example demonstrates advanced usage of the zkSDK recipes system with Railgun
 * including error handling, gas optimization, and complex multi-step operations.
 */

import { RailgunProvider } from '../packages/providers/railgun/src/index';
import { 
  RailgunPrivateTransferRecipe,
  RailgunBatchTransferRecipe,
  RailgunPrivacyOperationsComboMeal
} from '../packages/recipes/src/index';

async function advancedExample() {
  console.log('=== Advanced Railgun Recipe→Step→ComboMeal Pattern Example ===\n');

  // Initialize Railgun provider with advanced configuration
  const railgunProvider = new RailgunProvider();

  try {
    // Initialize the provider with real configuration
    await railgunProvider.initialize({
      rpcEndpoints: {
        ethereum: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
        polygon: 'https://polygon-rpc.com',
        arbitrum: 'https://arb1.arbitrum.io/rpc'
      },
      engineDbPath: './railgun-db',
      walletMnemonic: process.env.RAILGUN_MNEMONIC // In production, use secure storage
    });
    
    console.log('✓ Railgun provider initialized with advanced configuration');

    // Example 1: Complex Private Transfer with Gas Optimization
    console.log('\n1. Executing Complex Private Transfer with Gas Optimization...');
    
    const privateTransferRecipe = new RailgunPrivateTransferRecipe(railgunProvider);
    
    const privateTransferInput = {
      network: 'ethereum',
      walletAddress: '0x1234567890123456789012345678901234567890',
      transferParams: {
        token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        amount: '1000000', // 1 USDC
        to: '0xabcdef123456789012345678901234567890abcdef'
      },
      memo: 'Private payment for services with gas optimization'
    };

    // Estimate gas before execution
    const gasEstimate = await privateTransferRecipe.estimateGas(privateTransferInput);
    console.log(`  Estimated gas usage: ${gasEstimate} gas units`);
    
    // Execute the transfer
    const privateTransferResult = await privateTransferRecipe.execute(privateTransferInput);
    console.log('✓ Private transfer executed successfully');
    console.log(`  Transaction hash: ${privateTransferResult.result.transactionHash}`);
    console.log(`  Status: ${privateTransferResult.result.status}`);
    console.log(`  Fee: ${privateTransferResult.result.fee} ETH`);
    console.log(`  Actual gas used: ${privateTransferResult.totalGasUsed} gas units`);

    // Example 2: Batch Transfer with Error Handling
    console.log('\n2. Executing Batch Transfer with Error Handling...');
    
    const batchTransferRecipe = new RailgunBatchTransferRecipe(railgunProvider);
    
    const batchTransferInput = {
      network: 'polygon',
      walletAddress: '0x1234567890123456789012345678901234567890',
      transfers: [
        {
          token: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC.e on Polygon
          amount: '1000000', // 1 USDC
          to: '0xabcdef123456789012345678901234567890abcdef'
        },
        {
          token: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT on Polygon
          amount: '2000000', // 2 USDT
          to: '0xfedcba0987654321fedcba0987654321fedcba09'
        },
        {
          token: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI on Polygon
          amount: '5000000000000000000', // 5 DAI
          to: '0x1234567890abcdef1234567890abcdef12345678'
        }
      ],
      memo: 'Monthly payments batch with error handling'
    };

    try {
      const batchTransferResult = await batchTransferRecipe.execute(batchTransferInput);
      console.log('✓ Batch transfer executed successfully');
      console.log(`  Number of transfers: ${batchTransferResult.result.length}`);
      console.log(`  Total fee: ${batchTransferResult.result.reduce((sum, tx) => sum + parseFloat(tx.fee || '0'), 0)} ETH`);
      
      // Check for any errors in individual transfers
      if (batchTransferResult.errors && batchTransferResult.errors.length > 0) {
        console.log(`  ⚠️  ${batchTransferResult.errors.length} transfers had errors:`);
        batchTransferResult.errors.forEach((error, index) => {
          console.log(`    ${index + 1}. ${error.message}`);
        });
      }
    } catch (error) {
      console.log(`  ❌ Batch transfer failed: ${error.message}`);
      // In a real application, you might want to retry or handle specific errors
    }

    // Example 3: Complex ComboMeal with Parallel Execution
    console.log('\n3. Executing Complex Privacy Operations ComboMeal...');
    
    const comboMeal = new RailgunPrivacyOperationsComboMeal(railgunProvider);
    
    // Configure for parallel execution
    comboMeal.config.parallelExecution = true;
    
    const comboMealInput = {
      network: 'arbitrum',
      walletAddress: '0x1234567890123456789012345678901234567890',
      operations: [
        {
          type: 'privateTransfer' as const,
          params: {
            token: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // USDC on Arbitrum
            amount: '5000000', // 5 USDC
            to: '0xabcdef123456789012345678901234567890abcdef'
          }
        },
        {
          type: 'batchTransfer' as const,
          params: {
            transfers: [
              {
                token: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT on Arbitrum
                amount: '10000000', // 10 USDT
                to: '0xfedcba0987654321fedcba0987654321fedcba09'
              },
              {
                token: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI on Arbitrum
                amount: '15000000000000000000', // 15 DAI
                to: '0x1234567890abcdef1234567890abcdef12345678'
              }
            ]
          }
        }
      ]
    };

    // Estimate gas for the entire combo meal
    const comboMealGasEstimate = await comboMeal.estimateGas(comboMealInput);
    console.log(`  Estimated gas for combo meal: ${comboMealGasEstimate} gas units`);

    const comboMealResult = await comboMeal.execute(comboMealInput);
    console.log('✓ ComboMeal executed successfully with parallel execution');
    console.log(`  Number of operations: ${comboMealResult.recipeOutputs.length}`);
    console.log(`  First operation: ${comboMealResult.recipeOutputs[0].name}`);
    console.log(`  Second operation: ${comboMealResult.recipeOutputs[1].name}`);
    
    // Check for any errors
    if (comboMealResult.errors && comboMealResult.errors.length > 0) {
      console.log(`  ⚠️  ${comboMealResult.errors.length} operations had errors:`);
      comboMealResult.errors.forEach((error, index) => {
        console.log(`    ${index + 1}. ${error.message}`);
      });
    }

    // Example 4: Advanced Gas Optimization Strategies
    console.log('\n4. Demonstrating Advanced Gas Optimization...');
    
    // Create a custom recipe with gas optimization
    class GasOptimizedBatchTransferRecipe extends RailgunBatchTransferRecipe {
      async estimateGas(input: any): Promise<number> {
        // More sophisticated gas estimation
        const baseGas = await super.estimateGas(input);
        
        // Apply optimizations based on network conditions
        const networkMultiplier = this.getNetworkGasMultiplier(input.network);
        const optimizationFactor = this.config.enableGasOptimization ? 0.9 : 1.0;
        
        return Math.round(baseGas * networkMultiplier * optimizationFactor);
      }
      
      private getNetworkGasMultiplier(network: string): number {
        // Different multipliers for different networks
        const multipliers: Record<string, number> = {
          'ethereum': 1.2,
          'polygon': 0.8,
          'arbitrum': 0.9
        };
        
        return multipliers[network] || 1.0;
      }
    }
    
    const optimizedRecipe = new GasOptimizedBatchTransferRecipe(railgunProvider);
    const optimizedGasEstimate = await optimizedRecipe.estimateGas(batchTransferInput);
    console.log(`  Optimized gas estimate: ${optimizedGasEstimate} gas units`);
    console.log(`  Gas savings: ${Math.round((1 - optimizedGasEstimate / (optimizedGasEstimate / 0.9)) * 100)}%`);

    console.log('\n=== Advanced Example Completed Successfully ===');

  } catch (error) {
    console.error('❌ Error executing advanced recipes:', error);
  }
}

// Run the advanced example
if (require.main === module) {
  advancedExample().catch(console.error);
}

export { advancedExample };
