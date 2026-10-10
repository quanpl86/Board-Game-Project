---
name: mcp-automation
description: Engineer tenant-scoped MCP tool servers, Agent identities, typed tools/resources/prompts, durable automations, approvals, audit and safe GitHub/asset/game control flows.
version: 1.0.0
owner_role: BGU-MCP
---

# Skill: mcp-automation
**Purpose:** Engineer tenant-scoped MCP tool servers, Agent identities, typed tools/resources/prompts, durable automations, approvals, audit and safe GitHub/asset/game control flows.

## Activate for
MCP, AI Agent, tool server, workflow, automation, approval, OAuth, scheduling, audit

## Read before acting
- `docs/ai-mcp/MCP_AI_AGENT_CONTROL_PLANE.md`
- `docs/ai-mcp/MCP_TOOL_CATALOG_AND_PERMISSIONS.md`
- `docs/ai-mcp/AI_AUTOMATION_DATA_MODEL.md`
- `docs/ai-mcp/MCP_AUTOMATION_WORKFLOW_RECIPES.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Identify business domain and tool purpose; prefer typed application service contract, never expose generic SQL execution to AI.
2. Define tool name, JSON Schema inputs/outputs, read/write scope, required principal+tenant/age policy, risk R0–R4, audit and idempotency fields, rate/budget limits.
3. Implement remote MCP over tested supported protocol transport/auth; OAuth bearer token audience/scope and user delegation validated; don't assume all clients support tasks/elicitation equally, version-negotiate.
4. Separate synchronous MCP invocation from durable backend workflow job; persist run/step/version/context, retry and dead-letter/compensation, timeout and cancellation.
5. Draft mutations include expected_revision/preview; production write requires human approval bound to exact artifact hash, target, scope, expiry and actor. Approval is not a raw reusable admin token.
6. Threat-test prompt injection in fetched docs/PRs, malicious tool descriptions, tenant confused-deputy, stale approvals, retries, privilege escalation, fake webhooks and untrusted image metadata.
7. Build evaluation suite: tool schema compatibility, denied unauthorized access, agent task accuracy, hallucination avoidance, replay/audit and honest failure reporting.
8. Deploy staging, test authorized real client invocation, create audit runbook and operator dashboard; production requires release owner.

## Non-negotiable rules
- An Agent cannot approve its own risky write or escalate its scope.
- No secrets/PII in tool schemas or logs, prompts are not authority.
- Do not claim background task exists until scheduler confirms.
- MCP is an adapter to business services, not alternate business logic layer.

## Required output artifacts
- Tool catalog and typed schema
- Agent/workflow definition and owner
- Safety evaluation and approval flow
- Operational audit/observability records

## Validation / Definition of Done
- [ ] Unauthorized tools denied server-side
- [ ] Idempotent retries/long runs durable
- [ ] Human approval exact and verifiable
- [ ] No direct DB wallet/score mutation

## Handoff
Use `docs/agents/templates/HANDOFF.md`. Report confirmed artifacts, not intentions. Critical incidents and R3/R4 changes wait for authorized human gate.

## P0 database diagram and source-of-truth gate
Before P0 Database, API, Game Server, frontend or MCP implementation that touches persisted data, read `docs/database/AGENT_IMPLEMENTATION_REFERENCE.md`, the [editable Draw.io source and 39 SVG previews](../../../docs/database/diagrams/README.md), affected `docs/database/tables/<schema.table>.md`, `db/schema/p0_tables.json` and current SQL. Do not infer permissions from ERD edges. DB table/relation changes require regeneration of diagram+CSV assets and CI parity; never add SSO/RLS allow rules or production migrations without human approval.
