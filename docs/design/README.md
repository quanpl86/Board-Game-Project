# KingDragonHub UI Foundation — Board Game Universe
**Status:** Selected visual direction; implementation and high-fidelity screens pending
**Source:** 7 user-supplied KingDragonHub interface screenshots (10/10/2026)
**Owner:** Product / UI-UX
**Date:** 2026-10-10
**Decision:** Adopt KingDragonHub design language for the platform shell, identity and UI components. Do **not** assume every game must use an identical visual world.

## Canonical references
1. [Visual reference audit](REFERENCE_AUDIT.md) — what screenshots actually show, what remains unknown.
2. [Design language and principles](DESIGN_LANGUAGE.md) — brand hierarchy, player/admin/game contexts.
3. [Token catalog](tokens/kingdragonhub.tokens.json) — provisional tokens, not verified source CSS.
4. [Components and states](COMPONENTS.md) — nav, modal/search, cards, tags, filters, overlays and responsive.
5. [Color contrast and theme policy](CONTRAST_AND_THEME_POLICY.md) — accessible orange CTA variants.
6. [Screen inventory and UX](SCREEN_INVENTORY.md) — public, gameplay, teacher, social, events, coding, AI admin.
7. [Motion, accessibility & interaction](MOTION_ACCESSIBILITY.md).
8. [KingDragonHub production integration](KINGDRAGONHUB_INTEGRATION.md) — URL, SSO, design packages, host shell.
9. [AI Agent UI implementation contract](AGENT_UI_INSTRUCTIONS.md).

## Design decision
The platform shares orange accent, light spacious editorial layout, nearly black bold headings, outlined cards, line icons and interactive search patterns with KingDragonHub. Gameplay canvas (Gomoku, cards, Eco City 3D) may use richer graphics, while HUD, typography, navigation and overlays remain consistent.

## Not yet approved / not yet produced
Exact source CSS variables, font family, original logo/mascot files, full Figma/UI mockups, all mobile/tablet screen variants and implemented React components. Production integration with KingDragonHub is **planned**, not live.

**AI Agent:** Read this index and referenced files before styling the first screen. Do not generate a new unrelated blue/purple 'gaming' theme.
