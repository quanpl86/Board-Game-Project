# Master Application Flow & Schema Freeze Review — V2.0
**Status:** Proposed for product / architecture review — NOT approved / not implemented
**Date:** 2026-10-10 · **Source:** existing `main` PRD/Blueprint/Data Dictionary/AI MCP plus pending UI PR #2 and Economy PR #3.

## Purpose
Complete the **end-to-end navigation, domain flows, screen coverage, missing features and data contract impact** before freezing the physical database schema. This specification is game-agnostic and supports the eventual KingDragonHub deployment.

## Deliverables
1. [End-to-end application & operations flows](END_TO_END_APP_FLOWS_V2.md) — complete role/user lifecycle, flows F01–F20, boundary states and failure branches.
2. [Master screen inventory and navigation](../design/MASTER_SCREEN_INVENTORY_V2.md) — screen IDs, user access, product states, screen gaps and mandatory UX handoffs.
3. [Functional gap analysis & priority](FEATURE_GAP_AUDIT_V2.md) — missing capabilities and priority with UX, schema and acceptance impact.
4. [Database freeze readiness](../architecture/DB_FREEZE_READINESS_V2.md) — canonical entities, ownership, lifecycle and schema release policy.
5. [Cross-domain commands and events](../architecture/COMMAND_EVENT_CONTRACTS_V2.md) — transaction/event boundaries and idempotency.
6. [Decisions register](PRE_SCHEMA_FREEZE_DECISIONS.md) — decisions requiring signoff and stop/go gates.
7. [ADR-0004 proposal](../architecture/adr/0004-app-flow-first-schema-freeze.md).

## Source context & current branch status
- `main` baseline contains `docs/product/MASTER_PLATFORM_BLUEPRINT.md`, 159-table logical candidate inventory and 35 additional AI control plane candidates. These **are not automatically required physical migrations**.
- [PR #2](https://github.com/quanpl86/Board-Game-Project/pull/2): proposed KingDragonHub Design System and 28-screen starter inventory; not merged at time of authorship.
- [PR #3](https://github.com/quanpl86/Board-Game-Project/pull/3): proposed avatar/shop, Hall of Fame, player marketplace and economy item schema; not merged at time of authorship.
- V2 reviews all 3 scopes, **does not implicitly mark PR2/PR3 as approved**.
- No installed end-to-end app, no production-ready migrations, no reviewed high-fidelity screens. Avoid conflating PRD deliverable with implementation.

## Release philosophy
Freeze **P0 schema contract**, not all imaginable tables. Later P1/P2 migrations expand safely, with tested backwards compatibility, author/approver and retention policies.
