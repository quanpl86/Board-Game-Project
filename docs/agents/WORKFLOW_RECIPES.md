# Multi-Agent Workflow Recipes — Assignment, Review and Publication
**Status:** Practical examples, not automatically executed.

## WF-01 UI screen — Game Hub / Teacher Dashboard
1. PD opens task with screen ID, KingDragonHub host integration constraints and acceptance.
2. UX loads `ux-flows` + `design-tokens` → wireframe/annotated states and device breakpoints.
3. COPY loads `ux-copy` → verified Vietnamese strings/empty/error/consent, i18n keys.
4. IMAGE (when needed) loads `image-production` → card/hero visual with rights and safe crop.
5. UI loads `react-frontend` + `iconography` → source and responsive tests.
6. QA reviews visuals at 1440/1024/768/390, keyboard/contrast, no duplicated KingDragonHub host header.
7. Human UX/Brand approves style → PR CI → merge → staging → release gate.

## WF-02 Database — Identity + Game Match or Coins
1. PRODUCT+ARCH clarify source-of-truth aggregate and F01/F04/F13 journey.
2. DBA loads `database-engineering` + `privacy-security` → ERD/constraints/migration and threat model.
3. BACK integrates domain API, command/event schema and outbox.
4. QA runs clean/upgrade DB tests, permission/RLS, race conditions and index plans.
5. Human DBA+security review. No direct production SQL by AI. Staging dry-run then gated release.

## WF-03 New Game — 2D Classic / Eco City Lab 3D
1. Product owner approves GDD and age/learning rules.
2. GAME loads `game-sdk`; 3D loads `blockbench-3d` if needed; EDU validates knowledge/rubric.
3. BACK creates authoritative room contract; UI builds game HUD, copy and fallback.
4. QA verifies deterministic replay, score source, reconnect, cross-device and hidden state.
5. Agent can only draft Game Manifest release; game publisher+release owner approve staged production.

## WF-04 Seasonal Festival — Image + Video + Shop + Competition
1. LIVEOPS proposes campaign/season/event independently; PD assigns scope and risk.
2. COPY writes Vietnamese brief, IMAGE renders covers/stickers, VIDEO storyboards lesson/promo, 3D produces GLB when needed.
3. Economy and Competition propose official cosmetic prize + scoring rules with distinct source evidence.
4. CMS previews audiences, schedule timezone, KingDragonHub token safety and publication slot conflicts.
5. Safety/privacy review minors, license and announcements; Human Content/Economy/Organizer approves exact revisions.
6. MCP durable worker publishes at approved time; PM reviews user participation and errors after release.

## WF-05 MCP tool/automation upgrade
1. ARCH+MCP define typed schema, principal/tenant, scope, idempotency, task status and approval requirements.
2. SEC threat-tests malicious tool content, prompt injection and forbidden privilege escalation.
3. QA runs tool contract and Agent Evaluation Suite scenarios including denied writes and stale approval.
4. Human reviewer authorizes staging and subsequent production; PM records run artifact, PR and followup.

## WF-06 Production incident
1. Observability detects real metric threshold, assigns incident, disables unsafe mutation if authorized.
2. RELEASE+SEC contain; DB/GAME/MCP specialists inspect affected domain without leaking private information.
3. Product Owner receives verified impact and rollback options, not false reassurance.
4. QA checks restored invariants and game session integrity. Postmortem adds new regression tests and updates skill/CI gate.

## WF-07 Weekly PM steering
1. Scheduled (once configured) read-only GitHub+CI scan.
2. PD collects role handoffs, compares sprint acceptance and decisions with status.
3. Output weekly report, 1–3 material human decisions and next sprint plan.
4. After owner responds, PD updates issues/ADR under authorized tools and notifies assigned roles; no unscheduled autonomous followup claims.
