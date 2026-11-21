# Requirements — Abdulkarim Aklouk Portfolio

Concise requirements for the public portfolio website ([`index.html`](../index.html)), based on [`PROJECT_OVERVIEW.md`](PROJECT_OVERVIEW.md) and the completed repository audit.

---

## 1. Functional Requirements

### Existing Functionality
- **Eight Main Sections:** Preserve the existing single-page structure in order: Home (`#home`), About (`#about`), Skills (`#skills`), Services (`#services`), Projects (`#work`), Experience & Education (`#experience`), Engineering Focus, and Contact (`#contact`), along with the header and footer.
- **Navigation & Scroll-Spy:** Keep the top brand link, footer links, and 6-icon floating bottom dock scrolling smoothly to target sections and marking the active section (`.active-link`, `aria-current="location"`).
- **Theme Persistence:** Keep `#theme-button` toggling between dark and light themes with preference stored in `localStorage`.
- **Project Filtering & Disclosures:** Keep `All`, `Full-Stack`, and `Frontend` filtering across the five project cards, preserving live demo/source links and unhosted-backend disclosures.
- **Service Modals:** Keep `See More` triggers opening service detail dialogs (`role="dialog"`, `aria-modal="true"`) with `aria-expanded` synchronization, keyboard focus trapping, `Escape`/close-button/backdrop dismissal, and focus restoration.
- **CV & Contact:** Keep [`cv.pdf`](../assets/pdf/cv.pdf) download, direct contact links (Email, Phone, GitHub, LinkedIn), dynamic copyright year, and the Gmail-compose form with its no-site-storage disclosure.

### Planned Improvements
- Fix modal focus-on-open so keyboard focus enters the dialog immediately instead of being ignored while `visibility: hidden` transitions.
- Add an anchor `id` to Engineering Focus and define consistent scroll-spy handling when scrolling through Services and Engineering Focus.
- Provide a non-Gmail contact fallback (or copy-email action) and assistive status feedback when filtering projects.
- Guard `localStorage` access against blocked-storage contexts and apply saved theme state before first paint.

**Acceptance Criteria:** All eight sections, navigation, theme toggle, CV download, project filters, modals, and contact actions work reliably with zero console errors.

---

## 2. UI/UX Requirements

### Existing Functionality
- Maintain the Quiet 3D architectural palette (Midnight Black `#0B0B0C`, Pure White `#FFFFFF`, Lime Green `#C6F432`) with `Plus Jakarta Sans` and `IBM Plex Mono` typography across dark and light themes.
- Maintain floating bottom navigation clearance above footer links and copyright notice (`6rem` footer bottom padding).

### Completed & Ongoing Improvements
- Zero horizontal page overflow across mobile viewports (`320px–414px`), container-bounded `.home__scroll` positioning, and vertical scrolling inside service modals on short viewports (`568×320`).
- High-contrast accessible tokens across both themes, visible `.skip-link`, tactile hover states, and WCAG 2.1 Level AA compliant interactive controls.
- Asymmetric 2-column hero grid (`hero__grid`), sequential `h1`–`h3` heading hierarchy, accessible dock icon labels, and immediate `.nav__menu` rendering on page load.

**Acceptance Criteria:** Zero horizontal overflow from `320px` to `1440px+`; modals fit or scroll cleanly on short viewports; dark and light themes support comfortable keyboard navigation and WCAG 2.1 AA contrast.

---

## 3. 3D Experience

### Existing Functionality
- **3D Fluid Mesh Hero Background:** Lightweight Three.js `0.160.0` WebGL canvas (`#hero-waves-canvas`, [`assets/js/hero-background.js`](../assets/js/hero-background.js)) in `#home`, rendering an organic sculptural fluid wave with obsidian-to-emerald/mint shading, screen-space anti-aliased strands, dynamic theme adaptation, spatial negative space protecting typography, and `prefers-reduced-motion` compliance.
- Calm architectural surface grammar across lower sections with hairline dividers, subtle elevation, and zero distracting background clutter.
- Responsive rendering: render loop automatically halts when `#home` scrolls out of viewport via `IntersectionObserver` and during background tabs via `visibilitychange`.

### Design Guidelines
- 3D visuals remain purely decorative, calm, and smooth without scroll lag, disable motion under `prefers-reduced-motion: reduce`, and never impair text readability.

**Acceptance Criteria:** 3D visuals stay purely decorative, calm, and smooth without scroll lag, disable motion under `prefers-reduced-motion: reduce` and touch-only devices, and never impair text readability.

---

## 4. Quality Requirements

- **Performance:** Compress and size [`profile.png`](../assets/img/profile.png) (`578 KB`, `768×768`) appropriately for its rendered display (`255px–330px`), add favicon assets to eliminate the `/favicon.ico` `404`, replace render-blocking unpinned `ScrollReveal` redirects and `2.5s` reset-on-scroll collisions, and throttle scroll-spy reads.
- **Accessibility:** Meet applicable WCAG 2.1 Level AA success criteria across both themes (contrast, sequential heading order, keyboard access, focus management, modal background isolation, and reduced-motion support), subject to verification and testing.
- **SEO:** Preserve canonical URL, meta description, verification meta, Open Graph/Twitter tags, JSON-LD `Person` schema, and [`sitemap.xml`](../sitemap.xml); align `<meta name="theme-color">` with active theme tokens and remove legacy `msapplication-TileColor`.
- **Maintainability:** Remove dead and commented CSS rules, fix non-standard 4-argument `hsl()` syntax and mixed `rem`/`em` units, evaluate replacing MixItUp (`CC BY-NC 3.0`) with lightweight vanilla filtering to avoid commercial licensing ambiguity, and keep [`README.md`](../README.md) aligned with tracked files.

---

## 5. Constraints & Out of Scope

### Constraints
- **Vanilla Static Stack:** Build strictly with **vanilla HTML, CSS, and JavaScript** (zero-build static files deployable on GitHub Pages at `/my-portfolio/`).
- **Lightweight Dependencies:** Avoid unnecessary frameworks, build tools, external dependencies, or heavy 3D engines.
- **Content Accuracy:** Keep owner details, project records, repository links, and unhosted-backend notes accurate.

### Out of Scope
- Admin Dashboard, CMS, or authentication flows.
- Server-side backend APIs, databases, or server-stored form handling.
- Hosting backend services for the featured Full-Stack projects.
- Multi-page routing or visitor analytics tracking.

---

## Confirmed Audit Improvement Checklist

- [x] Fix `.footer__list` horizontal page overflow on mobile (`320px–414px`). *(Verified in production commit `f21ecfe`)*
- [x] Fix `.home__scroll` right-edge clipping below `992px`. *(Verified in production commit `f21ecfe`)*
- [x] Add height bounds and scrolling to `.services__modal-content` on short viewports (`568×320`). *(Verified in production commit `f21ecfe`)*
- [x] Fix modal initial focus failure during `visibility: hidden` transition and isolate background landmarks via `inert` while open. *(Verified in production commit `f21ecfe`)*
- [x] Fix WCAG AA contrast failures in Light Theme, `.skip-link`, `.home__social-link:hover`, and `.services__modal-close`. *(Verified in production commit `f21ecfe`)*
- [x] Restore valid favicon assets (inline SVG data URI) and dynamically align `<meta name="theme-color">`. *(Verified in production commit `f21ecfe`)*
- [x] Remove render-blocking unpinned `ScrollReveal` redirects and animation overlap in favor of native `IntersectionObserver`. *(Verified in production commit `f21ecfe`)*
- [x] Guard `localStorage`, eliminate reload theme flash with a synchronous pre-paint guard in `<head>`. *(Verified in production commit `f21ecfe`)*
- [x] Fix `#skills`, `#contact`, and card heading hierarchy to sequential levels (`h1` → `h2` → `h3`). *(Verified in production commit `f21ecfe`)*
- [x] Clean dead CSS, implement Quiet 3D design tokens, and update [`README.md`](../README.md). *(Verified in production commit `f21ecfe`)*
