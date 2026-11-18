/**
 * Fluid Mesh Waves — Hero Section Background
 * Implementation: Three.js with custom GLSL ShaderMaterial on displaced 3D plane
 * Recreates the approved Fluid Mesh Waves visual reference:
 * - Continuous 3D surface in XZ plane with Gerstner wave displacement + organic domain warping
 * - Balanced telephoto perspective view preventing foreground line ballooning
 * - Ultra-fine, dense parallel strands rendered analytically in fragment shader (silky, hair-thin lines)
 * - Cool emerald/mint 5-stop color ramp with razor-sharp white-mint apex rim highlights
 * - Self-occluding front-side geometry with depth writing (eliminates transparent double-vision)
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

    // Procedural wave displacement function
    vec3 computeDisplacement(vec3 p, float t) {
      // 1. Domain Warping: Low-frequency organic turbulence
      vec2 warp;
      warp.x = 2.80 * snoise(p.xz * 0.055 + vec2(t * 0.09, -t * 0.06))
             + 1.10 * sin(p.z * 0.14 + t * 0.12);
      warp.y = 2.40 * snoise(p.zx * 0.045 + vec2(-t * 0.07, t * 0.08))
             + 0.95 * cos(p.x * 0.12 - t * 0.10);

      vec2 wp = p.xz + warp;

      // Common flow axis: dominant diagonal direction (~36 degrees)
      vec2 flowDir = normalize(vec2(0.60, 0.80));
      float flowCoord = dot(wp, flowDir);
      float crossCoord = dot(wp, vec2(-flowDir.y, flowDir.x));

      // 2. Wave Harmonic 1: Dominant Diagonal Swell
      float k1 = 0.24;
      float phase1 = flowCoord * k1 - t * 0.28;
      float w1 = sin(phase1);
      float crest1 = sign(w1) * pow(abs(w1), 1.85);
      float amp1 = 4.60;

      // 3. Wave Harmonic 2: Organic Mid-Frequency Modulator
      float k2 = 0.46;
      float phase2 = flowCoord * k2 + crossCoord * 0.22 - t * 0.38 + 1.20;
      float w2 = cos(phase2);
      float crest2 = sign(w2) * pow(abs(w2), 1.50);
      float amp2 = 1.75;

      // 4. Wave Harmonic 3: Elevated Background Swell
      float k3 = 0.16;
      float phase3 = flowCoord * k3 - crossCoord * 0.18 - t * 0.16 + 0.35;
      float w3 = sin(phase3);
      float amp3 = 3.60 * smoothstep(8.0, -18.0, p.z);

      // 5. Asymmetric Elevation Modulation:
      float rightBias = smoothstep(-7.0, 9.0, p.x) * 1.45;
      float textTrough = smoothstep(1.5, -11.0, p.x) * 1.60;

      // Controlled Gerstner horizontal contraction:
      float pinch = -0.42 * (crest1 * amp1 * 0.12 + crest2 * amp2 * 0.06);
      vec2 pinchVec = flowDir * pinch;

      float y = (crest1 * amp1 + crest2 * amp2 + w3 * amp3) * (0.85 + rightBias * 0.40) - textTrough;

      // Subtle mouse interaction
      y += uMouse.y * 0.30 * smoothstep(-10.0, 10.0, p.x);

      return vec3(p.x + pinchVec.x + uMouse.x * 0.30, y, p.z + pinchVec.y);
    }

    void main() {
      vUv = uv;

      // Parametric strand coordinate: strictly 1D transverse flow
      vStrandParam = uv.x * 0.42 + uv.y * 0.91;

      vec3 p = position;
      float t = uTime * 0.45;

      vec3 dispP = computeDisplacement(p, t);

      // Finite difference to compute accurate surface normals
      float eps = 0.08;
      vec3 pDx = computeDisplacement(p + vec3(eps, 0.0, 0.0), t);
      vec3 pDz = computeDisplacement(p + vec3(0.0, 0.0, eps), t);

      vec3 tangentX = pDx - dispP;
      vec3 tangentZ = pDz - dispP;
      vec3 norm = normalize(cross(tangentZ, tangentX));

      vNormal = normalize(normalMatrix * norm);
      vWorldPos = (modelMatrix * vec4(dispP, 1.0)).xyz;
      vElevation = dispP.y;

      // Curvature estimate: measure departure from horizontal normal
      vCurvature = clamp(1.0 - abs(norm.y), 0.0, 1.0);

      // Focal zone weight: text is on the left (x < 0), wave spectacle is on the right (x > 0)
      vFocalWeight = smoothstep(-9.0, 5.0, dispP.x);

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
    uniform float uStrandWidth;
    uniform float uTheme; // 0.0 = dark, 1.0 = light

    varying vec2 vUv;
    varying float vStrandParam;
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying float vElevation;
    varying float vCurvature;
    varying float vFocalWeight;

    void main() {
      // 1. BOUNDARY ENVELOPE: Soft edge falloff so the mesh dissolves seamlessly at outer edges
      float envX = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
      float envY = smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);
      float edgeEnvelope = envX * envY;

      // 2. PROCEDURAL STRAND GENERATION:
      // Dense, fine, hair-thin parallel flow strands (strictly 1D, zero cross-hatching)
      float strandCoord = vStrandParam * uStrandDensity;
      float strandFract = fract(strandCoord);
      float strandDist = abs(strandFract - 0.5);

      // Screen-space derivative anti-aliasing (fwidth)
      float delta = fwidth(strandCoord);
      float halfWidth = uStrandWidth * 0.5;

      // Modulate strand width slightly: razor-fine on crests, softly diffused in valleys
      float crestBoost = smoothstep(-1.2, 4.0, vElevation);
      halfWidth *= mix(0.70, 1.30, crestBoost);

      // Smoothstep strand line profile with AA
      float strandLine = 1.0 - smoothstep(halfWidth - delta, halfWidth + delta, strandDist);

      // 3. ADVANCED LIGHTING & FRESNEL:
      vec3 keyLightDir = normalize(vec3(0.55, 0.78, 0.30));
      float NdotL = max(0.0, dot(vNormal, keyLightDir));

      // Fresnel grazing angle term for glowing rim highlights along sharp curvature
      float NdotV = max(0.0, dot(vNormal, vViewDir));
      float fresnel = pow(1.0 - NdotV, 2.8);

      // Ridge factor combining elevation, curvature, directional lighting, and Fresnel
      float ridgeFactor = clamp(
        crestBoost * 0.52 +
        fresnel * 0.38 * (0.55 + 0.45 * vCurvature) +
        NdotL * 0.26 +
        vCurvature * 0.18,
        0.0, 1.0
      );

      // 4. COOL EMERALD / MINT COLOR RAMP (Exact tone match for approved reference):
      // Stop 0: Deep Obsidian Shadow (#010604)
      vec3 colDeepShadow = vec3(0.004, 0.024, 0.016);
      // Stop 1: Rich Forest Emerald (#0B3B1E)
      vec3 colDarkEmerald = vec3(0.035, 0.200, 0.115);
      // Stop 2: Cool Jade Green (#10B981 / #0E9F6E)
      vec3 colVibrantGreen = vec3(0.055, 0.620, 0.430);
      // Stop 3: Luminous Electric Mint (#34D399)
      vec3 colMintEdge = vec3(0.204, 0.827, 0.600);
      // Stop 4: Radiant White-Mint Glow (#D1FAE5)
      vec3 colApex = vec3(0.820, 0.980, 0.898);

      vec3 strandColor;
      if (ridgeFactor < 0.20) {
        strandColor = mix(colDeepShadow, colDarkEmerald, ridgeFactor / 0.20);
      } else if (ridgeFactor < 0.50) {
        float t = (ridgeFactor - 0.20) / 0.30;
        strandColor = mix(colDarkEmerald, colVibrantGreen, t);
      } else if (ridgeFactor < 0.78) {
        float t = (ridgeFactor - 0.50) / 0.28;
        strandColor = mix(colVibrantGreen, colMintEdge, t);
      } else {
        float t = (ridgeFactor - 0.78) / 0.22;
        strandColor = mix(colMintEdge, colApex, t);
      }

      // Razor-sharp apex highlight on the sharpest crest ridge (the signature glowing edge)
      float apexPeak = pow(smoothstep(0.68, 0.98, ridgeFactor), 2.5);
      strandColor = mix(strandColor, vec3(0.95, 1.0, 0.98), apexPeak * 0.96);

      // 5. SOLID DARK BODY WITH LUMINOUS STRANDS:
      vec3 valleyBodyColor = mix(vec3(0.005, 0.016, 0.010), colDarkEmerald * 0.30, crestBoost);
      vec3 finalColor = mix(valleyBodyColor, strandColor, strandLine);

      // In the focal zone (right side / crests), strands are radiant
      // In the content zone (left side / under text), strands are attenuated so text is crystal clear
      float contentDamp = mix(0.22, 1.0, vFocalWeight);
      finalColor *= mix(0.35, 1.0, vFocalWeight);

      // Alpha: In the core of the mesh, surface is opaque so it cleanly occludes what's behind
      float strandAlpha = mix(0.08, 0.95, strandLine);
      float baseAlpha = mix(0.65, 1.0, crestBoost * 0.5 + strandLine * 0.5);

      // Depth attenuation
      float depthDist = length(vWorldPos - vec3(0.0, 7.2, 23.0));
      float depthFade = smoothstep(44.0, 10.0, depthDist);

      float finalAlpha = baseAlpha * edgeEnvelope * depthFade * contentDamp;

      // Apex highlight boosts line presence
      finalAlpha = mix(finalAlpha, min(1.0, finalAlpha * 1.5), apexPeak);

      // 6. LIGHT THEME ADAPTATION:
      if (uTheme > 0.5) {
        vec3 lightValley = vec3(0.93, 0.95, 0.92);
        vec3 lightCrest = vec3(0.08, 0.32, 0.14);
        vec3 lightCol = mix(lightValley, lightCrest, pow(ridgeFactor, 1.2) * strandLine);
        gl_FragColor = vec4(lightCol, edgeEnvelope * depthFade * 0.28);
        return;
      }

      if (finalAlpha < 0.005) discard;

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `;

  // 4. Initialization
  function initThreeScene() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0.0, 7.2, 23.0);
    camera.lookAt(1.0, 2.0, -1.0);

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
    const planeWidth = 46;
    const planeDepth = 36;
    const segX = isMobile ? 180 : 300;
    const segY = isMobile ? 180 : 300;

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
        uStrandDensity: { value: isMobile ? 420.0 : 660.0 },
        uStrandWidth: { value: 0.085 },
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
      camera.fov = 40;
      camera.position.set(0.2, 8.5, 25.0);
      camera.lookAt(0.3, 1.2, -1.0);
    } else {
      camera.fov = 30;
      camera.position.set(0.0, 7.2, 23.0);
      camera.lookAt(1.0, 2.0, -1.0);
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
