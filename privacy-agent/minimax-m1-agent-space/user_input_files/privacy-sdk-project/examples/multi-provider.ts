/**
 * Multi-Provider Example - Privacy SDK
 * 
 * This example demonstrates how to use multiple privacy providers
 * (Railgun, Mina, Semaphore) within a single application.
 */

import { PrivacySDK, defaultConfigs } from '@privacy-sdk/core';

async function multiProviderExample() {
  console.log('🔗 Privacy SDK - Multi-Provider Example');
  
  // Create SDK with multiple providers
  const sdk = new PrivacySDK(defaultConfigs.multiProvider);
  
  try {
    // Initialize all providers
    console.log('📦 Initializing multi-provider SDK...');
    await sdk.initialize();
    
    console.log('📊 Provider Status:');
    const providers = sdk.listProviders();
    providers.forEach(provider => {
      const status = sdk.getProviderStatus(provider);
      console.log(`- ${provider}: ${status}`);
    });
    
    // Get provider-specific information
    console.log('\n📋 Provider Information:');
    
    // Railgun Provider
    try {
      const railgunProvider = sdk.getProvider('railgun');
      const railgunInfo = railgunProvider.getProviderInfo();
      console.log('\n🚄 Railgun Provider:');
      console.log('- Description:', railgunInfo.description);
      console.log('- Supported Chains:', railgunInfo.supportedChains.map(c => c.name).join(', '));
      console.log('- Capabilities:', railgunInfo.capabilities.map(c => c.name).join(', '));
    } catch (error) {
      console.log('❌ Railgun provider not available:', error.message);
    }
    
    // Mina Provider
    try {
      const minaProvider = sdk.getProvider('mina');
      const minaInfo = minaProvider.getProviderInfo();
      console.log('\n🦎 Mina Provider:');
      console.log('- Description:', minaInfo.description);
      console.log('- Supported Chains:', minaInfo.supportedChains.map(c => c.name).join(', '));
      console.log('- Capabilities:', minaInfo.capabilities.map(c => c.name).join(', '));
    } catch (error) {
      console.log('❌ Mina provider not available:', error.message);
    }
    
    // Semaphore Provider
    try {
      const semaphoreProvider = sdk.getProvider('semaphore');
      const semaphoreInfo = semaphoreProvider.getProviderInfo();
      console.log('\n🌐 Semaphore Provider:');
      console.log('- Description:', semaphoreInfo.description);
      console.log('- Supported Chains:', semaphoreInfo.supportedChains.map(c => c.name).join(', '));
      console.log('- Capabilities:', semaphoreInfo.capabilities.map(c => c.name).join(', '));
    } catch (error) {
      console.log('❌ Semaphore provider not available:', error.message);
    }
    
    // Provider-specific recipes
    console.log('\n🍳 Provider-Specific Recipes:');
    providers.forEach(providerName => {
      const recipes = sdk.recipes.forProvider(providerName);
      console.log(`\n${providerName.toUpperCase()} Recipes:`);
      recipes.forEach(recipe => {
        console.log(`- ${recipe.name}: ${recipe.description}`);
      });
    });
    
    // Example: Cross-provider operations
    console.log('\n🔄 Cross-Provider Operations:');
    
    // 1. Private transfer with Railgun
    console.log('\n💸 Railgun Private Transfer...');
    try {
      const railgunTransfer = await sdk.recipes.execute('private_transfer', {
        provider: 'railgun',
        to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
        amount: '500000000000000000', // 0.5 ETH
        memo: 'Railgun private transfer'
      });
      console.log('✅ Railgun transfer result:', railgunTransfer.success);
    } catch (error) {
      console.log('❌ Railgun transfer failed (expected):', error.message);
    }
    
    // 2. Mina transfer
    console.log('\n🦎 Mina Private Transfer...');
    try {
      const minaTransfer = await sdk.recipes.execute('private_transfer', {
        provider: 'mina',
        to: 'B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e',
        amount: '1000000000', // 1 MINA
        memo: 'Mina private transfer'
      });
      console.log('✅ Mina transfer result:', minaTransfer.success);
    } catch (error) {
      console.log('❌ Mina transfer failed (expected):', error.message);
    }
    
    // 3. Anonymous voting with Semaphore
    console.log('\n🗳️ Anonymous Voting...');
    try {
      const vote = await sdk.recipes.anonymousVote({
        groupId: '1',
        signal: 'option_1'
      });
      console.log('✅ Vote result:', vote.success);
    } catch (error) {
      console.log('❌ Vote failed (expected):', error.message);
    }
    
    // Provider switching example
    console.log('\n🔄 Provider Switching:');
    console.log('Current default provider:', sdk.getConfig().defaultProvider);
    
    // Switch to Mina as default
    sdk.updateConfig({ defaultProvider: 'mina' });
    console.log('New default provider:', sdk.getConfig().defaultProvider);
    
    // Fee comparison across providers
    console.log('\n💰 Fee Comparison:');
    const transferParams = {
      to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
      amount: '1000000000000000000'
    };
    
    const privateTransferRecipe = sdk.recipes.list().find(r => r.name === 'private_transfer');
    if (privateTransferRecipe) {
      for (const provider of privateTransferRecipe.supportedProviders) {
        try {
          const estimate = await privateTransferRecipe.estimateFees({
            ...transferParams,
            provider
          });
          console.log(`- ${provider}: ${estimate.estimatedFee} ${estimate.currency} (${estimate.confidence})`);
        } catch (error) {
          console.log(`- ${provider}: estimation failed`);
        }
      }
    }
    
    console.log('\n✅ Multi-provider example completed');
    
  } catch (error) {
    console.error('❌ Error in multi-provider example:', error);
  } finally {
    await sdk.destroy();
    console.log('🧹 SDK cleanup completed');
  }
}

// Run the example
if (require.main === module) {
  multiProviderExample().catch(console.error);
}

export { multiProviderExample };