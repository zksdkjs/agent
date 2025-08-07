/**
 * Railgun SDK Integration Example - Privacy SDK
 * 
 * This example demonstrates how to use the Privacy SDK with real Railgun SDK integration.
 * Note: This requires real API keys and blockchain connections to run.
 */

import { createPrivacySDK } from '../packages/sdk/dist/index.js';

// Configuration with environment variables
const RPC_URL = process.env.RPC_URL || 'https://goerli.infura.io/v3/YOUR_INFURA_KEY';
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '5'); // Default to Goerli testnet
const NETWORK_TYPE = process.env.NETWORK_TYPE || 'testnet';
const WALLET_SOURCE = process.env.WALLET_SOURCE || 'privacy-sdk-test';
const WALLET_ID = process.env.WALLET_ID;
const WALLET_PASSWORD = process.env.WALLET_PASSWORD;

async function railgunIntegrationExample() {
  console.log('🚀 Privacy SDK - Railgun Integration Example');
  
  if (!WALLET_ID || !WALLET_PASSWORD) {
    console.error('❌ Wallet ID and password are required. Please set WALLET_ID and WALLET_PASSWORD environment variables.');
    return;
  }
  
  try {
    // Create SDK with real Railgun provider
    console.log('📦 Creating SDK with Railgun provider...');
    console.log(`   Chain ID: ${CHAIN_ID}, Network: ${NETWORK_TYPE}`);
    console.log(`   RPC URL: ${RPC_URL.substring(0, 20)}...`);
    
    const sdk = createPrivacySDK({
      provider: 'railgun',
      chainId: CHAIN_ID,
      networkType: NETWORK_TYPE as any,
      rpcURL: RPC_URL,
      walletSource: WALLET_SOURCE,
      walletId: WALLET_ID,
      walletPassword: WALLET_PASSWORD
    });
    
    // Initialize the SDK
    console.log('📦 Initializing SDK...');
    await sdk.initialize();
    console.log('✅ SDK initialized successfully');
    
    // Check SDK status
    console.log('📊 SDK Status:');
    console.log('- Ready:', sdk.isReady());
    console.log('- Default Provider:', sdk.getConfig().defaultProvider);
    
    // Get balances
    console.log('\n💰 Getting private balances...');
    try {
      const balances = await sdk.getDefaultProvider().getPrivateBalance({});
      console.log('✅ Balances retrieved:', balances.balances.length);
      
      balances.balances.forEach(balance => {
        console.log(`   ${balance.balance} ${balance.token.symbol}`);
      });
    } catch (error) {
      console.error('❌ Error getting balances:', error);
    }
    
    // Generate a new private address
    console.log('\n🔑 Generating a new private address...');
    try {
      const addressInfo = await sdk.getDefaultProvider().generatePrivateAddress();
      console.log('✅ New address generated:', addressInfo.address);
    } catch (error) {
      console.error('❌ Error generating address:', error);
    }
    
    // Clean up
    await sdk.destroy();
    console.log('\n🧹 SDK cleanup completed');
    
  } catch (error) {
    console.error('❌ Error in Railgun integration example:', error);
  }
}

// Run the example if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  railgunIntegrationExample().catch(console.error);
}

export { railgunIntegrationExample };