'use client';

import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  label?: string;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'card' | 'modern';
  size?: 'sm' | 'md' | 'lg';
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  label,
  error,
  orientation = 'vertical',
  variant = 'modern',
  size = 'md'
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % options.length;
      setFocusedIndex(nextIndex);
      const nextOption = options[nextIndex];
      if (!nextOption.disabled) {
        handleChange(nextOption.value);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = index === 0 ? options.length - 1 : index - 1;
      setFocusedIndex(prevIndex);
      const prevOption = options[prevIndex];
      if (!prevOption.disabled) {
        handleChange(prevOption.value);
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const option = options[index];
      if (!option.disabled) {
        handleChange(option.value);
      }
    }
  };

  if (variant === 'modern') {
    return (
      <div className="enhanced-radio-group">
        {label && (
          <div className="radio-group-label">
            {label}
          </div>
        )}
        
        <div className={`radio-options ${orientation}`}>
          {options.map((option, index) => {
            const isSelected = value === option.value;
            const isFocused = focusedIndex === index;
            
            return (
              <label
                key={option.value}
                className={`modern-radio-option ${isSelected ? 'selected' : ''} ${option.disabled ? 'disabled' : ''} ${isFocused ? 'focused' : ''} ${size}`}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  disabled={option.disabled}
                  onChange={() => handleChange(option.value)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="radio-input"
                />
                
                <div className="radio-indicator">
                  <div className="radio-dot"></div>
                  <div className="radio-ripple"></div>
                </div>
                
                <div className="option-content">
                  {option.icon && (
                    <div className="option-icon">
                      <option.icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
                    </div>
                  )}
                  
                  <div className="option-text">
                    <div className="option-label">{option.label}</div>
                    {option.description && (
                      <div className="option-description">{option.description}</div>
                    )}
                  </div>
                </div>
                
                <div className="selection-glow"></div>
              </label>
            );
          })}
        </div>
        
        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        <style jsx>{`
          .enhanced-radio-group {
            margin-bottom: 1.5rem;
          }

          .radio-group-label {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 16px;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .radio-options {
            display: flex;
            gap: 12px;
          }

          .radio-options.vertical {
            flex-direction: column;
          }

          .radio-options.horizontal {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .modern-radio-option {
            position: relative;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
          }

          .modern-radio-option.sm {
            padding: 12px 16px;
            border-radius: 12px;
          }

          .modern-radio-option.lg {
            padding: 20px 24px;
            border-radius: 20px;
          }

          .modern-radio-option::before {
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

          .modern-radio-option:hover::before {
            opacity: 1;
          }

          .modern-radio-option:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }

          .modern-radio-option.focused {
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          }

          .modern-radio-option.selected {
            border-color: var(--accent-primary);
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.15);
          }

          .modern-radio-option.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
          }

          .modern-radio-option.disabled:hover::before {
            opacity: 0;
          }

          .radio-input {
            position: absolute;
            opacity: 0;
            pointer-events: none;
          }

          .radio-indicator {
            position: relative;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid var(--glass-border);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            flex-shrink: 0;
          }

          .modern-radio-option.sm .radio-indicator {
            width: 20px;
            height: 20px;
          }

          .modern-radio-option.lg .radio-indicator {
            width: 28px;
            height: 28px;
          }

          .modern-radio-option:hover .radio-indicator {
            border-color: var(--accent-primary);
            transform: scale(1.1);
          }

          .modern-radio-option.selected .radio-indicator {
            border-color: var(--accent-primary);
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
          }

          .radio-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: white;
            transform: scale(0);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .modern-radio-option.sm .radio-dot {
            width: 6px;
            height: 6px;
          }

          .modern-radio-option.lg .radio-dot {
            width: 10px;
            height: 10px;
          }

          .modern-radio-option.selected .radio-dot {
            transform: scale(1);
          }

          .radio-ripple {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--accent-primary);
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
            transition: all 0.3s ease;
          }

          .modern-radio-option:active .radio-ripple {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.2;
          }

          .option-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
          }

          .option-icon {
            color: var(--text-secondary);
            transition: all 0.3s ease;
          }

          .modern-radio-option.selected .option-icon {
            color: var(--accent-primary);
            transform: scale(1.1);
          }

          .option-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .option-label {
            font-weight: 600;
            color: var(--text-primary);
            transition: all 0.3s ease;
          }

          .modern-radio-option.selected .option-label {
            color: var(--accent-primary);
          }

          .option-description {
            font-size: 0.875rem;
            color: var(--text-secondary);
            line-height: 1.3;
          }

          .selection-glow {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
            border-radius: inherit;
          }

          .modern-radio-option.selected .selection-glow {
            opacity: 0.1;
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
            .radio-options.horizontal {
              flex-direction: column;
            }

            .modern-radio-option {
              padding: 14px 18px;
            }
          }
        `}</style>
      </div>
    );
  }

  // Default variant fallback
  return (
    <div className="space-y-3">
      {label && (
        <div className="text-sm font-medium text-gray-700">{label}</div>
      )}
      
      <div className={`space-${orientation === 'horizontal' ? 'x' : 'y'}-2 ${orientation === 'horizontal' ? 'flex flex-wrap' : ''}`}>
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              disabled={option.disabled}
              onChange={() => handleChange(option.value)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className={`text-sm ${option.disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default RadioGroup;