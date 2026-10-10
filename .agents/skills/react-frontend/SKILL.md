---
name: react-frontend
description: Build accessible Next.js React screens and reusable KingDragonHub components with typed contracts, responsive states, visual tests and game HUD separation.
version: 1.0.0
owner_role: BGU-UI
---

# Skill: react-frontend
**Purpose:** Build accessible Next.js React screens and reusable KingDragonHub components with typed contracts, responsive states, visual tests and game HUD separation.

## Activate for
Next.js, React, Tailwind, frontend, components, game screens, site header, responsive UI

## Read before acting
- `docs/design/COMPONENTS.md`
- `docs/design/AGENT_UI_INSTRUCTIONS.md`
- `docs/design/MASTER_SCREEN_INVENTORY_V2.md`
- `docs/design/tokens/kingdragonhub.tokens.json`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Find target screen ID and actor/permission; inspect existing component library before adding a new one.
2. Implement from `packages/design-system` and typed API contracts; use server/client boundaries intentionally, avoid exposing secrets in Next.js client bundles.
3. Use KingDragonHub shell: light surface, dark ink, thin dark outlined cards, orange accent; don't duplicate header if host renders it.
4. Core component states: default, hover, focus-visible, active/selected, loading, empty, disabled, forbidden, offline, error, success. Use semantic HTML for primary text/actions, not WebGL meshes.
5. Ensure responsive 1440/1024/768/390; use phone 1-col cards, tablet 2, desktop 3 (subject to actual layout); game HUD compresses/reflows rather than shrinking board text.
6. Support forms/search dialog accessible focus trap, keyboard dismiss, error labels, aria live for move result; touch targets >=44px where feasible.
7. Generate Storybook/component showcase or equivalent render tests; Playwright E2E and screenshot comparisons including reduced motion and mobile landscape.
8. Document route, API, screenshots and design token version; PR with QA and UX review.

## Non-negotiable rules
- No new arbitrary font/color per page.
- Do not embed PII or tokens in preview screenshots.
- Game states authoritative from backend; browser may optimistically animate but must reconcile.
- No claim page is built merely because design spec exists.

## Required output artifacts
- React components/route with tests
- Responsive screenshot set
- Storybook/demo state variants
- PR referencing screen ID and design approval

## Validation / Definition of Done
- [ ] CI builds and tests pass
- [ ] No duplicate site nav in KingDragonHub integration
- [ ] Keyboard/contrast checked manually plus automation

## Handoff
Use `docs/agents/templates/HANDOFF.md` with changed files, test evidence, preview URLs and independent reviewer; no unapproved production write.
