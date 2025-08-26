import React from 'react';

const PortfolioAnalyticsSection = ({ methodologyAnalytics, isDark }) => {
  const colors = {
    'Black-Litterman': '#4A7BFF',
    'HRP': '#FF5555', 
    'MPT': '#FF69B4'
  };

  // const isBorder = false;
  // const cards_p = 0;
  const isBorder = true;
  const cards_p = 3;
  const card_width = 340;

  // Risk-Return Scatter Plot Component
  const RiskReturnChart = () => {
    // const width = 300;
    const width = card_width;
    const height = 200;
    const padding = 40;
    
    const xMax = 0.5;
    const yMax = 0.6;
    
    return (
      <div className={`rounded-xl p-${cards_p} transition-all duration-300 ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }
      ${isBorder ? 'border  shadow-lg' : 'border-0'}
      `}>
        <h4 className={`text-lg font-semibold mb-4 text-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Risk-Return Profile</h4>
        
        <svg width={width} height={height} className="mx-auto">
          {/* Grid lines */}
          {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map(x => (
            <line
              key={x}
              x1={padding + (x / xMax) * (width - 2 * padding)}
              y1={padding}
              x2={padding + (x / xMax) * (width - 2 * padding)}
              y2={height - padding}
              stroke={isDark ? "#374151" : "#E5E7EB"}
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
          {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map(y => (
            <line
              key={y}
              x1={padding}
              y1={height - padding - (y / yMax) * (height - 2 * padding)}
              x2={width - padding}
              y2={height - padding - (y / yMax) * (height - 2 * padding)}
              stroke={isDark ? "#374151" : "#E5E7EB"}
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
          
          {/* Data points */}
          {Object.entries(methodologyAnalytics).map(([method, data]) => (
            <g key={method}>
              <circle
                cx={padding + (data.risk / xMax) * (width - 2 * padding)}
                cy={height - padding - (data.return / yMax) * (height - 2 * padding)}
                r="8"
                fill={colors[method]}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300 hover:r-10 cursor-pointer drop-shadow-sm"
              />
              <text
                x={padding + (data.risk / xMax) * (width - 2 * padding)}
                y={height - padding - (data.return / yMax) * (height - 2 * padding) - 15}
                textAnchor="middle"
                className={`text-xs font-medium ${isDark ? 'fill-gray-300' : 'fill-gray-700'}`}
              >
                {method}
              </text>
            </g>
          ))}
          
          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke={isDark ? "#6B7280" : "#374151"} strokeWidth="2" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke={isDark ? "#6B7280" : "#374151"} strokeWidth="2" />
          
          {/* Axis labels */}
          <text x={width/2} y={height - 10} textAnchor="middle" className={`text-sm font-medium ${isDark ? 'fill-gray-300' : 'fill-gray-700'}`}>
            Risk (Volatility)
          </text>
          <text x={20} y={height/2} textAnchor="middle" transform={`rotate(-90, 20, ${height/2})`} className={`text-sm font-medium ${isDark ? 'fill-gray-300' : 'fill-gray-700'}`}>
            Expected Return
          </text>
        </svg>
      </div>
    );
  };

  // Sharpe Ratio Comparison Component
  const SharpeChart = () => {
    // const width = 300;
    const width = card_width;
    const height = 200;
    const padding = 40;
    
    const methods = Object.keys(methodologyAnalytics);
    const maxSharpe = Math.max(...Object.values(methodologyAnalytics).map(d => d.sharpe));
    const minSharpe = Math.min(...Object.values(methodologyAnalytics).map(d => d.sharpe));
    const range = maxSharpe - minSharpe;
    const barWidth = (width - 2 * padding) / methods.length * 0.7;
    
    return (
      <div className={`rounded-xl p-${cards_p} transition-all duration-300 ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }
      ${isBorder ? 'border shadow-lg' : 'border-0'}
      `}>
        <h4 className={`text-lg font-semibold mb-4 text-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Sharpe Ratio Comparison</h4>
        
        <svg width={width} height={height} className="mx-auto">
          {/* Grid lines */}
          {[-0.5, 0, 0.5, 1.0].map(value => (
            <line
              key={value}
              x1={padding}
              y1={height - padding - ((value - minSharpe) / range) * (height - 2 * padding)}
              x2={width - padding}
              y2={height - padding - ((value - minSharpe) / range) * (height - 2 * padding)}
              stroke={isDark ? "#374151" : "#E5E7EB"}
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          
          {/* Zero line */}
          <line
            x1={padding}
            y1={height - padding - ((0 - minSharpe) / range) * (height - 2 * padding)}
            x2={width - padding}
            y2={height - padding - ((0 - minSharpe) / range) * (height - 2 * padding)}
            stroke={isDark ? "#6B7280" : "#374151"}
            strokeWidth="2"
            opacity="0.8"
          />
          
          {/* Bars */}
          {methods.map((method, index) => {
            const data = methodologyAnalytics[method];
            const x = padding + (index + 0.15) * ((width - 2 * padding) / methods.length);
            const barHeight = Math.abs(data.sharpe - 0) / range * (height - 2 * padding);
            const y = data.sharpe >= 0 
              ? height - padding - ((0 - minSharpe) / range) * (height - 2 * padding) - barHeight
              : height - padding - ((0 - minSharpe) / range) * (height - 2 * padding);
            
            return (
              <g key={method}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={colors[method]}
                  stroke="white"
                  strokeWidth="1"
                  className="transition-all duration-300 hover:opacity-80"
                  rx="4"
                />
                {/* Value label */}
                <text
                  x={x + barWidth / 2}
                  y={data.sharpe >= 0 ? y - 8 : y + barHeight + 16}
                  textAnchor="middle"
                  className={`text-xs font-medium ${isDark ? 'fill-gray-300' : 'fill-gray-700'}`}
                >
                  {data.sharpe.toFixed(3)}
                </text>
                {/* Method label */}
                <text
                  x={x + barWidth / 2}
                  y={height - padding + 20}
                  textAnchor="middle"
                  className={`text-xs font-medium ${isDark ? 'fill-gray-300' : 'fill-gray-700'}`}
                >
                  {method}
                </text>
              </g>
            );
          })}
          
          {/* Y-axis */}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke={isDark ? "#6B7280" : "#374151"} strokeWidth="2" />
          
          {/* Y-axis label */}
          <text x={15} y={height/2} textAnchor="middle" transform={`rotate(-90, 15, ${height/2})`} className={`text-sm font-medium ${isDark ? 'fill-gray-300' : 'fill-gray-700'}`}>
            Sharpe Ratio
          </text>
        </svg>
      </div>
    );
  };

  // Diversification Level Chart Component
  const DiversificationChart = () => {
    // const width = 300;
    const width = card_width;
    const height = 200;
    const padding = 40;
    
    const methods = Object.keys(methodologyAnalytics);
    const barWidth = (width - 2 * padding) / methods.length * 0.7;
    
    return (
      <div className={`rounded-xl p-${cards_p} transition-all duration-300 ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }
      ${isBorder ? 'border shadow-lg' : 'border-0'}
      `}>
        <h4 className={`text-lg font-semibold mb-2 text-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Diversification Level</h4>
        <p className={`text-xs mb-4 text-center ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>(Effective Number of Assets)</p>
        
        <svg width={width} height={height} className="mx-auto">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(value => (
            <line
              key={value}
              x1={padding}
              y1={height - padding - (value / 8) * (height - 2 * padding)}
              x2={width - padding}
              y2={height - padding - (value / 8) * (height - 2 * padding)}
              stroke={isDark ? "#374151" : "#E5E7EB"}
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          
          {/* Bars */}
          {methods.map((method, index) => {
            const data = methodologyAnalytics[method];
            const x = padding + (index + 0.15) * ((width - 2 * padding) / methods.length);
            const barHeight = (data.diversification / 8) * (height - 2 * padding);
            const y = height - padding - barHeight;
            
            return (
              <g key={method}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={colors[method]}
                  stroke="white"
                  strokeWidth="1"
                  className="transition-all duration-300 hover:opacity-80"
                  rx="4"
                />
                {/* Value label */}
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className={`text-xs font-medium ${isDark ? 'fill-gray-300' : 'fill-gray-700'}`}
                >
                  {data.diversification.toFixed(1)}
                </text>
                {/* Method label */}
                <text
                  x={x + barWidth / 2}
                  y={height - padding + 20}
                  textAnchor="middle"
                  className={`text-xs font-medium ${isDark ? 'fill-gray-300' : 'fill-gray-700'}`}
                >
                  {method}
                </text>
              </g>
            );
          })}
          
          {/* Y-axis */}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke={isDark ? "#6B7280" : "#374151"} strokeWidth="2" />
          
          {/* Y-axis labels */}
          {[0, 2, 4, 6].map(value => (
            <text
              key={value}
              x={padding - 10}
              y={height - padding - (value / 8) * (height - 2 * padding) + 4}
              textAnchor="end"
              className={`text-xs font-medium ${isDark ? 'fill-gray-400' : 'fill-gray-600'}`}
            >
              {value}
            </text>
          ))}
          
          {/* Y-axis label */}
          <text x={15} y={height/2} textAnchor="middle" transform={`rotate(-90, 15, ${height/2})`} className={`text-sm font-medium ${isDark ? 'fill-gray-300' : 'fill-gray-700'}`}>
            Effective Assets
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <h3 className={`text-xl font-bold mb-6 text-center transition-colors duration-300 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Portfolio Analytics Dashboard</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RiskReturnChart />
        <SharpeChart />
        <DiversificationChart />
      </div>
    </div>
  );
};

export default PortfolioAnalyticsSection;