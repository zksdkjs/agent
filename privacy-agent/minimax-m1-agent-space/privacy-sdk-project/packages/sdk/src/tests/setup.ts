// Test setup for Privacy SDK

import { pluginRegistry } from '../core/plugin-registry';
import { registerBuiltInProviders } from '../providers';

// Set up test environment
beforeAll(() => {
  // Clean up plugin registry and register test providers
  pluginRegistry.clear();
  registerBuiltInProviders(pluginRegistry, true);
  
  // Mock console methods to avoid cluttering test output
  global.console.log = jest.fn();
  global.console.error = jest.fn();
  global.console.warn = jest.fn();
});

// Clean up after tests
afterAll(() => {
  // Restore console methods
  jest.restoreAllMocks();
});