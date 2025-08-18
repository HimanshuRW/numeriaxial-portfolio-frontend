import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from '../../ThemeContext';

const StatCard = ({
  label,
  value,
  comparisonValue = null,
  comparisonLabel = null,
  format = 'number', // 'number', 'percentage', 'currency', 'ratio'
  decimals = 2,
  showTrend = false,
  trendDirection = null, // 'up', 'down', 'neutral'
  size = 'medium', // 'small', 'medium', 'large'
  onClick = null,
  className = '',
  colorize = false, // Auto-color based on positive/negative values
  customColor = null // 'green', 'red', 'blue', etc.
}) => {
  const { isDark } = useTheme();

  // Format the value based on the format type
  const formatValue = (val, fmt = format, dec = decimals) => {
    if (val === null || val === undefined) return '-';
    
    const numVal = parseFloat(val);
    if (isNaN(numVal)) return val;

    switch (fmt) {
      case 'percentage':
        const sign = numVal > 0 ? '+' : '';
        return `${sign}${numVal.toFixed(dec)}%`;
      case 'currency':
        return `$${Math.abs(numVal).toLocaleString(undefined, { 
          minimumFractionDigits: dec, 
          maximumFractionDigits: dec 
        })}`;
      case 'ratio':
        return numVal.toFixed(dec);
      default:
        return numVal.toLocaleString(undefined, { 
          minimumFractionDigits: dec, 
          maximumFractionDigits: dec 
        });
    }
  };

  // Get color classes based on value
  const getValueColor = () => {
    if (customColor) {
      return `text-${customColor}-500`;
    }
    
    if (colorize && typeof value === 'number') {
      if (value > 0) return 'text-green-500';
      if (value < 0) return 'text-red-500';
      return isDark ? 'text-gray-300' : 'text-gray-600';
    }
    
    return isDark ? 'text-white' : 'text-gray-900';
  };

  // Get trend icon and color
  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  // Size configurations
  const sizeConfig = {
    small: {
      padding: 'p-3',
      labelSize: 'text-xs',
      valueSize: 'text-lg',
      comparisonSize: 'text-xs'
    },
    medium: {
      padding: 'p-4',
      labelSize: 'text-sm',
      valueSize: 'text-2xl',
      comparisonSize: 'text-sm'
    },
    large: {
      padding: 'p-6',
      labelSize: 'text-base',
      valueSize: 'text-3xl',
      comparisonSize: 'text-base'
    }
  };

  const sizes = sizeConfig[size];

  const cardClasses = `
    ${sizes.padding}
    rounded-lg
    transition-all duration-300
    ${isDark ? 'bg-gray-700' : 'bg-gray-50'}
    ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''}
    ${className}
  `;

  return (
    <div className={cardClasses} onClick={onClick}>
      {/* Label and Trend */}
      <div className="flex items-center justify-between mb-2">
        <div className={`${sizes.labelSize} font-medium transition-colors duration-300 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {label}
        </div>
        {showTrend && getTrendIcon()}
      </div>

      {/* Main Value */}
      <div className={`${sizes.valueSize} font-bold mb-1 transition-colors duration-300 ${getValueColor()}`}>
        {formatValue(value)}
      </div>

      {/* Comparison Value */}
      {comparisonValue !== null && (
        <div className={`${sizes.comparisonSize} transition-colors duration-300 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {comparisonLabel ? `${comparisonLabel}: ` : 'vs '}
          <span className={colorize && typeof comparisonValue === 'number' ? (
            comparisonValue >= 0 ? 'text-green-500' : 'text-red-500'
          ) : ''}>
            {formatValue(comparisonValue)}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;