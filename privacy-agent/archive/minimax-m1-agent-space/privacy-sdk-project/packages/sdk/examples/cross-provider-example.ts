// Example of using the Cross-Provider Recipe

import { PrivacySDK } from '../src/privacy-sdk';

async function crossProviderTransferExample() {
  // Create a Privacy SDK instance with both Railgun and Aztec providers
  const sdk = new PrivacySDK({
    defaultProvider: 'railgun',
    providers: {
      railgun: {
        type: 'railgun',
        chainId: 1,
        networkType: 'testnet',
        rpcUrl: 'https://goerli.infura.io/v3/your-api-key'
      },
      aztec: {
        type: 'aztec',
        chainId: 1,
        networkType: 'testnet',
        rpcUrl: 'https://aztec-connect-testnet.aztec.network'
      }
    }
  });

  // Initialize the SDK
  await sdk.initialize();

  console.log('SDK initialized successfully');
  console.log('Available providers:', sdk.listProviders());

  try {
    // Execute a cross-provider transfer
    const result = await sdk.recipes.crossProviderTransfer({
      sourceProvider: 'railgun',
      destinationProvider: 'aztec',
      sourceAddress: '0xYourRailgunPrivateAddress',
      destinationAddress: '0xYourAztecPrivateAddress',
      token: {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        symbol: 'USDC',
        decimals: 6
      },
      amount: '100.0', // Transfer 100 USDC
      memo: 'Cross-provider transfer example'
    });

    // Log the result
    console.log('Cross-provider transfer result:', result);
    console.log('Transfer successful:', result.success);
    console.log('Transactions:', result.transactions.length);
    console.log('Total fees:', result.totalFees);
    console.log('Execution time:', result.executionTime, 'ms');

    // Check if the transfer was successful
    if (result.success) {
      console.log('Successfully transferred tokens between privacy providers!');
    } else {
      console.error('Transfer failed:', result.metadata?.error);
    }
  } catch (error) {
    console.error('Error executing cross-provider transfer:', error);
  }

  // Clean up
  await sdk.destroy();
}

// Run the example
crossProviderTransferExample().catch(console.error);