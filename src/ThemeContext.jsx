import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // const [isDark, setIsDark] = useState(false);
  const [isDark, setIsDark] = useState(true);



  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // make a fucntion => event listener for spacebar key to toggle theme
  const handleKeyDown = (event) => {
    console.log('Key pressed:', event.code);
    if (event.code === 'Space') {
      setIsDark((prev) => !prev);
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    console.log('Toggling theme : ', isDark);
    let oppositeTheme = !isDark;
    setIsDark(oppositeTheme);
  };

  const value = {
    isDark,
    toggleTheme,
    theme: isDark ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};