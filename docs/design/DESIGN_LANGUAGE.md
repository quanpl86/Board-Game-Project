# Board Game Universe — KingDragonHub Design Language
**Status:** Direction selected, token values provisional · **Version:** 0.1.0
**Design intent:** Board Game Universe should feel like a part of KingDragonHub's ecosystem, including after production URL and identity integration.

## Brand expression
- **Core visual language:** light, clean, editorial, spacious; orange call-to-action; bold ink headings; dark outlined functional cards; small uppercase section identifiers and orange pill labels.
- **Visual hierarchy:** quiet top navigation → eyebrow/caps category → strong dark headline with occasional orange highlight → short description → primary orange CTA + outlined secondary CTA → grouped card/category content.
- **Iconography:** simple consistent-stroke icons (Lucide style), inside 40–56 px outlined rounded containers when presenting categories/tools. Do not mix filled neon skeuomorphic game icon sets in the platform shell.
- **Illustration and mascots:** large mascot/3D visuals may decorate hero and events, ideally using official brand character assets. No mascot required for every card or modal.
- **Surfaces:** muted pale grey/off-white; transparent or white cards with 1px dark/navy outline; warm orange tints sparingly. Elevation via spacing and borders before shadows.
- **UI copy:** Vietnamese-first, compact and task-led, friendly without childish phrasing on teacher/admin pages.

## Four coordinated contexts
### Public / Game Hub
KingDragonHub-style full site shell, broad centered container, airy grid sections, prominent game cover/genre cards, topical collection and seasonal content. Reuse header and footer if embedded in host site.

### Game table (2D / card / 3D)
Preserve title bar, typography, card and modal styles. Game world takes center stage, may darken or use colorful isometric 3D to improve visibility. Do **not** force site-style large editorial whitespace inside live gameplay viewport. Keep action HUD lean, in-game chat/dice/inventory docked, and multiplayer status prominent.

### Education and admin
Same tokens and components but denser layouts, stable left sidebar/table layouts, clear labels and sticky toolbar; use orange primarily for action/active state. Academic data should not be conveyed by color alone.

### Seasonal campaigns and game-specific skins
Theme engine may override noncritical accent artwork, hero backgrounds, decorations, game board and special cards while maintaining global navigation brand, text contrast, safe focus styles and accessible controls. No editor/Agent injection of raw JS or unreviewed CSS.

## Anti-patterns
- Do not switch entire platform to generic purple/blue neon gaming UI.
- Do not clone every editorial layout into dense teacher dashboards or 3D play screens.
- Do not put orange on every panel; preserve a neutral hierarchy.
- Do not use large shadows plus heavy borders simultaneously by default.
- Do not use a student's individual academic ranking publicly.
- Do not use tiny microtext on tablet or low contrast orange body text.
- Do not claim exact font matching without source CSS confirmation.

## Final acceptance ownership
Product/Brand approves global palette/typography; UX Lead approves responsive component behavior; Game Design approves game-specific variants; Security/Academic lead approves kid-safe affordances and permissions; Content/AI agents may propose only, not finalize.
