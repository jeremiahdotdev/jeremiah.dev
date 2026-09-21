import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './views/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      maxWidth: {
        section: "126rem",
        project: "120rem",
      },
      transitionDuration: {
        600: "600ms",
      },
      fontFamily: {
        title: ["var(--font-title)", "Georgia", "serif"],
      },
      screens: {
        hxs: { raw: '(min-height: 568px)' },
        hsm: { raw: '(min-height: 667px)' },
        hmd: { raw: '(min-height: 736px)' },
        hlg: { raw: '(min-height: 812px)' },
        hxl: { raw: '(min-height: 896px)' },
        'h2xl': { raw: '(min-height: 1024px)' },
      },
      animation: {
        "preview-waves": "preview-waves 5s linear infinite",
        "preview-ripple": "preview-ripple 5s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "preview-waves": {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "120px 120px" },
        },
        "preview-ripple": {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.85" },
          "30%": { transform: "translateY(-1px)", opacity: "1" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      spacing: {
        "page-content": "calc(100vh - 82px)",
        "dashboard-content": "calc(100vh - 164px)",
        "dashboard-pane": "320px"
      },
      aspectRatio: {
        preview: "3 / 2",
      },
      boxShadow: {
        outer: '0 4px 10px rgba(0, 0, 0, 0.1)', 
      },
      colors: {
        'career-accent': 'hsl(var(--career-accent) / <alpha-value>)',
        'shimmer-light': '#f0f0f0',
        'shimmer-dark': '#e0e0e0',
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        "background-secondary": "hsl(var(--background-secondary) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        inlay: {
          DEFAULT: "hsl(var(--inlay) / <alpha-value>)",
          secondary: "hsl(var(--inlay-secondary) / <alpha-value>)",
        },
        circuit: {
          DEFAULT: "hsl(var(--circuit) / <alpha-value>)",
          secondary: "hsl(var(--circuit-secondary) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        dashboard: {
          DEFAULT: "hsl(var(--dashboard) / <alpha-value>)",
          header: "hsl(var(--dashboard-header) / <alpha-value>)",
          foreground: "hsl(var(--dashboard-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
