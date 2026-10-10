# ERD domain: catalog

**2 bảng thuộc domain, 4 FK trong/phụ thuộc domain.** Bảng ngoài domain trong hình là neighbor để mô tả quan hệ, không chuyển quyền sở hữu dữ liệu.

```mermaid
erDiagram
    catalog_games {
        uuid identifier PK
    }
    catalog_game_versions {
        uuid identifier PK
    }
    identity_users {
        uuid linked_id
    }
    gameplay_game_rooms {
        uuid linked_id
    }
    gameplay_matches {
        uuid linked_id
    }
    catalog_games }o--|| identity_users : "created_by"
    catalog_game_versions }o--|| catalog_games : "game_id"
    gameplay_game_rooms }o--|| catalog_game_versions : "game_version_id"
    gameplay_matches }o--|| catalog_game_versions : "game_version_id"
```

- [`catalog.games`](tables/catalog.games.md) — Game Registry; danh mục game độc lập room, kết quả, phần thưởng.
- [`catalog.game_versions`](tables/catalog.game_versions.md) — Phiên bản luật và manifest được pin vào phòng/trận; published không sửa.
