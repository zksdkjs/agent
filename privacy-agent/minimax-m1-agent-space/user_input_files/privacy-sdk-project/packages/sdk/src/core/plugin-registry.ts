/**
 * Plugin registry for managing provider plugins
 */

import { PluginRegistry, ProviderPlugin, ProviderConfig, PrivacyProvider } from '../types';
import { ConfigurationError } from '../types/errors';

export class PluginRegistryImpl implements PluginRegistry {
  private plugins = new Map<string, ProviderPlugin>();

  constructor() {
    // Register built-in plugins
    this.registerBuiltInPlugins();
  }

  register(plugin: ProviderPlugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new ConfigurationError(`Plugin ${plugin.name} is already registered`);
    }
    this.plugins.set(plugin.name, plugin);
  }

  unregister(name: string): void {
    this.plugins.delete(name);
  }

  getPlugin(name: string): ProviderPlugin | undefined {
    return this.plugins.get(name);
  }

  listPlugins(): ProviderPlugin[] {
    return Array.from(this.plugins.values());
  }

  async createProvider(providerName: string, config: ProviderConfig): Promise<PrivacyProvider> {
    const plugin = this.getPlugin(providerName);
    if (!plugin) {
      throw new ConfigurationError(`Unknown provider: ${providerName}`);
    }

    // Validate configuration
    const validation = plugin.validateConfig(config);
    if (!validation.valid) {
      throw new ConfigurationError(
        `Invalid configuration for ${providerName}: ${validation.errors.map(e => e.message).join(', ')}`
      );
    }

    return await plugin.createProvider(config);
  }

  private registerBuiltInPlugins(): void {
    // Built-in plugins will be registered here
    // This is done in the main SDK class to avoid circular dependencies
  }

  getSupportedChains(providerName: string): string[] {
    const plugin = this.getPlugin(providerName);
    if (!plugin) {
      throw new ConfigurationError(`Unknown provider: ${providerName}`);
    }
    return plugin.supportedChains.map(c => c.toString());
  }

  supportsChain(providerName: string, chainId: string | number): boolean {
    const plugin = this.getPlugin(providerName);
    if (!plugin) {
      return false;
    }
    return plugin.supportedChains.includes(chainId);
  }

  getDefaultConfig(providerName: string, chainId: string | number): Partial<ProviderConfig> {
    const plugin = this.getPlugin(providerName);
    if (!plugin) {
      throw new ConfigurationError(`Unknown provider: ${providerName}`);
    }
    return plugin.getDefaultConfig(chainId);
  }
}