'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrency } from '@/contexts/CurrencyContext';

interface DataPoint {
  label: string;
  value: number;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

interface AnimatedChartProps {
  data: DataPoint[];
  title: string;
  type: 'bar' | 'line' | 'donut' | 'area';
  height?: number;
  animated?: boolean;
  showValues?: boolean;
  gradient?: boolean;
}

const AnimatedChart: React.FC<AnimatedChartProps> = ({
  data,
  title,
  type = 'bar',
  height = 300,
  animated = true,
  showValues = true,
  gradient = true
}) => {
  const { t } = useI18n();
  const { formatAmountCompact } = useCurrency();
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const maxValue = Math.max(...data.map(d => d.value));
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && animated) {
      const duration = 2000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setAnimationProgress(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    } else if (!animated) {
      setAnimationProgress(1);
    }
  }, [isVisible, animated]);

  const renderBarChart = () => (
    <div className="bar-chart">
      {data.map((item, index) => {
        const barHeight = animated 
          ? (item.value / maxValue) * 100 * animationProgress
          : (item.value / maxValue) * 100;
        
        const animationDelay = index * 0.1;
        
        return (
          <div key={index} className="bar-container">
            <div className="bar-wrapper">
              <div 
                className="bar"
                style={{
                  height: `${barHeight}%`,
                  background: gradient 
                    ? `linear-gradient(135deg, ${item.color}, ${item.color}aa)`
                    : item.color,
                  animationDelay: `${animationDelay}s`,
                  boxShadow: `0 0 20px ${item.color}40`
                }}
              >
                {showValues && barHeight > 10 && (
                  <div className="bar-value">
                    {formatAmountCompact(item.value)}
                  </div>
                )}
                <div className="bar-glow" style={{ background: item.color }} />
              </div>
              
              {item.trend && (
                <div className="trend-indicator">
                  {item.trend === 'up' ? (
                    <TrendingUp size={12} style={{ color: '#10b981' }} />
                  ) : item.trend === 'down' ? (
                    <TrendingDown size={12} style={{ color: '#ef4444' }} />
                  ) : (
                    <DollarSign size={12} style={{ color: '#6b7280' }} />
                  )}
                </div>
              )}
            </div>
            
            <div className="bar-label">{item.label}</div>
          </div>
        );
      })}
    </div>
  );

  const renderDonutChart = () => {
    const radius = 80;
    const strokeWidth = 20;
    const circumference = 2 * Math.PI * radius;
    let cumulativePercentage = 0;

    return (
      <div className="donut-chart">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          
          {data.map((item, index) => {
            const percentage = (item.value / totalValue) * 100;
            const animatedPercentage = percentage * animationProgress;
            const strokeDasharray = circumference;
            const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;
            
            const rotation = (cumulativePercentage / 100) * 360;
            cumulativePercentage += percentage;
            
            return (
              <circle
                key={index}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transform: `rotate(${rotation - 90}deg)`,
                  transformOrigin: '100px 100px',
                  transition: 'stroke-dashoffset 0.3s ease',
                  filter: `drop-shadow(0 0 8px ${item.color}40)`
                }}
              />
            );
          })}
          
          <text
            x="100"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="24"
            fontWeight="bold"
          >
            {formatAmountCompact(totalValue)}
          </text>
        </svg>
        
        <div className="donut-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: item.color }}
              />
              <span className="legend-label">{item.label}</span>
              <span className="legend-value">
                {((item.value / totalValue) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAreaChart = () => {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 80 * animationProgress;
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `0,100 ${points} 100,100`;

    return (
      <div className="area-chart">
        <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          
          <polygon
            points={areaPoints}
            fill="url(#areaGradient)"
            className="area-fill"
          />
          
          <polyline
            points={points}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.5"
            className="area-line"
          />
          
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 80 * animationProgress;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill="#3b82f6"
                className="data-point"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <title>{item.label}: {formatAmountCompact(item.value)}</title>
              </circle>
            );
          })}
        </svg>
        
        <div className="area-labels">
          {data.map((item, index) => (
            <div key={index} className="area-label">
              {item.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div ref={chartRef} className="animated-chart">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-stats">
          <div className="stat-item">
            <Calendar size={16} />
            <span>Total: {formatAmountCompact(totalValue)}</span>
          </div>
        </div>
      </div>
      
      <div className="chart-content">
        {type === 'bar' && renderBarChart()}
        {type === 'donut' && renderDonutChart()}
        {type === 'area' && renderAreaChart()}
      </div>

      <style jsx>{`
        .animated-chart {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          transition: all 0.3s ease;
        }

        .animated-chart:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .chart-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, white, #f0f9ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .chart-stats {
          display: flex;
          gap: 16px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .chart-content {
          height: ${height}px;
          position: relative;
        }

        /* Bar Chart Styles */
        .bar-chart {
          display: flex;
          align-items: end;
          justify-content: space-around;
          height: 100%;
          gap: 8px;
          padding: 20px 0;
        }

        .bar-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 40px;
        }

        .bar-wrapper {
          width: 100%;
          height: calc(100% - 40px);
          position: relative;
          display: flex;
          align-items: end;
          justify-content: center;
        }

        .bar {
          width: 80%;
          min-height: 4px;
          border-radius: 8px 8px 0 0;
          position: relative;
          display: flex;
          align-items: end;
          justify-content: center;
          animation: ${animated ? 'barGrow 0.8s cubic-bezier(0.4, 0, 0.2, 1) both' : 'none'};
          transition: all 0.3s ease;
        }

        .bar:hover {
          transform: scaleX(1.1);
          filter: brightness(1.1);
        }

        .bar-value {
          position: absolute;
          bottom: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .bar-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 8px 8px 0 0;
          opacity: 0.5;
          filter: blur(4px);
          z-index: -1;
        }

        .trend-indicator {
          position: absolute;
          top: -20px;
          right: 0;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bar-label {
          margin-top: 12px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          word-break: break-word;
          max-width: 100%;
        }

        /* Donut Chart Styles */
        .donut-chart {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .donut-legend {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          width: 100%;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .legend-label {
          flex: 1;
          color: rgba(255, 255, 255, 0.9);
        }

        .legend-value {
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
        }

        /* Area Chart Styles */
        .area-chart {
          position: relative;
          height: 100%;
        }

        .area-fill {
          animation: ${animated ? 'areaFill 1.5s ease-out both' : 'none'};
        }

        .area-line {
          animation: ${animated ? 'lineDraw 2s ease-out both' : 'none'};
          stroke-dasharray: 100;
          stroke-dashoffset: ${animated ? '100' : '0'};
        }

        .data-point {
          animation: ${animated ? 'pointAppear 0.5s ease-out both' : 'none'};
        }

        .area-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 16px;
        }

        .area-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          flex: 1;
        }

        @keyframes barGrow {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            height: var(--bar-height, 0);
            opacity: 1;
          }
        }

        @keyframes areaFill {
          from {
            opacity: 0;
            transform: scaleY(0);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }

        @keyframes lineDraw {
          from {
            stroke-dashoffset: 100;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes pointAppear {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .chart-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .chart-title {
            font-size: 1.25rem;
          }

          .bar-chart {
            gap: 4px;
            padding: 16px 0;
          }

          .bar-label {
            font-size: 0.625rem;
            margin-top: 8px;
          }

          .donut-legend {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .legend-item {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedChart;