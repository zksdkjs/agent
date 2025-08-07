// Main Privacy SDK class

import {
  SDKConfig,
  ProviderConfig,
  RecipeParams,
  RecipeResult,
  ValidationResult,
  FeeEstimate
} from './types';

import {
  PrivacyProvider,
  PluginRegistry,
  pluginRegistry,
  ProviderPlugin,
  createMockProvider
} from './core';

import {
  RecipeRegistry,
  RecipeExecutor,
  recipeRegistry,
  PrivateTransferParams,
  PrivateSwapParams,
  ShieldParams,
  UnshieldParams,
  BatchTransferParams,
  CrossProviderParams
} from './recipes';

import {
  ConfigurationError,
  ProviderError,
  InitializationError,
  wrapError
} from './core/errors';

/**
 * Recipe interface for the SDK
 */
export interface SDKRecipes {
  // Core transfer operations
  privateTransfer(params: PrivateTransferParams): Promise<RecipeResult>;
  batchTransfer(params: BatchTransferParams): Promise<RecipeResult>;
  
  // Privacy operations
  shield(params: ShieldParams): Promise<RecipeResult>;
  unshield(params: UnshieldParams): Promise<RecipeResult>;
  
  // DeFi operations
  privateSwap(params: PrivateSwapParams): Promise<RecipeResult>;
  
  // Cross-provider operations
  crossProviderTransfer(params: CrossProviderParams): Promise<RecipeResult>;
  
  // Utility methods
  validate(recipeName: string, params: RecipeParams): ValidationResult;
  estimateFees(recipeName: string, params: RecipeParams): Promise<FeeEstimate>;
}

/**
 * Main Privacy SDK class - the unified interface for all privacy systems
 */
export class PrivacySDK {
  private config: SDKConfig;
  private providers: Map<string, PrivacyProvider> = new Map();
  private pluginRegistry: PluginRegistry;
  private recipeExecutor: RecipeExecutor;
  private defaultProvider?: PrivacyProvider;
  
  /**
   * Recipe interface for common privacy operations
   */
  public readonly recipes: SDKRecipes;

  constructor(
    config: SDKConfig,
    customPluginRegistry?: PluginRegistry,
    customRecipeRegistry?: RecipeRegistry
  ) {
    this.config = this.validateAndNormalizeConfig(config);
    this.pluginRegistry = customPluginRegistry || pluginRegistry;
    this.recipeExecutor = new RecipeExecutor(customRecipeRegistry || recipeRegistry);
    
    // Create recipe interface
    this.recipes = this.createRecipeInterface();
  }

  /**
   * Initialize the SDK and all configured providers
   */
  async initialize(): Promise<void> {
    try {
      // Initialize all configured providers
      const initPromises = Object.entries(this.config.providers).map(async ([name, config]) => {
        try {
          const provider = await this.createAndInitializeProvider(name, config);
          this.providers.set(name, provider);
          
          // Set as default if specified
          if (name === this.config.defaultProvider) {
            this.defaultProvider = provider;
          }
        } catch (error) {
          console.error(`Failed to initialize provider '${name}':`, error);
          throw error;
        }
      });

      await Promise.all(initPromises);

      // Ensure default provider is set
      if (!this.defaultProvider) {
        throw new ConfigurationError(
          `Default provider '${this.config.defaultProvider}' was not successfully initialized`
        );
      }
    } catch (error) {
      throw wrapError(error, 'SDK initialization failed');
    }
  }

  /**
   * Get a provider by name
   */
  getProvider(name: string): PrivacyProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Get the default provider
   */
  getDefaultProvider(): PrivacyProvider {
    if (!this.defaultProvider) {
      throw new InitializationError('SDK not initialized or no default provider available');
    }
    return this.defaultProvider;
  }

  /**
   * List all available providers
   */
  listProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if a provider is available and ready
   */
  isProviderReady(name: string): boolean {
    const provider = this.providers.get(name);
    return provider ? provider.isReady() : false;
  }

  /**
   * Register a new provider plugin
   */
  registerProvider(plugin: ProviderPlugin): void {
    this.pluginRegistry.register(plugin);
  }

  /**
   * Add a new provider configuration and initialize it
   */
  async addProvider(name: string, config: ProviderConfig): Promise<void> {
    try {
      const provider = await this.createAndInitializeProvider(name, config);
      this.providers.set(name, provider);
      this.config.providers[name] = config;
    } catch (error) {
      throw wrapError(error, `Failed to add provider '${name}'`);
    }
  }

  /**
   * Remove a provider
   */
  async removeProvider(name: string): Promise<void> {
    try {
      const provider = this.providers.get(name);
      if (provider) {
        await provider.destroy();
        this.providers.delete(name);
      }
      delete this.config.providers[name];
      
      // Reset default if it was removed
      if (this.config.defaultProvider === name) {
        this.defaultProvider = undefined;
        const remaining = this.listProviders();
        if (remaining.length > 0) {
          this.config.defaultProvider = remaining[0];
          this.defaultProvider = this.providers.get(remaining[0]);
        }
      }
    } catch (error) {
      throw wrapError(error, `Failed to remove provider '${name}'`);
    }
  }
  
  /**
   * Set the default provider
   */
  setDefaultProvider(name: string): void {
    if (!this.providers.has(name)) {
      throw new ConfigurationError(
        `Cannot set default provider to '${name}' as it is not registered`,
        name
      );
    }
    
    this.config.defaultProvider = name;
    this.defaultProvider = this.providers.get(name);
  }

