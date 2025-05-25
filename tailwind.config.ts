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
      screens: {
        'xs': '480px',  // Extra small devices
        // Tailwind already includes:
        // 'sm': '640px',  // Small devices like phones
        // 'md': '768px',  // Medium devices like tablets
        // 'lg': '1024px', // Large devices like laptops
        // 'xl': '1280px', // Extra large devices like desktops
        // '2xl': '1536px' // Very large screens
      },
    },
  },
  plugins: [],
};

export default config;
