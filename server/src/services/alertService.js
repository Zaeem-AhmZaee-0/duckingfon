/**
 * Generates meteorological alerts based on weather criteria and thresholds
 */
export function evaluateWeatherAlerts(weatherData) {
  const alerts = [];
  if (!weatherData || !weatherData.current) return alerts;

  const { current, daily, airQuality } = weatherData;
  const isImperial = weatherData.units?.system === 'imperial';
  const tempC = isImperial ? (current.temp - 32) * 5 / 9 : current.temp;
  const windKmh = isImperial ? current.windSpeed * 1.60934 : current.windSpeed;
  const gustKmh = isImperial ? current.windGusts * 1.60934 : current.windGusts;

  // 1. Extreme Heat Alert
  if (tempC >= 38) {
    alerts.push({
      id: 'heat_extreme',
      severity: 'extreme',
      headline: 'Extreme Heat Warning',
      description: `Dangerous heat conditions observed at ${current.temp}${weatherData.units.temp} (feels like ${current.feelsLike}${weatherData.units.temp}). Limit outdoor exposure and stay hydrated.`,
      source: 'DuckingFon Meteorological Engine',
      instruction: 'Stay in air-conditioned environments and drink plenty of fluids.'
    });
  } else if (tempC >= 33) {
    alerts.push({
      id: 'heat_advisory',
      severity: 'moderate',
      headline: 'Heat Advisory',
      description: `Uncomfortably high temperatures reaching ${current.temp}${weatherData.units.temp}. Take precautions during peak afternoon hours.`,
      source: 'DuckingFon Meteorological Engine',
      instruction: 'Wear light clothing and avoid strenuous outdoor exercise.'
    });
  }

  // 2. Severe Freeze / Cold Alert
  if (tempC <= -15) {
    alerts.push({
      id: 'cold_extreme',
      severity: 'extreme',
      headline: 'Extreme Wind Chill Warning',
      description: `Bitter freezing temperatures of ${current.temp}${weatherData.units.temp}. Frostbite risk is elevated within minutes.`,
      source: 'DuckingFon Meteorological Engine',
      instruction: 'Dress in thermal layers and minimize exposed skin.'
    });
  } else if (tempC <= 0) {
    alerts.push({
      id: 'freeze_advisory',
      severity: 'minor',
      headline: 'Frost / Freeze Advisory',
      description: `Sub-freezing temperatures expected. Watch for icy road patches and protect sensitive outdoor plants.`,
      source: 'DuckingFon Meteorological Engine',
      instruction: 'Drive with caution and check tire pressure.'
    });
  }

  // 3. Thunderstorm / Severe Storm
  if ([95, 96, 99].includes(current.weatherCode)) {
    const isSevere = [96, 99].includes(current.weatherCode);
    alerts.push({
      id: 'storm_warning',
      severity: isSevere ? 'extreme' : 'severe',
      headline: isSevere ? 'Severe Thunderstorm & Hail Warning' : 'Thunderstorm Alert',
      description: `Active thunderstorm conditions with lightning strikes and potential hail observed in the vicinity.`,
      source: 'DuckingFon Radar Watch',
      instruction: 'Seek indoor shelter immediately. Stay clear of tall trees and open bodies of water.'
    });
  }

  // 4. High Wind Warning
  if (gustKmh >= 70 || windKmh >= 50) {
    alerts.push({
      id: 'wind_high',
      severity: 'severe',
      headline: 'High Wind Warning',
      description: `Damaging wind gusts of up to ${current.windGusts} ${weatherData.units.wind} recorded. Loose outdoor objects may become airborne.`,
      source: 'DuckingFon Meteorological Engine',
      instruction: 'Secure outdoor furniture and exercise caution while driving high-profile vehicles.'
    });
  } else if (windKmh >= 35) {
    alerts.push({
      id: 'wind_advisory',
      severity: 'minor',
      headline: 'Wind Advisory',
      description: `Breezy to gusty conditions with winds around ${current.windSpeed} ${weatherData.units.wind}.`,
      source: 'DuckingFon Meteorological Engine',
      instruction: 'Keep both hands on the wheel when driving in open areas.'
    });
  }

  // 5. Heavy Snow / Blizzard
  if ([75, 86].includes(current.weatherCode)) {
    alerts.push({
      id: 'snow_heavy',
      severity: 'severe',
      headline: 'Heavy Snow Warning',
      description: `Heavy snowfall impacting local transit and visibility. Accumulation expected.`,
      source: 'DuckingFon Meteorological Engine',
      instruction: 'Avoid non-essential travel and keep winter emergency kits accessible.'
    });
  }

  // 6. Extreme UV Radiation
  if (current.uvIndex >= 10) {
    alerts.push({
      id: 'uv_extreme',
      severity: 'severe',
      headline: 'Extreme UV Index Alert',
      description: `UV Index is currently ${current.uvIndex} (Extreme). Unprotected skin can burn rapidly.`,
      source: 'DuckingFon Atmospheric Monitor',
      instruction: 'Wear SPF 50+ sunscreen, sunglasses, and protective hat between 10 AM and 4 PM.'
    });
  }

  // 7. Dangerous Air Quality
  if (airQuality?.usAqi && airQuality.usAqi > 150) {
    alerts.push({
      id: 'air_unhealthy',
      severity: airQuality.usAqi > 200 ? 'extreme' : 'severe',
      headline: `Air Quality Alert (${airQuality.label})`,
      description: `US-AQI is currently ${airQuality.usAqi}. Particulate matter concentrations are elevated.`,
      source: 'DuckingFon Air Quality Index',
      instruction: 'Sensitive groups and general public should wear N95/FFP2 masks outdoors and use indoor HEPA filtration.'
    });
  }

  return alerts;
}
