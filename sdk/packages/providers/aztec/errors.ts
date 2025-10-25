export class ValidationError extends Error {
  constructor(message: string, public field: string, public provider: string, public details?: unknown) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ProviderError extends Error {
  constructor(message: string, public provider: string, public details?: unknown) {
    super(message);
    this.name = 'ProviderError';
  }
}
