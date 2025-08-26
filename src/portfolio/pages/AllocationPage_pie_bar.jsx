import React, { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';

// Mock theme context since useTheme is not available
const useTheme = () => ({ isDark: true });

// Sample portfolio data
const portfolioData = {
  stocks: [
    { ticker: 'AAPL', allocation: 22.5, return: 15.2, volatility: 18.3, beta: 1.2 },
    { ticker: 'MSFT', allocation: 18.7, return: 12.8, volatility: 16.1, beta: 1.1 },
    { ticker: 'GOOGL', allocation: 15.3, return: 8.9, volatility: 21.2, beta: 1.3 },
    { ticker: 'AMZN', allocation: 12.1, return: 6.4, volatility: 24.8, beta: 1.4 },
    { ticker: 'TSLA', allocation: 9.8, return: 28.5, volatility: 35.2, beta: 2.1 },
    { ticker: 'NVDA', allocation: 8.6, return: 45.3, volatility: 32.7, beta: 1.9 },
    { ticker: 'META', allocation: 7.2, return: 22.1, volatility: 28.9, beta: 1.6 },
    { ticker: 'NFLX', allocation: 5.8, return: -8.2, volatility: 26.4, beta: 1.5 }
  ]
};

const methodologies = {
  'Black-Litterman': {
    name: 'Black-Litterman',
    short: 'BL',
    description: 'Bayesian approach combining market equilibrium',
    expectedReturn: 14.8,
    sharpeRatio: 0.82,
    allocations: {
      'AAPL': 22.5, 'MSFT': 18.7, 'GOOGL': 15.3, 'AMZN': 12.1, 
      'TSLA': 9.8, 'NVDA': 8.6, 'META': 7.2, 'NFLX': 5.8
    }
  },
  'HRP Optimization': {
    name: 'HRP Optimization',
    short: 'HRP',
    description: 'Hierarchical Risk Parity clustering',
    expectedReturn: 16.2,
    sharpeRatio: 0.74,
    allocations: {
      'AAPL': 16.8, 'MSFT': 16.2, 'GOOGL': 14.9, 'AMZN': 13.7, 
      'TSLA': 12.4, 'NVDA': 11.1, 'META': 9.6, 'NFLX': 5.3
    }
  },
  'MPT Optimization': {
    name: 'MPT Optimization',
    short: 'MPT',
    description: 'Modern Portfolio Theory optimization',
    expectedReturn: 13.5,
    sharpeRatio: 0.91,
    allocations: {
      'AAPL': 25.3, 'MSFT': 21.4, 'GOOGL': 18.2, 'AMZN': 15.1, 
      'TSLA': 8.9, 'NVDA': 6.2, 'META': 3.4, 'NFLX': 1.5
    }
  },
  'Equal Weight': {
    name: 'Equal Weight',
    short: 'EW',
    description: 'Equal allocation across all assets',
    expectedReturn: 15.6,
    sharpeRatio: 0.65,
    allocations: {
      'AAPL': 12.5, 'MSFT': 12.5, 'GOOGL': 12.5, 'AMZN': 12.5, 
      'TSLA': 12.5, 'NVDA': 12.5, 'META': 12.5, 'NFLX': 12.5
    }
  }
};

const stockColors = {
  'AAPL': '#4A7BFF', 'MSFT': '#4AC759', 'GOOGL': '#FF9B44', 'AMZN': '#FF5555',
  'TSLA': '#B366E6', 'NVDA': '#52D974', 'META': '#5BC4E6', 'NFLX': '#FF5D9E'
};

const PieChart = ({ methodology, data, onRemove, onStockHover, onStockLeave, hoveredStock, isDark }) => {
  const svgRef = useRef();
  const center = 100;
  const radius = 70;
  const labelRadius = 85;
  
  const chartData = portfolioData.stocks
    .map(stock => ({
      ...stock,
      allocation: data.allocations[stock.ticker] || 0,
      color: stockColors[stock.ticker]
    }))
    .filter(stock => stock.allocation > 0)
    .sort((a, b) => b.allocation - a.allocation);

  if (chartData.length === 0) {
    return (
      <div className={`relative rounded-xl shadow-lg p-4 transition-all duration-300 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="text-center text-gray-500">No data available</div>
      </div>
    );
  }

  let cumulativePercentage = 0;
  const arcs = chartData.map(stock => {
    const startAngle = (cumulativePercentage / 100) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((cumulativePercentage + stock.allocation) / 100) * 2 * Math.PI - Math.PI / 2;
    const midAngle = (startAngle + endAngle) / 2;
    
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    
    // Label position
    const labelX = center + labelRadius * Math.cos(midAngle);
    const labelY = center + labelRadius * Math.sin(midAngle);
    
    const largeArcFlag = stock.allocation > 50 ? 1 : 0;
    
    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    cumulativePercentage += stock.allocation;
    
    return {
      ...stock,
      pathData,
      labelX,
      labelY,
      isHovered: hoveredStock === stock.ticker
    };
  });

  return (
    <div className={`relative rounded-xl shadow-lg p-4 transition-all duration-300 ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      {/* Remove button */}
      <button
        onClick={() => onRemove(methodology)}
        className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
      >
        <X className="w-3 h-3 text-red-600" />
      </button>
      
      {/* Header */}
      <div className="mb-3">
        <h4 className={`text-sm font-semibold transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>{data.name}</h4>
      </div>
      
      {/* SVG Pie Chart */}
      <div className="flex justify-center mb-4 relative">
        <svg 
          ref={svgRef}
          width="200" 
          height="200" 
          className="drop-shadow-sm"
        >
          <defs>
            <filter id={`shadow-${methodology.replace(/\s+/g, '-')}`}>
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.1)" />
            </filter>
          </defs>
          
          {/* Pie segments */}
          {arcs.map((arc, index) => (
            <g key={`${arc.ticker}-${index}`}>
              <path
                d={arc.pathData}
                fill={arc.color}
                stroke={isDark ? "#374151" : "white"}
                strokeWidth="2"
                className={`transition-all duration-300 cursor-pointer ${
                  hoveredStock && hoveredStock !== arc.ticker ? 'opacity-30' : 'opacity-100'
                }`}
                style={{
                  filter: `url(#shadow-${methodology.replace(/\s+/g, '-')})`,
                  transformOrigin: `${center}px ${center}px`,
                  transform: arc.isHovered ? 'scale(1.05)' : 'scale(1)',
                  filter: arc.isHovered ? 'brightness(1.2) drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'brightness(1)'
                }}
                onMouseEnter={() => onStockHover(arc.ticker)}
                onMouseLeave={onStockLeave}
              />
            </g>
          ))}
          
          {/* Labels */}
          {arcs.map((arc, index) => (
            <g key={`label-${arc.ticker}-${index}`}>
              <text
                x={arc.labelX}
                y={arc.labelY - 4}
                textAnchor="middle"
                className={`text-xs font-medium transition-all duration-300 pointer-events-none ${
                  isDark ? 'fill-gray-300' : 'fill-gray-600'
                } ${arc.isHovered ? 'fill-white font-bold' : ''}`}
                style={{
                  textShadow: arc.isHovered ? '1px 1px 2px rgba(0,0,0,0.8)' : '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {arc.ticker}
              </text>
              <text
                x={arc.labelX}
                y={arc.labelY + 8}
                textAnchor="middle"
                className={`text-xs transition-all duration-300 pointer-events-none ${
                  isDark ? 'fill-gray-400' : 'fill-gray-500'
                } ${arc.isHovered ? 'fill-white font-bold' : ''}`}
                style={{
                  textShadow: arc.isHovered ? '1px 1px 2px rgba(0,0,0,0.8)' : '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {arc.allocation.toFixed(1)}%
              </text>
            </g>
          ))}
          
          {/* Center circle with methodology abbreviation */}
          <circle
            cx={center}
            cy={center}
            r="25"
            fill={isDark ? "#1F2937" : "white"}
            stroke={isDark ? "#4B5563" : "#E5E7EB"}
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          <text
            x={center}
            y={center + 4}
            textAnchor="middle"
            className={`text-xs font-bold ${isDark ? 'fill-white' : 'fill-gray-700'}`}
          >
            {data.short}
          </text>
        </svg>
      </div>

      {/* Metrics */}
      <div className={`grid grid-cols-2 gap-3 pt-3 border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="text-center">
          <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Expected Return
          </div>
          <div className={`text-sm font-bold mt-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            {data.expectedReturn.toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Sharpe Ratio
          </div>
          <div className={`text-sm font-bold mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            {data.sharpeRatio.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

const AllocationComparisonPage = () => {
  const { isDark } = useTheme();
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

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* First section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`text-lg font-bold mb-6 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Compare Methodologies</h3>
              
              {/* Add Methodology Button */}
              <div className="relative mb-6">
                <button
                  onClick={() => setIsAddingNew(!isAddingNew)}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add Method
                </button>
                
                {isAddingNew && (
                  <div className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-20 overflow-hidden transition-colors duration-300 ${
                    isDark ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
                  }`}>
                    {Object.entries(methodologies)
                      .filter(([key]) => !selectedMethodologies.includes(key))
                      .map(([key, method]) => (
                        <button
                          key={key}
                          onClick={() => handleAddMethodology(key)}
                          className={`w-full px-4 py-3 text-left transition-colors duration-150 ${
                            isDark 
                              ? 'hover:bg-gray-600 border-b border-gray-600 text-white last:border-b-0' 
                              : 'hover:bg-gray-50 border-b border-gray-100 text-gray-900 last:border-b-0'
                          }`}
                        >
                          <div className="font-medium text-sm">{method.name}</div>
                          <div className={`text-xs mt-1 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                            {method.description}
                          </div>
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Stock Legend - Simplified */}
              <div className="space-y-2">
                <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Stock Legend
                </h4>
                {portfolioData.stocks
                  .sort((a, b) => b.allocation - a.allocation)
                  .map((stock) => (
                    <div
                      key={stock.ticker}
                      className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        hoveredStock === stock.ticker
                          ? (isDark ? 'bg-blue-800/50' : 'bg-blue-50')
                          : (isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                      }`}
                      onMouseEnter={() => handleStockHover(stock.ticker)}
                      onMouseLeave={handleStockLeave}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full transition-all duration-200 ${
                            hoveredStock === stock.ticker ? 'scale-125 shadow-md' : ''
                          }`}
                          style={{ backgroundColor: stockColors[stock.ticker] }}
                        />
                        <span className={`text-sm font-medium transition-colors duration-300 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{stock.ticker}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Side - Pie Charts */}
          <div className="lg:col-span-3">
            <div className={`grid gap-6 ${getGridCols(selectedMethodologies.length)}`}>
              {selectedMethodologies.map((methodology, index) => (
                <div
                  key={methodology}
                  className={`slide-in ${getItemClass(index, selectedMethodologies.length)}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PieChart
                    methodology={methodology}
                    data={methodologies[methodology]}
                    onRemove={handleRemoveMethodology}
                    onStockHover={handleStockHover}
                    onStockLeave={handleStockLeave}
                    hoveredStock={hoveredStock}
                    isDark={isDark}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Weights Comparison Section */}
        <div className="mt-12">
          <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-3 text-center transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Portfolio Weights Comparison</h3>
            
            <div>
              <div className="min-w-full" style={{ minWidth: '800px' }}>
                <PortfolioComparisonChart isDark={isDark} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// New Portfolio Comparison Chart Component
const PortfolioComparisonChart = ({ isDark }) => {
  const methodologyColors = {
    'MPT': '#FF5D9E',
    'HRP': '#52D974', 
    'Black-Litterman': '#4A7BFF'
  };

  const chartData = portfolioData.stocks.map(stock => ({
    ticker: stock.ticker,
    'Black-Litterman': methodologies['Black-Litterman'].allocations[stock.ticker],
    'HRP Optimization': methodologies['HRP Optimization'].allocations[stock.ticker],
    'MPT Optimization': methodologies['MPT Optimization'].allocations[stock.ticker]
  }));

  const maxValue = Math.max(...chartData.flatMap(stock => [
    stock['Black-Litterman'], 
    stock['HRP Optimization'], 
    stock['MPT Optimization']
  ]));

  const barWidth = 60;
  const barSpacing = 8;
  const groupSpacing = 40;
  const chartHeight = 300;
  // const chartPadding = { top: 20, right: 60, bottom: 60, left: 60 };
  const chartPadding = { top: 0, right: 10, bottom: 20, left: 30 };
  
  const chartWidth = chartData.length * (barWidth * 3 + barSpacing * 2 + groupSpacing) - groupSpacing + chartPadding.left + chartPadding.right;

  return (
    <div className="w-full">
      <svg 
        width="100%" 
        style={{ padding : `${chartPadding.top}px ${chartPadding.right}px ${chartPadding.bottom}px ${chartPadding.left}px` }}
        // height={chartHeight + chartPadding.top + chartPadding.bottom}
        viewBox={`0 0 ${chartWidth} ${chartHeight + chartPadding.top + chartPadding.bottom}`}
        className="overflow-visible"
        
      >
        <defs>
          {/* Gradients for bars */}
          <linearGradient id="blGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: methodologyColors['Black-Litterman'], stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: methodologyColors['Black-Litterman'], stopOpacity: 0.7 }} />
          </linearGradient>
          <linearGradient id="hrpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: methodologyColors['HRP'], stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: methodologyColors['HRP'], stopOpacity: 0.7 }} />
          </linearGradient>
          <linearGradient id="mptGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: methodologyColors['MPT'], stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: methodologyColors['MPT'], stopOpacity: 0.7 }} />
          </linearGradient>
        </defs>

        {/* Y-axis gridlines */}
        {[0, 0.05, 0.1, 0.15, 0.2, 0.25].map(value => (
          <g key={value}>
            <line
              x1={chartPadding.left}
              y1={chartPadding.top + chartHeight - (value / 0.3) * chartHeight}
              x2={chartWidth - chartPadding.right}
              y2={chartPadding.top + chartHeight - (value / 0.3) * chartHeight}
              stroke={isDark ? "#374151" : "#E5E7EB"}
              strokeWidth="1"
              opacity="0.5"
            />
            <text
              x={chartPadding.left - 10}
              y={chartPadding.top + chartHeight - (value / 0.3) * chartHeight + 4}
              textAnchor="end"
              className={`text-2xl font-medium ${isDark ? 'fill-gray-400' : 'fill-gray-600'}`}
            >
              {(value * 100).toFixed(0)}%
            </text>
          </g>
        ))}

        {/* Bars */}
        {chartData.map((stock, stockIndex) => {
          const groupX = chartPadding.left + stockIndex * (barWidth * 3 + barSpacing * 2 + groupSpacing);
          
          return (
            <g key={stock.ticker}>
              {/* Black-Litterman Bar */}
              <rect
                x={groupX}
                y={chartPadding.top + chartHeight - (stock['Black-Litterman'] / 30) * chartHeight}
                width={barWidth}
                height={(stock['Black-Litterman'] / 30) * chartHeight}
                fill="url(#blGradient)"
                stroke={methodologyColors['Black-Litterman']}
                strokeWidth="1"
                className="transition-all duration-300 hover:opacity-80"
                rx="4"
              />
              
              {/* HRP Bar */}
              <rect
                x={groupX + barWidth + barSpacing}
                y={chartPadding.top + chartHeight - (stock['HRP Optimization'] / 30) * chartHeight}
                width={barWidth}
                height={(stock['HRP Optimization'] / 30) * chartHeight}
                fill="url(#hrpGradient)"
                stroke={methodologyColors['HRP']}
                strokeWidth="1"
                className="transition-all duration-300 hover:opacity-80"
                rx="4"
              />
              
              {/* MPT Bar */}
              <rect
                x={groupX + (barWidth + barSpacing) * 2}
                y={chartPadding.top + chartHeight - (stock['MPT Optimization'] / 30) * chartHeight}
                width={barWidth}
                height={(stock['MPT Optimization'] / 30) * chartHeight}
                fill="url(#mptGradient)"
                stroke={methodologyColors['MPT']}
                strokeWidth="1"
                className="transition-all duration-300 hover:opacity-80"
                rx="4"
              />

              {/* Stock ticker label */}
              <text
                x={groupX + (barWidth * 3 + barSpacing * 2) / 2}
                y={chartHeight + chartPadding.top + 25}
                textAnchor="middle"
                className={`text-xl font-medium ${isDark ? 'fill-gray-300' : 'fill-gray-700'}`}
              >
                {stock.ticker}
              </text>
            </g>
          );
        })}

        {/* Y-axis label */}
        <text
          x={0}
          y={chartHeight/2-60}
          textAnchor="middle"
          className={`text-2xl font-semibold ${isDark ? 'fill-gray-300' : 'fill-gray-700'}`}
          transform={`rotate(-90, 20, ${chartPadding.top + chartHeight / 2})`}
        >
          Weight
        </text>
      </svg>

      {/* Legend */}
      <div className="flex justify-center mt-4 space-x-8">
        {Object.entries(methodologyColors).map(([method, color]) => (
          <div key={method} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: color }}
            />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {method === 'Black-Litterman' ? 'Black-Litterman' : method}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllocationComparisonPage;