
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#070b14",
        primary: "#00ffe7",
        'primary-dark': "#00c9b8",
        secondary: "#0088ff",
        surface: "#0f172a",
        surfaceLight: "#1e293b",
        surfaceMid: "#162032",
        accent: "#7c3aed",
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(0, 255, 231, 0.15)',
        'glow': '0 0 20px rgba(0, 255, 231, 0.2)',
        'glow-lg': '0 0 40px rgba(0, 255, 231, 0.25)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 6s linear infinite',
        'bounce-subtle': 'bounce 2s infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-tech': 'linear-gradient(135deg, #00ffe7 0%, #0088ff 100%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
