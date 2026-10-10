# ADR-0004 — Complete User Journeys Before Freezing Database
**Status:** Proposed (not formally approved)
**Date:** 2026-10-10
**Decision scope:** Board Game Universe, integrated into KingDragonHub in future

## Problem
The current 159-table logical inventory and additional AI/economy proposals list entities before all identity, support, marketplace, class, tournament and lifecycle edge cases are known. Applying one comprehensive physical migration now risks schema churn and privacy/concurrency defects.

## Proposed decision
Adopt a **flow-first, aggregate-centered, incremental schema release**.
1. Each released user journey identifies actor, allowed actions, state machine, authoritative aggregate, permissions, failure behavior and telemetry.
2. Freeze P0 data and event contracts only after flows and pending PR2/PR3 decisions reconciled; keep late-stage domains as extension agreements instead of speculative tables.
3. Every physical migration has FK/unique/index, tenant isolation, retention class, command owner, backfill/rollback strategy and tests.
4. Strong consistency for room seat, match finish, wallet/item trade; outbox for projections and external automation.
5. Child safety and Agent approval are cross-cutting policy gates, not UI-only checks.

## Consequences
- One master 117 logical-screen inventory, 20 cross-role flows, 42 gaps and 24 unresolved decisions guide UI backlog and schema design.
- Need mapping from each P0 command to ERD entity(s) and tests.
- Smaller P0 migration set, later additive releases for economy, social, advanced coding.
- Product and architecture owners must review decisions register; do not treat proposed tables as finished SQL.

## Alternatives
A) Freeze all 159+35+economy tables immediately (rejected: overbuild and schema churn).
B) Store all content in one document/JSONB table (rejected: poor relational integrity, fraud/security and querying).
C) Split every domain into an independent microservice before workflows are verified (deferred: operational cost).
