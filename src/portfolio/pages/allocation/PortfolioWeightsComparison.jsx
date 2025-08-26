import React from 'react';

const PortfolioWeightsComparison = ({ portfolioData, methodologies, isDark }) => {
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

  const barWidth = 60;
  const barSpacing = 8;
  const groupSpacing = 40;
  const chartHeight = 300;
  const chartPadding = { top: 0, right: 10, bottom: 20, left: 30 };
  
  const chartWidth = chartData.length * (barWidth * 3 + barSpacing * 2 + groupSpacing) - groupSpacing + chartPadding.left + chartPadding.right;

  return (
    <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <h3 className={`text-xl font-bold mb-3 text-center transition-colors duration-300 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Portfolio Weights Comparison</h3>
      
      <div>
        <div className="min-w-full" style={{ minWidth: '800px' }}>
          <svg 
            width="100%" 
            style={{ padding: `${chartPadding.top}px ${chartPadding.right}px ${chartPadding.bottom}px ${chartPadding.left}px` }}
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
      </div>
    </div>
  );
};

export default PortfolioWeightsComparison;