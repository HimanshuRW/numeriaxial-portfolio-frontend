import React from 'react';
import { BarChart3, DollarSign, TrendingUp, Calculator } from 'lucide-react';

const FundamentalPage = ({ stockData, ticker }) => {
  return (
    <div className="space-y-8">
      {/* Valuation Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Calculator className="w-5 h-5 mr-2 text-blue-600" />
          Valuation Metrics
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">P/E Ratio</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stockData.peRatio}</div>
            <div className="text-sm text-gray-600 mt-1">
              vs Sector: {stockData.sectorData.avgPE.toFixed(1)}
            </div>
            <div className={`text-xs mt-1 ${
              stockData.peRatio < stockData.sectorData.avgPE ? 'text-green-600' : 'text-red-600'
            }`}>
              {stockData.peRatio < stockData.sectorData.avgPE ? 'Undervalued' : 'Overvalued'}
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">P/B Ratio</span>
              <BarChart3 className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stockData.pbRatio}</div>
            <div className="text-sm text-gray-600 mt-1">
              vs Sector: {stockData.sectorData.avgPB.toFixed(1)}
            </div>
            <div className={`text-xs mt-1 ${
              stockData.pbRatio < stockData.sectorData.avgPB ? 'text-green-600' : 'text-red-600'
            }`}>
              {stockData.pbRatio < stockData.sectorData.avgPB ? 'Undervalued' : 'Overvalued'}
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">P/S Ratio</span>
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stockData.psRatio}</div>
            <div className="text-sm text-gray-600 mt-1">
              vs Sector: {stockData.sectorData.avgPS.toFixed(1)}
            </div>
            <div className={`text-xs mt-1 ${
              stockData.psRatio < stockData.sectorData.avgPS ? 'text-green-600' : 'text-red-600'
            }`}>
              {stockData.psRatio < stockData.sectorData.avgPS ? 'Undervalued' : 'Overvalued'}
            </div>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">PEG Ratio</span>
              <Calculator className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stockData.pegRatio}</div>
            <div className="text-sm text-gray-600 mt-1">
              Growth Adjusted
            </div>
            <div className={`text-xs mt-1 ${
              stockData.pegRatio < 1 ? 'text-green-600' : 
              stockData.pegRatio < 2 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {stockData.pegRatio < 1 ? 'Attractive' : 
               stockData.pegRatio < 2 ? 'Fair' : 'Expensive'}
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Earnings Metrics
        </h3>
        
        {/* Quarterly Earnings */}
        <div className="mb-8">
          <h4 className="font-medium text-gray-800 mb-4">Quarterly Performance</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Quarter</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">EPS</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Net Income</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Growth</th>
                </tr>
              </thead>
              <tbody>
                {stockData.financials.quarterly.map((quarter, index) => (
                  <tr key={quarter.quarter} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{quarter.quarter}</td>
                    <td className="py-3 px-4 text-right">${quarter.revenue.toFixed(1)}B</td>
                    <td className="py-3 px-4 text-right">${quarter.eps.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">${quarter.netIncome.toFixed(1)}B</td>
                    <td className="py-3 px-4 text-right">
                      {index < stockData.financials.quarterly.length - 1 && (
                        <span className={`font-medium ${
                          quarter.revenue > stockData.financials.quarterly[index + 1].revenue 
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {((quarter.revenue - stockData.financials.quarterly[index + 1].revenue) / 
                            stockData.financials.quarterly[index + 1].revenue * 100).toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Annual Performance */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Annual Performance</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-600 mb-3">Revenue Trend</h5>
              <div className="space-y-2">
                {stockData.financials.annual.map((year, index) => (
                  <div key={year.year} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{year.year}</span>
                    <span className="text-sm text-gray-900">${year.revenue}</span>
                    {index < stockData.financials.annual.length - 1 && (
                      <span className={`text-xs ${
                        parseFloat(year.revenue.replace('B', '')) > 
                        parseFloat(stockData.financials.annual[index + 1].revenue.replace('B', ''))
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(((parseFloat(year.revenue.replace('B', '')) - 
                            parseFloat(stockData.financials.annual[index + 1].revenue.replace('B', ''))) / 
                           parseFloat(stockData.financials.annual[index + 1].revenue.replace('B', ''))) * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-600 mb-3">EPS Trend</h5>
              <div className="space-y-2">
                {stockData.financials.annual.map((year, index) => (
                  <div key={year.year} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{year.year}</span>
                    <span className="text-sm text-gray-900">${year.eps.toFixed(2)}</span>
                    {index < stockData.financials.annual.length - 1 && (
                      <span className={`text-xs ${
                        year.eps > stockData.financials.annual[index + 1].eps
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(((year.eps - stockData.financials.annual[index + 1].eps) / 
                           stockData.financials.annual[index + 1].eps) * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profitability & Efficiency */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
          Profitability & Efficiency
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Margins</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Gross Margin:</span>
                <div className="text-right">
                  <span className="font-medium text-green-600">{stockData.grossMargin}%</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${Math.min(stockData.grossMargin, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Operating Margin:</span>
                <div className="text-right">
                  <span className="font-medium text-blue-600">{stockData.operatingMargin}%</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(stockData.operatingMargin, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Net Margin:</span>
                <div className="text-right">
                  <span className="font-medium text-purple-600">{stockData.netMargin}%</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${Math.min(stockData.netMargin, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Returns</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">ROE:</span>
                <span className="font-medium text-green-600">{stockData.roe}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ROA:</span>
                <span className="font-medium text-blue-600">{stockData.roa}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">vs Sector ROE:</span>
                <span className="font-medium text-gray-900">{stockData.sectorData.avgROE.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Liquidity</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Ratio:</span>
                <span className={`font-medium ${
                  stockData.currentRatio > 1.5 ? 'text-green-600' : 
                  stockData.currentRatio > 1.0 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {stockData.currentRatio}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quick Ratio:</span>
                <span className={`font-medium ${
                  stockData.quickRatio > 1.0 ? 'text-green-600' : 
                  stockData.quickRatio > 0.7 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {stockData.quickRatio}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Debt/Equity:</span>
                <span className={`font-medium ${
                  stockData.debtToEquity < 0.5 ? 'text-green-600' : 
                  stockData.debtToEquity < 1.0 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {stockData.debtToEquity}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Ratios Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Health Score</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">A</div>
            <div className="text-sm text-gray-600">Profitability</div>
            <div className="text-xs text-green-600 mt-1">Strong margins & returns</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">B+</div>
            <div className="text-sm text-gray-600">Liquidity</div>
            <div className="text-xs text-blue-600 mt-1">Adequate cash position</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">B</div>
            <div className="text-sm text-gray-600">Valuation</div>
            <div className="text-xs text-yellow-600 mt-1">Fair value range</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">A-</div>
            <div className="text-sm text-gray-600">Overall</div>
            <div className="text-xs text-purple-600 mt-1">Strong fundamentals</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundamentalPage;