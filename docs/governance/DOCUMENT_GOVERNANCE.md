# Documentation Governance & Source of Truth
## Canonical ownership
- Product intent/functional scope: docs/product/MASTER_PLATFORM_BLUEPRINT.md; education scope: docs/education/*.
- Logical database: docs/architecture/DATABASE_DATA_DICTIONARY.md, schema starter is NOT a migration.
- AI/MCP: docs/ai-mcp/MCP_AI_AGENT_CONTROL_PLANE.md + tool catalog/data model.
- Game spec: docs/games/{id}/GDD.md, rules, version manifest and asset guide.
- Ops: docs/operations/INFRASTRUCTURE_AND_SECURITY.md.
- Historical frozen source: docs/archive.

## Change control
Every change uses PR with rationale, impacted domains, compatibility, test evidence and reviewers. Breaking architecture decisions require an ADR. Change versioned contract before updating clients. Keep deprecated versions available for replay/match compatibility.

## Document front matter
Title, owner, status (draft/review/approved/deprecated), version, last review date, affected module, references and related ADRs.

## Versioning
Immutable published game rules, scoring metric version, educational rubric versions, published campaigns and MCP tool schema. Drafts can be edited by scoped actors; publication needs relevant reviewers.

## AI contributions
Agent-authored files must use existing structure, cite upstream context and indicate generated content; agent may draft changes but may not bypass PR/security release gates. Never commit secrets/PII or downloaded copyrighted assets without rights.

## Review cadence
After major release, before classroom pilot, season launch and when protocol/license/security baselines change.
