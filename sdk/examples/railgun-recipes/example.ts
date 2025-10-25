/**
 * Example: Using the Recipe→Step→ComboMeal pattern with Railgun
 * 
 * This example demonstrates how to use the zkSDK recipes system with Railgun
 * to execute private transactions following the Recipe→Step→ComboMeal pattern.
 */

import { RailgunProvider } from '../packages/providers/railgun/src/index';
import { 
  RailgunPrivateTransferRecipe,
  RailgunBatchTransferRecipe,
  RailgunPrivacyOperationsComboMeal
} from '../packages/recipes/src/index';

async function main() {
  console.log('=== Railgun Recipe→Step→ComboMeal Pattern Example ===\n');

  // Initialize Railgun provider
  const railgunProvider = new RailgunProvider({
    rpcEndpoints: {
      ethereum: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
      polygon: 'https://polygon-rpc.com',
      arbitrum: 'https://arb1.arbitrum.io/rpc'
    }
  });

  try {
    // Initialize the provider (in a real app, you'd provide actual credentials)
    await railgunProvider.initialize({
      rpcEndpoints: {
        ethereum: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY'
      }
    });
    console.log('✓ Railgun provider initialized');

    // Example 1: Simple Private Transfer Recipe
    console.log('\n1. Executing Private Transfer Recipe...');
    
    const privateTransferRecipe = new RailgunPrivateTransferRecipe(railgunProvider);
    
    const privateTransferInput = {
      network: 'ethereum',
      walletAddress: '0x1234567890123456789012345678901234567890',
      transferParams: {
        token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        amount: '1000000', // 1 USDC
        to: '0xabcdef123456789012345678901234567890abcdef'
      },
      memo: 'Private payment for services'
    };

    const privateTransferResult = await privateTransferRecipe.execute(privateTransferInput);
    console.log('✓ Private transfer executed successfully');
    console.log(`  Transaction hash: ${privateTransferResult.result.transactionHash}`);
    console.log(`  Status: ${privateTransferResult.result.status}`);
    console.log(`  Fee: ${privateTransferResult.result.fee} ETH`);

    // Example 2: Batch Transfer Recipe
    console.log('\n2. Executing Batch Transfer Recipe...');
    
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
      memo: 'Monthly payments batch'
    };

    const batchTransferResult = await batchTransferRecipe.execute(batchTransferInput);
    console.log('✓ Batch transfer executed successfully');
    console.log(`  Number of transfers: ${batchTransferResult.result.length}`);
    console.log(`  Total fee: ${batchTransferResult.result.reduce((sum, tx) => sum + parseFloat(tx.fee || '0'), 0)} ETH`);

    // Example 3: ComboMeal with Multiple Operations
    console.log('\n3. Executing Privacy Operations ComboMeal...');
    
    const comboMeal = new RailgunPrivacyOperationsComboMeal(railgunProvider);
    
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

    const comboMealResult = await comboMeal.execute(comboMealInput);
    console.log('✓ ComboMeal executed successfully');
    console.log(`  Number of operations: ${comboMealResult.recipeOutputs.length}`);
    console.log(`  First operation: ${comboMealResult.recipeOutputs[0].name}`);
    console.log(`  Second operation: ${comboMealResult.recipeOutputs[1].name}`);

    // Example 4: Gas Estimation
    console.log('\n4. Estimating Gas Usage...');
    
    const privateTransferGasEstimate = await privateTransferRecipe.estimateGas(privateTransferInput);
    console.log(`  Private transfer gas estimate: ${privateTransferGasEstimate} gas`);

    const batchTransferGasEstimate = await batchTransferRecipe.estimateGas(batchTransferInput);
    console.log(`  Batch transfer gas estimate: ${batchTransferGasEstimate} gas`);

    const comboMealGasEstimate = await comboMeal.estimateGas(comboMealInput);
    console.log(`  ComboMeal gas estimate: ${comboMealGasEstimate} gas`);

    console.log('\n=== Example Completed Successfully ===');

  } catch (error) {
    console.error('❌ Error executing recipes:', error);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

export { main };
