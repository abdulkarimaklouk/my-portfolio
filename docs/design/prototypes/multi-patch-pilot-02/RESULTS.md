# Multi-Patch Pilot 02 — Two-Surface Overlap Validation Results

**Project:** Portfolio Hero 3D Fluid Mesh Background  
**Role:** Senior 3D Technical Artist & Geometry Engineer  
**Date:** November 19, 2026  
**Architecture Tested:** Candidate D — Hybrid Multi-Patch Architecture (Two Independent 3D Bivariate Quad Control Cages $\to$ Catmull-Clark Subdivision)  
**Primary Visual Authority:** `docs/design/references/geometry/hero-fluid-mesh-primary.jpg`  
**Deliverable Directory:** `docs/design/prototypes/multi-patch-pilot-02/`  

---

## 1. Executive Summary & Context

This experiment evaluates whether **two independent, non-intersecting 3D subdivided surface patches** can produce the layered, overlapping fluid structure and central dark chasm observed in the primary reference (`hero-fluid-mesh-primary.jpg`):
- **Patch A (Primary Wave / Structure B):** Bivariate quad control cage ($14 \times 11 = 154$ vertices) with crest apex crease weighting ($e = 0.50$) and physical overhang curl.
- **Patch B (Foreground Swell / Structure C):** Independently authored bivariate quad control cage ($12 \times 9 = 108$ vertices) positioned closer to the camera in depth ($Y$).

---

## 2. Technical Measurements & Verification Data

| Parameter | Measured Value | Verification Method |
| :--- | :--- | :--- |
| **Object Count** | Exactly 2 independent Blender mesh objects | Python scene inspection (`PatchA_PrimaryCrest`, `PatchB_ForegroundSwell`). |
| **Control Cage A** | $14$ rows $\times 11$ columns (154 vertices, 130 quads) | Regular quad topology with apex support loops. |
| **Control Cage B** | $12$ rows $\times 9$ columns (108 vertices, 88 quads) | Independent regular quad topology. |
| **Physical Collision Test**| **0 collisions (0 overlapping face pairs)** | `mathutils.bvhtree.BVHTree.overlap()` verified. |
| **Minimum 3D Clearance** | **$2.45$ units** | Minimum Euclidean distance between any vertex pair of Patch A and Patch B. |
| **Spatial Bounds (Patch A)**| $X \in [-10.00, +7.07], Y \in [-7.62, +3.05], Z \in [-4.02, +3.85]$ | Vertical span: $7.87$ units. |
| **Spatial Bounds (Patch B)**| $X \in [-9.60, +7.15], Y \in [-14.01, -7.40], Z \in [-2.00, +1.38]$ | Vertical span: $3.38$ units. |
| **Depth Separation** | $\Delta Y \approx 6.39$ units between crest apexes | Clear foreground / midground spatial separation. |
| **Subdivision Level** | Catmull-Clark Level 3 Render | Evaluated independently per object. |
| **Execution & Render Time**| $35.25$ seconds total for 5 views (1080p) | Blender 5.3.0 EEVEE. |

---

## 3. Verified Observations Across Render Views

### 1. Zero Physical Intersection (`BVHTree` Verified)
- Both control cages and their limit surfaces maintain a strict minimum clearance of $2.45$ units.
- No faces, edges, or vertices intersect. The two meshes are geometrically completely disjoint.

### 2. Dual Independent Quad Control Cages (`render-control-cages.png`)
- The inspection render clearly displays the dual wireframe overlays:
  - **Patch A (Cyan-Slate):** $14 \times 11$ quad net with clustered support loops along the crest and under-lip.
  - **Patch B (Amber-Gold):** $12 \times 9$ quad net forming a broad, lower-elevation convex swell.
- Proves that neither surface is a scaled copy, extrusion, or child duplicate of the other.

### 3. Clear Depth Ordering & Silhouette Overlap (`render-hero.png`, `render-side.png`)
- In `render-hero.png`, Patch B sits in front along the sightline, partially occluding the lower apron boundary of Patch A.
- In `render-side.png`, the profile silhouette clearly reveals the foreground positioning of Patch B ($Y \in [-14.0, -7.4]$) relative to Patch A ($Y \in [-7.6, +3.0]$).

### 4. Demonstrable Physical Overhang (`render-side.png`)
- Patch A's C-shaped rolled crest rolls forward past vertical and curls under, producing a true geometric shadow cavity with downward-facing normals.

---

## 4. Failed Requirements

1. **Failure to Produce an Integrated Fluid Chasm:**  
   The space between Patch A and Patch B in `render-hero.png` and `render-chasm-closeup.png` does **not** read as an organic, viscous fluid valley. It reads as **empty black background void between two detached floating objects**.  
   *Root Cause:* In the reference, the deep valley is an enclosed, self-shadowed canyon where the main crest's flank descends deeply toward a foreground fold. Here, the two patches do not overlap sufficiently in depth ($Y$), leaving an open gap where the background world shines through.

