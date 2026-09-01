import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          light: "var(--primary-light)",
        },
        evergreen: "var(--evergreen)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "slide-up": "slide-up 0.7s ease-out forwards",
        "slide-down": "slide-down 0.4s ease-out forwards",
        "fade-in": "fade-in 0.7s ease-out forwards",
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "scroll-infinite": "scroll-infinite 38s linear infinite",
        spin: "spin 1s linear infinite",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        "ken-burns": "ken-burns 8s ease-in-out alternate infinite",
      },
      keyframes: {
        "slide-up": { from: { opacity: "0", transform: "translateY(30px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-down": { from: { opacity: "0", transform: "translateY(-16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-in-up": { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { from: { opacity: "0", transform: "scale(0.94)" }, to: { opacity: "1", transform: "scale(1)" } },
        "scroll-infinite": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        spin: { to: { transform: "rotate(360deg)" } },
        "pulse-dot": { "0%,100%": { transform: "scale(1)", opacity: "0.6" }, "50%": { transform: "scale(1.3)", opacity: "1" } },
        "ken-burns": { "0%": { transform: "scale(1)" }, "100%": { transform: "scale(1.08)" } },
      },
    },
  },
  plugins: [],
}

export default config
