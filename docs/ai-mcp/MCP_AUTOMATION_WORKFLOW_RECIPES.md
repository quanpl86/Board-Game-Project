# BOARD GAME UNIVERSE — Automation Playbooks & Acceptance Tests v1.1

**Status:** Planned and unexecuted automation templates. Triggered jobs are managed by the future application; these workflows are **not presently scheduled**.

## Workflow 01: Monthly Theme — chủ đề tháng / lễ hội
- **Trigger:** Scheduler 20th of prior month or manually requested.
- **Operator:** Content Lead; **Agent(s):** Campaign Planner → Copy Agent → Asset Agent → QA Agent.
- **Steps:** read month calendar and tenant locale → read available game catalog/age policy → produce proposal and theme tokens → generate banner/illustrations in staging → select approved games → create 2–4 event drafts and notification copy → accessibility/brand/license checks → build page preview desktop/tablet/mobile → check overlapping campaigns → approval inbox → schedule deterministic publish/expiry and safe fallback.
- **Approval:** Human Content Lead for publication; additional safety/education reviewer if children/public competition involved. No silent send to all users.
- **Failure/retry:** Error before approval keeps draft; publish failure retries idempotent; after expiry revert active slots to evergreen fallback, never delete historic event results.
- **Evidence:** revision digests, preview links, approved reviewer, schedule trace, visual QA, publication audit.
- **Acceptance:** no unpublished revision visible; schedule uses tenant timezone; campaign conflict resolve deterministic; no duplicate notification.

## Workflow 02: Tournament from natural-language brief
- **Trigger:** Organizer says “Tạo giải Eco City STEM Cup cho 8 đội tuần sau”.
- **Agent(s):** Event Planner → Rule Validator → Schedule Planner → Referee Support.
- **Steps:** event draft → verify eligibility/age/consents/team membership → venue/time → choose scoring policy and pin game versions → generate seeded bracket preview → resolve referee assignment → publish proposal and sign-off → publish entry form → reminder scheduling → registration closure snapshot → bracket freeze → room/match creation → server-verified results → dispute resolution human → finalize leaderboard → produce winners announcement draft.
- **Approval:** Event Director for publish, Referee for adjudication, teacher/guardian controls for child participants; code cannot alter finalized results unilaterally.
- **Acceptance:** same seed and rule version; no duplicate fixtures; rerun workflow after retry yields same event IDs; leaderboard recomputable from verified results.

## Workflow 03: New Board Game implementation
- **Trigger:** Product Owner requests new turn-based or 3D title.
- **Agent(s):** GDD Writer → Architect → Coding Agent → QA/Accessibility Agent → Game Publisher.
- **Steps:** scan games/catalog + licensing and game SDK → GDD, contract schema, turn state, private player-view rules, scoring → scaffold package → test with fake players → implement art/UI in isolated branch → property-based invariants + reconnection/replay → CI security/license → PR → human review → stage deployment → publish candidate version with feature flag → monitor pilot → promote stable with sign-off.
- **Approval:** protected GitHub branch, CODEOWNERS, migration/security gate; AI never merges itself.
- **Acceptance:** compatible manifest, 100% mandatory game rule test cases passed, deterministic replay, no client score tampering.

## Workflow 04: Blockbench asset batch / GLB release
- **Trigger:** Asset brief from Game Designer, or design backlog.
- **Agent(s):** 3D Asset Planner → Blockbench Agent (authorized desktop/tunnel) → Asset QA → Art Publisher.
- **Steps:** retrieve standardized shape/texture/pivot rules → create `.bbmodel` in dev workspace via trusted connector → export GLB → inspect geometry, pivot +Y, face +Z, footprint, animation anchors, poly/texture budget → generate thumbnail and LOD → upload staging R2 → asset manifest generation → preview in Three.js test scene → human visual/rights approval → immutable release reference published.
- **Acceptance:** no invalid mesh references, pivot valid, GLB loads on target device, texture rights present, no replacing asset version used in active matches.
- **Fallback:** connector unavailable: hold job `waiting_external`, avoid claiming asset created.

## Workflow 05: Educational lesson series & mapping
- **Trigger:** Academic Lead asks for 5E curriculum game pack.
- **Agent(s):** Curriculum Agent → Game Challenge Agent → Rubric Agent → Academic QA.
- **Steps:** read standards version + lesson constraints → draft objectives and definitions → 5E lesson with offline activity before tool challenge → attach game challenge IDs → generate rubric and assessment items → validate that objective/game evidence align → teacher review → content publication → assignment optional, scoped to approved class.
- **Safety:** agent may only read aggregate/minimal individual student data, grade recommendations not final grades.
- **Acceptance:** standards version visible, 5E structure preserved, objective definitions/activities/implementation linked, publish approved.

## Workflow 06: Weekly site operations / anomaly check
- **Trigger:** Every morning + failure threshold event.
- **Agent(s):** SRE Reader → Incident Triage → Coding Agent only if issue created.
- **Steps:** aggregate uptime, error rate, failed assets, match loss/reconnect, judge queues and workflow failures → classify incidents → send Ops digest → if severe, page human on-call → inspect suspect release/PR → produce rollback recommendation or PR draft.
- **Approval:** auto paging allowed within pre-approved response rule; database changes and production rollback require incident commander/security review unless explicitly pre-authorized emergency runbook with bounded authority.
- **Acceptance:** no secrets/raw chat in diagnostics; incident has trace and evidence; noisy alerts deduplicated.

## Workflow 07: Coding challenge pack creation
- **Trigger:** Curriculum or contest owner requests problem set.
- **Agent(s):** Coding Curriculum → Test Author → Security QA → Problem Publisher.
- **Steps:** propose story/problem constraints → examples → solution reference → public/private test cases → isolated judge verification under CPU/RAM/network constraints → adversarial/edge case coverage → rubric → version candidate → human editorial/security review → publish coding pack → rejudge only through official review workflow.
- **Acceptance:** hidden tests inaccessible to student clients/tools; language/version pinned; generated code cannot escape sandbox; verified grading deterministic.

## Workflow 08: Community moderation & safety
- **Trigger:** Message report or safety classifier flag.
- **Agent(s):** Moderation Triage.
- **Steps:** queue case → see only scoped redacted evidence → risk classification and supporting excerpts → human moderator review → approved warning/suspension where policy requires → log case/resolution → notify safeguarding owner under policy.
- **Limits:** no autonomous open DM to minors, no unrelated private chat retrieval, no irreversible sanctions from AI alone.
- **Acceptance:** scoped access; false positive appeals; visibility limited; retention deletion policy.

## Workflow 09: Announcement / global maintenance alert
- **Trigger:** Operator request, planned outage.
- **Agent(s):** Ops Content Agent → Reviewer.
- **Steps:** collect verified maintenance window → draft Vietnamese/English copy → render audience and estimated delivery count → detect conflicts → obtain production approval → schedule website banner/in-app inbox → close notice after maintenance → log report.
- **Failure handling:** expired announcement never sent; repeat webhooks not duplicate sends.
- **Acceptance:** actual scope matches approved scope hash; all content references immutable revision; no PII in message.

## Workflow 10: Semester content refresh
- **Trigger:** Semester start/revised standards or recurring quarterly review.
- **Agent(s):** Content Auditor → Curriculum Reviewer → Game Designer → QA.
- **Steps:** query assets, broken rules/tutorials, educational mapping version, usage aggregates → backlog candidate → proposal for lessons/game challenge content, never automatically overwrite old published standards → diff → release gate → optional reindex knowledge and staging preview.
- **Acceptance:** old assignment/replay retains previous version; link targets valid; rollback possible.

## Common workflow run contract

```json
{
  "workflow_code": "monthly-theme",
  "workflow_version": "1.0.0",
  "trigger": {"type": "schedule", "timezone": "Asia/Bangkok", "rrule": "FREQ=MONTHLY;BYMONTHDAY=20"},
  "tenant_id": "derived-from-grant",
  "sponsor_principal": "authorized-operator-or-service",
  "idempotency_key": "workflow-version+tenant+period",
  "budget": {"max_model_calls": 40, "max_tool_calls": 120},
  "steps": ["research", "draft", "validate", "preview", "approve", "publish", "verify"],
  "approval": {"on": "publish", "policy": "content-publication-v3"},
  "on_error": "pause_and_notify"
}
```

This is a **conceptual business contract**, not exact MCP wire schema or ready-to-execute automation configuration. Native scheduler and future MCP Tasks adapter maintain independent lifecycle.

## Architecture acceptance suite (minimum 15 tests)

| ID | Test | Expected |
|---|---|---|
| AI-T01 | revoked OAuth token calls `cms_create_draft` | 401/no effect |
| AI-T02 | low-privilege client invokes `cms_publish_approved` | deny + audit |
| AI-T03 | teacher tenant A reads B student's grades | deny; no payload leak |
| AI-T04 | model sets `tenant_id=B` in payload | ignored/rejected; token-derived tenant prevails |
| AI-T05 | pending approval changed content digest | original approval invalid |
| AI-T06 | same `idempotency_key` retried 5 times | one committed action |
| AI-T07 | worker crashes after saving outbox | resumes job; no missing publish |
| AI-T08 | duplicate `match.finalized` event | no duplicate points/awards |
| AI-T09 | Agent prompt injected in a community post | no tool privilege change; no exfiltration |
| AI-T10 | malformed GLB embedded / oversize upload | quarantined, no release |
| AI-T11 | expired campaign + failed scheduler tick | resolver falls back by time/window |
| AI-T12 | private student identity in request for public rank | denied or anonymized according to policy |
| AI-T13 | MCP client protocol 2025 vs 2026 | negotiated/tested compatibility or explicit rejection |
| AI-T14 | AI code agent requests production secrets | denied; secrets not present in workspace |
| AI-T15 | automated mass announcement lacks approval | queued approval, no sends |
| AI-T16 | time zone / DST crossing scheduled event | dates match organizer timezone |
| AI-T17 | judge runner receives code with network access attempt | blocked isolated sandbox |
| AI-T18 | AI provider unavailable during scheduled theme expiration | deterministic expiry still works |
| AI-T19 | reviewer's rights revoked before approval commit | denied at execution time |
| AI-T20 | tenant operator disables automation | next run not launched; inflight handled by policy |