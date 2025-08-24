import React, { useState, useEffect } from 'react';
import { Search, X, Upload, TrendingUp, Activity, ArrowRight, RefreshCw, Calendar, DollarSign, Scale, Save, ChevronLeft, ChevronRight, BarChart3, FileText, Plus, Shield, Coins } from 'lucide-react';

const PortfolioBuilder = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [holdings, setHoldings] = useState({});
  const [weightingMode, setWeightingMode] = useState('all1');
  const [totalInvestmentAmount, setTotalInvestmentAmount] = useState(10000);
  const [dateRange, setDateRange] = useState({
    from: '2024-01-01',
    to: '2024-12-31'
  });
  const [portfolioName, setPortfolioName] = useState('');

  const steps = [
    { title: 'Portfolio Selection', subtitle: 'Choose pre-built or upload custom' },
    { title: 'Portfolio Details', subtitle: 'Review and configure holdings' },
    { title: 'Analysis Period', subtitle: 'Select date range' },
    { title: 'Summary', subtitle: 'Review and analyze' }
  ];

  // Pre-built portfolios
  const preBuiltPortfolios = [
    { 
      id: 1, 
      name: 'Magnificent Seven', 
      description: 'Top tech giants driving the market',
      icon: TrendingUp,
      color: 'from-blue-500 to-purple-600',
      tickers: ['AAPL', 'META', 'NVDA', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'] 
    },
    { 
      id: 2, 
      name: 'Defensive Portfolio', 
      description: 'Stable dividend-paying companies',
      icon: Shield,
      color: 'from-green-500 to-emerald-600',
      tickers: ['JNJ', 'PG', 'KO', 'MCD', 'WMT', 'HD', 'V', 'JPM', 'UNH', 'XOM'] 
    },
    { 
      id: 3, 
      name: 'Crypto Related', 
      description: 'Companies exposed to cryptocurrency',
      icon: Coins,
      color: 'from-orange-500 to-red-600',
      tickers: ['COIN', 'MSTR', 'RIOT', 'MARA', 'SQ', 'PYPL', 'HOOD', 'CME'] 
    },
  ];

  // Mock stock prices
  const mockStockPrices = {
    'AAPL': 185.50, 'MSFT': 285.60, 'GOOGL': 2685.40, 'AMZN': 3080.25, 'TSLA': 245.80,
    'NVDA': 485.20, 'META': 325.75, 'NFLX': 420.35, 'JPM': 165.40, 'V': 275.30,
    'JNJ': 162.85, 'WMT': 155.20, 'PG': 145.65, 'UNH': 485.90, 'HD': 315.75,
    'MA': 385.45, 'DIS': 95.25, 'PYPL': 58.75, 'BAC': 32.15, 'ADBE': 485.60,
    'KO': 58.25, 'MCD': 285.40, 'CRM': 245.80, 'SQ': 78.90, 'ROKU': 65.40, 
    'ZM': 68.50, 'COIN': 245.30, 'MSTR': 1250.40, 'RIOT': 12.45, 'MARA': 18.65,
    'HOOD': 15.25, 'CME': 205.80, 'XOM': 102.35
  };

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePreBuiltPortfolioSelect = (portfolio) => {
    setSelectedTickers(portfolio.tickers);
    setPortfolioName(portfolio.name);
    const newHoldings = {};
    portfolio.tickers.forEach(ticker => {
      newHoldings[ticker] = 1;
    });
    setHoldings(newHoldings);
    goToNextStep();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
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
    
    lines.slice(1).forEach((line) => {
      const cells = line.split(',').map(c => c.trim().replace(/['"]/g, ''));
      if (cells[tickerIndex]) {
        const ticker = cells[tickerIndex].toUpperCase();
        newTickers.push(ticker);
        const shares = holdingsIndex >= 0 ? parseInt(cells[holdingsIndex]) || 1 : 1;
        newHoldings[ticker] = Math.max(shares, 1);
      }
    });

    setSelectedTickers(newTickers);
    setHoldings(newHoldings);
    setPortfolioName('Custom Portfolio');
    
    if (holdingsIndex >= 0) {
      setWeightingMode('manual');
    } else {
      setWeightingMode('all1');
    }

    goToNextStep();
  };

  const calculateEqualWeightHoldings = () => {
    if (selectedTickers.length === 0) return {};
    
    const budgetPerStock = totalInvestmentAmount / selectedTickers.length;
    const newHoldings = {};
    selectedTickers.forEach(ticker => {
      const price = mockStockPrices[ticker] || 100;
      const shares = Math.floor(budgetPerStock / price);
      newHoldings[ticker] = Math.max(shares, 1);
    });
    
    return newHoldings;
  };

  const calculateAll1Holdings = () => {
    const newHoldings = {};
    selectedTickers.forEach(ticker => {
      newHoldings[ticker] = 1;
    });
    return newHoldings;
  };

  const setWeightingModeAndUpdate = (mode) => {
    setWeightingMode(mode);
    
    if (mode === 'equalWeight') {
      const equalHoldings = calculateEqualWeightHoldings();
      setHoldings(equalHoldings);
    } else if (mode === 'all1') {
      const all1Holdings = calculateAll1Holdings();
      setHoldings(all1Holdings);
    }
  };

  const updateHoldings = (ticker, shares) => {
    if (weightingMode !== 'manual') {
      setWeightingMode('manual');
    }
    
    const numShares = parseInt(shares) || 0;
    setHoldings(prev => ({
      ...prev,
      [ticker]: numShares
    }));
  };

  const calculateTotalInvestment = () => {
    return selectedTickers.reduce((total, ticker) => {
      const price = mockStockPrices[ticker] || 100;
      const shares = holdings[ticker] || 0;
      return total + (price * shares);
    }, 0);
  };

  const analyzePortfolio = () => {
    const portfolioData = {
      tickers: selectedTickers,
      holdings: holdings,
      dateRange: dateRange,
      portfolioName: portfolioName,
      hasHoldings: Object.keys(holdings).length > 0
    };
    
    sessionStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    onNavigate('analysis');
  };

  // Step 0: Portfolio Selection
  const renderPortfolioSelection = () => (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Select Your Portfolio
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from our expertly crafted portfolios or upload your own
        </p>
      </div>

      {/* Pre-built Portfolios */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Pre-built Portfolios
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {preBuiltPortfolios.map((portfolio) => {
            const IconComponent = portfolio.icon;
            return (
              <div
                key={portfolio.id}
                onClick={() => handlePreBuiltPortfolioSelect(portfolio)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-2xl transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${portfolio.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${portfolio.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        {portfolio.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {portfolio.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {portfolio.tickers.length} stocks
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Custom Portfolio */}
      <div className="border-t pt-12">        
        <div className="max-w-md mx-auto border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Upload Custom Portfolio
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Upload a CSV with your own stock selection
          </p>
          
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
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Required: Ticker/Symbol column | Optional: Holdings/Shares column
          </p>
        </div>
      </div>
    </div>
  );

  // Step 1: Portfolio Details
  const renderPortfolioDetails = () => {
    const isLargePortfolio = selectedTickers.length > 40;
    
    const portfolioTable = (
      <div className={isLargePortfolio ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" : ""}>
        {isLargePortfolio && (
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Holdings ({selectedTickers.length} stocks)
            </h3>
          </div>
        )}
        
        <div className={isLargePortfolio ? "max-h-96 overflow-y-auto" : ""}>
          <table className="w-full">
            <thead className={`${isLargePortfolio ? 'bg-gray-50 dark:bg-gray-700 sticky top-0' : 'bg-gray-50 dark:bg-gray-700'}`}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Ticker</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Shares</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {selectedTickers.map((ticker) => {
                const price = mockStockPrices[ticker] || 100;
                const shares = holdings[ticker] || 0;
                const value = price * shares;
                
                return (
                  <tr key={ticker} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 dark:text-white">{ticker}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      ${price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={shares}
                        onChange={(e) => updateHoldings(ticker, e.target.value)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      ${value.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900 dark:text-white">Total Portfolio Value</span>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              ${calculateTotalInvestment().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Portfolio Configuration
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Review and configure your holdings for {portfolioName}
          </p>
        </div>

        {/* Holdings Header and Weighting Controls */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Holdings ({selectedTickers.length} stocks)
          </h3>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setWeightingModeAndUpdate('all1')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                weightingMode === 'all1'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All 1 Share
            </button>
            
            <button
              onClick={() => setWeightingModeAndUpdate('equalWeight')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                weightingMode === 'equalWeight'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Equal Weight</span>
            </button>
            
            {weightingMode === 'manual' && (
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
                Custom
              </span>
            )}
          </div>
        </div>

        {/* Investment Amount for Equal Weight */}
        {weightingMode === 'equalWeight' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-green-700 dark:text-green-300 font-medium">
                Total Investment Amount
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-green-700 dark:text-green-300">$</span>
                <input
                  type="number"
                  value={totalInvestmentAmount}
                  onChange={(e) => setTotalInvestmentAmount(parseInt(e.target.value) || 10000)}
                  className="w-32 px-3 py-1 border border-green-300 dark:border-green-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="100"
                  step="100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Table */}
        {!isLargePortfolio && portfolioTable}
        {isLargePortfolio && portfolioTable}
      </div>
    );
  };

  // Step 2: Date Range
  const renderDateRange = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analysis Period
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select the date range for your portfolio analysis
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From Date
          </label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To Date
          </label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
        </div>
      </div>
    </div>
  );

  // Step 3: Summary
  const renderSummary = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Portfolio Summary
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review your portfolio before analysis
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Portfolio</p>
              <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{portfolioName}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total Stocks</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{selectedTickers.length}</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Shares</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {Object.values(holdings).reduce((sum, shares) => sum + (shares || 0), 0)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Portfolio Value</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                ${calculateTotalInvestment().toLocaleString()}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 md:col-span-2 lg:col-span-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">Analysis Period</p>
              <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                {dateRange.from} to {dateRange.to}
              </p>
            </div>
            <FileText className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Top Holdings Preview */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Top Holdings</h4>
        <div className="grid gap-3">
          {selectedTickers.slice(0, 5).map((ticker) => {
            const price = mockStockPrices[ticker] || 100;
            const shares = holdings[ticker] || 0;
            const value = price * shares;
            return (
              <div key={ticker} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-white">{ticker}</span>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">{shares} shares</div>
                  <div className="font-medium text-gray-900 dark:text-white">${value.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
          {selectedTickers.length > 5 && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
              ... and {selectedTickers.length - 5} more stocks
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={analyzePortfolio}
          disabled={selectedTickers.length === 0 || !dateRange.from || !dateRange.to}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Activity className="h-6 w-6 mr-2" />
          Analyze My Portfolio
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 0: return renderPortfolioSelection();
      case 1: return renderPortfolioDetails();
      case 2: return renderDateRange();
      case 3: return renderSummary();
      default: return renderPortfolioSelection();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedTickers.length > 0;
      case 1: return selectedTickers.length > 0;
      case 2: return dateRange.from && dateRange.to;
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => onNavigate('landing')}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowRight className="h-5 w-5 rotate-180" />
              </button>
              <div className="w-10 rounded-lg flex items-center justify-center mr-3">
                <img 
                  src="/logo.png" 
                  alt="Numeriaxial Logo" 
                  // className="w-10 h-10 object-contain rounded-lg"
                  // background white 
                  className={`object-contain bg-white`}
                />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Portfolio Analytics
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className={`flex items-center space-x-3 ${
                  index <= currentStep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.subtitle}</p>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < currentStep 
                      ? 'bg-blue-600 dark:bg-blue-400' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="relative overflow-hidden">
          <div 
            className={`transition-transform duration-300 ease-in-out ${
              isTransitioning ? 'transform -translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
            }`}
          >
            {getCurrentStepContent()}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={goToPrevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              currentStep === 0
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>

          {currentStep < steps.length - 1 && (
            <button
              onClick={goToNextStep}
              disabled={!canProceed()}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilder;