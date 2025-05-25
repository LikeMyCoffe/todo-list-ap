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
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out, fadeOut 0.5s ease-out 2.5s forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
