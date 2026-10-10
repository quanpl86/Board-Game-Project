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
## UI/UX alignment — adopted 2026-10-10
- All platform UI uses KingDragonHub visual language; first read `docs/design/README.md` and token/agent guidance.
- Use orange `#FF5722` for brand highlights; enforce accessible action/text contrast variants.
- Preserve brand shell while games may have distinct board/render style; do not introduce unrelated neon blue/purple base branding.
- Verify actual KingDragonHub font/nav/CSS against authorized host source before claiming pixel-perfect implementation.
- Changes to global visual tokens must pass Brand/UX review; do not duplicate site header on embedded routes.

## AI Agent Operating System v1.0 — mandatory for AI contributions
All agents working on this repository MUST read `docs/agents/README.md`, `docs/agents/OPERATING_CHARTER.md`, the assigned `.agents/roles/<role-id>.md` file and applicable `.agents/skills/<skill-id>/SKILL.md` before drafting or coding. Select skills using `docs/agents/SKILL_ROUTER.md`; do not load every skill or skip relevant security/DB/UX skill.

- **Project Director:** `BGU-PD` leads intake, scopes, delegation, issue/PR tracking, risk forecast, user check-ins, release steering, postlaunch audit. It never fabricates task/CI/production status. Work reminders and recurring reports only occur after a real scheduler is configured with user's approved cadence.
- **Role separation:** requester/author/reviewer/approver are independently recorded for risk R3/R4. A specialist may propose a high-risk change but not approve/merge/deploy it with the same Agent identity.
- **UI/UX:** KingDragonHub palette, type, icon, size, spacing and language from `docs/design/` + `design-tokens`, `react-frontend`, `iconography`, `ux-copy` skills; original host font/CSS remains subject to actual source audit.
- **Database:** follow `database-engineering` and `privacy-security`; no P0 schema freeze without approved decision register, migration tests, tenant/RLS, rollback and a human DB review.
- **Media:** use `image-production`, `video-production`, `blockbench-3d` and asset licensing/version manifest; do not claim a rendered file or model without actual output validation.
- **MCP:** every write through typed authorized domain service, exact approval revision, scoped principal, idempotency and audit; no direct production SQL or wallet/score updates.
- **Evidence:** stage labels DRAFT/IN_PR/MERGED/STAGING_VERIFIED/PRODUCTION_RELEASED; template `docs/agents/templates/HANDOFF.md` and QA gates are mandatory.
- **Validation:** `python scripts/validate_agent_pack.py` and `python scripts/validate_docs.py`; these are static checks, not proof an agent runner is installed or model evals have passed.

**Governance:** `docs/agents/AGENT_REGISTRY.json` maps roles and `docs/agents/SKILL_REGISTRY.json` maps exact skill paths; changes require reviewed PR.
