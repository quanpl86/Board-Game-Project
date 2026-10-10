# P1 Cross-Layer Responsibility — Database / Backend / Frontend
**Status:** DESIGN ONLY — No P1 tables in running database, no UI route or API endpoint is asserted as implemented.
**Reference:** `db/schema/p1_candidate_tables.json`, `docs/database/p1/diagrams/Board_Game_Universe_P1_Editable.drawio`, affected per-table datasheets. P0 tables remain SQL-source-of-truth for existing foundation.

| Journey | P1 planned aggregates | P0 verified domain reference | Backend service (proposed) | Frontend view and states (proposed) |
|---|---|---|---|---|
| Teacher creates class | `education.academic_terms/classes/class_enrollments` | `tenancy.organizations`, `identity.users` | ClassService: guardian/teacher/member checks, roster scope | Class list, invite/consent, empty/unauthorized states |
| Teacher assigns lesson | `courses/lessons/rubrics/rubric_criteria/assignments` | `publishing.content_revisions` | LearningService: pinned lesson+rubric revision, class auth | Course, lesson, rubric, assign wizard |
| Student plays & submits | `learning_attempts/learning_evidence` | `gameplay.match_results/match_commands` | EvidenceService: verified result & student enrollment | Student task, submit, retry, pending verification |
| Teacher assesses | `rubric_assessments` | `identity.users` | RubricService: teacher authorization and immutable revision | Gradebook private by default, review/change history |
| Event registration | `competition.event_programs/tournaments/tournament_registrations` | `tenancy.organizations`, `catalog.game_versions` | TournamentService: eligibility/guardian policy | Event details, registration and restriction |
| Fixture & results | `tournament_rounds/tournament_fixtures/fixture_matches` | `gameplay.matches/match_results` | FixtureService: authoritative game-version match, referee confirmation | Bracket/schedule, live, no-show, dispute |
| Ranking | `scoring_policies/score_records/leaderboards/leaderboard_entries` | `gameplay.match_result_entries` | ScoringService creates append-only records; projection worker rebuilds ranks | Rank filters, timestamp, corrected/frozen/private |
| Honor | `hall_of_fame_entries` | `identity.users` | HonorReviewService: verify nomination, human approval, withdrawal | Curated public gallery with minor-safe display |
| Avatar assets | `avatar_rigs/item_definitions/item_versions/item_version_assets/item_slot_rules` | `assets.asset_versions` | CosmeticCatalogService: rig, license, approved asset and published hash | Shop item card, GLB preview, compatibility warnings |
| Closet | `inventory_instances/avatar_loadouts/avatar_loadout_items` | `identity.users`, `catalog.games` | InventoryService: owner, equip conflict and revoked item; game physics unchanged | Closet/equip/preset, 2D fallback |
| Coin | `currencies/ledger_accounts/ledger_transactions/ledger_entries` | `identity.users` | LedgerService: balanced immutable double-entry, nonnegative available funds, idempotency | Wallet/receipts; balance derived, not client authoritative |
| Official Shop | `shop_offers/shop_offer_revisions/shop_orders/shop_order_lines` | `identity.users` | ShopService: exact offer revision/stock+ledger+grant atomically | Purchase confirm, pending, success, insufficient funds |

## Mandatory constraints / Agent skill boundaries
- **BGU-DBA:** candidate columns and FK in manifest are not executable SQL; all P1 schemas need reviewed migrations and tenant RLS policy before API writes.
- **BGU-BACK:** generate typed read-models and exact command/event contracts from reviewed DB schema; do not read tables from browser. Enforce **active** organization membership, student privacy and human-approved economy rules.
- **BGU-UI + BGU-UX:** build screen states and typed contracts from approved service response; visual references are product specs, not proof of live data.
- **BGU-EDU:** rubric grade is academic private evidence; a match score does not automatically represent a learning standard.
- **BGU-LIVEOPS + BGU-GAME:** scoring uses verified match result and policy; leaderboard is projection, Hall of Fame curated separately.
- **BGU-MCP:** no direct SQL/economy/grade/rank tools; use scoped domain services and approval revision; propose/draft only.
- **BGU-SEC + BGU-QA:** verify adult/minor guards, cross-tenant roles, concurrency, refunds and transaction correctness before release.

## Implementation sequence
1. Product Owner/DBA/Security review P1 design, reconcile with P0 and true KingDragonHub SSO.
2. Freeze chosen slice only, e.g. Education first, with physical DDL+FK/composite constraints and default-deny RLS.
3. Implement authenticated app service, typed command/event, integration tests and cross-tenant denial.
4. Implement frontend view models and accessibility; only then enabled tenant-scoped operations.
5. Economy must pass ledger balances by currency + order/stock concurrency + inventory ownership transaction tests before any real shop toggle.
6. Competition must pin results/versions, support appeal correction, protect minor visibility before publication.

Do not treat the design artifacts as deployed or the 80 proposed FK edges as already enforced by PostgreSQL.
