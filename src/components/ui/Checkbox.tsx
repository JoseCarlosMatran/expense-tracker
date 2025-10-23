'use client';

import React, { useState } from 'react';
import { Check, Minus, LucideIcon } from 'lucide-react';

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  variant?: 'default' | 'modern' | 'card';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked = false,
  indeterminate = false,
  onChange,
  label,
  description,
  error,
  disabled = false,
  icon: Icon,
  variant = 'modern',
  size = 'md',
  color = 'primary'
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsPressed(true);
      if (!disabled && onChange) {
        onChange(!checked);
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsPressed(false);
    }
  };

  const colorClasses = {
    primary: {
      bg: 'var(--accent-primary)',
      shadow: 'rgba(16, 185, 129, 0.3)',
      glow: 'rgba(16, 185, 129, 0.2)'
    },
    success: {
      bg: 'var(--accent-success)',
      shadow: 'rgba(34, 197, 94, 0.3)',
      glow: 'rgba(34, 197, 94, 0.2)'
    },
    warning: {
      bg: 'var(--accent-warning)',
      shadow: 'rgba(251, 191, 36, 0.3)',
      glow: 'rgba(251, 191, 36, 0.2)'
    },
    danger: {
      bg: 'var(--accent-danger)',
      shadow: 'rgba(239, 68, 68, 0.3)',
      glow: 'rgba(239, 68, 68, 0.2)'
    }
  };

  const sizeClasses = {
    sm: {
      checkbox: 20,
      icon: 14,
      padding: '12px 16px',
      text: '0.875rem',
      desc: '0.75rem'
    },
    md: {
      checkbox: 24,
      icon: 16,
      padding: '16px 20px',
      text: '1rem',
      desc: '0.875rem'
    },
    lg: {
      checkbox: 28,
      icon: 20,
      padding: '20px 24px',
      text: '1.125rem',
      desc: '1rem'
    }
  };

  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const currentColor = colorClasses[color];
  const currentSize = sizeClasses[size];

  if (variant === 'modern') {
    return (
      <div className="enhanced-checkbox">
        <label 
          htmlFor={checkboxId}
          className={`modern-checkbox-wrapper ${checked || indeterminate ? 'checked' : ''} ${disabled ? 'disabled' : ''} ${isFocused ? 'focused' : ''} ${isPressed ? 'pressed' : ''}`}
        >
          <input
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            disabled={disabled}
            className="checkbox-input"
          />
          
          <div className="checkbox-indicator">
            <div className="checkbox-box">
              <div className="checkbox-check">
                {indeterminate ? (
                  <Minus size={currentSize.icon} />
                ) : (
                  <Check size={currentSize.icon} />
                )}
              </div>
              <div className="checkbox-ripple"></div>
            </div>
            
            <div className="checkbox-glow"></div>
          </div>
          
          {(label || description || Icon) && (
            <div className="checkbox-content">
              {Icon && (
                <div className="checkbox-icon">
                  <Icon size={currentSize.icon} />
                </div>
              )}
              
              <div className="checkbox-text">
                {label && (
                  <div className="checkbox-label">{label}</div>
                )}
                {description && (
                  <div className="checkbox-description">{description}</div>
                )}
              </div>
            </div>
          )}
          
          <div className="selection-overlay"></div>
        </label>
        
        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        <style jsx>{`
          .enhanced-checkbox {
            margin-bottom: 1rem;
          }

          .modern-checkbox-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            gap: 16px;
            padding: ${currentSize.padding};
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            user-select: none;
          }

          .modern-checkbox-wrapper::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }

          .modern-checkbox-wrapper:hover::before {
            opacity: 1;
          }

          .modern-checkbox-wrapper:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }

          .modern-checkbox-wrapper.focused {
            border-color: ${currentColor.bg};
            box-shadow: 0 0 0 3px ${currentColor.glow};
          }

          .modern-checkbox-wrapper.pressed {
            transform: translateY(0) scale(0.98);
          }

          .modern-checkbox-wrapper.checked {
            border-color: ${currentColor.bg};
            background: linear-gradient(135deg, ${currentColor.glow}, rgba(255,255,255,0.05));
          }

          .modern-checkbox-wrapper.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
          }

          .modern-checkbox-wrapper.disabled:hover::before {
            opacity: 0;
          }

          .checkbox-input {
            position: absolute;
            opacity: 0;
            pointer-events: none;
          }

          .checkbox-indicator {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .checkbox-box {
            position: relative;
            width: ${currentSize.checkbox}px;
            height: ${currentSize.checkbox}px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid var(--glass-border);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
          }

          .modern-checkbox-wrapper:hover .checkbox-box {
            border-color: ${currentColor.bg};
            transform: scale(1.05);
          }

          .modern-checkbox-wrapper.checked .checkbox-box {
            background: linear-gradient(135deg, ${currentColor.bg}, var(--accent-secondary));
            border-color: ${currentColor.bg};
            box-shadow: 0 0 20px ${currentColor.shadow};
          }

          .checkbox-check {
            color: white;
            transform: scale(0);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .modern-checkbox-wrapper.checked .checkbox-check {
            transform: scale(1);
          }

          .checkbox-ripple {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: ${currentColor.bg};
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
            transition: all 0.3s ease;
          }

          .modern-checkbox-wrapper:active .checkbox-ripple {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.2;
          }

          .checkbox-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${currentSize.checkbox + 16}px;
            height: ${currentSize.checkbox + 16}px;
            border-radius: 8px;
            background: ${currentColor.bg};
            transform: translate(-50%, -50%);
            opacity: 0;
            filter: blur(8px);
            transition: opacity 0.3s ease;
            pointer-events: none;
          }

          .modern-checkbox-wrapper.checked .checkbox-glow {
            opacity: 0.3;
          }

          .checkbox-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
          }

          .checkbox-icon {
            color: var(--text-secondary);
            transition: all 0.3s ease;
          }

          .modern-checkbox-wrapper.checked .checkbox-icon {
            color: ${currentColor.bg};
            transform: scale(1.1);
          }

          .checkbox-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .checkbox-label {
            font-size: ${currentSize.text};
            font-weight: 600;
            color: var(--text-primary);
            transition: all 0.3s ease;
          }

          .modern-checkbox-wrapper.checked .checkbox-label {
            color: ${currentColor.bg};
          }

          .checkbox-description {
            font-size: ${currentSize.desc};
            color: var(--text-secondary);
            line-height: 1.3;
          }

          .selection-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, ${currentColor.bg}, var(--accent-secondary));
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
            border-radius: inherit;
          }

          .modern-checkbox-wrapper.checked .selection-overlay {
            opacity: 0.05;
          }

          .error-message {
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--accent-danger);
            font-size: 0.875rem;
            font-weight: 500;
            animation: shake 0.5s ease-in-out;
          }

          .error-message span {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .error-message::before {
            content: '⚠';
            font-size: 0.75rem;
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .modern-checkbox-wrapper {
              padding: 14px 18px;
            }
          }
        `}</style>
      </div>
    );
  }

  // Default variant fallback
  return (
    <div className="flex items-center">
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      {label && (
        <label htmlFor={checkboxId} className="ml-2 block text-sm text-gray-700 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;