import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import { bech32 } from 'bech32';
import { SilentPaymentAddress, SilentPaymentTransactionInput, SilentPaymentScanResult } from './types';
import { 
  calculateSharedSecret, 
  hashBIP0352Inputs, 
  hashBIP0352SharedSecret, 
  ser32, 
  serP, 
  isValidScalar,
  toXOnly
} from './utils';

const ECPair = ECPairFactory(ecc);

/**
 * Silent Payment Scanner
 * Implements BIP352 for scanning transactions to detect silent payments
 */
export class SilentPaymentScanner {
  private scanPrivateKey: Buffer;
  private silentPaymentAddress: SilentPaymentAddress;

  constructor(scanPrivateKey: Buffer, silentPaymentAddress: SilentPaymentAddress) {
    this.scanPrivateKey = scanPrivateKey;
    this.silentPaymentAddress = silentPaymentAddress;
  }

  /**
   * Scan a transaction for silent payments to this address
   * @param transaction - Bitcoin transaction to scan
   * @param inputs - Transaction inputs with public keys
   * @returns Array of scan results
   */
  scanTransaction(transaction: any, inputs: SilentPaymentTransactionInput[]): SilentPaymentScanResult[] {
    const results: SilentPaymentScanResult[] = [];
    
    // Check if transaction has taproot outputs
    const taprootOutputs = this.extractTaprootOutputs(transaction);
    if (taprootOutputs.length === 0) {
      return results;
    }
    
    // Filter inputs to only include eligible ones per BIP352
    const eligibleInputs = this.filterEligibleInputs(inputs);
    
    if (eligibleInputs.length === 0) {
      return results;
    }
    
    // Aggregate input public keys
    const aggregatedPublicKey = this.aggregateInputPublicKeys(eligibleInputs);
    
    // Check if aggregated key is point at infinity
    if (aggregatedPublicKey.equals(Buffer.alloc(33))) {
      return results;
    }
    
    // Get the smallest outpoint (lexicographically)
    const smallestOutpoint = this.getSmallestOutpoint(eligibleInputs);
    
    // Compute input hash = hash(outpoint_L || A)
    const inputHash = this.computeInputHash(smallestOutpoint, aggregatedPublicKey);
    
    // Validate input hash scalar
    if (!isValidScalar(inputHash)) {
      return results;
    }
    
    // Compute shared secret = input_hash * b_scan * A
    const sharedSecret = calculateSharedSecret(aggregatedPublicKey, inputHash);
    
    // Try to detect silent payment outputs
    let index = 0;
    let found = true;
    
    while (found) {
      // Calculate tweak = hash(ser_P(ecdh_shared_secret) || ser_32(k))
      const tweak = this.calculateTweak(sharedSecret, index);
      
      // Validate tweak scalar
      if (!isValidScalar(tweak)) {
        break;
      }
      
      // P = B_spend + tweak * G
      const expectedPublicKey = this.deriveSilentPaymentPublicKey(
        this.silentPaymentAddress.spendPublicKey,
        tweak
      );
      
      // Convert to x-only public key for comparison
      const expectedXOnly = toXOnly(expectedPublicKey);
      
      found = false;
      // Check each taproot output
      for (let i = 0; i < taprootOutputs.length; i++) {
        const output = taprootOutputs[i];
        
        // Check if this output matches our expected public key
        if (output.scriptPubKey.equals(expectedXOnly)) {
          results.push({
            transactionHash: transaction.getId(),
            outputIndex: output.index,
            silentPaymentAddress: this.encodeAddress(this.silentPaymentAddress),
            privateKeyTweak: tweak
          });
          
          found = true;
          break;
        }
      }
      
      index++;
      
      // Limit to prevent infinite loop
      if (index > 100) break;
    }
    
    return results;
  }

  /**
   * Calculate the private key needed to spend a detected silent payment
   * @param spendPrivateKey - The spend private key (b_spend)
   * @param privateKeyTweak - The tweak derived during scanning
   * @returns The private key to spend the silent payment output
   */
  calculateSpendingPrivateKey(spendPrivateKey: Buffer, privateKeyTweak: Buffer): Buffer {
    // Spending private key = (b_spend + tweak) mod n
    const BN = require('bn.js');
    
    const spendKeyBN = new BN(spendPrivateKey);
    const tweakBN = new BN(privateKeyTweak);
    const orderBN = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 'hex');
    
