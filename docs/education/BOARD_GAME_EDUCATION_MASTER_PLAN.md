# BOARD GAME EDUCATION — MASTER DEVELOPMENT PLAN

**Phiên bản:** 1.0 · **Ngày:** 09/10/2026 · **Thời lượng kế hoạch:** 24 tuần (ước lượng) · **Đầu vào:** `01_BOARD_GAME_EDUCATION_PRD_V1.md`

> **Phương pháp:** Product discovery → Learning Design → Engineering foundation → Vertical slice → Pilot → Hardening → Release. Chỉ chuyển giai đoạn khi đạt quyết định chất lượng (gate) và không có lỗ hổng nghiêm trọng chưa xử lý.

## 1. Mục tiêu dự án và định nghĩa hoàn thành

**Kết quả phải bàn giao:** Web Board Game Education có 6 trò chơi giáo dục hoạt động đúng luật, lớp học, tạo nhóm, giao nhiệm vụ, live session, dữ liệu đánh giá, báo cáo giáo viên, công cụ quản trị nội dung, kiểm thử bảo mật/hiệu năng, tài liệu triển khai và học liệu sử dụng.

**Không nhầm MVP với bản demo:** bản demo có thể chỉ chơi được RoboRoute; MVP cần trọn luồng teacher → learner → assessment → report, bao gồm lưu phiên và phân quyền.

### 1.1 Yêu cầu pilot

- Tối thiểu 2–3 lớp pilot (mỗi lớp khoảng 20–35 học sinh), đủ để khám phá lỗi UX và quy trình vận hành; mẫu nhỏ không đủ chứng minh tác động học thuật tổng quát.
- Ít nhất 2 giáo viên được tập huấn, có checklist chấm rubric và phản hồi sau tiết học.
- Không sử dụng dữ liệu trẻ thực trước khi có phê duyệt tổ chức, cơ sở pháp lý, thông báo rõ ràng và kiểm soát phù hợp.

## 2. Nguyên tắc quản trị chương trình

1. **Pedagogy-first:** Learning Objective + evidence + rubric phải được duyệt trước khi phát triển một game.
2. **One shared engine:** Luật theo module, dùng chung auth, session, analytics.
3. **Vertical slice first:** Hoàn tất RoboRoute end-to-end trước khi mở rộng song song.
4. **Quality gates:** Chưa đủ logic/đánh giá/UI/security thì không phát hành.
5. **Child safety by design:** Không thu dữ liệu trẻ không cần; hạn chế công khai/xếp hạng và ưu tiên teacher control.
6. **Progressive enhancement:** Hoạt động lớp không mạng, tài liệu offline/PDF và phương án dự phòng khi mạng yếu.
7. **Version everything:** Ruleset, challenge, rubric và chuẩn giáo dục có edition, version, reviewer.

## 3. 24 tuần và các cổng quyết định

| Phase | Thời gian | Kết quả bắt buộc | Gate |
|---|---|---|---|
| P0 Discovery & Specification | W1–W3 | Scope signed, personas, benchmark, UX journey, pedagogical maps, architecture ADR | G0: PRD approved |
| P1 Platform Foundation | W4–W7 | Monorepo, auth/RBAC, tenant, classroom, basic game SDK, CI/CD, RoboRoute vertical slice | G1: end-to-end slice |
| P2 Classroom + 3 Games | W8–W12 | Assignment, groups, session, report v0, RoboRoute/Logic Islands/Pattern Forge QA | G2: teaching flow test |
| P3 All 6 Games + Analytics | W13–W17 | Data Detective, Eco City Lab, Bridge Builder, rubric, learning events, curriculum content | G3: content & systems QA |
| P4 School Pilot & Iterate | W18–W21 | Pilot 2–3 lớp, lesson plans, observed UX, accessibility & load testing, revisions | G4: pilot sign-off |
| P5 Release & Operations | W22–W24 | UAT, data/legal review, release runbooks, backups, training, production handover | G5: production go/no-go |

Các phase có thể chồng chéo giữa engineering và R&D học liệu, nhưng **gate không được bỏ qua**. Bất kỳ thay đổi phạm vi nào phải có impact estimate tới game modules, content production, privacy và teacher workflows.

## 4. WBS — Chi tiết từng giai đoạn

### PHASE P0 (W1–W3): Product Discovery & Learning Research

**Team:** Product Owner (PO), Academic Lead, Game Designer, UX Lead, Tech Lead, QA Lead.

- W1: stakeholder workshops; user journeys giáo viên–học sinh; chốt tuổi mục tiêu, thiết bị và tình huống lớp; kiểm tra cơ chế tài khoản/định danh.
- W1: benchmark các game học thuật; danh sách mechanics được phép tái sử dụng; rà soát thương hiệu và giấy phép asset.
- W2: chuẩn hóa Learning Objective, evidence, rubric, challenge template, standard edition mapping; xác định rubric grade-band.
- W2: wireframe Home, Library, Game Detail, Join Session, Teacher Class Dashboard, Session, Game Table, Result, Analytics.
- W3: technical spike: 1 game grid, session/join, server-auth turn, save and restore; đánh giá boardgame.io và fallback custom.
- W3: chốt threat model và data privacy inventory; xác định nhà cung cấp lưu trữ và trách nhiệm xử lý dữ liệu.

**Artifacts:** approved PRD, architecture decision records (ADR), GDD template, standards map, UX flow, data inventory, risk register, milestone backlog.

**Gate G0:** đạt consensus scope, ưu tiên, game list, analytics event schema; các mâu thuẫn với chuẩn học tập được sửa.

### PHASE P1 (W4–W7): Platform Foundation + RoboRoute vertical slice

- Thiết lập monorepo, branch protection, code review, eslint/format/typecheck, CI unit/integration/E2E.
- Tenant, RBAC, giáo viên login, classroom roster cơ bản, anonymous/pseudonymous student join.
- Game SDK, action validation server, idempotency, replayable event log + snapshots.
- Board renderer responsive và component kit: grid, tile, pawn, card, piece inspector, hint, sound, tutorial overlay.
- RoboRoute 4 thử thách đầu tiên có 3 cấp prototype, event evidence và rubric v0.
- Kết nối assignment/session/rules/evidence/report của một game từ đầu đến cuối.

**Artifacts:** repo + dev staging, OpenAPI draft, DB migrations, design tokens, prototype GDD, tests, video demo vertical slice.

**Gate G1:** giáo viên tạo lớp/giao một nhiệm vụ; 2 học sinh tham gia, hoàn thành và GV xem được kết quả; lỗi sai lượt/idempotency/tenant negative tests đạt.

### PHASE P2 (W8–W12): Classroom features + Core 3 Games

- W8: teacher can create assignment with audience, game, variant, duration; classroom dashboard.
- W9: groups and session orchestration: create/start/pause/resume/end, reconnect.
- W10: Logic Islands complete with conditional card mechanics; editor stage flow.
- W11: Pattern Forge complete with tile matcher; build review + guide.
- W12: tất cả 3 game có ≥12 challenges, rubric, teacher hints, localization và test rules.

**Artifacts:** game pack 3, Content QA data, classroom E2E, session incident test, lesson 35/60/100 minute templates.

**Gate G2:** lớp 20 học sinh giả lập không lộ dữ liệu; mỗi game có 3 cấp; teacher dashboard thống nhất.

### PHASE P3 (W13–W17): STEM games + Learning Analytics

- W13: Data Detective (card evidence, tables/graphs, reasoning tasks) và rubric đánh giá chứng cứ.
- W14–W15: Eco City Lab (resource/turn/event tiles, scoreboard và quyết định trade-offs).
- W15–W16: Bridge Builder (construction board, deterministic rules, test/improve cycle); review tính hợp lý của giả lập giáo dục.
- W16: analytics event processing, teacher observations, overrides/audit, outcomes by LO, CSV report.
- W17: release candidates game x6, đủ 12 challenges/game tối thiểu; failure modes, stale-session tests, content approval.

**Artifacts:** 6 GDDs, 72 challenges tối thiểu, 6 game executables, rule tests, assessment report, teacher handbook v0.

**Gate G3:** full regression, không có blocker chức năng/learning; 100% learning evidence traceable; security P0 pass.

### PHASE P4 (W18–W21): Pilot & Evaluation

- Chuẩn bị giáo viên, thông báo tới trường/phụ huynh theo đúng yêu cầu, rosters pseudonymous.
- Test tại lớp với người thật có sự đồng ý/ủy quyền cần thiết; teacher observation, child usability, network conditions.
- Thu phản hồi định tính: luật game có rõ không, học sinh có suy luận hay thử đoán, dashboard có hỗ trợ can thiệp hay không.
- Pre/post mini-task trên cùng LO với mức tương đương; chỉ phân tích xu hướng học tập, không khẳng định tác động nhân quả.
- Accessibility, performance, security, backup/restore drills, report accuracy; sửa lỗi P0/P1.

