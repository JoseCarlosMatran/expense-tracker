'use client';

import React, { useState, useEffect } from 'react';
import { Receipt, TrendingDown, Filter, Search, Plus, Sparkles } from 'lucide-react';
import ExpenseList from '@/components/expenses/ExpenseList';
import EnhancedButton from '@/components/ui/EnhancedButton';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function ExpensesPage() {
  const { t } = useI18n();
  const { formatAmount } = useCurrency();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="enhanced-expenses-page">
      {/* Floating particles */}
      <div className="particles-container">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}>
            {i % 3 === 0 ? '📊' : i % 3 === 1 ? '💰' : '📈'}
          </div>
        ))}
      </div>

      {/* Hero Header */}
      <div className={`hero-header ${isVisible ? 'animate-in' : ''}`}>
        <div className="header-content">
          <div className="header-icon">
            <Receipt size={48} />
            <div className="icon-glow"></div>
          </div>
          
          <h1 className="page-title">
            {t('expenses.title')}
            <Sparkles className="title-sparkle" size={24} />
          </h1>
          
          <p className="page-subtitle">
            {t('expenses.subtitle')}
          </p>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card">
              <TrendingDown className="stat-icon" size={20} />
              <div className="stat-value">247</div>
              <div className="stat-label">{t('expenses.totalTransactions')}</div>
            </div>
            <div className="stat-card">
              <Receipt className="stat-icon" size={20} />
              <div className="stat-value">{formatAmount(1250)}</div>
              <div className="stat-label">{t('expenses.thisMonth')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className={`action-bar ${isVisible ? 'animate-in-delayed' : ''}`}>
        <div className="action-controls">
          <EnhancedButton
            icon={Search}
            variant="secondary"
            size="medium"
          >
            {t('common.search')}
          </EnhancedButton>
          
          <EnhancedButton
            icon={Filter}
            variant="secondary" 
            size="medium"
          >
            {t('common.filter')}
          </EnhancedButton>
        </div>

        <EnhancedButton
          href="/add"
          icon={Plus}
          variant="success"
          size="medium"
          glowEffect
        >
          {t('expenses.addNew')}
        </EnhancedButton>
      </div>

      {/* Enhanced Expense List */}
      <div className={`expense-list-container ${isVisible ? 'animate-in-delayed-2' : ''}`}>
        <ExpenseList />
      </div>

      <style jsx>{`
        .enhanced-expenses-page {
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
          animation: float 6s ease-in-out infinite;
          opacity: 0.3;
        }

        .particle-1 { top: 15%; left: 10%; animation-delay: 0s; }
        .particle-2 { top: 25%; right: 15%; animation-delay: 2s; }
        .particle-3 { top: 60%; left: 5%; animation-delay: 4s; }
        .particle-4 { top: 70%; right: 10%; animation-delay: 1s; }
        .particle-5 { bottom: 20%; left: 20%; animation-delay: 3s; }
        .particle-6 { bottom: 30%; right: 25%; animation-delay: 5s; }

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

        .quick-stats {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .stat-card {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--card-border);
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--glow);
        }

        .stat-icon {
          color: var(--accent-primary);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-align: center;
        }

        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          gap: 16px;
          flex-wrap: wrap;
          transform: translateY(30px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
        }

        .action-bar.animate-in-delayed {
          transform: translateY(0);
          opacity: 1;
        }

        .action-controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .expense-list-container {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow);
          overflow: hidden;
          transform: translateY(30px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
        }

        .expense-list-container.animate-in-delayed-2 {
          transform: translateY(0);
          opacity: 1;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
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

        @media (max-width: 768px) {
          .enhanced-expenses-page {
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

          .quick-stats {
            gap: 16px;
          }

          .stat-card {
            padding: 16px 20px;
            min-width: 100px;
          }

          .action-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .action-controls {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}