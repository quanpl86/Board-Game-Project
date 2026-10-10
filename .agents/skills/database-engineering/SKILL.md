---
name: database-engineering
description: Design safe PostgreSQL schema/ERD/migrations, tenancy/RLS, wallet ledger, versioned game state, indices, backups, performance and data retention.
version: 1.0.0
owner_role: BGU-DBA
---

# Skill: database-engineering
**Purpose:** Design safe PostgreSQL schema/ERD/migrations, tenancy/RLS, wallet ledger, versioned game state, indices, backups, performance and data retention.

## Activate for
database, SQL, migrations, schema, index, data dictionary, PostgreSQL, Drizzle, RLS

## Read before acting
- `docs/architecture/DATABASE_DATA_DICTIONARY.md`
- `docs/architecture/DB_FREEZE_READINESS_V2.md`
- `docs/product/PRE_SCHEMA_FREEZE_DECISIONS.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Start from approved end-to-end flow, domain owner and authoritative business event; do not migrate entire 159-table conceptual list.
2. Draft logical/physical ERD; identify cardinality, nullability, composite tenant keys, FK, unique constraints, check constraints and deletion policy.
3. Design using UUID PK and UTC timestamptz; separate users/external identities/memberships, room/match/world, result/score/wallet, item/version/instance/loadout.
4. Plan schema `expand → backfill → switch → contract`; generate migration, typed client, test fixtures, rollback/restore strategy and large-table lock assessment.
5. RLS is defense in depth: specify policies and service authorization, test owner/superuser bypass risk and cross-tenant access. Never expose child PII through public view.
6. Run migration from empty DB and from representative old schema on disposable PostgreSQL; verify FK/uniques, concurrent orders/room seats, idempotency and seed reproducibility.
7. Benchmark representative joins/filters/leaderboards with EXPLAIN ANALYZE and verified indexes; document costs and partition threshold, not premature sharding.
8. Require independent DB/security review, backup/restore exercise and deployment approval before production apply.

## Non-negotiable rules
- Do not execute DDL, DELETE or data correction against production via Agent/MCP.
- No mutable balance as source of truth: double-entry balanced ledger with available-funds protection.
- No arbitrary untyped JSONB for membership/ownership; versioned JSONB only for game state and schema-defined content.
- Do not combine score/XP/wallet or item definition/asset/owned instance.
- PII retention and deletion policy must be agreed before live student data.

## Required output artifacts
- ERD, table dictionary with owner/classification
- Migration and rollback plan
- Seed and integration tests
- Index/query plan benchmarks
- Security/RLS/retention matrix

## Validation / Definition of Done
- [ ] Migration repeatable, tested on clean and upgrade DB
- [ ] Unauthorized cross-tenant query denied
- [ ] Concurrent writes cannot double spend/award
- [ ] No breaking change without compatible rollout and backup evidence

## Handoff
Use `docs/agents/templates/HANDOFF.md` with changed files, status, test links, unresolved risks and reviewer. Any unapproved R3/R4 action stops at proposal/approval stage.

## P0 database diagram and source-of-truth gate
Before P0 Database, API, Game Server, frontend or MCP implementation that touches persisted data, read `docs/database/AGENT_IMPLEMENTATION_REFERENCE.md`, the [editable Draw.io source and 39 SVG previews](../../../docs/database/diagrams/README.md), affected `docs/database/tables/<schema.table>.md`, `db/schema/p0_tables.json` and current SQL. Do not infer permissions from ERD edges. DB table/relation changes require regeneration of diagram+CSV assets and CI parity; never add SSO/RLS allow rules or production migrations without human approval.

## Database P1 Candidate Modeling — mandatory pre-implementation gate
Read [P1 Database Atlas](../../../docs/database/p1/README.md) and [P1 Cross-Layer Plan](../../../docs/database/p1/CROSS_LAYER_IMPLEMENTATION.md) for Education/Competition/Commerce scopes. 39 tables, 265 fields and 80 relationships are **PROPOSED**, not executable PostgreSQL or migrated entities. Study per-table dictionaries and editable Draw.io before API/UI design; do not use P1 diagrams as permission to query DB, invent frontend data or issue production DDL. Require Product Owner/DBA/Security decision signoff and isolated migration tests; coin double-entry/concurrency and private student rubric assessments are high-risk stop-gates.

## Education P1-A physical review gate
The full candidate P1 Draw.io is **not** the current SQL state. Use `docs/database/p1/EDUCATION_PHYSICAL_ERD.md` and `docs/database/p1/EDUCATION_PHYSICAL_CANDIDATE.md` for the 11 Education migration tables, physical composite FKs and negative tests. No real student data, SSO authorization policies or production migration until explicit privacy/DBA/owner signoff.
