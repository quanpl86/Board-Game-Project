# LiveOps, CMS, Seasonal Campaigns & Dynamic Content
**Status:** Architecture draft · **Owner:** Content Operations

## Distinct concepts
- CMS page: versioned editorial blocks: banners, collections, hero, event widgets, articles, featured games and safe external links.
- Theme: design tokens, backgrounds, fonts, mascot/asset set and animation intensity; applied to eligible UI slots.
- Campaign: a timed publication plan and audience targeting; may group pages, notifications, games, events, missions and rewards.
- Feature flag: software capability rollout, distinct from an editorial campaign.
- Event: scheduled program that includes registration and competition workflows.
- Season: interval for rankings/achievements, optionally linked to campaign.

## Config-driven publication
Content blocks have JSON Schema validated at input and render; arbitrary HTML/script is not allowed from editors. Every record has ID, locale, tenant, audience policy, start/end UTC, original timezone, priority, approval status, draft revision, publication revision and rollback target.

## Lifecycle
Draft → Review → Approved → Scheduled → Published → Expired/Archived; emergency pause via authorized operator. Publication may run with AI-generated draft only after human-reviewed scoped authorization.

## Examples
Monthly STEM, Lunar New Year, Halloween, summer coding league and school-specific anniversary. A campaign may swap the home hero, highlight games, open challenges, seed league records and schedule classroom notices without code deploy.

## Resolution algorithm
For each content slot filter by published status, time, tenant, age, entitlement, language and safety. Rank by explicit precedence then specificity/priority, deterministic tie-break; always render safe default if no eligible campaign. Warn editors on conflicting schedules.

## MCP/AI and automation
Agents can propose article/banner/game features and event programs, preview and run QA. Publishing, mass communications or scoring policy changes require approved workflow and audit. Scheduled actions use durable jobs, retries/idempotency, no long-lived agent connection.

## Acceptance
Overlapping organization/global campaigns resolve deterministically; start/end rollbacks work; changes are reversible; preview matches selected audience; CMS cannot execute arbitrary scripts; forbidden youth content is never exposed via targeting.
