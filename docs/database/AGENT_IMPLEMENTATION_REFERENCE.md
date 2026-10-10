# Database → Backend → Frontend: AI Agent Implementation Contract
**Status:** Draft P0 contract for review (not a working deployed API).
**Applies to:** BGU-PD, BGU-ARCH, BGU-DBA, BGU-BACK, BGU-UI, BGU-UX, BGU-MCP and BGU-QA.

## Mandatory reading order
1. `AGENTS.md` → `docs/agents/OPERATING_CHARTER.md` → assigned role and skill.
2. `docs/database/README.md` → [editable Draw.io and preview index](diagrams/README.md) → domain-specific ERD → affected table datasheet under `tables/`.
3. `db/schema/p0_tables.json` and `db/migrations/0001_p0_foundation.sql` to confirm actual columns, constraints, 49 FKs and indexes. **SQL and manifest must agree**, checked in CI.
4. `docs/database/DB_SECURITY_AND_MIGRATION_POLICY.md` and `docs/product/PRE_SCHEMA_FREEZE_DECISIONS.md`.
5. `docs/integration/KINGDRAGONHUB_AUTH_DISCOVERY.md`: SSO source unavailable; owner signoff pending.
6. Screen/source contract for the task: `docs/design/MASTER_SCREEN_INVENTORY_V2.md`, `docs/architecture/COMMAND_EVENT_CONTRACTS_V2.md`, `docs/product/END_TO_END_APP_FLOWS_V2.md`.

## Authority and boundaries
**Only a server-side domain application service** may perform database writes under scoped, authenticated principal. Next.js UI, game client, image/video generators and AI/MCP tools must **not connect directly to PostgreSQL or update wallet/scores**.
- DB migration owner != application runtime role; no P0 `CREATE POLICY` allow permissions until verified KingDragonHub SSO/tenant/guardian policies.
- All 30 P0 physical tables have RLS ENABLE+FORCE with zero read/write allow policies, preventing normal runtime access until reviewed; superuser/owner/BYPASSRLS exceptions mean app must never use those credentials.
- APIs must check verified user, active organization membership, action scopes, age/guardian policy (when applicable), resource ownership, version/ETag and idempotency.
- A **diagram arrow is not authorization** and does not imply the browser can fetch referenced table directly.
- R3/R4 production schema, bulk PII, scores, commerce and public AI publishing require separately recorded human approvals.

## Cross-layer table and API *proposal* matrix
| User journey | Physical tables P0 | Authoritative backend component (planned) | Frontend surface (planned) |
|---|---|---|---|
| F01 SSO | `identity.users`, `external_identities`, `profiles`, `guardian_links`, `policy_acknowledgments` | Identity Service: verified external subject → internal user ID | Onboarding/profile/privacy; do not parse identity from untrusted client |
| F01 Org permissions | `tenancy.organizations`, `organization_memberships`, `roles`, `permissions`, `role_permissions`, `role_assignments` | Tenant/IAM Service checks membership status and claims | Organization switcher, teacher/admin views filtered by API |
| F02 Catalog | `catalog.games`, `game_versions`, `assets.assets`, `assets.asset_versions` | Catalog Service returns **published** safe projection, version and approved asset refs | Game Library/Game Detail/card previews |
| F03 Rooms | `gameplay.game_rooms`, `room_memberships` | Lobby Service reserves active seat transactionally | Lobby, join/ready/rejoin/error |
| F04 Match | `gameplay.matches`, `match_participants`, `match_commands`, `match_snapshots` | Game Server validates action, pins exact version and emits player-specific view | Game board/HUD: view model only, no hidden state |
| F04 Result | `gameplay.match_results`, `match_result_entries` | Match Service finalizes exactly once, emits outbox event | Result/Replay screen, verified outcome only |
| F17 CMS | `publishing.content_items`, `content_revisions`, `content_publications` | CMS Service: publish only approved revision and audience | Page/announcement sections, approved copy |
| F19 MCP | `integration.agent_approvals`, `agent_invocations`, `audit_events`, `domain_outbox` | MCP Gateway via typed authorized domain tools and durable worker | Admin Approvals, Run History and audit viewer (no raw PII) |

`GET /v1/games` in current Foundation is **only seeded demo data**; other API names above are **proposals**, not implemented endpoints. Frontend must not display planned features as live.

## Engineering request / contract
Before coding, an Agent documents: user goal, flow/screen ID, exact table IDs and columns, outbound+inbound FKs from datasheet, tenant/guardian scope, authoritative command/result type, idempotency, retry, audit, data minimization, test and rollback.
- **DBA** owns physical relations/migrations; checks composite FK and query plan; makes no unreviewed production grants.
- **Backend** owns typed API/validation, transaction & outbox; never duplicates business rules across services; hidden game state redacted.
- **Frontend/UX** owns view models, loading/empty/error/access-denied/reconnect, tokens/a11y; consumes typed sanitized API, not SQL.
- **MCP** exposes narrow typed domain tools and human approval, not generic SQL or direct content/wallet edits.
- **QA** verifies negative auth, concurrency, replay, idempotency, visual and ERD parity; cannot report PASS if not run.

## Schema-change process
1. Open issue/PR with affected flow, owners and original diagrams.
2. Update SQL migration (or add an additive migration if already deployed) **and** manifest + affected per-table doc/ERD.
3. Run `node scripts/generate_db_diagrams.mjs`, commit regenerated Draw.io, 39 SVGs and two CSVs as a **single atomic review**.
4. Run `python scripts/check_db_schema.py`, `node scripts/generate_db_diagrams.mjs --check`, `python scripts/check_db_diagrams.py`, and isolated PostgreSQL CI smoke tests.
5. Reviewer compares exact FK graph with business rules and screens; Product Owner/DBA/Security approve before database freeze. Never update only a PNG/SVG and call schema changed.

## Upcoming scope: deliberately NOT physical P0
School/class/rubrics, tournament/ranking, wallet/ledger, avatar/inventory/shop, pet, marketplace, persistent 3D world, coding judge and creator studio belong to `docs/database/FULL_PLATFORM_RELATIONSHIP_BLUEPRINT.md` (proposed P1/P2). Each new physical table will need a real SQL declaration, migration, test, diagram, ownership, RLS/retention and application contract.

## P1 extension (design review only)
A full **proposed** model for Education, Competition, Inventory, Avatar and Official Shop now exists in [P1 Data Dictionary and Draw.io](p1/README.md). It contains 39 proposed tables and 80 planned FKs; unlike P0, **no P1 SQL migration or real API/Frontend implementation has been executed**. Follow [P1 cross-layer assignments](p1/CROSS_LAYER_IMPLEMENTATION.md), [human decision register](p1/DECISION_REGISTER.md) and source `db/schema/p1_candidate_tables.json` before implementing a feature. Do not route P1 API calls to nonexisting DB tables.
