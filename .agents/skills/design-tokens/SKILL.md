---
name: design-tokens
description: Enforce KingDragonHub-aligned color, typography, font, sizing, spacing, surfaces, radii, contrast, motion and seasonal theme tokens consistently across the platform.
version: 1.0.0
owner_role: BGU-UX
---

# Skill: design-tokens
**Purpose:** Enforce KingDragonHub-aligned color, typography, font, sizing, spacing, surfaces, radii, contrast, motion and seasonal theme tokens consistently across the platform.

## Activate for
design system, style, font, color, width, height, spacing, radius, tablet, theming

## Read before acting
- `docs/design/tokens/kingdragonhub.tokens.json`
- `docs/design/DESIGN_LANGUAGE.md`
- `docs/design/CONTRAST_AND_THEME_POLICY.md`
- `docs/design/REFERENCE_AUDIT.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Audit official KingDragonHub CSS/font/logo source when authorized; if unavailable, keep proposed token version 0.1.0 labeled PROVISIONAL. Do not claim pixel-perfect.
2. Read token JSON; expose semantic `--color-bg`, `--color-surface`, `--color-text`, `--color-brand`, `--color-action`, `--border-default`, `--radius-card`, `--space-*` variables rather than copied arbitrary hex.
3. Palette: brand orange #FF5722 for highlights; actionFill #C63D14 with white label, or #111827 ink on brand; near-white #FFFFFF surfaces; base bg provisional #F7F9FC; text #111827; border #253047 and subtle border #DEE4EA; all under reviewed contrast tests.
4. Typography (PROPOSAL until host CSS audit): UI font Inter/system-ui; normal 400, medium 500, semibold 600, bold 700, display 800. Size scale desktop: label 12–14, body 16, body large 18, h4 20, h3 24, h2 30–36, h1 40–64 px responsive with clamp; line-height body 1.5–1.65, heading 1.05–1.2. Avoid 12px instructional paragraphs for pupils.
5. Spacing grid: 4,8,12,16,24,32,48,64px; section gap ~64–100px in editorial pages only. Hero/grid max-width provisional 1200px; mobile horizontal padding 16px, desktop 24–32px. Border radius 8 / 12 / card 14 / modal 16 / pill 999px; outlined 1px cards.
6. Responsive targets: 390 phone, 768 tablet portrait, 1024 landscape, 1440 desktop; client breakpoints provisional 640/1024/1280. Dynamic typography and touch hit targets at least ~44px; avoid clipped Vietnamese glyphs.
7. Motion: 120/200/350ms tokens, never rely on animation for functional feedback; honor reduced motion, disable VFX for weak devices; avoid layout shift in live 3D.
8. Test contrast AA (normal text >=4.5:1, large text >=3:1), focus >= distinguishable, light/dark and seasonal override conflicts; UI states screenshots, approval for global token changes.

## Non-negotiable rules
- Do not replace KingDragonHub with unrelated neon blue/purple gamer branding.
- Never use #FF5722 with small white text (contrast ~3.16:1); use accessible action variant.
- Do not ship font files from private host. Inspect licensing before embedding a font.
- Campaign may customize background art, not global safety/contrast tokens.
- Exact sizes, typeface and neutral palette remain provisional until source CSS verified.

## Required output artifacts
- Token diff with version
- Type/spacing/sizing spec
- Contrast matrix
- Responsive examples and design review

## Validation / Definition of Done
- [ ] No raw one-off color/size for shared components
- [ ] Every label readable at target zoom and devices
- [ ] Global brand change approved by UX/Brand

## Handoff
Use `docs/agents/templates/HANDOFF.md` with changed files, test evidence, preview URLs and independent reviewer; no unapproved production write.
