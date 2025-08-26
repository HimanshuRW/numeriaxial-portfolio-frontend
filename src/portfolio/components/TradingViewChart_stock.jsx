import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, MousePointer2, ZoomIn, ZoomOut, RotateCcw, Move, Eye, EyeOff, BarChart2 } from 'lucide-react';

const TradingViewChart = ({ 
  data, 
  secondaryData = null,
  primaryLabel = "Primary",
  secondaryLabel = "SPY",
  colors = null,
  showVolume = true,
  showComparison = true,
  className = "h-full"
}) => {
  // Dynamic theme-based colors (assuming dark theme for demo)
  const isDark = true;
  const themeColors = useMemo(() => colors || {
    primary: {
      bullish: isDark ? "#00D4AA" : "#00C896",
      bearish: isDark ? "#FF7B7B" : "#FF6B6B", 
      line: isDark ? "#3B82F6" : "#2563EB",
      volume: isDark ? "#64748B" : "#94A3B8"
    },
    secondary: {
      line: isDark ? "#FBBF24" : "#F59E0B",
      area: isDark ? "#FEF3C7" : "#FEF3C7"
    },
    grid: isDark ? "#374151" : "#f1f5f9",
    text: isDark ? "#D1D5DB" : "#64748B",
    background: isDark ? "#1F2937" : "#FFFFFF",
    surface: isDark ? "#111827" : "#F8FAFC"
  }, [isDark, colors]);

  // State management
  const [chartType, setChartType] = useState('candlestick');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [crosshair, setCrosshair] = useState({ x: 0, y: 0, visible: false });
  const [showVolumeToggle, setShowVolumeToggle] = useState(showVolume);
  const [showComparisonToggle, setShowComparisonToggle] = useState(showComparison && !!secondaryData);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('YTD');
  
  // Zoom and Pan State
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, panOffset: 0 });
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  
  // Refs
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Constants
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 10;
  const MAX_CANDLES = 200;
  
  // Timeframe definitions
  const timeframes = [
    { label: '1 Mo', value: '1M', days: 30 },
    { label: '3 Mo', value: '3M', days: 90 },
    { label: '6 Mo', value: '6M', days: 180 },
    { label: 'YTD', value: 'YTD', days: null },
    { label: '2 Yr', value: '2Y', days: 730 },
    { label: 'All', value: 'ALL', days: null }
  ];

  // fonts
  const Y_AXIS_FONT = 14;
  const X_AXIS_FONT = 14;

  // Add this useEffect after your other useEffect hooks
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 2500); // 2.5 seconds
  
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on mount

  // Resampling functions (moved here before processedData)
  const resampleToWeekly = (dataArray, isSecondary = false) => {
    const weekly = [];
    const weeks = {};

    dataArray.forEach(item => {
      const date = new Date(item.date);
      const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          date: weekKey,
          items: [],
          open: isSecondary ? (item.value || item.close) : item.open,
          high: isSecondary ? (item.value || item.close) : item.high,
          low: isSecondary ? (item.value || item.close) : item.low,
          close: isSecondary ? (item.value || item.close) : item.close,
          volume: item.volume || 0
        };
      }

      weeks[weekKey].items.push(item);
      if (isSecondary) {
        weeks[weekKey].value = item.value || item.close;
        weeks[weekKey].close = item.value || item.close;
        weeks[weekKey].high = Math.max(weeks[weekKey].high, item.value || item.close);
        weeks[weekKey].low = Math.min(weeks[weekKey].low, item.value || item.close);
      } else {
        weeks[weekKey].high = Math.max(weeks[weekKey].high, item.high);
        weeks[weekKey].low = Math.min(weeks[weekKey].low, item.low);
        weeks[weekKey].close = item.close;
        weeks[weekKey].volume += (item.volume || 0);
      }
    });

    return Object.values(weeks).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const resampleToMonthly = (dataArray, isSecondary = false) => {
    const monthly = [];
    const months = {};

    dataArray.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!months[monthKey]) {
        months[monthKey] = {
          date: `${monthKey}-01`,
          items: [],
          open: isSecondary ? (item.value || item.close) : item.open,
          high: isSecondary ? (item.value || item.close) : item.high,
          low: isSecondary ? (item.value || item.close) : item.low,
          close: isSecondary ? (item.value || item.close) : item.close,
          volume: item.volume || 0
        };
      }

      months[monthKey].items.push(item);
      if (isSecondary) {
        months[monthKey].value = item.value || item.close;
        months[monthKey].close = item.value || item.close;
        months[monthKey].high = Math.max(months[monthKey].high, item.value || item.close);
        months[monthKey].low = Math.min(months[monthKey].low, item.value || item.close);
      } else {
        months[monthKey].high = Math.max(months[monthKey].high, item.high);
        months[monthKey].low = Math.min(months[monthKey].low, item.low);
        months[monthKey].close = item.close;
        months[monthKey].volume += (item.volume || 0);
      }
    });

    return Object.values(months).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Intelligent data resampling and filtering
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return { data: [], secondaryData: [], timeframeData: [] };

    let filteredData = [...data];
    let filteredSecondaryData = secondaryData ? [...secondaryData] : null;

    // Apply timeframe filter
    const now = new Date();
    const selectedTF = timeframes.find(tf => tf.value === selectedTimeframe);
    
    if (selectedTF && selectedTF.days) {
      const cutoffDate = new Date(now.getTime() - (selectedTF.days * 24 * 60 * 60 * 1000));
      filteredData = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= cutoffDate;
      });
      
      if (secondaryData) {
        filteredSecondaryData = secondaryData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= cutoffDate;
        });
      }
    } else if (selectedTimeframe === 'YTD') {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      filteredData = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= yearStart;
      });
      
      if (secondaryData) {
        filteredSecondaryData = secondaryData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= yearStart;
        });
      }
    }

    // Determine resampling strategy based on data length and timeframe
    let resampledData = filteredData;
    let resampledSecondaryData = filteredSecondaryData;
    let resampleType = 'daily';

    if (filteredData.length > MAX_CANDLES) {
      if (['2Y', 'ALL'].includes(selectedTimeframe)) {1
        if (filteredData.length > MAX_CANDLES * 4) {
          // Monthly resampling
          resampledData = resampleToMonthly(filteredData);
          resampledSecondaryData = filteredSecondaryData ? resampleToMonthly(filteredSecondaryData, true) : null;
          resampleType = 'monthly';
        } else {
          // Weekly resampling
          resampledData = resampleToWeekly(filteredData);
          resampledSecondaryData = filteredSecondaryData ? resampleToWeekly(filteredSecondaryData, true) : null;
          resampleType = 'weekly';
        }
      } else {
        // For shorter timeframes, just take every nth item to stay under MAX_CANDLES
        const step = Math.ceil(filteredData.length / MAX_CANDLES);
        resampledData = filteredData.filter((_, index) => index % step === 0);
        resampledSecondaryData = filteredSecondaryData ? 
          filteredSecondaryData.filter((_, index) => index % step === 0) : null;
      }
    }

    return {
      data: resampledData,
      secondaryData: resampledSecondaryData,
      timeframeData: filteredData,
      resampleType
    };
  }, [data, secondaryData, selectedTimeframe, resampleToWeekly, resampleToMonthly]);

  // Calculate returns for selected timeframe
  const returns = useMemo(() => {
    const { timeframeData } = processedData;
    if (!timeframeData || timeframeData.length < 2) return { value: 0, percentage: 0, dollarChange: 0 };

    const startPrice = timeframeData[0].close;
    const endPrice = timeframeData[timeframeData.length - 1].close;
    const change = endPrice - startPrice;
    const percentage = (change / startPrice) * 100;

    return {
      value: change,
      percentage,
      dollarChange: change, // This is the dollar profit/loss
      isPositive: change >= 0
    };
  }, [processedData]);

  // Chart container dimensions (you can control these!)
  const chartContainerHeight = 350; // Adjust this to control chart height!
  const chartContainerWidth = dimensions.width; // Uses full width
  
  const volumeHeight = showVolumeToggle ? chartContainerHeight * 0.15 : 0; // 15% of chart container
  const padding = { 
    left: showComparisonToggle && secondaryData ? 50 : 40,
    right: showComparisonToggle && secondaryData ? 50 : 20,
    top: 20, // Relative to chart container
    bottom: 35 // Relative to chart container
  };

  // Resize observer
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ 
          width: Math.max(600, width), 
          height: Math.max(400, height) 
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  // Calculate visible data range based on zoom and pan
  const visibleData = useMemo(() => {
    const { data: resampledData, secondaryData: resampledSecondaryData } = processedData;
    if (!resampledData || resampledData.length === 0) return { data: [], secondaryData: [], startIndex: 0, endIndex: 0 };
    
    const totalPoints = resampledData.length;
    const visiblePointsCount = Math.max(Math.floor(totalPoints / zoom), 10);
    
    const maxPanOffset = Math.max(0, totalPoints - visiblePointsCount);
    const clampedPanOffset = Math.max(0, Math.min(panOffset, maxPanOffset));
    
    const startIndex = Math.floor(clampedPanOffset);
    const endIndex = Math.min(startIndex + visiblePointsCount, totalPoints);
    
    const visibleMainData = resampledData.slice(startIndex, endIndex);
    const visibleSecondaryData = (resampledSecondaryData && showComparisonToggle) ? 
      resampledSecondaryData.slice(startIndex, endIndex) : null;
    
    return {
      data: visibleMainData,
      secondaryData: visibleSecondaryData,
      startIndex,
      endIndex,
      totalPoints
    };
  }, [processedData, zoom, panOffset, showComparisonToggle]);

  // Calculate price and volume scales for visible data
  const priceData = useMemo(() => {
    const { data: visibleMainData } = visibleData;
    
    if (!visibleMainData || visibleMainData.length === 0) return { min: 0, max: 100, range: 100 };
    
    let allPrices = [];
    visibleMainData.forEach(d => {
      if (chartType === 'candlestick') {
        allPrices.push(d.high, d.low);
      } else {
        allPrices.push(d.close);
      }
    });
    
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const range = max - min;
    const paddingAmount = range * 0.1;
    
    return {
      min: min - paddingAmount,
      max: max + paddingAmount,
      range: range + (paddingAmount * 2)
    };
  }, [visibleData, chartType]);

  // Separate scale for secondary data
  const secondaryPriceData = useMemo(() => {
    const { secondaryData: visibleSecondaryData } = visibleData;
    
    if (!visibleSecondaryData || !showComparisonToggle) return null;
    
    const secondaryPrices = visibleSecondaryData.map(d => d.value || d.close);
    const min = Math.min(...secondaryPrices);
    const max = Math.max(...secondaryPrices);
    const range = max - min;
    const paddingAmount = range * 0.1;
    
    return {
      min: min - paddingAmount,
      max: max + paddingAmount,
      range: range + (paddingAmount * 2)
    };
  }, [visibleData, showComparisonToggle]);

  const volumeData = useMemo(() => {
    const { data: visibleMainData } = visibleData;
    
    if (!visibleMainData || !showVolumeToggle) return { min: 0, max: 100, range: 100 };
    
    const volumes = visibleMainData.map(d => d.volume || 0);
    const max = Math.max(...volumes);
    
    return {
      min: 0,
      max: max,
      range: max
    };
  }, [visibleData, showVolumeToggle]);

  // Helper functions - now based on chart container dimensions
  const chartWidth = chartContainerWidth;
  const chartHeight = chartContainerHeight - volumeHeight;
  
  const getX = (index) => padding.left + (index / (visibleData.data.length - 1)) * (chartWidth - padding.left - padding.right);
  const getY = (value) => padding.top + ((priceData.max - value) / priceData.range) * (chartHeight - padding.top - padding.bottom);
  const getSecondaryY = (value) => {
    if (!secondaryPriceData) return getY(value);
    return padding.top + ((secondaryPriceData.max - value) / secondaryPriceData.range) * (chartHeight - padding.top - padding.bottom);
  };
  const getVolumeY = (volume) => {
    const volumeAreaTop = chartHeight + 10;
    const volumeAreaHeight = volumeHeight - 20;
    return volumeAreaTop + volumeAreaHeight - ((volume / volumeData.max) * volumeAreaHeight);
  };

  // Format date labels based on resampling type
  const formatDateLabel = (dateStr, resampleType) => {
    const date = new Date(dateStr);
    if (resampleType === 'monthly') {
      // For monthly, show full month name and year for clarity
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); // "Jan 2024"
    } else if (resampleType === 'weekly') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }); // "Jan 15 '24"
    } else {
      // Daily - show month and day, add year if spanning multiple years
      const currentYear = new Date().getFullYear();
      const dataYear = date.getFullYear();
      if (dataYear !== currentYear) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }); // "Jan 15 '23"
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // "Jan 15"
      }
    }
  };

  // Generate grid lines for visible data
  const gridLines = useMemo(() => {
    const { data: visibleMainData } = visibleData;
    const lines = [];
    const priceStep = priceData.range / 6;
    const timeStep = Math.max(1, Math.floor(visibleMainData.length / 8));
    
    // Horizontal price lines for primary axis
    for (let i = 0; i <= 6; i++) {
      const price = priceData.min + (priceStep * i);
      const y = getY(price);
      lines.push({
        type: 'horizontal',
        y,
        price: price.toFixed(2),
        key: `h-${i}`,
        axis: 'primary'
      });
    }
    
    // Horizontal price lines for secondary axis (if secondary data exists)
    if (secondaryPriceData && showComparisonToggle) {
      const secondaryPriceStep = secondaryPriceData.range / 6;
      for (let i = 0; i <= 6; i++) {
        const price = secondaryPriceData.min + (secondaryPriceStep * i);
        const y = getSecondaryY(price);
        lines.push({
          type: 'horizontal-secondary',
          y,
          price: price.toFixed(2),
          key: `hs-${i}`,
          axis: 'secondary'
        });
      }
    }
    
    // Vertical time lines
    for (let i = 0; i < visibleMainData.length; i += timeStep) {
      const x = getX(i);
      lines.push({
        type: 'vertical',
        x,
        label: formatDateLabel(visibleMainData[i]?.date || '', processedData.resampleType),
        key: `v-${i}`
      });
    }
    
    return lines;
  }, [visibleData, priceData, secondaryPriceData, showComparisonToggle, processedData.resampleType]);

  // Event handlers (keeping existing zoom and pan logic)
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.5, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.5, MIN_ZOOM));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPanOffset(0);
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.button === 0) {
      setIsDragging(true);
      isDraggingRef.current = true;
      setDragStart({
        x: e.clientX,
        panOffset: panOffset
      });
    }
  }, [panOffset]);

  const handleMouseMove = useCallback((e) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;

    if (isDraggingRef.current) {
        const deltaX = e.clientX - dragStart.x;
        const sensitivity = visibleData.totalPoints / chartWidth;
        const newPanOffset = dragStart.panOffset - (deltaX * sensitivity);
        
        const maxPanOffset = Math.max(0, processedData.data.length - Math.floor(processedData.data.length / zoom));
        const clampedOffset = Math.max(0, Math.min(newPanOffset, maxPanOffset));
        
        setPanOffset(clampedOffset);
    } else {
        const isInChartArea = x >= padding.left && 
                              x <= (chartWidth - padding.right) && 
                              y >= padding.top && 
                              y <= chartHeight;

        if (isInChartArea) {
            setCrosshair({ 
                x: Math.max(padding.left, Math.min(x, chartWidth - padding.right)), 
                y: Math.max(padding.top, Math.min(y, chartHeight)), 
                visible: true 
            });
        } else {
            setCrosshair({ x: 0, y: 0, visible: false });
        }
    }
  }, [isDraggingRef, dragStart, visibleData.totalPoints, chartWidth, processedData.data, zoom, padding, chartHeight]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    isDraggingRef.current = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCrosshair({ x: 0, y: 0, visible: false });
    setHoveredPoint(null);
    setIsDragging(false);
    isDraggingRef.current = false;
  }, []);

  // Mouse wheel zoom
  useEffect(() => {
    const chartElement = chartRef.current;
    if (!chartElement) return;

    const handleWheelEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY;
      const zoomFactor = 1.1;
      
      if (delta < 0) {
        setZoom(prev => Math.min(prev * zoomFactor, MAX_ZOOM));
      } else {
        setZoom(prev => Math.max(prev / zoomFactor, MIN_ZOOM));
      }
    };

    chartElement.addEventListener('wheel', handleWheelEvent, { passive: false });

    return () => {
      chartElement.removeEventListener('wheel', handleWheelEvent);
    };
  }, [MAX_ZOOM, MIN_ZOOM]);

  // Global mouse events for dragging
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
    };

    const handleGlobalMouseMove = (e) => {
      if (isDraggingRef.current && chartRef.current) {
        const deltaX = e.clientX - dragStart.x;
        const sensitivity = visibleData.totalPoints / chartWidth;
        const newPanOffset = dragStart.panOffset - (deltaX * sensitivity);
        
        const maxPanOffset = Math.max(0, processedData.data.length - Math.floor(processedData.data.length / zoom));
        const clampedOffset = Math.max(0, Math.min(newPanOffset, maxPanOffset));
        
        setPanOffset(clampedOffset);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, visibleData.totalPoints, chartWidth, processedData.data, zoom]);

  // Rendering functions (keeping existing logic)
  const renderCandlestick = (item, index) => {
    const x = getX(index);
    const openY = getY(item.open);
    const closeY = getY(item.close);
    const highY = getY(item.high);
    const lowY = getY(item.low);
    
    const isBullish = item.close >= item.open;
    const color = isBullish ? themeColors.primary.bullish : themeColors.primary.bearish;
    const candleWidth = Math.max(1, (chartWidth - padding.left - padding.right) / visibleData.data.length * 0.7);
    
    return (
      <g key={`candle-${index}`} className="cursor-crosshair">
        <line
          x1={x}
          y1={highY}
          x2={x}
          y2={lowY}
          stroke={color}
          strokeWidth="1"
        />
        <rect
          x={x - candleWidth / 2}
          y={Math.min(openY, closeY)}
          width={candleWidth}
          height={Math.abs(closeY - openY) || 1}
          fill={isBullish ? color : color}
          stroke={color}
          strokeWidth="1"
          opacity={isBullish ? 0.8 : 1}
          onMouseEnter={() => !isDragging && setHoveredPoint({ ...item, index, x, y: closeY })}
          onMouseLeave={() => setHoveredPoint(null)}
        />
      </g>
    );
  };

  const renderLineChart = () => {
    const linePoints = visibleData.data.map((item, index) => {
      const x = getX(index);
      const y = getY(item.close);
      return `${x},${y}`;
    }).join(' ');

    return (
      <g>
        <path
          d={`M${padding.left},${getY(priceData.min)} L${linePoints} L${getX(visibleData.data.length - 1)},${getY(priceData.min)} Z`}
          fill={themeColors.primary.line}
          opacity="0.1"
        />
        <polyline
          points={linePoints}
          fill="none"
          stroke={themeColors.primary.line}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {visibleData.data.map((item, index) => {
          const x = getX(index);
          const y = getY(item.close);
          return (
            <circle
              key={`point-${index}`}
              cx={x}
              cy={y}
              r="3"
              fill={themeColors.primary.line}
              className="cursor-crosshair hover:r-4 transition-all"
              onMouseEnter={() => !isDragging && setHoveredPoint({ ...item, index, x, y })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          );
        })}
      </g>
    );
  };

  const renderSecondaryLine = () => {
    if (!visibleData.secondaryData || !showComparisonToggle) return null;

    const linePoints = visibleData.secondaryData.map((item, index) => {
      const x = getX(index);
      const y = getSecondaryY(item.value || item.close);
      return `${x},${y}`;
    }).join(' ');

    return (
      <g>
        <polyline
          points={linePoints}
          fill="none"
          stroke={themeColors.secondary.line}
          strokeWidth="2"
          strokeDasharray="8,4"
          strokeLinecap="round"
        />
        {visibleData.secondaryData.map((item, index) => {
          const x = getX(index);
          const y = getSecondaryY(item.value || item.close);
          return (
            <circle
              key={`secondary-${index}`}
              cx={x}
              cy={y}
              r="2"
              fill={themeColors.secondary.line}
              className="cursor-crosshair"
              onMouseEnter={() => !isDragging && setHoveredPoint({ 
                ...item, 
                index, 
                x, 
                y, 
                isSecondary: true,
                date: visibleData.data[index]?.date 
              })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          );
        })}
      </g>
    );
  };

  const renderVolume = () => {
    if (!showVolumeToggle) return null;

    return (
      <g style={{ transform : `translateY(-${chartHeight/7}px)` }}
      >
        {visibleData.data.map((item, index) => {
          const x = getX(index);
          const volumeY = getVolumeY(item.volume || 0);
          const volumeHeight = (dimensions.height - 140) - volumeY;
          const barWidth = Math.max(1, (chartWidth - padding.left - padding.right) / visibleData.data.length * 0.8);
          const isBullish = item.close >= item.open;
          
          return (
            <rect
              key={`volume-${index}`}
              x={x - barWidth / 2}
              y={volumeY}
              width={barWidth}
              height={volumeHeight}
              fill={isBullish ? themeColors.primary.bullish : themeColors.primary.bearish}
              opacity="0.45"
            />
          );
        })}
      </g>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div 
        ref={containerRef}
        className={`flex items-center justify-center h-full min-h-[400px] rounded-lg ${className}`}
        style={{ backgroundColor: themeColors.surface }}
      >
        <p style={{ color: themeColors.text }}>No data available</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative h-full w-full rounded-xl shadow-lg ${className}`}
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Top Header - Clean Left/Right Layout */}
      <div
        className="flex justify-between items-center p-4 border-b"
        style={{ borderColor: themeColors.grid }}
      >
        {/* Left side: Primary Label + Returns + Chart Type */}
        <div className="flex items-center space-x-4">
          {/* Primary Label and Returns */}
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold" style={{ color: themeColors.text }}>
              {primaryLabel}
            </span>
            <span 
              className="text-lg font-bold"
              style={{ color: returns.isPositive ? '#10B981' : '#EF4444' }}
            >
              {returns.isPositive ? '+' : ''}${returns.dollarChange.toFixed(2)} ({returns.isPositive ? '+' : ''}{returns.percentage.toFixed(2)}%)
            </span>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex rounded-lg p-1" style={{ backgroundColor: themeColors.surface }}>
            <button
              onClick={() => setChartType('candlestick')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'candlestick'
                  ? 'shadow-sm'
                  : 'hover:opacity-80'
              }`}
              style={{ 
                backgroundColor: chartType === 'candlestick' ? themeColors.background : 'transparent',
                color: chartType === 'candlestick' ? themeColors.primary.line : themeColors.text
              }}
              title="Candlestick Chart"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'line'
                  ? 'shadow-sm'
                  : 'hover:opacity-80'
              }`}
              style={{ 
                backgroundColor: chartType === 'line' ? themeColors.background : 'transparent',
                color: chartType === 'line' ? themeColors.primary.line : themeColors.text
              }}
              title="Line Chart"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right side: Timeframe Buttons + Reset */}
        <div className="flex items-center space-x-3">
          {/* Timeframe Buttons */}
          <div className="flex rounded-lg p-1" style={{ backgroundColor: themeColors.surface }}>
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setSelectedTimeframe(tf.value)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedTimeframe === tf.value
                    ? 'shadow-sm font-medium'
                    : 'hover:opacity-80'
                }`}
                style={{ 
                  backgroundColor: selectedTimeframe === tf.value ? themeColors.background : 'transparent',
                  color: selectedTimeframe === tf.value ? themeColors.primary.line : themeColors.text
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Reset View Button */}
          <button
            onClick={handleResetView}
            className="p-2 rounded-md transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: themeColors.surface,
              color: themeColors.text
            }}
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Container - CONTROLLABLE HEIGHT/WIDTH */}
      <div 
        className="relative border-t border-b" 
        style={{ 
          height: `${chartContainerHeight}px`, // You control this!
          width: '100%',
          borderColor: themeColors.grid,
          padding : "10px 5px"
        }}
      >
        <svg
          ref={chartRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartContainerWidth} ${chartContainerHeight}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={isDragging ? "cursor-grabbing" : "cursor-crosshair"}
          style={{ userSelect: 'none' }}
        >
          {/* Background */}
          <rect width="100%" height="100%" fill={themeColors.background} />

          {/* Grid */}
          <g className="grid">
            {gridLines.map(line => {
              if (line.type === 'horizontal') {
                return (
                  <g key={line.key}>
                    <line
                      x1={padding.left}
                      y1={line.y}
                      x2={chartWidth - padding.right}
                      y2={line.y}
                      stroke={themeColors.grid}
                      strokeWidth="1"
                      strokeDasharray="2,2"
                      opacity="0.3"
                    />
                    <text
                      x={padding.left - 10}
                      y={line.y + 4}
                      textAnchor="end"
                      fontSize={Y_AXIS_FONT}
                      fill={themeColors.text}
                      fontWeight="500"
                    >
                      ${line.price}
                    </text>
                  </g>
                );
              } else if (line.type === 'horizontal-secondary') {
                return (
                  <g key={line.key}>
                    <line
                      x1={padding.left}
                      y1={line.y}
                      x2={chartWidth - padding.right}
                      y2={line.y}
                      stroke={themeColors.grid}
                      strokeWidth="1"
                      strokeDasharray="4,4"
                      opacity="0.2"
                    />
                    <text
                      x={chartWidth - padding.right + 10}
                      y={line.y + 4}
                      textAnchor="start"
                      fontSize={Y_AXIS_FONT}
                      fill={themeColors.secondary.line}
                      fontWeight="500"
                    >
                      ${line.price}
                    </text>
                  </g>
                );
              } else {
                return (
                  <g key={line.key}>
                    <line
                      x1={line.x}
                      y1={padding.top}
                      x2={line.x}
                      y2={chartHeight}
                      stroke={themeColors.grid}
                      strokeWidth="1"
                      strokeDasharray="2,2"
                      opacity="0.3"
                    />
                    <text
                      x={line.x}
                      y={chartContainerHeight - 10}
                      textAnchor="middle"
                      fontSize={X_AXIS_FONT}
                      fill={themeColors.text}
                    >
                      {line.label}
                    </text>
                  </g>
                );
              }
            })}
          </g>

          {/* Volume */}
          {renderVolume()}

          {/* Secondary line (render first so it appears behind) */}
          {renderSecondaryLine()}

          {/* Main chart */}
          {chartType === 'candlestick' 
            ? visibleData.data.map((item, index) => renderCandlestick(item, index))
            : renderLineChart()
          }

          {/* Crosshair (only show when not dragging) */}
          {crosshair.visible && !isDragging && (
            <g className="crosshair" pointerEvents="none">
              {/* Vertical line - constrain to chart area */}
              <line
                  x1={Math.max(padding.left, Math.min(crosshair.x, chartWidth - padding.right))}
                  y1={padding.top}
                  x2={Math.max(padding.left, Math.min(crosshair.x, chartWidth - padding.right))}
                  y2={chartHeight}
                  stroke={themeColors.text}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.4"
              />
              {/* Horizontal line - constrain to chart area */}
              <line
                  x1={padding.left}
                  y1={Math.max(padding.top, Math.min(crosshair.y, chartHeight))}
                  x2={chartWidth - padding.right}
                  y2={Math.max(padding.top, Math.min(crosshair.y, chartHeight))}
                  stroke={themeColors.text}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.4"
              />
            </g>
          )}

          {/* Hover Tooltip */}
          {hoveredPoint && !isDragging && (
            <g className="tooltip" pointerEvents="none">
              <rect
                x={hoveredPoint.x - 80}
                y={hoveredPoint.y - 120}
                width="160"
                height={hoveredPoint.isSecondary ? "70" : (chartType === 'candlestick' ? "100" : "70")}
                rx="8"
                fill="rgba(0,0,0,0.9)"
                stroke={themeColors.grid}
              />
              <text x={hoveredPoint.x} y={hoveredPoint.y - 95} textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
                {formatDateLabel(hoveredPoint.date || hoveredPoint.label, processedData.resampleType)}
              </text>
              
              {hoveredPoint.isSecondary ? (
                <g>
                  <text x={hoveredPoint.x} y={hoveredPoint.y - 75} textAnchor="middle" fontSize="11" fill={themeColors.secondary.line}>
                    {secondaryLabel}: ${(hoveredPoint.value || hoveredPoint.close)?.toFixed(2)}
                  </text>
                </g>
              ) : chartType === 'candlestick' ? (
                <g>
                  <text x={hoveredPoint.x} y={hoveredPoint.y - 80} textAnchor="middle" fontSize="11" fill="#10B981">
                    O: ${hoveredPoint.open?.toFixed(2)}
                  </text>
                  <text x={hoveredPoint.x} y={hoveredPoint.y - 68} textAnchor="middle" fontSize="11" fill="#EF4444">
                    H: ${hoveredPoint.high?.toFixed(2)}
                  </text>
                  <text x={hoveredPoint.x} y={hoveredPoint.y - 56} textAnchor="middle" fontSize="11" fill="#F59E0B">
                    L: ${hoveredPoint.low?.toFixed(2)}
                  </text>
                  <text x={hoveredPoint.x} y={hoveredPoint.y - 44} textAnchor="middle" fontSize="11" fill="white">
                    C: ${hoveredPoint.close?.toFixed(2)}
                  </text>
                  {hoveredPoint.volume && showVolumeToggle && (
                    <text x={hoveredPoint.x} y={hoveredPoint.y - 32} textAnchor="middle" fontSize="10" fill="#94A3B8">
                      Vol: {(hoveredPoint.volume / 1000000).toFixed(1)}M
                    </text>
                  )}
                </g>
              ) : (
                <g>
                  <text x={hoveredPoint.x} y={hoveredPoint.y - 75} textAnchor="middle" fontSize="11" fill={themeColors.primary.line}>
                    {primaryLabel}: ${hoveredPoint.close?.toFixed(2)}
                  </text>
                  {hoveredPoint.volume && showVolumeToggle && (
                    <text x={hoveredPoint.x} y={hoveredPoint.y - 57} textAnchor="middle" fontSize="10" fill="#94A3B8">
                      Vol: {(hoveredPoint.volume / 1000000).toFixed(1)}M
                    </text>
                  )}
                </g>
              )}
            </g>
          )}

          {/* Zoom indicator overlay */}
          {zoom > 1 && (
            <g className="zoom-indicator" pointerEvents="none">
              <rect
                x={padding.left}
                y={chartHeight + 5}
                width={(chartWidth - padding.left - padding.right) / zoom}
                height="3"
                fill={themeColors.primary.line}
                opacity="0.6"
                rx="1"
              />
              <rect
                x={padding.left + (panOffset / processedData.data.length) * (chartWidth - padding.left - padding.right)}
                y={chartHeight + 3}
                width={Math.max(5, (chartWidth - padding.left - padding.right) / zoom)}
                height="7"
                fill={themeColors.primary.line}
                opacity="0.8"
                rx="2"
              />
            </g>
          )}
        </svg>

        {/* Data info overlay */}
        {processedData.resampleType !== 'daily' && (
          <div 
            className="absolute top-4 right-4 px-3 py-1 rounded-full pointer-events-none text-xs"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.75)', 
              color: 'white' 
            }}
          >
            {processedData.resampleType === 'weekly' ? 'Weekly Data' : 'Monthly Data'} • {processedData.data.length} candles
          </div>
        )}

        {/* Scroll hint overlay */}
        {zoom === 1 && showScrollHint && (
          <div 
            className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full pointer-events-none text-xs transition-opacity duration-500 ${
              showScrollHint ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.75)', 
              color: 'white' 
            }}
          >
            Use mouse wheel to zoom • Drag to pan when zoomed
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div 
        className="flex justify-between items-center p-4 border-t"
        style={{ borderColor: themeColors.grid }}
      >
        {/* Left side: Toggle Controls */}
        <div className="flex items-center space-x-2">
          {/* Volume Toggle */}
          <button
            onClick={() => setShowVolumeToggle(!showVolumeToggle)}
            className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: showVolumeToggle ? themeColors.primary.line : themeColors.surface,
              color: showVolumeToggle ? themeColors.background : themeColors.text
            }}
            title="Toggle Volume"
          >
            <BarChart2 className="w-4 h-4" />
            <span className="text-sm">Volume</span>
          </button>

          {/* Comparison Toggle */}
          {secondaryData && (
            <button
              onClick={() => setShowComparisonToggle(!showComparisonToggle)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors hover:opacity-80"
              style={{ 
                backgroundColor: showComparisonToggle ? themeColors.secondary.line : themeColors.surface,
                color: showComparisonToggle ? themeColors.background : themeColors.text
              }}
              title="Toggle Comparison"
            >
              {showComparisonToggle ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="text-sm">Compare</span>
            </button>
          )}
        </div>

        {/* Right side: Legend and Zoom info */}
        <div className="flex items-center space-x-6">
          {/* Legend */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-3 rounded"
                style={{ backgroundColor: chartType === 'candlestick' ? themeColors.primary.bullish : themeColors.primary.line }}
              ></div>
              <span className="text-sm font-medium" style={{ color: themeColors.text }}>{primaryLabel}</span>
              <span className="text-xs opacity-70" style={{ color: themeColors.text }}>(Left)</span>
            </div>
            {secondaryData && showComparisonToggle && (
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-3 rounded border-2 border-dashed"
                  style={{ borderColor: themeColors.secondary.line }}
                ></div>
                <span className="text-sm font-medium" style={{ color: themeColors.text }}>{secondaryLabel}</span>
                <span className="text-xs opacity-70" style={{ color: themeColors.text }}>(Right)</span>
              </div>
            )}
            {showVolumeToggle && (
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-3 rounded opacity-60"
                  style={{ backgroundColor: themeColors.primary.volume }}
                ></div>
                <span className="text-sm font-medium" style={{ color: themeColors.text }}>Volume</span>
              </div>
            )}
          </div>
          
          {/* Zoom info */}
          {zoom > 1 && (
            <div className="text-xs opacity-70" style={{ color: themeColors.text }}>
              Zoom: {zoom.toFixed(1)}x
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingViewChart