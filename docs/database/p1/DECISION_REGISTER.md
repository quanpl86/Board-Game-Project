# P1 Freeze Decision and Risk Register
**Status:** OPEN. Needed before **any** P1 migration or production API integration.

| ID | Decision | Choice / important tradeoff | Owner |
|---|---|---|---|
| EDU-01 | Student enrollment in class | Teacher invite, roster sync, guardian approval; cross-tenant double enrollment? | Product + Privacy |
| EDU-02 | Course lesson versioning | Lesson revision scoped by code; rubric revision pin and archival | Education + DBA |
| EDU-03 | Academic term/class tenant integrity | Composite foreign key and academic rollover; same organization guarantee | DBA |
| EDU-04 | Rubric/assignment relationship | Rubric must belong to lesson; enforce composite FK vs service and index | DBA + Education |
| EDU-05 | Grade change history | Revision-only immutable assessment, teacher adjudication, retention | Education + Legal |
| EDU-06 | Evidence PII retention | Privacy policy, anonymization/export, guardian access and withdrawal | Privacy |
| COMP-01 | Verified scoring | Authoritative score entry, policy version, correction event, idempotency | Game + Competition |
| COMP-02 | Tournament fixtures | Participant/seed/time/zones, no-show, team formats, exact game version | Competition |
| COMP-03 | Rank visibility | Child nicknames vs group-only vs parent access; no public academic score | Product + Privacy |
| COMP-04 | Leaderboard revision | Projection rebuild, tie break, snapshot/freeze and delayed updates | Competition + QA |
| COMP-05 | Hall of Fame approval | Human reviewer, legal/guardian consent, withdrawal and history | Content + Privacy |
| AV-01 | Rig/equip conflicts | Canonical slot family; full mascot occupies multiple slots; animation compatibility | 3D + Game |
| AV-02 | Item definition/version/instance | Immutable catalog, asset rights, ownership ledger and provenance | Economy + DBA |
| AV-03 | Grant and revoke | Instance event audit, compensation and revocation during equip | Economy + Security |
| ECON-01 | Currency ownership scope | Per-user vs organization, system pool, purpose unique and blocked age groups | Product + DBA |
| ECON-02 | Posting balanced entries | Prevent mixed currency and enforce zero-sum at transaction commit; immutability | DBA + Economy |
| ECON-03 | Nonnegative funds | Concurrent purchase and wallet holds; locking strategy and reconciliation | DBA + QA |
| ECON-04 | Shop prices & stock | Offer revision snapshot, capacity, per-user limit, atomic stock decrement | Economy + Backend |
| ECON-05 | Receipts/refunds | Refund through compensating ledger+inventory events; deterministic idempotency | Economy + Privacy |
| ECON-06 | Marketplace | OFF for minors and excluded from current P1 official-shop schema | Product + Safety |
| ARCH-01 | KingDragonHub auth & RLS | Stable external subject, org membership and guardian identity not verified | Host owner + Security |
| ARCH-02 | RLS scope | Roles/grants, service vs migration owner, composite tenant FK rules | DBA + Security |
| ARCH-03 | Migration rollout | Split education / competition / commerce with expand→switch→contract and restore | Release Manager |

**Stop conditions:** no UI/AI writer directly to SQL; no live children/grade/financial-like balances until tested least privilege; no claim ledger is safe based solely on an ERD; full-platform 159 logical candidates do not become one migration by default.
