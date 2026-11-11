# Project Overview — Abdulkarim Aklouk Portfolio

## 1. Project Identity

- **Project Name:** Abdulkarim Aklouk — Public Portfolio Website ([`index.html`](../index.html)) _(Observed in the repository)_
- **Owner & Role:** Abdulkarim Aklouk — Full-Stack Web Developer and Computer Engineering student in Cairo, Egypt _(Owner-provided information)_
- **Repository & Hosting Configuration:** GitHub repository `abdulkarimaklouk/my-portfolio`, configured via canonical metadata and [`sitemap.xml`](../sitemap.xml) for static deployment on GitHub Pages (`/my-portfolio/`) _(Observed in repository metadata and configuration)_

---

## 2. Project Purpose

Serve as a public, static personal portfolio presenting Abdulkarim Aklouk's software engineering background, technical skills, development services, selected full-stack and frontend projects (including live demos, source code links, and backend hosting disclosures), engineering principles, downloadable CV ([`cv.pdf`](../assets/pdf/cv.pdf)), and contact pathways.

---

## 3. Vision & Goals

### Current Capabilities (Observed in Repository)

- Static single-page portfolio with dark and light themes persisted in `localStorage`.
- Interactive project filtering (`All`, `Full-Stack`, `Frontend`), keyboard-accessible service detail dialogs, scroll-spy navigation, and scroll-triggered reveal animations.
- Pointer-reactive 3D perspective backdrop ([`.bg-3d`](../index.html#L86-L104)) with ambient gradients, perspective grid, orbital rings, and reduced-motion / pointer-type gating.
- SEO and social metadata (Open Graph, Twitter Cards, Google Search Console verification, JSON-LD `Person` schema, and XML sitemap).

### Future Goals (Planned Direction)

- **Long-Term Visual Direction:** Evolve into a cohesive, professional 3D portfolio experience while preserving clear readability, personal identity, and responsive performance.
- **High-Level Foundation Goals:**
  - Ensure reliable responsive layout behavior across mobile, tablet, and desktop viewports.
  - Meet applicable WCAG 2.1 Level AA success criteria, subject to verification and testing.
  - Improve asset delivery efficiency, dependency stability, and long-term codebase maintainability.

---

## 4. Target Audience (Inferred from Repository Content)

_(Note: Target audiences are inferred from existing sections, project framing, and calls to action; no formal persona document exists in the repository.)_

- **Technical Recruiters & Hiring Managers:** Evaluating full-stack and backend capabilities, academic foundation, project source code, and downloadable CV.
- **Prospective Freelance Clients & Collaborators:** Reviewing service offerings, freelance track record, and initiating project inquiries.
- **Engineering Peers:** Inspecting live project demos, architectures, and engineering practices.

---

## 5. Core Sections & Features (Observed in Repository)

### Global Shell & Interactive Layer

- **Header & Navigation:** Fixed top bar with brand link and theme toggle (`#theme-button`), floating bottom icon navigation dock with scroll-spy active state, skip-to-content link, and footer navigation.
- **3D Perspective Background:** Multi-layer CSS/JS ambient backdrop responding subtly to fine-pointer movement and disabled under `prefers-reduced-motion: reduce`.

### Existing Eight Main Sections

1. **Home (`#home`):** Introduction, role summary, primary calls to action (`View Projects`, `Contact Me`, `Download CV`), portrait ([`profile.png`](../assets/img/profile.png)), social links, and scroll indicator.
2. **About (`#about`):** Summary highlights (Education, Focus, Location), personal engineering overview, and contact call to action.
3. **Skills (`#skills`):** Categorized technical skills across `Languages`, `Frontend`, `Backend`, `Databases`, and `Tools`.
4. **Services (`#services`):** Three service offerings (`Backend & REST APIs`, `Full-Stack Web Development`, `Databases & Authentication`) with modal dialogs supporting keyboard focus trapping and `Escape` dismissal.
5. **Projects (`#work`):** Filterable showcase of five projects (`Restaurant Meal Management System`, `Social Media Application`, `Product CRUD`, `Aklouk Template`, `Food Template`) with features, technology tags, live demo/source links, and backend status disclosures.
6. **Experience & Education (`#experience`):** Cards covering freelance work, ongoing work, and Computer Engineering education.
7. **Engineering Focus (`.focus.section`):** Overview of engineering mindset supported by three core principles (`Practical solutions`, `Testing & Optimization`, `Continuous improvement`).
8. **Contact (`#contact`):** Direct contact cards (Email, Phone, GitHub, LinkedIn) and a client-side contact form that opens a pre-filled Gmail compose window without storing data on the site.

---

## 6. Technology Stack (Observed in Repository)

- **Core Frontend:** Zero-build static HTML5 ([`index.html`](../index.html)), CSS3 ([`styles.css`](../assets/css/styles.css)), and vanilla ES6+ JavaScript ([`main.js`](../assets/js/main.js)).
- **Vendored Library:** MixItUp v3.3.1 ([`mixitup.min.js`](../assets/js/mixitup.min.js)) for project card filtering.
- **External CDN Assets:** Google Fonts (`Poppins`), Boxicons v2.1.2, and ScrollReveal (loaded from `unpkg.com`).
- **Client-Side Integrations:** Gmail web compose URL generation, `tel:` link, and static SEO and social metadata.
- **Build & QA Tooling:** None currently configured (no package manager, bundler, linter, or automated test suite).

---

## 7. Project Scope

### In Scope (Current Project)

- Public-facing static portfolio website comprising the existing eight main sections, global shell, interactive UI controls, CV download, SEO metadata, and 3D visual backdrop.

### Out of Scope / Deferred

- **Portfolio Admin Dashboard:** Explicitly deferred and outside the current project scope. No admin capabilities, authentication flows, or backend architecture assumptions are included in the current product definition.
- **Server-Side Infrastructure:** Backend APIs, database persistence, and server-side contact processing (both for this portfolio and for the separate backend repositories of featured full-stack projects).
- **Multi-Page Routing & Analytics:** Not part of the current repository.

---

## 8. Project Constraints & Explicit Assumptions

### Constraints (Observed in Repository)

- **Static Hosting Model:** Configured for static deployment (GitHub Pages) with no server runtime in this repository.
- **Third-Party Licensing:** Vendored MixItUp v3.3.1 uses a CC BY-NC 3.0 license restricting commercial use without a commercial license.
- **Accessibility & Motion Support:** Existing keyboard navigation and `prefers-reduced-motion` safeguards must be preserved. Meet applicable WCAG 2.1 Level AA success criteria, subject to verification and testing.
- **Identity & Content Accuracy:** All displayed projects, technical skills, and unhosted-backend notes must remain faithful to owner-provided information and repository records.
- **No Existing Automation:** Absence of automated build, lint, or test tooling means changes currently rely on manual/browser verification unless tooling is intentionally introduced later.

### Explicit Assumptions

- **Static Public Focus:** It is assumed the current phase delivers only the public static portfolio while the Portfolio Admin Dashboard remains deferred.
- **Audience Alignment:** Target visitor groups (recruiters, freelance clients, peers) are assumed based on the existing portfolio structure and contact flows.
