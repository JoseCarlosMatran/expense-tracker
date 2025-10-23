import React from 'react';
import { Shield, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface FinancialHealthIndicatorProps {
  score: number;
  className?: string;
}

const FinancialHealthIndicator: React.FC<FinancialHealthIndicatorProps> = ({ 
  score, 
  className = '' 
}) => {
  const getHealthStatus = (score: number) => {
    if (score >= 80) return {
      status: 'excellent',
      color: 'emerald',
      icon: Shield,
      message: 'Excellent Financial Health',
      description: 'Your spending patterns are stable and well-managed.'
    };
    if (score >= 60) return {
      status: 'good',
      color: 'blue',
      icon: TrendingUp,
      message: 'Good Financial Health',
      description: 'You\'re managing your finances well with room for improvement.'
    };
    if (score >= 40) return {
      status: 'fair',
      color: 'amber',
      icon: AlertTriangle,
      message: 'Fair Financial Health',
      description: 'Consider reviewing your spending patterns and setting budgets.'
    };
    return {
      status: 'poor',
      color: 'red',
      icon: TrendingDown,
      message: 'Needs Attention',
      description: 'Your spending patterns suggest reviewing and optimizing your budget.'
    };
  };

  const health = getHealthStatus(score);
  const Icon = health.icon;

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-800',
        icon: 'text-emerald-600',
        progress: 'bg-emerald-500'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-600',
        progress: 'bg-blue-500'
      },
      amber: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        icon: 'text-amber-600',
        progress: 'bg-amber-500'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: 'text-red-600',
        progress: 'bg-red-500'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const colorClasses = getColorClasses(health.color);

  return (
    <div className={`financial-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${colorClasses.bg} border ${colorClasses.border}`}>
            <Icon className={`h-5 w-5 ${colorClasses.icon}`} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Financial Health Score</h3>
            <p className="text-sm text-slate-600">AI-powered analysis</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-slate-900">{score}</div>
          <div className="text-xs text-slate-500">/ 100</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${colorClasses.text}`}>
            {health.message}
          </span>
          <span className="text-sm text-slate-500">{score}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full ${colorClasses.progress} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600">
        {health.description}
      </p>

      {/* Score breakdown visual */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((segment) => {
          const segmentScore = (segment - 1) * 25;
          const isActive = score > segmentScore;
          return (
            <div
              key={segment}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive ? colorClasses.progress : 'bg-slate-200'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FinancialHealthIndicator;