/**
 * Basic Usage Example - Privacy SDK
 * 
 * This example demonstrates how to set up and use the Privacy SDK
 * for basic private transactions.
 */

import { PrivacySDK, createPrivacySDK, defaultConfigs } from '@privacy-sdk/core';

async function basicUsageExample() {
  console.log('🚀 Privacy SDK - Basic Usage Example');
  
  // Method 1: Create SDK with helper function
  const sdk = createPrivacySDK({
    provider: 'railgun',
    chainId: 1
  });
  
  // Method 2: Create SDK with full configuration
  const advancedSDK = new PrivacySDK(defaultConfigs.multiProvider);
  
  try {
    // Initialize the SDK
    console.log('📦 Initializing SDK...');
    await sdk.initialize();
    console.log('✅ SDK initialized successfully');
    
    // Check SDK status
    console.log('📊 SDK Status:');
    console.log('- Ready:', sdk.isReady());
    console.log('- Providers:', sdk.listProviders());
    console.log('- Default Provider:', sdk.getConfig().defaultProvider);
    
    // List available recipes
    console.log('\n🍳 Available Recipes:');
    const recipes = sdk.recipes.list();
    recipes.forEach(recipe => {
      console.log(`- ${recipe.name}: ${recipe.description}`);
      console.log(`  Supported providers: ${recipe.supportedProviders.join(', ')}`);
    });
    
    // Example: Private Transfer
    console.log('\n💸 Executing Private Transfer...');
    try {
      const transferResult = await sdk.recipes.privateTransfer({
        to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
        amount: '1000000000000000000', // 1 ETH in wei
        memo: 'Private transfer example'
      });
      console.log('✅ Transfer completed:', transferResult.success);
      console.log('📝 Transaction hash:', transferResult.transactions[0]?.hash);
    } catch (error) {
      console.log('❌ Transfer failed (expected in demo):', error.message);
    }
    
    // Example: Fee Estimation
    console.log('\n💰 Estimating fees...');
    const privateTransferRecipe = sdk.recipes.list().find(r => r.name === 'private_transfer');
    if (privateTransferRecipe) {
      const feeEstimate = await privateTransferRecipe.estimateFees({
        provider: 'railgun',
        to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
        amount: '1000000000000000000'
      });
      console.log('💰 Estimated fee:', feeEstimate.estimatedFee, feeEstimate.currency);
      console.log('🎯 Confidence:', feeEstimate.confidence);
    }
    
    // Event handling
    console.log('\n📡 Setting up event listeners...');
    sdk.on('initialized', (data) => {
      console.log('🎉 Provider initialized:', data.provider);
    });
    
    sdk.on('transaction_pending', (data) => {
      console.log('⏳ Transaction pending:', data.transactionHash);
    });
    
    sdk.on('transaction_confirmed', (data) => {
      console.log('✅ Transaction confirmed:', data.transactionHash);
    });
    
    console.log('✅ Example completed successfully');
    
  } catch (error) {
    console.error('❌ Error in basic usage example:', error);
  } finally {
    // Clean up
    await sdk.destroy();
    console.log('🧹 SDK cleanup completed');
  }
}

// Run the example
if (require.main === module) {
  basicUsageExample().catch(console.error);
}

export { basicUsageExample };