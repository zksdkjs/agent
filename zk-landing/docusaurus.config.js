// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'zksdk',
  tagline: '',
  favicon: 'img/zkimage.png',

  // Set the production url of your site here
  url: 'https://zksdk.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    ['classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/zksdkjs/zksdk/tree/main/',
        },
        blog: false, // Disable the blog feature
        sitemap: {
          changefreq: 'daily',
          priority: 0.7,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      stylesheets: [
        {
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap',
          type: 'text/css',
        },
      ],
      image: 'img/zkimage.png',
      navbar: {
        title: 'zk',
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/zksdkjs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'zkthings',
            items: [
              {
                label: 'zkthings Documentation',
                to: '/docs/intro',
              },
              {
                label: 'NPM Packages',
                href: 'https://www.npmjs.com/org/zkthings',
              },
            ],
          },
          {
            title: 'zkSDKjs',
            items: [
              {
                label: 'zkSDKjs Documentation',
                to: '/docs/zksdkjs/building-sdk/whitepaper',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/zksdkjs/agent',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/zksdkjs',
              },
              {
                label: 'x',
                href: 'https://x.com/zksdk_dev',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} zkThings labs. • Powered by Goose`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      metadata: [],
    }),
};

export default config;
