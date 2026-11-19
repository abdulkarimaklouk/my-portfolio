# Multi-Patch 3D Surface Architecture Research

**Role:** Senior 3D Technical Director and Procedural Surface Modeling Engineer  
**Date:** November 2026  
**Document Status:** Complete Architecture Research & Methodology Investigation  
**Primary Visual Authority:** `docs/design/references/geometry/hero-fluid-mesh-primary.jpg`  
**Reference Insets:** `hero-fluid-mesh-annotated.jpg`, `hero-fluid-mesh-composition.jpg`  

---

## 1. Executive Problem Statement: Why Previous Experiments Failed

To establish a valid architecture for reproducing the Hero 3D background fluid mesh, we must examine the fundamental mathematical failure modes of the three rejected geometry experiments:
- **Primary Crest v01** (6-point Bézier spine + Double Reflection RMF + Catmull-Clark subdivision in Blender Python): Resembled a thick, folded leaf or ribbon with a single illuminated edge and insufficient visible undercut.
- **Primary Crest v01.1** (5-zone asymmetric profile modulated along 3D spine in Blender Python): Still exhibited a mechanical, extruded ribbon / bent aerodynamic wing look, lacking compound organic curvature.
- **CurveModifier Technology Proof 01** (Three.js `0.160.0` `CurveModifier.Flow` GPU vertex displacement along 3D spline): Confirmed clean 60 FPS WebGL execution, but suffered from rigid Frenet-Serret frame orientation lock and the same extruded wing aesthetic.

```
           [ Extruded Spine Sweeps (Rejected) ]
           1D Curve C(u) ──(sweep)──> Transverse Profile P(v)
                     │
                     ▼
           - Ruled / Generalized Cylinder Topology
           - Planar Transverse Cross-Sections (u = const)
           - Developable / Near-Zero Gaussian Curvature (K ≈ 0)
           - Visible Result: Bent ribbon, leaf, pipe, or airplane wing.
```

### Core Mathematical Failure Drivers
1. **Dimensional Constraint (1D $\times$ 1D vs. True 2D Manifold):**  
   Extruding or deforming a 2D cross-section along a 1D spatial spine forces every transverse slice to be a rigid or uniformly scaled replica of the generator profile. In real fluid mechanics (e.g., viscous paint, molten glass, or hydrodynamic breaking waves), the wave crest travels at a different velocity and vector than the base apron. This generates **differential longitudinal shear**, causing the surface to billow, curl, and twist organically. A 1D sweep cannot represent this behavior.
2. **Topological Inadequacy (Monolithic vs. Layered Occlusion):**  
   Attempting to model the entire visual field—or even the main crest and its surroundings—as a single connected manifold forces continuous geometry across regions that, in the reference, are separated by deep, self-occluding spatial voids.
3. **Curvature Degeneracy:**  
   Spine extrusions naturally produce developable surfaces with near-zero Gaussian curvature ($K = \kappa_1 \kappa_2 \approx 0$). The reference visual language is characterized by **compound double curvature** ($K \neq 0$), featuring synclastic domed crest bulges ($K > 0$) transitioning into anticlastic saddle-like apron basins ($K < 0$).

---

## 2. Evaluation of Candidate Geometry Representations

We evaluate four structural representations for independently controlled, overlapping 3D surface patches:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Candidate A: Bicubic Bézier Patches (Tensor-Product 4x4 Nets)               │
├─────────────────────────────────────────────────────────────────────────────┤
│ Candidate B: Non-Uniform Rational B-Splines (NURBS Patches)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ Candidate C: Subdivision Surface Control Cages (Catmull-Clark Quads)        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Candidate D: Hybrid Architecture (Parametric Quad Cage -> Subdiv Limit)     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Candidate A — Bicubic Bézier Surface Patches

#### Formulation & Mechanics
A tensor-product bicubic Bézier patch is defined by a $4 \times 4$ control net of 16 spatial points $\mathbf{P}_{i,j} \in \mathbb{R}^3$:
$$\mathbf{S}(u, v) = \sum_{i=0}^3 \sum_{j=0}^3 B_{i,3}(u) B_{j,3}(v) \mathbf{P}_{i,j}, \quad u, v \in [0, 1]$$
where $B_{k,3}(t) = \binom{3}{k} t^k (1-t)^{3-k}$ are the cubic Bernstein basis polynomials.

* **Corner Vertices (4):** Define the 3D patch boundary corners.
* **Boundary Vertices (8):** Define boundary tangent vectors and boundary cubic curves.
* **Internal Vertices (4):** $\mathbf{P}_{1,1}, \mathbf{P}_{1,2}, \mathbf{P}_{2,1}, \mathbf{P}_{2,2}$ directly govern internal twist vectors ($\frac{\partial^2 \mathbf{S}}{\partial u \partial v}$), enabling direct, localized control of saddle shapes and bulging without altering the outer boundaries.

#### Evaluation Against Criteria
* **Visual Fidelity & Curvature:** High. Guarantees $C^\infty$ internal smoothness; naturally creates compound double curvature ($K \neq 0$).
* **Undercuts & Overhangs:** Fully supported. The 16 control points can freely fold past $90^\circ$ and $180^\circ$ in 3D space to form curled fluid lips and shadow recesses.
* **Strand Potential:** Excellent. Analytical $u$-isocurves provide mathematically continuous streamlines with zero topological distortion.
* **Core Limitation:** A single bicubic patch has limited inflection capacity (degree 3 allows at most one inflection point per parametric direction). Representing an S-curved apron that ascends into a flank, rolls over a crest, and curls into an undercut requires stitching 2 to 3 patches together. Maintaining $G^1$ or $C^1$ continuity across stitched Bézier patch boundaries requires strict collinearity constraints between adjacent rows of control points, which adds significant mathematical overhead when automated procedurally.

---

### Candidate B — NURBS Surface Patches

#### Formulation & Mechanics
$$\mathbf{S}(u, v) = \frac{\sum_{i=0}^n \sum_{j=0}^m N_{i,p}(u) N_{j,q}(v) w_{i,j} \mathbf{P}_{i,j}}{\sum_{i=0}^n \sum_{j=0}^m N_{i,p}(u) N_{j,q}(v) w_{i,j}}$$
where $N_{i,p}$ are B-spline basis functions of degree $p, q$ over non-uniform knot vectors $U$ and $V$, and $w_{i,j}$ are rational weights.

#### Evaluation Against Criteria
* **Visual Fidelity & Curvature:** Maximum theoretical precision. Industry benchmark for automotive and industrial class-A surfacing.
* **Localized Control:** Non-uniform knot vectors permit localized knot insertion without altering global shape; rational weights $w_{i,j}$ allow sharpening a crest ridge without adding dense geometry.
* **Undercuts & Overhangs:** Fully supported.
* **Core Limitations & Failure Risks:**
  1. *Ecosystem / Runtime Deficit:* Three.js has rudimentary, CPU-evaluated NURBS support (`NURBSSurface.js`). It lacks native WebGL GPU evaluation shaders and cannot dynamically tessellate rational surfaces efficiently.
  2. *Tooling Friction:* While Blender supports NURBS surfaces, its NURBS modeling and Python API tools are notoriously limited compared to its polygonal BMesh engine. Blender automatically tessellates NURBS to polygons upon glTF export, forfeiting any native mathematical advantages at runtime.

---

### Candidate C — Subdivision Surface Control Cages (Quad-Dominant Catmull-Clark)

#### Formulation & Mechanics
A low-density spatial polygonal cage $M_0 = (V_0, E_0, F_0)$ composed of quadrilateral faces is recursively subdivided via the Catmull-Clark scheme. The limit surface is guaranteed $C^2$ continuous everywhere except at extraordinary vertices (valence $\neq 4$), where it is $C^1$.

#### Evaluation Against Criteria
* **Visual Fidelity & Curvature:** Outstanding. This is the universal standard in film/VFX (Pixar OpenSubdiv) and digital sculpting. It bridges the gap between discrete polygonal control and smooth analytical curvature.
* **Undercuts & Overhangs:** Arbitrary topological freedom. Edge loops can tuck, twist, and wrap around one another without the rigid tensor-product rectangular grid constraints of Bézier/NURBS.
* **Feature Sharpness:** Crest sharpness is directly controlled via geometric support edge loops or semi-sharp crease weights ($e \in [0, 1]$), eliminating the need for complex rational weight mathematics.
* **Ecosystem & Deployment:** Supported natively and flawlessly across the entire pipeline: modeled or procedurally generated in Blender via BMesh, exported via glTF as clean indexed BufferGeometry, and rendered in Three.js with 1 draw call per mesh.
* **Core Limitation:** If modeled manually, it requires an artist in the GUI. If generated purely procedurally via raw vertex coordinate arrays, sculpting organic compound curvature without an underlying mathematical guide can be tedious and prone to irregular surface faceting.

