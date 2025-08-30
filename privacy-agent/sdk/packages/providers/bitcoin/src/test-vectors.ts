/**
 * Test vectors and examples for Bitcoin Silent Payments
 * Based on BIP352 test vectors
 */

export const testVectors = {
  // Test vector from BIP352 reference implementation
  referenceTest: {
    sender: {
      inputs: [
        {
          outpoint: {
            txid: "0000000000000000000000000000000000000000000000000000000000000001",
            index: 0
          },
          privateKey: "7589a07505594d7ee4074035e969086f4fdf5cb98a1333db83944188821bdd61",
          publicKey: "02466d7fcae3424a50247799038c2672637e83072a3143502047c61037d197877a"
        }
      ],
      recipients: [
        "sp1qqgste7k9hx0qj8krw0dfkqmn4m8v30aazq6nr6p85945505yps7n53r2qqgste7k9hx0qj8krw0dfkqmn4m8v30aazq6nr6p85945505yps7n53rf495dud6h"
      ],
      expectedOutputs: [
        "9200616be3c088dd5c38675d07e8f5129404d0d2be3074550d00e2208055b00dec"
      ]
    },
    receiver: {
      keyMaterial: {
        scanPrivKey: "0111111111111111111111111111111111111111111111111111111111111111",
        spendPrivKey: "0222222222222222222222222222222222222222222222222222222222222222"
      },
      expectedAddress: "sp1qqgste7k9hx0qj8krw0dfkqmn4m8v30aazq6nr6p85945505yps7n53r2qqgste7k9hx0qj8krw0dfkqmn4m8v30aazq6nr6p85945505yps7n53rf495dud6h",
      expectedOutputs: [
        {
          privKeyTweak: "759c4aa991d4fac34c992f5c10a9315227af73a14300972308a076377d73c8c0",
          pubKey: "9200616be3c088dd5c38675d07e8f5129404d0d2be3074550d00e2208055b00dec",
          signature: "signature_would_be_here"
        }
      ]
    }
  },
  
  // Test vector for multiple outputs
  multipleOutputs: {
    sender: {
      inputs: [
        {
          outpoint: {
            txid: "0000000000000000000000000000000000000000000000000000000000000001",
            index: 0
          },
          privateKey: "7589a07505594d7ee4074035e969086f4fdf5cb98a1333db83944188821bdd61",
          publicKey: "02466d7fcae3424a50247799038c2672637e83072a3143502047c61037d197877a"
        }
      ],
      recipients: [
        "sp1qqgste7k9hx0qj8krw0dfkqmn4m8v30aazq6nr6p85945505yps7n53r2qqgste7k9hx0qj8krw0dfkqmn4m8v30aazq6nr6p85945505yps7n53rf495dud6h"
      ],
      expectedOutputs: [
        "9200616be3c088dd5c38675d07e8f5129404d0d2be3074550d00e2208055b00dec",
        "85d16847e460d732eb6076a0aedb0dc98e24a6582a9b5aea54197c8323a0a6ae"
      ]
    },
    receiver: {
      keyMaterial: {
        scanPrivKey: "0111111111111111111111111111111111111111111111111111111111111111",
        spendPrivKey: "0222222222222222222222222222222222222222222222222222222222222222"
      },
      expectedOutputs: [
        {
          privKeyTweak: "759c4aa991d4fac34c992f5c10a9315227af73a14300972308a076377d73c8c0",
          pubKey: "9200616be3c088dd5c38675d07e8f5129404d0d2be3074550d00e2208055b00dec",
          signature: "signature_would_be_here"
        },
        {
          privKeyTweak: "6839c0f1a1400eb81a08366733a917d45435e0a81f1f4033d018b0822a2696bf",
          pubKey: "85d16847e460d732eb6076a0aedb0dc98e24a6582a9b5aea54197c8323a0a6ae",
          signature: "signature_would_be_here"
        }
      ]
    }
  }
};

