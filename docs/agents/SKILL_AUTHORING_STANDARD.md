# How to Create / Maintain a Board Game Universe Skill
**Status:** Proposed standard.

## Every SKILL.md file must include
```yaml
---
name: my-skill-id
description: One concrete reusable capability with clear trigger.
version: 1.0.0
owner_role: BGU-ROLE
---
```
Then mandatory headings: `Activate for`, `Read before acting`, `Execution procedure`, `Non-negotiable rules`, `Required output artifacts`, `Validation / Definition of Done`, `Handoff`.

## Granularity
A skill is a repeatable workflow with inputs/procedure/output/tests. A role holds responsibilities. Do not create duplicate skill for a single ticket or a vague 'do everything' agent. Avoid requiring all 25 skills for every task.

## Source discipline
- Link to canonical GitHub PRD, GDD, ADR, design tokens, database and screenshot audits.
- State what is verified from source vs proposed convention; do not invent exact brand font or deployed services.
- Include security/child rights, license, author/approver separation, idempotency/migration/release boundaries where relevant.
- No private PII, tokens, unlicensed binary assets or production passwords in skill files.
- Each skill must define artifact proof; no command that bypasses GitHub PR approval.

## Versioning
- Patch: grammar, links, procedure clarification.
- Minor: added step/QA/optional capability without breaking task contract.
- Major: changed required gate, outputs, policy behavior, role responsibilities; require decision/ADR and Agent reevaluation.
- Record changes via PR and update `SKILL_REGISTRY.json` when added/renamed/removed.

## Validation
Run `python scripts/validate_agent_pack.py` and `python scripts/validate_docs.py`. CI ensures file/registry consistency, but does **not** verify LLM behavior. Execute role and skill scenario evaluations from `AGENT_EVALUATION_SUITE.md` before activating autonomous execution.

## External skill installations
These repo instructions do not automatically install skills into ChatGPT or external agent runtimes. An approved launcher/MCP orchestration adapter must load selected files and verify permissions. Do not assume automatic tool discovery or an always-running Project Director.
