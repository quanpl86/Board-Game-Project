# Full-Platform Database Relationship Blueprint (beyond P0)
**Status:** PROPOSED LOGICAL MAP; **not SQL**, not physical migrations, and not a substitute for detailed per-table P1/P2 dictionary.
**Source:** `docs/architecture/DATABASE_DATA_DICTIONARY.md` (159 logical entries plus AI/MCP addendum), `docs/economy/ECONOMY_INVENTORY_DATA_MODEL.md`, `docs/architecture/DB_FREEZE_READINESS_V2.md`.
**P0 physically modeled and tested:** [30 tables + per-table ERD](README.md).

## Coverage and refinement plan
The full program includes education, social, competition, economy/avatars, 3D persistent worlds, game-creation and AI workflows. Their candidates should be documented here as explicit *future relationship proposals*, **not declared SQL FKs**. Each later migration must have its own precise one-table-one-diagram datasheet, edge cases, RLS policy, index and transactional tests similar to the 30-table P0 set.

### P1 — Education & Classroom
```mermaid
erDiagram
  ORGANIZATIONS ||--o{ ACADEMIC_TERMS : schedules
  ORGANIZATIONS ||--o{ CLASSES : owns
  ACADEMIC_TERMS ||--o{ CLASSES : includes
  CLASSES ||--o{ CLASS_ENROLLMENTS : holds
  USERS ||--o{ CLASS_ENROLLMENTS : attends
  COURSES ||--o{ COURSE_UNITS : groups
  COURSE_UNITS ||--o{ LESSONS : contains
  LESSONS ||--o{ LESSON_OBJECTIVES : has
  LESSONS ||--o{ LEARNING_ACTIVITIES : provides
  CLASSES ||--o{ ASSIGNMENTS : assigns
  ASSIGNMENTS ||--o{ LEARNING_ATTEMPTS : tracks
  USERS ||--o{ LEARNING_ATTEMPTS : submits
  LEARNING_ATTEMPTS ||--o{ LEARNING_EVIDENCE : yields
  RUBRICS ||--o{ RUBRIC_CRITERIA : defines
  RUBRIC_CRITERIA ||--o{ RUBRIC_ASSESSMENTS : measures
  LEARNING_ATTEMPTS ||--o{ RUBRIC_ASSESSMENTS : assessed_by
```
**Decisions needed:** class membership rollover vs history, group assignment recipients, guardian access, rubric revision pin; teacher authority must not be inferred from public profile. Any match-based learning evidence must reference verified match/version, not client claims.

### P1 — Events, Competition, Leaderboard & Honors
```mermaid
erDiagram
  ORGANIZATIONS ||--o{ EVENT_PROGRAMS : organizes
  EVENT_PROGRAMS ||--o{ EVENT_REGISTRATIONS : accepts
  EVENT_PROGRAMS ||--o{ TOURNAMENTS : hosts
  TOURNAMENTS ||--o{ TOURNAMENT_ROUNDS : contains
  TOURNAMENT_ROUNDS ||--o{ TOURNAMENT_FIXTURES : schedules
  TOURNAMENT_FIXTURES ||--o{ FIXTURE_MATCHES : aggregates
  MATCHES ||--o{ FIXTURE_MATCHES : plays
  MATCH_RESULTS ||--o{ SCORE_RECORDS : proves
  RANKING_METRICS ||--o{ SCORE_RECORDS : types
  SCORING_POLICIES ||--o{ LEADERBOARDS : governs
  LEADERBOARDS ||--o{ LEADERBOARD_ENTRIES : projects
  LEADERBOARDS ||--o{ LEADERBOARD_FREEZES : snapshots
  TOURNAMENT_FIXTURES ||--o{ TOURNAMENT_DISPUTES : appeals
  ACHIEVEMENTS ||--o{ ACHIEVEMENT_GRANTS : grants
  USERS ||--o{ ACHIEVEMENT_GRANTS : earns
```
**Decisions needed:** rank tie break/order, audience anonymity for minors, rank vs wallet XP distinction, result correction ledger, dispute holds, Hall-of-Fame editorial approval. Entries are projections: source is append-only score records with policy version.

