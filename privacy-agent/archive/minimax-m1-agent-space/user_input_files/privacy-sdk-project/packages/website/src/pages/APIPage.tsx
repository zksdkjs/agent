import { useState } from 'react';
import { Search, ExternalLink, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeBlock from '@/components/CodeBlock';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const APIPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAPI, setSelectedAPI] = useState('privacy-sdk');

  const apiSections = [
    {
      id: 'privacy-sdk',
      title: 'PrivacySDK',
      description: 'Main SDK class for managing privacy providers and recipes',
    },
    {
      id: 'providers',
      title: 'Privacy Providers',
      description: 'Provider implementations for different privacy systems',
    },
    {
      id: 'recipes',
      title: 'Recipe System',
      description: 'Pre-built solutions for common privacy operations',
    },
    {
      id: 'types',
      title: 'Types & Interfaces',
      description: 'TypeScript type definitions and interfaces',
    },
    {
      id: 'utilities',
      title: 'Utilities',
      description: 'Helper functions and utility classes',
    },
  ];

  const privacySDKMethods = [
    {
      name: 'constructor',
      signature: 'new PrivacySDK(config: SDKConfig)',
      description: 'Create a new Privacy SDK instance with the specified configuration.',
      parameters: [
        { name: 'config', type: 'SDKConfig', description: 'SDK configuration object' },
      ],
      returns: 'PrivacySDK',
      example: `const sdk = new PrivacySDK({
  defaultProvider: 'railgun',
  providers: {
    railgun: {
      type: 'railgun',
      chainId: 1,
      networkName: 'ethereum'
    }
  }
});`,
    },
    {
      name: 'initialize',
      signature: 'initialize(): Promise<void>',
      description: 'Initialize all configured providers and prepare the SDK for use.',
      parameters: [],
      returns: 'Promise<void>',
      example: `await sdk.initialize();
console.log('SDK ready:', sdk.isReady());`,
    },
    {
      name: 'getProvider',
      signature: 'getProvider(name: string): PrivacyProvider',
      description: 'Get a specific privacy provider by name.',
      parameters: [
        { name: 'name', type: 'string', description: 'Provider name (e.g., "railgun", "mina", "semaphore")' },
      ],
      returns: 'PrivacyProvider',
      example: `const railgun = sdk.getProvider('railgun');
const info = railgun.getProviderInfo();`,
    },
    {
      name: 'recipes.privateTransfer',
      signature: 'recipes.privateTransfer(params: PrivateTransferParams): Promise<RecipeResult>',
      description: 'Execute a private token transfer using the configured provider.',
      parameters: [
        { name: 'params', type: 'PrivateTransferParams', description: 'Transfer parameters' },
      ],
      returns: 'Promise<RecipeResult>',
      example: `const result = await sdk.recipes.privateTransfer({
  to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
  amount: '1000000000000000000',
  memo: 'Private payment'
});`,
    },
    {
      name: 'on',
      signature: 'on(event: ProviderEvent, callback: (data: EventData) => void): void',
      description: 'Listen for SDK events such as transaction confirmations and errors.',
      parameters: [
        { name: 'event', type: 'ProviderEvent', description: 'Event type to listen for' },
        { name: 'callback', type: '(data: EventData) => void', description: 'Event callback function' },
      ],
      returns: 'void',
      example: `sdk.on('transaction_confirmed', (data) => {
  console.log('Transaction confirmed:', data.transactionHash);
});`,
    },
  ];

  const providerMethods = [
    {
      name: 'sendPrivateTransaction',
      signature: 'sendPrivateTransaction(params: PrivateTransactionParams): Promise<TransactionResult>',
      description: 'Send a private transaction using this provider.',
      parameters: [
        { name: 'params', type: 'PrivateTransactionParams', description: 'Transaction parameters' },
      ],
      returns: 'Promise<TransactionResult>',
      example: `const result = await provider.sendPrivateTransaction({
  type: 'transfer',
  to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
  amount: '1000000000000000000',
  memo: 'Private payment'
});`,
    },
    {
      name: 'getPrivateBalance',
      signature: 'getPrivateBalance(params: BalanceParams): Promise<PrivateBalance>',
      description: 'Get private balance for an address.',
      parameters: [
        { name: 'params', type: 'BalanceParams', description: 'Balance query parameters' },
      ],
      returns: 'Promise<PrivateBalance>',
      example: `const balance = await provider.getPrivateBalance({
  address: 'private_address',
  tokens: ['ETH', '0xA0b86a33E6441ddD8BaFbD36fA20b0D91b42DFfF']
});`,
    },
    {
      name: 'generatePrivateAddress',
      signature: 'generatePrivateAddress(): Promise<PrivateAddressInfo>',
      description: 'Generate a new private address for receiving funds.',
      parameters: [],
      returns: 'Promise<PrivateAddressInfo>',
      example: `const addressInfo = await provider.generatePrivateAddress();
console.log('New address:', addressInfo.address);`,
    },
  ];

  const typeDefinitions = [
    {
      name: 'SDKConfig',
      description: 'Configuration object for initializing the Privacy SDK',
      definition: `interface SDKConfig {
  defaultProvider: string;
  providers: Record<string, ProviderConfig>;
  keyManagement?: KeyManagementConfig;
  logging?: LoggingConfig;
}`,
    },
    {
      name: 'PrivateTransactionParams',
      description: 'Parameters for private transaction operations',
      definition: `interface PrivateTransactionParams {
  type: TransactionType;
  from?: PrivateAddress;
  to: PrivateAddress | PublicAddress;
  amount: Amount;
  token?: TokenInfo | Address;
  fee?: Amount;
  memo?: string;
  proof?: ProofData;
  metadata?: Record<string, any>;
}`,
    },
    {
      name: 'TransactionResult',
      description: 'Result of a transaction operation',
      definition: `interface TransactionResult {
  hash: TransactionHash;
  status: TransactionStatus;
  provider: string;
  chainId: ChainId;
  timestamp: number;
  confirmations?: number;
  blockNumber?: number;
  fee?: Amount;
  proof?: ProofData;
  metadata?: Record<string, any>;
}`,
    },
    {
      name: 'RecipeResult',
      description: 'Result of a recipe execution',
      definition: `interface RecipeResult {
  success: boolean;
  transactions: TransactionResult[];
  totalFees: Amount;
  executionTime: number;
  metadata?: Record<string, any>;
}`,
    },
  ];

  const utilities = [
    {
      name: 'createPrivacySDK',
      signature: 'createPrivacySDK(config: SimpleConfig): PrivacySDK',
      description: 'Helper function to create a Privacy SDK instance with minimal configuration.',
      example: `const sdk = createPrivacySDK({
  provider: 'railgun',
  chainId: 1
});`,
    },
    {
      name: 'formatAmount',
      signature: 'formatAmount(amount: string, decimals?: number): string',
      description: 'Format a token amount for display purposes.',
      example: `const formatted = formatAmount('1000000000000000000', 18);
console.log(formatted); // "1.0"`,
    },
    {
      name: 'parseAmount',
      signature: 'parseAmount(amount: string, decimals?: number): string',
      description: 'Parse a display amount into the correct token units.',
      example: `const parsed = parseAmount('1.5', 18);
console.log(parsed); // "1500000000000000000"`,
    },
  ];

  const renderMethodCard = (method: any) => (
    <Card key={method.name} className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-mono">{method.name}</CardTitle>
            <CardDescription className="font-mono text-sm mt-1">
              {method.signature}
            </CardDescription>
          </div>
          <Badge variant="outline">{method.returns}</Badge>
        </div>
        <p className="text-muted-foreground mt-2">{method.description}</p>
      </CardHeader>
      <CardContent>
        {method.parameters && method.parameters.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Parameters</h4>
            <div className="space-y-2">
              {method.parameters.map((param: any, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <code className="bg-muted px-2 py-1 rounded text-sm">{param.name}</code>
                  <div>
                    <Badge variant="secondary" className="text-xs mr-2">{param.type}</Badge>
                    <span className="text-sm text-muted-foreground">{param.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {method.example && (
          <div>
            <h4 className="font-semibold mb-2">Example</h4>
            <CodeBlock
              code={method.example}
              language="typescript"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderTypeCard = (type: any) => (
    <Card key={type.name} className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-mono">{type.name}</CardTitle>
        <CardDescription>{type.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CodeBlock
          code={type.definition}
          language="typescript"
          title="Type Definition"
        />
      </CardContent>
    </Card>
  );

  const apiContent = {
    'privacy-sdk': (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">PrivacySDK</h1>
          <p className="text-muted-foreground text-lg">
            The main SDK class that provides a unified interface for privacy operations across multiple providers.
          </p>
        </div>
        <div>
          {privacySDKMethods.map(renderMethodCard)}
        </div>
      </div>
    ),
    'providers': (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Providers</h1>
          <p className="text-muted-foreground text-lg">
            Provider implementations that handle privacy operations for specific systems (Railgun, Mina, Semaphore).
          </p>
        </div>
        <div>
          {providerMethods.map(renderMethodCard)}
        </div>
      </div>
    ),
    'recipes': (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Recipe System</h1>
          <p className="text-muted-foreground text-lg">
            Pre-built solutions for common privacy operations with built-in validation and error handling.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>privateTransfer</CardTitle>
              <CardDescription>Send tokens privately between addresses</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={`await sdk.recipes.privateTransfer({
  to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
  amount: '1000000000000000000',
  token: 'ETH',
  memo: 'Private payment'
});`}
                language="typescript"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>privateSwap</CardTitle>
              <CardDescription>Exchange tokens privately through DEX</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={`await sdk.recipes.privateSwap({
  fromToken: '0xA0b86a33E6441ddD8BaFbD36fA20b0D91b42DFfF',
  toToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  amount: '1000000000',
  slippage: 0.5
});`}
                language="typescript"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>anonymousVote</CardTitle>
              <CardDescription>Cast anonymous votes using zero-knowledge proofs</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={`await sdk.recipes.anonymousVote({
  provider: 'semaphore',
  groupId: '1',
  signal: 'option_a'
});`}
                language="typescript"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Custom Recipes</CardTitle>
              <CardDescription>Create your own privacy operation recipes</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={`class CustomRecipe extends BaseRecipe {
  readonly name = 'custom_operation';
  readonly supportedProviders = ['railgun'];
  
  async execute(params) {
    // Custom implementation
  }
}`}
                language="typescript"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    ),
    'types': (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Types & Interfaces</h1>
          <p className="text-muted-foreground text-lg">
            TypeScript type definitions and interfaces used throughout the Privacy SDK.
          </p>
        </div>
        <div>
          {typeDefinitions.map(renderTypeCard)}
        </div>
      </div>
    ),
    'utilities': (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Utilities</h1>
          <p className="text-muted-foreground text-lg">
            Helper functions and utility classes for common operations.
          </p>
        </div>
        <div>
          {utilities.map((util) => (
            <Card key={util.name} className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-mono">{util.name}</CardTitle>
                <CardDescription className="font-mono text-sm">
                  {util.signature}
                </CardDescription>
                <p className="text-muted-foreground mt-2">{util.description}</p>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={util.example}
                  language="typescript"
                  title="Example"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-20">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search API..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-2">
                {apiSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedAPI(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedAPI === section.id
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="font-medium">{section.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {section.description}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl">
          <div className="prose prose-invert max-w-none">
            {apiContent[selectedAPI]}
          </div>
        </main>
      </div>
    </div>
  );
};

export default APIPage;