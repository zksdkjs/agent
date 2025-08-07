/**
 * Main Privacy SDK class
 */

import { EventEmitter } from './event-emitter';
import { PluginRegistryImpl } from './plugin-registry';
import { RecipeRegistry } from '../recipes';
import {
  SDKConfig,
  PrivacyProvider,
  ProviderConfig,
  Recipe,
  RecipeParams,
  RecipeResult,
  ProviderEvent,
  EventData,
  ProviderStatus
} from '../types';
import { ConfigurationError, ProviderError } from '../types/errors';

// Import plugins
import { RailgunPlugin } from '../providers/railgun-plugin';
import { MinaPlugin } from '../providers/mina-plugin';
import { SemaphorePlugin } from '../providers/semaphore-plugin';

export class PrivacySDK {
  private config: SDKConfig;
  private pluginRegistry: PluginRegistryImpl;
  private recipeRegistry: RecipeRegistry;
  private eventEmitter: EventEmitter;
  private providers = new Map<string, PrivacyProvider>();
  private initialized = false;

  constructor(config: SDKConfig) {
    this.config = config;
    this.pluginRegistry = new PluginRegistryImpl();
    this.recipeRegistry = new RecipeRegistry();
    this.eventEmitter = new EventEmitter();

    this.registerBuiltInPlugins();
  }

  /**
   * Initialize the SDK and all configured providers
   */
  async initialize(): Promise<void> {
    try {
      // Initialize providers
      for (const [name, config] of Object.entries(this.config.providers)) {
        await this.initializeProvider(name, config);
      }

      this.initialized = true;
      this.emit('initialized', {
        provider: 'sdk',
        timestamp: Date.now(),
        providersCount: this.providers.size
      });
    } catch (error) {
      throw new ConfigurationError(`Failed to initialize SDK: ${error.message}`);
    }
  }

  /**
   * Destroy the SDK and clean up resources
   */
  async destroy(): Promise<void> {
    for (const provider of this.providers.values()) {
      await provider.destroy();
    }
    this.providers.clear();
    this.eventEmitter.removeAllListeners();
    this.initialized = false;
  }

  /**
   * Check if SDK is ready
   */
  isReady(): boolean {
    return this.initialized && this.providers.size > 0;
  }

  /**
   * Get a specific provider
   */
  getProvider(name: string): PrivacyProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new ProviderError(`Provider '${name}' not found or not initialized`);
    }
    return provider;
  }

  /**
   * Get the default provider
   */
  getDefaultProvider(): PrivacyProvider {
    return this.getProvider(this.config.defaultProvider);
  }

  /**
   * List all available providers
   */
  listProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Get provider status
   */
  getProviderStatus(name: string): ProviderStatus {
    const provider = this.providers.get(name);
    if (!provider) {
      return 'uninitialized';
    }
    return provider.getStatus();
  }

  /**
   * Recipe system access
   */
  get recipes() {
    return {
      /**
       * Execute a private transfer
       */
      privateTransfer: async (params: any): Promise<RecipeResult> => {
        return this.executeRecipe('private_transfer', {
          provider: this.config.defaultProvider,
          ...params
        });
      },

      /**
       * Execute a private swap
       */
      privateSwap: async (params: any): Promise<RecipeResult> => {
        return this.executeRecipe('private_swap', {
          provider: this.config.defaultProvider,
          ...params
        });
      },

      /**
       * Execute anonymous voting
       */
      anonymousVote: async (params: any): Promise<RecipeResult> => {
        return this.executeRecipe('anonymous_voting', {
          provider: 'semaphore', // Semaphore is preferred for voting
          ...params
        });
      },

      /**
       * Execute any recipe by name
       */
      execute: async (recipeName: string, params: RecipeParams): Promise<RecipeResult> => {
        return this.executeRecipe(recipeName, params);
      },

      /**
       * List available recipes
       */
      list: (): Recipe[] => {
        return this.recipeRegistry.listRecipes();
      },

      /**
       * Get recipes for a specific provider
       */
      forProvider: (providerName: string): Recipe[] => {
        return this.recipeRegistry.getRecipesByProvider(providerName);
      }
    };
  }

  /**
   * Plugin management
   */
  get plugins() {
    return {
      register: (plugin: any) => this.pluginRegistry.register(plugin),
      unregister: (name: string) => this.pluginRegistry.unregister(name),
      list: () => this.pluginRegistry.listPlugins(),
      get: (name: string) => this.pluginRegistry.getPlugin(name)
    };
  }

  /**
   * Event system
   */
  on(event: ProviderEvent, callback: (data: EventData) => void): void {
    this.eventEmitter.on(event, callback);
  }

  off(event: ProviderEvent, callback: (data: EventData) => void): void {
    this.eventEmitter.off(event, callback);
  }

  /**
   * Add a new provider configuration and initialize it
   */
  async addProvider(name: string, config: ProviderConfig): Promise<void> {
    if (this.providers.has(name)) {
      throw new ConfigurationError(`Provider '${name}' already exists`);
    }

    this.config.providers[name] = config;
    await this.initializeProvider(name, config);
  }

  /**
   * Remove a provider
   */
  async removeProvider(name: string): Promise<void> {
    const provider = this.providers.get(name);
    if (provider) {
      await provider.destroy();
      this.providers.delete(name);
      delete this.config.providers[name];
    }
  }

  private async initializeProvider(name: string, config: ProviderConfig): Promise<void> {
    try {
      const provider = await this.pluginRegistry.createProvider(config.type, config);
      await provider.initialize(config);
      
      // Forward provider events
      provider.on('error', (data: EventData) => {
        this.emit('error', { ...data, provider: name });
      });
      
      provider.on('transaction_confirmed', (data: EventData) => {
        this.emit('transaction_confirmed', { ...data, provider: name });
      });

      this.providers.set(name, provider);
    } catch (error) {
      throw new ConfigurationError(
        `Failed to initialize provider '${name}': ${error.message}`
      );
    }
  }

  private async executeRecipe(recipeName: string, params: RecipeParams): Promise<RecipeResult> {
    const recipe = this.recipeRegistry.getRecipe(recipeName);
    if (!recipe) {
      throw new ConfigurationError(`Recipe '${recipeName}' not found`);
    }

    // Inject provider if specified
    if (params.provider) {
      const provider = this.getProvider(params.provider);
      // In a real implementation, we would inject the provider into the recipe
    }

    return recipe.execute(params);
  }

  private registerBuiltInPlugins(): void {
    this.pluginRegistry.register(new RailgunPlugin());
    this.pluginRegistry.register(new MinaPlugin());
    this.pluginRegistry.register(new SemaphorePlugin());
  }

  private emit(event: ProviderEvent, data: EventData): void {
    this.eventEmitter.emit(event, data);
  }

  /**
   * Get SDK configuration
   */
  getConfig(): SDKConfig {
    return { ...this.config };
  }

  /**
   * Update SDK configuration
   */
  updateConfig(config: Partial<SDKConfig>): void {
    this.config = { ...this.config, ...config };
  }
}