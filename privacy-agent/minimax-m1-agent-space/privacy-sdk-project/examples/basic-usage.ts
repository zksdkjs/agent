/**
 * Basic Usage Example - Privacy SDK
 * 
 * This example demonstrates how to set up and use the Privacy SDK
 * for basic private transactions.
 */

import { PrivacySDK, createPrivacySDK, defaultConfigs } from '../packages/sdk/dist/index.js';

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
      console.log('❌ Transfer failed:', error.message);
    }
    
    // Example: Fee Estimation
    console.log('\n💰 Estimating fees...');
    try {
      const feeEstimate = await sdk.recipes.estimateFees('private_transfer', {
        to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
        amount: '1000000000000000000'
      });
      console.log('💰 Estimated fee:', feeEstimate.estimatedFee, feeEstimate.currency);
      console.log('🎯 Confidence:', feeEstimate.confidence);
    } catch (error) {
      console.log('❌ Fee estimation failed:', error.message);
    }
    
    // Event handling
    console.log('\n📡 Setting up event listeners...');
    sdk.on('transaction_pending', (data) => {
      console.log('⏳ Transaction pending:', data.transactionHash);
    });
    
    sdk.on('transaction_confirmed', (data) => {
      console.log('✅ Transaction confirmed:', data.transactionHash);
    });
    
    // Try Aztec provider
    console.log('\n🔄 Switching to Aztec provider...');
    try {
      // Add Aztec provider if using the simple SDK
      if (!sdk.getProvider('aztec')) {
        await sdk.addProvider('aztec', {
          type: 'aztec',
          chainId: 1,
          networkType: 'mainnet'
        });
        console.log('✅ Aztec provider added');
      }
      
      // Set as default
      sdk.setDefaultProvider('aztec');
      console.log('✅ Default provider changed to:', sdk.getConfig().defaultProvider);
      
      // Try a transfer with Aztec
      const aztecResult = await sdk.recipes.privateTransfer({
        to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
        amount: '2000000000000000000', // 2 ETH in wei
        memo: 'Private transfer with Aztec'
      });
      console.log('✅ Aztec transfer completed:', aztecResult.success);
      console.log('📝 Transaction hash:', aztecResult.transactions[0]?.hash);
    } catch (error) {
      console.log('❌ Aztec operations failed:', error.message);
    }
    
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
if (typeof require !== 'undefined' && require.main === module) {
  basicUsageExample().catch(console.error);
}

export { basicUsageExample };