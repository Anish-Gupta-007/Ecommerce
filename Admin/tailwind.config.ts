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
        background: "#141512",
        surface: "#1A1C16",
        primary: "#FFFFFF",
        secondary: "#EAE6DF",
        muted: "#888888",
        luxury: "#C6A972",
        gold: "#B89C66",
        text: "#FFFFFF",
        border: "rgba(255,255,255,0.1)",
        success: "#1D7A5F",
        error: "#B84242",
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
