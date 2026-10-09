# BOARD GAME UNIVERSE — Repository, Engineering & Operations Governance v1.0

## 1. Monorepo chuẩn

```text
board-game-universe/
├── apps/
│   ├── web/                        # Next.js: gamer + teacher portal
│   ├── admin/                      # Admin console; có thể merge vào web khi MVP
│   ├── api/                        # Modular backend (NestJS/Fastify)
│   ├── realtime/                   # Colyseus game rooms
│   ├── jobs/                       # Workers, scheduler, outbox, score projections
│   └── code-judge-gateway/         # Isolated judge orchestrator; runner tách hạ tầng
├── packages/
│   ├── contracts/                  # OpenAPI/ws/event JSON schemas, DTOs
│   ├── authz/                      # Permission evaluator RBAC+ABAC
│   ├── domain-kernel/              # IDs, clocks, result types, outbox
│   ├── game-sdk/                   # Abstract GameModule, hooks, version schema
│   ├── game-ui/                    # 2D primitives, panels, cards
│   ├── game-3d/                    # R3F/Three scene, grid, assets, picking
│   ├── design-system/              # UI components, tokens, accessibility
│   ├── database/                   # migrations, schemas, seed data
│   ├── config/                     # typed config/env/flag interfaces
│   ├── telemetry/                  # OpenTelemetry adapters
│   ├── testing/                    # fixtures, rule conformance, mocks
│   └── localization/               # locale packs
├── games/
│   ├── classic/chess/
│   ├── classic/gomoku/
│   ├── stem/eco-city-lab/
│   ├── stem/roboroute/
│   └── coding/robot-maze/
├── content/
│   ├── campaigns/                  # versioned content seeds and manifests
│   ├── curricula/                  # academic mappings and reviewed content
│   └── game-catalog/               # non-secret catalog fixtures
├── tools/
│   ├── asset-pipeline/
│   ├── db-maintenance/
│   ├── game-scaffolder/
│   └── release-validator/
├── infra/
│   ├── docker/
│   ├── terraform/
│   ├── monitoring/
│   └── runbooks/
├── docs/
│   ├── prd/
│   ├── architecture/
│   │   ├── adr/
│   │   ├── c4/
│   │   └── data-dictionary/
│   ├── api/
│   ├── games/
│   ├── content-operations/
│   └── quality/
├── .github/
│   ├── workflows/
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── README.md
```

## 2. Dependency rules

- `games/*` depend on `game-sdk`, `contracts`, `design-system`, never on platform DB or API infrastructure directly.
- `apps/web` depend on public SDK clients/contracts, not private database modules.
- `apps/realtime` depends on game rules and interfaces, not UI/Three.js renderer.
- `apps/jobs` consumes outbox events to update projections; no hidden direct UI side effects.
- `code-judge-gateway` accesses only job queue and isolated executor; no privileged cloud secret injection into user code.
- `packages/domain-kernel` has no dependencies on application services/frameworks.
- Cyclic dependencies fail CI (e.g. dependency-cruiser or Nx boundaries).

## 3. Team ownership / CODEOWNERS template

```text
/.github/                       @platform-leads
/apps/api/                      @backend-team
/apps/realtime/                 @game-runtime-team
/apps/code-judge-gateway/       @security-team @coding-team
/packages/authz/               @security-team
/packages/database/            @backend-team @security-team
/packages/game-sdk/            @game-runtime-team
/packages/design-system/       @frontend-team
/games/stem/                   @game-design-team @academic-team
/content/curricula/             @academic-team
/content/campaigns/             @content-ops-team
/infra/                         @devops-team
/docs/architecture/adr/         @platform-leads
```

Team names are placeholders to replace by actual GitHub organization teams.

## 4. Branch, release, review

- Trunk-based: `main` protected, short-lived `feat/`, `fix/`, `chore/`, `hotfix/`. Every merge via PR.
- Required checks: lint, typecheck, unit, integration, contract, migration, game rule conformance, secret scanning, dependency audit, license check, required reviewer.
- PR template: reason, affected domains, schema/API/event changes, migration plan, tests, screenshots, rollback, security/privacy impact.
- Changes to auth/data/coding sandbox require two-person review and security sign-off. Content and seasonal changes require editorial preview/approval (not necessarily deploy).
- Release train: weekly non-breaking deploys, controlled major game-rule releases, hotfix process. SemVer for published game releases and public SDK; pin matches to released artifacts.
- Feature flags for dark launch; no breaking DB columns in same release as code migration. Expand -> backfill -> switch -> contract sequence.

