# CI Hardening — Phase 1.1 (Issue BGU-002)

## Purpose
Require locked workspace dependencies, ESLint/TypeScript, test/build, permission-scoped Actions and security checks on every PR. No deploy permissions or production credentials.

## Quality gates
1. Install from committed `pnpm-lock.yaml` using `pnpm install --frozen-lockfile`.
2. Root `pnpm lint` = bootstrap repository invariants + ESLint JS/TS rules; `pnpm typecheck`; `pnpm test`; `pnpm build`.
3. `pnpm audit --prod --audit-level high` for vulnerable production dependencies; basic tracked-source secret hygiene. GitHub secret scanning/CodeQL are additional controls to enable with account support.
4. GitHub Actions pinned to verifiable commit SHAs, read-only workflow token and PR-safe no-secrets execution.
5. Node 22, pnpm 10.14.0, pnpm store cache, isolated branch builds. CI green from GitHub is required evidence.

## Limits and release gate
- Frozen lockfile is generated on GitHub trusted runners from public npm metadata and committed only after review; not hand-crafted.
- Dependency audit scans advisories at evaluation time; new vulnerabilities may make CI red, requiring triage instead of skipping checks.
- ESLint recommended rule set is baseline, **not** a substitute for Next-specific React/JSX accessibility or architecture rules. Add Playwright, TypeScript API contracts, integration postgres, WebGL and MCP security eval before production.
- This PR creates **no** staging/production service, migration or authorized Agent runtime.
- Do not enable broad write operations or active child data until SSO, privacy and schema approvals (BGU-003/004/007).