**Artifacts:** pilot protocol, teacher survey, learner observation notes, evaluation report, revised content, prioritized fixes.

**Gate G4:** pilot criteria đạt theo PRD hoặc có chấp thuận scope deviation; không còn bug Critical/High chưa xử lý.

### PHASE P5 (W22–W24): Production Readiness & Release

- Hoàn thành UAT với giáo viên; chạy migration/restore rehearsal; backup, monitoring, alert, rate-limit.
- Review chính sách dữ liệu, retention, DPA, điều kiện sử dụng; domain, TLS, logging an toàn.
- Soạn SOP support lớp khi game bị gián đoạn; mô phỏng ngắt mạng và failover.
- Video hướng dẫn học sinh, manual giáo viên, release notes, content release process.
- Soft launch → theo dõi hành vi/incident → quyết định public release/giới hạn người dùng.

**Artifacts:** signed UAT, release checklist, runbooks, teacher training, changelog, deployment docs.

**Gate G5:** PO + Academic + Engineering + Security/Data owner cùng ký Go/No-Go.

## 5. Deliverables structure

```text
board-game-education/
├── product/
│   ├── PRD.md
│   ├── ROADMAP.md
│   ├── REQUIREMENTS_TRACEABILITY.md
│   ├── user-stories/
│   └── ADR/
├── academics/
│   ├── standards-mapping/
│   ├── learning-objectives/
│   ├── rubrics/
│   ├── lesson-plans-5e/
│   ├── challenge-bank/
│   └── pilots/
├── design/
│   ├── tokens/
│   ├── wireframes/
│   ├── prototypes/
│   └── assets/
├── apps/
│   ├── web/
│   ├── api/
│   └── game-server/
├── packages/
│   ├── game-core/
│   ├── game-ui/
│   ├── classroom-sdk/
│   ├── analytics-events/
│   └── shared-types/
├── games/
│   ├── roboroute/
│   ├── logic-islands/
│   ├── pattern-forge/
│   ├── data-detective/
│   ├── eco-city/
│   └── bridge-builder/
├── infra/
│   ├── docker/
│   ├── database/
│   └── monitoring/
└── docs/
    ├── teacher-guide/
    ├── operations/
    ├── security/
    └── testing/
```

## 6. Team & RACI

**Khuyến nghị phân bổ:** 1 PO/Academic Lead (có thời gian dành cho review), 1 Game Designer/Content Designer, 1 UI/UX Designer (0.5–1 FTE), 2–3 fullstack/game developers, 1 backend-focused developer (nếu không nằm trong số developer trước), 1 QA automation (0.5–1 FTE), 1 DevOps/security kiêm nhiệm (0.2–0.5 FTE). Nguồn lực tương đương thường ~5–7 FTE trung bình theo giai đoạn.

| Công việc | Accountable | Responsible | Consulted |
|---|---|---|---|
| Scope & milestone | Product Owner | PM/BA | Academic, Tech Lead |
| Learning objectives | Academic Lead | Curriculum Designers | Teachers, Game Designer |
| Rule/game design | Game Lead | Game Dev + Designer | Academic, QA |
| User experience | UX Lead | UI/UX Designers | Teachers, Students (pilot) |
| Security/data governance | Product/Data Owner | Tech Lead, Security | Legal/School |
| Release readiness | Product Owner | QA + Engineering | Academic, School representatives |

**Ước lượng nguồn lực:** 24 tuần × bình quân 5–7 FTE ≈ 120–168 person-weeks. Đây là khung hoạch định, không phải báo giá; xác định ngân sách sau technical spike và mức chất lượng mong muốn.

## 7. Nội dung R&D & production pipeline

### 7.1 Quy trình một game

1. Đề xuất game: tuổi, mục tiêu học tập, skill, tình huống đời thực, board mechanic độc đáo.
2. Academic brief: 2–4 measurable LOs, CSTA/NGSS/ISTE edition, assessment evidence.
3. Game Design Document: setup, components, turn structure, action list, valid moves, scoring, win/lose, edge cases, states, tutorial.
4. Paper prototype / offline class activity: học sinh thao tác bản giấy, thu lỗi hiểu luật.
5. Interactive prototype: UI + ruleset; teacher đánh giá có hỗ trợ mục tiêu hay không.
6. Challenge authoring: 12 scenarios (3 cấp × 4), hints, answer variants, rubric, instructions.
7. Pedagogical QA: độ khó, thuật ngữ, hướng dẫn, độ phù hợp tuổi, evidence.
8. Technical QA: invariant/validator tests, deterministic seeds, replay, reconnect, browser.
9. Child UX review: test 5–8 học sinh trong một đợt moderated usability (tùy phê duyệt và quyền dữ liệu), điều chỉnh visual/tutorial.
10. Publish & monitor: release version immutable, track lỗi nội dung, thực hiện retro.

