---
trigger: always_on
description: "Core project scope, static architecture, Quiet 3D design constraints, and permanent development rules for Abdulkarim Aklouk's portfolio."
---

# Project Core Rules

## 1. Project Scope & Content Integrity

- This repository hosts the public personal portfolio website for **Abdulkarim Aklouk** (`index.html`), deployed statically on GitHub Pages (`/my-portfolio/`).
- Preserve the eight main sections in order: Home (`#home`), About (`#about`), Skills (`#skills`), Services (`#services`), Projects (`#work`), Experience & Education (`#experience`), Engineering Focus, and Contact (`#contact`), along with the header and footer.
- Preserve existing functionality, owner information, project records, live demo/source links, CV download (`assets/pdf/cv.pdf`), contact workflows, and unhosted-backend disclosures.
- Out of scope: Admin Dashboard, CMS, authentication, backend APIs, database persistence, hosting backends for featured projects, multi-page routing, and analytics tracking.
- Refer to `docs/PROJECT_OVERVIEW.md` and `docs/REQUIREMENTS.md` (along with upcoming specs in `docs/design/`, `docs/architecture/`, and `docs/planning/`) as project sources of truth.

## 2. Technology & Architecture Constraints

- Use the existing zero-build static stack: Vanilla HTML5 (`index.html`), CSS3 (`assets/css/styles.css`), and ES6+ JavaScript (`assets/js/main.js`).
- Keep production deployment 100% compatible with static hosting on GitHub Pages.
- Prefer native browser capabilities over external dependencies.
- Do not introduce frameworks, bundlers, build systems, package managers, or heavy 3D engines (e.g., WebGL/Three.js) without explicit approval.
- Implement visual depth and 3D effects strictly with lightweight CSS, DOM, and SVG (plus minimal vanilla JS where needed).

## 3. Code Changes & Repository Hygiene

- Inspect relevant files and understand existing behavior before modifying anything.
- Make focused changes strictly within the requested scope; avoid arbitrary redesigns or unrelated refactoring.
- Preserve existing functionality and uncommitted/in-progress work; never discard existing changes.
- Do not delete files, install dependencies, or alter project configuration without a clear need and approval.
- Do not commit or push changes unless explicitly instructed.

## 4. Visual Direction: Quiet 3D & Anti-AI Guardrails

- Follow the approved **Quiet 3D** direction: calm, elegant, balanced, and professional composition with noticeable yet restrained and purposeful spatial depth.
- Avoid generic AI-generated design patterns, excessive gradients, neon/glow effects, heavy glassmorphism, or decorative clutter.
- Maintain consistency across all sections, dark and light themes, and all viewport sizes.
- Prioritize typography, readability, usability, and clear visual hierarchy over visual effects.

## 5. Accessibility & Performance

- Use semantic HTML, sequential heading levels, and accessible interactive controls.
- Preserve keyboard navigation, visible focus states, modal focus trapping/restoration, and background landmark isolation.
- Respect `prefers-reduced-motion` (disabling non-essential and decorative 3D motion) and gate pointer parallax to fine-pointer devices.
- Maintain responsive behavior across mobile, tablet, and desktop with zero horizontal overflow.
- Avoid unnecessary animations, layout shifts, render-blocking assets, and expensive rendering effects.
- Follow applicable WCAG 2.1 Level AA criteria across both themes.

## 6. Development Workflow & Verification

- Understand the task and its scope before implementation; implement only what is requested.
- Verify affected functionality, relevant viewport sizes, dark and light themes, and browser console errors after visual or behavioral changes.
- Update documentation when approved requirements, architecture, or design decisions change.
- Never claim something was tested or verified unless it was actually run and observed.

## 7. Communication

- Be concise and technically precise.
- Explain important implementation decisions.
- Ask questions only when ambiguity prevents safe implementation.
- Clearly report completed work, verification results, and remaining issues.
