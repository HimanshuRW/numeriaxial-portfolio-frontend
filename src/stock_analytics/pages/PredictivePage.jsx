import React, { useState } from 'react';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';
import PredictiveChart from '../components/PredictiveChart';

const PredictivePage = ({ stockData, timePeriod, ticker }) => {
  const [chartType, setChartType] = useState('line');
  
  // Combine historical and future data for the predictive chart
  const combinedData = [
    ...stockData.predictions.historical,
    ...stockData.predictions.future
  ];

  // Calculate prediction statistics
  const lastHistoricalPrice = stockData.predictions.historical[stockData.predictions.historical.length - 1].price;
  const lastFuturePrice = stockData.predictions.future[stockData.predictions.future.length - 1].mean;
  const predictedGrowth = ((lastFuturePrice - lastHistoricalPrice) / lastHistoricalPrice * 100).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Prediction Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">6M Target</h3>
          <p className="text-2xl font-bold text-gray-900">${lastFuturePrice.toFixed(2)}</p>
          <p className={`text-sm mt-2 ${predictedGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {predictedGrowth >= 0 ? '+' : ''}{predictedGrowth}% Expected
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl">📈</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Upside Potential</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${(stockData.predictions.future[stockData.predictions.future.length - 1].high - stockData.currentPrice).toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 mt-2">Best Case Scenario</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl">📉</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Downside Risk</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${(stockData.currentPrice - stockData.predictions.future[stockData.predictions.future.length - 1].low).toFixed(2)}
          </p>
          <p className="text-sm text-red-600 mt-2">Worst Case Scenario</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl">⚖️</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Confidence</h3>
          <p className="text-2xl font-bold text-gray-900">78%</p>
          <p className="text-sm text-purple-600 mt-2">Model Accuracy</p>
        </div>
      </div>

      {/* Predictive Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <PredictiveChart 
          historicalData={stockData.predictions.historical}
          futureData={stockData.predictions.future}
          title={`${ticker} Price Prediction - Mean, High & Low Scenarios`}
          type={chartType}
          onToggle={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
        />
      </div>

      {/* Prediction Details */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Future Price Targets */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-600" />
            Future Price Targets
          </h3>
          <div className="space-y-4">
            {stockData.predictions.future.map((prediction, index) => (
              <div key={prediction.date} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-900">{prediction.date}</span>
                  <span className="text-sm text-gray-600">
                    {index === 0 ? '1M' : index === 1 ? '2M' : index === 2 ? '3M' : 
                     index === 3 ? '4M' : index === 4 ? '5M' : '6M'} Target
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-red-600 font-medium">Low</div>
                    <div className="text-lg font-bold text-red-600">${prediction.low.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {(((prediction.low - stockData.currentPrice) / stockData.currentPrice) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-600 font-medium">Mean</div>
                    <div className="text-lg font-bold text-blue-600">${prediction.mean.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {(((prediction.mean - stockData.currentPrice) / stockData.currentPrice) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-600 font-medium">High</div>
                    <div className="text-lg font-bold text-green-600">${prediction.high.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {(((prediction.high - stockData.currentPrice) / stockData.currentPrice) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                {/* Confidence indicator */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Confidence Range:</span>
                    <span className="text-xs font-medium text-gray-900">
                      ${(prediction.high - prediction.low).toFixed(2)} spread
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 via-blue-500 to-green-500 h-2 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Model Information & Risks
          </h3>
          
          <div className="space-y-6">
            {/* Model Details */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Prediction Model</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Algorithm:</span>
                  <span className="font-medium">Ensemble (LSTM + Random Forest)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Training Period:</span>
                  <span className="font-medium">5 Years Historical Data</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Update:</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy Score:</span>
                  <span className="font-medium text-green-600">78.3%</span>
                </div>
              </div>
            </div>

            {/* Key Factors */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Key Prediction Factors</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-700">Technical Indicators</span>
                  <span className="text-sm font-medium text-green-600">Bullish</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm text-gray-700">Market Sentiment</span>
                  <span className="text-sm font-medium text-blue-600">Positive</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm text-gray-700">Economic Indicators</span>
                  <span className="text-sm font-medium text-yellow-600">Neutral</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span className="text-sm text-gray-700">Sector Performance</span>
                  <span className="text-sm font-medium text-purple-600">Strong</span>
                </div>
              </div>
            </div>

            {/* Risk Disclaimer */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Important Disclaimers</h4>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Predictions are based on historical patterns and may not reflect future performance</p>
                  <p>• Market volatility can significantly impact accuracy</p>
                  <p>• External factors (news, events) are not fully captured</p>
                  <p>• Use predictions as guidance, not investment advice</p>
                  <p>• Past performance does not guarantee future results</p>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Model Recommendation</h4>
              <div className={`p-4 rounded-lg ${
                predictedGrowth > 5 ? 'bg-green-50 border border-green-200' :
                predictedGrowth > 0 ? 'bg-blue-50 border border-blue-200' :
                'bg-red-50 border border-red-200'
              }`}>
                <div className={`font-semibold mb-2 ${
                  predictedGrowth > 5 ? 'text-green-800' :
                  predictedGrowth > 0 ? 'text-blue-800' :
                  'text-red-800'
                }`}>
                  {predictedGrowth > 5 ? 'Strong Buy' : 
                   predictedGrowth > 0 ? 'Buy' : 'Hold/Sell'}
                </div>
                <div className="text-sm text-gray-700">
                  Based on {predictedGrowth >= 0 ? 'positive' : 'negative'} predicted growth of {predictedGrowth}% 
                  over the next 6 months with {Math.abs(parseFloat(predictedGrowth)) > 10 ? 'high' : 'moderate'} confidence.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictivePage;