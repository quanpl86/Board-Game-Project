# BGU-PD — Detailed Execution Plan (proposal, 2026-10-11)

**Status:** DRAFT / awaiting Human Product Owner review. **Timezone:** Asia/Ho_Chi_Minh.
**Repository:** https://github.com/quanpl86/Board-Game-Project
**Maintainer:** BGU-PD (planning role; not proof that an autonomous Agent runtime exists).
**Authority:** planning and draft PR only. This file does NOT approve a change in the existing Master Roadmap, milestone dates, product scope, physical database freeze, merging, staging, production, data access, student PII, wallet/score, or Agent assignment.
**Source priority:** GitHub PR/Issues/commits/CI > human-verified staging > human-verified production > plans and role descriptions.
**Reference:** AGENTS.md; docs/agents/PROJECT_DIRECTOR_RUNBOOK.md; docs/agents/USER_INTERACTION_PROTOCOL.md; docs/agents/QUALITY_GATES.md; docs/roadmap/MASTER_ROADMAP.md; docs/product/PRE_SCHEMA_FREEZE_DECISIONS.md; docs/database/p1/DECISION_REGISTER.md.
**Status snapshot:** [BGU-PD GitHub baseline](./BGU_PD_BASELINE_2026-10-11.md); [proposed machine-readable work packages](./BGU_PD_WORK_PACKAGES_2026-10-11.json).

## 1. Goal / boundaries
Create an inspectable DEV/CI vertical-slice implementation plan; preserve the long-range phase roadmap. Short sprints below are **proposed internal planning windows**, not delivery commitments. The accepted Phase 0-5 roadmap is NOT replaced. No real student data or production accounts/transactions. The first **MVP capability** is a demonstrable KingDragonHub-compatible Game Hub -> authenticated/scoped session (once SSO approved) -> deterministic Gomoku -> server-authoritative room -> replay -> API persistence -> QA on isolated staging. A separate student/commerce stream remains gated and is not prerequisite for a guest-safe demo unless Product Owner explicitly chooses otherwise.

### Planning assumption / forecast confidence
- Sprint windows assume at least 1 DBA, 1 Backend/Game engineer, 1 UX/Frontend engineer, 1 independent Security/QA reviewer and capacity for Product Owner review; **staffing is unverified**, so confidence **LOW** until named humans/capacity/SSO source are known.
- Use 2-week sprints beyond Sprint 0; reserve ~20–30% capacity for QA/security, integration, buffer. Limit WIP to two active tasks per executor.
- Default critical path: Host SSO evidence #9 -> principal/guardian/tenant decisions -> privacy/RLS approval -> persistence / authenticated APIs -> full staging. A game-rules isolated demo can progress in parallel.
- If SSO evidence is unavailable at Sprint 0 exit, run Game SDK/Gomoku with synthetic demo identities and no user PII while keeping all profile/economy APIs disabled; do not mislabel as authenticated MVP.
- Scope creep (new game count, social, public leaderboard, Coin shop) requires separate Product Owner decision and an updated roadmap PR.

## 2. Proposed sprint plan and exit gates
| Window (VN) | Goal / delivery artifacts | Existing Issues/PR | Exit checkpoint (all evidence-linked) | Human gate |
|---|---|---|---|---|
| S0 — 12–16 Oct 2026 | Audit issue/task owners and CI; freeze **reporting baseline only**, resolve review queue; gather host SSO evidence; define machine-readable delivery ledger | #15; #9; PR #21 #25 #27; #22 #26 #28 | PR review requests recorded; each blocker has owner role+unblock action; CI results on current head or UNKNOWN; 3 architecture/security decisions scoped for review | Product Owner confirms working sprint dates, actual assignees, deployment/SSO owner |
| S1 — 19–30 Oct | Finish independent DEV/CI DB design reviews, record migration order/restore, define least-privilege tenant/guardian policies and typed read-only API contracts | #10; #20; #21/#22; #25/#26; #27/#28; #9 | DB FK and negative RLS tests, P0 -> P1-A -> P1-D order/replay, DBA+SEC review; no unverified live auth | Human DBA, Security and PO sign off schema/security; branch PR merges separately authorized |
| S2 — 02–13 Nov | Implement candidate vertical slice: shared tokens + responsive Game Hub, deterministic Game SDK and Gomoku, API contract and isolated authoritative room prototype | #7; #11; #12; #16; #9 | Unit/property rule tests for illegal turns, win/draw, replay; typecheck/build; UX responsive 390/768/1024/1440; permission-denial checks; no direct score writes | UX/Brand, Game/Arch, QA independent review |
| S3 — 16–27 Nov | Student/Character/Inventory contract & tests in DEV/CI, guarded read-only profile view as authorized; Coin/Shop ledger candidate only after human policy signoff | #24; #26; #28; #20; #9 | Ownership provenance, rig/license/slot, privacy defaults; concurrency/zero-sum/idempotency tests for any ledger candidate; disabled unsafe endpoints | PO, DBA, SEC/Privacy and economy reviewer; no spending/reward deployment |
| S4 — 30 Nov–11 Dec | Integration, QA, staging rehearsal only if approved; browser E2E, safe tenant separation, reconnect, backups, rollback and observability | #14; #16; #13; #9 | CI from exact SHA, Playwright/API/DB smoke, staging health and rollback evidence, release checklist; if staging is not approved mark NOT_RUN | Release Manager, Security, Product Owner decide subsequent Go/No-Go |
| Post S4 — unscheduled | UAT decision, separate release plan and D+1/D+7 checks | #14 and release gates | Production verification only from deployment ID+health+telemetry after independently approved rollout | Explicit authorized production approval required |

**Conflict handling:** Existing MASTER_ROADMAP.md remains authoritative for broader Phase 0–5 direction. Candidate dates are not due dates in Issues, may move if SSO, staffing, test infrastructure, or product decisions remain unknown.

## 3. Deliverable-level task graph (proposed work packages, NOT assigned GitHub users)
| Work package | Existing ledger | Executor role -> Independent review | Depends on | Outcome / measurable acceptance | Risk |
|---|---|---|---|---|---|
| WP-01 Delivery evidence + board | #15 | BGU-PD -> Human PO | GitHub access | Verified owner, risk, URL, status; no invented Agent runtime | R1 |
| WP-02 Host SSO & route audit | #9 | BGU-ARCH + BGU-UX -> BGU-SEC + PO | host owner/source | OIDC issuer/audience/subject, guardian+tenant mapping, routing ADR; evidence from real host | R3 |
| WP-03 P0 schema freeze review | #10 / PR #18 | BGU-DBA -> BGU-SEC + human DB owner | WP-02 for RLS allow policies | integrity, least privilege, rollback/restore report; PR merge is not freeze | R4 |
| WP-04 Education P1-A | #22 / PR #21 | BGU-DBA + BGU-EDU -> BGU-SEC + QA | P0; WP-02 for use of live data | 11 tables in isolated Postgres; negative role/grade/tenant tests, migration order | R4 |
| WP-05 Student Universe design | #26 / PR #25 | BGU-DBA + BGU-ARCH -> BGU-SEC + PO | P0/P1 design; guardian policy | 22-table candidate reconciled, data minimization and owner mapping, decision log | R4 |
| WP-06 Student/Character P1-D | #28 / PR #27 | BGU-DBA + BGU-3D -> BGU-SEC + QA | WP-05; rig catalog uniqueness; migration order | 6-table isolated candidate, verified RLS default deny, asset rights/version checks | R4 |
| WP-07 Commerce P1-C | #24 | BGU-DBA + BGU-BACK -> BGU-SEC + economy reviewer | WP-06; PO ECON decisions | atomic inventory, ledger zero-sum by currency, concurrency, no student transfer | R4 |
| WP-08 Competition P1-B | #23 | BGU-DBA + BGU-LIVEOPS -> BGU-SEC + QA | scoring policy, P1-A review | append-only verified score and correction; private grades not public rank | R4 |
| WP-09 Game SDK / Gomoku | #11 | BGU-GAME + BGU-BACK -> BGU-ARCH + QA | bootstrap #7; contract version | deterministic legal moves, win/draw, replay hash, game-independent SDK | R2 |
| WP-10 Brand shell / frontend | #12 | BGU-UX + BGU-UI -> Brand owner + QA | bootstrap #7; host audit for exact fidelity | responsive demo catalog + error/empty/offline states, accessibility, screenshots | R2 |
| WP-11 API/realtime integration | #7, #11, #9 | BGU-BACK -> BGU-SEC + QA | WP-09; WP-02 for real auth; reviewed schema | role-scoped APIs, authoritative game room, replay/reconnect, no raw SQL tool | R3 |
| WP-12 MCP safe read-only | #13 | BGU-MCP -> BGU-SEC + QA | WP-02 & P0 audit/outbox | OAuth/scope/tenant tests before catalog.read; all writes disabled | R3 |
| WP-13 CI / QA | #16 | BGU-QA -> BGU-SEC + Release | relevant code candidates | PR SHA-linked unit/contract/Playwright/DB evidence and failure history | R2 |
| WP-14 Staging/rollback | #14 | BGU-RELEASE -> BGU-SEC + human Release Manager | signed host/SSO/migration review | isolated staging smoke, restore and rollback rehearsal, no production | R3 |

### Task handoff format
For each WP use: task ID, Issue/PR URL, exact approved outcome, affected F01–F20 flow / screen ID from docs/design/MASTER_SCREEN_INVENTORY_V2.md, skill IDs per docs/agents/SKILL_ROUTER.md, GitHub username (when real), executor role, independent reviewer, R0–R4, dependencies, acceptance Given/When/Then, data classification, tests+artifacts, rollback, PR head SHA. A role is **not** a real assignee. Do not write a task as ACTIVE merely because its Issue exists.

