import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Bookmark, X } from 'lucide-react';

export default function SavedLocationsBar() {
  const { savedLocations, currentLocation, loadWeather, removeSavedLocation } = useWeather();

  if (!savedLocations || savedLocations.length === 0) return null;

  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none my-3">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider flex-shrink-0 mr-1">
        <Bookmark className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Favorites:</span>
      </div>

      {savedLocations.map((loc, idx) => {
        const isActive = currentLocation?.name === loc.name;

        return (
          <div
            key={loc.id || `${loc.name}-${idx}`}
            className={`group flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              isActive
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-sm shadow-amber-400/10'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-white/5 hover:border-white/15'
            }`}
          >
            <button
              onClick={() => loadWeather(loc)}
              className="flex items-center gap-1"
            >
              <span>{loc.name}</span>
              {loc.countryCode && (
                <span className="text-[10px] text-slate-400 font-mono">({loc.countryCode})</span>
              )}
            </button>

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeSavedLocation(loc.name);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-opacity"
              title="Remove location"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
