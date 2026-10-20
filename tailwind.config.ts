import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        "4/5": "4 / 5",
        "5/4": "5 / 4",
        "4/3": "4 / 3",
        "16/10": "16 / 10",
        square: "1 / 1",
        video: "16 / 9",
      },
      colors: {
        atelier: {
          canvas: "#FAF7F2",
          surface: "#FFFFFF",
          card: "#FCFBF9",
          ink: "#1C281F",
          "ink-light": "#3F4E42",
          muted: "#667264",
          brass: "#967F4F",
          "brass-light": "#BBA577",
          "brass-dark": "#756138",
          border: "#E8E2D8",
          "border-subtle": "#F0EBE3",
          velvet: "#542034",
          "velvet-light": "#78304D",
        },
        paper: "#FAF7F2",
        ink: {
          DEFAULT: "#1C281F",
          light: "#3F4E42",
          muted: "#667264",
        },
        mulberry: {
          DEFAULT: "#542034",
          hover: "#421727",
          light: "#78304D",
          tint: "#F8F3F5",
        },
        marigold: {
          DEFAULT: "#C29F58",
          hover: "#A88640",
          light: "#FDF8ED",
        },
        ecru: "#FAF7F2",
        linen: "#F4EFE6",
        "craft-card": "#FCFBF9",
        forest: {
          DEFAULT: "#1C281F",
          dark: "#141D16",
          light: "#2B3D2F",
        },
        brass: {
          DEFAULT: "#967F4F",
          light: "#BBA577",
          dark: "#756138",
        },
        stone: {
          DEFAULT: "#667264",
          light: "#859383",
          dark: "#4B5549",
        },
        craft: {
          border: "#E8E2D8",
          hover: "#DDD6CB",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Fraunces", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Manrope", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        atelier: "0 10px 32px -4px rgba(28, 40, 31, 0.05)",
        "atelier-lg": "0 20px 48px -8px rgba(28, 40, 31, 0.09)",
        drawer: "-20px 0 60px rgba(20, 29, 22, 0.16)",
      },
      letterSpacing: {
        luxury: "0.24em",
        editorial: "0.14em",
      },
    },
  },
  plugins: [],
};

export default config;
