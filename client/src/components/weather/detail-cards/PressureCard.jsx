import React from 'react';
import { Gauge } from 'lucide-react';
import { useWeather } from '../../../context/WeatherContext';

function getPressureStatus(hPa) {
  if (hPa > 1022) return { label: 'High Pressure', desc: 'Clear, stable atmospheric conditions.' };
  if (hPa >= 1008) return { label: 'Normal Pressure', desc: 'Typical barometric conditions.' };
  return { label: 'Low Pressure', desc: 'Unsettled, precipitation likely.' };
}

export default function PressureCard() {
  const { weatherData, units } = useWeather();
  const current = weatherData?.current;

  if (!current) return null;

  const hPa = current.pressure ?? 1013;
  const isImperial = units === 'imperial';
  const displayVal = isImperial ? (hPa * 0.02953).toFixed(2) : hPa;
  const displayUnit = isImperial ? 'inHg' : 'hPa';
  const status = getPressureStatus(hPa);

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
        <div className="flex items-center gap-1.5">
          <Gauge className="w-4 h-4 text-sky-400" />
          <span>Barometric Pressure</span>
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
