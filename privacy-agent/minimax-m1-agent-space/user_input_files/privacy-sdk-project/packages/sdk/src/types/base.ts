/**
 * Base types and interfaces for the Privacy SDK
 */

// Chain and Network Types
export type ChainId = number | string;
export type NetworkType = 'mainnet' | 'testnet' | 'devnet';

// Address Types
export type Address = string;
export type PrivateAddress = string; // Stealth/private address
export type PublicAddress = string;  // Standard blockchain address

// Amount and Token Types
export type Amount = string; // Use string to avoid precision loss

export interface TokenInfo {
  address: Address;
  symbol: string;
  decimals: number;
  name?: string;
}

// Transaction Types
export type TransactionHash = string;
export type ProofData = string | Uint8Array;

// Status Types
export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';
export type ProviderStatus = 'uninitialized' | 'initializing' | 'ready' | 'error';

export type TransactionType = 
  | 'transfer'
  | 'swap'
  | 'deposit'
  | 'withdraw'
  | 'vote'
  | 'signal'
  | 'custom';

export type ProviderEvent = 
  | 'initialized'
  | 'status_changed'
  | 'transaction_pending'
  | 'transaction_confirmed'
  | 'transaction_failed'
  | 'balance_updated'
  | 'error';

export interface EventData {
  provider: string;
  timestamp: number;
  [key: string]: any;
}