'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Expense } from '@/types/expense';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants/categories';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({
  expense,
  onEdit,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setIsDeleting(true);
      try {
        onDelete(expense.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const categoryColor = CATEGORY_COLORS[expense.category];
  const categoryIcon = CATEGORY_ICONS[expense.category];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full text-white text-lg font-medium"
            style={{ backgroundColor: categoryColor }}
          >
            {categoryIcon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {expense.description}
              </h3>
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: categoryColor }}
              >
                {expense.category}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(expense.date)}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(expense)}
            className="p-2"
          >
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit expense</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete expense</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;