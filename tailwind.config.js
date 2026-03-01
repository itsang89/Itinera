/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neutral-charcoal': '#1A1A1A',
        'neutral-gray': '#6B7280',
        'soft-gray': '#F4F4F5',
        'border-gray': '#E4E4E7',
        'accent-blue-start': '#E0F2FE',
        'accent-blue-end': '#BAE6FD',
        'accent-teal': '#0D9488',
        'accent-teal-light': '#CCFBF1',
        'accent-coral': '#F97316',
        'accent-coral-light': '#FFEDD5',
        'dark-bg': '#121212',
        'dark-surface': '#1e1e1e',
        'dark-elevated': '#2a2a2a',
        'dark-border': '#333333',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      fontSize: {
        'hero': ['2rem', { lineHeight: '1.2' }],
        'page-title': ['1.5rem', { lineHeight: '1.3' }],
        'section': ['1.125rem', { lineHeight: '1.4' }],
        'body': ['0.875rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        ios: '1.25rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
