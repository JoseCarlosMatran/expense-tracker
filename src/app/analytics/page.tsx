'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, PieChart, Brain, Zap, TrendingUp, Activity, Sparkles, Target, Eye, Lightbulb } from 'lucide-react';
import SpendingChart from '@/components/charts/SpendingChart';
import SummaryCard from '@/components/dashboard/SummaryCard';
import FinancialHealthIndicator from '@/components/ai/FinancialHealthIndicator';
import SmartAlerts from '@/components/ai/SmartAlerts';
import SmartRecommendations from '@/components/ai/SmartRecommendations';
import SpendingInsights from '@/components/ai/SpendingInsights';
import DuplicateDetector from '@/components/ai/DuplicateDetector';
import EnhancedButton from '@/components/ui/EnhancedButton';
import { Expense } from '@/types/expense';
import { storageService } from '@/lib/storage';
import { calculateExpenseSummary, formatCurrency } from '@/lib/utils';
import { DollarSign, Calendar, Plus } from 'lucide-react';
import Link from 'next/link';
import { FinancialAI } from '@/lib/ai-engine';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function AnalyticsPage() {
  const { t } = useI18n();
  const { formatAmount } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadExpenses();
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const loadExpenses = () => {
    setIsLoading(true);
    try {
      const loadedExpenses = storageService.getExpenses();
      setExpenses(loadedExpenses);
    } finally {
      setIsLoading(false);
    }
  };

  const summary = calculateExpenseSummary(expenses);
  const averageExpense = expenses.length > 0 ? summary.totalExpenses / expenses.length : 0;
  
  // AI Analysis
  const aiInsights = useMemo(() => {
    if (expenses.length < 5) return null; // Need minimum data for comprehensive AI analysis
    const ai = new FinancialAI(expenses);
    return ai.analyzeFinances();
  }, [expenses]);
  
  const handleExpensesUpdate = () => {
    loadExpenses();
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="loading-text">{t('analytics.loading')}...</div>
        </div>
        
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 400px;
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            border-radius: 24px;
            position: relative;
            overflow: hidden;
          }
          
          .loading-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shimmer 2s infinite;
          }
          
          .loading-spinner {
            text-align: center;
            z-index: 1;
          }
          
          .spinner-ring {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }
          
          .loading-text {
            color: white;
            font-size: 18px;
            font-weight: 600;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="enhanced-analytics-page">
      {/* Floating particles */}
      <div className="particles-container">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}>
            {i % 4 === 0 ? '📊' : i % 4 === 1 ? '🧠' : i % 4 === 2 ? '💡' : '⚡'}
          </div>
        ))}
      </div>

      {/* Hero Header */}
      <div className={`hero-header ${isVisible ? 'animate-in' : ''}`}>
        <div className="header-content">
          <div className="ai-badge">
            <Brain size={24} />
            <span>AI-POWERED</span>
            <div className="pulse-dot"></div>
          </div>
          
          <div className="header-icon">
            <BarChart3 size={48} />
            <div className="icon-glow"></div>
          </div>
          
          <h1 className="page-title">
            {t('analytics.title')}
            <Sparkles className="title-sparkle" size={24} />
          </h1>
          
          <p className="page-subtitle">
            {t('analytics.subtitle')}
          </p>

          {/* AI Status Indicator */}
          {aiInsights && (
            <div className="ai-status-active">
              <Zap size={16} />
              <span>{t('analytics.aiAnalysisActive')}</span>
              <div className="status-pulse"></div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className={`chart-selector ${isVisible ? 'animate-in-delayed' : ''}`}>
        <div className="selector-label">
          <Eye size={20} />
          <span>Visualization Mode</span>
        </div>
        
        <div className="selector-buttons">
          <EnhancedButton
            variant={chartType === 'bar' ? 'primary' : 'secondary'}
            size="medium"
            icon={BarChart3}
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </EnhancedButton>
          
          <EnhancedButton
            variant={chartType === 'pie' ? 'primary' : 'secondary'}
            size="medium"
            icon={PieChart}
            onClick={() => setChartType('pie')}
          >
            Pie Chart
          </EnhancedButton>
        </div>
      </div>

      {expenses.length === 0 ? (
        /* Empty State */
        <div className={`empty-state ${isVisible ? 'animate-in-delayed-2' : ''}`}>
          <div className="empty-content">
            <div className="empty-icon">
              <Activity size={64} />
              <div className="empty-glow"></div>
            </div>
            
            <h3 className="empty-title">
              {t('analytics.noDataTitle')}
            </h3>
            
            <p className="empty-description">
              {t('analytics.noDataDescription')}
            </p>
            
            <EnhancedButton
              href="/add"
              variant="success"
              size="large"
              icon={Plus}
              glowEffect
              pulseAnimation
            >
              {t('analytics.startAdding')}
            </EnhancedButton>
          </div>
        </div>
      ) : (
        /* Content */
        <>
          {/* Summary Cards */}
          <div className={`summary-grid ${isVisible ? 'animate-in-delayed' : ''}`}>
            <div className="summary-card">
              <DollarSign className="card-icon" size={24} />
              <div className="card-value">{formatAmount(summary.totalExpenses)}</div>
              <div className="card-label">{t('analytics.totalExpenses')}</div>
              <div className="card-subtitle">{expenses.length} {t('analytics.transactions')}</div>
            </div>
            
            <div className="summary-card">
              <Calendar className="card-icon" size={24} />
              <div className="card-value">{formatAmount(summary.monthlyTotal)}</div>
              <div className="card-label">{t('analytics.monthlySpending')}</div>
              <div className="card-subtitle">{t('analytics.currentMonth')}</div>
            </div>
            
            <div className="summary-card">
              <TrendingUp className="card-icon" size={24} />
              <div className="card-value">{formatAmount(averageExpense)}</div>
              <div className="card-label">{t('analytics.averagePerExpense')}</div>
              <div className="card-subtitle">{t('analytics.acrossAllExpenses')}</div>
            </div>
            
            <div className="summary-card ai-card">
              <Brain className="card-icon" size={24} />
              <div className="card-value">{aiInsights?.healthScore || 0}%</div>
              <div className="card-label">{t('analytics.healthScore')}</div>
              <div className="card-subtitle">{t('analytics.aiAssessment')}</div>
            </div>
          </div>

          {/* AI Analysis Section */}
          {aiInsights ? (
            <div className={`ai-section ${isVisible ? 'animate-in-delayed-2' : ''}`}>
              <div className="ai-header">
                <div className="ai-title-wrapper">
                  <div className="ai-icon">
                    <Zap size={32} />
                  </div>
                  <div>
                    <h2 className="ai-title">{t('analytics.aiFinancialIntelligence')}</h2>
                    <p className="ai-subtitle">{t('analytics.advancedAnalytics')}</p>
                  </div>
                </div>
              </div>

              {/* AI Components Grid */}
              <div className="ai-components-grid">
                <FinancialHealthIndicator 
                  score={aiInsights.healthScore} 
                  className="ai-component"
                />
                <SmartAlerts 
                  alerts={aiInsights.alerts} 
                  className="ai-component"
                />
                <SmartRecommendations 
                  recommendations={aiInsights.recommendations.slice(0, 4)} 
                  className="ai-component"
                />
              </div>

              <DuplicateDetector
                duplicates={aiInsights.duplicates}
                expenses={expenses}
                onExpensesUpdate={handleExpensesUpdate}
                className="ai-component full-width"
              />

              <div className="analytics-grid">
                <SpendingInsights 
                  patterns={aiInsights.patterns}
                  trends={aiInsights.trends}
                  className="analytics-component"
                />
                
                <div className="chart-section">
                  <SpendingChart summary={summary} type={chartType} />
                  
                  <div className="category-breakdown">
                    <h3 className="breakdown-title">
                      <Target size={20} />
                      {t('analytics.categoryBreakdown')}
                    </h3>
                    <div className="breakdown-list">
                      {summary.topCategories.map((item, index) => (
                        <div key={item.category} className="breakdown-item">
                          <div className="item-info">
                            <div className="item-rank">#{index + 1}</div>
                            <div className="item-name">{item.category}</div>
                          </div>
                          <div className="item-stats">
                            <div className="item-amount">{formatAmount(item.amount)}</div>
                            <div className="item-percentage">
                              {item.percentage.toFixed(1)}% {t('analytics.ofTotal')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Need More Data State */
            <div className={`need-data-state ${isVisible ? 'animate-in-delayed-2' : ''}`}>
              <div className="need-data-content">
                <div className="need-data-icon">
                  <Brain size={48} />
                  <Lightbulb className="lightbulb" size={24} />
                </div>
                
                <h3 className="need-data-title">
                  {t('analytics.aiAnalysisRequires')}
                </h3>
                
                <p className="need-data-description">
                  {t('analytics.needMoreData')}
                </p>
              </div>

              <div className="basic-analytics">
                <SpendingChart summary={summary} type={chartType} />
                
                <div className="category-breakdown">
                  <h3 className="breakdown-title">
                    <Target size={20} />
                    {t('analytics.categoryBreakdown')}
                  </h3>
                  <div className="breakdown-list">
                    {summary.topCategories.map((item, index) => (
                      <div key={item.category} className="breakdown-item">
                        <div className="item-info">
                          <div className="item-rank">#{index + 1}</div>
                          <div className="item-name">{item.category}</div>
                        </div>
                        <div className="item-stats">
                          <div className="item-amount">{formatAmount(item.amount)}</div>
                          <div className="item-percentage">
                            {item.percentage.toFixed(1)}% {t('analytics.ofTotal')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .enhanced-analytics-page {
          width: 100%;
          position: relative;
          padding: 20px;
          background: var(--gradient-bg);
          min-height: 100vh;
          overflow: hidden;
        }

        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          font-size: 20px;
          animation: float 8s ease-in-out infinite;
          opacity: 0.3;
        }

        .particle-1 { top: 10%; left: 15%; animation-delay: 0s; }
        .particle-2 { top: 20%; right: 10%; animation-delay: 2s; }
        .particle-3 { top: 35%; left: 5%; animation-delay: 4s; }
        .particle-4 { top: 50%; right: 20%; animation-delay: 1s; }
        .particle-5 { top: 65%; left: 25%; animation-delay: 3s; }
        .particle-6 { bottom: 15%; right: 15%; animation-delay: 5s; }
        .particle-7 { bottom: 30%; left: 10%; animation-delay: 6s; }
        .particle-8 { top: 75%; right: 30%; animation-delay: 7s; }

        .hero-header {
          text-align: center;
          margin-bottom: 32px;
          transform: translateY(50px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-header.animate-in {
          transform: translateY(0);
          opacity: 1;
        }

        .header-content {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow);
          position: relative;
          overflow: hidden;
        }

        .header-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
        }

        .ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 20px;
          position: relative;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10f76f;
          animation: pulse 2s infinite;
        }

        .header-icon {
          position: relative;
          display: inline-block;
          margin-bottom: 24px;
        }

        .header-icon svg {
          color: var(--accent-primary);
          filter: drop-shadow(0 0 10px var(--accent-primary));
        }

        .icon-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--accent-primary);
          opacity: 0.2;
          filter: blur(20px);
          animation: breathe 3s ease-in-out infinite;
        }

        .page-title {
          font-size: 3rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .title-sparkle {
          color: var(--accent-secondary);
          animation: sparkle 2s ease-in-out infinite;
        }

        .page-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 32px;
          opacity: 0.9;
        }

        .ai-status-active {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 247, 111, 0.1);
          border: 1px solid rgba(16, 247, 111, 0.3);
          color: #10f76f;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          position: relative;
        }

        .status-pulse {
          position: absolute;
          right: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10f76f;
          animation: pulse 2s infinite;
        }

        .chart-selector {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 20px 24px;
          border: 1px solid var(--glass-border);
          transform: translateY(30px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
        }

        .chart-selector.animate-in-delayed {
          transform: translateY(0);
          opacity: 1;
        }

        .selector-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-primary);
          font-weight: 600;
        }

        .selector-buttons {
          display: flex;
          gap: 12px;
        }

        .empty-state {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 60px 40px;
          text-align: center;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow);
          transform: translateY(30px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
        }

        .empty-state.animate-in-delayed-2 {
          transform: translateY(0);
          opacity: 1;
        }

        .empty-content {
          max-width: 500px;
          margin: 0 auto;
        }

        .empty-icon {
          position: relative;
          display: inline-block;
          margin-bottom: 24px;
        }

        .empty-icon svg {
          color: var(--accent-primary);
          filter: drop-shadow(0 0 20px var(--accent-primary));
        }

        .empty-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--accent-primary);
          opacity: 0.2;
          filter: blur(30px);
          animation: breathe 3s ease-in-out infinite;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 16px 0;
        }

        .empty-description {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
          transform: translateY(30px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
        }

        .summary-grid.animate-in-delayed {
          transform: translateY(0);
          opacity: 1;
        }

        .summary-card {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid var(--card-border);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .summary-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--glow);
        }

        .summary-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.8s ease;
        }

        .summary-card:hover::before {
          left: 100%;
        }

        .ai-card {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1));
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .card-icon {
          color: var(--accent-primary);
          margin-bottom: 16px;
        }

        .ai-card .card-icon {
          color: #8b5cf6;
        }

        .card-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .card-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .card-subtitle {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .ai-section {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 32px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow);
          margin-bottom: 32px;
          transform: translateY(30px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
        }

        .ai-section.animate-in-delayed-2 {
          transform: translateY(0);
          opacity: 1;
        }

        .ai-header {
          margin-bottom: 32px;
        }

        .ai-title-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ai-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }

        .ai-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .ai-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
          margin: 4px 0 0 0;
        }

        .ai-components-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-top: 32px;
        }

        .chart-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .category-breakdown {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid var(--card-border);
        }

        .breakdown-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 20px 0;
        }

        .breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .breakdown-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }

        .item-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .item-rank {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--accent-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .item-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .item-stats {
          text-align: right;
        }

        .item-amount {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .item-percentage {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .need-data-state {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 32px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow);
          transform: translateY(30px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
        }

        .need-data-state.animate-in-delayed-2 {
          transform: translateY(0);
          opacity: 1;
        }

        .need-data-content {
          text-align: center;
          padding: 40px 20px;
          border-bottom: 1px solid var(--glass-border);
          margin-bottom: 32px;
        }

        .need-data-icon {
          position: relative;
          display: inline-block;
          margin-bottom: 24px;
        }

        .need-data-icon svg:first-child {
          color: var(--accent-primary);
        }

        .lightbulb {
          position: absolute;
          top: -8px;
          right: -8px;
          color: #fbbf24;
          animation: pulse 2s infinite;
        }

        .need-data-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 16px 0;
        }

        .need-data-description {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: 0;
          line-height: 1.5;
        }

        .basic-analytics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(5deg); }
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        @media (max-width: 1024px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }
          
          .basic-analytics {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .enhanced-analytics-page {
            padding: 15px;
          }

          .header-content {
            padding: 30px 20px;
          }

          .page-title {
            font-size: 2.5rem;
            flex-direction: column;
            gap: 8px;
          }

          .summary-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          }

          .summary-card {
            padding: 20px;
          }

          .ai-section {
            padding: 24px 20px;
          }

          .ai-components-grid {
            grid-template-columns: 1fr;
          }

          .chart-selector {
            flex-direction: column;
            gap: 16px;
            padding: 20px;
          }

          .selector-buttons {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}