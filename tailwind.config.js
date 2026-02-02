/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'water-blue': '#0ea5e9',
        'water-dark': '#0369a1',
        'pipe-gray': '#6b7280',
        'pump-green': '#22c55e',
        'pump-red': '#ef4444',
        'valve-open': '#22c55e',
        'valve-closed': '#ef4444',
      }
    },
  },
  plugins: [],
}
