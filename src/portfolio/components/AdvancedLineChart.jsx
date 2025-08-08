import React, { useState } from 'react';

const AdvancedLineChart = ({ data, primaryColor = "#3B82F6", secondaryColor = "#F59E0B" }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  if (!data || !data.primary) return null;
  
  const { primary, secondary, primaryLabel, secondaryLabel } = data;
  
  // Calculate scales
  const primaryValues = primary.map(p => p.value);
  const secondaryValues = secondary ? secondary.map(s => s.value) : [];
  
  const primaryMin = Math.min(...primaryValues);
  const primaryMax = Math.max(...primaryValues);
  const primaryRange = primaryMax - primaryMin;
  
  const secondaryMin = secondary ? Math.min(...secondaryValues) : 0;
  const secondaryMax = secondary ? Math.max(...secondaryValues) : 0;
  const secondaryRange = secondary ? secondaryMax - secondaryMin : 0;
  
  // Chart dimensions - ENLARGED!
  const chartWidth = 500;  // Increased from 350
  const chartHeight = 280; // Increased from 200
  const padding = 50;      // Increased from 40
  
  // Generate Y-axis ticks for primary
  const primaryTicks = [];
  const primaryStep = primaryRange / 4;
  for (let i = 0; i <= 4; i++) {
    primaryTicks.push(primaryMin + (primaryStep * i));
  }
  
  // Generate Y-axis ticks for secondary (if exists)
  const secondaryTicks = [];
  if (secondary) {
    const secondaryStep = secondaryRange / 4;
    for (let i = 0; i <= 4; i++) {
      secondaryTicks.push(secondaryMin + (secondaryStep * i));
    }
  }
  
  return (
    <div className="relative">
      <div className="h-80 relative"> {/* Increased from h-64 to h-80 */}
        <svg 
          className="w-full h-full" 
          viewBox={`0 0 ${chartWidth + padding * 2} ${chartHeight + padding * 2}`}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Primary Y-axis */}
          <g>
            {primaryTicks.map((tick, index) => {
              const y = padding + chartHeight - ((tick - primaryMin) / primaryRange) * chartHeight;
              return (
                <g key={`primary-tick-${index}`}>
                  <line 
                    x1={padding} 
                    y1={y} 
                    x2={padding + chartWidth} 
                    y2={y} 
                    stroke="#e5e7eb" 
                    strokeWidth="0.5"
                  />
                  <text 
                    x={padding - 5} 
                    y={y + 4} 
                    textAnchor="end" 
                    fontSize="11"  
                    fill={primaryColor}
                    fontWeight="500"
                  >
                    ${tick.toLocaleString()}
                  </text>
                </g>
              );
            })}
          </g>
          
          {/* Secondary Y-axis (if exists) */}
          {secondary && (
            <g>
              {secondaryTicks.map((tick, index) => {
                const y = padding + chartHeight - ((tick - secondaryMin) / secondaryRange) * chartHeight;
                return (
                  <text 
                    key={`secondary-tick-${index}`}
                    x={padding + chartWidth + 5} 
                    y={y + 4} 
                    textAnchor="start" 
                    fontSize="11"  
                    fill={secondaryColor}
                    fontWeight="500"
                  >
                    ${tick.toLocaleString()}
                  </text>
                );
              })}
            </g>
          )}
          
          {/* Primary line */}
          <polyline
            fill="none"
            stroke={primaryColor}
            strokeWidth="3.5"  
            points={primary.map((point, index) => {
              const x = padding + (index / (primary.length - 1)) * chartWidth;
              const y = padding + chartHeight - ((point.value - primaryMin) / primaryRange) * chartHeight;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Secondary line (if exists) */}
          {secondary && (
            <polyline
              fill="none"
              stroke={secondaryColor}
              strokeWidth="3"  
              strokeDasharray="8,5"  
              points={secondary.map((point, index) => {
                const x = padding + (index / (secondary.length - 1)) * chartWidth;
                const y = padding + chartHeight - ((point.value - secondaryMin) / secondaryRange) * chartHeight;
                return `${x},${y}`;
              }).join(' ')}
            />
          )}
          
          {/* Data points for primary */}
          {primary.map((point, index) => {
            const x = padding + (index / (primary.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((point.value - primaryMin) / primaryRange) * chartHeight;
            return (
              <circle 
                key={`primary-point-${index}`}
                cx={x} 
                cy={y} 
                r="5"  
                fill={primaryColor}
                className="cursor-pointer hover:r-7"  
                onMouseEnter={() => setHoveredPoint({
                  index,
                  x,
                  y,
                  primaryValue: point.value,
                  secondaryValue: secondary ? secondary[index]?.value : null,
                  date: point.date
                })}
              />
            );
          })}
          
          {/* Data points for secondary (if exists) */}
          {secondary && secondary.map((point, index) => {
            const x = padding + (index / (secondary.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((point.value - secondaryMin) / secondaryRange) * chartHeight;
            return (
              <circle 
                key={`secondary-point-${index}`}
                cx={x} 
                cy={y} 
                r="4"  
                fill={secondaryColor}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint({
                  index,
                  x,
                  y,
                  primaryValue: primary[index]?.value,
                  secondaryValue: point.value,
                  date: point.date
                })}
              />
            );
          })}
          
          {/* X-axis labels */}
          {primary.map((point, index) => {
            if (index % Math.ceil(primary.length / 6) === 0) {
              const x = padding + (index / (primary.length - 1)) * chartWidth;
              return (
                <text 
                  key={`x-label-${index}`}
                  x={x} 
                  y={padding + chartHeight + 25}  
                  textAnchor="middle" 
                  fontSize="11"  
                  fill="#6B7280"
                  fontWeight="500"
                >
                  {point.date}
                </text>
              );
            }
            return null;
          })}
          
          {/* Hover tooltip */}
          {hoveredPoint && (
            <g>
              <rect
                x={hoveredPoint.x - 50}  
                y={hoveredPoint.y - 60}  
                width="100"  
                height="50"   
                rx="8"       
                fill="rgba(0,0,0,0.85)"  
                stroke="#374151"
              />
              <text x={hoveredPoint.x} y={hoveredPoint.y - 40} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">
                {hoveredPoint.date}
              </text>
              <text x={hoveredPoint.x} y={hoveredPoint.y - 28} textAnchor="middle" fontSize="10" fill={primaryColor}>
                {primaryLabel}: ${hoveredPoint.primaryValue?.toLocaleString()}
              </text>
              {hoveredPoint.secondaryValue && (
                <text x={hoveredPoint.x} y={hoveredPoint.y - 16} textAnchor="middle" fontSize="10" fill={secondaryColor}>
                  {secondaryLabel}: ${hoveredPoint.secondaryValue?.toLocaleString()}
                </text>
              )}
            </g>
          )}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-8 mt-5">  
        <div className="flex items-center space-x-3">  
          <div className="w-5 h-4 rounded" style={{ backgroundColor: primaryColor }}></div>  
          <span className="text-sm font-medium text-gray-600">{primaryLabel}</span>  
        </div>
        {secondary && (
          <div className="flex items-center space-x-3">  
            <div className="w-5 h-4 rounded" style={{ backgroundColor: secondaryColor }}></div>  
            <span className="text-sm font-medium text-gray-600">{secondaryLabel}</span>  
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedLineChart;