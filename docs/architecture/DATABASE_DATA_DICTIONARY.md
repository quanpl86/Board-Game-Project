# BOARD GAME UNIVERSE — Database Architecture & Data Dictionary v1.0

**Status:** Logical data model proposal. `snake_case` in PostgreSQL; UUID IDs, `timestamptz`, `created_at` and `updated_at` conventions. This is a design inventory, not a final migration. The accompanying SQL is a small executable-oriented reference subset and is **not** the entire production schema.

## 1. Quy tắc thiết kế dữ liệu

1. `users` = danh tính nền tảng; `user_profiles` = thông tin hiển thị; `org_memberships` = quyền thành viên của tổ chức; `class_enrollments` = ghi danh lớp; `match_participants` = ghế chơi một trận. Bốn thứ không thay thế nhau.
2. `games` = trò chơi/catalog; `game_versions` = bản phát hành bất biến; `game_sessions` = phòng/phiên tương tác; `matches` = bản ghi ván đấu. `event_programs`, `tournaments`, `campaigns`, `domain_outbox` là các khái niệm khác nhau.
3. Relational tables lưu dữ liệu có điều kiện nhất quán và cần join/filter. `jsonb` chỉ với payload state/schema/module-specific/config revision có JSON Schema/version; không xây EAV generic làm nguồn sự thật.
4. Mỗi bounded context sở hữu bảng của nó. Không tạo khóa ngoại vô hạn đến mọi `target_id` polymorphic: có bảng `ranking_subjects`/`content_targets` chuẩn hóa hoặc bảng liên kết riêng theo loại.
5. ID UUID để tồn tại qua dịch chuyển môi trường. Composite uniqueness tenant-scope theo `organization_id`/`tenant_id`; không đặt email của trẻ em trong user profile public.
6. Transactions & locks cho trạng thái quan trọng: join seat, reserve tournament slot, finalize match, grant reward, publish revision. Outbox trong cùng transaction để chuyển sang asynchronous projections.
7. `deleted_at` chỉ là soft-delete UX; có retention/deletion cascade/anonymization phục vụ quyền xóa dữ liệu. Dữ liệu có audit, báo cáo và log có chính sách riêng.

## 2. Data domains — các bảng dự kiến

### A. Identity / Organizations / Access (17)
| Table | Khóa/thuộc tính quan trọng | Liên kết & mục đích |
|---|---|---|
| `users` | id, auth_provider_subject, status, account_type, created_at | Global principal, không dùng display_name thật làm id |
| `user_private_data` | user_id, encrypted pii, verified flags, retention_class | Một-một với users, quyền truy cập cực hạn chế |
| `user_profiles` | user_id, alias, avatar_asset_id, locale | Hồ sơ công khai/pseudonym |
| `user_preferences` | user_id, accessibility, notification, game display | Cài đặt cá nhân |
| `linked_identities` | user_id, provider, provider_subject | Nhiều phương thức đăng nhập |
| `auth_sessions` | user_id, revoked_at, device data | Session metadata, không lưu raw token |
| `organizations` | id, kind, slug, status, parent_id? | Trường, trung tâm, CLB, đơn vị tổ chức |
| `organization_units` | id, organization_id, parent_unit_id, kind | School/campus/department tree tùy tenant |
| `organization_memberships` | user_id, organization_id, status, joined_at | user liên hệ nhiều tenant |
| `roles` | id, code, scope_kind | RBAC role registry |
| `permissions` | id, resource, action | atomic permissions |
| `role_permissions` | role_id, permission_id | N-N mapping |
| `role_assignments` | user_id, role_id, scope_type, scope_id, validity | phân quyền theo phạm vi |
| `policy_sets` | id, scope, revision, rules_json | ABAC policy, publish/revoke |
| `user_guardians` | student_user_id, guardian_user_id, relation, verified | consent/support, không mặc định chia sẻ hết thông tin |
| `privacy_consents` | subject_user_id, version, purpose, status, scope | consent/grant/revoke timeline |
| `suspensions` | user_id, scope_kind, scope_id, expires_at | ban/suspension có phạm vi |

### B. Game Catalog / Releases / Entitlements (12)
| Table | Khóa/thuộc tính quan trọng | Mục đích |
|---|---|---|
| `games` | id, slug, owner_organization_id?, kind, status | logical game identity |
| `game_localizations` | game_id, locale, name, description | i18n catalog |
| `game_categories` | id, slug, parent_id | classification |
| `game_category_links` | game_id, category_id | N-N |
| `game_mechanics` | id, slug, label | abstract mechanics (grid/dice/deck) |
| `game_mechanic_links` | game_id, mechanic_id | N-N |
| `game_versions` | id, game_id, version, engine_api_version, rule_hash, manifest | immutable release artifact |
| `game_rulepacks` | id, game_version_id, schema_version, artifact_sha | rule build version |
| `game_capabilities` | game_version_id, capability_name, value_json | declared optional interfaces |
| `game_release_channels` | game_version_id, channel, rollout_scope, status | alpha/stable/tenant beta |
| `game_licenses` | game_id, holder, rights, valid_from/to | rights management |
| `game_entitlements` | organization_id/user_id, game_id, mode, expires_at | can launch/use, distinct visibility |

### C. Sessions / Gameplay / Replays (12)
| Table | Key fields | Mục đích |
|---|---|---|
| `game_rooms` | id, game_version_id, organization_id?, visibility, join_policy | reusable realtime lobby/room |
| `room_memberships` | room_id, user_id, role, connection_state | chat + room membership |
| `matches` | id, room_id?, game_version_id, ruleset_id?, match_status, config_hash | immutable game version pin |
| `match_participants` | id, match_id, user_id?, team_id?, seat, outcome | seat/participation |
| `match_commands` | id, match_id, seq, actor_id, idempotency_key, type, payload_jsonb | validated commands, append only |
| `match_events` | id, match_id, seq, event_type, payload_jsonb | game transition log |
| `match_snapshots` | match_id, state_version, state_hash, content_ref/data | periodic recoverable state |
| `match_results` | id, match_id, finalized_at, verdict, attestation | final outcome, finalize-once |
| `match_result_entries` | match_result_id, participant_id, rank, score, stats | granular verified scores |
| `replay_artifacts` | match_id, manifest, binary_ref, visibility | published safe replays |
| `matchmaking_queues` | queue_key, game_version_scope, rating_model, policy | lobby matching |
| `matchmaking_entries` | id, user/team, queue, created_at, expires_at | waiting players, often TTL store |

### D. Education / Standards / Classes (18)
| Table | Key fields | Mục đích |
|---|---|---|
| `academic_terms` | organization_id, name, date range | năm học/học kỳ |
| `classes` | id, organization_id, term_id, grade_band | lớp học |
| `class_enrollments` | class_id, user_id, role, active | roster |
| `courses` | id, organization_id?, subject, version | nội dung chương trình |
| `course_units` | course_id, position, objective | chương |
| `lessons` | unit_id, version, duration_minutes, status | bài học |
| `lesson_objectives` | lesson_id, statement, order | measurable outcomes |
| `standard_frameworks` | organization, title, version | NGSS, CSTA 2017/2026, ISTE |
| `standard_items` | framework_id, external_code, description | chuẩn riêng version |
| `objective_standard_links` | objective_id, standard_item_id, alignment_level | mapping |
| `learning_activities` | lesson_id, step_type, title, content_revision_id? | 5E/EDP/offline/game tasks |
| `assignments` | class_id, lesson_id?, game_id?, due_at, policy | giao bài |
| `assignment_targets` | assignment_id, user/group, targeting | ai được giao |
| `learning_attempts` | user_id, assignment_id, match_id?, status | lần làm |
| `learning_evidence` | attempt_id, evidence_type, payload, provenance | minh chứng học tập |
| `rubrics` | id, scope, version, status | bộ rubric |
| `rubric_criteria` | rubric_id, max_level, criteria | tiêu chí |
| `rubric_assessments` | attempt_id, criterion_id, level, assessor_id, review | teacher-approved scoring |

### E. Social / Groups / Community / Safety (17)
| Table | Key fields | Mục đích |
|---|---|---|
| `teams` | id, org_id?, kind, visibility, status | team persistent across matches |
| `team_memberships` | team_id, user_id, role, join_status | đội |
| `team_invitations` | team_id, invited_user_id, token_hash, expires_at | invitation |
| `chat_channels` | id, type, scope, policy_id, safety_mode | room/team/class/community/DM |
| `channel_memberships` | channel_id, user_id, role, mute_until | channel ACL |
| `chat_messages` | id, channel_id, sender_id, body, type, status | retained message only with policy |
| `message_reactions` | message_id, user_id, reaction_type | reactions |
| `chat_poll_options` | poll_id, option_id, text | voting |
| `chat_poll_votes` | poll_id, voter_id, option_id | vote, uniqueness |
| `community_spaces` | id, org_id?, visibility, moderation_policy | topic hub |
| `community_posts` | id, space_id, author_id, status, content_revision | user content |
| `post_comments` | post_id, author_id, body, status | moderated comments |
| `post_attachments` | post_id, asset_id, scan_status | safe assets |
| `moderation_reports` | reporter_id, target_kind, target_id, reason | reported content |
| `moderation_cases` | report_id, assigned_to, status, severity, SLA | review workflow |
| `moderation_actions` | case_id, actor_id, action, expiry, reason | auditable enforcement |
| `user_blocks` | actor_id, target_user_id, scope | user blocking when supported |

### F. Competitive / Events / Seasons / Rewards (23)
| Table | Key fields | Mục đích |
|---|---|---|
| `ranking_metrics` | id, code, unit, direction, source_domain | metric registry |
| `scoring_policies` | id, version, config_json, hash, status | scoring formula version |
| `score_records` | id, match_result_id, subject_id, metric_id, value, policy_version | immutable verified score |
| `ranking_subjects` | id, subject_type, user_id?/team_id?/class_id? | typed subject projection for ranking |
| `leaderboards` | id, metric_id, policy_id, period, scope, visibility | board definition |
| `leaderboard_entries` | board_id, subject_id, rank, score, calculated_at | materialized rank projection |
| `leaderboard_freezes` | board_id, freeze_at, snapshot_id, actor_id | final frozen results |
| `rating_histories` | subject_id, game_id, rating_before/after, match_id | rating timeline |
| `event_programs` | id, organizer_org_id, name, type, status, tz | business event |
| `event_revisions` | event_id, revision, config_json, published_at | configuration snapshot |
| `event_registrations` | event_id, team_id?/user_id?, status, eligibility | registration |
| `event_stages` | event_id, stage_number, format, rule_revision | competition phases |
| `tournaments` | id, event_id?, format, game_set, lifecycle | competition unit |
| `tournament_rounds` | tournament_id, order, status | rounds |
| `tournament_fixtures` | round_id, side_a, side_b, assigned_room, schedule | fixtures; best-of-N |
| `fixture_matches` | fixture_id, match_id, index | many matches per fixture |
| `tournament_results` | fixture_id, winner_subject_id, adjudicator, finalized | judged outcome |
| `tournament_disputes` | fixture_id, filed_by, reason, status | appeal workflow |
| `seasons` | id, start/end, timezone, policy, status | rating/mission seasons |
| `achievements` | id, code, revision, trigger_policy | awards registry |
| `achievement_grants` | achievement_id, user/team, evidence, granted_at | immutable grants |
| `reward_wallets` | subject_id, points_type, balance | points ledger projection |
| `reward_transactions` | wallet_id, delta, reason, source_id, time | ledger source of truth |

### G. CMS / Themes / Campaigns / Notifications (17)
| Table | Key fields | Mục đích |
|---|---|---|
| `content_types` | id, schema_json, schema_version | component contract |
| `content_items` | id, slug, content_type_id, owner_org, status | logical identity |
| `content_revisions` | id, content_id, revision, locale, body_json, checksum | immutable revisions |
| `content_publications` | id, revision_id, channel, audience_policy, start/end, priority | scheduled publications |
| `site_slots` | id, code, allowed_content_types | home.hero/home.cards/sidebar etc |
| `slot_placements` | slot_id, publication_id, order, active_windows | page composition |
| `themes` | id, code, base_theme_id | logical theme |
| `theme_revisions` | id, theme_id, token_json, asset_manifest, version | visual snapshots |
| `theme_assignments` | theme_revision_id, audience, time_window, priority | runtime resolution |
| `campaigns` | id, name, kind, status, owner | monthly/holiday/event |
| `campaign_revisions` | id, campaign_id, config_json, approved_at | frozen bundles |
| `campaign_publications` | revision_id, start/end, audience, priority | schedule |
| `feature_flags` | id, key, type, value, rules, environment | runtime toggles |
| `notification_templates` | id, key, version, locale, channel, body | email/in-app/push templates |
| `notifications` | id, recipient_id, template_version, payload, status | inbox item |
| `notification_deliveries` | notification_id, channel, attempt, delivered_at, failure | delivery tracking |
| `notification_preferences` | user_id, topic, allowed_channels, quiet_hours | preference |

### H. Asset / Coding / Ops / Entitlement (29)
| Table | Key fields | Mục đích |
|---|---|---|
| `assets` | id, owner_org, kind, visibility, license_id | logical source |
| `asset_versions` | id, asset_id, version, source_sha, glb_sha, metadata | published immutable derivative |
| `asset_files` | asset_version_id, role, storage_key, mime, bytes | bbmodel/glb/thumbnail/texture |
| `asset_manifests` | id, version, signed_hash | game version binding |
| `asset_manifest_entries` | manifest_id, asset_version_id, alias | reusable resource |
| `asset_processing_jobs` | asset_version_id, status, error, artifact refs | build pipeline |
| `coding_problems` | id, slug, kind, status | programming challenge identity |
| `coding_problem_versions` | id, problem_id, version, description, limits | immutable problem release |
| `coding_test_sets` | problem_version_id, visibility, encrypted_location | public/private judge cases |
| `coding_submissions` | id, submitter_id, problem_version_id, language, workspace_ref/source_ref | original submission |
| `judge_runs` | id, submission_id, execution_image, config_hash, verdict | queue/sandbox run |
| `judge_case_results` | judge_run_id, test_case_ref, pass, runtime, memory | test case audit |
| `coding_contests` | event_id/tournament_id, problem_set_revision | contest binding |
| `plans` | id, code, capabilities, limits | product plan |
| `subscriptions` | id, buyer_org/user, plan_id, lifecycle | billing subscription |
| `entitlements` | holder_scope, feature_key, limits, expires_at | rights/access |
| `domain_outbox` | id, aggregate_type, aggregate_id, event_type, version, payload | reliable event publishing |
| `domain_inbox` | consumer_name, event_id, processed_at | idempotent consumers |
| `scheduled_jobs` | id, kind, payload, due_at, state | scheduler |
| `audit_logs` | id, actor, target, action, reason, trace_id | admin actions |
| `data_retention_rules` | id, data_class, tenant_scope, retention_window | compliance policy |
| `data_deletion_requests` | id, subject_user_id, workflow_status, audit | delete/anonymize orchestration |

**145 bảng logical từ nhóm A–H (đề xuất ban đầu); bổ sung 14 bảng nhóm I = 159 bảng logical:** Đây là **target architecture**, KHÔNG phải yêu cầu xây tất cả trong MVP. Phải kiểm kê/phê duyệt theo iteration; có thể gộp/tách trong physical schema sau profiling. (Số lượng ở trên là danh mục thiết kế sơ bộ, không mang ý nghĩa chỉ tiêu.)

### I. Persistent 3D Worlds / Creator Studio / User Content (14)
| Table | Key fields | Mục đích |
|---|---|---|
| `virtual_worlds` | id, game_version_id, owner_user/team, scope, status | bản đồ/thành phố có tiến trình kéo dài nhiều buổi |
| `world_revisions` | id, world_id, revision, state_schema_version, manifest_hash | snapshot bất biến cho rollback / đánh giá |
| `world_chunks` | id, world_revision_id, chunk_x, chunk_z, storage_ref | phân vùng bản đồ lớn, tối ưu load |
| `world_entities` | id, world_id, asset_version_id, x/y/z, rotation, level, state | instance công trình (chỉ khi cần query entity-level; nếu không dùng snapshot) |
| `simulation_models` | id, code, version, deterministic config | mô hình tính điện/nước/môi trường |
| `simulation_runs` | id, world_revision_id, model_id, inputs_hash, outputs_ref | bằng chứng kết quả mô phỏng |
| `world_collaborators` | world_id, user/team, role, permission | quyền xây/quan sát/sửa |
| `creator_projects` | id, owner, template_kind, status | dự án do người chơi/giáo viên tạo |
| `creator_project_revisions` | project_id, version, schema, validation_results | bản thiết kế có phiên bản |
| `creator_templates` | id, game_mechanic, allowed_blocks, policy | template no-code có kiểm soát |
| `creator_publications` | revision_id, audience, moderation_state, license | bài đăng workshop/catalog |
| `creator_reviews` | publication_id, reviewer_id, decision, reason | kiểm duyệt / academic review |
| `ugc_licenses` | id, rights_policy, attribution, derivative terms | điều kiện sử dụng tác phẩm người dùng |
| `ugc_reports` | publication_id, reporter, status, case_ref | báo cáo nội dung UGC |

**World state design:** Một game 3D có thể cần cả state hiện hành, snapshots và entity table. Không nhất thiết sử dụng `world_entities` cho mọi game; sử dụng `world_revision` immutable + selective projection. Kích thước grid, chunk, rotation và asset version phải lưu cùng model version.

## 3. Quan hệ xuyên domain quan trọng

```text
users ---< organization_memberships >--- organizations ---< classes
  |                      |                              |        |
  +---< role_assignments + role_permissions             +---< class_enrollments
  |                                                        |
  +---< team_memberships >--- teams                       +---< assignments
  |                              |                                    |
  +---< match_participants >--- matches --- game_versions --- games   +---< learning_attempts
                                   |                                     |
                                   +--- match_results                    +--- learning_evidence
                                           |                                      |
                                           +--- score_records                     +--- rubric_assessments
                                                     |
                                                     +--- leaderboard_entries >--- leaderboards

event_programs ---< tournaments ---< tournament_rounds ---< tournament_fixtures
       |                                                             |
       +---< event_registrations                                     +---< fixture_matches >--- matches

campaigns ---< campaign_revisions ---< campaign_publications
                                             | target slots/themes/event/promos
content_items ---< content_revisions ---< content_publications ---< slot_placements >--- site_slots

games ---< game_versions --- asset_manifests ---< asset_manifest_entries >--- asset_versions

coding_problems ---< coding_problem_versions ---< coding_submissions ---< judge_runs
```

## 4. Cột chuẩn theo data class

- Core: `id uuid primary key`, `created_at timestamptz not null`, `updated_at timestamptz`, `created_by uuid`, `deleted_at timestamptz` nếu hợp lý.
- Tenant-owned: `organization_id uuid NOT NULL` và composite FK; phân quyền kiểm tra cả tenant + membership.
- Versioned content: `revision integer`, `status enum/lookup`, `checksum`, `published_at`, `approved_by`, `effective_at`, `expires_at`.
- Audit: actor, auth subject, scope, IP/device (masked/retention), reason, request id, before/after safe projection, timestamp.
- Rule evaluation: `ruleset_hash`, `game_version_id`, `state_schema_version`, `scoring_policy_version` pinned on match/event.

## 5. FK, uniqueness, index, partition

- `organizations.slug`, `games.slug`, `content_items(slug, owner_org)`, `game_versions(game_id, version)` unique.
- `match_commands(match_id, seq)` unique; `(match_id, actor_id, idempotency_key)` unique; `match_snapshots(match_id, state_version)` unique.
- `team_memberships(team_id, user_id)` unique; `channel_memberships(channel_id, user_id)` unique; `class_enrollments(class_id, user_id)` unique.
- `leaderboard_entries(leaderboard_id, ranking_subject_id)` unique, index `(leaderboard_id, rank)`, score sort by metric direction.
- `content_publications` indexes `(channel, start_at, end_at, priority)` + audience dimensions; deterministic selection and default fallback.
- `chat_messages(channel_id, sent_at desc)` indexed; tenant + channel membership verified before read/write.
- `matches(game_version_id, finalized_at)` and `match_participants(user_id, match_id)` indexed for user history.
- `match_events`, `chat_messages`, `audit_logs`, `domain_outbox` are likely high-volume; partition *when measurements justify* by time or bucket, not by every classroom. Retention + archive after expiry.
- Validate JSONB payloads with JSON Schema/Zod at write boundary; contract version field required. GIN indexes only for commonly queried payload paths, not blindly every JSONB column.

## 6. CQRS-lite và consistency

- Core command/state transactional writes PostgreSQL + transactional outbox.
- Workers produce eventually consistent projections: leaderboard, achievements, notification delivery, dashboard aggregates. Show `last_updated_at`; schedule recomputation/reconciliation.
- `match_results` finalization publishes exactly one logical event per revision (idempotency key), consumers use inbox deduplication; do not promise physical exactly-once delivery.
- Notifications may be delayed/retried independently without blocking finalization; duplicates suppressed at inbox/delivery layer.
- Tournament referee overrides create a new adjudication record and compensating score record, not silent edit of original match events.

## 7. Concrete examples of domain commands and events

| Command (sync) | Authorization | Result | Outbox event |
|---|---|---|---|
| `CreateGameRoom` | game.launch + room.create | room id/token | room.created.v1 |
| `MakeGameMove` | room.player + turn ownership | new authoritative state | match.move_accepted.v1 |
| `FinalizeMatch` | engine/referee according to policy | immutable result | match.finalized.v1 |
| `PublishContentRevision` | cms.publish in scope | scheduled publication | cms.publication_scheduled.v1 |
| `GrantAchievement` | rewards worker/system | award ledger | reward.granted.v1 |
| `SubmitCodeSolution` | coding.submit + contest eligibility | submission id | coding.submission_received.v1 |
| `ApproveEventRegistration` | event.manage | registration status | event.registration_approved.v1 |

## 8. Data retention / legal protection

- PII identity, education evidence, chat, moderation logs, event entries, code source and behavioral analytics must have distinct retention categories and explicit product/legal owner.
- Cross-tenant aggregate reporting must avoid PII leakage; published ranks pseudonymous and group-level for minors by default.
- Backup archives have independent retention; delete workflow must document feasible propagation, restore re-deletion if applicable, and exceptions based on actual legal obligations.
- Consider consent/legitimate basis, parental/guardian process, incident response and cross-border transfer obligations prior to live student deployment. Legal review needed for jurisdiction-specific requirements.

## 9. Schema rollout phases

- **P0 physical schema:** users/profiles, organizations/membership/RBAC, games/game_versions, assets/manifests, rooms/matches/participants/commands/results, teams, content revisions/publications, minimal notifications, audit/outbox.
- **P1 physical schema:** classrooms/assignments, leaderboards, messaging/moderation, seasons/events/tournaments, achievements, rubrics/evidence.
- **P2 physical schema:** coding problem/version/testset/submission/judge, subscriptions/entitlements, advanced community, LTI/OneRoster data mapping, experimentation.

Before coding, review the accompanying `04_SCHEMA_STARTER.sql` as a foundation illustration; expand through numbered migrations and real tests.


## Addendum v1.1 — AI/MCP storage

Bản inventory 159 bảng của v1.0 là phạm vi logical gốc. AI Control Plane bổ sung **35 candidate logical tables** (chưa xác định số bảng vật lý cuối cùng) cho agent/version/run, tool/grants/invocation, workflow/schedule/approval/step, knowledge/eval/policy. Không mặc định cộng thêm toàn bộ vào DB ở MVP và ưu tiên tái sử dụng audit_logs/domain_outbox/policy_sets. Xem `08_AI_AUTOMATION_DATA_MODEL.md`, `10_AI_CONTROL_PLANE_SCHEMA_STARTER.sql`.