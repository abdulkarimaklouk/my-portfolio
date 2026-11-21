/**
 * Fluid Mesh Waves — Hero Section Background
 * Prototype Implementation (Integrated from Approved Production Architecture)
 * 
 * Recreates the approved Fluid Mesh Waves visual reference with slow, organic silk motion:
 * - Dynamic ESM import via Three.js 0.160.0 with window.THREE fallback & WebGL probe check
 * - Strict duplicate initialization protection
 * - High-precision monotonic accumulated time tracking (smooth across scroll & tab switch)
 * - Multi-fold procedural geometry:
 *     - Fold 1: Dominant Midground Crest (sweeping diagonal ridge catching key light on right)
 *     - Fold 2: Cascading Rear Billow (elevated background swell)
 *     - Fold 3: Transverse Cascades (organic interconnecting folds)
 *     - Fold 4: Foreground Undulating Roll (near-field depth)
 * - Screen-space anti-aliased procedural strand shading via fwidth standard derivatives
 * - Balanced obsidian-to-emerald/mint color ramp with grazing Fresnel & specular apex highlight
 * - Compositional balance: quiet negative space for left-column hero text; elevated crest for right-column portrait
 * - Dynamic light/dark theme adaptation with live MutationObserver
 * - Lifecycle: pauses offscreen (IntersectionObserver), pauses on inactive tab, static frame on prefers-reduced-motion
 * - Zero allocations in requestAnimationFrame loop for steady 60fps GPU performance
 */

