# BGU-PD — GitHub Progress Baseline — 2026-10-11

**Checked:** 2026-10-11 approximately 11:56 Asia/Ho_Chi_Minh (UTC+7). **Source:** GitHub connector searches + file fetch of main documents. This is a point-in-time snapshot; recheck head SHAs/CI before decisions.
**Repository:** https://github.com/quanpl86/Board-Game-Project

## What is actually observable
- Main branch content accessible: AGENTS.md, docs/agents/PROJECT_DIRECTOR_RUNBOOK.md, docs/agents/USER_INTERACTION_PROTOCOL.md, docs/roadmap/MASTER_ROADMAP.md and registered governance/docs.
- Latest returned main history includes merged P0 schema commit  b3ec15e91b670823163e0c1672b88311c52054b6 and P1 design commit 5e389cd96764955071c21a3102563e0fcc4782b6 from 2026-10-10. Commit search is not proof of HEAD unless branch ref is checked.
- [PR #21](https://github.com/quanpl86/Board-Game-Project/pull/21) Education 11-table PostgreSQL candidate: OPEN; DEV/CI candidate, not staging.
- [PR #25](https://github.com/quanpl86/Board-Game-Project/pull/25) Student Universe 22 NEW candidate tables: OPEN, design-only, NOT merged.
- [PR #27](https://github.com/quanpl86/Board-Game-Project/pull/27) Student/Character physical 6-table candidate: OPEN, stacked on #25. Issue #28 claims four successful CI workflows on commit b9ec524561362de12cc0392b2a5d3c961aa6e80c; **this scan did not independently recheck all current HEAD run conclusions**.
- P0 physical 30 tables in main via [PR #18](https://github.com/quanpl86/Board-Game-Project/pull/18); P1 39-table design through [PR #19](https://github.com/quanpl86/Board-Game-Project/pull/19). "Merged design" is not an applied P1 production migration.
- [Issue #9](https://github.com/quanpl86/Board-Game-Project/issues/9) host SSO evidence unresolved; [#24](https://github.com/quanpl86/Board-Game-Project/issues/24) Commerce candidate migration not implemented; [#15](https://github.com/quanpl86/Board-Game-Project/issues/15) project board/reporting proposed.
- GitHub Issues search did not return verified actual usernames/assignees or issue due dates. Executor roles in issue descriptions are proposals; no proof of actively running Agents.
- Master Roadmap is draft, milestone-driven; no evidence here of PO-approved new sprint dates, deployed staging/prod, operational Coin/shop, or real student data API.
- CI execution status on the exact head of every open PR, GitHub Project board availability, staging telemetry, production telemetry and schedule runtime: **NOT_INDEPENDENTLY_VERIFIED in this scan**.

## Evidence status glossary
| Status | Meaning | Observed |
|---|---|---|
| DESIGN_MERGED | document merged, not executable deployment | P1 design #19 |
| DEV_CI_MERGED | candidate SQL merged, tests can run isolated | P0 #18 |
| IN_PR | branch exists / open PR, NOT merged | #21, #25, #27 |
| CI_PASS_REPORTED | Issue states runs pass, source HEAD run not independently checked | #27 via Issue #28 |
| STAGING_VERIFIED | requires observed staging build + tests | no evidence |
| PRODUCTION_VERIFIED | requires approved release + real telemetry | no evidence |
| AGENT_RUNTIME | running executor with run IDs | not verified |

## Risks and owner action
1. Critical path: SSO host auth/guardian, #9 -> BGU-ARCH/SEC + actual host owner. Evidence: issuer, claims, tenant policies, ADR.
2. DB PR review: #21 and stacked #25 -> #27 -> BGU-DBA, SEC, independent human. Evidence: reviewer decisions, exact head CI, migration order and restore.
3. Commerce: #24 -> BGU-DBA/BACK, human economy approval. Evidence: proposed inventory/ledger dev tests and zero production writers.
4. Reporting: #15 -> BGU-PD with Product Owner review. No Project board URL or real runtime verified here.

## Recommended next snapshot checks
Fetch current main ref and PR head SHAs; fetch GitHub Actions runs by exact commit; inspect Github Issues assignees/reviewers, public due dates if provided, deployment environments/release records; inspect any approved scheduled tasks separately. If unavailable, retain UNKNOWN.
