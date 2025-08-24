import { Calendar, TrendingUp, BarChart2, Target,AlertTriangle, Award } from 'lucide-react';
import { useTheme } from '../../../ThemeContext';
import ReturnsBarsChart from '../../components/ReturnsBarChart';
import SortableTable from '../../components/SortableTable';
import MetricCard from '../../components/MetricCard';
import RollingMetricChart from '../../components/RollingMetricChart';
import ReturnsDistributionChart from '../../components/ReturnsDistributionChart';
import { useMemo } from 'react';

const ReturnsAnalysis = ({ data, onStockClick }) => {
  const { performanceBased, returnBased } = data;
  const { isDark } = useTheme();

  // Generate returns time series data
  const returnsChartData = useMemo(() => {
    if (!returnBased?.time_series_data) return [];
    
    const { dates, portfolio_returns } = returnBased.time_series_data;
    const portfolio_returns_values = dates.map((date, index) => ({
      date,
      value: (portfolio_returns[index] * 100)
    }));
    const sp_returns_values = dates.map((date, index) => ({
      date,
      value: (Math.random()- 0.5) * 5
    }));

    return {
      primaryData: portfolio_returns_values,
      secondaryData: sp_returns_values,
    }
  }, [returnBased]);

  // Rolling performance metrics
  const rollingMetrics = performanceBased?.rolling_performance;

  // Security performance table data
  const securityPerformance = returnBased?.security_attribution?.map(security => ({
    security: security.security,
    weight: security.weight,
    totalReturn: security.total_return,
    contribution: security.contribution_to_portfolio,
    volatility: security.volatility,
    sharpeRatio: security.sharpe_ratio
  })) || [];

  const chartConfigs = rollingMetrics ? [
    {
      title: "Sharpe Ratio (252d)",
      data: rollingMetrics.rolling_sharpe_252d,
      color: "#3B82F6"
    },
    {
      title: "Alpha (252d)",
      data: rollingMetrics.rolling_alpha_252d,
      color: "#10B981"
    },
    {
      title: "Beta (252d)",
      data: rollingMetrics.rolling_beta_252d,
      color: "#F59E0B"
    },
    {
      title: "Correlation (252d)",
      data: rollingMetrics.rolling_correlation_252d,
      color: "#8B5CF6"
    }
  ] : null;


  return (
    <div className="space-y-6">
      {/* Returns Time Series Chart - Full Width */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className={`text-lg font-semibold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Portfolio Returns Over Time</h3>
        </div>
        <div className="h-80">
          {/* <TradingViewChart
            data={returnsChartData}
            primaryLabel="Returns (%)"
            showVolume={false}
            showComparison={false}
          /> */}
          <ReturnsBarsChart
            data={returnsChartData.primaryData}
            secondaryData={returnsChartData.secondaryData}
            primaryLabel="Portfolio Returns"
            secondaryLabel="Benchmark Returns"
            baselineMode_input="zero" // or "lowest"
            showComparison={false}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Key Performance Metrics - 2x2 Cards */}
        <div className={`rounded-xl shadow-lg p-6 pb-8 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Key Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-4 pt-3">
            <MetricCard
              title="Annualized Return"
              value={performanceBased?.portfolio_level_performance?.annualized_return || 0}
              valueFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
              color="green"
              size="small"
              icon={Target}
              emoji="🎯"
            />
            <MetricCard
              title="Volatility"
              value={performanceBased?.portfolio_level_performance?.tracking_error || 0}
              valueFormatter={(val) => `${val}%`}
              color="orange"
              size="small"
              icon={AlertTriangle}
              emoji="⚠️"
            />
            <MetricCard
              title="Information Ratio"
              value={performanceBased?.portfolio_level_performance?.information_ratio || 0}
              color="blue"
              size="small"
              icon={BarChart2}
              emoji="📊"
            />
            <MetricCard
              title="Calmar Ratio"
              value={performanceBased?.portfolio_level_performance?.calmar_ratio || 0}
              color="purple"
              size="small"
              icon={Award}
              emoji="🏆"

            />
          </div>
        </div>

        {/* Returns Distribution - Line Chart */}
        <ReturnsDistributionChart returnBased={returnBased} />
      </div>

      {console.log("rollingMetrics : ",JSON.stringify(rollingMetrics,null,2))}

      {/* Rolling Performance Metrics - 4 Mini Bar Charts */}
      {rollingMetrics && (
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Rolling Performance Metrics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {chartConfigs.map((config, index) => (
            <RollingMetricChart
              key={index}
              title={config.title}
              data={config.data}
              dates={rollingMetrics.dates}
              color={config.color}
              isDark={isDark}
            />
          ))}

          </div>
        </div>
      )}

      {/* Security Performance Table */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-purple-600" />
          <h3 className={`text-lg font-semibold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Individual Security Performance</h3>
        </div>
        <SortableTable
          data={securityPerformance}
          columns={[
            { key: 'security', label: 'Security', align: 'left' },
            { key: 'weight', label: 'Weight (%)', type: 'number', decimals: 1, align: 'right' },
            { key: 'totalReturn', label: 'Total Return (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
            { key: 'contribution', label: 'Contribution (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
            { key: 'volatility', label: 'Volatility (%)', type: 'number', decimals: 2, align: 'right' },
            { key: 'sharpeRatio', label: 'Sharpe Ratio', type: 'number', decimals: 2, colorize: true, align: 'right' }
          ]}
          onRowClick={(row) => onStockClick(row.security)}
          defaultSortColumn="totalReturn"
          striped={true}
        />
      </div>
    </div>
  );
};

export default ReturnsAnalysis;