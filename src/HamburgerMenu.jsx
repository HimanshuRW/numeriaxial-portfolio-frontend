import React, { useState } from 'react';
import { 
  Menu, X, Sun, Moon, TrendingUp, Activity, Brain, Search, 
  PieChart, BarChart3, Shield, Calculator, Target, Home,
  ChevronRight, Settings, User, HelpCircle, LogOut
} from 'lucide-react';
import { useTheme } from './ThemeContext';

const HamburgerMenu = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  const menuItems = [
    { id: 'landing', label: 'Home', icon: Home, description: 'Main dashboard' },
    { 
      id: 'portfolio', 
      label: 'Portfolio Builder', 
      icon: Activity, 
      description: 'Build and construct portfolios' 
    },
    { 
      id: 'analysis', 
      label: 'Portfolio Analytics', 
      icon: BarChart3, 
      description: 'Advanced portfolio analysis' 
    },
    { 
      id: 'screener', 
      label: 'Stock Screener', 
      icon: Search, 
      description: 'Filter and analyze stocks' 
    },
    { 
      id: 'rl', 
      label: 'RL Trading', 
      icon: Brain, 
      description: 'Reinforcement learning models' 
    }
  ];

  const subMenuItems = [
    { id: 'allocation', label: 'Asset Allocation', icon: PieChart },
    { id: 'risk', label: 'Risk Analysis', icon: Shield },
    { id: 'statistics', label: 'Statistics', icon: Calculator },
    { id: 'valuation', label: 'Valuation', icon: Target }
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className={`fixed top-4 left-4 z-50 p-3 rounded-lg shadow-lg transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-white text-gray-800 hover:bg-gray-100'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Menu */}
      <div className={`fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-2xl`}>
        
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Numeriaxial
            </h2>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Advanced Financial Analytics Platform
          </p>
        </div>

        {/* Main Navigation */}
        <div className="p-4">
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Main Navigation
          </h3>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                  currentPage === item.id
                    ? isDark 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 text-blue-700'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className={`text-xs ${
                      currentPage === item.id
                        ? isDark ? 'text-blue-200' : 'text-blue-600'
                        : isDark ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  currentPage === item.id ? 'rotate-90' : 'group-hover:translate-x-1'
                }`} />
              </button>
            ))}
          </nav>
        </div>

        {/* Quick Tools */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Quick Tools
          </h3>
          <div className="space-y-1">
            {subMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Settings
          </h3>
          
          {/* Theme Toggle */}
          <div className="space-y-2">
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                isDark
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span className="font-medium">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
                isDark ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </div>
            </button>

            {/* Additional Settings */}
            <button className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              isDark
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}>
              <Settings className="w-4 h-4" />
              <span className="text-sm">Preferences</span>
            </button>
            
            <button className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              isDark
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}>
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Help & Support</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            © 2025 Numeriaxial Analytics
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;