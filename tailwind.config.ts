import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          dark: "#1d4ed8"
        },
        shell: {
          bg: "#f9fafb",
          border: "#e5e7eb"
        }
      },
      maxWidth: {
        content: "72rem"
      }
    }
  },
  plugins: []
};

export default config;

