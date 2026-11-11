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
- Maintain the dark-first navy/slate/lavender palette (`Poppins` typography) with a switchable light theme.
- Maintain floating bottom navigation clearance above footer links and copyright notice (`6rem` footer bottom padding).

### Planned Improvements
- Resolve mobile horizontal page overflow on `.footer__list` (`320px–414px`), keep `.home__scroll` inside viewport bounds below `992px`, and enable vertical scrolling inside service modals on short viewports (`568×320`).
- Fix light-theme accent contrast, `.skip-link`, `.home__social-link:hover`, and `.services__modal-close` (removing the browser default `#f0f0f0` button background) to meet WCAG 2.1 Level AA contrast.
- Balance `.services__card` mobile/tablet grid widths, fix nested `<h3>` heading levels in `#skills` and `#contact`, add clear visual labels/tooltips for icon-only dock links, integrate contact field labels cleanly over the 3D background, and keep `.nav__menu` visible immediately on load.

**Acceptance Criteria:** Zero horizontal overflow from `320px` to `1440px+`; modals fit or scroll cleanly on short viewports; dark and light themes support comfortable keyboard navigation and WCAG 2.1 AA contrast.

---

## 3. 3D Experience

### Existing Functionality
- Non-interactive `.bg-3d` perspective backdrop (`aria-hidden="true"`, `pointer-events: none`) featuring ambient radial lighting, tilted floor grid, three orbital rings, and corner crosshairs adapting to dark/light themes and mobile screens.
- Subtle pointer-driven parallax (`±2.5deg` tilt, `±10px` translation) on fine-pointer devices, resetting on pointer leave or blur and disabled under `prefers-reduced-motion: reduce`.

### Planned Improvements
- Evolve toward a **professional, calm, and cohesive 3D design** that unifies spatial depth, lighting, and card elevation across the page while keeping copy crisp and uncluttered.
- Keep implementation strictly **lightweight using CSS, DOM, and SVG** (plus minimal vanilla JS), pausing animation loops when idle and reacting to runtime `prefers-reduced-motion` changes.

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

- [ ] Fix `.footer__list` horizontal page overflow on mobile (`320px–414px`).
- [ ] Fix `.home__scroll` right-edge clipping below `992px`.
- [ ] Add height bounds and scrolling to `.services__modal-content` on short viewports (`568×320`).
- [ ] Fix modal initial focus failure during `visibility: hidden` transition and isolate background landmarks while open.
- [ ] Fix WCAG AA contrast failures in Light Theme (`#a395e9` at `2.15:1`–`2.54:1`), `.skip-link` (`2.61:1`), `.home__social-link:hover` (`2.61:1`), and `.services__modal-close` (`2.29:1` on default `#f0f0f0`).
- [ ] Restore valid favicon assets (`/favicon.ico` `404`) and align `<meta name="theme-color">`.
- [ ] Optimize `profile.png` (`578 KB`) and remove render-blocking unpinned `ScrollReveal` redirects and animation overlap.
- [ ] Guard `localStorage`, eliminate reload theme flash, fix `#skills`/`#contact` heading hierarchy, clean dead CSS, and update [`README.md`](../README.md).
