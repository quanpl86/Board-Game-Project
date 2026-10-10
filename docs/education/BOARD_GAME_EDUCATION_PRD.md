# BOARD GAME EDUCATION — PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Phiên bản:** 1.0 · **Ngày:** 09/10/2026 · **Trạng thái:** Đề xuất để thẩm định · **Thị trường ban đầu:** Việt Nam · **Đối tượng trọng tâm:** học sinh 9–11 tuổi, mở rộng 7–15 tuổi

> **Định vị:** Nền tảng web game-based learning kết hợp board game tương tác, nhiệm vụ học tập STEM/STEAM, tổ chức lớp học và đánh giá theo minh chứng. Sản phẩm không chỉ là thư viện game giải trí hay nền tảng trắc nghiệm.

## 1. Tóm tắt điều hành

### 1.1 Vấn đề

- Giáo viên khó chọn trò chơi phù hợp với chuẩn đầu ra, thời lượng và quy mô lớp.
- Game truyền thống chủ yếu cung cấp kết quả thắng/thua, chưa ghi nhận bằng chứng về cách học sinh suy luận, thử nghiệm và cải tiến.
- Lớp học sử dụng nhiều ứng dụng rời rạc để phát nhiệm vụ, tạo nhóm, chơi và thu kết quả.
- Trẻ em cần trải nghiệm phù hợp lứa tuổi, an toàn, hạn chế dữ liệu cá nhân và không có tương tác công khai không kiểm soát.

### 1.2 Giải pháp

Hệ sinh thái gồm **Learning Game Hub** (thư viện game STEM và tư duy), **Classroom Orchestrator** (lớp/nhóm/phiên/điều khiển lớp), **Assessment & Learning Analytics** (minh chứng/rubric/đề xuất giảng dạy), **Content Studio** (quản trị hoạt động/game/chương trình), và **Game SDK** (mở rộng thể loại trò chơi).

### 1.3 North Star

**Số nhiệm vụ học tập đã được học sinh hoàn thành có minh chứng đánh giá hợp lệ và được giáo viên sử dụng để phản hồi**, thay vì chỉ số lượt chơi, thời gian trên màn hình hoặc thắng cuộc.

### 1.4 Giới hạn rõ ràng

MVP không gồm: chat công khai, ghép trận công khai, mua hàng với học sinh, AR/VR, AI chấm điểm tự động không giám sát, no-code tạo engine game mới từ đầu, webcam hoặc nhận diện khuôn mặt.

## 2. Người dùng, nhiệm vụ và quyền

| Vai trò | Nhu cầu chính | Quyền điển hình |
|---|---|---|
| Platform Admin | Bảo đảm vận hành và an toàn | Quản lý tenant, game bản phát hành, log, cấu hình |
| School/Center Admin | Quản lý trường/trung tâm | Quản trị tài khoản giáo viên, phân quyền, báo cáo tổng hợp |
| Teacher | Thiết kế phiên học | Tạo lớp, nhóm, lesson, assignment, session; đánh giá và xuất kết quả trong lớp được giao |
| Student | Chơi và học | Gia nhập bằng mã, thao tác game, xem phản hồi và thành tích riêng |
| Parent/Guardian (V2) | Nắm thông tin tiến bộ | Chỉ xem dữ liệu của con khi có cơ sở cấp quyền hợp lệ |
| Content Editor/Reviewer | Sản xuất nội dung | Soạn, kiểm định, phát hành game template và bộ challenge |

**Yêu cầu RBAC:** quyền được kiểm tra trên server theo `tenant_id`, `class_id`, `owner/teacher assignment`. Không dùng client-only guard làm cơ chế bảo vệ dữ liệu.

### 2.1 Student personas

- S1: học sinh 9–11 tuổi, đọc thông thạo cơ bản, cần luật ngắn, minh họa, nút lớn, nhiệm vụ 8–20 phút.
- S2: học sinh 7–8 tuổi, đọc chậm, cần voice-over tùy chọn và hướng dẫn trực quan, số bước ít hơn.
- S3: học sinh 12–15 tuổi, cần thách thức sâu hơn, có chiến lược đa bước, thuyết minh và phân tích kết quả.

### 2.2 Jobs-to-be-done

- Khi lên lớp, giáo viên muốn chọn 1 game theo mục tiêu bài học và khởi động cho cả lớp trong vài phút.
- Khi đang học, giáo viên muốn biết nhóm nào đang mắc lỗi logic hay cần hỗ trợ, không chỉ xem ai có điểm cao nhất.
- Khi hoàn thành, học sinh muốn biết vì sao chiến lược thành công, bước nào cần điều chỉnh và lần tiếp theo cần thử gì.
- Khi đánh giá, giáo viên muốn đối chiếu dữ liệu game với quan sát trên lớp và không bị ép chấp nhận điểm AI.

