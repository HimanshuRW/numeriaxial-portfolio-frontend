import React, { useState } from 'react';
import { Search, X, Upload, TrendingUp, Activity, ArrowRight, RefreshCw, Calendar, DollarSign, Scale } from 'lucide-react';
import { SP500_STOCKS, POPULAR_STOCKS } from './data/stockData';
import { portfolioAPI } from './api/portfolioAPI';

const PortfolioBuilder = ({ onNavigate }) => {
  const [selectedTickers, setSelectedTickers] = useState(['AAPL', 'MSFT', 'GOOGL']);
  const [holdings, setHoldings] = useState({}); // Store holdings for each ticker
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [weightingMode, setWeightingMode] = useState('all1'); // 'all1', 'equalWeight', or 'manual'
  const [totalInvestmentAmount, setTotalInvestmentAmount] = useState(10000);
  const [uploadedCsvInfo, setUploadedCsvInfo] = useState(null); // Track uploaded CSV info
  const [dateRange, setDateRange] = useState({
    from: '2024-01-01',
    to: '2024-12-31'
  });

  // Mock stock prices for equal weighting calculation
  const mockStockPrices = {
    'AAPL': 185.50, 'MSFT': 285.60, 'GOOGL': 2685.40, 'AMZN': 3080.25, 'TSLA': 245.80,
    'NVDA': 485.20, 'META': 325.75, 'NFLX': 420.35, 'JPM': 165.40, 'V': 275.30,
    'JNJ': 162.85, 'WMT': 155.20, 'PG': 145.65, 'UNH': 485.90, 'HD': 315.75,
    'MA': 385.45, 'DIS': 95.25, 'PYPL': 58.75, 'BAC': 32.15, 'ADBE': 485.60
  };

  // Calculate equal weight holdings based on stock prices and total investment
  const calculateEqualWeightHoldings = () => {
    if (selectedTickers.length === 0) return {};
    
    const budgetPerStock = totalInvestmentAmount / selectedTickers.length;
    
    const newHoldings = {};
    selectedTickers.forEach(ticker => {
      const price = mockStockPrices[ticker] || 100; // Default price if not found
      const shares = Math.floor(budgetPerStock / price);
      newHoldings[ticker] = Math.max(shares, 1); // Ensure at least 1 share
    });
    
    return newHoldings;
  };

  // Calculate all 1 holdings
  const calculateAll1Holdings = () => {
    const newHoldings = {};
    selectedTickers.forEach(ticker => {
      newHoldings[ticker] = 1;
    });
    return newHoldings;
  };

  // Handle weighting mode changes
  const setWeightingModeAndUpdate = (mode) => {
    setWeightingMode(mode);
    
    if (mode === 'equalWeight') {
      const equalHoldings = calculateEqualWeightHoldings();
      setHoldings(equalHoldings);
    } else if (mode === 'all1') {
      const all1Holdings = calculateAll1Holdings();
      setHoldings(all1Holdings);
    }
    // 'manual' mode doesn't automatically update holdings
  };

  // Update holdings when relevant dependencies change
  React.useEffect(() => {
    if (weightingMode === 'equalWeight') {
      const equalHoldings = calculateEqualWeightHoldings();
      setHoldings(equalHoldings);
    } else if (weightingMode === 'all1') {
      const all1Holdings = calculateAll1Holdings();
      setHoldings(all1Holdings);
    }
  }, [selectedTickers, weightingMode, totalInvestmentAmount]);

  // Calculate total investment
  const calculateTotalInvestment = () => {
    return selectedTickers.reduce((total, ticker) => {
      const price = mockStockPrices[ticker] || 100;
      const shares = holdings[ticker] || 0;
      return total + (price * shares);
    }, 0);
  };

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
      // Set initial holdings based on current mode
      if (weightingMode === 'all1') {
        setHoldings(prev => ({ ...prev, [symbol]: 1 }));
      } else if (weightingMode === 'manual' && !holdings[symbol]) {
        setHoldings(prev => ({ ...prev, [symbol]: 1 }));
      }
      // Equal weight mode will be handled by useEffect
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  // Remove ticker
  const removeTicker = (symbol) => {
    setSelectedTickers(selectedTickers.filter(ticker => ticker !== symbol));
    // Remove holdings for removed ticker
    const newHoldings = { ...holdings };
    delete newHoldings[symbol];
    setHoldings(newHoldings);
  };

  // Update holdings for a specific ticker
  const updateHoldings = (ticker, shares) => {
    if (weightingMode !== 'manual') {
      setWeightingMode('manual'); // Switch to manual mode when user edits
    }
    
    const numShares = parseInt(shares) || 0;
    setHoldings(prev => ({
      ...prev,
      [ticker]: numShares
    }));
  };

  // Handle CSV upload with validation and portfolio replacement
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim()); // Remove empty lines
    
    if (lines.length < 2) {
      alert('CSV file must contain at least a header row and one data row.');
      return;
    }

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/['"]/g, ''));
    
    const tickerIndex = headers.findIndex(h => h.includes('ticker') || h.includes('symbol'));
    const holdingsIndex = headers.findIndex(h => h.includes('holding') || h.includes('shares') || h.includes('quantity'));
    
    if (tickerIndex === -1) {
      alert('CSV file must contain a "Ticker" or "Symbol" column.');
      return;
    }
    
    const newTickers = [];
    const newHoldings = {};
    const invalidTickers = [];
    
    // Process each row and validate tickers
    lines.slice(1).forEach((line, index) => {
      const cells = line.split(',').map(c => c.trim().replace(/['"]/g, ''));
      if (cells[tickerIndex]) {
        const ticker = cells[tickerIndex].toUpperCase();
        
        // Validate if ticker exists in our stock database
        if (SP500_STOCKS.some(stock => stock.symbol === ticker)) {
          newTickers.push(ticker);
          // If holdings column exists, use it; otherwise default to 1
          const shares = holdingsIndex >= 0 ? parseInt(cells[holdingsIndex]) || 1 : 1;
          newHoldings[ticker] = Math.max(shares, 1); // Ensure at least 1 share
        } else {
          invalidTickers.push(ticker);
        }
      }
    });

    // Show validation results
    if (invalidTickers.length > 0) {
      const proceed = window.confirm(
        `The following tickers are not recognized and will be skipped:\n${invalidTickers.join(', ')}\n\nDo you want to proceed with the valid tickers?`
      );
      if (!proceed) return;
    }

    if (newTickers.length === 0) {
      alert('No valid tickers found in the CSV file.');
      return;
    }

    // Replace entire portfolio with CSV data
    setSelectedTickers(newTickers);
    setHoldings(newHoldings);
    
    // Set weighting mode based on whether holdings were provided
    if (holdingsIndex >= 0) {
      setWeightingMode('manual');
    } else {
      setWeightingMode('all1');
    }

    // Store CSV info for display
    setUploadedCsvInfo({
      fileName: file.name,
      totalTickers: newTickers.length,
      invalidTickers: invalidTickers.length,
      hasHoldings: holdingsIndex >= 0,
      uploadedAt: new Date().toLocaleTimeString()
    });

    // Success message
    alert(`Successfully loaded ${newTickers.length} stocks from ${file.name}!`);
  };

  // Analyze portfolio
  const analyzePortfolio = async () => {
    if (selectedTickers.length === 0) return;
    if (!dateRange.from || !dateRange.to) {
      alert('Please select both start and end dates for your portfolio analysis.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Prepare portfolio data
      const portfolioData = {
        tickers: selectedTickers,
        holdings: holdings,
        dateRange: dateRange,
        hasHoldings: Object.keys(holdings).length > 0
      };
      
      // Store portfolio data in sessionStorage
      sessionStorage.setItem('portfolioData', JSON.stringify(portfolioData));
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
        {/* Date Range Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Analysis Period</h3>
            <span className="ml-2 text-red-500">*</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Selected Stocks Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Selected Stocks</h3>
            </div>
            
            {/* Weighting Mode Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setWeightingModeAndUpdate('all1')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  weightingMode === 'all1'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-sm font-medium">All 1</span>
              </button>
              
              <button
                onClick={() => setWeightingModeAndUpdate('equalWeight')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  weightingMode === 'equalWeight'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span className="text-sm font-medium">Equal Weight</span>
              </button>
              
              {weightingMode === 'manual' && (
                <span className="text-sm text-gray-500 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                  Manual Mode
                </span>
              )}
            </div>
          </div>
          
          {/* Total Investment Amount Input for Equal Weight Mode */}
          {weightingMode === 'equalWeight' && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Total Investment Amount
                  </label>
                  <p className="text-xs text-green-600">
                    This amount will be equally distributed across all selected stocks
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-700 font-medium">$</span>
                  <input
                    type="number"
                    value={totalInvestmentAmount}
                    onChange={(e) => setTotalInvestmentAmount(parseInt(e.target.value) || 10000)}
                    className="w-32 px-3 py-2 border border-green-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="100"
                    step="100"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {selectedTickers.map((ticker) => (
              <div key={ticker} className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full">
                    <span className="font-medium text-sm">{ticker}</span>
                  </div>
                  <span className="text-gray-600 text-sm">
                    ${mockStockPrices[ticker]?.toFixed(2) || '100.00'} per share
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <input
                      type="number"
                      placeholder="Shares"
                      value={holdings[ticker] || ''}
                      onChange={(e) => updateHoldings(ticker, e.target.value)}
                      className="w-20 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      min="0"
                    />
                    <span className="text-xs text-gray-500">shares</span>
                  </div>
                  
                  <button 
                    onClick={() => removeTicker(ticker)}
                    className="hover:bg-red-100 text-red-600 rounded-full p-1 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mode Status Information */}
          {weightingMode === 'equalWeight' && selectedTickers.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                <Scale className="w-4 h-4 inline mr-1" />
                Equal weight mode: ${totalInvestmentAmount.toLocaleString()} distributed equally across {selectedTickers.length} stocks (${Math.floor(totalInvestmentAmount / selectedTickers.length).toLocaleString()} per stock).
              </p>
            </div>
          )}
          
          {weightingMode === 'all1' && selectedTickers.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                All 1 mode: Each stock has exactly 1 share. You can edit any value to switch to manual mode.
              </p>
            </div>
          )}
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
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        ${mockStockPrices[stock.symbol]?.toFixed(2) || '100.00'}
                      </span>
                      {selectedTickers.includes(stock.symbol) && (
                        <span className="text-blue-600 text-sm">Added</span>
                      )}
                    </div>
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
            <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Portfolio CSV</h4>
            <p className="text-gray-600 mb-4">
              Upload a CSV with tickers (required) and holdings (optional)<br/>
              <span className="text-sm text-gray-500">
                Columns: Ticker/Symbol, Holdings/Shares/Quantity (optional)
              </span>
            </p>
            
            <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
              <Upload className="h-5 w-5 mr-2" />
              {uploadedCsvInfo ? 'Choose Another CSV' : 'Choose CSV File'}
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Currently Uploaded CSV Info */}
          {uploadedCsvInfo && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-medium text-blue-900 mb-2">📁 Currently Loaded CSV</h5>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p><strong>File:</strong> {uploadedCsvInfo.fileName}</p>
                    <p><strong>Stocks Loaded:</strong> {uploadedCsvInfo.totalTickers}</p>
                    <p><strong>Holdings:</strong> {uploadedCsvInfo.hasHoldings ? 'Yes (Custom shares)' : 'No (Default 1 share each)'}</p>
                    <p><strong>Uploaded:</strong> {uploadedCsvInfo.uploadedAt}</p>
                    {uploadedCsvInfo.invalidTickers > 0 && (
                      <p className="text-orange-600">
                        <strong>⚠️ Skipped:</strong> {uploadedCsvInfo.invalidTickers} invalid ticker(s)
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setUploadedCsvInfo(null)}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  title="Clear CSV info"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Portfolio Summary */}
        {selectedTickers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Portfolio Summary</h4>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-600 font-medium">Total Stocks</div>
                <div className="text-xl font-bold text-blue-900">{selectedTickers.length}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-green-600 font-medium">Total Shares</div>
                <div className="text-xl font-bold text-green-900">
                  {Object.values(holdings).reduce((sum, shares) => sum + (shares || 0), 0)}
                </div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-orange-600 font-medium">Total Investment</div>
                <div className="text-xl font-bold text-orange-900">
                  ${calculateTotalInvestment().toLocaleString()}
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-purple-600 font-medium">Analysis Period</div>
                <div className="text-sm font-bold text-purple-900">
                  {dateRange.from} to {dateRange.to}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <div className="text-center">
          <button 
            onClick={analyzePortfolio}
            disabled={selectedTickers.length === 0 || isLoading || !dateRange.from || !dateRange.to}
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
          
          {(selectedTickers.length === 0 || !dateRange.from || !dateRange.to) && (
            <p className="text-sm text-gray-500 mt-2">
              {selectedTickers.length === 0 ? 'Please select at least one stock' : 'Please select date range'} to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilder;