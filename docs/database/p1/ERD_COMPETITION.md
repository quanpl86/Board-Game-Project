# P1 COMPETITION — Domain ERD · DESIGN PROPOSAL

11 proposed tables, 24 relations touching this domain. Other nodes included as P0/P1 dependencies.

```mermaid
erDiagram
    competition_event_programs {
        uuid id PK
        uuid organization_id FK
        uuid organizer_user_id FK
        text slug 
        text title 
        timestamptz starts_at 
        timestamptz ends_at 
        text status 
        timestamptz created_at 
    }
    competition_tournaments {
        uuid id PK
        uuid event_program_id FK
        uuid game_version_id FK
        text title 
        text format_code 
        text status 
        timestamptz created_at 
    }
    competition_tournament_registrations {
        uuid id PK
        uuid tournament_id FK
        uuid participant_user_id FK
        text status 
        text eligibility_revision_hash 
        timestamptz registered_at 
    }
    competition_tournament_rounds {
        uuid id PK
        uuid tournament_id FK
        integer round_number 
        text status 
        timestamptz starts_at 
    }
    competition_tournament_fixtures {
        uuid id PK
        uuid round_id FK
        integer fixture_no 
        timestamptz scheduled_at 
        text status 
        uuid referee_user_id FK
    }
    competition_fixture_matches {
        uuid id PK
        uuid fixture_id FK
        uuid match_id FK
        integer leg_number 
        timestamptz recorded_at 
    }
    competition_scoring_policies {
        uuid id PK
        uuid game_version_id FK
        text policy_code 
        integer revision 
        text direction 
        text rules_sha256 
        timestamptz effective_at 
    }
    competition_score_records {
        uuid id PK
        uuid result_entry_id FK
        uuid participant_user_id FK
        uuid scoring_policy_id FK
        uuid correction_of_id FK
        numeric_18_5_ points_delta 
        text source_event_key 
        timestamptz verified_at 
    }
    competition_leaderboards {
        uuid id PK
        uuid scoring_policy_id FK
        uuid tournament_id FK
        text scope 
        text visibility_policy 
        text status 
        timestamptz created_at 
    }
    competition_leaderboard_entries {
        uuid id PK
        uuid leaderboard_id FK
        uuid user_id FK
        numeric_18_5_ total_score 
        integer ranking_position 
        timestamptz calculated_at 
        bigint source_revision 
    }
    competition_hall_of_fame_entries {
        uuid id PK
        uuid source_score_record_id FK
        uuid honoree_user_id FK
        uuid nominated_by FK
        uuid approved_by FK
        text status 
        text display_name_approved 
        timestamptz published_at 
        timestamptz created_at 
    }
    tenancy_organizations {
        uuid id PK
    }
    identity_users {
        uuid id PK
    }
    catalog_game_versions {
        uuid id PK
    }
    gameplay_matches {
        uuid id PK
    }
    gameplay_match_result_entries {
        uuid id PK
    }
    tenancy_organizations ||--o{ competition_event_programs : "organization_id"
    identity_users ||--o{ competition_event_programs : "organizer_user_id"
    competition_event_programs ||--o{ competition_tournaments : "event_program_id"
    catalog_game_versions ||--o{ competition_tournaments : "game_version_id"
    competition_tournaments ||--o{ competition_tournament_registrations : "tournament_id"
    identity_users ||--o{ competition_tournament_registrations : "participant_user_id"
    competition_tournaments ||--o{ competition_tournament_rounds : "tournament_id"
    competition_tournament_rounds ||--o{ competition_tournament_fixtures : "round_id"
    identity_users ||--o{ competition_tournament_fixtures : "referee_user_id"
    competition_tournament_fixtures ||--o{ competition_fixture_matches : "fixture_id"
    gameplay_matches ||--o{ competition_fixture_matches : "match_id"
    catalog_game_versions ||--o{ competition_scoring_policies : "game_version_id"
    gameplay_match_result_entries ||--o{ competition_score_records : "result_entry_id"
    identity_users ||--o{ competition_score_records : "participant_user_id"
    competition_scoring_policies ||--o{ competition_score_records : "scoring_policy_id"
    competition_score_records ||--o{ competition_score_records : "correction_of_id"
    competition_scoring_policies ||--o{ competition_leaderboards : "scoring_policy_id"
    competition_tournaments ||--o{ competition_leaderboards : "tournament_id"
    competition_leaderboards ||--o{ competition_leaderboard_entries : "leaderboard_id"
    identity_users ||--o{ competition_leaderboard_entries : "user_id"
    competition_score_records ||--o{ competition_hall_of_fame_entries : "source_score_record_id"
    identity_users ||--o{ competition_hall_of_fame_entries : "honoree_user_id"
    identity_users ||--o{ competition_hall_of_fame_entries : "nominated_by"
    identity_users ||--o{ competition_hall_of_fame_entries : "approved_by"
```

- [competition.event_programs](tables/competition.event_programs.md) — Sự kiện do tổ chức tổ chức; không đồng nhất CMS campaign.
- [competition.tournaments](tables/competition.tournaments.md) — Giải đấu của event gắn game version và thể thức đã phê duyệt.
- [competition.tournament_registrations](tables/competition.tournament_registrations.md) — Đăng ký cá nhân; eligibility/consent kiểm tra bởi service.
- [competition.tournament_rounds](tables/competition.tournament_rounds.md) — Vòng đấu thuộc giải, không trực tiếp đồng nhất với một trận.
- [competition.tournament_fixtures](tables/competition.tournament_fixtures.md) — Cặp đấu theo vòng, có thể liên kết nhiều match rematch.
- [competition.fixture_matches](tables/competition.fixture_matches.md) — Bảng cầu nối fixture → match đã xác minh từ Game Server.
- [competition.scoring_policies](tables/competition.scoring_policies.md) — Phiên bản chính sách tính điểm, normalize/tie break theo game.
- [competition.score_records](tables/competition.score_records.md) — Ledger điểm immutable chứng minh từ entry kết quả authoritative, sửa sai bằng bù.
- [competition.leaderboards](tables/competition.leaderboards.md) — Định nghĩa bảng xếp hạng, không chứa đánh giá học thuật cá nhân công khai.
- [competition.leaderboard_entries](tables/competition.leaderboard_entries.md) — Projection tổng điểm/rank có thể tính lại từ score_records.
- [competition.hall_of_fame_entries](tables/competition.hall_of_fame_entries.md) — Vinh danh được phê duyệt riêng, có quyền rút công bố.
