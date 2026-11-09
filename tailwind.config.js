/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#06040d',
          900: '#090614',
          850: '#0e0a1f',
          800: '#130d24',
          700: '#1c1435',
          600: '#271d47',
        },
        gold: {
          50: '#fdfbf2',
          100: '#fbf5e1',
          200: '#f7e7bc',
          300: '#f3d690',
          400: '#f5cf75', // champagne gold
          500: '#d4af37', // metallic gold
          600: '#b89228',
          700: '#8f6f1c',
          800: '#75581b',
          900: '#62481b',
        },
        roseGold: {
          300: '#f2b5a0',
          400: '#e5989b',
          500: '#e29578',
          600: '#c5775c',
        },
        ivory: {
          DEFAULT: '#faf8f5',
          muted: '#d8c7a5',
          lavender: '#b8accf',
        },
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(245, 207, 117, 0.35)',
        'glow-gold-lg': '0 0 50px rgba(245, 207, 117, 0.5)',
        'glow-rose': '0 0 30px rgba(226, 149, 120, 0.35)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.55)',
        'glass-modal': '0 25px 60px rgba(0, 0, 0, 0.9)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(245, 207, 117, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(245, 207, 117, 0.8))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
