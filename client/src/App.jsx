import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SavedLocationsBar from './components/search/SavedLocationsBar';
import CurrentWeatherHero from './components/weather/CurrentWeatherHero';
import WeatherAlertBanner from './components/weather/WeatherAlertBanner';
import HourlyForecastSlider from './components/weather/HourlyForecastSlider';
import WeeklyForecastCard from './components/weather/WeeklyForecastCard';
import TemperatureTrendChart from './components/charts/TemperatureTrendChart';
import PrecipitationBarChart from './components/charts/PrecipitationBarChart';
import WindCard from './components/weather/detail-cards/WindCard';
import HumidityCard from './components/weather/detail-cards/HumidityCard';
import UVCard from './components/weather/detail-cards/UVCard';
import AirQualityCard from './components/weather/detail-cards/AirQualityCard';
import VisibilityCard from './components/weather/detail-cards/VisibilityCard';
import PressureCard from './components/weather/detail-cards/PressureCard';
import SunMoonCard from './components/weather/detail-cards/SunMoonCard';
import WeatherRadarMap from './components/map/WeatherRadarMap';
import InteractiveGlobe from './components/3d/InteractiveGlobe';
import AtmosphericParticleCanvas from './components/3d/AtmosphericParticleCanvas';
import LegalModal from './components/legal/LegalModal';
import CookieConsentBanner from './components/legal/CookieConsentBanner';
import AuthModal from './components/auth/AuthModal';
import InstallPwaPrompt from './components/pwa/InstallPwaPrompt';
import LoadingScreen from './components/ui/LoadingScreen';
import ErrorState from './components/ui/ErrorState';

import { useWeather } from './context/WeatherContext';

export default function App() {
  const { weatherData, weatherState, isLoading, error, refreshWeather } = useWeather();

  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalInitialTab, setLegalInitialTab] = useState('about');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleOpenLegal = (tab = 'about') => {
    setLegalInitialTab(tab);
    setLegalModalOpen(true);
  };

  // First-time loading overlay
  if (isLoading && !weatherData) {
    return <LoadingScreen />;
  }

  const skyStyle = weatherState?.atmosphere?.skyGradient || 'linear-gradient(135deg, #0a0f1d 0%, #0f172a 100%)';

  return (
    <div 
      className="min-h-screen relative flex flex-col transition-all duration-1000"
      style={{ background: skyStyle }}
    >
      {/* 3D Atmospheric Particles Canvas */}
      <AtmosphericParticleCanvas />

      {/* Main App Bar */}
      <Header 
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSettings={() => handleOpenLegal('about')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Saved Favorites Quick Bar */}
        <SavedLocationsBar />

        {/* Severe Meteorological Weather Alerts Banner */}
        <WeatherAlertBanner />

        {/* Error State if fetch failed */}
        {error && (
          <ErrorState message={error} onRetry={refreshWeather} />
        )}

        {/* Main Weather Experience */}
        {weatherData && (
          <div className="space-y-6 sm:space-y-8">
            {/* 1. Hero Card: Current Weather + 3D Mascot Fon */}
            <CurrentWeatherHero />

            {/* 2. Hourly Forecast Slider */}
            <HourlyForecastSlider />

            {/* 3. Analytics & Visualizations Grid */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <TemperatureTrendChart />
              <div className="border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                <PrecipitationBarChart />
              </div>
            </div>

            {/* 4. Deep Intelligence Grid (2 Columns on Large Screens) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: 7-Day Forecast & Detail Cards (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <WeeklyForecastCard />

                {/* Atmospheric Detail Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <WindCard />
                  <HumidityCard />
                  <UVCard />
                  <AirQualityCard />
                  <VisibilityCard />
                  <PressureCard />
                </div>

                {/* Sun & Moon Cycle */}
                <SunMoonCard />
              </div>

              {/* Right Column: Interactive Maps & 3D Exploration (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Live RainViewer Radar Map */}
                <WeatherRadarMap />

                {/* Interactive 3D Earth Globe */}
                <InteractiveGlobe />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* App Footer */}
      <Footer onOpenLegal={handleOpenLegal} />

      {/* Modals & Overlays */}
      <LegalModal 
        isOpen={legalModalOpen} 
        onClose={() => setLegalModalOpen(false)} 
        initialTab={legalInitialTab} 
      />

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

      <CookieConsentBanner onOpenLegal={handleOpenLegal} />
      <InstallPwaPrompt />
    </div>
  );
}
