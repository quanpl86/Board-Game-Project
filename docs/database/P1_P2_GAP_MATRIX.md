# Database P0/P1/P2 Gaps & Decisions
**Status:** live review register — not an approved full-system physical schema.

| Group | P0 Physical (PR #18) | P1/P2 still logical, NOT implemented | Schema authorization blocker |
|---|---|---|---|
| Identity / Tenant | users/identities/profiles/guardian link/policy log; org, memberships, scoped roles | private encryption, revocable sessions, org units, policy engine, retention request | KingDragonHub source OIDC/cookies and minor policy |
| Game Catalog/Runtime | games/versions, room/members, match/commands/snapshots/result | events and replay artifacts, matchmaking, worlds | Game SDK authoritative contracts and seed/version pin |
| Education | Not physical | 18 logical tables for classes/lessons/assignments/rubrics | school roster lifecycle, guardian data access and teacher assessment |
| Social/Safety | Not physical | 17 logical tables for teams/chat/moderation | age, moderation retention, untrusted-content attachments |
| Competition/Ranking | Not physical | 23 logical metrics/events/tournament/score/history entities | finalize/appeal/tie policy, student profile visibility |
| CMS / LiveOps | item/revision/publication | site slots, campaigns, theme revisions, notification delivery | approved site ownership and audience targeting |
| Assets & 3D | asset + versions | asset manifest entries, worker, world persistence and creator | author rights, CDN immutability and simulation rollback |
| Avatar/Shop | Not physical | rig, slots, definitions, instances, offers, double-entry ledger | verified item ownership/coin policy and fraud tests |
| MCP/AI | approval/invocation/audit/outbox | workflow versions, queued retries, inbox, tool grants | OAuth principal/tenant/scope, non-agent human approvals |
| Coding | Not physical | problem/test submissions/judge runs | sandbox isolation, hidden test confidentiality |

## Full physical design approval order
1. Obtain actual KingDragonHub repo/SSO/hosting evidence from Product Owner; confirm **global identity linkage** and website URLs.
2. Confirm actual data retention and guardianship legal basis; draft API auth matrix and RLS allow policies.
3. Review this [P0 30-table atlas](README.md), [P0 migration](../../db/migrations/0001_p0_foundation.sql) and PostgreSQL CI output. Correct relationships and data types as required.
4. Sign P0-A/P0-B physical table set, isolate migration owner/non-owner runtime role and test cross-tenant access under real principal.
5. Expand to P1 Education/Competition/Economy & per-table datasheets only when owners approve feature release and transaction policy.
6. Add P2 Creator/Coding/Marketplace only after safety/security sandbox/escrow controls.

## Current verification and known constraints
The ERD of 30 P0 physical tables is derived from explicit 49 SQL foreign keys. These are **not** 159 fully modeled physical tables. Extra conceptual diagrams in [Full Platform Relationship Blueprint](FULL_PLATFORM_RELATIONSHIP_BLUEPRINT.md) indicate **future proposals** and require per-table data dictionary/SQL before deployment.
