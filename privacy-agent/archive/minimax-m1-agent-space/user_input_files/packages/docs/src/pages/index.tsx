import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon, ShieldCheckIcon, CubeIcon, BoltIcon } from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: 'Unified Privacy Interface',
      description: 'One simple API to interact with multiple privacy protocols including Railgun, Mina, and Semaphore.',
    },
    {
      icon: <CubeIcon className="h-8 w-8" />,
      title: 'Plugin Architecture',
      description: 'Modular design allows easy integration of new privacy systems without breaking existing code.',
    },
    {
      icon: <BoltIcon className="h-8 w-8" />,
      title: 'Ready-to-Use Recipes',
      description: 'Pre-built solutions for common privacy operations like private transfers, swaps, and anonymous voting.',
    },
  ];

  const codeExample = `import { PrivacySDK, RailgunProvider } from '@privacy-sdk/core';

// Initialize the SDK
const sdk = new PrivacySDK();

// Register a privacy provider
const railgun = new RailgunProvider({
  network: 'ethereum',
  rpcUrl: 'https://eth-mainnet.rpc.url'
});

await sdk.registerProvider('railgun', railgun);

// Perform a private transfer
const result = await sdk.recipes.privateTransfer({
  provider: 'railgun',
  amount: '1.0',
  token: '0xA0b86a33E6441e6D6e35e5c73Ff3CB8...', 
  to: '0x742d35Cc6634C0532925a3b8D4A2D51...'
});

console.log('Transaction:', result.transactionId);`;

  return (
    <div className="min-h-screen bg-canvas-dark">
      {/* Hero Section */}
      <section className="px-6 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-primary-text mb-6">
            Web3 Privacy
            <span className="text-accent-blue"> Made Simple</span>
          </h1>
          
          <p className="text-xl text-secondary-text mb-8 max-w-2xl mx-auto leading-relaxed">
            A unified TypeScript SDK that simplifies private transactions across multiple Web3 privacy systems. 
            Build privacy-first applications with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center px-6 py-3 bg-accent-blue text-white font-medium rounded-lg hover:bg-accent-blue-hover transition-colors duration-200"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              href="/api"
              className="inline-flex items-center px-6 py-3 border border-borders-dividers text-primary-text font-medium rounded-lg hover:bg-surface-deep transition-colors duration-200"
            >
              View API Reference
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-surface-deep/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-primary-text text-center mb-12">
            Why Choose Privacy SDK?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-blue/10 text-accent-blue rounded-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary-text mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-text leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary-text text-center mb-8">
            Get Started in Minutes
          </h2>
          
          <div className="bg-surface-deep rounded-lg border border-borders-dividers overflow-hidden">
            <div className="px-4 py-3 bg-borders-dividers/20 border-b border-borders-dividers flex items-center justify-between">
              <span className="text-sm text-secondary-text font-mono">TypeScript</span>
              <button className="text-sm text-accent-blue hover:text-accent-blue-hover transition-colors duration-200">
                Copy
              </button>
            </div>
            <pre className="p-6 overflow-x-auto">
              <code className="text-sm text-primary-text font-mono leading-relaxed">
                {codeExample}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-surface-deep/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-text mb-4">
            Ready to Build Private Applications?
          </h2>
          <p className="text-lg text-secondary-text mb-8">
            Join developers who are building the future of private Web3 applications.
          </p>
          
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center px-8 py-4 bg-accent-blue text-white font-medium text-lg rounded-lg hover:bg-accent-blue-hover transition-colors duration-200"
          >
            Start Building Now
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;