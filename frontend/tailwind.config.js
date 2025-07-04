/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}", // ✅ Supports common files in React
  ],
  theme: {
    extend: {}, // Add custom colors, fonts, etc. here if needed
  },
  plugins: [], // You can add forms, typography, etc. if needed
};