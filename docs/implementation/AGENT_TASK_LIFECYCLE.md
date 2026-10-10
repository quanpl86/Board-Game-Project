# Agent Task Lifecycle — Validation-Only Foundation

Source: `docs/agents/AGENT_REGISTRY.json`, `SKILL_REGISTRY.json`, `OPERATING_CHARTER.md` and `QUALITY_GATES.md`.
Run `node tools/agent-task.mjs validate tools/examples/task-bgu-001.json`.

## Read-only JSON task contract
```json
{
  "task_id": "BGU-001",
  "executor_role": "BGU-UI",
  "reviewer_role": "BGU-UX",
  "risk": "R1",
  "skills": ["react-frontend", "design-tokens", "iconography"],
  "scope": "Build Game Hub demo only",
  "acceptance": ["Responsive 390/1024/1440", "No false game status"],
  "status": "draft"
}
```

Validator checks known executor/reviewer/skill, non-empty scope and acceptance, independent reviewer, named human approver for R3/R4, `human_approval_reference` before marked approved, and `production_evidence` before marked released. This **does not authenticate** evidence or enforce remote capabilities; actual execution service and domain authorization must be built separately.

## Future lifecycle, not implemented
PROPOSED → READY → IN_PROGRESS → IN_REVIEW → CI_PASSED → VERIFIED_STAGING → RELEASED → MONITORED; BLOCKED/CANCELLED/FAILED as separate states. GitHub PR/CI is source of truth. Never self-approve or use direct database writes.

## Next implementation
Persist tasks, assignee role/identity and source revision; link GitHub Issues/PR. Add secured MCP tool catalog, tenant/age RBAC+ABAC, immutable approval hash, idempotency, durable queue/job attempts, audit and staging evaluation. Feature flag every write OFF until independent security review.
