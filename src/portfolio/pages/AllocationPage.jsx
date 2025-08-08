import React, { useState } from 'react';
import PieChart from '../components/PieChart';

const AllocationPage = ({ portfolioData, onStockClick }) => {
  const [allocationView, setAllocationView] = useState(10);

  const displayedStocks = allocationView === -1 
    ? portfolioData.stocks 
    : portfolioData.stocks.slice(0, allocationView);

  return (
    <div className="space-y-8">
      {/* Allocation Controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Asset Allocation Analysis</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Show:</span>
          <select 
            value={allocationView}
            onChange={(e) => setAllocationView(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={-1}>All Assets</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <PieChart 
            data={portfolioData.stocks}
            title="Portfolio Allocation"
          />
        </div>

        {/* Allocation List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Detailed Allocation</h4>
          <div className="space-y-4">
            {displayedStocks.map((stock, index) => (
              <div 
                key={stock.ticker} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onStockClick(stock.ticker)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ 
                      backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'][index % 6]
                    }}
                  ></div>
                  <span className="font-medium text-gray-900">{stock.ticker}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{stock.allocation}%</div>
                  <div className="text-sm text-gray-500">
                    ${Math.round(portfolioData.statistics.totalValue * stock.allocation / 100).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Allocation Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Allocation Performance Analysis</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioData.stocks.map((stock, index) => (
            <div 
              key={stock.ticker}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onStockClick(stock.ticker)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][index % 4]
                    }}
                  ></div>
                  <span className="font-semibold text-gray-900">{stock.ticker}</span>
                </div>
                <span className="text-sm font-medium text-gray-600">{stock.allocation}%</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Return:</span>
                  <span className={`font-medium ${stock.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.return > 0 ? '+' : ''}{stock.return}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Volatility:</span>
                  <span className="font-medium text-gray-900">{stock.volatility}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Beta:</span>
                  <span className="font-medium text-gray-900">{stock.beta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllocationPage;