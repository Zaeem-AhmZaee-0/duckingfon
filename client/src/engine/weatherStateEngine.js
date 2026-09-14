/**
 * DuckingFon Centralized Weather & Mascot Animation State Matrix Engine
 * Computes the unified environmental state, 3D character pose, clothing, and atmosphere.
 */

export function determineSeason(latitude = 0, date = new Date()) {
  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  const isNorthern = latitude >= 0;

  if (isNorthern) {
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter';
  } else {
    // Southern Hemisphere reversed
    if (month >= 2 && month <= 4) return 'Autumn';
    if (month >= 5 && month <= 7) return 'Winter';
    if (month >= 8 && month <= 10) return 'Spring';
    return 'Summer';
  }
}

export function determineTimeOfDay(localHour = 12, isDay = true) {
  if (localHour >= 5 && localHour < 8) return 'Dawn';
  if (localHour >= 8 && localHour < 12) return 'Morning';
  if (localHour >= 12 && localHour < 17) return 'Afternoon';
  if (localHour >= 17 && localHour < 20) return isDay ? 'Sunset' : 'Dusk';
  if (localHour >= 20 && localHour < 23) return 'Night';
  return 'Midnight';
}

export function computeWeatherState(weatherData) {
  if (!weatherData || !weatherData.current) {
    // Default calm sunny state
    return getFallbackState();
  }

  const { current, location, units } = weatherData;
  const isImperial = units?.system === 'imperial';
  const tempC = isImperial ? (current.temp - 32) * 5 / 9 : current.temp;
  const windKmh = isImperial ? current.windSpeed * 1.60934 : current.windSpeed;
  const weatherCode = current.weatherCode ?? 0;
  const isDay = current.isDay;

  // Derive local hour from weather data or current time
  let localHour = 12;
  if (current.time) {
    try {
      localHour = new Date(current.time).getHours();
    } catch {
      localHour = new Date().getHours();
    }
  }

  const season = determineSeason(location?.latitude || 0);
  const timeOfDay = determineTimeOfDay(localHour, isDay);

  // Severe Alert Override
  const hasSevereThunder = [95, 96, 99].includes(weatherCode);
  const hasHeavyRain = [65, 82].includes(weatherCode) || (current.rain > 5);
  const hasRain = [51, 53, 55, 56, 57, 61, 63, 66, 67, 80, 81].includes(weatherCode) || (current.precipitation > 0.5);
  const hasSnow = [71, 73, 75, 77, 85, 86].includes(weatherCode) || (current.snowfall > 0);
  const hasFog = [45, 48].includes(weatherCode);
  const hasHighWind = windKmh >= 45;
  const isExtremeHeat = tempC >= 34;
  const isFreezing = tempC <= 2;
  const isChilly = tempC <= 12;

  // --- STATE RESOLUTION ---
  // 1. Severe Thunderstorm
  if (hasSevereThunder) {
    return {
      stateKey: 'thunderstorm_startled',
      season,
      timeOfDay,
      mascot: {
        pose: 'ducking_frightened',
        facialExpression: 'shocked_eyes',
        accessories: {
          sunglasses: false,
          umbrella: true,
          raincoat: true,
          hoodie: false,
          beanie: false,
          scarf: false,
          sleepingCap: false,
          lantern: false,
          fan: false,
          sweatDrops: false
        },
        dialogue: "Whoa, that was a loud rumble! Duck and cover indoors, folks!"
      },
      atmosphere: {
        environmentType: 'thunderstorm',
        particleType: 'lightning',
        particleDensity: 0.9,
        ambientColor: '#1e1b4b',
        sunLightColor: '#818cf8',
        skyGradient: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #030712 100%)',
        cardAccent: '#818cf8'
      },
      soundscape: 'thunder'
    };
  }

  // 2. Heavy Rain / Downpour
  if (hasHeavyRain) {
    return {
      stateKey: 'heavy_rain_protective',
      season,
      timeOfDay,
      mascot: {
        pose: 'holding_umbrella_tight',
        facialExpression: 'determined',
        accessories: {
          sunglasses: false,
          umbrella: true,
          raincoat: true,
          hoodie: false,
          beanie: false,
          scarf: false,
          sleepingCap: false,
          lantern: false,
          fan: false,
          sweatDrops: false
        },
        dialogue: "It's pouring ducks and drakes! Hold tight to your umbrella!"
      },
      atmosphere: {
        environmentType: 'heavy_rain',
        particleType: 'heavy_rain',
        particleDensity: 0.85,
        ambientColor: '#1e293b',
        sunLightColor: '#60a5fa',
        skyGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #082f49 100%)',
        cardAccent: '#38bdf8'
      },
      soundscape: 'rain'
    };
  }

  // 3. Regular Rain / Drizzle
  if (hasRain) {
    return {
      stateKey: 'rain_umbrella',
      season,
      timeOfDay,
      mascot: {
        pose: 'holding_umbrella',
        facialExpression: 'happy_smile',
        accessories: {
          sunglasses: false,
          umbrella: true,
          raincoat: true,
          hoodie: false,
          beanie: false,
          scarf: false,
          sleepingCap: false,
          lantern: false,
          fan: false,
          sweatDrops: false
        },
        dialogue: "Nice gentle drizzle. Perfect weather for ducks, absolutely quack-tastic!"
      },
      atmosphere: {
        environmentType: 'rain',
        particleType: 'rain',
        particleDensity: 0.6,
        ambientColor: '#1e293b',
        sunLightColor: '#93c5fd',
        skyGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 60%, #0f172a 100%)',
        cardAccent: '#0ea5e9'
      },
      soundscape: 'rain'
    };
  }

  // 4. Snow / Blizzard
  if (hasSnow) {
    const isBlizzard = windKmh >= 35 || weatherCode === 75 || weatherCode === 86;
    return {
      stateKey: isBlizzard ? 'snow_blizzard' : 'snow_gentle',
      season,
      timeOfDay,
      mascot: {
        pose: 'hugging_self_shivering',
        facialExpression: 'shivering_teeth',
        accessories: {
          sunglasses: false,
          umbrella: false,
          raincoat: false,
          hoodie: false,
          beanie: true,
          scarf: true,
          sleepingCap: false,
          lantern: false,
          fan: false,
          sweatDrops: false
        },
        dialogue: isBlizzard 
          ? "Brrr! Serious blizzard blowing through. Time for hot cocoa!"
          : "Fresh powdery snow falling softly. Let's build a snow duck!"
      },
      atmosphere: {
        environmentType: 'snow',
        particleType: isBlizzard ? 'blizzard' : 'snow',
        particleDensity: isBlizzard ? 0.9 : 0.65,
        ambientColor: '#334155',
        sunLightColor: '#e0f2fe',
        skyGradient: 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #0f172a 100%)',
        cardAccent: '#7dd3fc'
      },
      soundscape: 'wind'
    };
  }

  // 5. Freezing Chilly (Without Snow)
  if (isFreezing || isChilly) {
    return {
      stateKey: isFreezing ? 'freezing_shiver' : 'cold_hoodie',
      season,
      timeOfDay,
      mascot: {
        pose: 'hugging_self_shivering',
        facialExpression: isFreezing ? 'shivering_teeth' : 'content_cool',
        accessories: {
          sunglasses: false,
          umbrella: false,
          raincoat: false,
          hoodie: true,
          beanie: isFreezing,
          scarf: isFreezing,
          sleepingCap: false,
          lantern: false,
          fan: false,
          sweatDrops: false
        },
        dialogue: isFreezing 
          ? "Crisp, icy bite in the air! Make sure you zip up your warmest coat."
          : "Pleasantly crisp! A snug hoodie does the trick."
      },
      atmosphere: {
        environmentType: isDay ? 'crisp_cold' : 'night_cold',
        particleType: isDay ? 'none' : 'stars',
        particleDensity: 0.3,
        ambientColor: '#1e293b',
        sunLightColor: '#bae6fd',
        skyGradient: isDay 
          ? 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)'
          : 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
        cardAccent: '#38bdf8'
      },
      soundscape: isDay ? 'wind' : 'night_crickets'
    };
  }

  // 6. Fog / Mist
  if (hasFog) {
    return {
      stateKey: 'fog_lantern',
      season,
      timeOfDay,
      mascot: {
        pose: 'looking_around_confused',
        facialExpression: 'confused_tilt',
        accessories: {
          sunglasses: false,
          umbrella: false,
          raincoat: false,
          hoodie: true,
          beanie: false,
          scarf: false,
          sleepingCap: false,
          lantern: true,
          fan: false,
          sweatDrops: false
        },
        dialogue: "Thick mystical mist out here! Keeping my lantern lit so I don't waddle into a tree."
      },
      atmosphere: {
        environmentType: 'fog',
        particleType: 'fog_mist',
        particleDensity: 0.7,
        ambientColor: '#475569',
        sunLightColor: '#cbd5e1',
        skyGradient: 'linear-gradient(135deg, #334155 0%, #475569 50%, #1e293b 100%)',
        cardAccent: '#94a3b8'
      },
      soundscape: 'wind'
    };
  }

  // 7. High Wind / Gale
  if (hasHighWind) {
    return {
      stateKey: 'windy_leaning',
      season,
      timeOfDay,
      mascot: {
        pose: 'leaning_wind',
        facialExpression: 'determined',
        accessories: {
          sunglasses: isDay,
          umbrella: false,
          raincoat: false,
          hoodie: true,
          beanie: false,
          scarf: true,
          sleepingCap: false,
          lantern: false,
          fan: false,
          sweatDrops: false
        },
        dialogue: "Whoosh! Hold on to your hats, the wind is trying to take off with my feathers!"
      },
      atmosphere: {
        environmentType: 'windy',
        particleType: 'wind_dust',
        particleDensity: 0.5,
        ambientColor: '#1e293b',
        sunLightColor: '#93c5fd',
        skyGradient: 'linear-gradient(135deg, #075985 0%, #0369a1 50%, #0284c7 100%)',
        cardAccent: '#38bdf8'
      },
      soundscape: 'wind'
    };
  }

  // 8. Extreme Heat / Scorching Sun
  if (isExtremeHeat) {
    return {
      stateKey: 'hot_sweating',
      season,
      timeOfDay,
      mascot: {
        pose: 'fanning_tired',
        facialExpression: 'exhausted_sweat',
        accessories: {
          sunglasses: true,
          umbrella: false,
          raincoat: false,
          hoodie: false,
          beanie: false,
          scarf: false,
          sleepingCap: false,
          lantern: false,
          fan: true,
          sweatDrops: true
        },
        dialogue: "Phew! Scorching sunshine today. Stay in the shade and keep drinking water!"
      },
      atmosphere: {
        environmentType: 'heatwave',
        particleType: 'sun_rays',
        particleDensity: 0.6,
        ambientColor: '#7c2d12',
        sunLightColor: '#fbbf24',
        skyGradient: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #d97706 100%)',
        cardAccent: '#f59e0b'
      },
      soundscape: 'gentle_breeze'
    };
  }

  // 9. Clear Night / Moonlit
  if (!isDay) {
    return {
      stateKey: 'clear_night_sleepy',
      season,
      timeOfDay,
      mascot: {
        pose: 'sleepy_yawn',
        facialExpression: 'sleepy_half_closed',
        accessories: {
          sunglasses: false,
          umbrella: false,
          raincoat: false,
          hoodie: false,
          beanie: false,
          scarf: false,
          sleepingCap: true,
          lantern: false,
          fan: false,
          sweatDrops: false
        },
        dialogue: "Peaceful starry night. Perfect time to tuck your head under a wing and rest."
      },
      atmosphere: {
        environmentType: 'clear_night',
        particleType: 'stars',
        particleDensity: 0.8,
        ambientColor: '#090d16',
        sunLightColor: '#38bdf8',
        skyGradient: 'linear-gradient(135deg, #020617 0%, #0b1329 50%, #172554 100%)',
        cardAccent: '#38bdf8'
      },
      soundscape: 'night_crickets'
    };
  }

  // 10. Pleasant / Sunny / Partly Cloudy (Daytime default)
  return {
    stateKey: 'sunny_happy',
    season,
    timeOfDay,
    mascot: {
      pose: 'chilling_sunglasses',
      facialExpression: 'happy_smile',
      accessories: {
        sunglasses: current.cloudCover < 50,
        umbrella: false,
        raincoat: false,
        hoodie: false,
        beanie: false,
        scarf: false,
        sleepingCap: false,
        lantern: false,
        fan: false,
        sweatDrops: false
      },
      dialogue: current.cloudCover < 30
        ? "Gorgeous bright sunshine today! Feeling confident and ready to explore."
        : "Pleasant skies with gentle drifting clouds. A wonderful day to be out!"
    },
    atmosphere: {
      environmentType: 'sunny',
      particleType: 'sun_rays',
      particleDensity: 0.4,
      ambientColor: '#0284c7',
      sunLightColor: '#fef08a',
      skyGradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #bae6fd 100%)',
      cardAccent: '#0284c7'
    },
    soundscape: 'gentle_breeze'
  };
}

function getFallbackState() {
  return {
    stateKey: 'sunny_happy',
    season: 'Summer',
    timeOfDay: 'Afternoon',
    mascot: {
      pose: 'happy_wave',
      facialExpression: 'happy_smile',
      accessories: {
        sunglasses: true,
        umbrella: false,
        raincoat: false,
        hoodie: false,
        beanie: false,
        scarf: false,
        sleepingCap: false,
        lantern: false,
        fan: false,
        sweatDrops: false
      },
      dialogue: "Welcome to DuckingFon! Search any city to explore its living weather world."
    },
    atmosphere: {
      environmentType: 'sunny',
      particleType: 'sun_rays',
      particleDensity: 0.3,
      ambientColor: '#0284c7',
      sunLightColor: '#fef08a',
      skyGradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #bae6fd 100%)',
      cardAccent: '#0284c7'
    },
    soundscape: 'gentle_breeze'
  };
}