## 3. Giá trị học thuật và chuẩn

### 3.1 Các trục năng lực

| Trục | Minh chứng quan sát được |
|---|---|
| Tư duy thuật toán | Sắp xếp bước, dùng quy tắc, sửa trình tự |
| Tư duy logic | Áp dụng điều kiện, loại trừ, kiểm chứng giả định |
| Trừu tượng hóa & nhận dạng quy luật | Tìm mô hình chung, tiếp tục chuỗi, mô tả quy luật |
| Dữ liệu & suy luận bằng chứng | Đọc bảng/biểu đồ, tìm chứng cứ hỗ trợ hoặc phản bác |
| Thiết kế kỹ thuật | Xác định tiêu chí/ràng buộc, tạo phương án, thử và cải tiến |
| Toán và tối ưu | Tính/so sánh, đánh đổi nguồn lực, chọn chiến lược |
| Hợp tác & diễn đạt | Phân vai, chia sẻ lập luận, phản hồi và cải tiến |

### 3.2 Hệ thống standard mapping

Mỗi `learning_objective` có trường `framework`, `edition`, `code`, `alignment_type`, `evidence_required`, `reviewed_by`, `review_date`.

- **CSTA PK–12 Standards 2026:** nguồn chính cho thiết kế mới, gồm Algorithms & Design; Programming; Data & Analysis; Systems & Security; Computing & Society. Cần dùng mã gốc từ bộ chuẩn 2026 trong quá trình xây crosswalk.
- **CSTA 2017:** giữ mapping legacy nếu học liệu có tham chiếu 1B-AP-08 (so sánh/cải tiến thuật toán), 1B-DA-06 (trình bày dữ liệu), 1B-DA-07 (suy luận từ dữ liệu). Không coi mã 2017 là mã của phiên bản 2026.
- **NGSS:** 3-5-ETS1-1 (xác định vấn đề/tiêu chí/ràng buộc); 3-5-ETS1-2 (đề xuất/so sánh phương án); 3-5-ETS1-3 (thử nghiệm công bằng, kiểm soát biến).
- **ISTE Students:** 1.4 Innovative Designer, 1.5 Computational Thinker, 1.1 Empowered Learner, 1.2 Digital Citizen theo nội dung liên quan.

Lưu ý: đây là mapping thiết kế nội bộ, **không tuyên bố chương trình được CSTA chứng nhận**. CSTA yêu cầu quy trình thẩm định trước khi công bố sản phẩm được xác nhận alignment chính thức. Với chuẩn chịu điều kiện bản quyền, lưu mã, URL và diễn giải do nhóm học thuật tự viết; tránh sao chép toàn văn.

### 3.3 Khung thiết kế trò chơi bắt buộc

Mỗi game có: `problem` → `plan` → `play/test` → `improve` → `reflect`. Game phải sử dụng **cơ chế bàn chơi** như ô, quân cờ, thẻ, đường đi, tài nguyên, chiến thuật, lượt chơi; không được chỉ là quiz ghép điểm.

## 4. Danh mục nội dung

### 4.1 Sáu game MVP

| ID | Tên | Bàn chơi / hành động lõi | Kiến thức | Chế độ ưu tiên | Thời lượng |
|---|---|---|---|---|---|
| EDU-01 | RoboRoute | Grid, robot, thẻ lệnh, chướng ngại, thực thi theo lượt | Thuật toán, trình tự, vòng lặp, gỡ lỗi | Solo, nhóm cùng thiết bị | 10–15' |
| EDU-02 | Logic Islands | Bản đồ nhánh, cổng điều kiện, token logic | Điều kiện, AND/OR, ra quyết định | Solo, nhóm | 10–15' |
| EDU-03 | Pattern Forge | Tile, chuỗi mẫu, kéo thả, quy luật | Quy luật, trừu tượng hóa, không gian | Solo, đối kháng local | 8–12' |
| EDU-04 | Data Detective | Thẻ bằng chứng, bảng/biểu đồ, chọn giả thuyết | Dữ liệu, suy luận, lập luận bằng chứng | Solo, hợp tác | 12–20' |
| EDU-05 | Eco City Lab | Bàn ô công trình, ngân sách, tài nguyên, sự kiện | Hệ thống, đánh đổi, bền vững | Nhóm 2–4 | 15–25' |
| EDU-06 | Bridge Builder | Thẻ vật liệu, cấu kiện cầu, các vòng test | Thiết kế kỹ thuật, ràng buộc, cải tiến | Solo/nhóm 2–4 | 15–25' |

**V1:** Gomoku, Reversi, Fraction Trail, Probability Quest, Network Route, Circuit Quest. **V2+:** STEM Escape Board, Game Creator template, tournament lớp học, nội dung 7–8 và 12–15 tuổi.

### 4.2 Cấu trúc bộ thử thách game

Mỗi trò ít nhất 3 cấp (Starter/Explorer/Expert), tối thiểu 12 thử thách để pilot (4 thử thách/cấp), lưu: scenario ID, game ruleset version, LO, độ khó, hướng dẫn, điều kiện thắng, gợi ý 3 mức, evidence event, đáp án/hàm kiểm thử, phân tích lỗi thường gặp, rubric liên quan, bản dịch, trạng thái kiểm định.

Các tình huống có nhiều lời giải đúng phải được validator hỗ trợ; không so sánh cứng với một trình tự duy nhất trừ khi câu hỏi yêu cầu một trình tự cụ thể.

### 4.3 Game content QA gate

`DRAFT → PEDAGOGICAL_REVIEW → RULES_TESTED → CHILD_UX_TESTED → APPROVED → PUBLISHED → ARCHIVED`. Mỗi bản phát hành ghi người duyệt, phiên bản luật/challenge và migration policy. Dữ liệu bài tập cũ giữ tham chiếu đến đúng phiên bản lúc học sinh làm.

## 5. Yêu cầu chức năng theo Epic

**Ưu tiên:** P0=MVP; P1=V1; P2=V2. Mỗi yêu cầu phải có unit/integration/E2E acceptance tests trước khi `Done`.

### EPIC A — Authentication, Organizations, Classroom

| ID | Ưu tiên | Yêu cầu | Acceptance Criteria |
|---|---|---|---|
| FR-A01 | P0 | Teacher/Admin login | Đăng nhập và đăng xuất; tài khoản không có quyền không xem được lớp |
| FR-A02 | P0 | Tenant, school, class | Admin tạo trường/lớp, gán đúng giáo viên; dữ liệu tenant khác không thể truy cập |
| FR-A03 | P0 | Student join bằng mã tạm | Mã hết hạn/thu hồi được, chống đoán brute force, không yêu cầu email trẻ |
| FR-A04 | P0 | Roster, pseudonym, nhóm | Import CSV kiểm tra trùng, lỗi dữ liệu; chia nhóm 1–4 học sinh |
| FR-A05 | P0 | Role-based server access | Mỗi API kiểm tra tenant, role, class, ownership |
| FR-A06 | P1 | Reuse student access | Cấp lại mã truy cập cho trẻ; không cần tài khoản mạng xã hội |
| FR-A07 | P2 | Parent account | Định danh/phê duyệt và xem đúng dữ liệu con mình |

### EPIC B — Game Library, Missions, Assignments

| ID | Ưu tiên | Yêu cầu | Acceptance Criteria |
|---|---|---|---|
| FR-B01 | P0 | Catalog & filter | Tìm game theo độ tuổi, LO, thể loại, thời lượng, số người và cấp độ |
| FR-B02 | P0 | Game preview | Luật chơi, demo ngắn, số người, LO, dự kiến thời lượng |
| FR-B03 | P0 | Create assignment | Giáo viên chọn game+challenge+độ khó+hạn+đối tượng; xem trước |
| FR-B04 | P0 | Assignment status | Chưa bắt đầu/đang làm/đã hoàn tất/cần giáo viên xem |
| FR-B05 | P0 | Hint & reflection | Hint có mức; học sinh trả lời câu hỏi phản tư ngắn |
| FR-B06 | P1 | Differentiation | Cùng một LO có nhiệm vụ 3 cấp hoặc theo nhóm |
| FR-B07 | P1 | Lesson 5E templates | Tạo lesson theo mục tiêu: GV hướng dẫn → hoạt động offline → game challenge |
| FR-B08 | P2 | Template Game Creator | Chỉnh board, card, config trong cơ chế được hỗ trợ, sandbox, duyệt trước publish |

### EPIC C — Sessions & Classroom Orchestrator

| ID | Ưu tiên | Yêu cầu | Acceptance Criteria |
|---|---|---|---|
| FR-C01 | P0 | Teacher starts session | Mã/QR, chọn assignment, phân nhóm, thời lượng và trạng thái |
| FR-C02 | P0 | Live dashboard | Cập nhật học sinh/nhóm đã tham gia, đang chơi, hoàn tất, cần trợ giúp |
| FR-C03 | P0 | Pause/resume/finish | Giáo viên dừng/tiếp tục/kết thúc; server chặn nước đi khi pause |
| FR-C04 | P0 | Device reconnect | Trẻ mất kết nối và quay lại nhận đúng trạng thái phiên đã được lưu |
| FR-C05 | P1 | Projector mode | Hiển thị đồng hồ, luật, mã phòng, tiến độ tổng hợp, không lộ dữ liệu cá nhân |
| FR-C06 | P1 | Local/turn-based team play | Chuyển lượt và phân vai; quyền hành động tại mỗi bước xác định rõ |
| FR-C07 | P2 | Cross-class tournaments | Chỉ khi đáp ứng phân quyền, an toàn và cơ chế tổ chức |

### EPIC D — Game Engine & Data Evidence

| ID | Ưu tiên | Yêu cầu | Acceptance Criteria |
|---|---|---|---|
| FR-D01 | P0 | Game SDK contract | Game có manifest, initial state, validate move, reduce state, result, evidence schema |
| FR-D02 | P0 | Authoritative state | Client gửi intent; server quyết định hợp lệ và trả state; không tin điểm client |
| FR-D03 | P0 | Versioned game state | Lưu ruleset/challenge/engine version; replay được thao tác hợp lệ |
| FR-D04 | P0 | Event evidence | Ghi mốc bắt đầu, move, lỗi, hint, test, revision, submit, reflect theo schema |
| FR-D05 | P0 | Idempotent actions | Gửi lại cùng `action_id` không khiến đi 2 lần hoặc trừ điểm 2 lần |
| FR-D06 | P0 | Evaluation method | Tính kết quả theo luật và rubric, tách win/game score khỏi learning evidence |
| FR-D07 | P1 | Bots and adversarial games | Có cấp độ, bot timeout và ràng buộc tài nguyên |
| FR-D08 | P2 | Replay timeline | Phát lại quá trình cùng mốc giải thích, ẩn bí mật của người khác khi cần |

### EPIC E — Assessment, Analytics, Reports

| ID | Ưu tiên | Yêu cầu | Acceptance Criteria |
|---|---|---|---|
| FR-E01 | P0 | Objective-based dashboard | Xem kết quả theo LO, nhiệm vụ, lớp, nhóm, học sinh |
| FR-E02 | P0 | Rubric 0–3 | Giáo viên xem/sửa mức theo minh chứng; có lý do và dấu thời gian |
| FR-E03 | P0 | Formative feedback | Gợi ý hành động phù hợp lỗi; không tự động gán nhãn cố định cho trẻ |
| FR-E04 | P0 | Export | CSV phân quyền; không xuất dữ liệu cá nhân không cần thiết |
| FR-E05 | P1 | Before/after comparison | Cùng LO, độ khó tương đương, tránh diễn giải chênh lệch như bằng chứng nhân quả |
| FR-E06 | P1 | Intervention suggestions | Giáo viên xem nhóm cần hỗ trợ dựa trên rule minh bạch |
| FR-E07 | P2 | School-level analytics | Chỉ hiển thị tổng hợp, ngưỡng ẩn nhóm quá nhỏ |

### EPIC F — Security, Privacy, Operations

| ID | Ưu tiên | Yêu cầu | Acceptance Criteria |
|---|---|---|---|
| FR-F01 | P0 | Data minimization | Mặc định pseudonym, không thu DOB, ảnh mặt, email trẻ nếu không cần |
| FR-F02 | P0 | Data retention & deletion | Có cấu hình lưu trữ, export, xóa/ẩn danh theo quy trình hợp pháp |
| FR-F03 | P0 | No public chat | Chỉ tương tác trong phiên có giáo viên, nội dung được kiểm soát |
| FR-F04 | P0 | Monitoring & audit | Audit cho login, role/roster changes, exports, publishing, assessment overrides |
| FR-F05 | P0 | Basic security | TLS, rate limit, input validation, tenant isolation, backup, security reviews |
| FR-F06 | P1 | Consent/admin flows | Quản lý căn cứ xử lý dữ liệu và sự cho phép cần thiết theo chính sách/luật |
| FR-F07 | P1 | Localization | VI chính, chuẩn bị cấu trúc đa ngôn ngữ |

## 6. UX Flows

### 6.1 Teacher workflow

