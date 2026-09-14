import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useWeather } from '../../context/WeatherContext';
import { RotateCw, Globe as GlobeIcon, MapPin } from 'lucide-react';

const CITIES = [
  { name: 'London', country: 'UK', flag: '🇬🇧', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'USA', flag: '🇺🇸', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵', lat: 35.6762, lon: 139.6503 },
  { name: 'Lahore', country: 'Pakistan', flag: '🇵🇰', lat: 31.5204, lon: 74.3587 },
  { name: 'Dubai', country: 'UAE', flag: '🇦🇪', lat: 25.2048, lon: 55.2708 },
  { name: 'Paris', country: 'France', flag: '🇫🇷', lat: 48.8534, lon: 2.3488 },
  { name: 'Sydney', country: 'Australia', flag: '🇦🇺', lat: -33.8688, lon: 151.2093 },
  { name: 'São Paulo', country: 'Brazil', flag: '🇧🇷', lat: -23.5505, lon: -46.6333 },
  { name: 'Cairo', country: 'Egypt', flag: '🇪🇬', lat: 30.0444, lon: 31.2357 },
  { name: 'Reykjavik', country: 'Iceland', flag: '🇮🇸', lat: 64.1466, lon: -21.9426 }
];

// Helper to convert Lat/Lon to 3D Cartesian coordinates on sphere of radius R
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export default function InteractiveGlobe() {
  const containerRef = useRef(null);
  const { loadWeather } = useWeather();
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  const sceneRef = useRef(null);
  const globeGroupRef = useRef(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(5, 3, 4);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x0ea5e9, 1.4);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Earth Sphere (Ocean)
    const earthGeo = new THREE.SphereGeometry(1.6, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x034078,
      roughness: 0.6,
      metalness: 0.1
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Procedural Landmass Canvas Texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a'; // Deep ocean
    ctx.fillRect(0, 0, 1024, 512);

    // Draw stylized continents
    ctx.fillStyle = '#10b981'; // Greenish land
    // North America
    ctx.beginPath();
    ctx.ellipse(280, 140, 90, 60, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // South America
    ctx.beginPath();
    ctx.ellipse(340, 320, 60, 90, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Europe
    ctx.beginPath();
    ctx.ellipse(540, 130, 60, 45, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Africa
    ctx.beginPath();
    ctx.ellipse(550, 260, 70, 90, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Asia
    ctx.beginPath();
    ctx.ellipse(720, 150, 130, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    // Australia
    ctx.beginPath();
    ctx.ellipse(840, 340, 50, 40, -0.1, 0, Math.PI * 2);
    ctx.fill();

    const earthTexture = new THREE.CanvasTexture(canvas);
    const landMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.7,
      transparent: true,
      opacity: 0.95
    });
    earthMesh.material = landMat;

    // Atmospheric Glow Shell
    const atmoGeo = new THREE.SphereGeometry(1.68, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // Add City Pins
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    CITIES.forEach((city) => {
      const pos = latLonToVector3(city.lat, city.lon, 1.62);

      // Pin base dot
      const dotGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      pinGroup.add(dot);

      // Pin stalk pointing outward
      const stalkMat = new THREE.LineBasicMaterial({ color: 0xf59e0b });
      const stalkPoints = [pos, pos.clone().multiplyScalar(1.06)];
      const stalkGeo = new THREE.BufferGeometry().setFromPoints(stalkPoints);
      const stalk = new THREE.Line(stalkGeo, stalkMat);
      pinGroup.add(stalk);
    });

    // Drag to rotate handlers
    const onMouseDown = (e) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging.current || !globeGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      globeGroupRef.current.rotation.y += deltaX * 0.006;
      globeGroupRef.current.rotation.x += deltaY * 0.006;

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging.current = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging.current || !globeGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;
      globeGroupRef.current.rotation.y += deltaX * 0.008;
      globeGroupRef.current.rotation.x += deltaY * 0.008;
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging.current = false; };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isAutoRotate && !isDragging.current && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isAutoRotate]);

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    // Rotate globe to face city
    if (globeGroupRef.current) {
      const targetRotationY = -((city.lon + 90) * (Math.PI / 180));
      const targetRotationX = (city.lat) * (Math.PI / 180) * 0.5;
      globeGroupRef.current.rotation.y = targetRotationY;
      globeGroupRef.current.rotation.x = targetRotationX;
    }
  };

  const handleApplyCityWeather = () => {
    if (selectedCity) {
      loadWeather({
        name: selectedCity.name,
        latitude: selectedCity.lat,
        longitude: selectedCity.lon,
        country: selectedCity.country
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 relative overflow-hidden flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-2">
          <GlobeIcon className="w-5 h-5 text-sky-400" />
          <h3 className="font-display font-semibold text-lg text-slate-100">Interactive 3D Globe</h3>
        </div>
        <button
          onClick={() => setIsAutoRotate(prev => !prev)}
          className={`px-2.5 py-1 text-xs rounded-xl flex items-center gap-1.5 transition-colors ${
            isAutoRotate 
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
              : 'bg-slate-800 text-slate-400 border border-white/10'
          }`}
          title="Toggle Auto Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin-slow' : ''}`} />
          <span>{isAutoRotate ? 'Rotating' : 'Paused'}</span>
        </button>
      </div>

      {/* 3D Canvas */}
      <div 
        ref={containerRef} 
        className="w-full h-64 sm:h-72 cursor-grab active:cursor-grabbing relative"
        title="Click and drag to explore the globe"
      />

      {/* City Chips Quick Selector */}
      <div className="w-full mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none z-10">
        {CITIES.map((c) => (
          <button
            key={c.name}
            onClick={() => handleSelectCity(c)}
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              selectedCity.name === c.name
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/25 scale-105'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-white/5'
            }`}
          >
            <span className="mr-1">{c.flag}</span>
            {c.name}
          </button>
        ))}
      </div>

      {/* Selected City Action Bar */}
      <div className="w-full mt-3 p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{selectedCity.flag}</span>
          <div>
            <h4 className="text-sm font-semibold text-white">{selectedCity.name}, {selectedCity.country}</h4>
            <p className="text-[11px] text-slate-400">
              {selectedCity.lat.toFixed(2)}°, {selectedCity.lon.toFixed(2)}°
            </p>
          </div>
        </div>

        <button
          onClick={handleApplyCityWeather}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 flex items-center gap-1 transition-all active:scale-95"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>View Forecast</span>
        </button>
      </div>
    </div>
  );
}
