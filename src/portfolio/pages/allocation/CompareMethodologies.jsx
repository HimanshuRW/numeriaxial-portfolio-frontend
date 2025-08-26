import React, { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';

const PieChart = ({ methodology, data, onRemove, onStockHover, onStockLeave, hoveredStock, isDark, stockColors, portfolioData }) => {
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

  return (
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

          {/* Stock Legend */}
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
                stockColors={stockColors}
                portfolioData={portfolioData}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompareMethodologies;