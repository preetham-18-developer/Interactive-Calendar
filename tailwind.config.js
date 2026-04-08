/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        foreground: "var(--text-main)",
        card: "var(--card-bg)",
        "card-foreground": "var(--text-main)",
        popover: "var(--card-bg)",
        "popover-foreground": "var(--text-main)",
        primary: "var(--primary-accent)",
        "primary-foreground": "#FFFFFF",
        secondary: "var(--hover-bg)",
        "secondary-foreground": "var(--text-main)",
        muted: "var(--hover-bg)",
        "muted-foreground": "var(--secondary-text)",
        accent: "var(--selection-bg)",
        "accent-foreground": "var(--text-main)",
        destructive: "#FF3333",
        "destructive-foreground": "#FFFFFF",
        border: "var(--border-color)",
        input: "var(--input-bg)",
        ring: "var(--primary-accent)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
          default: "calc(var(--radius) - 2px)",
          md: "var(--radius)",
          lg: "var(--radius)",
          xl: "calc(var(--radius) + 4px)",
          "2xl": "calc(var(--radius) + 8px)",
          "3xl": "calc(var(--radius) + 12px)",
        },
      },
    },
  plugins: [require("tailwindcss-animate")],
}
