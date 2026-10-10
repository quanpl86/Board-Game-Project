# UX Interactions, Motion & Accessibility
**Status:** Requirement baseline, not tested UI

## Navigation and discoverability
- Reuse KingDragonHub's top navigation language, site search overlay and compact user controls; avoid building a parallel unrelated header when the game is embedded under host route.
- Search modal uses dialog semantics with focus trap, close button, Escape, suggestions and keyboard navigation.
- Active route uses text/indicator in addition to orange; mobile nav reveals game categories safely.

## Gameplay interaction
- 2D turn board: obvious legal/illegal move affordances, non-color highlights and optional undo where rules allow; touch and keyboard interaction.
- 3D isometric: orthographic view, tap-to-select tile, ghost preview, confirm/cancel (avoid accidental click-to-spend), rotate, pan, zoom/reset. Persist game state independent of camera preferences.
- Game overlay HUD uses shared design tokens; chat/proposals appear as drawers that do not obscure the whole board on desktop.
- No unnecessary camera spin or particle effect from normal state changes. Accessibility option for no animation and clear labeled text indicators of power/water/pollution.

## Feedback & modal
- Status feedback should be linked to action (e.g. 'Không đủ ngân sách: cần 120, còn 95') rather than vague score glow.
- Success may use short 200–350ms animation; never gate essential decision on animation.
- Error and permission denials offer reason/action; data protection errors should never expose personal info.
- Empty/locked/loading/offline/reconnecting are design states; show explicit progress and safe fallback.
- Confirm destructive actions, give details for irreversible operations.

## Safety & accessibility
- WCAG 2.2 AA target; semantic HTML, meaningful landmarks/labels, tested heading order, alt descriptions, suitable text sizing, keyboard focus, high contrast, 200% text zoom.
- Minimum pointer target around 44x44 where practical; icon-only buttons accessible labels and visible focus; ensure accessibility of swipe-only actions via buttons.
- Avoid color-only indicators and rank comparisons that expose academic performance of children.
- Respect prefers-reduced-motion; no autoplay sound; game VFX intensity settings low/medium/high/off.
- Moderated chat default, no unrestricted stranger DMs for minors.
- Prevent campaign theme overrides from degrading text contrast and accessibility.

## Design QA before code shipping
Test desktop (1440 width), tablet landscape & portrait (~1024/768), small mobile (~390), dark-mode if supported, 200% zoom, no-motion mode, no-WebGL fallback for 3D. Run accessibility automation and manual screenreader/keyboard testing. High-fidelity artifacts must represent at least default, loading, error, empty and permission-denied states for key flows.
