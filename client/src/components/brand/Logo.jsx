import React from 'react';

export default function Logo({ size = 'md', showBadge = true, onClick }) {
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 'w-14 h-14', text: 'text-4xl', badge: 'text-xs px-2.5 py-1' }
  }[size] || { icon: 'w-9 h-9', text: 'text-2xl', badge: 'text-[10px] px-2 py-0.5' };

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer group' : ''}`}
      role="banner"
    >
      {/* 3D-styled Mascot Logo Avatar */}
      <div className={`relative ${sizeClasses.icon} flex-shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-sky-600 shadow-md shadow-amber-500/20" />
        <svg 
          viewBox="0 0 100 100" 
          className="relative w-full h-full p-1 drop-shadow" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cloud behind */}
          <path d="M20 40 A10 10 0 0 1 36 32 A14 14 0 0 1 54 38 A10 10 0 0 1 60 48 L20 48 Z" fill="rgba(255,255,255,0.4)"/>
          {/* Duck body */}
          <ellipse cx="50" cy="65" rx="22" ry="18" fill="#facc15" />
          <path d="M40 60 C35 65 37 75 47 73 C52 71 55 65 52 60 Z" fill="#ca8a04" opacity="0.4" />
          {/* Duck head */}
          <circle cx="50" cy="42" r="16" fill="#fde047" />
          {/* Tuft */}
          <path d="M47 26 C45 20 52 19 51 26 C54 21 59 22 55 28 Z" fill="#eab308" />
          {/* Cheeks */}
          <circle cx="39" cy="45" r="3" fill="#f87171" opacity="0.6"/>
          <circle cx="61" cy="45" r="3" fill="#f87171" opacity="0.6"/>
          {/* Eyes */}
          <ellipse cx="44" cy="40" rx="3" ry="4" fill="#0f172a" />
          <circle cx="45" cy="38.5" r="1.2" fill="#ffffff" />
          <ellipse cx="56" cy="40" rx="3" ry="4" fill="#0f172a" />
          <circle cx="57" cy="38.5" r="1.2" fill="#ffffff" />
          {/* Beak */}
          <path d="M43 45 C43 42 57 42 57 45 C57 51 43 51 43 45 Z" fill="#f97316" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-display font-extrabold tracking-tight ${sizeClasses.text} bg-gradient-to-r from-amber-400 via-amber-200 to-sky-400 bg-clip-text text-transparent`}>
            DuckingFon
          </span>
          {showBadge && (
            <span className={`rounded-full font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 ${sizeClasses.badge}`}>
              Atmosphere
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
