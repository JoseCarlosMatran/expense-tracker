'use client';

import React from 'react';
import { X } from 'lucide-react';
import ExpenseForm from '@/components/forms/ExpenseForm';
import { Expense } from '@/types/expense';

interface EditExpenseModalProps {
  expense: Expense;
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  expense,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const handleSave = (updatedExpense: Expense) => {
    onSave(updatedExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Edit Expense
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          
          <div className="p-6">
            <ExpenseForm
              initialData={expense}
              onSubmit={handleSave}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExpenseModal;