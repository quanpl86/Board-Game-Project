# P1-A Education migration — isolated DB design review
**Status:** PHYSICAL CANDIDATE FOR DEV/CI ONLY; **NOT AUTHORIZED FOR PROD/STAGING**. Corresponds to 11 Education tables in `db/schema/p1_candidate_tables.json`, which remains a 39-table *proposed design*. Competition and Commerce remain UNMIGRATED.

## Relational invariants enforced by PostgreSQL
- Academic term and class must reference **the same organization** via composite FK.
- Assignment rubric must reference **the same lesson** via composite FK; an assignment rubric/lesson becomes pinned after any attempts.
- User account, class, lesson and rubric still have real SQL FK; teacher must still pass API authorization once SSO exists.
- Student must have **active enrollment** when inserting/reattaching an assignment attempt.
- Referenced authoritative `match_results` must have the same student among actual match participants if attached.
- Grade criterion must match assignment rubric and awarded level must not exceed criterion maximum; teacher scope check remains a domain authorization task.
- Published lesson revisions and approved rubrics/criteria cannot be overwritten/deleted; evidence and grade revisions are append-only.
- All 11 Education tables have ENABLE+FORCE RLS with **zero access policies and no runtime GRANT**. Standard non-owner roles cannot see records. Superusers/owners remain privileged and must not be used by app.
- Class/enrollment/student-grade identifiers are not public UI capabilities. No PII should be copied into unvalidated JSONB evidence.
- Composite FK for rubric + lesson and class + organization are **physical refinements** of candidate blueprint. Additive migration review notes record these decisions, not silent changes to P1 design generator.

## Required review before expanding outside test database
- EDU-01–06: guardian consent and student roster lifecycle; active enrollment and cross-tenant policy; score-to-evidence retention.
- Revise teacher role/permission, account status/guardian verification, P0 provider subject mapping from KingDragonHub.
- Define actual authenticated application DB role, tenant RLS allow policies; test cross-tenant adversaries.
- Confirm rubric weights/locale, approved content retention and immutable corrections, and schema expand/backfill/restore.
- Retest constraint races, repeated assignment/grade attempts and revoked students; run integration APIs after policies are approved.

## Evidence
`db/migrations/0002_p1a_education_candidate.sql` and `db/tests/0002_p1a_education_smoke.sql` run only on disposable PostgreSQL 16 in new CI `database-education.yml` after P0 migration & P0 tests. Passing CI proves DDL and *some* invariants only, not regulatory privacy compliance or safe production authorization.

**Do not auto-merge or deploy this migration.** Human Product Owner + DBA + Security review required.
