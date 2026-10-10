# BOARD GAME UNIVERSE — MCP Tool Catalog & Permission Matrix v1.1

**Status:** Planned catalog, not implemented. **Convention:** `domain_verb_object` (tool names stable, versioned by schema). `R0` read; `R1` draft; `R2` limited/reversible; `R3` publish/external effect; `R4` critical/human-managed. Tool availability is filtered per identity/tenant/token scope and re-authorized on invocation.

| Domain | MCP tool | Input/Output contract (summary) | Permission / scope | Risk |
|---|---|---|---|---|
| Identity | `identity_get_actor_context` | effective scopes, masked info | `identity.self.read` | R0 |
| Identity | `identity_list_tenant_members` | paged pseudonymous list | `members.read` | R0 |
| Identity | `identity_prepare_role_change` | target role, scope → diff | `roles.propose` | R2 |
| Identity | `identity_request_role_change` | proposal ID → approval request | `roles.manage` | R4 |
| Tenant | `tenant_get_policy` | policy & revision | `tenant.policy.read` | R0 |
| Tenant | `tenant_validate_policy_change` | draft patch → policy diff | `tenant.policy.propose` | R1 |
| Catalog | `games_search_catalog` | filters → paged games | `games.read` | R0 |
| Catalog | `games_get_manifest` | game ID/version → manifest | `games.read` | R0 |
| Catalog | `games_create_draft` | metadata → draft ID | `games.draft` | R1 |
| Catalog | `games_validate_release` | version → compatibility/test summary | `games.review` | R1 |
| Catalog | `games_prepare_publish` | release → preview + proposal | `games.publish.prepare` | R2 |
| Catalog | `games_publish_approved` | approved proposal + expected version | `games.publish` | R3 |
| Game Ops | `rooms_list_active` | tenant filter → sessions | `rooms.read` | R0 |
| Game Ops | `matches_get_summary` | match → redacted result | `matches.read` | R0 |
| Game Ops | `matches_get_replay` | match → rights-scoped replay | `replays.read` | R0 |
| Game Ops | `matches_request_void` | match + evidence → review | `matches.adjudicate` | R4 |
| Content | `cms_list_slots` | page/locale → slots | `cms.read` | R0 |
| Content | `cms_create_content_draft` | slot/schema → draft | `cms.edit` | R1 |
| Content | `cms_update_draft` | draft + expected revision → draft revision | `cms.edit` | R1 |
| Content | `cms_preview_page` | revision/device/audience → preview | `cms.preview` | R0 |
| Content | `cms_create_theme_draft` | tokens/assets → draft | `theme.edit` | R1 |
| Content | `cms_validate_theme` | contrast/assets/layout → report | `theme.review` | R1 |
| Content | `cms_prepare_publication` | revision/audience/time → diff | `cms.publish.prepare` | R2 |
| Content | `cms_publish_approved` | approval + proposal digest | `cms.publish` | R3 |
| Campaigns | `campaigns_get_calendar` | range/tenant → plans | `campaigns.read` | R0 |
| Campaigns | `campaigns_create_draft` | theme, dates, target → draft | `campaigns.edit` | R1 |
| Campaigns | `campaigns_validate_conflicts` | campaign → overlap report | `campaigns.review` | R1 |
| Campaigns | `campaigns_prepare_schedule` | campaign → publication diff | `campaigns.schedule.prepare` | R2 |
| Campaigns | `campaigns_schedule_approved` | approved proposal → schedule | `campaigns.schedule` | R3 |
| Assets | `assets_search_registry` | tags/type/license → assets | `assets.read` | R0 |
| Assets | `assets_get_manifest` | asset/version → spec | `assets.read` | R0 |
| Assets | `assets_upload_to_staging` | signed upload reference → staged asset | `assets.stage` | R1 |
| Assets | `assets_validate_glb` | asset draft → geometry/perf/licensing report | `assets.review` | R1 |
| Assets | `assets_generate_thumbnail_job` | asset version → job handle | `assets.stage` | R1 |
| Assets | `assets_prepare_release` | version → diff and checks | `assets.publish.prepare` | R2 |
| Assets | `assets_publish_approved` | approval + staged asset → release | `assets.publish` | R3 |
| Education | `education_find_lessons` | standards/age → lessons | `education.read` | R0 |
| Education | `education_generate_lesson_draft` | objectives/age/time → lesson draft | `education.author` | R1 |
| Education | `education_validate_standard_mapping` | standard revision → report | `education.review` | R1 |
| Education | `education_prepare_assignment` | lesson/target class → preview | `assignments.prepare` | R2 |
| Education | `education_assign_to_class` | approved target list/time → assignment | `assignments.publish` | R3 |
| Education | `education_get_aggregate_progress` | class/assignment → aggregates | `education.analytics.read` | R0 |
| Education | `education_request_individual_report` | student + purpose → controlled report | `student.report.read` | R2 |
| Teams | `teams_list_for_scope` | class/event → teams | `teams.read` | R0 |
| Teams | `teams_prepare_grouping` | roster/profile policy → proposed groups | `teams.organize` | R1 |
| Teams | `teams_apply_approved_grouping` | proposal/teacher approval → teams | `teams.manage` | R2 |
| Social | `social_get_moderation_queue` | authorized scope → redacted cases | `moderation.read` | R0 |
| Social | `social_triage_report_draft` | case/evidence → recommendation | `moderation.triage` | R1 |
| Social | `social_request_moderation_action` | case/action → human queue | `moderation.manage` | R3/R4 |
| Social | `social_create_announcement_draft` | channel/text → draft | `social.announce.draft` | R1 |
| Social | `social_send_approved_announcement` | approved audience + content digest | `social.announce.send` | R3 |
| Ranking | `ranking_list_definitions` | scope/game → metrics | `ranking.read` | R0 |
| Ranking | `ranking_preview_projection` | score policy/season → recompute preview | `ranking.simulate` | R1 |
| Ranking | `ranking_detect_anomalies` | season → anomaly cases | `ranking.audit` | R0 |
| Ranking | `ranking_request_refinalization` | season/matches → review | `ranking.adjudicate` | R4 |
| Event | `events_list_calendar` | range/audience → events | `events.read` | R0 |
| Event | `events_create_draft` | event spec → draft | `events.edit` | R1 |
| Event | `events_validate_eligibility` | event config → report | `events.review` | R1 |
| Event | `events_prepare_publication` | event/audience → preview | `events.publish.prepare` | R2 |
| Event | `events_publish_approved` | approval + event revision → publish | `events.publish` | R3 |
| Event | `events_prepare_reminder` | time/template/audience → count & diff | `notifications.prepare` | R2 |
| Tournament | `tournaments_prepare_bracket` | format/registrations/seed → candidate | `tournaments.plan` | R1 |
| Tournament | `tournaments_validate_bracket` | bracket → conflicts/eligibility | `tournaments.review` | R1 |
| Tournament | `tournaments_publish_approved_bracket` | approved proposal → bracket | `tournaments.publish` | R3 |
| Tournament | `tournaments_get_live_status` | tournament ID → current stages | `tournaments.read` | R0 |
| Tournament | `tournaments_request_result_correction` | dispute → official review | `tournaments.adjudicate` | R4 |
| Reward | `rewards_preview_eligibility` | event/match → candidate awards | `rewards.review` | R1 |
| Reward | `rewards_prepare_grant` | recipient IDs + evidence → proposal | `rewards.prepare` | R2 |
| Reward | `rewards_grant_approved` | approved proposal → ledger entries | `rewards.grant` | R3 |
| Notification | `notifications_get_templates` | channel/locale → template | `notifications.read` | R0 |
| Notification | `notifications_create_template_draft` | localized content → draft | `notifications.edit` | R1 |
| Notification | `notifications_preview_recipients` | audience rules → count/preview | `notifications.prepare` | R2 |
| Notification | `notifications_schedule_approved` | content/audience/approval → schedule | `notifications.send` | R3 |
| Coding | `coding_search_problems` | subjects/difficulty → content | `coding.read` | R0 |
| Coding | `coding_create_problem_draft` | problem, tests → draft | `coding.author` | R1 |
| Coding | `coding_validate_problem` | draft → test coverage/constraints | `coding.review` | R1 |
| Coding | `coding_request_rejudge` | contest/problem/version → review | `coding.rejudge.request` | R3/R4 |
| Dev | `dev_get_ci_status` | PR/commit → tests | `dev.read` | R0 |
| Dev | `dev_generate_change_request` | feature brief → issue/spec | `dev.issue.create` | R1 |
| Dev | `dev_create_isolated_branch_job` | approved issue → sandbox job | `dev.branch.create` | R1 |
| Dev | `dev_open_pull_request` | branch/tests → PR | `dev.pr.create` | R2 |
| Dev | `dev_preview_deployment` | release → staging/diff | `dev.release.prepare` | R2 |
| Dev | `dev_request_production_deploy` | PR/approvals → release gate | `dev.release.request` | R4 |
| Ops | `ops_get_service_health` | service → metrics | `ops.health.read` | R0 |
| Ops | `ops_get_failed_jobs` | filter → errors | `ops.jobs.read` | R0 |
| Ops | `ops_retry_safe_job` | idempotent job → retry | `ops.jobs.retry` | R2 |
| Ops | `ops_create_incident_draft` | anomaly → incident record | `ops.incident.draft` | R1 |
| Ops | `ops_request_rollback` | version/evidence → incident approval | `ops.deploy.rollback` | R4 |
| Automation | `automation_list_workflows` | org/category → definitions | `automations.read` | R0 |
| Automation | `automation_create_draft` | trigger/steps/policy → draft | `automations.edit` | R1 |
| Automation | `automation_simulate` | workflow + fake event → execution diff | `automations.review` | R1 |
| Automation | `automation_activate_approved` | approved version → active schedule | `automations.publish` | R3 |
| Automation | `automation_pause` | workflow ID → suspended | `automations.manage` | R2 |
| Jobs | `jobs_get_status` | job ID → state, progress | `jobs.read` | R0 |
| Jobs | `jobs_get_result` | job ID → artifacts/errors | `jobs.read` | R0 |
| Jobs | `jobs_cancel_owned` | job ID → cancellation | `jobs.cancel` | R2 |
| Knowledge | `knowledge_search_docs` | scoped query → cited docs | `knowledge.read` | R0 |
| Knowledge | `knowledge_get_revision` | document/revision → content | `knowledge.read` | R0 |

## Resources (read only; filtered)

- `bgu://games/{game_id}/manifest/{version}` — signed release metadata.
- `bgu://architecture/adrs/{adr_id}` — architecture decision and revision.
- `bgu://content/campaigns/{campaign_id}/revisions/{id}` — approved/draft scoped snapshot.
- `bgu://assets/{asset_id}/versions/{id}` — GLB/texture/rights metadata (not unrestricted file access).
- `bgu://tournaments/{id}/standings` — policy-filtered standings.
- `bgu://automation/runs/{run_id}` — redacted run progress and trace references.
- `bgu://coding/problems/{id}/public` — public statement; never leak private tests.

## Prompts & Skills (templates not authorities)

- `create-monthly-theme`, `launch-tournament`, `audit-game-release`, `create-stem-lesson`, `produce-blockbench-assets`, `review-coding-problem`, `nightly-ops-check`, `prepare-hotfix-pr`.
- Skill packages carry version, owner, checksums and allowed-tool requirements; human authoring/review needed before promotion.

## Tool contract policy (minimum)

Input: typed JSON Schema (validated); tenant derived from token; stable IDs; expected revision for mutation; idempotency key; no inline SQL/JS/code execution. Output: `status`, `resource_id`, `revision`, `proposal_id`, `approval_required`, `job_id`, `trace_id`, `warnings`, `next_actions` (all fields appropriate per tool). Safety: independent authz at invocation, secrets masked, output redacted, quotas enforced, no arbitrary URL fetch.

Recommended action pattern:
`get/list -> create_draft -> validate/simulate -> prepare_publish -> request_approval -> publish_approved -> get_status`.