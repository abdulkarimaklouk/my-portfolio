# Portfolio Design System — QUIET 3D: Engineered with Intent

**Project:** Abdulkarim Aklouk — Public Personal Portfolio (`index.html`)  
**Scope:** Foundational Visual & Interaction Design Specification (Phase 01)  
**Target Stack:** Zero-build Vanilla HTML5, CSS3, ES6+ JavaScript on GitHub Pages (`/my-portfolio/`)  
**Status:** Design Specification (No implementation code included)

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Principles & Anti-AI Guardrails](#2-design-principles--anti-ai-guardrails)
3. [Color System & Semantic Tokens](#3-color-system--semantic-tokens)
4. [Typography System](#4-typography-system)
5. [Spacing, Grid & Layout Composition](#5-spacing-grid--layout-composition)
6. [Materials & Surface Vocabulary](#6-materials--surface-vocabulary)
7. [3D Depth & Spatial System](#7-3d-depth--spatial-system)
8. [Lighting & Shadow Model](#8-lighting--shadow-model)
9. [Component Design Language](#9-component-design-language)
10. [Motion & Interaction System](#10-motion--interaction-system)
11. [Responsive Design Specification](#11-responsive-design-specification)
12. [Accessibility & Usability Requirements](#12-accessibility--usability-requirements)
13. [CSS Custom Property Mapping](#13-css-custom-property-mapping)
14. [Design Acceptance Criteria](#14-design-acceptance-criteria)

---

## 1. Design Philosophy

The redesign establishes a singular visual identity: **QUIET 3D — Engineered with Intent**.

Rather than treating 3D as spectacle or relying on a generic developer template, the portfolio presents Abdulkarim Aklouk's engineering work like a precision-machined architectural monograph. Depth, light, typography, and negative space work together so the visitor perceives structural craft before reading a single line of copy—while never competing with the readability of project architectures, backend status disclosures, or contact pathways.

### Core Brand Qualities

| Quality                   | Visual Translation                                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Engineering Precision** | Aligned structural grids, hairline dividers, monospaced technical metadata, explicit Z-plane hierarchy.                    |
| **Sophistication**        | Bold, architectural Midnight Black (`#0B0B0C`) and Pure White (`#FFFFFF`) foundation, accented with Lime Green (`#C6F432`) and atmospheric lighting. |
| **Technical Depth**       | Disciplined surface hierarchy, clean geometric framing, and selective atmospheric radial blooms contained within isolated stacking contexts. |
| **Calm Confidence**       | Controlled negative space, 60/30/10 color distribution, and zero visual shouting or decorative clutter.                       |
| **Editorial Authorship**  | Section-specific lighting hierarchy (Hero and Contact atmospheric peaks, Projects controlled spotlight, calm obsidian zones). |

### Evolution from Current Design

The existing site used an arbitrary lavender accent (`#a789d4`) on dark blue, uniform centered cards across sections, and neon-tinted glow shadows. This design system replaces those patterns with:

- **Electric Elegance + Immersive Digital:** The **Midnight Black (`#0B0B0C`) / Pure White (`#FFFFFF`) / Lime Green (`#C6F432`)** palette deployed with restrained **Atmospheric Backgrounds**.
- **Physical surface lighting & ambient occlusion** instead of glowing halos or arbitrary neon borders.
- **Distinct section compositions** preserving all eight required sections, owner content, and interactions in exact order.
- **Deliberately Deferred 3D:** Focusing first on establishing an exceptional 2D layout, typographic hierarchy, and balanced atmospheric color identity.

---

## 2. Design Principles & Anti-AI Guardrails

### Anti-AI Prohibitions (Explicitly Banned)

| Prohibited Pattern                                    | Reason for Ban                                                     | Required Alternative                                                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Generic purple/blue multi-stop background gradients   | Signals AI-generated SaaS templates and overwhelms content         | Matte graphite/limestone canvas with subtle directional ambient falloff (`<= 6%` opacity)                    |
| Random glowing blobs or floating neon orbs            | Creates visual clutter and breaks spatial realism                  | Crisp architectural reference lines, recessed coordinate hairlines, and grounded orbital geometry            |
| Excessive glassmorphism across cards                  | Blurs contrast, hurts rendering performance, feels derivative      | Matte solid materials for content; translucent frosted slate restricted strictly to nav dock and modal scrim |
| Identical rounded cards repeated in every section     | Template monotony destroys editorial hierarchy                     | Varied compositions: ledger rows, matrix lists, stepped timeline, rule-divided pillars, tiered project cards |
| Repeated bento grids                                  | Overused AI portfolio cliché                                       | Asymmetric 12-column editorial grids tailored to each section's content density                              |
| Neon lighting and glowing borders (`0 0 16px accent`) | Looks artificial and cheapens engineering credibility              | Physical top-edge specular rim (`1px`) paired with grounded contact shadow                                   |
| Oversized display typography without composition      | Creates imbalance on desktop and severe wrapping on `320px` mobile | Disciplined fluid scale (`clamp()`) anchored by tight leading, tracking, and aligned metadata                |
| Arbitrary floating 3D objects or stock illustrations  | Distracts from real projects and adds visual noise                 | Purposeful framing of `profile.png`, restrained 3D plinths, and crisp structural depth planes                |
| Continuous idle floating/pulsing animations           | Wastes battery, triggers motion discomfort, feels restless         | Motion runs strictly on intentional user scroll, hover, focus, or fine-pointer input and settles to rest     |

### Guiding Principles

1. **Every Element Earns Its Plane:** If a shadow, border, or Z-offset does not clarify hierarchy or affordance, remove it.
2. **Flat & Dimensional Coexistence:** Elevated 3D slabs feel impactful only when anchored beside calm, flat editorial typography and hairline-divided lists.
3. **Dark First, Light Intentionally Crafted:** Dark mode (`#141619`) is the primary reference experience; Light mode (`#F4F2ED`) is calibrated independently as warm architectural paper—never a CSS color inversion.
4. **Content Integrity First:** All eight main sections, live demo/source links, CV download, Gmail compose workflow, and unhosted-backend disclosures remain prominent and effortless to scan.

---

## 3. Color System & Semantic Tokens (Midnight Black / Pure White / Lime Green · Atmospheric)

### Visual Identity & Lighting Hierarchy (Electric Elegance + Immersive Digital)

The visual identity is anchored by a bold, architectural palette combined with restrained atmospheric background lighting:

- **Primary (60%): Midnight Black `#0B0B0C`** — Dominant background and primary dark structural surfaces.
- **Secondary (30%): Pure White `#FFFFFF`** — Editorial typography, light background canvas, and crisp alabaster surfaces.
- **Accent (10%): Lime Green `#C6F432`** — Selective accent for CTAs, active states, key interactive elements, and atmospheric radial blooms.

#### Atmospheric Lighting Hierarchy Across Sections:
1. **Hero (`#home`) — Peak 1 (Horizon Bloom):** Asymmetric radial bloom (`ellipse 950px 700px at 75% 30%`, `12%` alpha) anchored behind the portrait/title.
2. **Projects / Work (`#work`) — Controlled Secondary Peak (Spotlight Gallery):** Controlled ambient spotlight (`ellipse 1100px 550px at 50% 20%`, `7%` alpha) highlighting project cards without text washout.
3. **Contact (`#contact`) — Peak 2 (The Beacon):** Concentrated focal beacon (`ellipse 850px 650px at 50% 50%`, `14%` alpha) providing a visual climax and CTA destination.
4. **Calm Obsidian Zones (About, Skills, Services, Experience, Focus):** Kept calm and deep (`#0B0B0C` and `#121214`) with subtle hairline dividers and zero colored ambient glow.

#### Stacking Context Isolation:
- Background pseudo-elements (`.hero::before`, `.work::before`, `.contact::before`) use `position: absolute; inset: 0; pointer-events: none; z-index: 0;`.
- Parent sections use `position: relative; overflow: hidden; isolation: isolate;` to strictly isolate stacking contexts and prevent spillover into adjacent sections.
- Content containers use `position: relative; z-index: 1;`, guaranteeing text readability and unobstructed interactive controls.

#### Subtle 3D Ambient Particle Field (Quiet 3D Depth):
- **Full-Viewport Canvas:** `<canvas id="particle-canvas" class="particle-canvas" aria-hidden="true"></canvas>` fixed at `z-index: var(--z-bg)` (`0`), rendering beneath `.main` (`z-index: 1`).
- **Depth Layers ($Z$-Plane Simulation):** Small particles with $z \in [0.05, 1.0]$ projecting scale $scale = 1 - z \cdot 0.65$. Particle counts are responsive and restrained: 60 on desktop, 40 on tablet, 22 on mobile.
- **Micro-Scale & Dynamic Opacity:** Base particle radius is $0.8\text{px} - 2.1\text{px}$ ($0.45\text{px} - 1.9\text{px}$ projected). Opacity breathes gently between $0.04$ and $0.45$ using individual sinusoidal phase timers (`phase += fadeSpeed`).
- **Natural Drift & Motion Parallax:** Particles drift upward at $-0.06\text{px}$ to $-0.20\text{px}$ per frame with gentle horizontal sway, moving slower at greater simulated depths. Pointer parallax smoothly shifts coordinates by up to $\pm 36\text{px} \cdot (1 - z)$.
- **Quiet Interactive Displacement:** Fine-pointer devices trigger gentle proximity displacement (<$95\text{px}$ radius, max $12\text{px}$ shift) that softly parts particles near the cursor without bounce or arcade physics.
- **Anti-AI & Anti-Gaming Guardrails:** Zero constellation lines, zero glowing neon halos, zero starfield acceleration, and zero clustered particle swarms.
- **Performance & Accessibility:** Automatically pauses `requestAnimationFrame` when tab is hidden (`visibilitychange`). Detects `prefers-reduced-motion: reduce` to render a single static frame with zero ongoing animation loop. DPR scaled up to 2.0. Light Theme reduces canvas opacity to `0.16` via CSS for whisper-quiet integration.

#### 3D Flowing Wireframe Waves (Hero Visual Milestone):
- **Sculptural Fluid Environment:** An immersive, generative WebGL 3D wireframe mesh environment layered inside `#home` via `<canvas id="hero-waves-canvas" class="hero-waves-canvas" aria-hidden="true"></canvas>`, isolated at `z-index: 0` behind Hero content (`z-index: 1`).
- **GPU-Deformed Wave Surfaces:** 100% computed inside custom GLSL vertex and fragment shaders. Composed of 3 overlapping wave ribbons (foreground crest, midground ridge, distant swell) spanning $9,430$ vertices and $18,500$ line segments.
- **Non-Linear Razor Crests:** Procedural multi-harmonic traveling waves deformed along angled vectors with non-linear crest sharpening ($\text{sign}(w) \cdot |w|^{1.42}$), creating defined mountain/wave ridges and smooth valley troughs.
- **Luminous Ridge Color Hierarchy:** Fragment shader maps elevation into selective luminous Lime Green (`#C6F432`) and Apex Electric Lime (`#D9FF4A`) along wave crests, rich emerald tones (`#19542E`) along mid-slopes, and deep obsidian emerald (`#091C11`) in troughs that dissolve naturally into the `#0B0B0C` Midnight Black canvas.
- **Negative Space & Readability Protection:** Sculptural envelope and text-area protection function attenuate wave elevation and alpha toward the left quadrant ($X < -0.2$), guaranteeing that Hero copy, CTAs, and badges retain 100% legibility and high contrast.
- **Multi-Plane Indexing:** Renders longitudinal flow lines at full weight ($1.0$) and transverse cross-ribs at delicate weight ($0.38$) with zero vertex duplication using unified 16-bit indices (`gl.UNSIGNED_SHORT`).
- **Performance & Lifecycle Optimization:** IntersectionObserver pauses the WebGL render loop when the Hero section scrolls out of view, preserving 100% GPU resources across the rest of the site. Page visibility listener halts RAF during background tabs. `prefers-reduced-motion` renders a single static 3D frame. WebGL context loss/absence gracefully degrades to the ambient lime radial bloom.
- **Particle Layer Coexistence:** `.hero` has `background-color: var(--color-bg-primary)` (`#0B0B0C`), cleanly covering the global particle field while viewing Hero, and allowing particles to drift across subsequent sections without competing effects.

### Dark Theme Tokens (Primary — Dark First)

| Semantic Role         | Token Name                      | Hex / Value                 | Usage                                                             | Verified Contrast                               |
| --------------------- | ------------------------------- | --------------------------- | ----------------------------------------------------------------- | ----------------------------------------------- |
| Primary Background    | `--color-bg-primary`            | `#0B0B0C`                   | Dominant Midnight Black page canvas                               | Base                                            |
| Secondary Background  | `--color-bg-secondary`          | `#121214`                   | Alternating recessed section bands & input wells                  | Base                                            |
| Primary Surface       | `--color-surface-primary`       | `#171719`                   | Primary Dark Gray panels, project cards, service plinths          | Base                                            |
| Elevated Surface      | `--color-surface-elevated`      | `#202023`                   | Modals, active hover cards, elevated drawers                      | Base                                            |
| Translucent Surface   | `--color-surface-translucent`   | `rgba(11, 11, 12, 0.90)`    | Floating nav dock & scrolled header only                          | Base                                            |
| Primary Text          | `--color-text-primary`          | `#FFFFFF`                   | Headings, primary body copy, active values (Pure White)           | `19.5:1` on `#0B0B0C` / `14.5:1` over bloom      |
| Secondary Text        | `--color-text-secondary`        | `#CCCCCC`                   | Descriptions, body paragraphs, list details (Light Gray)          | `11.5:1` on `#0B0B0C` / `9.0:1` over bloom       |
| Muted Text            | `--color-text-muted`            | `#949494`                   | Captions, dates, field hints, secondary labels (Mid Gray)         | `6.1:1` on `#0B0B0C` / `4.9:1` on `#171719`      |
| Primary Accent (Text) | `--color-accent-primary`        | `#C6F432`                   | Focal points, badges, text links, active cues (Lime Green)        | `15.35:1` on `#0B0B0C` / `12.4:1` on `#171719`   |
| Brand Accent          | `--color-accent-brand`          | `#C6F432`                   | Exact Lime Green brand accent for rules, borders, fills           | Brand reference                                 |
| Primary CTA Fill      | `--color-cta-bg`                | `#C6F432`                   | Primary button fill (Lime Green) with `#0B0B0C` text              | `14.6:1` (`#0B0B0C` on `#C6F432` — AAA)         |
| Primary CTA Hover     | `--color-cta-bg-hover`          | `#B4DF28`                   | Primary button hover state (Deepened Lime)                        | `12.8:1` (`#0B0B0C` on `#B4DF28` — AAA)         |
| Accent Tint           | `--color-accent-tint`           | `rgba(198, 244, 50, 0.12)`  | Subtle background wash for active status chips                    | Decorative tint                                 |
| Accent Border         | `--color-accent-border`         | `rgba(198, 244, 50, 0.40)`  | Accent border for focus states and interactive borders            | Structural frame                                |
| Subtle Border         | `--color-border-subtle`         | `rgba(255, 255, 255, 0.10)` | Structural panel borders & container outlines                     | `1px` architectural frame                       |
| Strong Border         | `--color-border-strong`         | `rgba(255, 255, 255, 0.22)` | Form inputs, ghost buttons, interactive boundaries                | `3.80:1` on `#0B0B0C`                           |
| Divider               | `--color-divider`               | `rgba(255, 255, 255, 0.08)` | Section rules, ledger row dividers, metadata hairlines            | Structural separation                           |
| Edge Highlight        | `--color-edge-highlight`        | `rgba(255, 255, 255, 0.06)` | Top `1px` bevel highlight on matte dark panels                    | Directional light cue                           |
| Accent Rule           | `--color-lime-rule`             | `linear-gradient(...)`      | Section heading rule (Lime Green to transparent)                  | Directional accent                              |
| Shadow Color          | `--shadow-elevation-*`          | `rgba(0, 0, 0, ...)`        | Deep black neutral ambient occlusion shadows                      | Alpha-layered                                   |
| Focus Ring            | `--color-focus-ring`            | `#C6F432`                   | `2px` solid outline with `2px` `#0B0B0C` inner offset             | Visual focus ring                               |
| Success               | `--color-status-success`        | `#4ADE80`                   | Validated states, positive feedback (`rgba(74,222,128,0.12)` bg)  | `10.87:1` on `#0B0B0C`                          |
| Warning               | `--color-status-warning`        | `#FBBF24`                   | Demo notes / unhosted-backend caution label                       | `11.83:1` on `#0B0B0C`                          |
| Error                 | `--color-status-error`          | `#F87171`                   | Form validation errors (`rgba(248,113,113,0.12)` bg)              | `6.61:1` on `#0B0B0C`                           |

### Light Theme Tokens (Crisp Off-White & Midnight Black)

| Semantic Role         | Token Name                      | Hex / Value                 | Usage                                                             | Verified Contrast                               |
| --------------------- | ------------------------------- | --------------------------- | ----------------------------------------------------------------- | ----------------------------------------------- |
| Primary Background    | `--color-bg-primary`            | `#F5F5F5`                   | Crisp Off-White page canvas                                       | Base                                            |
| Secondary Background  | `--color-bg-secondary`          | `#ECECEC`                   | Recessed off-white bands & input wells                            | Base                                            |
| Primary Surface       | `--color-surface-primary`       | `#FFFFFF`                   | Pure White card surfaces                                          | Base                                            |
| Elevated Surface      | `--color-surface-elevated`      | `#FFFFFF`                   | Pure White elevated surfaces & modals                             | Base                                            |
| Translucent Surface   | `--color-surface-translucent`   | `rgba(245, 245, 245, 0.92)` | Floating nav dock & scrolled header only                          | Base                                            |
| Primary Text          | `--color-text-primary`          | `#0B0B0C`                   | Deep Midnight Black editorial ink                                 | `17.8:1` on `#F5F5F5` / `19.5:1` on `#FFFFFF`   |
| Secondary Text        | `--color-text-secondary`        | `#383838`                   | Body paragraphs, descriptions (Charcoal)                          | `10.5:1` on `#F5F5F5` / `11.5:1` on `#FFFFFF`   |
| Muted Text            | `--color-text-muted`            | `#616161`                   | Captions, dates, field hints, secondary metadata (Neutral Gray)   | `5.7:1` on `#F5F5F5` / `6.2:1` on `#FFFFFF`     |
| Primary Accent (Text) | `--color-accent-primary`        | `#3E5200`                   | Text links, badges (Deep Acidic Olive, AAA compliant)             | `7.8:1` on `#F5F5F5` / `8.5:1` on `#FFFFFF`     |
| Brand Accent          | `--color-accent-brand`          | `#C6F432`                   | Exact Lime Green brand accent                                     | Brand reference                                 |
| Primary CTA Fill      | `--color-cta-bg`                | `#C6F432`                   | Primary button fill (Lime Green) with `#0B0B0C` ink               | `14.6:1` (`#0B0B0C` on `#C6F432` — AAA)         |
| Primary CTA Hover     | `--color-cta-bg-hover`          | `#B4DF28`                   | Primary button hover state (Deepened Lime)                        | `12.8:1` (`#0B0B0C` on `#B4DF28` — AAA)         |
| Primary CTA Border    | `--color-cta-border`            | `#0B0B0C`                   | Crisp `1px solid #0B0B0C` boundary on light canvas (`17.8:1`)     | `17.8:1` on `#F5F5F5` (WCAG 1.4.11 Pass)        |
| Accent Tint           | `--color-accent-tint`           | `rgba(198, 244, 50, 0.15)`  | Restrained active chip wash                                       | Decorative tint                                 |
| Accent Border         | `--color-accent-border`         | `rgba(62, 82, 0, 0.30)`     | Accent border for interactive controls                            | Decorative frame                                |
| Subtle Border         | `--color-border-subtle`         | `rgba(11, 11, 12, 0.10)`    | Structural panel borders                                          | `1px` crisp frame                               |
| Strong Border         | `--color-border-strong`         | `rgba(11, 11, 12, 0.25)`    | Form inputs, ghost buttons, interactive boundaries                | `3.80:1` on `#F5F5F5` / `4.10:1` on `#FFFFFF`   |
| Divider               | `--color-divider`               | `rgba(11, 11, 12, 0.08)`    | Hairline section dividers & ledger separators                     | Structural separation                           |
| Edge Highlight        | `--color-edge-highlight`        | `rgba(255, 255, 255, 0.90)` | Top `1px` crisp bevel highlight on white panels                   | Directional light cue                           |
| Accent Rule           | `--color-lime-rule`             | `linear-gradient(...)`      | Section heading rule (Deep Olive to transparent)                  | Directional accent                              |
| Shadow Color          | `--shadow-elevation-*`          | `rgba(11, 11, 12, ...)`     | Soft black neutral ambient occlusion shadows                      | Alpha-layered                                   |
| Focus Ring            | `--color-focus-ring`            | `#0B0B0C`                   | `2px` solid outline with `2px` `#F5F5F5` offset                  | `17.8:1`                                        |
| Success               | `--color-status-success`        | `#15803D`                   | Validated states (`rgba(21,128,61,0.10)` bg)                      | `5.88:1` on `#F5F5F5` / `6.41:1` on `#FFFFFF`   |
| Warning               | `--color-status-warning`        | `#B45309`                   | Demo notes / caution borders (`rgba(180,83,9,0.10)` bg)           | `4.64:1` on `#F5F5F5` / `5.06:1` on `#FFFFFF`   |
| Error                 | `--color-status-error`          | `#B91C1C`                   | Form validation errors (`rgba(185,28,28,0.10)` bg)                | `5.24:1` on `#F5F5F5` / `5.71:1` on `#FFFFFF`   |

### Theme Rules & Design Restraint Notice

- `<meta name="theme-color">` synchronizes dynamically with `--color-bg-primary` (`#0B0B0C` dark / `#F5F5F5` light).
- Theme detection runs synchronously in `<head>` (guarded against blocked `localStorage`) so Light Mode never flashes Dark Mode on load.
- **Light Theme Restraint:** In Light Theme, atmospheric gradient pseudo-elements evaluate to `none`, keeping backgrounds crisp, pure off-white and alabaster with zero muddy olive tints.
- **Text Readability Guarantee:** High-luminance text (`#FFFFFF`) sitting over peak lime atmospheric bloom regions retains `>14.5:1` contrast ratio, comfortably exceeding WCAG AAA standards.
- **Zero Continuous Animation:** Gradients are completely static CSS, using zero GPU animation loops and no continuous main-thread scripting.
- **Minimalist Aesthetic:** High contrast, crisp hairline borders, and neutral physical shadows are utilized without gratuitous neon glows, decorative 3D elements, or extraneous gradients.

---

## 4. Typography System

Typography carries the architectural character of the site, replacing generic template roundness (`Poppins`) with a two-family editorial pairing:

- **Primary Family (`--font-sans`):** `"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`  
  _Reasoning:_ Combines clean geometric proportions with subtle humanist warmth and open counters, giving display headings authority while remaining crisp at `14px–16px` body sizes.
- **Technical Monospace (`--font-mono`):** `"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace`  
  _Reasoning:_ Neutral, precision-engineered monospace for section indices (`01`–`08`), technology stack chips, dates, GPA/location metadata, and spatial crosshair coordinates. Never used for long prose.

### Type Scale & Hierarchy

| Role                             | Token            | Font Family   | Weight      | Mobile (`320px–767px`) | Desktop (`>= 1024px`)                                             | Line Height | Letter Spacing | Notes                                                                             |
| -------------------------------- | ---------------- | ------------- | ----------- | ---------------------- | ----------------------------------------------------------------- | ----------- | -------------- | --------------------------------------------------------------------------------- |
| **Display Heading (`h1` Hero)**  | `--text-display` | `--font-sans` | `600`       | `2.125rem` (`34px`)    | `3.25rem` (`52px`) via `clamp(2.125rem, 1.5rem + 2.4vw, 3.25rem)` | `1.08`      | `-0.03em`      | Restrained scale; paired with role subhead, never inflated beyond `56px`          |
| **Section Heading (`h2`)**       | `--text-h2`      | `--font-sans` | `600`       | `1.5rem` (`24px`)      | `2rem` (`32px`) via `clamp(1.5rem, 1.25rem + 0.9vw, 2rem)`        | `1.18`      | `-0.02em`      | Left-aligned in editorial sections; paired with monospaced index (`01`)           |
| **Subheading (`h3` Card/Group)** | `--text-h3`      | `--font-sans` | `500`–`600` | `1.125rem` (`18px`)    | `1.25rem` (`20px`)                                                | `1.30`      | `-0.015em`     | Sequential hierarchy (`h1 -> h2 -> h3`, fixing `#skills`/`#contact` nested `h3`s) |
| **Lead / Intro Copy**            | `--text-lead`    | `--font-sans` | `400`       | `1rem` (`16px`)        | `1.125rem` (`18px`)                                               | `1.60`      | `-0.005em`     | Hero summary & Engineering Focus intro (`max-width: 58ch`)                        |
| **Body Text**                    | `--text-body`    | `--font-sans` | `400`       | `0.9375rem` (`15px`)   | `1rem` (`16px`)                                                   | `1.65`      | `0em`          | Optimal `55ch–68ch` line length for About, Project descriptions, Modals           |
| **Small / UI Text**              | `--text-small`   | `--font-sans` | `400`–`500` | `0.8125rem` (`13px`)   | `0.875rem` (`14px`)                                               | `1.50`      | `0em`          | List bullets, form notes, card descriptions, secondary actions                    |
| **Technical Label / Eyebrow**    | `--text-label`   | `--font-mono` | `500`       | `0.6875rem` (`11px`)   | `0.75rem` (`12px`)                                                | `1.35`      | `0.08em`       | Uppercase section eyebrows (`02 / ABOUT`), dates, stack tags                      |
| **Navigation Label**             | `--text-nav`     | `--font-sans` | `500`       | `0.75rem` (`12px`)     | `0.8125rem` (`13px`)                                              | `1.20`      | `0.01em`       | Top bar links, tooltips/dock labels, filter buttons                               |
| **Button Typography**            | `--text-button`  | `--font-sans` | `500`       | `0.875rem` (`14px`)    | `0.875rem` (`14px`)                                               | `1.00`      | `0.01em`       | Crisp single-line action copy (`white-space: nowrap` where space permits)         |

### Typographic Discipline

- **No Oversized Display Noise:** Section headings remain `24px–32px`, letting layout alignment, hairline rules, and Z-depth create visual weight rather than `72px+` banner text.
- **Tabular Numerals:** Apply `font-variant-numeric: tabular-nums` to dates, GPAs (`3.3/4.0`), section indices (`01`–`08`), and copyright year.
- **Font Loading:** Load only required weights (`Plus Jakarta Sans: 400, 500, 600`; `IBM Plex Mono: 400, 500`) with `display=swap` and `preconnect`.

---

## 5. Spacing, Grid & Layout Composition

### Spatial Scale (8px Architectural Rhythm)

| Token        | Value     | Pixel Equivalent | Common Use                                                   |
| ------------ | --------- | ---------------- | ------------------------------------------------------------ |
| `--space-1`  | `0.25rem` | `4px`            | Micro icon-to-label gap, inline hairline offset              |
| `--space-2`  | `0.5rem`  | `8px`            | Tag gaps, compact vertical stack                             |
| `--space-3`  | `0.75rem` | `12px`           | List item spacing, button horizontal padding offset          |
| `--space-4`  | `1rem`    | `16px`           | Mobile grid gutter, form label gap                           |
| `--space-5`  | `1.25rem` | `20px`           | Tablet grid gutter, compact card padding                     |
| `--space-6`  | `1.5rem`  | `24px`           | Desktop grid gutter, card internal padding                   |
| `--space-8`  | `2rem`    | `32px`           | Component group separation, generous card padding            |
| `--space-10` | `2.5rem`  | `40px`           | Sub-section vertical break                                   |
| `--space-12` | `3rem`    | `48px`           | Section header to content gap                                |
| `--space-16` | `4rem`    | `64px`           | Mobile section vertical padding                              |
| `--space-24` | `6rem`    | `96px`           | Tablet section vertical padding                              |
| `--space-28` | `7rem`    | `112px`          | Desktop section vertical padding (`112px` top/bottom rhythm) |

### Container & Grid System

| Viewport Tier                            | Container Max Width | Outer Horizontal Margin              | Grid Columns | Gutter |
| ---------------------------------------- | ------------------- | ------------------------------------ | ------------ | ------ |
| Desktop (`>= 1280px`)                    | `1160px`            | `auto` (min `48px` viewport margin)  | `12` columns | `24px` |
| Laptop / Small Desktop (`1024px–1279px`) | `1024px`            | `32px`                               | `12` columns | `24px` |
| Tablet (`768px–1023px`)                  | `100%`              | `24px`                               | `8` columns  | `20px` |
| Mobile (`320px–767px`)                   | `100%`              | `16px` (`320px`) / `20px` (`390px+`) | `4` columns  | `16px` |

### Intentional Section Composition Differentiation

Every section follows a unified **Left-Anchored Section Header** (`01 / EYEBROW` + `h2` + optional horizontal rule) on desktop/tablet, while varying layout geometry so the page reads as curated chapters rather than repeated card grids:

| Section (`#id`)                               | Desktop Composition (12-Col)                                                                                                                                                                                                      | Spatial Contrast / Intent                                                                                                          |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **1. Home (`#home`)**                         | Asymmetric `7 / 5` split: left-aligned headline, value summary, CTA row + inline social links; right architectural portrait plinth (`profile.png`) with subtle Z-depth offset.                                                    | Immediate spatial focal point; replaces centered symmetrical template hero; keeps scroll indicator inside container bounds.        |
| **2. About (`#about`)**                       | `4 / 8` editorial split: left vertical metadata ledger (3 hairline-divided rows: Education, Focus, Location); right `62ch` prose column + `Contact Me` action.                                                                    | Flat editorial paper plane resting beside the dimensional hero; eliminates 3 generic centered icon boxes.                          |
| **3. Skills (`#skills`)**                     | Structured 2-column architectural taxonomy (`4 / 8` or `2×` grouped panels with hairline rows and monospaced proficiency tags: `In projects`, `Academic`, `Learning`, `In use`).                                                  | Precision engineering matrix rather than padded icon bubbles; fixes heading hierarchy (`h3` categories, bold/label skill names).   |
| **4. Services (`#services`)**                 | 3-column architectural plinths (`repeat(3, 1fr)`) with top `1px` metallic edge, monospaced index (`01–03`), concise title, and modal trigger.                                                                                     | Crisp interactive slabs that lift slightly on hover and open the elevated modal plane.                                             |
| **5. Projects (`#work`)**                     | Centered/left-aligned filter bar + **2-tier showcase**: Full-Stack projects occupy wider `6 / 6` featured horizontal-capable slabs with prominent `Demo Note` well; Frontend projects occupy a cleaner `4 / 4 / 4` secondary row. | Visually communicates system complexity (full-stack backend/DB vs. client-side frontend) while preserving MixItUp/filter behavior. |
| **6. Experience & Education (`#experience`)** | Vertical architectural timeline: continuous `1px` recessed rail on the left with subtle depth nodes (`Freelance`, `Ongoing`, `Education`) and `2-column` internal entry grid (meta left, summary/bullets right).                  | Replaces 4 generic rounded cards with an authentic chronological engineering record.                                               |
| **7. Engineering Focus (`#focus`)**           | Full-width `8-col` editorial statement anchored by 3 flat, rule-divided typographic pillars (`repeat(3, 1fr)` with top `2px` architectural rule and zero card box background).                                                    | Intentional flat breather band before Contact, demonstrating flat/3D coexistence.                                                  |
| **8. Contact (`#contact`)**                   | Asymmetric `5 / 7` split: left 4 hairline-divided direct contact rows (Email, Phone, GitHub, LinkedIn); right recessed-surface form panel with standard top-aligned `<label>` fields and Gmail disclosure.                        | Eliminates 4 centered contact cards and removes floating label cutouts that collide with the 3D backdrop.                          |

---

## 6. Materials & Surface Vocabulary

Instead of applying one card style everywhere, components draw from five distinct physical materials:

| Material Name                         | Visual Character                                            | Dark Mode Recipe                                                                                         | Light Mode Recipe                                                                                | Allowed Components                                                                         |
| ------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| **1. Matte Graphite / Alabaster**     | Non-reflective, quiet architectural base                    | `#141619` / `#1A1D21`, zero specular shine                                                               | `#F4F2ED` / `#EAE7E1`, zero gloss                                                                | Page canvas, About section, Engineering Focus pillars, recessed form wells                 |
| **2. Anodized Charcoal / Limestone**  | Low-sheen structural slab with crisp `1px` top bevel        | `#22262A`, `1px solid #32373D`, top `inset 0 1px 0 rgba(234,231,225,0.08)`                               | `#FAF9F6`, `1px solid #D6D2C9`, top `inset 0 1px 0 rgba(255,255,255,0.85)`                       | Project slabs, Service plinths, Skills matrix containers, Contact form panel               |
| **3. Brushed Metal / Hairline Alloy** | Fine linear sheen for rules, dividers, and technical trims  | `linear-gradient(90deg, rgba(166,155,140,0.08), rgba(234,231,225,0.28), rgba(166,155,140,0.08))` (`1px`) | `linear-gradient(90deg, rgba(22,25,29,0.06), rgba(105,94,80,0.32), rgba(22,25,29,0.06))` (`1px`) | Section header rules, plinth top accents, timeline rail, subtle badge borders              |
| **4. Soft Satin Mineral**             | Smooth, elevated tactile surface for high-priority overlays | `#2A2F35`, `1px solid #454B52`, subtle dual elevation shadow                                             | `#FFFFFF`, `1px solid #CFCAC0`, crisp contact + ambient shadow                                   | Service detail modals, Primary CTA buttons (`#EAE7E1` / `#22262A`), Hero portrait pedestal |
| **5. Frosted Architectural Slate**    | Controlled translucency (`blur(12px)`) used **sparingly**   | `rgba(26, 29, 33, 0.86)` + `1px solid rgba(234,231,225,0.10)`                                            | `rgba(250, 249, 246, 0.88)` + `1px solid rgba(22,25,29,0.10)`                                    | **Restricted strictly** to floating bottom nav dock, scrolled top header, and modal scrim  |

---

## 7. 3D Depth & Spatial System

### Semantic Depth Plane Hierarchy

| Plane Level                   | Semantic Token       | `z-index` | Spatial `translateZ` / Elevation                      | Visual Behavior & Purpose                                                                                             |
| ----------------------------- | -------------------- | --------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **0. Background Plane**       | `--depth-bg`         | `0`       | `translateZ(-80px)`                                   | `.bg-3d` recessed perspective architectural grid and horizon fade; lowest visual contrast (`<= 12%` line opacity).    |
| **1. Ambient Plane**          | `--depth-ambient`    | `0`       | `translateZ(-36px)`                                   | Subtle directional light field, restrained orbital frame arcs, and edge coordinate markers (`+`).                     |
| **2. Content Plane**          | `--depth-content`    | `1`       | `translateZ(0px)`                                     | Main scrollable editorial flow (`<main>`), prose, section headers, flat About ledger, Focus pillars, Footer.          |
| **3. Surface Plane**          | `--depth-surface`    | `2`       | `translateZ(8px)` (rest) / `translateZ(16px)` (hover) | Physical architectural slabs: Hero portrait plinth, Service plinths, Featured Project cards, Timeline entries.        |
| **4. Floating Plane**         | `--depth-floating`   | `100`     | `translateZ(24px)` (visual shadow tier)               | Fixed top header (`.header`) and floating navigation dock (`.nav__menu`), separated cleanly from scrolled content.    |
| **5. Interactive Foreground** | `--depth-foreground` | `1000`    | `translateZ(40px)` (active entrance)                  | Service detail modals (`.services__modal`), skip-to-content link (`z-index: 10000`), active tooltips/status overlays. |

### Spatial Properties & Geometry

- **Perspective Distances:**
  - `--perspective-stage`: `1200px` for the global `.bg-3d` backdrop (longer focal length avoids fisheye distortion and feels architectural).
  - `--perspective-card`: `900px` for local interactive 3D assemblies (Hero portrait plinth and Service/Project hover micro-tilt).
- **Rotation Boundaries (Strict Caps):**
  - Backdrop stage tilt: `max ±2.0deg` on `rotateX` / `rotateY` (fine pointer only).
  - Interactive plinth/card hover tilt (optional desktop fine-pointer micro-response): `max ±1.5deg` — never flipping, spinning, or distorting text legibility.
  - Text-heavy reading surfaces (About prose, Skills matrix, Contact form, Modal content): **`0deg` rotation at all times**.
- **Surface Thickness & Bevel Convention:**
  - Dimensional slabs simulate `1px–2px` physical material thickness via a `1px` solid perimeter border (`--color-border-subtle`), a `1px` inner top highlight (`--color-edge-highlight`), and a `2px` bottom/contact occlusion edge.
  - Border radii remain architectural and disciplined: `2px` (technical chips), `6px` (buttons/inputs), `10px` (standard panels), `14px` (modals/feature plinths), `9999px` (dock container / pill controls only). **No arbitrary `24px–32px` bubbly blobs.**
- **Text Crispness Rule:** Never apply non-zero `rotateX`/`rotateY` or fractional `translateZ` directly to nodes containing multi-line body copy. When a slab tilts slightly (`<= 1.5deg`), keep text legible or isolate micro-tilt to the decorative plinth frame (such as the hero portrait housing) rather than paragraphs.

### Depth Token Table

| Token                 | Recommended Value | Applied To                                            |
| --------------------- | ----------------- | ----------------------------------------------------- |
| `--perspective-stage` | `1200px`          | `.bg-3d` root stage                                   |
| `--perspective-local` | `900px`           | Hero portrait housing, interactive 3D frames          |
| `--depth-z-bg`        | `-80px`           | Perspective floor grid layer                          |
| `--depth-z-ambient`   | `-36px`           | Orbital arc & atmospheric fill layer                  |
| `--depth-z-accents`   | `-12px`           | Spatial coordinate crosshairs (kept behind content!)  |
| `--depth-z-surface`   | `8px`             | Raised slabs (within local `transform-style` context) |
| `--depth-z-hover`     | `16px`            | Subtle hover lift on fine-pointer desktop             |
| `--depth-lift-y`      | `-3px`            | Vertical hover lift on interactive slabs              |
| `--tilt-stage-max`    | `2deg`            | Maximum `.bg-3d__stage` pointer rotation              |
| `--tilt-surface-max`  | `1.5deg`          | Maximum local plinth micro-tilt                       |
| `--parallax-max`      | `8px`             | Maximum `.bg-3d` pointer translation                  |

---

## 8. Lighting & Shadow Model

### Coherent Architectural Light Rig

All shadows and edge highlights originate from a **single consistent upper-left key light (`135deg`, elevated ~`35deg` above the surface plane)** paired with soft ambient skylight.

- **Key Light:** Illuminates the top (`1px` inset edge) and subtly softens the left edge of raised slabs.
- **Contact Shadow:** Tight, high-opacity dark band directly beneath the bottom edge (`0 2px 4px`), anchoring the element physically to the background plane so it looks seated rather than floating aimlessly.
- **Elevation Shadow:** Wider, soft, low-opacity diffuse shadow (`0 12px 28px -6px`) separating elevated planes from content planes.
- **No Neon / No Colored Bloom:** Shadows use neutral graphite/charcoal RGB (`6, 8, 10` in Dark Mode; `22, 25, 29` in Light Mode)—never purple or blue glow shadows.

### Shadow Scale (Dark vs. Light Calibration)

Because dark shadows are subtle on `#141619`, Dark Mode relies on **border luminance + top specular rim + deep contact occlusion**. Light Mode relies on **layered neutral-umbra shadows** paired with crisp white top bevels.

| Elevation Tier                  | Token                  | Dark Mode Value                                                                                                    | Light Mode Value                                                                                                      | Use Case                                              |
| ------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Recessed**                    | `--shadow-recessed`    | `inset 0 2px 6px rgba(6, 8, 10, 0.45)`                                                                             | `inset 0 1px 3px rgba(22, 25, 29, 0.08)`                                                                              | Input wells, Demo Note callouts, timeline rail groove |
| **Surface (Level 1)**           | `--shadow-elevation-1` | `inset 0 1px 0 rgba(234, 231, 225, 0.08), 0 2px 6px rgba(6, 8, 10, 0.45), 0 10px 24px -8px rgba(6, 8, 10, 0.55)`   | `inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 1px 3px rgba(22, 25, 29, 0.08), 0 8px 20px -6px rgba(22, 25, 29, 0.08)`   | Primary cards, Service plinths, Skills panels         |
| **Interactive Hover (Level 2)** | `--shadow-elevation-2` | `inset 0 1px 0 rgba(234, 231, 225, 0.14), 0 6px 12px rgba(6, 8, 10, 0.55), 0 18px 36px -10px rgba(6, 8, 10, 0.68)` | `inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 4px 10px rgba(22, 25, 29, 0.10), 0 16px 32px -8px rgba(22, 25, 29, 0.12)` | Hovered Project/Service slabs, Hero portrait pedestal |
| **Floating Chrome (Level 3)**   | `--shadow-elevation-3` | `inset 0 1px 0 rgba(234, 231, 225, 0.10), 0 12px 32px rgba(6, 8, 10, 0.65)`                                        | `inset 0 1px 0 rgba(255, 255, 255, 0.90), 0 10px 28px rgba(22, 25, 29, 0.12)`                                         | Floating nav dock, scrolled header                    |
| **Modal Overlay (Level 4)**     | `--shadow-elevation-4` | `inset 0 1px 0 rgba(234, 231, 225, 0.12), 0 24px 64px rgba(0, 0, 0, 0.78)`                                         | `inset 0 1px 0 rgba(255, 255, 255, 1), 0 24px 56px rgba(22, 25, 29, 0.20)`                                            | Service detail modal dialogs                          |

---

## 9. Component Design Language

### 1. Navigation (Top Header & Floating Dock)

- **Geometry:** Top bar (`56px` mobile / `64px` desktop) holds brand wordmark (`Abdulkarim`) left and theme toggle button (`40×40px` hit target) right. Floating bottom dock (`max-width: 440px`, `border-radius: 9999px`) sits `16px` from bottom viewport edge.
- **Material:** Transparent at scroll `0` (top header), transitioning to **Frosted Architectural Slate** on scroll (`> 32px`). Bottom dock always uses Frosted Architectural Slate.
- **Border & Depth:** `1px solid` translucent border + `--shadow-elevation-3`.
- **Hover / Active / Focus:** Active dock link uses crisp pill fill (`--color-surface-elevated` with `1px` stone/lavender top indicator, removing neon glow box-shadow) plus clear visible tooltip/label on hover & keyboard focus.
- **Dark / Light:** Charcoal frosted dock (`rgba(26,29,33,0.86)`) vs. crisp limestone frosted dock (`rgba(250,249,246,0.88)`).

### 2. Buttons

- **Primary CTA:** Geometry `6px` radius, `12px 20px` padding, min height `44px`. Solid Warm Ivory (`#EAE7E1` / `#141619` ink) in Dark Mode; Solid Charcoal (`#22262A` / `#FAF9F6` ink) in Light Mode. Top `1px` subtle bevel, lifts `-1px` with subtle shadow increase on hover.
- **Secondary / Ghost Button (`Download CV`, `Contact Me`):** Transparent background, `1px solid --color-border-strong`, primary text color. Fills subtly (`rgba(..., 0.08)`) on hover.
- **Inline Text Action (`See More`, `Live Demo`, `Source Code`):** No pill box; clean text + `16px` arrow icon translating `3px` right on hover, underlined or stone-accented (`--color-accent-primary`).
- **Focus:** `2px solid --color-focus-ring` with `2px` offset across all variants.

### 3. Links

- **Inline & Social Links:** Crisp color transition (`160ms`), underline-offset `4px` on inline text links for unambiguous affordance without relying solely on color. Social icon buttons (`40×40px` / `44×44px` touch target) use Charcoal/Limestone square-chamfered (`6px` radius) frames with `1px` border.

### 4. Cards (Service Plinths & Project Slabs)

- **Project Slabs:** `10px` radius, Anodized Charcoal / Limestone material, `24px` (`20px` mobile) padding, `--shadow-elevation-1`. Full-stack slabs span wider grid tracks and contain a recessed **Demo Note** well (`--shadow-recessed`, `1px` left warning-stone accent bar) so unhosted-backend disclosures read clearly without clutter.
- **Service Plinths:** `10px` radius, `28px 24px` padding, `1px` Brushed Metal top rule accent, monospaced index (`01`, `02`, `03`), lifts `-3px` (`--shadow-elevation-2`) on hover.
- **Anti-Uniformity Rule:** About highlights, Engineering Focus principles, and Contact channels are **not** rendered as rounded cards (see Information Panels below).

### 5. Information Panels (About Ledger & Focus Pillars)

- **About Metadata Ledger:** Flat background (`transparent` on canvas), vertical stack of 3 rows separated by `1px` `--color-divider` hairlines. Left monospaced label (`EDUCATION`), right primary value (`Badr University`). Zero rounded card border.
- **Engineering Focus Pillars:** 3 flat columns topped by a `2px` horizontal Brushed Metal rule and crisp `20px` icon + `h3` title + body text. Zero card background or drop shadow, letting nearby elevated sections carry the 3D contrast.

### 6. Input Fields & Forms

- **Recessed Well Architecture:** Inputs sit inside a unified Anodized Charcoal / Limestone form container (`10px` radius), while individual `<input>` and `<textarea>` controls use **Recessed** backgrounds (`--color-bg-secondary`), `6px` radius, `1px solid --color-border-strong`, and `--shadow-recessed`.
- **Labels:** Standard **external top-aligned `<label>`** (`8px` above input, `13px` medium weight) — permanently replacing the floating-tag cutout hack so the `.bg-3d` background never bleeds behind labels.
- **Focus & Validation:** Focus transitions border to `--color-text-primary` with `2px` crisp focus ring; invalid/error states pair `--color-status-error` border with accessible error messaging.

### 7. Modals (Service Detail Dialogs)

- **Backdrop Scrim:** Frosted dark scrim (`rgba(10, 12, 15, 0.76)` dark / `rgba(22, 25, 29, 0.48)` light) with `blur(6px)`.
- **Dialog Surface:** Soft Satin Mineral (`#2A2F35` dark / `#FFFFFF` light), `14px` radius, `max-width: 540px`, `max-height: calc(100dvh - 32px)` with `overflow-y: auto` so `568×320` short viewports scroll cleanly inside the modal.
- **Close Control:** Explicit `44×44px` circular/chamfered button (`top: 16px`, `right: 16px`) styled explicitly with surface token + `1px` border (removing browser default `#f0f0f0` button styling).

### 8. Tags & Badges

- **Architecture:** Rectangular-chamfered (`4px` radius), `4px 8px` padding, `--font-mono`, `11px` (`0.6875rem`), `1px solid --color-border-subtle` on `--color-bg-secondary` (matte micro-plates). Active/special status chips may use `--color-accent-secondary-tint` + `--color-accent-secondary` text, never saturated pill rainbows.

### 9. Timeline Elements (Experience & Education)

- **Structure:** Left `1px` continuous vertical hairline rail (`--color-divider`) with `9px` square-rotated or circular architectural nodes seated on the rail (`--color-accent-secondary` for `Ongoing`, `--color-accent-primary` for `Freelance`/`Education`).
- **Entry Panels:** Seated cleanly to the right of the rail with left-edge alignment, monospaced category/date metadata, role title, concise prose, and crisp bullet list.

### 10. Interactive Surfaces (Filter Bar & Theme Toggle)

- **Project Filter Bar:** Segmented architectural rail (`All`, `Full-Stack`, `Frontend`) inside a recessed pill/frame (`6px` radius) with sliding/crisp active segment (`--color-surface-elevated` + `1px` border + primary text) and accessible `aria-pressed` + screen-reader result count announcement.
- **Theme Toggle:** `40×40px` (`44×44px` touch target) chamfered button in top header with crisp sun/moon icon swap and `aria-label` / `aria-pressed` clarity.

### 11. Footer Elements

- **Grounded Architectural Base:** Replace the current full-bleed lavender footer (`background-color: var(--first-color)`) with a grounded `--color-bg-secondary` (`#1A1D21` dark / `#EAE7E1` light) surface separated from `<main>` by a `1px` Brushed Metal top divider.
- **Layout & Clearance:** Clean horizontal/wrapped navigation list (never overflowing on `320px`), compact social links, dynamic copyright year, and `96px` (`6rem`) bottom padding ensuring total clearance above the floating bottom navigation dock.

---

## 10. Motion & Interaction System

Motion obeys physical inertia: elements settle crisply with zero bounce, zero overshoot, and zero perpetual spinning.

### Duration & Easing Tokens

| Category        | Token                       | Value                            | Purpose                                                        |
| --------------- | --------------------------- | -------------------------------- | -------------------------------------------------------------- |
| Instant         | `--motion-duration-instant` | `100ms`                          | Press feedback, border/color micro-state                       |
| Fast            | `--motion-duration-fast`    | `160ms`                          | Link underlines, focus rings, button hover, icon nudges        |
| Base            | `--motion-duration-base`    | `240ms`                          | Card elevation lift, filter state transitions, theme icon swap |
| Slow            | `--motion-duration-slow`    | `420ms`                          | Modal open/close, subtle scroll-triggered section entrance     |
| Spatial         | `--motion-duration-spatial` | `600ms`                          | Initial stage settle only                                      |
| Primary Easing  | `--motion-ease-out`         | `cubic-bezier(0.22, 1, 0.36, 1)` | Architectural deceleration (crisp start, quiet settle)         |
| Standard Easing | `--motion-ease-in-out`      | `cubic-bezier(0.4, 0, 0.2, 1)`   | Theme transitions, modal opacity/scale                         |
| Exit Easing     | `--motion-ease-exit`        | `cubic-bezier(0.4, 0, 1, 1)`     | Closing drawers/modals cleanly                                 |

### Movement, Rotation & Trigger Rules

| Interaction                     | Behavior Specification                                                                                                                                                                                                                                      | Limits                                                    | Reduced Motion (`prefers-reduced-motion: reduce`)            |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| **Hover Response**              | Interactive slabs translate `translateY(-3px)`, top bevel brightens (`0.08` -> `0.14`), shadow shifts to Elevation 2. Action arrows shift `translateX(3px)`.                                                                                                | Max `3px` lift; zero scale distortion (`scale` stays `1`) | Color/border highlight only (`0ms–100ms`), `0px` translation |
| **Focus Response**              | Instant `2px` high-contrast outline appears with `0ms` delay; no layout jump.                                                                                                                                                                               | `2px` solid + `2px` offset                                | Identical (always preserved)                                 |
| **Pointer Parallax (`.bg-3d`)** | Gated strictly to `@media (pointer: fine)` and desktop/tablet (`>= 992px`). `requestAnimationFrame` lerps smoothly (`0.08` factor) and **cancels loop immediately** when delta `< 0.01`. Resets on `pointerleave` and `blur`.                               | Max `±2.0deg` tilt, `±8px` translation                    | Disabled completely; transforms removed                      |
| **Scroll Transitions**          | IntersectionObserver-based **once-only** reveal (replacing `ScrollReveal` `reset: true` `2500ms` overlap). Elements start visible or reveal smoothly once (`14px` vertical travel, `420ms`, `0ms`–`60ms` stagger cap). **Never hide `.nav__menu` on load.** | Max `14px` Y travel; `reset: false`                       | Immediate opacity `1`, `0px` travel                          |
| **Modal Transitions**           | Scrim fades `240ms`; dialog settles from `translateY(12px) scale(0.985)` to `0` / `1`. Focus moves to modal close/title **after** visibility is active (fixing focus-during-hidden bug).                                                                    | Max `12px` travel                                         | Instant visibility swap, `0px` travel                        |
| **Navigation Feedback**         | Throttled scroll-spy (`requestAnimationFrame` / IntersectionObserver) updates `.active-link` and `aria-current="location"` smoothly across all sections including `#focus`.                                                                                 | Zero layout thrash                                        | Identical instant indicator swap                             |

---

## 11. Responsive Design Specification

Mobile is designed as an intentional, tactile reading flow—not a shrunk desktop page.

| Breakpoint                    | Container & Layout Behavior                                                                                                                                                                                                                                                                                                                                                 | Typography & Targets                                                                                                                                      | 3D & Interaction Simplification                                                                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`1440px` (Large Desktop)**  | `1160px` centered 12-col grid; generous horizontal breathing room (`>= 140px` side margins); full asymmetric `7/5` Hero, `4/8` About, `6/6` Full-Stack + `4/4/4` Frontend Projects.                                                                                                                                                                                         | Full desktop `clamp()` max sizes (`52px` display, `32px` h2, `16px` body).                                                                                | Full `.bg-3d` stage + fine-pointer parallax (`±2deg`, `±8px`) + optional `±1.5deg` Hero plinth micro-tilt.                                                                     |
| **`1280px` (Laptop)**         | `1160px` container with `48px` viewport gutters; identical 12-col editorial structure; Hero portrait scales proportionally (`280px–310px`).                                                                                                                                                                                                                                 | Same fluid desktop scale; vertical section padding `96px–112px`.                                                                                          | Full `.bg-3d` stage + fine-pointer parallax active.                                                                                                                            |
| **`768px` (Tablet)**          | `8-col` grid, `24px` gutters. Hero shifts to balanced `1-col` or compact `7/5`; About ledger renders as 3-col horizontal strip above `60ch` prose; Projects & Experience use `2-col` grids; Contact stacks `1-col` or `4/4` split; Services uses `3-col` or `2+1` balanced grid.                                                                                            | Display scales smoothly (`~40px–44px`), `h2` `~28px`. Touch targets `>= 44×44px`.                                                                         | Pointer parallax disabled on touch (`pointer: coarse`); static subtle 3D stage depth retained (`translateZ` layers without mouse tracking); orbital rings scaled down cleanly. |
| **`390px` (Standard Mobile)** | `4-col` (`1-col` stacked blocks), `20px` side margins. Hero stacks cleanly: Portrait pedestal (`200px` wide) or compact top intro + full-width stacked/wrap CTAs; `.home__scroll` hidden or tucked cleanly inside flow (never negative `right` overflow); Footer nav wraps cleanly (`flex-wrap: wrap`).                                                                     | Display `34px–36px`, `h2` `24px`, body `15px`. All buttons, filter tabs, dock icons, and close controls `>= 44×44px`.                                     | `.bg-3d` simplified: outer orbital scaled, fine grid density reduced, zero pointer listeners, zero hover-dependent reveals.                                                    |
| **`320px` (Small Mobile)**    | `16px` side margins; strict `minmax(0, 1fr)` on all CSS grids so no word/URL/email forces horizontal scroll (`overflow-x: clip` safeguard without breaking sticky/fixed). Footer nav wraps into `3×2` grid; Project cards full width (`100%`, removing `320px` fixed cap overflow risk); Modals fill `calc(100vw - 24px)` and scroll internally (`568×320` landscape safe). | Display `32px–34px`, `h2` `22px–24px`, body `15px`. Dock padding tightened (`10px 12px`) so all 6 icons maintain `>= 40×40px` tap zones without clipping. | Secondary orbital ring hidden (`display: none`) to avoid visual crowding; `translate3d` ambient layers flattened for smooth 60fps mobile scrolling.                            |

---

## 12. Accessibility & Usability Requirements

All visual and 3D refinements must satisfy **WCAG 2.1 Level AA** in both Dark and Light themes:

1. **Color Contrast:** All text passes `>= 4.5:1` (`>= 3.0:1` for large text `>= 24px` or `18.66px` bold); all interactive borders, inputs, focus rings, and icon controls pass `>= 3.0:1` (verified in Section 3).
2. **Semantic Landmarks & Sequential Headings:**
   - Single `<main id="main">`, `<header>`, `<nav aria-label="Main navigation">`, `<nav aria-label="Footer navigation">`, `<footer>`, and `<section>` landmarks (adding `id="focus"` to Engineering Focus).
   - Strict `h1 -> h2 -> h3` order without skipped or nested `<h3>` inside `<h3>` (e.g., Skills groups and Contact subsections use `<h3 class="...">` for group titles and `<h4>` or styled `<p>`/`<dt>` for item titles).
3. **Keyboard Navigation & Visible Focus:**
   - Every interactive element reachable via `Tab` / `Shift+Tab` in logical DOM order.
   - Skip-to-content link (`#main`) styled with high-contrast CTA tokens (`#EAE7E1`/`#141619` dark; `#22262A`/`#FAF9F6` light) — fixing the current `2.61:1` contrast failure.
   - Persistent `:focus-visible` `2px` dual-ring indicator (`outline: 2px solid var(--color-focus-ring); outline-offset: 2px`).
4. **Modal Accessibility:**
   - Opening a service dialog sets `aria-expanded="true"`, moves focus into the dialog _after_ it becomes visible (not skipped by `visibility: hidden`), traps `Tab` / `Shift+Tab` inside the modal, isolates background landmarks via `inert` (with `aria-hidden` fallback), supports `Escape` and backdrop click dismissal, and restores focus to the exact trigger button on close.
5. **Forms & Contact Usability:**
   - Explicit `<label for="...">` positioned cleanly above each input (never overlapping borders).
   - Clear `aria-describedby` note explaining Gmail compose behavior, plus an accessible **Copy Email** fallback for visitors without Gmail configured.
6. **Screen Reader Status Feedback:**
   - Project filter buttons maintain `aria-pressed` state and update a visually-hidden `aria-live="polite"` region announcing visible project count (e.g., `"Showing 2 Full-Stack projects"`).
   - Icon-only dock links retain descriptive `aria-label` attributes plus visible hover/focus tooltips (`role="tooltip"` or CSS-revealed label).
7. **Reduced Motion & Runtime Preference Listener:**
   - Honors `@media (prefers-reduced-motion: reduce)` in CSS and listens to `matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', ...)` in JS to tear down/restore parallax dynamically without page reload.

---

## 13. CSS Custom Property Mapping

Future CSS implementation in `assets/css/styles.css` must organize tokens under `:root` (Dark Theme default) and `body.light-theme` (or `[data-theme="light"]`) using these exact semantic custom properties:

| Category               | CSS Custom Property                                                                                                                                                                                                          | Maps From Design Spec                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Backgrounds**        | `--color-bg-primary`, `--color-bg-secondary`                                                                                                                                                                                 | Primary & secondary page/well backgrounds                                         |
| **Surfaces**           | `--color-surface-primary`, `--color-surface-elevated`, `--color-surface-translucent`                                                                                                                                         | Slab, modal, and frosted chrome surfaces                                          |
| **Typography Colors**  | `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`                                                                                                                                                       | Ivory/Graphite ink hierarchy                                                      |
| **Accents & CTAs**     | `--color-accent-primary`, `--color-accent-secondary`, `--color-accent-secondary-tint`, `--color-cta-bg`, `--color-cta-bg-hover`, `--color-cta-text`                                                                          | Stone links, restrained Lavender cues, Ivory/Charcoal primary buttons             |
| **Borders & Dividers** | `--color-border-subtle`, `--color-border-strong`, `--color-divider`, `--color-edge-highlight`                                                                                                                                | Architectural frames, `>= 3:1` input boundaries, hairline rules, `1px` top bevels |
| **Status & Focus**     | `--color-focus-ring`, `--color-status-success`, `--color-status-warning`, `--color-status-error`                                                                                                                             | Dual-ring focus & semantic feedback states                                        |
| **Font Families**      | `--font-sans`, `--font-mono`                                                                                                                                                                                                 | `Plus Jakarta Sans` & `IBM Plex Mono` stacks                                      |
| **Type Scale**         | `--text-display`, `--text-h2`, `--text-h3`, `--text-lead`, `--text-body`, `--text-small`, `--text-label`, `--text-nav`, `--text-button`                                                                                      | Fluid `clamp()` sizes & fixed UI sizes                                            |
| **Spacing**            | `--space-1` .. `--space-28`, `--container-max`, `--header-height`                                                                                                                                                            | `4px`/`8px` rhythm & container bounds                                             |
| **Radii**              | `--radius-xs` (`2px`), `--radius-sm` (`4px`), `--radius-md` (`6px`), `--radius-lg` (`10px`), `--radius-xl` (`14px`), `--radius-pill` (`9999px`)                                                                              | Disciplined architectural corners                                                 |
| **3D Depth**           | `--perspective-stage`, `--perspective-local`, `--depth-z-bg`, `--depth-z-ambient`, `--depth-z-accents`, `--depth-z-surface`, `--depth-z-hover`, `--depth-lift-y`, `--tilt-stage-max`, `--tilt-surface-max`, `--parallax-max` | Stage perspective, Z planes, strict rotation/parallax caps                        |
| **Lighting & Shadows** | `--shadow-recessed`, `--shadow-elevation-1`, `--shadow-elevation-2`, `--shadow-elevation-3`, `--shadow-elevation-4`                                                                                                          | Contact + diffuse directional shadows                                             |
| **Motion**             | `--motion-duration-instant`, `--motion-duration-fast`, `--motion-duration-base`, `--motion-duration-slow`, `--motion-duration-spatial`, `--motion-ease-out`, `--motion-ease-in-out`, `--motion-ease-exit`                    | Physics-grounded timing & curves                                                  |
| **Layering**           | `--z-bg` (`0`), `--z-content` (`1`), `--z-surface` (`2`), `--z-tooltip` (`20`), `--z-fixed` (`100`), `--z-modal` (`1000`), `--z-skip` (`10000`)                                                                              | Deterministic stacking context                                                    |

---

## 14. Design Acceptance Criteria

Before any future UI implementation is considered compliant with this design system, it must pass all of the following checks:

1. **Identity & Content Integrity:** All 8 sections render in order (`#home`, `#about`, `#skills`, `#services`, `#work`, `#experience`, `#focus`, `#contact`), preserving owner details, 5 project records, CV download, and unhosted-backend disclosures.
2. **Quiet 3D & Anti-AI Compliance:** Zero neon/glow shadows, zero full-section purple gradients, zero repeated identical card grids across all sections, restrained lavender usage (`<= 5%` surface area), and cohesive `135deg` directional bevel + contact shadow lighting.
3. **Dual-Theme WCAG 2.1 AA Verification:** Measured contrast passes `>= 4.5:1` for all text/labels and `>= 3.0:1` for interactive borders/focus rings in **both Dark Mode and Light Mode**, with zero theme-flash on reload.
4. **Responsive Integrity:** Verified at `320px`, `390px`, `768px`, `1280px`, `1440px`, and `568×320` with **zero horizontal overflow**, `>= 44×44px` mobile touch targets, internal modal scrolling on short viewports, and clean dock-to-footer clearance.
5. **Accessibility & Motion Compliance:** Sequential `h1 -> h2 -> h3` headings, instant focus entry + focus restoration + `inert` background isolation on modals, `aria-live` project filter announcements, and full disabling of spatial motion under `prefers-reduced-motion: reduce` and touch-only devices.
6. **Runtime & Static Hygiene:** Zero external frameworks/build tools added, zero console errors, zero `404` requests (including favicons), and full static compatibility with GitHub Pages (`/my-portfolio/`).
