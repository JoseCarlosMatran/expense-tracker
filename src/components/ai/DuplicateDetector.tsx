import React, { useState } from 'react';
import { Copy, Trash2, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { DuplicateExpense } from '@/types/ai';
import { Expense } from '@/types/expense';
import { useCurrency } from '@/contexts/CurrencyContext';
import { storageService } from '@/lib/storage';
import Button from '@/components/ui/Button';
import { format, parseISO } from 'date-fns';

interface DuplicateDetectorProps {
  duplicates: DuplicateExpense[];
  expenses: Expense[];
  className?: string;
  onExpensesUpdate?: () => void;
}

const DuplicateDetector: React.FC<DuplicateDetectorProps> = ({
  duplicates,
  expenses,
  className = '',
  onExpensesUpdate
}) => {
  const { formatAmount } = useCurrency();
  const [resolvedDuplicates, setResolvedDuplicates] = useState<Set<string>>(new Set());
  const [showDetails, setShowDetails] = useState<Set<string>>(new Set());

  const getExpenseById = (id: string): Expense | undefined => {
    return expenses.find(exp => exp.id === id);
  };

  const handleRemoveDuplicates = (duplicateGroup: DuplicateExpense) => {
    // Remove duplicate expenses, keep the original
    duplicateGroup.duplicates.forEach(duplicateId => {
      storageService.deleteExpense(duplicateId);
    });
    
    setResolvedDuplicates(prev => new Set([...prev, duplicateGroup.original]));
    onExpensesUpdate?.();
  };

  const handleKeepAll = (duplicateGroup: DuplicateExpense) => {
    // Mark as resolved but don't delete anything
    setResolvedDuplicates(prev => new Set([...prev, duplicateGroup.original]));
  };

  const toggleDetails = (id: string) => {
    const newDetails = new Set(showDetails);
    if (newDetails.has(id)) {
      newDetails.delete(id);
    } else {
      newDetails.add(id);
    }
    setShowDetails(newDetails);
  };

  const activeDuplicates = duplicates.filter(dup => !resolvedDuplicates.has(dup.original));

  if (duplicates.length === 0) {
    return (
      <div className={`financial-card p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
            <Check className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Duplicate Detection</h3>
            <p className="text-sm text-slate-600">AI-powered duplicate expense detection</p>
          </div>
        </div>
        <div className="text-center py-8">
          <Check className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-slate-600">No duplicate expenses detected</p>
          <p className="text-sm text-slate-500 mt-1">Your expenses are clean and organized</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`financial-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
            <Copy className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Duplicate Detection</h3>
            <p className="text-sm text-slate-600">AI-identified potential duplicates</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-600">{activeDuplicates.length}</div>
          <div className="text-sm text-slate-500">groups found</div>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activeDuplicates.map((duplicateGroup) => {
          const originalExpense = getExpenseById(duplicateGroup.original);
          const duplicateExpenses = duplicateGroup.duplicates
            .map(id => getExpenseById(id))
            .filter(Boolean) as Expense[];
          
          if (!originalExpense) return null;

          const isDetailsVisible = showDetails.has(duplicateGroup.original);
          const totalDuplicateAmount = duplicateExpenses.reduce((sum, exp) => sum + exp.amount, 0);

          return (
            <div key={duplicateGroup.original} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <h4 className="font-medium text-slate-900">Potential Duplicates Found</h4>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                      {duplicateGroup.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{duplicateGroup.reason}</p>
                  
                  {/* Original Expense */}
                  <div className="bg-white border border-slate-200 rounded-lg p-3 mb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">{originalExpense.description}</div>
                        <div className="text-sm text-slate-600">
                          {originalExpense.category} • {format(parseISO(originalExpense.date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-slate-900">
                        {formatAmount(originalExpense.amount)}
                      </div>
                    </div>
                    <div className="mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full inline-block">
                      Original (Keep)
                    </div>
                  </div>

                  {/* Duplicate Expenses - Summary */}
                  <div className="text-sm text-slate-600 mb-3">
                    <strong>{duplicateExpenses.length}</strong> potential duplicate(s) found
                    {totalDuplicateAmount > 0 && (
                      <span className="ml-2">
                        • Total: <strong>{formatAmount(totalDuplicateAmount)}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleDetails(duplicateGroup.original)}
                  className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  {isDetailsVisible ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span>Hide Details</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>Show Details</span>
                    </>
                  )}
                </button>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleKeepAll(duplicateGroup)}
                  >
                    Keep All
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveDuplicates(duplicateGroup)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove Duplicates
                  </Button>
                </div>
              </div>

              {/* Detailed View */}
              {isDetailsVisible && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                  {duplicateExpenses.map((expense, index) => (
                    <div key={expense.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900">{expense.description}</div>
                          <div className="text-sm text-slate-600">
                            {expense.category} • {format(parseISO(expense.date), 'MMM dd, yyyy')}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          {formatAmount(expense.amount)}
                        </div>
                      </div>
                      <div className="mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full inline-block">
                        Duplicate #{index + 1} (Will be removed)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {resolvedDuplicates.size > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-600">
          <p>✓ {resolvedDuplicates.size} duplicate group(s) resolved</p>
        </div>
      )}
    </div>
  );
};

export default DuplicateDetector;