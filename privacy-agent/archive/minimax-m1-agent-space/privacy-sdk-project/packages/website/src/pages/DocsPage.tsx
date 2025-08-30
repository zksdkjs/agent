import { useState } from 'react';
import { ChevronRight, Download, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CodeBlock from '@/components/CodeBlock';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const navigation = [
    {
      title: 'Getting Started',
      items: [
        { id: 'getting-started', title: 'Quick Start', href: '#getting-started' },
        { id: 'installation', title: 'Installation', href: '#installation' },
        { id: 'configuration', title: 'Configuration', href: '#configuration' },
      ],
    },
    {
      title: 'Core Concepts',
      items: [
        { id: 'architecture', title: 'Architecture', href: '#architecture' },
        { id: 'providers', title: 'Privacy Providers', href: '#providers' },
        { id: 'recipes', title: 'Recipe System', href: '#recipes' },
        { id: 'events', title: 'Event Handling', href: '#events' },
      ],
    },
    {
      title: 'Providers',
      items: [
        { id: 'railgun', title: 'Railgun', href: '#railgun' },
        { id: 'mina', title: 'Mina', href: '#mina' },
        { id: 'semaphore', title: 'Semaphore', href: '#semaphore' },
      ],
    },
  ];

  const installationCode = `# Install the Privacy SDK
npm install @privacy-sdk/core

# Or with yarn
yarn add @privacy-sdk/core

# Or with pnpm
pnpm add @privacy-sdk/core`;

  const quickStartCode = `import { createPrivacySDK } from '@privacy-sdk/core';

// Create and initialize the SDK
const sdk = createPrivacySDK({
  provider: 'railgun',
  chainId: 1 // Ethereum mainnet
});

await sdk.initialize();

// Execute a private transfer
const result = await sdk.recipes.privateTransfer({
  to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
  amount: '1000000000000000000', // 1 ETH in wei
  memo: 'Private payment'
});

console.log('Transaction:', result.transactions[0]);`;

  const configurationCode = `import { PrivacySDK } from '@privacy-sdk/core';

// Advanced configuration with multiple providers
const sdk = new PrivacySDK({
  defaultProvider: 'railgun',
  providers: {
    railgun: {
      type: 'railgun',
      chainId: 1,
      networkType: 'mainnet',
      networkName: 'ethereum',
      // Optional: custom RPC endpoint
      rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/your-api-key'
    },
    mina: {
      type: 'mina',
      chainId: 'mina-mainnet',
      networkType: 'mainnet',
      networkId: 'mainnet'
    },
    semaphore: {
      type: 'semaphore',
      chainId: 1,
      networkType: 'mainnet',
      groupId: '1'
    }
  },
  keyManagement: {
    storage: 'local', // 'memory', 'local', 'secure', or 'custom'
    encryption: true
  }
});`;

  const recipesCode = `// Private Transfer Recipe
await sdk.recipes.privateTransfer({
  to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
  amount: '1000000000000000000',
  token: 'ETH',
  memo: 'Payment for services'
});

// Private Swap Recipe
await sdk.recipes.privateSwap({
  fromToken: '0xA0b86a33E6441ddD8BaFbD36fA20b0D91b42DFfF', // USDC
  toToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  amount: '1000000000', // 1000 USDC
  slippage: 0.5 // 0.5%
});

// Anonymous Voting Recipe
await sdk.recipes.anonymousVote({
  provider: 'semaphore',
  groupId: '1',
  signal: 'option_a'
});`;

  const eventsCode = `// Listen to SDK events
sdk.on('initialized', (data) => {
  console.log('Provider initialized:', data.provider);
});

sdk.on('transaction_pending', (data) => {
  console.log('Transaction pending:', data.transactionHash);
});

sdk.on('transaction_confirmed', (data) => {
  console.log('Transaction confirmed:', data.transactionHash);
});

sdk.on('error', (data) => {
  console.error('SDK error:', data);
});`;

  const sections = {
    'getting-started': (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">Getting Started</h1>
          <p className="text-muted-foreground text-lg">
            Welcome to the Privacy SDK! This guide will help you get up and running with private transactions 
            across multiple Web3 privacy systems.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>What is Privacy SDK?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Privacy SDK is a unified TypeScript library that provides a single interface for multiple 
              privacy-preserving systems in Web3, including Railgun, Mina, and Semaphore.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="text-center p-4 border border-border rounded-lg">
                <div className="text-2xl font-bold text-accent-blue">3</div>
                <div className="text-sm text-muted-foreground">Privacy Systems</div>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <div className="text-2xl font-bold text-accent-blue">1</div>
                <div className="text-sm text-muted-foreground">Unified API</div>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <div className="text-2xl font-bold text-accent-blue">100%</div>
                <div className="text-sm text-muted-foreground">TypeScript</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
          <p className="text-muted-foreground mb-4">
            Get started with Privacy SDK in just a few lines of code:
          </p>
          <CodeBlock
            code={quickStartCode}
            language="typescript"
            title="Quick Start Example"
          />
        </div>
      </div>
    ),
    'installation': (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">Installation</h1>
          <p className="text-muted-foreground text-lg">
            Install the Privacy SDK package using your preferred package manager.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Package Installation</h2>
          <CodeBlock
            code={installationCode}
            language="bash"
            title="Install Privacy SDK"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-accent-blue" />
                <span>Node.js 16.0 or higher</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-accent-blue" />
                <span>TypeScript 4.5 or higher (optional but recommended)</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-accent-blue" />
                <span>Modern browser with BigInt support</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="bg-accent-blue/10 border border-accent-blue/20 rounded-lg p-4">
          <h3 className="font-semibold text-accent-blue mb-2">TypeScript Support</h3>
          <p className="text-sm text-muted-foreground">
            Privacy SDK is built with TypeScript and provides comprehensive type definitions. 
            No additional @types packages are needed.
          </p>
        </div>
      </div>
    ),
    'configuration': (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">Configuration</h1>
          <p className="text-muted-foreground text-lg">
            Learn how to configure the Privacy SDK for different providers and use cases.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Basic Configuration</h2>
          <p className="text-muted-foreground mb-4">
            For simple use cases, use the <code className="bg-muted px-1 rounded">createPrivacySDK</code> helper:
          </p>
          <CodeBlock
            code={`import { createPrivacySDK } from '@privacy-sdk/core';

const sdk = createPrivacySDK({
  provider: 'railgun', // or 'mina', 'semaphore'
  chainId: 1
});`}
            language="typescript"
            title="Basic Configuration"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Advanced Configuration</h2>
          <p className="text-muted-foreground mb-4">
            For production applications, use the full SDK constructor with detailed provider configurations:
          </p>
          <CodeBlock
            code={configurationCode}
            language="typescript"
            title="Advanced Configuration"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuration Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Provider Configuration</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• <code>type</code>: Provider type ('railgun', 'mina', 'semaphore')</li>
                  <li>• <code>chainId</code>: Chain identifier</li>
                  <li>• <code>networkType</code>: 'mainnet', 'testnet', or 'devnet'</li>
                  <li>• <code>rpcUrl</code>: Custom RPC endpoint (optional)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Key Management</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• <code>storage</code>: 'memory', 'local', 'secure', or 'custom'</li>
                  <li>• <code>encryption</code>: Enable key encryption</li>
                  <li>• <code>customStore</code>: Custom storage implementation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
    'recipes': (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">Recipe System</h1>
          <p className="text-muted-foreground text-lg">
            Recipes provide pre-built solutions for common privacy operations, making it easy to implement 
            complex privacy features with simple function calls.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Built-in Recipes</h2>
          <CodeBlock
            code={recipesCode}
            language="typescript"
            title="Recipe Examples"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Private Transfer</span>
                <Badge variant="outline">Railgun, Mina</Badge>
              </CardTitle>
              <CardDescription>
                Send tokens privately between addresses with zero-knowledge proofs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Parameters:</strong> to, amount, token, memo</div>
                <div><strong>Returns:</strong> Transaction result with proof</div>
                <div><strong>Use Case:</strong> Private payments, salary distributions</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Private Swap</span>
                <Badge variant="outline">Railgun</Badge>
              </CardTitle>
              <CardDescription>
                Exchange tokens privately through integrated DEX protocols
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Parameters:</strong> fromToken, toToken, amount, slippage</div>
                <div><strong>Returns:</strong> Swap transaction with privacy proofs</div>
                <div><strong>Use Case:</strong> Private DeFi trading, portfolio rebalancing</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Anonymous Voting</span>
                <Badge variant="outline">Semaphore</Badge>
              </CardTitle>
              <CardDescription>
                Cast votes anonymously while proving group membership
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Parameters:</strong> groupId, signal, proof</div>
                <div><strong>Returns:</strong> Anonymous vote transaction</div>
                <div><strong>Use Case:</strong> DAO governance, anonymous polls</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Custom Recipe</span>
                <Badge variant="outline">Extensible</Badge>
              </CardTitle>
              <CardDescription>
                Create your own recipes for specialized privacy operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Interface:</strong> BaseRecipe class extension</div>
                <div><strong>Features:</strong> Validation, fee estimation, execution</div>
                <div><strong>Use Case:</strong> Custom privacy workflows</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
    'events': (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">Event Handling</h1>
          <p className="text-muted-foreground text-lg">
            The Privacy SDK provides a comprehensive event system for monitoring transactions, 
            provider status, and error handling.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Event Types</h2>
          <CodeBlock
            code={eventsCode}
            language="typescript"
            title="Event Handling"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Provider Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li><code>initialized</code> - Provider successfully initialized</li>
                <li><code>status_changed</code> - Provider status changed</li>
                <li><code>error</code> - Provider error occurred</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li><code>transaction_pending</code> - Transaction submitted</li>
                <li><code>transaction_confirmed</code> - Transaction confirmed</li>
                <li><code>transaction_failed</code> - Transaction failed</li>
                <li><code>balance_updated</code> - Balance changed</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-20">
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className="space-y-4 p-4">
                {navigation.map((section) => (
                  <div key={section.title}>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            activeSection === item.id
                              ? 'bg-accent text-accent-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl">
          <div className="prose prose-invert max-w-none">
            {sections[activeSection] || sections['getting-started']}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocsPage;