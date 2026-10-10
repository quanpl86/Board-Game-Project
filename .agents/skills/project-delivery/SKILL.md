---
name: project-delivery
description: Plan, assign and track multi-agent delivery from discovery through production and post-launch with evidence, reminders, escalation and decision records.
version: 1.0.0
owner_role: BGU-PD
---

# Skill: project-delivery
**Purpose:** Plan, assign and track multi-agent delivery from discovery through production and post-launch with evidence, reminders, escalation and decision records.

## Activate for
planning, project management, weekly reports, backlog, delegation, release steering

## Read before acting
- `docs/product/APP_FLOW_INDEX.md`
- `docs/product/PRE_SCHEMA_FREEZE_DECISIONS.md`
- `docs/roadmap/MASTER_ROADMAP.md`
- `docs/agents/PROJECT_DIRECTOR_RUNBOOK.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Query GitHub main HEAD, open issues, PR statuses, CI runs and production/staging status if authorized. Timestamp all findings; mark unavailable sources.
2. Create an epic → story → task graph with `owner_role`, `approver`, `priority`, `depends_on`, `affected_domains`, `screen_ids`, acceptance and rollback. Mark as proposal until GitHub issue created.
3. Estimate range (optimistic/likely/pessimistic) with explicit staffing and infrastructure assumptions; map critical path and buffer for QA/security.
4. Allocate tasks to specialist roles by skill router, enforce reviewers different from authors for R3/R4, and WIP limits: target <=2 active tasks per specialist unless agreed.
5. Check blockers and CI twice weekly or at approved cadence; remind assignee with link, due date, concrete dependency, and a courteous single call to action.
6. Compile concise daily/weekly review using `draft`, `in PR`, `merged`, `staging verified`, `released`, `monitored` rather than vague percentage completion.
7. Escalate slips, rising costs, cross-domain schema drift or unsafe deployments with options, cost and recommendation, get Product Owner signoff.

## Non-negotiable rules
- Never fabricate a project schedule/issue assignment/deploy result.
- Calendar or reminder task must be activated using an actual scheduler only after user approves cadence and scope.
- No autonomous approval or merge of author-owned production change.
- Human Product Owner owns scope; PD advises and coordinates.

## Required output artifacts
- Epic map and sprint scope
- Accountable task briefs/assignees
- Risk and dependency register
- Daily/weekly status evidence
- Decision requests and next checkpoints

## Validation / Definition of Done
- [ ] Each task has owner, reviewer, acceptance and source link
- [ ] Every blocked task has unblock action
- [ ] Report accurately separates proposed vs merged vs deployed
- [ ] No repeated reminders without configured cadence

## Handoff
Use `docs/agents/templates/HANDOFF.md` with changed files, status, test links, unresolved risks and reviewer. Any unapproved R3/R4 action stops at proposal/approval stage.
