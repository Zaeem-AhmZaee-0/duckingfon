import React, { useState, useEffect } from 'react';
import Logo from '../brand/Logo';

const LOADING_QUOTES = [
  "Fluffing up Fon's feathers...",
  "Calibrating barometer and cloud density...",
  "Tuning atmospheric radio frequencies...",
  "Gathering global satellite telemetry...",
  "Checking for puddle ripples and rainbows..."
];

export default function LoadingScreen() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % LOADING_QUOTES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 p-6 text-center select-none">
      {/* Background radial glow */}
      <div className="absolute w-96 h-96 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm">
        <Logo size="lg" showBadge={false} />

        {/* Animated Duck Floating */}
        <div className="my-8 relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-sky-500 p-0.5 shadow-xl shadow-amber-500/20 animate-bounce">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-4xl">
              🦆
            </div>
          </div>
          {/* Pulsing ring */}
          <div className="absolute -inset-2 rounded-3xl border border-sky-400/30 animate-ping pointer-events-none" />
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-sky-400 to-amber-400 rounded-full animate-pulse" />
        </div>

        <p className="text-xs sm:text-sm font-medium text-slate-400 h-6 transition-all duration-300">
          {LOADING_QUOTES[quoteIndex]}
        </p>
      </div>
    </div>
  );
}