    const spendingKeyBN = spendKeyBN.add(tweakBN).mod(orderBN);
    return spendingKeyBN.toBuffer();
  }

  private extractTaprootOutputs(transaction: any): Array<{index: number, scriptPubKey: Buffer}> {
    const taprootOutputs: Array<{index: number, scriptPubKey: Buffer}> = [];
    
    // This is a simplified implementation
    // In practice, you would parse the actual transaction outputs
    // and identify Taproot outputs (OP_1 followed by 32-byte push)
    
    // Assuming transaction.vout exists and has scriptPubKey property
    if (transaction.vout) {
      transaction.vout.forEach((output: any, index: number) => {
        // Check if this is a Taproot output (OP_1 followed by 32-byte push)
        if (output.scriptPubKey && output.scriptPubKey.type === 'witness_v1_taproot') {
          // Extract the 32-byte commitment (x-only public key)
          const scriptHex = output.scriptPubKey.hex;
          if (scriptHex && scriptHex.length === 66 && scriptHex.startsWith('5120')) {
            // OP_1 (0x51) + PUSH 32 bytes (0x20) + 32-byte commitment
            const commitment = Buffer.from(scriptHex.substring(4), 'hex');
            taprootOutputs.push({
              index,
              scriptPubKey: commitment
            });
          }
        }
      });
    }
    
    return taprootOutputs;
  }

  /**
   * Filter eligible inputs according to BIP352 specification
   * @param inputs - All transaction inputs
   * @returns Filtered list of eligible inputs
   */
  private filterEligibleInputs(inputs: SilentPaymentTransactionInput[]): SilentPaymentTransactionInput[] {
    // For now, we'll assume all inputs are eligible
    // In a full implementation, we would check the script type and other conditions
    return inputs;
  }

  private aggregateInputPublicKeys(inputs: SilentPaymentTransactionInput[]): Buffer {
    if (inputs.length === 0) {
      throw new Error('No inputs provided');
    }
    
    // Start with the first public key
    let aggregatedKey = inputs[0].publicKey;
    
    // Add each subsequent public key
    for (let i = 1; i < inputs.length; i++) {
      aggregatedKey = ecc.pointAdd(aggregatedKey, inputs[i].publicKey) as Buffer;
    }
    
    return aggregatedKey;
  }

  private getSmallestOutpoint(inputs: SilentPaymentTransactionInput[]): Buffer {
    // Convert outpoints to buffers for comparison
    const outpointBuffers = inputs.map(input => {
      // Serialize txid (32 bytes, little-endian)
      const txidBuffer = Buffer.from(input.outpoint.txid, 'hex');
      // Reverse for little-endian
      const reversedTxid = Buffer.from(txidBuffer).reverse();
      
      // Serialize vout (4 bytes, little-endian)
      const voutBuffer = Buffer.alloc(4);
      voutBuffer.writeUInt32LE(input.outpoint.index, 0);
      
      // Concatenate txid and vout
      return Buffer.concat([reversedTxid, voutBuffer]);
    });
    
    // Return the lexicographically smallest
    return outpointBuffers.sort((a, b) => a.compare(b))[0];
  }

  private computeInputHash(outpoint: Buffer, publicKey: Buffer): Buffer {
    const dataToHash = Buffer.concat([outpoint, publicKey]);
    return hashBIP0352Inputs(dataToHash);
  }

  private calculateTweak(sharedSecret: Buffer, index: number): Buffer {
    const sharedSecretSerialized = serP(sharedSecret);
    const indexSerialized = ser32(index);
    const dataToHash = Buffer.concat([sharedSecretSerialized, indexSerialized]);
    return hashBIP0352SharedSecret(dataToHash);
  }

  private deriveSilentPaymentPublicKey(basePublicKey: Buffer, tweak: Buffer): Buffer {
    // Convert tweak to scalar (mod n)
    const tweakScalar = Buffer.from(tweak);
    
    // P = B_spend + tweak * G
    const tweakPoint = ecc.pointFromScalar(tweakScalar) as Buffer;
    if (!tweakPoint) {
      throw new Error('Failed to compute tweak point');
    }
    const silentPaymentPublicKey = ecc.pointAdd(basePublicKey, tweakPoint) as Buffer;
    
    if (!silentPaymentPublicKey) {
      throw new Error('Failed to derive silent payment public key');
    }
    
    return silentPaymentPublicKey;
  }

  private encodeAddress(address: SilentPaymentAddress): string {
    // Create the payload: scan_pubkey + spend_pubkey (both as x-only)
    const scanXOnly = toXOnly(address.scanPublicKey);
    const spendXOnly = toXOnly(address.spendPublicKey);
    const payload = Buffer.concat([scanXOnly, spendXOnly]);
    
    // Convert to 5-bit words for bech32 encoding
    const words = bech32.toWords(Buffer.from(payload));
    
    // Add version byte 'q' (0x00) at the beginning as per BIP352
    words.unshift(0); // Version 0
    
    // Determine human-readable part based on network
    let hrp: string;
    switch (address.network) {
      case 'mainnet':
        hrp = 'sp';
        break;
      case 'testnet':
        hrp = 'tsp';
        break;
      case 'signet':
        hrp = 'sssp';
        break;
      default:
        hrp = 'sprt';
    }
    
    return bech32.encode(hrp, words);
  }
}
