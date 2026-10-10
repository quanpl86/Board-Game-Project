# KingDragonHub Host Authentication / Routing Evidence Gate — Issue BGU-003
**Status:** BLOCKED ON SOURCE ACCESS; proposal only. **Do not infer SSO implementation from public screenshots, ChatGPT plugin drafts, website content or an unrelated repo.**

## Verified and not verified
- Verified: Board Game Universe source and 30-table P0 identity mapping draft in `quanpl86/Board-Game-Project`; future KingDragonHub visual alignment required.
- No authorized KingDragonHub **host source repository** or server authentication implementation has been identified through the available GitHub connection. Potential guessed `quanpl86/kingdragonhub` names are not accessible; that is not evidence the repository does not exist.
- No verified OIDC issuer, OAuth client, session cookies, JWT claims, identity user IDs, refresh/logout mechanics, role claims or guardian policy.
- Exact host CSS and font assets also remain unverified, other than seven reference screenshots (orange `#FF5722`).

## Investigation request to Product Owner / authorized host maintainer
Provide approved read-only access to the actual KingDragonHub source repository or project files and hosting/auth configuration **without sharing secrets or live user data**.
Inspect `package.json`/framework and server-side auth route, issuer/provider config (redacted), database user mapping (schema-only), login callback/logout/recovery, organization/teacher/student policy, existing deployment rewrite/proxy and web hosting topology. Obtain official brand CSS tokens and font license when possible.

## Database identity integration contract to settle
| Question | Invariant / requested evidence |
|---|---|
| Host identity canonical key | Unique stable `provider_subject`, never email as PK |
| Provider protocol | OIDC/OAuth with verified issuer, audience, state/nonce, refresh/logout |
| Platform UUID | `identity.users.id` belongs to Board Game; mapping `external_identities(provider,provider_subject)` |
| Account linking/merge | Authenticated proof and collision handling, no forced duplicate child account |
| Tenant context | `tenancy.organization_memberships`, roles; server verifies active membership each command |
| Guardian/minors | Reviewed age band, consent and guardian verification; private-by-default |
| Session lifecycle | Expiration, CSRF, server-side session/cookie policy, device sign-out, cross-domain behavior |
| API/Realtime auth | Short-lived bearer or signed session, audience and room join checks; no client authorization claims |
| Data migration | Source PII location, minimization, no raw export from website, legal retention and ownership |
| Hosting integration | `/board-games` reverse-proxy vs separate origin; cookie path/SameSite and WebSocket upgrades |
| Cross-service audit | Correlation ID, actor principal, tenant, authorization outcome; no secrets in logs |

## Proposed architecture until proven otherwise
Prefer separate Board Game services with mapping to existing KingDragonHub identity via a trusted *reviewed* exchange/OIDC integration, and independent schema rather than sharing host auth database tables. This is a **candidate**, not an approved implementation. Do not add RLS allow policies, student authorization, admin login or expose MCP tools before source audit.

## Decision paths after audit
A. Host exposes verified OIDC/OAuth → integrate via provider subject mapping and shared logout/redirect.
B. Host has proprietary server sessions without OAuth → design a reviewed server-side token exchange/bridge, threat-model trust boundary, avoid copying passwords/session secrets.
C. Source/auth not accessible → restrict to anonymous game catalog demos only and keep all protected persistence and Game Server disabled.

## Approval artifacts
ADR for host integration, schema map for identity/tenant/guardian (no PII dumps), exact auth/redirect/CSRF claims checklist, browser/mobile/logout tests, role/RLS signed matrix, routing/SSR/CDN/WebSocket smoke tests and UX font source audit. Human Product Owner + BGU-SEC + host maintainer sign-off required before any production user tables or authenticated gameplay.
