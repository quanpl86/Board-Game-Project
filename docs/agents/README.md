# Board Game Universe — AI Agent Operating System (AOS) v1.0
**Status:** Proposed operating policy, awaiting owner approval. These files contain executable-style AI instructions **not a running autonomous agent platform**.
**Scope:** KingDragonHub-integrated board-game hub, education, coding, multiplayer, 3D assets, social, marketplace, LiveOps, MCP, CI/CD, post-production operations.

## Start here (mandatory for every agent)
1. `/AGENTS.md` — global, non-overridable repository rules and preparation.
2. [Operating charter](OPERATING_CHARTER.md) — authority, risk levels, review boundaries, escalation.
3. [Roles and decision rights](ROLES_AND_RACI.md) — owner, reviewer, approver, specialist and PM.
4. [Project Director runbook](PROJECT_DIRECTOR_RUNBOOK.md) — intake, delegation, daily/weekly/monthly reporting and user interaction.
5. [Skill router](SKILL_ROUTER.md) — load only skill files relevant to task, plus mandatory global.
6. [Definition of Done / quality gates](QUALITY_GATES.md).
7. [Prompt/task templates](templates/TASK_BRIEF.md), [handoff](templates/HANDOFF.md), [status](templates/DAILY_STATUS.md), [weekly steering report](templates/WEEKLY_REPORT.md), [decision request](templates/DECISION_REQUEST.md), [incident](templates/INCIDENT.md).

## Primary skill location
`/.agents/skills/<skill-id>/SKILL.md`. Each skill contains `name` and `description` frontmatter and practical instructions. Roles are *responsibilities*; skills are *repeatable capabilities*. An agent may hold more than one skill but must not self-approve risky actions.

## Operating modes
- **PLAN:** read/inspect, propose decision, map dependencies, time and owner.
- **BUILD:** implement in feature branch with tests; cannot self-merge.
- **REVIEW:** independent correctness/brand/privacy audit; no author self-approval.
- **OPERATE:** only through scoped, approved MCP/domain tools and durable automation.
- **INCIDENT:** stabilize, audit, communicate, propose rollback/repair with authority.

## Source of truth & precedence
1. System/platform policy, law and user-provided explicit approval.
2. Repository `AGENTS.md` and [safety/authority charter](OPERATING_CHARTER.md).
3. Approved ADR/PRD/GDD, database contracts, KingDragonHub design tokens and existing source.
4. Assigned role, relevant skill and task brief.
5. Agent suggestions. Conflicts escalate, **never silently invent** a rule or switch tech.

**Implementation truth:** GitHub code, CI results, production metrics. A document being merged does not mean feature is deployed.

## Current project baseline
See `docs/product/APP_FLOW_INDEX.md`, `docs/design/MASTER_SCREEN_INVENTORY_V2.md`, `docs/architecture/DB_FREEZE_READINESS_V2.md`, `docs/ai-mcp/MCP_AI_AGENT_CONTROL_PLANE.md`. 117 logical screens and database freeze decisions remain **proposed**; first confirm updated decisions, no invented signoff.

## Skill rollout
Register skills in [skill catalog](SKILL_ROUTER.md), then run local static check `python scripts/validate_agent_pack.py`. Proof of runtime integration (MCP gateway/workflow runner or LLM platform skill discovery) requires separate implementation and evaluation.