### 7.2 Template GDD per game

- Game ID / Title / Theme / Age / estimated minutes / player count / mode / devices.
- Narrative hook / learning objectives / standard edition mapping / prerequisites.
- Board geometry / tokens / deck / initial setup / resource rules.
- Move/action input / validity / turn rules / timeout / disconnect / end conditions.
- Special cases: draw, invalid action, reshuffle, simultaneous choices, hidden state.
- Difficulty settings / procedural generation / hints / fairness/determinism.
- Evidence map (action → learning concept) / scoring / rubric / reflection.
- UI states / auditory cues / accessibility / onboarding / art asset list.
- Teacher notes / offline warm-up / multiplayer roles / 5E extension.
- Automated test fixtures / edge cases / performance budget / reviewer / change log.

## 8. Beispiel Product Backlog — 4 mức ưu tiên

| Epic | P0: bắt buộc | P1: khi đã vững | P2: mở rộng |
|---|---|---|---|
| Identity | Teacher login, tenant RBAC, student code | Passless student return | SSO/LTI |
| Classroom | Roster, group, assignment, sessions | Projector, differentiations | School multi-tenant admin analytics |
| Game Engine | Modules, turns, validation, persistence, evidence | Replay UI, richer effects, bots | Game Creator SDK public |
| Game Library | 6 giáo dục | +6 V1 games | 20–30 games |
| Learning Analytics | LO-based status, rubric, CSV | Growth reports | Adaptive intervention recommendations |
| Content | GDD + 12 challenges/game, QA gates | 35/60/100 lesson bank | Community marketplace |
| AI | Không AI cần cho core | Teacher drafts with mandatory review | Optional explain-tutor within guardrails |
| Integrations | Import CSV | Google Classroom/LMS proof-of-concept | OneRoster 1.2, LTI 1.3 |

## 9. Sprints và dependency

Giả định sprint 2 tuần. Mỗi sprint có backlog đã refined, story acceptance, tech + academic reviewers, QA regression. Sau 12 sprint tạo MVP. Các mốc có đường găng:

`LO/Rubric lock → GDD lock → Engine move & evidence schema → Game vertical slice → Classroom assignment/session → Game pack production → Assessment → Pilot → Release`

**Bottleneck cần bảo vệ:** nếu Academic Review chậm, game development sẽ tạo sai gameplay hoặc thiếu learning evidence. Cần review nội dung song song và chốt sớm schema. Nếu game engine bị thiết kế quá tổng quát, sẽ trì hoãn vertical slice; nên chỉ trừu tượng hóa sau game thứ hai, dựa trên vấn đề thực tế.

## 10. QA & Testing Strategy

### 10.1 Pyramid

- Unit tests: validators, scoring, board state invariants, challenge generation, learning event extraction.
- Property-based tests: mọi nước đi hợp lệ không phá invariant, không nhân đôi tài nguyên, chỉ current player được thao tác.
- Integration: auth/tenant, assignments/sessions, game server persistence, analytics, report.
- E2E: teacher 10-step workflow; student join, complete, reconnect; multi-user turn.
- Security: IDOR/tenant negative tests, token/access-code expiry, rate-limit, input sanitization, export authorization, backup encryption.
- Academic: content review, độ khó, nhiều lời giải hợp lệ, rubric alignment và tần suất hint.
- Child UX: quan sát thực địa, accessibility, comprehension, tác động của hướng dẫn.
- Load: 30 clients/room classroom; 10 classrooms đồng thời; lưu game snapshots và analytics dưới tải (baseline trước, nâng ngưỡng sau).

### 10.2 Definition of Done cho một game

`[ ]` GDD approved · `[ ]` 3 levels, ≥12 challenges · `[ ]` zero blocker rules · `[ ]` all valid solution variants tested · `[ ]` evidence/rubric · `[ ]` lesson links · `[ ]` accessibility checks · `[ ]` local/tablet tests · `[ ]` bad-network recovery · `[ ]` versioned manifest · `[ ]` teacher guide · `[ ]` content reviewer sign-off.

### 10.3 Release gates