## 4. Critical path / parallelism
- Lane A (DB / SEC): WP-02 -> WP-03 -> WP-04 + WP-05 -> WP-06 -> WP-07 (Commerce gated). WP-08 independent of Commerce but needs scoring decisions.
- Lane B (Game): WP-09 -> game-authoritative part of WP-11 -> WP-13.
- Lane C (UX): WP-10 -> browser/visual part of WP-13; host fidelity depends on WP-02.
- Lane D (Ops): WP-01 -> checkable reports; WP-14 waits on approved hosting and QA. MCP WP-12 cannot be called running until OAuth + audit + durable runtime proven.
- No issue automation, no production release and no messages to external parties are triggered by this plan.

## 5. Three blockers and escalation actions
| Blocker | Impact | Owner **role** / concrete next action | Escalate when |
|---|---|---|---|
| B1 — Host SSO unknown, issue #9 | Cannot enable guardian/teacher/student auth, tenant RLS allow policies, or full signed-in API | BGU-ARCH + Host owner: supply authorized source, issuer/audience/subject, session, tenant and guardian lifecycle; BGU-SEC verifies | No evidence at S0 exit: reforecast Sprint 1 and require PO choice demo-only vs delay |
| B2 — DB reviews #21/#25/#27 | Stacked #27 depends on #25; cannot claim merged or stable P1 physical schema | BGU-DBA: review #25 design then #27 migration, review #21 independently; Human PO+SEC confirm migration order and policy | Unreviewed for >2 working days after an actual review request |
| B3 — Inventory/Coin #24 | No live wallet/shop; double-spend and asset/provenance risks | BGU-DBA + BGU-BACK: draft dev-only atomic ledger/stock/ownership tests; get ECON-01–06 PO choice before writes | Test failures, mismatched inventory, attempted production mutation = stop |

## 6. Quality gates and status semantics
Statuses: PROPOSED (document only) -> DRAFT (branch not PR) -> IN_PR (open/draft PR) -> MERGED (GitHub merged) -> STAGING_VERIFIED (observed staging URL+SHA+test report) -> PRODUCTION_VERIFIED (approved deployment+SHA+telemetry). BLOCKED is an orthogonal label with reason. CI_PASS is evidence, **not** equivalent to MERGED.
- Q0: PO approval on scope; Q1: architecture/domain invariants; Q2: Brand; Q3: actual tests; Q4: privacy/security; Q5: independent review+CI; Q6: staging+rollback; Q7: exact production authorization; Q8: D+1/D+7.
- Do not auto-set finish on PR open. Under missing GitHub source or CI status write UNKNOWN/NOT_CHECKED, never PASS.
- DB schema: clean + upgrade tests, FK, RLS deny-allow, concurrent operations and restore. Game: seed/replay, invalid moves and reconnect. UI: 390/768/1024/1440, keyboard/contrast. MCP: approval token, JWT audience, scoped principal, audit/idempotency/injection tests.

## 7. Evidence ledger, KPIs and daily/weekly cadence
For each check-in capture Asia/Ho_Chi_Minh timestamp, GitHub HEAD SHA, PR open+merged delta, Issues open+blocked+assignee/overdue (only if due date exists), workflow run ID/conclusion, staging URL if observed, production deployment proof if observed.
Core metrics: aged PRs >2 working days since review request; critical-path blocked count; failed CI on head SHA; test coverage by subsystem **only when measured**; throughput merged PRs; WIP per verified assignee; staging successful run count. No fabricated overall completion percentage.
The previously requested 08:00 daily and Friday weekly cadence is a **reporting expectation** only in this file; actual scheduler activation/health is independent and must be verified, not assumed from repo docs. No automatic notification was sent.

## 8. Human Product Owner decisions (not pre-approved by this file)
1. **Sprint planning / staffing:** approve proposed dates and identify actual GitHub assignees/capacity; fallback: keep milestone windows tentative.
2. **SSO:** authorize read-only access to real KingDragonHub host design/auth evidence and nominate host owner. No credential sharing into repo.
3. **MVP release scope:** Option A: early demo Gomoku without real students/Coins while SSO blocked (recommended); Option B: hold demo until full SSO+RLS; choose explicitly. Neither permits production launch.

## 9. Immediate 24–48h actions / source links
- BGU-PD / #15: publish proposal PR; show role-only ownership and flagged unassigned GitHub users; review queue linked; do not rewrite issue milestones.
- BGU-ARCH + SEC / #9: issue-specific evidence checklist and exact host owner request.
- BGU-DBA + SEC / PR #21, #25, #27: independent review and migration graph; prevent duplicate commerce.avatar_rigs; report tests from current HEAD.
- BGU-GAME / #11 and BGU-UX / #12: draft independent game rules and UI contracts on dev branches only; existing real implementer/runtime is not verified.
- BGU-QA / #16: establish CI evidence matrix; separate green design checks from runtime/e2e verification.

All existing issue numbers in this plan refer to https://github.com/quanpl86/Board-Game-Project/issues; PR references resolve at /pull/<number>. Changes to scope, deadlines, owners, merging, production or sensitive data require distinct authorized actions.
