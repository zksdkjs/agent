/**
 * Example usage of zkWalletConnect with Auto provider
 */

import { ZkSDK } from '@zksdk/core';
import { AutoPrivacyProvider } from '@zksdk/wallet-connect';

async function example() {
  console.log('🚀 Starting zkWalletConnect Auto Provider Example');
  
  // Create the Auto provider
  const autoProvider = new AutoPrivacyProvider({
    providers: {
      railgun: {
        rpcEndpoints: {
          ethereum: 'https://eth.llamarpc.com',
          polygon: 'https://polygon-rpc.com'
        },
        engineDbPath: './railgun-db'
      },
      aztec: {
        pxeUrl: 'http://localhost:8080',
      }
    },
    defaultProvider: 'railgun'
  });
  
  // Initialize the auto provider
  try {
    await autoProvider.initialize({});
    console.log('✅ Auto provider initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize auto provider:', error.message);
    return;
  }
  
  // Create SDK instance with the auto provider
  const sdk = new ZkSDK({
    providers: {
      auto: autoProvider,
      railgun: new RailgunProvider({
        rpcEndpoints: {
          ethereum: 'https://eth.llamarpc.com',
          polygon: 'https://polygon-rpc.com'
        },
        engineDbPath: './railgun-db'
      })
    },
    defaultProvider: 'auto'
  });
  
  console.log('✅ SDK initialized with auto provider');
  
  // Example transfer (this would fail in a real implementation without proper setup)
  try {
    const transferParams = {
      chain: 'ethereum',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      amount: '1000000', // 1 USDC (6 decimals)
      to: '0x742d35Cc6634C434C434C434C434C434C434C434',
      privacy: 'shielded'
    };
    
    console.log('💸 Attempting transfer with auto provider...');
    // const result = await sdk.transfer(transferParams);
    // console.log('✅ Transfer completed:', result);
    
    console.log('💡 In a real implementation, this would execute a private transfer');
    console.log('💡 using the best available privacy provider');
    
  } catch (error) {
    console.error('❌ Transfer failed:', error.message);
  }
  
  console.log('🎉 Example completed!');
}

// Run the example
example().catch(console.error);
