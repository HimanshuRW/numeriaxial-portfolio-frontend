import { useTheme } from '../../../ThemeContext';
import SortableTable from '../../components/SortableTable';
import MetricCard from '../../components/MetricCard';
import { BarChart3, TrendingUp, PieChart, Shield, Calculator, Menu, X, Home, ArrowUp, ArrowDown, DollarSign, Target, BarChart, TrendingDown, Activity, Star, Briefcase, Plus, Database } from 'lucide-react';

const AttributionAnalysis = ({ data, onStockClick }) => {
  const { bottomUp } = data;
  const { isDark } = useTheme();

  if (!bottomUp) {
    return <div className={`text-center py-8 transition-colors duration-300 ${
      isDark ? 'text-gray-400' : 'text-gray-500'
    }`}>No attribution data available</div>;
  }

  const { portfolio_metrics, brinson_fachler, carino_linking, geometric_attribution, summary } = bottomUp;

  // Prepare Brinson-Fachler data for table
  const brinsonData = brinson_fachler.map(item => ({
    asset: item.asset,
    portfolioWeight: item.portfolio_weight,
    benchmarkWeight: item.benchmark_weight,
    portfolioReturn: item.portfolio_return,
    benchmarkReturn: item.benchmark_return,
    assetAllocation: item.asset_allocation,
    stockSelection: item.stock_selection,
    interaction: item.interaction,
    totalAttribution: item.total_attribution
  }));

  // Prepare combined Carino + Geometric data
  const combinedAttributionData = carino_linking.map((carinoItem, index) => {
    const geometricItem = geometric_attribution[index];
    return {
      asset: carinoItem.asset,
      portfolioWeight: carinoItem.portfolio_weight,
      linkedAttribution: carinoItem.linked_attribution,
      avgWeeklyAttribution: carinoItem.avg_weekly_attribution,
      weeklyVolatility: carinoItem.weekly_attribution_volatility,
      geometricReturn: geometricItem.geometric_portfolio_return,
      geometricExcess: geometricItem.geometric_excess_return,
      weightedContribution: geometricItem.weighted_contribution,
      sharpeRatio: geometricItem.sharpe_ratio
    };
  });

  return (
    <div className="space-y-6">
      {/* Portfolio Attribution Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
  title="Portfolio Return"
  value={portfolio_metrics.portfolio_return}
  valueFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
  icon={TrendingUp}
  emoji="💼"
  color="green"
  size="small"
/>

<MetricCard
  title="Benchmark Return"
  value={portfolio_metrics.benchmark_return}
  valueFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
  icon={BarChart3}
  emoji="📊"
  color="red"
  size="small"
/>

<MetricCard
  title="Excess Return"
  value={portfolio_metrics.excess_return}
  valueFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
  icon={ArrowUp}
  emoji="➕"
  color="blue"
  size="small"
/>

<MetricCard
  title="Data Points"
  value={portfolio_metrics.data_points}
  icon={Calculator}
  emoji="🔢"
  color="purple"
  size="small"
/>
      </div>

      {/* Attribution Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`rounded-lg shadow p-4 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{summary.total_brinson_fachler.toLocaleString()}</div>
            <div className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Brinson-Fachler Total</div>
          </div>
        </div>
        <div className={`rounded-lg shadow p-4 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary.total_carino_linking.toLocaleString()}</div>
            <div className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Carino Linking Total</div>
          </div>
        </div>
        <div className={`rounded-lg shadow p-4 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{summary.total_geometric.toLocaleString()}</div>
            <div className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Geometric Total</div>
          </div>
        </div>
        <div className={`rounded-lg shadow p-4 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{summary.attribution_consistency}%</div>
            <div className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Attribution Consistency</div>
          </div>
        </div>
      </div>

      {/* Brinson-Fachler Attribution */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className={`text-lg font-semibold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Brinson-Fachler Attribution Analysis</h3>
        </div>
        <div className={`mb-4 text-sm transition-colors duration-300 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Analysis of portfolio performance relative to benchmark, decomposed into asset allocation, stock selection, and interaction effects.
        </div>
        <SortableTable
          data={brinsonData}
          columns={[
            { key: 'asset', label: 'Asset', align: 'left' },
            { key: 'portfolioWeight', label: 'Portfolio Wt (%)', type: 'number', decimals: 1, align: 'right' },
            { key: 'benchmarkWeight', label: 'Benchmark Wt (%)', type: 'number', decimals: 1, align: 'right' },
            { key: 'portfolioReturn', label: 'Portfolio Ret (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
            { key: 'benchmarkReturn', label: 'Benchmark Ret (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
            { key: 'assetAllocation', label: 'Asset Allocation', type: 'number', decimals: 0, colorize: true, align: 'right' },
            { key: 'stockSelection', label: 'Stock Selection', type: 'number', decimals: 0, colorize: true, align: 'right' },
            { key: 'interaction', label: 'Interaction', type: 'number', decimals: 0, colorize: true, align: 'right' },
            { key: 'totalAttribution', label: 'Total Attribution', type: 'number', decimals: 0, colorize: true, align: 'right' }
          ]}
          onRowClick={(row) => onStockClick(row.asset)}
          defaultSortColumn="totalAttribution"
          striped={true}
        />
      </div>

      <div className="grid lg:grid-cols-1 gap-6">
        {/* Combined Attribution Analysis */}
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Advanced Attribution Analysis</h3>
          </div>
          <div className={`mb-4 text-sm transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Combined Carino linking and geometric attribution analysis across {carino_linking[0]?.periods_analyzed} periods.
          </div>
          <SortableTable
            data={combinedAttributionData}
            columns={[
              { key: 'asset', label: 'Asset', align: 'left' },
              { key: 'portfolioWeight', label: 'Weight (%)', type: 'number', decimals: 1, align: 'right' },
              { key: 'linkedAttribution', label: 'Linked Attribution', type: 'number', decimals: 0, colorize: true, align: 'right' },
              { key: 'avgWeeklyAttribution', label: 'Avg Weekly', type: 'number', decimals: 2, colorize: true, align: 'right' },
              { key: 'weeklyVolatility', label: 'Weekly Vol', type: 'number', decimals: 2, align: 'right' },
              { key: 'geometricReturn', label: 'Geo Return (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
              { key: 'geometricExcess', label: 'Excess Return (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
              { key: 'weightedContribution', label: 'Contribution', type: 'number', decimals: 0, colorize: true, align: 'right' },
              { key: 'sharpeRatio', label: 'Sharpe', type: 'number', decimals: 2, colorize: true, align: 'right' }
            ]}
            onRowClick={(row) => onStockClick(row.asset)}
            defaultSortColumn="weightedContribution"
            striped={true}
          />
        </div>
      </div>

      {/* Attribution Visualization */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <PieChart className="w-5 h-5 text-orange-600" />
          <h3 className={`text-lg font-semibold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Attribution Breakdown Visualization</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset Allocation Effect */}
          <div>
            <h4 className={`font-medium mb-3 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Asset Allocation Effect</h4>
            <div className="space-y-2">
              {brinson_fachler.map((item, index) => (
                <div key={item.asset} className={`flex justify-between items-center p-2 rounded transition-colors duration-300 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    isDark ? 'text-gray-200' : 'text-gray-800'
                  }`}>{item.asset}</span>
                  <span className={`text-sm font-bold ${item.asset_allocation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.asset_allocation.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Selection Effect */}
          <div>
            <h4 className={`font-medium mb-3 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Stock Selection Effect</h4>
            <div className="space-y-2">
              {brinson_fachler.map((item, index) => (
                <div key={item.asset} className={`flex justify-between items-center p-2 rounded transition-colors duration-300 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    isDark ? 'text-gray-200' : 'text-gray-800'
                  }`}>{item.asset}</span>
                  <span className={`text-sm font-bold ${item.stock_selection >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.stock_selection.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interaction Effect */}
          <div>
            <h4 className={`font-medium mb-3 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Interaction Effect</h4>
            <div className="space-y-2">
              {brinson_fachler.map((item, index) => (
                <div key={item.asset} className={`flex justify-between items-center p-2 rounded transition-colors duration-300 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    isDark ? 'text-gray-200' : 'text-gray-800'
                  }`}>{item.asset}</span>
                  <span className={`text-sm font-bold ${item.interaction >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.interaction.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Period Information */}
      <div className={`rounded-lg p-4 transition-colors duration-300 ${
        isDark ? 'bg-blue-900/20' : 'bg-blue-50'
      }`}>
        <h4 className={`font-medium mb-2 transition-colors duration-300 ${
          isDark ? 'text-blue-300' : 'text-blue-900'
        }`}>Analysis Period</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className={`transition-colors duration-300 ${
              isDark ? 'text-blue-400' : 'text-blue-700'
            }`}>Start Date:</span>
            <span className={`ml-2 font-medium transition-colors duration-300 ${
              isDark ? 'text-gray-200' : 'text-gray-800'
            }`}>{portfolio_metrics.analysis_period.start}</span>
          </div>
          <div>
            <span className={`transition-colors duration-300 ${
              isDark ? 'text-blue-400' : 'text-blue-700'
            }`}>End Date:</span>
            <span className={`ml-2 font-medium transition-colors duration-300 ${
              isDark ? 'text-gray-200' : 'text-gray-800'
            }`}>{portfolio_metrics.analysis_period.end}</span>
          </div>
          <div>
            <span className={`transition-colors duration-300 ${
              isDark ? 'text-blue-400' : 'text-blue-700'
            }`}>Data Points:</span>
            <span className={`ml-2 font-medium transition-colors duration-300 ${
              isDark ? 'text-gray-200' : 'text-gray-800'
            }`}>{portfolio_metrics.data_points}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributionAnalysis;