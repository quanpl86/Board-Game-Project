# Product and Architecture Decision Register — Schema Freeze V2
**Status:** Decision proposals, not user approvals.
**Reviewers required:** Product Owner, Tech Lead/DBA, UX Lead, Security/Privacy, Game Designer, Education and Economy as relevant.
**Instructions:** Set ACCEPT/REVISE/DEFER with owner and date; do not assume recommendations = signoff.

| ID | Required decision | Recommendation | Gate | Status |
|---|---|---|---|---|
| DEC-01 | KingDragonHub integration URL, auth and styling | common host `/board-games`, OIDC identity, shared token package; host source audit | P0 | PENDING |
| DEC-02 | User principal, multi-tenant contexts | one global UUID user; membership/role scoping | P0 | PENDING |
| DEC-03 | Guardian/minor policy | default private profiles, no stranger DM/peer trade, controlled classroom access | P0 | PENDING |
| DEC-04 | Guest player account claim/recovery | guest limited capabilities and claim identity before durable rights | P0 | PENDING |
| DEC-05 | Game room/match/replay/world aggregates | independent version-pinned models and authoritative server | P0 | PENDING |
| DEC-06 | Game SDK extensibility/capabilities | game plugin, rule pack, view redaction, match result scoring evidence | P0 | PENDING |
| DEC-07 | Physical schema naming & ownership | main data dictionary canonical where possible; new tables only by reviewed migration | P0 | PENDING |
| DEC-08 | Event/Tournament/Season/Campaign distinction | separate aggregates; verified result score ledger | P0 | PENDING |
| DEC-09 | School and learner attempt privacy | rubric evidence versioning, scoped student records | before education | PENDING |
| DEC-10 | Group/team/social and moderation policy | separate class group vs team vs room membership, report workflow | before school/social | PENDING |
| DEC-11 | Cosmetic only vs game advantage | cosmetic only, no score/grade advantage from purchases | P0 catalog contract | PENDING |
| DEC-12 | Currency and Shop | earned non-cash-out Coins, official shop first, double-entry ledger | before Shop | PENDING |
| DEC-13 | Marketplace audience | off for minors and off globally until review, adult-only gated P2 | P0 policy | PENDING |
| DEC-14 | Avatar 3D rig/slot/costume structure | versioned rig, Blockbench→GLB, item/asset/owned copy separate | before Avatar | PENDING |
| DEC-15 | Honor and leaderboard visibility | team/verified public where safe, learning rubric private, reviewed honor publishing | before Ranking | PENDING |
| DEC-16 | CMS theme priority and release | KingDragonHub base shell fixed, campaign audience/versioned slot resolution | P0 | PENDING |
| DEC-17 | MCP/Agent action authority | typed domain tools, scoped token, draft first, approval for risk | P0 | PENDING |
| DEC-18 | Automation event/run durability | immutable workflow revisions, idempotent step/outbox+audit | P0 | PENDING |
| DEC-19 | Secure code runner | separate sandbox, accepted test/version pin, public coding deferred | contract P0, implementation P2 | PENDING |
| DEC-20 | Support, data deletion and retention | case management, data export/restriction, privacy officer approval | before live users | PENDING |
| DEC-21 | Screen inventory and design signoff | 117 logical screen list, release-specific subset; KingDragonHub visuals | P0 | PENDING |
| DEC-22 | Deployment, regional data residency | decide hosting, child data, backups/legal review, SSO path integration | before production | PENDING |
| DEC-23 | Creator/publishing extensibility | versioned content/rights gateway, but P2 tables deferred | contract P0 | PENDING |
| DEC-24 | Monorepo & migration ownership | TypeScript workspace, API boundaries, CODEOWNERS, independent schema reviews | P0 | PENDING |

## Resolution criteria
Decision APPROVED requires: named owner, final choice, ADR link where architectural, user/privacy consequences, released scope, alternatives considered, and affected schema contract. Update table only when confirmed. If DEFER, keep secure feature flag OFF and define future migration strategy.

## Data-schema freeze is allowed only if:
1. User journeys cover all P0 release paths, exception/retry and privacy branches.
2. Missing F0 functional gaps resolved or explicitly deferred with no P0 data loss.
3. P0 ERD/SQL/permissions naming and event contracts reviewed; v1 vs PR#3 entities reconciled.
4. Core transaction tests and cross-tenant permission tests pass in staging (when built).
5. UX/navigation for P0 reviewed, including access denied, no-WebGL, offline/reconnect and responsive.
6. Security/privacy/guardian/legal owners sign off on actual collected data.
7. Documentation and migrations merged through PR/CI, backup/restore procedure exercised.

## Recommended sequence
- Review PR #2 KingDragonHub design and PR #3 Economy separately; reconcile their screen and data taxonomies with V2 docs.
- Product workshop: resolve DEC-01–08, DEC-11–18 first; capture all F0 gaps.
- Build physical P0 ERD/migration-only PR with ownership/constraints and seed data, then implement vertical slice.
- Add Education/Social/Economy/Coding tables with tested expand migrations as modules release; do not freeze a hypothetical 159+35 physical schema today.

## Explicit non-goals of this document
Not an authorization to merge pending PRs, modify existing database, deploy KingDragonHub production, enable marketplace to minors, or create public events without review.
