import React, { useState, useEffect } from 'react';
import { ArrowRight, RefreshCw, Download, TrendingUp, PieChart, BarChart3, Shield, Filter } from 'lucide-react';
import { portfolioAPI } from './api/portfolioAPI';
import PerformancePage from './pages/PerformancePage';
import AllocationPage from './pages/AllocationPage';
import StatisticsPage from './pages/StatisticsPage';
import RiskAnalysisPage from './pages/RiskAnalysisPage';

const PortfolioAnalytics = ({ onNavigate, onStockClick }) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [activeTab, setActiveTab] = useState('performance');
  const [timePeriod, setTimePeriod] = useState('weekly');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        // Get selected tickers from sessionStorage
        const selectedTickers = JSON.parse(sessionStorage.getItem('selectedTickers') || '["AAPL", "MSFT", "GOOGL"]');
        const data = await portfolioAPI.getPortfolioAnalysis(selectedTickers);
        setPortfolioData(data);
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolioData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const selectedTickers = JSON.parse(sessionStorage.getItem('selectedTickers') || '["AAPL", "MSFT", "GOOGL"]');
      const data = await portfolioAPI.getPortfolioAnalysis(selectedTickers);
      setPortfolioData(data);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToStockAnalytics = (ticker) => {
    onStockClick(ticker);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Failed to load portfolio data</p>
          <button 
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('portfolio')}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Back to Portfolio Builder</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Portfolio Analysis</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={refreshData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Data</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'allocation', label: 'Asset Allocation', icon: PieChart },
              { id: 'statistics', label: 'Statistics & Analysis', icon: BarChart3 },
              { id: 'risk', label: 'Risk Analysis', icon: Shield }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Time Period Selector */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Time Period:</span>
            </div>
            <div className="flex space-x-2">
              {[
                { id: 'daily', label: 'Daily' },
                { id: 'weekly', label: 'Weekly' },
                { id: 'monthly', label: 'Monthly' },
                { id: 'quarterly', label: 'Quarterly' },
                { id: 'yearly', label: 'Yearly' }
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setTimePeriod(id)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    timePeriod === id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Page Content */}
        {activeTab === 'performance' && (
          <PerformancePage 
            portfolioData={portfolioData}
            timePeriod={timePeriod}
            onStockClick={goToStockAnalytics}
          />
        )}
        {activeTab === 'allocation' && (
          <AllocationPage 
            portfolioData={portfolioData}
            onStockClick={goToStockAnalytics}
          />
        )}
        {activeTab === 'statistics' && (
          <StatisticsPage 
            portfolioData={portfolioData}
            onStockClick={goToStockAnalytics}
          />
        )}
        {activeTab === 'risk' && (
          <RiskAnalysisPage 
            portfolioData={portfolioData}
            onStockClick={goToStockAnalytics}
          />
        )}
      </div>
    </div>
  );
};

export default PortfolioAnalytics;