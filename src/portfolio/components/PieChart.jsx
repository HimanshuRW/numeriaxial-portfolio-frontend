import { useTheme } from '../../ThemeContext';

const PieChart = ({ data, title }) => {
  const { isDark } = useTheme();
  const total = data.reduce((sum, item) => sum + item.allocation, 0);

  // Dynamic color generation based on number of stocks
  const generateColors = (count) => {
    const colors = [];
    
    // Base colors for common cases
    const baseColors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Orange
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
      '#F97316', // Orange-600
      '#84CC16', // Lime-500
      '#EC4899', // Pink-500
      '#6366F1', // Indigo-500
    ];

    // If we have fewer stocks than base colors, just use the first N colors
    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }

    // For more stocks, generate additional colors using HSL
    for (let i = 0; i < count; i++) {
      if (i < baseColors.length) {
        colors.push(baseColors[i]);
      } else {
        // Generate additional colors using HSL with good distribution
        const hue = (i * 137.508) % 360; // Golden angle for good distribution
        const saturation = 65 + (i % 3) * 10; // Vary saturation 65-85%
        const lightness = 50 + (i % 4) * 8; // Vary lightness 50-74%
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
      }
    }

    return colors;
  };

  // Generate colors dynamically based on data length
  const colors = generateColors(data.length);

  // Sort data by allocation to ensure consistent color assignment
  const sortedData = [...data].sort((a, b) => b.allocation - a.allocation);

  return (
    <div>
      <h4 className={`font-medium mb-4 transition-colors duration-300 ${
        isDark ? 'text-white' : 'text-gray-800'
      }`}>{title}</h4>
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {(() => {
              let currentAngle = 0;
              return sortedData.map((item, index) => {
                const percentage = item.allocation / total;
                const angle = percentage * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                
                // Convert angles to radians
                const startAngleRad = (startAngle * Math.PI) / 180;
                const endAngleRad = (endAngle * Math.PI) / 180;
                
                // Calculate path coordinates
                const centerX = 100;
                const centerY = 100;
                const radius = 80;
                
                const x1 = centerX + radius * Math.cos(startAngleRad);
                const y1 = centerY + radius * Math.sin(startAngleRad);
                const x2 = centerX + radius * Math.cos(endAngleRad);
                const y2 = centerY + radius * Math.sin(endAngleRad);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M ${centerX} ${centerY}`,
                  `L ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');
                
                currentAngle += angle;
                
                return (
                  <g key={`${item.ticker}-${index}`}>
                    <path
                      d={pathData}
                      fill={colors[index]}
                      className="cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-105"
                      style={{
                        transformOrigin: `${centerX}px ${centerY}px`,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                      }}
                      title={`${item.ticker}: ${item.allocation.toFixed(1)}%`}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.2)) brightness(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1)) brightness(1)';
                      }}
                    />
                  </g>
                );
              });
            })()}
            {/* Center circle for donut effect */}
            <circle
              cx="100"
              cy="100"
              r="50"
              fill={isDark ? '#1f2937' : '#f9fafb'}
              className="transition-colors duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{data.length}</div>
              <div className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Assets</div>
            </div>
          </div>
        </div>
        {/* <div className="ml-8 space-y-2 max-h-48 overflow-y-auto"> */}
        <div className="ml-8 space-y-2 h-full overflow-y-auto">
          {sortedData.map((item, index) => (
            <div 
              key={`legend-${item.ticker}-${index}`} 
              className="flex items-center space-x-2 p-1 rounded-md cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onMouseEnter={() => {
                // Find the corresponding pie slice and highlight it
                const pieSlice = document.querySelector(`[title="${item.ticker}: ${item.allocation.toFixed(1)}%"]`);
                if (pieSlice) {
                  pieSlice.style.transform = 'scale(1.1)';
                  pieSlice.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.2)) brightness(1.1)';
                }
              }}
              onMouseLeave={() => {
                // Reset the corresponding pie slice
                const pieSlice = document.querySelector(`[title="${item.ticker}: ${item.allocation.toFixed(1)}%"]`);
                if (pieSlice) {
                  pieSlice.style.transform = 'scale(1)';
                  pieSlice.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1)) brightness(1)';
                }
              }}
            >
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0 transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span className={`font-medium transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{item.ticker}</span>
              <span className={`transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>{item.allocation.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;