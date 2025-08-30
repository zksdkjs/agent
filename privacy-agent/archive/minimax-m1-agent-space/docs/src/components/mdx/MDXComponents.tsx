import React from 'react';
import Link from 'next/link';
import { MDXComponents } from 'mdx/types';

// Custom code block component
const CodeBlock: React.FC<{ children: string; className?: string }> = ({ children, className }) => {
  const language = className?.replace('language-', '') || 'text';
  
  return (
    <div className="bg-surface-deep rounded-lg border border-borders-dividers overflow-hidden my-6">
      <div className="px-4 py-3 bg-borders-dividers/20 border-b border-borders-dividers flex items-center justify-between">
        <span className="text-sm text-secondary-text font-mono capitalize">{language}</span>
        <button 
          onClick={() => navigator.clipboard?.writeText(children)}
          className="text-sm text-accent-blue hover:text-accent-blue-hover transition-colors duration-200"
        >
          Copy
        </button>
      </div>
      <pre className="p-6 overflow-x-auto">
        <code className="text-sm text-primary-text font-mono leading-relaxed">
          {children}
        </code>
      </pre>
    </div>
  );
};

// Custom inline code component
const InlineCode: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code className="px-2 py-1 bg-surface-deep text-accent-blue text-sm font-mono rounded border border-borders-dividers">
    {children}
  </code>
);

// Custom callout component for notes, warnings, etc.
const Callout: React.FC<{ type?: 'note' | 'warning' | 'tip'; children: React.ReactNode }> = ({ 
  type = 'note', 
  children 
}) => {
  const styles = {
    note: 'border-l-warning-amber bg-warning-amber/5',
    warning: 'border-l-error-red bg-error-red/5',
    tip: 'border-l-success-green bg-success-green/5',
  };

  const icons = {
    note: '📝',
    warning: '⚠️',
    tip: '💡',
  };

  return (
    <div className={`border-l-4 p-4 my-6 rounded-r-lg ${styles[type]}`}>
      <div className="flex items-start space-x-3">
        <span className="text-lg">{icons[type]}</span>
        <div className="flex-1 text-primary-text">{children}</div>
      </div>
    </div>
  );
};

// Define custom MDX components
const mdxComponents: MDXComponents = {
  // Headings
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold text-primary-text mb-6 mt-8 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-semibold text-primary-text mb-4 mt-8 border-b border-borders-dividers pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-semibold text-primary-text mb-3 mt-6">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-xl font-medium text-primary-text mb-2 mt-4">
      {children}
    </h4>
  ),
  
  // Paragraphs and text
  p: ({ children }) => (
    <p className="text-primary-text leading-relaxed mb-4">
      {children}
    </p>
  ),
  
  // Links
  a: ({ href, children }) => {
    if (href?.startsWith('http')) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-blue hover:text-accent-blue-hover underline transition-colors duration-200"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href || '#'}
        className="text-accent-blue hover:text-accent-blue-hover underline transition-colors duration-200"
      >
        {children}
      </Link>
    );
  },
  
  // Lists
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-primary-text">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-primary-text">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-primary-text">{children}</li>
  ),
  
  // Code
  code: ({ children, className }) => {
    if (className?.includes('language-')) {
      return <CodeBlock className={className}>{String(children)}</CodeBlock>;
    }
    return <InlineCode>{children}</InlineCode>;
  },
  pre: ({ children }) => children, // Let the code component handle the styling
  
  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-accent-blue pl-4 py-2 my-4 bg-surface-deep/50 rounded-r">
      <div className="text-secondary-text italic">{children}</div>
    </blockquote>
  ),
  
  // Tables
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border border-borders-dividers rounded-lg">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-surface-deep">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-primary-text font-semibold border-b border-borders-dividers">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-primary-text border-b border-borders-dividers">
      {children}
    </td>
  ),
  
  // Horizontal rule
  hr: () => (
    <hr className="border-borders-dividers my-8" />
  ),
  
  // Custom components
  Callout,
};

export default mdxComponents;