import React from 'react';
import { BarChart3, Percent } from 'lucide-react';
import { useTheme } from '../../ThemeContext';

const StatisticsPage = ({ portfolioData, onStockClick }) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-8">
      {/* Detailed Stock Statistics Table */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 flex items-center transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
          Detailed Stock Statistics & Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b-2 transition-colors duration-300 ${
                isDark ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <th className={`text-left py-3 px-2 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Ticker</th>
                <th className={`text-right py-3 px-2 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Mean Price</th>
                <th className={`text-right py-3 px-2 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Median</th>
                <th className={`text-right py-3 px-2 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Std Dev</th>
                <th className={`text-right py-3 px-2 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>52W Range</th>
                <th className={`text-right py-3 px-2 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Skewness</th>
                <th className={`text-right py-3 px-2 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>R-Squared</th>
                <th className={`text-right py-3 px-2 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>T-Stat</th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.stocks.map((stock, index) => (
                <tr 
                  key={stock.ticker} 
                  className={`border-b cursor-pointer transition-colors duration-300 ${
                    isDark 
                      ? 'border-gray-600 hover:bg-gray-700' 
                      : 'border-gray-100 hover:bg-gray-50'
                  } ${index % 2 === 0 ? (isDark ? 'bg-gray-800' : 'bg-white') : (isDark ? 'bg-gray-750' : 'bg-gray-25')}`}
                  onClick={() => onStockClick(stock.ticker)}
                >
                  <td className="py-3 px-2">
                    <div className={`font-semibold transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{stock.ticker}</div>
                    <div className={`text-xs transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>{stock.allocation}% allocation</div>
                  </td>
                  <td className={`py-3 px-2 text-right font-medium transition-colors duration-300 ${
                    isDark ? 'text-gray-200' : 'text-gray-800'
                  }`}>${stock.mean}</td>
                  <td className={`py-3 px-2 text-right transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>${stock.median}</td>
                  <td className={`py-3 px-2 text-right transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{stock.stdDev}%</td>
                  <td className={`py-3 px-2 text-right text-xs transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{stock.yearRange}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`${stock.skewness >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.skewness}
                    </span>
                  </td>
                  <td className={`py-3 px-2 text-right transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{stock.rSquared}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`${stock.tStat >= 2 ? 'text-green-600' : 'text-orange-600'}`}>
                      {stock.tStat}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className={`border-t-2 font-semibold transition-colors duration-300 ${
                isDark ? 'bg-blue-900/50 border-blue-600' : 'bg-blue-50 border-blue-200'
              }`}>
                <td className={`py-3 px-2 transition-colors duration-300 ${
                  isDark ? 'text-blue-300' : 'text-blue-900'
                }`}>Portfolio</td>
                <td className={`py-3 px-2 text-right transition-colors duration-300 ${
                  isDark ? 'text-blue-300' : 'text-blue-900'
                }`}>-</td>
                <td className={`py-3 px-2 text-right transition-colors duration-300 ${
                  isDark ? 'text-blue-300' : 'text-blue-900'
                }`}>-</td>
                <td className={`py-3 px-2 text-right transition-colors duration-300 ${
                  isDark ? 'text-blue-300' : 'text-blue-900'
                }`}>{portfolioData.statistics.volatility}%</td>
                <td className={`py-3 px-2 text-right transition-colors duration-300 ${
                  isDark ? 'text-blue-300' : 'text-blue-900'
                }`}>-</td>
                <td className={`py-3 px-2 text-right transition-colors duration-300 ${
                  isDark ? 'text-blue-300' : 'text-blue-900'
                }`}>-</td>
                <td className={`py-3 px-2 text-right transition-colors duration-300 ${
                  isDark ? 'text-blue-300' : 'text-blue-900'
                }`}>{portfolioData.statistics.rSquared}</td>
                <td className={`py-3 px-2 text-right transition-colors duration-300 ${
                  isDark ? 'text-blue-300' : 'text-blue-900'
                }`}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Valuation Ratios Comparison */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 flex items-center transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <Percent className="w-5 h-5 mr-2 text-yellow-600" />
          Valuation Ratios vs Industry
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b-2 transition-colors duration-300 ${
                isDark ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <th className={`text-left py-3 px-4 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Ticker</th>
                <th className={`text-right py-3 px-4 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>P/E Ratio</th>
                <th className={`text-right py-3 px-4 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>P/B Ratio</th>
                <th className={`text-right py-3 px-4 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>P/S Ratio</th>
                <th className={`text-right py-3 px-4 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>PEG Ratio</th>
                <th className={`text-right py-3 px-4 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Book Value</th>
                <th className={`text-center py-3 px-4 font-semibold transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Valuation</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(portfolioData.valuationRatios).map(([ticker, ratios]) => {
                const isIndustry = ticker === 'industry';
                const peStatus = !isIndustry ? (ratios.pe < portfolioData.valuationRatios.industry.pe ? 'undervalued' : 'overvalued') : '';
                
                return (
                  <tr 
                    key={ticker} 
                    className={`border-b transition-colors duration-300 ${
                      isDark ? 'border-gray-600' : 'border-gray-100'
                    } ${
                      isIndustry 
                        ? (isDark ? 'bg-yellow-900/30 font-semibold' : 'bg-yellow-50 font-semibold')
                        : (isDark ? 'hover:bg-gray-700 cursor-pointer' : 'hover:bg-gray-50 cursor-pointer')
                    }`}
                    onClick={() => !isIndustry && onStockClick(ticker)}
                  >
                    <td className="py-4 px-4">
                      <div className={`font-semibold transition-colors duration-300 ${
                        isIndustry 
                          ? (isDark ? 'text-yellow-400' : 'text-yellow-800')
                          : (isDark ? 'text-white' : 'text-gray-900')
                      }`}>
                        {isIndustry ? 'Industry Avg' : ticker}
                      </div>
                    </td>
                    <td className={`py-4 px-4 text-right font-medium transition-colors duration-300 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>{ratios.pe}</td>
                    <td className={`py-4 px-4 text-right font-medium transition-colors duration-300 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>{ratios.pb || '-'}</td>
                    <td className={`py-4 px-4 text-right font-medium transition-colors duration-300 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>{ratios.ps || '-'}</td>
                    <td className={`py-4 px-4 text-right font-medium transition-colors duration-300 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>{ratios.peg || '-'}</td>
                    <td className={`py-4 px-4 text-right font-medium transition-colors duration-300 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>{ratios.bookValue}</td>
                    <td className="py-4 px-4 text-center">
                      {!isIndustry && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          peStatus === 'undervalued' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {peStatus}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Returns Analysis */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Return Analysis Summary</h3>
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h4 className={`font-semibold mb-4 transition-colors duration-300 ${
              isDark ? 'text-gray-200' : 'text-gray-800'
            }`}>Portfolio Returns</h4>
            <div className="space-y-3">
              <div className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <span className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Total Return</span>
                <span className="font-semibold text-green-600">+{portfolioData.performance.totalReturn}%</span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <span className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Max Return</span>
                <span className="font-semibold text-green-600">+{portfolioData.performance.maxReturn}%</span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <span className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Min Return</span>
                <span className="font-semibold text-red-600">{portfolioData.performance.minReturn}%</span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <span className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Avg Return (Annualized)</span>
                <span className="font-semibold text-blue-600">+{portfolioData.performance.avgReturnAnnualized}%</span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <span className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Avg Excess Return</span>
                <span className="font-semibold text-purple-600">+{portfolioData.performance.avgExcessReturn}%</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className={`font-semibold mb-4 transition-colors duration-300 ${
              isDark ? 'text-gray-200' : 'text-gray-800'
            }`}>Time Period Performance</h4>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(portfolioData.performance).slice(0, 7).map(([period, returnVal]) => (
                <div key={period} className={`text-center p-3 border rounded-lg transition-colors duration-300 ${
                  isDark ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <div className={`text-sm font-medium mb-1 transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{period}</div>
                  <div className={`text-lg font-bold ${returnVal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {returnVal > 0 ? '+' : ''}{returnVal}%
                  </div>
                  <div className={`w-full h-1 rounded-full mt-2 ${returnVal >= 0 ? 'bg-green-200' : 'bg-red-200'}`}>
                    <div 
                      className={`h-full rounded-full ${returnVal >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(Math.abs(returnVal) * 1.5, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;