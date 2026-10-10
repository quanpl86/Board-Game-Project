---
name: iconography
description: Maintain coherent Lucide-style outlined UI icons, sizing, stroke, placement, accessibility, SVG sprite naming and license; distinguish UI symbols from game art.
version: 1.0.0
owner_role: BGU-UI
---

# Skill: iconography
**Purpose:** Maintain coherent Lucide-style outlined UI icons, sizing, stroke, placement, accessibility, SVG sprite naming and license; distinguish UI symbols from game art.

## Activate for
icons, Lucide, iconography, SVG, pictograms, icon assets, navigation, buttons

## Read before acting
- `docs/design/COMPONENTS.md`
- `docs/design/DESIGN_LANGUAGE.md`
- `docs/design/tokens/kingdragonhub.tokens.json`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Determine semantics (action, status, navigation, game mechanic, reward, decoration); search approved Lucide icon set before drawing variants.
2. Use one icon source/version in the UI package and import by stable name; baseline Lucide-style outline, 20px default inside buttons, 24px feature icon, 32px feature card optional, stroke 1.75–2px consistent; large heading glyph inside 40–56px outlined tile.
3. Set icon+label for critical actions; icon-only buttons need programmatic accessible label and tooltip where helpful. Never rely solely on color/icon to convey financial or student status.
4. Map action names consistently: play, join, users, trophy, gift, messages, shopping-bag, shirt, bot, paw-print, bell, calendar, wallet, shield, download; reuse icons across routes.
5. Use same currentColor + semantic fill/stroke tokens, not raw #FF5722 in every SVG. Status icons may use semantic color and label, with approved contrast.
6. Check SVG viewBox, alignment baseline, hit target 44px, asset-safe rendering, RTL/localization where applicable and reduced-motion animation.
7. Create a small semantic icon registry with expected name, context, aria usage, size/stroke and visual snapshots.

## Non-negotiable rules
- Do not mix 3D voxel emojis and monoline UI icons as if same library.
- Do not copy branded/restricted icon from other sites without permission.
- Don't introduce a custom SVG for a symbol already covered unless product approves.
- Decorative icons aria-hidden; meaning-bearing icons labeled.

## Required output artifacts
- Semantic icon usage map
- Icon component/registry
- Responsive icon snapshots
- License/source provenance

## Validation / Definition of Done
- [ ] Stroke and sizes consistent
- [ ] All icon-only controls accessible
- [ ] No mismatched icon language

## Handoff
Use `docs/agents/templates/HANDOFF.md` with changed files, test evidence, preview URLs and independent reviewer; no unapproved production write.
