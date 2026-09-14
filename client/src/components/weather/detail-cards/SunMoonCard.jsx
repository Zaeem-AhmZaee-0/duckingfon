import React from 'react';
import { Sunrise, Sunset, Moon } from 'lucide-react';
import { useWeather } from '../../../context/WeatherContext';

export default function SunMoonCard() {
  const { weatherData } = useWeather();
  const astronomy = weatherData?.astronomy;
  const current = weatherData?.current;

  if (!astronomy) return null;

  const sunriseStr = astronomy.sunrise 
    ? new Date(astronomy.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : '--:--';
  const sunsetStr = astronomy.sunset 
    ? new Date(astronomy.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : '--:--';

  const moon = astronomy.moon || { name: 'Full Moon', illumination: 100, fraction: 0.5 };

  // Calculate sun progress percent between sunrise and sunset
  let sunProgress = 50;
  if (astronomy.sunrise && astronomy.sunset && current?.time) {
    const rise = new Date(astronomy.sunrise).getTime();
    const set = new Date(astronomy.sunset).getTime();
    const now = new Date(current.time).getTime();
    if (now <= rise) sunProgress = 0;
    else if (now >= set) sunProgress = 100;
    else sunProgress = Math.round(((now - rise) / (set - rise)) * 100);
  }

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
        <div className="flex items-center gap-1.5">
          <Sunrise className="w-4 h-4 text-amber-400" />
          <span>Sun & Moon Cycle</span>
        </div>
        <span className="font-semibold text-sky-400">{current?.isDay ? 'Daytime' : 'Nighttime'}</span>
      </div>

      {/* Sun Arc Visualization */}
      <div className="relative w-full h-24 my-2 flex flex-col items-center justify-end overflow-hidden">
        {/* Semi-circle arc line */}
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
          {/* Progress colored arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray="250"
            strokeDashoffset={250 - (250 * (sunProgress / 100))}
            strokeLinecap="round"
          />
          {/* Sun indicator circle along arc */}
          {(() => {
            const angle = Math.PI - (sunProgress / 100) * Math.PI;
            const cx = 100 + 80 * Math.cos(angle);
            const cy = 90 - 80 * Math.sin(angle);
            return (
              <circle
                cx={cx}
                cy={cy}
                r="6"
                fill="#fde047"
                stroke="#d97706"
                strokeWidth="2"
                className="filter drop-shadow-md"
              />
            );
          })()}
        </svg>

        {/* Sunrise and Sunset times */}
        <div className="w-full flex items-center justify-between px-2 -mt-2 z-10">
          <div className="flex items-center gap-1 text-xs text-slate-300">
            <Sunrise className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{sunriseStr}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-300">
            <Sunset className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-semibold">{sunsetStr}</span>
          </div>
        </div>
      </div>

      {/* Moon Phase Details */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-sky-300 shadow-inner">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-200 font-semibold block">{moon.name}</span>
            <span className="text-[10px] text-slate-400">Illumination: {moon.illumination}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
