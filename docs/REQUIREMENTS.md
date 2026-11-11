# Requirements — Abdulkarim Aklouk Portfolio

Concise functional, visual, and quality requirements for the public portfolio website ([`index.html`](../index.html)), separating existing baseline behavior from planned improvements.

---

## 1. Functional Requirements

### Existing Features
- **Eight Main Content Sections:** Preserve the existing single-page structure in order: Home (`#home`), About (`#about`), Skills (`#skills`), Services (`#services`), Projects (`#work`), Experience & Education (`#experience`), Engineering Focus, and Contact (`#contact`), along with the header and footer.
- **Navigation & Scroll-Spy:** Keep the top brand link, footer navigation links, and 6-icon bottom navigation dock scrolling smoothly to target sections and highlighting the active section (`.active-link` and `aria-current="location"`).
- **Theme Switching:** Keep the header `#theme-button` toggling between dark and light themes with state persisted in `localStorage`.
- **Project Filtering & Disclosures:** Keep category filtering (`All`, `Full-Stack`, `Frontend`) across the five portfolio projects, preserving live demo/source links and unhosted-backend demo notes.
- **Service Detail Modals:** Keep `See More` triggers opening service detail dialogs (`role="dialog"`, `aria-modal="true"`) with `aria-expanded` sync, `Tab` focus trapping, close button, backdrop click, `Escape` dismissal, and focus restoration.
- **CV & Contact:** Keep [`cv.pdf`](../assets/pdf/cv.pdf) downloadable from the hero, direct contact links (Email, Phone, GitHub, LinkedIn), dynamic footer year, and the Gmail-compose contact form with its no-site-storage disclosure.

### Planned Improvements
- **Modal Initial Focus:** Ensure opening a service modal reliably moves focus into the dialog rather than failing while `visibility: hidden` transitions.
- **Scroll-Spy Completeness:** Add an `id` to Engineering Focus and define clear scroll-spy/navigation handling for Services and Engineering Focus.
- **Non-Gmail Contact & Filter Feedback:** Add a standard `mailto:` fallback or copy-email action for non-Gmail visitors, and announce filtered project counts to assistive technologies (`aria-live="polite"`).
- **Resilient Initialization:** Guard `localStorage` reads/writes with `try/catch` and apply saved theme state before first paint.

**Acceptance Criteria:** All eight sections, theme persistence, CV download, project filters, modal open/trap/close flows, and contact actions work cleanly with zero console errors.

---

## 2. UI/UX Requirements

### Existing Features
- **Theme Palette & Identity:** Maintain the dark-first navy/slate/lavender visual system (`Poppins` typography) paired with a switchable light theme.
- **Bottom Dock Clearance:** Maintain fixed centered bottom navigation dock clearance above footer links and copyright text.

### Planned Improvements
- **Responsive Layout Fixes:** Wrap `.footer__list` on narrow mobile screens (`320px–414px`) to eliminate horizontal page overflow, keep `.home__scroll` inside viewport bounds below `992px`, and allow vertical scrolling inside service modals on short viewports (`568×320`).
- **Theme & Control Contrast:** Adjust light-theme accent tokens, `.skip-link`, and `.home__social-link:hover` colors to meet WCAG 2.1 AA contrast, and remove the browser default `#f0f0f0` button background on `.services__modal-close`.
- **Usability & Visual Polish:** Equalize mobile/tablet `.services__card` column widths, fix nested `<h3>` heading hierarchy in `#skills` and `#contact`, add visible hover/focus labels for icon-only dock links, blend `.contact__form-tag` over the 3D background, and keep `.nav__menu` immediately visible on load.

**Acceptance Criteria:** Zero horizontal page overflow from `320px` to `1440px+`; modals remain scrollable and dismissible on short screens; both themes pass WCAG 2.1 Level AA contrast and keyboard usability checks.

---

## 3. 3D Experience

### Existing Features
- **CSS Perspective Backdrop:** Keep the non-interactive `.bg-3d` background (`aria-hidden="true"`, `pointer-events: none`) with ambient gradients, floor grid, three orbital rings, and corner crosshairs adapting to dark/light themes and mobile breakpoints.
- **Subtle Pointer Parallax:** Keep smooth `requestAnimationFrame` parallax (`±2.5deg` tilt, `±10px` translation) on fine-pointer devices, resetting to neutral on pointer leave/window blur and disabled when `prefers-reduced-motion: reduce`.

### Planned Improvements
- **Cohesive 3D Visual Direction:** Unify depth, ambient lighting, and subtle surface elevation across the hero and cards so the foreground and `.bg-3d` backdrop feel like one cohesive, professional 3D experience without sacrificing text readability.
- **Lightweight Execution:** Keep 3D motion CSS/vanilla-JS based, pause animation loops whenever idle, and listen for runtime changes to `prefers-reduced-motion`.

**Acceptance Criteria:** 3D elements remain purely decorative, stay smooth on desktop and mobile without scroll lag, stop animating when idle or under reduced motion, and preserve high foreground legibility.

---

## 4. Quality Requirements

- **Performance:** Resize and compress [`profile.png`](../assets/img/profile.png) (`578 KB`, `768×768`) to match rendered slot dimensions (`255px–330px`) with explicit `width`/`height` attributes; add a favicon to eliminate the `/favicon.ico` `404`; remove render-blocking CDN redirects and replace slow `2.5s` reset-on-scroll animations that conflict with project filtering; throttle scroll-spy updates.
- **Accessibility:** Meet applicable WCAG 2.1 Level AA success criteria across both themes (color contrast, sequential heading structure, keyboard navigation and visible focus, modal focus management and background inertness, and reduced-motion support), subject to verification and testing.
- **SEO:** Maintain canonical URL, meta description, Google Search Console verification, Open Graph/Twitter tags, JSON-LD `Person` schema, and [`sitemap.xml`](../sitemap.xml); align `<meta name="theme-color">` with active palette tokens and remove legacy `msapplication-TileColor`.
- **Maintainability:** Remove dead/commented CSS selectors (`.services__modal-icon`, `.home__greeting`, `.about__img`, `.change__theme`, `.is-disabled`, `.light-theme .home__social-link::after`), fix invalid 4-argument `hsl()` syntax and mixed `rem`/`em` units, replace MixItUp (`CC BY-NC 3.0`) with lightweight vanilla filtering if needed to avoid commercial-use restrictions, and update [`README.md`](../README.md) to reflect actual repository files.

---

## 5. Constraints & Out of Scope

### Technical Constraints
- Preserve the zero-build static HTML5, CSS3, and vanilla JavaScript stack deployable directly to GitHub Pages (`/my-portfolio/`).
- Do not introduce unnecessary frameworks, bundlers, heavy 3D engines (e.g., Three.js/WebGL), or unrequested build tooling.
- Keep all personal details, project descriptions, source/demo links, and unhosted-backend disclaimers accurate.

### Out of Scope
- Portfolio Admin Dashboard, CMS, or authentication flows (deferred).
- Server-side backend APIs, databases, or server-stored contact submissions.
- Hosting backend services for the featured Full-Stack projects.
- Multi-page routing or visitor analytics trackers.

---

## Confirmed Audit Improvement Checklist

- [ ] Fix `.footer__list` horizontal page overflow on mobile viewports (`320px–414px`).
- [ ] Fix `.home__scroll` right-edge clipping below `992px`.
- [ ] Enable scrolling and height containment inside `.services__modal-content` on short viewports (`568×320`).
- [ ] Fix modal initial focus failure during `visibility: hidden` transition and isolate background content while a modal is open.
- [ ] Fix WCAG AA contrast failures in Light Theme (`--first-color` `#a395e9` at `2.15:1`–`2.54:1`), `.skip-link` (`2.61:1`), `.home__social-link:hover` (`2.61:1`), and `.services__modal-close` (`2.29:1` on browser `#f0f0f0`).
- [ ] Add favicon assets to eliminate `/favicon.ico` `404` and align `<meta name="theme-color">`.
- [ ] Optimize `profile.png` (`578 KB`) and eliminate render-blocking unpinned `ScrollReveal` redirects and filter/scroll animation conflicts.
- [ ] Guard `localStorage` access, prevent dark-to-light reload flash, fix `#skills`/`#contact` heading hierarchy, remove dead CSS, and sync [`README.md`](../README.md).

