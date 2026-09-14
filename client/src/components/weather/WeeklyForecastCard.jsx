import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Calendar, Droplet, Sun, Cloud, CloudRain, Snowflake, CloudLightning } from 'lucide-react';

function getWeatherIcon(category = '') {
  switch (category) {
    case 'clear':
      return <Sun className="w-5 h-5 text-amber-400" />;
    case 'partly_cloudy':
    case 'overcast':
      return <Cloud className="w-5 h-5 text-slate-300" />;
    case 'rain':
    case 'drizzle':
    case 'rain_showers':
      return <CloudRain className="w-5 h-5 text-sky-400" />;
    case 'snow':
    case 'heavy_snow':
      return <Snowflake className="w-5 h-5 text-sky-200" />;
    case 'thunderstorm':
    case 'severe_storm':
      return <CloudLightning className="w-5 h-5 text-amber-300" />;
    default:
      return <Sun className="w-5 h-5 text-amber-400" />;
  }
}

export default function WeeklyForecastCard() {
  const { weatherData } = useWeather();
  const daily = weatherData?.daily || [];

  if (daily.length === 0) return null;

  // Calculate overall min/max for horizontal temperature range bar
  const allMins = daily.map(d => d.tempMin);
  const allMaxs = daily.map(d => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const globalRange = Math.max(1, globalMax - globalMin);

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 w-full select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-400" />
          <h3 className="font-display font-semibold text-lg text-slate-100">7-Day Forecast</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Weekly Outlook</span>
      </div>

      <div className="flex flex-col divide-y divide-white/5">
        {daily.map((day, idx) => {
          const isToday = idx === 0;
          const dateObj = new Date(day.date);
          const dayName = isToday ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          // Calculate bar offsets
          const leftPercent = ((day.tempMin - globalMin) / globalRange) * 100;
          const widthPercent = Math.max(8, ((day.tempMax - day.tempMin) / globalRange) * 100);

          return (
            <div 
              key={idx} 
              className="py-3 flex items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
            >
              {/* Day & Date */}
              <div className="w-24 flex-shrink-0">
                <span className={`text-sm font-semibold block ${isToday ? 'text-sky-400' : 'text-slate-200'}`}>
                  {dayName}
                </span>
                <span className="text-[11px] text-slate-400">
                  {dateFormatted}
                </span>
              </div>

              {/* Weather Icon & Condition */}
              <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                {getWeatherIcon(day.condition?.category)}
                <span className="text-xs text-slate-300 font-medium truncate max-w-[110px] hidden sm:inline">
                  {day.condition?.label}
                </span>
                {day.precipitationProbMax > 20 && (
                  <span className="flex items-center gap-0.5 text-[11px] text-sky-400 font-semibold ml-auto sm:ml-0">
                    <Droplet className="w-3 h-3" />
                    {day.precipitationProbMax}%
                  </span>
                )}
              </div>

              {/* Temperature Range Bar */}
              <div className="flex items-center gap-2.5 flex-shrink-0 w-36 sm:w-48">
                <span className="text-xs font-bold text-slate-400 w-7 text-right">
                  {day.tempMin}°
                </span>

                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                  <div 
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-white w-7">
                  {day.tempMax}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
