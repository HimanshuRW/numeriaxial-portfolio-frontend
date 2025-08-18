import React from 'react';
import { Loader2, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { useTheme } from '../../ThemeContext';

const LoadingState = ({
  type = 'default', // 'default', 'chart', 'table', 'card', 'skeleton'
  message = 'Loading...',
  size = 'medium', // 'small', 'medium', 'large'
  className = ''
}) => {
  const { isDark } = useTheme();

  // Size configurations
  const sizeConfig = {
    small: {
      spinner: 'w-4 h-4',
      text: 'text-sm',
      container: 'py-4'
    },
    medium: {
      spinner: 'w-6 h-6',
      text: 'text-base',
      container: 'py-8'
    },
    large: {
      spinner: 'w-8 h-8',
      text: 'text-lg',
      container: 'py-12'
    }
  };

  const config = sizeConfig[size];

  // Default loading spinner
  const DefaultLoader = () => (
    <div className={`flex items-center justify-center ${config.container} ${className}`}>
      <div className="flex items-center space-x-3">
        <Loader2 className={`${config.spinner} animate-spin text-blue-600`} />
        <span className={`${config.text} font-medium transition-colors duration-300 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {message}
        </span>
      </div>
    </div>
  );

  // Chart loading with animated icons
  const ChartLoader = () => (
    <div className={`flex items-center justify-center ${config.container} ${className}`}>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <BarChart3 className={`${config.spinner} text-blue-600 animate-pulse`} />
          <TrendingUp className={`${config.spinner} text-green-600 animate-pulse delay-100`} />
          <PieChart className={`${config.spinner} text-purple-600 animate-pulse delay-200`} />
        </div>
        <span className={`${config.text} font-medium transition-colors duration-300 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {message}
        </span>
      </div>
    </div>
  );

  // Table loading with skeleton rows
  const TableLoader = () => (
    <div className={`space-y-3 ${className}`}>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className={`h-4 rounded transition-colors duration-300 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} style={{ width: `${Math.random() * 40 + 60}%` }} />
        </div>
      ))}
    </div>
  );

  // Card loading with skeleton content
  const CardLoader = () => (
    <div className={`animate-pulse ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-12 h-12 rounded-lg transition-colors duration-300 ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
        <div className="flex-1">
          <div className={`h-4 rounded mb-2 transition-colors duration-300 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} style={{ width: '60%' }} />
          <div className={`h-6 rounded transition-colors duration-300 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} style={{ width: '40%' }} />
        </div>
      </div>
      <div className={`h-4 rounded transition-colors duration-300 ${
        isDark ? 'bg-gray-700' : 'bg-gray-200'
      }`} style={{ width: '80%' }} />
    </div>
  );

  // Skeleton loading for various content
  const SkeletonLoader = () => (
    <div className={`space-y-4 ${className}`}>
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-8 h-8 rounded transition-colors duration-300 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className={`h-6 rounded transition-colors duration-300 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} style={{ width: '200px' }} />
        </div>

        {/* Content skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className={`p-4 rounded-lg transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className={`h-4 rounded mb-3 transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} style={{ width: '70%' }} />
              <div className={`h-8 rounded mb-2 transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} style={{ width: '50%' }} />
              <div className={`h-3 rounded transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} style={{ width: '80%' }} />
            </div>
          ))}
        </div>

        {/* Chart skeleton */}
        <div className={`h-64 rounded-lg transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-gray-100'
        }`} />
      </div>
    </div>
  );

  // Render appropriate loader based on type
  switch (type) {
    case 'chart':
      return <ChartLoader />;
    case 'table':
      return <TableLoader />;
    case 'card':
      return <CardLoader />;
    case 'skeleton':
      return <SkeletonLoader />;
    default:
      return <DefaultLoader />;
  }
};

export default LoadingState;