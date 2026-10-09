# AI Agent Instructions — Board Game Universe

**This repo contains planning artifacts only. Do not claim production functions exist until verified in source and tests.**

## Mission
Build an extensible AI-native board-game platform with a safe, auditable MCP integration for classic games, STEM education, 3D simulation, competitive play, and coding challenges.

## Required preparation
1. Read `README.md`, `docs/README.md`, `docs/project/PROJECT_CHARTER.md`.
2. Read affected domain PRD/GDD, `docs/architecture/DATABASE_DATA_DICTIONARY.md`, `docs/ai-mcp/MCP_AI_AGENT_CONTROL_PLANE.md` and the latest accepted ADRs.
3. Discover existing files and tests before proposing new architecture or writing code.
4. Identify business owner, permission scope, data changes, security impact and migration strategy.

## Code boundaries
- Games depend on Game SDK/shared UI/renderer; they do not write user, auth, leaderboard or tenant DB tables directly.
- Rules run server-authoritatively and separately from render UI.
- Published game versions, scoring rules, content snapshots and replay artifacts are immutable.
- Code submissions execute only in isolated judge workers, never in application/realtime servers.
- External MCP tools call application services with the same authorization rules as UI.
- No secrets, student PII, hidden tests, unlicensed art or private links in this public repo.

## Standard delivery loop
`Inspect → Plan → Change smallest scope → Tests → Review diff → Update docs/ADR → PR → Approval → Release`.
- Never merge/publish/deploy to production autonomously without explicit authorized approval.
- Require human approval for high-risk MCP write tools, changes to public tournaments, ranking corrections, bulk notifications, permissions, or deletions.
- Log tool name, authenticated principal, tenant, target, reason, idempotency key and outcome; do not log secrets.
- Do not silently rewrite user data or production content. Migrations are forward-compatible and have rollback/restore plan.

## Definition of Done
Schema/API contract and tests updated; no cross-tenant leaks; backward compatibility checked; CI passes; changed behavior documented; observability and rollout defined; reviewed PR submitted.

More details: `docs/ai-mcp/AI_AGENT_REPOSITORY_RULES.md` and `docs/governance/REPOSITORY_GOVERNANCE.md`.