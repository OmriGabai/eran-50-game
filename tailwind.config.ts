import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        orange: {
          DEFAULT: "#FF6B00",
          light: "#FF8533",
          dark: "#E55A00",
        },
        dark: {
          DEFAULT: "#1a1a1a",
          lighter: "#2d2d2d",
        },
        // Keep gold/purple/cream for backwards compatibility (mapped to new colors)
        gold: {
          DEFAULT: "#FF6B00",
          light: "#FF8533",
          dark: "#E55A00",
        },
        purple: {
          DEFAULT: "#ffffff",
          light: "#f5f5f5",
          dark: "#e0e0e0",
        },
        cream: {
          DEFAULT: "#f5f5f5",
          dark: "#e0e0e0",
        },
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-gold": "pulse-orange 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "confetti": "confetti 1s ease-out forwards",
      },
      keyframes: {
        "pulse-orange": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 107, 0, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 107, 0, 0.8)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
