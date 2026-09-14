import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useTheme } from '../../context/ThemeContext';
import WeatherMascotCanvas from '../3d/WeatherMascotCanvas';
import Mascot2DFallback from '../3d/Mascot2DFallback';
import { MapPin, ArrowUp, ArrowDown, Calendar, Clock, Bookmark, BookmarkCheck } from 'lucide-react';

export default function CurrentWeatherHero() {
  const { weatherData, currentLocation, units, isSavedLocation, addSavedLocation, removeSavedLocation } = useWeather();
  const { reducedMotion } = useTheme();

  if (!weatherData || !weatherData.current) return null;

  const current = weatherData.current;
  const daily = weatherData.daily?.[0];
  const unitSymbol = weatherData.units?.temp || (units === 'imperial' ? '°F' : '°C');

  const isSaved = isSavedLocation(currentLocation);

  // Local time formatting using location timezone
  let localTimeString = '';
  let localDateString = '';
  try {
    const tz = weatherData.location?.timezone || 'UTC';
    const now = new Date();
    localTimeString = now.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
    localDateString = now.toLocaleDateString('en-US', { timeZone: tz, weekday: 'long', month: 'short', day: 'numeric' });
  } catch {
    localTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    localDateString = new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  }

  const handleToggleBookmark = () => {
    if (isSaved) {
      removeSavedLocation(currentLocation.name);
    } else {
      addSavedLocation(currentLocation);
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl">
      {/* Dynamic Background Glow Layer */}
      <div 
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: current.isDay ? '#38bdf8' : '#6366f1' }}
      />
      <div 
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: current.isDay ? '#fbbf24' : '#312e81' }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Info Column (7 cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          {/* Top Location & Time Bar */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold tracking-tight text-white">
                  {currentLocation?.name}
                </h1>
                {currentLocation?.country && (
                  <span className="text-sm font-semibold text-slate-400 hidden sm:inline-block">
                    • {currentLocation.country}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400 mt-1">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" /> {localDateString}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <Clock className="w-3.5 h-3.5" /> {localTimeString}
                </span>
              </div>
            </div>

            {/* Favorite Bookmark Button */}
            <button
              onClick={handleToggleBookmark}
              className={`p-2.5 rounded-2xl border transition-all active:scale-95 ${
                isSaved 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                  : 'bg-slate-800/60 hover:bg-slate-700 text-slate-400 border-white/5'
              }`}
              title={isSaved ? 'Remove from Saved Locations' : 'Save to Favorites'}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
          </div>

          {/* Temperature & Condition Main Display */}
          <div className="my-6">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                {current.temp}
              </span>
              <span className="text-3xl sm:text-4xl font-display font-bold text-sky-400">
                {unitSymbol}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="px-3.5 py-1 rounded-full text-sm font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/25">
                {current.condition}
              </span>

              <span className="text-sm text-slate-300">
                Feels like <strong className="text-white font-semibold">{current.feelsLike}{unitSymbol}</strong>
              </span>

              {daily && (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-800/40 px-3 py-1 rounded-xl border border-white/5">
                  <span className="flex items-center text-amber-400">
                    <ArrowUp className="w-3 h-3 mr-0.5" /> {daily.tempMax}°
                  </span>
                  <span className="flex items-center text-sky-400">
                    <ArrowDown className="w-3 h-3 mr-0.5" /> {daily.tempMin}°
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="text-center">
              <span className="text-[11px] text-slate-400 font-medium block">Precipitation</span>
              <span className="text-sm sm:text-base font-bold text-slate-200">
                {current.precipitation} {weatherData.units?.precip || 'mm'}
              </span>
            </div>
            <div className="text-center border-x border-white/5">
              <span className="text-[11px] text-slate-400 font-medium block">Wind</span>
              <span className="text-sm sm:text-base font-bold text-slate-200">
                {current.windSpeed} {weatherData.units?.wind || 'km/h'}
              </span>
            </div>
            <div className="text-center">
              <span className="text-[11px] text-slate-400 font-medium block">Humidity</span>
              <span className="text-sm sm:text-base font-bold text-slate-200">
                {current.humidity}%
              </span>
            </div>
          </div>
        </div>

        {/* Right 3D Mascot Column (5 cols on desktop) */}
        <div className="lg:col-span-5 flex items-center justify-center relative min-h-[280px]">
          {reducedMotion ? (
            <Mascot2DFallback />
          ) : (
            <WeatherMascotCanvas />
          )}
        </div>
      </div>
    </div>
  );
}
