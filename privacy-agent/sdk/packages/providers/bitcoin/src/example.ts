/**
 * Example usage of the Bitcoin Silent Payments provider
 */

import { SilentPaymentAddressGenerator, SilentPaymentScanner } from './index';
import { testVectors } from './test-vectors';

async function example() {
  console.log('Bitcoin Silent Payments Provider Example');
  console.log('========================================');
  
  // Create a generator instance
  const generator = new SilentPaymentAddressGenerator('regtest');
  
  // Use test vector from BIP352 reference implementation
  console.log('\n1. Generating Silent Payment Address...');
  const scanPrivateKey = Buffer.from(testVectors.referenceTest.receiver.keyMaterial.scanPrivKey, 'hex');
  const spendPrivateKey = Buffer.from(testVectors.referenceTest.receiver.keyMaterial.spendPrivKey, 'hex');
  
  const address = generator.generateAddress(scanPrivateKey, spendPrivateKey);
  const encodedAddress = generator.encodeAddress(address);
  console.log('Encoded Address:', encodedAddress);
  console.log('Expected Address:', testVectors.referenceTest.receiver.expectedAddress);
  console.log('Addresses match:', encodedAddress === testVectors.referenceTest.receiver.expectedAddress);
  
  // Create silent payment outputs
  console.log('\n2. Creating Silent Payment Outputs...');
  const inputs = testVectors.referenceTest.sender.inputs.map(input => ({
    outpoint: input.outpoint,
    publicKey: Buffer.from(input.publicKey, 'hex')
  }));
  
  const amounts = [10000]; // Single output for this test
  
  try {
    const outputs = generator.createOutputs(
      address, 
      inputs, 
      amounts
    );
    
    console.log(`Created ${outputs.length} silent payment outputs:`);
    outputs.forEach((output, index) => {
      const outputHex = output.publicKey.toString('hex');
      console.log(`  Output ${index}: ${outputHex}`);
      console.log(`  Expected: ${testVectors.referenceTest.sender.expectedOutputs[index]}`);
      console.log(`  Match: ${outputHex === testVectors.referenceTest.sender.expectedOutputs[index]}`);
    });
  } catch (error) {
    console.error('Error creating outputs:', error);
  }
  
  // Simulate scanning (in practice, you would scan actual blockchain transactions)
  console.log('\n3. Scanning for Payments...');
  const scanner = new SilentPaymentScanner(scanPrivateKey, address);
  
  // This is a simplified example - in practice you would scan real transactions
  console.log('Scanner initialized with scan private key');
  
  console.log('\nExample completed successfully!');
}

// Run the example
example().catch(console.error);
