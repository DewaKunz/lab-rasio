import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Nunito",
          "Quicksand",
          "Plus Jakarta Sans",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderWidth: {
        '6': '6px',
      },
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc8fc",
          400: "#36abf8",
          500: "#0b8fe8",
          600: "#0271c7",
          700: "#035aa2",
          800: "#074c85",
          900: "#0c406e",
        },
      },
    },
  },
  plugins: [],
};

export default config;
