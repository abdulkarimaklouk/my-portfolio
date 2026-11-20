---
trigger: model_decision
description: "Load whenever discussing, researching, designing, reviewing, or implementing the Portfolio Hero 3D background or its geometry."
---

# Hero 3D Background — Geometry Design Memory

## Original Visual References

These are the user-provided original reference images. They are the primary visual authority for all geometry design decisions. Always inspect them before making any design, methodology, or implementation decision. Never substitute generic images.

- `docs/design/references/geometry/hero-fluid-mesh-primary.jpg` — Primary visual reference. The clean 3D fluid mesh showing sculptural folds, emerald crests, obsidian valleys, and dense surface-following strands.
- `docs/design/references/geometry/hero-fluid-mesh-annotated.jpg` — Annotated visual breakdown with labeled elements, color palette, and design pillars.
- `docs/design/references/geometry/hero-fluid-mesh-composition.jpg` — Hero composition reference showing the mesh in context on a landing page with left-side typography.

## Project Objective

Create a distinctive, premium 3D background for the Hero section of the portfolio website.

The original visual reference supplied by the user is the ultimate visual authority.

Always inspect the actual reference before making design decisions. If it is unavailable, ask the user to provide it. Never substitute generic images.

## Target Visual Language

The desired result is an abstract, sculptural, flowing 3D fluid mesh featuring:

- Multiple interconnected organic folds.
- Complex overlapping three-dimensional surfaces.
- Deep obsidian-black valleys.
- Luminous emerald and mint-green crests.
- Dense, fine, continuous strands following the actual surface curvature.
- Asymmetrical composition and convincing depth.
- Calm negative space on the left for Hero typography.
- Subtle, slow motion in the eventual implementation.

The result must look artistic, sophisticated, and visually distinctive.

## Explicitly Rejected Results

Never approve or repeat these visual outcomes:

- Mountains or terrain.
- Desert dunes.
- Conventional ocean waves.
- Broad, smooth, nearly flat surfaces.
- Repetitive parallel cloth wrinkles.
- One dominant isolated peak.
- Disconnected decorative ribbons.
- Ordinary diagonal wireframes or cross-hatching.
- Particles used as a substitute for surface geometry.

## Lessons From Previous Experiments

The following approaches were tried and visually rejected:

- Gaussian and analytical heightfields (lacked vertical folding, undercuts, and occlusion).
- Simple parametric surface profiles.
- Blender guided cloth simulation experiments.
- Swept-spine curves with variable profiles (Primary Crest v01 and v01.1 in Blender Python): produced extruded ribbon, leaf, and aerodynamic wing aesthetics lacking compound double curvature.
- Three.js CurveModifier GPU spline deformation (CurveModifier Technology Proof 01): verified WebGL performance, but rejected due to Frenet-Serret frame locking and developable cylinder topology.

Their outputs failed to reproduce the approved visual reference.

Do not assume that any previous methodology is approved for future implementation.

The user has removed the previous generated geometry experiment folders. Do not recreate or restore them automatically.

## Technical Environment

- Windows.
- Blender 5.3.0 is installed through Microsoft Store.
- Headless invocation was verified using `blender-launcher -b`.
- Blender bundled Python and the glTF exporter were verified.
- Website architecture: Vanilla HTML, CSS, and JavaScript.
- Existing Three.js background implementation must not be modified without explicit authorization.

## Engineering Rules

1. Act as a decisive Senior 3D Technical Lead.
2. Do not generate geometry before explaining and justifying the proposed methodology.
3. Do not repeatedly modify failed methods through arbitrary parameter adjustments.
4. Begin with a small, isolated visual proof.
5. Generate actual preview images for every geometry experiment.
6. Judge the rendered image, not just code, metrics, or execution logs.
7. Compare every result against the user's original reference.
8. Obtain explicit user approval before expanding scope.
9. Never claim visual success without visual evidence.
10. The user does not want to learn or manually operate Blender. Prefer automated workflows.

## Strict Project Boundaries

- Never modify production files during geometry experiments.
- Never modify prototype files without explicit permission.
- Never delete or overwrite original visual references.
- Keep all experiments isolated.
- Do not commit or push without explicit permission.
- Do not begin shaders, strands, materials, animation, or website integration before geometry approval.

## Current Project Status

- **Status:** **Completed & Integrated into Production Portfolio.**
- **Historical Geometry Experiments:**
  - Previous ambitious geometry architectures (analytical heightfields, cloth simulations, Blender swept-spine curves v01/v01.1, Three.js CurveModifier, and multi-patch Catmull-Clark subdivision pilots) and offline node graph engines (TopoTopo) were evaluated and retired to avoid unnecessary complexity and over-engineering.
  - Historical evaluation reports are preserved in `docs/design/prototypes/geometry-experiment-archive/`.
- **Approved & Implemented Production Architecture:**
  - **Zero-Build Native Three.js:** Powered by Three.js `0.160.0` dynamically imported in `assets/js/hero-background.js` with offline/fallback protection and WebGL probe verification.
  - **GPU-Evaluated Procedural Multi-Fold Surface:** Implements organic two-tier simplex noise domain warping, diagonal midground crest, cascading rear billow, and Gerstner-style horizontal contraction.
  - **Anti-Aliased Procedural Strands:** Screen-space strand rendering using `fwidth` standard derivatives, creating fine, silky curvature-following strands with obsidian shadows, rich emerald/jade midtones, and vibrant mint crest highlights.
  - **Composition & Readability:** Spatial attenuation provides quiet negative space behind centered hero typography while framing the right and flanks with sculptural 3D fluid waves.
  - **Theme & Motion Integration:** Seamless live adaptation to dark and light themes, responsive across desktop and mobile, with `prefers-reduced-motion` compliance (rendering a single static frame without animation loop).
  - **Performance:** 60 FPS GPU performance, zero allocations in the animation loop, lifecycle management via `IntersectionObserver` and `visibilitychange`.
