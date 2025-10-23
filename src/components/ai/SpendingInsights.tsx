import React from 'react';
import { TrendingUp, TrendingDown, Activity, Calendar, BarChart3 } from 'lucide-react';
import { ExpensePattern, SpendingTrend } from '@/types/ai';
import { useCurrency } from '@/contexts/CurrencyContext';
import { CATEGORY_COLORS } from '@/constants/categories';
import { format, parseISO } from 'date-fns';

interface SpendingInsightsProps {
  patterns: ExpensePattern[];
  trends: SpendingTrend[];
  className?: string;
}

const SpendingInsights: React.FC<SpendingInsightsProps> = ({
  patterns,
  trends,
  className = ''
}) => {
  const { formatAmount } = useCurrency();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return TrendingUp;
      case 'decreasing': return TrendingDown;
      default: return Activity;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-600';
      case 'decreasing': return 'text-emerald-600';
      default: return 'text-blue-600';
    }
  };

  const getTrendBg = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'bg-red-50 border-red-200';
      case 'decreasing': return 'bg-emerald-50 border-emerald-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getVolatilityLevel = (variance: number, average: number) => {
    const ratio = variance / average;
    if (ratio > 0.5) return { level: 'High', color: 'text-red-600' };
    if (ratio > 0.25) return { level: 'Medium', color: 'text-amber-600' };
    return { level: 'Low', color: 'text-emerald-600' };
  };

  const recentTrends = trends.slice(-3); // Last 3 months
  const totalGrowth = recentTrends.length > 1 ? 
    ((recentTrends[recentTrends.length - 1].total - recentTrends[0].total) / recentTrends[0].total) * 100 : 0;

  return (
    <div className={`financial-card p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
          <BarChart3 className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Spending Insights</h3>
          <p className="text-sm text-slate-600">AI-powered pattern analysis</p>
        </div>
      </div>

      {/* Overall Trend Summary */}
      <div className="mb-6 p-4 bg-slate-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-slate-900 mb-1">3-Month Trend</h4>
            <p className="text-sm text-slate-600">Overall spending pattern</p>
          </div>
          <div className="text-right">
            <div className={`flex items-center space-x-1 ${totalGrowth > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {totalGrowth > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-bold">{Math.abs(totalGrowth).toFixed(1)}%</span>
            </div>
            <div className="text-xs text-slate-500">
              {totalGrowth > 0 ? 'Increasing' : 'Decreasing'}
            </div>
          </div>
        </div>
      </div>

      {/* Category Patterns */}
      <div className="space-y-4">
        <h4 className="font-medium text-slate-900">Category Analysis</h4>
        
        {patterns.slice(0, 5).map((pattern) => {
          const TrendIcon = getTrendIcon(pattern.trend);
          const volatility = getVolatilityLevel(pattern.variance, pattern.averageAmount);
          
          return (
            <div key={pattern.category} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[pattern.category] }}
                  />
                  <span className="font-medium text-slate-900">{pattern.category}</span>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getTrendBg(pattern.trend)}`}>
                  <TrendIcon className={`h-3 w-3 ${getTrendColor(pattern.trend)}`} />
                  <span className={`text-xs font-medium ${getTrendColor(pattern.trend)}`}>
                    {pattern.trend}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Avg. Amount</div>
                  <div className="font-medium text-slate-900">
                    {formatAmount(pattern.averageAmount)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Frequency</div>
                  <div className="font-medium text-slate-900">
                    {pattern.frequency.toFixed(1)}/month
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Volatility</div>
                  <div className={`font-medium ${volatility.color}`}>
                    {volatility.level}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center space-x-2">
                <Calendar className="h-3 w-3" />
                <span>Last expense: {format(parseISO(pattern.lastOccurrence), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Trends Chart */}
      {trends.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="font-medium text-slate-900 mb-4">Monthly Spending Trends</h4>
          <div className="space-y-3">
            {trends.slice(-6).map((trend) => {
              const monthName = format(parseISO(`${trend.month}-01`), 'MMM yyyy');
              const maxAmount = Math.max(...trends.map(t => t.total));
              const widthPercentage = (trend.total / maxAmount) * 100;
              
              return (
                <div key={trend.month} className="flex items-center space-x-3">
                  <div className="w-16 text-xs text-slate-500">{monthName}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-slate-900">
                        {formatAmount(trend.total)}
                      </div>
                      {trend.growthRate !== 0 && (
                        <div className={`flex items-center space-x-1 text-xs ${
                          trend.growthRate > 0 ? 'text-red-600' : 'text-emerald-600'
                        }`}>
                          {trend.growthRate > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>{Math.abs(trend.growthRate).toFixed(1)}%</span>
                        </div>
                      )}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${widthPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingInsights;