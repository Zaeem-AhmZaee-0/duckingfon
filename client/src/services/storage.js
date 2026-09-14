const STORAGE_KEYS = {
  SAVED_LOCATIONS: 'duckingfon_saved_locations',
  RECENT_SEARCHES: 'duckingfon_recent_searches',
  UNITS: 'duckingfon_units',
  THEME: 'duckingfon_theme',
  AUDIO_MUTED: 'duckingfon_audio_muted',
  COOKIE_CONSENT: 'duckingfon_cookie_consent',
  REDUCED_MOTION: 'duckingfon_reduced_motion',
  AUTH_USER: 'duckingfon_auth_user'
};

const DEFAULT_SAVED_LOCATIONS = [
  { id: 1, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', countryCode: 'GB' },
  { id: 2, name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', countryCode: 'JP' },
  { id: 3, name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'United States', countryCode: 'US' },
  { id: 4, name: 'Lahore', latitude: 31.5204, longitude: 74.3587, country: 'Pakistan', countryCode: 'PK' },
  { id: 5, name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'United Arab Emirates', countryCode: 'AE' }
];

export function getSavedLocations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_LOCATIONS);
    return raw ? JSON.parse(raw) : DEFAULT_SAVED_LOCATIONS;
  } catch {
    return DEFAULT_SAVED_LOCATIONS;
  }
}

export function saveSavedLocations(locations) {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(locations));
  } catch {}
}

export function getUnitPreference() {
  return localStorage.getItem(STORAGE_KEYS.UNITS) || 'metric';
}

export function saveUnitPreference(unit) {
  localStorage.setItem(STORAGE_KEYS.UNITS, unit);
}

export function getThemePreference() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
}

export function saveThemePreference(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function getAudioMutedPreference() {
  const val = localStorage.getItem(STORAGE_KEYS.AUDIO_MUTED);
  return val !== null ? val === 'true' : true; // Default muted
}

export function saveAudioMutedPreference(muted) {
  localStorage.setItem(STORAGE_KEYS.AUDIO_MUTED, String(muted));
}

export function getCookieConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(consent) {
  try {
    localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, JSON.stringify(consent));
  } catch {}
}

export function getReducedMotionPreference() {
  const val = localStorage.getItem(STORAGE_KEYS.REDUCED_MOTION);
  if (val !== null) return val === 'true';
  // Check OS media query
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function saveReducedMotionPreference(reduced) {
  localStorage.setItem(STORAGE_KEYS.REDUCED_MOTION, String(reduced));
}

export function getAuthUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuthUser(user) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  } catch {}
}
