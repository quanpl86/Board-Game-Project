# P0 Database — Integrity, Security, Migration and Open Decisions
**Status:** DRAFT FOR REVIEW · no app authorization / no migration to production.
**Snapshot:** 30 tables, 7 schemas, 49 FK references, see `db/schema/p0_tables.json`.

## 1. Principles and source-of-truth boundaries
- **Identity:** `identity.users` is a global platform UUID; `identity.external_identities(provider,provider_subject)` maps to authenticated KingDragonHub account **after** provider protocol and token claims audited. Never use a provider email as immutable global key.
- **Tenancy/IAM:** memberships and scoped roles separate from global users. No universal `users.role` flag.
- **Catalog:** versioned immutable game rules and asset manifest hash. Matches pinned to exactly same `game_version_id` as their room, enforced by composite FK.
- **Gameplay:** room, membership, match, participant, accepted command, snapshot, result, result entries are separate business aggregates. Commands/results/snapshots append-only and unique idempotency/sequence constraints.
- **CMS:** content item, immutable revision and scheduled publication pointer separate; campaign/event/season remain future contexts.
- **AI:** tool approval, immutable target scope/hash and invocation logs separate, but neither table authorizes an MCP tool without real service-layer OAuth, audience, tenant check and time-limited approval.
- **Audit/Outbox:** publish events only after aggregate commit. A generic `aggregate_id` is intentional in an outbox event payload and is *not* an FK giving untyped business ownership.

## 2. Authorization/RLS — deny by default
All proposed P0 tables enable and FORCE RLS. No `CREATE POLICY` statements are supplied because **provider claims, audience, tenant/session inheritance and child/guardian policy remain unverified**. Service runtime connection must not use database owner, postgres/superuser or BYPASSRLS. A test verifies a granted normal SELECT-only role sees **zero rows**. This does **not** prove that the future correct users can read their records: allow policies and API authorization will need reviewed tests across adult/student/teacher/org/guardian/admin and revoked membership.
- Enforce SSO token identity on server; cookie/signature/audience/expiry/nonce validation required after host audit.
- One active tenant context is UX only, never unrestricted tenant authority.
- Verify organization membership **status='active'** at every privileged action, not only existence of scoped role assignment.
- Default deny stranger messaging and peer item trades for children; consent and verified guardian relations are not inferred from profile fields.
- Audit sensitive data access without logging student PII in generic JSON.

## 3. Exact FK and concurrency checkpoints
| Aggregate | Invariant and database mechanism | Additional application/service duty |
|---|---|---|
| External SSO identity | UNIQUE(provider,provider_subject) | link/claim with authenticated provider and replay checks |
| Membership/role | PK(organization,user), FK assignment → membership | deny inactive membership; roles scoped by organization |
| Game version | UNIQUE(game_id,version); immutable once published | verify checksum and asset bundle |
| Room/member | unique live (room,seat) partial index; UNIQUE(room,user) | lock last seat + capacity/age/permissions |
| Match/version | composite FK (room_id,game_version_id) → game_rooms | authoritative deterministic Game Server |
| Participant | UNIQUE(match,user) and unique occupied seat | verify participant is allowed to play |
| Command | UNIQUE(match,seq), UNIQUE(match,actor,idempotency_key), composite FK participant | validate turn/order/rules; retry returns prior outcome |
| Snapshot | PK(match,state_revision), sha256 check, append-only | validate replay hashes against pinned reducer |
| Result | UNIQUE(match_id), append-only; FK result entries to match and participant | finalize once in single transaction; corrections via future compensating record |
| Content revision | UNIQUE(content_item_id,locale,revision), append-only | versioned schema and content validation |
| Publication | end > start CHECK, FK approved_by user | exact revision human approval and deterministic campaign slot |
| Approval | requested_by <> approved_by CHECK, scope/version hashes, expiry | human identity verification; exact hash, expiry, revocation, single-use checking |
| Invocation | UNIQUE(initiated_by,tool_code,idempotency_key) | signed actor, tenant and tool scope authorization |

## 4. Data retention and deletion
| Classification | Included table examples | Status |
|---|---|---|
| Public filtered | games, game_versions | visibility still gated by publication status |
| Personal | profiles | default private; deletion UX does not automatically erase audit |
| Restricted | rooms, matches, membership, CMS, asset registry | policy/tenant boundaries pending |
| Highly restricted | guardian_links, policy acknowledgments, roles, approvals, audit events | retention/legal basis subject to institutional review |

Deletion/pseudonymization must consider historical game receipts and legal holds, backup retention, guardian rights and student identity protection. No destructive CASCADE from `users` or `organizations` is enabled: dependencies use `ON DELETE RESTRICT`.

## 5. Schema progression
1. **P0-A** review physical ERD and migration in dedicated PR; CI only empty PostgreSQL container and negative integrity tests.
2. **P0-B** after host source audit, implement trusted principal mapping, granular API authorizers, security-definer hazards audit, exact `CREATE POLICY` RLS grants, multi-tenant test matrix, identity and guardian policy.
3. **P0-C** implement typed API + durable game transaction/outbox; game result audit and replay tests.
4. **P1** education, ranking, official shop/economy and avatar additions via separate reversible migrations after user flows approved.
5. **P2** restricted marketplace, coding judge, game creator with stricter authority and isolation.

## 6. Stop / sign-off
**DO NOT FREEZE OR DEPLOY** while any of these are pending:
- [ ] DEC-01: verified KingDragonHub origin, auth provider, issuer/audience, route, logout/SSO behavior.
- [ ] DEC-02–08: Product Owner accepts/adjusts aggregate and membership/permission boundaries.
- [ ] Security: real permissions, real human approvals, student PII legal review and data minimization.
- [ ] DBA: queries, indices, migration upgrade/backfill strategy, backups and restore drill.
- [ ] QA: PostgreSQL CI tests, integration auth tests, entity/ERD parity and staged app behavior.
- [ ] Release manager: production migration approval separately issued, no auto-run.

No AI Agent, GitHub workflow or external MCP tool may use this SQL to write to production. A green schema smoke test validates DDL integrity **only**.
