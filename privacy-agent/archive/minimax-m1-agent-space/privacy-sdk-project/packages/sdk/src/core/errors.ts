// Error handling system for Privacy SDK

/**
 * Base error class for all Privacy SDK errors
 */
export abstract class PrivacySDKError extends Error {
  abstract readonly code: string;
  readonly provider?: string;
  readonly details?: Record<string, any>;
  readonly timestamp: number;

  constructor(
    message: string,
    provider?: string,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.provider = provider;
    this.details = details;
    this.timestamp = Date.now();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      provider: this.provider,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Configuration-related errors
 */
export class ConfigurationError extends PrivacySDKError {
  readonly code = 'CONFIGURATION_ERROR';

  constructor(
    message: string,
    provider?: string,
    details?: Record<string, any>
  ) {
    super(`Configuration Error: ${message}`, provider, details);
  }
}

/**
 * Transaction-related errors
 */
export class TransactionError extends PrivacySDKError {
  readonly code = 'TRANSACTION_ERROR';
  readonly transactionHash?: string;

  constructor(
    message: string,
    provider?: string,
    transactionHash?: string,
    details?: Record<string, any>
  ) {
    super(`Transaction Error: ${message}`, provider, details);
    this.transactionHash = transactionHash;
  }
}

/**
 * Proof generation errors
 */
export class ProofGenerationError extends PrivacySDKError {
  readonly code = 'PROOF_GENERATION_ERROR';

  constructor(
    message: string,
    provider?: string,
    details?: Record<string, any>
  ) {
    super(`Proof Generation Error: ${message}`, provider, details);
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends PrivacySDKError {
  readonly code = 'NETWORK_ERROR';
  readonly statusCode?: number;

  constructor(
    message: string,
    provider?: string,
    statusCode?: number,
    details?: Record<string, any>
  ) {
    super(`Network Error: ${message}`, provider, details);
    this.statusCode = statusCode;
  }
}

/**
 * Provider-related errors
 */
export class ProviderError extends PrivacySDKError {
  readonly code = 'PROVIDER_ERROR';

  constructor(
    message: string,
    provider?: string,
    details?: Record<string, any>
  ) {
    super(`Provider Error: ${message}`, provider, details);
  }
}

/**
 * Validation errors
 */
export class ValidationError extends PrivacySDKError {
  readonly code = 'VALIDATION_ERROR';
  readonly field?: string;

  constructor(
    message: string,
    field?: string,
    provider?: string,
    details?: Record<string, any>
  ) {
    super(`Validation Error: ${message}`, provider, details);
    this.field = field;
  }
}

/**
 * Key management errors
 */
export class KeyManagementError extends PrivacySDKError {
  readonly code = 'KEY_MANAGEMENT_ERROR';

  constructor(
    message: string,
    provider?: string,
    details?: Record<string, any>
  ) {
    super(`Key Management Error: ${message}`, provider, details);
  }
}

/**
 * Plugin-related errors
 */
export class PluginError extends PrivacySDKError {
  readonly code = 'PLUGIN_ERROR';
  readonly pluginName?: string;

  constructor(
    message: string,
    pluginName?: string,
    details?: Record<string, any>
  ) {
    super(`Plugin Error: ${message}`, undefined, details);
    this.pluginName = pluginName;
  }
}

/**
 * Initialize errors (startup/setup)
 */
export class InitializationError extends PrivacySDKError {
  readonly code = 'INITIALIZATION_ERROR';

  constructor(
    message: string,
    provider?: string,
    details?: Record<string, any>
  ) {
    super(`Initialization Error: ${message}`, provider, details);
  }
}

/**
 * Timeout errors
 */
export class TimeoutError extends PrivacySDKError {
  readonly code = 'TIMEOUT_ERROR';
  readonly timeoutMs?: number;

  constructor(
    message: string,
    timeoutMs?: number,
    provider?: string,
    details?: Record<string, any>
  ) {
    super(`Timeout Error: ${message}`, provider, details);
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Helper function to determine if an error is a Privacy SDK error
 */
export function isPrivacySDKError(error: any): error is PrivacySDKError {
  return error instanceof PrivacySDKError;
}

/**
 * Helper function to wrap unknown errors
 */
export function wrapError(
  error: unknown,
  context: string,
  provider?: string
): PrivacySDKError {
  if (isPrivacySDKError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new ProviderError(
      `${context}: ${error.message}`,
      provider,
      { originalError: error.message, stack: error.stack }
    );
  }

  return new ProviderError(
    `${context}: ${String(error)}`,
    provider,
    { originalError: error }
  );
}
