import React, { useState, useEffect } from 'react';
import { ArrowRight, RefreshCw, Download, TrendingUp, BarChart3, Users, Target, Filter } from 'lucide-react';
import { stockAPI } from './api/stockAPI';
import { getStockName } from './data/stockData';
import OverviewPage from './pages/OverviewPage';
import FundamentalPage from './pages/FundamentalPage';
import PeersPage from './pages/PeersPage';
import PredictivePage from './pages/PredictivePage';

const StockAnalytics = ({ ticker, onNavigate }) => {
  const [stockData, setStockData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timePeriod, setTimePeriod] = useState('weekly');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStockData = async () => {
      try {
        setIsLoading(true);
        const data = await stockAPI.getStockAnalysis(ticker);
        setStockData(data);
      } catch (error) {
        console.error('Error loading stock data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (ticker) {
      loadStockData();
    }
  }, [ticker]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await stockAPI.getStockAnalysis(ticker);
      setStockData(data);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToStock = (newTicker) => {
    // This will trigger a re-render with new ticker
    window.history.pushState(null, '', `/stock-analytics/${newTicker}`);
    setStockData(null);
    setIsLoading(true);
    
    // Load new stock data
    stockAPI.getStockAnalysis(newTicker).then(data => {
      setStockData(data);
      setIsLoading(false);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading {ticker} analytics...</p>
        </div>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Failed to load stock data for {ticker}</p>
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

  const stockName = getStockName(ticker);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('analysis')}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Back to Portfolio</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{ticker}</h1>
                <p className="text-sm text-gray-600">{stockName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Price:</span>
                <span className="text-lg font-bold text-gray-900">${stockData.currentPrice}</span>
                <span className={`text-sm font-medium ${
                  stockData.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stockData.changePercent > 0 ? '+' : ''}{stockData.changePercent}%
                </span>
              </div>
              <button 
                onClick={refreshData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
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
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'fundamental', label: 'Fundamental Analysis', icon: BarChart3 },
              { id: 'peers', label: 'Peers', icon: Users },
              { id: 'predictive', label: 'Predictive Analysis', icon: Target }
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
        {activeTab === 'overview' && (
          <OverviewPage 
            stockData={stockData}
            timePeriod={timePeriod}
            ticker={ticker}
          />
        )}
        {activeTab === 'fundamental' && (
          <FundamentalPage 
            stockData={stockData}
            ticker={ticker}
          />
        )}
        {activeTab === 'peers' && (
          <PeersPage 
            stockData={stockData}
            ticker={ticker}
            onStockClick={navigateToStock}
          />
        )}
        {activeTab === 'predictive' && (
          <PredictivePage 
            stockData={stockData}
            timePeriod={timePeriod}
            ticker={ticker}
          />
        )}
      </div>
    </div>
  );
};

export default StockAnalytics;