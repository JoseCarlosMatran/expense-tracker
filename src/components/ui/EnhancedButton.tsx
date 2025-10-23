'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface EnhancedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  glowEffect?: boolean;
  pulseAnimation?: boolean;
  className?: string;
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  href,
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  glowEffect = false,
  pulseAnimation = false,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled || loading) return;

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x: x - 20,
      y: y - 20
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    onClick && onClick();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          color: 'white',
          hover: 'linear-gradient(135deg, #2563eb, #1e40af)',
          shadow: '0 10px 25px rgba(59, 130, 246, 0.4)'
        };
      case 'secondary':
        return {
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          hover: 'rgba(255, 255, 255, 0.2)',
          shadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        };
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          hover: 'linear-gradient(135deg, #059669, #047857)',
          shadow: '0 10px 25px rgba(16, 185, 129, 0.4)'
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          hover: 'linear-gradient(135deg, #d97706, #b45309)',
          shadow: '0 10px 25px rgba(245, 158, 11, 0.4)'
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          hover: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          shadow: '0 10px 25px rgba(239, 68, 68, 0.4)'
        };
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          hover: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          shadow: '0 15px 35px rgba(102, 126, 234, 0.4)'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          color: 'white',
          hover: 'linear-gradient(135deg, #2563eb, #1e40af)',
          shadow: '0 10px 25px rgba(59, 130, 246, 0.4)'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '10px',
          iconSize: 16
        };
      case 'large':
        return {
          padding: '16px 32px',
          fontSize: '18px',
          borderRadius: '16px',
          iconSize: 24
        };
      default:
        return {
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '12px',
          iconSize: 20
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const buttonContent = (
    <>
      <div className="button-content">
        {Icon && iconPosition === 'left' && (
          <Icon 
            size={sizeStyles.iconSize} 
            className={`button-icon ${loading ? 'loading-spin' : ''}`}
          />
        )}
        <span className="button-text">{children}</span>
        {Icon && iconPosition === 'right' && (
          <Icon 
            size={sizeStyles.iconSize} 
            className={`button-icon ${loading ? 'loading-spin' : ''}`}
          />
        )}
      </div>

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}

      {/* Glow effect */}
      {(glowEffect || isHovered) && (
        <div className="glow-effect" />
      )}

      {/* Shine effect */}
      <div className="shine-effect" />
    </>
  );

  const buttonStyles = {
    position: 'relative' as const,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: sizeStyles.padding,
    fontSize: sizeStyles.fontSize,
    fontWeight: '600',
    borderRadius: sizeStyles.borderRadius,
    border: variantStyles.border || 'none',
    background: isHovered ? variantStyles.hover : variantStyles.background,
    color: variantStyles.color,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isPressed ? 'scale(0.98)' : isHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: disabled 
      ? 'none' 
      : isHovered 
        ? `${variantStyles.shadow}, 0 5px 15px rgba(0, 0, 0, 0.1)` 
        : variantStyles.shadow,
    opacity: disabled ? 0.6 : 1,
    overflow: 'hidden' as const,
    width: fullWidth ? '100%' : 'auto',
    backdropFilter: variant === 'secondary' ? 'blur(10px)' : 'none'
  };

  const eventHandlers = {
    onMouseEnter: () => !disabled && setIsHovered(true),
    onMouseLeave: () => {
      setIsHovered(false);
      setIsPressed(false);
    },
    onMouseDown: () => !disabled && setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onClick: handleClick
  };

  if (href && !disabled && !loading) {
    return (
      <Link
        href={href}
        style={buttonStyles}
        className={`enhanced-button ${className} ${pulseAnimation ? 'pulse-animation' : ''}`}
        {...eventHandlers}
      >
        {buttonContent}
        <style jsx>{`
          .enhanced-button {
            text-decoration: none !important;
          }

          .button-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            position: relative;
            z-index: 1;
          }

          .button-icon {
            transition: transform 0.3s ease;
          }

          .enhanced-button:hover .button-icon {
            transform: scale(1.1);
          }

          .loading-spin {
            animation: spin 1s linear infinite;
          }

          .button-text {
            white-space: nowrap;
          }

          .ripple {
            position: absolute;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
          }

          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: inherit;
            z-index: 2;
          }

          .loading-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .glow-effect {
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: inherit;
            border-radius: inherit;
            filter: blur(8px);
            opacity: 0.7;
            z-index: -1;
            animation: glow 2s ease-in-out infinite alternate;
          }

          .shine-effect {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            transition: left 0.6s ease;
            pointer-events: none;
          }

          .enhanced-button:hover .shine-effect {
            left: 100%;
          }

          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }

          @keyframes rippleEffect {
            to {
              transform: scale(2);
              opacity: 0;
            }
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes glow {
            from {
              filter: blur(8px);
              opacity: 0.7;
            }
            to {
              filter: blur(12px);
              opacity: 0.9;
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-2px) scale(1.02);
            }
          }
        `}</style>
      </Link>
    );
  }

  return (
    <button
      style={buttonStyles}
      className={`enhanced-button ${className} ${pulseAnimation ? 'pulse-animation' : ''}`}
      disabled={disabled || loading}
      {...eventHandlers}
    >
      {buttonContent}
      <style jsx>{`
        .enhanced-button {
          border: none;
          outline: none;
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }

        .button-icon {
          transition: transform 0.3s ease;
        }

        .enhanced-button:hover .button-icon:not(.loading-spin) {
          transform: scale(1.1);
        }

        .loading-spin {
          animation: spin 1s linear infinite;
        }

        .button-text {
          white-space: nowrap;
        }

        .ripple {
          position: absolute;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          transform: scale(0);
          animation: rippleEffect 0.6s ease-out;
          pointer-events: none;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
          z-index: 2;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .glow-effect {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: inherit;
          border-radius: inherit;
          filter: blur(8px);
          opacity: 0.7;
          z-index: -1;
          animation: glow 2s ease-in-out infinite alternate;
        }

        .shine-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.6s ease;
          pointer-events: none;
        }

        .enhanced-button:hover .shine-effect {
          left: 100%;
        }

        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes rippleEffect {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes glow {
          from {
            filter: blur(8px);
            opacity: 0.7;
          }
          to {
            filter: blur(12px);
            opacity: 0.9;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-2px) scale(1.02);
          }
        }
      `}</style>
    </button>
  );
};

export default EnhancedButton;