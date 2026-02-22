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
        background: "#F9F8F6",
        surface: "#FFFFFF",
        "surface-hover": "#F0EDE8",
        border: "rgba(201,169,110,0.25)",
        "text-primary": "#1A1A1A",
        "text-secondary": "#6B6B6B",
        accent: "#C9A96E",
        "accent-light": "#D4B87A",
        success: "#4A9B5A",
        warning: "#D4942A",
        danger: "#C44545",
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
      },
      backdropBlur: {
        xl: "24px",
      },
    },
  },
  plugins: [],
};

export default config;
