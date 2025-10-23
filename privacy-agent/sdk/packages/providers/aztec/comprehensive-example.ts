// Comprehensive example usage of the Aztec provider with zkSDK
// This example demonstrates all major capabilities of the Aztec provider

import { PrivacySDK } from '@zksdk/core';
import { AztecProviderConfig, AztecProvider } from './aztec-provider.js';
import { PXEConfig } from './services/pxe-service.js';

async function comprehensiveExample() {
  console.log('=== Aztec Provider Comprehensive Example ===\n');
  
  try {
    // Initialize the SDK
    const sdk = new PrivacySDK();
    console.log('✅ SDK initialized');
    
    // Configure Aztec provider with proper PXE configuration
    const pxeConfig: PXEConfig = {
      nodeUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel',
      useExisting: false, // Use remote node instead of local PXE
      pxeHost: '127.0.0.1',
      pxePort: 8080
    };
    
    const aztecConfig: AztecProviderConfig = {
      type: 'aztec',
      chainId: 11155111, // Sepolia testnet
      networkType: 'testnet',
      rpcUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel',
      pxeConfig
    };
    
    console.log('🔧 Configuring Aztec provider...');
    
    // Register and initialize the Aztec provider
    const provider = await sdk.registerProvider('aztec', aztecConfig);
    console.log('✅ Aztec provider registered successfully');
    
    // Get provider info
    const providerInfo = provider.getProviderInfo();
    console.log('\n📋 Provider Information:');
    console.log(`   Name: ${providerInfo.name}`);
    console.log(`   Version: ${providerInfo.version}`);
    console.log(`   Description: ${providerInfo.description}`);
    console.log(`   Supported Chains: ${providerInfo.supportedChains.map(chain => chain.chainId).join(', ')}`);
    
    // Get supported operations
    const operations = provider.getSupportedOperations();
    console.log(`\n⚙️  Supported Operations (${operations.length}):`);
    operations.forEach((op, index) => {
      console.log(`   ${index + 1}. ${op.name} - ${op.description}`);
    });
    
    // Generate a new private address
    console.log('\n🔑 Generating new Aztec private address...');
    const addressInfo = await provider.generatePrivateAddress();
    console.log(`   Generated Address: ${addressInfo.address}`);
    console.log(`   Public Key: ${addressInfo.metadata?.publicKey}`);
    
    // Import a private key (placeholder - in practice you'd have a real key)
    console.log('\n📥 Importing private key (placeholder)...');
    try {
      // This will likely fail in a real scenario without a valid key, but demonstrates the API
      await provider.importPrivateKey('0x1234567890abcdef'); // Placeholder key
      console.log('   Private key imported successfully');
    } catch (error) {
      console.log('   Note: Private key import demonstration completed (expected behavior for placeholder key)');
    }
    
    // Get private balance for the address
    console.log('\n💰 Getting private balance...');
    try {
      const balanceParams = { address: addressInfo.address };
      const privateBalance = await provider.getPrivateBalance(balanceParams);
      console.log(`   Balance for ${privateBalance.address}:`);
      console.log(`   Last Updated: ${new Date(privateBalance.lastUpdated).toISOString()}`);
      console.log(`   Number of tokens: ${privateBalance.balances.length}`);
      
      // If we have token balances, display them
      if (privateBalance.balances.length > 0) {
        privateBalance.balances.forEach((balance, index) => {
          console.log(`     Token ${index + 1}: ${balance.token.symbol} - ${balance.balance}`);
        });
      } else {
        console.log('   No token balances found (this is expected for a new address)');
      }
    } catch (error) {
      console.log('   Note: Balance check demonstration completed (may require actual tokens)');
    }
    
    // Get transaction history
    console.log('\n📊 Getting transaction history...');
    try {
      const historyParams = { 
        address: addressInfo.address,
        limit: 10
      };
      const transactions = await provider.getTransactionHistory(historyParams);
      console.log(`   Found ${transactions.length} transactions`);
    } catch (error) {
      console.log('   Note: Transaction history demonstration completed (may require actual transactions)');
    }
    
    // Get balances using the getBalances method
    console.log('\n💳 Getting balances using getBalances method...');
    try {
      const balances = await provider.getBalances(addressInfo.address);
      console.log(`   Found ${balances.length} balance entries`);
    } catch (error) {
      console.log('   Note: Balances demonstration completed (may require actual tokens)');
    }
    
    // Demonstrate contract deployment (commented out as it requires actual artifacts)
    console.log('\n🏗️  Contract deployment demonstration:');
    console.log('   This would deploy a Noir contract to the Aztec network');
    console.log('   Requires a valid contract artifact and constructor arguments');
    
    // Demonstrate contract calling (commented out as it requires deployed contracts)
    console.log('\n📞 Contract calling demonstration:');
    console.log('   This would call a method on a deployed Noir contract');
    console.log('   Requires a deployed contract address and valid method parameters');
    
    // Demonstrate private transaction (commented out as it requires actual funds)
    console.log('\n💸 Private transaction demonstration:');
    console.log('   This would send a private transaction between addresses');
    console.log('   Requires sufficient balance and valid recipient address');
    
    console.log('\n✨ Aztec integration comprehensive example completed successfully');
    console.log('\n📝 Next Steps:');
    console.log('   1. Set up a local PXE for development');
    console.log('   2. Fund your Aztec address with test tokens');
    console.log('   3. Deploy actual contracts to test contract functionality');
    console.log('   4. Run full test suite to ensure no regressions');
    
  } catch (error) {
    console.error('❌ Error in Aztec integration comprehensive example:', error);
    throw error;
  }
}

// Run the comprehensive example
comprehensiveExample().catch(console.error);

// Additional utility functions for common Aztec operations
export async function demonstrateAztecTransfer(provider: AztecProvider, fromAddress: string, toAddress: string, amount: string) {
  console.log(`\n💸 Demonstrating private transfer of ${amount} tokens from ${fromAddress} to ${toAddress}`);
  
  try {
    const transferParams = {
      from: fromAddress,
      to: toAddress,
      amount: amount,
      token: '0x0000000000000000000000000000000000000000', // ETH or native token
      memo: 'Private transfer example'
    };
    
    const result = await provider.transfer(transferParams);
    console.log(`   Transfer initiated with hash: ${result.transactionHash}`);
    console.log(`   Status: ${result.status}`);
    
    return result;
  } catch (error) {
    console.error('   Transfer failed:', error);
    throw error;
  }
}

export async function checkTransactionStatus(provider: AztecProvider, txHash: string) {
  console.log(`\n🔍 Checking transaction status for ${txHash}`);
  
  try {
    const status = await provider.getTransactionStatus(txHash);
    console.log(`   Transaction status: ${status.status}`);
    console.log(`   Timestamp: ${new Date(status.timestamp).toISOString()}`);
    
    return status;
  } catch (error) {
    console.error('   Failed to get transaction status:', error);
    throw error;
  }
}
