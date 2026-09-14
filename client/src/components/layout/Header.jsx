import React, { useState } from 'react';
import Logo from '../brand/Logo';
import SearchBar from '../search/SearchBar';
import { useWeather } from '../../context/WeatherContext';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { Sun, Moon, Volume2, VolumeX, RefreshCw, User, Sliders } from 'lucide-react';

export default function Header({ onOpenAuth, onOpenSettings }) {
  const { units, toggleUnits, refreshWeather, isLoading } = useWeather();
  const { isDark, toggleTheme, reducedMotion, toggleReducedMotion } = useTheme();
  const { isMuted, toggleMute, volume, setVolume } = useAudio();
  const [showVolumePopup, setShowVolumePopup] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/70 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo size="md" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

        {/* Center Search Bar */}
        <div className="hidden md:flex flex-1 justify-center max-w-md">
          <SearchBar />
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Refresh weather button */}
          <button
            onClick={refreshWeather}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/5 transition-all active:scale-95 disabled:opacity-50"
            title="Refresh weather data"
            aria-label="Refresh weather data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Unit Toggle (°C / °F) */}
          <button
            onClick={toggleUnits}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/5 font-display font-bold text-xs transition-all active:scale-95"
            title={`Switch to ${units === 'metric' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}`}
            aria-label="Toggle temperature unit"
          >
            <span className={units === 'metric' ? 'text-sky-400 font-extrabold' : 'text-slate-400'}>°C</span>
            <span className="mx-1 text-slate-500">/</span>
            <span className={units === 'imperial' ? 'text-amber-400 font-extrabold' : 'text-slate-400'}>°F</span>
          </button>

          {/* Ambient Soundscape Controller */}
          <div className="relative">
            <button
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumePopup(true)}
              className={`p-2 rounded-xl border transition-all active:scale-95 ${
                !isMuted 
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-sm shadow-sky-500/20' 
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-white/5'
              }`}
              title={isMuted ? 'Unmute procedural atmospheric soundscape' : 'Mute sound'}
              aria-label="Toggle atmospheric sound"
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Volume popup slider */}
            {showVolumePopup && !isMuted && (
              <div 
                onMouseLeave={() => setShowVolumePopup(false)}
                className="absolute top-full right-0 mt-2 p-3 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl z-50 flex items-center gap-2 w-36"
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>
            )}
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/5 transition-all active:scale-95"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>

          {/* User Account / Profile */}
          <button
            onClick={onOpenAuth}
            className="p-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white shadow-md shadow-sky-500/20 transition-all active:scale-95"
            title="User Profile & Preferences"
            aria-label="User Account"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>
    </header>
  );
}
