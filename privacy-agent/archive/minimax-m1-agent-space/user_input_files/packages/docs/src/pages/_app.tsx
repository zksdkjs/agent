import type { AppProps } from 'next/app';
import { MDXProvider } from '@mdx-js/react';
import Layout from '../components/layout/Layout';
import mdxComponents from '../components/mdx/MDXComponents';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={mdxComponents}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MDXProvider>
  );
}