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
        'neutral-gray': '#71717A',
        'soft-gray': '#F4F4F5',
        'border-gray': '#E4E4E7',
        'accent-blue-start': '#E0F2FE',
        'accent-blue-end': '#BAE6FD',
        // Dark mode surface/background
        'dark-bg': '#0f0f0f',
        'dark-surface': '#1a1a1a',
        'dark-elevated': '#262626',
        'dark-border': '#2e2e2e',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        ios: '1.25rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
