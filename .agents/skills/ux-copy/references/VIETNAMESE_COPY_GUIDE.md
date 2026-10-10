# Vietnamese UX Voice & Terminology
**Brand:** KingDragonHub-inspired: approachable, intelligent, concise, active, helpful and precise.

## Voice by audience
- Public game: inviting, energizing, clear. 'Khám phá game', 'Chơi cùng bạn bè', 'Vào phòng'.
- Student: age-appropriate, supportive feedback, effort-based. 'Bạn có thể thử lại với ít bước hơn.' Avoid 'Dở quá', 'Thua rồi, mua thêm'.
- Teacher: professional, brief, workflow-oriented. 'Tạo nhiệm vụ', 'Chia nhóm', 'Xem minh chứng', 'Duyệt kết quả'.
- Admin/AI: explicit consequences, scope, time and action. 'Xem bản nháp', 'Yêu cầu phê duyệt', 'Lên lịch công bố', 'Hủy tác vụ'.
- Privacy/commerce: neutral, precise, no pressure. 'Số dư hiện tại', 'Xác nhận mua bằng Coin', 'Vật phẩm không thể giao dịch'.

## Canonical Vietnamese vocabulary
| Technical key | Preferred display |
|---|---|
| room | Phòng chơi |
| match | Trận đấu |
| lobby | Phòng chờ |
| leaderboard | Bảng xếp hạng |
| Hall of Fame | Bảng vàng vinh danh |
| achievement | Thành tích / Huy hiệu (by context) |
| inventory | Tủ đồ |
| equipped item | Vật phẩm đang trang bị |
| pet | Thú cưng |
| avatar frame | Khung avatar |
| campaign | Chiến dịch |
| seasonal theme | Chủ đề theo mùa |
| tournament fixture | Lịch cặp đấu |
| approval | Phê duyệt |
| staging | Môi trường thử nghiệm |
| currency | Coin (đơn vị ảo, không quy đổi) |
| versioned release | Phiên bản phát hành |
| rubric | Tiêu chí đánh giá |
| report abuse | Báo cáo vi phạm |

## Good microcopy pairs
- Unknown error → **'Không thể tải thành phố. Kiểm tra kết nối rồi thử lại.'** rather than 'Error 500'.
- Failed spend → **'Không đủ Coin: cần 120, bạn có 95 Coin.'** rather than 'Mua thất bại'.
- Save result → **'Đã lưu trang phục.'** only after server success, else 'Đang lưu...' / 'Chưa thể lưu trang phục.'
- Rank proof → **'Kết quả đang được xác minh.'** until final.
- Age/policy → **'Tính năng giao dịch hiện chưa khả dụng với tài khoản này.'**
- Permission → **'Bạn không có quyền chỉnh sửa lớp học này. Hãy liên hệ quản trị viên trường.'**
- Automation → **'Đã tạo bản nháp. Chưa công bố.'**, **'Đang chờ phê duyệt từ người phụ trách.'**
- Reconnect → **'Đang kết nối lại phòng chơi. Tiến trình của bạn đã được lưu.'** only if persistence verified; otherwise avoid unverified claim.

## String acceptance
Each string has `id`, `screen_id`, `context`, `locale`, `text`, `variables`, `max_length_guidance`, `privacy_class`, `owner`, `approved_revision`.
Support Vietnamese diacritics, date/timezone, plural number/date formatting and screen reader labels. Do not encode UI labels into images/video except approved motion typography; captions and alt required.
