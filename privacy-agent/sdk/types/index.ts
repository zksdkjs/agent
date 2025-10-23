/**
 * Shared types for zkSDK providers
 */

// Import base types from core module
import type { Network, PrivacyLevel, Token } from '@zksdk/core';

// Chain ID type
export type ChainId = number;

// Base types from core
export type { TransferParams, TransferResult, Balance, ProviderConfig } from '@zksdk/core';

// Token information specific to privacy protocols
export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  isNative?: boolean;
}

// Private transaction parameters
export interface PrivateTransactionParams {
  fromAddress?: string;
  toAddress: string;
  amount: string;
  tokenAddress?: string;
  memo?: string;
  fee?: string;
}

// Balance parameters
export interface BalanceParams {
  address: string;
  tokenAddress?: string;
}

// Private balance information
export interface PrivateBalance {
  address: string;
  balances: {
    token: TokenInfo;
    balance: string;
    usdValue?: number;
  }[];
  lastUpdated: number;
}

// Transaction history parameters
export interface HistoryParams {
  address: string;
  limit?: number;
  offset?: number;
}

// Transaction information
export interface Transaction {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  from?: string;
  to?: string;
  amount?: string;
  token?: TokenInfo;
  fee?: string;
}

// Transaction result details for provider operations
export interface TransactionResult {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  provider: string;
  chainId: ChainId;
  timestamp: number;
  transactions?: {
    hash: string;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: number;
  }[];
  success?: boolean;
}

// Private address information
export interface PrivateAddressInfo {
  address: string;
  metadata?: {
    provider: string;
    timestamp: number;
    publicKey?: string;
    [key: string]: any;
  };
}

// Provider information
export interface ProviderInfo {
  name: string;
  version: string;
  description: string;
  website?: string;
  documentation?: string;
  supportedChains: {
    chainId: ChainId;
    name: string;
    networkType: 'mainnet' | 'testnet' | 'devnet';
    nativeCurrency: TokenInfo;
  }[];
  capabilities: {
    name: string;
    description: string;
    enabled: boolean;
  }[];
  limits: {
    [key: string]: any;
  };
}

// Operation information
export interface Operation {
  name: string;
  description: string;
  parameters: { [key: string]: string };
  returnType: string;
}

// Contract deployment parameters
export interface DeployContractParams {
  artifact: any; // Contract artifact
  constructorArgs?: any[];
  salt?: string;
  walletAddress?: string;
  sponsoredFee?: boolean;
}

// Contract call parameters
export interface ContractCallParams {
  contractAddress: string;
  artifact: any; // Contract artifact
  method: string;
  args?: any[];
  walletAddress?: string;
  sponsoredFee?: boolean;
}

// Contract result
export interface ContractResult {
  address: string;
  transactionHash?: string;
  status: 'pending' | 'deployed' | 'failed';
  provider: string;
  chainId: ChainId;
  timestamp: number;
}
