# ADR-0002 — Align Board Game Universe UI with KingDragonHub
**Status:** Adopted design direction; visual system implementation pending
**Date:** 2026-10-10
**Decision makers:** Product owner (via user-provided screenshot references)

## Context
Board Game Universe is planned for production integration into KingDragonHub. A separate unrelated gaming brand would fragment identity and complicate shared navigation, auth and content campaigns. Seven KingDragonHub page screenshots provide visual evidence.

## Decision
Use KingDragonHub's light editorial UI design language as the global product shell: orange accents, dark typography, neutral surfaces, thin outlined rounded cards, monoline icons, airy layout, search overlay and clear CTAs. In-game boards and 3D scenes may have distinct gameplay art, but menus/HUD/modals follow common design tokens. UI/UX design docs and tokens live under `docs/design/`.

## Constraints
Screenshot-based tokens other than the visible `#FF5722` are *provisional*. Confirm exact CSS values and font from authorized host source later. Maintain WCAG 2.2 AA; for example white small text on `#FF5722` contrast is only about 3.16:1, so accessible CTA variants must use deeper orange or dark ink.

## Integration policy
Prefer `kingdragonhub.com/board-games` after validating host router and shared identity; route/subdomain choice requires separate integration verification. MCP-driven content/seasonal themes may vary game artwork, but cannot bypass accessibility or brand safety rules.

## Consequences
Shared design-system package, referenced UI specs, mandatory 8 screen high-fidelity approval before broad frontend rollout, source audit task, and UX sign-off on future PRs. No claim that screens, React components or host integration have been implemented yet.
