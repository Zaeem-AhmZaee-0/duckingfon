import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Accurate WMO Weather Code Mapping
export const WMO_MAP = {
  0: { label: 'Clear Sky', category: 'clear', icon: 'sun' },
  1: { label: 'Mainly Clear', category: 'partly_cloudy', icon: 'sun-dim' },
  2: { label: 'Partly Cloudy', category: 'partly_cloudy', icon: 'cloud-sun' },
  3: { label: 'Overcast', category: 'overcast', icon: 'cloud' },
  45: { label: 'Foggy', category: 'fog', icon: 'cloud-fog' },
  48: { label: 'Depositing Rime Fog', category: 'fog', icon: 'cloud-fog' },
  51: { label: 'Light Drizzle', category: 'drizzle', icon: 'cloud-drizzle' },
  53: { label: 'Moderate Drizzle', category: 'drizzle', icon: 'cloud-drizzle' },
  55: { label: 'Dense Drizzle', category: 'drizzle', icon: 'cloud-drizzle' },
  56: { label: 'Light Freezing Drizzle', category: 'freezing_rain', icon: 'cloud-snow' },
  57: { label: 'Dense Freezing Drizzle', category: 'freezing_rain', icon: 'cloud-snow' },
  61: { label: 'Slight Rain', category: 'rain', icon: 'cloud-rain' },
  63: { label: 'Moderate Rain', category: 'rain', icon: 'cloud-rain' },
  65: { label: 'Heavy Rain', category: 'heavy_rain', icon: 'cloud-rain-wind' },
  66: { label: 'Light Freezing Rain', category: 'freezing_rain', icon: 'cloud-snow' },
  67: { label: 'Heavy Freezing Rain', category: 'freezing_rain', icon: 'cloud-snow' },
  71: { label: 'Slight Snow', category: 'snow', icon: 'snowflake' },
  73: { label: 'Moderate Snow', category: 'snow', icon: 'snowflake' },
  75: { label: 'Heavy Snow', category: 'heavy_snow', icon: 'snowflake' },
  77: { label: 'Snow Grains', category: 'snow', icon: 'snowflake' },
  80: { label: 'Slight Rain Showers', category: 'rain_showers', icon: 'cloud-rain' },
  81: { label: 'Moderate Rain Showers', category: 'rain_showers', icon: 'cloud-rain' },
  82: { label: 'Violent Rain Showers', category: 'heavy_rain', icon: 'cloud-lightning' },
  85: { label: 'Slight Snow Showers', category: 'snow', icon: 'snowflake' },
  86: { label: 'Heavy Snow Showers', category: 'heavy_snow', icon: 'snowflake' },
  95: { label: 'Thunderstorm', category: 'thunderstorm', icon: 'cloud-lightning' },
  96: { label: 'Thunderstorm with Hail', category: 'thunderstorm', icon: 'cloud-lightning' },
  99: { label: 'Thunderstorm with Heavy Hail', category: 'severe_storm', icon: 'cloud-lightning' }
};

// Calculate Moon Phase (0 = New Moon, 0.25 = First Quarter, 0.5 = Full Moon, 0.75 = Last Quarter)
export function getMoonPhase(date = new Date()) {
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  
  if (month < 3) {
    year--;
    month += 12;
  }
  
  const a = Math.floor(year / 100);
  const b = Math.floor(a / 4);
  const c = 2 - a + b;
  const e = Math.floor(365.25 * (year + 4716));
  const f = Math.floor(30.6001 * (month + 1));
  const jd = c + day + e + f - 1524.5;
  
  const daysSinceNew = (jd - 2451549.5) % 29.53058867;
  const phase = (daysSinceNew < 0 ? daysSinceNew + 29.53058867 : daysSinceNew) / 29.53058867;
  
  let name = 'New Moon';
  let icon = 'moon';
  if (phase > 0.03 && phase < 0.22) { name = 'Waxing Crescent'; icon = 'moon-star'; }
  else if (phase >= 0.22 && phase <= 0.28) { name = 'First Quarter'; icon = 'moon'; }
  else if (phase > 0.28 && phase < 0.47) { name = 'Waxing Gibbous'; icon = 'moon'; }
  else if (phase >= 0.47 && phase <= 0.53) { name = 'Full Moon'; icon = 'moon'; }
  else if (phase > 0.53 && phase < 0.72) { name = 'Waning Gibbous'; icon = 'moon'; }
  else if (phase >= 0.72 && phase <= 0.78) { name = 'Last Quarter'; icon = 'moon'; }
  else if (phase > 0.78 && phase < 0.97) { name = 'Waning Crescent'; icon = 'moon-star'; }
  
  return {
    fraction: Number(phase.toFixed(3)),
    name,
    icon,
    illumination: Math.round(50 * (1 - Math.cos(2 * Math.PI * phase)))
  };
}

