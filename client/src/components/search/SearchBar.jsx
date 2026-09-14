import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Navigation } from 'lucide-react';
import { searchLocations } from '../../services/api';
import { useWeather } from '../../context/WeatherContext';

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { loadWeather, detectUserLocation, isLoading } = useWeather();
  const searchTimeout = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchLocations(query);
        setResults(data);
        setIsOpen(data.length > 0);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(searchTimeout.current);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc) => {
    loadWeather({
      name: loc.name,
      latitude: loc.latitude,
      longitude: loc.longitude,
      country: loc.country,
      countryCode: loc.countryCode,
      admin1: loc.admin1
    });
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative w-full max-w-md ${className}`}>
      <div className="relative flex items-center">
        {/* Search Icon / Spinner */}
        <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search any worldwide city or country..."
          className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-slate-800/75 dark:bg-slate-900/80 backdrop-blur-md border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400/50 shadow-lg shadow-black/20 transition-all"
          aria-label="Search city or location"
        />

        {/* Action Controls Right: Clear & Current Location */}
        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={detectUserLocation}
            disabled={isLoading}
            className="p-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 transition-all active:scale-95 disabled:opacity-50"
            title="Use Current Device Location"
            aria-label="Use current location"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLoading ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl overflow-hidden z-50 divide-y divide-white/5 max-h-72 overflow-y-auto">
          {results.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={item.id || idx}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full px-4 py-2.5 text-left flex items-center justify-between text-sm transition-colors ${
                  isSelected ? 'bg-sky-500/20 text-white' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                  <div>
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="text-xs text-slate-400 ml-1.5">
                      {[item.admin1, item.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>

                {item.countryCode && (
                  <span className="text-xs font-mono font-semibold text-slate-400 px-1.5 py-0.5 rounded bg-white/5">
                    {item.countryCode}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
