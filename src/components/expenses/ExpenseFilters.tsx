'use client';

import React from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Search, Filter } from 'lucide-react';
import { ExpenseFilters as ExpenseFiltersType, ExpenseCategory } from '@/types/expense';
import { EXPENSE_CATEGORIES } from '@/constants/categories';

interface ExpenseFiltersProps {
  filters: ExpenseFiltersType;
  onFiltersChange: (filters: ExpenseFiltersType) => void;
  onReset: () => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const handleFilterChange = (key: keyof ExpenseFiltersType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    ...EXPENSE_CATEGORIES.map(category => ({
      value: category,
      label: category,
    })),
  ];

  const hasActiveFilters = !!(
    filters.dateFrom ||
    filters.dateTo ||
    (filters.category && filters.category !== 'All') ||
    filters.search
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Input
            label="Search"
            type="text"
            placeholder="Search expenses..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-8 h-4 w-4 text-gray-400" />
        </div>

        <Input
          label="From Date"
          type="date"
          value={filters.dateFrom || ''}
          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
        />

        <Input
          label="To Date"
          type="date"
          value={filters.dateTo || ''}
          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={filters.category || 'All'}
          onChange={(e) => handleFilterChange('category', e.target.value as ExpenseCategory | 'All')}
        />
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExpenseFilters;