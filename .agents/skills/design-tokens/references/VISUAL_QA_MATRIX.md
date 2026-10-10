# KingDragonHub Visual Spec & Audit Matrix
**Provisional specs inferred from 7 owner-supplied references. Confirm source CSS/font before final release.**

## Core palette
| Token | Hex | Use |
|---|---|---|
| `brand.primary` | `#FF5722` | accent, large highlighted word, indicator, thematic background |
| `brand.actionFill` | `#C63D14` | button with WHITE 14–18px label; contrast about 5.15:1 |
| `brand.primaryOnBrand` | `#111827` | dark ink atop `#FF5722`; contrast about 5.61:1 |
| `light.bg` | `#F7F9FC` | outer app background (provisional) |
| `light.surface` | `#FFFFFF` | cards/dialogs |
| `light.text` | `#111827` | primary text |
| `light.textMuted` | `#606B7D` | secondary text |
| `light.border` | `#253047` | outlined cards |
| `light.borderSubtle` | `#DEE4EA` | separators |

Do not use small white text on #FF5722; estimated contrast 3.16:1. Check against WCAG 2.2 AA normal text 4.5:1 and large text 3:1. Seasonal themes cannot overwrite accessible text/alert tokens silently.

## Typography — review baseline
- Exact KingDragonHub font: **UNVERIFIED**; proposal: Inter/system-ui (no font binary redistribution).
- H1 hero: clamp(2.5rem, 4.4vw, 4rem), weight 800, line height 1.07, negative tracking modest; mobile typically 36–42px.
- H2 section: clamp(1.875rem, 3vw, 2.25rem), weight 700–800, line height 1.15.
- H3/card title: 20–24px, semibold/bold. Body default 16px, line-height >=1.5. Section eyebrow 12–14px uppercased, but don't uppercase Vietnamese long paragraphs.
- Form label 14–16px, button 14–16px weight 600/700; min tap target 44px. Caption >=13–14px ideally, avoid tiny instructional text.

## Layout
- Content container ~1200px max (provisional); side padding 16/24/32 for mobile/tablet/desktop.
- Spacing 4px scale 4/8/12/16/24/32/48/64; editorial section gaps 64–100px, active game HUD compact.
- Card radius ~14px, 1px dark border; large modal radius ~16px; icon tile 40–56px with stroke ~2px; prefer border, not deep drop shadows.
- Breakpoint tests 390 / 768 / 1024 / 1440; dark/theme if supported; test 200% zoom and reduced motion.

## Screens required for initial design approval
Game Hub, Library, Game Detail, Lobby, Gomoku 2D board, Eco City Lab 3D, Teacher Dashboard, AI Ops/Admin. After phase two: Event/Leaderboard/Hall of Fame, Shop, Avatar Wardrobe, Coding Arena.

## Visual score (0–3 each)
1. Correct semantic style/brand; 2. typography/hierarchy; 3. spacing and grid; 4. icons consistency; 5. responsive/device; 6. accessible contrast and focus; 7. copy clarity; 8. real UI state; 9. host shell integration; 10. in-game vs site separation.
S0 failures on accessible controls/child privacy block acceptance regardless of score. Screenshots are evidence only if from real render or explicitly labeled concept.
