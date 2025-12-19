/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        header: ['"Plus Jakarta Sans"', 'sans-serif'],
        accent: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        primary: '#f59e0b', // Amber Gold
        secondary: '#0f172a', // Midnight Navy
        background: '#fafaf9', // Warm Stone
        text: '#1c1917', // Deep Charcoal
        border: '#e7e5e4', // Soft Gray
        surface: '#ffffff',
        muted: '#78716c',
      },
      fontFamily: {
        main: ['Public Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        md: '12px',
      },
      boxShadow: {
        card: '0 10px 15px -3px rgba(15, 23, 42, 0.05)',
      },
      typography: {
        DEFAULT: {
          css: {
            h1: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
            h2: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
            h3: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
            h4: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
            code: { fontFamily: '"JetBrains Mono", monospace' },
            maxWidth: 'none',
            color: '#334155',
            a: {
              color: '#0ea5e9',
              '&:hover': {
                color: '#0284c7',
              },
            },
            code: {
              backgroundColor: '#f1f5f9',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
