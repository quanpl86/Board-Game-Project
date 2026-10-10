# Phase 1 — Monorepo, CI & Agent Task Foundation

**Status:** Foundation PR only. No staging or production deployment, persistent domain schema, SSO, playable game, Colyseus room or public MCP tools yet.

## Implemented in this PR
- pnpm workspace / Turborepo task specification across `apps/*`, `packages/*`, `games/*`.
- Next.js + React `apps/web`: *demonstration* Game Hub under KingDragonHub screenshot-inferred colors (#FF5722 accents; #C63D14 accessible CTA), outlined cards, Vietnamese placeholder game catalog, phone/tablet/desktop layout. **The website host's original CSS/font is not yet audited.**
- Fastify `apps/api`: `GET /health` and `GET /v1/games` serving explicitly planned demo games; test using `app.inject`.
- `apps/realtime`: health endpoint only; room creation and authoritative WebSocket logic disabled until Game SDK/auth.
- `apps/mcp-gateway`: health endpoint only; every tool endpoint fails closed 503 until OAuth, tenant scoping, approval, audit and MCP server implementation.
- `apps/jobs`: clear no-op program; no fake scheduler or background Agent execution.
- `packages/contracts`: typed demo catalog; `packages/design-system` reserved for audited shared components.
- Docker Compose PostgreSQL 16 and Redis 7 for local only (NOT integrated or migrated).
- `tools/agent-task.mjs`: read-only validator for tasks against actual 18 role and 25 skill registries, different reviewer, risk, R3/R4 human approval evidence and release evidence.
- `.github/workflows/platform-ci.yml`: pnpm install, baseline source check, TypeScript, Node policy tests, Fastify API tests, Next.js build.

## Local setup
Requires Node.js >=22, Docker optional, pnpm 10.14.0:

```bash
corepack enable
corepack prepare pnpm@10.14.0 --activate
pnpm install --no-frozen-lockfile
cp .env.example .env
pnpm dev                  # Web http://localhost:3000
pnpm dev:api              # http://127.0.0.1:4000/health
pnpm dev:realtime         # http://127.0.0.1:4001/health (roomsEnabled false)
pnpm dev:mcp              # http://127.0.0.1:4002/health (toolsEnabled false)
docker compose -f infra/docker/compose.yml up -d # optional local infra
pnpm ci
pnpm agent:validate
```
Start each service in a separate terminal; infra credentials in the example are **local-only** and no migrated DB is in use. These endpoints do not assert database connections or finished features.

## Bootstrap limitations
Current local execution environment cannot resolve npmjs.org; npm package installs and Next runtime **cannot be verified locally here**. GitHub Actions must finish green before approval; CI output is independent proof.

This first PR intentionally has **no committed pnpm-lock.yaml**. CI temporarily uses `pnpm install --no-frozen-lockfile` to generate workspace resolutions. Before release/staging CD, generate and commit a reviewed lockfile and switch to `--frozen-lockfile`; add full ESLint/security audit and SHA-pinned Actions. Do not mistake the current `lint` baseline checker for full static analysis.

## Execution boundaries
- Agent CLI validates **metadata**, not GitHub identity, OAuth or actual human approval. It never executes tasks or modifies data.
- All MCP write tools disabled; no automation executor, no permission escalation.
- The existing scheduled Project Director reports remain a *separate* read-only task workflow; this code does not run them.
- No production deployment, real user data, money, score, inventory or student PII.

## Next PRs
1. Lockfile + reproducible CI + security/ESLint, visual regression and CI action SHA-pinning.
2. Identity, KingDragonHub host SSO audit, schema P0 review, PostgreSQL migrations and RLS tests.
3. Game SDK, deterministic Gomoku 2D, Colyseus room lifecycle, replay/reconnect.
4. Shared Design System after original KingDragonHub font/CSS audit, tablet UX, Playwright.
5. MCP OAuth/approval/audit, durable workflow/outbox, safe read tools and separate Agent evaluation.
6. Staging infrastructure, environment secrets, artifact promotion and rollback after hosting decision.

## Acceptance checklist
- [ ] GitHub Actions can install packages and build Web.
- [ ] TypeScript/API/Agent tests pass.
- [ ] No false-claim playable game or deployed Agent.
- [ ] No externally reachable unauthenticated MCP/game mutation.
- [ ] Human UX/Brand approves preview and security owner reviews next auth scope.
