---
name: architecture-contracts
description: Design modular multi-game platform boundaries, typed API/domain events, version compatibility, authoritative state and safe integration with KingDragonHub.
version: 1.0.0
owner_role: BGU-ARCH
---

# Skill: architecture-contracts
**Purpose:** Design modular multi-game platform boundaries, typed API/domain events, version compatibility, authoritative state and safe integration with KingDragonHub.

## Activate for
service architecture, Game SDK contracts, API, event schema, ADR, integration, web sockets

## Read before acting
- `docs/architecture/adr/0001-platform-architecture.md`
- `docs/architecture/COMMAND_EVENT_CONTRACTS_V2.md`
- `docs/architecture/DB_FREEZE_READINESS_V2.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Read existing architecture ADR, bounded contexts, code dependency graph and source-of-truth responsibilities.
2. Draw interaction sequence with client → authz → application service → transaction/outbox → consumers, including failure.
3. Choose modular monolith interfaces; separate Game Server, AI workflow worker and coding judge by resource/security boundary.
4. Create typed contracts: actor, tenant, resource ID, expected revision, idempotency, request schema, response/error and event envelope version.
5. Document consistency: DB transaction vs eventual projections; design retry, concurrency, timeout and recovery.
6. Create ADR with alternatives, chosen tradeoff, migration/backward compatibility and operational considerations; add contract and E2E tests.

## Non-negotiable rules
- No direct game/AI/UI writes to unrelated domain tables.
- Pin match to published game/rule/score/asset version; redacted per-player views.
- Use synchronous coordination only where strong consistency is needed; outbox for side effects.
- Do not assume host SSO protocol, route or CSS until source verified.

## Required output artifacts
- ADR and architecture/sequence diagrams
- OpenAPI/type interfaces and event schema
- Change impact map and migration contract
- Resiliency/load/security acceptance tests

## Validation / Definition of Done
- [ ] One domain owner per aggregate
- [ ] Reviewers can identify transaction boundary
- [ ] Old replay and released artifacts compatible or migration proposed

## Handoff
Use `docs/agents/templates/HANDOFF.md` with changed files, status, test links, unresolved risks and reviewer. Any unapproved R3/R4 action stops at proposal/approval stage.

## P0 database diagram and source-of-truth gate
Before P0 Database, API, Game Server, frontend or MCP implementation that touches persisted data, read `docs/database/AGENT_IMPLEMENTATION_REFERENCE.md`, the [editable Draw.io source and 39 SVG previews](../../../docs/database/diagrams/README.md), affected `docs/database/tables/<schema.table>.md`, `db/schema/p0_tables.json` and current SQL. Do not infer permissions from ERD edges. DB table/relation changes require regeneration of diagram+CSV assets and CI parity; never add SSO/RLS allow rules or production migrations without human approval.

## Database P1 Candidate Modeling — mandatory pre-implementation gate
Read [P1 Database Atlas](../../../docs/database/p1/README.md) and [P1 Cross-Layer Plan](../../../docs/database/p1/CROSS_LAYER_IMPLEMENTATION.md) for Education/Competition/Commerce scopes. 39 tables, 265 fields and 80 relationships are **PROPOSED**, not executable PostgreSQL or migrated entities. Study per-table dictionaries and editable Draw.io before API/UI design; do not use P1 diagrams as permission to query DB, invent frontend data or issue production DDL. Require Product Owner/DBA/Security decision signoff and isolated migration tests; coin double-entry/concurrency and private student rubric assessments are high-risk stop-gates.

## Student Universe profile/asset/character/wallet source-of-truth
Read [learner-owned data atlas](../../../docs/database/student-universe/START_HERE.md), [editable 30-page Draw.io](../../../docs/database/student-universe/Student_Universe_Editable.drawio), [cross-layer security and API draft](../../../docs/database/student-universe/IMPLEMENTATION_AND_SECURITY_CONTRACT.md) and canonical `db/schema/student_universe_extension_candidate.json` before touching student profiles, cosmetic items, assets, character instances, ownership, Coin or badges. All 22 new tables are **proposal-only**. Never infer owned items from approved GLB, EXP from Coin, or a wallet amount from a user profile. No direct SQL from frontend/MCP; respect guardian/tenant RLS, reward idempotency and double-entry concurrent spending gates. Obtain Human DBA/Product/Security approval before any physical migration.
