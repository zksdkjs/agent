// Main entry point for Privacy SDK

// Core SDK class
export { PrivacySDK, createMockSDK } from './privacy-sdk';

// Core interfaces and types
export * from './core';

// Recipe system
export * from './recipes';

// Provider implementations
export * from './providers';

// Utility functions
export { createMockProvider } from './core/provider';

// Create SDK helper function
export { createPrivacySDK, defaultConfigs } from './helpers';

// Version
export const VERSION = '1.0.0';

// Default export for convenience
export { PrivacySDK as default } from './privacy-sdk';
