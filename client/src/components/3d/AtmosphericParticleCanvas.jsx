import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useWeather } from '../../context/WeatherContext';
import { useTheme } from '../../context/ThemeContext';

export default function AtmosphericParticleCanvas({ className = '' }) {
  const containerRef = useRef(null);
  const { weatherState } = useWeather();
  const { reducedMotion } = useTheme();

  const particleType = weatherState?.atmosphere?.particleType || 'none';
  const density = weatherState?.atmosphere?.particleDensity || 0.5;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 20;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    let particles = null;
    let particleCount = 0;
    let particlePositions = null;
    let particleVelocities = null;
    let flashLight = null;
    let flashTimer = 0;

    // 1. Rain / Heavy Rain
    if (particleType === 'rain' || particleType === 'heavy_rain') {
      particleCount = particleType === 'heavy_rain' ? 800 : 450;
      const geometry = new THREE.BufferGeometry();
      particlePositions = new Float32Array(particleCount * 3);
      particleVelocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 45;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 35;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        particleVelocities[i * 3] = -0.08; // Wind skew
        particleVelocities[i * 3 + 1] = -(0.55 + Math.random() * 0.4); // Downward speed
        particleVelocities[i * 3 + 2] = 0;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      // Rain streak texture created programmatically
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createLinearGradient(8, 0, 8, 64);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.5, 'rgba(186,230,253,0.7)');
      grad.addColorStop(1, 'rgba(255,255,255,0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(6, 0, 4, 64);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.PointsMaterial({
        size: 0.8,
        map: texture,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    }
    // 2. Snow / Blizzard
    else if (particleType === 'snow' || particleType === 'blizzard') {
      particleCount = particleType === 'blizzard' ? 650 : 350;
      const geometry = new THREE.BufferGeometry();
      particlePositions = new Float32Array(particleCount * 3);
      particleVelocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 45;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 35;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        const isBlizzard = particleType === 'blizzard';
        particleVelocities[i * 3] = isBlizzard ? -0.15 : (Math.random() - 0.5) * 0.04;
        particleVelocities[i * 3 + 1] = -(0.06 + Math.random() * 0.08);
        particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      // Circular soft snowflake texture
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const radGrad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      radGrad.addColorStop(0, 'rgba(255,255,255,1)');
      radGrad.addColorStop(0.5, 'rgba(240,249,255,0.7)');
      radGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.PointsMaterial({
        size: 0.6,
        map: texture,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    }
    // 3. Lightning / Thunderstorm
    else if (particleType === 'lightning') {
      particleCount = 500;
      const geometry = new THREE.BufferGeometry();
      particlePositions = new Float32Array(particleCount * 3);
      particleVelocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 45;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 35;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        particleVelocities[i * 3] = -0.15;
        particleVelocities[i * 3 + 1] = -0.7;
        particleVelocities[i * 3 + 2] = 0;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const material = new THREE.PointsMaterial({
        size: 0.7,
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Strobe flash light for lightning
      flashLight = new THREE.DirectionalLight(0xffffff, 0);
      flashLight.position.set(0, 10, 15);
      scene.add(flashLight);
    }
    // 4. Stars (Clear Night)
    else if (particleType === 'stars') {
      particleCount = 450;
      const geometry = new THREE.BufferGeometry();
      particlePositions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 60;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 45;
        particlePositions[i * 3 + 2] = -5 + (Math.random() - 0.5) * 15;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      // Twinkling star particle
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const radGrad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      radGrad.addColorStop(0, 'rgba(255,255,255,1)');
      radGrad.addColorStop(0.3, 'rgba(186,230,253,0.7)');
      radGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.PointsMaterial({
        size: 0.45,
        map: texture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    }
    // 5. Sun Rays / Golden Hour Motes
    else if (particleType === 'sun_rays') {
      particleCount = 120;
      const geometry = new THREE.BufferGeometry();
      particlePositions = new Float32Array(particleCount * 3);
      particleVelocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 40;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        particleVelocities[i * 3] = (Math.random() - 0.5) * 0.015;
        particleVelocities[i * 3 + 1] = 0.01 + Math.random() * 0.02;
        particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const material = new THREE.PointsMaterial({
        size: 0.5,
        color: 0xfde047,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });
      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    }

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (particles && particlePositions && particleVelocities) {
        const positions = particles.geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += particleVelocities[i * 3];
          positions[i * 3 + 1] += particleVelocities[i * 3 + 1];
          positions[i * 3 + 2] += particleVelocities[i * 3 + 2];

          // Re-spawn particles when they leave the bounds
          if (positions[i * 3 + 1] < -18) {
            positions[i * 3 + 1] = 18;
            positions[i * 3] = (Math.random() - 0.5) * 45;
          } else if (positions[i * 3 + 1] > 18) {
            positions[i * 3 + 1] = -18;
          }
          if (positions[i * 3] < -25) positions[i * 3] = 25;
          if (positions[i * 3] > 25) positions[i * 3] = -25;
        }

        particles.geometry.attributes.position.needsUpdate = true;
      }

      // Lightning Strobe Logic
      if (flashLight) {
        flashTimer += delta;
        if (flashTimer > 6 && Math.random() < 0.04) {
          flashLight.intensity = 3.5;
          flashTimer = 0;
          setTimeout(() => {
            if (flashLight) flashLight.intensity = 0.5;
            setTimeout(() => {
              if (flashLight) flashLight.intensity = 2.8;
              setTimeout(() => {
                if (flashLight) flashLight.intensity = 0;
              }, 60);
            }, 40);
          }, 80);
        }
      }

      // Star Twinkle Effect
      if (particleType === 'stars' && particles) {
        particles.material.opacity = 0.65 + Math.sin(time * 1.5) * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [particleType, density, reducedMotion]);

  if (reducedMotion || particleType === 'none') {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 pointer-events-none z-[1] overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
