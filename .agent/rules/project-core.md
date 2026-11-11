---
trigger: always_on
description: "Core project scope, technical constraints, and development standards."
---

# Project Core Rules

## 1. Project Scope

- This project is a public personal portfolio website.
- Preserve its eight main sections.
- The Admin Dashboard, backend, database, and authentication are outside the current scope.
- Refer to `docs/PROJECT_OVERVIEW.md` and `docs/REQUIREMENTS.md` as the project sources of truth.

## 2. Technology

- Preserve the existing HTML, CSS, and Vanilla JavaScript approach.
- Keep production deployment compatible with static hosting.
- Prefer native browser capabilities over unnecessary dependencies.
- Do not introduce frameworks, build systems, or heavy 3D engines without approval.
- Prefer lightweight CSS, DOM, and SVG for visual depth and 3D effects.

## 3. Code Changes

- Inspect relevant files before modifying them.
- Understand existing functionality before replacing it.
- Make focused changes and avoid unrelated refactoring.
- Preserve existing behavior unless the task explicitly requires changing it.
- Do not delete files, install dependencies, or change project configuration without a clear need and approval.
- Do not commit or push changes unless explicitly requested.

## 4. Design & User Experience

- Maintain a calm, premium, balanced, and professional visual identity.
- Make 3D depth noticeable but restrained and purposeful.
- Avoid generic AI-generated design patterns and excessive gradients, glow, glass effects, or decorative elements.
- Maintain consistency across all sections, themes, and screen sizes.
- Prioritize readability, usability, and clear visual hierarchy.

## 5. Accessibility & Performance

- Use semantic HTML and accessible interactive controls.
- Preserve keyboard navigation and visible focus states.
- Respect `prefers-reduced-motion`.
- Maintain responsive behavior across mobile, tablet, and desktop.
- Avoid unnecessary animations, layout shifts, and expensive rendering effects.
- Follow applicable WCAG 2.1 Level AA criteria.

## 6. Development Workflow

- Understand the task and its scope before implementation.
- Implement only what the task requires.
- Verify affected functionality after changes.
- Check relevant viewport sizes and both themes when visual behavior changes.
- Check browser console errors where applicable.
- Update documentation when approved requirements or project decisions change.
- Never claim that something was tested unless it was actually tested.

## 7. Communication

- Be concise and technically precise.
- Explain important implementation decisions.
- Ask questions only when ambiguity prevents safe implementation.
- Clearly report completed work, verification results, and remaining issues.
