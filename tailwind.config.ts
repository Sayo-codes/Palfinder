import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        background: 'var(--bg)',
        foreground: 'var(--text)',
        'palfinder': {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          surface2: 'var(--surface2)',
          maroon: '#6B1F2A',
          pink: 'var(--pink)',
          purple: 'var(--purple)',
          cyan: 'var(--cyan)',
          teal: 'var(--teal)',
          green: 'var(--green)',
          yellow: 'var(--yellow)',
          'pink-text': 'var(--pink)',
          gold: 'var(--gold)',
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair-display)', 'serif'],
        sans: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
      }
    },
  },
  plugins: [],
};

export default config;
