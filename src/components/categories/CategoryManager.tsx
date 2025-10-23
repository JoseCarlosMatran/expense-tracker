'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Palette } from 'lucide-react';
import { CustomCategory, CategoryService, DEFAULT_CATEGORY_COLORS, DEFAULT_CATEGORY_ICONS } from '@/types/category';
import Button from '@/components/ui/Button';

interface CategoryManagerProps {
  onCategoryChange?: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: DEFAULT_CATEGORY_COLORS[0],
    icon: DEFAULT_CATEGORY_ICONS[0],
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const loadedCategories = CategoryService.getCategories();
    setCategories(loadedCategories);
  };

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) return;
    
    try {
      CategoryService.saveCategory({
        name: newCategory.name.trim(),
        color: newCategory.color,
        icon: newCategory.icon,
        isDefault: false,
      });
      
      setNewCategory({
        name: '',
        color: DEFAULT_CATEGORY_COLORS[0],
        icon: DEFAULT_CATEGORY_ICONS[0],
      });
      setIsCreating(false);
      loadCategories();
      onCategoryChange?.();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = (id: string, updates: Partial<CustomCategory>) => {
    try {
      CategoryService.updateCategory(id, updates);
      setEditingId(null);
      loadCategories();
      onCategoryChange?.();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      CategoryService.deleteCategory(id);
      loadCategories();
      onCategoryChange?.();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
          <p className="text-gray-600">Create and manage your expense categories</p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Create New Category */}
      {isCreating && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Category</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({...prev, name: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_CATEGORY_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCategory(prev => ({...prev, color}))}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newCategory.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                  {DEFAULT_CATEGORY_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewCategory(prev => ({...prev, icon}))}
                      className={`w-8 h-8 flex items-center justify-center rounded border-2 ${
                        newCategory.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleCreateCategory} disabled={!newCategory.name.trim()}>
                <Save className="h-4 w-4 mr-2" />
                Create Category
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: category.color + '20', color: category.color }}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  {category.isDefault && (
                    <span className="text-xs text-gray-500">System Category</span>
                  )}
                </div>
              </div>

              {!category.isDefault && (
                <div className="flex space-x-1">
                  <button
                    onClick={() => setEditingId(category.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Category Stats (placeholder) */}
            <div className="text-sm text-gray-500">
              <div>Used in transactions</div>
              <div className="text-xs opacity-75">Click to view detailed analytics</div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Palette className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Yet</h3>
          <p className="text-gray-500 mb-4">Create your first category to organize your expenses</p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Category
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;