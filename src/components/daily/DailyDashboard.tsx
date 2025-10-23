'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Target, TrendingUp, Calendar, Flame, Award, ChevronRight, Wallet } from 'lucide-react';
import Link from 'next/link';
import { Expense } from '@/types/expense';
import { UserProfile, DailyProgress, DailyStreak } from '@/types/daily-tracker';
import { dailyTrackerService } from '@/lib/daily-tracker';
import { storageService } from '@/lib/storage';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import Button from '@/components/ui/Button';
import { format } from 'date-fns';

interface DailyDashboardProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const DailyDashboard: React.FC<DailyDashboardProps> = ({ profile, onUpdateProfile }) => {
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

  const streaks = useMemo(() => {
    const allExpenses = storageService.getExpenses();
    return dailyTrackerService.updateStreak(allExpenses, profile);
  }, [expenses, profile]);

  const getStatusColor = (status: DailyProgress['status']) => {
    switch (status) {
      case 'excellent': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'over': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusMessage = (status: DailyProgress['status'], percentage: number) => {
    if (percentage === 0) return t('dailyTracker.noExpensesToday');
    if (status === 'over') return t('dailyTracker.budgetExceeded');
    if (status === 'warning') return t('dailyTracker.budgetWarning');
    return t('dailyTracker.budgetOnTrack');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-500">Loading today&apos;s progress...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Progress Circle */}
      <div className="financial-card p-8 text-center">
        <div className="relative inline-block mb-6">
          <svg className="w-48 h-48" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={dailyProgress.status === 'over' ? '#ef4444' : '#3b82f6'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - Math.min(dailyProgress.percentage / 100, 1))}`}
              className="transition-all duration-1000 ease-out"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-slate-900">
              {Math.round(dailyProgress.percentage)}%
            </div>
            <div className="text-slate-600 mt-1">of daily limit</div>
          </div>
        </div>

        <div className={`inline-block px-4 py-2 rounded-full border ${getStatusColor(dailyProgress.status)}`}>
          {getStatusMessage(dailyProgress.status, dailyProgress.percentage)}
        </div>
      </div>

      {/* Daily Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        <div className="financial-card p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">{t('dailyTracker.dailyLimit')}</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatAmountCompact(profile.dailyLimit)}
          </div>
        </div>

        <div className="financial-card p-4">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">{t('common.spent')}</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatAmountCompact(dailyProgress.spent)}
          </div>
        </div>

        <div className="financial-card p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Flame className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-slate-700">{t('dailyTracker.streak')}</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {streaks.currentStreak}
          </div>
          <div className="text-xs text-slate-500">
            {t('dailyTracker.daysInRow')}
          </div>
        </div>

        <div className="financial-card p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-slate-700">Transactions</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {dailyProgress.transactions}
          </div>
          <div className="text-xs text-slate-500">
            {t('common.today')}
          </div>
        </div>
        
        {/* Additional stats for wide screens */}
        <div className="hidden xl:block financial-card p-4">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">Avg per Transaction</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {dailyProgress.transactions > 0 ? formatAmountCompact(dailyProgress.spent / dailyProgress.transactions) : formatAmountCompact(0)}
          </div>
          <div className="text-xs text-slate-500">
            Per transaction
          </div>
        </div>
        
        <div className="hidden xl:block financial-card p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="h-5 w-5 text-rose-600" />
            <span className="text-sm font-medium text-slate-700">Budget Status</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {dailyProgress.percentage.toFixed(0)}%
          </div>
          <div className={`text-xs ${
            dailyProgress.percentage > 100 ? 'text-red-500' : 
            dailyProgress.percentage > 75 ? 'text-amber-500' : 'text-emerald-500'
          }`}>
            {dailyProgress.percentage > 100 ? 'Over limit' : 'Within limit'}
          </div>
        </div>
        
        <div className="hidden 2xl:block financial-card p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Wallet className="h-5 w-5 text-teal-600" />
            <span className="text-sm font-medium text-slate-700">Weekly Pace</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatAmountCompact(dailyProgress.spent * 7)}
          </div>
          <div className="text-xs text-slate-500">
            If continued weekly
          </div>
        </div>
        
        <div className="hidden 2xl:block financial-card p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="h-5 w-5 text-cyan-600" />
            <span className="text-sm font-medium text-slate-700">Monthly Pace</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatAmountCompact(dailyProgress.spent * 30)}
          </div>
          <div className="text-xs text-slate-500">
            At current rate
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="financial-card p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <Link href="/add">
            <Button size="lg" className="w-full justify-start">
              <Plus className="h-5 w-5 mr-3" />
              {t('dailyTracker.addExpenseToday')}
            </Button>
          </Link>

          <Link href="/diary">
            <Button variant="outline" size="lg" className="w-full justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3" />
                View Diary
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Today's Expenses */}
      {expenses.length > 0 && (
        <div className="financial-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {t('dailyTracker.todaysExpenses')}
          </h3>
          
          <div className="space-y-3">
            {expenses.slice(0, 3).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">{expense.description}</div>
                  <div className="text-sm text-slate-600">{expense.category}</div>
                </div>
                <div className="text-lg font-semibold text-slate-900">
                  {formatAmount(expense.amount)}
                </div>
              </div>
            ))}
            
            {expenses.length > 3 && (
              <Link href="/diary">
                <div className="text-center py-2 text-blue-600 hover:text-blue-800 transition-colors">
                  View {expenses.length - 3} more expenses →
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Achievements Preview */}
      {streaks.currentStreak > 0 && (
        <div className="financial-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-slate-900">Achievements</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
              <div className="text-2xl">🔥</div>
              <div>
                <div className="font-medium text-slate-900">
                  {streaks.currentStreak} Day Streak
                </div>
                <div className="text-sm text-slate-600">
                  Keep staying under budget!
                </div>
              </div>
            </div>
            
            {streaks.longestStreak > streaks.currentStreak && (
              <div className="text-sm text-slate-500 text-center">
                Personal best: {streaks.longestStreak} days
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remaining Budget Alert */}
      <div className="financial-card p-6">
        <div className={`p-4 rounded-lg border ${
          dailyProgress.spent > profile.dailyLimit 
            ? 'bg-red-50 border-red-200' 
            : dailyProgress.percentage > 75
            ? 'bg-amber-50 border-amber-200'
            : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">
              {dailyProgress.spent > profile.dailyLimit ? (
                <span className="text-red-600">
                  {formatAmount(dailyProgress.spent - profile.dailyLimit)} over budget
                </span>
              ) : (
                <span className="text-emerald-600">
                  {formatAmount(profile.dailyLimit - dailyProgress.spent)} remaining
                </span>
              )}
            </div>
            <div className="text-sm text-slate-600">
              {dailyProgress.spent > profile.dailyLimit 
                ? "You've exceeded your daily limit"
                : `You can spend ${formatAmount(profile.dailyLimit - dailyProgress.spent)} more today`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDashboard;