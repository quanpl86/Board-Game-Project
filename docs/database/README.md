# Database P0 — Physical ERD & Per-Table Relationship Atlas
**Status:** REVIEW CANDIDATE · **2026-10-10**. **30 physical tables, 7 domains, 49 FK edges**. Source manifest: `db/schema/p0_tables.json`, migration: `db/migrations/0001_p0_foundation.sql`.

**IMPORTANT**: main logical 159-table inventory remains a roadmap. This P0 subset is not a signed production schema. Host SSO/tenant/guardian auth and physical RLS policies are still pending. Runtime roles are DENIED BY DEFAULT (RLS ENABLE+FORCE, no policies) until reviewed. Never deploy this migration to KingDragonHub production from automation.

## Visualization levels
- [Overall ERD](ERD_ALL_P0.md) — 30-table conceptual physical map.
- [identity domain ERD](ERD_IDENTITY.md) — 5 tables, neighbor relationships.
- [tenancy domain ERD](ERD_TENANCY.md) — 6 tables, neighbor relationships.
- [assets domain ERD](ERD_ASSETS.md) — 2 tables, neighbor relationships.
- [catalog domain ERD](ERD_CATALOG.md) — 2 tables, neighbor relationships.
- [gameplay domain ERD](ERD_GAMEPLAY.md) — 8 tables, neighbor relationships.
- [publishing domain ERD](ERD_PUBLISHING.md) — 3 tables, neighbor relationships.
- [integration domain ERD](ERD_INTEGRATION.md) — 4 tables, neighbor relationships.
- [Per-table details and direct neighbors](tables/README.md) — exact 30 tables with fields, PK/FK, inbound/outbound connections and one diagram per table.
- [P0 Architecture Decisions](DB_SECURITY_AND_MIGRATION_POLICY.md) — RLS/roles, critical invariants, lifecycle and review gate.
- [Development migration and test](../../db/README.md) — CI PostgreSQL verification.

## Data boundaries
Identity (5), Tenancy/IAM (6), Assets (2), Catalog (2), Gameplay (8), Publishing (3), Integration/AI/Audit (4). The ERDs show declared SQL FKs, not implied permissions or event-bus links. Shop/Economy/Leaderboards/Education remain future schema phases.

## Flow-to-schema anchors
F01 identity and tenant; F02 catalog and assets; F03 room and memberships; F04 match/commands/snapshots/results; F17 versioned CMS publication; F19 approvals/invocations/outbox and append-only audit. See `docs/product/END_TO_END_APP_FLOWS_V2.md`.

## Validation
`python3 scripts/check_db_schema.py` checks SQL/manifest/table-doc links and foreign keys. `db/tests/0001_p0_smoke.sql` exercises SQL constraints in isolated CI PostgreSQL; this is not proof of SSO/auth product integration.
