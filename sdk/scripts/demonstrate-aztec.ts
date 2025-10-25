#!/usr/bin/env node

/**
 * Aztec Provider Demonstration Script
 * 
 * This script demonstrates the core functionality of the Aztec provider
 * without requiring actual network connectivity.
 */

import { AztecProvider } from './packages/providers/aztec/aztec-provider';
import { AztecProviderConfig } from './packages/providers/aztec/aztec-provider';

async function demonstrateAztecProvider() {
  console.log('='.repeat(60));
  console.log('Aztec Provider Demonstration');
  console.log('='.repeat(60));
  console.log('');
  
  try {
    // Create provider instance
    console.log('1. Creating Aztec Provider Instance...');
    const provider = new AztecProvider();
    console.log('✓ Provider instance created successfully\n');
    
    // Demonstrate configuration
    console.log('2. Demonstrating Configuration...');
    const config: AztecProviderConfig = {
      type: 'aztec',
      chainId: 11155111, // Sepolia testnet
      networkType: 'testnet',
      rpcUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel'
    };
    
    console.log('Configuration:');
    console.log(`  Type: ${config.type}`);
    console.log(`  Chain ID: ${config.chainId}`);
    console.log(`  Network Type: ${config.networkType}`);
    console.log(`  RPC URL: ${config.rpcUrl}\n`);
    
    // Validate configuration
    console.log('3. Validating Configuration...');
    try {
      provider['validateConfig'](config);
      console.log('✓ Configuration validation passed\n');
    } catch (error) {
      console.log('✗ Configuration validation failed:', (error as Error).message);
      return;
    }
    
    // Get provider information
    console.log('4. Retrieving Provider Information...');
    // Set a mock config to avoid initialization errors
    (provider as any).config = config;
    
    const providerInfo = provider.getProviderInfo();
    console.log(`Provider Name: ${providerInfo.name}`);
    console.log(`Version: ${providerInfo.version}`);
    console.log(`Description: ${providerInfo.description}`);
    console.log(`Website: ${providerInfo.website}`);
    console.log(`Documentation: ${providerInfo.documentation}`);
    console.log(`Supported Chains: ${providerInfo.supportedChains.length}`);
    providerInfo.supportedChains.forEach((chain, index) => {
      console.log(`  ${index + 1}. ${chain.name} (Chain ID: ${chain.chainId})`);
    });
    console.log('');
    
    // Get supported operations
    console.log('5. Listing Supported Operations...');
    const operations = provider.getSupportedOperations();
    console.log(`Total Operations: ${operations.length}`);
    operations.forEach((op, index) => {
      console.log(`  ${index + 1}. ${op.name} - ${op.description}`);
    });
    console.log('');
    
    // Demonstrate capabilities
    console.log('6. Provider Capabilities...');
    const capabilities = providerInfo.capabilities;
    console.log(`Total Capabilities: ${capabilities.length}`);
    capabilities.forEach((cap, index) => {
      console.log(`  ${index + 1}. ${cap.name} - ${cap.description} (${cap.enabled ? 'Enabled' : 'Disabled'})`);
    });
    console.log('');
    
    // Demonstrate error handling
    console.log('7. Demonstrating Error Handling...');
    try {
      // This should fail since we haven't initialized the provider
      await provider.generatePrivateAddress();
    } catch (error) {
      console.log('✓ Error handling working correctly');
      console.log(`  Error message: ${(error as Error).message}\n`);
    }
    
    console.log('='.repeat(60));
    console.log('Demonstration Complete!');
    console.log('='.repeat(60));
    console.log('');
    console.log('Next steps to use the Aztec provider:');
    console.log('1. Initialize the provider with await provider.initialize(config)');
    console.log('2. Generate private addresses with await provider.generatePrivateAddress()');
    console.log('3. Deploy Noir contracts with await provider.deployContract(params)');
    console.log('4. Interact with contracts using await provider.callContract(params)');
    console.log('5. Send private transactions with await provider.sendPrivateTransaction(params)');
    console.log('');
    console.log('For full functionality, you\'ll need:');
    console.log('- Access to an Aztec testnet or devnet');
    console.log('- Properly compiled Noir contract artifacts');
    console.log('- Sufficient funds for transaction fees');
    
  } catch (error) {
    console.error('Demonstration failed:', error);
    process.exit(1);
  }
}

// Run the demonstration
demonstrateAztecProvider().catch(console.error);
