export const generateProofTransactions = jest.fn().mockResolvedValue({
  provedTransactions: [],
  preTransactionPOIsPerList: [],
  transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234'
});

export const populateProvedTransfer = jest.fn().mockResolvedValue({
  serializedTransaction: '0x1234567890123456789012345678901234567890123456789012345678901234',
  nullifiers: [],
  commitments: [],
  unshieldData: null
});

export const TXIDVersion = {
  V2_PoseidonMerkle: 'V2_PoseidonMerkle'
};

export const ProofType = {
  Transfer: 'transfer',
  Deposit: 'deposit',
  Withdraw: 'withdraw'
};

export type RailgunERC20AmountRecipient = {
  tokenAddress: string;
  amount: bigint;
  recipientAddress: string;
};
