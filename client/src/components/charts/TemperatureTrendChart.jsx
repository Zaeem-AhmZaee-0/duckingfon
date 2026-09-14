import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';

export default function TemperatureTrendChart() {
  const { weatherData, units } = useWeather();
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const hourly = weatherData?.hourly?.slice(0, 24) || [];
  if (hourly.length === 0) return null;

  const temps = hourly.map(h => h.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(1, maxTemp - minTemp);

  const svgWidth = 720;
  const svgHeight = 160;
  const paddingX = 30;
  const paddingTop = 25;
  const paddingBottom = 35;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  // Compute SVG points
  const points = hourly.map((h, i) => {
    const x = paddingX + (i / (hourly.length - 1)) * plotWidth;
    const y = paddingTop + (1 - (h.temp - minTemp) / tempRange) * plotHeight;
    return { x, y, data: h };
  });

  // Generate smooth SVG cubic bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpx1 = p0.x + (p1.x - p0.x) * 0.5;
    const cpy1 = p0.y;
    const cpx2 = p0.x + (p1.x - p0.x) * 0.5;
    const cpy2 = p1.y;
    pathD += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${p1.x} ${p1.y}`;
  }

  // Area path for gradient fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingBottom} L ${points[0].x} ${svgHeight - paddingBottom} Z`;

  return (
    <div className="w-full relative select-none">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-slate-300">24-Hour Temperature Curve</h4>
        <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" /> Low: {minTemp}{units === 'imperial' ? '°F' : '°C'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> High: {maxTemp}{units === 'imperial' ? '°F' : '°C'}
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto scrollbar-none">
        <div className="min-w-[600px] sm:min-w-full">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-36 overflow-visible">
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Filled area */}
            <path d={areaD} fill="url(#tempGradient)" />

            {/* Main curve line */}
            <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

            {/* Data points & time labels */}
            {points.map((p, i) => {
              const isSelected = hoveredPoint?.data.time === p.data.time;
              const hourLabel = new Date(p.data.time).toLocaleTimeString([], { hour: 'numeric' });
              // Show every 3rd label or endpoints
              const showLabel = i % 3 === 0 || i === points.length - 1;

              return (
                <g key={i}>
                  {/* Point circle */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 6 : 3}
                    fill={isSelected ? '#facc15' : '#ffffff'}
                    stroke="#0284c7"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* Temperature label above point */}
                  {showLabel && (
                    <text
                      x={p.x}
                      y={p.y - 8}
                      textAnchor="middle"
                      className="text-[11px] font-bold fill-slate-200"
                    >
                      {p.data.temp}°
                    </text>
                  )}

                  {/* Time label below chart */}
                  {showLabel && (
                    <text
                      x={p.x}
                      y={svgHeight - 10}
                      textAnchor="middle"
                      className="text-[10px] font-medium fill-slate-400"
                    >
                      {hourLabel}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredPoint && (
        <div 
          className="absolute -top-10 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/20 text-xs shadow-xl text-center pointer-events-none transform -translate-x-1/2 z-20"
          style={{ left: `${(hoveredPoint.x / svgWidth) * 100}%` }}
        >
          <span className="font-bold text-amber-400">{hoveredPoint.data.temp}°</span>
          <span className="text-slate-300 ml-1">({hoveredPoint.data.condition?.label})</span>
          <span className="text-sky-300 ml-1.5">💧 {hoveredPoint.data.precipitationProb}%</span>
        </div>
      )}
    </div>
  );
}
