import React from 'react';
import { Activity } from 'lucide-react';
import { useWeather } from '../../../context/WeatherContext';

export default function AirQualityCard() {
  const { weatherData } = useWeather();
  const aqi = weatherData?.airQuality;

  if (!aqi || aqi.usAqi === null) {
    return (
      <div className="glass-panel rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Air Quality Index</span>
        </div>
        <p className="text-xs text-slate-400 py-4">Air quality telemetry is currently unavailable for this specific region.</p>
      </div>
    );
  }

  const score = aqi.usAqi;
  const label = aqi.label || 'Good';
  const color = aqi.color || '#10b981';

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Air Quality (US-AQI)</span>
        </div>
        <span className="font-semibold" style={{ color }}>{label}</span>
      </div>

      <div className="my-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-display font-bold text-white">{score}</span>
          <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}25`, color }}>
            {label}
          </span>
        </div>

        {/* Pollutants mini breakdown */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/5">
          {aqi.pm2_5 !== null && (
            <div>
              <span className="text-[10px] text-slate-400 block">PM2.5</span>
              <span className="text-xs font-bold text-slate-200">{aqi.pm2_5} <span className="text-[9px] font-normal text-slate-500">µg/m³</span></span>
            </div>
          )}
          {aqi.pm10 !== null && (
            <div>
              <span className="text-[10px] text-slate-400 block">PM10</span>
              <span className="text-xs font-bold text-slate-200">{aqi.pm10} <span className="text-[9px] font-normal text-slate-500">µg/m³</span></span>
            </div>
          )}
          {aqi.ozone !== null && (
            <div>
              <span className="text-[10px] text-slate-400 block">Ozone</span>
              <span className="text-xs font-bold text-slate-200">{aqi.ozone} <span className="text-[9px] font-normal text-slate-500">µg/m³</span></span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-300">
        <p>{aqi.description}</p>
      </div>
    </div>
  );
}
