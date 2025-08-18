import React from 'react';
import { Users, TrendingUp, BarChart3 } from 'lucide-react';

const PeersPage = ({ stockData, ticker, onStockClick }) => {
  const peerData = stockData.peerComparison;
  const peerTickers = Object.keys(peerData).filter(t => t !== ticker);

  return (
    <div className="space-y-8">
      {/* Peer Comparison Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          Peer Comparison Overview
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Market Cap</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">P/E Ratio</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">P/B Ratio</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">ROE</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Net Margin</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">1D Change</th>
              </tr>
            </thead>
            <tbody>
              {/* Current Stock */}
              <tr className="bg-blue-50 border-b border-gray-100 font-semibold">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-bold text-blue-900">{ticker} (Current)</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right text-blue-900">${peerData[ticker].marketCap}</td>
                <td className="py-4 px-4 text-right text-blue-900">{peerData[ticker].peRatio}</td>
                <td className="py-4 px-4 text-right text-blue-900">{peerData[ticker].pbRatio}</td>
                <td className="py-4 px-4 text-right text-blue-900">{peerData[ticker].roe}%</td>
                <td className="py-4 px-4 text-right text-blue-900">{peerData[ticker].netMargin}%</td>
                <td className="py-4 px-4 text-right">
                  <span className={`font-semibold ${
                    peerData[ticker].changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {peerData[ticker].changePercent > 0 ? '+' : ''}{peerData[ticker].changePercent}%
                  </span>
                </td>
              </tr>
              
              {/* Peer Stocks */}
              {peerTickers.map((peerTicker, index) => (
                <tr 
                  key={peerTicker} 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onStockClick(peerTicker)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index % 4] }}
                      ></div>
                      <span className="font-medium text-gray-900">{peerTicker}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">${peerData[peerTicker].marketCap}</td>
                  <td className="py-4 px-4 text-right">
                    <span className={`${
                      parseFloat(peerData[peerTicker].peRatio) < parseFloat(peerData[ticker].peRatio) 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {peerData[peerTicker].peRatio}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`${
                      parseFloat(peerData[peerTicker].pbRatio) < parseFloat(peerData[ticker].pbRatio) 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {peerData[peerTicker].pbRatio}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`${
                      parseFloat(peerData[peerTicker].roe) > parseFloat(peerData[ticker].roe) 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {peerData[peerTicker].roe}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`${
                      parseFloat(peerData[peerTicker].netMargin) > parseFloat(peerData[ticker].netMargin) 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {peerData[peerTicker].netMargin}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-medium ${
                      peerData[peerTicker].changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {peerData[peerTicker].changePercent > 0 ? '+' : ''}{peerData[peerTicker].changePercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Relative Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Relative Performance Analysis
        </h3>
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Valuation Comparison</h4>
            <div className="space-y-4">
              {['peRatio', 'pbRatio', 'psRatio'].map((metric) => {
                const metricName = metric === 'peRatio' ? 'P/E Ratio' : 
                                 metric === 'pbRatio' ? 'P/B Ratio' : 'P/S Ratio';
                const currentValue = parseFloat(peerData[ticker][metric]);
                const peerValues = peerTickers.map(p => parseFloat(peerData[p][metric]));
                const avgPeerValue = peerValues.reduce((a, b) => a + b, 0) / peerValues.length;
                
                return (
                  <div key={metric} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{metricName}</span>
                      <span className={`font-bold ${
                        currentValue < avgPeerValue ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {currentValue.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Peer Average: {avgPeerValue.toFixed(1)}</span>
                      <span className={`${
                        currentValue < avgPeerValue ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {currentValue < avgPeerValue ? 'Better' : 'Worse'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          currentValue < avgPeerValue ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((currentValue / (avgPeerValue * 2)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-4">Profitability Comparison</h4>
            <div className="space-y-4">
              {['roe', 'netMargin'].map((metric) => {
                const metricName = metric === 'roe' ? 'Return on Equity' : 'Net Margin';
                const currentValue = parseFloat(peerData[ticker][metric]);
                const peerValues = peerTickers.map(p => parseFloat(peerData[p][metric]));
                const avgPeerValue = peerValues.reduce((a, b) => a + b, 0) / peerValues.length;
                
                return (
                  <div key={metric} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{metricName}</span>
                      <span className={`font-bold ${
                        currentValue > avgPeerValue ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {currentValue.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Peer Average: {avgPeerValue.toFixed(1)}%</span>
                      <span className={`${
                        currentValue > avgPeerValue ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {currentValue > avgPeerValue ? 'Better' : 'Worse'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          currentValue > avgPeerValue ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((currentValue / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              
              {/* Market Cap Comparison */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">Market Cap</span>
                  <span className="font-bold text-blue-600">${peerData[ticker].marketCap}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span>Company size comparison</span>
                </div>
                <div className="space-y-1">
                  {peerTickers.map((peerTicker, index) => (
                    <div key={peerTicker} className="flex justify-between text-xs">
                      <span>{peerTicker}:</span>
                      <span>${peerData[peerTicker].marketCap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Peer Analysis Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {peerTickers.map((peerTicker, index) => (
          <div 
            key={peerTicker}
            onClick={() => onStockClick(peerTicker)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index % 4] }}
                ></div>
                <h4 className="font-bold text-gray-900">{peerTicker}</h4>
              </div>
              <span className={`text-sm font-medium ${
                peerData[peerTicker].changePercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {peerData[peerTicker].changePercent > 0 ? '+' : ''}{peerData[peerTicker].changePercent}%
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Market Cap:</span>
                <span className="text-sm font-medium">${peerData[peerTicker].marketCap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">P/E Ratio:</span>
                <span className={`text-sm font-medium ${
                  parseFloat(peerData[peerTicker].peRatio) < parseFloat(peerData[ticker].peRatio) 
                    ? 'text-green-600' : 'text-red-600'
                }`}>
                  {peerData[peerTicker].peRatio}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ROE:</span>
                <span className={`text-sm font-medium ${
                  parseFloat(peerData[peerTicker].roe) > parseFloat(peerData[ticker].roe) 
                    ? 'text-green-600' : 'text-red-600'
                }`}>
                  {peerData[peerTicker].roe}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Net Margin:</span>
                <span className={`text-sm font-medium ${
                  parseFloat(peerData[peerTicker].netMargin) > parseFloat(peerData[ticker].netMargin) 
                    ? 'text-green-600' : 'text-red-600'
                }`}>
                  {peerData[peerTicker].netMargin}%
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                <span className="text-sm mr-2">View Analysis</span>
                <div className="w-4 h-4 group-hover:translate-x-1 transition-transform">→</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sector Benchmark */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
          Sector Benchmark ({stockData.sectorData.name})
        </h3>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Avg P/E</div>
            <div className="text-xl font-bold text-purple-600">{stockData.sectorData.avgPE.toFixed(1)}</div>
            <div className={`text-xs mt-1 ${
              stockData.peRatio < stockData.sectorData.avgPE ? 'text-green-600' : 'text-red-600'
            }`}>
              {ticker}: {stockData.peRatio}
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Avg P/B</div>
            <div className="text-xl font-bold text-purple-600">{stockData.sectorData.avgPB.toFixed(1)}</div>
            <div className={`text-xs mt-1 ${
              stockData.pbRatio < stockData.sectorData.avgPB ? 'text-green-600' : 'text-red-600'
            }`}>
              {ticker}: {stockData.pbRatio}
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Avg P/S</div>
            <div className="text-xl font-bold text-purple-600">{stockData.sectorData.avgPS.toFixed(1)}</div>
            <div className={`text-xs mt-1 ${
              stockData.psRatio < stockData.sectorData.avgPS ? 'text-green-600' : 'text-red-600'
            }`}>
              {ticker}: {stockData.psRatio}
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Avg ROE</div>
            <div className="text-xl font-bold text-purple-600">{stockData.sectorData.avgROE.toFixed(1)}%</div>
            <div className={`text-xs mt-1 ${
              stockData.roe > stockData.sectorData.avgROE ? 'text-green-600' : 'text-red-600'
            }`}>
              {ticker}: {stockData.roe}%
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Avg Net Margin</div>
            <div className="text-xl font-bold text-purple-600">{stockData.sectorData.avgNetMargin.toFixed(1)}%</div>
            <div className={`text-xs mt-1 ${
              stockData.netMargin > stockData.sectorData.avgNetMargin ? 'text-green-600' : 'text-red-600'
            }`}>
              {ticker}: {stockData.netMargin}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeersPage;