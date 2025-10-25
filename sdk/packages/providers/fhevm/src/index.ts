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
export * from './types';

// Re-export common types
export type {
  FHEVMProviderOptions,
  EncryptedBalance,
  ConfidentialTransferParams,
  ConfidentialSwapParams,
  BlindAuctionParams,
  FHEProof
} from './types';