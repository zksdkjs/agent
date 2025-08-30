import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface NavItem {
  title: string;
  href?: string;
  children?: NavItem[];
}

const navigationData: NavItem[] = [
  {
    title: 'Getting Started',
    children: [
      { title: 'Introduction', href: '/docs/getting-started' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Quick Start', href: '/docs/quick-start' },
    ],
  },
  {
    title: 'Core Concepts',
    children: [
      { title: 'SDK Architecture', href: '/docs/concepts/architecture' },
      { title: 'Provider System', href: '/docs/concepts/providers' },
      { title: 'Recipe System', href: '/docs/concepts/recipes' },
      { title: 'Error Handling', href: '/docs/concepts/errors' },
    ],
  },
  {
    title: 'Providers',
    children: [
      { title: 'Railgun Provider', href: '/docs/providers/railgun' },
      { title: 'Mina Provider', href: '/docs/providers/mina' },
      { title: 'Semaphore Provider', href: '/docs/providers/semaphore' },
    ],
  },
  {
    title: 'Recipes',
    children: [
      { title: 'Private Transfer', href: '/docs/recipes/private-transfer' },
      { title: 'Private Swap', href: '/docs/recipes/private-swap' },
      { title: 'Anonymous Voting', href: '/docs/recipes/anonymous-voting' },
    ],
  },
  {
    title: 'API Reference',
    children: [
      { title: 'PrivacySDK', href: '/api/privacy-sdk' },
      { title: 'Providers', href: '/api/providers' },
      { title: 'Recipes', href: '/api/recipes' },
      { title: 'Types', href: '/api/types' },
    ],
  },
];

interface SidebarItemProps {
  item: NavItem;
  level?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, level = 0 }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(
    item.children?.some(child => router.pathname === child.href) || false
  );
  
  const isActive = item.href === router.pathname;
  const hasChildren = item.children && item.children.length > 0;
  
  const paddingLeft = `${(level + 1) * 12}px`;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-secondary-text hover:text-primary-text transition-colors duration-200"
          style={{ paddingLeft }}
        >
          <span>{item.title}</span>
          {isOpen ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </button>
        
        {isOpen && (
          <div className="space-y-1">
            {item.children?.map((child, index) => (
              <SidebarItem key={index} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={`block px-3 py-2 text-sm transition-colors duration-200 ${
        isActive
          ? 'text-accent-blue bg-accent-blue/10 border-r-2 border-accent-blue'
          : 'text-secondary-text hover:text-primary-text hover:bg-surface-deep/50'
      }`}
      style={{ paddingLeft }}
    >
      {item.title}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-canvas-dark border-r border-borders-dividers pt-16 hidden lg:block">
      <div className="h-full overflow-y-auto">
        <nav className="px-4 py-6 space-y-1">
          {navigationData.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;