1. Đăng nhập → chọn lớp → xem mục tiêu và tiến độ gần nhất.
2. Mở thư viện → lọc theo năng lực, lớp, thời lượng → xem preview và rubric.
3. Chọn challenge/difficulty → phân nhóm → tạo `Assignment`.
4. Tạo `Live Session` → chiếu QR/mã → chờ học sinh tham gia → bắt đầu.
5. Theo dõi trạng thái, can thiệp nhóm, tạm dừng/tiếp tục, đóng phiên.
6. Xem minh chứng & phản tư → sửa rubric nếu cần → xuất báo cáo/giao nhiệm vụ tiếp.

### 6.2 Student workflow

1. Nhập mã / quét QR → chọn định danh hoặc nhập access code riêng → chọn avatar.
2. Thấy tên game, mục tiêu học tập ngắn, hướng dẫn bằng hình, thử nước đi mẫu.
3. Chơi từng bước; lỗi trả phản hồi giải thích, không phạt lặp lại vô ích.
4. Nộp kết quả; mô tả lý do quyết định; thử cải tiến khi được cho phép.
5. Nhận phản hồi theo mục tiêu và lần thử; không bị công khai điểm yếu cho bạn khác.

### 6.3 Live session states

`DRAFT → WAITING → RUNNING ↔ PAUSED → COMPLETED`; nhánh `CANCELLED` từ DRAFT/WAITING/RUNNING; trạng thái `EXPIRED` khi mã gia nhập không còn hiệu lực. Từng nhóm/match có `READY`, `ACTIVE`, `SUBMITTED`, `REVIEWED`, `DISCONNECTED` (kết nối là flag độc lập, không ghi đè tiến độ học).

### 6.4 Design system & accessibility

- Mobile/tablet-first, desktop/projector adaptive; thao tác cả chuột, bàn phím, touch.
- Mục tiêu WCAG 2.2 AA (audit thủ công và tự động), focus hiển thị, không chỉ dùng màu để truyền thông tin, tắt/reduce animation, âm thanh bật/tắt.
- Quy tắc trẻ em: hướng dẫn một ý trên mỗi đoạn; feedback tích cực nhưng cụ thể; tránh dark patterns, streak pressure và quảng cáo nhắm đích.
- Teacher Dashboard ưu tiên đơn giản: 3 hành động chính `Chọn game → Giao nhiệm vụ → Bắt đầu lớp`.

## 7. Đánh giá học tập

### 7.1 Rubric 4 mức (đề xuất)

| Mức | Tiêu chí mô tả |
|---|---|
| 0 – Chưa có minh chứng | Chưa đủ dữ liệu để xác định năng lực; không kết luận trẻ không biết |
| 1 – Bước đầu | Thực hiện một phần, cần hướng dẫn thường xuyên |
| 2 – Đạt | Giải quyết đúng ở tình huống quen thuộc, giải thích được các bước chính |
| 3 – Vận dụng | Giải được biến thể mới, so sánh/cải tiến giải pháp và giải thích có bằng chứng |

Rubric cần **tiêu chí đặc thù mỗi mục tiêu**, không dùng một mô tả chung để chấm tất cả trò chơi. Điểm game và điểm rubric được tách trong dữ liệu.

### 7.2 Learning evidence schema

| Trường | Ý nghĩa |
|---|---|
| attempt_id, tenant_id, student_id, assignment_id | Ngữ cảnh, phân quyền |
| game_id, ruleset_version, challenge_id, challenge_version | Bản phát hành nội dung xác định |
| event_type, occurred_at, elapsed_ms, action_id | Sự kiện có thể kiểm chứng |
| state_before_hash, action, state_after_hash | Truy dấu quyết định hợp lệ, chỉ lưu đủ mức cần thiết |
| hint_level, error_category, revision_count | Chỉ số hỗ trợ quá trình |
| artifact, reflection, teacher_observation | Bằng chứng sản phẩm và định tính |
| standard_refs, objective_id, rubric_score, assessor | Mapping chuẩn và đánh giá |

**Không dùng** số lần bấm, thời gian ngắn hay điểm thắng đơn thuần để tuyên bố học sinh đạt chuẩn. Phải có bằng chứng tương ứng với tiêu chí chấm.

### 7.3 Ví dụ đánh giá RoboRoute

- LO-1: tạo trình tự lệnh đưa robot từ A đến B; minh chứng: sequence hợp lệ, kết quả chạy.
- LO-2: phát hiện/sửa lỗi trình tự; minh chứng: thay đổi từ bản đầu, lý do sửa.
- LO-3: so sánh hai cách giải; minh chứng: chi phí số lệnh/số bước và giải thích phù hợp.
- Dữ liệu máy ghi nhận chuỗi hành động; giáo viên có quyền xem và điều chỉnh mức rubric với ghi chú. Không suy luận nội trạng tâm lý từ log.

