import React from 'react';
import { Droplets } from 'lucide-react';
import { useWeather } from '../../../context/WeatherContext';

function getHumidityDescription(h) {
  if (h < 30) return 'Very Dry — Consider moisturizing';
  if (h <= 55) return 'Comfortable & Optimal';
  if (h <= 70) return 'Noticeably Humid';
  return 'Very Muggy / High Moisture';
}

export default function HumidityCard() {
  const { weatherData, units } = useWeather();
  const current = weatherData?.current;
  const hourly = weatherData?.hourly?.[0];

  if (!current) return null;

  const humidity = current.humidity ?? 0;
  const desc = getHumidityDescription(humidity);
  const dewPoint = hourly?.feelsLike ?? (current.temp - (100 - humidity) / 5);

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
        <div className="flex items-center gap-1.5">
          <Droplets className="w-4 h-4 text-sky-400" />
          <span>Humidity</span>
        </div>
        <span className="font-semibold text-sky-400">{humidity}%</span>
      </div>

      <div className="my-2">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl sm:text-4xl font-display font-bold text-white">{humidity}</span>
          <span className="text-lg font-bold text-slate-400">%</span>
        </div>

        {/* Progress gauge bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(5, humidity))}%` }}
          />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-300">
        <p>{desc}</p>
      </div>
    </div>
  );
}
