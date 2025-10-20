/**
 * Tests for Bitcoin Silent Payments Provider
 */

import { SilentPaymentAddressGenerator } from '../SilentPaymentAddress';
import { SilentPaymentScanner } from '../SilentPaymentScanner';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import * as crypto from 'crypto';

describe('SilentPaymentAddressGenerator', () => {
  let generator: SilentPaymentAddressGenerator;

  beforeEach(() => {
    generator = new SilentPaymentAddressGenerator('testnet');
  });

  test('should create generator instance', () => {
    expect(generator).toBeInstanceOf(SilentPaymentAddressGenerator);
  });

  test('should generate silent payment address from private keys', () => {
    const scanPrivateKey = crypto.randomBytes(32);
    const spendPrivateKey = crypto.randomBytes(32);

    const address = generator.generateAddress(scanPrivateKey, spendPrivateKey);

    expect(address).toBeDefined();
    expect(address.scanPublicKey).toBeDefined();
    expect(address.spendPublicKey).toBeDefined();
    expect(address.network).toBe('testnet');
    expect(address.version).toBe(0);
  });

  test('should throw error with invalid private keys', () => {
    const invalidKey = Buffer.alloc(31); // Too short
    const validKey = crypto.randomBytes(32);

    expect(() => {
      generator.generateAddress(invalidKey, validKey);
    }).toThrow();
  });

  test('should create outputs for silent payment', () => {
    const scanPrivateKey = crypto.randomBytes(32);
    const spendPrivateKey = crypto.randomBytes(32);
    const senderPrivateKey = crypto.randomBytes(32);

    const address = generator.generateAddress(scanPrivateKey, spendPrivateKey);
    
    // Create public key from private key for the input
    const ECPair = ECPairFactory(ecc);
    const senderKeyPair = ECPair.fromPrivateKey(senderPrivateKey);
    
    const inputs = [{
      privateKey: senderPrivateKey,
      txid: '0'.repeat(64),
      vout: 0,
      scriptPubKey: Buffer.alloc(34),
      value: 100000,
      outpoint: {
        txid: '0'.repeat(64),
        index: 0
      },
      publicKey: senderKeyPair.publicKey
    }];

    const amounts = [50000];

    const outputs = generator.createOutputs(address, inputs, amounts);

    expect(outputs).toBeDefined();
    expect(outputs.length).toBe(amounts.length);
    expect(outputs[0].amount).toBe(50000);
    expect(outputs[0].script).toBeDefined();
  });
});

describe('SilentPaymentScanner', () => {
  let scanner: SilentPaymentScanner;
  let scanPrivateKey: Buffer;
  let silentPaymentAddress: any;

  beforeEach(() => {
    scanPrivateKey = crypto.randomBytes(32);
    silentPaymentAddress = {
      scanPublicKey: crypto.randomBytes(33),
      spendPublicKey: crypto.randomBytes(33),
      network: 'testnet',
      version: 0
    };
    scanner = new SilentPaymentScanner(scanPrivateKey, silentPaymentAddress);
  });

  test('should create scanner instance', () => {
    expect(scanner).toBeInstanceOf(SilentPaymentScanner);
  });

  test('should scan transaction for payments', () => {
    const mockTransaction = {
      txid: '0'.repeat(64),
      inputs: [],
      outputs: [{
        scriptPubKey: Buffer.alloc(34),
        value: 100000,
        n: 0
      }]
    };

    const mockInputs = [{
      outpoint: {
        txid: '0'.repeat(64),
        index: 0
      },
      publicKey: crypto.randomBytes(33)
    }];

    const payments = scanner.scanTransaction(mockTransaction as any, mockInputs);

    expect(payments).toBeDefined();
    expect(Array.isArray(payments)).toBe(true);
  });

  test('should handle transaction with no matching outputs', () => {
    const mockTransaction = {
      txid: '0'.repeat(64),
      inputs: [],
      outputs: []
    };

    const mockInputs = [{
      outpoint: {
        txid: '0'.repeat(64),
        index: 0
      },
      publicKey: crypto.randomBytes(33)
    }];

    const payments = scanner.scanTransaction(mockTransaction as any, mockInputs);

    expect(payments.length).toBe(0);
  });
});


