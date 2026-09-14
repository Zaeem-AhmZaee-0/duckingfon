const BASE_URL = '/api';

export async function fetchWeather({ lat, lon, units = 'metric' }) {
  const res = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Weather fetch failed with status ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];
  const res = await fetch(`${BASE_URL}/geocoding/search?query=${encodeURIComponent(query.trim())}`);
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function reverseGeocode({ lat, lon }) {
  const res = await fetch(`${BASE_URL}/geocoding/reverse?lat=${lat}&lon=${lon}`);
  if (!res.ok) {
    return { name: 'Current Location', latitude: lat, longitude: lon };
  }
  const json = await res.json();
  return json.data;
}

export async function loginUser(email) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error('Failed to sign in');
  return res.json();
}

export async function syncUserPreferences({ email, preferences, savedLocations }) {
  const res = await fetch(`${BASE_URL}/auth/sync-preferences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, preferences, savedLocations })
  });
  return res.json();
}
