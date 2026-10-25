/**
 * THE GAURAV GAUTAM COSMOS — 3D Universe & Planetary Simulation Engine
 * Engineered with Three.js (r128)
 * - 60 FPS Procedural Solar System representing Gaurav Gautam's Work & Research
 * - Central Core Star + 6 Orbiting Celestial Bodies + Space Stations
 * - Cinematic Camera Warp Drives & Planetary Orbits
 * - Free Flight Controls (WASD / Mouse Pan / Touch)
 * - Holographic HUD Scanners & Direct Project Integration
 */

class UniverseEngine {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.planets = [];
    this.orbitLines = [];
    this.interactiveObjects = [];
    this.starfield = null;
    this.sun = null;
    this.sunCorona = null;

    // Camera states & warping
    this.isWarping = false;
    this.targetCameraPos = new THREE.Vector3(0, 180, 480);
    this.targetLookAt = new THREE.Vector3(0, 0, 0);
    this.currentLookAt = new THREE.Vector3(0, 0, 0);
    this.selectedBody = null;
    this.orbitAngle = 0;

    // Flight controls (WASD)
    this.keys = { w: false, a: false, s: false, d: false, q: false, e: false, shift: false };
    this.flightSpeed = 1.2;
    this.isFreeFlight = false;

    // Mouse / touch interaction
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.spherical = { radius: 520, theta: Math.PI / 4, phi: Math.PI / 3 };

