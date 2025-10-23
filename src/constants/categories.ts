import { ExpenseCategory } from '@/types/expense';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other'
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#059669',      // Emerald 600 - Financial Green
  Transportation: '#0ea5e9', // Sky 500 - Financial Blue  
  Entertainment: '#7c3aed', // Violet 600 - Professional Purple
  Shopping: '#d97706',   // Amber 600 - Warning Orange
  Bills: '#dc2626',      // Red 600 - Danger Red
  Other: '#475569'       // Slate 600 - Professional Gray
};

export const CATEGORY_GRADIENTS: Record<ExpenseCategory, string> = {
  Food: 'from-emerald-500 to-emerald-600',
  Transportation: 'from-sky-500 to-blue-600',
  Entertainment: 'from-violet-500 to-purple-600',
  Shopping: 'from-amber-500 to-orange-600',
  Bills: 'from-red-500 to-red-600',
  Other: 'from-slate-500 to-slate-600'
};

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  Food: '🍽️',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '💰',
  Other: '📊'
};