## 8. Mẫu lớp học 100 phút (5E tùy biến)

**Ví dụ chủ đề:** Giải cứu Robot trên đảo Logic. Game: RoboRoute + Logic Islands.

| Thời gian | Hoạt động | Hình thức | Sản phẩm |
|---|---|---|---|
| 10' | Engage: kể tình huống robot thất lạc, dẫn dắt nhiệm vụ | GV + toàn lớp | Nêu vấn đề |
| 7' | LO1 – Hướng dẫn: thuật toán, trình tự (ví dụ, bối cảnh) | Không lập trình | Hiểu thuật ngữ |
| 5' | LO1 – Hoạt động offline: xếp thẻ mũi tên trên lưới giấy | Nhóm | Chuỗi lệnh giấy |
| 10' | LO1 – Game challenge: đường đi cơ bản | Web game | Lần giải đầu |
| 7' | LO2 – Hướng dẫn: điều kiện, đúng/sai | Không lập trình | Sơ đồ nhánh |
| 5' | LO2 – Hoạt động offline: chọn đường khi gặp cổng điều kiện | Nhóm | Lý giải lựa chọn |
| 10' | LO2 – Game challenge: Logic Islands | Web game | Quyết định điều kiện |
| 7' | LO3 – Hướng dẫn: gỡ lỗi và tối ưu | Không lập trình | So sánh cách giải |
| 5' | LO3 – Hoạt động offline: tìm lỗi chuỗi lệnh và sửa trên giấy | Nhóm | Chuỗi đã chỉnh |
| 10' | LO3 – Game challenge: tối ưu đường đi | Web game | 2 phiên bản phương án |
| 14' | Project: nhiệm vụ mở rộng kết hợp điều kiện và đường đi | Nhóm, web game | Phương án hoàn chỉnh |
| 10' | Chia sẻ dự án, review, câu hỏi game hóa, exit ticket | Toàn lớp | Phản tư + đánh giá |
| **100'** | **Tổng** | | |

Mỗi LO có bộ ba **hướng dẫn kiến thức → hoạt động lớp học không lập trình → thử thách trong game**. Trong metadata của từng LO, gắn mã CSTA theo phiên bản/edition và mô tả minh chứng quan sát được.

## 9. Kiến trúc hệ thống

### 9.1 Đề xuất stack

- Client: Next.js + React + TypeScript + Tailwind CSS; Board Renderer SVG/React, PixiJS chỉ khi hiệu năng/animation đòi hỏi.
- Backend platform: Node.js + TypeScript (Fastify/NestJS tùy năng lực đội), REST APIs cho quản trị.
- Game backend: boardgame.io có thể làm nền cho turn-based (cần spike kiểm chứng tiến độ bảo trì/phù hợp); adapter SDK thuần TypeScript tách khỏi framework nhằm tránh khóa công nghệ. Nếu yêu cầu room sync/lobby đặc thù vượt giới hạn, đánh giá Colyseus ở quyết định kiến trúc riêng, **không triển khai song song vô cớ**.
- PostgreSQL: school/roster/assignment/match/grade data; Redis: session/cache/rate limit; object storage: assets và export.
- Monorepo: pnpm workspaces + Turborepo tùy chọn; Docker; OpenTelemetry/Sentry tương đương cho observability.
- Không đưa LLM vào server game rules; AI hướng dẫn nếu có phải có giới hạn, cấu hình và đánh giá riêng.

### 9.2 Components

`Web/PWA` ↔ `Platform API / Auth / RBAC` ↔ `Classroom Service, Assignment Service, Catalog, Analytics` ↔ `Game Orchestrator + Authoritative Rules Engine` ↔ `PostgreSQL / Redis / Object Storage`.

Các domain `game state`, `student learning record` và `tenant identity` được tách rõ. Payload trận có quyền theo vai trò: với game bài bí mật, client chỉ nhận phần state được phép nhìn thấy.

### 9.3 Module contract tối thiểu

```ts
interface EduGameModule<State, Move> {
  manifest: GameManifest;
  createInitialState(seed: string, challenge: Challenge): State;
  getPlayerView(state: State, playerId: string): unknown;
  validateMove(state: State, playerId: string, move: Move): ValidationResult;
  applyMove(state: State, playerId: string, move: Move): State;
  getResult(state: State): GameResult | null;
  extractEvidence(previous: State, move: Move, next: State): EvidenceEvent[];
  migrateState?(state: unknown, fromVersion: string): State;
}
```

