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
        paper: "#F6F0E6",
        ink: {
          DEFAULT: "#252923",
          light: "#4A5247",
          muted: "#667062",
        },
        mulberry: {
          DEFAULT: "#682B43",
          hover: "#532135",
          light: "#823755",
          tint: "#F4ECF0",
        },
        marigold: {
          DEFAULT: "#E6B94A",
          hover: "#D4A536",
          light: "#FDF4DE",
        },
        lilac: {
          DEFAULT: "#C8BED8",
          light: "#EAE5F2",
        },
        ecru: "#FEF7ED",
        linen: "#F6EFE3",
        "craft-card": "#FFFDF9",
        forest: {
          DEFAULT: "#283C2A",
          dark: "#1A281B",
          light: "#354E38",
        },
        brass: {
          DEFAULT: "#967F4F",
          light: "#B89F6B",
          dark: "#7A663D",
        },
        stone: {
          DEFAULT: "#687060",
          light: "#828B7A",
          dark: "#4E5548",
        },
        craft: {
          border: "#E4DDD2",
          hover: "#D6CDC0",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Fraunces", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Manrope", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        organic: "0 10px 30px -5px rgba(40, 60, 42, 0.08)",
        drawer: "-12px 0 40px rgba(31, 48, 34, 0.14)",
      },
      letterSpacing: {
        luxury: "0.22em",
        editorial: "0.14em",
      },
    },
  },
  plugins: [],
};

export default config;
