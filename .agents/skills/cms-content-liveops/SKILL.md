---
name: cms-content-liveops
description: Manage config-driven KingDragonHub CMS, homepage blocks, theme campaigns, seasonal shops, schedules, feature flags and notifications with deterministic previews and human publishing.
version: 1.0.0
owner_role: BGU-LIVEOPS
---

# Skill: cms-content-liveops
**Purpose:** Manage config-driven KingDragonHub CMS, homepage blocks, theme campaigns, seasonal shops, schedules, feature flags and notifications with deterministic previews and human publishing.

## Activate for
CMS, banner, theme month, holiday, liveops, campaign, seasonal content, notification, schedule

## Read before acting
- `docs/liveops/LIVEOPS_CONTENT_STRATEGY.md`
- `docs/design/KINGDRAGONHUB_INTEGRATION.md`
- `docs/agents/OPERATING_CHARTER.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Distinguish CMS content block, theme, campaign, event, season and feature flag; never use one generic settings blob.
2. Create schema-validated draft with id/locale/tenant/audience/age/publish window in UTC+IANA timezone, revision, assets/rights and fallback.
3. Resolve conflict by approved status, audience, tenant specificity, priority, slot, start/end and deterministic tie breaker; show device and restricted-role preview.
4. Validate links to games, rank policy, shop stock, token contrast/accessibility and age/guardian constraints; no arbitrary JS/CSS from editor content.
5. Have content editor submit for review; bind approval to exact revision hash and recipient count for mass notification. Schedule/expire with durable worker rather than long-lived Agent request.
6. Ensure refresh/cache invalidation, repeated job idempotency, post-publish monitoring and safe rollback to last approved theme.
7. Record audit and actual content reach/participation with privacy-aware aggregate metrics.

## Non-negotiable rules
- AI may draft; no autonomous mass push/production publish without approved policy.
- Theme cannot override protected accessibility/base brand tokens.
- Never invent event/season time or prize/scarcity.
- No personal-student targeting without explicit lawful authority.

## Required output artifacts
- Versioned content/campaign config
- Audience and conflict preview
- Schedule/rollback and approval record
- Post-publication metrics

## Validation / Definition of Done
- [ ] Overlapping campaign resolves deterministically
- [ ] Expired content disappears/backs off correctly
- [ ] Unapproved content never goes public

## Handoff
Use `docs/agents/templates/HANDOFF.md`. Report confirmed artifacts, not intentions. Critical incidents and R3/R4 changes wait for authorized human gate.
