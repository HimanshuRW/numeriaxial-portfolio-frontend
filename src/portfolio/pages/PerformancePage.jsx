import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Target, Layers } from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import LoadingState from '../components/LoadingState';

// Import performance sub-pages
import ReturnsAnalysis from './performance/ReturnsAnalysis';
import AttributionAnalysis from './performance/AttributionAnalysis';
import FactorAnalysis from './performance/FactorAnalysis';
import RiskAnalysis from './performance/RiskAnalysis';

const PerformancePage = ({ portfolioData, onStockClick }) => {
  const [activeSubTab, setActiveSubTab] = useState('returns');
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  // Fetch performance-related data
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        
        // Fetch multiple performance datasets
        const [returnBasedResponse, bottomUpResponse, factorBasedResponse, performanceBasedResponse] = await Promise.all([
          fetch('/return_based_attribution.json'),
          fetch('/bottom_up_attribution.json'),
          fetch('/factor_based_attribution.json'),
          fetch('/performance_based_analysis.json')
        ]);

        const returnBased = await returnBasedResponse.json();
        const bottomUp = await bottomUpResponse.json();
        const factorBased = await factorBasedResponse.json();
        const performanceBased = await performanceBasedResponse.json();

        setPerformanceData({
          returnBased,
          bottomUp,
          factorBased,
          performanceBased
        });
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  const subNavigationItems = [
    {
      id: 'returns',
      label: 'Returns Analysis',
      icon: TrendingUp,
      description: 'Portfolio returns and distribution analysis'
    },
    {
      id: 'attribution',
      label: 'Attribution',
      icon: Target,
      description: 'Bottom-up performance attribution'
    },
    {
      id: 'factors',
      label: 'Factor Analysis',
      icon: Layers,
      description: 'Factor-based attribution and exposure'
    },
    {
      id: 'risk-perf',
      label: 'Risk Analytics',
      icon: BarChart3,
      description: 'Risk-adjusted performance metrics'
    }
  ];

  const renderSubTabContent = () => {
    if (loading) {
      return <LoadingState type="skeleton" />;
    }

    if (!performanceData) {
      return <div className={`text-center py-8 transition-colors duration-300 ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}>No performance data available</div>;
    }

    switch (activeSubTab) {
      case 'returns':
        return <ReturnsAnalysis data={performanceData} onStockClick={onStockClick} />;
      case 'attribution':
        return <AttributionAnalysis data={performanceData} onStockClick={onStockClick} />;
      case 'factors':
        return <FactorAnalysis data={performanceData} onStockClick={onStockClick} />;
      case 'risk-perf':
        return <RiskAnalysis data={performanceData} onStockClick={onStockClick} />;
      default:
        return <ReturnsAnalysis data={performanceData} onStockClick={onStockClick} />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Sub Navigation - Moved to top */}
      <div className={`px-6 pt-3 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`border-b mb-6 sticky top-0 z-10 transition-colors duration-300 ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <nav className="flex space-x-8 overflow-x-auto">
            {subNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  className={`flex items-center space-x-2 py-3 px-1 mb-2 border-b-2 font-medium text-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : `border-transparent hover:border-gray-300 transition-colors duration-300 ${
                          isDark 
                            ? 'text-gray-400 hover:text-gray-300' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Sub Tab Description */}
        <div className="mb-4">
          <p className={`transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {subNavigationItems.find(item => item.id === activeSubTab)?.description}
          </p>
        </div>

        {/* Sub Tab Content */}
        {renderSubTabContent()}
      </div>
    </div>
  );
};

export default PerformancePage;