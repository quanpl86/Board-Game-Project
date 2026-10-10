# Master Roadmap — Board Game Universe
**Status:** Draft, milestone-driven not schedule commitment.

## Phase 0 — Foundations (Weeks 1–4)
Approve product charter, architecture/ADR, domain boundaries, data dictionary, game manifest, identity/permissions, MCP risk model and repo governance. Establish staging, docs CI and review workflow.

## Phase 1 — Platform vertical slice (Weeks 5–12)
Auth, tenants, catalog, authoritative rooms/results, 2D Gomoku or Connect Four, Eco City Lab 3D prototype, PostgreSQL persistence, scoring events and CMS campaign preview. Primary acceptance: two different games share platform without domain-specific forks.

## Phase 2 — MVP games & classroom (Months 4–7)
Release up to 8 classic titles and 6 educational games as quality permits; teachers create class/group/assignments; appropriate safe group chat, rubric, analytics and reconnect. Pilot with target devices and real classroom workflows.

## Phase 3 — Social / LiveOps / Competition (Months 7–12)
Dynamic seasonal CMS, event registration, multi-format tournaments, verified scores, moderation, team standings, notifications and PWA optimization. Release gradual with age policies and load tests.

## Phase 4 — Coding Arena (Months 10–18)
Block editor and deterministic robot game, problem registry/versioned tests, isolated judge workers and contest integration; add secure runner only after isolation testing and abuse controls.

## Phase 5 — Creator & scale (Months 15–24+)
Game templates/no-code authoring, moderated user-generated games, richer 3D worlds and assets, external integrations and multi-node realtime when load warrants.

## AI/MCP milestones (parallel)
MCP-0: tool/API contracts & service identities; MCP-1: read-only GitHub/catalog/docs tools; MCP-2: create draft + approval; MCP-3: durable automation; MCP-4: specialized game/content/asset agents; MCP-5: code PR + QA and safe release.

## Gates
G0 architecture security signoff; G1 two-game vertical slice; G2 classroom data protection, backups and load test; G3 tournament anti-cheat and safe social; G4 code-runner isolation; G5 creator publishing/moderation and rights.

## Principle
A roadmap is not an implementation claim. Update progress via tickets/PRs; never silently label unshipped features as complete.
