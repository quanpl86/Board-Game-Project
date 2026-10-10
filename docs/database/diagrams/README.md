# Sơ đồ Draw.io chỉnh sửa được và ảnh SVG — Database P0

> **Trạng thái:** REVIEW CANDIDATE. Đây là bản dựng **tái tạo có kiểm chứng từ** `db/schema/p0_tables.json` của PR #18 để cùng một nguồn dữ liệu dùng cho backend, frontend và Agent. Không phải các file PNG tĩnh được tạo trước đây và không có SSO/RLS allow policy production.

## Mở nhanh trên diagrams.net (Draw.io)

**[Mở / tải bản Draw.io P0 — 39 tab](Board_Game_Universe_Database_P0_Editable.drawio)**. Trên https://app.diagrams.net chọn **Open Existing Diagram** và chọn file `.drawio` đã tải. Các bảng, tên cột và 49 cạnh FK là đối tượng Draw.io chỉnh sửa được.

Bộ gồm: **1 bản đồ kiến trúc 7 domain, 1 ERD toàn bộ 30 bảng, 7 ERD domain đầy đủ cột và 30 ERD từng bảng**; SVG dưới đây dùng để preview trực tiếp trên GitHub. Các ERD từng bảng bao gồm tất cả cột của bảng đang xét và các bảng FK trực tiếp ở hai phía.

## Các trang (có liên kết SVG)

- [Bản đồ 7 domain](previews/00_P0_7_domains.svg)
- [ERD toàn bộ 30 bảng](previews/01_P0_overall_30.svg) — bảng/quan hệ tổng thể; dùng zoom trong Draw.io để xem rõ các dòng FK
- [Domain identity](previews/02_P0_domain_identity.svg)
- [Domain tenancy](previews/03_P0_domain_tenancy.svg)
- [Domain assets](previews/04_P0_domain_assets.svg)
- [Domain catalog](previews/05_P0_domain_catalog.svg)
- [Domain gameplay](previews/06_P0_domain_gameplay.svg)
- [Domain publishing](previews/07_P0_domain_publishing.svg)
- [Domain integration](previews/08_P0_domain_integration.svg)
- [identity.users](previews/09_P0_table_identity_users.svg)
- [identity.external_identities](previews/10_P0_table_identity_external_identities.svg)
- [identity.profiles](previews/11_P0_table_identity_profiles.svg)
- [identity.guardian_links](previews/12_P0_table_identity_guardian_links.svg)
- [identity.policy_acknowledgments](previews/13_P0_table_identity_policy_acknowledgments.svg)
- [tenancy.organizations](previews/14_P0_table_tenancy_organizations.svg)
- [tenancy.organization_memberships](previews/15_P0_table_tenancy_organization_memberships.svg)
- [tenancy.roles](previews/16_P0_table_tenancy_roles.svg)
- [tenancy.permissions](previews/17_P0_table_tenancy_permissions.svg)
- [tenancy.role_permissions](previews/18_P0_table_tenancy_role_permissions.svg)
- [tenancy.role_assignments](previews/19_P0_table_tenancy_role_assignments.svg)
- [assets.assets](previews/20_P0_table_assets_assets.svg)
- [assets.asset_versions](previews/21_P0_table_assets_asset_versions.svg)
- [catalog.games](previews/22_P0_table_catalog_games.svg)
- [catalog.game_versions](previews/23_P0_table_catalog_game_versions.svg)
- [gameplay.game_rooms](previews/24_P0_table_gameplay_game_rooms.svg)
- [gameplay.room_memberships](previews/25_P0_table_gameplay_room_memberships.svg)
- [gameplay.matches](previews/26_P0_table_gameplay_matches.svg)
- [gameplay.match_participants](previews/27_P0_table_gameplay_match_participants.svg)
- [gameplay.match_commands](previews/28_P0_table_gameplay_match_commands.svg)
- [gameplay.match_snapshots](previews/29_P0_table_gameplay_match_snapshots.svg)
- [gameplay.match_results](previews/30_P0_table_gameplay_match_results.svg)
- [gameplay.match_result_entries](previews/31_P0_table_gameplay_match_result_entries.svg)
- [publishing.content_items](previews/32_P0_table_publishing_content_items.svg)
- [publishing.content_revisions](previews/33_P0_table_publishing_content_revisions.svg)
- [publishing.content_publications](previews/34_P0_table_publishing_content_publications.svg)
- [integration.domain_outbox](previews/35_P0_table_integration_domain_outbox.svg)
- [integration.audit_events](previews/36_P0_table_integration_audit_events.svg)
- [integration.agent_approvals](previews/37_P0_table_integration_agent_approvals.svg)
- [integration.agent_invocations](previews/38_P0_table_integration_agent_invocations.svg)

## File CSV chuẩn để Agent đối chiếu

- [Danh sách cột, kiểu dữ liệu và PK/FK](p0_columns.csv).
- [49 quan hệ FK (bảng nguồn → cột → bảng đích)](p0_foreign_keys.csv).

## Source of truth và cách cập nhật

1. **SQL có quyền quyết định cấu trúc vật lý:** `db/migrations/0001_p0_foundation.sql` (ở trạng thái review).
2. **Manifest máy đọc và kiểm tra parity:** `db/schema/p0_tables.json`.
3. **Sơ đồ được sinh tự động** bằng `node scripts/generate_db_diagrams.mjs`; xem trước + Draw.io + CSV là *derived artifacts*, không được đổi độc lập để “làm đẹp” rồi quên SQL.
4. Test: `python scripts/check_db_schema.py`, `node scripts/generate_db_diagrams.mjs --check`, `python scripts/check_db_diagrams.py`; chạy PostgreSQL smoke suite trong GitHub Actions.
5. Khi physical schema được duyệt/đã migrate, dùng migration **mới** để thay đổi; không tùy tiện sửa migration đang chạy ở môi trường production.

**Không được tự coi P1/P2 conceptual ERD là FK vật lý P0.** Diagram đã đẩy lên nhánh PR chờ DBA/Security/Product Owner review, chưa xác minh SSO KingDragonHub hoặc grant RLS. Chỉ tham chiếu bảng đã tồn tại trong SQL và contract được phê duyệt.
