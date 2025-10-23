'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { parseISO, isWithinInterval } from 'date-fns';
import ExpenseFilters from './ExpenseFilters';
import ExpenseItem from './ExpenseItem';
import EditExpenseModal from '@/components/modals/EditExpenseModal';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Download, Plus } from 'lucide-react';
import { Expense, ExpenseFilters as ExpenseFiltersType } from '@/types/expense';
import { storageService } from '@/lib/storage';
import { exportToCSV, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface ExpenseListProps {
  onEditExpense?: (expense: Expense) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ onEditExpense }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFiltersType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
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
      setError('Failed to load expenses. Please try again.');
      console.error('Error loading expenses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (
          !expense.description.toLowerCase().includes(searchTerm) &&
          !expense.category.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      if (filters.category && filters.category !== 'All') {
        if (expense.category !== filters.category) {
          return false;
        }
      }

      if (filters.dateFrom || filters.dateTo) {
        const expenseDate = parseISO(expense.date);
        
        if (filters.dateFrom && filters.dateTo) {
          const fromDate = parseISO(filters.dateFrom);
          const toDate = parseISO(filters.dateTo);
          if (!isWithinInterval(expenseDate, { start: fromDate, end: toDate })) {
            return false;
          }
        } else if (filters.dateFrom) {
          const fromDate = parseISO(filters.dateFrom);
          if (expenseDate < fromDate) {
            return false;
          }
        } else if (filters.dateTo) {
          const toDate = parseISO(filters.dateTo);
          if (expenseDate > toDate) {
            return false;
          }
        }
      }

      return true;
    });
  }, [expenses, filters]);

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleDelete = (id: string) => {
    storageService.deleteExpense(id);
    loadExpenses();
  };

  const handleEdit = (expense: Expense) => {
    if (onEditExpense) {
      onEditExpense(expense);
    } else {
      setEditingExpense(expense);
    }
  };

  const handleSaveEdit = (updatedExpense: Expense) => {
    storageService.updateExpense(updatedExpense.id, updatedExpense);
    loadExpenses();
  };

  const handleExport = () => {
    exportToCSV(filteredExpenses);
  };

  const resetFilters = () => {
    setFilters({});
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-500">Loading expenses...</span>
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
    <div className="w-full" style={{width: '100%', maxWidth: 'none'}}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={filteredExpenses.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Link href="/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </Link>
        </div>
      </div>

      <ExpenseFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </span>
          <span className="text-lg font-semibold text-gray-900">
            Total: {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Plus className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No expenses found
          </h3>
          <p className="text-gray-500 mb-6">
            {expenses.length === 0
              ? "Get started by adding your first expense."
              : "Try adjusting your filters to see more results."}
          </p>
          <Link href="/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Expense
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <EditExpenseModal
        expense={editingExpense!}
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default ExpenseList;