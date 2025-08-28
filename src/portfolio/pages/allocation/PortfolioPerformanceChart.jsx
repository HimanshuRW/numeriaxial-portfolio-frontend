import React, { useState, useEffect, useRef } from 'react';

const PortfolioPerformanceChart = ({ performanceData, timeConfig, isDark }) => {
  const [activeMetrics, setActiveMetrics] = useState(['Black-Litterman', 'HRP Optimization', 'MPT Optimization', 'Equal Weight']);
  const [viewMode, setViewMode] = useState('returns'); // 'returns' or 'value'
  const [animationProgress, setAnimationProgress] = useState(0);
  const [crosshair, setCrosshair] = useState({ x: null, y: null, visible: false, dataIndex: null });
  const svgRef = useRef(null);
  
  // Animation configuration
  const ANIMATION_DURATION = 1600; // milliseconds - you can change this!

  // Animation effect for line drawing
  useEffect(() => {
    if (!performanceData || !timeConfig) return;
    
    setAnimationProgress(0);
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      
      // Smooth easing function for more natural animation
      const easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      setAnimationProgress(easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [performanceData, timeConfig, viewMode]);

  // Use the time configuration from props with fallback defaults
  const { 
    totalPeriods = 365, 
    periodType = 'days', 
    startDate = new Date(), 
    xAxisLabels = [], 
    xAxisTitle = 'Time',
    gridPoints = []
  } = timeConfig || {};

  // If no timeConfig provided, return loading or error state
  if (!timeConfig || !performanceData) {
    return (
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className={`text-center py-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Loading chart data...
        </div>
      </div>
    );
  }

  const methodologyColors = {
    'Black-Litterman': '#4A7BFF',
    'HRP Optimization': '#52D974',
    'MPT Optimization': '#FF5D9E',
    'Equal Weight': '#FF9B44'
  };

  const toggleMetric = (metric) => {
    if (activeMetrics.includes(metric)) {
      // Don't allow removing the last active metric
      if (activeMetrics.length > 1) {
        setActiveMetrics(activeMetrics.filter(m => m !== metric));
      }
    } else {
      setActiveMetrics([...activeMetrics, metric]);
    }
  };

  // Chart dimensions - now responsive with fixed right space for labels
  const rightLabelSpace = 90; // Fixed space for value labels
  const chartHeight = 400;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  
  // Get data for active metrics only
  const activeData = activeMetrics.map(metric => ({
    name: metric,
    data: performanceData[metric],
    color: methodologyColors[metric]
  }));

  // Calculate Y-axis range based on active metrics and view mode
  const getAllValues = () => {
    const allValues = [];
    activeData.forEach(metric => {
      metric.data.forEach(point => {
        allValues.push(viewMode === 'returns' ? point.returns : point.portfolioValue);
      });
    });
    return allValues;
  };

  const allValues = getAllValues();
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue;
  const padding_y = valueRange * 0.1; // Add 10% padding
  const yMin = minValue - padding_y;
  const yMax = maxValue + padding_y;

  // Chart area dimensions
  const plotWidth = 800 - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Mouse event handlers for crosshair
  const handleMouseMove = (event) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const svgWidth = rect.width;
    const svgHeight = rect.height;
    
    // Convert mouse coordinates to SVG coordinates
    const mouseX = ((event.clientX - rect.left) / svgWidth) * 800;
    const mouseY = ((event.clientY - rect.top) / svgHeight) * chartHeight;
    
    // Check if mouse is within the chart area
    if (mouseX >= padding.left && mouseX <= 800 - padding.right && 
        mouseY >= padding.top && mouseY <= padding.top + plotHeight) {
      
      // Calculate the data index based on mouse X position
      const relativeX = mouseX - padding.left;
      const dataIndex = Math.round((relativeX / plotWidth) * (activeData[0]?.data.length - 1 || 0));
      
      setCrosshair({
        x: mouseX,
        y: mouseY,
        visible: true,
        dataIndex: Math.max(0, Math.min(dataIndex, (activeData[0]?.data.length || 1) - 1))
      });
    } else {
      setCrosshair(prev => ({ ...prev, visible: false }));
    }
  };

  const handleMouseLeave = () => {
    setCrosshair(prev => ({ ...prev, visible: false }));
  };

  // Generate path data for each line with animation support
  const generatePath = (data, plotWidth, animated = false) => {
    const maxIndex = animated ? Math.floor((data.length - 1) * animationProgress) : data.length - 1;
    const points = data.slice(0, maxIndex + 1).map((point, index) => {
      const x = padding.left + (index / (data.length - 1)) * plotWidth;
      const value = viewMode === 'returns' ? point.returns : point.portfolioValue;
      const y = padding.top + (chartHeight - padding.top - padding.bottom) - ((value - yMin) / (yMax - yMin)) * (chartHeight - padding.top - padding.bottom);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    });
    
    // Add partial segment for smooth animation
    if (animated && animationProgress > 0 && maxIndex < data.length - 1) {
      const partialProgress = (data.length - 1) * animationProgress - maxIndex;
      if (partialProgress > 0 && maxIndex + 1 < data.length) {
        const currentPoint = data[maxIndex];
        const nextPoint = data[maxIndex + 1];
        
        const currentX = padding.left + (maxIndex / (data.length - 1)) * plotWidth;
        const nextX = padding.left + ((maxIndex + 1) / (data.length - 1)) * plotWidth;
        const interpolatedX = currentX + (nextX - currentX) * partialProgress;
        
        const currentValue = viewMode === 'returns' ? currentPoint.returns : currentPoint.portfolioValue;
        const nextValue = viewMode === 'returns' ? nextPoint.returns : nextPoint.portfolioValue;
        const interpolatedValue = currentValue + (nextValue - currentValue) * partialProgress;
        
        const interpolatedY = padding.top + (chartHeight - padding.top - padding.bottom) - ((interpolatedValue - yMin) / (yMax - yMin)) * (chartHeight - padding.top - padding.bottom);
        
        points.push(`L ${interpolatedX} ${interpolatedY}`);
      }
    }
    
    return points.join(' ');
  };

  // Generate grid points for X-axis
  const xGridPoints = gridPoints.map(point => ({
    ratio: point.index / (totalPeriods - 1),
    label: point.label
  }));

  // Generate Y-axis ticks
  const generateYTicks = () => {
    const tickCount = 6;
    const ticks = [];
    for (let i = 0; i <= tickCount; i++) {
      const value = yMin + (i / tickCount) * (yMax - yMin);
      ticks.push(value);
    }
    return ticks;
  };

  const yTicks = generateYTicks();

  // Get final values for display
  const getFinalValue = (metric) => {
    const data = performanceData[metric];
    const finalPoint = data[data.length - 1];
    return viewMode === 'returns' ? finalPoint.returns : finalPoint.portfolioValue;
  };

  // Format value for display
  const formatValue = (value) => {
    if (viewMode === 'returns') {
      return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    } else {
      return `$${(value / 1000).toFixed(1)}K`;
    }
  };

  // Format Y-axis labels
  const formatYAxisLabel = (value) => {
    if (viewMode === 'returns') {
      return `${value.toFixed(0)}%`;
    } else {
      return `$${(value / 1000).toFixed(0)}K`;
    }
  };

  // Get crosshair data
  const getCrosshairData = () => {
    if (!crosshair.visible || crosshair.dataIndex === null || !activeData.length) return null;
    
    const dataIndex = crosshair.dataIndex;
    const dataPoint = activeData[0].data[dataIndex];
    
    if (!dataPoint) return null;
    
    // Calculate Y value at crosshair X position
    const crosshairValue = (yMax - yMin) * ((padding.top + plotHeight - crosshair.y) / plotHeight) + yMin;
    
    return {
      date: dataPoint.day,
      value: crosshairValue,
      dataIndex,
      dataPoint
    };
  };

  const crosshairData = getCrosshairData();

  return (
    <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      {/* Header with toggle buttons */}
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-xl font-bold transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Portfolio Performance</h3>
        
        {/* View Mode Toggle */}
        <div className={`flex rounded-lg p-1 ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <button
            onClick={() => setViewMode('returns')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'returns'
                ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
            }`}
          >
            Returns
          </button>
          <button
            onClick={() => setViewMode('value')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'value'
                ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
            }`}
          >
            Portfolio Value
          </button>
        </div>
      </div>

      {/* Methodology Toggle Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(methodologyColors).map((metric) => (
          <button
            key={metric}
            onClick={() => toggleMetric(metric)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeMetrics.includes(metric)
                ? 'text-white shadow-md'
                : (isDark 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
            }`}
            style={{
              backgroundColor: activeMetrics.includes(metric) ? methodologyColors[metric] : undefined
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: methodologyColors[metric] }}
            />
            {metric}
          </button>
        ))}
      </div>

      {/* Chart Container - Now with flex layout */}
      <div className="flex relative">
        {/* Chart Area */}
        <div className="flex-1 relative" style={{ marginRight: `${rightLabelSpace}px` }}>
          <svg 
            ref={svgRef}
            width="100%" 
            height={chartHeight} 
            className="overflow-visible cursor-crosshair"
            viewBox={`0 0 800 ${chartHeight}`}
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Grid lines */}
            {yTicks.map((tick, index) => (
              <line
                key={index}
                x1={padding.left}
                y1={padding.top + (chartHeight - padding.top - padding.bottom) - ((tick - yMin) / (yMax - yMin)) * (chartHeight - padding.top - padding.bottom)}
                x2="100%"
                y2={padding.top + (chartHeight - padding.top - padding.bottom) - ((tick - yMin) / (yMax - yMin)) * (chartHeight - padding.top - padding.bottom)}
                stroke={isDark ? "#374151" : "#E5E7EB"}
                strokeWidth="1"
                opacity="0.3"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* X-axis grid lines */}
            {xGridPoints.map((point, index) => (
              <line
                key={index}
                x1={`${padding.left + point.ratio * (800 - padding.left - padding.right)}`}
                y1={padding.top}
                x2={`${padding.left + point.ratio * (800 - padding.left - padding.right)}`}
                y2={padding.top + (chartHeight - padding.top - padding.bottom)}
                stroke={isDark ? "#374151" : "#E5E7EB"}
                strokeWidth="1"
                opacity="0.3"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Y-axis */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + (chartHeight - padding.top - padding.bottom)}
              stroke={isDark ? "#6B7280" : "#374151"}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* X-axis */}
            <line
              x1={padding.left}
              y1={padding.top + (chartHeight - padding.top - padding.bottom)}
              x2="100%"
              y2={padding.top + (chartHeight - padding.top - padding.bottom)}
              stroke={isDark ? "#6B7280" : "#374151"}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Y-axis labels */}
            {yTicks.map((tick, index) => (
              <text
                key={index}
                x={padding.left - 10}
                y={padding.top + (chartHeight - padding.top - padding.bottom) - ((tick - yMin) / (yMax - yMin)) * (chartHeight - padding.top - padding.bottom) + 4}
                textAnchor="end"
                className={`text-xs font-medium ${
                  crosshair.visible && Math.abs(crosshairData?.value - tick) < (yMax - yMin) * 0.05
                    ? (isDark ? 'fill-blue-400' : 'fill-blue-600')
                    : (isDark ? 'fill-gray-400' : 'fill-gray-600')
                }`}
              >
                {formatYAxisLabel(tick)}
              </text>
            ))}

            {/* X-axis labels */}
            {xGridPoints.map((point, index) => (
              <text
                key={index}
                x={padding.left + point.ratio * (800 - padding.left - padding.right)}
                y={padding.top + (chartHeight - padding.top - padding.bottom) + 20}
                textAnchor="middle"
                className={`text-xs font-medium ${
                  crosshair.visible && crosshairData && Math.abs(crosshairData.dataIndex - point.index * (totalPeriods - 1)) < 10
                    ? (isDark ? 'fill-blue-400' : 'fill-blue-600')
                    : (isDark ? 'fill-gray-400' : 'fill-gray-600')
                }`}
              >
                {point.label}
              </text>
            ))}

            {/* Line paths with animation */}
            {activeData.map((metric, index) => (
              <g key={metric.name}>
                <path
                  d={generatePath(metric.data, 800 - padding.left - padding.right, true)}
                  fill="none"
                  stroke={metric.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                  vectorEffect="non-scaling-stroke"
                />
                
                {/* End point circle - only show when animation is complete or near complete */}
                {animationProgress > 0.95 && (
                  <circle
                    cx={800 - padding.right}
                    cy={padding.top + (chartHeight - padding.top - padding.bottom) - ((getFinalValue(metric.name) - yMin) / (yMax - yMin)) * (chartHeight - padding.top - padding.bottom)}
                    r="5"
                    fill={metric.color}
                    stroke="white"
                    strokeWidth="2"
                    className="transition-all duration-300"
                    style={{
                      animation: `fadeIn 0.3s ease-in-out ${0.1 * index}s both`
                    }}
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </g>
            ))}

            {/* Crosshair Lines */}
            {crosshair.visible && (
              <g className="crosshair">
                {/* Vertical line */}
                <line
                  x1={crosshair.x}
                  y1={padding.top}
                  x2={crosshair.x}
                  y2={padding.top + plotHeight}
                  stroke={isDark ? "#60A5FA" : "#3B82F6"}
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity="0.8"
                  vectorEffect="non-scaling-stroke"
                />
                
                {/* Horizontal line */}
                <line
                  x1={padding.left}
                  y1={crosshair.y}
                  x2={800 - padding.right}
                  y2={crosshair.y}
                  stroke={isDark ? "#60A5FA" : "#3B82F6"}
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity="0.8"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Crosshair intersection circle */}
                <circle
                  cx={crosshair.x}
                  cy={crosshair.y}
                  r="4"
                  fill={isDark ? "#60A5FA" : "#3B82F6"}
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.9"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            )}

            {/* Crosshair Y-axis value label */}
            {crosshair.visible && crosshairData && (
              <g className="crosshair-labels">
                <rect
                  x={5}
                  y={crosshair.y - 12}
                  width={50}
                  height={24}
                  fill={isDark ? "#1F2937" : "#FFFFFF"}
                  stroke={isDark ? "#60A5FA" : "#3B82F6"}
                  strokeWidth="1"
                  rx="4"
                  opacity="0.95"
                />
                <text
                  x={30}
                  y={crosshair.y + 4}
                  textAnchor="middle"
                  className={`text-xs font-semibold ${isDark ? 'fill-blue-400' : 'fill-blue-600'}`}
                >
                  {formatYAxisLabel(crosshairData.value)}
                </text>
              </g>
            )}

            {/* Crosshair X-axis date label */}
            {crosshair.visible && crosshairData && (
              <g className="crosshair-date-label">
                <rect
                  x={crosshair.x - 35}
                  y={padding.top + plotHeight + 25}
                  width={70}
                  height={20}
                  fill={isDark ? "#1F2937" : "#FFFFFF"}
                  stroke={isDark ? "#60A5FA" : "#3B82F6"}
                  strokeWidth="1"
                  rx="4"
                  opacity="0.95"
                />
                <text
                  x={crosshair.x}
                  y={padding.top + plotHeight + 38}
                  textAnchor="middle"
                  className={`text-xs font-semibold ${isDark ? 'fill-blue-400' : 'fill-blue-600'}`}
                >
                  {new Date(crosshairData.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Fixed Right Labels Area */}
        <div className="absolute right-0 top-0 space-y-3" style={{ width: `${rightLabelSpace}px`, marginTop: '-10px', right: '-20px' }}>
          {activeData.map((metric, index) => {
            const finalValue = getFinalValue(metric.name);
            const yPosition = padding.top + (chartHeight - padding.top - padding.bottom) - ((finalValue - yMin) / (yMax - yMin)) * (chartHeight - padding.top - padding.bottom);
            
            return (
              <div
                key={metric.name}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isDark ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
                } shadow-md`}
                style={{ 
                  position: 'absolute',
                  top: `${yPosition - 20}px`,
                  right: '10px',
                  opacity: animationProgress > 0.8 ? 1 : 0,
                  transform: `translateX(${animationProgress > 0.8 ? '0' : '20px'})`,
                  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                  transitionDelay: `${0.1 * index + 0.3}s`
                }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: metric.color }}
                />
                <span className={`text-sm font-semibold ${
                  finalValue >= (viewMode === 'returns' ? 0 : 100000) 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {formatValue(finalValue)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Crosshair Data Tooltip */}
      {crosshair.visible && crosshairData && (
        // <div className={`fixed z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-50 ${
        <div className={`fixed z-50 px-4 py-2 rounded-lg shadow-lg ${
          isDark ? 'bg-gray-800 border border-gray-600 text-white' : 'bg-white border border-gray-200 text-gray-900'
        }`} style={{
          left: `${crosshair.x + 180}px`,
          top: `${crosshair.y + 120}px`,
          pointerEvents: 'none'
        }}>
          <div className="text-sm font-semibold mb-1">
            {new Date(crosshairData.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          <div className="space-y-1">
            {activeData.map((metric) => {
              const dataPoint = metric.data[crosshairData.dataIndex];
              const value = viewMode === 'returns' ? dataPoint?.returns : dataPoint?.portfolioValue;
              return (
                <div key={metric.name} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: metric.color }}
                  />
                  <span className="font-medium">{metric.name}:</span>
                  <span className={value >= (viewMode === 'returns' ? 0 : 100000) ? 'text-green-500' : 'text-red-500'}>
                    {formatValue(value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Axis labels */}
      <div className="flex justify-center mt-2">
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {xAxisTitle}
        </span>
      </div>
      
      <div className="absolute left-4 top-1/2 transform -rotate-90 -translate-y-1/2">
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {viewMode === 'returns' ? 'Returns (%)' : 'Portfolio Value ($)'}
        </span>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .crosshair {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default PortfolioPerformanceChart;