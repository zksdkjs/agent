/**
 * Contract Service for Aztec Provider
 * 
 * This module handles interactions with Noir contracts on the Aztec network.
 * It provides functionality for contract deployment and interaction.
 */

import {
  createLogger,
  PXE,
  ContractDeployer,
  ContractInstanceWithAddress,
  AztecAddress,
  Fr,
  AccountWallet,
  TxStatus,
  FieldElement,
  SponsoredFeePaymentMethod,
  ContractArtifact
} from '@aztec/aztec.js';
import { ProviderError, ValidationError } from '../../../core/errors';
import { getPXEService } from './pxe-service';
import { getAccountService } from './account-service';

// Logger for the contract service
const logger = createLogger('privacy-sdk:aztec:contract');

/**
 * Interface for contract deployment parameters
 */
export interface DeployContractParams {
  contractArtifact: ContractArtifact;
  constructorArgs?: any[];
  salt?: Fr;
  walletAddress?: string;
  sponsoredFee?: boolean;
}

/**
 * Interface for contract interaction parameters
 */
export interface ContractCallParams {
  contractAddress: string;
  contractArtifact: ContractArtifact;
  method: string;
  args: any[];
  walletAddress?: string;
  sponsoredFee?: boolean;
}

/**
 * Contract Service class for managing Aztec contract interactions
 */
export class ContractService {
  private pxe: PXE | null = null;
  private contractDeployer: ContractDeployer | null = null;
  private deployedContracts: Map<string, ContractInstanceWithAddress> = new Map();

  /**
   * Initialize the contract service with a PXE instance
   */
  async initialize(pxe?: PXE): Promise<void> {
    if (this.pxe && this.contractDeployer) {
      return;
    }

    try {
      // Get or initialize PXE
      this.pxe = pxe || await getPXEService().getPXE();
      
      // Create contract deployer
      this.contractDeployer = new ContractDeployer(this.pxe);
      
      logger.info('Contract service initialized');
    } catch (error) {
      logger.error('Failed to initialize contract service', error);
      throw new ProviderError(
        'Failed to initialize Aztec contract service',
        'aztec',
        { originalError: error }
      );
    }
  }

  /**
   * Deploy a contract to the Aztec network
   */
  async deployContract(params: DeployContractParams): Promise<ContractInstanceWithAddress> {
    await this.ensureInitialized();

    try {
      // Get the wallet to deploy with
      const wallet = params.walletAddress
        ? getAccountService().getWallet(params.walletAddress)
        : getAccountService().getDefaultWallet();
      
      logger.info(`Deploying contract using wallet: ${wallet.getAddress().toString()}`);
      
      // Create contract instance with artifact and constructor args
      const contractArtifact = params.contractArtifact;
      const constructorArgs = params.constructorArgs || [];
      
      // Determine fee payment method
      const feePaymentMethod = params.sponsoredFee
        ? new SponsoredFeePaymentMethod()
        : undefined;
      
      // Deploy the contract
      logger.info('Deploying contract...');
      const contract = await this.contractDeployer!.deploy(
        contractArtifact,
        constructorArgs,
        { salt: params.salt, feePaymentMethod }
      );
      
      // Save the deployed contract
      const contractAddress = contract.address.toString();
      this.deployedContracts.set(contractAddress, contract);
      
      logger.info(`Contract deployed at address: ${contractAddress}`);
      
      return contract;
    } catch (error) {
      logger.error('Failed to deploy contract', error);
      throw new ProviderError(
        'Failed to deploy Aztec contract',
        'aztec',
        { originalError: error }
      );
    }
  }

  /**
   * Interact with a contract on the Aztec network
   */
  async callContract(params: ContractCallParams): Promise<any> {
    await this.ensureInitialized();

    try {
      // Get the wallet to use for the interaction
      const wallet = params.walletAddress
        ? getAccountService().getWallet(params.walletAddress)
        : getAccountService().getDefaultWallet();
      
      // Get or create contract instance
      const contractAddress = AztecAddress.fromString(params.contractAddress);
      let contract = this.deployedContracts.get(params.contractAddress);
      
      if (!contract) {
        // Create a new contract instance if we don't have one cached
        contract = await this.pxe!.getContractInstance(
          params.contractArtifact,
          contractAddress
        );
        this.deployedContracts.set(params.contractAddress, contract);
      }
      
      // Determine fee payment method
      const feePaymentMethod = params.sponsoredFee
        ? new SponsoredFeePaymentMethod()
        : undefined;
      
      // Call the contract method
      const method = params.method;
      const args = params.args;
      
      logger.info(`Calling contract method ${method} at ${params.contractAddress}`);
      
      // Make the call
      const tx = await contract.methods[method](...args)
        .send({ feePaymentMethod })
        .wait();
      
      logger.info(`Contract call completed with status: ${tx.status}`);
      
      // Return transaction result
      return {
        tx,
        status: tx.status,
        hash: tx.txHash.toString()
      };
    } catch (error) {
      logger.error('Failed to call contract', error);
      throw new ProviderError(
        'Failed to call Aztec contract',
        'aztec',
        { originalError: error }
      );
    }
  }

  /**
   * Get a deployed contract instance by address
   */
  async getContract(
    contractAddress: string,
    contractArtifact: ContractArtifact
  ): Promise<ContractInstanceWithAddress> {
    await this.ensureInitialized();

    try {
      // Check if we have the contract cached
      let contract = this.deployedContracts.get(contractAddress);
      
      if (!contract) {
        // Create a new contract instance
        const address = AztecAddress.fromString(contractAddress);
        contract = await this.pxe!.getContractInstance(contractArtifact, address);
        this.deployedContracts.set(contractAddress, contract);
      }
      
      return contract;
    } catch (error) {
      logger.error(`Failed to get contract at address: ${contractAddress}`, error);
      throw new ProviderError(
        `Failed to get Aztec contract at address: ${contractAddress}`,
        'aztec',
        { originalError: error }
      );
    }
  }

  /**
   * Check if the service is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.pxe || !this.contractDeployer) {
      await this.initialize();
    }
  }
}

// Singleton instance for shared use
let contractServiceInstance: ContractService | null = null;

/**
 * Get the shared contract service instance
 */
export function getContractService(): ContractService {
  if (!contractServiceInstance) {
    contractServiceInstance = new ContractService();
  }
  return contractServiceInstance;
}

/**
 * Reset the shared contract service instance
 * Mainly used for testing purposes
 */
export function resetContractService(): void {
  contractServiceInstance = null;
}