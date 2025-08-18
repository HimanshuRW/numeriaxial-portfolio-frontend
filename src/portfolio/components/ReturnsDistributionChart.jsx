import { useMemo, useState } from "react";
import { BarChart2, Activity } from "lucide-react";
import { useTheme } from "../../ThemeContext";

const ReturnsDistributionChart = ({ returnBased }) => {
  const { isDark } = useTheme();
  const [chartType, setChartType] = useState("line"); // "line" or "bar"
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: "" });

  // Calculate distribution data
  const returnsDistribution = useMemo(() => {
    if (!returnBased?.time_series_data?.portfolio_returns)
      return { bins: [], mean: 0, std: 0 };

    const returns = returnBased.time_series_data.portfolio_returns;
    const mean =
      returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance =
      returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) /
      returns.length;
    const std = Math.sqrt(variance);

    const bins = [];
    const numBins = 50;
    const min = Math.min(...returns);
    const max = Math.max(...returns);
    const binWidth = (max - min) / numBins;

    for (let i = 0; i < numBins; i++) {
      const binStart = min + i * binWidth;
      const binEnd = binStart + binWidth;
      const count = returns.filter(
        (ret) => ret >= binStart && ret < binEnd
      ).length;
      bins.push({
        range: `${(binStart * 100).toFixed(1)}%`,
        count,
        binStart: binStart * 100,
        binEnd: binEnd * 100,
        frequency: count / returns.length,
      });
    }

    return { bins, mean: mean * 100, std: std * 100 };
  }, [returnBased]);

  // Chart layout constants
  const chartHeight = 180;
  const chartTop = 20;
  const chartXStart = 20;
  const chartXEnd = 380;
  const availableHeight = chartHeight - chartTop;

  // Dynamic Y scaling
  const maxFrequency = Math.max(...returnsDistribution.bins.map(b => b.frequency), 0.0001);
  const scaleY = (frequency) =>
    chartHeight - (frequency / maxFrequency) * availableHeight;

  // Dynamic X scaling
  const minBinValue = Math.min(...returnsDistribution.bins.map(b => b.binStart), 0);
  const maxBinValue = Math.max(...returnsDistribution.bins.map(b => b.binEnd), 1);
  const scaleXValue = (value) =>
    chartXStart +
    ((value - minBinValue) / (maxBinValue - minBinValue)) *
      (chartXEnd - chartXStart);

  // Mean and std line positions
  const meanX = scaleXValue(returnsDistribution.mean);
  const plus1StdX = scaleXValue(returnsDistribution.mean + returnsDistribution.std);
  const minus1StdX = scaleXValue(returnsDistribution.mean - returnsDistribution.std);
  const plus2StdX = scaleXValue(returnsDistribution.mean + returnsDistribution.std * 2);
  const minus2StdX = scaleXValue(returnsDistribution.mean - returnsDistribution.std * 2);

  // X-axis labels
  const xAxisTicks = 5;
  const binLabels = returnsDistribution.bins
    .map((b) => b.range)
    .filter((_, i, arr) => i % Math.floor(arr.length / xAxisTicks) === 0);

  // Tooltip handlers
  const handleMouseMove = (event, bin) => {
    const svgRect = event.currentTarget.ownerSVGElement.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: event.clientX - svgRect.left + 10,
      y: event.clientY - svgRect.top - 10,
      label: `${bin.range} | Days: ${bin.count}`,
    });
  };

  const hideTooltip = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  return (
    <div
      className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Heading and chart type toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-purple-600" />
          <h3
            className={`text-lg font-semibold transition-colors duration-300 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Returns Distribution
          </h3>
        </div>
        <div className="flex space-x-2">
          <Activity
            className={`w-5 h-5 cursor-pointer ${
              chartType === "line"
                ? "text-purple-600"
                : isDark
                ? "text-gray-400"
                : "text-gray-500"
            }`}
            onClick={() => setChartType("line")}
          />
          <BarChart2
            className={`w-5 h-5 cursor-pointer ${
              chartType === "bar"
                ? "text-purple-600"
                : isDark
                ? "text-gray-400"
                : "text-gray-500"
            }`}
            onClick={() => setChartType("bar")}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 relative">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {chartType === "line" ? (
            <>
              {/* Line path */}
              <path
                d={`M ${chartXStart},${chartHeight} ${returnsDistribution.bins
                  .map((bin, index) => {
                    const x = chartXStart + (index / (returnsDistribution.bins.length - 1)) * (chartXEnd - chartXStart);
                    const y = scaleY(bin.frequency);
                    return `L ${x},${y}`;
                  })
                  .join(" ")}`}
                stroke="#8B5CF6"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-sm"
              />

              {/* Area under curve */}
              <path
                d={`M ${chartXStart},${chartHeight} ${returnsDistribution.bins
                  .map((bin, index) => {
                    const x = chartXStart + (index / (returnsDistribution.bins.length - 1)) * (chartXEnd - chartXStart);
                    const y = scaleY(bin.frequency);
                    return `L ${x},${y}`;
                  })
                  .join(" ")} L ${chartXEnd},${chartHeight} Z`}
                fill="url(#gradient)"
                opacity="0.3"
              />

              {/* Hover points */}
              {returnsDistribution.bins.map((bin, index) => {
                const x = chartXStart + (index / (returnsDistribution.bins.length - 1)) * (chartXEnd - chartXStart);
                const y = scaleY(bin.frequency);
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={6}
                    fill="transparent"
                    onMouseMove={(e) => handleMouseMove(e, bin)}
                    onMouseLeave={hideTooltip}
                  />
                );
              })}
            </>
          ) : (
            returnsDistribution.bins.map((bin, index) => {
              const x = chartXStart + (index / (returnsDistribution.bins.length - 1)) * (chartXEnd - chartXStart);
              const barWidth = (chartXEnd - chartXStart) / returnsDistribution.bins.length;
              const y = scaleY(bin.frequency);
              return (
                <rect
                  key={index}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={chartHeight - y}
                  fill="#8B5CF6"
                  opacity="0.7"
                  onMouseMove={(e) => handleMouseMove(e, bin)}
                  onMouseLeave={hideTooltip}
                />
              );
            })
          )}

          {/* Gradient */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#8B5CF6", stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: "#8B5CF6", stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>

          {/* Mean & std lines */}
          <line x1={meanX} y1={chartTop} x2={meanX} y2={chartHeight} stroke="#10B981" strokeWidth="2" strokeDasharray="5,5" />
          <line x1={plus1StdX} y1={chartTop} x2={plus1StdX} y2={chartHeight} stroke="#EF4444" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={minus1StdX} y1={chartTop} x2={minus1StdX} y2={chartHeight} stroke="#EF4444" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={plus2StdX} y1={chartTop} x2={plus2StdX} y2={chartHeight} stroke="#F59E0B" strokeWidth="1" strokeDasharray="2,2" />
          <line x1={minus2StdX} y1={chartTop} x2={minus2StdX} y2={chartHeight} stroke="#F59E0B" strokeWidth="1" strokeDasharray="2,2" />

          {/* Mean label */}
          <text x={meanX} y="15" textAnchor="middle" className="text-xs fill-green-600">
            Mean: {returnsDistribution.mean.toFixed(2)}%
          </text>

          {/* X-axis */}
          <line x1={chartXStart} y1={chartHeight} x2={chartXEnd} y2={chartHeight} stroke={isDark ? "#ccc" : "#333"} strokeWidth="1" />
          {binLabels.map((label, i) => {
            const x = chartXStart + (i / (binLabels.length - 1)) * (chartXEnd - chartXStart);
            return (
              <text key={i} x={x} y="195" textAnchor="middle" fontSize="10" fill={isDark ? "#ccc" : "#333"}>
                {label}
              </text>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x,
              top: tooltip.y,
              background: isDark ? "#333" : "#fff",
              color: isDark ? "#fff" : "#000",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              pointerEvents: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            {tooltip.label}
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500"></div>
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>Mean</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-1 bg-red-500"></div>
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>±1σ ({returnsDistribution.std.toFixed(2)}%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-1 bg-yellow-500"></div>
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>±2σ ({(returnsDistribution.std * 2).toFixed(2)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsDistributionChart;