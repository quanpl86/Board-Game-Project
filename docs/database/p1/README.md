# Board Game Universe — Database P1 Detailed Modeling (REVIEW CANDIDATE)

**Scope:** 39 proposed P1 tables, 265 candidate columns, 80 proposed FK links (36 to existing P0), 3 domain models. **NO P1 MIGRATION**, no production DB action or policy change. Data was developed against Education PRD, Ranking/Hall of Fame spec, Avatar rig spec, Economy logical model and freeze-readiness decisions.

## Visuals (editable)
- [Draw.io with 44 editable tabs](diagrams/Board_Game_Universe_P1_Editable.drawio) — one domains map, one full table overview, three domain ERDs, one per-table diagram.
- [SVG previews folder](diagrams/previews/) — individual vector previews, accessible directly in browser.
- [Overall candidate ERD](ERD_P1_ALL.md).
- [education domain ERD](ERD_EDUCATION.md).
- [competition domain ERD](ERD_COMPETITION.md).
- [commerce domain ERD](ERD_COMMERCE.md).
- [Detailed data dictionary / separate diagram per table](tables/README.md).
- [Candidate 265-column CSV](p1_columns.csv), [80 relationship CSV](p1_relationships.csv).

## Domain boundaries / authoritative data
- **Education (11):** class and lesson revisions, student attempts, private evidence and human-verified rubric assessments; game score is not academic grade.
- **Competition (11):** published match result as evidence, immutable score record corrections, leaderboard as rebuildable projection, Hall of Fame human review and minor privacy.
- **Commerce / Avatar (17):** item definition/version/asset version separate from inventory ownership/loadout, closed-loop currency, double-entry ledger and official store orders; no peer marketplace tables.

## Review blockers before physical SQL
- KingDragonHub SSO identity, tenant and guardian allow policies unresolved.
- Scoped uniqueness/composite foreign keys, optional ownership/account purpose, snapshot and retention model to freeze in DBA review.
- Ledger posting balance, same-currency entries, concurrent stock/order/inventory and nonnegative funds need transactional design and property tests (not enforced by diagram).
- Exactly once game score source verification, correction and privacy separation.
- Rubric/assignment lesson consistency, class/term tenant consistency, active enrollment access.

## Source of truth and regeneration
Manifest: `db/schema/p1_candidate_tables.json`. Regenerate *all* diagram/CSV/datasheet files with `node scripts/generate_p1_database_atlas.mjs`. CI should run `node scripts/generate_p1_database_atlas.mjs --check`; generated files are proposals derived from candidate manifest, not a permission grant.

See [P0 30-table production-review candidate](../README.md) and [cross-layer Agent protocol](../AGENT_IMPLEMENTATION_REFERENCE.md). Changes to physical schema require a **separate** approved SQL migration with its own smoke/integration tests.

## Education physical migration candidate — Dev/CI only
- [Physical Education ERD with exact SQL FK/composite refinements](EDUCATION_PHYSICAL_ERD.md)
- [DDL, guard and security decisions](EDUCATION_PHYSICAL_CANDIDATE.md)
- SQL: `db/migrations/0002_p1a_education_candidate.sql`; tests: `db/tests/0002_p1a_education_smoke.sql`. Competition and Commerce do not have SQL migrations yet.
