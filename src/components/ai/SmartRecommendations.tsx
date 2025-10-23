import React, { useState } from 'react';
import { Lightbulb, Target, TrendingUp, Zap, ChevronDown, ChevronRight, CheckCircle } from 'lucide-react';
import { Recommendation } from '@/types/ai';
import { useCurrency } from '@/contexts/CurrencyContext';

interface SmartRecommendationsProps {
  recommendations: Recommendation[];
  className?: string;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ 
  recommendations, 
  className = '' 
}) => {
  const { formatAmount } = useCurrency();
  const [expandedRecs, setExpandedRecs] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedRecs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRecs(newExpanded);
  };

  const getRecommendationIcon = (type: string) => {
    const icons = {
      budget: Target,
      savings: TrendingUp,
      pattern: Lightbulb,
      optimization: Zap
    };
    return icons[type as keyof typeof icons] || Lightbulb;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        badge: 'bg-red-100 text-red-700'
      },
      medium: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        badge: 'bg-amber-100 text-amber-700'
      },
      low: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-700'
      }
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  if (recommendations.length === 0) {
    return (
      <div className={`financial-card p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Smart Recommendations</h3>
            <p className="text-sm text-slate-600">AI-powered optimization tips</p>
          </div>
        </div>
        <div className="text-center py-8">
          <Lightbulb className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-slate-600">Great job! Your spending looks optimized.</p>
          <p className="text-sm text-slate-500 mt-1">Keep up the good financial habits</p>
        </div>
      </div>
    );
  }

  const totalPotentialSavings = recommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0);

  return (
    <div className={`financial-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
            <Lightbulb className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Smart Recommendations</h3>
            <p className="text-sm text-slate-600">Personalized optimization tips</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">Potential Savings</div>
          <div className="text-xl font-bold text-emerald-600">
            {formatAmount(totalPotentialSavings)}
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {recommendations
          .sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority as keyof typeof priorityOrder] - 
                   priorityOrder[a.priority as keyof typeof priorityOrder];
          })
          .map((recommendation) => {
            const Icon = getRecommendationIcon(recommendation.type);
            const colors = getPriorityColor(recommendation.priority);
            const isExpanded = expandedRecs.has(recommendation.id);

            return (
              <div
                key={recommendation.id}
                className={`border rounded-xl ${colors.bg} ${colors.border} transition-all duration-200 hover:shadow-md`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-white border ${colors.border}`}>
                        <Icon className={`h-4 w-4 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-slate-900">{recommendation.title}</h4>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.badge}`}>
                            {recommendation.priority}
                          </span>
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-2">
                          {recommendation.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm">
                              <span className="text-slate-500">Potential savings: </span>
                              <span className="font-medium text-emerald-600">
                                {formatAmount(recommendation.potentialSavings)}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500">
                              {recommendation.confidence}% confidence
                            </div>
                          </div>
                          
                          <button
                            onClick={() => toggleExpanded(recommendation.id)}
                            className="flex items-center text-sm text-slate-600 hover:text-slate-900"
                          >
                            {isExpanded ? 'Less' : 'Details'}
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronRight className="h-4 w-4 ml-1" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4">
                    <div className="pl-11 pt-3 border-t border-white">
                      <h5 className="text-sm font-medium text-slate-900 mb-2">Action Steps:</h5>
                      <ul className="space-y-2">
                        {recommendation.actionSteps.map((step, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-slate-600">
                            <div className={`w-5 h-5 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center mt-0.5`}>
                              <span className="text-xs font-medium">{index + 1}</span>
                            </div>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {recommendations.length > 3 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Showing {Math.min(3, recommendations.length)} of {recommendations.length} recommendations
            </span>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartRecommendations;