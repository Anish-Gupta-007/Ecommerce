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
        background: "#EBE6DF", // Distinct Oatmeal / Desert Sand (Clearly NOT white)
        surface: "#F5F2EC", // Lighter sand for cards/elements to pop
        primary: "#2B2D26", // Deep Olive/Charcoal
        secondary: "#7A8B80", // Muted Sage Green
        muted: "#9CA3AF",
        luxury: "#C9A66B", // Warm Gold
        gold: "#B89659",
        text: "#2B2D26",
        border: "rgba(43, 45, 38, 0.12)",
        success: "#4A6E5C",
        error: "#A34141",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
