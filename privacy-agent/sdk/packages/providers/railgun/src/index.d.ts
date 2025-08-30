/**
 * Railgun Provider for zkSDK
 * Production-ready EVM privacy system with Recipe→Step→ComboMeal pattern integration
 */
import { BasePrivacyProvider, ProviderConfig, TransferParams, TransferResult, Balance } from '@zksdk/core';
export interface RailgunConfig extends ProviderConfig {
    walletMnemonic?: string;
    walletPrivateKey?: string;
    rpcEndpoints?: Record<string, string>;
    engineDbPath?: string;
}
export declare class RailgunProvider extends BasePrivacyProvider {
    name: string;
    private initialized;
    private railgunEngine;
    private railgunWallet;
    constructor(config?: RailgunConfig);
    /**
     * Initialize the Railgun provider
     */
    initialize(config: RailgunConfig): Promise<void>;
    /**
     * Check if the provider is ready for operations
     */
    isReady(): Promise<boolean>;
    /**
     * Execute a private transfer using the Recipe→Step→ComboMeal pattern
     */
    transfer(params: TransferParams): Promise<TransferResult>;
    /**
     * Get private balances
     */
    getBalances(address: string): Promise<Balance[]>;
    /**
     * Get transaction status
     */
    getTransactionStatus(txHash: string): Promise<TransferResult>;
    /**
     * Map network name to Railgun network identifier
     */
    private getRailgunNetwork;
    /**
     * Get explorer URL for a network
     */
    private getExplorerUrl;
    /**
     * Validate transfer parameters
     */
    private validateTransferParams;
}
//# sourceMappingURL=index.d.ts.map