Backend kiểm tra `client_action_id`, `match_version`, `player_id`, luật, quyền, phiên còn hiệu lực trước khi ghi move. Save action log kèm snapshot định kỳ; có chế độ replay, nhưng phải hạn chế thời hạn và nội dung log theo nguyên tắc dữ liệu tối thiểu.

### 9.4 Data entities chính

`Tenant`, `Organization`, `User`, `RoleBinding`, `Classroom`, `Enrollment`, `Group`, `Lesson`, `LearningObjective`, `StandardReference`, `Game`, `GameVersion`, `Challenge`, `ChallengeVersion`, `Assignment`, `AssignmentTarget`, `LiveSession`, `GameMatch`, `MatchPlayer`, `GameAction`, `Attempt`, `LearningEvidence`, `RubricCriterion`, `Assessment`, `TeacherFeedback`, `AuditEvent`, `ConsentRecord`, `DataRetentionPolicy`.

Mọi bản ghi học sinh và lớp bắt buộc có tenant scope; quan hệ giữa hồ sơ và learning analytics phải phân quyền server, xuất dữ liệu log audit.

### 9.5 API minh họa

- `POST /v1/classes`, `POST /v1/classes/{id}/students/import`, `POST /v1/classes/{id}/groups`
- `GET /v1/games?age=9-11&skill=algorithms`, `GET /v1/games/{gameId}/challenges`
- `POST /v1/assignments`, `POST /v1/sessions`, `POST /v1/sessions/{id}/start|pause|resume|finish`
- `POST /v1/sessions/join` (mã phiên + định danh có quyền)
- `POST /v1/matches/{id}/actions` (`action_id`, `expected_version`, `move`)
- `GET /v1/classes/{id}/progress`, `GET /v1/assignments/{id}/evidence`, `POST /v1/assessments/{id}/review`
- `POST /v1/reports/export` có audit và kiểm quyền.

API này chỉ là contract thiết kế; URL và payload cuối cùng cần OpenAPI spec, auth scheme, error codes, pagination và validation.

## 10. NFR/Security/Compliance

| Nhóm | Yêu cầu mục tiêu (kiểm chứng trong QA/pilot) |
|---|---|
| Responsiveness | Bố cục 768–1440px desktop và tablet; smartphone trải nghiệm được game phù hợp |
| Startup time | Tối thiểu 85% học sinh pilot hoàn tất gia nhập phiên trong 2 phút sau khi nhận hướng dẫn |
| Load | Kiểm thử kịch bản 30 học sinh/lớp và tối thiểu 10 lớp đồng thời; tăng sau khi đo thực tế |
| Availability | Mục tiêu pilot ≥99,5% thời gian phục vụ trong khung hoạt động được đo; chưa phải SLA thương mại |
| Accessibility | Target WCAG 2.2 AA; manual keyboard/screen reader review |
| Data isolation | 100% API quyền/tenant critical-path có negative tests; rà soát IDOR |
| Reliability | Reconnect không tạo nước đi lặp; mỗi match hoàn tất có snapshot/result audit được |
| Recoverability | Backup tự động, có bài thử restore và RPO/RTO được chốt theo hạ tầng |
| Privacy | Data inventory, retention, deletion, permissions; không public profile trẻ |
| Content safety | Không chat public, không quảng cáo hành vi nhắm trẻ, tài liệu được duyệt |

**Tuân thủ:** Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 (hiệu lực 01/01/2026), Nghị định 356/2025/NĐ-CP và các quy định hiện hành; trước production cần kiểm tra pháp lý theo mô hình xử lý dữ liệu thực tế, đặc biệt trẻ em, bên thứ ba, quyền đại diện, lưu trữ/chuyển dữ liệu xuyên biên giới. Tính năng cần cho phép thu hồi quyền và thực hiện yêu cầu liên quan đến dữ liệu theo chính sách và luật áp dụng. Mô tả này không thay thế tư vấn pháp lý.

## 11. Mục tiêu đo lường, sự kiện và đánh giá sản phẩm

### 11.1 Success metrics mục tiêu pilot

- Teacher activation: ≥80% giáo viên pilot có thể tự tạo assignment và phiên chơi sau tập huấn ngắn.
- Student onboarding: ≥85% người học tham gia phiên trong 2 phút, đo từ lúc xem mã.
- Session completion: ≥90% phiên không bị hủy vì lỗi phần mềm.
- Educational evidence coverage: ≥95% lần nộp hợp lệ có objective-linked evidence (bao gồm trường hợp thiếu minh chứng được gắn nhãn hợp lệ).
- Assessment reviewability: 100% điểm rubric có thể tra lại game/challenge/version/evidence/assessor.
- Teacher relevance: ≥80% giáo viên pilot đánh giá dashboard hữu ích để xác định học sinh/nhóm cần hỗ trợ (khảo sát định nghĩa rõ).
- Child safety: 0 lỗ hổng nghiêm trọng chưa khắc phục trước pilot/production.

