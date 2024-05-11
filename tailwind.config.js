/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['IRANSansWeb'],
    },
    container: {
      center: true,
    },
    variants: {
      extend: {
        display: ['group-hover'],
      },
    },
    screens: {
      sm: '480px',
      md: '830px',
      lg: '1160px',
      xl: '1279px',
    },
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('tailwindcss-animated'),
  ],
}
