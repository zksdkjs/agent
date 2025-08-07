/**
 * Validation utilities
 */

import { ValidationResult, ValidationError, ValidationWarning } from '../types';

/**
 * Validate Ethereum address format
 */
export function validateEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate Mina address format
 */
export function validateMinaAddress(address: string): boolean {
  return /^B62q[A-Za-z0-9]{50,55}$/.test(address);
}

/**
 * Validate amount format (positive integer string)
 */
export function validateAmount(amount: string): boolean {
  if (!/^\d+$/.test(amount)) {
    return false;
  }
  try {
    return BigInt(amount) > 0;
  } catch {
    return false;
  }
}

/**
 * Validate chain ID
 */
export function validateChainId(chainId: string | number): boolean {
  if (typeof chainId === 'number') {
    return chainId > 0;
  }
  if (typeof chainId === 'string') {
    return chainId.length > 0;
  }
  return false;
}

/**
 * Create a validation error
 */
export function createValidationError(
  field: string,
  code: string,
  message: string,
  details?: any
): ValidationError {
  return {
    field,
    code,
    message,
    details
  };
}

/**
 * Create a validation warning
 */
export function createValidationWarning(
  field: string,
  code: string,
  message: string,
  suggestion?: string
): ValidationWarning {
  return {
    field,
    code,
    message,
    suggestion
  };
}

/**
 * Combine multiple validation results
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  for (const result of results) {
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate required fields in an object
 */
export function validateRequiredFields(
  obj: any,
  requiredFields: string[]
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const field of requiredFields) {
    if (!(field in obj) || obj[field] === undefined || obj[field] === null) {
      errors.push(createValidationError(
        field,
        'REQUIRED',
        `Field '${field}' is required`
      ));
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
}