import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Clock, Droplet, Wind, Sun, Cloud, CloudRain, Snowflake, CloudLightning, Moon } from 'lucide-react';

function getWeatherIcon(category = '', isDay = true) {
  switch (category) {
    case 'clear':
      return isDay ? <Sun className="w-6 h-6 text-amber-400" /> : <Moon className="w-6 h-6 text-sky-300" />;
    case 'partly_cloudy':
    case 'overcast':
      return <Cloud className="w-6 h-6 text-slate-300" />;
    case 'rain':
    case 'drizzle':
    case 'rain_showers':
      return <CloudRain className="w-6 h-6 text-sky-400" />;
    case 'snow':
    case 'heavy_snow':
      return <Snowflake className="w-6 h-6 text-sky-200" />;
    case 'thunderstorm':
    case 'severe_storm':
      return <CloudLightning className="w-6 h-6 text-amber-300" />;
    default:
      return <Sun className="w-6 h-6 text-amber-400" />;
  }
}

export default function HourlyForecastSlider() {
  const { weatherData, units } = useWeather();
  const hourly = weatherData?.hourly || [];

  if (hourly.length === 0) return null;

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 w-full select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <h3 className="font-display font-semibold text-lg text-slate-100">Hourly Forecast</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Next 48 Hours</span>
      </div>

      {/* Horizontal Scrollable Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {hourly.map((item, idx) => {
          const isNow = idx === 0;
          const time = new Date(item.time);
          const hourStr = isNow ? 'Now' : time.toLocaleTimeString([], { hour: 'numeric' });
          const isNight = !item.isDay;

          return (
            <div
              key={idx}
              className={`flex-shrink-0 flex flex-col items-center justify-between w-20 py-3.5 px-2 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
                isNow
                  ? 'bg-sky-500/20 border-sky-400/40 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-900/60 border-white/5 hover:border-white/15'
              }`}
            >
              {/* Hour */}
              <span className={`text-xs font-semibold ${isNow ? 'text-sky-300 font-bold' : 'text-slate-400'}`}>
                {hourStr}
              </span>

              {/* Weather Icon */}
              <div className="my-3">
                {getWeatherIcon(item.condition?.category, item.isDay)}
              </div>

              {/* Temperature */}
              <span className="text-base font-display font-bold text-white mb-2">
                {item.temp}°
              </span>

              {/* Precipitation Chance */}
              <div className="flex items-center gap-0.5 text-[11px] font-medium text-sky-400">
                <Droplet className="w-3 h-3" />
                <span>{item.precipitationProb}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
