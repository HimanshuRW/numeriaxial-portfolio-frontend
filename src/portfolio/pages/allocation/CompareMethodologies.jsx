import { useState } from 'react';
import { Plus} from 'lucide-react';
import PieChart from '../../components/PieChart';

const CompareMethodologies = ({ portfolioData, methodologies, stockColors, isDark }) => {
  const [selectedMethodologies, setSelectedMethodologies] = useState(['Black-Litterman']);
  const [hoveredStock, setHoveredStock] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddMethodology = (methodology) => {
    if (!selectedMethodologies.includes(methodology)) {
      setSelectedMethodologies([...selectedMethodologies, methodology]);
    }
    setIsAddingNew(false);
  };

  const handleRemoveMethodology = (methodology) => {
    if (selectedMethodologies.length > 1) {
      setSelectedMethodologies(selectedMethodologies.filter(m => m !== methodology));
    }
  };

  const handleStockHover = (ticker) => {
    setHoveredStock(ticker);
  };

  const handleStockLeave = () => {
    setHoveredStock(null);
  };

  const getGridCols = (count) => {
    switch(count) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-2';
      case 4: return 'grid-cols-2';
      default: return 'grid-cols-2';
    }
  };

  const getItemClass = (index, count) => {
    if (count === 3 && index === 2) return 'col-span-2 flex justify-center';
    return '';
  };

  // Determine if we need scrollbar for stocks
  const needsScrollbar = portfolioData.stocks.length > 15;
  const maxHeight = needsScrollbar ? 'max-h-96' : '';

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with title and Add Method button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${
            isDark 
              ? 'from-white via-blue-200 to-purple-200' 
              : 'from-gray-900 via-blue-600 to-purple-600'
          } bg-clip-text text-transparent`}>
            Compare Methodologies
          </h1>
          
          {/* Add Methodology Button */}
          <div className="relative">
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className={`px-6 py-3 rounded-xl backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-3 text-sm font-semibold hover:scale-105 group ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500/90 hover:to-purple-500/90 text-white shadow-lg hover:shadow-blue-500/25' 
                  : 'bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-400 hover:to-purple-400 text-white shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              <Plus className={`w-5 h-5 transition-transform duration-300 ${isAddingNew ? 'rotate-45' : 'group-hover:rotate-90'}`} />
              Add Method
            </button>
            
            {isAddingNew && (
              <div className={`absolute top-full right-0 mt-3 w-80 rounded-xl backdrop-blur-xl shadow-2xl z-20 transition-all duration-500 animate-in slide-in-from-top-2 ${
                isDark ? 'bg-gray-800/90 border border-gray-600/50' : 'bg-white/90 border border-gray-200/50'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <div className="relative">
                  {Object.entries(methodologies)
                    .filter(([key]) => !selectedMethodologies.includes(key))
                    .map(([key, method], index) => (
                      <button
                        key={key}
                        onClick={() => handleAddMethodology(key)}
                        className={`w-full px-6 py-4 text-left transition-all duration-300 hover:scale-[1.02] ${
                          isDark 
                            ? 'hover:bg-gray-700/50 border-b border-gray-600/30 text-white last:border-b-0' 
                            : 'hover:bg-gray-50/50 border-b border-gray-100/50 text-gray-900 last:border-b-0'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="font-semibold text-sm">{method.name}</div>
                        <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {method.description}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Compact Left Sidebar - Stocks Only */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl backdrop-blur-xl transition-all duration-500 sticky top-4 ${
              isDark 
                ? 'bg-gray-900/70 border border-gray-700/50 shadow-2xl' 
                : 'bg-white/70 border border-gray-200/50 shadow-2xl'
            }`}>
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              
              <div className="relative p-4">
                {/* Custom scrollbar CSS */}
                <style jsx>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${isDark ? 'rgba(55, 65, 81, 0.1)' : 'rgba(229, 231, 235, 0.3)'};
                    border-radius: 10px;
                    margin: 4px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(45deg, ${isDark ? '#4F46E5, #7C3AED' : '#8B5CF6, #06B6D4'});
                    border-radius: 10px;
                    transition: all 0.3s ease;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(45deg, ${isDark ? '#6366F1, #8B5CF6' : '#7C3AED, #0891B2'});
                    box-shadow: 0 0 10px ${isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(139, 92, 246, 0.4)'};
                  }
                `}</style>
                <h4 className={`text-sm font-bold mb-4 flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${isDark ? 'bg-purple-400' : 'bg-blue-500'}`} />
                  Stocks ({portfolioData.stocks.length})
                </h4>
                
                {/* Scrollable stocks list */}
                <div 
                  className={`space-y-2 ${maxHeight} ${needsScrollbar ? 'overflow-y-auto pr-2 custom-scrollbar' : ''}`}
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: isDark ? '#4F46E5 rgba(55, 65, 81, 0.1)' : '#8B5CF6 rgba(229, 231, 235, 0.3)'
                  }}
                >
                  {portfolioData.stocks
                    .sort((a, b) => b.allocation - a.allocation)
                    .map((stock, index) => (
                      <div
                        key={stock.ticker}
                        className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                          hoveredStock === stock.ticker
                            ? (isDark ? 'bg-blue-500/20 shadow-lg shadow-blue-500/20 border border-blue-400/30' : 'bg-blue-50/70 shadow-lg shadow-blue-500/20 border border-blue-200/50')
                            : (isDark ? 'hover:bg-gray-700/50 backdrop-blur-sm' : 'hover:bg-gray-50/50 backdrop-blur-sm')
                        }`}
                        onMouseEnter={() => handleStockHover(stock.ticker)}
                        onMouseLeave={handleStockLeave}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div
                            className={`w-4 h-4 rounded-full transition-all duration-300 shadow-md ${
                              hoveredStock === stock.ticker ? 'scale-125 shadow-lg' : ''
                            }`}
                            style={{ 
                              backgroundColor: stockColors[stock.ticker],
                              boxShadow: hoveredStock === stock.ticker ? `0 0 15px ${stockColors[stock.ticker]}40` : `0 2px 6px ${stockColors[stock.ticker]}30`
                            }}
                          />
                          <span className={`text-xs font-semibold transition-colors duration-300 ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {stock.ticker}
                          </span>
                          {hoveredStock === stock.ticker && (
                            <div className={`ml-auto w-2 h-2 rounded-full animate-pulse ${
                              isDark ? 'bg-blue-400' : 'bg-blue-600'
                            }`} />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                
                {needsScrollbar && (
                  <div className={`text-xs mt-2 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Scroll for more stocks
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Pie Charts (More space) */}
          <div className="lg:col-span-4">
            <div className={`grid gap-8 ${getGridCols(selectedMethodologies.length)}`}>
              {selectedMethodologies.map((methodology, index) => (
                <div
                  key={methodology}
                  className={`animate-in slide-in-from-bottom-4 fade-in duration-500 ${getItemClass(index, selectedMethodologies.length)}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <PieChart
                    methodology={methodology}
                    data={methodologies[methodology]}
                    onRemove={handleRemoveMethodology}
                    onStockHover={handleStockHover}
                    onStockLeave={handleStockLeave}
                    hoveredStock={hoveredStock}
                    isDark={isDark}
                    stockColors={stockColors}
                    portfolioData={portfolioData}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data for demonstration with more stocks to show scrolling
const mockPortfolioData = {
  stocks: [
    { ticker: 'AAPL', allocation: 25 },
    { ticker: 'GOOGL', allocation: 20 },
    { ticker: 'MSFT', allocation: 18 },
    { ticker: 'AMZN', allocation: 15 },
    { ticker: 'TSLA', allocation: 12 },
    { ticker: 'NVDA', allocation: 10 },
    { ticker: 'META', allocation: 8 },
    { ticker: 'NFLX', allocation: 7 },
    { ticker: 'AMD', allocation: 6 },
    { ticker: 'INTC', allocation: 5 },
    { ticker: 'ORCL', allocation: 4 },
    { ticker: 'CRM', allocation: 3 },
    { ticker: 'ADBE', allocation: 3 },
    { ticker: 'PYPL', allocation: 2 },
    { ticker: 'UBER', allocation: 2 },
    { ticker: 'SPOT', allocation: 1.5 },
    { ticker: 'SQ', allocation: 1.5 },
    { ticker: 'SHOP', allocation: 1 },
    { ticker: 'ZOOM', allocation: 1 },
    { ticker: 'DOCU', allocation: 0.5 }
  ]
};

const mockMethodologies = {
  'Black-Litterman': {
    name: 'Black-Litterman',
    short: 'B-L',
    description: 'Advanced Bayesian approach',
    expectedReturn: 12.5,
    sharpeRatio: 1.45,
    allocations: { 'AAPL': 25, 'GOOGL': 20, 'MSFT': 18, 'AMZN': 15, 'TSLA': 12, 'NVDA': 10 }
  },
  'HRP Optimization': {
    name: 'HRP Optimization',
    short: 'HRP',
    description: 'Hierarchical Risk Parity',
    expectedReturn: 10.8,
    sharpeRatio: 1.32,
    allocations: { 'AAPL': 30, 'MSFT': 25, 'GOOGL': 20, 'NVDA': 15, 'TSLA': 10 }
  },
  'MPT Optimization': {
    name: 'MPT Optimization',
    short: 'MPT',
    description: 'Modern Portfolio Theory',
    expectedReturn: 11.2,
    sharpeRatio: 1.38,
    allocations: { 'AAPL': 22, 'MSFT': 22, 'GOOGL': 21, 'AMZN': 20, 'TSLA': 15 }
  },
  'Equal Weight': {
    name: 'Equal Weight',
    short: 'EW',
    description: 'Equal allocation strategy',
    expectedReturn: 9.5,
    sharpeRatio: 1.15,
    allocations: { 'AAPL': 16.7, 'GOOGL': 16.7, 'MSFT': 16.7, 'AMZN': 16.7, 'TSLA': 16.6, 'NVDA': 16.6 }
  }
};

const mockStockColors = {
  'AAPL': '#007AFF', 'GOOGL': '#EA4335', 'MSFT': '#00BCF2', 'AMZN': '#FF9500', 
  'TSLA': '#1DB954', 'NVDA': '#76B900', 'META': '#1877F2', 'NFLX': '#E50914',
  'AMD': '#ED1C24', 'INTC': '#0071C5', 'ORCL': '#F80000', 'CRM': '#00A1E0',
  'ADBE': '#FF0000', 'PYPL': '#003087', 'UBER': '#000000', 'SPOT': '#1ED760',
  'SQ': '#000000', 'SHOP': '#95BF47', 'ZOOM': '#2D8CFF', 'DOCU': '#513FFF'
};

// Demo component with dark theme
const Demo = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      <CompareMethodologies
        portfolioData={mockPortfolioData}
        methodologies={mockMethodologies}
        stockColors={mockStockColors}
        isDark={true}
      />
    </div>
  );
};

export default CompareMethodologies;
// export default Demo;