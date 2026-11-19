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

- Gaussian and analytical heightfields.
- Simple parametric surface profiles.
- Blender guided cloth simulation experiments.

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

- Previous geometry experiments have been deleted by the user.
- No geometry implementation is currently approved.
- No new geometry methodology has been selected.
- The next engineering task is an independent review of the original visual reference and a proposal for a fundamentally better geometry construction method.

> [!IMPORTANT]
> This memory records project decisions and constraints. It does not authorize implementation.
