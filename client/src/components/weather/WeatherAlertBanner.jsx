import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldAlert, X } from 'lucide-react';

export default function WeatherAlertBanner() {
  const { weatherData } = useWeather();
  const alerts = weatherData?.alerts || [];
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [dismissed, setDismissed] = useState({});

  if (alerts.length === 0) return null;

  const activeAlerts = alerts.filter(a => !dismissed[a.id]);
  if (activeAlerts.length === 0) return null;

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'extreme':
        return { bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300', badge: 'bg-rose-500 text-white' };
      case 'severe':
        return { bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300', badge: 'bg-amber-500 text-slate-950 font-bold' };
      default:
        return { bg: 'bg-sky-500/15 border-sky-500/30 text-sky-300', badge: 'bg-sky-500 text-white' };
    }
  };

  return (
    <div className="w-full flex flex-col gap-2.5 mb-6" role="alert">
      {activeAlerts.map((alert) => {
        const style = getSeverityStyle(alert.severity);
        const isExpanded = expandedAlert === alert.id;

        return (
          <div
            key={alert.id}
            className={`rounded-2xl p-4 border backdrop-blur-md transition-all ${style.bg}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce" />
                <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-extrabold tracking-wider ${style.badge}`}>
                  {alert.severity}
                </span>
                <h4 className="font-display font-bold text-sm sm:text-base text-white">
                  {alert.headline}
                </h4>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
                  title={isExpanded ? 'Collapse' : 'Expand details'}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setDismissed(prev => ({ ...prev, [alert.id]: true }))}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Collapsible description and safety instruction */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-200 leading-relaxed">
                <p className="mb-2">{alert.description}</p>
                {alert.instruction && (
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 mt-2 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">Recommended Action:</strong>
                      <span className="text-slate-300">{alert.instruction}</span>
                    </div>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 mt-2 block">
                  Issued by: {alert.source}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
