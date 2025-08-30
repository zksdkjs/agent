/**
 * Core types and interfaces for zkSDK
 * The LangChain of Privacy
 */

/**
 * Supported blockchain networks
 */
export type Network = 
  | 'ethereum'
  | 'polygon'
  | 'arbitrum'
  | 'base'
  | 'optimism'
  | 'solana'
  | 'aztec'
  | 'midnight'
  | string;

/**
 * Privacy levels for transactions
 */
export type PrivacyLevel = 
  | 'anonymous'  // Full privacy
  | 'shielded'   // Basic shielding
  | 'public';    // No privacy

/**
 * Token information
 */
export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  name?: string;
}

/**
 * Transfer parameters
 */
export interface TransferParams {
  chain: Network;
  token: string; // Token address or symbol
  amount: string; // Amount in smallest unit (wei, lamports, etc.)
  to: string; // Recipient address
  privacy: PrivacyLevel;
  memo?: string; // Optional memo/message
}

/**
 * Transfer result
 */
export interface TransferResult {
  transactionHash: string;
  status: 'pending' | 'success' | 'failed';
  explorerUrl?: string;
  fee?: string; // Fee paid in native token
  timestamp: number;
}

/**
 * Balance information
 */
export interface Balance {
  token: Token;
  balance: string; // Balance in smallest unit
  usdValue?: number; // Optional USD value
}

/**
 * Provider configuration
 */
export interface ProviderConfig {
  apiKey?: string;
  rpcUrl?: string;
  network?: Network;
  [key: string]: any; // Provider-specific configuration
}

/**
 * Base interface for all privacy providers
 */
export abstract class BasePrivacyProvider {
  abstract name: string;
  protected config: ProviderConfig;

  constructor(config: ProviderConfig = {}) {
    this.config = config;
  }

  /**
   * Initialize the provider with configuration
   */
  abstract initialize(config: ProviderConfig): Promise<void>;

  /**
   * Execute a private transfer
   */
  abstract transfer(params: TransferParams): Promise<TransferResult>;

  /**
   * Get private balances
   */
  abstract getBalances(address: string): Promise<Balance[]>;

  /**
   * Get transaction status
   */
  abstract getTransactionStatus(txHash: string): Promise<TransferResult>;

  /**
   * Validate transfer parameters
   */
  protected validateTransferParams(params: TransferParams): void {
    if (!params.chain) {
      throw new Error('Chain is required');
    }
    if (!params.token) {
      throw new Error('Token is required');
    }
    if (!params.amount || params.amount === '0') {
      throw new Error('Amount must be greater than 0');
    }
    if (!params.to) {
      throw new Error('Recipient address is required');
    }
    if (!params.privacy) {
      throw new Error('Privacy level is required');
    }
  }
}
