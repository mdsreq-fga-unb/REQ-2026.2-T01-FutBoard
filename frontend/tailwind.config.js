/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0E3A29",
          lime: "#C6E96B",
          deep: "#10281E",
          beige: "#E4DFD2",
          canvas: "#F5F2EA",
          olive: "#8A8D80",
          white: "#FFFFFF",
        },
        futboard: {
          50: "#F5F2EA",
          100: "#E4DFD2",
          300: "#C6E96B",
          400: "#8A8D80",
          500: "#0E3A29",
          600: "#0E3A29",
          700: "#0E3A29",
          800: "#10281E",
          900: "#10281E",
        },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
