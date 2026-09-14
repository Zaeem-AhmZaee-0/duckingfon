import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchWeather, reverseGeocode } from '../services/api';
import { getSavedLocations, saveSavedLocations, getUnitPreference, saveUnitPreference } from '../services/storage';
import { computeWeatherState } from '../engine/weatherStateEngine';
import { useAudio } from './AudioContext';

const WeatherContext = createContext();

// Default initial location: London
const INITIAL_LOCATION = {
  name: 'London',
  latitude: 51.5074,
  longitude: -0.1278,
  country: 'United Kingdom',
  countryCode: 'GB',
  admin1: 'England'
};

export function WeatherProvider({ children }) {
  const [currentLocation, setCurrentLocation] = useState(INITIAL_LOCATION);
  const [weatherData, setWeatherData] = useState(null);
  const [units, setUnits] = useState(getUnitPreference);
  const [savedLocations, setSavedLocations] = useState(getSavedLocations);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setSoundscape } = useAudio();

  // Compute unified weather and mascot state
  const weatherState = useMemo(() => {
    return computeWeatherState(weatherData);
  }, [weatherData]);

  // Sync ambient sound with weather state
  useEffect(() => {
    if (weatherState?.soundscape) {
      setSoundscape(weatherState.soundscape);
    }
  }, [weatherState?.soundscape, setSoundscape]);

  // Fetch weather data for a given location
  const loadWeather = useCallback(async (location, unitSystem = units) => {
    if (!location || location.latitude === undefined || location.longitude === undefined) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeather({
        lat: location.latitude,
        lon: location.longitude,
        units: unitSystem
      });

      setWeatherData(data);
      setCurrentLocation(location);
    } catch (err) {
      console.error('[WeatherContext] loadWeather error:', err);
      setError(err.message || 'Unable to retrieve weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [units]);

  // Initial load
  useEffect(() => {
    loadWeather(INITIAL_LOCATION, units);
  }, []);

  // Units toggle
  const toggleUnits = useCallback(() => {
    const nextUnit = units === 'metric' ? 'imperial' : 'metric';
    setUnits(nextUnit);
    saveUnitPreference(nextUnit);
    if (currentLocation) {
      loadWeather(currentLocation, nextUnit);
    }
  }, [units, currentLocation, loadWeather]);

  // Auto-detect user geolocation
  const detectUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const locDetails = await reverseGeocode({ lat: latitude, lon: longitude });
          const detectedLocation = {
            name: locDetails.name || 'Current Location',
            latitude,
            longitude,
            country: locDetails.country || '',
            countryCode: locDetails.countryCode || '',
            admin1: locDetails.admin1 || ''
          };
          await loadWeather(detectedLocation, units);
        } catch (e) {
          console.warn('Reverse geocode fallback:', e);
          await loadWeather({
            name: 'Current Location',
            latitude,
            longitude,
            country: ''
          }, units);
        }
      },
      (geoErr) => {
        setIsLoading(false);
        let msg = 'Could not access location.';
        if (geoErr.code === 1) msg = 'Location permission was denied. Please search for your city above.';
        else if (geoErr.code === 2) msg = 'Location information is currently unavailable.';
        else if (geoErr.code === 3) msg = 'Location request timed out.';
        setError(msg);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [loadWeather, units]);

  // Saved locations management
  const addSavedLocation = useCallback((loc) => {
    setSavedLocations(prev => {
      const exists = prev.some(item => 
        (item.id && item.id === loc.id) || 
        (Math.abs(item.latitude - loc.latitude) < 0.05 && Math.abs(item.longitude - loc.longitude) < 0.05)
      );
      if (exists) return prev;
      const updated = [loc, ...prev];
      saveSavedLocations(updated);
      return updated;
    });
  }, []);

  const removeSavedLocation = useCallback((locIdOrName) => {
    setSavedLocations(prev => {
      const updated = prev.filter(item => item.id !== locIdOrName && item.name !== locIdOrName);
      saveSavedLocations(updated);
      return updated;
    });
  }, []);

  const isSavedLocation = useCallback((loc) => {
    if (!loc) return false;
    return savedLocations.some(item => 
      (item.id && item.id === loc.id) || 
      (Math.abs(item.latitude - loc.latitude) < 0.05 && Math.abs(item.longitude - loc.longitude) < 0.05)
    );
  }, [savedLocations]);

  const refreshWeather = useCallback(() => {
    if (currentLocation) {
      loadWeather(currentLocation, units);
    }
  }, [currentLocation, units, loadWeather]);

  return (
    <WeatherContext.Provider value={{
      currentLocation,
      weatherData,
      weatherState,
      units,
      toggleUnits,
      savedLocations,
      addSavedLocation,
      removeSavedLocation,
      isSavedLocation,
      isLoading,
      error,
      loadWeather,
      detectUserLocation,
      refreshWeather
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within a WeatherProvider');
  return context;
}
