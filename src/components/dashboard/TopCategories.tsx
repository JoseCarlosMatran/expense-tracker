import React from 'react';
import { ExpenseSummary } from '@/types/expense';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants/categories';
import { formatCurrency } from '@/lib/utils';

interface TopCategoriesProps {
  summary: ExpenseSummary;
}

const TopCategories: React.FC<TopCategoriesProps> = ({ summary }) => {
  const { topCategories } = summary;

  if (topCategories.length === 0 || topCategories.every(cat => cat.amount === 0)) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Categories</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No spending data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Top Categories</h3>
      
      <div className="space-y-4">
        {topCategories.map((item, index) => {
          const categoryColor = CATEGORY_COLORS[item.category];
          const categoryIcon = CATEGORY_ICONS[item.category];
          
          return (
            <div key={item.category} className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-2 h-2 rounded-full text-xs font-bold">
                <span className="text-gray-500">#{index + 1}</span>
              </div>
              
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm"
                style={{ backgroundColor: categoryColor }}
              >
                {categoryIcon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {item.category}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: categoryColor,
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>
                
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {item.percentage.toFixed(1)}% of total
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopCategories;