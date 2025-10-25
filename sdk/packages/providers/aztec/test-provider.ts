// Test script for Aztec provider

import { AztecProvider } from './aztec-provider.js';

async function testAztecProvider() {
  try {
    console.log('Testing Aztec provider...');
    
    // Create a new Aztec provider instance
    const provider = new AztecProvider();
    
    // Test provider info
    console.log('Provider name:', provider.name);
    console.log('Provider version:', provider.version);
    
    // Test supported operations
    const operations = provider.getSupportedOperations();
    console.log('Supported operations:', operations.map(op => op.name));
    
    // Test provider info
    const providerInfo = provider.getProviderInfo();
    console.log('Provider info:', providerInfo);
    
    console.log('Aztec provider test completed successfully');
  } catch (error) {
    console.error('Error testing Aztec provider:', error);
  }
}

// Run the test
testAztecProvider().catch(console.error);
