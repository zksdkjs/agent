// zkSDK - Universal Private Transfer SDK
// The "LangChain of Privacy" - Simple interface for all privacy systems

import { TransferParams, TransferResult, PrivacyProvider, ChainType, PrivacyLevel } from './types';

export * from './types';

export class ZkSDK {
  private providers: Map<string, PrivacyProvider> = new Map();
  private chainProviderMap: Map<ChainType, string> = new Map();

  constructor() {
    // Will be populated by agent implementations
  }

  // Register a privacy provider (Railgun, Aztec, Midnight, etc.)
  registerProvider(provider: PrivacyProvider): void {
    this.providers.set(provider.name, provider);
    
    // Map each supported chain to this provider
    for (const chain of provider.config.chains) {
      this.chainProviderMap.set(chain, provider.name);
    }
  }

  // Main transfer function - universal interface
  async transfer(params: TransferParams): Promise<TransferResult> {
    const providerName = this.chainProviderMap.get(params.chain);
    if (!providerName) {
      throw new Error(`No privacy provider found for chain: ${params.chain}`);
    }

    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not registered`);
    }

    // Validate privacy level is supported
    if (!provider.config.privacyLevels.includes(params.privacy)) {
      throw new Error(`Privacy level ${params.privacy} not supported by ${providerName}`);
    }

    return provider.transfer(params);
  }

  // Get estimated gas cost
  async estimateGas(params: TransferParams): Promise<string> {
    const providerName = this.chainProviderMap.get(params.chain);
    if (!providerName) {
      throw new Error(`No privacy provider found for chain: ${params.chain}`);
    }

    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not registered`);
    }

    return provider.config.gasEstimate(params);
  }

  // Get estimated proof generation time
  async estimateProofTime(params: TransferParams): Promise<number> {
    const providerName = this.chainProviderMap.get(params.chain);
    if (!providerName) {
      throw new Error(`No privacy provider found for chain: ${params.chain}`);
    }

    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not registered`);
    }

    return provider.config.proofTimeEstimate(params);
  }

  // Get private balance
  async getBalance(address: string, token: string, chain: ChainType): Promise<string> {
    const providerName = this.chainProviderMap.get(chain);
    if (!providerName) {
      throw new Error(`No privacy provider found for chain: ${chain}`);
    }

    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not registered`);
    }

    return provider.getBalance(address, token);
  }

  // List available chains and their privacy levels
  getSupportedChains(): { chain: ChainType; privacy: PrivacyLevel[]; provider: string }[] {
    const result: { chain: ChainType; privacy: PrivacyLevel[]; provider: string }[] = [];
    
    for (const [chain, providerName] of this.chainProviderMap) {
      const provider = this.providers.get(providerName);
      if (provider) {
        result.push({
          chain,
          privacy: provider.config.privacyLevels,
          provider: providerName
        });
      }
    }
    
    return result;
  }
}

// Default instance - agents will register providers here
export const zkSDK = new ZkSDK();

// AI Agent Implementation Notes:
// 1. START WITH RAILGUN: Implement RailgunProvider first (most mature)
// 2. THEN AZTEC: Add AztecProvider for L2 privacy
// 3. THEN SOLANA: Research and add best Solana privacy solution
// 4. PHASE 2: Add MidnightProvider using minimax-m1-agent-space research
// 5. Continue with Mina and Zama FHE providers