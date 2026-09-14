import React, { useState } from 'react';
import { X, Shield, FileText, Info, HelpCircle, Eye, Database } from 'lucide-react';

export default function LegalModal({ isOpen, onClose, initialTab = 'about' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  const tabs = [
    { id: 'about', label: 'About', icon: Info },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'attributions', label: 'Attributions', icon: Database }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦆</span>
            <h2 className="font-display font-bold text-lg text-white">DuckingFon Information Center</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-white/10 overflow-x-auto scrollbar-none bg-slate-950/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'text-sky-400 border-sky-400 bg-white/5'
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/[0.02]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm leading-relaxed text-slate-300">
          {activeTab === 'about' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display">About DuckingFon</h3>
              <p>
                DuckingFon was created to challenge the status quo of dry, number-heavy weather dashboards. 
                Instead of simply presenting tables of raw metrics, DuckingFon builds a living, breathing world 
                where weather state, temperature, time of day, and seasonal conditions directly influence 
                the environment, lighting, animations, and the behavior of our central 3D mascot, <strong>Fon</strong>.
              </p>
              <h4 className="font-semibold text-white mt-4">Technology Highlights</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong>Reactive 3D Mascot:</strong> Procedural Three.js character with real-time cursor tracking, blinking cycles, dynamic clothing swaps, and weather-aware poses.</li>
                <li><strong>Living Particle Engine:</strong> Hardware-accelerated shaders for volumetric rain streaks, snowflakes, lightning strobes, and starfields.</li>
                <li><strong>Zero-Asset Procedural Audio:</strong> Web Audio API pink-noise generators and bandpass filters synthesizing realistic rain, thunder, wind, and nocturnal soundscapes.</li>
                <li><strong>Worldwide Open-Meteo Core:</strong> High-resolution worldwide forecasts, air quality telemetry, solar/lunar astronomical positioning, and geocoding.</li>
                <li><strong>Interactive Global Radar:</strong> Real-time animated precipitation radar powered by RainViewer and Leaflet.</li>
              </ul>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5">
                  <h4 className="font-semibold text-white">How often is the weather data updated?</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Weather forecasts and current telemetry update every 10–15 minutes from global numerical weather prediction models including ECMWF, GFS, and DWD ICON.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5">
                  <h4 className="font-semibold text-white">Is an account required to use DuckingFon?</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    No! DuckingFon is completely free and accessible without an account. All your favorite locations and preferences are safely stored in your browser's local storage.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5">
                  <h4 className="font-semibold text-white">How does the 3D character respond to the cursor?</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Fon's eyes and head use mathematical spherical interpolation (lerp) to track the mouse coordinates across the screen with gentle spring damping, giving the mascot lifelike curiosity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display">Privacy Policy</h3>
              <p>
                At DuckingFon, privacy is not an afterthought; it is built into the fundamental architecture.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong>No Geolocation Tracking:</strong> When you request your current location, coordinates are processed in memory solely to query weather telemetry and are never logged or sold.</li>
                <li><strong>Local Storage Only:</strong> Saved locations, temperature unit preferences, and theme preferences reside entirely on your device.</li>
                <li><strong>No 3rd-Party Tracking Pixels:</strong> We do not run invasive behavioral advertising or fingerprinting trackers.</li>
              </ul>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display">Terms of Service</h3>
              <p>
                DuckingFon provides weather information for informational and entertainment purposes. While our data sources include high-grade meteorological models, forecasts are subject to natural variations. For life-safety decisions during severe weather emergencies, always refer to official civil defense and national meteorological alerts.
              </p>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display">Accessibility (WCAG 2.1 AA)</h3>
              <p>
                We believe immersive technology should be accessible to everyone:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong>Reduced Motion Mode:</strong> Honors OS settings and provides a manual toggle to disable intense 3D particle loops and camera shakes, replacing them with static 2D vector illustrations.</li>
                <li><strong>Keyboard Operability:</strong> Full Tab and Arrow-key navigation across the search autocomplete, unit toggles, and detail cards.</li>
                <li><strong>High Contrast Ratios:</strong> Carefully tuned typography exceeding 4.5:1 contrast standards for optimal readability in both light and dark modes.</li>
              </ul>
            </div>
          )}

          {activeTab === 'attributions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-display">Data & Open Source Attributions</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-300">
                <li><strong>Weather & Geocoding:</strong> Powered by <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="text-sky-400 underline">Open-Meteo</a> (CC BY 4.0).</li>
                <li><strong>Precipitation Radar:</strong> Real-time radar tiles provided by <a href="https://www.rainviewer.com" target="_blank" rel="noreferrer" className="text-sky-400 underline">RainViewer</a>.</li>
                <li><strong>Maps & Basemaps:</strong> © <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" className="text-sky-400 underline">OpenStreetMap</a> contributors, CARTO.</li>
                <li><strong>Icons:</strong> Lucide React open source icon family.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 flex justify-end bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
