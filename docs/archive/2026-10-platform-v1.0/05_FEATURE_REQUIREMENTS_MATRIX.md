# BOARD GAME UNIVERSE — Feature Requirements Matrix & Quality Gates v1.0

## Priority semantics
- **P0** Foundation: an toàn dữ liệu, trò chơi chạy đúng và phát hành được.
- **P1** Adoption: nhóm, lớp học, giải đấu, nội dung mùa và community có kiểm soát.
- **P2** Ecosystem: Coding Arena, Creator Studio, LMS, monetization, advanced analytics.
- P0 không có nghĩa mọi game/hệ thống phải triển khai hoàn chỉnh. Minimum module skeleton + essential flows là đủ.

## Functional capabilities

| ID | Domain | Feature | Persona | Priority | Acceptance / invariant |
|---|---|---|---|---|---|
| ID-01 | Identity | đăng ký, login, tài khoản người lớn | user | P0 | các phiên có thể thu hồi, rate limit, account recovery |
| ID-02 | Identity | tài khoản học sinh có định danh bền | teacher/student | P0 Edu | không yêu cầu email học sinh, đổi thiết bị không mất lịch sử |
| ID-03 | Identity | profile alias, avatar, locale | all | P0 | public profile không rò PII |
| IAM-01 | Organization | tạo organization và memberships | tenant admin | P0 | mỗi truy vấn scoped đúng organization |
| IAM-02 | Organization | RBAC+ABAC policy evaluator | backend | P0 | deny by default, no cross-tenant access |
| IAM-03 | Organization | roles contextual class/team/event/room | admin/teacher | P0 | quyền thay đổi trong một scope không lan scope khác |
| CAT-01 | Catalog | game registry + metadata + search | player | P0 | game filtering theo độ tuổi/mode/tags |
| CAT-02 | Catalog | game release versioning | game dev | P0 | match cũ luôn chỉ tới release đã chơi |
| CAT-03 | Catalog | entitlements / rollout visibility | admin | P0 | game unavailable ngoài audience |
| GAME-01 | Runtime | room/lobby/join via code | player/teacher | P0 | join token TTL, capacity, secret/private policy |
| GAME-02 | Runtime | authoritative action validation | players | P0 | turn/order/permission replay-safe |
| GAME-03 | Runtime | save snapshots + reconnect | player | P0 | restart game server không mất finalized moves |
| GAME-04 | Runtime | bot/local/spectator policies | player | P1 | game declares supported modes |
| GAME-05 | Runtime | private hand and hidden info | player | P0 for card games | no secret state leaks |
| GAME-06 | Runtime | rules conformance, replay, anti-cheat | dev/referee | P0 | deterministic test fixtures pass |
| ASSET-01 | Asset | upload Blockbench .bbmodel | designer | P0 3D | private source ACL and version |
| ASSET-02 | Asset | GLB validation, optimization, CDN | designer/ops | P0 3D | asset manifests hash-pinned |
| ASSET-03 | Asset | preview/approve/publish/rollback | editor | P1 | preview version independent of live |
| EDU-01 | Classroom | classes/enrollment and assignments | teacher | P0 Edu | assign to class/group, student access limited |
| EDU-02 | Classroom | 5E lesson / objective/standards | academic | P1 | framework version recorded |
| EDU-03 | Classroom | attempts and rubric evidence | teacher | P0 Edu | score ≠ mastery, human override audit |
| EDU-04 | Classroom | class realtime control | teacher | P1 | teacher pause/unpause scoped rooms |
| EDU-05 | Classroom | reports and export | teacher/school | P1 | only authorized rows, safe aggregation |
| TEAM-01 | Teams | create/manual/auto groups | teacher/player | P0 | membership and org policy respected |
| TEAM-02 | Teams | roles/voting/team worlds | members | P1 | vote cannot bypass action permission |
| CHAT-01 | Social | class/team quick chat | student | P0 Edu | minor safe default, rate limit |
| CHAT-02 | Social | group/free text chat with moderation | authorized member | P1 | report/block/mute/audit flow |
| CHAT-03 | Social | direct messaging restricted | adult / authorized | P2 | no stranger-to-minor DM |
| COMMUNITY-01 | Community | showcases / approval | editor/user | P1 | review before minors' public exposure |
| RANK-01 | Rankings | server-verified scores | game server | P0 | client cannot set final score |
| RANK-02 | Rankings | game/class/team/event/season filters | player | P1 | cached projection reproducible |
| RANK-03 | Rankings | freeze, appeal, rating history | referee | P1 | immutable ledger with compensations |
| EVENT-01 | Events | event templates & registrations | organizer | P1 | eligibility/capacity/date validation |
| EVENT-02 | Events | multi-stage brackets | organizer | P1 | fixtures/results/replay relation intact |
| EVENT-03 | Events | event notification schedule | organizer | P1 | retry, dedup, timezone |
| CMS-01 | Content | hero/page/cards revisions | editor | P0 | review, preview, publish, expire |
| CMS-02 | Content | month/festival campaign themes | editor | P0 | audience-aware priority and fallback |
| CMS-03 | Content | feature rollout flags | operator | P0 | kill switch, audit, staged rollout |
| CMS-04 | Content | game/event/leaderboard dynamic widgets | editor | P1 | widgets query typed APIs, no raw code injection |
| NOTIF-01 | Notification | inbox and templates | all | P0 | localized, dedup and authorized recipients |
| NOTIF-02 | Notification | digest/quiet hours/email/push | all | P1 | minors notification rate limited |
| AWARD-01 | Rewards | achievements + reversible points ledger | player | P1 | grant requires verified criteria |
| COD-01 | Coding | block workspace + generator version | student | P2 | workspace preserved reproducibly |
| COD-02 | Coding | immutable problems/testsets | author | P2 | hidden tests never delivered to browser |
| COD-03 | Coding | sandboxed code judge | learner | P2 | untrusted code isolated no network/no secrets |
| COD-04 | Coding | timed coding contest & rejudge | organizer | P2 | adjudication and version logs |
| CREATE-01 | Creator | template/no-code board editor | creator | P2 | packages conform manifest and rights policies |
| CREATE-02 | Creator | UGC approval and publishing | moderator | P2 | review/licensing safety |
| OPS-01 | Operations | logs/traces/alerts | operator | P0 | errors correlate request/match/job IDs |
| OPS-02 | Operations | backup restore test | operator | P0 | proven recovery and retention policy |
| OPS-03 | Operations | CI/CD/PR protections | developer | P0 | cannot deploy breaking builds |
| SEC-01 | Security | deletion/retention/minor safety | compliance | P0 | cross-domain deletion orchestration |
| SEC-02 | Security | reports and investigations | safety officer | P0 for chat | protected evidence/access logs |