2. **Self-Intersection / Pinched Hole on Patch A Crest Tip:**  
   In `render-hero.png` and `render-oblique.png`, a dark oval pinching hole is visible near the upper-right tip of Patch A's crest.  
   *Root Cause:* At the terminal boundary ($u \approx 0.95 - 1.0$), the curling lip equation tucks under while the crest drops in elevation, causing the terminal quad vertices of the lip to cross through the shoulder geometry in the control cage.

3. **Disjointed "Floating Abstract Sculptures" Aesthetic:**  
   As seen in `render-side.png`, the two patches do not visually belong to a single fluid hydrodynamic velocity field. Patch B appears as an isolated, floating curved tile on the left, while Patch A appears as an isolated ramp on the right.

---

## 5. Visual Weaknesses (Comparison to Primary Reference)

| Feature | Primary Reference (`hero-fluid-mesh-primary.jpg`) | Multi-Patch Pilot 02 (`render-hero.png`) | Match Assessment |
| :--- | :--- | :--- | :--- |
| **Fluid Integration** | Cohesive, continuous fluid body with overlapping folds | Two detached, floating grey sheets with empty gap | **FAILED** |
| **Central Valley / Chasm** | Deep obsidian-black canyon carved into fluid body | Empty background void exposed between two meshes | **FAILED** |
| **Crest Sharpness** | Crisp, luminous, organic specular rim (3–5% width) | Edge crease ($e=0.5$) created a stiff, CAD-like seam line | **SUBOPTIMAL** |
| **Foreground Character** | Soft, broad, undulating foreground wave (Structure C) | Low-slanted sheet barely entering the lower-right | **SUBOPTIMAL** |
| **Surface Tension** | Fine ripples, fluid shear, and organic tension | Smooth, monolithic mathematical patches | **FAILED** |

---

## 6. Remaining Engineering Hypotheses

| # | Hypothesis | Assessment Status |
| :--- | :--- | :--- |
| **H1** | **Chasm Formation via Negative Space:** The hypothesis that the central valley could be formed purely by an empty spatial gap between two detached surfaces is **DISPROVEN in its current configuration**. Without significant visual overlap and self-shadowing (where Patch A's apron plunges directly behind and underneath Patch B's crest), the gap reads as an unrendered void rather than a fluid valley. | **Requires Fundamental Revision.** |
| **H2** | **Crease Weighting for Luminous Crest:** The hypothesis that a simple Catmull-Clark edge crease ($e=0.5$) would produce the reference's specular rim is **PARTIALLY FAILED**. It creates a rigid, mechanical sharp crease rather than the organic, tight-curvature smooth highlight of viscous fluid. Dense support loops with $e=0.0$ are visually superior. | **Revise to Pure Geometric Support Loops.** |
| **H3** | **Global Hydrodynamic Flow Field:** Two independent patches will only read as one fluid system if their parametric flow vectors align to a single, global continuous potential flow $\Phi(x, y, z)$. | **To be validated in next iteration.** |

---

## 7. Final Verdict

### **Verdict: REVISE**

> [!CAUTION]
> **REVISE — The architecture is promising, but this implementation does not achieve the required visual structure.**
> 
> While Candidate D successfully proves that two independent quad cages can be authored, collision-checked (clearance $2.45$ units), and subdivided without intersecting, the resulting renders **fail to produce the visual illusion of a unified fluid mesh**. The two surfaces read as separate floating sculptures, the central chasm reads as empty background void, and Patch A suffers from a terminal self-intersection hole.

### Required Changes for Next Iteration:
1. **Re-Architect Spatial Overlap for the Chasm:** Patch A's lower apron must physically extend *under* and *behind* Patch B's crest in depth ($Y$), plunging deep into negative $Z$. This ensures that camera sightlines hit the shadowed floor of Patch A rather than empty background void.
2. **Eliminate Crest Crease Weighting:** Remove edge crease layers. Restore smooth Catmull-Clark subdivision and achieve sharpness strictly through geometric support loop proximity ($j=7, 8, 9$).
3. **Fix Terminal Boundary Self-Intersection:** Re-author the curl equation at $u \to 1.0$ to ensure the lip flattens before the crest drops.
4. **Unify the Hydrodynamic Flow:** Shape Patch B so its curvature, banking, and sweep directly echo the diagonal momentum of Patch A.

---

*All files preserved in [docs/design/prototypes/multi-patch-pilot-02/](file:///c:/Users/Star/Desktop/my-portfolio/docs/design/prototypes/multi-patch-pilot-02/) for visual inspection. We stop here and await user direction before taking any further action.*
