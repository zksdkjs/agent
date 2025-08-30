/**
 * Error handling types and classes
 */

// Error Types
export abstract class PrivacySDKError extends Error {
  abstract code: string;
  abstract provider?: string;
  abstract details?: Record<string, any>;
  
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ConfigurationError extends PrivacySDKError {
  code = 'CONFIGURATION_ERROR';
  
  constructor(message: string, public provider?: string, public details?: Record<string, any>) {
    super(message);
  }
}

export class TransactionError extends PrivacySDKError {
  code = 'TRANSACTION_ERROR';
  
  constructor(
    message: string,
    public provider?: string,
    public transactionHash?: string,
    public details?: Record<string, any>
  ) {
    super(message);
  }
}

export class ProofGenerationError extends PrivacySDKError {
  code = 'PROOF_GENERATION_ERROR';
  
  constructor(message: string, public provider?: string, public details?: Record<string, any>) {
    super(message);
  }
}

export class NetworkError extends PrivacySDKError {
  code = 'NETWORK_ERROR';
  
  constructor(message: string, public provider?: string, public statusCode?: number, public details?: Record<string, any>) {
    super(message);
  }
}

export class ValidationError extends PrivacySDKError {
  code = 'VALIDATION_ERROR';
  
  constructor(message: string, public field?: string, public details?: Record<string, any>) {
    super(message);
  }
}

export class ProviderError extends PrivacySDKError {
  code = 'PROVIDER_ERROR';
  
  constructor(message: string, public provider?: string, public details?: Record<string, any>) {
    super(message);
  }
}

export class KeyManagementError extends PrivacySDKError {
  code = 'KEY_MANAGEMENT_ERROR';
  
  constructor(message: string, public details?: Record<string, any>) {
    super(message);
  }
}