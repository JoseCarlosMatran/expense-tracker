'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'gradient' | 'neon' | 'forest';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const getThemeStyles = (theme: Theme) => {
  switch (theme) {
    case 'dark':
      return {
        '--bg-primary': '#0f172a',
        '--bg-secondary': '#1e293b',
        '--bg-tertiary': '#334155',
        '--text-primary': '#f8fafc',
        '--text-secondary': '#cbd5e1',
        '--text-muted': '#64748b',
        '--accent-primary': '#3b82f6',
        '--accent-secondary': '#8b5cf6',
        '--success': '#10b981',
        '--warning': '#f59e0b',
        '--danger': '#ef4444',
        '--gradient-bg': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        '--card-bg': 'rgba(30, 41, 59, 0.8)',
        '--card-border': 'rgba(148, 163, 184, 0.1)',
        '--glass-bg': 'rgba(15, 23, 42, 0.7)',
        '--glass-border': 'rgba(148, 163, 184, 0.2)',
        '--shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        '--glow': '0 0 20px rgba(59, 130, 246, 0.3)'
      };
    case 'gradient':
      return {
        '--bg-primary': '#667eea',
        '--bg-secondary': '#764ba2',
        '--bg-tertiary': '#f093fb',
        '--text-primary': '#ffffff',
        '--text-secondary': '#f8f9ff',
        '--text-muted': '#e2e8f0',
        '--accent-primary': '#f093fb',
        '--accent-secondary': '#f5576c',
        '--success': '#4ade80',
        '--warning': '#fbbf24',
        '--danger': '#f87171',
        '--gradient-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '--card-bg': 'rgba(255, 255, 255, 0.1)',
        '--card-border': 'rgba(255, 255, 255, 0.2)',
        '--glass-bg': 'rgba(255, 255, 255, 0.15)',
        '--glass-border': 'rgba(255, 255, 255, 0.3)',
        '--shadow': '0 25px 50px -12px rgba(102, 126, 234, 0.4)',
        '--glow': '0 0 30px rgba(240, 147, 251, 0.5)'
      };
    case 'neon':
      return {
        '--bg-primary': '#000814',
        '--bg-secondary': '#001d3d',
        '--bg-tertiary': '#003566',
        '--text-primary': '#00f5ff',
        '--text-secondary': '#7209b7',
        '--text-muted': '#560bad',
        '--accent-primary': '#00f5ff',
        '--accent-secondary': '#7209b7',
        '--success': '#39ff14',
        '--warning': '#ffff00',
        '--danger': '#ff073a',
        '--gradient-bg': 'linear-gradient(135deg, #000814 0%, #001d3d 100%)',
        '--card-bg': 'rgba(0, 245, 255, 0.05)',
        '--card-border': 'rgba(0, 245, 255, 0.3)',
        '--glass-bg': 'rgba(0, 29, 61, 0.6)',
        '--glass-border': 'rgba(0, 245, 255, 0.4)',
        '--shadow': '0 0 50px rgba(0, 245, 255, 0.3)',
        '--glow': '0 0 40px rgba(114, 9, 183, 0.6)'
      };
    case 'forest':
      return {
        '--bg-primary': '#064e3b',
        '--bg-secondary': '#047857',
        '--bg-tertiary': '#059669',
        '--text-primary': '#ecfdf5',
        '--text-secondary': '#d1fae5',
        '--text-muted': '#a7f3d0',
        '--accent-primary': '#10b981',
        '--accent-secondary': '#34d399',
        '--success': '#22c55e',
        '--warning': '#f59e0b',
        '--danger': '#ef4444',
        '--gradient-bg': 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
        '--card-bg': 'rgba(4, 120, 87, 0.3)',
        '--card-border': 'rgba(16, 185, 129, 0.2)',
        '--glass-bg': 'rgba(6, 78, 59, 0.7)',
        '--glass-border': 'rgba(52, 211, 153, 0.3)',
        '--shadow': '0 25px 50px -12px rgba(6, 78, 59, 0.5)',
        '--glow': '0 0 25px rgba(16, 185, 129, 0.4)'
      };
    default: // light
      return {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f8fafc',
        '--bg-tertiary': '#f1f5f9',
        '--text-primary': '#1e293b',
        '--text-secondary': '#475569',
        '--text-muted': '#64748b',
        '--accent-primary': '#3b82f6',
        '--accent-secondary': '#8b5cf6',
        '--success': '#10b981',
        '--warning': '#f59e0b',
        '--danger': '#ef4444',
        '--gradient-bg': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        '--card-bg': 'rgba(255, 255, 255, 0.9)',
        '--card-border': 'rgba(148, 163, 184, 0.2)',
        '--glass-bg': 'rgba(248, 250, 252, 0.8)',
        '--glass-border': 'rgba(148, 163, 184, 0.3)',
        '--shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        '--glow': '0 0 20px rgba(59, 130, 246, 0.2)'
      };
  }
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    // Load saved theme or detect system preference
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
    setThemeState(initialTheme);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
    
    // Apply theme styles to document
    const styles = getThemeStyles(newTheme);
    Object.entries(styles).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  };

  // Apply initial theme styles
  useEffect(() => {
    const styles = getThemeStyles(theme);
    Object.entries(styles).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  }, [theme]);

  const isDark = theme === 'dark' || theme === 'neon';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      <div className="theme-provider">
        {children}
        
        <style jsx global>{`
          :root {
            --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --transition-spring: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            --border-radius: 12px;
            --border-radius-lg: 20px;
            --spacing-xs: 4px;
            --spacing-sm: 8px;
            --spacing-md: 16px;
            --spacing-lg: 24px;
            --spacing-xl: 32px;
          }

          * {
            transition: var(--transition-smooth);
          }

          body {
            background: var(--gradient-bg);
            color: var(--text-primary);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }

          .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow);
          }

          .neon-glow {
            box-shadow: var(--glow);
          }

          .theme-dark {
            --scrollbar-track: var(--bg-secondary);
            --scrollbar-thumb: var(--bg-tertiary);
          }

          .theme-light {
            --scrollbar-track: var(--bg-secondary);
            --scrollbar-thumb: var(--text-muted);
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          ::-webkit-scrollbar-track {
            background: var(--scrollbar-track, #f1f1f1);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb, #888);
            border-radius: 4px;
            transition: var(--transition-smooth);
          }

          ::-webkit-scrollbar-thumb:hover {
            background: var(--accent-primary);
          }

          /* Animations */
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 20px var(--accent-primary);
            }
            50% {
              box-shadow: 0 0 30px var(--accent-primary);
            }
          }

          /* Utility classes */
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out both;
          }

          .animate-slide-in-left {
            animation: slideInLeft 0.6s ease-out both;
          }

          .animate-slide-in-right {
            animation: slideInRight 0.6s ease-out both;
          }

          .animate-scale-in {
            animation: scaleIn 0.6s ease-out both;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-glow {
            animation: glow 2s ease-in-out infinite alternate;
          }

          /* Delays for staggered animations */
          .delay-100 { animation-delay: 100ms; }
          .delay-200 { animation-delay: 200ms; }
          .delay-300 { animation-delay: 300ms; }
          .delay-400 { animation-delay: 400ms; }
          .delay-500 { animation-delay: 500ms; }

          /* Theme-specific enhancements */
          .theme-neon * {
            text-shadow: 0 0 10px currentColor;
          }

          .theme-neon .glass-card {
            border-color: var(--accent-primary);
            box-shadow: 
              0 0 20px var(--accent-primary),
              inset 0 0 20px rgba(0, 245, 255, 0.1);
          }

          .theme-forest .glass-card {
            background: var(--glass-bg);
            border-color: var(--accent-secondary);
          }

          .theme-gradient .glass-card {
            background: var(--glass-bg);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          /* Mobile optimizations */
          @media (max-width: 768px) {
            .glass-card {
              border-radius: var(--border-radius);
              backdrop-filter: blur(15px);
            }
          }
        `}</style>
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;