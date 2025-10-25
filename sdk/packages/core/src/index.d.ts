/**
 * Core types and interfaces for zkSDK
 * The LangChain of Privacy
 */
/**
 * Supported blockchain networks
 */
export type Network = 'ethereum' | 'polygon' | 'arbitrum' | 'base' | 'optimism' | 'solana' | 'aztec' | 'midnight' | string;
/**
 * Privacy levels for transactions
 */
export type PrivacyLevel = 'anonymous' | 'shielded' | 'public';
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
    token: string;
    amount: string;
    to: string;
    privacy: PrivacyLevel;
    memo?: string;
}
/**
 * Transfer result
 */
export interface TransferResult {
    transactionHash: string;
    status: 'pending' | 'success' | 'failed';
    explorerUrl?: string;
    fee?: string;
    timestamp: number;
}
/**
 * Balance information
 */
export interface Balance {
    token: Token;
    balance: string;
    usdValue?: number;
}
/**
 * Provider configuration
 */
export interface ProviderConfig {
    apiKey?: string;
    rpcUrl?: string;
    network?: Network;
    [key: string]: any;
}
/**
 * Base interface for all privacy providers
 */
export declare abstract class BasePrivacyProvider {
    abstract name: string;
    protected config: ProviderConfig;
    constructor(config?: ProviderConfig);
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
    protected validateTransferParams(params: TransferParams): void;
}
//# sourceMappingURL=index.d.ts.map