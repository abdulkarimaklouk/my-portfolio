# Multi-Patch Pilot 01 — Single Surface Validation Results

**Project:** Portfolio Hero 3D Fluid Mesh Background  
**Role:** Senior 3D Technical Artist & Geometry Engineer  
**Date:** November 19, 2026  
**Architecture Tested:** Candidate D — Hybrid Multi-Patch Architecture (Independent Bivariate 3D Quad Control Cage $\to$ Catmull-Clark Subdivision)  
**Primary Visual Authority:** `docs/design/references/geometry/hero-fluid-mesh-primary.jpg`  
**Deliverable Directory:** `docs/design/prototypes/multi-patch-pilot-01/`  

---

## 1. Executive Summary & Verdict

This pilot is the first empirical test of **Candidate D (Bivariate Quad Control Cage $\to$ Catmull-Clark Subdivision)** for constructing an isolated primary crest patch (Structure B).

### Overall Verdict: **REVISE / CONDITIONAL PROGRESS**
* **Geometric Validation:** **PASS.** The architecture successfully solves the fundamental flaws of previous 1D spine extrusions and Monge heightfields. It achieves full 3D spatial coordinates $P(u, v) = (X, Y, Z)$, genuine compound double curvature ($K = \kappa_1 \kappa_2 \neq 0$), and a demonstrable physical overhang/undercut.
* **Visual Fidelity:** **REVISE.** While vastly superior to the rejected ribbon and airfoil sweeps, the isolated patch currently exhibits visible visual weaknesses: an open-boundary pinching artifact ("dog-ear" crease) at the terminal edge, excessive apex rounding under subdivision, and a tendency to read as a single draped sail or automotive canopy when viewed without secondary layered context.
* **Architecture Approval Status:** Candidate D remains **PROVISIONAL**. It is **NOT** approved for full Hero scene production.

---

## 2. Technical Measurements & Geometry Specifications

| Parameter | Measured Value | Analysis |
| :--- | :--- | :--- |
| **Control Cage Resolution** | $14$ longitudinal rows $\times 11$ transverse columns | 154 control vertices, 130 quad faces. Clean regular grid topology. |
| **Subdivided Limit Surface** | Catmull-Clark Level 3 Render | 8,320 quadrilateral faces (16,640 triangles). Zero non-quad polygons. |
| **Spatial Bounding Box** | $X \in [-10.00, +6.94]$ (Span: 16.94)<br>$Y \in [-10.36, +3.23]$ (Span: 13.60)<br>$Z \in [-4.18, +3.80]$ (Span: 7.98) | Expansive 3D volume with a 7.98-unit vertical drop from crest apex to valley trough. |
| **Undercut Drop (Focal $u=0.69$)**| $+2.12$ units vertical drop | Distance from crest apex $(Z = +2.49)$ to tucked under-shelf $(Z = +0.37)$. |
| **Undercut Lip Forward Projection**| $+1.94$ units in $Y$ | Lip projects forward past vertical toward camera before rolling under. |
| **Undercut Under-Shelf Tuck** | $-0.35$ units in $Y$ | Surface normal reverses and points downwards ($\mathbf{N}_z < 0$), proving a true geometric under-curl. |
| **Render Engine & Timing** | Blender 5.3.0 EEVEE (1080p, 4 views) | Total execution & render time: 22.91 seconds. |

---

## 3. Verified Observations Across Render Views

### 1. `render-side.png` — Silhouette & Overhang Verification
- **Verified:** The overhang is a **geometrically real 3D structure**, not a lighting trick or normal map illusion.
- The profile clearly shows the ascending flank climbing to a rounded apex, rolling forward, and curling underneath itself into a C-shaped beak with a shaded inner cavity.
- This definitively proves that Candidate D can construct deep undercuts and overhangs that are mathematically impossible on heightfields ($Z = f(X, Y)$).

### 2. `render-oblique.png` — Compound Curvature & Spatial Depth
- **Verified:** The surface exhibits genuine **compound double curvature** ($K \neq 0$).
- The lower apron basin is anticlastic (saddle-like: transversely concave towards the flank while sweeping longitudinally in $XY$).
- The crest apex is synclastic (dome-like: convex in both transverse and longitudinal axes).
- The surface does not look like an extruded cylinder or developable ribbon.

