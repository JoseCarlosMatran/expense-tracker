import { Expense, ExpenseCategory } from '@/types/expense';
import { 
  FinancialInsight, 
  ExpensePattern, 
  SpendingTrend, 
  FinancialAlert, 
  Recommendation,
  DuplicateExpense,
  MonthlyProjection
} from '@/types/ai';
import { parseISO, format, differenceInDays } from 'date-fns';

export class FinancialAI {
  private expenses: Expense[];

  constructor(expenses: Expense[]) {
    this.expenses = expenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Main analysis function
  analyzeFinances(): FinancialInsight {
    const patterns = this.analyzeSpendingPatterns();
    const trends = this.calculateSpendingTrends();
    const alerts = this.generateAlerts();
    const recommendations = this.generateRecommendations();
    const duplicates = this.detectDuplicateExpenses();
    const projections = this.generateProjections();
    const healthScore = this.calculateHealthScore();

    return {
      totalInsights: alerts.length + recommendations.length,
      healthScore,
      patterns,
      trends,
      alerts,
      recommendations,
      duplicates,
      projections
    };
  }

  // 1. ANÁLISIS DE PATRONES DE GASTOS
  private analyzeSpendingPatterns(): ExpensePattern[] {
    const categoryGroups = this.groupByCategory();
    const patterns: ExpensePattern[] = [];

    Object.entries(categoryGroups).forEach(([category, expenses]) => {
      if (expenses.length === 0) return;

      const amounts = expenses.map(e => e.amount);
      const averageAmount = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
      
      // Calculate monthly frequency
      const monthsSpan = this.getMonthsSpan();
      const frequency = monthsSpan > 0 ? expenses.length / monthsSpan : 0;
      
      // Calculate trend
      const trend = this.calculateCategoryTrend(expenses);
      
      // Calculate variance (standard deviation)
      const variance = this.calculateVariance(amounts, averageAmount);
      
      patterns.push({
        category: category as ExpenseCategory,
        averageAmount,
        frequency,
        trend,
        variance,
        lastOccurrence: expenses[expenses.length - 1].date
      });
    });

    return patterns.sort((a, b) => b.averageAmount - a.averageAmount);
  }

  private calculateSpendingTrends(): SpendingTrend[] {
    const monthlyData = this.groupByMonth();
    const trends: SpendingTrend[] = [];
    const monthKeys = Object.keys(monthlyData).sort();

    monthKeys.forEach((month, index) => {
      const monthExpenses = monthlyData[month];
      const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      const categoryBreakdown: Record<ExpenseCategory, number> = {
        Food: 0,
        Transportation: 0,
        Entertainment: 0,
        Shopping: 0,
        Bills: 0,
        Other: 0
      };

      monthExpenses.forEach(expense => {
        categoryBreakdown[expense.category] += expense.amount;
      });

      let growthRate = 0;
      if (index > 0) {
        const previousMonth = monthKeys[index - 1];
        const previousTotal = monthlyData[previousMonth].reduce((sum, exp) => sum + exp.amount, 0);
        growthRate = previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : 0;
      }

      trends.push({
        month,
        total,
        categoryBreakdown,
        growthRate
      });
    });

    return trends;
  }

  // 2. SISTEMA DE ALERTAS
  private generateAlerts(): FinancialAlert[] {
    const alerts: FinancialAlert[] = [];
    const currentMonth = format(new Date(), 'yyyy-MM');
    const currentExpenses = this.getExpensesForMonth(currentMonth);
    const currentTotal = currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Alert for high monthly spending
    const monthlyAverage = this.calculateMonthlyAverage();
    if (currentTotal > monthlyAverage * 1.3) {
      alerts.push({
        id: `high-spending-${currentMonth}`,
        type: 'warning',
        category: 'general',
        title: 'Elevated Spending Alert',
        message: `This month's spending is 30% higher than your average. Consider reviewing your expenses.`,
        severity: 'high',
        actionable: true,
        createdAt: new Date().toISOString()
      });
    }

    // Category-specific alerts
    const patterns = this.analyzeSpendingPatterns();
    patterns.forEach(pattern => {
      const currentCategoryExpenses = currentExpenses.filter(e => e.category === pattern.category);
      const currentCategoryTotal = currentCategoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      if (currentCategoryTotal > pattern.averageAmount * 1.5) {
        alerts.push({
          id: `category-spike-${pattern.category}`,
          type: 'warning',
          category: pattern.category,
          title: `${pattern.category} Spending Spike`,
          message: `Your ${pattern.category.toLowerCase()} spending is significantly higher this month.`,
          severity: 'medium',
          actionable: true,
          createdAt: new Date().toISOString()
        });
      }
    });

    // Unusual frequency alerts
    patterns.forEach(pattern => {
      if (pattern.trend === 'increasing' && pattern.variance > pattern.averageAmount * 0.5) {
        alerts.push({
          id: `volatility-${pattern.category}`,
          type: 'info',
          category: pattern.category,
          title: 'Inconsistent Spending Pattern',
          message: `Your ${pattern.category.toLowerCase()} expenses vary significantly. Consider setting a budget.`,
          severity: 'low',
          actionable: true,
          createdAt: new Date().toISOString()
        });
      }
    });

    return alerts;
  }

  // 3. SISTEMA DE RECOMENDACIONES
  private generateRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const patterns = this.analyzeSpendingPatterns();
    const trends = this.calculateSpendingTrends();
    
    // Budget recommendations
    patterns.forEach(pattern => {
      if (pattern.averageAmount > 500 && pattern.trend === 'increasing') {
        const potentialSavings = pattern.averageAmount * 0.15; // 15% potential savings
        
        recommendations.push({
          id: `budget-${pattern.category}`,
          type: 'budget',
          category: pattern.category,
          title: `Optimize ${pattern.category} Spending`,
          description: `You're spending above average in ${pattern.category.toLowerCase()}. Consider setting a monthly budget.`,
          potentialSavings,
          confidence: 75,
          priority: 'medium',
          actionSteps: [
            `Set a monthly ${pattern.category.toLowerCase()} budget of $${(pattern.averageAmount * 0.85).toFixed(0)}`,
            'Track expenses more closely in this category',
            'Look for cheaper alternatives'
          ]
        });
      }
    });

    // High variance categories
    patterns.forEach(pattern => {
      if (pattern.variance > pattern.averageAmount * 0.6) {
        recommendations.push({
          id: `consistency-${pattern.category}`,
          type: 'pattern',
          category: pattern.category,
          title: 'Stabilize Spending Pattern',
          description: `Your ${pattern.category.toLowerCase()} expenses are inconsistent. Regular budgeting could help.`,
          potentialSavings: pattern.variance * 0.3,
          confidence: 60,
          priority: 'low',
          actionSteps: [
            'Set a consistent monthly budget',
            'Plan expenses in advance',
            'Review spending weekly'
          ]
        });
      }
    });

    // Savings opportunities
    const highestCategory = patterns[0];
    if (highestCategory && highestCategory.averageAmount > 300) {
      recommendations.push({
        id: 'savings-opportunity',
        type: 'savings',
        category: highestCategory.category,
        title: 'Major Savings Opportunity',
        description: `${highestCategory.category} is your highest expense category. Small reductions could lead to significant savings.`,
        potentialSavings: highestCategory.averageAmount * 0.2,
        confidence: 80,
        priority: 'high',
        actionSteps: [
          'Analyze each expense in this category',
          'Look for subscription services to cancel',
          'Find more cost-effective alternatives',
          'Set spending alerts'
        ]
      });
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  // 4. DETECCIÓN DE DUPLICADOS
  private detectDuplicateExpenses(): DuplicateExpense[] {
    const duplicates: DuplicateExpense[] = [];
    const processedIds = new Set<string>();

    this.expenses.forEach((expense, index) => {
      if (processedIds.has(expense.id)) return;

      const potentialDuplicates = this.expenses.slice(index + 1).filter(other => {
        if (processedIds.has(other.id)) return false;

        // Same amount
        const sameAmount = Math.abs(expense.amount - other.amount) < 0.01;
        
        // Same or similar description
        const descSimilarity = this.calculateStringSimilarity(
          expense.description.toLowerCase(),
          other.description.toLowerCase()
        );
        
        // Within same week
        const daysDiff = Math.abs(differenceInDays(parseISO(expense.date), parseISO(other.date)));
        const sameTimeframe = daysDiff <= 7;
        
        // Same category
        const sameCategory = expense.category === other.category;

        return sameAmount && sameCategory && (descSimilarity > 0.8 || sameTimeframe);
      });

      if (potentialDuplicates.length > 0) {
        duplicates.push({
          original: expense.id,
          duplicates: potentialDuplicates.map(d => d.id),
          confidence: 85,
          reason: 'Same amount, category, and similar timeframe'
        });

        processedIds.add(expense.id);
        potentialDuplicates.forEach(dup => processedIds.add(dup.id));
      }
    });

    return duplicates;
  }

  // 5. PROYECCIONES
  private generateProjections(): MonthlyProjection[] {
    const projections: MonthlyProjection[] = [];
    const trends = this.calculateSpendingTrends();
    
    if (trends.length < 3) return projections; // Need at least 3 months of data

    // Calculate next 3 months projections
    for (let i = 1; i <= 3; i++) {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + i);
      const monthKey = format(futureDate, 'yyyy-MM');

      const recentTrends = trends.slice(-3); // Last 3 months
      const avgGrowthRate = recentTrends.reduce((sum, t) => sum + t.growthRate, 0) / recentTrends.length;
      const lastMonthTotal = trends[trends.length - 1].total;
      
      const projectedTotal = lastMonthTotal * (1 + (avgGrowthRate * i / 100));

      const categoryProjections: Record<ExpenseCategory, number> = {
        Food: 0,
        Transportation: 0,
        Entertainment: 0,
        Shopping: 0,
        Bills: 0,
        Other: 0
      };

      // Project each category based on historical patterns
      Object.keys(categoryProjections).forEach(category => {
        const catKey = category as ExpenseCategory;
        const categoryAvg = recentTrends.reduce((sum, t) => sum + t.categoryBreakdown[catKey], 0) / recentTrends.length;
        categoryProjections[catKey] = categoryAvg * (1 + (avgGrowthRate * i / 100));
      });

      projections.push({
        month: monthKey,
        projectedTotal,
        categoryProjections,
        confidence: Math.max(50, 85 - (i * 10)), // Decreasing confidence for further months
        basedOnMonths: recentTrends.length
      });
    }

    return projections;
  }

  // 6. CÁLCULO DE SALUD FINANCIERA
  private calculateHealthScore(): number {
    let score = 100;
    const patterns = this.analyzeSpendingPatterns();
    const currentMonth = format(new Date(), 'yyyy-MM');
    const currentExpenses = this.getExpensesForMonth(currentMonth);
    const currentTotal = currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const monthlyAverage = this.calculateMonthlyAverage();

    // Penalize high spending months
    if (currentTotal > monthlyAverage * 1.5) score -= 30;
    else if (currentTotal > monthlyAverage * 1.2) score -= 15;

    // Penalize high variance
    const totalVariance = patterns.reduce((sum, p) => sum + p.variance, 0) / patterns.length;
    const avgAmount = patterns.reduce((sum, p) => sum + p.averageAmount, 0) / patterns.length;
    if (totalVariance > avgAmount * 0.5) score -= 20;

    // Penalize increasing trends in multiple categories
    const increasingTrends = patterns.filter(p => p.trend === 'increasing').length;
    score -= increasingTrends * 5;

    // Reward consistent spending
    const stableTrends = patterns.filter(p => p.trend === 'stable').length;
    score += stableTrends * 5;

    return Math.max(0, Math.min(100, score));
  }

  // UTILITY FUNCTIONS
  private groupByCategory(): Record<string, Expense[]> {
    return this.expenses.reduce((groups, expense) => {
      const category = expense.category;
      if (!groups[category]) groups[category] = [];
      groups[category].push(expense);
      return groups;
    }, {} as Record<string, Expense[]>);
  }

  private groupByMonth(): Record<string, Expense[]> {
    return this.expenses.reduce((groups, expense) => {
      const month = format(parseISO(expense.date), 'yyyy-MM');
      if (!groups[month]) groups[month] = [];
      groups[month].push(expense);
      return groups;
    }, {} as Record<string, Expense[]>);
  }

  private getExpensesForMonth(monthKey: string): Expense[] {
    return this.expenses.filter(expense => {
      const expenseMonth = format(parseISO(expense.date), 'yyyy-MM');
      return expenseMonth === monthKey;
    });
  }

  private calculateMonthlyAverage(): number {
    const monthlyData = this.groupByMonth();
    const monthTotals = Object.values(monthlyData).map(expenses => 
      expenses.reduce((sum, exp) => sum + exp.amount, 0)
    );
    return monthTotals.length > 0 ? monthTotals.reduce((sum, total) => sum + total, 0) / monthTotals.length : 0;
  }

  private getMonthsSpan(): number {
    if (this.expenses.length === 0) return 0;
    
    const firstExpense = this.expenses[0];
    const lastExpense = this.expenses[this.expenses.length - 1];
    
    const firstDate = parseISO(firstExpense.date);
    const lastDate = parseISO(lastExpense.date);
    
    const monthsDiff = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 + 
                      (lastDate.getMonth() - firstDate.getMonth()) + 1;
    
    return Math.max(1, monthsDiff);
  }

  private calculateCategoryTrend(expenses: Expense[]): 'increasing' | 'decreasing' | 'stable' {
    if (expenses.length < 6) return 'stable'; // Need enough data
    
    const recent = expenses.slice(-3).reduce((sum, exp) => sum + exp.amount, 0) / 3;
    const older = expenses.slice(-6, -3).reduce((sum, exp) => sum + exp.amount, 0) / 3;
    
    const change = (recent - older) / older;
    
    if (change > 0.15) return 'increasing';
    if (change < -0.15) return 'decreasing';
    return 'stable';
  }

  private calculateVariance(amounts: number[], average: number): number {
    const squaredDiffs = amounts.map(amount => Math.pow(amount - average, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length;
    return Math.sqrt(avgSquaredDiff);
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}