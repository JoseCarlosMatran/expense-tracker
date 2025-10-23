import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variantClasses = {
    primary: 'arkm-btn arkm-btn-primary',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500 shadow-sm hover:shadow-md border border-slate-200',
    success: 'arkm-btn text-white hover:-translate-y-0.5' + ' ' + 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg hover:shadow-xl focus:ring-emerald-500',
    danger: 'arkm-btn text-white hover:-translate-y-0.5' + ' ' + 'bg-gradient-to-r from-red-600 to-red-700 shadow-lg hover:shadow-xl focus:ring-red-500',
    outline: 'border-2 text-slate-700 hover:bg-slate-50 focus:ring-slate-500 shadow-sm hover:shadow-md' + ' ' + 'border-slate-300 bg-white hover:border-slate-400',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-xl'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && 'opacity-60 cursor-not-allowed transform-none',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 bg-current opacity-20 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
    </button>
  );
};

export default Button;