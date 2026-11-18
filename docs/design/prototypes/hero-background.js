/**
 * Fluid Mesh Waves — Hero Section Background
 * Milestone 2 — Iteration 3: Strand Flow & Lighting
 * 
 * Recreates the approved Fluid Mesh Waves visual reference:
 * - Curvilinear strand flow dynamically following 3D fold curvature and draping
 * - Subtle, controlled strand spacing variations (compression on crests, relaxation in valleys)
 * - 100% mathematically parallel streamlines with ZERO intersections, cross-hatching, or moiré
 * - Multi-stop smooth lighting gradients across folds (deep obsidian -> emerald -> vibrant jade -> mint -> apex white-mint)
 * - Focused, razor-sharp apex rim highlights along high-curvature crest ridges
 * - Deep obsidian-black negative space behind hero text and between fold layers
 * - Self-occluding front-side geometry with depth writing
 * - High-performance: GPU-only displacement, ResizeObserver, IntersectionObserver, reduced-motion
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

(function initHeroFluidWaves() {
  // 1. Guard against environments without WebGL or missing DOM elements
  const canvas = document.getElementById('hero-waves-canvas');
  const heroSection = document.getElementById('home') || document.querySelector('.hero');
  if (!canvas || !heroSection) return;

  // Verify WebGL availability on an off-DOM probe canvas
  try {
    const probe = document.createElement('canvas');
    const probeGl = probe.getContext('webgl2') || probe.getContext('webgl') || probe.getContext('experimental-webgl');
    if (!probeGl) {
      console.warn('WebGL is not supported in this browser. Hero background disabled.');
      return;
    }
  } catch (err) {
    console.warn('WebGL initialization check failed:', err);
    return;
  }

  // 2. Configuration & State
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerQuery = window.matchMedia('(pointer: fine)');

  let renderer = null;
  let scene = null;
  let camera = null;
  let mesh = null;
  let material = null;
  let geometry = null;

  let animId = null;
  let isVisible = true;
  let isMobile = window.innerWidth < 768;
  let width = 0;
  let height = 0;

  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  const clock = new THREE.Clock(false);

  // 3. GLSL Shaders
  const vertexShader = /* glsl */ `
    precision highp float;

    uniform float uTime;
    uniform vec2 uMouse;

    varying vec2 vUv;
    varying float vStrandParam;
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying float vElevation;
    varying float vLocalRidge;
    varying float vCurvature;
    varying float vFocalWeight;

    // 2D Simplex Noise for Organic Domain Warping
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
            + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // Procedural multi-fold displacement function
    // Calculates displaced 3D position and multi-fold local ridge prominence
    vec4 computeFoldGeometry(vec3 p, float t, out vec2 outWp, out float outFoldDeflect) {
      // 1. Two-Tier Organic Domain Warping (Creates fluid S-curves and non-linear draping)
      vec2 w1;
      w1.x = 2.8 * snoise(p.xz * 0.055 + vec2(t * 0.09, -t * 0.05))
           + 1.2 * sin(p.z * 0.13 + t * 0.11);
      w1.y = 2.4 * snoise(p.zx * 0.048 + vec2(-t * 0.07, t * 0.08))
           + 1.0 * cos(p.x * 0.11 - t * 0.09);

      vec2 w2;
      w2.x = 0.9 * snoise(p.xz * 0.11 + vec2(-t * 0.12, t * 0.08));
      w2.y = 0.8 * snoise(p.zx * 0.12 + vec2(t * 0.09, -t * 0.10));

      vec2 wp = p.xz + w1 + w2;
      outWp = wp;

      // 2. FOLD 1: Dominant Midground Crest (Sweeping diagonal ridge on right)
      vec2 dir1 = normalize(vec2(0.58, 0.81));
      float d1 = dot(wp, dir1);
      float phase1 = d1 * 0.22 - t * 0.26;
      float w1Val = sin(phase1);
      float crest1 = sign(w1Val) * pow(abs(w1Val), 1.75);
      float amp1 = 4.0;

      // 3. FOLD 2: Cascading Rear Billow (Elevated background swell filling upper frame)
      vec2 dir2 = normalize(vec2(0.80, 0.60));
      float d2 = dot(wp, dir2);
      float phase2 = d2 * 0.16 - t * 0.18 + 1.6;
      float w2Val = sin(phase2);
      float crest2 = sign(w2Val) * pow(abs(w2Val), 1.60);
      float amp2 = 3.6 * smoothstep(6.0, -16.0, p.z);

      // 4. FOLD 3: Secondary Transverse Fold (Creates cascading creases between main folds)
      vec2 dir3 = normalize(vec2(-0.47, 0.88));
      float d3 = dot(wp, dir3);
      float phase3 = d3 * 0.32 + t * 0.22 + 0.9;
      float w3Val = cos(phase3);
      float crest3 = sign(w3Val) * pow(abs(w3Val), 1.40);
      float amp3 = 2.0;

      // 5. FOLD 4: Foreground Swooping Roll (Frames lower viewport with layered near-field depth)
      vec2 dir4 = normalize(vec2(0.88, 0.47));
      float d4 = dot(wp, dir4);
      float phase4 = d4 * 0.28 - t * 0.30 - 1.3;
      float w4Val = sin(phase4);
      float crest4 = sign(w4Val) * pow(abs(w4Val), 1.50);
      float amp4 = 2.0 * smoothstep(-4.0, 14.0, p.z);

      // 6. FOLD 5: Silk Tension Undulations
      float d5 = dot(wp, vec2(0.60, 0.80));
      float pleats = 0.35 * sin(d5 * 0.65 - t * 0.38) * cos(wp.x * 0.16 + 0.4);

      // 7. Spatial Height Distribution:
      float rightBias = smoothstep(-6.0, 8.5, p.x) * 1.30;
      float textTrough = smoothstep(1.5, -9.0, p.x) * 1.35;

      // Controlled Gerstner horizontal contraction
      vec2 pinch1 = dir1 * (-0.36 * crest1 * amp1 * 0.10);
      vec2 pinch2 = dir2 * (-0.26 * crest2 * amp2 * 0.08);
      vec2 pinch3 = dir3 * (-0.22 * crest3 * amp3 * 0.07);
      vec2 totalPinch = pinch1 + pinch2 + pinch3;

      float totalY = (crest1 * amp1 + crest2 * amp2 + crest3 * amp3 + crest4 * amp4 + pleats)
                   * (0.84 + rightBias * 0.38) - textTrough;

      totalY += uMouse.y * 0.35 * smoothstep(-10.0, 10.0, p.x);

      // Multi-fold local ridge prominence across folds
      float r1 = max(0.0, crest1);
      float r2 = max(0.0, crest2) * smoothstep(4.0, -14.0, p.z);
      float r3 = max(0.0, crest3);
      float r4 = max(0.0, crest4) * smoothstep(-3.0, 14.0, p.z);
      float localRidge = max(max(r1, r2 * 0.95), max(r3 * 0.80, r4 * 0.90));

      // Curvilinear deflection for strand flow:
      // Captures the local fold flow to make strands wrap around ridges organically
      outFoldDeflect = crest1 * 1.40 + crest2 * 0.95 - crest3 * 0.80 + crest4 * 0.70;

      return vec4(p.x + totalPinch.x + uMouse.x * 0.30, totalY, p.z + totalPinch.y, localRidge);
    }

    void main() {
      vUv = uv;

      vec3 p = position;
      float t = uTime * 0.45;

      vec2 wp;
      float foldDeflect;
      vec4 foldGeom = computeFoldGeometry(p, t, wp, foldDeflect);
      vec3 dispP = foldGeom.xyz;
      vLocalRidge = foldGeom.w;

      // Finite difference to compute accurate surface normals
      float eps = 0.08;
      vec2 dummyWp;
      float dummyDeflect;
      vec3 pDx = computeFoldGeometry(p + vec3(eps, 0.0, 0.0), t, dummyWp, dummyDeflect).xyz;
      vec3 pDz = computeFoldGeometry(p + vec3(0.0, 0.0, eps), t, dummyWp, dummyDeflect).xyz;

      vec3 tangentX = pDx - dispP;
      vec3 tangentZ = pDz - dispP;
      vec3 norm = normalize(cross(tangentZ, tangentX));

      vNormal = normalize(normalMatrix * norm);
      vWorldPos = (modelMatrix * vec4(dispP, 1.0)).xyz;
      vElevation = dispP.y;

      // Curvature estimate
      vCurvature = clamp(1.0 - abs(norm.y), 0.0, 1.0);

      // Focal zone weight: text is on the left (x < 0), wave spectacle is on the right (x > 0)
      vFocalWeight = smoothstep(-9.0, 5.0, dispP.x);

      // ORGANIC CURVILINEAR STRAND FLOW PARAMETRIZATION:
      // Computes a continuous 1D scalar field that wraps naturally around 3D folds:
      // - transCoord: tracks across the dominant diagonal direction
      // - foldDeflect: bends strands along local 3D fold contours (eliminates straight diagonal look)
      // - spacingVar: introduces subtle organic tension variations in strand spacing
      // Because vStrandParam is a single scalar field, level curves CANNOT intersect (zero moire, zero cross-hatching)
      vec2 flowDir = normalize(vec2(0.58, 0.81));
      vec2 transDir = vec2(-flowDir.y, flowDir.x);
      float transCoord = dot(wp, transDir);

      float spacingVar = 0.45 * sin(dot(wp, flowDir) * 0.16 - t * 0.20)
                       + 0.30 * snoise(wp * 0.055);

      vStrandParam = (transCoord + foldDeflect * 1.35 + dispP.y * 0.22 + spacingVar * 1.1) * 0.048;

      vec4 mvPos = modelViewMatrix * vec4(dispP, 1.0);
      vViewDir = normalize(-mvPos.xyz);

      gl_Position = projectionMatrix * mvPos;
    }
  `;

  const fragmentShader = /* glsl */ `
    #ifdef GL_OES_standard_derivatives
    #extension GL_OES_standard_derivatives : enable
    #endif
    precision highp float;

    uniform float uTime;
    uniform float uStrandDensity;
    uniform float uTheme; // 0.0 = dark, 1.0 = light

    varying vec2 vUv;
    varying float vStrandParam;
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying float vElevation;
    varying float vLocalRidge;
    varying float vCurvature;
    varying float vFocalWeight;

    void main() {
      // 1. BOUNDARY ENVELOPE: Soft edge falloff so the mesh dissolves seamlessly at outer edges
      float envX = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
      float envY = smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);
      float edgeEnvelope = envX * envY;

      // 2. PROCEDURAL STRAND GENERATION (Screen-space anti-aliased line rendering):
      float strandCoord = vStrandParam * uStrandDensity;
      float dist = abs(fract(strandCoord) - 0.5);
      float fDelta = max(fwidth(strandCoord), 0.0001);
      float pixelDist = dist / fDelta;

      // Fine, silky strand width: ~1.25 pixels
      float halfWidthPx = 0.62;
      halfWidthPx *= mix(0.85, 1.25, vLocalRidge);

      float strandLine = clamp(halfWidthPx - pixelDist + 0.5, 0.0, 1.0);

      // 3. ADVANCED LIGHTING & FRESNEL:
      vec3 keyLightDir = normalize(vec3(0.50, 0.75, 0.35));
      float NdotL = max(0.0, dot(vNormal, keyLightDir));

      // Fresnel grazing angle term for glowing rim highlights along sharp curvature
      float NdotV = max(0.0, dot(vNormal, vViewDir));
      float fresnel = pow(1.0 - NdotV, 2.5);

      // Multi-Fold Slope Factor:
      // Computes smooth gradient transitions across folds rather than uniformly bright lines
      float elevFactor = smoothstep(-0.8, 3.5, vElevation);
      float slopeFactor = clamp(
        vLocalRidge * 0.60 +
        fresnel * 0.28 * (0.35 + 0.65 * vCurvature) +
        NdotL * 0.22 * elevFactor,
        0.0, 1.0
      );

      // 4. COOL EMERALD / MINT COLOR RAMP (Exact tone match for approved reference):
      // Stop 0: Deep Obsidian Shadow (#010604) - valleys & hollows
      vec3 colDeepShadow = vec3(0.003, 0.018, 0.010);
      // Stop 1: Rich Forest Emerald (#0B3B1E) - lower slopes
      vec3 colDarkEmerald = vec3(0.035, 0.210, 0.115);
      // Stop 2: Vibrant Jade Green (#10B981) - mid slopes
      vec3 colVibrantGreen = vec3(0.065, 0.700, 0.440);
      // Stop 3: Luminous Electric Mint (#34D399) - upper ridges
      vec3 colMintEdge = vec3(0.204, 0.850, 0.600);
      // Stop 4: Radiant White-Mint Glow (#D1FAE5) - sharp crest apex
      vec3 colApex = vec3(0.860, 0.990, 0.920);

      vec3 strandColor;
      if (slopeFactor < 0.20) {
        strandColor = mix(colDeepShadow, colDarkEmerald, slopeFactor / 0.20);
      } else if (slopeFactor < 0.50) {
        float t = (slopeFactor - 0.20) / 0.30;
        strandColor = mix(colDarkEmerald, colVibrantGreen, t);
      } else if (slopeFactor < 0.78) {
        float t = (slopeFactor - 0.50) / 0.28;
        strandColor = mix(colVibrantGreen, colMintEdge, t);
      } else {
        float t = (slopeFactor - 0.78) / 0.22;
        strandColor = mix(colMintEdge, colApex, t);
      }

      // Razor-sharp apex highlight concentrated along the actual ridge crests
      float apexRim = pow(smoothstep(0.68, 0.98, slopeFactor), 2.5) * smoothstep(0.20, 0.90, vLocalRidge);
      strandColor = mix(strandColor, vec3(0.96, 1.0, 0.98), apexRim * 0.95);

      // 5. SOLID DARK BODY WITH LUMINOUS STRANDS:
      // Subtle ambient silk body between strands creates organic depth and cohesion
      vec3 valleyBodyColor = mix(colDeepShadow, colDarkEmerald * 0.45, pow(slopeFactor, 1.5));
      vec3 finalColor = mix(valleyBodyColor, strandColor, strandLine);

      // Contrast enhancement: deep valleys (slopeFactor < 0.18) deepen into pure obsidian
      float valleyDarken = smoothstep(0.04, 0.32, slopeFactor);
      finalColor *= mix(0.12, 1.0, valleyDarken);

      // Focal zone vs content zone contrast:
      // Left side under hero text is kept in deep dark negative space
      float contentDamp = mix(0.24, 1.0, vFocalWeight);
      finalColor *= mix(0.38, 1.0, vFocalWeight);

      // Alpha: Opaque in core to maintain self-occlusion, soft boundary fade
      float baseAlpha = mix(0.70, 1.0, slopeFactor * 0.4 + strandLine * 0.6);
      float finalAlpha = baseAlpha * edgeEnvelope * contentDamp;

      // Apex highlight boosts line presence
      finalAlpha = mix(finalAlpha, min(1.0, finalAlpha * 1.5), apexRim);

      // 6. LIGHT THEME ADAPTATION:
      if (uTheme > 0.5) {
        vec3 lightValley = vec3(0.93, 0.95, 0.92);
        vec3 lightCrest = vec3(0.08, 0.32, 0.14);
        vec3 lightCol = mix(lightValley, lightCrest, pow(slopeFactor, 1.2) * strandLine);
        gl_FragColor = vec4(lightCol, edgeEnvelope * 0.30);
        return;
      }

      if (finalAlpha < 0.005) discard;

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `;

  // 4. Initialization
  function initThreeScene() {
    scene = new THREE.Scene();

    // Balanced perspective camera (34 deg FOV, placed for layered depth)
    camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
    camera.position.set(0.0, 8.2, 22.5);
    camera.lookAt(1.0, 1.8, -1.0);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0);

    createMesh();
  }

  function createMesh() {
    if (mesh) {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    }

    isMobile = window.innerWidth < 768;

    // Sized to overscan Hero boundaries across aspect ratios
    const planeWidth = 48;
    const planeDepth = 38;
    const segX = isMobile ? 200 : 320;
    const segY = isMobile ? 200 : 320;

    geometry = new THREE.PlaneGeometry(planeWidth, planeDepth, segX, segY);
    geometry.rotateX(-Math.PI / 2);

    const isLight = document.documentElement.classList.contains('light-theme');

    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      extensions: {
        derivatives: true
      },
      uniforms: {
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector2(0.0, 0.0) },
        uStrandDensity: { value: isMobile ? 170.0 : 250.0 },
        uTheme: { value: isLight ? 1.0 : 0.0 }
      },
      transparent: true,
      depthWrite: true,
      depthTest: true,
      side: THREE.FrontSide
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  // 5. Responsive Resize Handling
  function onResize() {
    const rect = heroSection.getBoundingClientRect();
    width = Math.floor(rect.width || window.innerWidth);
    height = Math.floor(rect.height || window.innerHeight);

    if (width === 0 || height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    camera.aspect = width / height;
    if (width < 768) {
      camera.fov = 44;
      camera.position.set(0.2, 9.5, 25.0);
      camera.lookAt(0.3, 1.2, -1.0);
    } else {
      camera.fov = 34;
      camera.position.set(0.0, 8.2, 22.5);
      camera.lookAt(1.0, 1.8, -1.0);
    }
    camera.updateProjectionMatrix();

    const newIsMobile = width < 768;
    if (newIsMobile !== isMobile) {
      createMesh();
    }

    if (motionQuery.matches) {
      renderSingleFrame();
    }
  }

  // 6. Animation Loop & Lifecycle
  function renderSingleFrame() {
    if (!renderer || !scene || !camera) return;
    const isLight = document.documentElement.classList.contains('light-theme');
    material.uniforms.uTheme.value = isLight ? 1.0 : 0.0;
    material.uniforms.uTime.value = 1.0;
    renderer.render(scene, camera);
  }

  function loop() {
    if (!isVisible || motionQuery.matches) {
      animId = null;
      return;
    }

    const elapsed = clock.getElapsedTime();

    // Mouse lerping
    currentMouseX += (targetMouseX - currentMouseX) * 0.04;
    currentMouseY += (targetMouseY - currentMouseY) * 0.04;

    material.uniforms.uTime.value = elapsed;
    material.uniforms.uMouse.value.set(currentMouseX, currentMouseY);

    const isLight = document.documentElement.classList.contains('light-theme');
    material.uniforms.uTheme.value = isLight ? 1.0 : 0.0;

    renderer.render(scene, camera);

    animId = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (!animId && !motionQuery.matches && isVisible && !document.hidden) {
      clock.start();
      animId = requestAnimationFrame(loop);
    }
  }

  function stopLoop() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    clock.stop();
  }

  // 7. Event Listeners & Observers
  if (finePointerQuery.matches) {
    heroSection.addEventListener('pointermove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }, { passive: true });

    heroSection.addEventListener('pointerleave', () => {
      targetMouseX = 0;
      targetMouseY = 0;
    }, { passive: true });
  }

  // ResizeObserver for reliable container tracking
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => {
      onResize();
    });
    ro.observe(heroSection);
  } else {
    window.addEventListener('resize', onResize, { passive: true });
  }

  // IntersectionObserver to pause rendering offscreen
  if (typeof IntersectionObserver !== 'undefined') {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      });
    }, { threshold: 0.02 });
    io.observe(heroSection);
  }

  // Page visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop();
    } else if (isVisible) {
      startLoop();
    }
  });

  // Reduced motion query change
  motionQuery.addEventListener('change', (e) => {
    if (e.matches) {
      stopLoop();
      renderSingleFrame();
    } else {
      startLoop();
    }
  });

  // Theme mutation observer to update uTheme immediately on class change
  const themeObserver = new MutationObserver(() => {
    if (material && material.uniforms && material.uniforms.uTheme) {
      const isLight = document.documentElement.classList.contains('light-theme');
      material.uniforms.uTheme.value = isLight ? 1.0 : 0.0;
      if (motionQuery.matches) {
        renderSingleFrame();
      }
    }
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // 8. Bootstrap
  try {
    initThreeScene();
    onResize();

    if (motionQuery.matches) {
      renderSingleFrame();
    } else {
      startLoop();
    }
  } catch (err) {
    console.error('Failed to initialize Three.js Fluid Mesh Waves:', err);
  }
})();
