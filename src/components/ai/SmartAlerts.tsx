import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, Bell } from 'lucide-react';
import { FinancialAlert } from '@/types/ai';

interface SmartAlertsProps {
  alerts: FinancialAlert[];
  className?: string;
}

const SmartAlerts: React.FC<SmartAlertsProps> = ({ alerts, className = '' }) => {
  if (alerts.length === 0) {
    return (
      <div className={`financial-card p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Smart Alerts</h3>
            <p className="text-sm text-slate-600">AI-powered financial monitoring</p>
          </div>
        </div>
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-slate-600">All systems green! No alerts at this time.</p>
          <p className="text-sm text-slate-500 mt-1">We&apos;re monitoring your spending patterns</p>
        </div>
      </div>
    );
  }

  const getAlertConfig = (alert: FinancialAlert) => {
    const configs = {
      danger: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: XCircle,
        iconColor: 'text-red-600',
        badgeColor: 'bg-red-100 text-red-700'
      },
      warning: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        icon: AlertTriangle,
        iconColor: 'text-amber-600',
        badgeColor: 'bg-amber-100 text-amber-700'
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: Info,
        iconColor: 'text-blue-600',
        badgeColor: 'bg-blue-100 text-blue-700'
      },
      success: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-800',
        icon: CheckCircle,
        iconColor: 'text-emerald-600',
        badgeColor: 'bg-emerald-100 text-emerald-700'
      }
    };
    return configs[alert.type];
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-amber-500',
      low: 'bg-blue-500'
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const prioritizedAlerts = alerts.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity as keyof typeof severityOrder] - 
           severityOrder[a.severity as keyof typeof severityOrder];
  });

  return (
    <div className={`financial-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
            <Bell className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Smart Alerts</h3>
            <p className="text-sm text-slate-600">AI-detected spending patterns</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-slate-900">{alerts.length}</span>
          <span className="text-sm text-slate-500">active</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {prioritizedAlerts.map((alert, index) => {
          const config = getAlertConfig(alert);
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border ${config.bg} ${config.border} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`h-5 w-5 mt-0.5 ${config.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-medium ${config.text}`}>{alert.title}</h4>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity)}`} />
                      <span className="text-xs text-slate-500 capitalize">{alert.severity}</span>
                    </div>
                  </div>
                  
                  <p className={`text-sm ${config.text} opacity-90 mb-3`}>
                    {alert.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.badgeColor}`}>
                      {alert.category === 'general' ? 'General' : alert.category}
                    </span>
                    
                    {alert.actionable && (
                      <button className={`text-xs font-medium ${config.text} hover:underline`}>
                        View Details →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {alerts.length > 3 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">
            View All Alerts ({alerts.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartAlerts;