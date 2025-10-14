/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#4338ca',
        'brand-exchange': '#0f766e',
        'brand-community': '#db2777',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      boxShadow: {
        primary: '0 25px 55px rgba(79, 70, 229, 0.12)',
        panel: '0 24px 48px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
} 