- Game critical rules pass: 100% các kịch bản bắt buộc; không có known critical incorrect solutions.
- 100% privileged exports/roster APIs có kiểm quyền và audit phù hợp.
- Không có unpatched Critical/High security finding.
- Restore backup test và rollback staging chứng minh thành công.
- Teacher pilot đạt minimum onboarding goals hoặc có mitigation bằng training/tooltips và owner rõ ràng.

## 11. Analytics/Evaluation Plan

**Product KPIs (chỉ đo liên quan):** teacher task completion, join under 2 minutes, active session success, crashed games, p95 load, learning evidence completeness, weekly teacher assignment rate, teacher satisfaction.

**Learning evaluation:** giáo viên chọn mục tiêu, bài kiểm tra trước/sau tương đương, rubric 0–3, so sánh sản phẩm/hành vi, đánh giá định tính qua giải thích của học sinh. Báo cáo cần tách hành vi click, outcome game và evidence học tập; không ghi nhận thắng game = thành thạo.

**Pilot review questions:** 1) Trẻ hiểu luật mà không cần trợ giúp nhiều không? 2) Có ít nhất hai lựa chọn chiến lược ý nghĩa không? 3) Hoạt động offline bổ trợ được thử thách online không? 4) Dashboard hỗ trợ giáo viên can thiệp không? 5) Học sinh giải thích được cách sửa khi sai không? 6) Dữ liệu có tối thiểu hóa và quyền đúng không?

## 12. Risk Register & mitigations

| ID | Rủi ro | Mức | Kiểm soát |
|---|---|---|---|
| R01 | Làm nhiều game nhưng không có chiều sâu giáo dục | Cao | Academic gate trước development; 6 game core |
| R02 | Lạm dụng AI để suy diễn năng lực | Cao | AI không chấm cuối cùng; rubric minh bạch, teacher review |
| R03 | Trẻ không hiểu luật | Cao | Tutorial, visual, offline paper prototype, child usability |
| R04 | Multiplayer mất đồng bộ/duplicate moves | Cao | Authoritative server, idempotency, session version, reconnect tests |
| R05 | Lộ dữ liệu học sinh/tenant | Rất cao | RBAC, pseudonym, encryption, secure export, negative testing |
| R06 | Framework phụ thuộc/ít cập nhật | Trung bình | Spike & ADR, layer adapter thuần TS, lock versions |
| R07 | Nội dung NGSS/CSTA map sai hoặc quảng cáo "certified" | Cao | Reviewer chuyên môn, phiên bản chuẩn rõ, không claim chứng nhận |
| R08 | Bridge Builder bị hiểu là phân tích kỹ thuật thực | Trung bình | Mô tả simulation rule-based, rõ giới hạn |
| R09 | Trường có Wi-Fi yếu / chia sẻ tablet | Cao | Autosave, reconnect, classroom offline handouts, test mạng yếu |
| R10 | Content production trở thành nút thắt | Cao | Challenge schemas, kế hoạch 72 challenges, content QA sprint song song |
| R11 | Thiết kế xếp hạng tạo áp lực không phù hợp | Trung bình | Tắt leaderboards cá nhân công khai, ưu tiên achievement/mastery riêng |
| R12 | Tích hợp LMS quá sớm | Trung bình | CSV MVP, OneRoster/LTI sau pilot |

## 13. Triển khai và vận hành

### 13.1 Environments

- Local: Docker Compose PostgreSQL/Redis, mock students, fixtures, storybook.
- Dev: shared integration, synthetic data, automated seed.
- Staging: production-like auth/policies, smoke+UAT, anonymized fixtures.
- Production: least-privilege, isolated secrets, TLS, monitoring, backups, audit.

### 13.2 Runbooks bắt buộc

- Class cannot join: status-page, teacher fallback, recreate session, reissue code.
- Game rules bug: stop publishing offending version, rollback ruleset, preserve historical attempts, regrade only with explicit controlled procedure.
- Broken report: suspend export, audit incident, rebuild analytics projections from event log.
- Data incident: access revoke, investigation, notifications, preservation per legal obligations.
- Cloud outage: disable new sessions, handle existing state, restore, communicate with teachers.

### 13.3 Deploy policy

Release train 2-week after MVP, feature flags by tenant/game, canary teacher accounts, rollback artifact/image, database additive migrations, content version immutable. Chỉ mở rộng public sau khi có dữ liệu ổn định của pilot.

## 14. Mô hình tài chính và phạm vi

