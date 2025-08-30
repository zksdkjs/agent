// Plugin registry for managing privacy providers

import {
  ProviderConfig,
  ValidationResult,
  ValidationError,
  ChainId
} from '../types';

import { PrivacyProvider, ProviderFactory } from './provider';
import { PluginError, ValidationError as ValidationErr, wrapError } from './errors';

/**
 * Simple event emitter for plugin registry
 */
class RegistryEventEmitter {
  private listeners: Map<string, Set<Function>> = new Map();

  emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in registry event listener for ${event}:`, error);
        }
      });
    }
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }
}

/**
 * Plugin metadata
 */
export interface ProviderPlugin {
  name: string;
  version: string;
  description: string;
  supportedChains: ChainId[];
  factory: ProviderFactory;
}

/**
 * Registry for managing privacy provider plugins
 */
export class PluginRegistry extends RegistryEventEmitter {
  private plugins: Map<string, ProviderPlugin> = new Map();
  private instances: Map<string, PrivacyProvider> = new Map();

  /**
   * Register a provider plugin
   */
  register(plugin: ProviderPlugin): void {
    try {
      this.validatePlugin(plugin);
      
      if (this.plugins.has(plugin.name)) {
        throw new PluginError(
          `Provider plugin '${plugin.name}' is already registered`,
          plugin.name
        );
      }

      this.plugins.set(plugin.name, plugin);
      
      this.emit('plugin_registered', {
        provider: plugin.name,
        timestamp: Date.now(),
        plugin: {
          name: plugin.name,
          version: plugin.version,
          supportedChains: plugin.supportedChains
        }
      });
    } catch (error) {
      throw wrapError(error, `Failed to register plugin '${plugin.name}'`);
    }
  }

  /**
   * Unregister a provider plugin
   */
  unregister(name: string): void {
    try {
      if (!this.plugins.has(name)) {
        throw new PluginError(`Provider plugin '${name}' is not registered`, name);
      }

      // Clean up any existing instances
      const instance = this.instances.get(name);
      if (instance) {
        instance.destroy().catch((error: any) => {
          console.error(`Error destroying provider instance '${name}':`, error);
        });
        this.instances.delete(name);
      }

      this.plugins.delete(name);
      
      this.emit('plugin_unregistered', {
        provider: name,
        timestamp: Date.now()
      });
    } catch (error) {
      throw wrapError(error, `Failed to unregister plugin '${name}'`);
    }
  }

  /**
   * Get a provider plugin by name
   */
  getPlugin(name: string): ProviderPlugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * List all registered plugins
   */
  listPlugins(): ProviderPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Check if a plugin is registered
   */
  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Create a provider instance
   */
  async createProvider(name: string, config: ProviderConfig): Promise<PrivacyProvider> {
    try {
      const plugin = this.plugins.get(name);
      if (!plugin) {
        throw new PluginError(`Provider plugin '${name}' is not registered`, name);
      }

      // Validate configuration
      const validation = this.validateConfig(name, config);
      if (!validation.valid) {
        const errorMessages = validation.errors.map(e => `${e.field}: ${e.message}`);
        throw new ValidationErr(
          `Configuration validation failed: ${errorMessages.join(', ')}`,
          undefined,
          name,
          { errors: validation.errors }
        );
      }

      // Create provider instance
      const provider = await plugin.factory.create(config);
      
      // Store instance for lifecycle management
      this.instances.set(name, provider);
      
      this.emit('provider_created', {
        provider: name,
        timestamp: Date.now(),
        config: { ...config, apiKey: config.apiKey ? '[REDACTED]' : undefined }
      });

      return provider;
    } catch (error) {
      throw wrapError(error, `Failed to create provider '${name}'`, name);
    }
  }

  /**
   * Get an existing provider instance
   */
  getProvider(name: string): PrivacyProvider | undefined {
    return this.instances.get(name);
  }

  /**
   * Destroy a provider instance
   */
  async destroyProvider(name: string): Promise<void> {
    try {
      const provider = this.instances.get(name);
      if (provider) {
        await provider.destroy();
        this.instances.delete(name);
        
        this.emit('provider_destroyed', {
          provider: name,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      throw wrapError(error, `Failed to destroy provider '${name}'`, name);
    }
  }

  /**
   * Destroy all provider instances
   */
  async destroyAllProviders(): Promise<void> {
    const destroyPromises = Array.from(this.instances.keys()).map(name => 
      this.destroyProvider(name).catch((error: any) => {
        console.error(`Error destroying provider '${name}':`, error);
      })
    );
    
    await Promise.all(destroyPromises);
  }

  /**
   * Validate provider configuration
   */
  validateConfig(providerName: string, config: ProviderConfig): ValidationResult {
    const errors: ValidationError[] = [];
    
    try {
      const plugin = this.plugins.get(providerName);
      if (!plugin) {
        errors.push({
          field: 'provider',
          code: 'PROVIDER_NOT_FOUND',
          message: `Provider '${providerName}' is not registered`
        });
        return { valid: false, errors, warnings: [] };
      }

      // Basic validation
      if (!config.type) {
        errors.push({
          field: 'type',
          code: 'REQUIRED',
          message: 'Provider type is required'
        });
      }

      if (!config.chainId) {
        errors.push({
          field: 'chainId',
          code: 'REQUIRED',
          message: 'Chain ID is required'
        });
      } else if (!plugin.supportedChains.includes(config.chainId)) {
        errors.push({
          field: 'chainId',
          code: 'UNSUPPORTED',
          message: `Chain ID ${config.chainId} is not supported by provider '${providerName}'`
        });
      }

      if (!config.networkType) {
        errors.push({
          field: 'networkType',
          code: 'REQUIRED',
          message: 'Network type is required'
        });
      }

      // Use plugin's factory validation if available
      if (errors.length === 0 && !plugin.factory.validate(config)) {
        errors.push({
          field: 'config',
          code: 'INVALID',
          message: 'Provider-specific configuration validation failed'
        });
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings: []
      };
    } catch (error) {
      errors.push({
        field: 'config',
        code: 'VALIDATION_ERROR',
        message: `Configuration validation failed: ${error}`
      });
      
      return { valid: false, errors, warnings: [] };
    }
  }

  /**
   * Get providers that support a specific chain
   */
  getProvidersForChain(chainId: ChainId): ProviderPlugin[] {
    return Array.from(this.plugins.values()).filter(plugin => 
      plugin.supportedChains.includes(chainId)
    );
  }

  /**
   * Get default configuration for a provider
   */
  getDefaultConfig(providerName: string): Partial<ProviderConfig> | undefined {
    const plugin = this.plugins.get(providerName);
    return plugin?.factory.getDefaultConfig();
  }

  /**
   * Clear all plugins and instances
   */
  async clear(): Promise<void> {
    await this.destroyAllProviders();
    this.plugins.clear();
    this.removeAllListeners();
  }

  /**
   * Validate a plugin before registration
   */
  private validatePlugin(plugin: ProviderPlugin): void {
    if (!plugin.name || typeof plugin.name !== 'string') {
      throw new PluginError('Plugin name is required and must be a string');
    }

    if (!plugin.version || typeof plugin.version !== 'string') {
      throw new PluginError('Plugin version is required and must be a string', plugin.name);
    }

    if (!plugin.factory || typeof plugin.factory.create !== 'function') {
      throw new PluginError('Plugin factory is required and must have a create method', plugin.name);
    }

    if (!Array.isArray(plugin.supportedChains)) {
      throw new PluginError('Plugin supportedChains must be an array', plugin.name);
    }
  }
}

/**
 * Global plugin registry instance
 */
export const pluginRegistry = new PluginRegistry();
