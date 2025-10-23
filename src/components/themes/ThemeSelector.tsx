'use client';

import React, { useState } from 'react';
import { Sun, Moon, Palette, Zap, Trees } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useI18n } from '@/contexts/I18nContext';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      id: 'light' as const,
      name: 'Light Mode',
      icon: Sun,
      description: 'Clean and bright interface',
      colors: ['#ffffff', '#f8fafc', '#3b82f6']
    },
    {
      id: 'dark' as const,
      name: 'Dark Mode',
      icon: Moon,
      description: 'Easy on the eyes',
      colors: ['#0f172a', '#1e293b', '#3b82f6']
    },
    {
      id: 'gradient' as const,
      name: 'Gradient',
      icon: Palette,
      description: 'Colorful and modern',
      colors: ['#667eea', '#764ba2', '#f093fb']
    },
    {
      id: 'neon' as const,
      name: 'Neon',
      icon: Zap,
      description: 'Cyberpunk vibes',
      colors: ['#000814', '#001d3d', '#00f5ff']
    },
    {
      id: 'forest' as const,
      name: 'Forest',
      icon: Trees,
      description: 'Natural and calming',
      colors: ['#064e3b', '#047857', '#10b981']
    }
  ];

  return (
    <div className="theme-selector">
      <button
        className="theme-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
      >
        {(() => {
          const currentTheme = themes.find(t => t.id === theme);
          const IconComponent = currentTheme?.icon || Palette;
          return <IconComponent size={20} />;
        })()}
      </button>

      {isOpen && (
        <>
          <div className="theme-overlay" onClick={() => setIsOpen(false)} />
          <div className="theme-dropdown">
            <div className="theme-header">
              <h3>Choose Theme</h3>
              <p>Personalize your experience</p>
            </div>
            
            <div className="theme-grid">
              {themes.map((themeOption) => {
                const IconComponent = themeOption.icon;
                const isSelected = theme === themeOption.id;
                
                return (
                  <button
                    key={themeOption.id}
                    className={`theme-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setTheme(themeOption.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="theme-preview">
                      <div className="preview-colors">
                        {themeOption.colors.map((color, index) => (
                          <div
                            key={index}
                            className="color-dot"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="theme-icon">
                        <IconComponent size={24} />
                      </div>
                    </div>
                    
                    <div className="theme-info">
                      <div className="theme-name">{themeOption.name}</div>
                      <div className="theme-description">{themeOption.description}</div>
                    </div>
                    
                    {isSelected && (
                      <div className="selected-indicator">
                        <div className="checkmark">✓</div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .theme-selector {
          position: relative;
          z-index: 1000;
        }

        .theme-toggle {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 12px;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow);
        }

        .theme-toggle:hover {
          transform: translateY(-2px);
          box-shadow: var(--glow), var(--shadow);
        }

        .theme-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1001;
        }

        .theme-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          min-width: 350px;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 24px;
          box-shadow: var(--shadow);
          z-index: 1002;
          animation: slideDown 0.3s ease-out;
        }

        .theme-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .theme-header h3 {
          margin: 0 0 8px 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .theme-header p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .theme-grid {
          display: grid;
          gap: 12px;
        }

        .theme-option {
          background: none;
          border: 2px solid transparent;
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          overflow: hidden;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
        }

        .theme-option:hover {
          border-color: var(--accent-primary);
          transform: translateY(-2px);
          background: var(--glass-bg);
        }

        .theme-option.selected {
          border-color: var(--accent-primary);
          background: var(--glass-bg);
          box-shadow: 0 0 20px var(--accent-primary)40;
        }

        .theme-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          min-width: 60px;
        }

        .preview-colors {
          display: flex;
          gap: 4px;
        }

        .color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .theme-icon {
          color: var(--text-primary);
          opacity: 0.8;
        }

        .theme-info {
          flex: 1;
          text-align: left;
        }

        .theme-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .theme-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          opacity: 0.8;
        }

        .selected-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
        }

        .checkmark {
          background: var(--accent-primary);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Theme-specific styling */
        .theme-neon .theme-toggle {
          box-shadow: 
            0 0 20px var(--accent-primary),
            var(--shadow);
        }

        .theme-neon .theme-option.selected {
          box-shadow: 
            0 0 20px var(--accent-primary),
            inset 0 0 20px var(--accent-primary)20;
        }

        .theme-gradient .theme-toggle {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .theme-forest .theme-option.selected {
          border-color: var(--accent-secondary);
          box-shadow: 0 0 15px var(--accent-secondary)50;
        }

        @media (max-width: 768px) {
          .theme-dropdown {
            right: -12px;
            left: -12px;
            min-width: unset;
            width: calc(100vw - 24px);
            max-width: 400px;
          }

          .theme-option {
            padding: 12px;
            gap: 12px;
          }

          .theme-name {
            font-size: 0.875rem;
          }

          .theme-description {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ThemeSelector;