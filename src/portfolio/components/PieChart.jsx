import React from 'react';

const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.allocation, 0);
  let cumulativePercentage = 0;
  const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

  return (
    <div>
      <h4 className="font-medium text-gray-800 mb-4">{title}</h4>
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = (item.allocation / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -cumulativePercentage;
              cumulativePercentage += percentage;

              return (
                <circle
                  key={item.ticker}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={colors[index % colors.length]}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="hover:opacity-80 cursor-pointer transition-opacity"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{data.length}</div>
              <div className="text-sm text-gray-600">Assets</div>
            </div>
          </div>
        </div>
        <div className="ml-8 space-y-2">
          {data.map((item, index) => (
            <div key={item.ticker} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="font-medium text-gray-900">{item.ticker}</span>
              <span className="text-gray-600">{item.allocation}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;