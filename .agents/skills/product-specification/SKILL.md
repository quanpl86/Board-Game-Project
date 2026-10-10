---
name: product-specification
description: Transform game/education/community requirements into clear PRDs, user stories, acceptance tests and screen/data impact without mixing proposed and implemented features.
version: 1.0.0
owner_role: BGU-PRODUCT
---

# Skill: product-specification
**Purpose:** Transform game/education/community requirements into clear PRDs, user stories, acceptance tests and screen/data impact without mixing proposed and implemented features.

## Activate for
feature discovery, PRD, screen backlog, flow, product scope, requirement acceptance

## Read before acting
- `docs/product/END_TO_END_APP_FLOWS_V2.md`
- `docs/design/MASTER_SCREEN_INVENTORY_V2.md`
- `docs/product/FEATURE_GAP_AUDIT_V2.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Identify actors (guest/adult/child/teacher/referee/admin/Agent), goals, permissions and success metric; list unavailable source decisions.
2. Map to existing F01–F20 journey and screen ID; add missing entry, empty, offline, error, permission and dispute routes.
3. Draft user stories with given/when/then and traceable requirement IDs; isolate platform vs game-specific behavior.
4. Define exact domain aggregate/state machine affected, commands/events and reporting required; refer to database/design/AI leads rather than adding tables unilaterally.
5. Define in-scope, out-of-scope, risk, release flag, backward compatibility, legal/age safety and analytics consent.
6. Request owner review for feature decisions; record approved outcome in roadmap, PRD and decision register.

## Non-negotiable rules
- Do not turn idea into mandatory MVP automatically; P0/P1/P2 must reflect owner priorities.
- Never assume planned design is implemented or available on KingDragonHub host.
- Student grades/private identity cannot be put into public ranking by default.

## Required output artifacts
- PRD with traceability
- Flow and screen gap updates
- Acceptance scenarios including unhappy paths
- Owner approval checklist

## Validation / Definition of Done
- [ ] All roles and scope visible
- [ ] At least one permission/privacy and failure test per story
- [ ] No unreviewed business rule or speculative promise

## Handoff
Use `docs/agents/templates/HANDOFF.md` with changed files, status, test links, unresolved risks and reviewer. Any unapproved R3/R4 action stops at proposal/approval stage.
