import React, { useState, useEffect } from 'react';
import { Plus, X, TrendingUp, Target, BarChart3, Zap, Brain, Shield, Layers } from 'lucide-react';

// Mock data - same structure as before
const portfolioData = {
  stocks: [
    { ticker: "AAPL", name: "Apple Inc.", allocation: 25 },
    { ticker: "MSFT", name: "Microsoft", allocation: 20 },
    { ticker: "GOOGL", name: "Alphabet", allocation: 18 },
    { ticker: "AMZN", name: "Amazon", allocation: 15 },
    { ticker: "TSLA", name: "Tesla", allocation: 12 },
    { ticker: "NVDA", name: "NVIDIA", allocation: 10 }
  ]
};

const stockColors = {
  "AAPL": "#007AFF",
  "MSFT": "#00D4AA", 
  "GOOGL": "#FF6B35",
  "AMZN": "#FFD23F",
  "TSLA": "#FF3B30",
  "NVDA": "#AF52DE"
};

const methodologies = {
  'Black-Litterman': {
    name: 'Black-Litterman',
    short: 'BL',
    description: 'Bayesian approach with market views',
    expectedReturn: 12.4,
    sharpeRatio: 1.23,
    risk: 14.2,
    icon: Brain,
    allocations: {
      "AAPL": 28.5,
      "MSFT": 22.1,
      "GOOGL": 18.7,
      "AMZN": 14.2,
      "TSLA": 10.8,
      "NVDA": 5.7
    }
  },
  'Mean Reversion': {
    name: 'Mean Reversion',
    short: 'MR',
    description: 'Historical mean-based optimization',
    expectedReturn: 11.8,
    sharpeRatio: 1.15,
    risk: 15.1,
    icon: TrendingUp,
    allocations: {
      "AAPL": 24.3,
      "MSFT": 20.8,
      "GOOGL": 19.2,
      "AMZN": 16.1,
      "TSLA": 12.4,
      "NVDA": 7.2
    }
  },
  'Risk Parity': {
    name: 'Risk Parity',
    short: 'RP',
    description: 'Equal risk contribution approach',
    expectedReturn: 10.9,
    sharpeRatio: 1.08,
    risk: 12.8,
    icon: Shield,
    allocations: {
      "AAPL": 18.5,
      "MSFT": 18.9,
      "GOOGL": 17.8,
      "AMZN": 17.2,
      "TSLA": 14.1,
      "NVDA": 13.5
    }
  },
  'Maximum Sharpe': {
    name: 'Maximum Sharpe',
    short: 'MS',
    description: 'Optimized risk-adjusted returns',
    expectedReturn: 13.2,
    sharpeRatio: 1.31,
    risk: 16.4,
    icon: Target,
    allocations: {
      "AAPL": 32.1,
      "MSFT": 25.4,
      "GOOGL": 16.8,
      "AMZN": 12.3,
      "TSLA": 8.9,
      "NVDA": 4.5
    }
  }
};