### P1 — Avatar, Official Shop & Economy
```mermaid
erDiagram
  ITEM_DEFINITIONS ||--o{ ITEM_VERSIONS : versions
  ASSET_VERSIONS ||--o{ ITEM_VERSION_ASSETS : renders
  ITEM_VERSIONS ||--o{ ITEM_VERSION_ASSETS : uses
  ITEM_VERSIONS ||--o{ INVENTORY_INSTANCES : instantiated_as
  USERS ||--o{ INVENTORY_INSTANCES : owns
  USERS ||--o{ AVATAR_LOADOUTS : configures
  AVATAR_LOADOUTS ||--o{ AVATAR_LOADOUT_ITEMS : equips
  INVENTORY_INSTANCES ||--o{ AVATAR_LOADOUT_ITEMS : referenced_by
  AVATAR_RIG_DEFINITIONS ||--o{ AVATAR_LOADOUTS : compatible_with
  ITEM_VERSIONS ||--o{ SHOP_OFFERS : offers
  SHOP_OFFERS ||--o{ SHOP_ORDERS : purchased_via
  USERS ||--o{ SHOP_ORDERS : buys
  LEDGER_TRANSACTIONS ||--o{ LEDGER_ENTRIES : consists_of
  LEDGER_ACCOUNTS ||--o{ LEDGER_ENTRIES : posts
  SHOP_ORDERS ||--o{ LEDGER_TRANSACTIONS : settled_with
```
**Decisions needed:** item slot conflict graph (hair/face/head/hands/legs/suit/pet/profile), ownership instance vs stack, bound vs transferable, non-negative balanced currency and atomic order/stock/grant; no pay-to-win, no child peer trading. **No P0 wallet table** was added before owner signs closed-loop Coin policy.

### P1/P2 — Community and Safety
```mermaid
erDiagram
  USERS ||--o{ TEAM_MEMBERSHIPS : joins
  TEAMS ||--o{ TEAM_MEMBERSHIPS : has
  TEAMS ||--o{ TEAM_INVITATIONS : invites
  CHAT_CHANNELS ||--o{ CHANNEL_MEMBERSHIPS : contains
  USERS ||--o{ CHANNEL_MEMBERSHIPS : belongs
  CHAT_CHANNELS ||--o{ CHAT_MESSAGES : records
  USERS ||--o{ CHAT_MESSAGES : sends
  CHAT_MESSAGES ||--o{ MESSAGE_REACTIONS : receives
  COMMUNITY_SPACES ||--o{ COMMUNITY_POSTS : hosts
  COMMUNITY_POSTS ||--o{ POST_COMMENTS : comments
  COMMUNITY_POSTS ||--o{ POST_ATTACHMENTS : attaches
  MODERATION_REPORTS ||--o{ MODERATION_CASES : escalates
  MODERATION_CASES ||--o{ MODERATION_ACTIONS : resolves
```
**Safety gates:** minor closed channels only, structured moderation evidence retention, no arbitrary open stranger messages. Polymorphic report target requires explicit typed target/check constraints or bridge tables, not an unvalidated generic FK.

### P1 — CMS, Themes, Notifications
```mermaid
erDiagram
  CONTENT_TYPES ||--o{ CONTENT_ITEMS : validates
  CONTENT_ITEMS ||--o{ CONTENT_REVISIONS : versions
  CONTENT_REVISIONS ||--o{ CONTENT_PUBLICATIONS : publishes
  SITE_SLOTS ||--o{ SLOT_PLACEMENTS : places
  CONTENT_PUBLICATIONS ||--o{ SLOT_PLACEMENTS : renders
  THEMES ||--o{ THEME_REVISIONS : versions
  THEME_REVISIONS ||--o{ THEME_ASSIGNMENTS : targets
  CAMPAIGNS ||--o{ CAMPAIGN_REVISIONS : versions
  CAMPAIGN_REVISIONS ||--o{ CAMPAIGN_PUBLICATIONS : schedules
  NOTIFICATION_TEMPLATES ||--o{ NOTIFICATIONS : renders
  USERS ||--o{ NOTIFICATIONS : receives
  NOTIFICATIONS ||--o{ NOTIFICATION_DELIVERIES : dispatched
```
**Gates:** exact approved revisions; priority resolution/timezone; no unrestricted CMS CSS/JS; audience/guardian targeting; immutable publication audit and rollback.

