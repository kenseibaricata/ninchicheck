/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        'xl-mobile': ['1.5rem', '2rem'],
        '2xl-mobile': ['2rem', '2.5rem'],
        '3xl-mobile': ['2.5rem', '3rem'],
      },
      colors: {
        'primary': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        'success': {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        'warning': {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
    },
  },
  plugins: [],
} 