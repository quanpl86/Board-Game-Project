# Board Game Universe — PostgreSQL P0 Database Candidate

**Scope:** Dev/CI-only proof of physical P0 schema: 30 tables, 7 bounded contexts, 49 declared FK relationships.
**Status:** REVIEW CANDIDATE, schema NOT FROZEN, no KingDragonHub production credentials, no SSO implementation, no actual app persistence.

## Architecture and visuals
- [ERD tổng thể](../docs/database/ERD_ALL_P0.md)
- [ERD theo domain + 30 sơ đồ từng bảng](../docs/database/README.md)
- [Ma trận bảo mật/migration](../docs/database/DB_SECURITY_AND_MIGRATION_POLICY.md)
- [Source metadata](schema/p0_tables.json)
- [Full SQL migration](migrations/0001_p0_foundation.sql)
- [PostgreSQL smoke tests](tests/0001_p0_smoke.sql)

## How to check (local developer only)
Requires PostgreSQL 16, psql, Python 3.12+ and a disposable **empty** database. Never point `PGHOST/PGDATABASE` to production.

```sh
python3 scripts/check_db_schema.py
export PGHOST=127.0.0.1 PGPORT=5432 PGUSER=bgu PGDATABASE=bgu_dev
# docker compose -f infra/docker/compose.yml up -d postgres
# PostgreSQL user in the local compose is superuser strictly for local smoke runs:
psql -X -v ON_ERROR_STOP=1 -f db/migrations/0001_p0_foundation.sql
psql -X -v ON_ERROR_STOP=1 -f db/tests/0001_p0_smoke.sql
```

Tests use a transaction that rolls back all data and temporary probe roles. SQL migration itself **is not idempotent**, deliberately so duplicate application must fail rather than hide drift; track the applied migration under a future approved migration runner. CI starts a clean container to verify the initial install. Upgrading a real existing schema, restoring backups and production IAM policy tests require separate PR/reviews.

## Important safeguards
- All 30 tables have `ENABLE ROW LEVEL SECURITY` and `FORCE ROW LEVEL SECURITY`, but **zero access policies**: normal roles have no row access even after SELECT grants. This is a *fail-closed skeleton*, not a finished SSO integration.
- PostgreSQL table owners, superusers and BYPASSRLS remain privileged; do not connect the app as the migration/superuser account.
- No `GRANT` to public runtime role, no user-facing DB service; identity/organization claims and service principal remain undecided.
- Game results, commands, snapshots, publishing revisions, audit are append-only; published Game Version and approved Asset Version reject UPDATE/DELETE.
- A DB CHECK/FK does not validate turn legality, consent, age, content approval authenticity or wallet funds. Domain service and authorized policy gates remain mandatory.
- This P0 schema does **not** introduce inventory, shop, score ledgers, classrooms or creator marketplace; those belong to approved P1/P2 phases.

## Review required before production
1. BGU-ARCH/Product Owner approve KingDragonHub host identity/session provider and subject mapping.
2. BGU-DBA + BGU-SEC verify all 30 table definitions, missing entities, class-specific retention, RBAC/ABAC and access policies.
3. Approve physical data dictionary/ERDs, signed migrations, least-privilege roles, backup/restore, performance and upgrade tests.
4. Versioned schema migrations and canary deploy tested in staging before any real data.
