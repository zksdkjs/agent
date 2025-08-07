import { useState } from 'react';
import { ExternalLink, Clock, User, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CodeBlock from '@/components/CodeBlock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GuidesPage = () => {
  const [selectedGuide, setSelectedGuide] = useState('basic-usage');

  const guides = [
    {
      id: 'basic-usage',
      title: 'Basic Usage',
      description: 'Learn the fundamentals of using Privacy SDK',
      difficulty: 'Beginner',
      duration: '10 min',
      category: 'Getting Started',
    },
    {
      id: 'multi-provider',
      title: 'Multi-Provider Setup',
      description: 'Use multiple privacy systems in one application',
      difficulty: 'Intermediate',
      duration: '20 min',
      category: 'Advanced',
    },
    {
      id: 'custom-recipes',
      title: 'Creating Custom Recipes',
      description: 'Build your own privacy operation recipes',
      difficulty: 'Advanced',
      duration: '30 min',
      category: 'Advanced',
    },
    {
      id: 'error-handling',
      title: 'Error Handling',
      description: 'Robust error handling and debugging techniques',
      difficulty: 'Intermediate',
      duration: '15 min',
      category: 'Best Practices',
    },
    {
      id: 'production-deployment',
      title: 'Production Deployment',
      description: 'Deploy privacy-enabled applications to production',
      difficulty: 'Advanced',
      duration: '25 min',
      category: 'Deployment',
    },
  ];

  const basicUsageCode = `import { createPrivacySDK } from '@privacy-sdk/core';

// Step 1: Initialize the SDK
const sdk = createPrivacySDK({
  provider: 'railgun',
  chainId: 1
});

// Step 2: Initialize the provider
try {
  await sdk.initialize();
  console.log('SDK initialized successfully');
} catch (error) {
  console.error('Failed to initialize SDK:', error);
}

// Step 3: Execute a private transfer
const transferResult = await sdk.recipes.privateTransfer({
  to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
  amount: '1000000000000000000', // 1 ETH in wei
  memo: 'Private payment for services'
});

console.log('Transfer completed:', transferResult.success);
console.log('Transaction hash:', transferResult.transactions[0].hash);

// Step 4: Check transaction status
sdk.on('transaction_confirmed', (data) => {
  console.log('Transaction confirmed:', data.transactionHash);
});

// Step 5: Clean up when done
process.on('beforeExit', async () => {
  await sdk.destroy();
});`;

  const multiProviderCode = `import { PrivacySDK } from '@privacy-sdk/core';

// Configure multiple providers
const sdk = new PrivacySDK({
  defaultProvider: 'railgun',
  providers: {
    // Railgun for EVM privacy
    railgun: {
      type: 'railgun',
      chainId: 1,
      networkType: 'mainnet',
      networkName: 'ethereum'
    },
    // Mina for zkApps
    mina: {
      type: 'mina',
      chainId: 'mina-mainnet',
      networkType: 'mainnet',
      networkId: 'mainnet'
    },
    // Semaphore for anonymous signaling
    semaphore: {
      type: 'semaphore',
      chainId: 1,
      networkType: 'mainnet',
      groupId: '1'
    }
  }
});

await sdk.initialize();

// Use different providers for different operations

// Private DeFi with Railgun
const defiResult = await sdk.recipes.privateSwap({
  provider: 'railgun',
  fromToken: '0xA0b86a33E6441ddD8BaFbD36fA20b0D91b42DFfF', // USDC
  toToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  amount: '1000000000', // 1000 USDC
  slippage: 0.5
});

// Anonymous voting with Semaphore
const voteResult = await sdk.recipes.anonymousVote({
  provider: 'semaphore',
  groupId: '1',
  signal: 'option_a'
});

// zkApp interaction with Mina
const minaResult = await sdk.recipes.privateTransfer({
  provider: 'mina',
  to: 'B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e',
  amount: '1000000000', // 1 MINA
  memo: 'zkApp payment'
});`;

  const customRecipeCode = `import { BaseRecipe, RecipeParams, RecipeResult, ValidationResult } from '@privacy-sdk/core';

// Define custom parameters interface
interface PrivateBatchTransferParams extends RecipeParams {
  transfers: Array<{
    to: string;
    amount: string;
    memo?: string;
  }>;
  memo?: string;
}

// Create custom recipe class
class PrivateBatchTransferRecipe extends BaseRecipe {
  readonly name = 'private_batch_transfer';
  readonly description = 'Send multiple private transfers in a single batch';
  readonly supportedProviders = ['railgun'];
  readonly requiredParams = ['transfers'];
  readonly optionalParams = ['memo', 'provider'];

  async execute(params: RecipeParams): Promise<RecipeResult> {
    const batchParams = params as PrivateBatchTransferParams;
    const startTime = Date.now();
    
    // Validate parameters
    const validation = this.validate(batchParams);
    if (!validation.valid) {
      throw new Error(\`Invalid parameters: \${validation.errors.map(e => e.message).join(', ')}\`);
    }

    const transactions = [];
    
    // Execute each transfer
    for (const transfer of batchParams.transfers) {
      // Get provider instance and execute transfer
      const provider = await this.getProvider(batchParams.provider || 'railgun');
      const tx = await provider.sendPrivateTransaction({
        type: 'transfer',
        to: transfer.to,
        amount: transfer.amount,
        memo: transfer.memo
      });
      transactions.push(tx);
    }
    
    return this.createRecipeResult(transactions, startTime, true, {
      batchSize: batchParams.transfers.length,
      memo: batchParams.memo
    });
  }

  protected validateRecipeParams(params: RecipeParams): ValidationResult {
    const batchParams = params as PrivateBatchTransferParams;
    const errors = [];
    
    // Validate transfers array
    if (!Array.isArray(batchParams.transfers) || batchParams.transfers.length === 0) {
      errors.push({
        field: 'transfers',
        code: 'REQUIRED',
        message: 'At least one transfer is required'
      });
    }
    
    // Validate each transfer
    batchParams.transfers?.forEach((transfer, index) => {
      if (!transfer.to) {
        errors.push({
          field: \`transfers[\${index}].to\`,
          code: 'REQUIRED',
          message: 'Transfer recipient is required'
        });
      }
      
      if (!transfer.amount) {
        errors.push({
          field: \`transfers[\${index}].amount\`,
          code: 'REQUIRED',
          message: 'Transfer amount is required'
        });
      }
    });
    
    return { valid: errors.length === 0, errors, warnings: [] };
  }
}

// Register and use the custom recipe
const batchRecipe = new PrivateBatchTransferRecipe();

// Execute batch transfer
const result = await batchRecipe.execute({
  provider: 'railgun',
  transfers: [
    { to: '0x742d35Cc...', amount: '1000000000000000000' },
    { to: '0x8ba1f109...', amount: '500000000000000000' }
  ],
  memo: 'Batch payment'
});`;

  const errorHandlingCode = `import { 
  PrivacySDK, 
  ConfigurationError, 
  TransactionError, 
  NetworkError,
  ProofGenerationError
} from '@privacy-sdk/core';

// Comprehensive error handling setup
const sdk = new PrivacySDK(config);

// Handle initialization errors
try {
  await sdk.initialize();
} catch (error) {
  if (error instanceof ConfigurationError) {
    console.error('Configuration issue:', error.message);
    // Check provider settings, network configuration
  } else if (error instanceof NetworkError) {
    console.error('Network connectivity issue:', error.message);
    // Retry with different RPC endpoint
  } else {
    console.error('Unexpected initialization error:', error);
  }
}

// Handle transaction errors
try {
  const result = await sdk.recipes.privateTransfer({
    to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
    amount: '1000000000000000000'
  });
} catch (error) {
  if (error instanceof TransactionError) {
    console.error('Transaction failed:', error.message);
    console.error('Provider:', error.provider);
    console.error('Transaction hash:', error.transactionHash);
    
    // Handle specific transaction failures
    if (error.details?.code === 'INSUFFICIENT_BALANCE') {
      console.log('Insufficient balance for transaction');
    } else if (error.details?.code === 'INVALID_RECIPIENT') {
      console.log('Invalid recipient address');
    }
  } else if (error instanceof ProofGenerationError) {
    console.error('Proof generation failed:', error.message);
    // Retry with different parameters or provider
  }
}

// Global error event handling
sdk.on('error', (data) => {
  console.error('SDK Error:', data);
  
  // Log error details
  console.error('Provider:', data.provider);
  console.error('Timestamp:', new Date(data.timestamp));
  
  // Implement error reporting
  reportError({
    type: 'privacy_sdk_error',
    provider: data.provider,
    error: data.error,
    context: data.context
  });
});

// Retry mechanism for failed operations
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      console.log(\`Attempt \${attempt} failed, retrying in \${delay}ms...\`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  
  throw new Error('Max retries exceeded');
}

// Usage with retry
const result = await retryOperation(async () => {
  return sdk.recipes.privateTransfer(params);
});`;

  const productionCode = `// production-config.ts
import { PrivacySDK } from '@privacy-sdk/core';

// Production configuration
const productionConfig = {
  defaultProvider: 'railgun',
  providers: {
    railgun: {
      type: 'railgun' as const,
      chainId: 1,
      networkType: 'mainnet' as const,
      networkName: 'ethereum',
      rpcUrl: process.env.ETHEREUM_RPC_URL,
      // Use environment variables for sensitive data
      apiKey: process.env.ALCHEMY_API_KEY
    }
  },
  keyManagement: {
    storage: 'secure' as const,
    encryption: true
  },
  logging: {
    level: 'info' as const,
    transport: 'file' as const
  }
};

// Environment-specific SDK factory
export function createProductionSDK() {
  if (!process.env.ETHEREUM_RPC_URL) {
    throw new Error('ETHEREUM_RPC_URL environment variable is required');
  }
  
  return new PrivacySDK(productionConfig);
}

// Error monitoring integration
export function setupErrorMonitoring(sdk: PrivacySDK) {
  sdk.on('error', (data) => {
    // Send to error monitoring service (Sentry, DataDog, etc.)
    errorMonitoringService.captureException(new Error(data.error), {
      tags: {
        provider: data.provider,
        sdk_version: '1.0.0'
      },
      extra: data
    });
  });
}

// Health check endpoint
export async function healthCheck(sdk: PrivacySDK) {
  const health = {
    status: 'healthy',
    providers: {},
    timestamp: new Date().toISOString()
  };
  
  try {
    // Check each provider status
    const providers = sdk.listProviders();
    for (const provider of providers) {
      const status = sdk.getProviderStatus(provider);
      health.providers[provider] = {
        status,
        ready: status === 'ready'
      };
    }
    
    const allReady = Object.values(health.providers).every(
      (p: any) => p.ready
    );
    
    if (!allReady) {
      health.status = 'degraded';
    }
  } catch (error) {
    health.status = 'unhealthy';
    health.error = error.message;
  }
  
  return health;
}

// Graceful shutdown
export async function gracefulShutdown(sdk: PrivacySDK) {
  console.log('Shutting down Privacy SDK...');
  
  try {
    await sdk.destroy();
    console.log('Privacy SDK shutdown complete');
  } catch (error) {
    console.error('Error during SDK shutdown:', error);
  }
}

// Process signal handlers
process.on('SIGTERM', () => gracefulShutdown(sdk));
process.on('SIGINT', () => gracefulShutdown(sdk));`;

  const guideContent = {
    'basic-usage': {
      title: 'Basic Usage Guide',
      description: 'Learn the fundamentals of using Privacy SDK for private transactions.',
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground text-lg mb-6">
              This guide covers the essential steps to get started with Privacy SDK, from installation 
              to executing your first private transaction.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step-by-Step Tutorial</h2>
            <CodeBlock
              code={basicUsageCode}
              language="typescript"
              title="Complete Basic Usage Example"
            />
          </div>
          
          <div className="bg-accent-blue/10 border border-accent-blue/20 rounded-lg p-6">
            <h3 className="font-semibold text-accent-blue mb-3">Key Concepts</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-accent-blue mt-2 flex-shrink-0" />
                <span><strong>Provider:</strong> The privacy system (Railgun, Mina, Semaphore) that processes your transactions</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-accent-blue mt-2 flex-shrink-0" />
                <span><strong>Recipe:</strong> Pre-built functions for common operations like transfers and swaps</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-accent-blue mt-2 flex-shrink-0" />
                <span><strong>Events:</strong> Real-time notifications about transaction status and provider state</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    'multi-provider': {
      title: 'Multi-Provider Setup',
      description: 'Learn how to use multiple privacy systems in a single application.',
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground text-lg mb-6">
              Privacy SDK allows you to use multiple privacy providers simultaneously, enabling you to 
              choose the best system for each specific operation.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Multi-Provider Configuration</h2>
            <CodeBlock
              code={multiProviderCode}
              language="typescript"
              title="Multi-Provider Setup"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Railgun</CardTitle>
                <CardDescription>Best for EVM privacy</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• Private transfers</li>
                  <li>• Private swaps</li>
                  <li>• DeFi integration</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mina</CardTitle>
                <CardDescription>Best for zkApps</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• zkApp interactions</li>
                  <li>• Constant-size proofs</li>
                  <li>• TypeScript zkApps</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Semaphore</CardTitle>
                <CardDescription>Best for signaling</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• Anonymous voting</li>
                  <li>• Group membership</li>
                  <li>• Private signaling</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    'custom-recipes': {
      title: 'Creating Custom Recipes',
      description: 'Build your own privacy operation recipes for specialized use cases.',
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground text-lg mb-6">
              Custom recipes allow you to encapsulate complex privacy operations into reusable, 
              well-tested components with built-in validation and error handling.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Custom Recipe Implementation</h2>
            <CodeBlock
              code={customRecipeCode}
              language="typescript"
              title="Custom Batch Transfer Recipe"
            />
          </div>
          
          <div className="bg-semantic-warning/10 border border-semantic-warning/20 rounded-lg p-6">
            <h3 className="font-semibold text-semantic-warning mb-3">Best Practices</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-semantic-warning mt-2 flex-shrink-0" />
                <span>Always implement comprehensive parameter validation</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-semantic-warning mt-2 flex-shrink-0" />
                <span>Provide meaningful error messages and codes</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-semantic-warning mt-2 flex-shrink-0" />
                <span>Include fee estimation for complex operations</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 rounded-full bg-semantic-warning mt-2 flex-shrink-0" />
                <span>Test recipes thoroughly with different providers</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    'error-handling': {
      title: 'Error Handling Guide',
      description: 'Implement robust error handling and debugging for production applications.',
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground text-lg mb-6">
              Proper error handling is crucial for production privacy applications. This guide covers 
              comprehensive error handling strategies and debugging techniques.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Error Handling Implementation</h2>
            <CodeBlock
              code={errorHandlingCode}
              language="typescript"
              title="Comprehensive Error Handling"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Error Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• <code>ConfigurationError</code> - Setup issues</li>
                  <li>• <code>TransactionError</code> - Transaction failures</li>
                  <li>• <code>NetworkError</code> - Connectivity issues</li>
                  <li>• <code>ProofGenerationError</code> - ZK proof failures</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recovery Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• Exponential backoff retry</li>
                  <li>• Provider fallback</li>
                  <li>• Graceful degradation</li>
                  <li>• User-friendly error messages</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    'production-deployment': {
      title: 'Production Deployment',
      description: 'Deploy privacy-enabled applications to production with confidence.',
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground text-lg mb-6">
              This guide covers best practices for deploying Privacy SDK applications to production, 
              including configuration management, monitoring, and security considerations.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Production Configuration</h2>
            <CodeBlock
              code={productionCode}
              language="typescript"
              title="Production Setup"
            />
          </div>
          
          <div className="bg-semantic-success/10 border border-semantic-success/20 rounded-lg p-6">
            <h3 className="font-semibold text-semantic-success mb-3">Production Checklist</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border border-semantic-success bg-semantic-success/20" />
                <span>Environment variables for sensitive configuration</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border border-semantic-success bg-semantic-success/20" />
                <span>Error monitoring and alerting setup</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border border-semantic-success bg-semantic-success/20" />
                <span>Health check endpoints implemented</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border border-semantic-success bg-semantic-success/20" />
                <span>Graceful shutdown handling</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border border-semantic-success bg-semantic-success/20" />
                <span>Comprehensive logging configured</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Guides & Tutorials</h1>
        <p className="text-muted-foreground text-lg">
          Step-by-step guides to help you master Privacy SDK and build production-ready privacy applications.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar with guide list */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {guides.map((guide) => (
              <Card
                key={guide.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedGuide === guide.id ? 'ring-2 ring-accent-blue bg-muted/30' : ''
                }`}
                onClick={() => setSelectedGuide(guide.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{guide.title}</CardTitle>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {guide.difficulty}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{guide.duration}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${
                      selectedGuide === guide.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                  <CardDescription className="text-xs">
                    {guide.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="prose prose-invert max-w-none">
            {guideContent[selectedGuide] && (
              <div>
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">
                    {guideContent[selectedGuide].title}
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    {guideContent[selectedGuide].description}
                  </p>
                </div>
                {guideContent[selectedGuide].content}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidesPage;