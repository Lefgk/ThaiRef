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
        background: "#07070e",
        surface: "#0f0f1a",
        "surface-light": "#16162a",
        border: "#1e1e3a",
        accent: {
          cyan: "#06d6a0",
          teal: "#0891b2",
          purple: "#8b5cf6",
          blue: "#3b82f6",
        },
        muted: "#6b7280",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-accent": "linear-gradient(135deg, #06d6a0 0%, #0891b2 50%, #8b5cf6 100%)",
        "gradient-accent-hover": "linear-gradient(135deg, #05c493 0%, #0782a1 50%, #7c4ddb 100%)",
        "gradient-hero": "linear-gradient(180deg, rgba(7,7,14,0) 0%, rgba(7,7,14,0.8) 60%, #07070e 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(15,15,26,0.5) 0%, rgba(15,15,26,0.9) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-up": "fadeUp 0.6s ease-out",
        "slide-in": "slideIn 0.5s ease-out",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
