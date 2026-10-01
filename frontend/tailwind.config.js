/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slateBase: '#F8FAFC',
        surface: '#FFFFFF',
        brand: {
          indigo: '#4F46E5',
          violet: '#7C3AED',
          emerald: '#10B981',
          slateDark: '#0F172A',
          slateMuted: '#64748B',
          border: '#E2E8F0'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.03)' }
        }
      },
      boxShadow: {
        'corporate-card': '0 4px 20px -2px rgba(79, 70, 229, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'corporate-hover': '0 12px 30px -5px rgba(79, 70, 229, 0.15), 0 8px 10px -6px rgba(79, 70, 229, 0.08)',
        'indigo-btn': '0 4px 14px 0 rgba(79, 70, 229, 0.35)',
        'glow-badge': '0 0 20px rgba(79, 70, 229, 0.4)'
      }
    },
  },
  plugins: [],
}
