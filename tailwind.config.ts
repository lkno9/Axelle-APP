import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "#000000",
          soft: "#0a0a0a",
          card: "#0e0e0e",
          line: "#242424",
        },
        gold: {
          DEFAULT: "#ffffff",
          soft: "#f2f2f2",
          dim: "#8a8a8a",
        },
        ink: {
          DEFAULT: "#fafafa",
          dim: "#a1a1a1",
          faint: "#5c5c5c",
        },
        lav: "#d4d4d4",
        blue: "#8a8a8a",
      },
      fontFamily: {
        serif: ["Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
    },
  },
  plugins: [],
} satisfies Config;