## Season and campaign workflow acceptance

1. Editor chọn template Festival/Monthly STEM Theme, upload/reuse approved asset revisions, set theme tokens, hero, promo game, special missions, event/competition links.
2. Chọn audience: global/tenant/school/class/age band, deployment channel and locale; preview theo device and permission.
3. Schedule with IANA timezone and UTC timestamps; high-priority overlap requires conflict warning; editorial approval required before publication.
4. Time window start: publication resolver selects highest-priority eligible assignment; event triggers notifications and client refresh; no deployment required.
5. Expiry: baseline theme and evergreen content automatically restored; audit links to archived campaign/revision.
6. Emergency rollback/kill switch: disable campaign without altering stored history; all results/event registrations persist.

## Example dynamic content resolution

```text
context = { user_id, tenant_id, org_unit, age_band, locale, channel, timestamp }
get_active_publications(slot, timestamp)
  -> filter published/approved
  -> filter matching audience/locale/entitlement/safety flags
  -> sort by priority DESC, specificity DESC, published_at DESC, ID ASC
  -> select stable revision and cache by scope + locale + time-window TTL
  -> fallback default slot revision
```

User segmentation must be verified on server. Security permissions cannot be overridden by a campaign/feature flag.

## Governance checklists

- Product owner signs PRD acceptance by phase.
- Platform architect signs module boundaries and ADR.
- Security/safeguarding signs minor social and sandbox policy.
- Academic owner signs objective/standard/rubric mapping, including standard version.
- Game design lead signs rules/scoring and simulation assumptions.
- Content ops signs holiday themes, assets/license, schedule and localization.
- SRE signs backup restore, monitoring and operational runbooks.

## Launch sequence (dependency-aware)

1. **Platform foundation:** schemas, authz, game-registry, SDK, 2 reference games, CMS revision/slots, CI/CD, monitoring, backups.
2. **Cross-game gameplay:** new 2D and 3D games integrate only via published SDK, matchmaking/lobby, verified score ledger, safe teams.
3. **Education and event operations:** classes, objectives/assessments, leaderboards, event schedules, stage/fixture/tournament, notification orchestration.
4. **Seasonal operations:** theme engine, campaign builder, operator console and safe publish/rollback.
5. **Coding Arena:** block interpreter + isolated judge + problem versioning + coding tournament/testcase infrastructure.
6. **Creator ecosystem:** no-code editor, UGC review, publisher license, external integrations.