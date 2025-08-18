import React from 'react';
import { BarChart3, LineChart } from 'lucide-react';

const PredictiveChart = ({ historicalData, futureData, title, type = 'line', onToggle }) => {
  // Combine all data to get min/max values
  const allValues = [
    ...historicalData.map(d => d.price),
    ...futureData.map(d => [d.mean, d.high, d.low]).flat()
  ];
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue;

  const totalDataPoints = historicalData.length + futureData.length;
  const historicalWidth = (historicalData.length / totalDataPoints) * 350;
  const futureWidth = (futureData.length / totalDataPoints) * 350;

  if (type === 'line') {
    return (
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-800">{title}</h4>
          <button
            onClick={onToggle}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center space-x-1"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm">Bar Chart</span>
          </button>
        </div>
        <div className="h-80 relative">
          <svg className="w-full h-full" viewBox="0 0 400 240">
            {/* Historical line */}
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              points={historicalData.map((point, index) => {
                const x = (index / (historicalData.length - 1)) * historicalWidth + 25;
                const y = 220 - ((point.price - minValue) / range) * 180;
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* Future prediction area (high-low range) */}
            <defs>
              <linearGradient id="predictionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.3 }} />
                <stop offset="50%" style={{ stopColor: '#3B82F6', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: '#EF4444', stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>
            
            {/* High-Low prediction area */}
            {(() => {
              const futureDataCopy = [...futureData]; // Create a copy to avoid mutating original
              const topPoints = futureData.map((point, index) => {
                const x = historicalWidth + 25 + (index / (futureData.length - 1)) * futureWidth;
                const y = 220 - ((point.high - minValue) / range) * 180;
                return `${x},${y}`;
              });
              
              const bottomPoints = futureDataCopy.reverse().map((point, index) => {
                const reverseIndex = futureDataCopy.length - 1 - index;
                const x = historicalWidth + 25 + (reverseIndex / (futureDataCopy.length - 1)) * futureWidth;
                const y = 220 - ((point.low - minValue) / range) * 180;
                return `${x},${y}`;
              });
              
              return (
                <polygon
                  fill="url(#predictionGradient)"
                  stroke="none"
                  points={[...topPoints, ...bottomPoints].join(' ')}
                />
              );
            })()}

            {/* Future mean line */}
            <polyline
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeDasharray="8,4"
              points={futureData.map((point, index) => {
                const x = historicalWidth + 25 + (index / (futureData.length - 1)) * futureWidth;
                const y = 220 - ((point.mean - minValue) / range) * 180;
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* Future high line */}
            <polyline
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeDasharray="4,2"
              points={futureData.map((point, index) => {
                const x = historicalWidth + 25 + (index / (futureData.length - 1)) * futureWidth;
                const y = 220 - ((point.high - minValue) / range) * 180;
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* Future low line */}
            <polyline
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
              strokeDasharray="4,2"
              points={futureData.map((point, index) => {
                const x = historicalWidth + 25 + (index / (futureData.length - 1)) * futureWidth;
                const y = 220 - ((point.low - minValue) / range) * 180;
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* Vertical divider line */}
            <line
              x1={historicalWidth + 25}
              y1="40"
              x2={historicalWidth + 25}
              y2="220"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeDasharray="5,5"
            />

            {/* Historical data points */}
            {historicalData.map((point, index) => {
              const x = (index / (historicalData.length - 1)) * historicalWidth + 25;
              const y = 220 - ((point.price - minValue) / range) * 180;
              return (
                <circle key={`hist-${index}`} cx={x} cy={y} r="3" fill="#3B82F6" />
              );
            })}

            {/* Future data points */}
            {futureData.map((point, index) => {
              const x = historicalWidth + 25 + (index / (futureData.length - 1)) * futureWidth;
              const meanY = 220 - ((point.mean - minValue) / range) * 180;
              const highY = 220 - ((point.high - minValue) / range) * 180;
              const lowY = 220 - ((point.low - minValue) / range) * 180;
              return (
                <g key={`fut-${index}`}>
                  <circle cx={x} cy={meanY} r="4" fill="#10B981" />
                  <circle cx={x} cy={highY} r="2" fill="#10B981" />
                  <circle cx={x} cy={lowY} r="2" fill="#EF4444" />
                </g>
              );
            })}

            {/* X-axis labels */}
            {historicalData.map((point, index) => {
              if (index % Math.ceil(historicalData.length / 4) === 0) {
                const x = (index / (historicalData.length - 1)) * historicalWidth + 25;
                return (
                  <text key={`hist-label-${index}`} x={x} y="235" textAnchor="middle" fontSize="12" fill="#6B7280">
                    {point.date}
                  </text>
                );
              }
              return null;
            })}

            {futureData.map((point, index) => {
              const x = historicalWidth + 25 + (index / (futureData.length - 1)) * futureWidth;
              return (
                <text key={`fut-label-${index}`} x={x} y="235" textAnchor="middle" fontSize="12" fill="#6B7280">
                  {point.date}
                </text>
              );
            })}

            {/* Legend labels */}
            <text x="25" y="25" fontSize="12" fill="#6B7280">Historical</text>
            <text x={historicalWidth + 35} y="25" fontSize="12" fill="#6B7280">Predictions</text>
          </svg>
        </div>
        
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Historical Price</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Mean Prediction</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-green-300 rounded"></div>
            <span className="text-sm text-gray-600">High Scenario</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-red-400 rounded"></div>
            <span className="text-sm text-gray-600">Low Scenario</span>
          </div>
        </div>
      </div>
    );
  }

  // Bar chart version
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-800">{title}</h4>
        <button
          onClick={onToggle}
          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center space-x-1"
        >
          <LineChart className="w-4 h-4" />
          <span className="text-sm">Line Chart</span>
        </button>
      </div>
      
      <div className="h-80 flex items-end justify-between space-x-1 bg-gray-50 rounded p-4">
        {/* Historical bars */}
        {historicalData.map((point, index) => {
          const height = (point.price / maxValue) * 280;
          return (
            <div key={`hist-bar-${index}`} className="flex-1 flex flex-col items-center">
              <div 
                className="bg-blue-500 rounded-t w-full relative group cursor-pointer"
                style={{ height: `${Math.max(height, 20)}px` }}
              >
                <div className="hidden group-hover:block absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap left-1/2 transform -translate-x-1/2 z-10">
                  ${point.price.toFixed(2)}
                </div>
              </div>
              {index % Math.ceil(historicalData.length / 4) === 0 && (
                <div className="text-xs text-gray-600 font-medium mt-2">
                  {point.date}
                </div>
              )}
            </div>
          );
        })}

        {/* Divider */}
        <div className="w-px bg-gray-400 h-full mx-2"></div>

        {/* Future bars */}
        {futureData.map((point, index) => {
          const meanHeight = (point.mean / maxValue) * 280;
          const highHeight = (point.high / maxValue) * 280;
          const lowHeight = (point.low / maxValue) * 280;
          
          return (
            <div key={`fut-bar-${index}`} className="flex-1 flex flex-col items-center">
              <div className="relative w-full">
                {/* Main mean bar */}
                <div 
                  className="bg-green-500 rounded-t w-full relative group cursor-pointer"
                  style={{ height: `${Math.max(meanHeight, 20)}px` }}
                >
                  <div className="hidden group-hover:block absolute -top-12 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap left-1/2 transform -translate-x-1/2 z-10">
                    <div>Mean: ${point.mean.toFixed(2)}</div>
                    <div>High: ${point.high.toFixed(2)}</div>
                    <div>Low: ${point.low.toFixed(2)}</div>
                  </div>
                </div>
                
                {/* High indicator */}
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 bg-green-700"
                  style={{ height: `${Math.max(highHeight - meanHeight, 5)}px` }}
                ></div>
                
                {/* Low indicator */}
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-red-500"
                  style={{ height: `${Math.max(meanHeight - lowHeight, 5)}px` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 font-medium mt-2">
                {point.date}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center space-x-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Historical Price</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Mean Prediction</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-3 bg-gradient-to-t from-red-200 to-green-200 rounded"></div>
          <span className="text-sm text-gray-600">Prediction Range</span>
        </div>
      </div>
    </div>
  );
};

export default PredictiveChart;