import { Expense } from '@/types/expense';

const EXPENSES_KEY = 'expense-tracker-expenses';

export const storageService = {
  getExpenses: (): Expense[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(EXPENSES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading expenses from storage:', error);
      return [];
    }
  },

  saveExpenses: (expenses: Expense[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses to storage:', error);
    }
  },

  addExpense: (expense: Expense): Expense[] => {
    const expenses = storageService.getExpenses();
    const newExpenses = [...expenses, expense];
    storageService.saveExpenses(newExpenses);
    return newExpenses;
  },

  updateExpense: (id: string, updatedExpense: Partial<Expense>): Expense[] => {
    const expenses = storageService.getExpenses();
    const newExpenses = expenses.map(expense =>
      expense.id === id
        ? { ...expense, ...updatedExpense, updatedAt: new Date().toISOString() }
        : expense
    );
    storageService.saveExpenses(newExpenses);
    return newExpenses;
  },

  deleteExpense: (id: string): Expense[] => {
    const expenses = storageService.getExpenses();
    const newExpenses = expenses.filter(expense => expense.id !== id);
    storageService.saveExpenses(newExpenses);
    return newExpenses;
  },

  clearAllExpenses: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(EXPENSES_KEY);
  }
};