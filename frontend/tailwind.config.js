/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        futboard: {
          50: "#f0f7fc",
          500: "#2C7DA0",
          600: "#1f5f8a",
          700: "#176b45",
          800: "#105538",
          900: "#0D1B2A",
        },
      },
    },
  },
  plugins: [],
};