export async function fetchWeatherData({ lat, lon, units = 'metric' }) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    const error = new Error('Valid latitude and longitude are required');
    error.status = 400;
    throw error;
  }

  const cacheKey = `weather_${latitude.toFixed(2)}_${longitude.toFixed(2)}_${units}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return { ...cached, isCached: true };
  }

  const tempUnitParam = units === 'imperial' ? '&temperature_unit=fahrenheit' : '';
  const windUnitParam = units === 'imperial' ? '&wind_speed_unit=mph' : '&wind_speed_unit=kmh';
  const precipUnitParam = units === 'imperial' ? '&precipitation_unit=inch' : '&precipitation_unit=mm';

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
    `&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,uv_index,is_day` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max` +
    `&timezone=auto${tempUnitParam}${windUnitParam}${precipUnitParam}`;

  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}` +
    `&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust` +
    `&timezone=auto`;

  // Concurrent fetch
  const [weatherRes, airQualityRes] = await Promise.allSettled([
    fetch(weatherUrl).then(r => {
      if (!r.ok) throw new Error(`Open-Meteo returned status ${r.status}`);
      return r.json();
    }),
    fetch(airQualityUrl).then(r => {
      if (!r.ok) return null;
      return r.json();
    })
  ]);

  if (weatherRes.status !== 'fulfilled' || !weatherRes.value) {
    const err = new Error(weatherRes.reason?.message || 'Failed to fetch weather data from provider');
    err.status = 502;
    throw err;
  }

  const wData = weatherRes.value;
  const aData = airQualityRes.status === 'fulfilled' ? airQualityRes.value : null;

  // Process current weather
  const currentCode = wData.current?.weather_code ?? 0;
  const conditionMeta = WMO_MAP[currentCode] || { label: 'Clear', category: 'clear', icon: 'sun' };
  
  // Format hourly (next 48 hours)
  const hourly = [];
  if (wData.hourly?.time) {
    const nowISO = new Date().toISOString();
    let startIndex = wData.hourly.time.findIndex(t => new Date(t).getTime() >= new Date(nowISO).getTime() - 3600000);
    if (startIndex < 0) startIndex = 0;
    const count = Math.min(48, wData.hourly.time.length - startIndex);
    
    for (let i = 0; i < count; i++) {
      const idx = startIndex + i;
      const code = wData.hourly.weather_code[idx] ?? 0;
      hourly.push({
        time: wData.hourly.time[idx],
        temp: Math.round(wData.hourly.temperature_2m[idx]),
        feelsLike: Math.round(wData.hourly.apparent_temperature[idx]),
        humidity: wData.hourly.relative_humidity_2m[idx],
        precipitationProb: wData.hourly.precipitation_probability[idx] ?? 0,
        precipitation: wData.hourly.precipitation[idx] ?? 0,
        weatherCode: code,
        condition: WMO_MAP[code] || { label: 'Clear', category: 'clear' },
        windSpeed: Math.round(wData.hourly.wind_speed_10m[idx]),
        windDirection: wData.hourly.wind_direction_10m[idx],
        uvIndex: wData.hourly.uv_index[idx] ?? 0,
        visibilityKm: wData.hourly.visibility ? Math.round(wData.hourly.visibility[idx] / 1000) : null,
        isDay: Boolean(wData.hourly.is_day ? wData.hourly.is_day[idx] : 1)
      });
    }
  }

  // Format daily (next 7 days)
  const daily = [];
  if (wData.daily?.time) {
    for (let i = 0; i < wData.daily.time.length; i++) {
      const code = wData.daily.weather_code[i] ?? 0;
      daily.push({
        date: wData.daily.time[i],
        weatherCode: code,
        condition: WMO_MAP[code] || { label: 'Clear', category: 'clear' },
        tempMax: Math.round(wData.daily.temperature_2m_max[i]),
        tempMin: Math.round(wData.daily.temperature_2m_min[i]),
        apparentMax: Math.round(wData.daily.apparent_temperature_max[i]),
        apparentMin: Math.round(wData.daily.apparent_temperature_min[i]),
        precipitationSum: wData.daily.precipitation_sum[i] ?? 0,
        precipitationProbMax: wData.daily.precipitation_probability_max[i] ?? 0,
        windSpeedMax: Math.round(wData.daily.wind_speed_10m_max[i] ?? 0),
        uvIndexMax: wData.daily.uv_index_max[i] ?? 0,
        sunrise: wData.daily.sunrise[i],
        sunset: wData.daily.sunset[i]
      });
    }
  }

  // Process Air Quality
  let airQuality = null;
  if (aData?.current) {
    const usAqi = aData.current.us_aqi ?? null;
    let aqiLabel = 'Good';
    let aqiColor = '#10b981';
    let aqiDescription = 'Air quality is satisfactory and poses little or no risk.';
    
    if (usAqi !== null) {
      if (usAqi > 300) { aqiLabel = 'Hazardous'; aqiColor = '#7f1d1d'; aqiDescription = 'Emergency health warnings of entire population.'; }
      else if (usAqi > 200) { aqiLabel = 'Very Unhealthy'; aqiColor = '#9333ea'; aqiDescription = 'Health alert: serious risk for everyone.'; }
      else if (usAqi > 150) { aqiLabel = 'Unhealthy'; aqiColor = '#ef4444'; aqiDescription = 'Everyone may begin to experience health effects.'; }
      else if (usAqi > 100) { aqiLabel = 'Moderate / Sensitive'; aqiColor = '#f97316'; aqiDescription = 'Sensitive groups may experience health effects.'; }
      else if (usAqi > 50) { aqiLabel = 'Moderate'; aqiColor = '#eab308'; aqiDescription = 'Air quality is acceptable for most people.'; }
    }

    airQuality = {
      usAqi,
      europeanAqi: aData.current.european_aqi ?? null,
      pm2_5: aData.current.pm2_5 ? Number(aData.current.pm2_5.toFixed(1)) : null,
      pm10: aData.current.pm10 ? Number(aData.current.pm10.toFixed(1)) : null,
      ozone: aData.current.ozone ? Number(aData.current.ozone.toFixed(1)) : null,
      no2: aData.current.nitrogen_dioxide ? Number(aData.current.nitrogen_dioxide.toFixed(1)) : null,
      so2: aData.current.sulphur_dioxide ? Number(aData.current.sulphur_dioxide.toFixed(1)) : null,
      label: aqiLabel,
      color: aqiColor,
      description: aqiDescription
    };
  }

  const moon = getMoonPhase(new Date());

  const result = {
    location: {
      latitude: wData.latitude,
      longitude: wData.longitude,
      elevation: wData.elevation,
      timezone: wData.timezone,
      timezoneAbbreviation: wData.timezone_abbreviation,
      utcOffsetSeconds: wData.utc_offset_seconds
    },
    units: {
      temp: units === 'imperial' ? '°F' : '°C',
      wind: units === 'imperial' ? 'mph' : 'km/h',
      precip: units === 'imperial' ? 'in' : 'mm',
      pressure: 'hPa',
      system: units
    },
    current: {
      time: wData.current?.time,
      temp: Math.round(wData.current?.temperature_2m ?? 0),
      feelsLike: Math.round(wData.current?.apparent_temperature ?? 0),
      humidity: wData.current?.relative_humidity_2m ?? 0,
      isDay: Boolean(wData.current?.is_day ?? 1),
      precipitation: wData.current?.precipitation ?? 0,
      rain: wData.current?.rain ?? 0,
      snowfall: wData.current?.snowfall ?? 0,
      weatherCode: currentCode,
      condition: conditionMeta.label,
      category: conditionMeta.category,
      icon: conditionMeta.icon,
      cloudCover: wData.current?.cloud_cover ?? 0,
      pressure: Math.round(wData.current?.pressure_msl ?? 1013),
      windSpeed: Math.round(wData.current?.wind_speed_10m ?? 0),
      windDirection: wData.current?.wind_direction_10m ?? 0,
      windGusts: Math.round(wData.current?.wind_gusts_10m ?? 0),
      uvIndex: hourly[0]?.uvIndex ?? (daily[0]?.uvIndexMax ? Math.round(daily[0].uvIndexMax * 0.7) : 0),
      visibilityKm: hourly[0]?.visibilityKm ?? 10
    },
    hourly,
    daily,
    airQuality,
    astronomy: {
      sunrise: daily[0]?.sunrise || null,
      sunset: daily[0]?.sunset || null,
      moon
    },
    updatedAt: new Date().toISOString()
  };

  cache.set(cacheKey, result);
  return result;
}
