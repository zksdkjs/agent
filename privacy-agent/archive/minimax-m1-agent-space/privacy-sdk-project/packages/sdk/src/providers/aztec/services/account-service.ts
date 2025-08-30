/**
 * Account Service for Aztec Provider
 * 
 * This module handles account creation, management, and signing operations
 * for the Aztec provider. It works with Schnorr accounts which are the
 * default account type in Aztec.
 */

import {
  AccountManager,
  AccountWallet,
  createLogger,
  AztecAddress,
  Fr,
  PXE,
  CompleteAddress,
  SponsoredFeePaymentMethod
} from '@aztec/aztec.js';
import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { deriveSigningKey } from '@aztec/stdlib/keys';
import { ProviderError, ValidationError } from '../../../core/errors';
import { getPXEService } from './pxe-service';

// Logger for the account service
const logger = createLogger('privacy-sdk:aztec:account');

/**
 * Interface for account creation parameters
 */
export interface CreateAccountParams {
  mnemonic?: string;
  privateKey?: string;
  deployNow?: boolean;
  waitForDeployment?: boolean;
}

/**
 * Interface for account information
 */
export interface AccountInfo {
  address: string;
  publicKey: string;
  isDeployed: boolean;
}

/**
 * Account Service class for managing Aztec accounts
 */
export class AccountService {
  private pxe: PXE | null = null;
  private accountManager: AccountManager | null = null;
  private wallets: Map<string, AccountWallet> = new Map();
  private defaultWallet: AccountWallet | null = null;

  /**
   * Initialize the account service with a PXE instance
   */
  async initialize(pxe?: PXE): Promise<void> {
    if (this.pxe && this.accountManager) {
      return;
    }

    try {
      // Get or initialize PXE
      this.pxe = pxe || await getPXEService().getPXE();
      
      // Create account manager
      this.accountManager = new AccountManager(this.pxe);
      
      logger.info('Account service initialized');
    } catch (error) {
      logger.error('Failed to initialize account service', error);
      throw new ProviderError(
        'Failed to initialize Aztec account service',
        'aztec',
        { originalError: error }
      );
    }
  }

  /**
   * Create a new account
   */
  async createAccount(params: CreateAccountParams = {}): Promise<AccountInfo> {
    await this.ensureInitialized();

    try {
      logger.info('Creating new Aztec account');
      
      // Derive signing key from mnemonic or private key or generate a new one
      let signingKey: Fr;
      if (params.mnemonic) {
        signingKey = deriveSigningKey(params.mnemonic, 0); // Derive from mnemonic with index 0
      } else if (params.privateKey) {
        signingKey = Fr.fromString(params.privateKey);
      } else {
        // Generate a random signing key
        signingKey = Fr.random();
      }
      
      // Create a Schnorr account
      const account = await getSchnorrAccount(this.pxe!, signingKey);
      
      // Get wallet for the account
      const accountWallet = await this.accountManager!.addAccount(account);
      
      // Deploy account if requested
      if (params.deployNow) {
        await this.deployAccount(accountWallet, params.waitForDeployment);
      }
      
      // Save the wallet
      const address = accountWallet.getAddress().toString();
      this.wallets.set(address, accountWallet);
      
      // Set as default if it's the first wallet
      if (!this.defaultWallet) {
        this.defaultWallet = accountWallet;
      }
      
      logger.info(`Created account with address: ${address}`);
      
      return {
        address: address,
        publicKey: account.getCompleteAddress().publicKey.toString(),
        isDeployed: params.deployNow === true
      };
    } catch (error) {
      logger.error('Failed to create account', error);
      throw new ProviderError(
        'Failed to create Aztec account',
        'aztec',
        { originalError: error }
      );
    }
  }

  /**
   * Import an existing account
   */
  async importAccount(privateKey: string, deployNow: boolean = false): Promise<AccountInfo> {
    return this.createAccount({
      privateKey,
      deployNow,
      waitForDeployment: true
    });
  }

  /**
   * Deploy an account to the network
   */
  async deployAccount(
    walletOrAddress: AccountWallet | string,
    waitForDeployment: boolean = true
  ): Promise<void> {
    await this.ensureInitialized();

    try {
      const wallet = typeof walletOrAddress === 'string'
        ? this.getWallet(walletOrAddress)
        : walletOrAddress;
      
      logger.info(`Deploying account: ${wallet.getAddress().toString()}`);
      
      // Check if already deployed
      const isDeployed = await this.pxe!.isAccountDeployed(wallet.getAddress());
      if (isDeployed) {
        logger.info('Account already deployed, skipping deployment');
        return;
      }
      
      // Use sponsored fee payment method for deployment
      // In production, this would likely be different
      const tx = await wallet.deploy(
        new SponsoredFeePaymentMethod()
      );
      
      if (waitForDeployment) {
        logger.info('Waiting for account deployment transaction to be mined...');
        await tx.wait();
        logger.info('Account successfully deployed');
      } else {
        logger.info('Account deployment transaction submitted');
      }
    } catch (error) {
      logger.error('Failed to deploy account', error);
      throw new ProviderError(
        'Failed to deploy Aztec account',
        'aztec',
        { originalError: error }
      );
    }
  }

  /**
   * Get a wallet by address
   */
  getWallet(address: string): AccountWallet {
    const wallet = this.wallets.get(address);
    if (!wallet) {
      throw new ValidationError(
        `Wallet not found for address: ${address}`,
        'address',
        'aztec'
      );
    }
    return wallet;
  }

  /**
   * Get the default wallet
   */
  getDefaultWallet(): AccountWallet {
    if (!this.defaultWallet) {
      throw new ProviderError(
        'No default wallet available. Please create an account first.',
        'aztec'
      );
    }
    return this.defaultWallet;
  }

  /**
   * Set the default wallet
   */
  setDefaultWallet(address: string): void {
    const wallet = this.getWallet(address);
    this.defaultWallet = wallet;
  }

  /**
   * Get all accounts
   */
  getAccounts(): AccountInfo[] {
    return Array.from(this.wallets.values()).map(wallet => {
      const address = wallet.getAddress().toString();
      const completeAddress = wallet.getCompleteAddress();
      return {
        address,
        publicKey: completeAddress.publicKey.toString(),
        isDeployed: false // We'd need to check this async, so defaulting to false
      };
    });
  }

  /**
   * Check if the service is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.pxe || !this.accountManager) {
      await this.initialize();
    }
  }
}

// Singleton instance for shared use
let accountServiceInstance: AccountService | null = null;

/**
 * Get the shared account service instance
 */
export function getAccountService(): AccountService {
  if (!accountServiceInstance) {
    accountServiceInstance = new AccountService();
  }
  return accountServiceInstance;
}

/**
 * Reset the shared account service instance
 * Mainly used for testing purposes
 */
export function resetAccountService(): void {
  accountServiceInstance = null;
}