    this.init();
  }

  init() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x04060a, 0.0006);

    this.camera = new THREE.PerspectiveCamera(55, width / height, 1, 6000);
    this.updateCameraOrbit();

    // 2. Renderer with Resilient Fallback
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.2;
      this.container.appendChild(this.renderer.domElement);
    } catch (err) {
      console.warn("[Universe Engine] WebGL hardware unavailable. Activating resilient 2D Cosmos fallback.", err.message);
      this.init2DFallback(width, height);
      return;
    }

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2638, 1.4);
    this.scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0x00f2fe, 3.8, 2400, 0.7);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);

    const secondaryWarmLight = new THREE.PointLight(0xffaa44, 2.2, 1800, 0.9);
    secondaryWarmLight.position.set(0, 0, 0);
    this.scene.add(secondaryWarmLight);

    // 4. Build Celestial Cosmos
    this.createStarfield();
    this.createCentralStar();
    this.createCelestialBodies();

    // 5. Event Listeners
    window.addEventListener("resize", () => this.onWindowResize());
    window.addEventListener("pointermove", (e) => this.onPointerMove(e));
    window.addEventListener("pointerdown", (e) => this.onPointerDown(e));
    window.addEventListener("pointerup", () => this.onPointerUp());
    window.addEventListener("wheel", (e) => this.onWheel(e), { passive: true });
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));

    // Start 60-FPS loop
    this.animate();
  }

  // Generate 3,500 Starfield with varying colors and depths
  createStarfield() {
    const starCount = 3500;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = THREE.MathUtils.randFloat(700, 3200);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloat(-1, 1));

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Star spectral variety: ice blue, warm white, amber
      const spectral = Math.random();
      if (spectral < 0.6) {
        colors[i * 3] = 0.75; colors[i * 3 + 1] = 0.92; colors[i * 3 + 2] = 1.0;
      } else if (spectral < 0.85) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 0.85;
      } else {
        colors[i * 3] = 0.4; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1.0;
      }
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.starfield = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starfield);
  }

  // Central Core Star (Star Gaurav)
  createCentralStar() {
    const sunGeo = new THREE.SphereGeometry(32, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: false
    });
    this.sun = new THREE.Mesh(sunGeo, sunMat);
    this.sun.name = "core_star";
    this.sun.userData = {
      id: "core",
      name: "STAR GAURAV (Core Star)",
      subtitle: "AI/ML Systems · Transformer Research · Full-Stack Architect",
      category: "Central Solar Core",
      type: "Superluminous Stellar Nexus"
    };

    // Inner glowing pulsating wireframe cage
    const cageGeo = new THREE.IcosahedronGeometry(36, 2);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    this.sunCorona = new THREE.Mesh(cageGeo, cageMat);
    this.sun.add(this.sunCorona);

    // Outer plasma corona
    const outerCoronaGeo = new THREE.SphereGeometry(44, 32, 32);
    const outerCoronaMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending
    });
    const outerCorona = new THREE.Mesh(outerCoronaGeo, outerCoronaMat);
    this.sun.add(outerCorona);

    this.scene.add(this.sun);
    this.interactiveObjects.push(this.sun);
  }

  // Create Celestial Planets & Space Stations for every verified project
  createCelestialBodies() {
    const BODIES_DATA = [
      {
        id: "varshapurvanuman",
        name: "PLANET VARSHA",
        subtitle: "India-Scale Regime-Aware AI/ML Rainfall Downscaling (SIH26080)",
        category: "Climate AI & Telemetry",
        orbitRadius: 110,
        orbitSpeed: 0.0075,
        size: 15,
        color: 0x0ea5e9,
        atmosphereColor: 0x38bdf8,
        hasMoon: true,
        moonName: "SAT-IMD",
        rings: false,
        type: "Oceanic Hydro-Atmospheric World"
      },
      {
        id: "railsamanvay",
        name: "PLANET SAMANVAY",
        subtitle: "AI Railway Block Scheduling & Conflict Elimination (SIH26027)",
        category: "Operational Research & Optimization",
        orbitRadius: 180,
        orbitSpeed: 0.0055,
        size: 19,
        color: 0xf59e0b,
        atmosphereColor: 0xfbbf24,
        hasMoon: false,
        rings: true,
        ringInner: 24,
        ringOuter: 36,
        type: "Ringed Industrial Gas Nexus"
      },
      {
        id: "drainsense",
        name: "PLANET HYDROS",
        subtitle: "810-Grid Cell Urban Flood Susceptibility & TreeSHAP (Vijayawada)",
        category: "Urban Hydrology & ML Early Warning",
        orbitRadius: 250,
        orbitSpeed: 0.0042,
        size: 14,
        color: 0x2563eb,
        atmosphereColor: 0x60a5fa,
        hasMoon: true,
        moonName: "SRTM-30M",
        rings: false,
        type: "Topographic Flood Inundation Sphere"
      },
      {
        id: "smartroutefinder",
        name: "PLANET WAYPOINT",
        subtitle: "Multi-Criteria Graph Pathfinding on OpenStreetMap (OSMnx / A*)",
        category: "Graph Theory & Algorithmic Systems",
        orbitRadius: 320,
        orbitSpeed: 0.0032,
        size: 13,
        color: 0x10b981,
        atmosphereColor: 0x34d399,
        hasMoon: false,
        rings: true,
        ringInner: 16,
        ringOuter: 23,
        type: "Topological Cyber-Graph Matrix"
      },
      {
        id: "research",
        name: "NEBULA OBSERVATORY",
        subtitle: "IIT Bhubaneswar & SRM University-AP (CoFi Pruning & QA-LoRA >95%)",
        category: "Transformer Compression Deep Space Station",
        orbitRadius: 395,
        orbitSpeed: 0.0022,
        size: 11,
        color: 0x8b5cf6,
        atmosphereColor: 0xc084fc,
        hasMoon: false,
        rings: false,
        isStation: true,
        type: "Orbital Deep Learning Laboratory"
      },
      {
        id: "about",
        name: "THE ACADEMY CITADEL",
        subtitle: "SRM University-AP (B.Tech CSE, CGPA 9.49, Coding Club Convenor)",
        category: "Academic Command & Leadership",
        orbitRadius: 460,
        orbitSpeed: 0.0016,
        size: 12,
        color: 0xe2e8f0,
        atmosphereColor: 0x38bdf8,
        hasMoon: false,
        rings: true,
        ringInner: 15,
        ringOuter: 22,
        isStation: true,
        type: "Institutional Command Hub"
      },
      {
        id: "contact",
        name: "QUANTUM BEACON",
        subtitle: "Direct Contact, Resume Download, LinkedIn & GitHub Transmissions",
        category: "Subspace Transmission Array",
        orbitRadius: 525,
        orbitSpeed: 0.0012,
        size: 9,
        color: 0x00f2fe,
        atmosphereColor: 0x67e8f9,
        hasMoon: false,
        rings: false,
        isStation: true,
        type: "Interstellar Transmission Relay"
      }
    ];

    BODIES_DATA.forEach((data, index) => {
      // 1. Orbital Track Line
      const orbitGeo = new THREE.BufferGeometry();
      const segments = 128;
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * data.orbitRadius, 0, Math.sin(theta) * data.orbitRadius));
      }
      orbitGeo.setFromPoints(points);
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x1e293b,
        transparent: true,
        opacity: 0.35
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      this.scene.add(orbitLine);
      this.orbitLines.push({ line: orbitLine, defaultOpacity: 0.35 });

      // 2. Planet Mesh
      let mesh;
      if (data.isStation) {
        // Space Station / Laboratory Model
        const stationGeo = new THREE.OctahedronGeometry(data.size, 1);
        const stationMat = new THREE.MeshStandardMaterial({
          color: data.color,
          roughness: 0.25,
          metalness: 0.85,
          wireframe: false
        });
        mesh = new THREE.Mesh(stationGeo, stationMat);

        // Rotating Solar Arrays
        const panelGeo = new THREE.BoxGeometry(data.size * 2.8, 1.2, data.size * 0.8);
        const panelMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
        const panel = new THREE.Mesh(panelGeo, panelMat);
        mesh.add(panel);
      } else {
        // Spherical Planet with procedural atmospheric surface
        const planetGeo = new THREE.SphereGeometry(data.size, 36, 36);
        const planetMat = new THREE.MeshStandardMaterial({
          color: data.color,
          roughness: 0.55,
          metalness: 0.2
        });
        mesh = new THREE.Mesh(planetGeo, planetMat);

        // Atmosphere Glow Shell
        const atmoGeo = new THREE.SphereGeometry(data.size * 1.14, 32, 32);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: data.atmosphereColor,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending
        });
        const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
        mesh.add(atmoMesh);
      }

      // Planetary Rings (e.g. Samanvay, Waypoint, Academy)
      if (data.rings) {
        const ringGeo = new THREE.RingGeometry(data.ringInner, data.ringOuter, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: data.atmosphereColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        mesh.add(ringMesh);
      }

      // Moons (e.g. Varsha, Hydros)
      if (data.hasMoon) {
        const moonGeo = new THREE.SphereGeometry(data.size * 0.22, 16, 16);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(data.size * 2.2, 0, 0);
        mesh.add(moonMesh);
        mesh.userData.moon = moonMesh;
      }

      // Random starting orbital angle for natural dispersion
      const startAngle = (index / BODIES_DATA.length) * Math.PI * 2 + Math.random() * 0.5;
      mesh.position.set(Math.cos(startAngle) * data.orbitRadius, 0, Math.sin(startAngle) * data.orbitRadius);

      mesh.name = `planet_${data.id}`;
      mesh.userData = { ...data, currentAngle: startAngle, orbitLineIndex: index };

      this.scene.add(mesh);
      this.planets.push(mesh);
      this.interactiveObjects.push(mesh);
    });
  }

  // Camera Orbit Controls Update
  updateCameraOrbit() {
    this.camera.position.x = this.spherical.radius * Math.sin(this.spherical.phi) * Math.cos(this.spherical.theta);
    this.camera.position.y = this.spherical.radius * Math.cos(this.spherical.phi);
    this.camera.position.z = this.spherical.radius * Math.sin(this.spherical.phi) * Math.sin(this.spherical.theta);
    this.camera.lookAt(this.currentLookAt);
  }

  // Mouse / Pointer Drag handling
  onPointerDown(e) {
    if (e.target.closest("#universe-hud, #planetary-terminal, #recruiter-dossier-modal")) return;
    this.isDragging = true;
    this.prevMousePos = { x: e.clientX, y: e.clientY };
    this.totalDragDist = 0;
  }

  onPointerMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // Camera orbit rotation while dragging
    if (this.isDragging && !this.selectedBody) {
      const deltaX = e.clientX - this.prevMousePos.x;
      const deltaY = e.clientY - this.prevMousePos.y;
      this.totalDragDist = (this.totalDragDist || 0) + Math.abs(deltaX) + Math.abs(deltaY);

      this.spherical.theta -= deltaX * 0.005;
      this.spherical.phi = Math.max(0.15, Math.min(Math.PI - 0.15, this.spherical.phi - deltaY * 0.005));

      this.updateCameraOrbit();
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    }

    // Hover Highlight Check
    this.checkHover();
  }

  onPointerUp(e) {
    // If pointer was clicked without dragging, check for planetary raycast selection
    if (this.isDragging && (this.totalDragDist || 0) < 8 && !this.isWarping && this.camera) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);
      if (intersects.length > 0) {
        let rootObj = intersects[0].object;
        while (rootObj.parent && rootObj.parent !== this.scene) {
          rootObj = rootObj.parent;
        }
        if (rootObj.userData && rootObj.userData.id) {
          this.warpToBody(rootObj.userData.id);
        }
      }
    }
    this.isDragging = false;
  }

  onWheel(e) {
    if (this.selectedBody) return;
    this.spherical.radius = Math.max(120, Math.min(1200, this.spherical.radius + e.deltaY * 0.45));
    this.updateCameraOrbit();
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Interactive Raycaster Hover Detection
  checkHover() {
    if (!this.camera || this.isWarping) return;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    const tooltip = document.getElementById("planet-hover-tooltip");

    if (intersects.length > 0) {
      let rootObj = intersects[0].object;
      while (rootObj.parent && rootObj.parent !== this.scene) {
        rootObj = rootObj.parent;
      }

      if (rootObj.userData && rootObj.userData.name) {
        document.body.style.cursor = "pointer";
        if (tooltip) {
          tooltip.innerHTML = `
            <div style="font-size:0.65rem; color:#38bdf8; text-transform:uppercase; letter-spacing:0.1em; font-weight:800;">${rootObj.userData.category || "Celestial Body"}</div>
            <div style="font-size:0.95rem; font-weight:800; color:#fff;">${rootObj.userData.name}</div>
            <div style="font-size:0.75rem; color:#94a3b8; margin-top:2px;">[Click to Warp & Inspect Orbit]</div>
          `;
          tooltip.style.left = `${(this.mouse.x * 0.5 + 0.5) * window.innerWidth + 18}px`;
          tooltip.style.top = `${(-this.mouse.y * 0.5 + 0.5) * window.innerHeight - 20}px`;
          tooltip.classList.add("visible");
        }
        return;
      }
    }

    document.body.style.cursor = "default";
    if (tooltip) tooltip.classList.remove("visible");
  }

  // Keyboard navigation & WASD thrusters
  onKeyDown(e) {
    const key = e.key.toLowerCase();
    if (this.keys.hasOwnProperty(key)) this.keys[key] = true;
    if (e.key === "Shift") this.keys.shift = true;
    if (e.key === "Escape") this.disengageOrbit();
  }

  onKeyUp(e) {
    const key = e.key.toLowerCase();
    if (this.keys.hasOwnProperty(key)) this.keys[key] = false;
    if (e.key === "Shift") this.keys.shift = false;
  }

  // Cinematic Warp Drive to Planet
  warpToBody(bodyId) {
    let target = null;
    if (bodyId === "core") target = this.sun;
    else target = this.planets.find((p) => p.userData.id === bodyId);

    if (!target) return;

    this.selectedBody = target;
    this.isWarping = true;
    window.spaceAudio?.playWarp();

    // Trigger Planetary Terminal UI
    if (window.onPlanetSelected) {
      window.onPlanetSelected(target.userData);
    }
  }

  // Return to Macroscopic Solar System View
  disengageOrbit() {
    this.selectedBody = null;
    this.isWarping = true;
    this.targetCameraPos.set(0, 220, 560);
    this.targetLookAt.set(0, 0, 0);

    if (window.onOrbitDisengaged) {
      window.onOrbitDisengaged();
    }
    window.spaceAudio?.playChime();
  }

  // Main 60-FPS Animation Loop
  animate() {
    requestAnimationFrame(() => this.animate());

    const time = performance.now() * 0.001;

    // 1. Sun Corona Pulsation
    if (this.sun && this.sunCorona) {
      this.sun.rotation.y += 0.003;
      this.sunCorona.rotation.x -= 0.005;
      this.sunCorona.rotation.y -= 0.007;
      const pulse = 1 + Math.sin(time * 2.5) * 0.06;
      this.sunCorona.scale.set(pulse, pulse, pulse);
    }

    // 2. Planets Orbital Revolution & Axial Rotation
    this.planets.forEach((planet) => {
      planet.rotation.y += 0.015;

      // Orbit around sun
      if (!this.selectedBody || this.selectedBody !== planet) {
        planet.userData.currentAngle += planet.userData.orbitSpeed * 0.5;
        const radius = planet.userData.orbitRadius;
        planet.position.x = Math.cos(planet.userData.currentAngle) * radius;
        planet.position.z = Math.sin(planet.userData.currentAngle) * radius;
      }

      // Moon rotation
      if (planet.userData.moon) {
        planet.userData.moon.rotation.y += 0.04;
      }
    });

    // 3. Camera Interpolation (Warping & Orbital Tracking)
    if (this.selectedBody) {
      // Camera smoothly orbits the selected body at close range
      this.orbitAngle += 0.008;
      const viewDist = this.selectedBody.userData.size ? this.selectedBody.userData.size * 3.4 : 70;
      const camOffset = new THREE.Vector3(
        Math.cos(this.orbitAngle) * viewDist,
        viewDist * 0.45,
        Math.sin(this.orbitAngle) * viewDist
      );

      this.targetCameraPos.copy(this.selectedBody.position).add(camOffset);
      this.targetLookAt.copy(this.selectedBody.position);

      this.camera.position.lerp(this.targetCameraPos, 0.06);
      this.currentLookAt.lerp(this.targetLookAt, 0.08);
      this.camera.lookAt(this.currentLookAt);
    } else if (this.isWarping) {
      this.camera.position.lerp(this.targetCameraPos, 0.05);
      this.currentLookAt.lerp(this.targetLookAt, 0.06);
      this.camera.lookAt(this.currentLookAt);

      if (this.camera.position.distanceTo(this.targetCameraPos) < 2) {
        this.isWarping = false;
      }
    }

    // 4. Free-Flight WASD Thrusters (if engaged)
    if (this.isFreeFlight && !this.selectedBody) {
      const speed = this.keys.shift ? this.flightSpeed * 2.5 : this.flightSpeed;
      const forward = new THREE.Vector3();
      this.camera.getWorldDirection(forward);
      const right = new THREE.Vector3().crossVectors(forward, this.camera.up).normalize();

      if (this.keys.w) this.camera.position.addScaledVector(forward, speed);
      if (this.keys.s) this.camera.position.addScaledVector(forward, -speed);
      if (this.keys.d) this.camera.position.addScaledVector(right, speed);
      if (this.keys.a) this.camera.position.addScaledVector(right, -speed);
      if (this.keys.q) this.camera.position.y += speed;
      if (this.keys.e) this.camera.position.y -= speed;
    }

    // Starfield gentle rotation
    if (this.starfield) {
      this.starfield.rotation.y = time * 0.00015;
    }

    this.renderer.render(this.scene, this.camera);
  }

  // Resilient 2D HTML5 Canvas Fallback for environments lacking hardware WebGL
  init2DFallback(width, height) {
    this.is2DFallback = true;
    const canvas = document.createElement("canvas");
    canvas.id = "universe-canvas-2d";
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    this.container.appendChild(canvas);
    this.canvas2D = canvas;
    this.ctx2D = canvas.getContext("2d");

    this.sun = {
      name: "core_star",
      position: { x: 0, y: 0, z: 0 },
      userData: {
        id: "core",
        name: "STAR GAURAV (Core Star)",
        subtitle: "AI/ML Systems · Transformer Research · Full-Stack Architect",
        category: "Central Solar Core",
        type: "Superluminous Stellar Nexus",
        size: 26,
        color: "#38bdf8"
      }
    };

    const BODIES_DATA = [
      { id: "varshapurvanuman", name: "PLANET VARSHA", subtitle: "India-Scale Regime-Aware AI/ML Rainfall Downscaling (SIH26080)", category: "Climate AI & Telemetry", orbitRadius: 100, orbitSpeed: 0.012, size: 12, color: "#0ea5e9", rings: false, hasMoon: true },
      { id: "railsamanvay", name: "PLANET SAMANVAY", subtitle: "AI Railway Block Scheduling & Conflict Elimination (SIH26027)", category: "Operational Research & Optimization", orbitRadius: 155, orbitSpeed: 0.009, size: 14, color: "#f59e0b", rings: true, hasMoon: false },
      { id: "drainsense", name: "PLANET HYDROS", subtitle: "810-Grid Cell Urban Flood Susceptibility & TreeSHAP (Vijayawada)", category: "Urban Hydrology & ML Early Warning", orbitRadius: 210, orbitSpeed: 0.007, size: 11, color: "#2563eb", rings: false, hasMoon: true },
      { id: "smartroutefinder", name: "PLANET WAYPOINT", subtitle: "Multi-Criteria Graph Pathfinding on OpenStreetMap (OSMnx / A*)", category: "Graph Theory & Algorithmic Systems", orbitRadius: 265, orbitSpeed: 0.0055, size: 10, color: "#10b981", rings: true, hasMoon: false },
      { id: "research", name: "NEBULA OBSERVATORY", subtitle: "IIT Bhubaneswar & SRM University-AP (CoFi Pruning & QA-LoRA >95%)", category: "Transformer Compression Deep Space Station", orbitRadius: 320, orbitSpeed: 0.004, size: 9, color: "#8b5cf6", rings: false, isStation: true },
      { id: "about", name: "THE ACADEMY CITADEL", subtitle: "SRM University-AP (B.Tech CSE, CGPA 9.49, Coding Club Convenor)", category: "Academic Command & Leadership", orbitRadius: 375, orbitSpeed: 0.003, size: 10, color: "#e2e8f0", rings: true, isStation: true },
      { id: "contact", name: "QUANTUM BEACON", subtitle: "Direct Contact, Resume Download, LinkedIn & GitHub Transmissions", category: "Subspace Transmission Array", orbitRadius: 430, orbitSpeed: 0.002, size: 8, color: "#00f2fe", rings: false, isStation: true }
    ];

    this.planets = BODIES_DATA.map((b, idx) => ({
      name: b.name,
      position: { x: b.orbitRadius, y: 0, z: 0 },
      userData: { ...b, currentAngle: (idx * Math.PI * 2) / BODIES_DATA.length }
    }));

    this.stars2D = Array.from({ length: 250 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.02 + 0.005
    }));

    this.pan2D = { x: width / 2, y: height / 2, scale: 1 };

    window.addEventListener("resize", () => {
      if (!this.canvas2D) return;
      this.canvas2D.width = window.innerWidth;
      this.canvas2D.height = window.innerHeight;
      this.pan2D.x = window.innerWidth / 2;
      this.pan2D.y = window.innerHeight / 2;
    });

    this.canvas2D.addEventListener("click", (e) => {
      const rect = this.canvas2D.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      for (const planet of this.planets) {
        const px = this.pan2D.x + planet.position.x * this.pan2D.scale;
        const py = this.pan2D.y + planet.position.y * this.pan2D.scale;
        const dist = Math.hypot(clickX - px, clickY - py);
        if (dist <= (planet.userData.size + 12) * this.pan2D.scale) {
          this.warpToBody(planet.userData.id);
          return;
        }
      }

      const sunDist = Math.hypot(clickX - this.pan2D.x, clickY - this.pan2D.y);
      if (sunDist <= 35 * this.pan2D.scale) {
        this.warpToBody("core");
      }
    });

    this.animate2D();
  }

  animate2D() {
    if (!this.is2DFallback) return;
    requestAnimationFrame(() => this.animate2D());
    const ctx = this.ctx2D;
    const w = this.canvas2D.width;
    const h = this.canvas2D.height;

    if (this.selectedBody) {
      this.pan2D.scale += (1.35 - this.pan2D.scale) * 0.05;
      const targetX = w / 2 - this.selectedBody.position.x * this.pan2D.scale;
      const targetY = h / 2 - this.selectedBody.position.y * this.pan2D.scale;
      this.pan2D.x += (targetX - this.pan2D.x) * 0.05;
      this.pan2D.y += (targetY - this.pan2D.y) * 0.05;
    } else {
      this.pan2D.scale += (1 - this.pan2D.scale) * 0.05;
      this.pan2D.x += (w / 2 - this.pan2D.x) * 0.05;
      this.pan2D.y += (h / 2 - this.pan2D.y) * 0.05;
    }

    ctx.fillStyle = "#04060a";
    ctx.fillRect(0, 0, w, h);

    for (const s of this.stars2D) {
      s.alpha += Math.sin(Date.now() * s.speed) * 0.01;
      ctx.fillStyle = `rgba(200, 230, 255, ${Math.max(0.2, Math.min(1, s.alpha))})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.lineWidth = 1;
    for (const p of this.planets) {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.14)";
      ctx.beginPath();
      ctx.arc(this.pan2D.x, this.pan2D.y, p.userData.orbitRadius * this.pan2D.scale, 0, Math.PI * 2);
      ctx.stroke();
    }

    const sunGrad = ctx.createRadialGradient(this.pan2D.x, this.pan2D.y, 4, this.pan2D.x, this.pan2D.y, 35 * this.pan2D.scale);
    sunGrad.addColorStop(0, "#ffffff");
    sunGrad.addColorStop(0.3, "#38bdf8");
    sunGrad.addColorStop(0.7, "rgba(56, 189, 248, 0.35)");
    sunGrad.addColorStop(1, "rgba(99, 102, 241, 0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(this.pan2D.x, this.pan2D.y, 35 * this.pan2D.scale, 0, Math.PI * 2);
    ctx.fill();

    for (const p of this.planets) {
      p.userData.currentAngle += p.userData.orbitSpeed;
      p.position.x = Math.cos(p.userData.currentAngle) * p.userData.orbitRadius;
      p.position.y = Math.sin(p.userData.currentAngle) * (p.userData.orbitRadius * 0.7);

      const px = this.pan2D.x + p.position.x * this.pan2D.scale;
      const py = this.pan2D.y + p.position.y * this.pan2D.scale;
      const size = p.userData.size * this.pan2D.scale * 0.7;

      const glowGrad = ctx.createRadialGradient(px, py, 1, px, py, size * 2.2);
      glowGrad.addColorStop(0, p.userData.color);
      glowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(px, py, size * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.userData.color;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();

      if (p.userData.rings) {
        ctx.strokeStyle = "rgba(251, 191, 36, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(px, py, size * 2, size * 0.8, -Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(p.userData.name.replace("PLANET ", ""), px, py + size + 14);
    }
  }
}
