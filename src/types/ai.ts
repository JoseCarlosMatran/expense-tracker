import { ExpenseCategory } from './expense';

export interface ExpensePattern {
  category: ExpenseCategory;
  averageAmount: number;
  frequency: number; // expenses per month
  trend: 'increasing' | 'decreasing' | 'stable';
  variance: number; // how much amounts vary
  lastOccurrence: string;
}

export interface SpendingTrend {
  month: string;
  total: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  growthRate: number; // percentage change from previous month
}

export interface FinancialAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  category: ExpenseCategory | 'general';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  type: 'budget' | 'savings' | 'pattern' | 'optimization';
  category: ExpenseCategory | 'general';
  title: string;
  description: string;
  potentialSavings: number;
  confidence: number; // 0-100
  priority: 'low' | 'medium' | 'high';
  actionSteps: string[];
}

export interface FinancialInsight {
  totalInsights: number;
  healthScore: number; // 0-100
  patterns: ExpensePattern[];
  trends: SpendingTrend[];
  alerts: FinancialAlert[];
  recommendations: Recommendation[];
  duplicates: DuplicateExpense[];
  projections: MonthlyProjection[];
}

export interface DuplicateExpense {
  original: string; // expense ID
  duplicates: string[]; // array of duplicate expense IDs
  confidence: number; // 0-100
  reason: string;
}

export interface MonthlyProjection {
  month: string;
  projectedTotal: number;
  categoryProjections: Record<ExpenseCategory, number>;
  confidence: number;
  basedOnMonths: number;
}

export interface CategoryAnalysis {
  category: ExpenseCategory;
  monthlyAverage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  volatility: 'low' | 'medium' | 'high';
  seasonality: boolean;
  peakMonth?: string;
  recommendations: string[];
}