### 3. `render-control-cage.png` — Control Cage Topology Inspection
- **Verified:** The underlying control cage is a clean, low-density 3D quad net.
- Support edge loops are successfully clustered around the crest apex ($j=7, 8, 9, 10$) to preserve ridge definition under subdivision.
- Catmull-Clark subdivision smoothly interpolates the coarse cage into a continuous limit surface without surface tearing or non-manifold junctions.

### 4. `render-hero.png` — Primary Composition View
- **Verified:** The crest flows diagonally across the viewport from lower-left to upper-right, establishing the primary diagonal visual axis.
- **Weakness:** The surface takes up a massive portion of the lower frame as a monolithic, smooth grey expanse, resembling a curved sail or car hood rather than a complex fluid wave.

---

## 4. Visual Weaknesses & Failure Analysis

1. **Boundary Pinching / "Dog-Ear" Artifact (Terminal Edge):**  
   At the upper-right extremity ($u \to 1.0$), the open quad boundary terminates where the curled lip meets the back of the crest. Under Catmull-Clark subdivision, an open boundary with sharp corners produces an unnatural, pinched triangular crease. This violates the organic fluid aesthetic.  
   *Root Cause:* Open boundary topology left untapered in 3D space.

2. **Excessive Apex Softness / Lack of Razor Highlight:**  
   In `hero-fluid-mesh-primary.jpg`, the crest features a crisp, razor-sharp edge highlight spanning 3–5% of image width. In `render-hero.png`, while the ridge is curved, subdivision rounds the apex into a smooth, broad mound that diffuses specular light rather than concentrating it into a sharp luminous rim.  
   *Root Cause:* While vertices were clustered, subdivision without edge creasing still rounds off the apex.

3. **Monolithic "Sail / Sheet" Perception:**  
   The ascending flank is overly uniform. Without secondary ripples, subtle surface shear, or overlapping fluid sheets, a single continuous patch spanning the viewport inevitably reads as a draped cloth sheet, sail, or aerodynamic hood rather than viscous swirling liquid.

---

## 5. Remaining Engineering Hypotheses

| # | Hypothesis | Verification Strategy |
| :--- | :--- | :--- |
| **H1** | **Boundary Pinching Elimination:** The terminal corner artifact can be completely eliminated by tapering boundary vertices into a smooth hydrodynamic tongue or tucking the boundary into off-screen negative space. | Test in patch revision by modifying boundary vertex weight/tapering. |
| **H2** | **Crisp Luminous Crest:** Adding a semi-sharp Catmull-Clark crease weight ($e \approx 0.45 - 0.55$) along the crest apex edge loop ($j=8$) will produce the signature razor-sharp specular rim without creating faceted artifacts. | Test crease weight on apex edges in next iteration. |
| **H3** | **Multi-Layer Fluidity:** The "sail/sheet" look cannot be resolved by a single surface patch alone; it requires the interaction of **at least two overlapping layers** (Structure B + Foreground Swell C) so that the eye perceives fluid layering rather than a single draped mesh. | Test in Stage 2 (Two-Patch Overlap Proof). |

---

## 6. Technical Recommendations & Next Steps

### Recommendation: **REVISE WITHIN PILOT 01 SCOPE**

Do **not** discard Candidate D. It has proven that:
1. Procedural bivariate quad cages solve the extruded ribbon and heightfield limitations.
2. Catmull-Clark subdivision produces mathematically sound, organic, double-curved 3D surfaces.
3. True geometric undercuts can be authored procedurally in full 3D.

### Required Revisions for Visual Approval:
1. **Apply Semi-Sharp Crease to Crest Apex:** Add an edge crease weight of $0.5$ along the apex line ($j=8$) to sharpen the luminous crest highlight.
2. **Resolve Boundary Topology:** Taper and round the terminal control vertices ($u \approx 1.0$) into an organic fluid curve so subdivision does not pinch into a dog-ear.
3. **Introduce Subtle Flank Modulation:** Add a secondary non-linear wave term across the flank to break up the monolithic sheet appearance.

**Final Status:** Awaiting user review of the rendered images and technical results before proceeding to any patch revision or multi-patch expansion.
