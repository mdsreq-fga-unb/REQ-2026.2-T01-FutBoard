/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        futboard: {
          700: "#176b45",
          800: "#105538",
        },
      },
    },
  },
  plugins: [],
};