(async function initHeroFluidBackground() {
  // 1. Guard against duplicate initialization
  const canvas = document.getElementById('hero-waves-canvas');
  const heroSection = document.getElementById('home') || document.querySelector('.hero');
  if (!canvas || !heroSection) return;
  if (canvas.__heroWavesInitialized) return;

  // 2. Resolve Three.js (dynamic ESM import with fallback to window.THREE)
  let THREE = null;
  try {
    const mod = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
    if (mod && mod.Scene) {
      THREE = mod;
    }
  } catch (err) {
    console.warn('Three.js CDN dynamic import failed, attempting window.THREE fallback:', err);
  }

  if (!THREE && typeof window !== 'undefined' && window.THREE && window.THREE.Scene) {
    THREE = window.THREE;
  }

  if (!THREE) {
    console.warn('Three.js unavailable. Prototype hero background degraded gracefully.');
    return;
  }

  // 3. Verify WebGL support via off-DOM probe canvas
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl') || probe.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported. Prototype hero background disabled.');
      return;
    }
  } catch (e) {
    console.warn('WebGL probe check failed:', e);
    return;
  }

  canvas.__heroWavesInitialized = true;

  // 4. Configuration & State
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

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

  let lastTimestamp = 0;
  let accumulatedTime = 0.0;

  const isLightTheme = () =>
    document.documentElement.classList.contains('light-theme') ||
    document.body.classList.contains('light-theme');

  // 5. GLSL Shaders
  const vertexShader = /* glsl */ `
    precision highp float;

    uniform float uTime;

    varying vec2 vUv;
    varying float vStrandParam;
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying float vElevation;
    varying float vLocalRidge;
    varying float vCurvature;
    varying float vTextNegativeSpace;

    // 2D Simplex Noise for organic domain warping
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
    vec4 computeFoldGeometry(vec3 p, float t, out vec2 outWp, out vec3 outCrests) {
      // 1. Organic domain warping with gentle slow drift
      vec2 w1;
      w1.x = 2.5 * snoise(p.xz * 0.055 + vec2(t * 0.06, -t * 0.035))
           + 1.1 * sin(p.z * 0.12 + t * 0.07);
      w1.y = 2.2 * snoise(p.zx * 0.048 + vec2(-t * 0.045, t * 0.05))
           + 0.9 * cos(p.x * 0.10 - t * 0.06);

      vec2 w2;
      w2.x = 0.8 * snoise(p.xz * 0.11 + vec2(-t * 0.08, t * 0.05));
      w2.y = 0.7 * snoise(p.zx * 0.12 + vec2(t * 0.06, -t * 0.07));

      vec2 wp = p.xz + w1 + w2;
      outWp = wp;

      // 2. FOLD 1: Dominant Midground Crest (Sweeping diagonal ridge on right)
      vec2 dir1 = normalize(vec2(0.58, 0.81));
      float d1 = dot(wp, dir1);
      float phase1 = d1 * 0.22 - t * 0.22;
      float w1Val = sin(phase1);
      float crest1 = sign(w1Val) * pow(abs(w1Val), 1.75);
      float amp1 = 3.8 * (0.94 + 0.06 * sin(t * 0.16 + 0.4));

      // 3. FOLD 2: Cascading Rear Billow (Elevated background swell)
      vec2 dir2 = normalize(vec2(0.80, 0.60));
      float d2 = dot(wp, dir2);
      float phase2 = d2 * 0.16 - t * 0.15 + 1.6;
      float w2Val = sin(phase2);
      float crest2 = sign(w2Val) * pow(abs(w2Val), 1.60);
      float amp2 = 3.4 * (0.93 + 0.07 * cos(t * 0.13 + 1.2)) * smoothstep(6.0, -16.0, p.z);

      // 4. FOLD 3: Secondary Transverse Fold (Connects main folds with soft creases)
      vec2 dir3 = normalize(vec2(-0.47, 0.88));
      float d3 = dot(wp, dir3);
      float phase3 = d3 * 0.32 + t * 0.16 + 0.9;
      float w3Val = cos(phase3);
      float crest3 = sign(w3Val) * pow(abs(w3Val), 1.40);
      float amp3 = 1.9 * (0.92 + 0.08 * sin(t * 0.20 - 0.5));

      // 5. FOLD 4: Foreground Swooping Roll (Frames lower viewport)
      vec2 dir4 = normalize(vec2(0.88, 0.47));
      float d4 = dot(wp, dir4);
      float phase4 = d4 * 0.28 - t * 0.20 - 1.3;
      float w4Val = sin(phase4);
      float crest4 = sign(w4Val) * pow(abs(w4Val), 1.50);
      float amp4 = 1.8 * (0.92 + 0.08 * sin(t * 0.18 - 0.7)) * smoothstep(-4.0, 14.0, p.z);

      // 6. FOLD 5: Silk Tension Undulations
      float d5 = dot(wp, vec2(0.60, 0.80));
      float pleats = 0.30 * sin(d5 * 0.65 - t * 0.25) * cos(wp.x * 0.16 + 0.4);

      // 7. Spatial Modulation & Text Readability for 2-column layout
      // Elevated crests on right flank (x > 0) framing the portrait; soft basin on left (x < 0) for text:
      float rightBias = smoothstep(-6.0, 8.5, p.x) * 1.30;
      float leftTrough = smoothstep(2.0, -8.0, p.x) * 1.05;

      // Gerstner horizontal pinch for peaked crests and broad valleys
      vec2 pinch1 = dir1 * (-0.34 * crest1 * amp1 * 0.10);
      vec2 pinch2 = dir2 * (-0.24 * crest2 * amp2 * 0.08);
      vec2 pinch3 = dir3 * (-0.20 * crest3 * amp3 * 0.07);
      vec2 totalPinch = pinch1 + pinch2 + pinch3;

      float totalY = (crest1 * amp1 + crest2 * amp2 + crest3 * amp3 + crest4 * amp4 + pleats)
                   * (0.85 + rightBias * 0.35) - leftTrough;

      // Local ridge prominence for crest highlights
      float r1 = max(0.0, crest1);
      float r2 = max(0.0, crest2) * smoothstep(4.0, -14.0, p.z);
      float r3 = max(0.0, crest3);
      float r4 = max(0.0, crest4) * smoothstep(-3.0, 14.0, p.z);
      float localRidge = max(max(r1, r2 * 0.95), max(r3 * 0.80, r4 * 0.90));

      outCrests = vec3(crest1, crest2, crest4);

      return vec4(p.x + totalPinch.x, totalY, p.z + totalPinch.y, localRidge);
    }

    void main() {
      vUv = uv;

      vec3 p = position;
      float t = uTime * 0.38;

      vec2 wp;
      vec3 crests;
      vec4 foldGeom = computeFoldGeometry(p, t, wp, crests);
      vec3 dispP = foldGeom.xyz;
      vLocalRidge = foldGeom.w;

      // Finite difference to compute accurate surface normals
      float eps = 0.08;
      vec2 dummyWp;
      vec3 dummyCrests;
      vec3 pDx = computeFoldGeometry(p + vec3(eps, 0.0, 0.0), t, dummyWp, dummyCrests).xyz;
      vec3 pDz = computeFoldGeometry(p + vec3(0.0, 0.0, eps), t, dummyWp, dummyCrests).xyz;

      vec3 tangentX = pDx - dispP;
      vec3 tangentZ = pDz - dispP;
      vec3 norm = normalize(cross(tangentZ, tangentX));

      vNormal = normalize(normalMatrix * norm);
      vWorldPos = (modelMatrix * vec4(dispP, 1.0)).xyz;
      vElevation = dispP.y;

      // Curvature estimate
      vCurvature = clamp(1.0 - abs(norm.y), 0.0, 1.0);

      // Text negative space attenuation: soft contrast reduction where left-column text sits
      float xSpan = clamp((dispP.x - (-8.0)) / 10.0, 0.0, 1.0);
      vTextNegativeSpace = xSpan * xSpan * (3.0 - 2.0 * xSpan);

      // Continuous monotonic strand flow along wave propagation
      vec2 flowDir = normalize(vec2(0.55, 0.835));
      vec2 transDir = vec2(-flowDir.y, flowDir.x);
      float transCoord = dot(wp, transDir);

      float organicDrape = 0.55 * snoise(wp * 0.035 + vec2(t * 0.025 + 0.2, -t * 0.02 - 0.15));
      float surfaceDrape = dispP.y * 0.07 + (crests.x * 0.24 + crests.y * 0.15 + crests.z * 0.10);

      vStrandParam = (transCoord + surfaceDrape + organicDrape) * 0.052;

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
    varying float vTextNegativeSpace;

    void main() {
      // 1. Boundary envelope: soft falloff to blend mesh edges seamlessly
      float envX = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
      float envY = smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.94, vUv.y);
      float edgeEnvelope = envX * envY;

      if (edgeEnvelope < 0.002) discard;

      // 2. Procedural strand generation with screen-space anti-aliasing
      float strandCoord = vStrandParam * uStrandDensity;
      strandCoord += 0.12 * sin(strandCoord * 0.15) + 0.07 * sin(strandCoord * 0.35);

      float dist = abs(fract(strandCoord) - 0.5);
      float fDelta = max(fwidth(strandCoord), 0.0001);
      float pixelDist = dist / fDelta;

      float halfWidthPx = 0.54 * mix(0.90, 1.25, vLocalRidge);
      float strandLine = clamp(halfWidthPx - pixelDist + 0.5, 0.0, 1.0);

      // 3. Lighting & Fresnel calculation
      vec3 keyLightDir = normalize(vec3(0.45, 0.78, 0.42));
      float NdotL = max(0.0, dot(vNormal, keyLightDir));

      float NdotV = max(0.0, dot(vNormal, vViewDir));
      float fresnel = pow(1.0 - NdotV, 2.5);

      float elevFactor = smoothstep(0.2, 3.8, vElevation);

      float slopeFactor = clamp(
        vLocalRidge * 0.40 +
        fresnel * 0.22 * (0.35 + 0.65 * vCurvature) +
        NdotL * 0.28 * elevFactor,
        0.0, 1.0
      );

      // 4. Color Palette (Dark Theme: Obsidian & Emerald/Mint)
      vec3 colDeepShadow  = vec3(0.003, 0.008, 0.012); // Obsidian slate #080c14
      vec3 colDarkEmerald = vec3(0.015, 0.120, 0.055); // Dark emerald #041F0E
      vec3 colMidJade     = vec3(0.045, 0.360, 0.180); // Jade green #0B5C2E
      vec3 colMintCrest   = vec3(0.180, 0.820, 0.480); // Vibrant mint #2ED17B
      vec3 colApex        = vec3(0.880, 0.990, 0.930); // Incandescent white-mint

      vec3 strandColor;
      if (slopeFactor < 0.25) {
        strandColor = mix(colDeepShadow, colDarkEmerald, slopeFactor / 0.25);
      } else if (slopeFactor < 0.60) {
        float t = (slopeFactor - 0.25) / 0.35;
        strandColor = mix(colDarkEmerald, colMidJade, t);
      } else if (slopeFactor < 0.82) {
        float t = (slopeFactor - 0.60) / 0.22;
        strandColor = mix(colMidJade, colMintCrest, t);
      } else {
        float t = (slopeFactor - 0.82) / 0.18;
        strandColor = mix(colMintCrest, colApex, t);
      }

      // Specular apex highlight on elevated ridges
      float ridgeSharpness = pow(vLocalRidge, 2.6) * elevFactor;
      float apexRim = pow(smoothstep(0.65, 0.96, slopeFactor), 2.2) * ridgeSharpness;
      strandColor = mix(strandColor, vec3(0.96, 1.0, 0.97), apexRim * 0.92);

      // Composition & Negative Space
      vec3 finalColor = mix(colDeepShadow, strandColor, strandLine);

      // Contrast enhancement: deep valleys sink into quiet obsidian
      float valleyDarken = smoothstep(-1.5, 1.2, vElevation);
      finalColor *= mix(0.18, 1.0, valleyDarken);

      // Soft readability attenuation behind text
      finalColor *= mix(0.55, 1.0, vTextNegativeSpace);

      // 5. Light Theme Adaptation
      if (uTheme > 0.5) {
        vec3 lightValley = vec3(0.94, 0.96, 0.95);
        vec3 lightCrest = vec3(0.08, 0.35, 0.18);
        vec3 lightCol = mix(lightValley, lightCrest, pow(slopeFactor, 1.2) * strandLine);
        gl_FragColor = vec4(lightCol, edgeEnvelope * mix(0.18, 0.35, vTextNegativeSpace));
        return;
      }

      // Alpha: Crisp line rendering with subtle body in illuminated folds
      float strandAlpha = strandLine * mix(0.70, 0.98, slopeFactor);
      float bodyAlpha = (1.0 - strandLine) * 0.08 * smoothstep(0.40, 0.85, slopeFactor);
      float finalAlpha = (strandAlpha + bodyAlpha) * edgeEnvelope * mix(0.60, 1.0, vTextNegativeSpace);

      if (finalAlpha < 0.005) discard;

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `;

  // 6. Scene Initialization
  function initThreeScene() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0.0, 8.2, 22.5);
    camera.lookAt(0.8, 1.8, -1.0);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
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

    const planeWidth = 50;
    const planeDepth = 40;
    const segX = isMobile ? 180 : 280;
    const segY = isMobile ? 180 : 280;

    geometry = new THREE.PlaneGeometry(planeWidth, planeDepth, segX, segY);
    geometry.rotateX(-Math.PI / 2);

    const isLight = isLightTheme();

    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      extensions: {
        derivatives: true
      },
      uniforms: {
        uTime: { value: accumulatedTime },
        uStrandDensity: { value: isMobile ? 115.0 : 165.0 },
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

  // 7. Responsive Resize Handling
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
      camera.fov = 42;
      camera.position.set(0.0, 9.2, 25.0);
      camera.lookAt(0.2, 1.2, -1.0);
    } else {
      camera.fov = 34;
      camera.position.set(0.0, 8.2, 22.5);
      camera.lookAt(0.8, 1.8, -1.0);
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

  // 8. Animation Loop & Lifecycle
  function renderSingleFrame() {
    if (!renderer || !scene || !camera) return;
    material.uniforms.uTheme.value = isLightTheme() ? 1.0 : 0.0;
    material.uniforms.uTime.value = accumulatedTime > 0.0 ? accumulatedTime : 1.2;
    renderer.render(scene, camera);
  }

  function loop(timestamp) {
    if (!isVisible || motionQuery.matches) {
      animId = null;
      lastTimestamp = 0;
      return;
    }

    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }

    const deltaMs = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    const deltaSec = Math.min(Math.max(deltaMs, 0.0) / 1000.0, 0.1);

    accumulatedTime += deltaSec;
    material.uniforms.uTime.value = accumulatedTime;
    material.uniforms.uTheme.value = isLightTheme() ? 1.0 : 0.0;

    renderer.render(scene, camera);

    animId = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (!animId && !motionQuery.matches && isVisible && !document.hidden) {
      lastTimestamp = 0;
      animId = requestAnimationFrame(loop);
    }
  }

  function stopLoop() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    lastTimestamp = 0;
  }

  // 9. Observers & Event Listeners
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => onResize());
    ro.observe(heroSection);
  } else {
    window.addEventListener('resize', onResize, { passive: true });
  }

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

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop();
    } else if (isVisible) {
      startLoop();
    }
  });

  motionQuery.addEventListener('change', () => {
    if (motionQuery.matches) {
      stopLoop();
      renderSingleFrame();
    } else {
      startLoop();
    }
  });

  // Watch for theme class changes on html and body
  const themeObserver = new MutationObserver(() => {
    if (material && material.uniforms && material.uniforms.uTheme) {
      material.uniforms.uTheme.value = isLightTheme() ? 1.0 : 0.0;
      if (motionQuery.matches) {
        renderSingleFrame();
      }
    }
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // 10. Bootstrap
  initThreeScene();
  onResize();
  if (motionQuery.matches) {
    renderSingleFrame();
  } else {
    startLoop();
  }
})();
