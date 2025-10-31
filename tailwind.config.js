/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ggup: {
          background: '#020617',
          surface: '#0f172a',
          card: '#111c34',
          border: 'rgba(148, 163, 184, 0.2)',
          primary: '#6366f1',
          primaryDark: '#4338ca',
          secondary: '#38bdf8',
          accent: '#f97316',
          success: '#22c55e',
          warning: '#facc15',
          danger: '#ef4444',
          text: '#f8fafc',
          muted: '#cbd5f5',
        },
      },
      boxShadow: {
        glass: '0 25px 65px -15px rgba(15, 23, 42, 0.55)',
        glow: '0 0 45px rgba(99, 102, 241, 0.55)',
      },
      animation: {
        aurora: 'aurora 14s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
      },
    },
  },
  plugins: [],
};