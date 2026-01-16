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
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E5C76B",
          dark: "#B8942E",
        },
        purple: {
          DEFAULT: "#6B2D5C",
          light: "#8B4D7C",
          dark: "#4B1D3C",
        },
        cream: {
          DEFAULT: "#FDF8E8",
          dark: "#F5EED6",
        },
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "confetti": "confetti 1s ease-out forwards",
      },
      keyframes: {
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.8)" },
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
