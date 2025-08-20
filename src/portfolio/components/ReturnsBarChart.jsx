import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, MousePointer2, ZoomIn, ZoomOut, RotateCcw, Move, Eye, EyeOff, BarChart2 } from 'lucide-react';
import { useTheme } from '../../ThemeContext';

const ReturnsBarChart = ({ 
  data, 
  secondaryData = null,
  primaryLabel = "Primary",
  secondaryLabel = "Secondary",
  colors = null,
  showComparison = true,
  baselineMode_input = "zero", // "zero" or "lowest"
  className = ""
}) => {
  const { isDark } = useTheme();
  
  // Dynamic theme-based colors
  const themeColors = useMemo(() => colors || {
    primary: {
      positive: isDark ? "#00D4AA" : "#00C896",
      negative: isDark ? "#FF7B7B" : "#FF6B6B",
      neutral: isDark ? "#64748B" : "#94A3B8"
    },
    secondary: {
      positive: isDark ? "#FBBF24" : "#F59E0B",
      negative: isDark ? "#F97316" : "#EA580C",
      neutral: isDark ? "#8B5CF6" : "#7C3AED"
    },
    grid: isDark ? "#374151" : "#f1f5f9",
    text: isDark ? "#D1D5DB" : "#64748B",
    background: isDark ? "#1F2937" : "#FFFFFF",
    surface: isDark ? "#111827" : "#F8FAFC"
  }, [isDark, colors]);

  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [crosshair, setCrosshair] = useState({ x: 0, y: 0, visible: false });
  const [showComparisonToggle, setShowComparisonToggle] = useState(showComparison && !!secondaryData);
  
  // Zoom and Pan State
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, panOffset: 0 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // BaselineMode
  const [baselineMode, setBaselineMode] = useState(baselineMode_input);
  
  // Refs
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Constants
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 10;
  const padding = { 
    left: Math.max(50, dimensions.width * 0.08), 
    right: Math.max(50, dimensions.width * 0.08), 
    top: 20, 
    bottom: 40 
  };

  // Resize observer
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ 
          width: Math.max(400, width), 
          height: Math.max(300, height) 
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

  // Calculate visible data range
  const visibleData = useMemo(() => {
    if (!data || data.length === 0) return { data: [], secondaryData: [], startIndex: 0, endIndex: 0 };
    
    const totalPoints = data.length;
    const visiblePointsCount = Math.max(Math.floor(totalPoints / zoom), 10);
    
    const maxPanOffset = Math.max(0, totalPoints - visiblePointsCount);
    const clampedPanOffset = Math.max(0, Math.min(panOffset, maxPanOffset));
    
    const startIndex = Math.floor(clampedPanOffset);
    const endIndex = Math.min(startIndex + visiblePointsCount, totalPoints);
    
    const visibleMainData = data.slice(startIndex, endIndex);
    const visibleSecondaryData = (secondaryData && showComparisonToggle) ? secondaryData.slice(startIndex, endIndex) : null;
    
    return {
      data: visibleMainData,
      secondaryData: visibleSecondaryData,
      startIndex,
      endIndex,
      totalPoints
    };
  }, [data, secondaryData, zoom, panOffset, showComparisonToggle]);

  // Calculate scales for visible data
  const chartData = useMemo(() => {
    const { data: visibleMainData, secondaryData: visibleSecondaryData } = visibleData;
    
    if (!visibleMainData || visibleMainData.length === 0) return { min: 0, max: 100, range: 100, baseline: 0 };
    
    // Collect all values from both datasets
    let allValues = visibleMainData.map(d => d.value || d.close || 0);
    if (visibleSecondaryData && showComparisonToggle) {
      allValues = [...allValues, ...visibleSecondaryData.map(d => d.value || d.close || 0)];
    }
    
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    
    // Determine baseline based on mode
    let baseline;
    if (baselineMode === "zero") {
      baseline = 0;
      // Ensure 0 is included in the range
      const adjustedMin = Math.min(min, 0);
      const adjustedMax = Math.max(max, 0);
      const range = adjustedMax - adjustedMin;
      const padding = range * 0.1;
      
      return {
        min: adjustedMin - padding,
        max: adjustedMax + padding,
        range: range + (padding * 2),
        baseline: 0
      };
    } else {
      baseline = min;
      const range = max - min;
      const padding = range * 0.1;
      
      return {
        min: min - padding,
        max: max + padding,
        range: range + (padding * 2),
        baseline: min
      };
    }
  }, [visibleData, showComparisonToggle, baselineMode]);

  // Helper functions
  const chartWidth = dimensions.width;
  const chartHeight = dimensions.height;
  
  const getX = (index, isPaired = false, isSecondary = false) => {
    const totalBars = visibleData.data.length;
    const barGroupWidth = (chartWidth - padding.left - padding.right) / totalBars;
    const baseX = padding.left + (index + 0.5) * barGroupWidth;
    
    if (!isPaired) return baseX;
    
    // For paired bars, offset them slightly
    const barWidth = Math.min(barGroupWidth * 0.35, 40);
    return baseX + (isSecondary ? barWidth * 0.6 : -barWidth * 0.6);
  };
  
  const getY = (value) => padding.top + ((chartData.max - value) / chartData.range) * (chartHeight - padding.top - padding.bottom);
  const getBaselineY = () => getY(chartData.baseline);

  // Generate grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    const valueStep = chartData.range / 8;
    const timeStep = Math.max(1, Math.floor(visibleData.data.length / 8));
    
    // Horizontal value lines
    for (let i = 0; i <= 8; i++) {
      const value = chartData.min + (valueStep * i);
      const y = getY(value);
      lines.push({
        type: 'horizontal',
        y,
        value: value.toFixed(2),
        key: `h-${i}`,
        isBaseline: Math.abs(value - chartData.baseline) < valueStep * 0.1
      });
    }
    
    // Vertical time lines
    for (let i = 0; i < visibleData.data.length; i += timeStep) {
      const x = getX(i);
      lines.push({
        type: 'vertical',
        x,
        label: visibleData.data[i]?.date || visibleData.data[i]?.label || `${i}`,
        key: `v-${i}`
      });
    }
    
    return lines;
  }, [visibleData, chartData]);

  // Zoom functions
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

  // Pan functions
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
      
      const maxPanOffset = Math.max(0, data.length - Math.floor(data.length / zoom));
      const clampedOffset = Math.max(0, Math.min(newPanOffset, maxPanOffset));
      
      setPanOffset(clampedOffset);
    } else {
      const isInChartArea = x >= padding.left && 
                            x <= (chartWidth - padding.right) && 
                            y >= padding.top && 
                            y <= (chartHeight - padding.bottom);

      if (isInChartArea) {
        setCrosshair({ 
          x: Math.max(padding.left, Math.min(x, chartWidth - padding.right)), 
          y: Math.max(padding.top, Math.min(y, chartHeight - padding.bottom)), 
          visible: true 
        });
      } else {
        setCrosshair({ x: 0, y: 0, visible: false });
      }
    }
  }, [isDraggingRef, dragStart, visibleData.totalPoints, chartWidth, data, zoom, padding, chartHeight]);

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
    return () => chartElement.removeEventListener('wheel', handleWheelEvent);
  }, []);

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
        
        const maxPanOffset = Math.max(0, data.length - Math.floor(data.length / zoom));
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
  }, [isDragging, dragStart, visibleData.totalPoints, chartWidth, data, zoom]);

  // Bar renderer
  const renderBars = () => {
    const isPaired = showComparisonToggle && visibleData.secondaryData;
    const barGroupWidth = (chartWidth - padding.left - padding.right) / visibleData.data.length;
    const barWidth = isPaired ? Math.min(barGroupWidth * 0.35, 40) : Math.min(barGroupWidth * 0.7, 60);
    const baselineY = getBaselineY();

    return (
      <g>
        {/* Primary bars */}
        {visibleData.data.map((item, index) => {
          const value = item.value || item.close || 0;
          const x = getX(index, isPaired, false);
          const y = getY(value);
          const height = Math.abs(y - baselineY);
          const isPositive = value >= chartData.baseline;
          
          const color = isPositive ? themeColors.primary.positive : themeColors.primary.negative;
          
          return (
            <rect
              key={`primary-bar-${index}`}
              x={x - barWidth / 2}
              y={Math.min(y, baselineY)}
              width={barWidth}
              height={height}
              fill={color}
              stroke="none"
              className="cursor-crosshair hover:opacity-80 transition-opacity"
              onMouseEnter={() => !isDragging && setHoveredPoint({ 
                ...item, 
                index, 
                x, 
                y, 
                value,
                isPrimary: true 
              })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          );
        })}

        {/* Secondary bars */}
        {isPaired && visibleData.secondaryData?.map((item, index) => {
          const value = item.value || item.close || 0;
          const x = getX(index, isPaired, true);
          const y = getY(value);
          const height = Math.abs(y - baselineY);
          const isPositive = value >= chartData.baseline;
          
          const color = isPositive ? themeColors.secondary.positive : themeColors.secondary.negative;
          
          return (
            <rect
              key={`secondary-bar-${index}`}
              x={x - barWidth / 2}
              y={Math.min(y, baselineY)}
              width={barWidth}
              height={height}
              fill={color}
              stroke="none"
              className="cursor-crosshair hover:opacity-80 transition-opacity"
              onMouseEnter={() => !isDragging && setHoveredPoint({ 
                ...item, 
                index, 
                x, 
                y, 
                value,
                isSecondary: true,
                date: visibleData.data[index]?.date || visibleData.data[index]?.label
              })}
              onMouseLeave={() => setHoveredPoint(null)}
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
        className={`flex items-center justify-center h-full min-h-[300px] rounded-lg ${className}`}
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
      {/* Header with controls */}
      <div
        className="flex justify-between items-center p-4 border-b min-h-[70px] flex-wrap gap-2"
        style={{ borderColor: themeColors.grid }}
      >
        <div className="flex items-center space-x-4 flex-wrap">
          <h4 className="font-semibold whitespace-nowrap" style={{ color: themeColors.text }}>
            {primaryLabel} Returns
          </h4>
          
          {/* Baseline Mode Toggle */}
          <div className="flex rounded-lg p-1" style={{ backgroundColor: themeColors.surface }}>
            <button
              onClick={() => setBaselineMode('zero')}
              className={`px-3 py-1 rounded-md transition-colors text-xs ${
                baselineMode === 'zero' ? 'shadow-sm' : 'hover:opacity-80'
              }`}
              style={{ 
                backgroundColor: baselineMode === 'zero' ? themeColors.background : 'transparent',
                color: baselineMode === 'zero' ? themeColors.primary.positive : themeColors.text
              }}
              title="Zero Baseline"
            >
              Zero
            </button>
            <button
              onClick={() => setBaselineMode('lowest')}
              className={`px-3 py-1 rounded-md transition-colors text-xs ${
                baselineMode === 'lowest' ? 'shadow-sm' : 'hover:opacity-80'
              }`}
              style={{ 
                backgroundColor: baselineMode === 'lowest' ? themeColors.background : 'transparent',
                color: baselineMode === 'lowest' ? themeColors.primary.positive : themeColors.text
              }}
              title="Lowest Value Baseline"
            >
              Lowest
            </button>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="flex items-center space-x-2">
          {/* Comparison Toggle */}
          {secondaryData && (
            <button
              onClick={() => setShowComparisonToggle(!showComparisonToggle)}
              className="p-2 rounded-md transition-colors hover:opacity-80"
              style={{ 
                backgroundColor: showComparisonToggle ? themeColors.secondary.positive : themeColors.surface,
                color: showComparisonToggle ? themeColors.background : themeColors.text
              }}
              title="Toggle Comparison"
            >
              {showComparisonToggle ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}

          {/* Reset View */}
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

      {/* Chart Container */}
      <div className="relative flex-1" style={{ height: 'calc(100% - 70px)' }}>
        <svg
          ref={chartRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
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
                      stroke={line.isBaseline ? themeColors.text : themeColors.grid}
                      strokeWidth={line.isBaseline ? "2" : "1"}
                      strokeDasharray={line.isBaseline ? "none" : "2,2"}
                      opacity={line.isBaseline ? "0.6" : "0.3"}
                    />
                    <text
                      x={padding.left - 10}
                      y={line.y + 4}
                      textAnchor="end"
                      fontSize="14"
                      fill={line.isBaseline ? themeColors.text : themeColors.text}
                      fontWeight={line.isBaseline ? "600" : "400"}
                    >
                      {line.value}
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
                      y2={chartHeight - padding.bottom}
                      stroke={themeColors.grid}
                      strokeWidth="1"
                      strokeDasharray="2,2"
                      opacity="0.3"
                    />
                    <text
                      x={line.x}
                      y={dimensions.height - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill={themeColors.text}
                    >
                      {line.label}
                    </text>
                  </g>
                );
              }
            })}
          </g>

          {/* Bars */}
          {renderBars()}

          {/* Crosshair */}
          {crosshair.visible && !isDragging && (
            <g className="crosshair" pointerEvents="none">
              <line
                x1={Math.max(padding.left, Math.min(crosshair.x, chartWidth - padding.right))}
                y1={padding.top}
                x2={Math.max(padding.left, Math.min(crosshair.x, chartWidth - padding.right))}
                y2={chartHeight - padding.bottom}
                stroke={themeColors.text}
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.4"
              />
              <line
                x1={padding.left}
                y1={Math.max(padding.top, Math.min(crosshair.y, chartHeight - padding.bottom))}
                x2={chartWidth - padding.right}
                y2={Math.max(padding.top, Math.min(crosshair.y, chartHeight - padding.bottom))}
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
                x={hoveredPoint.x - 60}
                y={hoveredPoint.y - 80}
                width="120"
                height="60"
                rx="8"
                fill="rgba(0,0,0,0.9)"
                stroke={themeColors.grid}
              />
              <text x={hoveredPoint.x} y={hoveredPoint.y - 55} textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
                {hoveredPoint.date || hoveredPoint.label || `Point ${hoveredPoint.index}`}
              </text>
              <text 
                x={hoveredPoint.x} 
                y={hoveredPoint.y - 35} 
                textAnchor="middle" 
                fontSize="11" 
                fill={hoveredPoint.isSecondary ? themeColors.secondary.positive : themeColors.primary.positive}
              >
                {hoveredPoint.isSecondary ? secondaryLabel : primaryLabel}: {hoveredPoint.value?.toFixed(3)}
              </text>
            </g>
          )}

          {/* Zoom indicator */}
          {zoom > 1 && (
            <g className="zoom-indicator" pointerEvents="none">
              <rect
                x={padding.left}
                y={chartHeight - padding.bottom + 5}
                width={(chartWidth - padding.left - padding.right) / zoom}
                height="3"
                fill={themeColors.primary.positive}
                opacity="0.6"
                rx="1"
              />
              <rect
                x={padding.left + (panOffset / data.length) * (chartWidth - padding.left - padding.right)}
                y={chartHeight - padding.bottom + 3}
                width={Math.max(5, (chartWidth - padding.left - padding.right) / zoom)}
                height="7"
                fill={themeColors.primary.positive}
                opacity="0.8"
                rx="2"
              />
            </g>
          )}
        </svg>

        {/* Instructions overlay */}
        {zoom === 1 && (
          <div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full pointer-events-none text-xs"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.75)', 
              color: 'white' 
            }}
          >
            Wheel to zoom • Drag to pan when zoomed
          </div>
        )}
      </div>

      {/* Legend */}
      <div 
        className="flex justify-between items-center p-2"
        style={{ 
          backgroundColor: themeColors.surface,
          borderColor: themeColors.grid 
        }}
      >
        <div className="flex items-center space-x-6 flex-wrap">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-4 rounded" style={{ backgroundColor: themeColors.primary.positive }}></div>
              <div className="w-3 h-4 rounded" style={{ backgroundColor: themeColors.primary.negative }}></div>
            </div>
            <span className="text-sm font-medium" style={{ color: themeColors.text }}>{primaryLabel}</span>
          </div>
          {secondaryData && showComparisonToggle && (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-4 rounded" style={{ backgroundColor: themeColors.secondary.positive }}></div>
                <div className="w-3 h-4 rounded" style={{ backgroundColor: themeColors.secondary.negative }}></div>
              </div>
              <span className="text-sm font-medium" style={{ color: themeColors.text }}>{secondaryLabel}</span>
            </div>
          )}
        </div>
        
        {/* Zoom info and baseline info */}
        <div className="flex items-center space-x-4 text-xs" style={{ color: themeColors.text }}>
          <span>Baseline: {baselineMode === 'zero' ? '0' : 'Lowest'}</span>
          {zoom > 1 && <span>Zoom: {zoom.toFixed(1)}x</span>}
        </div>
      </div>
    </div>
  );
};

export default ReturnsBarChart;