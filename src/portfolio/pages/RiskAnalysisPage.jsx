import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

const RiskAnalysisPage = ({ portfolioData, onStockClick }) => {
  return (
    <div className="space-y-8">
      {/* Risk Metrics */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-red-600" />
            Portfolio Risk Metrics
          </h3>
          <div className="space-y-4">
            {portfolioData.riskMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    metric.status === 'good' ? 'bg-green-500' : 
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                </div>
                <span className={`text-lg font-bold ${
                  metric.status === 'good' ? 'text-green-600' : 
                  metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Individual Stock Risk Profile
          </h3>
          <div className="space-y-4">
            {portfolioData.stocks.map((stock, index) => (
              <div 
                key={stock.ticker} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onStockClick(stock.ticker)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">{stock.ticker}</span>
                  <span className="text-sm text-gray-500">{stock.allocation}% weight</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">VaR (95%)</div>
                    <div className="font-medium text-red-600">{stock.var95}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Max DD</div>
                    <div className="font-medium text-red-600">{stock.maxDrawdown}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Track Error</div>
                    <div className="font-medium text-orange-600">{stock.trackingError}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk-Return Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk-Return Analysis</h3>
        <div className="grid lg:grid-cols-3 gap-6">
          {portfolioData.stocks.map((stock, index) => (
            <div 
              key={stock.ticker}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onStockClick(stock.ticker)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ 
                      backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][index % 4]
                    }}
                  ></div>
                  <span className="font-semibold text-gray-900">{stock.ticker}</span>
                </div>
                <span className="text-sm font-medium text-gray-600">{stock.allocation}%</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Return</span>
                  <span className={`font-semibold ${stock.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.return > 0 ? '+' : ''}{stock.return}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Volatility</span>
                  <span className="font-medium text-gray-900">{stock.volatility}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Beta</span>
                  <span className={`font-medium ${
                    stock.beta > 1 ? 'text-red-600' : stock.beta < 0.8 ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {stock.beta}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sharpe Estimate</span>
                  <span className="font-medium text-blue-600">
                    {((stock.return - 2) / stock.volatility).toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Risk Level Indicator */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stock.volatility > 30 ? 'bg-red-100 text-red-800' :
                    stock.volatility > 20 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {stock.volatility > 30 ? 'High' : stock.volatility > 20 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Risk Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Risk Summary</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-2">{portfolioData.statistics.volatility}%</div>
            <div className="text-sm text-gray-600">Portfolio Volatility</div>
            <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block ${
              portfolioData.statistics.volatility > 20 ? 'bg-red-100 text-red-800' :
              portfolioData.statistics.volatility > 15 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {portfolioData.statistics.volatility > 20 ? 'High Risk' : 
               portfolioData.statistics.volatility > 15 ? 'Medium Risk' : 'Low Risk'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-2">{portfolioData.statistics.beta}</div>
            <div className="text-sm text-gray-600">Portfolio Beta</div>
            <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block ${
              portfolioData.statistics.beta > 1.2 ? 'bg-red-100 text-red-800' :
              portfolioData.statistics.beta < 0.8 ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {portfolioData.statistics.beta > 1.2 ? 'High Beta' : 
               portfolioData.statistics.beta < 0.8 ? 'Low Beta' : 'Market Beta'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-2">{portfolioData.statistics.maxDrawdown}%</div>
            <div className="text-sm text-gray-600">Max Drawdown</div>
            <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block ${
              Math.abs(portfolioData.statistics.maxDrawdown) > 20 ? 'bg-red-100 text-red-800' :
              Math.abs(portfolioData.statistics.maxDrawdown) > 10 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {Math.abs(portfolioData.statistics.maxDrawdown) > 20 ? 'High Risk' : 
               Math.abs(portfolioData.statistics.maxDrawdown) > 10 ? 'Medium Risk' : 'Low Risk'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-2">{portfolioData.statistics.sharpeRatio}</div>
            <div className="text-sm text-gray-600">Sharpe Ratio</div>
            <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block ${
              portfolioData.statistics.sharpeRatio > 1.5 ? 'bg-green-100 text-green-800' :
              portfolioData.statistics.sharpeRatio > 1.0 ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {portfolioData.statistics.sharpeRatio > 1.5 ? 'Excellent' : 
               portfolioData.statistics.sharpeRatio > 1.0 ? 'Good' : 'Fair'}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Management Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Portfolio Strengths</h4>
            <div className="space-y-2">
              {portfolioData.statistics.sharpeRatio > 1.2 && (
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Strong risk-adjusted returns (Sharpe: {portfolioData.statistics.sharpeRatio})</span>
                </div>
              )}
              {portfolioData.statistics.volatility < 20 && (
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Moderate volatility levels ({portfolioData.statistics.volatility}%)</span>
                </div>
              )}
              {portfolioData.statistics.informationRatio > 0.5 && (
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Good active management (Info Ratio: {portfolioData.statistics.informationRatio})</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Areas for Improvement</h4>
            <div className="space-y-2">
              {Math.abs(portfolioData.statistics.maxDrawdown) > 15 && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Consider reducing maximum drawdown risk</span>
                </div>
              )}
              {portfolioData.stocks.some(stock => stock.allocation > 40) && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">High concentration risk in top holdings</span>
                </div>
              )}
              {portfolioData.stocks.some(stock => stock.volatility > 30) && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Some holdings have high individual volatility</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysisPage;