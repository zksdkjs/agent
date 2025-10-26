/**
 * Example demonstrating the auto provider functionality in zkSDK
 * This example shows how to use the AutoPrivacyProvider to automatically
 * detect and connect to the best available privacy provider.
 */

import { AutoPrivacyProvider, ZkWalletConnect } from '@zksdk/wallet-connect';

async function demonstrateAutoProvider() {
  console.log('=== zkSDK Auto Provider Demo ===\n');
  
  // Example 1: Using AutoPrivacyProvider directly
  console.log('1. Using AutoPrivacyProvider directly:');
  
  const autoProvider = new AutoPrivacyProvider({
    providers: {
      railgun: { 
        apiKey: 'your-railgun-api-key',
        rpcEndpoints: {
          ethereum: 'https://eth.llamarpc.com'
        }
      },
      aztec: { 
        apiKey: 'your-aztec-api-key',
        pxeUrl: 'https://aztec-connect.dev'
      }
    },
    defaultProvider: 'railgun'
  });
  
  try {
    // Initialize the auto provider (this will automatically connect to the best available provider)
    await autoProvider.initialize({});
    console.log('   ✓ Auto provider initialized successfully');
    
    // Execute a private transfer
    const transferResult = await autoProvider.transfer({
      chain: 'ethereum',
      token: 'ETH',
      amount: '1000000000000000000', // 1 ETH in wei
      to: '0xRecipientAddress',
      privacy: 'anonymous'
    });
    
    console.log('   ✓ Transfer executed successfully');
    console.log('   Transaction Hash:', transferResult.transactionHash);
    console.log('   Status:', transferResult.status);
    
  } catch (error) {
    console.error('   ✗ Error with auto provider:', error.message);
  }
  
  console.log('\n2. Using ZkWalletConnect with auto detection:');
  
  const walletConnect = new ZkWalletConnect({
    autoDetect: true,
    providers: {
      railgun: { 
        apiKey: 'your-railgun-api-key',
        rpcEndpoints: {
          ethereum: 'https://eth.llamarpc.com'
        }
      },
      aztec: { 
        apiKey: 'your-aztec-api-key',
        pxeUrl: 'https://aztec-connect.dev'
      }
    },
    defaultProvider: 'railgun'
  });
  
  try {
    // Connect with auto detection
    const connectionResult = await walletConnect.connect('auto');
    console.log('   ✓ Connected to provider:', connectionResult.provider);
    console.log('   Address:', connectionResult.address);
    
    if (connectionResult.connected) {
      // Get balances
      const balances = await walletConnect.getBalances();
      console.log('   ✓ Balances retrieved:', balances.length, 'tokens');
      
      // Execute transfer
      const transferResult = await walletConnect.transfer({
        chain: 'ethereum',
        token: 'ETH',
        amount: '500000000000000000', // 0.5 ETH in wei
        to: '0xAnotherRecipient',
        privacy: 'shielded'
      });
      
      console.log('   ✓ Transfer executed successfully');
      console.log('   Transaction Hash:', transferResult.transactionHash);
    }
    
  } catch (error) {
    console.error('   ✗ Error with wallet connect:', error.message);
  }
  
  console.log('\n=== Demo Complete ===');
}

// Run the demo
demonstrateAutoProvider().catch(console.error);
