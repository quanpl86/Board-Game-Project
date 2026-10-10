# Delivery Plan, Acceptance & Test Matrix — Economy + Avatar + Rankings
**Status:** Proposed incremental roadmap, dates depend on staffing and platform core.

## Scope waves
| Release | Dependencies | Deliverables | Gate |
|---|---|---|---|
| E0 — Foundations | Identity, game result, asset versions, authz, outbox | catalog taxonomy, item/asset link contracts, rig spec, economy data model, UI specs | schema+policy review |
| E1 — Cosmetic MVP | E0, Game Hub profile, CDN | earn-only coins, official 20–30 items, inventory, avatar editor 2D fallback + 3D preview, equip preset, item rewards | transactions safe, cross-game preview |
| E2 — Recognition | E1, verified scores, competitions | team/game/season leaderboards, Hall of Fame approvals, award trophy/frame items, private education rubrics | fairness, verified evidence, minor privacy |
| E3 — LiveOps Shop | E1/E2, CMS, scheduler, MCP approval | seasonal collections, offer revisions, stock, featured hero, entitlement/audience targeting | approval, no stale price or unsafe offers |
| E4 — Trade Beta | E1–E3, safety/legal review, anti-fraud | fixed-price adult restricted listings, escrow, transaction reconciliation, disputes, moderator console | concurrency, no negative balances, child access denied |
| E5 — Creator Ecosystem | E4 and rights/contracts | approved creator cosmetic publications, royalty policy if applicable | separate commercialization review |

## UAT / automated tests
**Inventory & shop**
1. Buy same offer twice with same idempotency key → exactly one order/grant/charge.
2. Two users buy final stock item at same moment → only one transaction succeeds.
3. Insufficient earned coins → no item and no debit.
4. User tries to equip someone else's instance → authorization denied.
5. Hat vs hair/full mascot conflict → controlled fallback/preview, not geometry corruption.
6. Restore profile/reconnect → same pinned item version and loadout.
7. Sold/suspended/unavailable item has clear UX state.
8. Item publisher tries to overwrite immutable published version → rejected.
9. Nonexistent GLB returns 2D thumbnail, no game crash.
**Economy/trade**
10. Concurrent buy of one listed instance → exactly one buyer receives it.
11. Listing seller attempts equip/sell elsewhere during escrow → blocked or resolves per approved policy.
12. Trade canceled/expired → item owner/holds restored deterministically.
13. Ledger debits/credits balance per currency, no negative spendable balance.
14. Refund/correction creates compensating entries; original receipt remains auditable.
15. Minor attempts market browse/create/buy with restricted policy → denied server-side.
16. Fraud alert does not leak minor personal data to general AI Agent.
**Ranking/Honors**
17. Unverified client-reported win cannot affect ranking.
18. Score worker retries → no duplicate rank rewards.
19. Corrected/frozen season recalculation produces explainable standings.
20. Public Hall of Fame does not reveal private academic grades or real names of under-age student.
21. Missing approval or expired consent prevents public honor publication.
**MCP/Content**
22. Agent can create draft but cannot publish shop without approved revision.
23. Scheduled seasonal offer expires and fallback collection loads.
24. Theme changes cannot override accessible text/background contrast rules.
25. Price changed after purchase preview requires new confirmation at updated revision.

## QA metrics
Shop checkout success rate, stock consistency errors, ledger reconciliation drift (target zero), item load/render time, asset compatibility defects, marketplace fraud review backlog, leaderboard update latency, honors publication retractions, agent policy denials and mobile navigation coverage.

## Decisions to ratify
- Currency naming, earning caps, expiry and shop audience rules.
- Rig family, item slot data format and fallback policy.
- Exact item initial collection artwork/rights and pet movement restrictions.
- Hall of Fame minor consent and display policy.
- Marketplace launch jurisdiction, account eligibility and anti-fraud thresholds.
- Native KingDragonHub source CSS/auth integration contract.