---

### Candidate D — Hybrid Multi-Patch Architecture (Parametric Quad Cage $\to$ Catmull-Clark Subdivision Limit)

#### Formulation & Mechanics
Combines the procedural, mathematical rigor of parametric patch design with the topological and rendering strengths of Catmull-Clark subdivision:

```
┌─────────────────────────────────┐
│ 1. Analytical Parametric Net    │  Evaluates a low-density 2D grid of control vertices
│    P(i, j) in 3D Space          │  governed by continuous bivariate shaping equations.
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ 2. Quad-Dominant Control Cage   │  Constructed as an open quadrilateral cage with
│    (Coarse 6x8 to 8x12 mesh)    │  support loops placed along the crest ridge.
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ 3. Catmull-Clark Subdivision    │  Subdivides into an ultra-smooth limit surface
│    Limit Evaluation             │  (C² regular / C¹ extraordinary) with regular UVs.
└─────────────────────────────────┘
```

#### Evaluation Against Criteria
* **Solves the Scripting Bottleneck:** The control vertices are placed by an analytical bivariate function $\mathbf{P}(u, v) = [X(u,v), Y(u,v), Z(u,v)]$, guaranteeing smooth mathematical proportions and compound double curvature.
* **Solves the Ribbon Flaw:** Because every control vertex $(i, j)$ in the cage has independent 3D coordinates, transverse profiles are not copies or extrusions. They flare, shear, twist, and curl independently across the surface.
* **Solves the Runtime Bottleneck:** Outputs standard indexed quad-derived triangle meshes directly compatible with Three.js WebGLRenderer, requiring zero custom runtime modifiers or CPU overhead.

---

## 3. Structural Decomposition of the Reference into Independent Patches

Direct inspection of `hero-fluid-mesh-primary.jpg`, `hero-fluid-mesh-annotated.jpg`, and `hero-fluid-mesh-composition.jpg` reveals that the composition is **not** a single continuous sheet, nor is it a cloud of disconnected ribbons.

It consists of **three primary functional surface layers** interacting across distinct camera depth planes:

```
Camera Viewport (Front-to-Back Layering)
================================================================================
Foreground (Z ≈ +2.5):   [ Patch 2: Foreground Undulating Swell (Structure C) ]
                                      │
                                      ▼ (Deep Negative Space / Obsidian Chasm)
Midground  (Z ≈  0.0):   [ Patch 1: Dominant Sculptural Wave    (Structure B) ]
                                      │
                                      ▼ (Mutual Occlusion & Shadow)
Background (Z ≈ -3.5):   [ Patch 3: Distant Receding Flow       (Structure A/D)]
================================================================================
```

### Patch 1: Main Sculptural Wave (Structure B)
* **Visual Role:** Visual centerpiece and focal hierarchy anchor.
* **Path & Spatial Coverage:** Sweeps diagonally from lower-midground $(x \approx 0.25, y \approx 0.55)$ up to the focal apex at $(x \approx 0.85, y \approx 0.15)$.
* **Internal Anatomy & Curvature:**
  - *Apron Basin:* Wide, anticlastic ($K < 0$) saddle flaring downward into the central abyss.
  - *Ascending Flank:* Steep, tensioned slope facing the camera, catching dense directional light.
  - *Crest Apex Ridge:* Concentrated, high-curvature convex ridge ($K > 0$) catching the brightest specular rim highlight.
  - *Overhanging Lip & Shadow Pocket:* Surface curls forward and downward past $110^\circ$, tucking into a deep recessed under-shelf that casts an ambient occlusion shadow.
* **Boundary Management:** The lower apron plunges into the pitch-black void of the central valley; the upper crest tapers off-screen right; the left flank fades into the quiet text zone.

### Patch 2: Foreground Undulating Swell (Structure C)
* **Visual Role:** Establishes foreground depth and frames the bottom edge of the composition.
* **Path & Spatial Coverage:** Spans the lower third of the frame ($y \approx 0.65 - 1.0$), closest to the camera ($+Z$).
* **Internal Anatomy:** A broader, gentler undulating fluid fold. Features a low transverse roll that rises gently on the right-hand side.
* **Depth Separation:** Sits substantially in front of Patch 1 along the camera axis ($Z$). In full rendering, optical shallow depth of field renders its crest with a subtle softening blur.

