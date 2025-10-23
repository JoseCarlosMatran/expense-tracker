'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Target, DollarSign } from 'lucide-react';
import { storageService } from '@/lib/storage';
import { dailyTrackerService } from '@/lib/daily-tracker';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useI18n } from '@/contexts/I18nContext';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { Expense } from '@/types/expense';
import { UserProfile } from '@/types/daily-tracker';

const ProgressPage: React.FC = () => {
  const { t } = useI18n();
  const { formatAmount, formatAmountCompact } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const allExpenses = storageService.getExpenses();
      const userProfile = dailyTrackerService.getUserProfile();
      setExpenses(allExpenses);
      setProfile(userProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeeklyData = () => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    
    const weekExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= weekStart && expenseDate <= weekEnd;
    });

    const dailyTotals = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayExpenses = weekExpenses.filter(e => e.date === dayStr);
      const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      dailyTotals.push({
        date: dayStr,
        day: format(day, 'EEE'),
        amount: total,
        isToday: format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
      });
    }

    return dailyTotals;
  };

  const weeklyData = getWeeklyData();
  const weekTotal = weeklyData.reduce((sum, day) => sum + day.amount, 0);
  const weeklyLimit = profile ? profile.dailyLimit * 7 : 0;
  const weeklyRemaining = weeklyLimit - weekTotal;
  const weeklyPercentage = weeklyLimit > 0 ? (weekTotal / weeklyLimit) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full" style={{width: '100%', maxWidth: 'none'}}>
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-4xl font-bold text-green-800 tracking-tight">Progress Analytics</h1>
        <p className="mt-2 text-lg text-green-600">Track your spending patterns and budget performance</p>
      </div>

      {/* Period Toggle */}
      <div className="mfp-card p-1 flex rounded-lg">
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedPeriod === 'week' 
              ? 'bg-mfp-primary text-white' 
              : 'text-gray-600 hover:text-mfp-primary'
          }`}
          onClick={() => setSelectedPeriod('week')}
        >
          Week
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedPeriod === 'month' 
              ? 'bg-mfp-primary text-white' 
              : 'text-gray-600 hover:text-mfp-primary'
          }`}
          onClick={() => setSelectedPeriod('month')}
        >
          Month
        </button>
      </div>

      {/* Weekly Summary */}
      <div className="mfp-card p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">This Week</h3>
          <div className="text-3xl font-bold text-mfp-primary mb-1">
            {formatAmount(weekTotal)}
          </div>
          <div className="text-sm text-gray-600">
            of {formatAmount(weeklyLimit)} weekly budget
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Used</span>
            <span>{Math.round(weeklyPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                weeklyPercentage > 100 ? 'bg-mfp-danger' : 'bg-mfp-success'
              }`}
              style={{ width: `${Math.min(weeklyPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="text-center">
          <div className={`text-sm font-medium ${
            weeklyRemaining >= 0 ? 'text-mfp-success' : 'text-mfp-danger'
          }`}>
            {weeklyRemaining >= 0 
              ? `${formatAmount(weeklyRemaining)} remaining this week`
              : `${formatAmount(Math.abs(weeklyRemaining))} over budget this week`
            }
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="mfp-card">
        <div className="mfp-meal-header">
          <h3 className="font-medium text-gray-900">Daily Breakdown</h3>
        </div>
        
        <div className="p-4 space-y-3">
          {weeklyData.map((day, index) => {
            const dayPercentage = profile ? (day.amount / profile.dailyLimit) * 100 : 0;
            
            return (
              <div key={day.date} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    day.isToday 
                      ? 'bg-mfp-primary text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {day.day}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatAmount(day.amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.round(dayPercentage)}% of daily limit
                    </div>
                  </div>
                </div>
                
                <div className="w-20">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        dayPercentage > 100 ? 'bg-mfp-danger' : 'bg-mfp-success'
                      }`}
                      style={{ width: `${Math.min(dayPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full" style={{width: '100%'}}>
        <div className="mfp-stat-card">
          <div className="text-2xl font-bold text-mfp-primary mb-1">
            {expenses.length}
          </div>
          <div className="text-sm text-gray-600">Total Transactions</div>
          <div className="text-xs text-gray-500 mt-1">All time</div>
        </div>
        
        <div className="mfp-stat-card">
          <div className="text-2xl font-bold text-mfp-success mb-1">
            {expenses.length > 0 ? formatAmountCompact(expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length) : '$0'}
          </div>
          <div className="text-sm text-gray-600">Avg Transaction</div>
          <div className="text-xs text-gray-500 mt-1">All time</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;