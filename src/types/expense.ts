export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory = 
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export interface ExpenseForm {
  date: string;
  amount: string;
  category: ExpenseCategory;
  description: string;
}

export interface ExpenseFormErrors {
  date?: string;
  amount?: string;
  category?: string;
  description?: string;
}

export interface ExpenseFilters {
  dateFrom?: string;
  dateTo?: string;
  category?: ExpenseCategory | 'All';
  search?: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  monthlyTotal: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  topCategories: Array<{
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }>;
}