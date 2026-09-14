import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 300 });

export async function searchLocations(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.trim().toLowerCase();
  const cacheKey = `geo_${cleanQuery}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=10&language=en&format=json`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'DuckingFon-Weather/1.0' }
    });
    if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
    const data = await res.json();

    const results = (data.results || []).map(item => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      countryCode: item.country_code,
      admin1: item.admin1, // State/Province
      timezone: item.timezone,
      population: item.population,
      displayName: [item.name, item.admin1, item.country].filter(Boolean).join(', ')
    }));

    cache.set(cacheKey, results);
    return results;
  } catch (err) {
    console.error('[GeocodingService] search error:', err.message);
    return [];
  }
}

export async function reverseGeocode({ lat, lon }) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Valid coordinates required for reverse geocoding');
  }

  const cacheKey = `rev_${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    // OpenStreetMap Nominatim with proper user-agent
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'DuckingFon-WeatherApp/1.0 (contact: info@duckingfon.app)',
        'Accept-Language': 'en'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state || 'Current Location';
      const result = {
        name: cityName,
        latitude,
        longitude,
        country: addr.country || '',
        countryCode: addr.country_code ? addr.country_code.toUpperCase() : '',
        admin1: addr.state || addr.region || '',
        displayName: [cityName, addr.state, addr.country].filter(Boolean).join(', ')
      };
      cache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn('[ReverseGeocode] Nominatim lookup fallback:', err.message);
  }

  // Fallback if reverse lookup fails
  return {
    name: 'Current Location',
    latitude,
    longitude,
    country: '',
    displayName: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`
  };
}
