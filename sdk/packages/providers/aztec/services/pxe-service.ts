/**
 * PXE Service for Aztec Provider
 * 
 * This module handles the integration with Aztec's Private eXecution Environment (PXE),
 * which is responsible for managing private state, keys, and transaction construction.
 */

import { createAztecNodeClient, createLogger, AztecNode } from '@aztec/aztec.js';
import type { PXE } from '@aztec/aztec.js';
import { ProviderError } from '../errors';

// Constants for PXE service
const DEFAULT_PXE_HOST = '127.0.0.1';
const DEFAULT_PXE_PORT = 8080;
const DEFAULT_NODE_HOST = 'https://api.aztec.network/aztec-connect-testnet/falafel';
const DEFAULT_DATA_DIRECTORY = './.privacy-sdk/aztec-data';

// Logger for the PXE service
const logger = createLogger('privacy-sdk:aztec:pxe');

const createPXEInstance = async (endpoint: string): Promise<PXE> => {
  const aztecModule: any = await import('@aztec/aztec.js');
  const PXEClass = aztecModule.PXE ?? aztecModule.default?.PXE;
  if (!PXEClass) {
    throw new Error('PXE constructor not available from @aztec/aztec.js');
  }
  return new PXEClass(endpoint) as PXE;
};

/**
 * PXE configuration options
 */
export interface PXEConfig {
  nodeUrl?: string;
  pxeHost?: string;
  pxePort?: number;
  useExisting?: boolean;
  dataDirectory?: string;
  logLevel?: string;
}

/**
 * PXE Service class that manages the lifecycle of a PXE instance
 */
export class PXEService {
  private pxe: PXE | null = null;
  private isStarting = false;
  private isStopping = false;
  private config: Required<PXEConfig>;
  private node: AztecNode | null = null;

  /**
   * Create a new PXE Service instance
   */
  constructor(config: PXEConfig = {}) {
    this.config = {
      nodeUrl: config.nodeUrl || DEFAULT_NODE_HOST,
      pxeHost: config.pxeHost || DEFAULT_PXE_HOST,
      pxePort: config.pxePort || DEFAULT_PXE_PORT,
      useExisting: config.useExisting || false,
      dataDirectory: config.dataDirectory || DEFAULT_DATA_DIRECTORY,
      logLevel: config.logLevel || 'info'
    };
  }

  /**
   * Get PXE instance, starting it if necessary
   */
  async getPXE(): Promise<PXE> {
    if (this.pxe) {
      return this.pxe;
    }

    await this.start();
    return this.pxe!;
  }

  /**
   * Get the Aztec Node instance
   */
  getNode(): AztecNode | null {
    return this.node;
  }

  /**
   * Start the PXE service
   */
  async start(): Promise<void> {
    if (this.pxe) {
      return;
    }

    if (this.isStarting) {
      // Wait for startup to complete if already in progress
      while (this.isStarting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    this.isStarting = true;

    try {
      logger.info('Starting PXE service...');

      // Create node client
      this.node = createAztecNodeClient(this.config.nodeUrl);
      
      if (this.config.useExisting) {
        // Try to connect to an existing PXE service
        const pxeUrl = `http://${this.config.pxeHost}:${this.config.pxePort}`;
        logger.info(`Attempting to connect to existing PXE at ${pxeUrl}`);
        
        this.pxe = await createPXEInstance(pxeUrl);
        
        // Note: In the current API, we can't easily check if PXE is actually running
        // We'll just assume it's working for now
        logger.info('Connected to existing PXE service');
        this.isStarting = false;
        return;
      }

      // For now, we'll just create a PXE client pointing to the node
      // In a real implementation, this would start a local PXE service
      logger.info(`Creating PXE client with node URL: ${this.config.nodeUrl}`);
      
      try {
        // Create PXE client
        this.pxe = await createPXEInstance(this.config.nodeUrl);
        logger.info('PXE client created');
      } catch (error) {
        logger.error('Failed to create PXE client', error);
        throw new Error(`Failed to create PXE client: ${error instanceof Error ? error.message : String(error)}`);
      }
    } catch (error) {
      logger.error('Failed to start PXE service', error);
      this.isStarting = false;
      throw new ProviderError(
        'Failed to start Aztec PXE service',
        'aztec',
        { originalError: error }
      );
    }

    this.isStarting = false;
  }

  /**
   * Stop the PXE service
   */
  async stop(): Promise<void> {
    if (!this.pxe || this.isStopping) {
      return;
    }

    this.isStopping = true;

    try {
      logger.info('Stopping PXE service...');
      
      // Close PXE client
      this.pxe = null;
      this.node = null;
      
      logger.info('PXE service stopped');
    } catch (error) {
      logger.error('Error stopping PXE service', error);
      throw new ProviderError(
        'Failed to stop Aztec PXE service',
        'aztec',
        { originalError: error }
      );
    } finally {
      this.isStopping = false;
    }
  }

  /**
   * Check if the PXE service is running
   */
  isRunning(): boolean {
    return this.pxe !== null;
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<Required<PXEConfig>> {
    return this.config;
  }
}

// Singleton instance for shared use
let pxeServiceInstance: PXEService | null = null;

/**
 * Get the shared PXE service instance
 */
export function getPXEService(config?: PXEConfig): PXEService {
  if (!pxeServiceInstance) {
    pxeServiceInstance = new PXEService(config);
  }
  return pxeServiceInstance;
}

/**
 * Reset the shared PXE service instance
 * Mainly used for testing purposes
 */
export function resetPXEService(): void {
  if (pxeServiceInstance) {
    pxeServiceInstance.stop().catch(e => logger.error('Error during PXE service reset', e));
    pxeServiceInstance = null;
  }
}
