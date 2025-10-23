'use client';

import React, { useState, useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';

interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

interface InteractiveChartProps {
  data: ChartDataPoint[];
  type: 'bar' | 'pie' | 'line';
  title: string;
  height?: number;
  showPercentages?: boolean;
  showValues?: boolean;
  animated?: boolean;
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  type,
  title,
  height = 300,
  showPercentages = true,
  showValues = true,
  animated = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const maxValue = useMemo(() => Math.max(...data.map(d => d.value)), [data]);
  const totalValue = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const renderBarChart = () => (
    <div className="space-y-4">
      <div style={{ height: `${height}px` }} className="relative">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          const isHovered = hoveredIndex === index;
          const isSelected = selectedIndex === index;
          
          return (
            <div
              key={item.label}
              className="absolute bottom-0 flex flex-col items-center cursor-pointer transition-all duration-300"
              style={{
                left: `${(index / data.length) * 100}%`,
                width: `${90 / data.length}%`,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
            >
              {/* Value Label */}
              {(isHovered || isSelected) && showValues && (
                <div className="mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  {formatValue(item.value)}
                  {showPercentages && ` (${item.percentage.toFixed(1)}%)`}
                </div>
              )}
              
              {/* Bar */}
              <div
                className="w-full rounded-t transition-all duration-500"
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: item.color,
                  opacity: isHovered || isSelected ? 1 : 0.8,
                  boxShadow: isHovered || isSelected ? `0 4px 12px ${item.color}40` : 'none',
                }}
              />
              
              {/* Label */}
              <div className="text-xs text-gray-600 mt-2 text-center font-medium">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      {(hoveredIndex !== null || selectedIndex !== null) && (
        <div className="bg-gray-50 rounded-lg p-4">
          {data.map((item, index) => {
            if (hoveredIndex !== index && selectedIndex !== index) return null;
            return (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatValue(item.value)}</div>
                  <div className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderPieChart = () => {
    let cumulativePercentage = 0;
    
    return (
      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
        {/* Pie Chart */}
        <div className="relative">
          <svg width={height} height={height} className="transform -rotate-90">
            {data.map((item, index) => {
              const startAngle = (cumulativePercentage / 100) * 360;
              const endAngle = ((cumulativePercentage + item.percentage) / 100) * 360;
              const largeArcFlag = item.percentage > 50 ? 1 : 0;
              
              const x1 = height/2 + (height/2 - 20) * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = height/2 + (height/2 - 20) * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = height/2 + (height/2 - 20) * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = height/2 + (height/2 - 20) * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const pathData = [
                `M ${height/2} ${height/2}`,
                `L ${x1} ${y1}`,
                `A ${height/2 - 20} ${height/2 - 20} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              cumulativePercentage += item.percentage;
              
              const isHovered = hoveredIndex === index;
              const isSelected = selectedIndex === index;
              
              return (
                <path
                  key={item.label}
                  d={pathData}
                  fill={item.color}
                  className="cursor-pointer transition-all duration-300"
                  style={{
                    opacity: isHovered || isSelected ? 1 : 0.8,
                    transform: isHovered || isSelected ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: `${height/2}px ${height/2}px`,
                    filter: isHovered || isSelected ? `drop-shadow(0 4px 8px ${item.color}40)` : 'none',
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                />
              );
            })}
          </svg>
          
          {/* Center Label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatValue(totalValue)}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-3 flex-1">
          {data.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const isSelected = selectedIndex === index;
            
            return (
              <div
                key={item.label}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isHovered || isSelected ? 'bg-gray-50 shadow-sm' : 'hover:bg-gray-25'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={`font-medium ${isHovered || isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatValue(item.value)}</div>
                  <div className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          {type === 'bar' && <BarChart3 className="h-5 w-5 text-gray-400" />}
          {type === 'pie' && <PieChart className="h-5 w-5 text-gray-400" />}
          {type === 'line' && <TrendingUp className="h-5 w-5 text-gray-400" />}
        </div>
      </div>
      
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-gray-400 mb-2">
            <BarChart3 className="h-12 w-12" />
          </div>
          <p className="text-gray-500">No data available</p>
        </div>
      ) : (
        <>
          {type === 'bar' && renderBarChart()}
          {type === 'pie' && renderPieChart()}
        </>
      )}
    </div>
  );
};

export default InteractiveChart;