// Stock API functions with comprehensive dummy data
export const stockAPI = {
  async getStockAnalysis(ticker) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate different data based on ticker
    const tickerData = {
      'AAPL': {
        currentPrice: 185.43,
        changePercent: 2.14,
        sector: 'Technology',
        industry: 'Consumer Electronics',
        marketCap: '2.89T',
        peRatio: 28.5,
        pbRatio: 8.2,
        psRatio: 7.1,
        pegRatio: 1.8,
        divYield: 0.52,
        beta: 1.15,
        eps: 6.50,
        revenue: '394.3B',
        netIncome: '99.8B',
        grossMargin: 44.1,
        operatingMargin: 25.3,
        netMargin: 25.3,
        roe: 147.4,
        roa: 27.1,
        debtToEquity: 1.73,
        currentRatio: 0.94,
        quickRatio: 0.82,
        priceTarget: 195.50,
        analystRating: 'Buy',
        peers: ['MSFT', 'GOOGL', 'META', 'TSLA']
      },
      'MSFT': {
        currentPrice: 342.56,
        changePercent: 1.87,
        sector: 'Technology',
        industry: 'Software',
        marketCap: '2.54T',
        peRatio: 32.1,
        pbRatio: 12.4,
        psRatio: 13.2,
        pegRatio: 2.1,
        divYield: 0.72,
        beta: 0.95,
        eps: 10.67,
        revenue: '211.9B',
        netIncome: '72.4B',
        grossMargin: 68.4,
        operatingMargin: 36.7,
        netMargin: 34.2,
        roe: 42.6,
        roa: 16.8,
        debtToEquity: 0.47,
        currentRatio: 1.75,
        quickRatio: 1.72,
        priceTarget: 365.00,
        analystRating: 'Strong Buy',
        peers: ['AAPL', 'GOOGL', 'CRM', 'ORCL']
      },
      'GOOGL': {
        currentPrice: 2745.32,
        changePercent: -0.45,
        sector: 'Technology',
        industry: 'Internet & Direct Marketing Retail',
        marketCap: '1.68T',
        peRatio: 24.8,
        pbRatio: 5.1,
        psRatio: 5.8,
        pegRatio: 1.4,
        divYield: 0.0,
        beta: 1.25,
        eps: 110.75,
        revenue: '282.8B',
        netIncome: '73.8B',
        grossMargin: 57.8,
        operatingMargin: 26.1,
        netMargin: 26.1,
        roe: 30.6,
        roa: 19.2,
        debtToEquity: 0.19,
        currentRatio: 2.93,
        quickRatio: 2.90,
        priceTarget: 2850.00,
        analystRating: 'Buy',
        peers: ['META', 'AAPL', 'MSFT', 'AMZN']
      },
      'NVDA': {
        currentPrice: 485.20,
        changePercent: 3.42,
        sector: 'Technology',
        industry: 'Semiconductors',
        marketCap: '1.19T',
        peRatio: 65.2,
        pbRatio: 21.8,
        psRatio: 24.6,
        pegRatio: 0.9,
        divYield: 0.03,
        beta: 1.85,
        eps: 7.44,
        revenue: '60.9B',
        netIncome: '29.8B',
        grossMargin: 73.0,
        operatingMargin: 48.9,
        netMargin: 48.9,
        roe: 123.0,
        roa: 48.7,
        debtToEquity: 0.37,
        currentRatio: 4.55,
        quickRatio: 4.28,
        priceTarget: 525.00,
        analystRating: 'Strong Buy',
        peers: ['AMD', 'INTC', 'QCOM', 'AVGO']
      }
    };

    const baseData = tickerData[ticker] || tickerData['AAPL'];

    return {
      ...baseData,
      chartData: {
        daily: [
          { date: 'Mon', stock: baseData.currentPrice * 0.99, sp500: 4580, sector: baseData.currentPrice * 0.98 },
          { date: 'Tue', stock: baseData.currentPrice * 1.01, sp500: 4590, sector: baseData.currentPrice * 1.00 },
          { date: 'Wed', stock: baseData.currentPrice * 0.98, sp500: 4575, sector: baseData.currentPrice * 0.99 },
          { date: 'Thu', stock: baseData.currentPrice * 1.03, sp500: 4605, sector: baseData.currentPrice * 1.02 },
          { date: 'Fri', stock: baseData.currentPrice, sp500: 4595, sector: baseData.currentPrice * 1.01 }
        ],
        weekly: [
          { date: 'W1', stock: baseData.currentPrice * 0.85, sp500: 4200, sector: baseData.currentPrice * 0.87 },
          { date: 'W2', stock: baseData.currentPrice * 0.89, sp500: 4250, sector: baseData.currentPrice * 0.90 },
          { date: 'W3', stock: baseData.currentPrice * 0.94, sp500: 4320, sector: baseData.currentPrice * 0.93 },
          { date: 'W4', stock: baseData.currentPrice * 0.91, sp500: 4280, sector: baseData.currentPrice * 0.92 },
          { date: 'W5', stock: baseData.currentPrice * 0.96, sp500: 4450, sector: baseData.currentPrice * 0.95 },
          { date: 'W6', stock: baseData.currentPrice * 0.98, sp500: 4520, sector: baseData.currentPrice * 0.97 },
          { date: 'W7', stock: baseData.currentPrice, sp500: 4595, sector: baseData.currentPrice * 1.01 }
        ],
        monthly: [
          { date: 'Jan', stock: baseData.currentPrice * 0.75, sp500: 3800, sector: baseData.currentPrice * 0.78 },
          { date: 'Feb', stock: baseData.currentPrice * 0.78, sp500: 3900, sector: baseData.currentPrice * 0.81 },
          { date: 'Mar', stock: baseData.currentPrice * 0.82, sp500: 4100, sector: baseData.currentPrice * 0.84 },
          { date: 'Apr', stock: baseData.currentPrice * 0.85, sp500: 4200, sector: baseData.currentPrice * 0.87 },
          { date: 'May', stock: baseData.currentPrice * 0.88, sp500: 4350, sector: baseData.currentPrice * 0.89 },
          { date: 'Jun', stock: baseData.currentPrice * 0.92, sp500: 4450, sector: baseData.currentPrice * 0.93 },
          { date: 'Jul', stock: baseData.currentPrice, sp500: 4595, sector: baseData.currentPrice * 1.01 }
        ]
      },
      financials: {
        quarterly: [
          { quarter: 'Q1 2024', revenue: baseData.revenue.replace('B', '') * 0.22, eps: baseData.eps * 0.24, netIncome: baseData.netIncome.replace('B', '') * 0.23 },
          { quarter: 'Q4 2023', revenue: baseData.revenue.replace('B', '') * 0.25, eps: baseData.eps * 0.26, netIncome: baseData.netIncome.replace('B', '') * 0.25 },
          { quarter: 'Q3 2023', revenue: baseData.revenue.replace('B', '') * 0.24, eps: baseData.eps * 0.25, netIncome: baseData.netIncome.replace('B', '') * 0.24 },
          { quarter: 'Q2 2023', revenue: baseData.revenue.replace('B', '') * 0.23, eps: baseData.eps * 0.23, netIncome: baseData.netIncome.replace('B', '') * 0.22 }
        ],
        annual: [
          { year: '2023', revenue: baseData.revenue, eps: baseData.eps, netIncome: baseData.netIncome, roe: baseData.roe },
          { year: '2022', revenue: (parseFloat(baseData.revenue.replace('B', '')) * 0.85) + 'B', eps: baseData.eps * 0.82, netIncome: (parseFloat(baseData.netIncome.replace('B', '')) * 0.78) + 'B', roe: baseData.roe * 0.88 },
          { year: '2021', revenue: (parseFloat(baseData.revenue.replace('B', '')) * 0.72) + 'B', eps: baseData.eps * 0.65, netIncome: (parseFloat(baseData.netIncome.replace('B', '')) * 0.68) + 'B', roe: baseData.roe * 0.75 },
          { year: '2020', revenue: (parseFloat(baseData.revenue.replace('B', '')) * 0.68) + 'B', eps: baseData.eps * 0.58, netIncome: (parseFloat(baseData.netIncome.replace('B', '')) * 0.55) + 'B', roe: baseData.roe * 0.68 }
        ]
      },
      predictions: {
        historical: [
          { date: 'Jan', price: baseData.currentPrice * 0.75 },
          { date: 'Feb', price: baseData.currentPrice * 0.78 },
          { date: 'Mar', price: baseData.currentPrice * 0.82 },
          { date: 'Apr', price: baseData.currentPrice * 0.85 },
          { date: 'May', price: baseData.currentPrice * 0.88 },
          { date: 'Jun', price: baseData.currentPrice * 0.92 },
          { date: 'Jul', price: baseData.currentPrice }
        ],
        future: [
          { date: 'Aug', mean: baseData.currentPrice * 1.02, high: baseData.currentPrice * 1.08, low: baseData.currentPrice * 0.98 },
          { date: 'Sep', mean: baseData.currentPrice * 1.04, high: baseData.currentPrice * 1.12, low: baseData.currentPrice * 0.96 },
          { date: 'Oct', mean: baseData.currentPrice * 1.06, high: baseData.currentPrice * 1.15, low: baseData.currentPrice * 0.95 },
          { date: 'Nov', mean: baseData.currentPrice * 1.08, high: baseData.currentPrice * 1.18, low: baseData.currentPrice * 0.94 },
          { date: 'Dec', mean: baseData.currentPrice * 1.10, high: baseData.currentPrice * 1.22, low: baseData.currentPrice * 0.92 },
          { date: 'Jan 25', mean: baseData.currentPrice * 1.12, high: baseData.currentPrice * 1.25, low: baseData.currentPrice * 0.90 }
        ]
      },
      peerComparison: {
        [ticker]: {
          peRatio: baseData.peRatio,
          pbRatio: baseData.pbRatio,
          psRatio: baseData.psRatio,
          roe: baseData.roe,
          netMargin: baseData.netMargin,
          revenue: baseData.revenue,
          marketCap: baseData.marketCap,
          changePercent: baseData.changePercent
        },
        ...(baseData.peers.reduce((acc, peer, index) => {
          const multipliers = [0.85, 1.15, 0.95, 1.25];
          const mult = multipliers[index] || 1.0;
          acc[peer] = {
            peRatio: (baseData.peRatio * mult).toFixed(1),
            pbRatio: (baseData.pbRatio * mult).toFixed(1),
            psRatio: (baseData.psRatio * mult).toFixed(1),
            roe: (baseData.roe * mult).toFixed(1),
            netMargin: (baseData.netMargin * mult).toFixed(1),
            revenue: (parseFloat(baseData.revenue.replace('B', '').replace('T', '000')) * mult).toFixed(1) + 'B',
            marketCap: (parseFloat(baseData.marketCap.replace('T', '').replace('B', '')) * mult).toFixed(2) + 'T',
            changePercent: (baseData.changePercent * (mult > 1 ? 0.8 : 1.2)).toFixed(2)
          };
          return acc;
        }, {}))
      },
      sectorData: {
        name: baseData.sector,
        avgPE: baseData.peRatio * 1.1,
        avgPB: baseData.pbRatio * 0.9,
        avgPS: baseData.psRatio * 1.05,
        avgROE: baseData.roe * 0.85,
        avgNetMargin: baseData.netMargin * 0.9
      }
    };
  }
};