Chi phí gồm công phát triển/thiết kế/học thuật/QA, hosting+database+storage+monitoring, thương mại hóa phần mềm (nếu có), sản xuất hình ảnh/âm thanh, legal/compliance, tập huấn giáo viên và hỗ trợ pilot.

**Dự toán quy mô theo nguồn lực:** ~120–168 person-weeks trong 24 tuần tùy phần thời gian và chuyên môn. Không nên công bố giá tổng tiền khi chưa biết mức nhân công, asset sourcing, độ phức tạp các game, lựa chọn hosting, SLA hoặc mức yêu cầu compliance. Có thể cắt scope thành 3 game + core platform để có MVP 12–16 tuần nếu nguồn lực nhỏ, nhưng cần giữ đầy đủ vòng teacher→student→evidence.

## 15. Hướng phát triển sau MVP

### V1 (sau pilot, khoảng 2–3 tháng)

- 6 game thêm: Gomoku, Reversi, Fraction Trail, Probability Quest, Network Route, Circuit Quest.
- Teacher Lesson Designer 35/60/100 phút, bảng báo cáo tiến bộ, giao bài phân hóa.
- Audio/visual inclusivity nâng cao, print-offline kits và tùy chọn projector.
- LMS: OneRoster CSV hoặc kết nối có chọn lọc trước khi làm LTI 1.3/Advantage đầy đủ.

### V2 (mốc phụ thuộc giá trị thực tế)

- Game Creator template dựa trên engine đã kiểm soát; workflow duyệt nội dung và copyright.
- Hợp tác theo nhóm, giải đấu nội bộ có kiểm soát, trò chơi liên môn.
- AI copilot cho giáo viên tạo draft challenge/rubric với kiểm duyệt bắt buộc, không đưa dữ liệu học sinh không cần thiết tới LLM.
- Bộ game theo chủ đề địa phương/văn hóa, mở rộng age bands, tăng học liệu STEAM.

### V3

- Marketplace học liệu đã kiểm duyệt, hệ thống chứng minh chất lượng, kết nối LMS chuẩn, multi-tenant có dashboard cấp trường.
- Personalization theo lựa chọn của giáo viên, tiêu chí minh bạch và ngăn suy diễn nhạy cảm từ hành vi trẻ.

## 16. Ngay sau khi phê duyệt PRD — Execution Checklist

1. Chỉ định PO, Academic owner, Tech Lead, UX, QA và Data/Privacy owner.
2. Tổ chức kick-off duyệt 7 product decisions trong PRD.
3. Tạo issue tracker với epic `Identity`, `Classroom`, `Game SDK`, `RoboRoute`, `Evidence`, `Reports`, `Content`, `Security`.
4. Soạn wireframe các luồng teacher/student và bộ UI tokens.
5. Chốt mẫu `Game Design Document`, `Challenge`, `Learning Objective`, `Rubric`, `StandardReference`.
6. Spike vertical slice RoboRoute 1 tuần, đo khó khăn engine/network/data, cập nhật ADR.
7. Dựng môi trường repo + CI/CD + cơ chế PII-safe logs.
8. Lên lịch Academic weekly QA và kỹ thuật demo 2 tuần/lần.
9. Dự trù danh sách 2–3 lớp pilot, phê duyệt học sinh và kế hoạch tập huấn.
10. Ban hành phase gates, risk owners và ngày review Go/No-Go.

## 17. Tài liệu chuẩn/nền tảng cần tham chiếu

- CSTA PK–12 2026: https://csteachers.org/pk12standards/
- CSTA 2017 standards: https://csteachers.org/2017standards/interactive/
- NGSS Engineering Design: https://www.nextgenscience.org/dci-arrangement/3-5-ets1-engineering-design
- ISTE Students: https://iste.org/standards/students
- 1EdTech LTI: https://www.1edtech.org/standards/lti
- 1EdTech OneRoster: https://www.1edtech.org/standards/oneroster
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- boardgame.io: https://boardgame.io/
- Colyseus: https://docs.colyseus.io/
- Luật Bảo vệ dữ liệu cá nhân: https://english.luatvietnam.vn/dan-su/law-on-personal-data-protection-law-no-91-2025-qh15-405135-d1.html
- Nghị định 356/2025/NĐ-CP: https://vanban.chinhphu.vn/?classid=1&docid=216387&pageid=27160

---
**Tóm tắt:** Khi G0 được phê duyệt, ưu tiên cao nhất là **vertical slice RoboRoute + teacher assignment + student join + learning evidence + report**, không phải xây trang chủ lung linh hoặc 6 game cùng lúc.