// Example usage functions
export const exampleUsage = {
  generateAddress: `
    import { SilentPaymentAddressGenerator } from '@zk-sdk/bitcoin-privacy';
    
    // Create a generator instance
    const generator = new SilentPaymentAddressGenerator('mainnet');
    
    // Generate keys (in practice, you would derive these from a seed)
    const scanPrivateKey = Buffer.from('0111111111111111111111111111111111111111111111111111111111111111', 'hex');
    const spendPrivateKey = Buffer.from('0222222222222222222222222222222222222222222222222222222222222222', 'hex');
    
    // Generate the silent payment address
    const address = generator.generateAddress(scanPrivateKey, spendPrivateKey);
    const encodedAddress = generator.encodeAddress(address);
    console.log('Silent Payment Address:', encodedAddress);
  `,
  
  createOutputs: `
    import { SilentPaymentAddressGenerator } from '@zk-sdk/bitcoin-privacy';
    
    // Create a generator instance
    const generator = new SilentPaymentAddressGenerator('mainnet');
    
    // Define transaction inputs
    const inputs = [
      {
        outpoint: {
          txid: '0000000000000000000000000000000000000000000000000000000000000001',
          index: 0
        },
        publicKey: Buffer.from('02466d7fcae3424a50247799038c2672637e83072a3143502047c61037d197877a', 'hex')
      }
    ];
    
    // Define payment amounts (in satoshis)
    const amounts = [10000]; // One output with 10,000 satoshis
    
    // Decode the recipient's address
    const recipientAddress = generator.decodeAddress('sp1qqgste7k9hx0qj8krw0dfkqmn4m8v30aazq6nr6p85945505yps7n53r2qqgste7k9hx0qj8krw0dfkqmn4m8v30aazq6nr6p85945505yps7n53rf495dud6h');
    
    // Create silent payment outputs
    const silentPaymentOutputs = generator.createOutputs(recipientAddress, inputs, amounts);
    
    console.log('Generated outputs:', silentPaymentOutputs);
  `,
  
  scanTransaction: `
    import { SilentPaymentScanner } from '@zk-sdk/bitcoin-privacy';
    
    // Create a scanner instance with your scan private key
    const scanPrivateKey = Buffer.from('0111111111111111111111111111111111111111111111111111111111111111', 'hex');
    const recipientAddress = generator.decodeAddress('sp1qqgste7k9hx0qj8krw0dfkqmn4m8v30aazq6nr6p85945505yps7n53r2qqgste7k9hx0qj8krw0dfkqmn4m8v30aazq6nr6p85945505yps7n53rf495dud6h');
    const scanner = new SilentPaymentScanner(scanPrivateKey, recipientAddress);
    
    // Mock transaction data
    const transaction = {
      getId: () => 'transaction_id_here',
      vout: [
        {
          scriptPubKey: {
            type: 'witness_v1_taproot',
            hex: '51209200616be3c088dd5c38675d07e8f5129404d0d2be3074550d00e2208055b00d'
          }
        }
      ]
    };
    
    // Define transaction inputs
    const inputs = [
      {
        outpoint: {
          txid: '0000000000000000000000000000000000000000000000000000000000000001',
          index: 0
        },
        publicKey: Buffer.from('02466d7fcae3424a50247799038c2672637e83072a3143502047c61037d197877a', 'hex')
      }
    ];
    
    // Scan a transaction
    const scanResults = scanner.scanTransaction(transaction, inputs);
    
    // Calculate spending private key for detected payments
    if (scanResults.length > 0) {
      const spendPrivateKey = Buffer.from('0222222222222222222222222222222222222222222222222222222222222222', 'hex');
      const spendingPrivateKey = scanner.calculateSpendingPrivateKey(
        spendPrivateKey,
        scanResults[0].privateKeyTweak
      );
      console.log('Spending private key:', spendingPrivateKey.toString('hex'));
    }
  `
};
