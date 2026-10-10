# Database Review Sheet — P0 to Production
Use with `database-engineering/SKILL.md`. This is a mandatory **review worksheet**, not approved migrations.

| Field | Required response |
|---|---|
| Aggregate / domain owner | Who writes? Which app service, versioned contracts? |
| Actor / tenant scope | Global identity vs organization data; PII classification |
| Table & version | Plural snake_case; module and migration ID |
| Primary / foreign keys | UUID, columns/types, NOT NULL, indexes, referential deletion |
| Constraints | unique business keys, partial indexes, CHECK invariants, race locks |
| Isolation | RLS policy plus application authz tests; service role bypass analysis |
| Lifecycle | draft/active/finalized/archived/tombstone; separate orthogonal states |
| Auditing | who, when, why, source event, immutable record/compensating entry |
| Performance | top 3 queries, cardinality, EXPLAIN plan, index write cost |
| Migration | expand/backfill/switch/contract, lock risk, feature flag, rollback |
| Retention | legal/privacy category, pseudonymization, archive and backup policy |
| Tests | clean install, upgrade seeded old DB, rollback/recovery, simultaneous clients |

## Design anti-patterns
- `users.role` single global flag (multi-tenant scope unsafe).
- One `sessions` table for game room, auth session and classroom lesson.
- `current_coins` mutable scalar without balanced ledger.
- Unconstrained `JSONB` for items or class memberships.
- Generic polymorphic FK `resource_id` with no real integrity when typed bridge/association tables are feasible.
- Foreign-key CASCADE from org to historical receipts/results without explicit retention/legal approval.
- No `tenant_id` index on organization-scoped high-volume queries.
- One giant 159+35-table migration without approved flows.

## Required adversarial tests
A teacher from School A queries student School B grade; child tries trading API via copied adult UI token; repeated order request; race for last stock; two room clients join same seat; old game replay after rule version update; assistant tries RLS bypass; stale approval version. All must fail safely.

## Signoff
DB lead verifies SQL and optimizer; security verifies tenant/PII; domain owner checks invariants; release owner confirms backup/restore. Without signoff → staging-only migration.
