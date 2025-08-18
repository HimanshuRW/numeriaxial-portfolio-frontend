// Enhanced Portfolio API functions with extensive dummy data
export const portfolioAPI = {
  async getPortfolioAnalysis(tickers) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Helper function to generate realistic stock data
    const generateStockData = (startValue, volatility, trend, days) => {
      const data = [];
      let currentValue = startValue;
      
      for (let i = 0; i < days; i++) {
        const randomChange = (Math.random() - 0.5) * volatility;
        const trendChange = trend / days;
        currentValue = Math.max(currentValue + randomChange + trendChange, startValue * 0.3); // Prevent going too low
        
        data.push(currentValue);
      }
      
      return data;
    };

    // Generate dates for different periods
    const generateDates = (startDate, days, format = 'short') => {
      const dates = [];
      const start = new Date(startDate);
      
      for (let i = 0; i < days; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        
        if (format === 'short') {
          dates.push(currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        } else if (format === 'slant') {
          dates.push(currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }));
        } else {
          dates.push(currentDate.toISOString().split('T')[0]);
        }
      }
      
      return dates;
    };

    // Generate weekly dates
    const generateWeeklyDates = (startDate, weeks) => {
      const dates = [];
      const start = new Date(startDate);
      
      for (let i = 0; i < weeks; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + (i * 7));
        dates.push(currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }));
      }
      
      return dates;
    };

    // Generate monthly dates  
    const generateMonthlyDates = (startDate, months) => {
      const dates = [];
      const start = new Date(startDate);
      
      for (let i = 0; i < months; i++) {
        const currentDate = new Date(start);
        currentDate.setMonth(start.getMonth() + i);
        dates.push(currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
      }
      
      return dates;
    };

    // Base portfolio and benchmark data
    const portfolioBaseValue = 100000;
    const benchmarkBaseValue = 100000;
    
    // Daily data (90 days)
    const dailyDays = 90;
    const dailyDates = generateDates('2024-05-15', dailyDays, 'slant');
    const dailyPortfolioData = generateStockData(portfolioBaseValue, 2000, 25000, dailyDays);
    const dailyBenchmarkData = generateStockData(benchmarkBaseValue, 1500, 12500, dailyDays);
    
    // Weekly data (52 weeks)
    const weeklyWeeks = 52;
    const weeklyDates = generateWeeklyDates('2023-08-01', weeklyWeeks);
    const weeklyPortfolioData = generateStockData(portfolioBaseValue, 5000, 25000, weeklyWeeks);
    const weeklyBenchmarkData = generateStockData(benchmarkBaseValue, 3500, 12500, weeklyWeeks);
    
    // Monthly data (24 months)
    const monthlyMonths = 24;
    const monthlyDates = generateMonthlyDates('2022-12-01', monthlyMonths);
    const monthlyPortfolioData = generateStockData(portfolioBaseValue, 8000, 25000, monthlyMonths);
    const monthlyBenchmarkData = generateStockData(benchmarkBaseValue, 6000, 12500, monthlyMonths);
    
    // Quarterly data (8 quarters)
    const quarterlyQuarters = 8;
    const quarterlyDates = ['Q1 \'23', 'Q2 \'23', 'Q3 \'23', 'Q4 \'23', 'Q1 \'24', 'Q2 \'24', 'Q3 \'24', 'Q4 \'24'];
    const quarterlyPortfolioData = generateStockData(portfolioBaseValue, 12000, 25000, quarterlyQuarters);
    const quarterlyBenchmarkData = generateStockData(benchmarkBaseValue, 9000, 12500, quarterlyQuarters);
    
    // Yearly data (5 years)
    const yearlyYears = 5;
    const yearlyDates = ['2020', '2021', '2022', '2023', '2024'];
    const yearlyPortfolioData = generateStockData(80000, 15000, 45000, yearlyYears);
    const yearlyBenchmarkData = generateStockData(85000, 12000, 27500, yearlyYears);

    return {
      statistics: {
        totalValue: Math.round(dailyPortfolioData[dailyPortfolioData.length - 1]),
        totalReturn: 18.5,
        volatility: 15.2,
        sharpeRatio: 1.24,
        beta: 1.08,
        maxDrawdown: -12.3,
        treynorRatio: 16.8,
        sortinoRatio: 1.85,
        mSquared: 2.4,
        informationRatio: 0.85,
        rSquared: 0.78
      },
      stocks: [
        { 
          ticker: 'AAPL', 
          allocation: 35, 
          return: 22.1, 
          volatility: 18.5, 
          beta: 1.15, 
          pe: 28.5,
          pb: 8.2,
          ps: 7.1,
          peg: 1.8,
          mean: 155.40,
          median: 154.20,
          stdDev: 12.8,
          yearRange: '124.17 - 182.94',
          skewness: -0.15,
          rSquared: 0.82,
          tStat: 4.2,
          var95: -2.8,
          maxDrawdown: -15.2,
          expectedShortfall: -4.1,
          trackingError: 1.9
        },
        { 
          ticker: 'MSFT', 
          allocation: 30, 
          return: 19.8, 
          volatility: 16.2, 
          beta: 0.95, 
          pe: 32.1,
          pb: 12.4,
          ps: 13.2,
          peg: 2.1,
          mean: 285.60,
          median: 283.40,
          stdDev: 18.9,
          yearRange: '213.43 - 348.10',
          skewness: 0.08,
          rSquared: 0.75,
          tStat: 3.8,
          var95: -3.2,
          maxDrawdown: -18.7,
          expectedShortfall: -4.8,
          trackingError: 2.1
        },
        { 
          ticker: 'GOOGL', 
          allocation: 25, 
          return: 15.2, 
          volatility: 20.1, 
          beta: 1.25, 
          pe: 24.8,
          pb: 5.1,
          ps: 5.8,
          peg: 1.4,
          mean: 2685.40,
          median: 2672.80,
          stdDev: 285.6,
          yearRange: '2193.62 - 3042.00',
          skewness: 0.22,
          rSquared: 0.71,
          tStat: 2.9,
          var95: -4.1,
          maxDrawdown: -22.4,
          expectedShortfall: -6.2,
          trackingError: 3.4
        },
        { 
          ticker: 'NVDA', 
          allocation: 10, 
          return: 45.6, 
          volatility: 35.8, 
          beta: 1.85, 
          pe: 65.2,
          pb: 21.8,
          ps: 24.6,
          peg: 0.9,
          mean: 485.20,
          median: 465.80,
          stdDev: 89.4,
          yearRange: '132.76 - 731.25',
          skewness: 0.45,
          rSquared: 0.68,
          tStat: 5.8,
          var95: -8.9,
          maxDrawdown: -35.6,
          expectedShortfall: -12.4,
          trackingError: 6.8
        }
      ],
      chartData: {
        daily: dailyDates.map((date, index) => ({
          date,
          portfolio: Math.round(dailyPortfolioData[index]),
          benchmark: Math.round(dailyBenchmarkData[index])
        })),
        weekly: weeklyDates.map((date, index) => ({
          date,
          portfolio: Math.round(weeklyPortfolioData[index]),
          benchmark: Math.round(weeklyBenchmarkData[index])
        })),
        monthly: monthlyDates.map((date, index) => ({
          date,
          portfolio: Math.round(monthlyPortfolioData[index]),
          benchmark: Math.round(monthlyBenchmarkData[index])
        })),
        quarterly: quarterlyDates.map((date, index) => ({
          date,
          portfolio: Math.round(quarterlyPortfolioData[index]),
          benchmark: Math.round(quarterlyBenchmarkData[index])
        })),
        yearly: yearlyDates.map((date, index) => ({
          date,
          portfolio: Math.round(yearlyPortfolioData[index]),
          benchmark: Math.round(yearlyBenchmarkData[index])
        }))
      },
      riskMetrics: [
        { metric: 'Value at Risk (95%)', value: '-$3,250', status: 'warning' },
        { metric: 'Expected Shortfall', value: '-$4,850', status: 'danger' },
        { metric: 'Tracking Error', value: '2.8%', status: 'good' },
        { metric: 'Information Ratio', value: '0.85', status: 'good' },
        { metric: 'Maximum Drawdown', value: '-12.3%', status: 'warning' },
        { metric: 'Standard Deviation', value: '15.2%', status: 'good' }
      ],
      valuationRatios: {
        'AAPL': { pe: 28.5, pb: 8.2, ps: 7.1, peg: 1.8, bookValue: 4.4 },
        'MSFT': { pe: 32.1, pb: 12.4, ps: 13.2, peg: 2.1, bookValue: 18.9 },
        'GOOGL': { pe: 24.8, pb: 5.1, ps: 5.8, peg: 1.4, bookValue: 350.2 },
        'NVDA': { pe: 65.2, pb: 21.8, ps: 24.6, peg: 0.9, bookValue: 28.4 },
        industry: { pe: 37.6, pb: 11.9, ps: 12.7, peg: 1.8, bookValue: 'N/A' }
      },
      performance: {
        '1W': 2.1, '1M': 4.8, '3M': 8.2, '6M': 12.5, '1Y': 18.5, '3Y': 45.2, '5Y': 85.6,
        totalReturn: 18.5,
        maxReturn: 45.6,
        minReturn: -8.2,
        avgReturnAnnualized: 25.4,
        avgExcessReturn: 12.8
      }
    };
  }
};