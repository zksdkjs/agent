// Provider exports

// Export all providers
export * from './railgun';
export * from './aztec';

// Export provider plugins for easy registration
import { ProviderPlugin } from '../core/plugin-registry';
import { RailgunPlugin, RailgunMockPlugin } from './railgun';
import { AztecPlugin } from './aztec';

/**
 * All available provider plugins for production use
 */
export const AllProviderPlugins: ProviderPlugin[] = [
  RailgunPlugin,
  AztecPlugin
];

/**
 * All available provider plugins for testing
 */
export const AllTestProviderPlugins: ProviderPlugin[] = [
  RailgunMockPlugin,
  AztecPlugin
];

/**
 * Register all built-in providers with the SDK
 */
export function registerBuiltInProviders(registry: any, forTesting: boolean = false): void {
  const plugins = forTesting ? AllTestProviderPlugins : AllProviderPlugins;
  
  plugins.forEach(plugin => {
    try {
      registry.register(plugin);
    } catch (error) {
      console.error(`Failed to register plugin ${plugin.name}:`, error);
    }
  });
}