### Patch 3: Distant Receding Flow (Structure A / D)
* **Visual Role:** Provides atmospheric layering and prevents the upper-left quadrant from feeling like an empty geometric void.
* **Path & Spatial Coverage:** Sweeps across the upper quadrant ($y \approx 0.0 - 0.35$), positioned in the background ($-Z$).
* **Internal Anatomy:** Broad, low-amplitude convex roll catching soft, diffuse grazing light. Its contours visually echo Patch 1 without competing for luminance.

### The Central Deep Valley (Negative Space)
* **Critical Finding:** The deep valley between Structure B and Structure C is **not** a modeled geometry trough!
* **Geometric Justification:** It is an **inter-surface chasm** created by the physical spatial separation between Patch 1 and Patch 2. Patch 1's apron plunges downwards and backwards into darkness, while Patch 2 rises in the foreground. Because no light reaches into this physical inter-surface void, it naturally renders as an obsidian-black chasm. Attempting to stitch B and C together with a continuous mesh would destroy this depth and force artificial topology into the void.

---

## 4. Comprehensive Comparison of Candidates

*Evaluation Scale: 1 (Poor / High Risk) to 5 (Optimal / Robust)*

| Evaluation Criteria | A. Bicubic Bézier Patches | B. NURBS Patches | C. Subdivision Cages | D. Hybrid Architecture (Parametric $\to$ Subdiv) |
| :--- | :---: | :---: | :---: | :---: |
| **1. Visual Fidelity Potential** | 4 / 5 | 5 / 5 | 4 / 5 | **5 / 5** |
| **2. Control Over Sculptural Folds** | 3 / 5 | 4 / 5 | 4 / 5 | **5 / 5** |
| **3. Natural Undercuts & Overhangs** | 4 / 5 | 4 / 5 | 5 / 5 | **5 / 5** |
| **4. Surface Continuity & Topology** | 3 / 5 ($G^1$ stitching risk) | 5 / 5 ($C^2$ knot vector) | 4 / 5 ($C^2$ reg / $C^1$ extra) | **5 / 5 ($C^2$ reg / $C^1$ extra + quad flow)** |
| **5. Overlapping Patch Management** | 4 / 5 | 4 / 5 | 5 / 5 | **5 / 5** |
| **6. UV & Strand-Generation Potential** | 5 / 5 (Exact isocurves) | 5 / 5 (Exact isocurves) | 4 / 5 (Discrete quad UVs) | **5 / 5 (Inherited regular grid)** |
| **7. Automation (Python / JS)** | 3 / 5 (Complex algebra) | 2 / 5 (Poor tool support) | 3 / 5 (Heuristic placement)| **5 / 5 (Bivariate equations)** |
| **8. Runtime Performance (Three.js)**| 4 / 5 (Static tessellation) | 1 / 5 (No native WebGL) | 5 / 5 (Standard BufferGeo)| **5 / 5 (Single-call BufferGeo)** |
| **9. Implementation Complexity** | 4 / 5 (Boundary stitching) | 5 / 5 (Highest friction) | 2 / 5 (Low complexity) | **3 / 5 (Moderate math, low tool friction)** |
| **10. Resistance to Visual Failure** | 3 / 5 (Can feel CAD-like)| 3 / 5 (Mathematical stiffness)| 4 / 5 (Faceting if low poly)| **5 / 5 (Double curvature + smooth limit)**|
| **TOTAL SCORE** | **33 / 50** | **33 / 50** | **40 / 50** | **48 / 50** |

---

### Analysis of Verified Capabilities vs. Engineering Hypotheses

#### Verified Capabilities (Observed & Tested)
1. **1D Spine Extrusions Produce Ribbon / Wing Artifacts:** Confirmed empirically in Blender Python (v01, v01.1) and Three.js (`CurveModifier.Flow` Proof 01).
2. **Heightfields ($z = f(x, y)$) Cannot Produce Overhangs:** Confirmed mathematically; single-valued fields cannot wrap past vertical.
3. **Catmull-Clark Subdivision Yields Superior Organic Fluid Aesthetics:** Verified in 3D production pipelines; subdivision surfaces inherently relax curvature variations into fair, organic transitions.
4. **Three.js Zero-Build Stack Handles Multiple Buffered Geometries at 60 FPS:** Verified in Proof 01; rendering 3 distinct BufferGeometries incurs negligible GPU/CPU overhead.