## 5. Test pyramid

- **Unit:** game rules deterministic, scoring, permission policy, schedule validator, code exercise validators.
- **Property-based:** invariants in games (turn order, budget non-negative, no duplicated cards, legal ownership), scoring conservation, idempotency.
- **Contract:** game manifest schema, websocket messages, version compatibility, event schemas, API OpenAPI clients.
- **Integration:** authorization under cross-tenant contexts; DB constraints; fake timers for event schedule; asset registry links; outbox -> projection.
- **E2E:** student join class -> start room -> finish -> grade; event registration -> tournament -> rank; publish campaign -> expire -> baseline theme.
- **Load & chaos:** concurrent rooms, websocket reconnect, database overload, Redis down, code judge resource exhaustion, broken asset URL.
- **Security:** OWASP ASVS/API tests, unsafe file uploads, PII access, privilege escalation, sandbox escape attempts.

## 6. Data governance and operational ownership

- Mỗi table có owner domain, retention class, PII class, export/delete behavior, read/write APIs, expected volume/indexes.
- Mỗi `system_event` có producer, schema version, PII classification, consumer list, idempotency policy và dead-letter handling.
- Dashboard sự cố tập trung: availability, latency, connected rooms, reconnect rate, judge queue depth, game failure, event scheduling lag, notification delivery, rank consistency, suspicious chat alerts.
- Tham số SLO/RPO/RTO phải đo và chốt với product owner trước production, không hứa '99.9%' nếu chưa đầu tư tương ứng.

## 7. Anti-patterns cần cấm

1. Game tự viết bảng users/leaderboard/room đặc thù; thay vì dùng game SDK.
2. Sửa trực tiếp game rule version đã có trận lưu.
3. Dùng chung `event` table cho tournament, content campaign và technical integration event.
4. Dùng Redis như nguồn dữ liệu cuối cùng hoặc lưu chỉ ở bộ nhớ room.
5. Lưu bảng `all_data(id, type, payload JSONB)` cho mọi thứ.
6. Gọi API bên thứ ba trực tiếp trong deterministic rule evaluation.
7. Chấp nhận client gửi final_score mà không có server attestation.
8. Để học sinh tự do nhắn tin/trao đổi PII khi chưa thiết kế safeguarding.
9. Chạy user-submitted code trong API / Next.js / privileged Docker container.
10. Bật holiday theme bằng chỉnh hardcoded JSX/CSS và deploy gấp.
11. Cho phép AI coding agents push thẳng main, sửa migration production, hoặc đọc secrets.
12. Xóa dữ liệu người dùng nhưng để PII trong analytics, messages, logs và backup mà không có chính sách toàn hệ thống.

## 8. AI Agent làm việc trên repository

- Agent phải đọc `/docs/architecture` + `AGENTS.md` của domain trước khi sửa, giữ API contracts.
- Tạo task spec: context, expected behavior, touched modules, tests, migration risk, acceptance criteria.
- Agent có sandbox/dev data, không nhận production secrets, không deploy production tự động.
- PR AI phải có test output, affected schemas, diff summary và human review; game rule & privacy changes cần domain owner xác nhận.
- Các phản hồi/đánh giá của Agent được ghi trong PR và ADR; không coi AI-generated code là được kiểm thử chỉ vì nó compile.


## Addendum v1.1 — AI-native engineering

Thêm apps `mcp-gateway`, `agent-orchestrator`, `automation-worker`, `ai-ops-console`; packages `mcp-contracts`, `mcp-policy`, `agent-sdk`, `workflow-engine`, `ai-evals`, `integration-broker`; tools integrate via domain APIs. Toàn bộ agent code edits require isolated branches, CI, CODEOWNERS and explicit deployment gate; sensitive production mutation inaccessible. Xem `11_AI_AGENT_REPOSITORY_RULES.md`.