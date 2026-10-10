---
name: architecture-contracts
description: Design modular multi-game platform boundaries, typed API/domain events, version compatibility, authoritative state and safe integration with KingDragonHub.
version: 1.0.0
owner_role: BGU-ARCH
---

# Skill: architecture-contracts
**Purpose:** Design modular multi-game platform boundaries, typed API/domain events, version compatibility, authoritative state and safe integration with KingDragonHub.

## Activate for
service architecture, Game SDK contracts, API, event schema, ADR, integration, web sockets

## Read before acting
- `docs/architecture/adr/0001-platform-architecture.md`
- `docs/architecture/COMMAND_EVENT_CONTRACTS_V2.md`
- `docs/architecture/DB_FREEZE_READINESS_V2.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Read existing architecture ADR, bounded contexts, code dependency graph and source-of-truth responsibilities.
2. Draw interaction sequence with client → authz → application service → transaction/outbox → consumers, including failure.
3. Choose modular monolith interfaces; separate Game Server, AI workflow worker and coding judge by resource/security boundary.
4. Create typed contracts: actor, tenant, resource ID, expected revision, idempotency, request schema, response/error and event envelope version.
5. Document consistency: DB transaction vs eventual projections; design retry, concurrency, timeout and recovery.
6. Create ADR with alternatives, chosen tradeoff, migration/backward compatibility and operational considerations; add contract and E2E tests.

## Non-negotiable rules
- No direct game/AI/UI writes to unrelated domain tables.
- Pin match to published game/rule/score/asset version; redacted per-player views.
- Use synchronous coordination only where strong consistency is needed; outbox for side effects.
- Do not assume host SSO protocol, route or CSS until source verified.

## Required output artifacts
- ADR and architecture/sequence diagrams
- OpenAPI/type interfaces and event schema
- Change impact map and migration contract
- Resiliency/load/security acceptance tests

## Validation / Definition of Done
- [ ] One domain owner per aggregate
- [ ] Reviewers can identify transaction boundary
- [ ] Old replay and released artifacts compatible or migration proposed

## Handoff
Use `docs/agents/templates/HANDOFF.md` with changed files, status, test links, unresolved risks and reviewer. Any unapproved R3/R4 action stops at proposal/approval stage.