const MethodologyCard = ({ methodology, data, onRemove, onSelect, isSelected, isDark, stockColors, hoveredStock, onStockHover, onStockLeave }) => {
  const IconComponent = data.icon;
  
  const chartData = portfolioData.stocks
    .map(stock => ({
      ...stock,
      allocation: data.allocations[stock.ticker] || 0,
      color: stockColors[stock.ticker]
    }))
    .filter(stock => stock.allocation > 0)
    .sort((a, b) => b.allocation - a.allocation);

  const maxAllocation = Math.max(...chartData.map(stock => stock.allocation));

  return (
    <div className={`relative group transition-all duration-500 transform ${
      isSelected ? 'scale-105 z-10' : 'hover:scale-102'
    }`}>
      <div className={`rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
        isDark 
          ? `bg-gradient-to-br from-gray-800 to-gray-900 border ${isSelected ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : 'border-gray-700 hover:border-gray-600'}` 
          : `bg-gradient-to-br from-white to-gray-50 border ${isSelected ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : 'border-gray-200 hover:border-gray-300'}`
      }`} onClick={onSelect}>
        
        {/* Remove button */}
        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(methodology);
            }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl transition-colors duration-300 ${
              isDark ? 'bg-blue-600/20' : 'bg-blue-100'
            }`}>
              <IconComponent className={`w-6 h-6 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-bold text-lg transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{data.name}</h3>
              <p className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>{data.description}</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={`p-3 rounded-xl transition-colors duration-300 ${
            isDark ? 'bg-green-600/10 border border-green-600/20' : 'bg-green-50 border border-green-100'
          }`}>
            <div className={`text-xs font-medium mb-1 ${
              isDark ? 'text-green-400' : 'text-green-600'
            }`}>Return</div>
            <div className={`text-lg font-bold ${
              isDark ? 'text-green-300' : 'text-green-700'
            }`}>{data.expectedReturn.toFixed(1)}%</div>
          </div>
          
          <div className={`p-3 rounded-xl transition-colors duration-300 ${
            isDark ? 'bg-blue-600/10 border border-blue-600/20' : 'bg-blue-50 border border-blue-100'
          }`}>
            <div className={`text-xs font-medium mb-1 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>Sharpe</div>
            <div className={`text-lg font-bold ${
              isDark ? 'text-blue-300' : 'text-blue-700'
            }`}>{data.sharpeRatio.toFixed(2)}</div>
          </div>
          
          <div className={`p-3 rounded-xl transition-colors duration-300 ${
            isDark ? 'bg-red-600/10 border border-red-600/20' : 'bg-red-50 border border-red-100'
          }`}>
            <div className={`text-xs font-medium mb-1 ${
              isDark ? 'text-red-400' : 'text-red-600'
            }`}>Risk</div>
            <div className={`text-lg font-bold ${
              isDark ? 'text-red-300' : 'text-red-700'
            }`}>{data.risk.toFixed(1)}%</div>
          </div>
        </div>

        {/* Modern Bar Chart */}
        <div className="space-y-3">
          <h4 className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>Portfolio Allocation</h4>
          
          {chartData.map((stock, index) => (
            <div
              key={stock.ticker}
              className={`group/stock transition-all duration-300 ${
                hoveredStock && hoveredStock !== stock.ticker ? 'opacity-40' : 'opacity-100'
              }`}
              onMouseEnter={() => onStockHover(stock.ticker)}
              onMouseLeave={onStockLeave}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      hoveredStock === stock.ticker ? 'scale-125 shadow-md' : ''
                    }`}
                    style={{ backgroundColor: stock.color }}
                  />
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{stock.ticker}</span>
                </div>
                <span className={`text-sm font-bold ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>{stock.allocation.toFixed(1)}%</span>
              </div>
              
              <div className={`h-2 rounded-full overflow-hidden transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out relative"
                  style={{
                    backgroundColor: stock.color,
                    width: `${(stock.allocation / maxAllocation) * 100}%`,
                    transform: hoveredStock === stock.ticker ? 'scaleY(1.2)' : 'scaleY(1)',
                    filter: hoveredStock === stock.ticker ? 'brightness(1.2)' : 'brightness(1)',
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {hoveredStock === stock.ticker && (
                    <div className="absolute inset-0 animate-pulse bg-white/20 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Glow effect for selected cards */}
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl bg-blue-500/10 -z-10 blur-xl" />
      )}
    </div>
  );
};

const ComparisonRadar = ({ selectedMethods, methodologies, isDark }) => {
  if (selectedMethods.length < 2) return null;

  const metrics = ['Return', 'Sharpe', 'Risk (inv)'];
  const center = 100;
  const radius = 70;
  
  // Normalize data for radar chart
  const normalizeData = (methods) => {
    const allReturns = methods.map(m => methodologies[m].expectedReturn);
    const allSharpe = methods.map(m => methodologies[m].sharpeRatio);
    const allRisks = methods.map(m => methodologies[m].risk);
    
    const maxReturn = Math.max(...allReturns);
    const maxSharpe = Math.max(...allSharpe);
    const maxRisk = Math.max(...allRisks);
    
    return methods.map(method => {
      const data = methodologies[method];
      return {
        method,
        values: [
          (data.expectedReturn / maxReturn) * radius,
          (data.sharpeRatio / maxSharpe) * radius,
          ((maxRisk - data.risk + 1) / maxRisk) * radius // Inverted risk
        ]
      };
    });
  };

  const normalizedData = normalizeData(selectedMethods);
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

  return (
    <div className={`rounded-2xl p-6 transition-colors duration-300 ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <h3 className={`text-xl font-bold mb-6 text-center ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Performance Comparison</h3>
      
      <div className="flex justify-center">
        <svg width="200" height="200">
          {/* Grid circles */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius * scale}
              fill="none"
              stroke={isDark ? '#374151' : '#E5E7EB'}
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          
          {/* Grid lines */}
          {metrics.map((_, i) => {
            const angle = (i * 2 * Math.PI) / metrics.length - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke={isDark ? '#374151' : '#E5E7EB'}
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}
          
          {/* Labels */}
          {metrics.map((metric, i) => {
            const angle = (i * 2 * Math.PI) / metrics.length - Math.PI / 2;
            const x = center + (radius + 20) * Math.cos(angle);
            const y = center + (radius + 20) * Math.sin(angle);
            return (
              <text
                key={i}
                x={x}
                y={y + 4}
                textAnchor="middle"
                className={`text-xs font-medium ${
                  isDark ? 'fill-gray-300' : 'fill-gray-600'
                }`}
              >
                {metric}
              </text>
            );
          })}
          
          {/* Data polygons */}
          {normalizedData.map((item, methodIndex) => {
            const points = item.values.map((value, i) => {
              const angle = (i * 2 * Math.PI) / metrics.length - Math.PI / 2;
              const x = center + value * Math.cos(angle);
              const y = center + value * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ');
            
            return (
              <g key={item.method}>
                <polygon
                  points={points}
                  fill={colors[methodIndex]}
                  fillOpacity="0.1"
                  stroke={colors[methodIndex]}
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
                {/* Data points */}
                {item.values.map((value, i) => {
                  const angle = (i * 2 * Math.PI) / metrics.length - Math.PI / 2;
                  const x = center + value * Math.cos(angle);
                  const y = center + value * Math.sin(angle);
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={colors[methodIndex]}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center mt-4 space-x-4">
        {selectedMethods.map((method, i) => (
          <div key={method} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[i] }}
            />
            <span className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>{methodologies[method].short}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PortfolioComparison = () => {
  const [selectedMethodologies, setSelectedMethodologies] = useState(['Black-Litterman']);
  const [hoveredStock, setHoveredStock] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddMethodology = (methodology) => {
    if (!selectedMethodologies.includes(methodology) && selectedMethodologies.length < 4) {
      setSelectedMethodologies([...selectedMethodologies, methodology]);
    }
    setIsAddingNew(false);
  };

  const handleRemoveMethodology = (methodology) => {
    if (selectedMethodologies.length > 1) {
      setSelectedMethodologies(selectedMethodologies.filter(m => m !== methodology));
    }
  };

  const handleSelectMethod = (methodology) => {
    if (!selectedMethodologies.includes(methodology)) {
      handleAddMethodology(methodology);
    }
  };

  const handleStockHover = (ticker) => {
    setHoveredStock(ticker);
  };

  const handleStockLeave = () => {
    setHoveredStock(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Portfolio Optimization</h1>
            <p className={`text-lg mt-2 transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Compare different optimization methodologies</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'bg-gray-800 hover:bg-gray-900 text-white'
              }`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            
            {/* Add methodology */}
            <div className="relative">
              <button
                onClick={() => setIsAddingNew(!isAddingNew)}
                disabled={selectedMethodologies.length >= 4}
                className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium ${
                  selectedMethodologies.length >= 4
                    ? (isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                    : (isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
                }`}
              >
                <Plus className="w-5 h-5" />
                Add Method
              </button>
              
              {isAddingNew && selectedMethodologies.length < 4 && (
                <div className={`absolute top-full right-0 mt-2 w-80 rounded-xl shadow-2xl z-20 overflow-hidden transition-colors duration-300 ${
                  isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  {Object.entries(methodologies)
                    .filter(([key]) => !selectedMethodologies.includes(key))
                    .map(([key, method]) => {
                      const IconComponent = method.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => handleAddMethodology(key)}
                          className={`w-full p-4 text-left transition-colors duration-150 flex items-center space-x-3 ${
                            isDark 
                              ? 'hover:bg-gray-700 border-b border-gray-700 last:border-b-0' 
                              : 'hover:bg-gray-50 border-b border-gray-100 last:border-b-0'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            isDark ? 'bg-blue-600/20' : 'bg-blue-100'
                          }`}>
                            <IconComponent className={`w-4 h-4 ${
                              isDark ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <div className={`font-medium ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>{method.name}</div>
                            <div className={`text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>{method.description}</div>
                          </div>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stock Legend */}
        <div className={`rounded-2xl p-6 mb-8 transition-colors duration-300 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Stock Universe</h3>
          <div className="flex flex-wrap gap-4">
            {portfolioData.stocks.map((stock) => (
              <div
                key={stock.ticker}
                className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  hoveredStock === stock.ticker
                    ? (isDark ? 'bg-blue-800/50 scale-105' : 'bg-blue-50 scale-105')
                    : (isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200')
                }`}
                onMouseEnter={() => handleStockHover(stock.ticker)}
                onMouseLeave={handleStockLeave}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    hoveredStock === stock.ticker ? 'scale-125 shadow-lg' : ''
                  }`}
                  style={{ backgroundColor: stockColors[stock.ticker] }}
                />
                <div>
                  <span className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{stock.ticker}</span>
                  <span className={`text-sm ml-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{stock.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Selected Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {selectedMethodologies.map((methodology, index) => (
              <div
                key={methodology}
                className="animate-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MethodologyCard
                  methodology={methodology}
                  data={methodologies[methodology]}
                  onRemove={handleRemoveMethodology}
                  onSelect={() => {}}
                  isSelected={true}
                  isDark={isDark}
                  stockColors={stockColors}
                  hoveredStock={hoveredStock}
                  onStockHover={handleStockHover}
                  onStockLeave={handleStockLeave}
                />
              </div>
            ))}
          </div>

          {/* Comparison Chart */}
          {selectedMethodologies.length >= 2 && (
            <div className="animate-in fade-in-0 duration-700">
              <ComparisonRadar
                selectedMethods={selectedMethodologies}
                methodologies={methodologies}
                isDark={isDark}
              />
            </div>
          )}

          {/* Available Methods */}
          {Object.keys(methodologies).filter(key => !selectedMethodologies.includes(key)).length > 0 && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Available Methods</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(methodologies)
                  .filter(([key]) => !selectedMethodologies.includes(key))
                  .map(([key, data], index) => (
                    <div
                      key={key}
                      className="opacity-60 hover:opacity-100 transition-all duration-300"
                    >
                      <MethodologyCard
                        methodology={key}
                        data={data}
                        onRemove={() => {}}
                        onSelect={() => handleSelectMethod(key)}
                        isSelected={false}
                        isDark={isDark}
                        stockColors={stockColors}
                        hoveredStock={hoveredStock}
                        onStockHover={handleStockHover}
                        onStockLeave={handleStockLeave}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioComparison;