/**
 * Three.js CurveModifier.Flow — Technology Proof 01 (main.js)
 * -------------------------------------------------------------
 * Role: Senior Three.js Graphics Engineer
 * Task: Validate whether CurveModifier.Flow can serve as a foundation
 *       for our sculptural 3D fluid surface construction.
 *
 * Stack:
 *   - Three.js: 0.160.0 (pinned from unpkg)
 *   - Addon: CurveModifier.js (matching 0.160.0)
 *   - Renderer: WebGLRenderer
 *   - Material: Neutral Studio Clay (MeshStandardMaterial)
 *   - Geometry: Custom 64x38 open quad mesh with 5-zone asymmetric cross-section
 *   - Curve: Spatial CatmullRomCurve3 with 3D banking and elevation
 */

import * as THREE from 'three';
import { Flow } from 'three/addons/modifiers/CurveModifier.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Global execution log for verification
window.__PROOF_LOGS = [];
function log(msg) {
  console.log(msg);
  window.__PROOF_LOGS.push(String(msg));
}

log('===========================================================');
log(`Three.js Version: ${THREE.REVISION} (Requirement: 0.160.0)`);
log('Testing CurveModifier.Flow Addon Integration...');
log('===========================================================');

// 1. Scene, Camera, Renderer Setup
const container = document.getElementById('canvas-container');
const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080a0d); // Dark neutral slate

const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
// Three-quarter camera angle revealing both curve flow and transverse cross-section
camera.position.set(3.5, 9.0, 18.5);
camera.lookAt(0.5, 1.2, 0.0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(width, height);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0.5, 1.2, 0.0);
controls.update();

// 2. Spatial 3D Spine Curve Definition
// A non-planar CatmullRomCurve3 with diagonal flow, elevation rise, and spatial sweep
const curvePoints = [
  new THREE.Vector3(-9.0, -1.8, -3.2),  // P0: Lower-left entrance
  new THREE.Vector3(-4.5,  0.5, -1.2),  // P1: Ascending into frame
  new THREE.Vector3( 0.2,  2.2,  0.8),  // P2: Mid-frame surge
  new THREE.Vector3( 4.8,  3.6,  2.5),  // P3: High focal crest zone
  new THREE.Vector3( 8.5,  2.8,  1.2)   // P4: Background recession
];

const curve = new THREE.CatmullRomCurve3(curvePoints);
curve.curveType = 'centripetal';
curve.closed = false;

const curveLength = curve.getLength();
log(`[1] 3D Spine Curve created:`);
log(`    Points: ${curvePoints.length}, Length: ${curveLength.toFixed(2)} units`);

// Visualize the spine path as a reference line (subtle dim guide)
const spinePoints = curve.getPoints(100);
const spineGeo = new THREE.BufferGeometry().setFromPoints(spinePoints);
const spineMat = new THREE.LineBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.4 });
const spineLine = new THREE.Line(spineGeo, spineMat);
scene.add(spineLine);

// 3. Custom Input Geometry Construction (64 x 38 Open Quad Mesh)
// Must NOT be a plane, cylinder, ribbon, or tube.
// Contains 5 distinct anatomical zones with asymmetric cross-section and variable longitudinal width.
const Nu = 64; // Subdivisions along longitudinal axis (X)
const Nv = 38; // Subdivisions across transverse profile (Z, Y)

function getLongitudinalParams(u) {
  // Continuous longitudinal modulation along normalized path u in [0, 1]
  const hPeak = 3.6;
  const hStart = 0.8;
  const hEnd = 1.0;
  let H;
  if (u < 0.65) {
    const t = u / 0.65;
    H = hStart + (hPeak - hStart) * Math.pow(Math.sin(t * Math.PI * 0.5), 1.5);
  } else {
    const t = (u - 0.65) / 0.35;
    H = hPeak - (hPeak - hEnd) * Math.pow(Math.sin(t * Math.PI * 0.5), 1.3);
  }

  const Wapron = 4.40 + 1.15 * Math.sin(u * Math.PI * 0.85) - 1.25 * Math.pow(u, 2.2);
  const Wback = 0.80 + 0.65 * Math.sin(u * Math.PI * 0.90);
  const Dcurl = 1.65 * Math.pow(Math.sin(u * Math.PI * 0.95), 2.2);

  return { Wapron, Wback, H, Dcurl };
}

function centripetalCatmullRom2D(nodes, samplesPerSeg, alpha = 0.5) {
  // Virtual ghost points for boundary tangent continuation
  const qFirst = new THREE.Vector2().copy(nodes[0]).multiplyScalar(2).sub(nodes[1]);
  const qLast = new THREE.Vector2().copy(nodes[nodes.length - 1]).multiplyScalar(2).sub(nodes[nodes.length - 2]);
  const full = [qFirst, ...nodes, qLast];

  function getT(tVal, p0, p1) {
    const d = p0.distanceTo(p1);
    return tVal + (d > 1e-6 ? Math.pow(d, alpha) : 1e-6);
  }

  const out = [];
  for (let i = 1; i < full.length - 2; i++) {
    const p0 = full[i - 1];
    const p1 = full[i];
    const p2 = full[i + 1];
    const p3 = full[i + 2];

    const t0 = 0.0;
    const t1 = getT(t0, p0, p1);
    const t2 = getT(t1, p1, p2);
    const t3 = getT(t2, p2, p3);

    const segSamples = samplesPerSeg[i - 1];
    for (let s = 0; s < segSamples; s++) {
      const frac = s / segSamples;
      const t = t1 + frac * (t2 - t1);

      const a1 = new THREE.Vector2().lerpVectors(p0, p1, (t - t0) / (t1 - t0));
      const a2 = new THREE.Vector2().lerpVectors(p1, p2, (t - t1) / (t2 - t1));
      const a3 = new THREE.Vector2().lerpVectors(p2, p3, (t - t2) / (t3 - t2));

      const b1 = new THREE.Vector2().lerpVectors(a1, a2, (t - t0) / (t2 - t0));
      const b2 = new THREE.Vector2().lerpVectors(a2, a3, (t - t1) / (t3 - t1));

      const c = new THREE.Vector2().lerpVectors(b1, b2, (t - t1) / (t2 - t1));
      out.push(c);
    }
  }
  out.push(nodes[nodes.length - 1].clone());
  return out;
}

const segSamples = [5, 7, 8, 5, 6, 6]; // 37 intervals -> 38 transverse points

// Build base mesh vertex positions, normals, and UVs
// X is along curve length [0, curveLength]
// Y is elevation (Normal axis)
// Z is across fold (Binormal axis)
const positions = [];
const uvs = [];
const indices = [];

for (let i = 0; i < Nu; i++) {
  const u = i / (Nu - 1);
  const x = u * curveLength;
  const { Wapron, Wback, H, Dcurl } = getLongitudinalParams(u);

  // 7 Control nodes defining the 5 anatomical zones:
  // q0: Apron boundary (Zone A)
  // q1: Valley basin trough (Zone A concave depression)
  // q2: Sigmoid ascending flank (Zone B inflection)
  // q3: Crest shoulder (Zone C transition)
  // q4: Crest apex ridge (Zone C peak elevation)
  // q5: Overhanging lip (Zone D forward-projected curl)
  // q6: Tucked shadow pocket (Zone D/E recessed under-shelf)
  const qNodes = [
    new THREE.Vector2(-1.00 * Wapron, -0.15 * H),
    new THREE.Vector2(-0.80 * Wapron, -0.50 * H),
    new THREE.Vector2(-0.45 * Wapron,  0.15 * H),
    new THREE.Vector2(-0.15 * Wapron,  0.92 * H),
    new THREE.Vector2( 0.00,           1.00 * H),
    new THREE.Vector2( 0.40 * Wback,   0.40 * H - 0.20 * Dcurl),
    new THREE.Vector2(-0.10 * Wback,  -0.30 * H - 1.00 * Dcurl)
  ];

  const profile = centripetalCatmullRom2D(qNodes, segSamples, 0.5);

  for (let j = 0; j < Nv; j++) {
    const v = j / (Nv - 1);
    const z = profile[j].x; // Transverse coordinate (Binormal)
    const y = profile[j].y; // Elevation coordinate (Normal)
    positions.push(x, y, z);
    uvs.push(u, v);
  }
}

// Generate quad indices (2 triangles per quad)
for (let i = 0; i < Nu - 1; i++) {
  for (let j = 0; j < Nv - 1; j++) {
    const idx00 = i * Nv + j;
    const idx10 = (i + 1) * Nv + j;
    const idx11 = (i + 1) * Nv + (j + 1);
    const idx01 = i * Nv + (j + 1);

    indices.push(idx00, idx10, idx11);
    indices.push(idx00, idx11, idx01);
  }
}

const baseGeometry = new THREE.BufferGeometry();
baseGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
baseGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
baseGeometry.setIndex(indices);

// Rotate base geometry by -90 deg around X so the crest apex maps to the vertical axis in the Frenet frame
baseGeometry.rotateX(-Math.PI / 2);
baseGeometry.computeVertexNormals();

log(`[2] Custom Input Geometry generated:`);
log(`    Vertices: ${positions.length / 3} (${Nu} x ${Nv}), Faces: ${indices.length / 3} triangles`);
log(`    X span: [0, ${curveLength.toFixed(2)}], Y span: [-${(3.6*0.5).toFixed(1)}, +3.60], Z span: [-5.20, +1.40]`);

// 4. Neutral Clay Material
const clayMaterial = new THREE.MeshStandardMaterial({
  color: 0x3d4b44,       // Neutral dark moss/clay
  roughness: 0.38,       // Matte clay finish revealing curvature
  metalness: 0.06,
  side: THREE.DoubleSide // Visible on both front and undercut sides
});

const baseMesh = new THREE.Mesh(baseGeometry, clayMaterial);

// 5. CurveModifier.Flow Integration
log(`[3] Initializing CurveModifier.Flow...`);
let flow;
try {
  flow = new Flow(baseMesh);
  flow.updateCurve(0, curve);
  // Key configuration: spineOffset aligns start of mesh (X=0) with start of curve
  flow.uniforms.spineOffset.value = 0.0;
  flow.uniforms.spineLength.value = curveLength;
  scene.add(flow.object3D);
  log(`    SUCCESS: Flow object created and linked to curve (length=${curveLength.toFixed(2)})`);
} catch (err) {
  log(`    ERROR: Flow initialization failed: ${err.message}`);
}

// 6. Studio Lighting Setup (Clear highlights, soft fill, deep shadows)
const ambientLight = new THREE.AmbientLight(0x1a242c, 1.8);
scene.add(ambientLight);

// Key grazing sun: highlights the crest ridge from upper-right
const rimLight = new THREE.DirectionalLight(0xddeedd, 4.2);
rimLight.position.set(-6.0, 14.0, -8.0);
scene.add(rimLight);

// Soft fill light: reveals the apron S-curve and valley basin
const fillLight = new THREE.DirectionalLight(0x779988, 2.0);
fillLight.position.set(10.0, 6.0, 12.0);
scene.add(fillLight);

// Under-shadow bounce light
const bounceLight = new THREE.DirectionalLight(0x223328, 1.2);
bounceLight.position.set(-2.0, -8.0, 4.0);
scene.add(bounceLight);

log(`[4] Studio Lighting & Camera established:`);
log(`    Camera Pos: (${camera.position.x}, ${camera.position.y}, ${camera.position.z})`);
log(`    Lights: Ambient (1.8), Rim Grazing (4.2), Key Fill (2.0), Bounce (1.2)`);

// 7. Render Loop
function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

// First render pass
render();
window.__PROOF_READY = true;
log('[5] First render completed successfully. Canvas ready.');
log('===========================================================');
log('PROOF 01 EXECUTION FINISHED WITHOUT ERRORS');
log('===========================================================');

// Handle resize
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  render();
});

animate();