  /**
   * Destroy the SDK and clean up all resources
   */
  async destroy(): Promise<void> {
    try {
      const destroyPromises = Array.from(this.providers.values()).map(provider => 
        provider.destroy().catch((error: any) => {
          console.error('Error destroying provider:', error);
        })
      );
      
      await Promise.all(destroyPromises);
      
      this.providers.clear();
      this.defaultProvider = undefined;
    } catch (error) {
      throw wrapError(error, 'SDK destruction failed');
    }
  }

  /**
   * Get SDK configuration
   */
  getConfig(): SDKConfig {
    return { ...this.config }; // Return a copy
  }
  
  /**
   * Register an event listener
   */
  on(event: string, callback: Function): void {
    // Forward to all providers
    this.providers.forEach(provider => {
      provider.on(event as any, callback as any);
    });
  }
  
  /**
   * Remove an event listener
   */
  off(event: string, callback: Function): void {
    // Forward to all providers
    this.providers.forEach(provider => {
      provider.off(event as any, callback as any);
    });
  }
  
  /**
   * Check if the SDK is ready
   */
  isReady(): boolean {
    // SDK is ready if it has at least one ready provider
    return Array.from(this.providers.values()).some(provider => provider.isReady());
  }

  /**
   * Create and initialize a provider
   */
  private async createAndInitializeProvider(name: string, config: ProviderConfig): Promise<PrivacyProvider> {
    // Check if it's a mock provider for testing
    if (config.type === 'mock') {
      const mockProvider = createMockProvider(name);
      await mockProvider.initialize(config);
      return mockProvider;
    }

    // Use plugin registry to create provider
    const provider = await this.pluginRegistry.createProvider(name, config);
    await provider.initialize(config);
    return provider;
  }

  /**
   * Create the recipe interface
   */
  private createRecipeInterface(): SDKRecipes {
    return {
      // Core transfer operations
      privateTransfer: async (params: PrivateTransferParams): Promise<RecipeResult> => {
        const provider = params.provider 
          ? this.getProvider(params.provider) || this.getDefaultProvider()
          : this.getDefaultProvider();
        
        return await this.recipeExecutor.execute('private_transfer', params, provider);
      },

      batchTransfer: async (params: BatchTransferParams): Promise<RecipeResult> => {
        const provider = params.provider 
          ? this.getProvider(params.provider) || this.getDefaultProvider()
          : this.getDefaultProvider();
        
        return await this.recipeExecutor.execute('batch_transfer', params, provider);
      },

      // Privacy operations
      shield: async (params: ShieldParams): Promise<RecipeResult> => {
        const provider = params.provider 
          ? this.getProvider(params.provider) || this.getDefaultProvider()
          : this.getDefaultProvider();
        
        return await this.recipeExecutor.execute('shield', params, provider);
      },

      unshield: async (params: UnshieldParams): Promise<RecipeResult> => {
        const provider = params.provider 
          ? this.getProvider(params.provider) || this.getDefaultProvider()
          : this.getDefaultProvider();
        
        return await this.recipeExecutor.execute('unshield', params, provider);
      },

      // DeFi operations
      privateSwap: async (params: PrivateSwapParams): Promise<RecipeResult> => {
        const provider = params.provider 
          ? this.getProvider(params.provider) || this.getDefaultProvider()
          : this.getDefaultProvider();
        
        return await this.recipeExecutor.execute('private_swap', params, provider);
      },

      // Cross-provider operations
      crossProviderTransfer: async (params: CrossProviderParams): Promise<RecipeResult> => {
        // For cross-provider operations, we'll use the default provider as coordinator
        // The specific source and destination providers are specified in the params
        const coordinatingProvider = this.getDefaultProvider();
        
        // Attach SDK reference to provider for cross-provider recipe access
        (coordinatingProvider as any).sdk = this;
        
        return await this.recipeExecutor.execute('cross_provider', params, coordinatingProvider);
      },

      // Utility methods
      validate: (recipeName: string, params: RecipeParams): ValidationResult => {
        return this.recipeExecutor.validate(recipeName, params);
      },

      estimateFees: async (recipeName: string, params: RecipeParams): Promise<FeeEstimate> => {
        const provider = params.provider 
          ? this.getProvider(params.provider) || this.getDefaultProvider()
          : this.getDefaultProvider();
        
        return await this.recipeExecutor.estimateFees(recipeName, params, provider);
      }
    };
  }

  /**
   * Validate and normalize SDK configuration
   */
  private validateAndNormalizeConfig(config: SDKConfig): SDKConfig {
    if (!config) {
      throw new ConfigurationError('SDK configuration is required');
    }

    if (!config.defaultProvider || typeof config.defaultProvider !== 'string') {
      throw new ConfigurationError('Default provider name is required and must be a string');
    }

    if (!config.providers || typeof config.providers !== 'object') {
      throw new ConfigurationError('Providers configuration is required and must be an object');
    }

    if (!config.providers[config.defaultProvider]) {
      throw new ConfigurationError(
        `Default provider '${config.defaultProvider}' is not configured in providers`
      );
    }

    // Normalize configuration
    const normalizedConfig: SDKConfig = {
      defaultProvider: config.defaultProvider,
      providers: { ...config.providers },
      keyManagement: config.keyManagement || {
        storage: 'memory',
        encryption: true
      },
      logging: config.logging || {
        level: 'info',
        enabled: true
      }
    };

    return normalizedConfig;
  }
}

/**
 * Create a Privacy SDK instance with mock provider for testing
 */
export function createMockSDK(providerName: string = 'mock'): PrivacySDK {
  const config: SDKConfig = {
    defaultProvider: providerName,
    providers: {
      [providerName]: {
        type: 'mock',
        chainId: 1,
        networkType: 'testnet'
      }
    }
  };

  return new PrivacySDK(config);
}
