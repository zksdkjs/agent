// src/light-provider.ts
import { BasePrivacyProvider, ProviderConfig, TransferParams, TransferResult, Balance } from '@zksdk/core';
import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PrivacyCash } from 'privacycash';

/**
 * Privacy Cash Provider for Solana using privacy-cash-sdk
 * 
 * This provider implements the BasePrivacyProvider interface to enable
 * private transactions on Solana using Privacy Cash's ZK compression.
 */
export class LightProtocolPrivacyProvider extends BasePrivacyProvider {
  name = 'light-protocol';
  private privacyCashClient: PrivacyCash | null = null;
  private keypair: Keypair | null = null;
  private connection: Connection | null = null;

  constructor(config: ProviderConfig = {}) {
    super(config);
  }

  /**
   * Initialize the provider with configuration
   * @param config Provider configuration including RPC URL and wallet
   */
  async initialize(config: ProviderConfig): Promise<void> {
    this.config = { ...this.config, ...config };
    
    // Validate required configuration
    if (!this.config.rpcUrl) {
      throw new Error('RPC URL is required for Privacy Cash provider');
    }
    
    if (!this.config.privateKey) {
      throw new Error('Private key is required for Privacy Cash provider');
    }
    
    // Create Solana connection
    this.connection = new Connection(this.config.rpcUrl, 'confirmed');
    
    // Create keypair from private key
    try {
      const secretKey = Uint8Array.from(Object.values(this.config.privateKey));
      this.keypair = Keypair.fromSecretKey(secretKey);
    } catch (error) {
      throw new Error('Invalid private key provided');
    }
    
    // Initialize privacy-cash-sdk client
    this.privacyCashClient = new PrivacyCash({
      RPC_url: this.config.rpcUrl,
      owner: this.keypair
    });
  }

  /**
   * Execute a private transfer using privacy-cash-sdk
   * @param params Transfer parameters
   * @returns Transfer result with transaction hash
   */
  async transfer(params: TransferParams): Promise<TransferResult> {
    if (!this.privacyCashClient) {
      throw new Error('Provider not initialized. Call initialize() first.');
    }
    
    // Validate transfer parameters
    this.validateTransferParams(params);
    
    // Convert amount to lamports (assuming SOL for now)
    const amountInLamports = Math.floor(parseFloat(params.amount) * LAMPORTS_PER_SOL);
    
    try {
      // Execute deposit through privacy-cash-sdk
      const result = await this.privacyCashClient.deposit({
        lamports: amountInLamports
      });
      
      return {
        transactionHash: result.txid,
        status: 'success',
        timestamp: Date.now(),
        fee: (result.fee_in_lamports / LAMPORTS_PER_SOL).toString()
      };
    } catch (error) {
      return {
        transactionHash: '',
        status: 'failed',
        timestamp: Date.now(),
        fee: '0'
      };
    }
  }

  /**
   * Get private balances using privacy-cash-sdk
   * @param address Wallet address (unused since we use the keypair from initialization)
   * @returns Array of balance information
   */
  async getBalances(address: string): Promise<Balance[]> {
    if (!this.privacyCashClient) {
      throw new Error('Provider not initialized. Call initialize() first.');
    }
    
    try {
      // Get private balance from privacy-cash-sdk
      const balance = await this.privacyCashClient.getPrivateBalance();
      
      // Return balance in the expected format
      return [{
        token: {
          address: 'So11111111111111111111111111111111111111112', // SOL mint address
          symbol: 'SOL',
          decimals: 9,
          name: 'Solana'
        },
        balance: balance.lamports.toString(),
        usdValue: undefined
      }];
    } catch (error) {
      throw new Error(`Failed to get balances: ${error}`);
    }
  }

  /**
   * Get transaction status
   * @param txHash Transaction hash
   * @returns Transfer result with status
   */
  async getTransactionStatus(txHash: string): Promise<TransferResult> {
    if (!this.connection) {
      throw new Error('Provider not initialized. Call initialize() first.');
    }
    
    try {
      const signatureStatus = await this.connection.getSignatureStatus(txHash);
      
      return {
        transactionHash: txHash,
        status: signatureStatus.value?.confirmationStatus === 'confirmed' ? 'success' : 
                signatureStatus.value?.err ? 'failed' : 'pending',
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        transactionHash: txHash,
        status: 'failed',
        timestamp: Date.now()
      };
    }
  }
}
