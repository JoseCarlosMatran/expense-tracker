'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Search, Calendar, DollarSign, Tag, X, RotateCcw } from 'lucide-react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { EXPENSE_CATEGORIES } from '@/constants/categories';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';

export interface FilterCriteria {
  search: string;
  categories: ExpenseCategory[];
  dateFrom: string;
  dateTo: string;
  amountMin: number | null;
  amountMax: number | null;
  sortBy: 'date' | 'amount' | 'category' | 'description';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  expenses: Expense[];
  onFilterChange: (filteredExpenses: Expense[], criteria: FilterCriteria) => void;
  initialFilters?: Partial<FilterCriteria>;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  expenses,
  onFilterChange,
  initialFilters = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria>({
    search: '',
    categories: [],
    dateFrom: '',
    dateTo: '',
    amountMin: null,
    amountMax: null,
    sortBy: 'date',
    sortOrder: 'desc',
    ...initialFilters,
  });

  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    applyFilters();
  }, [filters, expenses]);

  useEffect(() => {
    if (filters.search.length > 1) {
      generateSearchSuggestions();
    } else {
      setSearchSuggestions([]);
    }
  }, [filters.search, expenses]);

  const generateSearchSuggestions = () => {
    const query = filters.search.toLowerCase();
    const suggestions = new Set<string>();

    expenses.forEach(expense => {
      if (expense.description.toLowerCase().includes(query)) {
        suggestions.add(expense.description);
      }
      if (expense.category.toLowerCase().includes(query)) {
        suggestions.add(expense.category);
      }
    });

    setSearchSuggestions(Array.from(suggestions).slice(0, 5));
  };

  const applyFilters = () => {
    const filteredExpenses = expenses.filter(expense => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (
          !expense.description.toLowerCase().includes(searchTerm) &&
          !expense.category.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      // Category filter
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(expense.category as ExpenseCategory)) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const expenseDate = new Date(expense.date);
        
        if (filters.dateFrom && expenseDate < new Date(filters.dateFrom)) {
          return false;
        }
        
        if (filters.dateTo && expenseDate > new Date(filters.dateTo)) {
          return false;
        }
      }

      // Amount range filter
      if (filters.amountMin !== null && expense.amount < filters.amountMin) {
        return false;
      }
      
      if (filters.amountMax !== null && expense.amount > filters.amountMax) {
        return false;
      }

      return true;
    });

    // Apply sorting
    filteredExpenses.sort((a, b) => {
      let aValue: number | Date | string;
      let bValue: number | Date | string;

      switch (filters.sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    onFilterChange(filteredExpenses, filters);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      categories: [],
      dateFrom: '',
      dateTo: '',
      amountMin: null,
      amountMax: null,
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const toggleCategory = (category: ExpenseCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const activeFiltersCount = 
    (filters.search ? 1 : 0) +
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0) +
    (filters.amountMin !== null || filters.amountMax !== null ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Search Suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setFilters(prev => ({...prev, search: suggestion}))}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {isOpen && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Categories Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Tag className="h-4 w-4 inline mr-2" />
                Categories
              </label>
              <div className="space-y-2">
                {EXPENSE_CATEGORIES.map(category => (
                  <Checkbox
                    key={category}
                    checked={filters.categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    label={category}
                    variant="modern"
                    size="sm"
                    icon={Tag}
                  />
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Calendar className="h-4 w-4 inline mr-2" />
                Date Range
              </label>
              <div className="space-y-3">
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({...prev, dateFrom: e.target.value}))}
                  label="From"
                  variant="floating"
                  size="sm"
                  icon={Calendar}
                />
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({...prev, dateTo: e.target.value}))}
                  label="To"
                  variant="floating"
                  size="sm"
                  icon={Calendar}
                />
              </div>
            </div>

            {/* Amount Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <DollarSign className="h-4 w-4 inline mr-2" />
                Amount Range
              </label>
              <div className="space-y-3">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={filters.amountMin?.toString() || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev, 
                    amountMin: e.target.value ? parseFloat(e.target.value) : null
                  }))}
                  label="Min Amount"
                  variant="floating"
                  size="sm"
                  icon={DollarSign}
                />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="1000.00"
                  value={filters.amountMax?.toString() || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev, 
                    amountMax: e.target.value ? parseFloat(e.target.value) : null
                  }))}
                  label="Max Amount"
                  variant="floating"
                  size="sm"
                  icon={DollarSign}
                />
              </div>
            </div>
          </div>

          {/* Sorting Options */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sort Options
            </label>
            <div className="flex flex-wrap gap-4">
              <Select
                value={filters.sortBy}
                onChange={(value) => setFilters(prev => ({...prev, sortBy: value as 'date' | 'amount' | 'category' | 'description'}))}
                label="Sort By"
                variant="floating"
                size="sm"
                options={[
                  { value: "date", label: "Date", icon: Calendar },
                  { value: "amount", label: "Amount", icon: DollarSign },
                  { value: "category", label: "Category", icon: Tag },
                  { value: "description", label: "Description", icon: Search }
                ]}
              />
              
              <Select
                value={filters.sortOrder}
                onChange={(value) => setFilters(prev => ({...prev, sortOrder: value as 'asc' | 'desc'}))}
                label="Order"
                variant="floating"
                size="sm"
                options={[
                  { value: "desc", label: "Newest First", description: "Most recent first" },
                  { value: "asc", label: "Oldest First", description: "Oldest first" }
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;