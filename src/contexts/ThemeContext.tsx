'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHydration } from '@/hooks/useHydration';

type Theme = 'light' | 'dark' | 'blue';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const isHydrated = useHydration();

  useEffect(() => {
    if (!isHydrated) return;
    
    // Load saved theme or detect system preference
    const savedTheme = localStorage.getItem('expense-tracker-theme') as Theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, [isHydrated]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('expense-tracker-theme', newTheme);
    }
  };

  const applyTheme = (theme: Theme) => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      // Remove all theme classes
      root.classList.remove('theme-light', 'theme-dark', 'theme-blue');
      
      // Add current theme class
      root.classList.add(`theme-${theme}`);
      
      // Apply theme-specific CSS variables
      switch (theme) {
        case 'dark':
          root.style.setProperty('--finance-bg-primary', '#121212');
          root.style.setProperty('--finance-bg-secondary', '#1e1e1e');
          root.style.setProperty('--finance-text-primary', '#ffffff');
          root.style.setProperty('--finance-text-secondary', '#b3b3b3');
          root.style.setProperty('--finance-green-primary', '#4ade80');
          root.style.setProperty('--finance-green-secondary', '#22c55e');
          root.style.setProperty('--finance-gold-primary', '#fbbf24');
          root.style.setProperty('--finance-border', '#333333');
          root.style.setProperty('--finance-card-bg', 'rgba(30, 30, 30, 0.95)');
          break;
        case 'blue':
          root.style.setProperty('--finance-bg-primary', '#f0f8ff');
          root.style.setProperty('--finance-bg-secondary', '#e6f3ff');
          root.style.setProperty('--finance-text-primary', '#1e3a8a');
          root.style.setProperty('--finance-text-secondary', '#3b82f6');
          root.style.setProperty('--finance-green-primary', '#1e88e5');
          root.style.setProperty('--finance-green-secondary', '#43a047');
          root.style.setProperty('--finance-gold-primary', '#ff9800');
          root.style.setProperty('--finance-border', '#bfdbfe');
          root.style.setProperty('--finance-card-bg', 'rgba(255, 255, 255, 0.95)');
          break;
        default: // light
          root.style.setProperty('--finance-bg-primary', '#f8f9fa');
          root.style.setProperty('--finance-bg-secondary', '#e8f5e8');
          root.style.setProperty('--finance-text-primary', '#2d5a3d');
          root.style.setProperty('--finance-text-secondary', '#4a7c59');
          root.style.setProperty('--finance-green-primary', '#2d5a3d');
          root.style.setProperty('--finance-green-secondary', '#4a7c59');
          root.style.setProperty('--finance-gold-primary', '#d4af37');
          root.style.setProperty('--finance-border', 'rgba(45, 90, 61, 0.1)');
          root.style.setProperty('--finance-card-bg', 'rgba(255, 255, 255, 0.95)');
          break;
      }
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      isDark: theme === 'dark'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};