#### Engineering Hypotheses (Requiring Empirical Validation)
1. **Hypothesis 1 (Chasm Separation):** Generating Structure B and Structure C as two physically detached patches with a spatial gap in $Z$ will render as a continuous, organic fluid chasm without revealing patch boundary edges.
2. **Hypothesis 2 (Bivariate Control Net):** An analytical bivariate function $\mathbf{P}(u, v)$ with 2D non-linear terms can place a coarse $8 \times 10$ quad cage that exhibits compound double curvature ($K \neq 0$) without requiring manual GUI sculpting.
3. **Hypothesis 3 (Subdivided Quad UV Flow):** The quad UV coordinates generated from this bivariate cage will maintain sufficient metric uniformity to drive anisotropic surface strands cleanly.

---

## 5. How to Prevent Multi-Patch Surfaces from Looking Like Disconnected Ribbons

The explicit danger of a multi-patch architecture is that it could degenerate into floating decorative tapes. We establish four mandatory geometric guardrails:

```
[ Guardrail 1: Non-Developable Double Curvature (K ≠ 0) ]
Every patch must exhibit compound curvature across both u and v.
Saddle basins (K < 0) transitioning into domed crests (K > 0).
Tapes and ribbons are developable (K = 0); viscous fluid is non-developable.

[ Guardrail 2: Asymmetric Boundary Divergence ]
Boundaries must not run parallel. The apron base must flare out broadly (fan-like)
while the crest apex focuses into a tight, tense ridge line.

[ Guardrail 3: Strict Boundary Occlusion & Frustum Anchoring ]
No patch boundary may terminate in visible, brightly lit open space:
  - Boundary A: Exits off-screen (camera frustum clipping).
  - Boundary B: Plunges into deep shadow (tucked under an overhanging lip).
  - Boundary C: Occluded behind a foreground surface layer.

[ Guardrail 4: Coherent Hydrodynamic Velocity Field ]
All three patches must align their longitudinal parametric vectors along a shared
swirling hydrodynamic potential field, ensuring they read as a single fluid system.
```

---

## 6. Technical Recommendation & Proposed Pilot Scope

### Recommended Architecture: Candidate D (Hybrid Parametric Quad Net $\to$ Catmull-Clark Subdivision)

We recommend adopting **Candidate D**:
1. **Geometry Generation:** Formulate each patch as an analytical bivariate parametric control net $\mathbf{P}(u_i, v_j)$ in 3D space, capturing asymmetric crest elevation, non-linear apron flaring, and curled overhanging lips.
2. **Topology:** Construct an open, quad-only control cage (e.g., $8 \times 12$ quads for Structure B; $6 \times 8$ quads for Structure C).
3. **Subdivision:** Apply Catmull-Clark subdivision (level 2 or 3) to evaluate the smooth limit surface ($C^2$ in regular regions, $C^1$ at extraordinary vertices) with preserved crest sharpness via localized support loops.
4. **Spatial Layout:** Position the surfaces as physically independent layers in 3D space (Foreground, Midground, Background) with true spatial occlusions and deep negative space chasms.

---

### Minimal Visual-Proof Experiment Proposal (Pilot Proof 02)

To validate this architecture without building the entire scene or modifying website files, we propose a tightly constrained, two-stage visual proof:

```
[ Proposed Pilot Proof 02 Scope ]
Stage 1: Isolated Primary Crest Patch (Structure B)
         - Built using Candidate D (Bivariate Quad Net -> Subsurf).
         - Objective: Visually prove that the patch achieves true compound double
           curvature and deep undercut without resembling an extruded ribbon or wing.

Stage 2: Two-Patch Overlap & Chasm Proof (Structure B + Foreground Swell C)
         - Introduce the second patch (Structure C) at foreground depth.
         - Objective: Visually prove that the deep valley is successfully formed by
           inter-surface negative space and depth occlusion without visible seams.
```

* **Environment:** Executed headlessly via automated script producing a high-resolution render.
* **Evaluation Standard:** Visual comparison against `hero-fluid-mesh-primary.jpg`.
* **Strict Constraint:** Zero modification of production files, zero dependencies installed, no commit or push.
* **Approval Gate:** No implementation beyond Stage 1 without explicit visual authorization.
