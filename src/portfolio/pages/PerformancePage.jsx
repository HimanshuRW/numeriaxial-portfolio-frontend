import React, { useState, useMemo } from 'react';
import { DollarSign, Activity, Target, Shield, Calculator, AlertTriangle, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';
import AdvancedLineChart from '../components/AdvancedLineChart';

const PerformancePage = ({ portfolioData, timePeriod, onStockClick }) => {
  const [leftComparisonActive, setLeftComparisonActive] = useState(false);
  const [rightComparisonMode, setRightComparisonMode] = useState(null); // 'sp500' or 'portfolio'
  const [selectedStock, setSelectedStock] = useState('AAPL'); // Default to highest allocation stock
  const [sortColumn, setSortColumn] = useState('allocation'); // Default sort by % of Portfolio
  const [sortDirection, setSortDirection] = useState('desc'); // Default descending

  const [itemsPerPage, setItemsPerPage] = useState(10); // Add this line
  
  const currentChartData = portfolioData.chartData[timePeriod] || portfolioData.chartData.weekly;
  
  // Calculate individual stock data for enhanced table
  const enhancedStocks = portfolioData.stocks.map(stock => {
    const marketValue = (portfolioData.statistics.totalValue * stock.allocation / 100);
    const todaysChange = marketValue * (stock.return / 100) * 0.1; // Simulate today's change
    const totalGainLoss = marketValue * (stock.return / 100);
    const currentPrice = stock.mean || 150; // Use mean price or fallback
    
    return {
      ...stock,
      marketValue: marketValue,
      currentPrice: currentPrice,
      todaysChange: todaysChange,
      todaysChangePercent: (todaysChange / marketValue * 100),
      totalGainLoss: totalGainLoss,
      totalGainLossPercent: stock.return,
      position: Math.round(marketValue / currentPrice)
    };
  });

  // Sort the stocks based on current sort column and direction
  const sortedStocks = useMemo(() => {
    const sorted = [...enhancedStocks].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortColumn) {
        case 'name':
          aValue = a.ticker;
          bValue = b.ticker;
          break;
        case 'position':
          aValue = a.position;
          bValue = b.position;
          break;
        case 'marketValue':
          aValue = a.marketValue;
          bValue = b.marketValue;
          break;
        case 'price':
          aValue = a.currentPrice;
          bValue = b.currentPrice;
          break;
        case 'todaysChange':
          aValue = a.todaysChange;
          bValue = b.todaysChange;
          break;
        case 'gainLoss':
          aValue = a.totalGainLoss;
          bValue = b.totalGainLoss;
          break;
        case 'allocation':
          aValue = a.allocation;
          bValue = b.allocation;
          break;
        default:
          aValue = a.allocation;
          bValue = b.allocation;
      }
      
      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
    });
    
    return sorted;
  }, [enhancedStocks, sortColumn, sortDirection]);

  // Handle column sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to descending
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Render sort indicator - always renders to maintain consistent width
  const renderSortIndicator = (column) => {
    if (sortColumn !== column) {
      return <div className="w-4 h-4 mr-2" />; // Invisible placeholder
    }
    
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 mr-2 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 mr-2 text-blue-600" />
    );
  };

  // Get chart data for left chart (Portfolio with optional S&P500)
  const getLeftChartData = () => {
    if (leftComparisonActive) {
      return {
        primary: currentChartData.map(point => ({ date: point.date, value: point.portfolio })),
        secondary: currentChartData.map(point => ({ date: point.date, value: point.benchmark })),
        primaryLabel: "Portfolio",
        secondaryLabel: "S&P 500"
      };
    } else {
      return {
        primary: currentChartData.map(point => ({ date: point.date, value: point.portfolio })),
        secondary: null,
        primaryLabel: "Portfolio",
        secondaryLabel: null
      };
    }
  };

  // Get chart data for right chart (Stock with optional comparison)
  const getRightChartData = () => {
    const selectedStockData = enhancedStocks.find(s => s.ticker === selectedStock);
    if (!selectedStockData) return null;
    
    // Generate stock price data based on portfolio performance and stock characteristics
    const stockData = currentChartData.map(point => ({
      date: point.date,
      value: point.portfolio * (selectedStockData.return / portfolioData.statistics.totalReturn) * 
             (selectedStockData.currentPrice / 100) // Scale to realistic stock price
    }));

    if (rightComparisonMode === 'sp500') {
      return {
        primary: stockData,
        secondary: currentChartData.map(point => ({ date: point.date, value: point.benchmark })),
        primaryLabel: selectedStock,
        secondaryLabel: "S&P 500"
      };
    } else if (rightComparisonMode === 'portfolio') {
      return {
        primary: stockData,
        secondary: currentChartData.map(point => ({ date: point.date, value: point.portfolio })),
        primaryLabel: selectedStock,
        secondaryLabel: "Portfolio"
      };
    } else {
      return {
        primary: stockData,
        secondary: null,
        primaryLabel: selectedStock,
        secondaryLabel: null
      };
    }
  };

  const handleRowClick = (ticker, event) => {
    // Only navigate to stock page if clicking on the stock name
    if (event.target.closest('.stock-name-cell')) {
      onStockClick(ticker);
    } else {
      // Otherwise, just update the selected stock for right chart
      setSelectedStock(ticker);
    }
  };

  const handleLeftComparison = () => {
    setLeftComparisonActive(!leftComparisonActive);
  };

  const handleRightComparison = (mode) => {
    if (rightComparisonMode === mode) {
      setRightComparisonMode(null); // Deactivate if same button clicked
    } else {
      setRightComparisonMode(mode); // Activate new mode
    }
  };

  return (
    <div className="space-y-8">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl">💰</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Portfolio Value</h3>
          <p className="text-2xl font-bold text-gray-900">${portfolioData.statistics.totalValue.toLocaleString()}</p>
          <p className="text-sm text-green-600 flex items-center mt-2">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{portfolioData.statistics.totalReturn}% Total Return
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Sharpe Ratio</h3>
          <p className="text-2xl font-bold text-gray-900">{portfolioData.statistics.sharpeRatio}</p>
          <p className="text-sm text-blue-600 mt-2">Risk-Adjusted Return</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Treynor Ratio</h3>
          <p className="text-2xl font-bold text-gray-900">{portfolioData.statistics.treynorRatio}</p>
          <p className="text-sm text-purple-600 mt-2">Beta-Adjusted Return</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl">🛡️</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Sortino Ratio</h3>
          <p className="text-2xl font-bold text-gray-900">{portfolioData.statistics.sortinoRatio}</p>
          <p className="text-sm text-orange-600 mt-2">Downside Risk Adj.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-2xl">📈</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Information Ratio</h3>
          <p className="text-2xl font-bold text-gray-900">{portfolioData.statistics.informationRatio}</p>
          <p className="text-sm text-indigo-600 mt-2">Active Return</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl">📉</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Max Drawdown</h3>
          <p className="text-2xl font-bold text-gray-900">{portfolioData.statistics.maxDrawdown}%</p>
          <p className="text-sm text-red-600 mt-2">Worst Decline</p>
        </div>
      </div>

      {/* Two Side-by-Side Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Chart - Portfolio Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-800">Portfolio Performance Over Time</h4>
            <button
              onClick={handleLeftComparison}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                leftComparisonActive
                  ? 'bg-orange-100 text-orange-700 border border-orange-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              S&P 500
            </button>
          </div>
          <AdvancedLineChart 
            data={getLeftChartData()}
            primaryColor="#2563EB"
            secondaryColor="#D97706"
          />
        </div>

        {/* Right Chart - Stock Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-800">{selectedStock} Performance</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => handleRightComparison('sp500')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  rightComparisonMode === 'sp500'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                vs S&P 500
              </button>
              <button
                onClick={() => handleRightComparison('portfolio')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  rightComparisonMode === 'portfolio'
                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                vs Portfolio
              </button>
            </div>
          </div>
          <AdvancedLineChart 
            data={getRightChartData()}
            primaryColor="#059669"
            secondaryColor={rightComparisonMode === 'sp500' ? '#DC2626' : '#7C3AED'}
          />
          <div className="mt-3 text-center">
            <span className="text-xs text-gray-500">
              Click on any stock row below to change comparison
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Stock Performance Table with Sorting */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Portfolio Holdings
          </h3>
          
          {/* Items Per Page Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={2}>2</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={enhancedStocks.length}>All ({enhancedStocks.length})</option>
            </select>
            <span className="text-sm text-gray-600">stocks</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th 
                  className="text-left py-4 px-4 font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    {renderSortIndicator('name')}
                    Name
                  </div>
                </th>
                <th 
                  className="text-right py-4 px-4 font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer select-none"
                  onClick={() => handleSort('position')}
                >
                  <div className="flex items-center justify-end">
                    {renderSortIndicator('position')}
                    Position
                  </div>
                </th>
                <th 
                  className="text-right py-4 px-4 font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer select-none"
                  onClick={() => handleSort('marketValue')}
                >
                  <div className="flex items-center justify-end">
                    {renderSortIndicator('marketValue')}
                    Market Value
                  </div>
                </th>
                <th 
                  className="text-right py-4 px-4 font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer select-none"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end">
                    {renderSortIndicator('price')}
                    Price
                  </div>
                </th>
                <th 
                  className="text-right py-4 px-4 font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer select-none"
                  onClick={() => handleSort('todaysChange')}
                >
                  <div className="flex items-center justify-end">
                    {renderSortIndicator('todaysChange')}
                    Today's Change
                  </div>
                </th>
                <th 
                  className="text-right py-4 px-4 font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer select-none"
                  onClick={() => handleSort('gainLoss')}
                >
                  <div className="flex items-center justify-end">
                    {renderSortIndicator('gainLoss')}
                    Gain/Loss
                  </div>
                </th>
                <th 
                  className="text-right py-4 px-4 font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer select-none"
                  onClick={() => handleSort('allocation')}
                >
                  <div className="flex items-center justify-end">
                    {renderSortIndicator('allocation')}
                    % of Portfolio
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStocks.slice(0, itemsPerPage).map((stock, index) => (
                <tr 
                  key={stock.ticker} 
                  className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                    selectedStock === stock.ticker ? 'bg-blue-50' : ''
                  }`}
                  onClick={(e) => handleRowClick(stock.ticker, e)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][index % 4]
                        }}
                      ></div>
                      <span 
                        className="font-semibold text-gray-900 hover:text-blue-600 stock-name-cell"
                        title="Click to view detailed analysis"
                      >
                        {stock.ticker}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-medium">
                    {stock.position.toLocaleString()} shares
                  </td>
                  <td className="py-4 px-4 text-right font-medium">
                    ${stock.marketValue.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-600">
                    ${stock.currentPrice.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-medium ${
                      stock.todaysChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.todaysChange >= 0 ? '+' : ''}${Math.abs(stock.todaysChange).toFixed(0)} ({stock.todaysChangePercent >= 0 ? '+' : ''}{stock.todaysChangePercent.toFixed(1)}%)
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-medium ${
                      stock.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.totalGainLoss >= 0 ? '+' : ''}${Math.abs(stock.totalGainLoss).toFixed(0)} ({stock.totalGainLossPercent >= 0 ? '+' : ''}{stock.totalGainLossPercent.toFixed(1)}%)
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900">
                    {stock.allocation}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Updated footer with pagination info */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <p>• Click on stock name to view detailed analysis</p>
            <p>• Click anywhere else on the row to compare with portfolio in the right chart</p>
            <p>• Click on column headers to sort the table</p>
          </div>
          {itemsPerPage < enhancedStocks.length && (
            <div className="text-sm text-gray-500">
              Showing {Math.min(itemsPerPage, enhancedStocks.length)} of {enhancedStocks.length} stocks
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;