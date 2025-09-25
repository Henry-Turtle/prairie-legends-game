import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enhanced Game Colors
        forest: {
          deep: "hsl(var(--forest-deep))",
          dark: "hsl(var(--forest-dark))",
          mid: "hsl(var(--forest-mid))",
          light: "hsl(var(--forest-light))",
        },
        sky: {
          dawn: "hsl(var(--sky-dawn))",
          dusk: "hsl(var(--sky-dusk))",
        },
        autumn: {
          orange: "hsl(var(--autumn-orange))",
          red: "hsl(var(--autumn-red))",
          gold: "hsl(var(--autumn-gold))",
          crimson: "hsl(var(--autumn-crimson))",
        },
        turkey: {
          brown: "hsl(var(--turkey-brown))",
        },
        leaf: {
          green: "hsl(var(--leaf-green))",
          yellow: "hsl(var(--leaf-yellow))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        "gradient-sky": "var(--gradient-sky)",
        "gradient-forest": "var(--gradient-forest)",
        "gradient-autumn": "var(--gradient-autumn)",
        "gradient-score": "var(--gradient-score)",
        "gradient-card": "var(--gradient-card)",
      },
      boxShadow: {
        "soft": "var(--shadow-soft)",
        "glow": "var(--shadow-glow)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "turkey-fly": {
          "0%": {
            transform: "translateX(-120px) translateY(0px) rotate(-5deg) scale(1)",
          },
          "20%": {
            transform: "translateX(20vw) translateY(-15px) rotate(2deg) scale(1.05)",
          },
          "40%": {
            transform: "translateX(40vw) translateY(-8px) rotate(-1deg) scale(1)",
          },
          "60%": {
            transform: "translateX(60vw) translateY(-20px) rotate(3deg) scale(1.05)",
          },
          "80%": {
            transform: "translateX(80vw) translateY(-5px) rotate(-2deg) scale(1)",
          },
          "100%": {
            transform: "translateX(calc(100vw + 120px)) translateY(10px) rotate(0deg) scale(1)",
          },
        },
        "turkey-idle": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
          },
          "50%": {
            transform: "translateY(-3px) rotate(1deg)",
          },
        },
        "crosshair-shoot": {
          "0%": {
            transform: "scale(1)",
          },
          "30%": {
            transform: "scale(0.85)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        "hit-effect": {
          "0%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.3) rotate(90deg)",
            opacity: "0.7",
          },
          "100%": {
            transform: "scale(0.8) rotate(180deg)",
            opacity: "0",
          },
        },
        "score-popup": {
          "0%": {
            transform: "translateY(0) scale(0.8)",
            opacity: "0",
          },
          "20%": {
            transform: "translateY(-10px) scale(1.2)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(-60px) scale(1)",
            opacity: "0",
          },
        },
        "leaf-fall": {
          "0%": {
            transform: "translateY(-10px) translateX(0px) rotate(0deg)",
            opacity: "0.8",
          },
          "25%": {
            transform: "translateY(25vh) translateX(20px) rotate(90deg)",
            opacity: "0.6",
          },
          "50%": {
            transform: "translateY(50vh) translateX(-15px) rotate(180deg)",
            opacity: "0.4",
          },
          "75%": {
            transform: "translateY(75vh) translateX(30px) rotate(270deg)",
            opacity: "0.3",
          },
          "100%": {
            transform: "translateY(100vh) translateX(0px) rotate(360deg)",
            opacity: "0",
          },
        },
        "cloud-drift": {
          "0%": {
            transform: "translateX(-20px)",
          },
          "100%": {
            transform: "translateX(calc(100vw + 20px))",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "turkey-fly": "turkey-fly 4s ease-in-out infinite",
        "turkey-idle": "turkey-idle 2s ease-in-out infinite",
        "crosshair-shoot": "crosshair-shoot 0.15s ease-out",
        "hit-effect": "hit-effect 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "score-popup": "score-popup 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "leaf-fall": "leaf-fall 8s linear infinite",
        "cloud-drift": "cloud-drift 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
