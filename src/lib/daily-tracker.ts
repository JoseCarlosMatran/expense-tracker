import { 
  UserProfile, 
  DailyExpenses, 
  DailyStreak, 
  Achievement, 
  WeeklyAnalysis, 
  MonthlyAnalysis,
  DailyProgress,
  CalendarDay,
  NotificationSettings 
} from '@/types/daily-tracker';
import { Expense } from '@/types/expense';
import { format, startOfDay, endOfDay, isToday, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, parseISO } from 'date-fns';

class DailyTrackerService {
  private readonly STORAGE_KEYS = {
    USER_PROFILE: 'dailyTracker_userProfile',
    DAILY_EXPENSES: 'dailyTracker_dailyExpenses',
    STREAKS: 'dailyTracker_streaks',
    ACHIEVEMENTS: 'dailyTracker_achievements',
  };

  // User Profile Management
  getUserProfile(): UserProfile | null {
    try {
      const profile = localStorage.getItem(this.STORAGE_KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch {
      return null;
    }
  }

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(this.STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  createDefaultProfile(monthlyIncome: number, currency: string, language: string): UserProfile {
    const recommendedDailyLimit = (monthlyIncome * 0.7) / 30; // 70% for expenses, divided by 30 days
    
    return {
      id: crypto.randomUUID(),
      monthlyIncome,
      currency,
      dailyLimit: recommendedDailyLimit,
      categoryBudgets: [],
      language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notificationSettings: {
        enabled: false,
        dailyReminder: {
          enabled: false,
          time: '18:00',
        },
        limitWarnings: {
          enabled: true,
          thresholds: [75, 90, 100],
        },
        achievements: {
          enabled: true,
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Daily Expenses Management
  getDailyExpenses(date: Date): DailyExpenses | null {
    try {
      const dateKey = format(date, 'yyyy-MM-dd');
      const dailyExpenses = localStorage.getItem(`${this.STORAGE_KEYS.DAILY_EXPENSES}_${dateKey}`);
      return dailyExpenses ? JSON.parse(dailyExpenses) : null;
    } catch {
      return null;
    }
  }

  saveDailyExpenses(dailyExpenses: DailyExpenses): void {
    const dateKey = dailyExpenses.date;
    localStorage.setItem(`${this.STORAGE_KEYS.DAILY_EXPENSES}_${dateKey}`, JSON.stringify(dailyExpenses));
  }

  calculateDailyProgress(expenses: Expense[], profile: UserProfile): DailyProgress {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayExpenses = expenses.filter(expense => expense.date === today);
    
    const totalSpent = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = (totalSpent / profile.dailyLimit) * 100;
    
    let status: DailyProgress['status'] = 'excellent';
    if (percentage > 100) status = 'over';
    else if (percentage > 75) status = 'warning';
    else if (percentage > 50) status = 'good';

    const categoryCount = todayExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    return {
      date: today,
      spent: totalSpent,
      budget: profile.dailyLimit,
      percentage,
      status,
      transactions: todayExpenses.length,
      topCategory,
    };
  }

  // Streak Management
  getStreaks(): DailyStreak {
    try {
      const streaks = localStorage.getItem(this.STORAGE_KEYS.STREAKS);
      return streaks ? JSON.parse(streaks) : {
        currentStreak: 0,
        longestStreak: 0,
        lastStreakDate: '',
        streakType: 'under_budget',
      };
    } catch {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastStreakDate: '',
        streakType: 'under_budget',
      };
    }
  }

  updateStreak(expenses: Expense[], profile: UserProfile): DailyStreak {
    const streaks = this.getStreaks();
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    
    const todayExpenses = expenses.filter(exp => exp.date === today);
    const todaySpent = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const isUnderBudget = todaySpent <= profile.dailyLimit;

    if (isUnderBudget) {
      if (streaks.lastStreakDate === yesterday) {
        streaks.currentStreak += 1;
      } else if (streaks.lastStreakDate !== today) {
        streaks.currentStreak = 1;
      }
      
      streaks.lastStreakDate = today;
      streaks.longestStreak = Math.max(streaks.longestStreak, streaks.currentStreak);
    } else if (streaks.lastStreakDate === yesterday || streaks.lastStreakDate === today) {
      streaks.currentStreak = 0;
    }

    localStorage.setItem(this.STORAGE_KEYS.STREAKS, JSON.stringify(streaks));
    return streaks;
  }

  // Calendar View
  generateCalendarDays(year: number, month: number, expenses: Expense[], profile: UserProfile): CalendarDay[] {
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(startDate);
    const days: CalendarDay[] = [];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayExpenses = expenses.filter(exp => exp.date === dateStr);
      const spent = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      let status: CalendarDay['status'] = 'no_data';
      if (dayExpenses.length > 0) {
        if (spent <= profile.dailyLimit) {
          status = 'completed';
        } else {
          status = 'over_budget';
        }
      } else if (!isToday(date) && date < new Date()) {
        status = 'incomplete';
      }

      days.push({
        date: dateStr,
        spent,
        budget: profile.dailyLimit,
        status,
        isToday: isToday(date),
        isCurrentMonth: date.getMonth() === month - 1,
      });
    }

    return days;
  }

  // Weekly Analysis
  generateWeeklyAnalysis(expenses: Expense[], profile: UserProfile, weekStart: Date): WeeklyAnalysis {
    const weekEnd = endOfWeek(weekStart);
    const weekExpenses = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start: weekStart, end: weekEnd });
    });

    const totalSpent = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const weeklyBudget = profile.dailyLimit * 7;

    const dailyTotals = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      const dayStr = format(day, 'yyyy-MM-dd');
      return weekExpenses
        .filter(exp => exp.date === dayStr)
        .reduce((sum, exp) => sum + exp.amount, 0);
    });

