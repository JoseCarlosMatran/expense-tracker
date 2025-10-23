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
      },
      colors: {
        'finance-green': {
          primary: '#2d5a3d',
          secondary: '#4a7c59',
          light: '#6b9b7b',
          accent: '#8bc49c',
        },
        'finance-gold': {
          primary: '#d4af37',
          secondary: '#ffd700',
          light: '#ffe55c',
          accent: '#f4d03f',
        },
        'finance-success': '#27ae60',
        'finance-warning': '#f39c12',
        'finance-danger': '#e74c3c',
        'finance-info': '#3498db',
      },
      width: {
        'screen': '100vw',
        'full-force': '100% !important',
      },
      maxWidth: {
        'none-force': 'none !important',
        'full-force': '100% !important',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.6s ease-out',
        'slideInRight': 'slideInRight 0.4s ease-out',
        'slideInLeft': 'slideInLeft 0.4s ease-out',
        'scaleIn': 'scaleIn 0.3s ease-out',
        'progressGrow': 'progressGrow 1.2s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        progressGrow: {
          '0%': {
            strokeDashoffset: '628',
          },
          '100%': {
            strokeDashoffset: '0',
          },
        },
      },
    },
  },
  plugins: [],
};