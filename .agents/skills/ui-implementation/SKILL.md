---
name: ui-implementation
description: >-
  Guides UI/UX implementation, layout refactoring, theming, and Quiet 3D visual
  refinements for the static portfolio site. Use when designing, building, or
  updating HTML, CSS, SVG, or client-side UI JavaScript in this repository.
---

# UI Implementation Workflow

Use this workflow for any UI/UX redesign, layout fix, theme update, or Quiet 3D enhancement in `index.html`, `assets/css/styles.css`, and `assets/js/main.js`.

## 1. Inspection

Before editing any UI code:

1. Read `docs/PROJECT_OVERVIEW.md`, `docs/REQUIREMENTS.md`, and any relevant documents in `docs/design/`, `docs/architecture/`, and `docs/planning/`.
2. Inspect the target markup in `index.html`, styles/tokens in `assets/css/styles.css`, and interactive behavior in `assets/js/main.js`.
3. Map existing IDs, classes, `aria-*` attributes, JS event hooks, and content disclosures (such as project backend status notes and contact disclaimers) so existing functionality and data remain intact.

## 2. Planning

Before writing code:

1. Confirm the change fits the approved task scope—no arbitrary redesigns outside what was requested.
2. Verify the approach stays within the zero-build Vanilla HTML/CSS/JS stack and lightweight CSS/DOM/SVG 3D constraints.
3. Identify all affected sections, CSS tokens, dark/light theme pairs, breakpoints (`320px` mobile through `1440px+` desktop), and interactive states (modals, filters, scroll-spy, focus states, reduced motion).

## 3. Implementation

Execute focused, maintainable edits:

1. **Semantic HTML:** Keep the eight main sections and landmark structure clean, with sequential heading levels (`h1` -> `h2` -> `h3`) and native interactive elements (`<button>`, `<a href>`).
2. **Tokenized CSS:** Drive colors, surfaces, elevation, spacing, and typography through CSS custom properties supporting both dark (default) and light themes without flash of unstyled/wrong theme.
3. **Quiet 3D Execution:** Build depth using restrained perspective layers, subtle elevation, crisp surface separation, and calm pointer/scroll response using CSS, DOM, and SVG. Keep text surfaces crisp and readable.
4. **Vanilla JS Discipline:** Keep scripts modular, guard `localStorage` access, throttle/optimize scroll listeners, pause idle animations, and handle runtime `prefers-reduced-motion` changes cleanly.

## 4. Anti-AI Design Gate

Review the implementation against these rules before testing:

- **No generic AI tropes:** Reject loud multi-stop gradients, neon glows, excessive backdrop-blur/glassmorphism, floating decorative pills, or busy glowing borders.
- **Purposeful 3D:** Depth must reinforce hierarchy and spatial calm, never distract from portfolio content or reduce legibility.
- **Restraint & Consistency:** Spacing, border radii, elevation tiers, and motion curves must feel unified across all eight sections and both themes.

## 5. Responsive Validation

Inspect the rendered site across key viewports:

- **Small mobile:** `320×568` and `375×667` (also test short landscape/overlay height `568×320`).
- **Large mobile / Tablet:** `414px`, `768×1024`.
- **Desktop:** `1024px`, `1280px`, `1440px+`.

Verify:

- Zero horizontal page overflow at every width.
- Proper clearance between the floating navigation dock and footer content.
- Modals fit comfortably or scroll internally on short viewports.
- Grid layouts and card proportions remain balanced across breakpoints.

## 6. Accessibility & Motion Checks

Verify across **both dark and light themes**:

- **Contrast:** Text, accents, links, buttons, skip link, and close controls meet WCAG 2.1 Level AA contrast ratios.
- **Keyboard Navigation:** Full reachability via `Tab` / `Shift+Tab`, clear visible focus rings, `Escape` and backdrop dismissal for dialogs, and immediate focus entry + focus restoration for modals.
- **Screen Reader & ARIA Semantics:** Accurate `aria-expanded`, `aria-current="location"`, modal background isolation (`inert`/`aria-hidden` or equivalent), and live/status feedback where appropriate.
- **Motion & Input:** Confirm `prefers-reduced-motion: reduce` disables decorative 3D motion and transitions cleanly, and touch-only devices do not trigger hover/pointer-stuck states.

## 7. Visual Review (Required Before Acceptance)

Do not accept UI changes from code inspection alone:

1. Serve and open the site in a live browser (e.g., local static server).
2. Visually inspect affected sections, hover/focus states, open modals, and project filters in **both dark and light themes** across mobile, tablet, and desktop sizes.
3. Check the browser DevTools console and network panel for zero runtime errors, layout glitches, or missing-asset `404`s.

## 8. Final Review & Reporting

1. Confirm `index.html`, CSS, JS, and assets remain static-hosting ready with no unrequested dependencies or discarded work.
2. Update `docs/` if approved design or technical decisions changed.
3. Report only directly observed verification results, exact files modified, and any remaining issues or untested viewports.
