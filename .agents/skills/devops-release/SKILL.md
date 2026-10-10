---
name: devops-release
description: Build GitHub Actions monorepo CI/CD, staging/promoted artifacts, secure environments, DB/GLB/MCP pipelines, rollout and rollback for reliable KingDragonHub integration.
version: 1.0.0
owner_role: BGU-RELEASE
---

# Skill: devops-release
**Purpose:** Build GitHub Actions monorepo CI/CD, staging/promoted artifacts, secure environments, DB/GLB/MCP pipelines, rollout and rollback for reliable KingDragonHub integration.

## Activate for
GitHub Actions, CI/CD, deployments, Docker, Vercel, Railway, Supabase, R2, production, staging

## Read before acting
- `docs/operations/INFRASTRUCTURE_AND_SECURITY.md`
- `docs/architecture/adr/0001-platform-architecture.md`
- `docs/architecture/DB_FREEZE_READINESS_V2.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Inspect main repo for actual `package.json`, pnpm lockfile, apps, secrets/environment and current Actions; distinguish planned vs deployed.
2. Define app boundaries `web/admin/api/realtime/mcp-gateway/jobs`, separate staging and production accounts/DB, preview PR using dummy/synthetic data.
3. Implement CI: dependency install frozen lockfile, lint/typecheck/unit, architecture/contract tests, integration PostgreSQL, Playwright visual/E2E, security dependency/secret scan, game/GLB/MCP tests.
4. Use least-privilege GitHub token, action SHA pinning where practical, OIDC short-lived provider credentials, concurrency and timeout limits; never allow untrusted fork PR to access deployment secrets.
5. Choose exactly one deployment controller per service (host auto-deploy OR Actions trigger) to prevent duplicate releases. Build and tag immutable commit/digest; stage smoke/load tests and promote same artifact to prod.
6. DB migration PR: dry-run/upgrade simulation, expand/contract, query locks, release order and verified backup/restore; avoid automatic destructive schema changes.
7. Game Server release: drain active rooms and preserve game version; MCP tool compatibility and workflow pause/roll forward; GLB immutable CDN artifact publishing.
8. Production release gate has authorized human approval, rollback runbook, live health dashboards and D+1/D+7 check; never claim green if tests not executed.

## Non-negotiable rules
- No release without secrets isolation and approval.
- No push to protected main, no staging with copied production student data.
- A documentation CI passing does not mean app/test/deployment ready.
- Rollback of DB requires explicit compatible forward/restore plan, not blindly revert SQL.

## Required output artifacts
- Workflow YAML + lockfile + deploy manifest
- Staging/prod matrix
- Release checklist and rollback runbook
- CI and smoke/load test evidence

## Validation / Definition of Done
- [ ] Test job reproducible
- [ ] No env cross-contamination
- [ ] Production gate controlled
- [ ] Old rooms/replays preserved across version rollout

## Handoff
Use `docs/agents/templates/HANDOFF.md`. Report confirmed artifacts, not intentions. Critical incidents and R3/R4 changes wait for authorized human gate.
