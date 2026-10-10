# Student Universe — Student Identity, Characters, Assets, Inventory and Coin

**DESIGN ONLY — not a migration.** 22 candidate new tables, 158 columns, 54 planned FK relationships. These extend P0/P1 without duplicating existing identity, asset, item and ledger definitions.

## Core design principles
- Identity `identity.users` / `identity.profiles` is the global account. School enrollment and verified guardian rights remain scoped.
- `student.student_profiles` adds protected student metadata. Never copy real name, passwords, precise date of birth or third-party account tokens.
- `characters.character_instances` is owned character; character version references approved rig and asset, not a per-student copy of every GLB.
- Asset file/version is a catalog object, not proof the child owns a shop item.
- `commerce.inventory_instances` (existing P1 design) records nonfungible rights; `ownership.inventory_events` and `inventory_stacks` add provenance and stackable ownership.
- Student XP, private learning grade, leaderboard rank, and wallet Coin are distinct event streams and permission boundaries.
- Ledger entries are Coin authority, while `economy.wallet_balance_projections` is derived; `economy.wallet_holds` must be transactional to prevent double spending.
- No minor peer trades, public UGC, lootboxes, NFT, cashout or pay-to-win by default.

## Detailed table schemas / direct ERDs

### student
- [`student.student_profiles`](tables/student.student_profiles.md) — Hồ sơ học sinh bảo mật theo user global; không sao chép họ tên, ngày sinh hoặc mật khẩu từ KingDragonHub.
- [`student.privacy_settings`](tables/student.privacy_settings.md) — Quyền hiển thị hồ sơ và nhân vật, mặc định riêng tư; nguồn ủy quyền guardian chỉ từ verified link.

### characters
- [`characters.character_definitions`](tables/characters.character_definitions.md) — Mẫu nhân vật trong danh mục; chưa phải nhân vật học sinh sở hữu.
- [`characters.character_versions`](tables/characters.character_versions.md) — Phiên bản mẫu gắn rig canonical và asset GLB đã duyệt.
- [`characters.character_instances`](tables/characters.character_instances.md) — Nhân vật riêng của học sinh; nhiều nhân vật với nickname được kiểm duyệt.
- [`characters.character_loadout_bindings`](tables/characters.character_loadout_bindings.md) — Gắn nhân vật sở hữu với avatar loadout theo game/context.
- [`characters.character_progress_events`](tables/characters.character_progress_events.md) — Tiến trình nhân vật append-only, EXP không phải Coin; nguồn game đã xác minh.
- [`characters.pet_states`](tables/characters.pet_states.md) — Tùy chọn pet được đại diện bởi inventory_instance đã sở hữu; không tạo bản sao quyền sở hữu.

### creations
- [`creations.student_projects`](tables/creations.student_projects.md) — Sản phẩm học sinh tự tạo được tách khỏi asset catalog đã duyệt.
- [`creations.student_project_versions`](tables/creations.student_project_versions.md) — Lịch sử version của project: source editable và asset đầu ra được kiểm duyệt.
- [`creations.project_review_events`](tables/creations.project_review_events.md) — Biên bản kiểm duyệt riêng từng version, có người duyệt và lý do đã lọc PII.

### progress
- [`progress.student_game_progress`](tables/progress.student_game_progress.md) — Projection tiến trình học sinh theo game; rebuild từ verified progress events.
- [`progress.student_game_progress_events`](tables/progress.student_game_progress_events.md) — Tiến trình liên game ghi append-only, chỉ nhận nguồn đã xác thực.

### ownership
- [`ownership.inventory_events`](tables/ownership.inventory_events.md) — Ledger quyền sở hữu items: grant, revoke, equip, consumption; immutable.
- [`ownership.inventory_stacks`](tables/ownership.inventory_stacks.md) — Số lượng vật phẩm stackable, tách khỏi mỗi bản thể inventory_instances.

### economy
- [`economy.wallet_balance_projections`](tables/economy.wallet_balance_projections.md) — Số dư Coin đọc nhanh; dẫn xuất từ ledger, không được là nguồn sự thật.
- [`economy.wallet_holds`](tables/economy.wallet_holds.md) — Giữ Coin cho đơn hàng chờ xử lý, có TTL/idempotency.
- [`economy.reward_policies`](tables/economy.reward_policies.md) — Quy tắc phát Coin/đồ theo nguồn đạt chuẩn, revision immutable.
- [`economy.reward_grants`](tables/economy.reward_grants.md) — Biên nhận phát Coin hoặc item; chỉ posted sau khi ledger và inventory commit.
- [`economy.wallet_spending_limits`](tables/economy.wallet_spending_limits.md) — Ngưỡng chi tiêu Coin theo người, loại tiền và kỳ hiệu lực.

### achievements
- [`achievements.achievement_definitions`](tables/achievements.achievement_definitions.md) — Bộ achievement/huy hiệu phiên bản hóa, tách ranking/game score.
- [`achievements.achievement_grants`](tables/achievements.achievement_grants.md) — Học sinh nhận thành tích với nguồn xác minh và phạm vi hiển thị độc lập.

## Data dependencies
P0: `identity.users`, `identity.guardian_links`, `assets.asset_versions`, `catalog.games`, `gameplay.match_results`. P1 design: `commerce.inventory_instances`, `commerce.avatar_rigs`, `commerce.avatar_loadouts`, `commerce.ledger_accounts`, `ledger_transactions`, `ledger_entries`, `education.learning_attempts`. Education SQL is still PR #21 and is not merged to main.

Schema source: `db/schema/student_universe_extension_candidate.json`. Every FK in this package is proposed until reviewed and created in SQL. Do not infer a deployed wallet, character or student system from this document.
