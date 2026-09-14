import React from 'react';
import { useWeather } from '../../context/WeatherContext';

export default function PrecipitationBarChart() {
  const { weatherData } = useWeather();
  const hourly = weatherData?.hourly?.slice(0, 16) || [];

  if (hourly.length === 0) return null;

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-slate-300">Precipitation Probability (Next 16h)</h4>
        <span className="text-xs text-sky-400 font-medium">💧 Rain / Snow Chance</span>
      </div>

      <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 items-end h-28 pt-2">
        {hourly.map((h, idx) => {
          const prob = h.precipitationProb || 0;
          const heightPercent = Math.max(8, prob);
          const timeStr = new Date(h.time).toLocaleTimeString([], { hour: 'numeric' });

          return (
            <div key={idx} className="flex flex-col items-center gap-1 group h-full justify-end">
              <span className="text-[9px] font-bold text-slate-400 group-hover:text-sky-300 transition-colors">
                {prob}%
              </span>

              <div className="w-full bg-slate-800/80 rounded-t-md overflow-hidden flex items-end h-16">
                <div 
                  className={`w-full transition-all duration-500 rounded-t-md ${
                    prob > 60 
                      ? 'bg-gradient-to-t from-sky-600 to-sky-400' 
                      : prob > 20 
                        ? 'bg-gradient-to-t from-sky-800 to-sky-500' 
                        : 'bg-slate-700/50'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              <span className="text-[9px] text-slate-500 font-mono">
                {timeStr}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
