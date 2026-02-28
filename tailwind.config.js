/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neutral-charcoal': '#333333',
        'neutral-gray': '#666666',
        'soft-gray': '#F5F5F7',
        'border-gray': '#E4E4E7',
        'accent-blue-start': '#E0F2FE',
        'accent-blue-end': '#BAE6FD',
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
