import React, { useState } from 'react';
import { Shield, AlertTriangle, BarChart3, TrendingDown,Activity, Award, Target } from 'lucide-react';
import { useTheme } from '../../../ThemeContext';
import SortableTable from '../../components/SortableTable';
import MetricCard from '../../components/MetricCard';

const RiskAnalysis = ({ data, onStockClick }) => {
  const [riskDataType, setRiskDataType] = useState('risk_based');
  const { performanceBased } = data;
  const { isDark } = useTheme();

  if (!performanceBased) {
    return <div className={`text-center py-8 transition-colors duration-300 ${
      isDark ? 'text-gray-400' : 'text-gray-500'
    }`}>No risk analysis data available</div>;
  }

  const { quantitative_metrics, risk_analytics, advanced_attribution, portfolio_level_performance } = performanceBased;

  // Prepare risk metrics table data
  const riskMetricsData = quantitative_metrics.map(item => ({
    asset: item.asset,
    totalReturn: item.total_return,
    sharpeRatio: item.sharpe_ratio,
    treynorRatio: item.treynor_ratio,
    sortinoRatio: item.sortino_ratio,
    informationRatio: item.information_ratio,
    alpha: item.alpha,
    beta: item.beta,
    trackingError: item.tracking_error,
    calmarRatio: item.calmar_ratio
  }));

  // Prepare risk analytics data
  const riskAnalyticsData = risk_analytics.map(item => ({
    asset: item.asset,
    volatility: item.volatility,
    downsideDeviation: item.downside_deviation,
    maximumDrawdown: item.maximum_drawdown,
    var95: item.var_95,
    cvar95: item.cvar_95,
    skewness: item.skewness,
    kurtosis: item.kurtosis,
    omegaRatio: item.omega_ratio,
    gainLossRatio: item.gain_loss_ratio
  }));

  // Prepare advanced attribution data
  const advancedAttributionData = advanced_attribution.map(item => ({
    asset: item.asset,
    activeReturn: item.active_return,
    systematicRisk: item.systematic_risk_contribution,
    idiosyncraticRisk: item.idiosyncratic_risk_contribution,
    persistenceScore: item.performance_persistence_score,
    riskAdjustedReturn: item.risk_adjusted_excess_return,
    jensenAlpha: item.jensen_alpha,
    treynorMeasure: item.treynor_measure
  }));

  const riskDataTypes = [
    { 
      id: 'risk_based', 
      label: 'Risk Metrics', 
      data: riskMetricsData,
      description: 'Comprehensive risk-adjusted performance metrics'
    },
    { 
      id: 'risk_analytics', 
      label: 'Risk Analytics', 
      data: riskAnalyticsData,
      description: 'Detailed risk statistics and distributions'
    },
    { 
      id: 'advanced', 
      label: 'Advanced Attribution', 
      data: advancedAttributionData,
      description: 'Advanced risk decomposition and attribution analysis'
    }
  ];

  const getRiskTableColumns = () => {
    switch (riskDataType) {
      case 'risk_based':
        return [
          { key: 'asset', label: 'Asset', align: 'left' },
          { key: 'totalReturn', label: 'Total Return (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'sharpeRatio', label: 'Sharpe Ratio', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'treynorRatio', label: 'Treynor Ratio', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'sortinoRatio', label: 'Sortino Ratio', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'informationRatio', label: 'Info Ratio', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'alpha', label: 'Alpha (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'beta', label: 'Beta', type: 'number', decimals: 2, align: 'right' },
          { key: 'trackingError', label: 'Track Error (%)', type: 'number', decimals: 2, align: 'right' }
        ];
      case 'risk_analytics':
        return [
          { key: 'asset', label: 'Asset', align: 'left' },
          { key: 'volatility', label: 'Volatility (%)', type: 'number', decimals: 2, align: 'right' },
          { key: 'downsideDeviation', label: 'Downside Dev (%)', type: 'number', decimals: 2, align: 'right' },
          { key: 'maximumDrawdown', label: 'Max DD (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'var95', label: 'VaR 95% (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'cvar95', label: 'CVaR 95% (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'skewness', label: 'Skewness', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'kurtosis', label: 'Kurtosis', type: 'number', decimals: 2, align: 'right' },
          { key: 'omegaRatio', label: 'Omega Ratio', type: 'number', decimals: 2, colorize: true, align: 'right' }
        ];
      case 'advanced':
        return [
          { key: 'asset', label: 'Asset', align: 'left' },
          { key: 'activeReturn', label: 'Active Return (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'systematicRisk', label: 'Systematic Risk', type: 'number', decimals: 2, align: 'right' },
          { key: 'idiosyncraticRisk', label: 'Idiosyncratic Risk', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'persistenceScore', label: 'Persistence Score', type: 'number', decimals: 2, align: 'right' },
          { key: 'riskAdjustedReturn', label: 'Risk Adj Return (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'jensenAlpha', label: 'Jensen Alpha (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
          { key: 'treynorMeasure', label: 'Treynor Measure', type: 'number', decimals: 2, colorize: true, align: 'right' }
        ];
      default:
        return [];
    }
  };

  const getCurrentData = () => {
    return riskDataTypes.find(type => type.id === riskDataType)?.data || [];
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
  title="Portfolio Volatility"
  value={portfolio_level_performance.tracking_error}
  valueFormatter={(val) => `${val}%`}
  icon={Activity}
  emoji="📈"
  color="orange"
  size="small"
/>

<MetricCard
  title="Max Drawdown"
  value={portfolio_level_performance.max_drawdown}
  valueFormatter={(val) => `${val}%`}
  icon={TrendingDown}
  emoji="📉"
  color="red"
  size="small"
/>

<MetricCard
  title="Sharpe Ratio"
  value={portfolio_level_performance.sharpe_ratio}
  icon={Award}
  emoji="🏆"
  color="green"
  size="small"
/>

<MetricCard
  title="Information Ratio"
  value={portfolio_level_performance.information_ratio}
  icon={Target}
  emoji="🎯"
  color="blue"
  size="small"
/>
      </div>

      {/* Risk-Return Scatter Visualization */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className={`text-lg font-semibold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Risk-Return Profile</h3>
        </div>
        <div className="h-80">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            {/* Axes */}
            <line x1="50" y1="250" x2="350" y2="250" stroke={isDark ? "#6B7280" : "#374151"} strokeWidth="1" />
            <line x1="50" y1="250" x2="50" y2="50" stroke={isDark ? "#6B7280" : "#374151"} strokeWidth="1" />
            
            {/* Axis labels */}
            <text x="200" y="280" textAnchor="middle" className={`text-xs ${
              isDark ? 'fill-gray-400' : 'fill-gray-600'
            }`}>Volatility (%)</text>
            <text x="20" y="150" textAnchor="middle" transform="rotate(-90 20 150)" className={`text-xs ${
              isDark ? 'fill-gray-400' : 'fill-gray-600'
            }`}>Return (%)</text>
            
            {/* Data points */}
            {riskAnalyticsData.map((item, index) => {
              const x = 50 + (item.volatility / 50) * 300;
              const y = 250 - ((riskMetricsData.find(r => r.asset === item.asset)?.totalReturn || 0) / 80) * 200;
              const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
              
              return (
                <g key={item.asset}>
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={colors[index % colors.length]}
                    className="hover:opacity-80 cursor-pointer"
                    onClick={() => onStockClick(item.asset)}
                  />
                  <text x={x} y={y - 10} textAnchor="middle" className={`text-xs font-medium ${
                    isDark ? 'fill-gray-300' : 'fill-gray-700'
                  }`}>
                    {item.asset}
                  </text>
                </g>
              );
            })}
            
            {/* Efficient frontier line (illustrative) */}
            <path
              d="M 60,200 Q 150,120 300,140"
              stroke="#10B981"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              opacity="0.6"
            />
          </svg>
        </div>
        <div className={`mt-4 text-sm transition-colors duration-300 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Risk-return profile showing each asset's volatility vs. total return. The dashed line represents an illustrative efficient frontier.
        </div>
      </div>

      {/* Risk Data Analysis */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-purple-600" />
          <h3 className={`text-lg font-semibold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Detailed Risk Analysis</h3>
        </div>
        
        {/* Risk Data Type Tabs */}
        <div className={`border-b mb-6 transition-colors duration-300 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <nav className="flex space-x-8">
            {riskDataTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setRiskDataType(type.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  riskDataType === type.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : `border-transparent hover:border-gray-300 transition-colors duration-300 ${
                        isDark 
                          ? 'text-gray-400 hover:text-gray-300' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`
                }`}
              >
                {type.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Current Tab Description */}
        <div className={`mb-4 p-3 rounded-lg transition-colors duration-300 ${
          isDark ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <p className={`text-sm transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {riskDataTypes.find(type => type.id === riskDataType)?.description}
          </p>
        </div>

        {/* Risk Data Table */}
        <SortableTable
          data={getCurrentData()}
          columns={getRiskTableColumns()}
          onRowClick={(row) => onStockClick(row.asset)}
          defaultSortColumn={riskDataType === 'risk_based' ? 'sharpeRatio' : 
                           riskDataType === 'risk_analytics' ? 'volatility' : 'activeReturn'}
          striped={true}
        />
      </div>

      {/* Risk Decomposition */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Portfolio Risk Breakdown */}
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Portfolio Risk Metrics</h3>
          </div>
          <div className="space-y-4">
            <div className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-300 ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Total Return</span>
              <span className="font-bold text-green-600">+{portfolio_level_performance.total_return}%</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-300 ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Annualized Return</span>
              <span className="font-bold text-green-600">+{portfolio_level_performance.annualized_return}%</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-300 ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Volatility</span>
              <span className="font-bold text-orange-600">{portfolio_level_performance.tracking_error}%</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-300 ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Maximum Drawdown</span>
              <span className="font-bold text-red-600">{portfolio_level_performance.max_drawdown}%</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-300 ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Beta</span>
              <span className="font-bold text-blue-600">{portfolio_level_performance.beta}</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-300 ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Alpha</span>
              <span className="font-bold text-purple-600">+{portfolio_level_performance.alpha}%</span>
            </div>
          </div>
        </div>

        {/* Risk Rankings */}
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Risk Rankings</h3>
          </div>
          
          {/* Highest Risk Assets */}
          <div className="mb-6">
            <h4 className={`font-medium mb-3 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Highest Volatility Assets</h4>
            <div className="space-y-2">
              {riskAnalyticsData
                .sort((a, b) => b.volatility - a.volatility)
                .slice(0, 3)
                .map((item, index) => (
                <div key={item.asset} className={`flex justify-between items-center p-2 rounded transition-colors duration-300 ${
                  isDark ? 'bg-red-900/20' : 'bg-red-50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-red-600 w-4">#{index + 1}</span>
                    <span className={`font-medium transition-colors duration-300 ${
                      isDark ? 'text-red-300' : 'text-red-900'
                    }`}>{item.asset}</span>
                  </div>
                  <span className="text-sm font-bold text-red-600">{item.volatility.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Best Risk-Adjusted Returns */}
          <div>
            <h4 className={`font-medium mb-3 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Best Risk-Adjusted Returns</h4>
            <div className="space-y-2">
              {riskMetricsData
                .sort((a, b) => b.sharpeRatio - a.sharpeRatio)
                .slice(0, 3)
                .map((item, index) => (
                <div key={item.asset} className={`flex justify-between items-center p-2 rounded transition-colors duration-300 ${
                  isDark ? 'bg-green-900/20' : 'bg-green-50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-green-600 w-4">#{index + 1}</span>
                    <span className={`font-medium transition-colors duration-300 ${
                      isDark ? 'text-green-300' : 'text-green-900'
                    }`}>{item.asset}</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">{item.sharpeRatio.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Distribution Histogram */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h3 className={`text-lg font-semibold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Risk Distribution Analysis</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Volatility Distribution */}
          <div>
            <h4 className={`font-medium mb-3 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Volatility Distribution</h4>
            <div className="space-y-2">
              {riskAnalyticsData.map((item, index) => {
                const maxVol = Math.max(...riskAnalyticsData.map(r => r.volatility));
                const width = (item.volatility / maxVol) * 100;
                return (
                  <div key={item.asset} className="flex items-center space-x-2">
                    <span className={`text-sm font-medium w-12 transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>{item.asset}</span>
                    <div className={`flex-1 rounded-full h-2 transition-colors duration-300 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs w-12 transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{item.maximumDrawdown.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sharpe Ratio Distribution */}
          <div>
            <h4 className={`font-medium mb-3 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Sharpe Ratio Distribution</h4>
            <div className="space-y-2">
              {riskMetricsData.map((item, index) => {
                const maxSharpe = Math.max(...riskMetricsData.map(r => r.sharpeRatio));
                const width = (item.sharpeRatio / maxSharpe) * 100;
                return (
                  <div key={item.asset} className="flex items-center space-x-2">
                    <span className={`text-sm font-medium w-12 transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>{item.asset}</span>
                    <div className={`flex-1 rounded-full h-2 transition-colors duration-300 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs w-12 transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{item.sharpeRatio.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;