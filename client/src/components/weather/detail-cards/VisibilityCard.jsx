import React from 'react';
import { Eye } from 'lucide-react';
import { useWeather } from '../../../context/WeatherContext';

function getVisibilityStatus(km) {
  if (km >= 10) return { label: 'Crystal Clear', desc: 'Perfect atmospheric visibility.' };
  if (km >= 6) return { label: 'Good', desc: 'Normal clear visibility.' };
  if (km >= 3) return { label: 'Moderate', desc: 'Mild haze or mist present.' };
  if (km >= 1) return { label: 'Poor', desc: 'Reduced visibility due to mist or drizzle.' };
  return { label: 'Dense Fog', desc: 'Extremely restricted visibility. Caution advised.' };
}

export default function VisibilityCard() {
  const { weatherData, units } = useWeather();
  const current = weatherData?.current;

  if (!current) return null;

  const km = current.visibilityKm ?? 10;
  const isImperial = units === 'imperial';
  const displayVal = isImperial ? (km * 0.621371).toFixed(1) : km;
  const displayUnit = isImperial ? 'mi' : 'km';
  const status = getVisibilityStatus(km);

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
        <div className="flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-sky-400" />
          <span>Visibility</span>
        </div>
        <span className="font-semibold text-slate-300">{status.label}</span>
      </div>

      <div className="my-2">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl sm:text-4xl font-display font-bold text-white">{displayVal}</span>
          <span className="text-base font-bold text-slate-400">{displayUnit}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-300">
        <p>{status.desc}</p>
      </div>
    </div>
  );
}
