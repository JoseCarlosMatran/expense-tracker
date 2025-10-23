'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, TrendingUp, DollarSign, Calendar, PieChart, Target } from 'lucide-react';
import Link from 'next/link';
import { Expense } from '@/types/expense';
import { UserProfile, DailyProgress } from '@/types/daily-tracker';
import { dailyTrackerService } from '@/lib/daily-tracker';
import { storageService } from '@/lib/storage';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface SimpleFullWidthDashboardProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const SimpleFullWidthDashboard: React.FC<SimpleFullWidthDashboardProps> = ({ profile, onUpdateProfile }) => {
  const { t } = useI18n();
  const { formatAmount, formatAmountCompact } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTodayExpenses();
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

  // Progress circle calculation
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Hero Section - FULL WIDTH */}
      <div style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#2d5a3d',
            marginBottom: '8px',
            margin: 0
          }}>
            {t('dashboard.welcome')}
          </h1>
          <p style={{
            color: '#4a7c59',
            fontSize: '18px',
            margin: 0
          }}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Main Budget Card - FULL WIDTH */}
        <div style={{
          width: '100%',
          maxWidth: 'none',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid rgba(45, 90, 61, 0.1)',
          boxShadow: '0 8px 32px rgba(45, 90, 61, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}>
            {/* Progress Circle */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative' }}>
                <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="rgba(45, 90, 61, 0.1)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke={percentage > 100 ? '#e74c3c' : '#4a7c59'}
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      color: '#2d5a3d',
                      marginBottom: '4px'
                    }}>
                      {Math.round(percentage)}%
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#4a7c59'
                    }}>{t('dashboard.budgetUsed')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: 'rgba(45, 90, 61, 0.05)',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#2d5a3d'
                  }}>
                    {formatAmount(profile.dailyLimit)}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#4a7c59'
                  }}>{t('dashboard.dailyBudget')}</div>
                </div>
                
                <div style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#d4af37'
                  }}>
                    {formatAmount(dailyProgress.spent)}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#4a7c59'
                  }}>{t('dashboard.spentToday')}</div>
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '16px',
                background: '#f8f9fa',
                borderRadius: '12px'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: remaining >= 0 ? '#27ae60' : '#e74c3c'
                }}>
                  {remaining >= 0 ? formatAmount(remaining) : formatAmount(Math.abs(remaining))}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#4a7c59'
                }}>
                  {remaining >= 0 ? t('dashboard.remainingToday') : t('dashboard.overBudget')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid - FULL WIDTH */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        width: '100%'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(45, 90, 61, 0.1)'
        }}>
          <Target size={32} style={{ color: '#d4af37', margin: '0 auto 12px' }} />
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#2d5a3d',
            marginBottom: '4px'
          }}>
            {expenses.length}
          </div>
          <div style={{ fontSize: '14px', color: '#4a7c59' }}>{t('dashboard.todaysTransactions')}</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(45, 90, 61, 0.1)'
        }}>
          <DollarSign size={32} style={{ color: '#d4af37', margin: '0 auto 12px' }} />
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#2d5a3d',
            marginBottom: '4px'
          }}>
            {expenses.length > 0 ? formatAmountCompact(dailyProgress.spent / expenses.length) : '$0'}
          </div>
          <div style={{ fontSize: '14px', color: '#4a7c59' }}>{t('dashboard.avgTransaction')}</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(45, 90, 61, 0.1)'
        }}>
          <Calendar size={32} style={{ color: '#d4af37', margin: '0 auto 12px' }} />
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#2d5a3d',
            marginBottom: '4px'
          }}>
            {Math.round(percentage)}%
          </div>
          <div style={{ fontSize: '14px', color: '#4a7c59' }}>{t('dashboard.budgetProgress')}</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(45, 90, 61, 0.1)'
        }}>
          <TrendingUp size={32} style={{ color: '#d4af37', margin: '0 auto 12px' }} />
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#2d5a3d',
            marginBottom: '4px'
          }}>
            {formatAmountCompact(dailyProgress.spent)}
          </div>
          <div style={{ fontSize: '14px', color: '#4a7c59' }}>{t('dashboard.totalToday')}</div>
        </div>
      </div>

      {/* Quick Actions - FULL WIDTH */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        width: '100%'
      }}>
        <Link href="/add" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #d4af37 0%, #ffd700 100%)',
          color: '#2d5a3d',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '18px',
          boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
          transition: 'all 0.2s'
        }}>
          <Plus size={24} style={{ marginBottom: '8px' }} />
          {t('dashboard.addNewExpense')}
        </Link>
        
        <Link href="/progress" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#2d5a3d',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '18px',
          border: '1px solid rgba(45, 90, 61, 0.1)',
          boxShadow: '0 8px 32px rgba(45, 90, 61, 0.1)',
          transition: 'all 0.2s'
        }}>
          <TrendingUp size={24} style={{ color: '#d4af37', marginBottom: '8px' }} />
          {t('dashboard.viewProgress')}
        </Link>
      </div>
    </div>
  );
};

export default SimpleFullWidthDashboard;