import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import { WeatherProvider } from './context/WeatherContext';

// Register PWA Service Worker in production/supporting environments
if ('serviceWorker' in navigator && window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('[PWA] Service worker registration ignored/failed:', err.message);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AudioProvider>
        <WeatherProvider>
          <App />
        </WeatherProvider>
      </AudioProvider>
    </ThemeProvider>
  </React.StrictMode>
);
