import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "oklch(24.353% 0 0)",
        foreground: "oklch(98.7% 0.015 286.325)",
        card: {
          DEFAULT: "oklch(27.807% 0.027 261.325)",
          foreground: "oklch(98.7% 0.015 286.325)",
        },
        popover: {
          DEFAULT: "oklch(27.807% 0.027 261.325)",
          foreground: "oklch(98.7% 0.015 286.325)",
        },
        primary: {
          DEFAULT: "oklch(41.703% 0.099 251.473)",
          foreground: "oklch(98.7% 0.015 286.325)",
        },
        secondary: {
          DEFAULT: "oklch(35.598% 0.052 261.325)",
          foreground: "oklch(98.7% 0.015 286.325)",
        },
        muted: {
          DEFAULT: "oklch(33.632% 0.041 261.325)",
          foreground: "oklch(71.319% 0.015 286.325)",
        },
        accent: {
          DEFAULT: "oklch(35.598% 0.052 261.325)",
          foreground: "oklch(98.7% 0.015 286.325)",
        },
        destructive: {
          DEFAULT: "oklch(56.331% 0.159 27.325)",
          foreground: "oklch(98.7% 0.015 286.325)",
        },
        border: "oklch(38.778% 0.032 261.325)",
        input: "oklch(38.778% 0.032 261.325)",
        ring: "oklch(41.703% 0.099 251.473)",
        success: "oklch(67.213% 0.139 150.069)",
        warning: "oklch(78.416% 0.137 91.624)",
        info: "oklch(67.213% 0.139 225.664)",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.125rem",
        lg: "0.375rem",
        md: "0.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
