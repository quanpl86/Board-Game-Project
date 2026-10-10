# Component Library — KingDragonHub UI Patterns
**Status:** Specification, not implemented · **Version:** 0.1

## Component ownership
Canonical components in `packages/design-system`, app-shell in `apps/web`, game HUD primitives in `packages/game-ui`, 3D overlays in `packages/game-3d`. Implement React + TypeScript + Tailwind (and shadcn/ui primitives when relevant); expose variants, not per-page duplicated CSS.

## Required primitives
| Component | Variants / visible traits | State and behavior |
|---|---|---|
| SiteHeader | light header, thin lower boundary, logo at left, nav center, search/theme/profile right | fixed/sticky per page; hamburger menu below tablet; hide or reduce in fullscreen game |
| MobileNav | drawer/bottom nav on user context | keyboard accessible, route active, respects user role |
| PrimaryButton | solid brand orange, white text, medium rounded corners, 40–48px height | focus ring, loading, disabled, hover/pressed, icon optional |
| SecondaryButton | light/transparent background, dark 1px outline, dark label | same focus and disabled conventions |
| LinkButton | text + right arrow, orange for highlighted link | discernible hover/underline and focus |
| SectionEyebrow | small pill, orange dot, light warm fill, thin orange line, uppercase tracking | avoid all-caps paragraph text |
| SectionHeading | near-black strong sans, orange keyword allowed | adaptive desktop/mobile sizes; semantic heading levels |
| OutlineCard | 1px dark/slate border, radius ~12–16px, generous padding | hover only if interactive; keyboard focus and active style |
| IconTile | 40–56px box with 1px dark border and monoline icon | clear alt/accessible name |
| GameCoverCard | optional image, genre chip, player count, level, start game CTA | loading/empty/locked/offline variants |
| ArticleCard | image or line-icon header, title, summary, bottom divider/CTA | align content and footer across grid |
| FilterBar | search + pill/sort/select facets in outlined container | query persists in URL when shareable; reset |
| Badge/Chip | outlined topic/genre/role status | color not sole status signal |
| SearchDialog | blurred/dim backdrop, centered white panel, orange-focused input, suggestion chips | Esc, close button, focus trap/restore, correct aria labels |
| Modal/Drawer | white/light surface, dark outline; mobile bottom sheet when useful | handle scroll lock, focus, undo on cancel |
| Tabs/Segmented | neutral base, orange active, clear hit targets | arrow-key support |
| DataTable | line separators, visible sorting/filter, compact but accessible | overflow and responsive card alternative |
| Toast/Alert | semantic state icon and text; color accent | timeouts appropriate, errors never vanish too fast |
| Form fields | thin neutral border, orange focus; labels above or adjacent | error/help messages, explicit required |
| Avatar/UserMenu | circle avatar/initials, constrained account role display | privacy and context switch |
| ThemeToggle | small outlined/pill control, sun/moon icon | user preference persisted only with consent/settings |
| ChatPanel | dockable drawer for game; teacher-controlled moderation | permissions, unread, safety/report, quick chat |
| ResourceHUD | icon + numeric value + label, compact and readable | low state, animated transition optional; non-color cues |
| Vote/Proposal | choice cards within game, quorum and time | only authorized votes; disabled double submission |
| Loading/Skeleton | shimmer optional; static fallback reduced motion | never shift board unexpectedly |

## Layout grammar (measured from images, approximate)
- Navbar around 58px on desktop; wide centered max-width around 1200px; use fluid inline margins: clamp(16px, 3vw, 32px).
- Hero uses 2 columns (copy + mascot/visual) on wide screens; stacks on smaller screens.
- Long editorial sections separated by ~64–100px whitespace; do not transpose that to a dense active game view.
- Content grid desktop 3 cols, tablet 2, phone 1; goals/tools grid may be 4 at wide widths.
- Cards rely on thin outline, minimal drop shadow. CTAs on game or event cards use same orange/outline language.

## Accessibility contract
Visible 2px focus ring; controls min 44x44 CSS px for touch targets where feasible; explicit aria labels; semantic navigation and headings; keyboard and screenreader routes, reduced motion. Contrast target WCAG 2.2 AA is validated with tooling, not inferred from screenshot appearance.

## Responsive behaviors
- Phone (<640): stacked headings, 1-column cards, SearchDialog as near-full viewport or bottom sheet, compact site navigation.
- Tablet (640–1023): 2-column cards, persistent user context, 3D action drawer rather than always visible side panel.
- Desktop (>=1024): max-width centered editorial layout; teacher/admin can use sidebar+content.
- Live 3D game: prioritize canvas area, side HUD collapsible; landscape tablet test mandatory.

## Shared state semantics
`default, hover, active, selected, focus-visible, loading, disabled, success, warning, danger, locked, scheduled, published, expired`. Each component declares allowable states. Do not rely on opacity alone for disabled.
