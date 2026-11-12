# Portfolio Section Blueprints — QUIET 3D: Engineered with Intent

**Project:** Abdulkarim Aklouk — Public Personal Portfolio (`index.html`)  
**Phase:** Phase 02 — Section-by-Section UI/UX Blueprints  
**Primary Reference:** [`design-system.md`](./design-system.md)  
**Rules & Methodology:** [`.agents/rules/project-core.md`](../../.agents/rules/project-core.md), [`.agents/skills/ui-implementation/SKILL.md`](../../.agents/skills/ui-implementation/SKILL.md)  
**Status:** Design Blueprint Specification (No code implemented)

---

## Table of Contents

1. [Overall Visitor Experience & First 5–10 Seconds](#1-overall-visitor-experience--first-510-seconds)
2. [3D Distribution Strategy](#2-3d-distribution-strategy)
3. [Section Blueprints (with Wireframes & 14-Point Specs)](#3-section-blueprints)
   - [A. Global Navigation & Layout](#a-global-navigation--layout)
   - [B. Hero Section (`#home`)](#b-hero-section-home)
   - [C. About Section (`#about`)](#c-about-section-about)
   - [D. Skills Section (`#skills`)](#d-skills-section-skills)
   - [E. Services Section (`#services`)](#e-services-section-services)
   - [F. Experience & Education Section (`#experience`)](#f-experience--education-section-experience)
   - [G. Engineering Focus Section (`#focus`)](#g-engineering-focus-section-focus)
   - [H. Contact Section (`#contact`)](#h-contact-section-contact)
   - [I. Footer](#i-footer)
4. [Projects Showcase (`#work`) — Deferred Scope Integration Notes](#4-projects-showcase-work--deferred-scope-integration-notes)
5. [Cross-Section Consistency Rules](#5-cross-section-consistency-rules)
6. [Cross-Section Acceptance Matrix](#6-cross-section-acceptance-matrix)
7. [Open & Section-Specific Design Decisions](#7-open--section-specific-design-decisions)

---

## 1. Overall Visitor Experience & First 5–10 Seconds

The portfolio operates as one continuous, calm architectural environment rather than disconnected landing-page blocks. A single global perspective stage (`.bg-3d`) provides recessed spatial coordinates behind `<main>`, while section surfaces alternate intentionally between flat editorial planes and raised physical slabs.

### First 5–10 Seconds (Arrival & Immediate Comprehension)

1. **0–2 Seconds (Orientation):** The visitor lands on a clean dark-graphite canvas (`--color-bg-primary`) framed by a minimal top bar (`Abdulkarim` wordmark + theme toggle). Above the fold, an asymmetric `7 / 5` split presents **Abdulkarim Aklouk** (`Full-Stack Developer`), a concise engineering summary naming core technologies (`JavaScript, Node.js, Express.js, MongoDB, MySQL`), and a crisp 3D-framed portrait plinth on the right.
2. **2–5 Seconds (Action & Credibility):** Eye movement flows naturally down the left editorial column to three clear actions—`View Projects` (primary Warm Ivory CTA), `Contact Me` (secondary), and `Download CV` (ghost button)—anchored by inline GitHub and LinkedIn buttons.
3. **5–10 Seconds (Depth & Next-Section Discovery):** Subtle `135deg` top-edge highlights on the portrait plinth and quiet parallax in the recessed floor grid (`--depth-bg`) register depth without distracting from the copy. At the bottom edge, the frosted floating navigation dock and a grounded `Scroll Down` cue within container bounds invite progression into `02 / About`.

### Scroll Progression & Banding Rhythm

| Section | Index | Plane Character | Background Band | Visual Role in Journey |
|---|---|---|---|---|
| **Hero (`#home`)** | `01` | Primary 3D focal plinth + typographic lead | `--color-bg-primary` | Establishes identity, stack focus, and Quiet 3D signature. |
| **About (`#about`)** | `02` | Flat editorial ledger + prose | `--color-bg-secondary` | Drops Z-elevation so recruiters read background and honesty on React cleanly. |
| **Skills (`#skills`)** | `03` | Structured hairline matrix on raised slabs | `--color-bg-primary` | Organizes technical capabilities without repetitive icon bubbles. |
| **Services (`#services`)** | `04` | Interactive architectural plinths + modal layer | `--color-bg-secondary` | Introduces hover Z-lift and deep-dive modal elevation (`--depth-foreground`). |
| **Projects (`#work`)** | `05` | *(Deferred)* Tiered feature & compact slabs | `--color-bg-primary` | Primary proof-of-work showcase (integration contract in Section 4). |
| **Experience (`#experience`)** | `06` | Chronological vertical rail + entry panels | `--color-bg-secondary` | Grounds freelance and academic timeline on a physical vertical spine. |
| **Engineering Focus (`#focus`)** | `07` | Flat statement + rule-divided pillars | `--color-bg-primary` | Quiet typographic breather demonstrating discipline before Contact. |
| **Contact (`#contact`)** | `08` | Hairline channel list + recessed form well | `--color-bg-secondary` | Direct pathways + tactile recessed input well preserving Gmail compose. |
| **Footer** | — | Grounded architectural base | `--color-bg-secondary` (separated by `1px` Brushed Metal rule) | Intentional full-stop conclusion clearing the floating dock. |

---

## 2. 3D Distribution Strategy

Depth intensity is intentionally rationed across the page under a single `135deg` upper-left key light and `1200px` global perspective:

| 3D Tier | Assigned Sections / Elements | Spatial Treatment | Rationale |
|---|---|---|---|
| **Primary 3D Focal** | **Hero (`#home`)** portrait plinth + **Global `.bg-3d` stage** | Multi-plane Z separation (`-80px` grid, `-36px` orbital arcs, `+8px` portrait plinth with optional `±1.5deg` desktop frame tilt). | Creates an immediate, memorable architectural impression above the fold. |
| **Supporting 3D** | **Services (`#services`)** plinths & modals; **Deferred Projects (`#work`)**; **Experience (`#experience`)** timeline panels | `--depth-surface` Anodized Charcoal/Limestone slabs with `1px` specular bevel and contact shadow; modals rise to `--depth-foreground`. | Signals interactivity and separates distinct work/service items without floating-card chaos. |
| **Interaction-Feedback Only** | **Global Nav Dock**, **Skills (`#skills`)** category containers, **Contact (`#contact`)** form well | Static seated planes (`--shadow-elevation-1` or `--shadow-recessed`) using subtle border brightening or `-1px` button feedback on hover/focus. | Keeps dense technical metadata and text inputs rock-steady while remaining tactile. |
| **Mostly Flat & Editorial** | **About (`#about`)**, **Engineering Focus (`#focus`)**, **Contact channel list**, **Footer** | `translateZ(0px)`, transparent background on alternating canvas, `1px` `--color-divider` and Brushed Metal top rules. | Ensures 3D slabs feel intentional by contrasting them against calm editorial whitespace. |

---

## 3. Section Blueprints

### A. Global Navigation & Layout

#### Wireframes

```text
DESKTOP (>= 1024px)
+-------------------------------------------------------------------------+
| [Abdulkarim]                                            [Theme Toggle]  |  <- Fixed Top Bar (64px, Frosted on scroll)
+-------------------------------------------------------------------------+
|  .bg-3d recessed grid & orbital arcs (z: 0, translateZ: -80px..-12px)   |
|                                                                         |
|                     <main id="main"> (max 1160px)                       |
|                                                                         |
|              +-------------------------------------------+              |
|              | [Home] [About] [Skills] [Work] [Exp] [Msg]|              |  <- Floating Dock (bottom: 16px, z: 100)
|              +-------------------------------------------+              |
+-------------------------------------------------------------------------+

MOBILE (320px - 767px)
+-------------------------------------+
| [Abdulkarim]         [Theme Toggle] |  <- Fixed Top Bar (56px)
+-------------------------------------+
|        <main id="main">             |
|        (16px-20px gutters)          |
|                                     |
|  +-------------------------------+  |
|  | [H]  [A]  [S]  [W]  [E]  [C]  |  |  <- Floating Dock (bottom: 12px, >=40px tap zones)
|  +-------------------------------+  |
+-------------------------------------+
```

#### 14-Point Specification

1. **Purpose:** Provide unobtrusive orientation, instant theme switching, skip-to-content access, and persistent section jumping across the single-page portfolio.
2. **Content:** Brand link (`Abdulkarim` → `#home`), `#theme-button` toggle, `.skip-link` (`Skip to main content`), and the 6-icon floating dock (`#home`, `#about`, `#skills`, `#work`, `#experience`, `#contact`).
3. **Visual Hierarchy:** Top bar stays low-profile so Hero content dominates; active dock icon holds the strongest contrast pill so scroll position is legible at a glance.
4. **Layout:** Fixed top bar (`64px` desktop / `56px` mobile) aligned to the `1160px` container. Floating dock centered horizontally (`max-width: 440px`), pinned `16px` (`12px` small mobile) above bottom edge.
5. **3D Composition:** Lives on `--depth-floating` (`z-index: 100`), cleanly above `<main>` (`z-index: 1`) and `.bg-3d` (`z-index: 0`). `.bg-3d` corner crosshairs sit behind content (`translateZ(-12px)`), never overlapping header controls.
6. **Materials:** Top bar starts transparent at scroll `0` and transitions to **Frosted Architectural Slate** (`--color-surface-translucent` + `blur(12px)`) after `32px` scroll. Floating dock always uses Frosted Architectural Slate + `1px` perimeter hairline.
7. **Color Application:** `--color-text-primary` for logo and active dock icon; `--color-text-muted` for inactive dock icons; `--color-surface-elevated` pill with `1px` `--color-accent-secondary` top indicator for `.active-link` (no neon glow shadow).
8. **Typography:** Wordmark `15px–16px` `--font-sans` `600` (`-0.02em`); dock tooltips in `--font-mono` `11px` (`--text-label`).
9. **Interactions:** Scroll-spy throttled via `requestAnimationFrame` / `IntersectionObserver` sets `.active-link` and `aria-current="location"`. Dock icons show crisp CSS tooltips on `:hover` and `:focus-visible`. Theme button toggles `light-theme`, persists safely to `localStorage`, and updates `<meta name="theme-color">`.
10. **Motion:** `.nav__menu` is visible immediately on initial paint (removing the `ScrollReveal` `300px` bottom entrance). Header backdrop and active pill crossfade in `160ms` (`--motion-ease-out`).
11. **Desktop Layout:** `64px` header height; dock sits `16px` from bottom with generous side space; tooltips appear `8px` above hovered/focused icons.
12. **Mobile Layout:** `56px` header height; dock width `calc(100% - 24px)` (`max-width: 400px`) with `>= 40×40px` (`44px` target height) tap zones so all 6 icons fit cleanly at `320px` with zero overflow. Tooltips suppressed on `hover: none` touch devices.
13. **Accessibility:** `<header>`, `<nav aria-label="Main navigation">`, visible high-contrast `.skip-link` (`--color-cta-bg` / `--color-cta-text`), `aria-label` on all icon links and theme toggle, and `2px` `--color-focus-ring` focus indicators.
14. **Acceptance Criteria:** Zero theme flash on reload; zero `localStorage` exceptions in restricted contexts; dock never overlaps footer links (`96px` footer bottom clearance); all 6 icons tap cleanly at `320px`.

---

### B. Hero Section (`#home`)

#### Wireframes

```text
DESKTOP (>= 1024px, 12-Col Asymmetric 7 / 5 Split)
+-------------------------------------------------------------------------+
|  01 / CAIRO, EGYPT · FULL-STACK ENGINEERING   (monospaced eyebrow)      |
|                                                                         |
|  [Cols 1-7: Editorial Identity]        [Cols 8-12: 3D Portrait Plinth]  |
|  Abdulkarim Aklouk (h1, 52px)          +-----------------------------+  |
|  Full-Stack Developer                  |  +-----------------------+  |  |
|                                        |  |                       |  |  |
|  Computer Engineering student in       |  |     profile.png       |  |  |
|  Cairo. I build web applications,      |  |   (recessed inner     |  |  |
|  RESTful APIs, authentication...       |  |    mat + 1px rim)     |  |  |
|                                        |  +-----------------------+  |  |
|  [View Projects] [Contact Me] [CV]     |  LAT 30.0444 / LON 31.2357  |  |
|  [GitHub] [LinkedIn]                   +-----------------------------+  |
|                                                                         |
|  [v Scroll to 02 / About]              (aligned cleanly within container)|
+-------------------------------------------------------------------------+

MOBILE (320px - 767px, Intentional Stacked Hierarchy)
+-------------------------------------+
| 01 / FULL-STACK DEVELOPER           |
| Abdulkarim Aklouk (h1, 34px)        |
|                                     |
| +---------------------------------+ |
| |   Compact 3D Portrait Plinth    | |
| |   (180px-220px, centered/left)  | |
| +---------------------------------+ |
|                                     |
| Computer Engineering student in     |
| Cairo. I build web applications...  |
|                                     |
| [ View Projects (Full Width CTA)  ] |
| [ Contact Me ]   [ Download CV ]    |
| [GitHub] [LinkedIn]                 |
+-------------------------------------+
```

#### 14-Point Specification

1. **Purpose:** Communicate Abdulkarim Aklouk's name, role (`Full-Stack Developer`), core stack, and immediate next actions within 5 seconds, anchored by an unmistakable Quiet 3D focal centerpiece.
2. **Content:** Preserves exact `h1` (`Abdulkarim Aklouk`), role (`Full-Stack Developer`), existing bio paragraph, 3 CTAs (`View Projects`, `Contact Me`, `Download CV` → `assets/pdf/cv.pdf`), GitHub and LinkedIn links, `profile.png`, and `Scroll Down` anchor (`#about`). Adds a minimal monospaced eyebrow (`01 / CAIRO, EGYPT · FULL-STACK`) derived strictly from existing location/role facts.
3. **Visual Hierarchy:** `1.` Name (`h1`) & role; `2.` Portrait pedestal (right focal balance); `3.` Primary `View Projects` CTA; `4.` Bio summary, secondary actions, and social links; `5.` Recessed `.bg-3d` depth grid.
4. **Layout:** Min-height `calc(100svh - 32px)` on desktop (`>= 1024px`) so above-the-fold framing is balanced without pushing content off-screen. 12-col grid: Left column `cols 1–7` (`max-width: 600px`), Right column `cols 8–12` (`align-self: center`).
5. **3D Composition:** Primary 3D focal zone. `.bg-3d` orbital arcs frame the upper-right quadrant behind the portrait plinth. The portrait housing sits on `--depth-surface` inside a `900px` `--perspective-local` container: outer **Soft Satin Mineral** chamfered frame (`14px` radius), recessed **Matte** inner mat (`--color-bg-secondary`, `--shadow-recessed`), and `1px` **Brushed Metal** inner inset border (`8px` inset). On desktop fine-pointer only, moving the cursor gently tilts the outer frame (`max ±1.5deg`), while text in `cols 1–7` stays strictly at `0deg`.
6. **Materials:** Left text sits directly on `--color-bg-primary` (Matte Graphite / Alabaster). Portrait plinth combines Soft Satin Mineral outer slab, Recessed Mat interior, and Brushed Metal trim.
7. **Color Application:** `h1` in `--color-text-primary` (`#EAE7E1` / `#16191D`); role subtitle in `--color-accent-primary`; bio in `--color-text-secondary`; primary button (`View Projects`) in `--color-cta-bg` + `--color-cta-text`; `Contact Me` and `Download CV` as secondary ghost/outline actions so primary CTA stands out cleanly.
8. **Typography:** `--text-label` eyebrow (`12px` mono), `--text-display` `h1` (`clamp(2.125rem, 1.5rem + 2.4vw, 3.25rem)`, `-0.03em`), `--text-lead` intro (`16px–18px`, `max-width: 54ch`), `--text-button` CTAs.
9. **Interactions:** `View Projects` scrolls smoothly to `#work`; `Contact Me` scrolls to `#contact`; `Download CV` triggers download; social icons open in new tab (`noopener noreferrer`); scroll link advances to `#about`.
10. **Motion:** Initial hero load settles gently (`<= 420ms`, `10px` opacity+translateY only if not reduced-motion; never hides `h1` from first paint). Fine-pointer parallax on `.bg-3d` (`±2deg`, `±8px`) and portrait plinth (`±1.5deg`).
11. **Desktop Layout:** Asymmetric `7 / 5` split with `Scroll Down` anchored cleanly at bottom-left or bottom-right **inside** the `1160px` container (eliminating the negative `right: -1.5rem` clipping bug).
12. **Mobile Layout:** `padding-top: 84px` clearing fixed header. Portrait plinth scales cleanly (`190px–220px` wide) below name/role and above bio so visitors see identity + face immediately without excessive scrolling. `View Projects` spans full width (`100%`), with `Contact Me` + `Download CV` paired cleanly beneath (`44px` min height). Side-edge rotated `.home__scroll` is hidden or placed inline below social links so zero horizontal clipping occurs at `320px–767px`.
13. **Accessibility:** `h1` is the sole level-1 heading; `profile.png` retains `alt="Abdulkarim Aklouk"` and explicit `width`/`height` attributes to prevent CLS; social links have descriptive `aria-label`s; zero hover-only controls.
14. **Acceptance Criteria:** Entire primary identity, portrait, and primary CTA fit comfortably above the fold on `1280×800` and `1440×900`; zero horizontal overflow at `320px`; `profile.png` optimized and crisp; `prefers-reduced-motion` freezes all tilt/parallax.

---

### C. About Section (`#about`)

#### Wireframes

```text
DESKTOP (>= 1024px, 12-Col Editorial 4 / 8 Split)
+-------------------------------------------------------------------------+
| 02 / INTRODUCTION                                                       |
| About Me (h2, 32px)  -------------------------------------------------- |
|                                                                         |
| [Cols 1-4: Metadata Ledger]         [Cols 5-12: Narrative Column]       |
| ------------------------------      I am a second-year Computer         |
| EDUCATION   Badr University         Engineering student at Badr...      |
| ------------------------------                                          |
| FOCUS       Full-Stack              I am a quick learner. I pick up...  |
| ------------------------------                                          |
| LOCATION    Cairo, Egypt            I use React in my skill set, but    |
| ------------------------------      I am still developing that skill... |
|                                                                         |
|                                     [ Contact Me ]                      |
+-------------------------------------------------------------------------+

MOBILE (320px - 767px)
+-------------------------------------+
| 02 / INTRODUCTION                   |
| About Me (h2, 24px)                 |
| ----------------------------------- |
| EDUCATION         Badr University   |
| ----------------------------------- |
| FOCUS             Full-Stack        |
| ----------------------------------- |
| LOCATION          Cairo, Egypt      |
| ----------------------------------- |
| I am a second-year Computer...      |
| I am a quick learner...             |
| I use React in my skill set...      |
| [ Contact Me ]                      |
+-------------------------------------+
```

#### 14-Point Specification

1. **Purpose:** Establish Abdulkarim's academic background, learning approach, and candid self-assessment on React in an authentic, human voice.
2. **Content:** Preserves exact subtitle (`Introduction`), heading (`About Me`), 3 metadata pairs (`Education: Badr University`, `Focus: Full-Stack`, `Location: Cairo, Egypt`), all 3 prose paragraphs, and `Contact Me` CTA.
3. **Visual Hierarchy:** Section heading -> 3-paragraph editorial narrative -> scannable metadata ledger -> `Contact Me` link/button.
4. **Layout:** 12-col asymmetric `4 / 8` split (`48px` column gap). Left `cols 1–4` hosts the vertical metadata ledger; right `cols 5–12` hosts the `62ch`-capped prose column (`margin: 0`, left-aligned).
5. **3D Composition:** **Mostly flat (`--depth-content`, `translateZ(0px)`).** Deliberately eliminates the 3 generic centered icon boxes so this section acts as a calm editorial anchor between the Hero 3D focal and the Skills/Services slabs.
6. **Materials:** Transparent layout seated directly on `--color-bg-secondary` (Matte Graphite `#1A1D21` / Warm Ivory `#EAE7E1`) with `1px` `--color-divider` hairlines between ledger rows and a `1px` **Brushed Metal** rule extending from the section header.
7. **Color Application:** Keys (`EDUCATION`, `FOCUS`, `LOCATION`) in `--color-text-muted`; values in `--color-text-primary`; narrative copy in `--color-text-secondary`; `Contact Me` rendered as a secondary ghost button (`--color-border-strong`).
8. **Typography:** `--text-label` eyebrow (`02 / INTRODUCTION`), `--text-h2` (`About Me`), `--text-label` uppercase ledger keys + `15px` `500` ledger values, `--text-body` prose (`1.65` line-height, `16px` desktop / `15px` mobile).
9. **Interactions:** `Contact Me` smoothly scrolls to `#contact`; zero unnecessary hover lifts on non-interactive metadata rows.
10. **Motion:** Single restrained opacity + `10px` upward reveal once on viewport entry (`420ms`, `--motion-ease-out`), disabled under `prefers-reduced-motion`.
11. **Desktop Layout:** Left ledger sticks softly or aligns to top of prose (`align-items: start`); `max-width: 62ch` preserves comfortable reading measure.
12. **Mobile Layout:** Stacks into 1 column: compact 3-row metadata ledger sits directly beneath the heading, followed by the 3 prose paragraphs and full-width/auto `Contact Me` button (`44px` min height).
13. **Accessibility:** Metadata ledger uses semantic `<dl>` (`<dt>` / `<dd>`) instead of generic `<div>` + `<h3>` boxes, eliminating redundant icon clutter and preserving clean heading hierarchy (`h2` only).
14. **Acceptance Criteria:** Zero card boxes around Education/Focus/Location; `55ch–65ch` prose measure maintained on desktop; `<dl>` semantics verified; high text contrast on `--color-bg-secondary` in both themes.

---

### D. Skills Section (`#skills`)

#### Wireframes

```text
DESKTOP (>= 1024px, 12-Col Structured Matrix)
+-------------------------------------------------------------------------+
| 03 / FROM MY CV                                                         |
| Skills (h2, 32px)  ---------------------------------------------------- |
|                                                                         |
| [Cols 1-6: Core Stack Column]       [Cols 7-12: Data & Tooling Column]  |
| +-------------------------------+   +-------------------------------+   |
| | 01  LANGUAGES                 |   | 03  BACKEND                   |   |
| | ----------------------------- |   | ----------------------------- |   |
| | JavaScript        In projects |   | Node.js           In projects |   |
| | C++                  Academic |   | Express.js        In projects |   |
| +-------------------------------+   | REST APIs         In projects |   |
|                                     +-------------------------------+   |
| +-------------------------------+   +-------------------------------+   |
| | 02  FRONTEND                  |   | 04  DATABASES                 |   |
| | ----------------------------- |   | ----------------------------- |   |
| | HTML5             In projects |   | MongoDB           In projects |   |
| | CSS3              In projects |   | MySQL             In projects |   |
| | Bootstrap         In projects |   +-------------------------------+   |
| | JavaScript        In projects |   +-------------------------------+   |
| | React                Learning |   | 05  TOOLS                     |   |
| +-------------------------------+   | ----------------------------- |   |
|                                     | Git                    In use |   |
|                                     | GitHub                 In use |   |
|                                     +-------------------------------+   |
+-------------------------------------------------------------------------+

MOBILE (320px - 767px)
+-------------------------------------+
| 03 / FROM MY CV                     |
| Skills (h2, 24px)                   |
| +---------------------------------+ |
| | 01 LANGUAGES                    | |
| | JavaScript          In projects | |
| | C++                    Academic | |
| +---------------------------------+ |
| +---------------------------------+ |
| | 02 FRONTEND                     | |
| | HTML5               In projects | |
| | ...                             | |
| | React                  Learning | |
| +---------------------------------+ |
| (03 Backend, 04 Databases, 05 Tools)|
+-------------------------------------+
```

#### 14-Point Specification

1. **Purpose:** Present Abdulkarim's verified technical stack clearly grouped by engineering layer without exaggerated progress bars or invented proficiency percentages.
2. **Content:** Preserves exact 5 categories and all existing items/qualifiers verbatim:
   - `Languages`: JavaScript (`In projects`), C++ (`Academic`)
   - `Frontend`: HTML5 (`In projects`), CSS3 (`In projects`), Bootstrap (`In projects`), JavaScript (`In projects`), React (`Learning`)
   - `Backend`: Node.js (`In projects`), Express.js (`In projects`), REST APIs (`In projects`)
   - `Databases`: MongoDB (`In projects`), MySQL (`In projects`)
   - `Tools`: Git (`In use`), GitHub (`In use`)
3. **Visual Hierarchy:** Category titles (`h3` + index `01`–`05`) anchor each panel; skill names sit left-aligned in primary ink; existing qualifiers (`In projects`, `Academic`, `Learning`, `In use`) align right as crisp monospaced tags.
4. **Layout:** 2-column architectural grid (`gap: 24px`): Left column stacks `01 Languages` and `02 Frontend`; Right column stacks `03 Backend`, `04 Databases`, and `05 Tools`—balancing vertical heights naturally without empty grid orphans (fixing the awkward 5-card orphan grid).
5. **3D Composition:** **Interaction-feedback / low-plane surface (`--depth-surface` static).** Panels sit slightly proud of `--color-bg-primary` with `1px` top specular bevel and `--shadow-elevation-1`, staying calm and non-floating so technical scanning is effortless.
6. **Materials:** **Anodized Charcoal / Limestone** (`--color-surface-primary`) panels with `1px solid --color-border-subtle` and internal `1px` `--color-divider` hairlines between skill rows.
7. **Color Application:** Category index (`01`–`05`) in `--color-accent-primary`; skill name in `--color-text-primary`; qualifiers in `--color-text-muted` on `--color-bg-secondary` chip, with `Learning` (`React`) distinguished cleanly via `--color-accent-secondary-tint` + `--color-accent-secondary` text.
8. **Typography:** Category `h3` in `--font-sans` `18px` `600`; skill names in `--font-sans` `15px` `500`; qualifiers in `--font-mono` `11px` (`--text-label`).
9. **Interactions:** Non-clickable informational matrix (no fake button affordances); subtle row hairline highlight (`--color-divider` → `--color-border-strong`) on desktop pointer hover aids horizontal scanning between skill name and qualifier.
10. **Motion:** Staggered category entrance (`<= 60ms` step, `12px` Y travel, once only); zero continuous animation.
11. **Desktop Layout:** Balanced 2-column masonry-free stack (`cols 1–6` and `cols 7–12`) where the two left groups match the vertical height of the three right groups.
12. **Mobile Layout:** Single-column vertical stack (`16px` gap) with `minmax(0, 1fr)` rows; skill name left, qualifier tag right (`flex-wrap: wrap` safety at `320px`).
13. **Accessibility:** Fixes the existing nested `<h3>` bug: category headings are `<h3>`, while individual skill names use `<span>`/`<li>` (or `<dt>`/`<dd>`) rather than `<h3>` inside `<h3>`.
14. **Acceptance Criteria:** Zero invented skills/levels; balanced 2-column desktop height with no orphaned 5th box; sequential `h2 -> h3` headings; `>= 4.5:1` contrast on all qualifier chips including `Learning`.

---

### E. Services Section (`#services`)

#### Wireframes

```text
DESKTOP (>= 1024px, 12-Col 3-Column Plinths + Modal Plane)
+-------------------------------------------------------------------------+
| 04 / WHAT I WORK ON                                                     |
| Services (h2, 32px)  -------------------------------------------------- |
|                                                                         |
| +--------------------+  +--------------------+  +--------------------+  |
| | 01                 |  | 02                 |  | 03                 |  |
| |                    |  |                    |  |                    |  |
| | Backend &          |  | Full-Stack         |  | Databases &        |  |
| | REST APIs          |  | Web Development    |  | Authentication     |  |
| |                    |  |                    |  |                    |  |
| | See More  ->       |  | See More  ->       |  | See More  ->       |  |
| +--------------------+  +--------------------+  +--------------------+  |
|                                                                         |
|              [ACTIVE MODAL: Soft Satin Mineral, z: 1000]                |
|              +------------------------------------------+               |
|              | 01 / SERVICE DETAIL                 [X]  |               |
|              | Backend & REST APIs (h3)                 |               |
|              | I build REST APIs with Node.js...        |               |
|              | ---------------------------------------- |               |
|              | [v] RESTful endpoints for meals...       |               |
|              | [v] Authentication, media handling...    |               |
|              +------------------------------------------+               |
+-------------------------------------------------------------------------+

MOBILE (320px - 767px)
+-------------------------------------+
| 04 / WHAT I WORK ON                 |
| Services (h2, 24px)                 |
| +---------------------------------+ |
| | 01   Backend & REST APIs        | |
| |      See More  ->               | |
| +---------------------------------+ |
| +---------------------------------+ |
| | 02   Full-Stack Web Development | |
| |      See More  ->               | |
| +---------------------------------+ |
| +---------------------------------+ |
| | 03   Databases & Authentication | |
| |      See More  ->               | |
| +---------------------------------+ |
+-------------------------------------+
```

#### 14-Point Specification

1. **Purpose:** Summarize the three core engineering capabilities Abdulkarim offers to clients/teams, with progressive disclosure into concrete deliverables via accessible modals.
2. **Content:** Preserves exact 3 service titles (`Backend & REST APIs`, `Full-Stack Web Development`, `Databases & Authentication`), `See More` triggers, and exact modal descriptions and bullet points.
3. **Visual Hierarchy:** Monospaced service number (`01`–`03`) -> crisp service `h3` title -> clear `See More ->` action at the bottom edge of each plinth.
4. **Layout:** 3 equal-width plinths (`repeat(3, minmax(0, 1fr))`, `24px` gutter) inside the `1160px` container, seated on `--color-bg-secondary`.
5. **3D Composition:** **Supporting 3D (`--depth-surface`).** Each plinth sits as an upright architectural slab with a `2px` **Brushed Metal** top edge highlight and `--shadow-elevation-1`. Hovering lifts the slab (`translateY(-3px)`, `--shadow-elevation-2`). Clicking elevates the detail modal onto `--depth-foreground` (`z-index: 1000`, `translateZ(40px)` visual tier) over a blurred backdrop scrim.
6. **Materials:** Plinths use **Anodized Charcoal / Limestone** (`--color-surface-primary`) + **Brushed Metal** top edge rule. Open modal uses **Soft Satin Mineral** (`--color-surface-elevated`) over **Frosted Architectural Slate** scrim (`blur(6px)`).
7. **Color Application:** Service index in `--color-accent-secondary` (restrained structural cue); title in `--color-text-primary`; `See More` in `--color-accent-primary`. Modal close button styled explicitly with `--color-surface-primary` + `1px solid --color-border-strong` + `--color-text-primary` (fixing default `#f0f0f0` button background bug).
8. **Typography:** `--text-label` index (`01`–`03`), `--text-h3` service title (`20px` `600`, tight `1.25` line-height), `--text-small` `See More` action; inside modal: `--text-h3` heading, `--text-body` summary, `--text-small` deliverable list.
9. **Interactions:** Full card-footer button (`44px` hit target) triggers modal; `aria-expanded` toggles cleanly; `Escape`, close `[X]`, or backdrop click closes modal and restores focus to trigger.
10. **Motion:** Plinth hover lifts `-3px` in `240ms` (`--motion-ease-out`); arrow shifts `+3px` right. Modal scrim fades `240ms`; dialog eases in from `translateY(12px) scale(0.985)` in `320ms`. Focus moves inside dialog *after* `visibility: visible` is applied (fixing the current focus-on-open failure).
11. **Desktop Layout:** Balanced 3-column row (`min-height: 220px`, `flex-direction: column; justify-content: space-between`) so all three plinths share identical height regardless of line wrap. Modal `max-width: 540px`, left-aligned editorial header inside modal for cleaner reading than centered prose.
12. **Mobile Layout:** Fixes the cramped `145px` / `2-col` mobile grid bug: stacks cleanly into **1 full-width column** (`minmax(0, 1fr)`) below `768px` (`2-col` or `3-col` at `768px` tablet), with `See More` maintaining `44×44px` tap target. Modal fills `calc(100vw - 24px)`, `max-height: calc(100dvh - 32px)`, and scrolls smoothly inside `.services__modal-content` on `568×320` viewports.
13. **Accessibility:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `Tab`/`Shift+Tab` trap, background `<main>` / `<header>` / `<footer>` isolated via `inert` while open, explicit `>= 4.5:1` contrast on close button in both themes.
14. **Acceptance Criteria:** Zero cramped mobile columns (`320px`); modal scrolls internally at `568×320`; keyboard focus enters modal immediately on open and returns to trigger on close; background unfocusable while open.

---

### F. Experience & Education Section (`#experience`)

#### Wireframes

```text
DESKTOP (>= 1024px, Vertical Architectural Rail + 2-Col Entry Grid)
+-------------------------------------------------------------------------+
| 06 / BACKGROUND                                                         |
| Experience & Education (h2, 32px)  ------------------------------------ |
|                                                                         |
|  |  (1px vertical recessed hairline rail)                               |
|  |                                                                      |
|  *-- [FREELANCE · Mar–Apr 2025]   +----------------------------------+  |
|  |   Instagram Posting Tool (h3)  | Backend automation & Graph API   |  |
|  |   Freelance Full-Stack Dev     | publishing platform...           |  |
|  |   Cairo, Egypt                 | - Instagram Graph API...         |  |
|  |                                | - REST APIs with Node/Express... |  |
|  |                                +----------------------------------+  |
|  |                                                                      |
|  *-- [FREELANCE]                  +----------------------------------+  |
|  |   Shopify Website Project      | Shopify website project          |  |
|  |   Freelance project            | completed as freelance work.     |  |
|  |                                +----------------------------------+  |
|  |                                                                      |
|  o-- [ONGOING] (lavender node)    +----------------------------------+  |
|  |   Dashboard & AI WhatsApp Bot  | Currently building a dashboard   |  |
|  |   Current work                 | and an AI-powered WhatsApp...    |  |
|  |                                +----------------------------------+  |
|  |                                                                      |
|  *-- [EDUCATION · 2025–2030]      +----------------------------------+  |
|      Bachelor of Computer Eng.    | Second-year Computer Engineering |  |
|      Badr University · GPA 3.3    | student. Grade: 3.3/4.0...       |  |
|                                   +----------------------------------+  |
+-------------------------------------------------------------------------+

MOBILE (320px - 767px)
+-------------------------------------+
| 06 / BACKGROUND                     |
| Experience & Education (h2, 24px)   |
|  |                                  |
|  *-- [FREELANCE · Mar–Apr 2025]     |
|  |   Instagram Posting Tool         |
|  |   +---------------------------+  |
|  |   | Summary & 3 bullets...    |  |
|  |   +---------------------------+  |
|  |                                  |
|  o-- [ONGOING]                      |
|  |   Dashboard & AI WhatsApp Bot... |
+-------------------------------------+
```

#### 14-Point Specification

1. **Purpose:** Present Abdulkarim's real-world freelance delivery, active ongoing engineering work, and Computer Engineering degree in a structured, scannable chronology.
2. **Content:** Preserves all 4 existing records, dates, locations, roles, descriptions, and GPA (`3.3/4.0`) verbatim:
   1. `Freelance` — `Instagram Posting Tool` (`Freelance Full-Stack Web Developer · March 2025 – April 2025 · Cairo, Egypt` + 3 bullets)
   2. `Freelance` — `Shopify Website Project` (`Freelance project`)
   3. `Ongoing` — `Dashboard & AI WhatsApp Chatbot` (`Current work`)
   4. `Education` — `Bachelor of Computer Engineering` (`Badr University · Cairo, Egypt · September 2025 – May 2030`, `Grade: 3.3/4.0`)
3. **Visual Hierarchy:** Category badge (`FREELANCE` / `ONGOING` / `EDUCATION`) + role `h3` -> timeline spine differentiation -> scope description & technical bullets.
4. **Layout:** Vertical architectural timeline inside the `1160px` container on `--color-bg-secondary`. A continuous `1px` spine runs down the left gutter (`24px` offset); each entry splits horizontally (`4 / 8` inside the track) with category/role/date metadata on the left and a grounded entry panel on the right.
5. **3D Composition:** **Supporting 3D.** The vertical spine sits in a subtle recessed channel (`--shadow-recessed` groove or hairline), while entry description panels sit forward on `--depth-surface` (`Anodized Charcoal / Limestone`, `--shadow-elevation-1`). `Ongoing` node uses a restrained chamfered diamond/ring in `--color-accent-secondary` to visually distinguish active work from completed/academic entries.
6. **Materials:** Recessed hairline spine (`--color-divider`), Anodized Charcoal / Limestone entry panels (`--color-surface-primary`), monospaced status tags (`Matte`).
7. **Color Application:** Category tags in `--color-accent-primary` (`Ongoing` tag uses `--color-accent-secondary-tint` + `--color-accent-secondary`); role titles in `--color-text-primary`; dates/locations in `--color-text-muted`; descriptions/bullets in `--color-text-secondary`.
8. **Typography:** `--text-label` monospaced category + tabular dates, `--text-h3` role title (`18px–20px` `600`), `--text-small` meta & descriptions (`1.6` line-height).
9. **Interactions:** Purely informational timeline; subtle border-contrast shift on entry panel hover (`--color-border-subtle` → `--color-border-strong`) with zero misleading link/lift affordance.
10. **Motion:** Sequential vertical reveal along the spine (`<= 60ms` stagger, `12px` Y travel, once only); disabled under `prefers-reduced-motion`.
11. **Desktop Layout:** Left spine (`28px` rail zone) + `320px` metadata sub-column + `minmax(0, 1fr)` description panel (`gap: 24px`).
12. **Mobile Layout:** Spine shifts tightly to `left: 8px`; metadata (`category`, `h3`, `meta`) stacks directly above the compact entry panel (`padding-left: 24px` from spine) so full width remains available for readable prose even at `320px`.
13. **Accessibility:** Ordered semantic `<ol>` or `<article>` entries inside `<section id="experience">`; clean `h2 -> h3` hierarchy; bullet lists stay real `<ul>` elements; zero color-only differentiation (`Ongoing` vs `Freelance` vs `Education` are explicitly labeled in text).
14. **Acceptance Criteria:** All 4 entries and exact dates/GPA preserved; timeline spine aligns cleanly with nodes at all breakpoints; zero overflow at `320px`; clear visual distinction between `Ongoing`, `Freelance`, and `Education`.

---

### G. Engineering Focus Section (`#focus`)

#### Wireframes

```text
DESKTOP (>= 1024px, Editorial Statement + 3 Rule-Divided Pillars)
+-------------------------------------------------------------------------+
| 07 / HOW I WORK                                                         |
| Engineering Focus (h2, 32px)  ----------------------------------------- |
|                                                                         |
| [Cols 1-8: Editorial Lead Statement, 18px, 60ch]                        |
| I look for the most practical technical solution to a problem and       |
| follow established software engineering practices...                    |
|                                                                         |
| [Cols 1-4]                 [Cols 5-8]                 [Cols 9-12]       |
| ========================   ========================   ================= | <- 2px Brushed Metal top rule
| 01 / PRACTICAL             02 / TESTING &             03 / CONTINUOUS   |
|      SOLUTIONS                  OPTIMIZATION               IMPROVEMENT  |
| Choose approaches that     I test applications to     After a feature   |
| fit the problem, stay      find bugs and reliability  works, I keep     |
| maintainable, and...       issues, review how...      tightening...     |
+-------------------------------------------------------------------------+

MOBILE (320px - 767px)
+-------------------------------------+
| 07 / HOW I WORK                     |
| Engineering Focus (h2, 24px)        |
| I look for the most practical...    |
|                                     |
| =================================== |
| 01 / PRACTICAL SOLUTIONS            |
| Choose approaches that fit...       |
| =================================== |
| 02 / TESTING & OPTIMIZATION         |
| I test applications to find...      |
| =================================== |
| 03 / CONTINUOUS IMPROVEMENT         |
| After a feature works, I keep...    |
+-------------------------------------+
```

#### 14-Point Specification

1. **Purpose:** Communicate Abdulkarim's engineering decision-making discipline—prioritizing proven practices, testing, and iterative code refinement—without promotional fluff.
2. **Content:** Preserves exact eyebrow (`How I work`), heading (`Engineering Focus`), full intro paragraph, and all 3 principles (`Practical solutions`, `Testing & Optimization`, `Continuous improvement`) with exact descriptions. Adds `id="focus"` to `<section>` per `REQUIREMENTS.md`.
3. **Visual Hierarchy:** Section heading -> left-aligned editorial intro statement (`cols 1–8`) -> 3 equally weighted rule-topped pillars.
4. **Layout:** Seated on `--color-bg-primary`. Left-aligned statement (`max-width: 64ch`, `margin-bottom: 48px`) above a 3-column horizontal grid (`repeat(3, minmax(0, 1fr))`, `32px` gutter).
5. **3D Composition:** **Mostly flat & editorial (`--depth-content`, `translateZ(0px)`).** Zero card boxes or drop shadows; spatial precision comes from crisp `2px` **Brushed Metal** top rules and subtle monospaced geometric indices (`01`, `02`, `03`) anchored directly above each pillar.
6. **Materials:** **Matte Graphite / Alabaster** background + **Brushed Metal / Hairline Alloy** horizontal top rules (`2px` accent segment over `1px` full-width divider).
7. **Color Application:** Intro statement in `--color-text-primary` / `--color-text-secondary`; pillar index (`01`–`03`) in `--color-accent-primary`; pillar `h3` in `--color-text-primary`; pillar body in `--color-text-secondary`.
8. **Typography:** `--text-lead` (`18px` desktop / `16px` mobile, `1.6` line-height) for intro statement; `--text-label` monospaced indices; `--text-h3` (`18px` `600`) for pillar titles; `--text-small` (`14px`) for pillar copy.
9. **Interactions:** Non-interactive editorial pillars; subtle top-rule luminance sharpening on desktop hover helps visual grouping while staying explicitly non-clickable.
10. **Motion:** Gentle horizontal top-rule reveal (`scaleX` from `0.94` to `1` + opacity fade, `360ms`, once only), bypassed under `prefers-reduced-motion`.
11. **Desktop Layout:** Asymmetric statement (`cols 1–8`, leaving `cols 9–12` open negative space) paired with balanced 3-column pillars below.
12. **Mobile Layout:** Single-column stack (`28px` vertical gap between pillars), each separated cleanly by its `2px` Brushed Metal top bar.
13. **Accessibility:** Adds `id="focus"` so deep links and scroll-spy can address the section cleanly; sequential `h2 -> h3` headings; `aria-hidden="true"` on decorative icons.
14. **Acceptance Criteria:** Zero card containers in Engineering Focus (clear visual contrast against Services/Projects); `id="focus"` present; readable `<= 64ch` intro measure; passes contrast in both themes.

---

### H. Contact Section (`#contact`)

#### Wireframes

```text
DESKTOP (>= 1024px, 12-Col Asymmetric 5 / 7 Split)
+-------------------------------------------------------------------------+
| 08 / GET IN TOUCH                                                       |
| Contact Me (h2, 32px)  ------------------------------------------------ |
|                                                                         |
| [Cols 1-5: Direct Channels]         [Cols 6-12: Recessed Form Panel]    |
| Talk to me (h3)                     +---------------------------------+ |
|                                     | Write a message (h3)            | |
| ----------------------------------  | Sending opens Gmail with your   | |
| EMAIL                               | message filled in. Nothing is   | |
| abdulkarim.aklouk@gmail.com         | stored on this site.            | |
| [Open Gmail ->]  [Copy Email]       |                                 | |
| ----------------------------------  | Name                            | |
| PHONE                               | +-----------------------------+ | |
| 01158250466             [Call ->]   | | Your name                   | | |
| ----------------------------------  | +-----------------------------+ | |
| GITHUB                              | Email                           | |
| abdulkarimaklouk    [Open Profile ->]| +-----------------------------+ | |
| ----------------------------------  | | Your email                  | | |
| LINKEDIN                            | +-----------------------------+ | |
| abdulkarim-aklouk   [Open Profile ->]| Message                         | |
| ----------------------------------  | +-----------------------------+ | |
|                                     | | Your message                | | |
|                                     | |                             | | |
|                                     | +-----------------------------+ | |
|                                     | [ Open in Gmail ]  (Primary CTA)| |
|                                     +---------------------------------+ |
+-------------------------------------------------------------------------+

MOBILE (320px - 767px)
+-------------------------------------+
| 08 / GET IN TOUCH                   |
| Contact Me (h2, 24px)               |
|                                     |
| Write a message (or Talk to me)     |
| +---------------------------------+ |
| | Recessed Form Panel             | |
| | Name / Email / Message          | |
| | [ Open in Gmail (Full Width) ]  | |
| +---------------------------------+ |
|                                     |
| Talk to me                          |
| ----------------------------------- |
| EMAIL: abdulkarim.aklouk@gmail.com  |
| [Open Gmail ->]  [Copy]             |
| ----------------------------------- |
| PHONE: 01158250466       [Call ->]  |
| ----------------------------------- |
| GITHUB / LINKEDIN                   |
+-------------------------------------+
```

#### 14-Point Specification

1. **Purpose:** Offer friction-free contact channels and a transparent client-side Gmail compose workflow with zero server storage.
2. **Content:** Preserves exact Email (`abdulkarim.aklouk@gmail.com` + Gmail compose link), Phone (`01158250466` + `tel:+201158250466`), GitHub, LinkedIn, form fields (`Name`, `Email`, `Message`), `Open in Gmail` submit button, and no-site-storage disclosure. Adds a non-Gmail fallback (`Copy Email` button with status confirmation) per `REQUIREMENTS.md`.
3. **Visual Hierarchy:** Section heading -> Form action (`Open in Gmail`) and Email channel -> Phone/GitHub/LinkedIn channels -> privacy/no-storage note.
4. **Layout:** 12-col `5 / 7` split on `--color-bg-secondary`. Left `cols 1–5` replaces 4 stacked centered cards with 4 hairline-divided horizontal rows (`Talk to me`). Right `cols 6–12` houses the `Write a message` recessed form slab.
5. **3D Composition:** **Interaction-feedback only.** Left channel rows sit flat (`translateZ(0px)`) with `1px` `--color-divider` rules; right form container sits on `--depth-surface` (`Anodized Charcoal / Limestone`), while `<input>` and `<textarea>` sit *inside* recessed wells (`--shadow-recessed`) so typing feels grounded and physically tactile.
6. **Materials:** Anodized Charcoal / Limestone form container (`--color-surface-primary`, `10px` radius, `32px` padding); Matte recessed input wells (`--color-bg-secondary`, `6px` radius, `1px solid --color-border-strong`).
7. **Color Application:** Channel values in `--color-text-primary` (`overflow-wrap: anywhere` for email at `320px`); actions in `--color-accent-primary`; form inputs use `--color-text-primary` text, `--color-text-muted` placeholders, and `--color-status-error` for invalid states; submit button uses `--color-cta-bg` / `--color-cta-text`.
8. **Typography:** Subsection headings `h3` (`20px` `600`); channel labels `--text-label` (`11px` mono); channel values `15px` `500`; form `<label>`s `13px` `500` positioned **externally above** each input (`8px` margin-bottom, removing floating cutout labels).
9. **Interactions:** Form submit validates required fields and opens Gmail compose URL (`noopener,noreferrer`). `Copy Email` copies `abdulkarim.aklouk@gmail.com` via `navigator.clipboard` and announces `"Email copied"` inline (`--color-status-success`, reverting after `2.5s`) with graceful fallback if clipboard API is unavailable.
10. **Motion:** Input border and focus ring transition in `160ms`; submit button hover lifts `-1px`; arrow icons nudge `+3px` on hover; zero scroll-triggered lateral slide-ins from `left`/`right` (eliminating horizontal overflow risk on entrance).
11. **Desktop Layout:** Left `5` cols (`align-content: start`) + Right `7` cols (`max-width: 600px` form width) with `48px` gutter.
12. **Mobile Layout:** Single-column stack (`32px` vertical gap). Placing the 4 hairline channel rows and compact form cleanly with `100%` width inputs (`min-height: 44px`), `textarea` `min-height: 140px`, and full-width `Open in Gmail` button.
13. **Accessibility:** Fixes nested `<h3>` bug (`Talk to me` / `Write a message` are `<h3>`; channel titles `Email`/`Phone`/`GitHub`/`LinkedIn` become `<h4>` or styled `<span class="contact__channel-label">`). Explicit `<label for="...">` above inputs; `aria-describedby` links form note to form; `aria-live="polite"` confirms copied email; `>= 3.0:1` input border contrast (`#747A82` / `#7E786E`).
14. **Acceptance Criteria:** Zero background bleed behind field labels; Gmail compose URL preserved identically; `Copy Email` fallback works without external APIs; zero horizontal overflow on long email string at `320px`; WCAG AA contrast on inputs, borders, and error states.

---

### I. Footer

#### Wireframes

```text
DESKTOP (>= 1024px)
+-------------------------------------------------------------------------+
| ----------------------------------------------------------------------- | <- 1px Brushed Metal divider
| [Abdulkarim Aklouk]           [Home About Skills Projects Exp Contact]  |
|                                                         [GitHub] [LI]   |
| (c) 2026 Abdulkarim Aklouk. All rights reserved.                        |
|                        (96px clearance for floating dock)               |
+-------------------------------------------------------------------------+

MOBILE (320px - 767px)
+-------------------------------------+
| ----------------------------------- |
| Abdulkarim Aklouk                   |
| Home    About    Skills             | <- wraps cleanly (no overflow!)
| Projects Experience Contact         |
| [GitHub]  [LinkedIn]                |
| (c) 2026 Abdulkarim Aklouk.         |
| All rights reserved.                |
|   (96px clearance for dock)         |
+-------------------------------------+
```

#### 14-Point Specification

1. **Purpose:** Provide a calm, grounded architectural conclusion to the portfolio with secondary navigation, social links, and dynamic copyright attribution.
2. **Content:** Preserves exact title (`Abdulkarim Aklouk`), 6 footer nav links (`Home`, `About`, `Skills`, `Projects`, `Experience`, `Contact`), GitHub & LinkedIn links, and dynamic copyright (`© 2026 Abdulkarim Aklouk. All rights reserved.`).
3. **Visual Hierarchy:** Top `1px` Brushed Metal divider separates `<main>` -> wordmark & links -> muted copyright line.
4. **Layout:** Seated on `--color-bg-secondary` (`1160px` inner container), replacing the heavy full-bleed lavender block so the page closes with restraint. Bottom padding `96px` (`6rem`) guarantees zero collision with the fixed bottom dock.
5. **3D Composition:** **Flat grounded base (`--depth-content`).** Intentionally non-elevated so `<main>` slabs appear to rest above a solid foundation.
6. **Materials:** Matte Graphite (`#1A1D21`) / Warm Ivory (`#EAE7E1`) base topped by a `1px` **Brushed Metal** hairline rule.
7. **Color Application:** Wordmark & link hover in `--color-text-primary`; links in `--color-text-secondary`; copyright in `--color-text-muted`; social icon frames in `--color-surface-primary` + `1px solid --color-border-subtle` (fixing light-theme contrast).
8. **Typography:** Wordmark `18px` `600`; nav links `--text-nav` (`13px–14px`); copyright `--text-small` (`13px` with `tabular-nums` year).
9. **Interactions:** Smooth anchor scrolling for internal links; `noopener,noreferrer` external links; subtle color/underline hover states.
10. **Motion:** Instant/fast `160ms` link hover transitions; zero reveal animations in footer so bottom-of-page content is always immediately visible.
11. **Desktop Layout:** Single balanced top row (wordmark left, wrapped/inline nav links center-right, social icons right) + grounded copyright row below.
12. **Mobile Layout:** Fixes the `320px–414px` horizontal overflow bug on `.footer__list`: uses `flex-wrap: wrap` with `gap: 12px 20px` (or `3×2` CSS grid at `<= 390px`) and `>= 44px` vertical tap height on links.
13. **Accessibility:** `<footer>` landmark with nested `<nav aria-label="Footer navigation">`, `>= 4.5:1` contrast across all links and copyright text in both themes, visible `2px` focus rings.
14. **Acceptance Criteria:** Zero horizontal overflow at `320px` and `375px`; full clearance above `.nav__menu` dock at every viewport; dynamic year script preserved; zero full-bleed lavender fill.

---

## 4. Projects Showcase (`#work`) — Deferred Scope Integration Notes

Detailed layout, card anatomy, and content presentation for **Section 05: Projects (`#work`)** are **explicitly deferred** to a dedicated design track. To ensure seamless future integration, the Projects track must adhere to the following system contracts:

| Integration Contract | Requirement for Future `#work` Design |
|---|---|
| **Section Position & Header** | Remains **Section 05** between Services (`04`) and Experience (`06`), seated on `--color-bg-primary` with left-aligned `05 / SELECTED WORK` + `Projects` `h2` + `1px` Brushed Metal rule. |
| **Content & Disclosures** | Must preserve all 5 existing projects (`Restaurant Meal Management System`, `Social Media Application`, `Product CRUD`, `Aklouk Template`, `Food Template`), live demo/source links, and prominent unhosted-backend **Demo Notes**. |
| **Materials & Depth** | Project panels sit on `--depth-surface` using **Anodized Charcoal / Limestone** (`--color-surface-primary`), `10px` radius, `--shadow-elevation-1` -> `--shadow-elevation-2` on hover (`-3px` Y lift). Demo Notes sit in recessed wells (`--shadow-recessed`) with `--color-status-warning` left/label cue. |
| **Filter Controls & Live Feedback** | Filter bar (`All`, `Full-Stack`, `Frontend`) uses segmented architectural controls (`--radius-md`, `>= 44px` mobile touch target, `aria-pressed`) paired with an `aria-live="polite"` status announcement of filtered result count. |
| **Responsive & Overflow Guard** | Must remove the rigid `max-width: 320px` / horizontal-clipping constraints so cards adapt fluidly from `1-col` (`320px`+) to `2-col`/`12-col` tiered desktop grids without overflowing. |

---

## 5. Cross-Section Consistency Rules

1. **Unified Section Header Grammar:** Every section from `02` through `08` opens with the exact same anchor pattern: `--font-mono` `11px–12px` uppercase index & eyebrow (`02 / INTRODUCTION`), followed `8px` below by a left-aligned `h2` (`clamp(1.5rem, 1.25rem + 0.9vw, 2rem)`) and a subtle `1px` Brushed Metal horizontal divider spanning the remaining track.
2. **Alternating Canvas Cadence:** Sections alternate cleanly between `--color-bg-primary` (`#141619` / `#F4F2ED`) and `--color-bg-secondary` (`#1A1D21` / `#EAE7E1`), giving the page natural architectural chapters without heavy horizontal box borders.
3. **Vertical Rhythm:** Desktop sections use `112px` top/bottom padding (`96px` tablet, `64px` mobile), with `48px` (`32px` mobile) separating the section header from section body content.
4. **Shared `1160px` Container Spine:** Regardless of whether a section uses a `7 / 5` split, `4 / 8` split, `3-col` plinths, or `5 / 7` split, its outer edges align strictly to the `1160px` 12-column grid (`48px` desktop, `24px` tablet, `16px–20px` mobile).
5. **Single Light & Material Discipline:** All elevated elements share the `135deg` upper-left key light (`1px` `--color-edge-highlight` top bevel + neutral graphite contact shadow) and `--radius-lg` (`10px`) panel geometry, ensuring varied layouts still read as one engineered system.
6. **Cohesive Motion Cadence:** Once-only scroll reveals share a single `420ms` `--motion-ease-out` curve and `<= 14px` vertical entry distance—zero lateral slide-ins (`origin: left/right`) that break vertical flow or clip mobile viewports.

---

## 6. Cross-Section Acceptance Matrix

| Area | Objective Verification Gate |
|---|---|
| **Global Shell & Nav** | Theme applies pre-paint; `.nav__menu` visible immediately on load; `320px` dock taps cleanly without overflow; `<meta name="theme-color">` syncs with theme. |
| **Hero (`#home`)** | Identity, stack summary, portrait plinth, and primary CTA visible above fold on `1280×800`; zero negative `right` scroll-cue clipping; `±1.5deg` frame tilt disabled on touch & reduced motion. |
| **About (`#about`)** | Flat `<dl>` metadata ledger + `<= 62ch` prose; zero card boxes; sequential `h2` heading structure. |
| **Skills (`#skills`)** | Balanced 2-col desktop layout (`01–02` left, `03–05` right); zero invented proficiency levels; nested `<h3>` bug fixed. |
| **Services (`#services`)** | 3 equal plinths on desktop; clean `1-col` mobile stack; modal receives focus after opening, traps `Tab`, isolates background via `inert`, and scrolls internally at `568×320`. |
| **Projects (`#work`)** | *(Deferred)* Must satisfy Section 4 integration contracts upon handoff. |
| **Experience (`#experience`)** | Vertical hairline spine aligned with nodes across all breakpoints; all 4 factual records & GPA (`3.3/4.0`) intact; `Ongoing` distinguished in text + subtle cue. |
| **Engineering Focus (`#focus`)** | `id="focus"` present; flat 3-pillar layout with `2px` Brushed Metal top rules and zero card shadows; preserves exact copy. |
| **Contact (`#contact`)** | External top-aligned `<label>`s with zero `.bg-3d` bleed; Gmail compose URLs intact; accessible `Copy Email` fallback; zero overflow on `320px` email address. |
| **Footer** | Grounded `--color-bg-secondary` base; wrapped links with zero overflow at `320px–414px`; `96px` dock clearance. |

---

## 7. Open & Section-Specific Design Decisions

### Decisions Proposed in Phase 02 (Extending `design-system.md`)

1. **Architectural Portrait Plinth Replacing Rounded Arch (`.home__handle`):**  
   - *Decision:* Replace the `10rem` arched pill frame with a chamfered architectural pedestal (`14px` outer radius, recessed inner mat, `1px` Brushed Metal inner hairline).  
   - *Reason:* Rounded arch frames feel template-driven and clash with the rectangular chamfered geometry defined in `design-system.md` Section 7.
2. **Scroll-Spy Handling for `#services` and `#focus` with 6-Link Bottom Dock:**  
   - *Decision:* Keep the floating bottom dock at 6 concise links (`Home`, `About`, `Skills`, `Projects`, `Experience`, `Contact`) so `320px` mobile tap targets remain `>= 40–44px` without crowding; add `id="focus"` to Engineering Focus and ensure scroll-spy clears stale highlights accurately (or maps `#services` -> `Skills` and `#focus` -> `Experience` cleanly until reaching `#work` / `#contact`).  
   - *Reason:* Adding 8 icons to a `300px`-wide mobile pill compromises touch accessibility (`< 36px` width per icon).
3. **Copy Email Fallback Alongside Gmail Compose (`#contact`):**  
   - *Decision:* Add a compact `Copy Email` button next to `Open Gmail` in the Email row while preserving the Gmail compose form and link unchanged.  
   - *Reason:* Directly resolves the `REQUIREMENTS.md` usability gap for visitors without Gmail configured, without introducing any backend.

### Remaining Open Questions for Phase 03+ (Architecture / Planning)

- **Top Navigation Quick Links on Desktop:** Decide whether desktop (`>= 1024px`) header should remain ultra-minimal (wordmark + theme toggle, relying on the floating dock) or include subtle text links for all 8 sections (`Services` and `Engineering Focus` included).
- **Timeline Chronology Order (`#experience`):** Confirm whether to preserve exact current DOM order (`Instagram Posting Tool` → `Shopify Website Project` → `Dashboard & AI WhatsApp Chatbot` → `Bachelor of Computer Engineering`) or sort strictly reverse-chronologically (`Ongoing` first, then `2025–2030 Education`, then `March–April 2025 Freelance`).
- **Font & Icon Delivery:** Confirm self-hosting `Plus Jakarta Sans` + `IBM Plex Mono` `.woff2` files and replacing Boxicons CDN with lightweight inline SVGs during Architecture Planning (`docs/architecture/`).

