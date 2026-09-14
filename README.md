# 🦆 DuckingFon — Immersive Worldwide Weather Platform

> **A living, breathing worldwide weather experience where the entire environment, 3D mascot, lighting, and soundscape dynamically react to real-time meteorological conditions.**

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24%20LTS-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-grey?logo=express)](https://expressjs.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange?logo=pwa)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Overview

**DuckingFon** is not just another weather dashboard displaying cold grids of numbers. It is an immersive, production-quality worldwide weather application and portfolio showcase designed to demonstrate advanced frontend development, responsive UI/UX, 3D graphics, procedural audio synthesis, and scalable Node.js backend architecture.

At the heart of DuckingFon is **Fon the Weather Duck** — an original, stylized 3D mascot that physically and emotionally adapts to weather, temperature, season, and time of day. When it rains, Fon puts on a raincoat and lifts an umbrella. When heat waves strike, Fon fans itself and wears sunglasses. In sub-zero blizzards, Fon shivers in a knitted beanie and fluttering scarf.

---

## ✨ Key Features

### 1. 🦆 Living 3D Mascot: "Fon"
- **High-Fidelity Procedural 3D Model**: Built with Three.js with soft-lit cartoon shaders, articulated beak, feathery tuft, and expressive eyes.
- **Cursor Tracking**: Fon's eyes and head calculate real-time spherical interpolation (`lerp`) to track the user's cursor across the viewport with natural curiosity.
- **25+ Curated Weather States**: A centralized state matrix dynamically selects clothing, poses, expressions, and dialogue based on:
  $$\text{Condition (WMO)} + \text{Temperature} + \text{TimeOfDay} + \text{Season} + \text{Severity} \longrightarrow \text{Mascot \& Atmospheric State}$$
- **Microinteractions**: Click reactions (Fon hops up with a cheerful wing flap and confetti burst), blinking cycles, and breathing idle motions.
- **2D Vector Fallback**: High-performance SVG fallback for low-power devices and users with `prefers-reduced-motion`.

### 2. 🌌 Strategic 3D Atmospheric Particle Engine
- **Rain & Downpours**: Angled velocity streaks with ground ripples and wind skew.
- **Snow & Blizzards**: Volumetric flakes drifting with gentle sinusoidal turbulence.
- **Thunderstorms**: Screen-space strobe lightning flashes illuminating the scene.
- **Clear Nights**: Realistic twinkling starfields with accurate astronomical moon phase calculations.
- **Sun Rays**: Golden hour light motes floating in sunlight.

### 3. 🗺️ Live Precipitation Radar & Interactive 3D Globe
- **Global Weather Radar**: Embedded Leaflet map integrated with **RainViewer's live global radar API**. Includes an animated 2-hour time-lapse player with play/pause and scrubber controls.
- **Interactive 3D Earth Globe**: A lightweight Three.js Earth sphere with continent textures, day/night lighting, and interactive pins for world capitals (London, Tokyo, New York, Lahore, Dubai, Paris, Sydney, Cairo).

### 4. 🔊 Procedural Ambient Audio Engine
- **100% Synthesized via Web Audio API**: Requires **0 KB of external audio downloads** and loads with zero latency.
- Generates realistic, soothing pink-noise rain, low-pass filtered thunder bursts, bandpass-modulated wind gusts, and nocturnal cricket soundscapes.
- Safe browser audio policies: Muted by default, volume slider, and instant mute control.

### 5. 📊 Deep Weather Analytics & Context-Aware Cards
- **24h & 48h Hourly Forecast Slider**: Horizontal scrubbable strip with temperature curves, condition icons, rain probabilities, and wind speeds.
- **7-Day Trend Chart**: Proportional horizontal temperature range bars comparing daily highs and lows.
- **24-Hour Temperature Bezier Curve**: Smooth responsive SVG chart with interactive hover points.
- **Precipitation Probability Chart**: 16-hour bar chart highlighting rain/snow likelihood.
- **Atmospheric Grid**:
  - *Wind & Gusts Card*: With animated rotating compass rose.
  - *Humidity & Dew Point Card*: With comfort ratings.
  - *UV Index Card*: With safety advice and color-coded meter.
  - *Air Quality Card*: US-AQI scale, PM2.5, PM10, and health warnings.
  - *Visibility & Pressure Cards*: Distance metrics and barometric trends.
  - *Sun & Moon Cycle*: Real sunrise/sunset solar arc countdown + lunar phase illumination.

### 6. 📱 PWA-Ready & Accessibility First
- **PWA Manifest & Service Worker**: Installable on desktop and mobile home screens with offline shell caching.
- **WCAG 2.1 AA Compliance**: Keyboard navigation, ARIA live regions, semantic HTML, and high contrast typography.
- **Saved Favorites**: Quick-access pills bar for favorite cities (stored locally with backend cloud sync architecture ready).

---

## 🛠️ Architecture & Tech Stack

```
duckingfon/
├── client/                     # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/             # Three.js Mascot, Particles, Globe & 2D Fallback
│   │   │   ├── map/            # Leaflet + RainViewer Radar Map
│   │   │   ├── charts/         # SVG Temperature & Precipitation Charts
│   │   │   ├── weather/        # Hero, Forecasts, and Detail Cards
│   │   │   ├── search/         # Autocomplete SearchBar & Favorites Bar
│   │   │   ├── layout/         # Header, Footer, Logo
│   │   │   ├── legal/          # Modals & Cookie Consent Banner
│   │   │   └── ui/             # LoadingScreen & ErrorState
│   │   ├── context/            # WeatherContext, ThemeContext, AudioContext
│   │   ├── engine/             # WeatherStateEngine & ProceduralAudioEngine
│   │   └── services/           # REST API & LocalStorage Services
│   └── public/                 # PWA Manifest, Icons, and Service Worker
└── server/                     # Node.js + Express Backend Proxy
    ├── src/
    │   ├── services/           # Open-Meteo Client, Caching, Geocoding & Alerts
    │   ├── routes/             # Weather, Geocoding, and Auth routes
    │   └── middleware/         # Helmet, CORS, Rate-Limiter & ErrorHandler
    └── .env                    # Port & Caching Configuration
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 1. Clone & Install Dependencies
```bash
# In the root repository
npm run install:all
```
*(Or install inside `server` and `client` individually with `npm install`)*

### 2. Start Concurrent Development Servers
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🔌 Backend API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Health check & system status |
| `/api/weather?lat={lat}&lon={lon}&units={metric\|imperial}` | `GET` | Current, hourly, 7-day forecast, air quality, sun/moon, and alerts |
| `/api/geocoding/search?query={city}` | `GET` | Worldwide fuzzy city search with timezone & coordinates |
| `/api/geocoding/reverse?lat={lat}&lon={lon}` | `GET` | Reverse geocode coordinates to nearest city & country |
| `/api/auth/login` | `POST` | Demo user sign in & preferences sync |

---

## 📜 Attributions & Data Sources

- **Meteorological Data & Geocoding**: [Open-Meteo](https://open-meteo.com) (Under CC BY 4.0)
- **Global Precipitation Radar**: [RainViewer](https://www.rainviewer.com)
- **Map Tiles & Data**: © [OpenStreetMap](https://www.openstreetmap.org) contributors, [CARTO](https://carto.com)
- **Icons**: [Lucide React](https://lucide.dev)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to explore, customize, and build upon it!
