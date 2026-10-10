---
name: observability-incident
description: Design telemetry, SLOs, cost/risk forecasts, on-call incident playbooks and post-release monitoring across web, multiplayer, DB, MCP, economy, coding and assets.
version: 1.0.0
owner_role: BGU-RELEASE
---

# Skill: observability-incident
**Purpose:** Design telemetry, SLOs, cost/risk forecasts, on-call incident playbooks and post-release monitoring across web, multiplayer, DB, MCP, economy, coding and assets.

## Activate for
monitoring, incidents, observability, OpenTelemetry, metrics, alert, outage, rollback

## Read before acting
- `docs/operations/INFRASTRUCTURE_AND_SECURITY.md`
- `docs/agents/PROJECT_DIRECTOR_RUNBOOK.md`
- `docs/architecture/COMMAND_EVENT_CONTRACTS_V2.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. List service boundaries and operational owners (web, API, Colyseus, database, worker/queue, MCP, judge, R2/CDN), establish traces correlation IDs without PII.
2. Define measurable SLI/SLO and error budget by service: page load, game command latency, reconnect recovery, score projection freshness, shop ledger reconciliation (zero drift), workflow completion, judge queue and asset load.
3. Instrument OpenTelemetry traces + structured logs + metrics; exclude tokens, full messages, student code and identifiable school records from default logging.
4. Configure alerts for user-impacting thresholds and durable job failures, not noisy raw request counts; link alert to owner and runbook.
5. During incident: classify severity, restrict dangerous writes/feature flag, communicate impact, capture evidence, restore service via approved rollback/compensation, never conceal incident.
6. Post incident: timeline from real logs, root-cause evidence, prevention task, user communication if required and regression test.
7. Weekly PM report includes cost trends and capacity forecast with uncertainty and source; after production review D+1/D+7 and changes from release.
8. Run backup restore, disaster recovery and staging incident drill with verified time, not estimated assumptions.

## Non-negotiable rules
- Never promise '24/7 monitoring' unless actual alerting and on-call is configured.
- No private chat/student code in logs for convenience.
- AI can summarize incidents but cannot unilaterally delete evidence or bypass legal/security escalation.
- Do not invent SLO success numbers.

## Required output artifacts
- Service SLO/metrics catalog
- Alert/runbook ownership
- Incident summary & follow-up tasks
- Capacity/cost/risk trend report

## Validation / Definition of Done
- [ ] Each critical alert has owner and remediation
- [ ] Tracing across domain workflow works
- [ ] Backup/rollback verified and logged

## Handoff
Use `docs/agents/templates/HANDOFF.md`. Report confirmed artifacts, not intentions. Critical incidents and R3/R4 changes wait for authorized human gate.
