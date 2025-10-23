export interface CustomCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
  parentId?: string; // For subcategories
  createdAt: string;
  updatedAt: string;
}

export interface CategoryStats {
  categoryId: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
  averageAmount: number;
}

export const DEFAULT_CATEGORY_COLORS = [
  '#1e88e5', // Blue
  '#43a047', // Green
  '#fb8c00', // Orange
  '#e53935', // Red
  '#8e24aa', // Purple
  '#00acc1', // Cyan
  '#fdd835', // Yellow
  '#d81b60', // Pink
  '#6d4c41', // Brown
  '#546e7a', // Blue Grey
];

export const DEFAULT_CATEGORY_ICONS = [
  '🍔', '🏠', '🚗', '🎬', '🛒', '💊', '✈️', '👕', 
  '📚', '🎵', '💰', '⚡', '📱', '🏃', '🎨', '🔧'
];

// Default system categories that can't be deleted
export const SYSTEM_CATEGORIES: CustomCategory[] = [
  {
    id: 'food',
    name: 'Food',
    color: '#43a047',
    icon: '🍔',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'transport',
    name: 'Transportation',
    color: '#1e88e5',
    icon: '🚗',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    color: '#e53935',
    icon: '🎬',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'shopping',
    name: 'Shopping',
    color: '#fb8c00',
    icon: '🛒',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'housing',
    name: 'Housing',
    color: '#8e24aa',
    icon: '🏠',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const CategoryService = {
  getCategories(): CustomCategory[] {
    if (typeof window === 'undefined') return SYSTEM_CATEGORIES;
    
    try {
      const stored = localStorage.getItem('expense-tracker-categories');
      const customCategories = stored ? JSON.parse(stored) : [];
      return [...SYSTEM_CATEGORIES, ...customCategories];
    } catch {
      return SYSTEM_CATEGORIES;
    }
  },

  saveCategory(category: Omit<CustomCategory, 'id' | 'createdAt' | 'updatedAt'>): CustomCategory {
    if (typeof window === 'undefined') throw new Error('Not available on server');
    
    const newCategory: CustomCategory = {
      ...category,
      id: `custom_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const categories = this.getCategories();
    const customCategories = categories.filter(c => !c.isDefault);
    customCategories.push(newCategory);
    
    localStorage.setItem('expense-tracker-categories', JSON.stringify(customCategories));
    return newCategory;
  },

  updateCategory(id: string, updates: Partial<CustomCategory>): void {
    if (typeof window === 'undefined') throw new Error('Not available on server');
    
    const categories = this.getCategories();
    const customCategories = categories.filter(c => !c.isDefault);
    const categoryIndex = customCategories.findIndex(c => c.id === id);
    
    if (categoryIndex >= 0) {
      customCategories[categoryIndex] = {
        ...customCategories[categoryIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('expense-tracker-categories', JSON.stringify(customCategories));
    }
  },

  deleteCategory(id: string): void {
    if (typeof window === 'undefined') throw new Error('Not available on server');
    
    const categories = this.getCategories();
    const customCategories = categories.filter(c => !c.isDefault && c.id !== id);
    localStorage.setItem('expense-tracker-categories', JSON.stringify(customCategories));
  },

  getCategoryById(id: string): CustomCategory | undefined {
    return this.getCategories().find(c => c.id === id);
  },

  getCategoryByName(name: string): CustomCategory | undefined {
    return this.getCategories().find(c => c.name.toLowerCase() === name.toLowerCase());
  },
};