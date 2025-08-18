import React from 'react';
import { useTheme } from '../../ThemeContext';

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  emoji,
  color = 'blue',
  size = 'medium',
  gradient = true,
  onClick,
  className = "",
  valueFormatter = (val) => val,
  trend = null, // 'up', 'down', or null
  trendValue = null
}) => {
  const { isDark } = useTheme();

  // Color configurations
  const colorConfig = {
    blue: {
      gradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-500',
      iconBg: isDark ? 'bg-blue-500' : 'bg-blue-200',
      titleColor: isDark ? 'text-blue-300' : 'text-blue-700',
      valueColor: isDark ? 'text-blue-100' : 'text-blue-900',
      subtitleColor: isDark ? 'text-blue-400' : 'text-blue-600'
    },
    green: {
      gradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-500',
      iconBg: isDark ? 'bg-green-500' : 'bg-green-200',
      titleColor: isDark ? 'text-green-300' : 'text-green-700',
      valueColor: isDark ? 'text-green-100' : 'text-green-900',
      subtitleColor: isDark ? 'text-green-400' : 'text-green-600'
    },
    red: {
      gradient: 'from-red-50 to-red-100',
      borderColor: 'border-red-500',
      iconBg: isDark ? 'bg-red-500' : 'bg-red-200',
      titleColor: isDark ? 'text-red-300' : 'text-red-700',
      valueColor: isDark ? 'text-red-100' : 'text-red-900',
      subtitleColor: isDark ? 'text-red-400' : 'text-red-600'
    },
    orange: {
      gradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-500',
      iconBg: isDark ? 'bg-orange-500' : 'bg-orange-200',
      titleColor: isDark ? 'text-orange-300' : 'text-orange-700',
      valueColor: isDark ? 'text-orange-100' : 'text-orange-900',
      subtitleColor: isDark ? 'text-orange-400' : 'text-orange-600'
    },
    purple: {
      gradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-500',
      iconBg: isDark ? 'bg-purple-500' : 'bg-purple-200',
      titleColor: isDark ? 'text-purple-300' : 'text-purple-700',
      valueColor: isDark ? 'text-purple-100' : 'text-purple-900',
      subtitleColor: isDark ? 'text-purple-400' : 'text-purple-600'
    },
    gray: {
      gradient: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-500',
      iconBg: isDark ? 'bg-gray-500' : 'bg-gray-200',
      titleColor: isDark ? 'text-gray-300' : 'text-gray-700',
      valueColor: isDark ? 'text-gray-100' : 'text-gray-900',
      subtitleColor: isDark ? 'text-gray-400' : 'text-gray-600'
    }
  };

  // Size configurations
  const sizeConfig = {
    small: {
      padding: 'p-4',
      iconSize: 'w-5 h-5',
      iconContainer: 'w-10 h-10',
      titleSize: 'text-sm',
      valueSize: 'text-2xl',
      subtitleSize: 'text-xs',
      emoji: 'text-xl'
    },
    medium: {
      padding: 'p-6',
      iconSize: 'w-6 h-6',
      iconContainer: 'w-12 h-12',
      titleSize: 'text-sm',
      valueSize: 'text-3xl',
      subtitleSize: 'text-sm',
      emoji: 'text-2xl'
    },
    large: {
      padding: 'p-8',
      iconSize: 'w-8 h-8',
      iconContainer: 'w-16 h-16',
      titleSize: 'text-base',
      valueSize: 'text-4xl',
      subtitleSize: 'text-base',
      emoji: 'text-3xl'
    }
  };

  const colors = colorConfig[color];
  const sizes = sizeConfig[size];

  const cardClasses = `
    ${isDark 
      ? `bg-gray-800 border ${colors.borderColor}` 
      : gradient 
        ? `bg-gradient-to-br ${colors.gradient}` 
        : 'bg-white'
    }
    ${sizes.padding} 
    rounded-xl 
    shadow-lg 
    transition-all 
    duration-300 
    ${onClick ? 'cursor-pointer hover:shadow-xl hover:scale-105' : ''}
    ${className}
  `;

  const getTrendIcon = () => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return '';
  };

  return (
    <div className={cardClasses} onClick={onClick}>
      {/* Header with Icon/Emoji */}
      <div className="flex items-center justify-between mb-3">
        <div className={`${sizes.iconContainer} rounded-lg flex items-center justify-center transition-colors duration-300 ${colors.iconBg}`}>
          {Icon ? (
            <Icon className={`${sizes.iconSize} transition-colors duration-300 ${isDark ? 'text-white' : `text-${color}-600`}`} />
          ) : null}
        </div>
        {emoji && <span className={sizes.emoji}>{emoji}</span>}
      </div>

      {/* Title */}
      <h3 className={`${sizes.titleSize} font-medium mb-1 transition-colors duration-300 ${colors.titleColor}`}>
        {title}
      </h3>

      {/* Value with Trend */}
      <div className="flex-column items-center space-x-2 mb-0">
        <p className={`${sizes.valueSize} font-bold transition-colors duration-300 ${colors.valueColor}`}>
          {valueFormatter(value)}
        </p>
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <span className="text-sm">{getTrendIcon()}</span>
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className={`${sizes.subtitleSize} mt-2 transition-colors duration-300 ${colors.subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