### P2 — Persistent 3D Worlds and Creator
```mermaid
erDiagram
  GAME_VERSIONS ||--o{ VIRTUAL_WORLDS : instantiates
  VIRTUAL_WORLDS ||--o{ WORLD_REVISIONS : versions
  WORLD_REVISIONS ||--o{ WORLD_CHUNKS : partitions
  VIRTUAL_WORLDS ||--o{ WORLD_ENTITIES : contains
  ASSET_VERSIONS ||--o{ WORLD_ENTITIES : instances
  WORLD_REVISIONS ||--o{ SIMULATION_RUNS : evaluated_by
  SIMULATION_MODELS ||--o{ SIMULATION_RUNS : computes
  VIRTUAL_WORLDS ||--o{ WORLD_COLLABORATORS : permits
  CREATOR_PROJECTS ||--o{ CREATOR_PROJECT_REVISIONS : versions
  CREATOR_PROJECT_REVISIONS ||--o{ CREATOR_PUBLICATIONS : submitted
  CREATOR_PUBLICATIONS ||--o{ CREATOR_REVIEWS : reviewed
  UGC_LICENSES ||--o{ CREATOR_PUBLICATIONS : licenses
```
**Gates:** deterministic simulation/replay, storage budgets, state schema migration, licensing/provenance and moderation of user-created games.

### P2 — Coding Judge, Agent Automation & Reliability
```mermaid
erDiagram
  CODING_PROBLEMS ||--o{ CODING_PROBLEM_VERSIONS : versions
  CODING_PROBLEM_VERSIONS ||--o{ CODING_TEST_SETS : tests
  CODING_PROBLEM_VERSIONS ||--o{ CODING_SUBMISSIONS : receives
  USERS ||--o{ CODING_SUBMISSIONS : submits
  CODING_SUBMISSIONS ||--o{ JUDGE_RUNS : executed
  JUDGE_RUNS ||--o{ JUDGE_CASE_RESULTS : produces
  AUTOMATION_WORKFLOWS ||--o{ AUTOMATION_WORKFLOW_VERSIONS : versions
  AUTOMATION_WORKFLOW_VERSIONS ||--o{ AUTOMATION_RUNS : scheduled
  AUTOMATION_RUNS ||--o{ AUTOMATION_RUN_STEPS : has
  AUTOMATION_APPROVALS ||--o{ AUTOMATION_RUN_STEPS : gates
  DOMAIN_OUTBOX ||--o{ DOMAIN_INBOX : consumed_by
```
**Gates:** isolated judge runner, private testsets, secure immutable tool approval exact hash, idempotent durable runs. The AI/MCP addendum has separate conceptual registry; reconcile names/ownership before later schema release.

## Relationship correctness rules for future per-table ERDs
1. A Mermaid arrow is an **expected conceptual association**, not a real FK until a migration declares exact constrained columns.
2. Multiplicity in draft diagrams must be reviewed against policy; cross-tenant membership and result projection may need bridge tables.
3. Each new approved physical table must have exactly one `docs/database/tables/<schema>.<table>.md` datasheet with DDL, keys, inbound/outbound FK arrows, data classification, owner, indices, state machine and test evidence.
4. Backwards compatibility with released rooms/replays/ownership takes priority over adding speculative columns.
5. Never copy sample diagram as SQL; physical migration and SSO/privacy/retention approval are separate gates.
