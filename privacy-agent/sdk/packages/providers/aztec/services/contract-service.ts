/**
 * Contract Service for Aztec Provider
 * 
 * This module handles interactions with Noir contracts on the Aztec network.
 * It provides functionality for contract deployment and interaction.
 */

import {
  createLogger,
  PXE,
  Contract,
  AztecAddress,
  Fr,
  AccountWallet,
  TxStatus,
  TxHash
} from '@aztec/aztec.js';
import { ProviderError, ValidationError } from '@zksdk/core';
import { getPXEService } from './pxe-service.js';
import { getAccountService } from './account-service.js';

// Logger for the contract service
const logger = createLogger('privacy-sdk:aztec:contract');

/**
 * Interface for contract deployment parameters
 */
export interface DeployContractParams {
  contractArtifact: any; // ContractArtifact type
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
  contractArtifact: any; // ContractArtifact type
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
  private deployedContracts: Map<string, Contract> = new Map();

  /**
   * Initialize the contract service with a PXE instance
   */
  async initialize(pxe?: PXE): Promise<void> {
    if (this.pxe) {
      return;
    }

    try {
      // Get or initialize PXE
      this.pxe = pxe || await getPXEService().getPXE();
      
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
  async deployContract(params: DeployContractParams): Promise<Contract> {
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
      
      // Deploy the contract
      logger.info('Deploying contract...');
      const deployMethod = Contract.deploy(
        wallet,
        contractArtifact,
        constructorArgs
      );
      
      // Send the deployment transaction
      const sentTx = deployMethod.send();
      
      // Wait for deployment to complete
      const contract = await sentTx.deployed();
      
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
        contract = await Contract.at(
          contractAddress,
          params.contractArtifact,
          wallet
        );
        this.deployedContracts.set(params.contractAddress, contract);
      }
      
      // Call the contract method
      const method = params.method;
      const args = params.args;
      
      logger.info(`Calling contract method ${method} at ${params.contractAddress}`);
      
      // Make the call
      const tx = await contract.methods[method](...args)
        .send()
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
    contractArtifact: any // ContractArtifact type
  ): Promise<Contract> {
    await this.ensureInitialized();

    try {
      // Check if we have the contract cached
      let contract = this.deployedContracts.get(contractAddress);
      
      if (!contract) {
        // Get the default wallet
        const wallet = getAccountService().getDefaultWallet();
        
        // Create a new contract instance
        const address = AztecAddress.fromString(contractAddress);
        contract = await Contract.at(
          address,
          contractArtifact,
          wallet
        );
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
    if (!this.pxe) {
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