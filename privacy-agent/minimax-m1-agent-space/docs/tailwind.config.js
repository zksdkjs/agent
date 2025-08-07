/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme color palette
        'canvas-dark': '#0D1117',
        'surface-deep': '#161B22',
        'primary-text': '#E6EDF3',
        'secondary-text': '#8B949E',
        'borders-dividers': '#484F58',
        'accent-blue': '#388BFD',
        'accent-blue-hover': '#58A6FF',
        'success-green': '#3FB950',
        'warning-amber': '#D29922',
        'error-red': '#F85149',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: {
        invert: {
          css: {
            '--tw-prose-body': '#E6EDF3',
            '--tw-prose-headings': '#E6EDF3',
            '--tw-prose-lead': '#8B949E',
            '--tw-prose-links': '#388BFD',
            '--tw-prose-bold': '#E6EDF3',
            '--tw-prose-counters': '#8B949E',
            '--tw-prose-bullets': '#484F58',
            '--tw-prose-hr': '#484F58',
            '--tw-prose-quotes': '#8B949E',
            '--tw-prose-quote-borders': '#484F58',
            '--tw-prose-captions': '#8B949E',
            '--tw-prose-code': '#E6EDF3',
            '--tw-prose-pre-code': '#E6EDF3',
            '--tw-prose-pre-bg': '#161B22',
            '--tw-prose-th-borders': '#484F58',
            '--tw-prose-td-borders': '#484F58',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};