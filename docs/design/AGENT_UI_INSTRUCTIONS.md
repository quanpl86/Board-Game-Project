# AI Coding Agent Contract — KingDragonHub-aligned UI
**Status:** Required instructions for UI contributions
**Applicable:** docs/design/*, apps/web, apps/admin, packages/design-system, packages/game-ui, packages/game-3d.

## Before making changes
1. Read `AGENTS.md`, `docs/design/README.md`, `REFERENCE_AUDIT.md`, `DESIGN_LANGUAGE.md`, `COMPONENTS.md`, `SCREEN_INVENTORY.md`, and token JSON.
2. Check current components and KingDragonHub host CSS when legitimately accessible; do not guess or claim exact source font without verification.
3. Name user role, screen ID, device breakpoints, states and permissions; identify game vs host shell context.

## Implementation rules
- Use shared token variables and design system components; avoid hardcoding arbitrary background/neon colors for common controls.
- All platform CTAs and section highlights follow KingDragonHub orange, outlined cards, dark typography and generous layout.
- Do not recreate logo/mascot from screenshots; use authorized official asset or neutral fallback.
- Use Lucide-style outlined icons and consistent icon sizes; avoid mismatched icon packs.
- Render game art in a separate visual layer; maintain branded HUD, search, dialogs, forms and menus.
- Prefer semantic HTML for overlays and cards; use R3F canvas for game world, not essential text controls.
- Responsive and keyboard/touch parity; meet WCAG 2.2 AA target and reduced-motion.
- Theme tokens from CMS must be schema validated, safe-listed and preserve base brand/accessibility.
- Explicit `loading, empty, error, unauthorized, offline, reconnecting` states.
- No private student profile/leaderboard visibility by default.

## Acceptance package per UI PR
- Screen ID(s), screenshots at 1440, 1024/768, 390 viewport widths; tests for states and keyboard focus.
- Link to reviewed design/mockup; token diff (if applicable).
- Cross-browser and target tablet checks.
- No brand drift; no unintended second global site header.
- No raw unreviewed inline script/CSS from CMS.
- Maintain design documentation and ADR if public design contract changes.

## Process
Agent creates feature branch and PR; human Brand/UX owner reviews token/visual changes; platform owner reviews authentication and host routing; game designer approves game-specific usability. Do not self-merge without authorized approval.
