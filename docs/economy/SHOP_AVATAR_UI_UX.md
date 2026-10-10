# UX Specification — Shop, Closet, Avatar, Rankings and Hall of Fame
**Status:** Screen inventory + interactions, no high-fidelity mockups yet.
**Visual language:** KingDragonHub (light near-white surfaces, thin dark outline, orange #FF5722 accents, bold dark headings, Lucide outlined icons, generous spacing). See open UI PR #2; until merged, use this document as additional UI spec.

## Screens and routes (proposals, validate host routing)
| ID | Route example | Functions / main areas |
|---|---|---|
| ECON-01 | `/board-games/shop` | hero seasonal offer, category chips, filters, catalog cards, balance, cart optional |
| ECON-02 | `/board-games/shop/[itemSlug]` | 2D/3D preview, slot/rig compatibility, price, origin, limited stock, trade rights |
| ECON-03 | `/board-games/marketplace` | verified listings, fixed-price sorting, age/policy gate, anti-scam guidance |
| ECON-04 | `/board-games/marketplace/my-listings` | user listings, reserve/sell/expire, history/disputes |
| AVTR-01 | `/board-games/avatar` | avatar editor, 3D canvas + slot sidebar + equipped layers + presets |
| AVTR-02 | `/board-games/inventory` | owned items, rarity/source filters, wear/remove, tradability, timeline |
| AVTR-03 | `/board-games/pets` | pet manager, follow/emote preview |
| RANK-01 | `/board-games/rankings` | multi-board filters, podium, ranking table, update time |
| HONR-01 | `/board-games/hall-of-fame` | seasonal honors, trophy cards, verified winners and achievements |
| HONR-02 | `/board-games/achievements` | badges, progress/requirements, earned vs locked |
| ADMIN-ECON | `/board-games/admin/economy` | item catalog, offers, stock, ledger reports, flagged trades, approvals |
| ADMIN-HONOR | `/board-games/admin/honors` | nomination, verification, curated display, take-down |

## Shop card example
Small outlined orange category pill → picture of 2D/3D item → name/edition → 2D preview and 'Xem 3D' → slot/compatibility → visible fixed earned-credit price → orange CTA with accessible text contrast → trade status, wishlist/preview. The user sees charges and item effects before confirming. Never hide rarity rules or imply guaranteed economic resale value.

## Avatar Editor composition
- Desktop: left panel slots/categories and inventory, center R3F avatar on neutral background, right current layers / presets / pet/emotes; visible save action.
- Tablet: center avatar plus collapsible slot drawer; touch-safe controls.
- Mobile: portrait preview on top, horizontally scrollable category tabs, bottom drawer inventory; avoid 3D gestures interfering with page scroll.
- 3D controls: rotate/pan/zoom, idle/walk/victory animation toggle, show/hide underlayer/face, save/restore preset and compare previous outfit.
- If incompatible hair + hat or full costume conflicts, preview changes and clear warning before equip; user may undo.
- 2D fallback thumbnail for no-WebGL and avatars in listings/chat.
- No mandatory gender selection for cosmetics; provide compatible body presets and fit behavior.

## Hall of Fame visuals
Separate from the leaderboard: editorial grid of award cards with subject-approved pseudonym/team, tournament badge/trophy, date, verified evidence/replay and season; safe sharing under privacy policy. Do not render private child academic results on public profile or hero banner.

## Profile & lobby
Player public card may display avatar 2D crop with dynamic frame/background, selected trophy and pet thumbnail. Lobby uses animated 3D only if device budget allows. Equipped cosmetics never change hitbox or competitive reach.

## Purchase UX
`item detail → explicit price & restrictions → confirm → processing → success receipt → inventory`. Double click must not purchase twice. Insufficient currency shows needed vs current. Policy restrictions show clear reason, no dark patterns.
Marketplace after release adds `verify adult eligibility → list item → fixed price → disclosure/confirm → escrow → completed/cancelled → receipt`.

## Dynamic content
CMS can promote seasonal collections, countdown, festive showcase and themed honors; offer inventory/price version pinned. Event service triggers seasonal prizes. Campaign may override hero visuals but does not override child protection or payment restrictions.

## Accessibility
WCAG 2.2 AA goal; 44px targets, keyboard navigable dialogs/cards, aria live confirmation, no color-only rarity indicator. White small text on brand orange #FF5722 does not meet AA; use deeper accessible orange (#C63D14) for white-text buttons or dark ink on bright orange. Reduce motion, mute VFX, no pressured countdown purchases aimed at minors.

## Required visual deliverables
At least desktop 1440, tablet 1024/768 and mobile 390 for Shop Home, Item Detail, Inventory/Closet, Avatar Editor, Leaderboard, Hall of Fame, Marketplace (future). Include loading/empty/error/permission/purchase confirmation/sold out/trade blocked/responsive panels. Visuals are not yet generated.
