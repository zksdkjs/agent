/**
 * Type definitions for Bitcoin Silent Payments (BIP352)
 */

export interface SilentPaymentAddress {
  scanPublicKey: Buffer;    // B_scan public key
  spendPublicKey: Buffer;   // B_spend public key
  network: 'mainnet' | 'testnet' | 'signet' | 'regtest';
  version: number;          // Address version (0 for initial version)
}

export interface SilentPaymentTransactionInput {
  outpoint: {
    txid: string;
    index: number;
  };
  publicKey: Buffer;        // Public key of the input
}

export interface SilentPaymentScanResult {
  transactionHash: string;
  outputIndex: number;
  silentPaymentAddress: string;
  privateKeyTweak: Buffer;  // Private key tweak for spending
}

export interface SilentPaymentOutput {
  publicKey: Buffer;        // P = B_spend + hash(a*B_scan || i)*G
  amount: number;           // Amount in satoshis
  index: number;            // Output index (i in BIP352)
  script?: Buffer;          // Output script (Taproot script)
}

export interface BIP352TestVector {
  sender: {
    inputs: Array<{
      outpoint: {
        txid: string;
        index: number;
      };
      privateKey: string;
      publicKey: string;
    }>;
    recipients: string[];
    expectedOutputs: string[];
  };
  receiver: {
    keyMaterial: {
      scanPrivKey: string;
      spendPrivKey: string;
    };
    expectedAddress: string;
    expectedOutputs: Array<{
      privKeyTweak: string;
      pubKey: string;
      signature: string;
    }>;
  };
}
