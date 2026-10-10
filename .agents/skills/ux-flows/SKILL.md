---
name: ux-flows
description: Map KingDragonHub-aligned user journeys, screen inventory, wireframes, responsive behavior and inclusive game/education/admin interaction states.
version: 1.0.0
owner_role: BGU-UX
---

# Skill: ux-flows
**Purpose:** Map KingDragonHub-aligned user journeys, screen inventory, wireframes, responsive behavior and inclusive game/education/admin interaction states.

## Activate for
UX flows, wireframe, sitemap, onboarding, layout, screen state, dashboard, game HUD

## Read before acting
- `docs/design/DESIGN_LANGUAGE.md`
- `docs/design/MASTER_SCREEN_INVENTORY_V2.md`
- `docs/product/END_TO_END_APP_FLOWS_V2.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Select one actor/goal and existing F01–F20, find screen ID and permitted navigation context; map to host site and Game Hub.
2. Draw task and error flows including SSO, age gate, leave/reconnect, payment confirm, private feedback and restore.
3. Specify page hierarchy and component composition; platform shell vs game HUD, 2D board, Three.js canvas and accessibility overlay.
4. Design 1440 desktop, 1024/768 tablet and 390 mobile frames, landscape tablets for 3D; state specific breakpoints and touch behavior.
5. Cover default/loading/empty/offline/forbidden/expired/error/success and confirmation states, keyboard/focus/reading order.
6. Create wireframe and interaction notes, prototype critical task, test with user or educator where feasible; record assumptions and friction issues.
7. Obtain UX + Product review and update shared screen inventory; hand off component specs to UI.

## Non-negotiable rules
- Do not claim high-fidelity visuals exist unless actual artifacts verified.
- Do not display private student grades or rankings publicly.
- Keep 3D stage primary in active gameplay; compact HUD and collapsible panels, not giant editorial whitespace.
- Use host navigation only if KingDragonHub integration contract allows; don't duplicate global header.

## Required output artifacts
- Site map and screen spec
- Annotated desktop/tablet/mobile wireframes
- Clickable prototype or interaction specification
- UX failure-state acceptance list

## Validation / Definition of Done
- [ ] Every primary CTA reachable by touch+keyboard
- [ ] Entry/exit, permission and recovery flow visible
- [ ] Game, teacher and admin distinct contexts but shared brand

## Handoff
Use `docs/agents/templates/HANDOFF.md` with changed files, status, test links, unresolved risks and reviewer. Any unapproved R3/R4 action stops at proposal/approval stage.

## P0 database diagram and source-of-truth gate
Before P0 Database, API, Game Server, frontend or MCP implementation that touches persisted data, read `docs/database/AGENT_IMPLEMENTATION_REFERENCE.md`, the [editable Draw.io source and 39 SVG previews](docs/database/diagrams/README.md), affected `docs/database/tables/<schema.table>.md`, `db/schema/p0_tables.json` and current SQL. Do not infer permissions from ERD edges. DB table/relation changes require regeneration of diagram+CSV assets and CI parity; never add SSO/RLS allow rules or production migrations without human approval.
