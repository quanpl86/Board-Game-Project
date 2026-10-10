---
name: liveops-competition
description: Configure and operate events, tournaments, rankings, seasons, Hall of Fame and validated prize grants with rules, eligibility, appeals and child privacy.
version: 1.0.0
owner_role: BGU-LIVEOPS
---

# Skill: liveops-competition
**Purpose:** Configure and operate events, tournaments, rankings, seasons, Hall of Fame and validated prize grants with rules, eligibility, appeals and child privacy.

## Activate for
tournament, leaderboard, event, season, Hall of Fame, medals, ranking, prizes, competition

## Read before acting
- `docs/competition/LEADERBOARD_HALL_OF_FAME_SPEC.md`
- `docs/social/SOCIAL_COMMUNITY_TOURNAMENT.md`
- `docs/architecture/COMMAND_EVENT_CONTRACTS_V2.md`
- `AGENTS.md`, `docs/agents/OPERATING_CHARTER.md`, `docs/agents/QUALITY_GATES.md`.

## Execution procedure
1. Define event/tournament/season/campaign separately: name, owner/tenant, time zone, eligibility, teams, divisions, registration/checkin and publication.
2. Choose verified game+rule/scoring version, format (round robin, elimination, Swiss, score attack), tie break, referee role, walkover/no-show, disputes and result freeze.
3. Run registration capacity/waitlist checks, invite and schedule notifications with opt-in/age policy; preview fixtures before publish.
4. Create game match rooms from authorized fixture and consume server-verified result/score ledger; never trust client score. Deduplicate ranking projections and grant events.
5. Hall of Fame: source verified result, nomination, human review, safety/guardian visibility policy, curated publication and withdrawal/repair on later correction.
6. Monitor fairness, season statistics, cancellations, schedule changes and child stress; hand off official store cosmetic grants via Rewards/Inventory Service.
7. Produce event runbook, approved public copy, admin operations checklist and post-event review.

## Non-negotiable rules
- Hall of Fame earned honors not purchasable.
- Personal school assessment private by default; rank public only by policy.
- No award/score correction by arbitrary MCP or direct SQL.
- No fixture result published without referee/verifier approval.

## Required output artifacts
- Event/tournament configuration and GDD links
- Rank policy and tiebreak spec
- Check-in/dispute/award workflow
- Publish preview and QA report

## Validation / Definition of Done
- [ ] Eligibility/bye/tie/dispute handled
- [ ] Scores reproducible from ledger
- [ ] Guardian/privacy filters applied

## Handoff
Use `docs/agents/templates/HANDOFF.md`. Report confirmed artifacts, not intentions. Critical incidents and R3/R4 changes wait for authorized human gate.
