// src/types.ts
import { PublicKey, TransactionSignature } from '@solana/web3.js';

// Compressed Account interface
export interface CompressedAccount {
  publicKey: PublicKey;
  lamports: number;
  owner: PublicKey;
  data: Buffer;
  compressed: boolean;
}

// Compressed Token Account interface
export interface CompressedTokenAccount {
  mint: PublicKey;
  owner: PublicKey;
  amount: bigint;
  delegate?: PublicKey;
  delegatedAmount?: bigint;
  isNative?: boolean;
  closeAuthority?: PublicKey;
}

// Compressed NFT interface
export interface CompressedNFT {
  mint: PublicKey;
  owner: PublicKey;
  metadata: NFTMetadata;
  edition?: number;
  collection?: PublicKey;
}

// NFT Metadata interface
export interface NFTMetadata {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Creator[];
  collection?: Collection;
  uses?: Uses;
}

// Creator interface
export interface Creator {
  address: PublicKey;
  verified: boolean;
  share: number;
}

// Collection interface
export interface Collection {
  verified: boolean;
  key: PublicKey;
}

// Uses interface
export interface Uses {
  useMethod: UseMethod;
  remaining: number;
  total: number;
}

export enum UseMethod {
  Burn,
  Multiple,
  Single
}

// RPC Response interfaces
export interface GetCompressedAccountResponse {
  account: CompressedAccount | null;
  proof: string[];
}

export interface GetCompressedBalanceResponse {
  balance: number;
}

export interface GetCompressedTokenBalanceResponse {
  amount: bigint;
  decimals: number;
}

// Transaction interfaces
export interface CompressedTransaction {
  signature: TransactionSignature;
  compressionInfo: CompressionInfo;
}

export interface CompressionInfo {
  compressedAccounts: PublicKey[];
  decompressedAccounts: PublicKey[];
  createdAccounts: PublicKey[];
  closedAccounts: PublicKey[];
}
