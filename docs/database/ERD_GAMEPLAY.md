# ERD domain: gameplay

**8 bảng thuộc domain, 17 FK trong/phụ thuộc domain.** Bảng ngoài domain trong hình là neighbor để mô tả quan hệ, không chuyển quyền sở hữu dữ liệu.

```mermaid
erDiagram
    gameplay_game_rooms {
        uuid identifier PK
    }
    gameplay_room_memberships {
        uuid identifier PK
    }
    gameplay_matches {
        uuid identifier PK
    }
    gameplay_match_participants {
        uuid identifier PK
    }
    gameplay_match_commands {
        uuid identifier PK
    }
    gameplay_match_snapshots {
        uuid identifier PK
    }
    gameplay_match_results {
        uuid identifier PK
    }
    gameplay_match_result_entries {
        uuid identifier PK
    }
    catalog_game_versions {
        uuid linked_id
    }
    tenancy_organizations {
        uuid linked_id
    }
    identity_users {
        uuid linked_id
    }
    gameplay_game_rooms }o--|| catalog_game_versions : "game_version_id"
    gameplay_game_rooms }o--|| tenancy_organizations : "organization_id"
    gameplay_game_rooms }o--|| identity_users : "created_by"
    gameplay_room_memberships }o--|| gameplay_game_rooms : "room_id"
    gameplay_room_memberships }o--|| identity_users : "user_id"
    gameplay_matches }o--|| catalog_game_versions : "game_version_id"
    gameplay_matches }o--|| gameplay_game_rooms : "room_id,game_version_id"
    gameplay_match_participants }o--|| gameplay_matches : "match_id"
    gameplay_match_participants }o--|| identity_users : "user_id"
    gameplay_match_commands }o--|| gameplay_matches : "match_id"
    gameplay_match_commands }o--|| identity_users : "actor_user_id"
    gameplay_match_commands }o--|| gameplay_match_participants : "match_id,actor_user_id"
    gameplay_match_snapshots }o--|| gameplay_matches : "match_id"
    gameplay_match_results }o--|| gameplay_matches : "match_id"
    gameplay_match_result_entries }o--|| identity_users : "user_id"
    gameplay_match_result_entries }o--|| gameplay_match_results : "result_id,match_id"
    gameplay_match_result_entries }o--|| gameplay_match_participants : "match_id,user_id"
```

- [`gameplay.game_rooms`](tables/gameplay.game_rooms.md) — Phòng chờ trước trận; một room có thể có nhiều trận rematch.
- [`gameplay.room_memberships`](tables/gameplay.room_memberships.md) — Thành viên và ghế của phòng; chỉ ghế active được unique.
- [`gameplay.matches`](tables/gameplay.matches.md) — Trận cụ thể pin game_version từ room; kết quả server xác minh.
- [`gameplay.match_participants`](tables/gameplay.match_participants.md) — Người chơi/quan sát có định danh; ghế unique khi khác null.
- [`gameplay.match_commands`](tables/gameplay.match_commands.md) — Lệnh đã được Game Server kiểm tra; append-only, idempotent.
- [`gameplay.match_snapshots`](tables/gameplay.match_snapshots.md) — Snapshot phiên bản state và hash để replay sau khi reconnect.
- [`gameplay.match_results`](tables/gameplay.match_results.md) — Kết quả một lần cho một trận; sửa sai bằng dòng bù/version tương lai.
- [`gameplay.match_result_entries`](tables/gameplay.match_result_entries.md) — Điểm/địa vị trong kết quả, không phải bảng xếp hạng hay ví Coin.
