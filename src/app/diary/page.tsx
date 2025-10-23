'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, TrendingUp, Target } from 'lucide-react';
import Link from 'next/link';
import { Expense } from '@/types/expense';
import { UserProfile, CalendarDay } from '@/types/daily-tracker';
import { dailyTrackerService } from '@/lib/daily-tracker';
import { storageService } from '@/lib/storage';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { format, parseISO, startOfMonth, endOfMonth, addMonths, subMonths, isToday } from 'date-fns';

const DiaryPage: React.FC = () => {
  const { t } = useI18n();
  const { formatAmount, formatAmountCompact } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const loadedExpenses = storageService.getExpenses();
      const userProfile = dailyTrackerService.getUserProfile();
      setExpenses(loadedExpenses);
      setProfile(userProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const calendarDays = React.useMemo(() => {
    if (!profile) return [];
    return dailyTrackerService.generateCalendarDays(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      expenses,
      profile
    );
  }, [currentDate, expenses, profile]);

  const selectedDayExpenses = expenses.filter(expense => expense.date === selectedDate);
  const selectedDayTotal = selectedDayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const monthlyStats = React.useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });

    const totalSpent = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const daysInMonth = monthEnd.getDate();
    const monthlyBudget = profile ? profile.dailyLimit * daysInMonth : 0;
    const dailyAverage = totalSpent / daysInMonth;

    return {
      totalSpent,
      monthlyBudget,
      budgetUsed: monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0,
      dailyAverage,
      daysLogged: monthExpenses.length > 0 ? new Set(monthExpenses.map(e => e.date)).size : 0,
      daysInMonth,
    };
  }, [currentDate, expenses, profile]);

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const getDayStatus = (day: CalendarDay): string => {
    switch (day.status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'over_budget': return 'bg-red-100 text-red-800 border-red-300';
      case 'incomplete': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getDayStatusIndicator = (day: CalendarDay): string => {
    if (!day.isCurrentMonth) return '';
    if (day.isToday) return '🎯';
    switch (day.status) {
      case 'completed': return '✅';
      case 'over_budget': return '🚨';
      case 'incomplete': return '⚠️';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-slate-500">Loading diary...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Setup Required</h2>
        <p className="text-slate-600 mb-8">Please complete your profile setup to use the diary.</p>
        <Link href="/onboarding">
          <Button size="lg">Complete Setup</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full" style={{width: '100%', maxWidth: 'none'}}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-green-800 tracking-tight">Daily Diary</h1>
          <p className="mt-2 text-lg text-green-600">
            Track your daily spending progress and budget management
          </p>
        </div>
        
        <Link href="/add">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            {t('dailyTracker.addExpenseToday')}
          </Button>
        </Link>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 w-full" style={{width: '100%'}}>
        <div className="financial-card p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Monthly Spent</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatAmountCompact(monthlyStats.totalSpent)}
          </div>
          <div className="text-sm text-slate-500">
            of {formatAmountCompact(monthlyStats.monthlyBudget)} budget
          </div>
        </div>

        <div className="financial-card p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">Budget Used</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {Math.round(monthlyStats.budgetUsed)}%
          </div>
          <div className={`text-sm ${
            monthlyStats.budgetUsed > 100 
              ? 'text-red-500' 
              : monthlyStats.budgetUsed > 75 
              ? 'text-amber-500' 
              : 'text-emerald-500'
          }`}>
            {monthlyStats.budgetUsed > 100 ? 'Over budget' : 'On track'}
          </div>
        </div>

        <div className="financial-card p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-slate-700">Days Logged</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {monthlyStats.daysLogged}
          </div>
          <div className="text-sm text-slate-500">
            of {monthlyStats.daysInMonth} days
          </div>
        </div>

        <div className="financial-card p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-slate-700">Daily Average</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatAmountCompact(monthlyStats.dailyAverage)}
          </div>
          <div className="text-sm text-slate-500">
            vs {formatAmountCompact(profile.dailyLimit)} limit
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-3">
          <div className="financial-card p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              
              <div className="flex space-x-2">
                <button
                  onClick={handlePreviousMonth}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-600" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-slate-500">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map((day, index) => (
                <button
                  key={`${day.date}-${index}`}
                  onClick={() => setSelectedDate(day.date)}
                  disabled={!day.isCurrentMonth}
                  className={`
                    p-3 text-center text-sm rounded-lg border transition-all duration-200
                    ${day.isCurrentMonth ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-30'}
                    ${selectedDate === day.date ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                    ${getDayStatus(day)}
                  `}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="font-medium">
                      {format(parseISO(day.date), 'd')}
                    </span>
                    <span className="text-xs">
                      {getDayStatusIndicator(day)}
                    </span>
                    {day.spent > 0 && (
                      <span className="text-xs font-bold">
                        {formatAmountCompact(day.spent)}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></div>
                <span>Under Budget</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
                <span>Over Budget</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></div>
                <span>No Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="space-y-4">
          <div className="financial-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {isToday(parseISO(selectedDate)) ? 'Today' : format(parseISO(selectedDate), 'MMM dd, yyyy')}
              </h3>
              {isToday(parseISO(selectedDate)) && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Today
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Total Spent</span>
                <span className="text-lg font-bold text-slate-900">
                  {formatAmount(selectedDayTotal)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Daily Limit</span>
                <span className="text-lg font-bold text-slate-900">
                  {formatAmount(profile.dailyLimit)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">
                  {selectedDayTotal > profile.dailyLimit ? 'Over Budget' : 'Remaining'}
                </span>
                <span className={`text-lg font-bold ${
                  selectedDayTotal > profile.dailyLimit ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  {formatAmount(
                    selectedDayTotal > profile.dailyLimit 
                      ? selectedDayTotal - profile.dailyLimit
                      : profile.dailyLimit - selectedDayTotal
                  )}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Budget Used</span>
                <span className="text-sm font-medium text-slate-900">
                  {Math.round((selectedDayTotal / profile.dailyLimit) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    selectedDayTotal > profile.dailyLimit 
                      ? 'bg-red-500' 
                      : selectedDayTotal / profile.dailyLimit > 0.75
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ 
                    width: `${Math.min((selectedDayTotal / profile.dailyLimit) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Selected Day Expenses */}
          {selectedDayExpenses.length > 0 ? (
            <div className="financial-card p-6">
              <h4 className="font-semibold text-slate-900 mb-4">
                Expenses ({selectedDayExpenses.length})
              </h4>
              
              <div className="space-y-3">
                {selectedDayExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{expense.description}</div>
                      <div className="text-sm text-slate-600">{expense.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">
                        {formatAmount(expense.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="financial-card p-6 text-center">
              <div className="text-slate-400 mb-2">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h4 className="font-medium text-slate-900 mb-2">No Expenses</h4>
              <p className="text-sm text-slate-600 mb-4">
                {isToday(parseISO(selectedDate)) 
                  ? 'No expenses logged today'
                  : 'No expenses logged for this day'
                }
              </p>
              {isToday(parseISO(selectedDate)) && (
                <Link href="/add">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;