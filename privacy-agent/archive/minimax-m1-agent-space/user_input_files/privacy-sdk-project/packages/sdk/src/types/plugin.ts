/**
 * Plugin system types and interfaces
 */

import { ProviderConfig, PrivacyProvider } from './provider';
import { ValidationResult } from './recipe';
import { ChainId } from './base';

// Plugin System Interfaces
export interface ProviderPlugin {
  name: string;
  version: string;
  description: string;
  supportedChains: ChainId[];
  
  createProvider(config: ProviderConfig): Promise<PrivacyProvider>;
  validateConfig(config: ProviderConfig): ValidationResult;
  getDefaultConfig(chainId: ChainId): Partial<ProviderConfig>;
}

export interface PluginRegistry {
  register(plugin: ProviderPlugin): void;
  unregister(name: string): void;
  getPlugin(name: string): ProviderPlugin | undefined;
  listPlugins(): ProviderPlugin[];
}

// Plugin Configuration Schema
export interface PluginConfigSchema {
  type: 'object';
  properties: Record<string, JSONSchema>;
  required: string[];
  additionalProperties?: boolean;
}

export interface JSONSchema {
  type: string;
  description?: string;
  default?: any;
  enum?: any[];
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema;
  required?: string[];
}

// Plugin Manifest
export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  main: string; // Entry point file
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  supportedChains: ChainId[];
  author?: string;
  license?: string;
  homepage?: string;
}

// Provider-specific configurations
export interface RailgunConfig extends ProviderConfig {
  type: 'railgun';
  networkName: string;
  db?: any; // RailgunDatabase type would come from Railgun SDK
  walletSource?: string;
}

export interface MinaConfig extends ProviderConfig {
  type: 'mina';
  networkId: string;
  zkappKey?: string;
}

export interface SemaphoreConfig extends ProviderConfig {
  type: 'semaphore';
  groupId: string;
  identityCommitment?: string;
}