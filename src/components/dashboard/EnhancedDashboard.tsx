'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, TrendingUp, DollarSign, Calendar, Target, Sparkles, Zap, Award } from 'lucide-react';
import Link from 'next/link';
import { Expense } from '@/types/expense';
import { UserProfile, DailyProgress } from '@/types/daily-tracker';
import { dailyTrackerService } from '@/lib/daily-tracker';
import { storageService } from '@/lib/storage';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { format } from 'date-fns';

interface EnhancedDashboardProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ profile, onUpdateProfile }) => {
  const { t } = useI18n();
  const { formatAmount, formatAmountCompact } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadTodayExpenses();
    // Trigger entrance animations
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const loadTodayExpenses = () => {
    setIsLoading(true);
    try {
      const allExpenses = storageService.getExpenses();
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayExpenses = allExpenses.filter(expense => expense.date === today);
      setExpenses(todayExpenses);
    } finally {
      setIsLoading(false);
    }
  };

  const dailyProgress = useMemo(() => {
    return dailyTrackerService.calculateDailyProgress(expenses, profile);
  }, [expenses, profile]);

  const remaining = profile.dailyLimit - dailyProgress.spent;
  const percentage = (dailyProgress.spent / profile.dailyLimit) * 100;

  // Progress circle calculation with animation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  // Get status color and message
  const getStatusColor = () => {
    if (percentage <= 50) return '#10b981'; // Green
    if (percentage <= 80) return '#f59e0b'; // Yellow
    if (percentage <= 100) return '#ef4444'; // Red
    return '#dc2626'; // Dark red for over budget
  };

  const getStatusMessage = () => {
    if (percentage <= 50) return '✨ Excelente control';
    if (percentage <= 80) return '⚡ Vas bien';
    if (percentage <= 100) return '⚠️ Cuidado con el límite';
    return '🚨 Presupuesto excedido';
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="loading-text">{t('common.loading')}...</div>
        </div>
        
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 400px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    <div className="enhanced-dashboard">
      {/* Floating particles */}
      <div className="particles-container">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}>
            {i % 3 === 0 ? '💰' : i % 3 === 1 ? '✨' : '📊'}
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <div className={`hero-section ${isVisible ? 'animate-in' : ''}`}>
        <div className="welcome-header">
          <div className="date-badge">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </div>
          <h1 className="welcome-title">
            {t('dashboard.welcome')}
            <span className="sparkle-icon">✨</span>
          </h1>
          <div className="status-message" style={{ color: getStatusColor() }}>
            {getStatusMessage()}
          </div>
        </div>

