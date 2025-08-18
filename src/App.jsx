import React, { useState } from 'react';
import { TrendingUp, Activity, Brain, ArrowRight, Search } from 'lucide-react';
import { ThemeProvider, useTheme } from './ThemeContext';
import HamburgerMenu from './HamburgerMenu';
import PortfolioBuilder from './portfolio/PortfolioBuilder';
import PortfolioAnalytics from './portfolio/PortfolioAnalytics';
import StockAnalytics from './stock_analytics/StockAnalytics';

// Main App Content Component
const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentStock, setCurrentStock] = useState('');
  const { isDark } = useTheme();

  // Navigation function for stock analytics
  const navigateToStock = (ticker) => {
    setCurrentStock(ticker);
    setCurrentPage('stock-analysis');
  };

  // Landing Page Component with dark theme support
  const LandingPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      {/* Header */}
      <header className={`shadow-sm transition-colors duration-300 ${
        isDark ? 'bg-gray-800 border-b border-gray-700' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-6 ml-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h1 className={`text-3xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Numeriaxial
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className={`transition-colors duration-300 ${
                isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
              }`}>Home</a>
              <a href="#" className={`transition-colors duration-300 ${
                isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
              }`}>About</a>
              <a href="#" className={`transition-colors duration-300 ${
                isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
              }`}>Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center ml-20">
        <h2 className={`text-5xl font-bold mb-6 transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Advanced Financial Analytics Platform
        </h2>
        <p className={`text-xl mb-12 max-w-3xl mx-auto transition-colors duration-300 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Harness the power of data-driven insights with our cutting-edge tools for portfolio optimization, 
          market screening, and reinforcement learning algorithms.
        </p>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* RL Card */}
          <div 
            onClick={() => setCurrentPage('rl')}
            className={`rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' 
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Reinforcement Learning
            </h3>
            <p className={`mb-6 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Deploy advanced RL algorithms for automated trading strategies and market prediction models.
            </p>
            <div className={`flex items-center justify-center transition-colors duration-300 ${
              isDark ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 group-hover:text-blue-700'
            }`}>
              <span className="mr-2">Explore RL</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Screener Card */}
          <div 
            onClick={() => setCurrentPage('screener')}
            className={`rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' 
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Stock Screener
            </h3>
            <p className={`mb-6 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Filter and analyze thousands of stocks with custom criteria and real-time market data.
            </p>
            <div className={`flex items-center justify-center transition-colors duration-300 ${
              isDark ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 group-hover:text-blue-700'
            }`}>
              <span className="mr-2">Start Screening</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Portfolio Analytics Card */}
          <div 
            onClick={() => setCurrentPage('portfolio')}
            className={`rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' 
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Portfolio Analytics
            </h3>
            <p className={`mb-6 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Comprehensive portfolio analysis with risk metrics, performance tracking, and optimization tools.
            </p>
            <div className={`flex items-center justify-center transition-colors duration-300 ${
              isDark ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 group-hover:text-blue-700'
            }`}>
              <span className="mr-2">Analyze Portfolio</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  // Dummy Pages with dark theme support
  const RLPage = () => (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="text-center ml-20">
        <button 
          onClick={() => setCurrentPage('landing')}
          className={`mb-8 flex items-center transition-colors duration-300 ${
            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Home
        </button>
        <Brain className="h-24 w-24 text-purple-500 mx-auto mb-6" />
        <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Reinforcement Learning
        </h1>
        <p className={`text-xl transition-colors duration-300 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Coming Soon - Advanced RL Trading Algorithms
        </p>
      </div>
    </div>
  );

  const ScreenerPage = () => (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="text-center ml-20">
        <button 
          onClick={() => setCurrentPage('landing')}
          className={`mb-8 flex items-center transition-colors duration-300 ${
            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Home
        </button>
        <Search className="h-24 w-24 text-green-500 mx-auto mb-6" />
        <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Stock Screener
        </h1>
        <p className={`text-xl transition-colors duration-300 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Coming Soon - Advanced Stock Screening Tools
        </p>
      </div>
    </div>
  );

  // Main render with hamburger menu
  return (
    <div className={`font-sans transition-colors duration-300 ${
      isDark ? 'dark bg-gray-900' : 'bg-white'
    }`}>
      <HamburgerMenu currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'portfolio' && <PortfolioBuilder onNavigate={setCurrentPage} />}
      {currentPage === 'analysis' && <PortfolioAnalytics onNavigate={setCurrentPage} onStockClick={navigateToStock} />}
      {currentPage === 'stock-analysis' && <StockAnalytics ticker={currentStock} onNavigate={setCurrentPage} />}
      {currentPage === 'rl' && <RLPage />}
      {currentPage === 'screener' && <ScreenerPage />}
    </div>
  );
};

// Root App component with ThemeProvider
const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;