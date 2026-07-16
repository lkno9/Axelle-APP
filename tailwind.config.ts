import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "#0b1020",
          soft: "#111832",
          card: "#141c38",
          line: "#232d52",
        },
        gold: {
          DEFAULT: "#d4af37",
          soft: "#e3c877",
          dim: "#9c8330",
        },
        ink: {
          DEFAULT: "#e9e6dc",
          dim: "#a8a99e",
          faint: "#6b6f80",
        },
        lav: "#b8a7e8",
        blue: "#7ea6e8",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
