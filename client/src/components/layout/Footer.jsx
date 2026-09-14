import React from 'react';
import Logo from '../brand/Logo';
import { Heart, Globe2, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer({ onOpenLegal }) {
  return (
    <footer className="w-full mt-20 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Mascot Story */}
          <div className="md:col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
              DuckingFon is a worldwide living weather experience. Guided by our 3D mascot Fon, 
              the platform transforms cold meteorological numbers into dynamic reactive environments, 
              interactive radar, and atmospheric soundscapes.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Built with React, Three.js, Web Audio, and Express</span>
            </div>
          </div>

          {/* Col 2: Navigation & Experiences */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button 
                  onClick={() => onOpenLegal('about')} 
                  className="hover:text-white transition-colors"
                >
                  About DuckingFon
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegal('faq')} 
                  className="hover:text-white transition-colors"
                >
                  Weather FAQ & Methodology
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegal('accessibility')} 
                  className="hover:text-white transition-colors"
                >
                  Accessibility Statement
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegal('help')} 
                  className="hover:text-white transition-colors"
                >
                  Help & Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Privacy */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Legal & Data
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button 
                  onClick={() => onOpenLegal('privacy')} 
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegal('terms')} 
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegal('cookies')} 
                  className="hover:text-white transition-colors"
                >
                  Cookie Preferences
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegal('attributions')} 
                  className="hover:text-white transition-colors"
                >
                  Data Attributions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Attributions */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} DuckingFon Atmospheric Platform. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-sky-400" /> Powered by Open-Meteo & RainViewer
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Privacy-First Design
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
