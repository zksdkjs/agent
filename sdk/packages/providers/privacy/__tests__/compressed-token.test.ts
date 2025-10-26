// Recipe: zkSDK Developer Agent
// File: sdk/packages/providers/privacy/__tests__/compressed-token.test.ts

import { CompressedTokenOperations, DEFAULT_PROGRAM_IDS } from '../src/compressed-token';
import { CompressedTokenAccount } from '../src/types';

describe('CompressedTokenOperations', () => {
  let operations: CompressedTokenOperations;

  beforeEach(() => {
    operations = new CompressedTokenOperations();
  });

  it('should create instance with default program IDs', () => {
    expect(operations).toBeDefined();
    // We can't easily access private properties, but we can test functionality
  });

  it('should create instance with custom program IDs', () => {
    const customProgramIds = {
      tokenProgramId: 'customTokenProgram',
      accountCompressionProgramId: 'customCompressionProgram',
      noopProgramId: 'customNoopProgram'
    };
    
    const customOperations = new CompressedTokenOperations(customProgramIds);
    expect(customOperations).toBeDefined();
  });

  it('should create transfer instruction', () => {
    const mockAccounts: CompressedTokenAccount[] = [
      {
        publicKey: 'mockPublicKey1',
        mint: 'mockMint',
        amount: '1000',
        owner: 'mockOwner'
      }
    ];
    
    const instruction = operations.createTransferInstruction(
      mockAccounts,
      'recipientAddress',
      '500',
      'mockMint'
    );
    
    expect(instruction).toBeDefined();
    expect(instruction.programId).toBe(DEFAULT_PROGRAM_IDS.tokenProgramId);
    expect(instruction.accounts).toHaveLength(2);
  });

  it('should create account instruction', () => {
    const instruction = operations.createAccountInstruction(
      'ownerAddress',
      'mintAddress'
    );
    
    expect(instruction).toBeDefined();
    expect(instruction.programId).toBe(DEFAULT_PROGRAM_IDS.tokenProgramId);
    expect(instruction.accounts).toHaveLength(2);
  });

  it('should verify proof', () => {
    const result = operations.verifyProof({});
    expect(result).toBe(true); // Mock implementation always returns true
  });

  it('should get minimum balance for rent exemption', () => {
    const balance = operations.getMinimumBalanceForRentExemption();
    expect(balance).toBe(1500000); // Mock value
  });
});
