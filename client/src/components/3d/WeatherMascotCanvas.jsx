import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { useWeather } from '../../context/WeatherContext';
import { useTheme } from '../../context/ThemeContext';

export default function WeatherMascotCanvas({ className = '' }) {
  const containerRef = useRef(null);
  const { weatherState } = useWeather();
  const { reducedMotion } = useTheme();
  
  const mascotState = weatherState?.mascot || {};
  const accessories = mascotState.accessories || {};

  // Store refs to 3D objects for dynamic animation
  const sceneRef = useRef(null);
  const mascotGroupRef = useRef(null);
  const headGroupRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const leftEyelidRef = useRef(null);
  const rightEyelidRef = useRef(null);
  const leftWingRef = useRef(null);
  const rightWingRef = useRef(null);
  const accessoriesGroupRef = useRef(null);

  // Mouse tracking target
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);
  const isJumping = useRef(false);
  const jumpTime = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 3.8);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(2, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // 4. Mascot Group Hierarchy
    const mascotGroup = new THREE.Group();
    mascotGroup.position.y = -0.35;
    scene.add(mascotGroup);
    mascotGroupRef.current = mascotGroup;

    // Materials (Stylized soft toy / vinyl cartoon look)
    const featherMaterial = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.35,
      metalness: 0.05
    });

    const beakMaterial = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.25,
      metalness: 0.1
    });

    const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.1
    });

    const pupilMaterial = new THREE.MeshBasicMaterial({
      color: 0x0f172a
    });

    const cheekMaterial = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.5
    });

    // --- Torso / Body ---
    const bodyGeometry = new THREE.SphereGeometry(0.65, 32, 32);
    bodyGeometry.scale(1, 0.9, 0.95);
    const body = new THREE.Mesh(bodyGeometry, featherMaterial);
    body.position.y = 0.45;
    body.castShadow = true;
    mascotGroup.add(body);

    // Belly fluff patch
    const bellyGeo = new THREE.SphereGeometry(0.5, 24, 24);
    bellyGeo.scale(0.85, 0.8, 0.4);
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4 });
    const belly = new THREE.Mesh(bellyGeo, bellyMat);
    belly.position.set(0, 0.4, 0.46);
    mascotGroup.add(belly);

    // --- Wings ---
    const wingGeo = new THREE.SphereGeometry(0.28, 20, 20);
    wingGeo.scale(0.35, 1.2, 0.65);

    const leftWing = new THREE.Mesh(wingGeo, featherMaterial);
    leftWing.position.set(-0.62, 0.45, 0);
    leftWing.rotation.z = 0.25;
    mascotGroup.add(leftWing);
    leftWingRef.current = leftWing;

    const rightWing = new THREE.Mesh(wingGeo, featherMaterial);
    rightWing.position.set(0.62, 0.45, 0);
    rightWing.rotation.z = -0.25;
    mascotGroup.add(rightWing);
    rightWingRef.current = rightWing;

    // --- Feet ---
    const footGeo = new THREE.BoxGeometry(0.25, 0.08, 0.38);
    const leftFoot = new THREE.Mesh(footGeo, beakMaterial);
    leftFoot.position.set(-0.25, -0.05, 0.1);
    leftFoot.rotation.y = 0.15;
    mascotGroup.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeo, beakMaterial);
    rightFoot.position.set(0.25, -0.05, 0.1);
    rightFoot.rotation.y = -0.15;
    mascotGroup.add(rightFoot);

    // --- Head Group ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.05, 0.05);
    mascotGroup.add(headGroup);
    headGroupRef.current = headGroup;

    const headGeo = new THREE.SphereGeometry(0.52, 32, 32);
    const head = new THREE.Mesh(headGeo, featherMaterial);
    head.castShadow = true;
    headGroup.add(head);

    // Head Tuft Feathers
    const tuftGeo = new THREE.ConeGeometry(0.09, 0.26, 16);
    const tuft1 = new THREE.Mesh(tuftGeo, featherMaterial);
    tuft1.position.set(0, 0.58, 0);
    tuft1.rotation.z = -0.15;
    headGroup.add(tuft1);

    const tuft2 = new THREE.Mesh(tuftGeo, featherMaterial);
    tuft2.position.set(0.08, 0.56, -0.04);
    tuft2.rotation.z = -0.35;
    tuft2.scale.set(0.8, 0.8, 0.8);
    headGroup.add(tuft2);

    // Cute Cheeks
    const cheekGeo = new THREE.CircleGeometry(0.08, 16);
    const leftCheek = new THREE.Mesh(cheekGeo, cheekMaterial);
    leftCheek.position.set(-0.32, -0.08, 0.42);
    leftCheek.rotation.y = -0.6;
    headGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, cheekMaterial);
    rightCheek.position.set(0.32, -0.08, 0.42);
    rightCheek.rotation.y = 0.6;
    headGroup.add(rightCheek);

    // Duck Bill (Beak)
    const upperBillGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.28, 24);
    upperBillGeo.scale(1.2, 0.35, 1.2);
    const upperBill = new THREE.Mesh(upperBillGeo, beakMaterial);
    upperBill.position.set(0, -0.05, 0.52);
    upperBill.rotation.x = 0.15;
    headGroup.add(upperBill);

    // --- Expressive 3D Eyes ---
    const eyeGeo = new THREE.SphereGeometry(0.14, 24, 24);
    eyeGeo.scale(0.85, 1.1, 0.45);

    // Left Eye
    const leftEye = new THREE.Mesh(eyeGeo, eyeWhiteMaterial);
    leftEye.position.set(-0.19, 0.1, 0.42);
    leftEye.rotation.y = -0.2;
    headGroup.add(leftEye);
    leftEyeRef.current = leftEye;

    const pupilGeo = new THREE.SphereGeometry(0.065, 16, 16);
    pupilGeo.scale(1, 1.1, 0.2);
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMaterial);
    leftPupil.position.set(0, 0, 0.08);
    leftEye.add(leftPupil);
    leftPupilRef.current = leftPupil;

    // Left Eye Sparkle (Anime glint)
    const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sparkle1 = new THREE.Mesh(new THREE.CircleGeometry(0.022, 12), sparkleMat);
    sparkle1.position.set(0.015, 0.02, 0.095);
    leftEye.add(sparkle1);

    // Right Eye
    const rightEye = new THREE.Mesh(eyeGeo, eyeWhiteMaterial);
    rightEye.position.set(0.19, 0.1, 0.42);
    rightEye.rotation.y = 0.2;
    headGroup.add(rightEye);
    rightEyeRef.current = rightEye;

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMaterial);
    rightPupil.position.set(0, 0, 0.08);
    rightEye.add(rightPupil);
    rightPupilRef.current = rightPupil;

    const sparkle2 = new THREE.Mesh(new THREE.CircleGeometry(0.022, 12), sparkleMat);
    sparkle2.position.set(0.015, 0.02, 0.095);
    rightEye.add(sparkle2);

    // Eyelids for blinking
    const eyelidMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
    const eyelidGeo = new THREE.SphereGeometry(0.145, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    eyelidGeo.scale(0.88, 1.12, 0.48);

    const leftEyelid = new THREE.Mesh(eyelidGeo, eyelidMat);
    leftEyelid.position.set(0, 0.02, 0);
    leftEyelid.rotation.x = -Math.PI * 0.5; // Open by default
    leftEye.add(leftEyelid);
    leftEyelidRef.current = leftEyelid;

    const rightEyelid = new THREE.Mesh(eyelidGeo, eyelidMat);
    rightEyelid.position.set(0, 0.02, 0);
    rightEyelid.rotation.x = -Math.PI * 0.5;
    rightEye.add(rightEyelid);
    rightEyelidRef.current = rightEyelid;

    // --- Dynamic Weather Accessories Container ---
    const accessoriesGroup = new THREE.Group();
    mascotGroup.add(accessoriesGroup);
    accessoriesGroupRef.current = accessoriesGroup;

    // 5. Mouse Move Handler
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTarget.current = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
    };

    const handleMouseEnter = () => { isHovered.current = true; };
    const handleMouseLeave = () => {
      isHovered.current = false;
      mouseTarget.current = { x: 0, y: 0 };
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 6. Click Handler - Hop and Confetti!
    const handleClick = (e) => {
      if (!isJumping.current) {
        isJumping.current = true;
        jumpTime.current = 0;
        
        // Confetti burst from click position
        const rect = container.getBoundingClientRect();
        const originX = (rect.left + rect.width / 2) / window.innerWidth;
        const originY = (rect.top + rect.height / 2) / window.innerHeight;
        
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { x: originX, y: originY },
          colors: ['#facc15', '#38bdf8', '#f97316', '#fbbf24']
        });
      }
    };
    container.addEventListener('click', handleClick);

    // 7. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();
    let blinkTimer = 0;
    let isBlinking = false;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (reducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      // Smooth mouse interpolation
      mouseCurrent.current.x = THREE.MathUtils.lerp(mouseCurrent.current.x, mouseTarget.current.x, 0.08);
      mouseCurrent.current.y = THREE.MathUtils.lerp(mouseCurrent.current.y, mouseTarget.current.y, 0.08);

      // Head & Eye Tracking
      if (headGroupRef.current) {
        headGroupRef.current.rotation.y = mouseCurrent.current.x * 0.45;
        headGroupRef.current.rotation.x = -mouseCurrent.current.y * 0.3;
        headGroupRef.current.rotation.z = -mouseCurrent.current.x * 0.1;
      }

      // Pupil look-at offset
      if (leftPupilRef.current && rightPupilRef.current) {
        const pupilX = mouseCurrent.current.x * 0.03;
        const pupilY = mouseCurrent.current.y * 0.03;
        leftPupilRef.current.position.set(pupilX, pupilY, 0.08);
        rightPupilRef.current.position.set(pupilX, pupilY, 0.08);
      }

      // Gentle Breathing
      if (mascotGroupRef.current) {
        const breath = Math.sin(time * 2.5) * 0.02;
        body.scale.set(1 + breath * 0.5, 0.9 + breath, 0.95 + breath * 0.5);
        mascotGroupRef.current.position.y = -0.35 + Math.sin(time * 2) * 0.025;

        // Wing gentle flap/sway
        if (leftWingRef.current && rightWingRef.current) {
          const wingSway = Math.sin(time * 3) * 0.06;
          leftWingRef.current.rotation.z = 0.25 + wingSway;
          rightWingRef.current.rotation.z = -0.25 - wingSway;
        }
      }

      // Jump Animation on Click
      if (isJumping.current && mascotGroupRef.current) {
        jumpTime.current += delta * 4.5;
        const jumpProgress = jumpTime.current;
        if (jumpProgress <= Math.PI) {
          mascotGroupRef.current.position.y = -0.35 + Math.sin(jumpProgress) * 0.4;
          mascotGroupRef.current.rotation.y = Math.sin(jumpProgress) * 0.35;
          if (leftWingRef.current && rightWingRef.current) {
            leftWingRef.current.rotation.z = 0.25 + Math.sin(jumpProgress * 3) * 0.4;
            rightWingRef.current.rotation.z = -0.25 - Math.sin(jumpProgress * 3) * 0.4;
          }
        } else {
          isJumping.current = false;
          mascotGroupRef.current.position.y = -0.35;
          mascotGroupRef.current.rotation.y = 0;
        }
      }

      // Blinking Loop (every 3-5 seconds)
      blinkTimer += delta;
      if (blinkTimer > 3.5 && !isBlinking) {
        isBlinking = true;
      }
      if (isBlinking) {
        const blinkProgress = (blinkTimer - 3.5) / 0.18;
        if (blinkProgress <= 1) {
          const eyelidAngle = -Math.PI * 0.5 + Math.sin(blinkProgress * Math.PI) * Math.PI * 0.5;
          if (leftEyelidRef.current && rightEyelidRef.current) {
            leftEyelidRef.current.rotation.x = eyelidAngle;
            rightEyelidRef.current.rotation.x = eyelidAngle;
          }
        } else {
          isBlinking = false;
          blinkTimer = Math.random() * 1.5; // Randomize next blink
          if (leftEyelidRef.current && rightEyelidRef.current) {
            leftEyelidRef.current.rotation.x = -Math.PI * 0.5;
            rightEyelidRef.current.rotation.x = -Math.PI * 0.5;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  // Update 3D Accessories whenever weather state changes
  useEffect(() => {
    const accGroup = accessoriesGroupRef.current;
    const headGroup = headGroupRef.current;
    if (!accGroup || !headGroup) return;

    // Clear old accessories
    while (accGroup.children.length > 0) {
      accGroup.remove(accGroup.children[0]);
    }

    // 1. Sunglasses (Sunny / Heat)
    if (accessories.sunglasses) {
      const glassesGroup = new THREE.Group();
      glassesGroup.position.set(0, 0.1, 0.44);

      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        metalness: 0.9,
        roughness: 0.1
      });
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.8,
        roughness: 0.2
      });

      // Left lens
      const leftLens = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.02, 24), glassMat);
      leftLens.rotation.x = Math.PI / 2;
      leftLens.position.set(-0.2, 0, 0);
      glassesGroup.add(leftLens);

      // Right lens
      const rightLens = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.02, 24), glassMat);
      rightLens.rotation.x = Math.PI / 2;
      rightLens.position.set(0.2, 0, 0);
      glassesGroup.add(rightLens);

      // Bridge
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.025, 0.02), frameMat);
      bridge.position.set(0, 0, 0);
      glassesGroup.add(bridge);

      accGroup.add(glassesGroup);
    }

    // 2. Umbrella (Rain / Thunderstorm)
    if (accessories.umbrella) {
      const umbrellaGroup = new THREE.Group();
      umbrellaGroup.position.set(-0.7, 0.9, 0.2);
      umbrellaGroup.rotation.z = 0.2;
      umbrellaGroup.rotation.x = -0.15;

      const canopyMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.3,
        side: THREE.DoubleSide
      });
      const handleMat = new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.5
      });

      // Canopy dome
      const canopy = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45),
        canopyMat
      );
      canopy.position.set(0, 0.5, 0);
      umbrellaGroup.add(canopy);

      // Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 12), handleMat);
      shaft.position.set(0, 0.15, 0);
      umbrellaGroup.add(shaft);

      // Curved hook handle
      const hook = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 12, 16, Math.PI), handleMat);
      hook.position.set(0.05, -0.3, 0);
      hook.rotation.z = Math.PI;
      umbrellaGroup.add(hook);

      accGroup.add(umbrellaGroup);
    }

    // 3. Yellow Raincoat / Sou'wester (Rain)
    if (accessories.raincoat) {
      const coatMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.25,
        metalness: 0.05
      });
      const coat = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.68, 0.5, 24), coatMat);
      coat.position.set(0, 0.42, 0);
      accGroup.add(coat);
    }

    // 4. Winter Beanie & Warm Scarf (Snow / Blizzard)
    if (accessories.beanie) {
      const beanieGroup = new THREE.Group();
      beanieGroup.position.set(0, 1.45, 0.05);

      const woolMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.8
      });
      const pomPomMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9
      });

      // Beanie dome
      const hat = new THREE.Mesh(new THREE.SphereGeometry(0.54, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), woolMat);
      beanieGroup.add(hat);

      // Pom-pom on top
      const pomPom = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), pomPomMat);
      pomPom.position.set(0, 0.54, 0);
      beanieGroup.add(pomPom);

      accGroup.add(beanieGroup);
    }

    if (accessories.scarf) {
      const scarfMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.75
      });
      const scarfRing = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.09, 16, 32), scarfMat);
      scarfRing.rotation.x = Math.PI / 2;
      scarfRing.position.set(0, 0.82, 0.05);
      accGroup.add(scarfRing);

      // Hanging scarf end
      const scarfEnd = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.4, 0.04), scarfMat);
      scarfEnd.position.set(0.24, 0.58, 0.46);
      scarfEnd.rotation.z = -0.15;
      accGroup.add(scarfEnd);
    }

    // 5. Starry Night Sleeping Cap (Clear Night)
    if (accessories.sleepingCap) {
      const capGroup = new THREE.Group();
      capGroup.position.set(0, 1.35, 0);

      const capMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        roughness: 0.6
      });
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.7, 24), capMat);
      cone.rotation.z = -0.4;
      cone.position.set(0.15, 0.25, -0.05);
      capGroup.add(cone);

      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
      ball.position.set(0.38, 0.52, -0.05);
      capGroup.add(ball);

      accGroup.add(capGroup);
    }

    // 6. Mist Lantern (Fog)
    if (accessories.lantern) {
      const lanternGroup = new THREE.Group();
      lanternGroup.position.set(0.68, 0.6, 0.35);

      const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 });
      const glowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

      const lanternBody = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.24, 12), brassMat);
      lanternGroup.add(lanternBody);

      const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 12), glowMat);
      lanternGroup.add(glass);

      // Small point light for the lantern
      const lanternLight = new THREE.PointLight(0xfef08a, 1.5, 2);
      lanternGroup.add(lanternLight);

      accGroup.add(lanternGroup);
    }
  }, [accessories]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D Mascot Canvas */}
      <div 
        ref={containerRef} 
        className="w-72 h-72 sm:w-80 sm:h-80 cursor-pointer relative z-10 transition-transform duration-300 hover:scale-[1.03] active:scale-95"
        title="Fon the Weather Duck (Click me!)"
        role="img"
        aria-label="Interactive 3D mascot Fon reacting to local weather"
      />

      {/* Floating Dialogue Speech Bubble */}
      {mascotState?.dialogue && (
        <div className="relative -mt-4 z-20 max-w-[280px] sm:max-w-xs px-4 py-2.5 rounded-2xl bg-slate-900/85 dark:bg-slate-950/85 backdrop-blur-md border border-white/10 shadow-xl text-center animate-float">
          {/* Speech bubble arrow pointer */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-slate-900/85 dark:bg-slate-950/85 border-t border-l border-white/10" />
          <p className="text-xs sm:text-sm font-medium text-slate-200 leading-snug">
            "{mascotState.dialogue}"
          </p>
          <span className="block mt-1 text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
            Fon the Duck
          </span>
        </div>
      )}
    </div>
  );
}
