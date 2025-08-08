// Portfolio API functions with dummy data
export const portfolioAPI = {
  async getPortfolioAnalysis(tickers) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      statistics: {
        totalValue: 125000,
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
        daily: [
          { date: 'Mon', portfolio: 124800, benchmark: 124200 },
          { date: 'Tue', portfolio: 125200, benchmark: 124800 },
          { date: 'Wed', portfolio: 124600, benchmark: 124400 },
          { date: 'Thu', portfolio: 125800, benchmark: 125000 },
          { date: 'Fri', portfolio: 125000, benchmark: 124600 }
        ],
        weekly: [
          { date: 'W1', portfolio: 100000, benchmark: 100000 },
          { date: 'W2', portfolio: 102100, benchmark: 101200 },
          { date: 'W3', portfolio: 105800, benchmark: 103500 },
          { date: 'W4', portfolio: 108200, benchmark: 105100 },
          { date: 'W5', portfolio: 112500, benchmark: 107800 },
          { date: 'W6', portfolio: 118400, benchmark: 110200 },
          { date: 'W7', portfolio: 125000, benchmark: 112500 }
        ],
        monthly: [
          { date: 'Jan', portfolio: 100000, benchmark: 100000 },
          { date: 'Feb', portfolio: 102100, benchmark: 101200 },
          { date: 'Mar', portfolio: 105800, benchmark: 103500 },
          { date: 'Apr', portfolio: 108200, benchmark: 105100 },
          { date: 'May', portfolio: 112500, benchmark: 107800 },
          { date: 'Jun', portfolio: 118400, benchmark: 110200 },
          { date: 'Jul', portfolio: 125000, benchmark: 112500 }
        ],
        quarterly: [
          { date: 'Q1', portfolio: 100000, benchmark: 100000 },
          { date: 'Q2', portfolio: 108200, benchmark: 105100 },
          { date: 'Q3', portfolio: 118400, benchmark: 110200 },
          { date: 'Q4', portfolio: 125000, benchmark: 112500 }
        ],
        yearly: [
          { date: '2020', portfolio: 80000, benchmark: 85000 },
          { date: '2021', portfolio: 95000, benchmark: 92000 },
          { date: '2022', portfolio: 88000, benchmark: 87000 },
          { date: '2023', portfolio: 110000, benchmark: 105000 },
          { date: '2024', portfolio: 125000, benchmark: 112500 }
        ]
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