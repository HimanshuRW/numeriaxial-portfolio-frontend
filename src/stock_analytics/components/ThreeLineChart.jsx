import React from 'react';
import { BarChart3, LineChart } from 'lucide-react';

const ThreeLineChart = ({ 
  data, 
  title, 
  line1Label, 
  line2Label, 
  line1Color = "#3B82F6", 
  line2Color = "#9CA3AF",
  type = 'line',
  onToggle 
}) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.line1, d.line2)));
  const minValue = Math.min(...data.map(d => Math.min(d.line1, d.line2)));
  const range = maxValue - minValue;

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
        <div className="h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Line 1 */}
            <polyline
              fill="none"
              stroke={line1Color}
              strokeWidth="3"
              points={data.map((point, index) => {
                const x = (index / (data.length - 1)) * 350 + 25;
                const y = 180 - ((point.line1 - minValue) / range) * 140;
                return `${x},${y}`;
              }).join(' ')}
            />
            {/* Line 2 */}
            <polyline
              fill="none"
              stroke={line2Color}
              strokeWidth="2"
              strokeDasharray="5,5"
              points={data.map((point, index) => {
                const x = (index / (data.length - 1)) * 350 + 25;
                const y = 180 - ((point.line2 - minValue) / range) * 140;
                return `${x},${y}`;
              }).join(' ')}
            />
            {/* Data points */}
            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * 350 + 25;
              const line1Y = 180 - ((point.line1 - minValue) / range) * 140;
              const line2Y = 180 - ((point.line2 - minValue) / range) * 140;
              return (
                <g key={index}>
                  <circle cx={x} cy={line1Y} r="4" fill={line1Color} />
                  <circle cx={x} cy={line2Y} r="3" fill={line2Color} />
                  <text x={x} y="195" textAnchor="middle" fontSize="12" fill="#6B7280">
                    {point.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 rounded" style={{ backgroundColor: line1Color }}></div>
            <span className="text-sm text-gray-600">{line1Label}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 rounded" style={{ backgroundColor: line2Color }}></div>
            <span className="text-sm text-gray-600">{line2Label}</span>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="h-64 flex items-end justify-between space-x-2 bg-gray-50 rounded p-4">
        {data.map((point, index) => {
          // Simple calculation: taller bar = higher value
          const line1Height = (point.line1 / maxValue) * 200;
          const line2Height = (point.line2 / maxValue) * 200;
          
          return (
            <div key={point.date} className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-end justify-center space-x-1 mb-2">
                <div 
                  className="rounded-t w-4 relative group cursor-pointer"
                  style={{ 
                    height: `${Math.max(line1Height, 20)}px`,
                    backgroundColor: line1Color
                  }}
                >
                  <div className="hidden group-hover:block absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap left-1/2 transform -translate-x-1/2 z-10">
                    {line1Label}: {point.line1.toLocaleString()}
                  </div>
                </div>
                <div 
                  className="rounded-t w-4 relative group cursor-pointer"
                  style={{ 
                    height: `${Math.max(line2Height, 20)}px`,
                    backgroundColor: line2Color
                  }}
                >
                  <div className="hidden group-hover:block absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap left-1/2 transform -translate-x-1/2 z-10">
                    {line2Label}: {point.line2.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 font-medium mt-1">{point.date}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-3 rounded" style={{ backgroundColor: line1Color }}></div>
          <span className="text-sm text-gray-600">{line1Label}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-3 rounded" style={{ backgroundColor: line2Color }}></div>
          <span className="text-sm text-gray-600">{line2Label}</span>
        </div>
      </div>
    </div>
  );
};

export default ThreeLineChart;