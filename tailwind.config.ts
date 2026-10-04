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
        noir: "#0A0A0A",
        coal: "#121212",
        charcoal: "#1A1A1A",
        charcoalHi: "#252525",
        gold: "#C9A227",
        goldHi: "#E4C765",
        goldDim: "#8F7420",
        oxblood: "#6B0F1A",
        oxbloodHi: "#8A1623",
        oxbloodDeep: "#3D0810",
        parchment: "#EFE6D8",
        parchmentDim: "#C9BBA3",
        parchmentDark: "#2B2113",
        ink: "#221A0E",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        head: ["var(--font-head)", "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
        typewriter: ["var(--font-typewriter)", "Courier New", "monospace"],
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(201,162,39,0.35), 0 18px 60px -20px rgba(0,0,0,0.9)",
        plaque: "0 30px 80px -30px rgba(0,0,0,0.9)",
      },
      backgroundImage: {
        "grain-svg":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        smoke: {
          "0%": { transform: "translateY(0) scaleX(1)", opacity: "0" },
          "20%": { opacity: "0.5" },
          "100%": { transform: "translateY(-260px) scaleX(1.6)", opacity: "0" },
        },
        slowPan: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-18px)" },
        },
      },
      animation: {
        smoke: "smoke 9s ease-out infinite",
        slowPan: "slowPan 14s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;