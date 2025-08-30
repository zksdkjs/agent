import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
import { bech32 } from 'bech32';
import { SilentPaymentAddress, SilentPaymentTransactionInput, SilentPaymentOutput } from './types';
import { 
  calculateSharedSecret, 
  hashBIP0352Inputs, 
  hashBIP0352SharedSecret, 
  hashBIP0352Label,
  ser32,
  serP,
  isValidScalar,
  toXOnly,
  negateIfOddY
} from './utils';

const ECPair = ECPairFactory(ecc);

/**
 * Silent Payment Address Generator
 * Implements BIP352 for generating silent payment addresses
 */
export class SilentPaymentAddressGenerator {
  private network: bitcoin.Network;

  constructor(network: 'mainnet' | 'testnet' | 'signet' | 'regtest' = 'mainnet') {
    switch (network) {
      case 'mainnet':
        this.network = bitcoin.networks.bitcoin;
        break;
      case 'testnet':
        this.network = bitcoin.networks.testnet;
        break;
      case 'signet':
        this.network = bitcoin.networks.testnet; // Using testnet for signet
        break;
      default:
        this.network = bitcoin.networks.regtest;
    }
  }

  /**
   * Generate a silent payment address from scan and spend private keys
   * @param scanPrivateKey - The scan private key (b_scan)
   * @param spendPrivateKey - The spend private key (b_spend)
   * @returns SilentPaymentAddress object
   */
  generateAddress(scanPrivateKey: Buffer, spendPrivateKey: Buffer): SilentPaymentAddress {
    const scanKeyPair = ECPair.fromPrivateKey(scanPrivateKey);
    const spendKeyPair = ECPair.fromPrivateKey(spendPrivateKey);
    
    return {
      scanPublicKey: scanKeyPair.publicKey,
      spendPublicKey: spendKeyPair.publicKey,
      network: this.getNetworkName(),
      version: 0
    };
  }

  /**
   * Create silent payment outputs for a transaction
   * @param silentPaymentAddress - The recipient's silent payment address
   * @param inputs - The transaction inputs
   * @param amounts - Array of amounts for each output
   * @returns Array of silent payment outputs
   */
  createOutputs(
    silentPaymentAddress: SilentPaymentAddress,
    inputs: SilentPaymentTransactionInput[],
    amounts: number[]
  ): SilentPaymentOutput[] {
    // Filter inputs to only include eligible ones per BIP352
    const eligibleInputs = this.filterEligibleInputs(inputs);
    
    if (eligibleInputs.length === 0) {
      throw new Error('No eligible inputs for silent payment');
    }
    
    // Aggregate input public keys
    const aggregatedPublicKey = this.aggregateInputPublicKeys(eligibleInputs);
    
    // Check if aggregated key is point at infinity
    if (aggregatedPublicKey.equals(Buffer.alloc(33))) {
      throw new Error('Aggregated public key is point at infinity');
    }
    
    // Get the smallest outpoint (lexicographically)
    const smallestOutpoint = this.getSmallestOutpoint(eligibleInputs);
    
    // Compute input hash = hash(outpoint_L || A)
    const inputHash = this.computeInputHash(smallestOutpoint, aggregatedPublicKey);
    
    // Validate input hash scalar
    if (!isValidScalar(inputHash)) {
      throw new Error('Input hash is not a valid scalar');
    }
    
    // Compute shared secret = input_hash * a * B_scan
    const sharedSecret = calculateSharedSecret(silentPaymentAddress.scanPublicKey, inputHash);
    
    const outputs: SilentPaymentOutput[] = [];
    
    for (let i = 0; i < amounts.length; i++) {
      // Calculate tweak = hash(ser_P(ecdh_shared_secret) || ser_32(k))
      const tweak = this.calculateTweak(sharedSecret, i);
      
      // Validate tweak scalar
      if (!isValidScalar(tweak)) {
        throw new Error(`Tweak ${i} is not a valid scalar`);
      }
      
      // P = B_spend + tweak * G
      const silentPaymentPublicKey = this.deriveSilentPaymentPublicKey(
        silentPaymentAddress.spendPublicKey,
        tweak
      );
      
      outputs.push({
        publicKey: silentPaymentPublicKey,
        amount: amounts[i],
        index: i
      });
    }
    
    return outputs;
  }

  /**
   * Convert silent payment address to bech32m encoded string
   * @param address - Silent payment address object
   * @returns bech32m encoded address string
   */
  encodeAddress(address: SilentPaymentAddress): string {
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

  /**
   * Decode a bech32 encoded silent payment address
   * @param encodedAddress - bech32 encoded address string
   * @returns SilentPaymentAddress object
   */
  decodeAddress(encodedAddress: string): SilentPaymentAddress {
    const { prefix: hrp, words } = bech32.decode(encodedAddress);
    const data = Buffer.from(bech32.fromWords(words));
    
    // Check version (first byte should be 0 for version 0)
    // Note: bech32m would validate the checksum differently, but we're using bech32 for now
    // In practice, this should use bech32m for proper validation
    
    // Parse the data (66 bytes total for two 33-byte public keys)
    if (data.length !== 66) {
      throw new Error('Invalid payload length for silent payment address');
    }
    
    const scanPublicKeyXOnly = data.subarray(0, 33);
    const spendPublicKeyXOnly = data.subarray(33, 66);
    
    // Convert x-only to compressed public keys (assume even Y coordinate)
    const scanPublicKey = Buffer.concat([Buffer.from([0x02]), scanPublicKeyXOnly]);
    const spendPublicKey = Buffer.concat([Buffer.from([0x02]), spendPublicKeyXOnly]);
    
    let network: 'mainnet' | 'testnet' | 'signet' | 'regtest';
    switch (hrp) {
      case 'sp':
        network = 'mainnet';
        break;
      case 'tsp':
        network = 'testnet';
        break;
      case 'sssp':
        network = 'signet';
        break;
      default:
        network = 'regtest';
    }
    
    return {
      scanPublicKey,
      spendPublicKey,
      network,
      version: 0
    };
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

  private getNetworkName(): 'mainnet' | 'testnet' | 'signet' | 'regtest' {
    if (this.network === bitcoin.networks.bitcoin) {
      return 'mainnet';
    } else if (this.network === bitcoin.networks.testnet) {
      return 'testnet';
    } else {
      return 'regtest';
    }
  }
}
