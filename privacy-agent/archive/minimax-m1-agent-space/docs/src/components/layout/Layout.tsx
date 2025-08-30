import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Privacy SDK - Web3 Privacy Made Simple',
  description = 'A unified TypeScript SDK for implementing private transactions across multiple Web3 privacy systems including Railgun, Mina, and Semaphore.'
}) => {
  const router = useRouter();
  const isDocsPage = router.pathname.startsWith('/docs') || router.pathname.startsWith('/api');

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-canvas-dark text-primary-text">
        <Header />
        
        {isDocsPage ? (
          <div className="flex">
            {/* Left Sidebar - Navigation */}
            <Sidebar />
            
            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64">
              <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="prose prose-invert max-w-none">
                  {children}
                </div>
              </div>
            </main>
            
            {/* Right Sidebar - Table of Contents (will add later) */}
            <aside className="hidden xl:block w-64 flex-shrink-0">
              {/* Table of contents will go here */}
            </aside>
          </div>
        ) : (
          <main>
            {children}
          </main>
        )}
      </div>
    </>
  );
};

export default Layout;