/**
 * @module @zksdk/provider-fhevm
 * Zama fhEVM Provider - Fully Homomorphic Encryption for Confidential Smart Contracts
 * 
 * This provider enables:
 * - Confidential token transfers with encrypted balances
 * - Private DeFi operations (swaps, lending, auctions)
 * - Encrypted on-chain computation without revealing data
 * - Post-quantum secure cryptography
 */

export { FHEVMProvider } from './provider';
export { FHEVMConfig, EncryptedAmount, ConfidentialTransaction } from './types';
export { ConfidentialERC20 } from './contracts/confidential-erc20';
export { ConfidentialDEX } from './contracts/confidential-dex';
export { EncryptionUtils } from './utils/encryption';
export { FHEOperations } from './operations';

// Re-export common types
export type {
  FHEVMProviderOptions,
  EncryptedBalance,
  ConfidentialTransferParams,
  ConfidentialSwapParams,
  BlindAuctionParams,
  FHEProof
} from './types';