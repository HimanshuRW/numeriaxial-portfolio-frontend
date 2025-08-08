import React from 'react';
import { BarChart3, LineChart } from 'lucide-react';

const LineBarChart = ({ data, type, onToggle, title }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.portfolio, d.benchmark)));
  const minValue = Math.min(...data.map(d => Math.min(d.portfolio, d.benchmark)));
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
            {/* Portfolio line */}
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              points={data.map((point, index) => {
                const x = (index / (data.length - 1)) * 350 + 25;
                const y = 180 - ((point.portfolio - minValue) / range) * 140;
                return `${x},${y}`;
              }).join(' ')}
            />
            {/* Benchmark line */}
            <polyline
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeDasharray="5,5"
              points={data.map((point, index) => {
                const x = (index / (data.length - 1)) * 350 + 25;
                const y = 180 - ((point.benchmark - minValue) / range) * 140;
                return `${x},${y}`;
              }).join(' ')}
            />
            {/* Data points */}
            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * 350 + 25;
              const portfolioY = 180 - ((point.portfolio - minValue) / range) * 140;
              const benchmarkY = 180 - ((point.benchmark - minValue) / range) * 140;
              return (
                <g key={index}>
                  <circle cx={x} cy={portfolioY} r="4" fill="#3B82F6" />
                  <circle cx={x} cy={benchmarkY} r="3" fill="#9CA3AF" />
                  <text x={x} y="195" textAnchor="middle" fontSize="12" fill="#6B7280">
                    {point.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* <div className="flex justify-between items-center mb-4"> */}
      <div className="flex justify-between mb-4">
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
          const portfolioHeight = (point.portfolio / maxValue) * 200;
          const benchmarkHeight = (point.benchmark / maxValue) * 200;
          
          return (
            <div key={point.date} className="flex-1 flex flex-col items-center">
              <div className="w-full flex  items-end justify-center space-x-1 mb-2">
                <div 
                  className="bg-blue-500 rounded-t w-4 relative group cursor-pointer"
                  style={{ height: `${Math.max(portfolioHeight, 20)}px` }}
                >
                  <div className="hidden group-hover:block absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap left-1/2 transform -translate-x-1/2 z-10">
                    ${point.portfolio.toLocaleString()}
                  </div>
                </div>
                <div 
                  className="bg-gray-400 rounded-t w-4 relative group cursor-pointer"
                  style={{ height: `${Math.max(benchmarkHeight, 20)}px` }}
                >
                  <div className="hidden group-hover:block absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap left-1/2 transform -translate-x-1/2 z-10">
                    ${point.benchmark.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 font-medium mt-1">{point.date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LineBarChart;