/**
 * Gaurav Gautam Portfolio — Subtle Interactive 3D Background Engine
 * Progressive Enhancement using Three.js (r128)
 * - 3 Interactive Modes: Neural Lattice, Geodesic Core, Hyperstream
 * - Interactive Click Shockwave / Dispersion Physics
 * - Zero CPU impact when tab is unfocused / hidden
 * - Graceful degradation if WebGL is unavailable or reduced-motion enabled
 */

(function initThreeBackground() {
  // Global resilient fallback so callers never encounter undefined
  window.set3DVisualMode = window.set3DVisualMode || function (mode) {
    console.info(`[3D HUD] Mode set to: ${mode} (Ambient CSS mesh fallback)`);
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const container = document.getElementById("canvas-3d-container");
  if (!container) return;

  function isWebGLAvailable() {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable() || typeof THREE === "undefined") return;

  let scene, camera, renderer;
  let particles, particleGeo, particleMat;
  let linesMesh, linesGeo, linesMat;
  let geodesicMesh;
  let animationFrameId = null;
  let isTabActive = true;
  let activeMode = "lattice"; // "lattice" | "geodesic" | "stream"

  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 32 : 75;
  const CONNECT_DISTANCE = isMobile ? 85 : 105;
  const particlePositions = [];
  const particleVelocities = [];

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 240;

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 1. Particle Cloud & Network Lines
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const spreadX = isMobile ? 180 : 380;
    const spreadY = isMobile ? 220 : 280;
    const spreadZ = 120;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * spreadX;
      const y = (Math.random() - 0.5) * spreadY;
      const z = (Math.random() - 0.5) * spreadZ;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      particlePositions.push({ x, y, z, originX: x, originY: y, originZ: z });
      particleVelocities.push({
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        vz: (Math.random() - 0.5) * 0.12
      });
    }

    particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 2.6,
      transparent: true,
      opacity: isMobile ? 0.35 : 0.5,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Dynamic Connection Lines
    const maxLineSegments = PARTICLE_COUNT * 4;
    const linePositions = new Float32Array(maxLineSegments * 6);
    linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    linesMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: isMobile ? 0.05 : 0.09,
      blending: THREE.AdditiveBlending
    });

    linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(linesMesh);

    // 2. Geodesic Wireframe Sphere (Mode: Geodesic Core)
    const geoRadius = isMobile ? 55 : 85;
    const geoDetail = 2;
    const geodesicGeometry = new THREE.IcosahedronGeometry(geoRadius, geoDetail);
    const geodesicMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });

    geodesicMesh = new THREE.Mesh(geodesicGeometry, geodesicMaterial);
    geodesicMesh.visible = false;
    scene.add(geodesicMesh);

    // Event Listeners
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("click", onPointerClick);
    window.addEventListener("resize", onWindowResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    function onPointerMove(e) {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 0.04;
      targetMouseY = (e.clientY - window.innerHeight / 2) * 0.04;
    }

    // Gentle Kinetic Shockwave on Click
    function onPointerClick(e) {
      if (document.body.classList.contains("modal-open")) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const clickY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const worldClick = new THREE.Vector3(clickX * 140, clickY * 90, 0);

      particlePositions.forEach((p, idx) => {
        const dx = p.x - worldClick.x;
        const dy = p.y - worldClick.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) * 0.08;
          particleVelocities[idx].vx += (dx / dist) * force;
          particleVelocities[idx].vy += (dy / dist) * force;
        }
      });
      window.soundFx?.playPulse();
    }

    function onWindowResize() {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onVisibilityChange() {
      isTabActive = !document.hidden;
      if (isTabActive && !animationFrameId) animate();
    }

    // Public Mode Switcher API
    window.set3DVisualMode = function (mode) {
      activeMode = mode;
      if (mode === "geodesic") {
        geodesicMesh.visible = true;
        linesMesh.visible = false;
        particleMat.size = 2.0;
        particleMat.opacity = 0.3;
      } else if (mode === "stream") {
        geodesicMesh.visible = false;
        linesMesh.visible = true;
        linesMat.opacity = 0.14;
        particleMat.size = 3.2;
        particleMat.opacity = 0.65;
      } else {
        // default lattice
        geodesicMesh.visible = false;
        linesMesh.visible = true;
        linesMat.opacity = isMobile ? 0.05 : 0.09;
        particleMat.size = 2.6;
        particleMat.opacity = isMobile ? 0.35 : 0.5;
      }
      window.soundFx?.playTick();
    };

    // Animation Loop
    function animate() {
      if (!isTabActive) {
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;
      camera.position.x = mouseX;
      camera.position.y = -mouseY;
      camera.lookAt(scene.position);

      if (geodesicMesh.visible) {
        geodesicMesh.rotation.x += 0.002;
        geodesicMesh.rotation.y += 0.0035;
      }

      const posAttr = particleGeo.attributes.position;
      const linePosAttr = linesGeo.attributes.position;
      let lineVertexIndex = 0;

      const spreadXHalf = spreadX / 2;
      const spreadYHalf = spreadY / 2;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particlePositions[i];
        const v = particleVelocities[i];

        if (activeMode === "stream") {
          // Directional vector velocity
          p.x += v.vx * 2.5 + 0.4;
          p.y += v.vy * 0.8;
          p.z += v.vz * 1.5;
          if (p.x > spreadXHalf) p.x = -spreadXHalf;
        } else {
          p.x += v.vx;
          p.y += v.vy;
          p.z += v.vz;

          // Soft bounce boundaries
          if (p.x < -spreadXHalf || p.x > spreadXHalf) v.vx *= -1;
          if (p.y < -spreadYHalf || p.y > spreadYHalf) v.vy *= -1;
          if (p.z < -60 || p.z > 60) v.vz *= -1;

          // Velocity damping back to origin stability
          v.vx *= 0.99;
          v.vy *= 0.99;
        }

        posAttr.setXYZ(i, p.x, p.y, p.z);

        if (linesMesh.visible) {
          for (let j = i + 1; j < PARTICLE_COUNT; j++) {
            const p2 = particlePositions[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dz = p.z - p2.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < CONNECT_DISTANCE && lineVertexIndex < maxLineSegments * 6 - 6) {
              linePosAttr.setXYZ(lineVertexIndex++, p.x, p.y, p.z);
              linePosAttr.setXYZ(lineVertexIndex++, p2.x, p2.y, p2.z);
            }
          }
        }
      }

      posAttr.needsUpdate = true;
      if (linesMesh.visible) {
        linePosAttr.needsUpdate = true;
        linesGeo.setDrawRange(0, lineVertexIndex);
      }

      renderer.render(scene, camera);
    }

    animate();
  } catch (err) {
    console.warn("[3D Background] Degraded cleanly to CSS gradients.", err);
  }
})();
