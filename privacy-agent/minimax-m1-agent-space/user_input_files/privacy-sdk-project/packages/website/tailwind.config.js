/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Privacy SDK Dark Theme
        canvas: {
          dark: '#0D1117',
        },
        surface: {
          deep: '#161B22',
        },
        text: {
          primary: '#E6EDF3',
          secondary: '#8B949E',
        },
        border: {
          subtle: '#484F58',
        },
        accent: {
          blue: '#388BFD',
          'blue-hover': '#58A6FF',
        },
        semantic: {
          success: '#3FB950',
          warning: '#D29922',
          error: '#F85149',
        },
        // Keep existing shadcn colors
        border: '#484F58',
        input: '#161B22',
        ring: '#388BFD',
        background: '#0D1117',
        foreground: '#E6EDF3',
        primary: {
          DEFAULT: '#388BFD',
          foreground: '#E6EDF3',
        },
        secondary: {
          DEFAULT: '#161B22',
          foreground: '#8B949E',
        },
        destructive: {
          DEFAULT: '#F85149',
          foreground: '#E6EDF3',
        },
        muted: {
          DEFAULT: '#161B22',
          foreground: '#8B949E',
        },
        accent: {
          DEFAULT: '#161B22',
          foreground: '#E6EDF3',
        },
        popover: {
          DEFAULT: '#161B22',
          foreground: '#E6EDF3',
        },
        card: {
          DEFAULT: '#161B22',
          foreground: '#E6EDF3',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '80ch',
            color: '#E6EDF3',
            '[class~="lead"]': {
              color: '#E6EDF3',
            },
            a: {
              color: '#388BFD',
              '&:hover': {
                color: '#58A6FF',
              },
            },
            strong: {
              color: '#E6EDF3',
            },
            'h1, h2, h3, h4': {
              color: '#E6EDF3',
            },
            blockquote: {
              color: '#8B949E',
              borderLeftColor: '#484F58',
            },
            code: {
              color: '#E6EDF3',
              backgroundColor: '#161B22',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#161B22',
              color: '#E6EDF3',
              border: '1px solid #484F58',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: 0,
            },
          },
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};