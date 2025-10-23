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

interface NewFinanceDashboardProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const NewFinanceDashboard: React.FC<NewFinanceDashboardProps> = ({ profile, onUpdateProfile }) => {
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

  // Get monthly data
  const monthlyData = useMemo(() => {
    const allExpenses = storageService.getExpenses();
    const currentMonth = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    const monthExpenses = allExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });

    return {
      total: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
      count: monthExpenses.length,
      avg: monthExpenses.length > 0 ? monthExpenses.reduce((sum, e) => sum + e.amount, 0) / monthExpenses.length : 0
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6" style={{width: '100%', maxWidth: 'none'}}>
      {/* Hero Section */}
      <div className="w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Welcome Back!
          </h1>
          <p className="text-green-600">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Main Budget Card - Full Width */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-green-100" style={{width: '100%'}}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Progress Circle */}
            <div className="flex justify-center">
              <div className="relative">
                <svg width="160" height="160" className="finance-progress-ring">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    className="finance-progress-bg"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    className={`finance-progress-fill ${percentage > 100 ? 'over' : ''}`}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-finance-green-primary mb-1">
                      {Math.round(percentage)}%
                    </div>
                    <div className="text-sm text-finance-green-secondary">Budget Used</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Details */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-finance-green-primary bg-opacity-5 rounded-xl">
                  <div className="text-2xl font-bold text-finance-green-primary">
                    {formatAmount(profile.dailyLimit)}
                  </div>
                  <div className="text-sm text-finance-green-secondary">Daily Budget</div>
                </div>
                
                <div className="text-center p-4 bg-finance-gold-primary bg-opacity-10 rounded-xl">
                  <div className="text-2xl font-bold text-finance-gold-primary">
                    {formatAmount(dailyProgress.spent)}
                  </div>
                  <div className="text-sm text-finance-green-secondary">Spent Today</div>
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className={`text-3xl font-bold mb-2 ${
                  remaining >= 0 ? 'text-finance-success' : 'text-finance-danger'
                }`}>
                  {remaining >= 0 ? formatAmount(remaining) : formatAmount(Math.abs(remaining))}
                </div>
                <div className="text-sm text-finance-green-secondary">
                  {remaining >= 0 ? 'Remaining Today' : 'Over Budget'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="finance-grid finance-grid-responsive">
        <div className="finance-stat-card animate-slideInLeft">
          <Target className="h-8 w-8 text-finance-gold-primary mb-3 mx-auto" />
          <div className="text-2xl font-bold text-finance-green-primary mb-1">
            {expenses.length}
          </div>
          <div className="text-sm text-finance-green-secondary">Today's Transactions</div>
        </div>

        <div className="finance-stat-card animate-slideInUp" style={{animationDelay: '0.1s'}}>
          <DollarSign className="h-8 w-8 text-finance-gold-primary mb-3 mx-auto" />
          <div className="text-2xl font-bold text-finance-green-primary mb-1">
            {expenses.length > 0 ? formatAmountCompact(dailyProgress.spent / expenses.length) : '$0'}
          </div>
          <div className="text-sm text-finance-green-secondary">Avg Transaction</div>
        </div>

        <div className="finance-stat-card animate-slideInUp" style={{animationDelay: '0.2s'}}>
          <Calendar className="h-8 w-8 text-finance-gold-primary mb-3 mx-auto" />
          <div className="text-2xl font-bold text-finance-green-primary mb-1">
            {formatAmountCompact(monthlyData.total)}
          </div>
          <div className="text-sm text-finance-green-secondary">This Month</div>
        </div>

        <div className="finance-stat-card animate-slideInRight" style={{animationDelay: '0.3s'}}>
          <TrendingUp className="h-8 w-8 text-finance-gold-primary mb-3 mx-auto" />
          <div className="text-2xl font-bold text-finance-green-primary mb-1">
            {Math.round(percentage)}%
          </div>
          <div className="text-sm text-finance-green-secondary">Budget Progress</div>
        </div>
      </div>

      {/* Recent Expenses Section */}
      <div className="finance-card">
        <div className="p-6 border-b border-finance-green-primary border-opacity-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-finance-green-primary flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Today's Expenses
            </h2>
            <Link href="/diary" className="text-finance-gold-primary hover:text-finance-gold-secondary transition-colors">
              View All
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {expenses.length > 0 ? (
            <div className="space-y-4">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-finance-green-primary">{expense.description}</div>
                    <div className="text-sm text-finance-green-secondary">{expense.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-finance-gold-primary">
                      {formatAmount(expense.amount)}
                    </div>
                    <div className="text-xs text-finance-green-secondary">
                      {expense.createdAt || '12:00'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <PieChart className="h-12 w-12 text-finance-green-secondary mx-auto mb-4 opacity-50" />
              <p className="text-finance-green-secondary">No expenses recorded today</p>
              <p className="text-sm text-finance-green-secondary opacity-75">Add your first expense to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/add" className="finance-btn-primary p-6 text-center">
          <Plus className="h-6 w-6 mx-auto mb-2" />
          <span className="text-lg font-semibold">Add New Expense</span>
        </Link>
        
        <Link href="/progress" className="finance-card p-6 text-center hover:shadow-lg transition-all group">
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-finance-gold-primary group-hover:scale-110 transition-transform" />
          <span className="text-lg font-semibold text-finance-green-primary">View Progress</span>
        </Link>
      </div>
    </div>
  );
};

export default NewFinanceDashboard;