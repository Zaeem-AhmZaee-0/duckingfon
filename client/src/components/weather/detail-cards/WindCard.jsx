import React from 'react';
import { Wind, Compass } from 'lucide-react';
import { useWeather } from '../../../context/WeatherContext';

function getBeaufortScale(kmh) {
  if (kmh < 2) return 'Calm';
  if (kmh < 12) return 'Light Breeze';
  if (kmh < 29) return 'Moderate Breeze';
  if (kmh < 39) return 'Fresh Breeze';
  if (kmh < 50) return 'Strong Breeze';
  if (kmh < 62) return 'High Wind / Near Gale';
  if (kmh < 75) return 'Gale Force';
  return 'Severe Storm Winds';
}

function getCompassDirection(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export default function WindCard() {
  const { weatherData, units } = useWeather();
  const current = weatherData?.current;

  if (!current) return null;

  const speed = current.windSpeed ?? 0;
  const gusts = current.windGusts ?? speed;
  const direction = current.windDirection ?? 0;
  const speedUnit = units === 'imperial' ? 'mph' : 'km/h';
  const speedInKmh = units === 'imperial' ? speed * 1.60934 : speed;
  const scaleDescription = getBeaufortScale(speedInKmh);
  const compassDir = getCompassDirection(direction);

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
        <div className="flex items-center gap-1.5">
          <Wind className="w-4 h-4 text-sky-400" />
          <span>Wind & Gusts</span>
        </div>
        <span className="font-semibold text-slate-300">{compassDir}</span>
      </div>

      <div className="flex items-center justify-between my-2">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-display font-bold text-white">{speed}</span>
            <span className="text-sm font-semibold text-slate-400">{speedUnit}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gusts up to <span className="font-semibold text-slate-200">{gusts} {speedUnit}</span>
          </p>
        </div>

        {/* Animated Compass Rose */}
        <div className="relative w-16 h-16 rounded-full border border-white/15 bg-slate-900/60 flex items-center justify-center shadow-inner">
          <span className="absolute top-1 text-[8px] font-bold text-slate-400">N</span>
          <span className="absolute bottom-1 text-[8px] font-bold text-slate-500">S</span>
          <span className="absolute left-1.5 text-[8px] font-bold text-slate-500">W</span>
          <span className="absolute right-1.5 text-[8px] font-bold text-slate-500">E</span>
          
          {/* Rotating Arrow */}
          <div 
            className="w-8 h-8 flex items-center justify-center transition-transform duration-700 ease-out"
            style={{ transform: `rotate(${direction}deg)` }}
          >
            <div className="w-1.5 h-6 bg-gradient-to-t from-sky-400 to-rose-500 rounded-full shadow-md" />
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-300">
        Status: <span className="font-semibold text-sky-400">{scaleDescription}</span>
      </div>
    </div>
  );
}
