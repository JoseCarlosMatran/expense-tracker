'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Wallet, TrendingUp, Calendar, Plus, BarChart3, ArrowUpRight, Target, Brain, Zap } from 'lucide-react';
import SummaryCard from './SummaryCard';
import RecentExpenses from './RecentExpenses';
import TopCategories from './TopCategories';
import FinancialHealthIndicator from '@/components/ai/FinancialHealthIndicator';
import SmartAlerts from '@/components/ai/SmartAlerts';
import SmartRecommendations from '@/components/ai/SmartRecommendations';
import SpendingInsights from '@/components/ai/SpendingInsights';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Expense } from '@/types/expense';
import { storageService } from '@/lib/storage';
import { calculateExpenseSummary } from '@/lib/utils';
import { FinancialAI } from '@/lib/ai-engine';

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedExpenses = storageService.getExpenses();
      setExpenses(loadedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Error loading expenses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const summary = calculateExpenseSummary(expenses);
  
  // AI Analysis
  const aiInsights = useMemo(() => {
    if (expenses.length < 3) return null; // Need minimum data for AI analysis
    const ai = new FinancialAI(expenses);
    return ai.analyzeFinances();
  }, [expenses]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-500">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadExpenses}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Financial Overview</h1>
          <p className="mt-2 text-lg text-slate-600">
            Monitor your expenses and track your financial health
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {aiInsights && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                AI Insights Active
              </span>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            </div>
          )}
          <Link href="/analytics">
            <Button variant="secondary" size="lg">
              <BarChart3 className="h-5 w-5 mr-2" />
              Analytics
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
          <Link href="/add">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              New Transaction
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
        <SummaryCard
          title="Total Balance"
          value={summary.totalExpenses}
          icon={Wallet}
          subtitle="All time expenses"
          variant="primary"
          trend={{ value: 12.5, isPositive: false }}
        />
        <SummaryCard
          title="Monthly Spending"
          value={summary.monthlyTotal}
          icon={Calendar}
          subtitle="Current month"
          variant="success"
          trend={{ value: 8.2, isPositive: true }}
        />
        <SummaryCard
          title="Daily Average"
          value={summary.monthlyTotal / new Date().getDate()}
          icon={TrendingUp}
          subtitle="This month average"
          variant="warning"
        />
        <SummaryCard
          title="Budget Goal"
          value={summary.monthlyTotal * 0.85}
          icon={Target}
          subtitle="85% of monthly"
          variant="accent"
          trend={{ value: 15.3, isPositive: true }}
        />
      </div>

      {expenses.length === 0 ? (
        <div className="financial-card p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl financial-accent-gradient flex items-center justify-center">
            <Wallet className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            Welcome to FinanceTracker Pro
          </h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg">
            Start tracking your expenses to gain valuable insights into your spending patterns and financial health.
          </p>
          <Link href="/add">
            <Button size="xl">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Transaction
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* AI-Powered Section */}
          {aiInsights && (
            <div className="space-y-6 mb-8">
              {/* AI Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">AI Financial Intelligence</h2>
                  <p className="text-slate-600">Personalized insights and recommendations powered by advanced algorithms</p>
                </div>
              </div>

              {/* AI Insights Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                <FinancialHealthIndicator 
                  score={aiInsights.healthScore} 
                  className="xl:col-span-1"
                />
                <SmartAlerts 
                  alerts={aiInsights.alerts} 
                  className="xl:col-span-1"
                />
                <SmartRecommendations 
                  recommendations={aiInsights.recommendations.slice(0, 3)} 
                  className="xl:col-span-1"
                />
              </div>

              {/* Detailed Insights */}
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                <SpendingInsights 
                  patterns={aiInsights.patterns}
                  trends={aiInsights.trends}
                />
                <div className="space-y-6">
                  <RecentExpenses expenses={expenses.slice(0, 5)} />
                  <TopCategories summary={summary} />
                </div>
              </div>
            </div>
          )}

          {/* Traditional Dashboard for users without enough data */}
          {!aiInsights && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3">
                <RecentExpenses expenses={expenses} />
              </div>
              <div className="xl:col-span-1">
                <TopCategories summary={summary} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;