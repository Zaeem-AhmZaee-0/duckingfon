import React, { useState, useEffect } from 'react';
import { getCookieConsent, saveCookieConsent } from '../../services/storage';
import { ShieldCheck, Cookie } from 'lucide-react';

export default function CookieConsentBanner({ onOpenLegal }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      // Delay prompt slightly for polished first-time load
      const t = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAcceptAll = () => {
    saveCookieConsent({ functional: true, preferences: true, analytics: true, date: new Date().toISOString() });
    setShow(false);
  };

  const handleEssentialOnly = () => {
    saveCookieConsent({ functional: true, preferences: false, analytics: false, date: new Date().toISOString() });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
          <Cookie className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
            Privacy & Cookie Choices
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            We use local device storage only to remember your favorite cities, temperature units, and theme preferences. No invasive trackers.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition-all active:scale-95 shadow-md shadow-sky-500/20"
            >
              Accept Preferences
            </button>
            <button
              onClick={handleEssentialOnly}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-white/10 transition-colors"
            >
              Essential Only
            </button>
          </div>

          <button
            onClick={() => onOpenLegal('cookies')}
            className="text-[11px] text-sky-400 hover:underline mt-2.5 block"
          >
            Learn more in our Cookie Policy
          </button>
        </div>
      </div>
    </div>
  );
}
