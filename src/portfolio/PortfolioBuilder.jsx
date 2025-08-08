import React, { useState } from 'react';
import { Search, X, Upload, TrendingUp, Activity, ArrowRight, RefreshCw } from 'lucide-react';
import { SP500_STOCKS, POPULAR_STOCKS } from './data/stockData';
import { portfolioAPI } from './api/portfolioAPI';

const PortfolioBuilder = ({ onNavigate }) => {
  const [selectedTickers, setSelectedTickers] = useState(['AAPL', 'MSFT', 'GOOGL']);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const results = SP500_STOCKS.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      setSearchResults(results);
      setIsLoading(false);
    } else {
      setSearchResults([]);
    }
  };

  // Add ticker
  const addTicker = (symbol) => {
    if (!selectedTickers.includes(symbol)) {
      setSelectedTickers([...selectedTickers, symbol]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  // Remove ticker
  const removeTicker = (symbol) => {
    setSelectedTickers(selectedTickers.filter(ticker => ticker !== symbol));
  };

  // Handle CSV upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n');
    const tickers = [];
    
    lines.forEach((line, index) => {
      if (index === 0 && line.toLowerCase().includes('ticker')) return;
      const ticker = line.trim().replace(/['"]/g, '');
      if (ticker) tickers.push(ticker.toUpperCase());
    });

    const validTickers = tickers.filter(ticker => 
      SP500_STOCKS.some(stock => stock.symbol === ticker)
    );
    
    setSelectedTickers([...new Set([...selectedTickers, ...validTickers])]);
  };

  // Analyze portfolio
  const analyzePortfolio = async () => {
    setIsLoading(true);
    try {
      // Store selected tickers in sessionStorage to pass to analytics
      sessionStorage.setItem('selectedTickers', JSON.stringify(selectedTickers));
      onNavigate('analysis');
    } catch (error) {
      console.error('Error analyzing portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => onNavigate('landing')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowRight className="h-5 w-5 rotate-180" />
              </button>
              <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Portfolio Analytics</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Selected Stocks Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Selected Stocks</h3>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {selectedTickers.map((ticker) => (
              <div key={ticker} className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full">
                <span className="font-medium">{ticker}</span>
                <button 
                  onClick={() => removeTicker(ticker)}
                  className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Add Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search and add stocks (e.g., AAPL, MSFT, GOOGL...)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
              {searchResults.map((stock) => (
                <div 
                  key={stock.symbol}
                  onClick={() => addTicker(stock.symbol)}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-gray-900">{stock.symbol}</span>
                      <span className="text-gray-600 ml-2">{stock.name}</span>
                    </div>
                    {selectedTickers.includes(stock.symbol) && (
                      <span className="text-blue-600 text-sm">Added</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Popular Stocks */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Stocks:</h4>
            <div className="flex flex-wrap gap-2">
              {POPULAR_STOCKS.map((ticker) => (
                <button
                  key={ticker}
                  onClick={() => addTicker(ticker)}
                  disabled={selectedTickers.includes(ticker)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedTickers.includes(ticker)
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  {ticker}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload CSV Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Tickers</h4>
            <p className="text-gray-600 mb-4">Upload a CSV file with your stock tickers</p>
            
            <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
              <Upload className="h-5 w-5 mr-2" />
              Choose CSV File
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center">
          <button 
            onClick={analyzePortfolio}
            disabled={selectedTickers.length === 0 || isLoading}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-6 w-6 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="h-6 w-6 mr-2" />
                Analyze My Portfolio
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilder;