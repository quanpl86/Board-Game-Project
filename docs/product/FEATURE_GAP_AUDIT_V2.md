# Functional Gap Audit V2 — What Must Be Added Before Database Freeze
**Date:** 2026-10-10 · **Status:** Proposed analysis; recommendations are additions, not claims of existing features.
**Baseline:** Platform Blueprint v1, Education PRD, Social/LiveOps main; pending PR #2 Design System and PR #3 Economy/Avatar.

## Prioritization meaning
- **F0 (Schema blocker):** decide entity/identity/security/invariants prior to P0 physical schema; full UI can ship later.
- **F1 (Product essential):** P1 user flow needs complete PRD + UI before production release; model extensibility in P0.
- **F2 (Future):** design extension contract, avoid overbuilding now.
Owner must explicitly approve, decline or defer each decision.

| Gap ID | Missing or underdeveloped function | Why it matters | Required new data / rule | Priority | Affected screens |
|---|---|---|---|---|---|
| GAP-01 | Unified identity across KingDragonHub/Game app | avoid duplicate users, logout conflict | external identities, SSO mapping, token audience, account merge | F0 | SH-03/11 |
| GAP-02 | Tenant/context switch and scoped memberships | same person multi-role without privilege leak | org membership, role assignment, active context not source of truth | F0 | SH-08 |
| GAP-03 | Age band, learner & guardian consent policy | minors need restricted features | policy approvals, guardian relation, age-band capabilities | F0 | SH-06 |
| GAP-04 | Guest → verified account recovery & merge | preserve progress safely | guest identities, claim tokens, duplicate resolution | F0 | SH-04/09 |
| GAP-05 | User lifecycle and data portability | deletion and retention cross-domain | data_requests, deletion jobs/holds, pseudonymizing audit | F0 | OPS-20 |
| GAP-06 | Global notification delivery/preference | event update, game invite, receipt | notification templates, deliveries, preferences | F0 | SOC-09, OPS-21 |
| GAP-07 | Global search indexing and content visibility | combined game/event/article search | search document projection, typed target, ACL filter | F1 | SH-02 |
| GAP-08 | Game modes/capabilities/compatibility | one SDK many incompatible genres | mode configs/manifest hashes, rights/age/device gates | F0 | PUB-04 |
| GAP-09 | Invite expiration, seat conflict, reconnect | no phantom players, lost matches | room invitation, token TTL, reconnect identity, lease | F0 | GAME-01/12 |
| GAP-10 | Persistent worlds distinct from matches | city-building over multiple sessions | world state/revisions, owners, collaboration/asset pin | F0 for Eco City | GAME-14 |
| GAP-11 | Friend/relationship vs team vs room member | avoid overloading one `members` table | separate link edges and scoped policies | F1 | SOC-01/07 |
| GAP-12 | Moderation/report case and appeals | safe chat/community/avatars | report evidence, case/action, restricted retention | F0 if minors/social launch | SOC-08, OPS-13 |
| GAP-13 | Teacher roster rollover/transfer & guardians | actual school years and permissions | class archives, enrollment periods, consent history | F1 | EDU-05/13/14 |
| GAP-14 | Assessment attempt vs gaming match | multiple retries and teacher correction | attempt, evidence, rubric_version, graded revision | F0 for education | EDU-02/11 |
| GAP-15 | Event waitlist, check-in, cancellation/reschedule | real event lifecycle, fairness | statuses, capacity, waitlist ordering, timezone | F1 | CMP-03/04 |
| GAP-16 | Tournament BYE/no-show/dispute/freeze | avoid corrupt standings | fixture policy, referee decisions, result hold | F0 for competition | CMP-08 |
| GAP-17 | Ranking metrics by direction/tiebreak/version | heterogeneous games and coding | metric registry, score ledger, immutable policy versions | F0 | CMP-09/10 |
| GAP-18 | Hall of Fame privacy + correction | earned recognition may be withdrawn | nomination, evidence, approval, publicity policy | F1 | CMP-11/12 |
| GAP-19 | Separate XP, wallet currency, score, badges | prevent conflation or score buying | immutable ledger with currency and source events | F0 | COL-04 |
| GAP-20 | Item definition/version vs asset vs owned copy | transferable and equipped item correctness | item catalog, edition, asset mapping, instances/stacks | F0 for shop | COL-05/06 |
| GAP-21 | Avatar rig/slot graph, costume overlay, pets | compatibility across animations/game genres | rig version, slots, conflicts, presets/loadouts | F0 for avatar | COL-06/07 |
| GAP-22 | Atomic shop purchase, stock, retry and refund | economy exploits/duplicate charge | ledger, orders, idempotency, compensation | F0 for shop | COL-03 |
| GAP-23 | Marketplace fraud/escrow/age gate | ownership and child safety | listing/hold/settlement/dispute, independent policy | F2, restrict on P0 | COL-11–14 |
| GAP-24 | Coding submission vs game action and rejudge | sandboxed programs have own lifecycle | problem/test version, submission, job/verdict history | F0 contract; F2 tables | CODE-05/06 |
| GAP-25 | Creator publishing, moderation and rights | future game/item additions | publication revisions, copyright/provenance, takedown | F2 | OPS-23 |
| GAP-26 | CMS vs campaign vs event vs season separation | maintain dynamic content without DB confusion | distinct entities and targeting priority | F0 | OPS-05/06 |
| GAP-27 | Content release conflicts and audience rules | global/tenant/child-safe theme rollout | slot publication resolution, approval & schedule | F0 | OPS-06 |
| GAP-28 | Feature flag and entitlements separation | feature availability vs permission/payment | feature policy/version, entitlement scope | F0 contract | OPS-22 |
| GAP-29 | MCP tool/action approval binding | agents must not bypass backend | service identities, immutable approval snapshot, audit | F0 | OPS-14/16/17 |
| GAP-30 | Durable workflow, failed-job recovery | long-lived content and event automation | workflow revision/run/step/outbox/retry | F0 | OPS-15/17 |
| GAP-31 | Support tickets/refunds/disputes/incident inbox | no customer-service pathway | support case, action log, evidence link, access limits | F1 | OPS-19 |
| GAP-32 | Source artifact licensing, version and recall | avoid broken GLB and unauthorized media | immutable asset_version, provenance, revoke policy | F0 | OPS-04 |
| GAP-33 | Audit/retention across every domain | regulatory and operational traceability | audit, retention class, access reason, outbox | F0 | OPS-17/20 |
| GAP-34 | Service outage, fallback and version migration | keep old matches/replays/playlists working | state migration manifest, error fallback and rollback | F0 | GAME-12/15 |
| GAP-35 | Public profile privacy and safe award sharing | cannot expose child identities | profile visibility, share policy, guardian review | F0 | PUB-05, CMP-12 |
| GAP-36 | Accessibility & preferences persistence | WebGL + classroom diversity | client device settings, low-FX/reduced motion | F1 | SH-10 |
| GAP-37 | Reporting/analytics event governance | prevent noisy PII logs, measurable outcomes | telemetry schema registry, aggregate projections | F1 | OPS-01/18 |
| GAP-38 | Localization/locale/time zone | future international event scheduling | locale content, timezone on schedule, UTC source | F1 | CMP-02, OPS-06 |
| GAP-39 | Classroom offline/LAN continuity | unstable school internet | outbox/sync lease, conflict algorithm, safe offline mode | F2 | EDU-10, GAME-12 |
| GAP-40 | Separate products/plans and entitlements | eventual monetization without rewrite | plans, entitlements, period validity, no cash P0 | F2 | PUB-04 |
| GAP-41 | Tournament spectators/stream policies | minors, private matches, card secrecy | spectator authorization, delayed/redacted view | F1 | CMP-07 |
| GAP-42 | In-app feedback/report bug UX | production diagnostics loop | feedback ticket/attachments with redaction | F1 | GAME-13 |

