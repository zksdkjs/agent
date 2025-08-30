import { ethers } from 'ethers';
import { EncryptedAmount, FHEProof } from './types';

/**
 * Encryption utilities for Zama fhEVM
 * Handles client-side encryption and proof generation
 */
export class EncryptionUtils {
  private publicKey: string;
  
  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }

  /**
   * Encrypt a uint8 value
   */
  async encryptUint8(value: number): Promise<EncryptedAmount> {
    if (value < 0 || value > 255) {
      throw new Error('Value must be between 0 and 255 for uint8');
    }
    
    return this.encryptValue(BigInt(value), 8);
  }

  /**
   * Encrypt a uint16 value
   */
  async encryptUint16(value: number): Promise<EncryptedAmount> {
    if (value < 0 || value > 65535) {
      throw new Error('Value must be between 0 and 65535 for uint16');
    }
    
    return this.encryptValue(BigInt(value), 16);
  }

  /**
   * Encrypt a uint32 value
   */
  async encryptUint32(value: number): Promise<EncryptedAmount> {
    if (value < 0 || value > 4294967295) {
      throw new Error('Value must be between 0 and 4294967295 for uint32');
    }
    
    return this.encryptValue(BigInt(value), 32);
  }

  /**
   * Encrypt a uint64 value
   */
  async encryptUint64(value: bigint): Promise<EncryptedAmount> {
    if (value < 0n || value > 18446744073709551615n) {
      throw new Error('Value must be between 0 and 2^64-1 for uint64');
    }
    
    return this.encryptValue(value, 64);
  }

  /**
   * Encrypt a uint128 value
   */
  async encryptUint128(value: bigint): Promise<EncryptedAmount> {
    if (value < 0n || value > (2n ** 128n - 1n)) {
      throw new Error('Value must be between 0 and 2^128-1 for uint128');
    }
    
    return this.encryptValue(value, 128);
  }

  /**
   * Encrypt a uint256 value
   */
  async encryptUint256(value: bigint): Promise<EncryptedAmount> {
    if (value < 0n || value > (2n ** 256n - 1n)) {
      throw new Error('Value must be between 0 and 2^256-1 for uint256');
    }
    
    return this.encryptValue(value, 256);
  }

  /**
   * Encrypt a boolean value
   */
  async encryptBool(value: boolean): Promise<EncryptedAmount> {
    return this.encryptValue(BigInt(value ? 1 : 0), 1);
  }

  /**
   * Encrypt an address
   */
  async encryptAddress(address: string): Promise<EncryptedAmount> {
    if (!ethers.isAddress(address)) {
      throw new Error('Invalid Ethereum address');
    }
    
    const addressBigInt = BigInt(address);
    return this.encryptValue(addressBigInt, 160);
  }

  /**
   * Core encryption function
   * In production, this would use the fhevmjs library
   */
  private async encryptValue(value: bigint, bitSize: number): Promise<EncryptedAmount> {
    // Generate random bytes for mock encryption
    // In production, this would use actual FHE encryption
    const encryptedData = ethers.randomBytes(32 + Math.ceil(bitSize / 8));
    const proof = this.generateProof(value, encryptedData);
    
    return {
      value: ethers.hexlify(encryptedData),
      proof: proof,
      contractAddress: '',
      timestamp: Date.now(),
      metadata: {
        bitSize,
        publicKey: this.publicKey
      }
    };
  }

  /**
   * Generate a zero-knowledge proof for the encryption
   */
  private generateProof(value: bigint, encryptedData: Uint8Array): FHEProof {
    // In production, this would generate an actual ZK proof
    // For now, create a mock proof
    const proofData = ethers.randomBytes(64);
    return ethers.hexlify(proofData) as FHEProof;
  }

  /**
   * Verify an encryption proof
   */
  async verifyProof(
    encryptedAmount: EncryptedAmount,
    proof: FHEProof
  ): Promise<boolean> {
    // In production, this would verify the actual proof
    // For now, just check that proof exists
    return proof.length > 0 && encryptedAmount.proof === proof;
  }

  /**
   * Re-encrypt a value for a different public key
   */
  async reEncrypt(
    encryptedAmount: EncryptedAmount,
    newPublicKey: string
  ): Promise<EncryptedAmount> {
    // This would perform proxy re-encryption
    // For now, create a new mock encryption
    const reEncrypted = ethers.randomBytes(32);
    const newProof = this.generateProof(BigInt(0), reEncrypted);
    
    return {
      value: ethers.hexlify(reEncrypted),
      proof: newProof,
      contractAddress: encryptedAmount.contractAddress,
      timestamp: Date.now(),
      metadata: {
        ...encryptedAmount.metadata,
        publicKey: newPublicKey,
        previousEncryption: encryptedAmount.value
      }
    };
  }

  /**
   * Create a batch of encrypted values
   */
  async encryptBatch(values: bigint[], bitSize: number = 256): Promise<EncryptedAmount[]> {
    return Promise.all(
      values.map(value => this.encryptValue(value, bitSize))
    );
  }

  /**
   * Serialize encrypted amount for contract interaction
   */
  serializeForContract(encryptedAmount: EncryptedAmount): string {
    return ethers.AbiCoder.defaultAbiCoder().encode(
      ['bytes', 'bytes'],
      [encryptedAmount.value, encryptedAmount.proof]
    );
  }

  /**
   * Deserialize encrypted amount from contract response
   */
  deserializeFromContract(data: string, contractAddress: string): EncryptedAmount {
    const [value, proof] = ethers.AbiCoder.defaultAbiCoder().decode(
      ['bytes', 'bytes'],
      data
    );
    
    return {
      value,
      proof: proof as FHEProof,
      contractAddress,
      timestamp: Date.now()
    };
  }

  /**
   * Update public key
   */
  updatePublicKey(newPublicKey: string): void {
    this.publicKey = newPublicKey;
  }

  /**
   * Get current public key
   */
  getPublicKey(): string {
    return this.publicKey;
  }
}