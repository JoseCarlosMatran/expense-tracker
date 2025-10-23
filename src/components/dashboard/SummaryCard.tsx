import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'primary' | 'success' | 'warning' | 'accent';
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  variant = 'primary',
}) => {
  const { formatAmount } = useCurrency();

  const variantClasses = {
    primary: {
      gradient: 'financial-accent-gradient',
      bg: 'from-blue-500 to-blue-600',
      accent: 'text-blue-600',
      bgAccent: 'bg-blue-50'
    },
    success: {
      gradient: 'financial-success-gradient',
      bg: 'from-emerald-500 to-emerald-600',
      accent: 'text-emerald-600',
      bgAccent: 'bg-emerald-50'
    },
    warning: {
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
      bg: 'from-amber-500 to-orange-600',
      accent: 'text-amber-600',
      bgAccent: 'bg-amber-50'
    },
    accent: {
      gradient: 'financial-gradient',
      bg: 'from-slate-700 to-slate-800',
      accent: 'text-slate-600',
      bgAccent: 'bg-slate-50'
    }
  };

  const config = variantClasses[variant];

  return (
    <div className="financial-card p-6 group hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${config.gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  {formatAmount(value)}
                </p>
                {trend && (
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    trend.isPositive 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {trend.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{Math.abs(trend.value)}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {subtitle && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
          )}
          
          {trend && (
            <div className="mt-3 text-xs text-slate-500">
              <span className="font-medium">
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="ml-1">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;