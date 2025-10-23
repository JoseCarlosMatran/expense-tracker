'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Search, Plus, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { Expense, ExpenseForm as ExpenseFormType, ExpenseFormErrors, ExpenseCategory } from '@/types/expense';
import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { storageService } from '@/lib/storage';
import { generateId, formatCurrency } from '@/lib/utils';

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit?: (expense: Expense) => void;
  onCancel?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ExpenseFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  const [formData, setFormData] = useState<ExpenseFormType>({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    amount: initialData?.amount?.toString() || '',
    category: initialData?.category || 'Food',
    description: initialData?.description || '',
  });

  // Common expense templates for quick entry
  const commonExpenses = [
    { description: 'Coffee', category: 'Food', suggestedAmount: 5.00 },
    { description: 'Lunch', category: 'Food', suggestedAmount: 12.00 },
    { description: 'Gas', category: 'Transportation', suggestedAmount: 30.00 },
    { description: 'Grocery Shopping', category: 'Food', suggestedAmount: 50.00 },
    { description: 'Dinner', category: 'Food', suggestedAmount: 15.00 },
    { description: 'Uber', category: 'Transportation', suggestedAmount: 20.00 },
    { description: 'Movie Tickets', category: 'Entertainment', suggestedAmount: 25.00 },
  ];

  // Filter common expenses based on search
  const filteredExpenses = useMemo(() => {
    if (!searchQuery) return commonExpenses.slice(0, 5);
    return commonExpenses.filter(expense => 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const validateForm = (): boolean => {
    const newErrors: ExpenseFormErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      }
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      const expense: Expense = {
        id: initialData?.id || generateId(),
        date: formData.date,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (initialData) {
        storageService.updateExpense(initialData.id, expense);
      } else {
        storageService.addExpense(expense);
      }

      if (onSubmit) {
        onSubmit(expense);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      setSubmitError('Failed to save expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ExpenseFormType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof ExpenseFormErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof ExpenseFormErrors]: undefined }));
    }
  };

  const handleQuickAdd = (expense: typeof commonExpenses[0]) => {
    setFormData({
      ...formData,
      description: expense.description,
      category: expense.category as ExpenseCategory,
      amount: expense.suggestedAmount.toString(),
    });
    setSearchQuery('');
    setShowQuickAdd(false);
  };

  const categoryOptions = EXPENSE_CATEGORIES.map(category => ({
    value: category,
    label: category,
  }));

  return (
    <div className="w-full max-w-2xl mx-auto" style={{maxWidth: '640px'}}>
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 p-4 mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          {initialData ? 'Edit Expense' : 'Add Expense'}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {new Date(formData.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {submitError && (
        <ErrorMessage
          message={submitError}
          onRetry={() => setSubmitError(null)}
        />
      )}

      {/* Smart Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses, categories..."
              className="w-full pl-10 pr-4 py-3 text-base border-0 focus:outline-none focus:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Add Suggestions */}
        {(searchQuery || !formData.description) && (
          <div className="border-b border-gray-100">
            <div className="p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Common Expenses</h3>
              <div className="space-y-2">
                {filteredExpenses.map((expense, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleQuickAdd(expense)}
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Tag className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{expense.description}</div>
                        <div className="text-sm text-gray-500">{expense.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(expense.suggestedAmount)}
                      </div>
                      <div className="text-xs text-gray-500">suggested</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Form */}
      <div className="bg-white rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
          {/* Date Field */}
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  label="Date"
                  variant="floating"
                  icon={Calendar}
                  error={errors.date}
                />
              </div>
            </div>
          </div>

          {/* Amount Field */}
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  label="Amount"
                  variant="floating"
                  icon={DollarSign}
                  error={errors.amount}
                />
              </div>
            </div>
          </div>

          {/* Category Field */}
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Tag className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <Select
                  value={formData.category}
                  onChange={(value) => handleInputChange('category', value as ExpenseCategory)}
                  label="Category"
                  variant="floating"
                  icon={Tag}
                  error={errors.category}
                  searchable
                  options={categoryOptions.map(option => ({
                    ...option,
                    icon: Tag,
                    description: `Select ${option.label.toLowerCase()}`
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Description Field */}
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter expense description..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  label="Description"
                  variant="floating"
                  icon={FileText}
                  error={errors.description}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading || !formData.amount || !formData.description.trim()}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
          {isLoading ? 'Adding...' : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              {initialData ? 'Update Expense' : 'Add Expense'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExpenseForm;