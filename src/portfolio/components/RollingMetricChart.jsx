
import React, { useState } from 'react';

const RollingMetricChart = ({ title, data, dates, color, isDark = false }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  
  // Get last 6 data points
  const recentData = data.slice(-6);
  const recentDates = dates.slice(-6);
  
  const maxVal = Math.max(...recentData);
  const avgVal = recentData.reduce((sum, val) => sum + val, 0) / recentData.length;
  const avgY = 70 - (avgVal / maxVal) * 50;
  
  return (
    <div className="relative">
      <h4 className={`font-medium mb-3 text-center transition-colors duration-300 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>{title}</h4>
      <div className="h-24 relative">
        <svg viewBox="0 0 200 80" className="w-full h-full">
          {/* Average line */}
          <line
            x1="10"
            y1={avgY}
            x2="170"
            y2={avgY}
            stroke={isDark ? '#6B7280' : '#9CA3AF'}
            strokeWidth="1"
            strokeDasharray="3,3"
            opacity="0.6"
          />
          
          {/* Average value label */}
          <text
            x="175"
            y={avgY + 3}
            className={`text-xs ${isDark ? 'fill-gray-400' : 'fill-gray-600'}`}
            fontSize="10"
            opacity="0.7"
          >
            {avgVal.toFixed(2)}
          </text>
          
          {recentData.map((value, index) => {
            const x = 20 + (index * 25);
            const height = (value / maxVal) * 50;
            const y = 70 - height;
            
            return (
              <rect
                key={index}
                x={x}
                y={y}
                width="20"
                height={height}
                fill={color}
                className="hover:opacity-80 cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredBar({ index, value, date: recentDates[index], x, y })}
                onMouseLeave={() => setHoveredBar(null)}
              />
            );
          })}
          <text x="100" y="78" textAnchor="middle" className={`text-xs ${
            isDark ? 'fill-gray-400' : 'fill-gray-600'
          }`}>Time</text>
        </svg>
        
        {/* Tooltip */}
        {hoveredBar && (
          <div 
            className={`absolute z-10 px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap pointer-events-none ${
              isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'
            }`}
            style={{
              left: `${(hoveredBar.x / 200) * 100}%`,
              top: `${(hoveredBar.y / 80) * 100}%`,
              transform: 'translate(-50%, -100%)',
              marginTop: '-8px'
            }}
          >
            <div>Date: {hoveredBar.date}</div>
            <div>Value: {hoveredBar.value.toFixed(2)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RollingMetricChart;