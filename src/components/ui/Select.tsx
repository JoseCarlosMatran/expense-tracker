'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, LucideIcon } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: LucideIcon;
  description?: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  icon?: LucideIcon;
  variant?: 'default' | 'floating' | 'modern';
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  icon: Icon,
  variant = 'floating',
  size = 'md',
  className,
  id,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchable = false,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const filteredOptions = searchable && searchQuery
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setIsFocused(!isOpen);
    if (!isOpen && searchable) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setIsFocused(false);
    setSearchQuery('');
    setHasValue(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setIsFocused(false);
    }
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
      <div className="enhanced-select-container" ref={dropdownRef}>
        <div className={`floating-select-wrapper ${isFocused || isOpen ? 'focused' : ''} ${error ? 'error' : ''}`}>
          {Icon && (
            <div className="select-icon">
              <Icon size={iconSizes[size]} />
            </div>
          )}
          
          <div className="select-field-container">
            <div
              className={cn(
                'floating-select-trigger',
                Icon && 'with-icon',
                sizeClasses[size],
                className
              )}
              onClick={handleToggle}
              onKeyDown={handleKeyDown}
              tabIndex={0}
            >
              <span className={`select-value ${!selectedOption ? 'placeholder' : ''}`}>
                {selectedOption ? (
                  <div className="selected-option">
                    {selectedOption.icon && <selectedOption.icon size={16} />}
                    <span>{selectedOption.label}</span>
                  </div>
                ) : (
                  placeholder
                )}
              </span>
              
              <div className={`select-arrow ${isOpen ? 'open' : ''}`}>
                <ChevronDown size={20} />
              </div>
            </div>
            
            {label && (
              <label
                htmlFor={selectId}
                className={`floating-label ${(isFocused || hasValue || isOpen) ? 'active' : ''}`}
              >
                {label}
              </label>
            )}
          </div>

          <div className="select-border-glow"></div>
        </div>

        {isOpen && (
          <div className="select-dropdown">
            {searchable && (
              <div className="search-container">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            )}
            
            <div className="options-container">
              {filteredOptions.length === 0 ? (
                <div className="no-options">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`select-option ${
                      option.value === value ? 'selected' : ''
                    } ${option.disabled ? 'disabled' : ''}`}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                  >
                    <div className="option-content">
                      {option.icon && <option.icon size={16} />}
                      <div className="option-text">
                        <div className="option-label">{option.label}</div>
                        {option.description && (
                          <div className="option-description">{option.description}</div>
                        )}
                      </div>
                    </div>
                    
                    {option.value === value && (
                      <div className="option-check">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        <style jsx>{`
          .enhanced-select-container {
            position: relative;
            margin-bottom: 1.5rem;
          }

          .floating-select-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            cursor: pointer;
          }

          .floating-select-wrapper::before {
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

          .floating-select-wrapper:hover::before {
            opacity: 1;
          }

          .floating-select-wrapper.focused {
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
            transform: translateY(-1px);
          }

          .floating-select-wrapper.error {
            border-color: var(--accent-danger);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
          }

          .select-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-left: 16px;
            color: var(--text-secondary);
            transition: all 0.3s ease;
          }

          .floating-select-wrapper.focused .select-icon {
            color: var(--accent-primary);
            transform: scale(1.1);
          }

          .floating-select-wrapper.error .select-icon {
            color: var(--accent-danger);
          }

          .select-field-container {
            position: relative;
            flex: 1;
          }

          .floating-select-trigger {
            width: 100%;
            background: transparent;
            border: none;
            outline: none;
            color: var(--text-primary);
            font-weight: 500;
            transition: all 0.3s ease;
            padding-top: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
          }

          .floating-select-trigger.with-icon {
            padding-left: 8px;
          }

          .select-value {
            flex: 1;
            text-align: left;
            transition: all 0.3s ease;
          }

          .select-value.placeholder {
            color: var(--text-secondary);
            opacity: 0.7;
          }

          .selected-option {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .select-arrow {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: var(--text-secondary);
            display: flex;
            align-items: center;
          }

          .select-arrow.open {
            transform: rotate(180deg);
            color: var(--accent-primary);
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

          .floating-select-trigger.with-icon + .floating-label {
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

          .floating-select-wrapper.focused .floating-label {
            -webkit-text-fill-color: var(--accent-primary);
            opacity: 1;
          }

          .floating-select-wrapper.error .floating-label {
            -webkit-text-fill-color: var(--accent-danger);
          }

          .select-border-glow {
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

          .floating-select-wrapper.focused .select-border-glow {
            width: 100%;
          }

          .floating-select-wrapper.error .select-border-glow {
            background: var(--accent-danger);
            width: 100%;
          }

          .select-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 1000;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            margin-top: 4px;
            overflow: hidden;
            animation: dropdownOpen 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .search-container {
            padding: 12px 16px;
            border-bottom: 1px solid var(--glass-border);
          }

          .search-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 8px 12px;
            color: var(--text-primary);
            font-size: 0.875rem;
            outline: none;
            transition: all 0.3s ease;
          }

          .search-input:focus {
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
          }

          .options-container {
            max-height: 240px;
            overflow-y: auto;
          }

          .select-option {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }

          .select-option:last-child {
            border-bottom: none;
          }

          .select-option:hover:not(.disabled) {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(4px);
          }

          .select-option.selected {
            background: rgba(16, 185, 129, 0.1);
            color: var(--accent-primary);
          }

          .select-option.disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .option-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
          }

          .option-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .option-label {
            color: var(--text-primary);
            font-weight: 500;
          }

          .option-description {
            color: var(--text-secondary);
            font-size: 0.75rem;
          }

          .option-check {
            color: var(--accent-primary);
            display: flex;
            align-items: center;
          }

          .no-options {
            padding: 20px;
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.875rem;
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

          @keyframes dropdownOpen {
            0% {
              opacity: 0;
              transform: translateY(-8px) scale(0.98);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .enhanced-select-container {
              margin-bottom: 1.25rem;
            }

            .floating-select-wrapper {
              border-radius: 14px;
            }

            .select-icon {
              padding-left: 12px;
            }

            .select-dropdown {
              border-radius: 14px;
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
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;