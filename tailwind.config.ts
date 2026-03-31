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
        brand: {
          coral:          "#F04E37",
          orange:         "#FF8C38",
          purple:         "#7B2FBE",
          "purple-light": "#A855F7",
          cream:          "#FFF8F4",
          charcoal:       "#1E1A2E",
          mist:           "#F5EEF8",
        },
      },
      fontFamily: {
        headline: ["Poppins", "Nunito", "sans-serif"],
        body:     ["Inter", "sans-serif"],
        price:    ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(to right, #F04E37, #FF8C38)",
        "brand-gradient-v": "linear-gradient(to bottom, #F04E37, #FF8C38)",
      },
      animation: {
        "pulse-slow":   "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in":      "fadeIn 0.4s ease-in-out",
        "slide-up":     "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
