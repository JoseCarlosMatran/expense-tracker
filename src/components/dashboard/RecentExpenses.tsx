'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { Expense } from '@/types/expense';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants/categories';
import { formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface RecentExpensesProps {
  expenses: Expense[];
  limit?: number;
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({
  expenses,
  limit = 5,
}) => {
  const recentExpenses = expenses.slice(0, limit);

  if (recentExpenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Expenses</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <DollarSign className="h-16 w-16 mx-auto" />
          </div>
          <p className="text-gray-500 mb-4">No expenses yet</p>
          <Link href="/add">
            <Button size="sm">Add Your First Expense</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Expenses</h3>
        <Link
          href="/expenses"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          View all
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="space-y-3">
        {recentExpenses.map((expense) => {
          const categoryColor = CATEGORY_COLORS[expense.category];
          const categoryIcon = CATEGORY_ICONS[expense.category];
          
          return (
            <div key={expense.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full text-white text-sm"
                style={{ backgroundColor: categoryColor }}
              >
                {categoryIcon}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {expense.description}
                </p>
                <div className="flex items-center text-xs text-gray-500 space-x-2">
                  <span>{expense.category}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(expense.date, 'MMM dd')}
                  </div>
                </div>
              </div>
              
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentExpenses;