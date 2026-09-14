import React from 'react';
import { Sun } from 'lucide-react';
import { useWeather } from '../../../context/WeatherContext';

function getUVStatus(uv) {
  if (uv <= 2) return { label: 'Low', color: '#10b981', advice: 'No protection required for most people.' };
  if (uv <= 5) return { label: 'Moderate', color: '#eab308', advice: 'Wear sunglasses and SPF 30+ outdoors.' };
  if (uv <= 7) return { label: 'High', color: '#f97316', advice: 'Protection required. Seek shade midday.' };
  if (uv <= 10) return { label: 'Very High', color: '#ef4444', advice: 'Extra protection needed. Limit sun 11-4.' };
  return { label: 'Extreme', color: '#9333ea', advice: 'Stay indoors or in dense shade!' };
}

export default function UVCard() {
  const { weatherData } = useWeather();
  const current = weatherData?.current;

  if (!current) return null;

  const uv = current.uvIndex ?? 0;
  const status = getUVStatus(uv);
  const percentage = Math.min(100, (uv / 12) * 100);

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
        <div className="flex items-center gap-1.5">
          <Sun className="w-4 h-4 text-amber-400" />
          <span>UV Index</span>
        </div>
        <span className="font-semibold" style={{ color: status.color }}>
          {status.label}
        </span>
      </div>

      <div className="my-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-display font-bold text-white">{uv}</span>
          <span className="text-sm font-semibold text-slate-400">/ 12</span>
        </div>

        {/* UV Meter Bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700"
            style={{ 
              width: `${Math.max(6, percentage)}%`,
              backgroundColor: status.color
            }}
          />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-300">
        <p>{status.advice}</p>
      </div>
    </div>
  );
}
