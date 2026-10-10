---
name: privacy-security
description: Review child safety, tenant permissions, moderation, secure development, threats, data privacy, prompt injection and high-risk release approval.
version: 1.0.0
owner_role: BGU-SAFE
---

# Skill: privacy-security
**Purpose:** Review child safety, tenant permissions, moderation, secure development, threats, data privacy, prompt injection and high-risk release approval.

## Activate for
privacy, school data, roles, chat, security, marketplace, OAuth, MCP, moderation, child

## Read before acting
- `docs/agents/OPERATING_CHARTER.md`
- `docs/operations/INFRASTRUCTURE_AND_SECURITY.md`
- `docs/economy/ECONOMY_SHOP_MARKETPLACE_PRD.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Classify actors, resources, PII and credentials; inspect public exposure, minor age band, guardian relationship, organization scope and purpose.
2. Threat model spoofing, unauthorized org data, IDOR, prompt injection, stolen sessions, replayed purchases, leakage via thumbnails/logs, WebSocket spectator secrets.
3. Specify least-privilege RBAC+ABAC, scoped OAuth audience, rate limits, support/report/ban/moderation and incident retention.
4. Ensure stranger DMs and peer-to-peer marketplace OFF for minors by default; verify explicit eligible adult policy before release.
5. Review secrets and dependency scan, signed assets/artifacts, CSP/CORS and RLS/API defense in depth; test refusal of unauthorized MCP tools.
6. Validate log redaction, data export/restriction/deletion requests, documented lawful basis and provider-region decisions with human privacy/legal owner.
7. Write severity-based findings, blocking failures, remediation/rollout plan and independent security signoff.

## Non-negotiable rules
- Never disclose private case evidence to general Agent/UX analytics.
- No direct raw student data copies into public PR, assets, AI prompts or dashboards.
- Not legal advice; flag jurisdictional and guardian requirements to qualified reviewer.
- No critical production-risk acceptance purely by AI.

## Required output artifacts
- Threat model and permission matrix
- Safety & privacy test cases
- Blocking findings / fixes
- Human signoff checklist

## Validation / Definition of Done
- [ ] Cross-tenant/child policy tests fail closed
- [ ] Sensitive logs redacted
- [ ] P0/R4 access and production changes show approver

## Handoff
Use `docs/agents/templates/HANDOFF.md` with changed files, status, test links, unresolved risks and reviewer. Any unapproved R3/R4 action stops at proposal/approval stage.
