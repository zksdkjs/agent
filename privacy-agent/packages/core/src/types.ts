// Core types for zkSDK - Universal Private Transfer Interface
// Phase 1: Railgun (EVM), Aztec (L2), Solana Privacy
// Phase 2: Midnight (Cardano), Mina, Zama FHE

export type ChainType = 
  // Phase 1 - Core Foundation
  | 'ethereum'
  | 'polygon' 
  | 'arbitrum'
  | 'aztec'
  | 'solana'
  // Phase 2 - Extended Integration  
  | 'midnight'
  | 'mina'
  | 'fhenix';

export type PrivacyLevel = 
  | 'anonymous'    // Full anonymity (Railgun, Aztec)
  | 'shielded'     // Amount hidden (partial privacy)
  | 'confidential' // FHE-based privacy (Zama)
  | 'zkproof';     // Zero-knowledge proofs (Midnight, Mina)

export interface TransferParams {
  chain: ChainType;
  token: string;           // Contract address or 'native'
  amount: string;          // Amount in token units
  to: string;              // Recipient address
  privacy: PrivacyLevel;   // Level of privacy desired
  memo?: string;           // Optional encrypted memo
}

export interface TransferResult {
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: string;
  proofTime?: number;      // Time to generate proof (ms)
  privateNote?: string;    // Private transaction note
}

export interface ProviderConfig {
  name: string;
  chains: ChainType[];
  privacyLevels: PrivacyLevel[];
  gasEstimate: (params: TransferParams) => Promise<string>;
  proofTimeEstimate: (params: TransferParams) => Promise<number>;
}

// Provider interface that all privacy systems must implement
export interface PrivacyProvider {
  name: string;
  config: ProviderConfig;
  
  // Core transfer functionality
  transfer(params: TransferParams): Promise<TransferResult>;
  
  // Balance queries (private)
  getBalance(address: string, token: string): Promise<string>;
  
  // Transaction history (private)
  getTransactionHistory(address: string): Promise<TransferResult[]>;
  
  // Setup and configuration
  initialize(config: any): Promise<void>;
  isReady(): Promise<boolean>;
}