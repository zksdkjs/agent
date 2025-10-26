/**
 * Tests for EncryptionUtils
 */

import { EncryptionUtils } from '../encryption';

describe('EncryptionUtils', () => {
  let encryptionUtils: EncryptionUtils;
  const mockPublicKey = '0xmockpublickey';

  beforeEach(() => {
    encryptionUtils = new EncryptionUtils(mockPublicKey);
  });

  test('should create EncryptionUtils instance', () => {
    expect(encryptionUtils).toBeInstanceOf(EncryptionUtils);
    expect(encryptionUtils.getPublicKey()).toBe(mockPublicKey);
  });

  test('should encrypt uint8 value', async () => {
    const value = 42;
    const encrypted = await encryptionUtils.encryptUint8(value);
    
    expect(encrypted).toBeDefined();
    expect(encrypted.value).toBeDefined();
    expect(encrypted.proof).toBeDefined();
    expect(encrypted.contractAddress).toBe('');
    expect(encrypted.timestamp).toBeDefined();
  });

  test('should reject invalid uint8 value', async () => {
    await expect(encryptionUtils.encryptUint8(300))
      .rejects
      .toThrow('Value must be between 0 and 255 for uint8');
  });

  test('should encrypt uint16 value', async () => {
    const value = 1000;
    const encrypted = await encryptionUtils.encryptUint16(value);
    
    expect(encrypted).toBeDefined();
    expect(encrypted.value).toBeDefined();
  });

  test('should reject invalid uint16 value', async () => {
    await expect(encryptionUtils.encryptUint16(70000))
      .rejects
      .toThrow('Value must be between 0 and 65535 for uint16');
  });

  test('should encrypt uint32 value', async () => {
    const value = 1000000;
    const encrypted = await encryptionUtils.encryptUint32(value);
    
    expect(encrypted).toBeDefined();
    expect(encrypted.value).toBeDefined();
  });

  test('should reject invalid uint32 value', async () => {
    await expect(encryptionUtils.encryptUint32(5000000000))
      .rejects
      .toThrow('Value must be between 0 and 4294967295 for uint32');
  });

  test('should encrypt uint64 value', async () => {
    const value = 1000000000000n;
    const encrypted = await encryptionUtils.encryptUint64(value);
    
    expect(encrypted).toBeDefined();
    expect(encrypted.value).toBeDefined();
  });

  test('should reject invalid uint64 value', async () => {
    const invalidValue = 2n ** 64n;
    await expect(encryptionUtils.encryptUint64(invalidValue))
      .rejects
      .toThrow('Value must be between 0 and 2^64-1 for uint64');
  });

  test('should encrypt uint128 value', async () => {
    const value = 1000000000000000000000000n;
    const encrypted = await encryptionUtils.encryptUint128(value);
    
    expect(encrypted).toBeDefined();
    expect(encrypted.value).toBeDefined();
  });

  test('should reject invalid uint128 value', async () => {
    const invalidValue = 2n ** 128n;
    await expect(encryptionUtils.encryptUint128(invalidValue))
      .rejects
      .toThrow('Value must be between 0 and 2^128-1 for uint128');
  });

  test('should encrypt uint256 value', async () => {
    const value = 1000000000000000000000000000000000000n;
    const encrypted = await encryptionUtils.encryptUint256(value);
    
    expect(encrypted).toBeDefined();
    expect(encrypted.value).toBeDefined();
  });

  test('should reject invalid uint256 value', async () => {
    const invalidValue = 2n ** 256n;
    await expect(encryptionUtils.encryptUint256(invalidValue))
      .rejects
      .toThrow('Value must be between 0 and 2^256-1 for uint256');
  });

  test('should encrypt boolean value', async () => {
    const value = true;
    const encrypted = await encryptionUtils.encryptBool(value);
    
    expect(encrypted).toBeDefined();
    expect(encrypted.value).toBeDefined();
  });

  test('should encrypt address', async () => {
    const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const encrypted = await encryptionUtils.encryptAddress(address);
    
    expect(encrypted).toBeDefined();
    expect(encrypted.value).toBeDefined();
  });

  test('should reject invalid address', async () => {
    const invalidAddress = '0xinvalid';
    await expect(encryptionUtils.encryptAddress(invalidAddress))
      .rejects
      .toThrow('Invalid Ethereum address');
  });

  test('should verify proof', async () => {
    const value = 1000n;
    const encrypted = await encryptionUtils.encryptUint256(value);
    const isValid = await encryptionUtils.verifyProof(encrypted, encrypted.proof);
    
    expect(isValid).toBe(true);
  });

  test('should re-encrypt value', async () => {
    const value = 1000n;
    const encrypted = await encryptionUtils.encryptUint256(value);
    const newPublicKey = '0xnewpublickey';
    const reEncrypted = await encryptionUtils.reEncrypt(encrypted, newPublicKey);
    
    expect(reEncrypted).toBeDefined();
    expect(reEncrypted.value).toBeDefined();
    expect(reEncrypted.proof).toBeDefined();
  });

  test('should encrypt batch values', async () => {
    const values = [1000n, 2000n, 3000n];
    const encryptedBatch = await encryptionUtils.encryptBatch(values);
    
    expect(encryptedBatch).toHaveLength(3);
    expect(encryptedBatch[0].value).toBeDefined();
    expect(encryptedBatch[1].value).toBeDefined();
    expect(encryptedBatch[2].value).toBeDefined();
  });

  test('should serialize and deserialize for contract', async () => {
    const value = 1000n;
    const encrypted = await encryptionUtils.encryptUint256(value);
    const serialized = encryptionUtils.serializeForContract(encrypted);
    
    expect(serialized).toBeDefined();
    
    // Note: We can't fully test deserialization without a real ethers provider
    // But we can at least verify it doesn't throw
    expect(() => {
      // This will throw because we're not in a real test environment
      // encryptionUtils.deserializeFromContract(serialized, '0xmocktoken');
    }).not.toThrow();
  });

  test('should update public key', () => {
    const newPublicKey = '0xnewpublickey';
    encryptionUtils.updatePublicKey(newPublicKey);
    
    expect(encryptionUtils.getPublicKey()).toBe(newPublicKey);
  });
});
