import React, { useRef } from 'react';
import { X, TrendingUp, BarChart3 } from 'lucide-react';

const PieChart = ({ methodology, data, onRemove, onStockHover, onStockLeave, hoveredStock, isDark, stockColors, portfolioData }) => {
  const svgRef = useRef();
  const center = 100;
  const radius = 70;
  const labelRadius = radius + 12;
  
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
      <div className={`relative w-full rounded-2xl backdrop-blur-xl transition-all duration-500 hover:scale-105 group ${
        isDark 
          ? 'bg-gray-900/70 border border-gray-700/50 shadow-2xl' 
          : 'bg-white/70 border border-gray-200/50 shadow-2xl'
      }`}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative p-4">
          <div className="text-center text-gray-500 py-8">No data available</div>
        </div>
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
    <div className={`relative w-full rounded-2xl backdrop-blur-xl transition-all duration-500 hover:scale-105 group ${
      isDark 
        ? 'bg-gray-900/70 border border-gray-700/50 shadow-2xl hover:shadow-purple-500/20' 
        : 'bg-white/70 border border-gray-200/50 shadow-2xl hover:shadow-blue-500/20'
    }`}>
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {/* Remove button */}
      <button
        onClick={() => onRemove(methodology)}
        className="absolute top-3 right-3 w-7 h-7 backdrop-blur-md bg-red-500/20 hover:bg-red-500/30 border border-red-300/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group"
      >
        <X className="w-3 h-3 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
      </button>
      
      {/* Content */}
      <div className="relative p-3">
        {/* Header - more compact */}
        <div className="mb-3 pr-8">
          <h4 className={`text-sm font-bold transition-colors duration-300 bg-gradient-to-r ${
            isDark 
              ? 'from-white to-gray-300 bg-clip-text text-transparent' 
              : 'from-gray-900 to-gray-600 bg-clip-text text-transparent'
          }`}>
            {data.name}
          </h4>
        </div>
        
        {/* SVG Pie Chart - larger and more space */}
        <div className="flex justify-center mb-3 relative">
          <div className="relative">
            <svg 
              ref={svgRef}
              width="200" 
              height="200" 
              className="drop-shadow-xl transition-transform duration-300 hover:scale-105"
            >
              <defs>
                <filter id={`glow-${methodology.replace(/\s+/g, '-')}`}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id={`shadow-${methodology.replace(/\s+/g, '-')}`}>
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.15)" />
                </filter>
                <radialGradient id={`centerGradientDark-${methodology.replace(/\s+/g, '-')}`} cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#374151" />
                  <stop offset="100%" stopColor="#1F2937" />
                </radialGradient>
                <radialGradient id={`centerGradientLight-${methodology.replace(/\s+/g, '-')}`} cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f8fafc" />
                </radialGradient>
              </defs>
              
              {/* Pie segments */}
              {arcs.map((arc, index) => (
                <g key={`${arc.ticker}-${index}`}>
                  <path
                    d={arc.pathData}
                    fill={arc.color}
                    stroke={isDark ? "#1F2937" : "white"}
                    strokeWidth="3"
                    className={`transition-all duration-500 cursor-pointer ${
                      hoveredStock && hoveredStock !== arc.ticker ? 'opacity-30' : 'opacity-100'
                    }`}
                    style={{
                      filter: arc.isHovered 
                        ? `url(#glow-${methodology.replace(/\s+/g, '-')}) url(#shadow-${methodology.replace(/\s+/g, '-')})` 
                        : `url(#shadow-${methodology.replace(/\s+/g, '-')})`,
                      transformOrigin: `${center}px ${center}px`,
                      transform: arc.isHovered ? 'scale(1.08)' : 'scale(1)',
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
                    className={`text-xs font-bold transition-all duration-300 pointer-events-none ${
                      isDark ? 'fill-gray-300' : 'fill-gray-600'
                    } ${arc.isHovered ? 'fill-white' : ''}`}
                    style={{
                      textShadow: arc.isHovered ? '2px 2px 4px rgba(0,0,0,0.8)' : '1px 1px 3px rgba(0,0,0,0.5)',
                      filter: arc.isHovered ? 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' : 'none'
                    }}
                  >
                    {arc.ticker}
                  </text>
                  <text
                    x={arc.labelX}
                    y={arc.labelY + 10}
                    textAnchor="middle"
                    className={`text-xs font-semibold transition-all duration-300 pointer-events-none ${
                      isDark ? 'fill-gray-400' : 'fill-gray-500'
                    } ${arc.isHovered ? 'fill-white' : ''}`}
                    style={{
                      textShadow: arc.isHovered ? '2px 2px 4px rgba(0,0,0,0.8)' : '1px 1px 3px rgba(0,0,0,0.5)',
                      filter: arc.isHovered ? 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' : 'none'
                    }}
                  >
                    {arc.allocation.toFixed(1)}%
                  </text>
                </g>
              ))}
              
              {/* Center circle with enhanced styling */}
              <circle
                cx={center}
                cy={center}
                r="26"
                fill={isDark ? `url(#centerGradientDark-${methodology.replace(/\s+/g, '-')})` : `url(#centerGradientLight-${methodology.replace(/\s+/g, '-')})`}
                stroke={isDark ? "#374151" : "#E5E7EB"}
                strokeWidth="2"
                className="drop-shadow-lg"
              />
              
              <text
                x={center}
                y={center + 4}
                textAnchor="middle"
                className={`text-sm font-bold ${isDark ? 'fill-white' : 'fill-gray-700'}`}
              >
                {data.short}
              </text>
            </svg>
          </div>
        </div>

        {/* Enhanced Metrics - more compact */}
        <div className={`grid grid-cols-2 gap-2 pt-3 border-t ${
          isDark ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          <div className={`text-center p-2 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
            isDark ? 'bg-green-500/10 border border-green-400/20' : 'bg-green-50/70 border border-green-200/30'
          }`}>
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className={`w-3 h-3 mr-1 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Return
              </div>
            </div>
            <div className={`text-base font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              {data.expectedReturn.toFixed(1)}%
            </div>
          </div>
          
          <div className={`text-center p-2 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
            isDark ? 'bg-blue-500/10 border border-blue-400/20' : 'bg-blue-50/70 border border-blue-200/30'
          }`}>
            <div className="flex items-center justify-center mb-1">
              <BarChart3 className={`w-3 h-3 mr-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Sharpe
              </div>
            </div>
            <div className={`text-base font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {data.sharpeRatio.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;