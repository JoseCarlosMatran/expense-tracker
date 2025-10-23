'use client';

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Calendar, Tag, BarChart3, X } from 'lucide-react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { ExportService, ExportOptions } from '@/lib/exportUtils';
import Button from '@/components/ui/Button';

interface ExportDialogProps {
  expenses: Expense[];
  isOpen: boolean;
  onClose: () => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ expenses, isOpen, onClose }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeCharts: false,
    includeStats: true,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([]);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const options: ExportOptions = {
        ...exportOptions,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      };
      
      await ExportService.exportWithOptions(expenses, options);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const toggleCategory = (category: ExpenseCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getFilteredExpensesCount = () => {
    let filtered = expenses;
    
    if (exportOptions.dateRange) {
      const fromDate = new Date(exportOptions.dateRange.from);
      const toDate = new Date(exportOptions.dateRange.to);
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= fromDate && expenseDate <= toDate;
      });
    }
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(expense => 
        selectedCategories.includes(expense.category as ExpenseCategory)
      );
    }
    
    return filtered.length;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Download className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Export Expenses</h2>
              <p className="text-sm text-gray-600">
                Export {getFilteredExpensesCount()} of {expenses.length} expenses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setExportOptions(prev => ({...prev, format: 'csv'}))}
                className={`p-4 border rounded-lg text-center transition-all ${
                  exportOptions.format === 'csv' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileText className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="font-medium">CSV</div>
                <div className="text-xs text-gray-500">Comma separated</div>
              </button>
              
              <button
                onClick={() => setExportOptions(prev => ({...prev, format: 'excel'}))}
                className={`p-4 border rounded-lg text-center transition-all ${
                  exportOptions.format === 'excel' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileSpreadsheet className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="font-medium">Excel</div>
                <div className="text-xs text-gray-500">Spreadsheet format</div>
              </button>
              
              <button
                onClick={() => setExportOptions(prev => ({...prev, format: 'pdf'}))}
                className={`p-4 border rounded-lg text-center transition-all ${
                  exportOptions.format === 'pdf' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileText className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <div className="font-medium">PDF</div>
                <div className="text-xs text-gray-500">Print-ready report</div>
              </button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar className="h-4 w-4 inline mr-2" />
              Date Range (Optional)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={exportOptions.dateRange?.from || ''}
                  onChange={(e) => setExportOptions(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, from: e.target.value, to: prev.dateRange?.to || '' }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={exportOptions.dateRange?.to || ''}
                  onChange={(e) => setExportOptions(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, to: e.target.value, from: prev.dateRange?.from || '' }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Tag className="h-4 w-4 inline mr-2" />
              Categories (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {EXPENSE_CATEGORIES.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900">{category}</span>
                </label>
              ))}
            </div>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => setSelectedCategories([...EXPENSE_CATEGORIES])}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedCategories([])}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Options
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeStats}
                  onChange={(e) => setExportOptions(prev => ({...prev, includeStats: e.target.checked}))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Include Statistics</div>
                  <div className="text-xs text-gray-500">Category breakdown, totals, averages</div>
                </div>
              </label>
              
              {(exportOptions.format === 'pdf' || exportOptions.format === 'excel') && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeCharts}
                    onChange={(e) => setExportOptions(prev => ({...prev, includeCharts: e.target.checked}))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Include Charts</div>
                    <div className="text-xs text-gray-500">Visual charts and graphs (PDF/Excel only)</div>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Preview Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Export Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Format: <span className="font-medium">{exportOptions.format.toUpperCase()}</span></div>
              <div>Transactions: <span className="font-medium">{getFilteredExpensesCount()}</span></div>
              {exportOptions.dateRange?.from && (
                <div>Date Range: <span className="font-medium">
                  {exportOptions.dateRange.from} to {exportOptions.dateRange.to || 'today'}
                </span></div>
              )}
              {selectedCategories.length > 0 && (
                <div>Categories: <span className="font-medium">
                  {selectedCategories.length} selected
                </span></div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export {exportOptions.format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;