## Hard blockers before production-schema migration
1. Identity/SSO principal and tenant/guardian boundary.
2. Game room vs match vs persistent world; immutable game/version/rules/score pin.
3. Score records vs XP vs wallet ledger vs item ownership; settlement invariants.
4. Event program/tournament/season/campaign/domain event semantics.
5. Approval/audit/idempotency/outbox semantics for humans and MCP agents.
6. Legal/privacy retention and minors' visibility/trading communication policy.
7. Asset, rig, item and published release version ownership.

## Scope containment
- Implement the smallest P0 subset to prove Gomoku (2D) + Eco City (3D) + identity + game registry + safe CMS/MCP draft approval.
- Define interface contracts for F1/F2 without materializing 160+ tables prematurely.
- Marketplace, cash/paid trade, advanced creator and distributed coding judging are NOT alpha-critical.
- Gate public student community and broad peer trading separately.

## Suggested requirement tags
Identity `ID-* `; game `GME-* `; education `EDU-* `; safety `SAFE-* `; economy `ECO-* `; tournament `TOUR-* `; CMS `CMS-* `; MCP `MCP-* `; support `SUP-* `.

## Post-review follow-up
Map every approved gap to: issue → domain owner → UI screen ID → command/query contract → persistent aggregate/table(s) → test & release gate. Unapproved gaps stay provisional and should not silently drive production schema.
