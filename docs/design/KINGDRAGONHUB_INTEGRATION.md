# Production Integration with KingDragonHub
**Status:** Proposed architecture for future deployment, not an implemented website integration.
**Host:** https://kingdragonhub.com
**Principle:** Board Game Universe is a product/module inside KingDragonHub ecosystem while preserving separate game runtime and isolated coding judge.

## Preferred user-facing URL model
Prefer a host path namespace such as `https://kingdragonhub.com/board-games` and its descendants. Validate that current routing/CMS has no conflicting slugs. A subdomain e.g. `games.kingdragonhub.com` remains fallback if host routing or deployment management blocks clean integration.

## UI host shell options
1. **Host shell integration (preferred):** KingDragonHub retains global header/footer/auth entry points; the Board Game app renders main content with shared tokens and component contract. In-game fullscreen route may minimize header but keep brand identification and accessible exit.
2. **Standalone deploy behind path proxy:** Next.js as separate deployment, requests proxied/re-written by host/CDN. Match asset `basePath`, Next.js asset prefixes, routing and caching; avoid two headers; preserve auth boundaries.
3. **Subdomain:** cross-subdomain SSO via OIDC/OAuth using first-party identity provider; avoid hardcoded/shared unprotected cookies and duplicating users.

## Authentication & profiles
- Single logical identity across articles/learning/tools/games via reviewed OIDC/token exchange, not copied passwords or direct DB connections.
- Web/backend must authorize tenant membership and permission for each action. Do not trust role inferred from UI and don't automatically expose school data in public profile.
- Session lifecycle, logout propagation, MFA admin and kid-safe/guardian controls require joint testing with site.

## Design source of truth
Before production launch, audit existing KingDragonHub CSS tokens, font files/source declarations, navbar components, theme switch semantics and mascot/logo license. Prefer extracting shared public token package or CSS custom properties maintained with ownership; do not copy unknown JS as a one-off.
- Platform tokens should stay fixed across CMS campaigns except reviewed semantic variants.
- Game-specific asset skins can override board surfaces without changing host navigation or global accessibility rules.
- Avoid injecting CSS from untrusted CMS/theme content.

## LiveOps/CMS contract
Keep campaign, feature flag and content publication separate. The host may own homepage placements, and Game CMS own in-game content. Define content slot ownership and publish conflicts, audience/tenant targeting, locale/time zone, scheduled rollback and approval.

## Infrastructure
Game render stays in browser; websocket game service separate; 3D GLB via versioned CDN; code judge isolated. Path routing should proxy websocket upgrade separately as needed. Search/canonical URLs, analytics privacy, CORS/CSP and performance must be reviewed per origin.

## Integration checks
1. Direct URL and refresh under `/board-games/*` succeed.
2. No duplicate navbar or conflicting typography/style cascade.
3. Sign-in from host uses existing user and returns safely to desired game.
4. Role/tenant isolation and logout work across host/game clients.
5. CDN GLB and WebSocket work with CSP and correct protocols.
6. SEO/canonical metadata and accessibility for editorial landing pages.
7. Campaign preview matches site theme, and an expired event correctly falls back.
8. Downtime of games does not break knowledge hub; host can show safe error.
9. App-specific deployment rollback independent of host frontend where possible.
10. Performance target and mobile tablet test pass.

## Migration/deployment gate
Do not finalize integration architecture until KingDragonHub repo tech stack, auth provider and deployment topology have been inspected. This document is the target contract, not a claim that host currently exposes these integrations.
