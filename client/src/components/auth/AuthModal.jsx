import React, { useState, useEffect } from 'react';
import { X, User, LogOut, Check, Sparkles, Sliders, Shield, Cloud } from 'lucide-react';
import { getAuthUser, saveAuthUser } from '../../services/storage';
import { loginUser } from '../../services/api';
import { useWeather } from '../../context/WeatherContext';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';

export default function AuthModal({ isOpen, onClose }) {
  const [user, setUser] = useState(getAuthUser);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const { units, toggleUnits, savedLocations } = useWeather();
  const { reducedMotion, toggleReducedMotion } = useTheme();
  const { isMuted, toggleMute } = useAudio();

  useEffect(() => {
    setUser(getAuthUser());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setFeedback('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setFeedback('');

    try {
      const res = await loginUser(emailInput);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        saveAuthUser(res.data.user);
        setFeedback('Welcome aboard! Preferences synced.');
      }
    } catch (err) {
      setFeedback('Sign in simulation succeeded locally.');
      const localUser = { email: emailInput, name: emailInput.split('@')[0], avatar: '🦆' };
      setUser(localUser);
      saveAuthUser(localUser);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    saveAuthUser(null);
    setFeedback('Signed out successfully.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-sky-400" />
            <h2 className="font-display font-bold text-lg text-white">
              {user ? 'Account & Preferences' : 'Sign In to DuckingFon'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* User Profile Banner if Logged in */}
          {user ? (
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-2xl">
                  {user.avatar || '🦆'}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{user.name || 'Fon Explorer'}</h3>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-700/60 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Sign in with your email to sync your saved cities and weather settings across devices. No password required for demo access!
              </p>
              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-semibold text-sm shadow-md shadow-sky-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Signing in...' : 'Continue as Guest / Explorer'}</span>
                </button>
              </form>
            </div>
          )}

          {feedback && (
            <p className="text-xs text-emerald-400 text-center font-medium bg-emerald-500/10 py-1.5 rounded-xl border border-emerald-500/20">
              {feedback}
            </p>
          )}

          {/* User Preferences Section */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Personal Preferences</span>
            </h4>

            {/* Temperature Unit Preference */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-white/5">
              <div>
                <span className="text-sm font-medium text-white block">Temperature Units</span>
                <span className="text-xs text-slate-400">Currently: {units === 'metric' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}</span>
              </div>
              <button
                onClick={toggleUnits}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-colors"
              >
                Switch to {units === 'metric' ? '°F' : '°C'}
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-white/5">
              <div>
                <span className="text-sm font-medium text-white block">Reduced Motion Mode</span>
                <span className="text-xs text-slate-400">Replaces 3D physics with static 2D vector</span>
              </div>
              <button
                onClick={toggleReducedMotion}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  reducedMotion 
                    ? 'bg-amber-500 text-slate-950' 
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {reducedMotion ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Ambient Soundscape Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-white/5">
              <div>
                <span className="text-sm font-medium text-white block">Atmospheric Soundscape</span>
                <span className="text-xs text-slate-400">Synthesized rain, wind, and thunder</span>
              </div>
              <button
                onClick={toggleMute}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  !isMuted 
                    ? 'bg-sky-500 text-white' 
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {!isMuted ? 'Playing' : 'Muted'}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 flex justify-end bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
