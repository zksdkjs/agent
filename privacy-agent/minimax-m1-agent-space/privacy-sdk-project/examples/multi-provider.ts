/**
 * Multi-Provider Example - Privacy SDK
 * 
 * This example demonstrates how to use multiple privacy providers
 * with the Privacy SDK.
 */

import { PrivacySDK, createPrivacySDK, defaultConfigs } from '@privacy-sdk/core';

async function multiProviderExample() {
  console.log('🚀 Privacy SDK - Multi-Provider Example');
  
  // Create SDK with both Railgun and Aztec providers
  const sdk = new PrivacySDK({
    defaultProvider: 'railgun',
    providers: {
      railgun: {
        type: 'railgun',
        chainId: 1,
        networkType: 'mainnet',
        useRelayer: true
      },
      aztec: {
        type: 'aztec',
        chainId: 1,
        networkType: 'mainnet'
      }
    }
  });
  
  try {
    // Initialize the SDK
    console.log('📦 Initializing SDK...');
    await sdk.initialize();
    console.log('✅ SDK initialized successfully');
    
    // Check SDK status
    console.log('📊 SDK Status:');
    console.log('- Ready:', sdk.isReady());
    console.log('- Available Providers:', sdk.listProviders());
    console.log('- Default Provider:', sdk.getConfig().defaultProvider);
    
    // Execute a private transfer with Railgun (default provider)
    console.log('\n💸 Executing Private Transfer with Railgun (default)...');
    try {
      const railgunResult = await sdk.recipes.privateTransfer({
        to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
        amount: '1000000000000000000', // 1 ETH in wei
        memo: 'Private transfer using Railgun'
      });
      console.log('✅ Railgun Transfer completed:', railgunResult.success);
      console.log('📝 Transaction hash:', railgunResult.transactions[0]?.hash);
    } catch (error) {
      console.log('❌ Railgun Transfer error:', error.message);
    }
    
    // Execute a private transfer with Aztec (explicitly specified)
    console.log('\n💸 Executing Private Transfer with Aztec...');
    try {
      const aztecResult = await sdk.recipes.privateTransfer({
        provider: 'aztec', // Explicitly use Aztec
        to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
        amount: '2000000000000000000', // 2 ETH in wei
        memo: 'Private transfer using Aztec'
      });
      console.log('✅ Aztec Transfer completed:', aztecResult.success);
      console.log('📝 Transaction hash:', aztecResult.transactions[0]?.hash);
    } catch (error) {
      console.log('❌ Aztec Transfer error:', error.message);
    }
    
    // Demonstrate switching default provider
    console.log('\n🔄 Switching default provider to Aztec...');
    sdk.setDefaultProvider('aztec');
    console.log('✅ New default provider:', sdk.getConfig().defaultProvider);
    
    // Another transfer, now using Aztec as default
    console.log('\n💸 Executing Private Transfer with new default (Aztec)...');
    try {
      const newDefaultResult = await sdk.recipes.privateTransfer({
        to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
        amount: '500000000000000000', // 0.5 ETH in wei
        memo: 'Private transfer using new default'
      });
      console.log('✅ Transfer completed with provider:', newDefaultResult.transactions[0]?.provider);
      console.log('📝 Transaction hash:', newDefaultResult.transactions[0]?.hash);
    } catch (error) {
      console.log('❌ Transfer error:', error.message);
    }
    
    console.log('\n✅ Multi-provider example completed successfully');
    
  } catch (error) {
    console.error('❌ Error in multi-provider example:', error);
  } finally {
    // Clean up
    await sdk.destroy();
    console.log('🧹 SDK cleanup completed');
  }
}

// Function to add/remove a provider dynamically
async function dynamicProviderManagementExample() {
  console.log('\n🔄 Dynamic Provider Management Example');
  
  // Start with just Railgun
  const sdk = createPrivacySDK({
    provider: 'railgun',
    chainId: 1
  });
  
  try {
    await sdk.initialize();
    console.log('✅ SDK initialized with Railgun only');
    console.log('📊 Available providers:', sdk.listProviders());
    
    // Add Aztec provider dynamically
    console.log('\n➕ Adding Aztec provider dynamically...');
    await sdk.addProvider('aztec', {
      type: 'aztec',
      chainId: 1,
      networkType: 'mainnet'
    });
    
    console.log('✅ Aztec added successfully');
    console.log('📊 Updated provider list:', sdk.listProviders());
    
    // Remove a provider
    console.log('\n➖ Removing a provider...');
    await sdk.removeProvider('aztec');
    
    console.log('✅ Provider removed successfully');
    console.log('📊 Final provider list:', sdk.listProviders());
    
  } catch (error) {
    console.error('❌ Error in dynamic provider example:', error);
  } finally {
    await sdk.destroy();
  }
}

// Run the examples
if (require.main === module) {
  (async () => {
    await multiProviderExample();
    await dynamicProviderManagementExample();
  })().catch(console.error);
}

export { multiProviderExample, dynamicProviderManagementExample };