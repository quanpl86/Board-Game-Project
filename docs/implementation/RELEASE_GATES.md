# Phase 1 Release Gates

1. **PR Review:** inspect main docs `AGENTS.md`, Design System V1 and Agent Quality Gates. Test CI actual run, check application screenshots and no fabricated features.
2. **Bootstrap CI:** typecheck, unit tests, build. No production credentials in any PR workflow.
3. **Before Staging:** committed frozen pnpm lockfile, separate host/DB/Redis, authenticated API boundaries, containerized reproducible images, configuration and rollback procedure.
4. **Before Production:** KingDragonHub SSO/route decision, UX signoff, physical schema P0 and migration approval, threat model, RLS and permission tests, MCP write disabled unless separately approved.
5. **Postrelease:** D+1/D+7 smoke tests, error monitoring, owner decision log. All Project Director reports must distinguish PR from release.

This document records intended gates. No staging environment exists as of this PR.