Các số liệu là **ngưỡng mục tiêu**, không phải dự đoán đã được chứng minh. Không tự động kết luận game gây ra cải thiện năng lực nếu chưa có thiết kế nghiên cứu phù hợp.

### 11.2 Event telemetry

`session_created, student_joined, challenge_started, move_submitted, move_rejected, hint_requested, solution_revised, challenge_completed, reflection_submitted, assessment_reviewed, report_exported`. Chỉ ghi danh tính pseudonymous, dữ liệu game cần thiết, quy tắc retention, mục đích xử lý minh bạch. Tách operational monitoring và learning analytics.

## 12. Kịch bản UAT trọng yếu

1. Giáo viên A tạo lớp; giáo viên B ở tenant khác không xem được lớp hoặc report của A.
2. Học sinh không cần email, vào bằng mã và access code riêng; mã sai/thử hàng loạt bị giới hạn.
3. Giáo viên pause session giữa lượt; server không nhận move cho đến khi resume.
4. Cùng `action_id` gửi hai lần sau mất mạng → chỉ có một move hợp lệ.
5. Game có 2 cách giải đúng → hệ thống chấp nhận cả hai nếu đáp ứng luật và tiêu chí.
6. Hoàn thành RoboRoute với nhiều hint → game win hợp lệ nhưng đánh giá vẫn dựa trên LO/rubric.
7. Sửa rubric tạo audit; báo cáo sau sửa phản ánh trạng thái mới và có người sửa.
8. Giáo viên chiếu màn hình projector → không xuất hiện tên đầy đủ/điểm cá nhân ngoài phạm vi cho phép.
9. Khi challenge version cập nhật, attempts cũ vẫn mở đúng bản quy tắc và đáp án gốc.
10. Kiểm tra học sinh ở mạng yếu, refresh, mở tab mới, thoát giữa trận, reconnect và tiếp tục.

## 13. Các quyết định cần ký duyệt

- D1: phạm vi độ tuổi pilot ưu tiên 9–11 tuổi (đề xuất CÓ).
- D2: MVP gồm 6 game giáo dục trên, chưa đưa Cờ vua/Đấu xếp hạng vào core (đề xuất CÓ).
- D3: giáo viên quản lý danh sách học sinh bằng pseudonym và mã phiên (đề xuất CÓ).
- D4: mô hình đa cơ sở/tenant ngay từ kiến trúc, triển khai pilot một tenant (đề xuất CÓ).
- D5: thời lượng thử thách 8–25 phút, lesson mẫu 35/60/100 phút (đề xuất CÓ).
- D6: AI hỗ trợ giáo viên sau V1; không AI chấm tự động trong MVP (đề xuất CÓ).
- D7: nội dung là IP gốc; kiểm tra license của asset/thư viện/game tham chiếu (đề xuất CÓ).

## 14. Nguồn tham chiếu kiểm chứng

1. CSTA PK–12 Standards 2026: https://csteachers.org/pk12standards/
2. CSTA K–12 2017 Standards (legacy): https://csteachers.org/2017standards/interactive/
3. NGSS 3–5 Engineering Design: https://www.nextgenscience.org/dci-arrangement/3-5-ets1-engineering-design
4. ISTE Students: https://iste.org/standards/students
5. WCAG 2.2: https://www.w3.org/TR/WCAG22/
6. OneRoster 1.2: https://standards.1edtech.org/oneroster/specifications/standards/v1p2
7. LTI 1.3: https://www.1edtech.org/standards/lti
8. boardgame.io: https://boardgame.io/
9. Colyseus: https://docs.colyseus.io/
10. Luật Bảo vệ dữ liệu cá nhân: https://english.luatvietnam.vn/dan-su/law-on-personal-data-protection-law-no-91-2025-qh15-405135-d1.html
11. Nghị định 356/2025/NĐ-CP: https://vanban.chinhphu.vn/?classid=1&docid=216387&pageid=27160
12. Educational board game design: https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1420515/full

---
**Kết luận PRD:** Bản PRD này khóa rõ bài toán giáo dục, phạm vi MVP, tiêu chí chất lượng, bảo mật và mô hình dữ liệu. Cần chuyển thành wireframe, Game Design Document từng game, backlog issue và test specification để phát triển.