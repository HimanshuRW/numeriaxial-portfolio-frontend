import React, { useState } from 'react';
import { Layers, TrendingUp, BarChart3, Calculator } from 'lucide-react';
import { useTheme } from '../../../ThemeContext';
import SortableTable from '../../components/SortableTable';
import MetricCard from '../../components/MetricCard';

const FactorAnalysis = ({ data, onStockClick }) => {
  const [activeFactorModel, setActiveFactorModel] = useState('fama_french');
  const { factorBased } = data;
  const { isDark } = useTheme();

  if (!factorBased) {
    return <div className={`text-center py-8 transition-colors duration-300 ${
      isDark ? 'text-gray-400' : 'text-gray-500'
    }`}>No factor analysis data available</div>;
  }

  const { portfolio_performance, fama_french, macroeconomic, statistical_pca, portfolio_weighted } = factorBased;

  const factorModels = [
    { id: 'fama_french', label: 'Fama-French 5-Factor', data: fama_french },
    { id: 'macroeconomic', label: 'Macroeconomic Factors', data: macroeconomic },
    { id: 'statistical', label: 'Statistical PCA', data: statistical_pca }
  ];

  // Prepare data for the active factor model
  const getFactorTableData = () => {
    const model = factorModels.find(m => m.id === activeFactorModel);
    if (!model || !model.data) return [];

    return model.data.map(item => {
      const baseData = {
        asset: item.asset,
        alpha: item.alpha,
        rSquared: item.r_squared,
        residualReturn: item.residual_return,
        totalExplained: item.total_explained_return
      };

      // Add model-specific factors
      if (activeFactorModel === 'fama_french') {
        return {
          ...baseData,
          betaMarket: item.beta_market,
          betaSmb: item.beta_smb,
          betaHml: item.beta_hml,
          betaRmw: item.beta_rmw,
          betaCma: item.beta_cma,
          factorReturnMarket: item.factor_return_market,
          factorReturnSmb: item.factor_return_smb,
          factorReturnHml: item.factor_return_hml
        };
      } else if (activeFactorModel === 'macroeconomic') {
        return {
          ...baseData,
          betaInterestRate: item.beta_interest_rate,
          betaInflation: item.beta_inflation,
          betaOilPrice: item.beta_oil_price,
          betaUsdStrength: item.beta_usd_strength,
          betaEconSurprise: item.beta_econ_surprise,
          factorReturnInterest: item.factor_return_interest,
          factorReturnInflation: item.factor_return_inflation,
          factorReturnOil: item.factor_return_oil
        };
      } else if (activeFactorModel === 'statistical') {
        return {
          ...baseData,
          loadingPc1: item.loading_pc1,
          loadingPc2: item.loading_pc2,
          loadingPc3: item.loading_pc3,
          factorReturnPc1: item.factor_return_pc1,
          factorReturnPc2: item.factor_return_pc2,
          factorReturnPc3: item.factor_return_pc3,
          explainedVariancePc1: item.explained_variance_pc1,
          explainedVariancePc2: item.explained_variance_pc2,
          explainedVariancePc3: item.explained_variance_pc3
        };
      }
      
      return baseData;
    });
  };

  // Get columns for the active factor model
  const getFactorTableColumns = () => {
    const baseColumns = [
      { key: 'asset', label: 'Asset', align: 'left' },
      { key: 'alpha', label: 'Alpha (%)', type: 'number', decimals: 2, colorize: true, align: 'right' },
      { key: 'rSquared', label: 'R²', type: 'number', decimals: 3, align: 'right' }
    ];

    if (activeFactorModel === 'fama_french') {
      return [
        ...baseColumns,
        { key: 'betaMarket', label: 'β Market', type: 'number', decimals: 2, colorize: true, align: 'right' },
        { key: 'betaSmb', label: 'β SMB', type: 'number', decimals: 2, colorize: true, align: 'right' },
        { key: 'betaHml', label: 'β HML', type: 'number', decimals: 2, colorize: true, align: 'right' },
        { key: 'betaRmw', label: 'β RMW', type: 'number', decimals: 2, colorize: true, align: 'right' },
        { key: 'betaCma', label: 'β CMA', type: 'number', decimals: 2, colorize: true, align: 'right' },
        { key: 'totalExplained', label: 'Total Explained (%)', type: 'number', decimals: 2, colorize: true, align: 'right' }
      ];
    } else if (activeFactorModel === 'macroeconomic') {
      return [
        ...baseColumns,
        { key: 'betaInterestRate', label: 'β Interest Rate', type: 'number', decimals: 2, colorize: true, align: 'right' },
        { key: 'betaInflation', label: 'β Inflation', type: 'number', decimals: 2, colorize: true, align: 'right' },
        { key: 'betaOilPrice', label: 'β Oil Price', type: 'number', decimals: 2, colorize: true, align: 'right' },
        { key: 'betaUsdStrength', label: 'β USD Strength', type: 'number', decimals: 2, colorize: true, align: 'right' },
        { key: 'totalExplained', label: 'Total Explained (%)', type: 'number', decimals: 2, colorize: true, align: 'right' }
      ];
    } else if (activeFactorModel === 'statistical') {
      return [
        ...baseColumns,
        { key: 'loadingPc1', label: 'PC1 Loading', type: 'number', decimals: 2, colorize: true, align: 'right' },
        { key: 'loadingPc2', label: 'PC2 Loading', type: 'number', decimals: 2, colorize: true, align: 'right' },
        { key: 'loadingPc3', label: 'PC3 Loading', type: 'number', decimals: 2, colorize: true, align: 'right' },
        { key: 'explainedVariancePc1', label: 'PC1 Var (%)', type: 'number', decimals: 1, align: 'right' },
        { key: 'totalExplained', label: 'Total Explained (%)', type: 'number', decimals: 2, colorize: true, align: 'right' }
      ];
    }

    return baseColumns;
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
  title="Total Return"
  value={portfolio_performance.total_return}
  valueFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
  icon={TrendingUp}
  emoji="🎯"
  color="green"
  size="small"
/>

<MetricCard
  title="Volatility"
  value={portfolio_performance.volatility}
  valueFormatter={(val) => `${val}%`}
  icon={BarChart3}
  emoji="📊"
  color="orange"
  size="small"
/>

<MetricCard
  title="Sharpe Ratio"
  value={portfolio_performance.sharpe_ratio}
  icon={Calculator}
  emoji="⚖️"
  color="blue"
  size="small"
/>

<MetricCard
  title="Beta to Market"
  value={portfolio_performance.beta_to_market}
  icon={Layers}
  emoji="🔗"
  color="purple"
  size="small"
/>
      </div>

      {/* Portfolio-Level Factor Exposure */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Fama-French Portfolio Summary */}
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Fama-French Exposure</h3>
          </div>
          {portfolio_weighted?.fama_french && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Alpha</span>
                <span className="font-medium text-green-600">+{portfolio_weighted.fama_french.alpha}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Market Beta</span>
                <span className={`font-medium transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{portfolio_weighted.fama_french.beta_market}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Size (SMB)</span>
                <span className={`font-medium ${portfolio_weighted.fama_french.beta_smb >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolio_weighted.fama_french.beta_smb}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Value (HML)</span>
                <span className={`font-medium ${portfolio_weighted.fama_french.beta_hml >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolio_weighted.fama_french.beta_hml}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>R-Squared</span>
                <span className="font-medium text-blue-600">{portfolio_weighted.fama_french.r_squared}</span>
              </div>
            </div>
          )}
        </div>

        {/* Macroeconomic Portfolio Summary */}
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Macro Exposure</h3>
          </div>
          {portfolio_weighted?.macroeconomic && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Alpha</span>
                <span className="font-medium text-green-600">+{portfolio_weighted.macroeconomic.alpha}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Interest Rate Beta</span>
                <span className={`font-medium ${portfolio_weighted.macroeconomic.beta_interest_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolio_weighted.macroeconomic.beta_interest_rate}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Inflation Beta</span>
                <span className={`font-medium ${portfolio_weighted.macroeconomic.beta_inflation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolio_weighted.macroeconomic.beta_inflation}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>USD Strength Beta</span>
                <span className={`font-medium ${portfolio_weighted.macroeconomic.beta_usd_strength >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolio_weighted.macroeconomic.beta_usd_strength}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>R-Squared</span>
                <span className="font-medium text-blue-600">{portfolio_weighted.macroeconomic.r_squared}</span>
              </div>
            </div>
          )}
        </div>

        {/* Statistical Portfolio Summary */}
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            <Calculator className="w-5 h-5 text-purple-600" />
            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Statistical Factors</h3>
          </div>
          {portfolio_weighted?.statistical && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Alpha</span>
                <span className="font-medium text-green-600">+{portfolio_weighted.statistical.alpha}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>PC1 Loading</span>
                <span className={`font-medium transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{portfolio_weighted.statistical.loading_pc1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>PC2 Loading</span>
                <span className={`font-medium ${portfolio_weighted.statistical.loading_pc2 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolio_weighted.statistical.loading_pc2}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>PC3 Loading</span>
                <span className={`font-medium transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{portfolio_weighted.statistical.loading_pc3}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>R-Squared</span>
                <span className="font-medium text-blue-600">{portfolio_weighted.statistical.r_squared}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Factor Loadings Visualization */}
      {activeFactorModel === 'fama_french' && (
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Factor Loadings Heatmap</h3>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-1 min-w-96">
              {/* Header */}
              <div className={`p-2 text-xs font-medium transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Asset</div>
              <div className={`p-2 text-xs font-medium transition-colors duration-300 text-center ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Market</div>
              <div className={`p-2 text-xs font-medium transition-colors duration-300 text-center ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>SMB</div>
              <div className={`p-2 text-xs font-medium transition-colors duration-300 text-center ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>HML</div>
              <div className={`p-2 text-xs font-medium transition-colors duration-300 text-center ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>RMW</div>
              <div className={`p-2 text-xs font-medium transition-colors duration-300 text-center ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>CMA</div>
              
              {/* Data rows */}
              {/* {fama_french.map((item) => (
                <React.Fragment key={item.asset}>
                  <div className={`p-2 text-sm font-medium transition-colors duration-300 ${
                    isDark ? 'text-gray-200' : 'text-gray-800'
                  }`}>{item.asset}</div>
                  <div className={`p-2 text-center text-sm rounded ${
                    item.beta_market > 0 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }
                  `}>
                    {item.beta_market.toFixed(2)}
                  </div>
                  <div className={`p-2 text-center text-sm rounded ${
                    item.beta_smb > 0 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {item.beta_smb.toFixed(2)}
                  </div>
                  <div className={`p-2 text-center text-sm rounded ${
                    item.beta_hml > 0 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {item.beta_hml.toFixed(2)}
                  </div>
                  <div className={`p-2 text-center text-sm rounded ${
                    item.beta_rmw > 0 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {item.beta_rmw.toFixed(2)}
                  </div>
                  <div className={`p-2 text-center text-sm rounded ${
                    item.beta_cma > 0 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {item.beta_cma.toFixed(2)}
                  </div>
                </React.Fragment>
              ))} */}
              {fama_french.map((item) => (
  <React.Fragment key={item.asset}>
    <div
      className={`p-2 text-sm font-medium transition-colors duration-300 ${
        isDark ? 'text-gray-200' : 'text-gray-900'
      }`}
    >
      {item.asset}
    </div>

    {['beta_market', 'beta_smb', 'beta_hml', 'beta_rmw', 'beta_cma'].map((key) => {
      const value = item[key];
      const isPositive = value > 0;
      return (
        <div
          key={key}
          className={`p-2 text-center text-sm rounded ${
            isPositive
              ? isDark
                ? 'bg-green-900/30 text-green-300'
                : 'bg-green-100 text-green-900'
              : isDark
                ? 'bg-red-900/30 text-red-300'
                : 'bg-red-100 text-red-900'
          }`}
        >
          {value.toFixed(2)}
        </div>
      );
    })}
  </React.Fragment>
))}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactorAnalysis;