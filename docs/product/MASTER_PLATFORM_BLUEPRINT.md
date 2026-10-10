# BOARD GAME UNIVERSE — Master Platform Architecture & PRD v1.0

**Trạng thái:** Đề xuất thiết kế, chưa triển khai. **Phạm vi:** board game phổ thông, STEM/giáo dục, puzzle, game 3D, game thử thách lập trình, mạng xã hội có kiểm soát, sự kiện, giải đấu, nội dung mùa vụ. **Định hướng:** 2026–2031+.

## 1. Quyết định kiến trúc

- Dùng **modular monolith** TypeScript cho nghiệp vụ và API, chia bounded contexts, không bắt đầu bằng hàng chục microservice.
- Tách **authoritative realtime game server**; tách **isolated code execution workers** khỏi mọi dịch vụ tin cậy.
- Cấu trúc **multi-tenant** cho tổ chức, trường/trung tâm, lớp, câu lạc bộ; có account người chơi cá nhân ngoài tổ chức; mọi tương tác trẻ em có chính sách giới hạn phạm vi.
- **Catalog-driven & plugin contracts**: games và game releases độc lập với phòng/trận, assets, assignments, events, leaderboards, campaigns.
- **Config-driven CMS**: banner, theme tháng/lễ hội, missions, event landing, message templates, feature flags, release scheduling không cần sửa mã nguồn thường xuyên.
- **PostgreSQL relational source of truth**, JSONB chỉ dùng cho payload/schemas có cấu trúc và version xác định; Redis cho state tạm/cache/presence; R2/object storage cho media/GLB/source riêng tư; event outbox + worker.
- **Version immutability**: game release/rulepack, challenge revision, scoring policy, asset manifest, campaign publication snapshot không sửa ngược những gì trận/đề thi đã sử dụng.

## 2. Phân hệ nghiệp vụ — scope và quan hệ

| Domain | Đầu vào | Nhiệm vụ chính | Dữ liệu sở hữu | Sự kiện phát hành |
|---|---|---|---|---|
| Identity | Login / invite / guest | account, profile, guardian relation, session | users, identities, profiles | identity.created |
| Tenant & IAM | org invite, role | organization, membership, policies, ABAC | organizations, memberships, policies | membership.changed |
| Game Registry | signed game package | catalog, compatibility, release, license, visibility | games, game_versions, game_features | game.published |
| Game Sessions | create/join/action | room/match/state/history/reconnect | rooms, matches, participants, moves, snapshots | match.finalized |
| Matchmaking | queue request | casual/ranked/skill/region/age-safe | queues, queue_entries | match.created |
| Curriculum | course, lesson | lessons, standards, competency, assignment | courses, lessons, objectives, assignments | assignment.published |
| Learning evidence | game telemetry | mastery, rubric, teacher review, report | evidence, assessments, rubrics | assessment.finalized |
| Teams | invites/class rosters | teams, groups, roles, membership | teams, team_memberships | team.updated |
| Messaging | channel/message | chat, quick chat, moderation, report | channels, messages, report_cases | message.created |
| Community | post/submission | project showcase, content review | posts, post_reviews | post.published |
| Ranking | verified score | scoring rules, board scopes, projections | score_records, leaderboards, entries | leaderboard.updated |
| Events | organizer config | registration, time windows, sessions | events, registrations, stages | event.started |
| Tournament | schedule/brackets | format, seeding, referee, disputes | tournaments, rounds, fixtures, results | fixture.finalized |
| Rewards | verified triggers | achievements, points, collectibles | achievements, awards, wallets | reward.granted |
| CMS & Campaigns | authored content | page components, theme months, publish/schedule | content_items, revisions, campaigns | content.published |
| Notifications | event / audience | inbox, template, email, digests | notifications, deliveries, preferences | notification.sent |
| Asset Registry | Blockbench/GLB | upload, process, optimize, distribute | assets, asset_versions, asset_manifests | asset.ready |
| Coding Arena | user program | problems, testcases, sandbox, verdict | coding_problems, submissions, judge_runs | submission.judged |
| Moderation & Compliance | reports, policies | safeguarding, auditing, retention | moderation_cases, consents, audit_logs | case.closed |
| Billing/Entitlement | tenant plan | plans, licenses, feature access | plans, subscriptions, entitlements | entitlement.changed |
| Platform Ops | deploy/jobs/health | logs, feature flags, experiment, job | service configs, job executions | incident.opened |

**Bounded context rule:** module A không ghi trực tiếp vào bảng private của B; gọi application service/interface hoặc consume domain event. Một số view/read-model được chia sẻ qua projection read-only.

## 3. Ma trận vai trò nhiều phạm vi

### 3.1 Định danh vai trò
- Platform `platform_owner`, `platform_ops`, `platform_content_admin`, `platform_safety_officer`, `platform_auditor`, `support_agent`.
- Tenant `org_owner`, `org_admin`, `school_admin`, `org_content_editor`, `org_event_organizer`.
- Education `teacher`, `teaching_assistant`, `student`, `guardian`, `class_moderator`.
- Competition `tournament_director`, `referee`, `team_captain`, `competitor`, `spectator`.
- Community `community_moderator`, `channel_moderator`, `member`.
- Game `host`, `player`, `observer` (đây là roles tại room, không tương đương vai trò tenant).

### 3.2 Authorization model
- RBAC (`roles`, `permissions`, `role_permissions`) + membership theo scope (`platform`, `organization`, `school`, `class`, `team`, `event`, `room`).
- ABAC constraints (độ tuổi/nhóm tuổi, `is_minor`, verified_educator, guardian-consent state, tenant policy, user status, ownership, membership, room visibility).
- Principal/user khác player: người dùng có nhiều membership, có thể chuyển context theo trường, nhóm, hoặc cá nhân.
- Không trao super-admin quyền xem mọi chat/hồ sơ riêng mặc định; dữ liệu nhạy cảm yêu cầu just-in-time access, mục đích, approval/log.
- `can(subject, action, resource, context)` phải chạy trên backend; RLS hỗ trợ cách ly cơ sở dữ liệu nhưng không thay thế domain authorization.

### 3.3 Quyền minh họa
| Hành động | Owner tenant | School admin | Teacher | Student | Event organizer | Moderator |
|---|---|---|---|---|---|---|
| tenant.manage | Có | Không | Không | Không | Không | Không |
| classroom.create | Theo scope | Có | Có | Không | Không | Không |
| assignment.grade | Theo phân công | Theo policy | Có trong lớp | Không | Không | Không |
| room.host | Theo policy | Có | Có | Có nếu được phép | Có theo sự kiện | Không |
| event.publish | Theo scope | Có theo policy | Theo ủy quyền | Không | Có theo scope | Không |
| leaderboard.finalize | Quản lý | Không | Không | Không | Chỉ event phụ trách | Không |
| chat.message | Theo policy | Theo policy | Kênh được phép | Chỉ kênh được phép | Theo membership | Trong kênh quản lý |
| chat.moderate | Qua safety workflow | Trong phạm vi | Lớp phụ trách | Không | Event phụ trách | Trong phạm vi |
| system.feature_flag | Platform admin | Không | Không | Không | Không | Không |

**Trẻ vị thành niên:** DM với người lạ tắt mặc định; 9–11 tuổi ưu tiên quick chat/channels có giáo viên; 12–15 tuổi chat có kiểm duyệt trong kênh được phê duyệt; không tự động mở chat liên trường hoặc gắn danh tính thực lên bảng xếp hạng công khai.

## 4. Chi tiết chức năng trọng tâm

### 4.1 Identity & account
- Login email/mật khẩu/OIDC cho người lớn; tài khoản học sinh dùng định danh do trường cấp, tham gia bằng mã có hạn, có thể tái đăng nhập không phụ thuộc localStorage.
- Profiles tách private identity (PII) / public pseudonymous gamer profile.
- Account lockout, recovery, verified educator, guardian links, age gates, consent records.
- Multiple memberships + context switcher. Tenant-specific suspension không làm sai xóa tài khoản toàn hệ thống.

### 4.2 Game catalog & discoverability
- Game metadata: slug, title i18n, summary, author, publisher, license, age band, players min/max, duration, tags, categories, modalities (2D/3D/coding), compatibility, supported devices, academic alignment.
- Game availability: global / tenant / private beta / tournament exclusive / seasonal; visibility khác entitlement, khác licensed-use.
- Game releases immutable: semantic version, engine API version, state schema version, rulepack version, asset manifest, manifest signature, rollout channel.
- Recommendation/search: genre, mechanics, age, accessibility, STEM topic, time, group size, popularity; personal recommendation hạn chế dữ liệu trẻ em.
- Content pages: guide, rules, tutorial, changelog, report-a-bug, feedback.

### 4.3 Runtime & Match lifecycle
- `draft -> lobby -> ready -> running -> paused -> completed -> finalized` (+ canceled, abandoned, disputed, void).
- Room là phiên kết nối realtime, match là bản ghi ván đấu bền vững. Một tournament fixture có thể gồm nhiều matches (best-of-N); một room có thể tồn tại qua nhiều matches nếu thiết kế cho phép.
- Player `participant` có `user_id` hoặc `team_id`, seat, gameplay role, join token, reconnect claim; spectators không có quyền thao tác.
- State machine: command -> permission -> rule validate -> persisted move -> state transition -> outbox event -> realtime publish -> snapshot periodic. Sequence/server version + idempotency key.
- Private state (hand/cards/secret roles) gửi theo viewer projection, không phát toàn state tới mọi người.
- Reconnect/replay sử dụng deterministic log nếu game hỗ trợ + periodic snapshots, game version pinned.
- Bot có skill levels và algorithm adapters, không để client tự chấm kết quả.

### 4.4 Game plugin SDK
- Manifest: `game_id`, `version`, `api_version`, `engine_kind`, `capabilities`, `player_limits`, `assets_manifest_id`, `rules_bundle_id`, `state_schema_id`, `score_policy_id`, `license_id`, `supported_locales`.
- Hooks chuẩn: `createInitialState`, `getLegalActions`, `validateAction`, `applyAction`, `getPublicView`, `getPrivateView`, `getOutcome`, `getScoringEvidence`, `migrateState?`, `serialize`, `deserialize`.
- Separate renderer (React/R3F/Canvas), rules engine, content/config, game runtime. Game không trực tiếp truy cập bảng users/scores/tenant.
- Bản build game mới đi qua linter/schema validation, security/license scan, tests, performance budget, staged review/publish/rollback.
- Plugin không phải mã JS tùy ý người dùng tải lên và chạy trong process tin cậy. Đến khi có UGC code cần sandbox, signing, capability restrictions riêng.

### 4.5 Classroom
- Curriculum -> course -> unit -> lesson -> objective; standards v2017/v2026/ngss/ISTE có version; objective links game mission/level.
- School -> academic term -> class -> enrollments; assignment -> target group -> attempts -> evidence -> rubric assessment -> teacher review -> report.
- Teacher live dashboard: create rooms/groups, begin/pause/lock, quick chat, monitor signals, approve votes, intervene, replay, export gradebook.
- Do not equate win score with academic competency. Evidence provenance + manual review.
- Export CSV, roadmap OneRoster 1.2 roster/gradebook, LTI external launch khi có LMS demand.

### 4.6 Social/team/chat
- Groups là persisted social membership; Room participants là transient game seat; hai thứ khác nhau.
- Channels: direct (restricted), team, classroom, match, event, community; participant lists and policy templates.
- Chat message types: free text, quick phrase, system, poll, attachment, proposal, vote; edit/delete retention, moderation pipeline.
- Kênh trẻ em mặc định không cho share file/link tự do; report/escalate, teacher controls, rate limits, shadow moderation evidence retention policy.
- Community: post, project showcase, comments, template feedback, approval queue, safe aliases; no public contact info.

### 4.7 Leaderboards & verified scoring
- Score result is immutable, signed/attested by server. Submission -> validation -> finalized result -> score_record -> rank_projection.
- Metric registry: win_rate, rating, tournament points, efficiency, ecological balance, learning rubric, improvement, event score; unit, direction, aggregation, eligibility, minimum matches, normalization, tie-breaking.
- Board dimensions: game_version/ruleset, region/tenant/class/team/season/event/age band, time window, mode; no raw comparison across incompatible versions.
- Education leaderboards by team/class or private self-improvement; no public 'lowest performers' views.
- Snapshot freezing, appeals/disputes, anti-smurf, suspicious play signals; results reversible by authorized adjustment event, never silently overwriting history.

### 4.8 Events/tournaments/seasons
- Distinguish: `event` = business/program event; `tournament` = competitive structure; `campaign` = promotional campaign; `system_event` = integration event.
- Event builder: template, scope, schedule/time zone, eligibility, registration, capacity, teams, game pool, round configs, event content, sponsors (optional), staff permissions, moderation policy, notifications, awards.
- Stage/round formats: time attack, score attack, Swiss, round robin, elimination, group stages. Bracket generator versioned; fixtures -> matches; tie-break version.
- Seasons and challenges: daily/monthly/holiday calendar, reset and carry-over, qualification rules, prize eligibility, replay freeze.
- Live ops: schedule publish, emergency pause/abort, incident log, dispute handling, anti-cheat, prize disbursement if appropriate (non-gambling).

### 4.9 Dynamic CMS/themes/notifications
- CMS schema supports page, section, hero, carousel, card grid, game spotlight, event card, countdown, competition bracket, leaderboard widget, mission widget, footer, menu.
- `content_item` is logical identity; `content_revision` immutable body and schema version; `content_publication` binds revision, target audience, channel, times and priority; preview -> approve -> schedule -> publish -> expire/rollback.
- `campaign` binds multiple slots/content revisions/themes/missions/game offers/event promos; priority and conflict rules; always baseline fallback.
- `theme` uses design tokens: color, font family, spacing, images, decoration, ambient audio (off by default), animations; accessibility contract and reduced-motion.
- `feature_flags`: domain/feature capability rollouts, not for editorial copy. `notification_templates`: text i18n with allowed placeholders, versions, delivery channels, consent/prefs.
- Calendar uses timezone-aware start/end in UTC with authoring IANA zone; DST-safe behavior for future global expansion. Store local time zone of original schedule.

### 4.10 Coding challenges
- Separate modalities: block (Blockly/PictoBlox-like), pseudocode, JS/Python, algorithms, interactive robot missions, co-op coding tournaments.
- Problem -> immutable problem_version -> statement/i18n/assets -> test_sets (public/private) -> execution image + limits -> submission -> judge_run -> test_result/verdict -> score_record.
- Block-code submission stores workspace JSON + generated code version, generator version, validator version; evaluate equivalently and preserve original workspace.
- JS/Python code only in isolated runner: no credentials, no network egress, limited syscalls, time/memory/process/file/output quotas, ephemeral FS; never run untrusted code in Next.js API, database function, multiplayer server or on host with privileged mounts.
- Hidden tests not sent to browser; lock language/runtime version per contest; queue scheduling fairness, plagiarism/anomaly review, rejudge with audit trail.

### 4.11 Asset pipeline
- `.bbmodel` source as private immutable design source; GLB optimized derivative. Metadata includes creator, rights, license, source hash, format, polycount, drawcalls, textures, LOD, dimensions, pivot, orientation, compatible game versions.
- Asset upload -> virus/content safety scan -> normalize coordinate (+Y up, pivot bottom center) -> validate GLB -> optimize/preview -> stage -> approve -> versioned publish to R2/CDN.
- Manifest pins exact file hashes, source provenance and references; no in-place overwrite of released URLs; archive asset based on active references.

### 4.12 Entitlements and licensing
- Distinguish `can_see`, `can_launch`, `can_join_event`, `can_manage`, `owns_cosmetic`; org license may cap seats/classrooms/concurrent game rooms, not merely hide UI.
- Title/trademark/artwork/license rights are catalog metadata. Commercial titles require rights clearance before release. Payment/vendor integrations optional, separated from scoring to avoid pay-to-win.

## 5. Non-functional requirements

- Access control: every request and websocket command checks tenant and resource ownership; OWASP ASVS/API top risks used as security acceptance baseline.
- Accessibility: keyboard, screen reader for UI, high contrast, text scaling, reduced motion, non-color indicators; 3D accessible alternatives for important information.
- i18n: vi-VN first, en planned; content and notification localized; avoid hardcoded date/currency/number strings.
- Reliability: defined RPO/RTO per environment, backup/restore rehearsals, idempotent queue jobs, DB outbox, match recovery.
- Performance: game render targets set by device class and measured; room sync and API latency SLOs after baseline; client adaptive 3D graphics.
- Security: separate secrets and runtime isolation, TLS/WSS, CSP, rate limit, abuse detection, dependency/SBOM scanning.
- Observability: OpenTelemetry traces/metrics/logs correlated with tenant_id (when safe), request_id, match_id, message_id, trace_id; never record code secrets or message contents in telemetry by default.
- Privacy: minimal PII, separate minors/profiles, retention policies, legal basis/consent management, deletion/anonymization workflows, cross-border processing review.

## 6. Rollout milestones

1. **Foundation 0–3 months:** IAM, tenancy, game registry, basic rooms, 2 reference games, DB migrations, CMS primitives, observability, feature flags.
2. **Playable platform 4–6 months:** 6–10 games spanning 2D/3D/puzzle, score ledger, ranked opt-in, classroom/team MVP, notifications, asset pipeline.
3. **Live events 7–10 months:** content scheduler, seasons, tournaments, brackets, moderation, leaderboards and campaign theme rollouts.
4. **Coding pilot 11–15 months:** Blockly editor + source versioning + isolated runner + problem authoring + test sets + contest scoring.
5. **Scale & ecosystem 16–24+ months:** org integrations, licensing, community moderation, plugin developer kit, advanced search/reporting, mobile/PWA offline support where safe.

Mốc chỉ là thứ tự và ước lượng planning, không phải cam kết thời gian. Scope, đội ngũ, pháp lý và benchmark pilot quyết định lịch chính thức.

## 7. Architecture Decision Records (ADR) bắt buộc

- ADR-001 Modular Monolith First
- ADR-002 Tenant Scope and Tenant-owned Data
- ADR-003 Authorization: RBAC + ABAC + RLS
- ADR-004 Game Registry / Immutable Versions
- ADR-005 Runtime Command and State Protocol
- ADR-006 Realtime Room Hosting and Recovery
- ADR-007 Score Ledger and Leaderboard Projections
- ADR-008 CMS Publication, Scheduling, and Rollback
- ADR-009 Safe Children Communications
- ADR-010 Isolated Untrusted Code Runner
- ADR-011 Asset Source / Delivery Versioning
- ADR-012 Data Retention and Deletion

## 8. Chính sách vận hành

- Tách dev/staging/prod; staging test không dùng PII học sinh thực, production thay đổi schema qua migration được review, backup trước major data changes.
- Daily backups theo cam kết dịch vụ + copy độc lập, restore drill; RPO/RTO chọn theo mức quan trọng, không mặc định backup nghĩa là có khả năng khôi phục.
- Runbook: website down, websocket outage, score mismatch, tournament dispute, compromised account, leaked asset, abusive chat, sandbox escape incident.
- Audit trails actor/action/resource/old-new summary/reason/request_id, cấu trúc immutable hoặc append-only, có quyền truy cập riêng và retention rõ.
- Seasonal/campaign QA: preview theo role/tenant/age/timezone/device, schedule conflict resolution, rollback một bước, emergency kill switch.


## Addendum v1.1 — AI/MCP/Automation là kiến trúc cấp một

**Architecture priority change:** AI & MCP Control Plane là hạ tầng bắt buộc từ Phase 0, không chờ Coding Arena/Creator Studio. MCP Gateway cung cấp truy cập chuẩn hóa tới domain application services, tích hợp AI Agents + lịch tự động hóa + quy trình approval/Audit. Không cấp production raw DB/shell cho Agent. Xem `06_MCP_AI_AGENT_CONTROL_PLANE.md`, `07_MCP_TOOL_CATALOG_AND_PERMISSIONS.md`, `08_AI_AUTOMATION_DATA_MODEL.md`, `09_MCP_AUTOMATION_WORKFLOW_RECIPES.md`.