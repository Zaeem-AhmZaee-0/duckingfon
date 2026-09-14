import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useWeather } from '../../context/WeatherContext';
import { useTheme } from '../../context/ThemeContext';
import { Play, Pause, Layers, Maximize2, Minimize2, CloudRain } from 'lucide-react';

export default function WeatherRadarMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const radarLayerRef = useRef(null);
  const markerRef = useRef(null);

  const { currentLocation, weatherData } = useWeather();
  const { isDark } = useTheme();

  const [radarFrames, setRadarFrames] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [radarHost, setRadarHost] = useState('https://tilecache.rainviewer.com');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeLayer, setActiveLayer] = useState('radar'); // 'radar' | 'satellite'

  // 1. Fetch RainViewer radar metadata
  useEffect(() => {
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r => r.json())
      .then(data => {
        if (data && data.host && data.radar && data.radar.past) {
          setRadarHost(data.host);
          // Combine past + nowcast frames
          const allFrames = [...data.radar.past, ...(data.radar.nowcast || [])];
          setRadarFrames(allFrames);
          setCurrentFrameIndex(Math.max(0, data.radar.past.length - 1));
        }
      })
      .catch(err => console.warn('[WeatherMap] RainViewer fetch error:', err));
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const lat = currentLocation?.latitude || 51.5074;
    const lon = currentLocation?.longitude || -0.1278;

    const map = L.map(container, {
      center: [lat, lon],
      zoom: 6,
      zoomControl: false,
      attributionControl: false
    });
    mapInstanceRef.current = map;

    // Basemap: Dark or Light CARTO tiles
    const basemapUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(basemapUrl, {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Custom DuckingFon Pin Marker
    const icon = L.divIcon({
      className: 'duckingfon-custom-marker',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: #38bdf8; opacity: 0.4; animation: ping 2s infinite;"></div>
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #0284c7; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 14px;">
            🦆
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const marker = L.marker([lat, lon], { icon }).addTo(map);
    marker.bindPopup(`<b>${currentLocation?.name || 'Current Location'}</b><br/>${weatherData?.current?.temp || ''}${weatherData?.units?.temp || ''} • ${weatherData?.current?.condition || ''}`);
    markerRef.current = marker;

    // Recalculate size
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isDark]);

  // 3. Pan map when location changes
  useEffect(() => {
    if (mapInstanceRef.current && currentLocation) {
      const lat = currentLocation.latitude;
      const lon = currentLocation.longitude;
      mapInstanceRef.current.panTo([lat, lon], { animate: true, duration: 1 });
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lon]);
        markerRef.current.setPopupContent(`<b>${currentLocation.name}</b><br/>${weatherData?.current?.temp || ''}${weatherData?.units?.temp || ''} • ${weatherData?.current?.condition || ''}`);
      }
    }
  }, [currentLocation, weatherData]);

  // 4. Update Radar Tile Layer when frame changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || radarFrames.length === 0) return;

    const frame = radarFrames[currentFrameIndex];
    if (!frame) return;

    if (radarLayerRef.current) {
      map.removeLayer(radarLayerRef.current);
    }

    // RainViewer tile format: {host}{path}/256/{z}/{x}/{y}/2/1_1.png
    const radarUrl = `${radarHost}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;

    const radarLayer = L.tileLayer(radarUrl, {
      opacity: 0.75,
      zIndex: 10
    });
    radarLayer.addTo(map);
    radarLayerRef.current = radarLayer;
  }, [currentFrameIndex, radarFrames, radarHost]);

  // 5. Time-lapse Animation Interval
  useEffect(() => {
    if (!isPlaying || radarFrames.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % radarFrames.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, radarFrames.length]);

  const currentTimestamp = radarFrames[currentFrameIndex]?.time
    ? new Date(radarFrames[currentFrameIndex].time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Live';

  return (
    <div className={`glass-panel rounded-3xl p-4 sm:p-5 border border-white/10 relative overflow-hidden transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : 'w-full'
    }`}>
      {/* Map Header */}
      <div className="flex items-center justify-between mb-3 z-10">
        <div className="flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-sky-400" />
          <h3 className="font-display font-semibold text-lg text-slate-100">Live Precipitation Radar</h3>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Real-Time
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/5 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Leaflet Container */}
      <div 
        ref={mapContainerRef} 
        className={`w-full rounded-2xl overflow-hidden relative shadow-inner z-0 ${
          isFullscreen ? 'flex-1 min-h-[350px]' : 'h-72 sm:h-96'
        }`}
      />

      {/* Radar Timeline Controller Bar */}
      <div className="mt-3 p-2 sm:p-3 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/10 flex flex-wrap items-center justify-between gap-3 z-10">
        {/* Play / Pause */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            className="w-8 h-8 rounded-xl bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-md shadow-sky-500/30 transition-all active:scale-95"
            title={isPlaying ? 'Pause radar loop' : 'Play radar loop'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <span className="text-xs font-semibold text-slate-300 font-mono">
            {currentTimestamp}
          </span>
        </div>

        {/* Scrub Slider */}
        <div className="flex-1 min-w-[140px] flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={Math.max(0, radarFrames.length - 1)}
            value={currentFrameIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentFrameIndex(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Radar Scale Legend */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <span>Light</span>
          <div className="w-16 h-2 rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-rose-600" />
          <span>Heavy</span>
        </div>
      </div>
    </div>
  );
}
