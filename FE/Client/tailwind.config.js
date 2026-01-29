/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#B91C1C',
        'primary-dark': '#7F1D1D',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
