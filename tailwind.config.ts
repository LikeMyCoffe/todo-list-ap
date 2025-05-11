import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#fdfdd4',
        foreground: "var(--foreground)",
        // Or, if you want to define the colors directly:
        // background: '#f0f0f0',
        // foreground: '#333333',
      },
    },
  },
  plugins: [],
};
export default config;