    const streakDays = dailyTotals.filter(total => total <= profile.dailyLimit).length;

    const categoryTotals = weekExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalSpent) * 100,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      weekStart: format(weekStart, 'yyyy-MM-dd'),
      weekEnd: format(weekEnd, 'yyyy-MM-dd'),
      totalSpent,
      budgetUsed: (totalSpent / weeklyBudget) * 100,
      dailyAverages: {
        spent: totalSpent / 7,
        budget: profile.dailyLimit,
      },
      streakDays,
      topCategories,
    };
  }

  // Monthly Analysis
  generateMonthlyAnalysis(expenses: Expense[], profile: UserProfile, year: number, month: number): MonthlyAnalysis {
    const monthStart = startOfMonth(new Date(year, month - 1));
    const monthEnd = endOfMonth(monthStart);
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });

    const totalSpent = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const daysInMonth = monthEnd.getDate();
    const monthlyBudget = profile.dailyLimit * daysInMonth;

    const categoryTotals = monthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([category, spent]) => {
        const categoryBudget = profile.categoryBudgets.find(cb => cb.category === category)?.monthlyBudget || 0;
        return {
          category,
          spent,
          budget: categoryBudget,
          percentage: (spent / totalSpent) * 100,
        };
      })
      .sort((a, b) => b.spent - a.spent);

    // Calculate streak days
    const dailyTotals = Array.from({ length: daysInMonth }, (_, i) => {
      const day = new Date(monthStart);
      day.setDate(day.getDate() + i);
      const dayStr = format(day, 'yyyy-MM-dd');
      return monthExpenses
        .filter(exp => exp.date === dayStr)
        .reduce((sum, exp) => sum + exp.amount, 0);
    });

    const streakDays = dailyTotals.filter(total => total <= profile.dailyLimit).length;

    return {
      month: format(monthStart, 'yyyy-MM'),
      totalSpent,
      totalBudget: monthlyBudget,
      budgetUsed: (totalSpent / monthlyBudget) * 100,
      dailyAverages: {
        spent: totalSpent / daysInMonth,
        budget: profile.dailyLimit,
      },
      categoryBreakdown,
      streakDays,
      achievements: [], // TODO: Calculate achievements
    };
  }

  // Achievement System
  checkAchievements(expenses: Expense[], profile: UserProfile, streaks: DailyStreak): Achievement[] {
    const achievements: Achievement[] = [];
    
    // First expense achievement
    if (expenses.length === 1) {
      achievements.push({
        id: 'first-expense',
        type: 'milestone',
        title: 'First Step',
        description: 'You logged your first expense!',
        icon: '🎯',
        progress: 1,
        target: 1,
        unlockedAt: new Date().toISOString(),
      });
    }

    // Streak achievements
    if (streaks.currentStreak >= 7) {
      achievements.push({
        id: 'streak-7',
        type: 'streak',
        title: 'Week Warrior',
        description: '7 days under budget!',
        icon: '🔥',
        progress: streaks.currentStreak,
        target: 7,
        unlockedAt: streaks.currentStreak === 7 ? new Date().toISOString() : undefined,
      });
    }

    if (streaks.currentStreak >= 30) {
      achievements.push({
        id: 'streak-30',
        type: 'streak',
        title: 'Monthly Master',
        description: '30 days under budget!',
        icon: '💎',
        progress: streaks.currentStreak,
        target: 30,
        unlockedAt: streaks.currentStreak === 30 ? new Date().toISOString() : undefined,
      });
    }

    return achievements;
  }
}

export const dailyTrackerService = new DailyTrackerService();