        {/* Enhanced Budget Circle */}
        <div className="budget-circle-container">
          <div className="budget-circle-wrapper">
            <svg width="180" height="180" className="progress-ring">
              {/* Background circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="progress-circle"
                transform="rotate(-90 90 90)"
              />
              
              {/* Gradient definitions */}
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: getStatusColor(), stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: getStatusColor(), stopOpacity: 0.6 }} />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="circle-center">
              <div className="percentage-value">
                {Math.round(percentage)}%
              </div>
              <div className="budget-used-label">
                {t('dashboard.budgetUsed')}
              </div>
              <div className="pulse-ring"></div>
            </div>

            {/* Floating icons around circle */}
            <div className="floating-icons">
              <div className="floating-icon icon-1">💸</div>
              <div className="floating-icon icon-2">📈</div>
              <div className="floating-icon icon-3">💎</div>
              <div className="floating-icon icon-4">🎯</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className={`stats-grid ${isVisible ? 'animate-in-delayed' : ''}`}>
        <div className="stat-card card-1">
          <div className="stat-icon">
            <DollarSign size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatAmount(profile.dailyLimit)}</div>
            <div className="stat-label">{t('dashboard.dailyBudget')}</div>
          </div>
          <div className="stat-glow"></div>
        </div>

        <div className="stat-card card-2">
          <div className="stat-icon">
            <TrendingUp size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatAmount(dailyProgress.spent)}</div>
            <div className="stat-label">{t('dashboard.spentToday')}</div>
          </div>
          <div className="stat-glow"></div>
        </div>

        <div className="stat-card card-3">
          <div className="stat-icon">
            <Target size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: remaining >= 0 ? '#10b981' : '#ef4444' }}>
              {remaining >= 0 ? formatAmount(remaining) : formatAmount(Math.abs(remaining))}
            </div>
            <div className="stat-label">
              {remaining >= 0 ? t('dashboard.remainingToday') : t('dashboard.overBudget')}
            </div>
          </div>
          <div className="stat-glow"></div>
        </div>

        <div className="stat-card card-4">
          <div className="stat-icon">
            <Calendar size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{expenses.length}</div>
            <div className="stat-label">{t('dashboard.todaysTransactions')}</div>
          </div>
          <div className="stat-glow"></div>
        </div>
      </div>

      {/* Enhanced Action Buttons */}
      <div className={`action-buttons ${isVisible ? 'animate-in-delayed-2' : ''}`}>
        <Link href="/add" className="action-button primary-action">
          <div className="button-content">
            <Plus size={24} />
            <span>{t('dashboard.addNewExpense')}</span>
          </div>
          <div className="button-glow"></div>
        </Link>

        <Link href="/progress" className="action-button secondary-action">
          <div className="button-content">
            <Award size={24} />
            <span>{t('dashboard.viewProgress')}</span>
          </div>
          <div className="button-glow"></div>
        </Link>
      </div>

      <style jsx>{`
        .enhanced-dashboard {
          width: 100%;
          position: relative;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

        .particle-1 { top: 10%; left: 10%; animation-delay: 0s; }
        .particle-2 { top: 20%; right: 15%; animation-delay: 1s; }
        .particle-3 { top: 60%; left: 5%; animation-delay: 2s; }
        .particle-4 { top: 70%; right: 10%; animation-delay: 3s; }
        .particle-5 { top: 30%; left: 80%; animation-delay: 4s; }
        .particle-6 { bottom: 20%; left: 20%; animation-delay: 5s; }
        .particle-7 { bottom: 10%; right: 25%; animation-delay: 1.5s; }
        .particle-8 { top: 50%; right: 5%; animation-delay: 2.5s; }

        .hero-section {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          margin-bottom: 30px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translateY(50px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-section.animate-in {
          transform: translateY(0);
          opacity: 1;
        }

        .welcome-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .date-badge {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 16px;
          display: inline-block;
        }

        .welcome-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, #ffffff, #f0f9ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sparkle-icon {
          display: inline-block;
          animation: sparkle 2s ease-in-out infinite;
          margin-left: 12px;
        }

        .status-message {
          font-size: 1.2rem;
          font-weight: 600;
          margin-top: 12px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .budget-circle-container {
          position: relative;
        }

        .budget-circle-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .progress-ring {
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
        }

        .progress-circle {
          transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 0 8px currentColor);
        }

        .circle-center {
          position: absolute;
          text-align: center;
          color: white;
        }

        .percentage-value {
          font-size: 3rem;
          font-weight: 900;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          margin-bottom: 8px;
        }

        .budget-used-label {
          font-size: 14px;
          opacity: 0.9;
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: pulse-ring 3s ease-out infinite;
        }

        .floating-icons {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .floating-icon {
          position: absolute;
          font-size: 24px;
          animation: orbit 8s linear infinite;
        }

        .icon-1 { animation-delay: 0s; }
        .icon-2 { animation-delay: 2s; }
        .icon-3 { animation-delay: 4s; }
        .icon-4 { animation-delay: 6s; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
          transform: translateY(50px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
        }

        .stats-grid.animate-in-delayed {
          transform: translateY(0);
          opacity: 1;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.6s;
        }

        .stat-card:hover::before {
          left: 100%;
        }

        .stat-icon {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 12px;
          display: inline-flex;
          color: white;
          margin-bottom: 16px;
          transition: all 0.3s ease;
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 4px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .stat-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover .stat-glow {
          opacity: 1;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          transform: translateY(50px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
        }

        .action-buttons.animate-in-delayed-2 {
          transform: translateY(0);
          opacity: 1;
        }

        .action-button {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 24px;
          text-decoration: none;
          color: white;
          display: block;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
        }

        .primary-action {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
        }

        .secondary-action {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
        }

        .action-button:hover {
          transform: translateY(-5px) scale(1.02);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 600;
          position: relative;
          z-index: 1;
        }

        .button-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .action-button:hover .button-glow {
          opacity: 1;
          animation: glow-sweep 1.5s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
        }

        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0; }
        }

        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }

        @keyframes glow-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @media (max-width: 768px) {
          .enhanced-dashboard {
            padding: 15px;
          }
          
          .hero-section {
            padding: 30px 20px;
          }
          
          .welcome-title {
            font-size: 2.5rem;
          }
          
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 15px;
          }
          
          .action-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedDashboard;