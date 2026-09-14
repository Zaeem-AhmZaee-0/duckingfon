import React from 'react';
import { useWeather } from '../../context/WeatherContext';

export default function Mascot2DFallback({ className = '' }) {
  const { weatherState } = useWeather();
  const mascotState = weatherState?.mascot || {};
  const accessories = mascotState.accessories || {};

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className="w-64 h-64 relative flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="svgDuckBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <linearGradient id="svgBeak" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>

          {/* Torso */}
          <ellipse cx="100" cy="130" rx="45" ry="38" fill="url(#svgDuckBody)" />
          <ellipse cx="100" cy="135" rx="32" ry="24" fill="#fef9c3" />

          {/* Wings */}
          <path d="M58 120 C46 130 50 155 70 148 C78 145 84 132 80 120 Z" fill="#ca8a04" opacity="0.35" />
          <path d="M142 120 C154 130 150 155 130 148 C122 145 116 132 120 120 Z" fill="#ca8a04" opacity="0.35" />

          {/* Head */}
          <circle cx="100" cy="80" r="32" fill="url(#svgDuckBody)" />

          {/* Head Tuft */}
          <path d="M96 50 C92 38 104 36 102 50 C108 42 116 44 110 54 Z" fill="#eab308" />

          {/* Cheeks */}
          <circle cx="78" cy="88" r="6" fill="#f87171" opacity="0.6" />
          <circle cx="122" cy="88" r="6" fill="#f87171" opacity="0.6" />

          {/* Beak */}
          <path d="M85 86 C85 80 115 80 115 86 C115 98 85 98 85 86 Z" fill="url(#svgBeak)" />

          {/* Eyes */}
          <ellipse cx="88" cy="74" rx="6" ry="8" fill="#0f172a" />
          <circle cx="90" cy="71" r="2.5" fill="#ffffff" />

          <ellipse cx="112" cy="74" rx="6" ry="8" fill="#0f172a" />
          <circle cx="114" cy="71" r="2.5" fill="#ffffff" />

          {/* Accessories Overlay */}
          {accessories.sunglasses && (
            <g>
              <rect x="74" y="66" width="22" height="15" rx="4" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
              <rect x="104" y="66" width="22" height="15" rx="4" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
              <line x1="96" y1="73" x2="104" y2="73" stroke="#f59e0b" strokeWidth="2" />
            </g>
          )}

          {accessories.umbrella && (
            <g transform="translate(130, 20)">
              <path d="M-30 40 A30 30 0 0 1 30 40 Z" fill="#10b981" />
              <line x1="0" y1="40" x2="0" y2="90" stroke="#78350f" strokeWidth="3" />
              <path d="M0 90 A6 6 0 0 1 -12 90" fill="none" stroke="#78350f" strokeWidth="3" />
            </g>
          )}

          {accessories.beanie && (
            <g>
              <path d="M70 65 A30 30 0 0 1 130 65 Z" fill="#ef4444" />
              <circle cx="100" cy="35" r="7" fill="#ffffff" />
            </g>
          )}

          {accessories.scarf && (
            <g>
              <rect x="72" y="102" width="56" height="12" rx="6" fill="#ef4444" />
              <rect x="110" y="110" width="12" height="24" rx="3" fill="#ef4444" />
            </g>
          )}
        </svg>
      </div>

      {mascotState?.dialogue && (
        <div className="relative -mt-2 max-w-xs px-4 py-2 rounded-2xl bg-slate-900/90 border border-white/10 text-center">
          <p className="text-xs sm:text-sm text-slate-200">"{mascotState.dialogue}"</p>
        </div>
      )}
    </div>
  );
}
