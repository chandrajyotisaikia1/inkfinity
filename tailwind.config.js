/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          black: '#000000',
          950: '#050505',
          900: '#0a0a0a',
          850: '#111111',
          800: '#161616',
          700: '#1c1c1c',
          600: '#242424',
          500: '#2e2e2e',
          400: '#3a3a3a',
          300: '#525252',
          200: '#7a7a7a',
          100: '#a8a8a8',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#fbf6e3',
          100: '#f5ecc0',
          200: '#ecdb8a',
          300: '#e0c755',
          400: '#D4AF37',
          500: '#c19c2a',
          600: '#a07e1f',
          700: '#7a6018',
          800: '#544311',
          900: '#3a2f0d',
        },
        success: {
          DEFAULT: '#22c55e',
          dark: '#16a34a',
          soft: '#052e16',
        },
        danger: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
          soft: '#2a0a0a',
        },
        warning: {
          DEFAULT: '#f59e0b',
          soft: '#2a1c05',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        ultra: '0.4em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(212,175,55,0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fade-in 0.6s ease forwards',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-gold': 'pulse-gold 2s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
