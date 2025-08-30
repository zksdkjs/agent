// Example usage of the Aztec provider with zkSDK

import { PrivacySDK } from '../../core/src/index.js';
import { AztecProviderConfig } from './aztec-provider.js';

async function example() {
  try {
    // Initialize the SDK
    const sdk = new PrivacySDK();
    
    // Configure Aztec provider
    const aztecConfig: AztecProviderConfig = {
      type: 'aztec',
      chainId: 11155111, // Sepolia testnet
      networkType: 'testnet',
      rpcUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel'
    };
    
    // Register and initialize the Aztec provider
    const provider = await sdk.registerProvider('aztec', aztecConfig);
    
    console.log('Aztec provider registered successfully');
    
    // Generate a new private address
    const addressInfo = await provider.generatePrivateAddress();
    console.log('Generated new Aztec address:', addressInfo.address);
    
    // Get provider info
    const providerInfo = provider.getProviderInfo();
    console.log('Provider info:', providerInfo);
    
    // Get supported operations
    const operations = provider.getSupportedOperations();
    console.log('Supported operations:', operations.map(op => op.name));
    
    console.log('Aztec integration example completed successfully');
  } catch (error) {
    console.error('Error in Aztec integration example:', error);
  }
}

// Run the example
example().catch(console.error);
