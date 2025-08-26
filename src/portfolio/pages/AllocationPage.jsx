import CompareMethodologies from './allocation/CompareMethodologies';
import PortfolioWeightsComparison from './allocation/PortfolioWeightsComparison';
import PortfolioAnalyticsSection from './allocation/PortfolioAnalyticsSection';

// Mock theme context
const useTheme = () => ({ isDark: true });

// Sample portfolio data
const portfolioData = {
  stocks: [
    { ticker: 'AAPL', allocation: 22.5, return: 15.2, volatility: 18.3, beta: 1.2 },
    { ticker: 'MSFT', allocation: 18.7, return: 12.8, volatility: 16.1, beta: 1.1 },
    { ticker: 'GOOGL', allocation: 15.3, return: 8.9, volatility: 21.2, beta: 1.3 },
    { ticker: 'AMZN', allocation: 12.1, return: 6.4, volatility: 24.8, beta: 1.4 },
    { ticker: 'TSLA', allocation: 9.8, return: 28.5, volatility: 35.2, beta: 2.1 },
    { ticker: 'NVDA', allocation: 8.6, return: 45.3, volatility: 32.7, beta: 1.9 },
    { ticker: 'META', allocation: 7.2, return: 22.1, volatility: 28.9, beta: 1.6 },
    { ticker: 'NFLX', allocation: 5.8, return: -8.2, volatility: 26.4, beta: 1.5 }
  ]
};

const methodologies = {
  'Black-Litterman': {
    name: 'Black-Litterman',
    short: 'BL',
    description: 'Bayesian approach combining market equilibrium',
    expectedReturn: 14.8,
    sharpeRatio: 0.82,
    allocations: {
      'AAPL': 22.5, 'MSFT': 18.7, 'GOOGL': 15.3, 'AMZN': 12.1, 
      'TSLA': 9.8, 'NVDA': 8.6, 'META': 7.2, 'NFLX': 5.8
    }
  },
  'HRP Optimization': {
    name: 'HRP Optimization',
    short: 'HRP',
    description: 'Hierarchical Risk Parity clustering',
    expectedReturn: 16.2,
    sharpeRatio: 0.74,
    allocations: {
      'AAPL': 16.8, 'MSFT': 16.2, 'GOOGL': 14.9, 'AMZN': 13.7, 
      'TSLA': 12.4, 'NVDA': 11.1, 'META': 9.6, 'NFLX': 5.3
    }
  },
  'MPT Optimization': {
    name: 'MPT Optimization',
    short: 'MPT',
    description: 'Modern Portfolio Theory optimization',
    expectedReturn: 13.5,
    sharpeRatio: 0.91,
    allocations: {
      'AAPL': 25.3, 'MSFT': 21.4, 'GOOGL': 18.2, 'AMZN': 15.1, 
      'TSLA': 8.9, 'NVDA': 6.2, 'META': 3.4, 'NFLX': 1.5
    }
  },
  'Equal Weight': {
    name: 'Equal Weight',
    short: 'EW',
    description: 'Equal allocation across all assets',
    expectedReturn: 15.6,
    sharpeRatio: 0.65,
    allocations: {
      'AAPL': 12.5, 'MSFT': 12.5, 'GOOGL': 12.5, 'AMZN': 12.5, 
      'TSLA': 12.5, 'NVDA': 12.5, 'META': 12.5, 'NFLX': 12.5
    }
  }
};

const stockColors = {
  'AAPL': '#4A7BFF', 'MSFT': '#4AC759', 'GOOGL': '#FF9B44', 'AMZN': '#FF5555',
  'TSLA': '#B366E6', 'NVDA': '#52D974', 'META': '#5BC4E6', 'NFLX': '#FF5D9E'
};

const methodologyAnalytics = {
  'Black-Litterman': { risk: 0.18, return: 0.148, sharpe: 0.973, diversification: 6.9 },
  'HRP': { risk: 0.08, return: 0.03, sharpe: -0.645, diversification: 2.0 },
  'MPT': { risk: 0.42, return: 0.54, sharpe: 1.141, diversification: 1.0 }
};

const AllocationComparisonPage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Compare Methodologies Section */}
        <CompareMethodologies 
          portfolioData={portfolioData}
          methodologies={methodologies}
          stockColors={stockColors}
          isDark={isDark}
        />

        {/* Portfolio Weights Comparison Section */}
        <PortfolioWeightsComparison 
          portfolioData={portfolioData}
          methodologies={methodologies}
          isDark={isDark}
        />

        {/* Portfolio Analytics Dashboard Section */}
        <PortfolioAnalyticsSection 
          methodologyAnalytics={methodologyAnalytics}
          isDark={isDark}
        />
      </div>    
    </div>    
  );
};

export default AllocationComparisonPage;