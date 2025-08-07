/**
 * PXE Service for Aztec Provider
 * 
 * This module handles the integration with Aztec's Private eXecution Environment (PXE),
 * which is responsible for managing private state, keys, and transaction construction.
 */

import {
  PXE,
  createAztecNodeClient,
  waitForPXE,
  createLogger,
  type Fr,
  AztecAddress
} from '@aztec/aztec.js';
import { createPXEService, getPXEServiceConfig } from '@aztec/pxe/server';
import { createStore } from '@aztec/kv-store/lmdb';
import { ProviderError } from '../../../core/errors';

// Constants for PXE service
const DEFAULT_PXE_HOST = '127.0.0.1';
const DEFAULT_PXE_PORT = 8080;
const DEFAULT_NODE_HOST = 'https://api.aztec.network/aztec-connect-testnet/falafel';

// Logger for the PXE service
const logger = createLogger('privacy-sdk:aztec:pxe');

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
  private pxeProcess: any = null;
  private isStarting = false;
  private isStopping = false;
  private config: Required<PXEConfig>;

  /**
   * Create a new PXE Service instance
   */
  constructor(config: PXEConfig = {}) {
    this.config = {
      nodeUrl: config.nodeUrl || DEFAULT_NODE_HOST,
      pxeHost: config.pxeHost || DEFAULT_PXE_HOST,
      pxePort: config.pxePort || DEFAULT_PXE_PORT,
      useExisting: config.useExisting || false,
      dataDirectory: config.dataDirectory || './.privacy-sdk/aztec-data',
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

      if (this.config.useExisting) {
        // Try to connect to an existing PXE service
        const pxeUrl = `http://${this.config.pxeHost}:${this.config.pxePort}`;
        logger.info(`Connecting to existing PXE at ${pxeUrl}`);
        
        const node = createAztecNodeClient(this.config.nodeUrl);
        this.pxe = new PXE({ url: pxeUrl, node });
        
        // Check if PXE is actually running
        try {
          await waitForPXE(this.pxe);
          logger.info('Successfully connected to existing PXE service');
        } catch (error) {
          logger.warn('Failed to connect to existing PXE, will start a new one');
          this.pxe = null;
        }
      }

      // If we couldn't connect to an existing PXE or weren't asked to try,
      // start a new PXE service
      if (!this.pxe) {
        logger.info(`Starting new PXE service with node URL: ${this.config.nodeUrl}`);
        
        // Create node client
        const node = createAztecNodeClient(this.config.nodeUrl);
        
        // Create data store
        const store = createStore(this.config.dataDirectory);
        
        // Configure PXE service
        const pxeServiceConfig = getPXEServiceConfig({
          aztecNode: this.config.nodeUrl,
          kvStore: store,
          maxAcirBytecodeCacheItems: 100,
          logLevel: this.config.logLevel
        });
        
        // Start PXE service
        const pxeService = await createPXEService(pxeServiceConfig);
        const port = this.config.pxePort;
        const host = this.config.pxeHost;
        
        // Start the server
        this.pxeProcess = await pxeService.listen({ host, port });
        logger.info(`PXE service started at http://${host}:${port}`);
        
        // Create PXE client
        this.pxe = new PXE({ url: `http://${host}:${port}`, node });
        
        // Wait for PXE to be ready
        await waitForPXE(this.pxe);
        logger.info('PXE service ready');
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
      
      // If we started a PXE process, stop it
      if (this.pxeProcess && typeof this.pxeProcess.close === 'function') {
        await this.pxeProcess.close();
        this.pxeProcess = null;
        logger.info('PXE service stopped');
      }
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