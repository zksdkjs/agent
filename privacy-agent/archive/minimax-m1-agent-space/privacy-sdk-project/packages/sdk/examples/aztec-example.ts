/**
 * Aztec Provider Example
 * 
 * This example demonstrates how to use the Aztec provider with the Privacy SDK.
 */

import { PrivacySDK } from '../src';

async function main() {
  try {
    console.log('Initializing Privacy SDK with Aztec provider...');

    // Create a new SDK instance with Aztec provider
    const sdk = new PrivacySDK({
      providers: {
        aztec: {
          type: 'aztec',
          chainId: 11155111, // Sepolia testnet
          networkType: 'testnet',
          rpcUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel',
          pxeConfig: {
            useExisting: true // Try to connect to an existing PXE service first
          }
        }
      },
      defaultProvider: 'aztec'
    });

    console.log('✅ SDK initialized successfully');

    // Generate a new private address
    console.log('\n🔐 Generating a new private address...');
    const addressInfo = await sdk.generatePrivateAddress();
    console.log(`✅ Generated address: ${addressInfo.address}`);

    // Send a private transaction
    try {
      console.log('\n💸 Sending a private transaction...');
      const result = await sdk.sendPrivateTransaction({
        toAddress: '0x1234567890123456789012345678901234567890', // Replace with a valid address
        amount: '0.001',
        memo: 'Test transaction from Privacy SDK'
      });
      console.log('✅ Transaction sent successfully');
      console.log(`📝 Transaction hash: ${result.hash}`);
      console.log(`📊 Status: ${result.status}`);
    } catch (error) {
      console.error('❌ Failed to send transaction:', error.message);
    }

    // Try using a recipe
    try {
      console.log('\n🍳 Using the shield recipe...');
      const shieldResult = await sdk.recipes.shield({
        token: '0x0000000000000000000000000000000000000000', // ETH
        amount: '0.001',
        fromAddress: '0x1234567890123456789012345678901234567890', // Replace with a valid address
        toAddress: addressInfo.address
      });
      console.log('✅ Shield operation completed successfully');
      console.log(`📊 Status: ${shieldResult.success ? 'Success' : 'Failed'}`);
    } catch (error) {
      console.error('❌ Failed to execute shield recipe:', error.message);
    }

    // Clean up and exit
    console.log('\n🧹 Cleaning up...');
    await sdk.destroy();
    console.log('✅ SDK destroyed successfully');
  } catch (error) {
    console.error('❌ Error in Aztec example:', error);
  }
}

// Run the example
main().catch(error => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});