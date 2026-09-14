import React from 'react';
import { AlertCircle, RotateCcw, Home, MapPin } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export default function ErrorState({ message, onRetry }) {
  const { loadWeather } = useWeather();

  const handleDefaultLocation = () => {
    loadWeather({
      name: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      country: 'United Kingdom',
      countryCode: 'GB'
    });
  };

  return (
    <div className="w-full my-8 p-8 rounded-3xl glass-panel border border-rose-500/20 text-center flex flex-col items-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-3xl mb-4">
        🦆
      </div>

      <div className="flex items-center gap-2 text-rose-400 font-display font-bold text-lg mb-2">
        <AlertCircle className="w-5 h-5" />
        <h3>Atmospheric Disruption</h3>
      </div>

      <p className="text-sm text-slate-300 mb-6 leading-relaxed">
        {message || "We couldn't connect to the meteorological satellite telemetry. Fon is checking the radar antennas!"}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-sky-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}

        <button
          onClick={handleDefaultLocation}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors"
        >
          <MapPin className="w-4 h-4 text-amber-400" />
          <span>Load London Forecast</span>
        </button>
      </div>
    </div>
  );
}
