import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, PieChart, Shield, Calculator, Menu, X, Home, ArrowUp, ArrowDown, DollarSign, Target, BarChart, TrendingDown, Activity, Star } from 'lucide-react';
import MetricCard from './components/MetricCard';
import SortableTable from './components/SortableTable';
import LoadingState from './components/LoadingState';
import TradingViewChart from './components/TradingViewChart';

// Import existing pages
import AllocationPage from './pages/AllocationPage';
import RiskAnalysisPage from './pages/RiskAnalysisPage';
import StatisticsPage from './pages/StatisticsPage';
import PerformancePage from './pages/PerformancePage';

import { useTheme } from '../ThemeContext';

const PortfolioAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark, toggleTheme } = useTheme();

  // Fetch portfolio overview data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5173/portfolio_overview.json');
        const data = await response.json();
        setPortfolioData(data);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // Map portfolio data to expected format for other pages
  const mapDataForPages = (data) => {
    if (!data) return null;
    
    return {
      ...data,
      // Map current_holdings to stocks format expected by other pages
      stocks: data.current_holdings?.map((holding, index) => ({
        ticker: holding.symbol,
        allocation: holding.portfolio_weight,
        return: holding.total_return_percent,
        volatility: Math.abs(holding.total_return_percent) + Math.random() * 10, // Mock volatility
        beta: (Math.random() * 1.5 + 0.5).toFixed(2), // Mock beta
        var95: (Math.random() * -5 - 2).toFixed(1), // Mock VaR
        maxDrawdown: (Math.random() * -15 - 5).toFixed(1), // Mock max drawdown
        trackingError: (Math.random() * 8 + 2).toFixed(1), // Mock tracking error
        mean: (holding.current_price || 100 + Math.random() * 200).toFixed(2), // Mock mean price
        median: (holding.current_price || 95 + Math.random() * 190).toFixed(2), // Mock median
        stdDev: (Math.random() * 25 + 5).toFixed(1), // Mock std dev
        yearRange: `$${(50 + Math.random() * 100).toFixed(0)}-$${(200 + Math.random() * 100).toFixed(0)}`, // Mock range
        skewness: (Math.random() * 2 - 1).toFixed(2), // Mock skewness
        rSquared: (Math.random() * 0.4 + 0.6).toFixed(2), // Mock R-squared
        tStat: (Math.random() * 4 + 1).toFixed(1) // Mock T-stat
      })) || [],
      
      // Add statistics object
      statistics: {
        totalValue: data.portfolio_summary?.total_portfolio_value || 0,
        volatility: data.quick_stats?.portfolio_volatility || (Math.random() * 10 + 15).toFixed(1),
        beta: data.basic_performance_metrics?.portfolio_beta || (Math.random() * 0.6 + 0.8).toFixed(2),
        maxDrawdown: data.quick_stats?.maximum_drawdown || (Math.random() * -15 - 5).toFixed(1),
        sharpeRatio: data.basic_performance_metrics?.sharpe_ratio || (Math.random() * 1.5 + 0.5).toFixed(2),
        informationRatio: (Math.random() * 1.2 + 0.3).toFixed(2), // Mock IR
        rSquared: (Math.random() * 0.3 + 0.7).toFixed(2) // Mock portfolio R-squared
      },
      
      // Add risk metrics
      riskMetrics: [
        { metric: 'Value at Risk (95%)', value: '-2.8%', status: 'good' },
        { metric: 'Expected Shortfall', value: '-4.2%', status: 'warning' },
        { metric: 'Maximum Drawdown', value: data.quick_stats?.maximum_drawdown + '%' || '-12.5%', status: 'good' },
        { metric: 'Volatility', value: data.quick_stats?.portfolio_volatility + '%' || '18.2%', status: 'good' },
        { metric: 'Beta vs S&P500', value: data.basic_performance_metrics?.portfolio_beta || '1.05', status: 'good' },
        { metric: 'Tracking Error', value: '4.2%', status: 'warning' }
      ],
      
      // Add valuation ratios
      valuationRatios: {
        industry: { pe: '22.5', pb: '3.2', ps: '2.8', peg: '1.8', bookValue: '$45.20' },
        ...(data.current_holdings?.reduce((acc, holding) => {
          acc[holding.symbol] = {
            pe: (Math.random() * 30 + 10).toFixed(1),
            pb: (Math.random() * 5 + 1).toFixed(1),
            ps: (Math.random() * 8 + 0.5).toFixed(1),
            peg: (Math.random() * 3 + 0.5).toFixed(1),
            bookValue: '$' + (Math.random() * 100 + 20).toFixed(2)
          };
          return acc;
        }, {}) || {})
      },
      
      // Add performance data
      performance: {
        totalReturn: data.basic_performance_metrics?.total_portfolio_return || (Math.random() * 20 + 5).toFixed(1),
        maxReturn: (Math.random() * 15 + 25).toFixed(1),
        minReturn: (Math.random() * -20 - 5).toFixed(1),
        avgReturnAnnualized: (Math.random() * 12 + 8).toFixed(1),
        avgExcessReturn: (Math.random() * 8 + 2).toFixed(1),
        '1D': data.portfolio_summary?.todays_pnl_percent || (Math.random() * 4 - 2).toFixed(1),
        '1W': (Math.random() * 6 - 3).toFixed(1),
        '1M': (Math.random() * 8 - 4).toFixed(1),
        '3M': (Math.random() * 15 - 7).toFixed(1),
        '6M': (Math.random() * 25 - 12).toFixed(1),
        '1Y': data.basic_performance_metrics?.total_portfolio_return || (Math.random() * 30 - 15).toFixed(1),
        'YTD': (Math.random() * 20 - 10).toFixed(1)
      }
    };
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home, color: 'blue' },
    { id: 'performance', label: 'Performance', icon: TrendingUp, color: 'green' },
    { id: 'allocation', label: 'Allocation', icon: PieChart, color: 'purple' },
    { id: 'risk', label: 'Risk Analysis', icon: Shield, color: 'red' },
    { id: 'statistics', label: 'Statistics', icon: Calculator, color: 'orange' }
  ];

  const handleStockClick = (ticker) => {
    console.log('Stock clicked:', ticker);
    // TODO: Implement stock detail view
  };

  const renderOverview = () => {
    if (!portfolioData) return <LoadingState type="skeleton" />;

    const chartData = portfolioData.time_series; //TODO
    const { portfolio_summary, current_holdings, daily_movers, basic_performance_metrics } = portfolioData;

    return (
      <div className="space-y-6">
        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <MetricCard
  title="Total Portfolio Value"
  value={portfolio_summary.total_portfolio_value}
  valueFormatter={(val) => `${(val / 1000000).toFixed(2)}M`}
  icon={DollarSign}
  emoji="💰"
  color="blue"
  trend={portfolio_summary.todays_pnl_percent > 0 ? 'up' : 'down'}
  trendValue={`${portfolio_summary.todays_pnl_percent > 0 ? '+' : ''}${portfolio_summary.todays_pnl_percent}%`}
  size="small"
/>

<MetricCard
  title="Total Return"
  value={basic_performance_metrics.total_portfolio_return}
  valueFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
  icon={Target}
  emoji="🎯"
  color={basic_performance_metrics.total_portfolio_return >= 0 ? 'green' : 'red'}
  size="small"
/>

<MetricCard
  title="Sharpe Ratio"
  value={basic_performance_metrics.sharpe_ratio}
  icon={BarChart}
  emoji="📊"
  color="purple"
  size="small"
/>

<MetricCard
  title="Max Drawdown"
  value={portfolioData.quick_stats.maximum_drawdown}
  valueFormatter={(val) => `${val}%`}
  icon={TrendingDown}
  emoji="📉"
  color="red"
  size="small"
/>

<MetricCard
  title="Information Ratio"
  value={portfolioData.quick_stats.portfolio_volatility * 0.1}
  valueFormatter={(val) => val.toFixed(2)}
  icon={Activity}
  emoji="📈"
  color="blue"
  size="small"
/>

<MetricCard
  title="Alpha"
  value={5.2}
  valueFormatter={(val) => `+${val}%`}
  icon={Star}
  emoji="⭐"
  color="orange"
  size="small"
/>
        </div>

        {/* Portfolio Valuation Chart */}
        <div className="h-96 mb-200">
            <TradingViewChart
              data={chartData}
              primaryLabel="Portfolio Value"
              showVolume={false}
              showComparison={false}
            />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Daily Movers */}
          <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Daily Movers</h3>
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-green-900/20' : 'bg-green-50'
              }`}>
                <div className="flex items-center space-x-2">
                  <ArrowUp className="w-4 h-4 text-green-600" />
                  <span className={`font-medium transition-colors duration-300 ${
                    isDark ? 'text-green-300' : 'text-green-900'
                  }`}>Best Performer</span>
                </div>
                <div className="text-right">
                  <div className={`font-bold transition-colors duration-300 ${
                    isDark ? 'text-green-300' : 'text-green-900'
                  }`}>{daily_movers.biggest_gainer.symbol}</div>
                  <div className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-green-400' : 'text-green-700'
                  }`}>
                    +{daily_movers.biggest_gainer.change_percent}% (${daily_movers.biggest_gainer.change_dollar})
                  </div>
                </div>
              </div>
              
              <div className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-red-900/20' : 'bg-red-50'
              }`}>
                <div className="flex items-center space-x-2">
                  <ArrowDown className="w-4 h-4 text-red-600" />
                  <span className={`font-medium transition-colors duration-300 ${
                    isDark ? 'text-red-300' : 'text-red-900'
                  }`}>Worst Performer</span>
                </div>
                <div className="text-right">
                  <div className={`font-bold transition-colors duration-300 ${
                    isDark ? 'text-red-300' : 'text-red-900'
                  }`}>{daily_movers.biggest_loser.symbol}</div>
                  <div className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-red-400' : 'text-red-700'
                  }`}>
                    {daily_movers.biggest_loser.change_percent}% (${daily_movers.biggest_loser.change_dollar})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Key Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className={`text-center p-3 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className={`text-lg font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{basic_performance_metrics.portfolio_beta}</div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Beta</div>
              </div>
              <div className={`text-center p-3 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className={`text-lg font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{basic_performance_metrics.sharpe_ratio}</div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Sharpe Ratio</div>
              </div>
              <div className={`text-center p-3 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="text-lg font-bold text-green-600">{basic_performance_metrics.best_performing_asset.symbol}</div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Best Asset</div>
              </div>
              <div className={`text-center p-3 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="text-lg font-bold text-red-600">{basic_performance_metrics.most_volatile_asset.symbol}</div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Most Volatile</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Holdings Table - Full Width */}
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Current Holdings</h3>
          <SortableTable
            data={current_holdings.map(holding => ({
              symbol: holding.symbol,
              company: holding.company_name,
              weight: holding.portfolio_weight,
              value: holding.market_value,
              return: holding.total_return_percent,
              todayChange: holding.todays_change_percent,
              shares: holding.shares_held,
              todayPnL: holding.todays_change_dollar
            }))}
            columns={[
              { key: 'symbol', label: 'Symbol', align: 'left' },
              { key: 'company', label: 'Company', align: 'left' },
              { key: 'weight', label: 'Weight %', type: 'percentage', decimals: 1, align: 'right' },
              { key: 'value', label: 'Market Value', type: 'currency', align: 'right' },
              { key: 'return', label: 'Total Return', type: 'percentage', colorize: true, align: 'right' },
              { key: 'todayChange', label: 'Today %', type: 'percentage', colorize: true, align: 'right' },
              { key: 'todayPnL', label: 'Today P&L', type: 'currency', colorize: true, align: 'right' },
              { key: 'shares', label: 'Shares', type: 'number', decimals: 0, align: 'right' }
            ]}
            onRowClick={(row) => handleStockClick(row.symbol)}
            striped={true}
          />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingState type="skeleton" />;
    }

    // Use mapped data for all pages except overview and performance
    const mappedData = mapDataForPages(portfolioData);

    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'performance':
        return <PerformancePage portfolioData={portfolioData} onStockClick={handleStockClick} />;
      case 'allocation':
        return <AllocationPage portfolioData={mappedData} onStockClick={handleStockClick} />;
      case 'risk':
        return <RiskAnalysisPage portfolioData={mappedData} onStockClick={handleStockClick} />;
      case 'statistics':
        return <StatisticsPage portfolioData={mappedData} onStockClick={handleStockClick} />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg shadow-md transition-colors duration-300 ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}>
          <div className={`h-full shadow-lg border-r transition-colors duration-300 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {/* Logo/Header */}
            <div className={`p-6 border-b transition-colors duration-300 ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className={`text-xl font-bold transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Portfolio</h1>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Analytics</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? `bg-${item.color}-50 text-${item.color}-700 dark:bg-${item.color}-900/20 dark:text-${item.color}-300`
                        : `transition-colors duration-300 ${
                            isDark 
                              ? 'text-gray-400 hover:bg-gray-700' 
                              : 'text-gray-600 hover:bg-gray-50'
                          }`
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? `text-${item.color}-600` : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Theme Toggle */}
            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={toggleTheme}
                className={`w-full p-3 rounded-lg transition-colors duration-300 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="text-sm font-medium">
                  {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
          {activeTab === 'performance' ? renderContent() :
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-3xl font-bold capitalize transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {activeTab === 'overview' ? 'Portfolio Overview' : 
                     activeTab === 'performance' ? 'Performance Analysis' :
                     activeTab === 'allocation' ? 'Asset Allocation' :
                     activeTab === 'risk' ? 'Risk Analysis' :
                     'Statistical Analysis'}
                  </h2>
                  <p className={`mt-1 transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {portfolioData && `Last updated: ${new Date().toLocaleDateString()}`}
                  </p>
                </div>
                
                {portfolioData && (
                  <div className="text-right">
                    <div className={`text-2xl font-bold transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      ${(portfolioData.portfolio_summary.total_portfolio_value / 1000000).toFixed(2)}M
                    </div>
                    <div className={`text-sm font-medium ${
                      portfolioData.portfolio_summary.todays_pnl_percent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {portfolioData.portfolio_summary.todays_pnl_percent >= 0 ? '+' : ''}
                      {portfolioData.portfolio_summary.todays_pnl_percent}% Today
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
}
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
  );
};

export default PortfolioAnalytics;