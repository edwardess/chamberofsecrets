/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        brown: {
          50:  '#fdf8f6',
          100: '#f4e1d2',
          200: '#e9cbb5',
          300: '#ddb497',
          400: '#d19e7a',
          500: '#b07e5d',
          600: '#8b5f46',
          700: '#6a4531',
          800: '#4B2E2E', // your chosen dark brown
          900: '#2d1a15',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
}
