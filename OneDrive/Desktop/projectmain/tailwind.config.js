/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-error-container": "#ffdad6",
        "on-primary": "#00363e",
        "surface-dim": "#141313",
        "primary-container": "#22d3ee",
        "surface-variant": "#353434",
        "primary": "#8aebff",
        "primary-fixed-dim": "#2fd9f4",
        "on-surface": "#e5e2e1",
        "surface-container-lowest": "#0e0e0e",
        "surface-bright": "#3a3939",
        "tertiary-container": "#ffb13b",
        "on-primary-fixed-variant": "#004e5a",
        "secondary-container": "#6f00be",
        "tertiary-fixed": "#ffddb5",
        "tertiary": "#ffd6a3",
        "secondary-fixed": "#f0dbff",
        "secondary-fixed-dim": "#ddb7ff",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353434",
        "inverse-surface": "#e5e2e1",
        "inverse-primary": "#006877",
        "on-tertiary": "#462b00",
        "surface-container": "#201f1f",
        "on-surface-variant": "#bbc9cd",
        "error-container": "#93000a",
        "tertiary-fixed-dim": "#ffb957",
        "on-tertiary-fixed": "#2a1800",
        "on-secondary": "#490080",
        "surface-container-low": "#1c1b1b",
        "on-tertiary-container": "#6e4600",
        "on-primary-fixed": "#001f25",
        "inverse-on-surface": "#313030",
        "surface": "#141313",
        "on-tertiary-fixed-variant": "#643f00",
        "outline-variant": "#3c494c",
        "on-background": "#e5e2e1",
        "on-primary-container": "#005763",
        "on-secondary-fixed": "#2c0051",
        "on-error": "#690005",
        "secondary": "#ddb7ff",
        "error": "#ffb4ab",
        "primary-fixed": "#a2eeff",
        "surface-tint": "#2fd9f4",
        "outline": "#859397",
        "on-secondary-fixed-variant": "#6900b3",
        "on-secondary-container": "#d6a9ff",
        "background": "#141313",
        /* Extracted from previous requirements */
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        }
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Inter"],
        "body": ["Inter"],
        "label": ["Inter"],
        "sans": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
