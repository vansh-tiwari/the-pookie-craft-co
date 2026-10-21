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
          canvas: "#FCF8FA",
          surface: "#FFFFFF",
          card: "#FDFBFC",
          ink: "#200E19",
          "ink-light": "#4A303F",
          muted: "#7E6875",
          magenta: "#9B1B54",
          "magenta-hover": "#7D1342",
          "magenta-vibrant": "#C8256E",
          "magenta-light": "#FDF2F7",
          champagne: "#D8A657",
          "champagne-light": "#FDF8ED",
          botanical: "#3D6B52",
          "botanical-light": "#EAF4EE",
          border: "#F0E5EC",
          "border-subtle": "#F7F0F4",
          nocturne: "#180812",
          // Backwards compatibility mappings
          brass: "#9B1B54",
          "brass-light": "#C8256E",
          "brass-dark": "#7D1342",
          velvet: "#9B1B54",
          "velvet-light": "#C8256E",
        },
        magenta: {
          DEFAULT: "#9B1B54",
          hover: "#7D1342",
          vibrant: "#C8256E",
          light: "#FDF2F7",
          dark: "#680C34",
        },
        paper: "#FCF8FA",
        ink: {
          DEFAULT: "#200E19",
          light: "#4A303F",
          muted: "#7E6875",
        },
        champagne: {
          DEFAULT: "#D8A657",
          hover: "#BF8F42",
          light: "#FDF8ED",
        },
        botanical: {
          DEFAULT: "#3D6B52",
          light: "#EAF4EE",
          dark: "#2A4D3A",
        },
        nocturne: {
          DEFAULT: "#180812",
          light: "#2A1322",
        },
        // Legacy aliases
        mulberry: {
          DEFAULT: "#9B1B54",
          hover: "#7D1342",
          light: "#C8256E",
          tint: "#FDF2F7",
        },
        marigold: {
          DEFAULT: "#D8A657",
          hover: "#BF8F42",
          light: "#FDF8ED",
        },
        brass: {
          DEFAULT: "#9B1B54",
          light: "#C8256E",
          dark: "#7D1342",
        },
        forest: {
          DEFAULT: "#200E19",
          dark: "#180812",
          light: "#4A303F",
        },
        craft: {
          border: "#F0E5EC",
          hover: "#E5D2DF",
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
