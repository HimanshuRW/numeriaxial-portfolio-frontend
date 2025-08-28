// Smart time configuration generator with intelligent date formatting
export function generateTimeConfig(performanceData) {
  // Get the first methodology's data to determine time range
  const sampleData = Object.values(performanceData)[0];
  const totalPeriods = sampleData.length;
  
  // Start from today and go backwards (realistic portfolio tracking)
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - totalPeriods + 1);
  
  // Helper function to format dates intelligently
  const formatDate = (date, format) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    switch (format) {
      case 'day':
        return `${date.getDate()}/${date.getMonth() + 1}`;
      case 'month':
        return `${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
      case 'year':
        return date.getFullYear().toString();
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `Q${quarter} ${date.getFullYear().toString().slice(-2)}`;
      default:
        return date.toLocaleDateString();
    }
  };
  
  // Calculate optimal grid points (target ~15 points)
  const targetGridPoints = 15;
  let timeConfig;
  
  if (totalPeriods <= 31) {
    // Daily view - show every few days
    const step = Math.max(1, Math.floor(totalPeriods / Math.min(targetGridPoints, totalPeriods)));
    const gridPoints = [];
    
    for (let i = 0; i < totalPeriods; i += step) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      gridPoints.push({
        index: i,
        label: formatDate(currentDate, 'day')
      });
    }
    
    // Always include the last day
    if (gridPoints[gridPoints.length - 1].index !== totalPeriods - 1) {
      const finalDate = new Date(startDate);
      finalDate.setDate(startDate.getDate() + totalPeriods - 1);
      gridPoints.push({
        index: totalPeriods - 1,
        label: formatDate(finalDate, 'day')
      });
    }
    
    timeConfig = {
      totalPeriods,
      periodType: 'days',
      startDate,
      xAxisTitle: 'Date',
      gridPoints
    };
  }
  else if (totalPeriods <= 365) {
    // Weekly/Monthly view - show dates
    const isWeekly = totalPeriods <= 120;
    const step = isWeekly ? 
      Math.max(7, Math.floor(totalPeriods / targetGridPoints)) : 
      Math.max(15, Math.floor(totalPeriods / targetGridPoints));
    
    const gridPoints = [];
    
    for (let i = 0; i < totalPeriods; i += step) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      gridPoints.push({
        index: i,
        label: formatDate(currentDate, isWeekly ? 'day' : 'month')
      });
    }
    
    // Always include the last point
    if (gridPoints[gridPoints.length - 1].index !== totalPeriods - 1) {
      const finalDate = new Date(startDate);
      finalDate.setDate(startDate.getDate() + totalPeriods - 1);
      gridPoints.push({
        index: totalPeriods - 1,
        label: formatDate(finalDate, isWeekly ? 'day' : 'month')
      });
    }
    
    timeConfig = {
      totalPeriods,
      periodType: isWeekly ? 'weeks' : 'months',
      startDate,
      xAxisTitle: 'Date',
      gridPoints
    };
  }
  else if (totalPeriods <= 1095) { // Up to 3 years
    // Monthly view - show "Nov 24, Dec 24, Jan 25" format
    const monthsInData = Math.ceil(totalPeriods / 30.44);
    const step = Math.max(30, Math.floor(totalPeriods / targetGridPoints));
    
    const gridPoints = [];
    
    for (let i = 0; i < totalPeriods; i += step) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      gridPoints.push({
        index: i,
        label: formatDate(currentDate, 'month')
      });
    }
    
    // Always include the last point
    if (gridPoints[gridPoints.length - 1].index !== totalPeriods - 1) {
      const finalDate = new Date(startDate);
      finalDate.setDate(startDate.getDate() + totalPeriods - 1);
      gridPoints.push({
        index: totalPeriods - 1,
        label: formatDate(finalDate, 'month')
      });
    }
    
    timeConfig = {
      totalPeriods,
      periodType: 'months',
      startDate,
      xAxisTitle: 'Date',
      gridPoints
    };
  }
  else if (totalPeriods <= 2555) { // Up to 7 years
    // Quarterly view - show "Q1 24, Q2 24, Q3 24" format
    const step = Math.max(90, Math.floor(totalPeriods / targetGridPoints));
    
    const gridPoints = [];
    
    for (let i = 0; i < totalPeriods; i += step) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      gridPoints.push({
        index: i,
        label: formatDate(currentDate, 'quarter')
      });
    }
    
    // Always include the last point
    if (gridPoints[gridPoints.length - 1].index !== totalPeriods - 1) {
      const finalDate = new Date(startDate);
      finalDate.setDate(startDate.getDate() + totalPeriods - 1);
      gridPoints.push({
        index: totalPeriods - 1,
        label: formatDate(finalDate, 'quarter')
      });
    }
    
    timeConfig = {
      totalPeriods,
      periodType: 'quarters',
      startDate,
      xAxisTitle: 'Date',
      gridPoints
    };
  }
  else {
    // Yearly view - show "2023, 2024, 2025" format
    const step = Math.max(365, Math.floor(totalPeriods / targetGridPoints));
    
    const gridPoints = [];
    
    for (let i = 0; i < totalPeriods; i += step) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      gridPoints.push({
        index: i,
        label: formatDate(currentDate, 'year')
      });
    }
    
    // Always include the last point
    if (gridPoints[gridPoints.length - 1].index !== totalPeriods - 1) {
      const finalDate = new Date(startDate);
      finalDate.setDate(startDate.getDate() + totalPeriods - 1);
      gridPoints.push({
        index: totalPeriods - 1,
        label: formatDate(finalDate, 'year')
      });
    }
    
    timeConfig = {
      totalPeriods,
      periodType: 'years',
      startDate,
      xAxisTitle: 'Date',
      gridPoints
    };
  }
  
  // Debug output to verify intelligent logic
  console.log(`Data points: ${totalPeriods}, Time scale: ${timeConfig.periodType}, Grid points (${timeConfig.gridPoints.length}):`, 
    timeConfig.gridPoints.map(gp => gp.label));
  
  return timeConfig;
};


export function generatePerformanceData() {
  const totalDays = 765; // One year of daily data
  const startValue = 100000; // $100K starting portfolio
  
  // Starting date
  const startDate = new Date('2023-01-01');
  
  // Methodology characteristics (annual expected returns and volatilities)
  const methodologyParams = {
    'Black-Litterman': { 
      annualReturn: 0.148, // 14.8% annual return
      annualVolatility: 0.18, // 18% volatility
      momentum: 0.02, // Slight momentum factor
      meanReversion: 0.05 // Mean reversion strength
    },
    'HRP Optimization': { 
      annualReturn: 0.162, // 16.2% annual return
      annualVolatility: 0.14, // 14% volatility (more stable)
      momentum: 0.01,
      meanReversion: 0.08
    },
    'MPT Optimization': { 
      annualReturn: 0.135, // 13.5% annual return
      annualVolatility: 0.22, // 22% volatility (higher risk)
      momentum: 0.03,
      meanReversion: 0.03
    },
    'Equal Weight': { 
      annualReturn: 0.156, // 15.6% annual return
      annualVolatility: 0.16, // 16% volatility
      momentum: 0.015,
      meanReversion: 0.06
    }
  };
  
  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Market regime simulation (bull/bear/sideways periods)
  const generateMarketRegimes = () => {
    const regimes = [];
    let currentDay = 0;
    
    while (currentDay < totalDays) {
      const regimeType = Math.random();
      let regimeDuration, marketMultiplier;
      
      if (regimeType < 0.6) { // Bull market 60% of time
        regimeDuration = Math.floor(Math.random() * 60) + 20; // 20-80 days
        marketMultiplier = 1 + (Math.random() * 0.3); // 1.0 to 1.3x returns
      } else if (regimeType < 0.85) { // Sideways 25% of time
        regimeDuration = Math.floor(Math.random() * 30) + 10; // 10-40 days
        marketMultiplier = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2x returns
      } else { // Bear market 15% of time
        regimeDuration = Math.floor(Math.random() * 20) + 5; // 5-25 days
        marketMultiplier = -0.5 - (Math.random() * 0.8); // -0.5 to -1.3x returns
      }
      
      const endDay = Math.min(currentDay + regimeDuration, totalDays);
      regimes.push({
        start: currentDay,
        end: endDay,
        multiplier: marketMultiplier
      });
      currentDay = endDay;
    }
    
    return regimes;
  };
  
  const marketRegimes = generateMarketRegimes();
  
  // Helper function to get market multiplier for a given day
  const getMarketMultiplier = (day) => {
    for (const regime of marketRegimes) {
      if (day >= regime.start && day < regime.end) {
        return regime.multiplier;
      }
    }
    return 1; // Default multiplier
  };
  
  // Generate realistic daily returns using geometric Brownian motion with regime changes
  const generateDailyReturns = (params) => {
    const dailyReturns = [];
    const dailyReturn = params.annualReturn / 252; // Convert annual to daily (252 trading days)
    const dailyVolatility = params.annualVolatility / Math.sqrt(252);
    
    let previousReturn = 0;
    let trendComponent = 0;
    
    for (let day = 0; day < totalDays; day++) {
      // Random component (normal distribution approximation)
      const random1 = Math.random();
      const random2 = Math.random();
      const normalRandom = Math.sqrt(-2 * Math.log(random1)) * Math.cos(2 * Math.PI * random2);
      
      // Market regime impact
      const marketMultiplier = getMarketMultiplier(day);
      
      // Momentum component
      const momentumComponent = params.momentum * previousReturn;
      
      // Mean reversion component
      trendComponent = trendComponent * (1 - params.meanReversion) + dailyReturn * params.meanReversion;
      
      // Add some autocorrelation and market events
      const autocorrelation = 0.05 * previousReturn;
      
      // Random market events (earnings, news, etc.)
      const eventProbability = 0.02; // 2% chance of significant event per day
      const eventImpact = Math.random() < eventProbability ? 
        (Math.random() - 0.5) * 0.08 : 0; // ±4% event impact
      
      // Combine all components
      let dailyReturn_final = trendComponent + 
        dailyVolatility * normalRandom * marketMultiplier +
        momentumComponent +
        autocorrelation +
        eventImpact;
      
      // Add realistic constraints (daily return limits)
      dailyReturn_final = Math.max(-0.12, Math.min(0.12, dailyReturn_final)); // ±12% daily limit
      
      dailyReturns.push(dailyReturn_final);
      previousReturn = dailyReturn_final;
    }
    
    return dailyReturns;
  };
  
  // Generate performance data for each methodology
  const performanceData = {};
  
  Object.entries(methodologyParams).forEach(([methodology, params]) => {
    const dailyReturns = generateDailyReturns(params);
    const data = [];
    
    let cumulativeReturn = 0;
    let portfolioValue = startValue;
    
    // Add initial point
    data.push({ 
      day: formatDate(startDate), 
      returns: 0, 
      portfolioValue: startValue 
    });
    
    dailyReturns.forEach((dailyReturn, index) => {
      // Compound returns
      portfolioValue = portfolioValue * (1 + dailyReturn);
      cumulativeReturn = ((portfolioValue - startValue) / startValue) * 100;
      
      // Calculate the date for this day
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + index + 1);
      
      data.push({
        day: formatDate(currentDate),
        returns: cumulativeReturn,
        portfolioValue: portfolioValue
      });
    });
    
    performanceData[methodology] = data;
  });
  
  return performanceData;
};