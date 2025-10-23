export interface UserProfile {
  id: string;
  monthlyIncome: number;
  currency: string;
  dailyLimit: number;
  categoryBudgets: CategoryBudget[];
  notificationSettings: NotificationSettings;
  language: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBudget {
  category: string;
  monthlyBudget: number;
  dailyBudget: number;
}

export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: {
    enabled: boolean;
    time: string; // HH:MM format
  };
  limitWarnings: {
    enabled: boolean;
    thresholds: number[]; // [75, 90, 100] percentages
  };
  achievements: {
    enabled: boolean;
  };
}

export interface DailyExpenses {
  date: string; // YYYY-MM-DD
  expenses: string[]; // expense IDs
  totalSpent: number;
  remainingBudget: number;
  budgetStatus: 'under' | 'near' | 'over';
  completedAt?: string;
}

export interface DailyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStreakDate: string;
  streakType: 'under_budget' | 'logged_expenses';
}

export interface Achievement {
  id: string;
  type: 'streak' | 'saving' | 'category' | 'milestone';
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface WeeklyAnalysis {
  weekStart: string; // YYYY-MM-DD
  weekEnd: string;
  totalSpent: number;
  budgetUsed: number;
  dailyAverages: {
    spent: number;
    budget: number;
  };
  streakDays: number;
  topCategories: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

export interface MonthlyAnalysis {
  month: string; // YYYY-MM
  totalSpent: number;
  totalBudget: number;
  budgetUsed: number;
  dailyAverages: {
    spent: number;
    budget: number;
  };
  categoryBreakdown: {
    category: string;
    spent: number;
    budget: number;
    percentage: number;
  }[];
  streakDays: number;
  achievements: Achievement[];
}

export interface DailyProgress {
  date: string;
  spent: number;
  budget: number;
  percentage: number;
  status: 'excellent' | 'good' | 'warning' | 'over';
  transactions: number;
  topCategory?: string;
}

export interface CalendarDay {
  date: string;
  spent: number;
  budget: number;
  status: 'completed' | 'incomplete' | 'over_budget' | 'no_data';
  isToday: boolean;
  isCurrentMonth: boolean;
}

export type ViewMode = 'diary' | 'calendar' | 'weekly' | 'monthly' | 'analytics';

export type NotificationType = 'daily_reminder' | 'limit_warning' | 'achievement' | 'streak';

export interface PushNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  scheduledFor: string;
  sent: boolean;
}