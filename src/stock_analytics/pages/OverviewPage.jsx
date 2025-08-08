import React, { useState } from 'react';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import ThreeLineChart from '../components/ThreeLineChart';

const OverviewPage = ({ stockData, timePeriod, ticker }) => {
  const [chartType, setChartType] = useState('line');
  
  const currentChartData = stockData.chartData[timePeriod] || stockData.chartData.weekly;

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl">📈</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Market Cap</h3>
          <p className="text-2xl font-bold text-gray-900">${stockData.marketCap}</p>
          <p className="text-sm text-blue-600 mt-2">Market Value</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl">💰</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">P/E Ratio</h3>
          <p className="text-2xl font-bold text-gray-900">{stockData.peRatio}</p>
          <p className="text-sm text-green-600 mt-2">Price to Earnings</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Beta</h3>
          <p className="text-2xl font-bold text-gray-900">{stockData.beta}</p>
          <p className="text-sm text-purple-600 mt-2">Market Risk</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Price Target</h3>
          <p className="text-2xl font-bold text-gray-900">${stockData.priceTarget}</p>
          <p className="text-sm text-orange-600 mt-2">Analyst Target</p>
        </div>
      </div>

      {/* Three Comparison Charts */}
      <div className="grid lg:grid-cols-1 gap-8">
        {/* Stock vs S&P 500 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ThreeLineChart 
            data={currentChartData.map(item => ({
              date: item.date,
              line1: item.stock,
              line2: item.sp500
            }))}
            title={`${ticker} vs S&P 500`}
            line1Label={ticker}
            line2Label="S&P 500"
            line1Color="#3B82F6"
            line2Color="#9CA3AF"
            type={chartType}
            onToggle={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
          />
        </div>

        {/* Stock vs Sector */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ThreeLineChart 
            data={currentChartData.map(item => ({
              date: item.date,
              line1: item.stock,
              line2: item.sector
            }))}
            title={`${ticker} vs ${stockData.sector} Sector`}
            line1Label={ticker}
            line2Label={`${stockData.sector} Sector`}
            line1Color="#3B82F6"
            line2Color="#10B981"
            type={chartType}
            onToggle={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
          />
        </div>

        {/* Stock vs Industry */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ThreeLineChart 
            data={currentChartData.map(item => ({
              date: item.date,
              line1: item.stock,
              line2: item.sector * 0.95 // Industry typically close to sector
            }))}
            title={`${ticker} vs ${stockData.industry} Industry`}
            line1Label={ticker}
            line2Label={stockData.industry}
            line1Color="#3B82F6"
            line2Color="#8B5CF6"
            type={chartType}
            onToggle={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
          />
        </div>
      </div>

      {/* Key Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Statistics</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Valuation</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">P/E Ratio:</span>
                <span className="font-medium">{stockData.peRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">P/B Ratio:</span>
                <span className="font-medium">{stockData.pbRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">P/S Ratio:</span>
                <span className="font-medium">{stockData.psRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PEG Ratio:</span>
                <span className="font-medium">{stockData.pegRatio}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Profitability</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Margin:</span>
                <span className="font-medium text-green-600">{stockData.grossMargin}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Operating Margin:</span>
                <span className="font-medium text-green-600">{stockData.operatingMargin}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net Margin:</span>
                <span className="font-medium text-green-600">{stockData.netMargin}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ROE:</span>
                <span className="font-medium text-green-600">{stockData.roe}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Financial Health</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Debt/Equity:</span>
                <span className="font-medium">{stockData.debtToEquity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Ratio:</span>
                <span className="font-medium">{stockData.currentRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quick Ratio:</span>
                <span className="font-medium">{stockData.quickRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Beta:</span>
                <span className="font-medium">{stockData.beta}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Market Data</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Market Cap:</span>
                <span className="font-medium">${stockData.marketCap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue:</span>
                <span className="font-medium">${stockData.revenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EPS:</span>
                <span className="font-medium">${stockData.eps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Div Yield:</span>
                <span className="font-medium">{stockData.divYield}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analyst Recommendation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyst Recommendation</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full font-medium ${
              stockData.analystRating === 'Strong Buy' ? 'bg-green-100 text-green-800' :
              stockData.analystRating === 'Buy' ? 'bg-blue-100 text-blue-800' :
              stockData.analystRating === 'Hold' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {stockData.analystRating}
            </div>
            <div>
              <div className="text-sm text-gray-600">Price Target</div>
              <div className="text-lg font-bold text-gray-900">${stockData.priceTarget}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Upside Potential</div>
            <div className={`text-lg font-bold ${
              ((stockData.priceTarget - stockData.currentPrice) / stockData.currentPrice * 100) > 0 
                ? 'text-green-600' : 'text-red-600'
            }`}>
              {((stockData.priceTarget - stockData.currentPrice) / stockData.currentPrice * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;