import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Users, Code, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CodeBlock from '@/components/CodeBlock';

const HomePage = () => {
  const features = [
    {
      icon: Shield,
      title: 'Unified Privacy Interface',
      description: 'One API for multiple privacy systems - Railgun, Mina, and Semaphore - with consistent developer experience.',
    },
    {
      icon: Zap,
      title: 'Production Ready',
      description: 'Built for real-world applications with comprehensive error handling, type safety, and enterprise-grade security.',
    },
    {
      icon: Users,
      title: 'Multi-Provider Support',
      description: 'Switch between privacy providers seamlessly or use multiple providers within the same application.',
    },
    {
      icon: Code,
      title: 'Developer First',
      description: 'TypeScript-first design with intuitive APIs, detailed documentation, and comprehensive examples.',
    },
  ];

  const providers = [
    {
      name: 'Railgun',
      description: 'EVM privacy protocol with mature zkSNARK implementation',
      chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
      status: 'Production',
      features: ['Private Transfers', 'Private Swaps', 'DeFi Integration'],
    },
    {
      name: 'Mina',
      description: 'Lightweight blockchain with zkApps for private computation',
      chains: ['Mina Mainnet', 'Berkeley Testnet'],
      status: 'Production',
      features: ['zkApps', 'Constant-size Proofs', 'TypeScript SDK'],
    },
    {
      name: 'Semaphore',
      description: 'Anonymous group membership and signaling protocol',
      chains: ['Ethereum', 'Polygon', 'Arbitrum'],
      status: 'Production',
      features: ['Anonymous Voting', 'Group Signaling', 'Zero-Knowledge Proofs'],
    },
  ];

  const quickStartCode = `import { PrivacySDK, createPrivacySDK } from '@privacy-sdk/core';

// Quick setup with helper function
const sdk = createPrivacySDK({
  provider: 'railgun',
  chainId: 1
});

AWAIT sdk.initialize();

// Execute private transfer
const result = await sdk.recipes.privateTransfer({
  to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
  amount: '1000000000000000000', // 1 ETH
  memo: 'Private payment'
});

console.log('Transaction hash:', result.transactions[0].hash);`;

  const multiProviderCode = `// Multi-provider setup
const sdk = new PrivacySDK({
  defaultProvider: 'railgun',
  providers: {
    railgun: {
      type: 'railgun',
      chainId: 1,
      networkName: 'ethereum'
    },
    mina: {
      type: 'mina',
      chainId: 'mina-mainnet',
      networkId: 'mainnet'
    },
    semaphore: {
      type: 'semaphore',
      chainId: 1,
      groupId: '1'
    }
  }
});

// Use different providers for different operations
await sdk.recipes.privateTransfer({ provider: 'railgun', ... });
await sdk.recipes.anonymousVote({ provider: 'semaphore', ... });`;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Unified Privacy SDK
                <br />
                <span className="gradient-text">for Web3 Developers</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Build private applications with a single, elegant interface. Support for Railgun, Mina, and Semaphore 
                privacy systems with TypeScript-first development experience.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-accent-blue hover:bg-accent-blue-hover">
                <Link to="/docs">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com/privacy-sdk/core" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Why Privacy SDK?
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Everything you need to build privacy-first applications
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/50">
                  <CardHeader>
                    <Icon className="h-10 w-10 text-accent-blue" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Get Started in Minutes
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-semantic-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Install the SDK</h3>
                    <p className="text-muted-foreground">One npm package, multiple privacy systems</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-semantic-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Choose Your Provider</h3>
                    <p className="text-muted-foreground">Railgun for EVM, Mina for zkApps, Semaphore for signaling</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-semantic-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Start Building</h3>
                    <p className="text-muted-foreground">Use recipes for common operations or build custom workflows</p>
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link to="/docs">
                  Read the Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              <CodeBlock
                language="typescript"
                code={quickStartCode}
                title="Quick Start Example"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Providers Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Supported Privacy Systems
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Choose the right privacy solution for your use case
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {providers.map((provider, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{provider.name}</CardTitle>
                    <Badge variant="secondary" className="bg-semantic-success/20 text-semantic-success">
                      {provider.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {provider.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Supported Chains</h4>
                    <div className="flex flex-wrap gap-1">
                      {provider.chains.map((chain) => (
                        <Badge key={chain} variant="outline" className="text-xs">
                          {chain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {provider.features.map((feature) => (
                        <li key={feature} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-semantic-success" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Provider Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <div className="space-y-4">
              <CodeBlock
                language="typescript"
                code={multiProviderCode}
                title="Multi-Provider Setup"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Use Multiple Providers
              </h2>
              <p className="text-muted-foreground text-lg">
                Mix and match privacy systems within the same application. Use Railgun for private DeFi, 
                Mina for complex zkApps, and Semaphore for anonymous governance.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-accent-blue" />
                  <span className="text-sm">Seamless provider switching</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-accent-blue" />
                  <span className="text-sm">Consistent API across all providers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-accent-blue" />
                  <span className="text-sm">Unified event handling and error management</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent-blue/10 to-accent-blue-hover/10">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to Build Private Applications?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground text-lg">
              Join developers who are building the future of privacy-preserving applications with our unified SDK.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent-blue hover:bg-accent-blue-hover">
                <Link to="/docs">
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/guides">
                  View Examples
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;