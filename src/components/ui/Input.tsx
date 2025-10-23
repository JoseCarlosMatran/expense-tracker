'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'floating' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon: Icon,
  variant = 'floating',
  size = 'md',
  className,
  id,
  onFocus,
  onBlur,
  value,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    onBlur?.(e);
  };

  const sizeClasses = {
    sm: 'h-10 px-3 text-sm',
    md: 'h-12 px-4 text-base',
    lg: 'h-14 px-5 text-lg'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  if (variant === 'floating') {
    return (
      <div className="enhanced-input-container">
        <div className={`floating-input-wrapper ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}>
          {Icon && (
            <div className="input-icon">
              <Icon size={iconSizes[size]} />
            </div>
          )}
          
          <div className="input-field-container">
            <input
              ref={inputRef}
              id={inputId}
              className={cn(
                'floating-input',
                Icon && 'with-icon',
                sizeClasses[size],
                className
              )}
              value={value}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
            
            {label && (
              <label
                htmlFor={inputId}
                className={`floating-label ${(isFocused || hasValue) ? 'active' : ''}`}
              >
                {label}
              </label>
            )}
          </div>

          <div className="input-border-glow"></div>
        </div>
        
        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        <style jsx>{`
          .enhanced-input-container {
            position: relative;
            margin-bottom: 1.5rem;
          }

          .floating-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
          }

          .floating-input-wrapper::before {
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

          .floating-input-wrapper:hover::before {
            opacity: 1;
          }

          .floating-input-wrapper.focused {
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
            transform: translateY(-1px);
          }

          .floating-input-wrapper.error {
            border-color: var(--accent-danger);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
          }

          .input-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-left: 16px;
            color: var(--text-secondary);
            transition: all 0.3s ease;
          }

          .floating-input-wrapper.focused .input-icon {
            color: var(--accent-primary);
            transform: scale(1.1);
          }

          .floating-input-wrapper.error .input-icon {
            color: var(--accent-danger);
          }

          .input-field-container {
            position: relative;
            flex: 1;
          }

          .floating-input {
            width: 100%;
            background: transparent;
            border: none;
            outline: none;
            color: var(--text-primary);
            font-weight: 500;
            transition: all 0.3s ease;
            padding-top: 8px;
          }

          .floating-input.with-icon {
            padding-left: 8px;
          }

          .floating-input::placeholder {
            color: transparent;
          }

          .floating-label {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            opacity: 0.7;
          }

          .floating-input.with-icon + .floating-label {
            left: 8px;
          }

          .floating-label.active {
            top: 8px;
            transform: translateY(0);
            font-size: 0.75rem;
            font-weight: 600;
            opacity: 1;
            -webkit-text-fill-color: var(--accent-primary);
          }

          .floating-input-wrapper.focused .floating-label {
            -webkit-text-fill-color: var(--accent-primary);
            opacity: 1;
          }

          .floating-input-wrapper.error .floating-label {
            -webkit-text-fill-color: var(--accent-danger);
          }

          .input-border-glow {
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateX(-50%);
            border-radius: 1px;
          }

          .floating-input-wrapper.focused .input-border-glow {
            width: 100%;
          }

          .floating-input-wrapper.error .input-border-glow {
            background: var(--accent-danger);
            width: 100%;
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
            .enhanced-input-container {
              margin-bottom: 1.25rem;
            }

            .floating-input-wrapper {
              border-radius: 14px;
            }

            .input-icon {
              padding-left: 12px;
            }
          }
        `}</style>
      </div>
    );
  }

  // Default variant (for backward compatibility)
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        value={value}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;