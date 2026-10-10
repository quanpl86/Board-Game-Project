# P1 COMMERCE — Domain ERD · DESIGN PROPOSAL

17 proposed tables, 31 relations touching this domain. Other nodes included as P0/P1 dependencies.

```mermaid
erDiagram
    commerce_avatar_rigs {
        uuid id PK
        text rig_code 
        integer revision 
        text skeleton_sha256 
        timestamptz created_at 
    }
    commerce_item_definitions {
        uuid id PK
        text item_code 
        text item_type 
        uuid owner_organization_id FK
        text status 
        timestamptz created_at 
    }
    commerce_item_versions {
        uuid id PK
        uuid item_definition_id FK
        integer revision 
        uuid compatible_rig_id FK
        text bind_policy 
        text transfer_policy 
        text manifest_sha256 
        timestamptz published_at 
    }
    commerce_item_version_assets {
        uuid id PK
        uuid item_version_id FK
        uuid asset_version_id FK
        text asset_role 
        timestamptz created_at 
    }
    commerce_equipment_slots {
        uuid id PK
        text slot_code 
        text exclusivity_group 
        integer sort_order 
    }
    commerce_item_slot_rules {
        uuid id PK
        uuid item_version_id FK
        uuid equipment_slot_id FK
        text operation 
        integer priority 
    }
    commerce_inventory_instances {
        uuid id PK
        uuid item_version_id FK
        uuid owner_user_id FK
        uuid source_order_line_id FK
        text status 
        timestamptz bound_at 
        timestamptz granted_at 
    }
    commerce_avatar_loadouts {
        uuid id PK
        uuid owner_user_id FK
        uuid rig_id FK
        uuid context_game_id FK
        text label 
        text status 
        timestamptz created_at 
    }
    commerce_avatar_loadout_items {
        uuid id PK
        uuid loadout_id FK
        uuid equipment_slot_id FK
        uuid inventory_instance_id FK
        integer layer_priority 
    }
    commerce_currencies {
        uuid id PK
        text currency_code 
        text display_name 
        boolean spendable 
        text status 
    }
    commerce_ledger_accounts {
        uuid id PK
        uuid currency_id FK
        uuid owner_user_id FK
        text account_kind 
        text purpose 
        text status 
        timestamptz created_at 
    }
    commerce_ledger_transactions {
        uuid id PK
        text idempotency_key 
        uuid actor_user_id FK
        text transaction_type 
        text status 
        timestamptz created_at 
        timestamptz posted_at 
    }
    commerce_ledger_entries {
        uuid id PK
        uuid transaction_id FK
        uuid account_id FK
        bigint amount_signed 
        timestamptz created_at 
    }
    commerce_shop_offers {
        uuid id PK
        uuid item_version_id FK
        uuid created_by FK
        text status 
        timestamptz created_at 
    }
    commerce_shop_offer_revisions {
        uuid id PK
        uuid shop_offer_id FK
        integer revision 
        uuid currency_id FK
        bigint price_amount 
        integer stock_limit 
        integer max_per_user 
        uuid approved_by FK
        timestamptz published_at 
    }
    commerce_shop_orders {
        uuid id PK
        uuid buyer_user_id FK
        uuid offer_revision_id FK
        uuid settlement_transaction_id FK
        text idempotency_key 
        integer quantity 
        bigint total_amount 
        text status 
        timestamptz created_at 
    }
    commerce_shop_order_lines {
        uuid id PK
        uuid order_id FK
        uuid item_version_id FK
        integer quantity 
    }
    tenancy_organizations {
        uuid id PK
    }
    assets_asset_versions {
        uuid id PK
    }
    identity_users {
        uuid id PK
    }
    catalog_games {
        uuid id PK
    }
    tenancy_organizations ||--o{ commerce_item_definitions : "owner_organization_id"
    commerce_item_definitions ||--o{ commerce_item_versions : "item_definition_id"
    commerce_avatar_rigs ||--o{ commerce_item_versions : "compatible_rig_id"
    commerce_item_versions ||--o{ commerce_item_version_assets : "item_version_id"
    assets_asset_versions ||--o{ commerce_item_version_assets : "asset_version_id"
    commerce_item_versions ||--o{ commerce_item_slot_rules : "item_version_id"
    commerce_equipment_slots ||--o{ commerce_item_slot_rules : "equipment_slot_id"
    commerce_item_versions ||--o{ commerce_inventory_instances : "item_version_id"
    identity_users ||--o{ commerce_inventory_instances : "owner_user_id"
    commerce_shop_order_lines ||--o{ commerce_inventory_instances : "source_order_line_id"
    identity_users ||--o{ commerce_avatar_loadouts : "owner_user_id"
    commerce_avatar_rigs ||--o{ commerce_avatar_loadouts : "rig_id"
    catalog_games ||--o{ commerce_avatar_loadouts : "context_game_id"
    commerce_avatar_loadouts ||--o{ commerce_avatar_loadout_items : "loadout_id"
    commerce_equipment_slots ||--o{ commerce_avatar_loadout_items : "equipment_slot_id"
    commerce_inventory_instances ||--o{ commerce_avatar_loadout_items : "inventory_instance_id"
    commerce_currencies ||--o{ commerce_ledger_accounts : "currency_id"
    identity_users ||--o{ commerce_ledger_accounts : "owner_user_id"
    identity_users ||--o{ commerce_ledger_transactions : "actor_user_id"
    commerce_ledger_transactions ||--o{ commerce_ledger_entries : "transaction_id"
    commerce_ledger_accounts ||--o{ commerce_ledger_entries : "account_id"
    commerce_item_versions ||--o{ commerce_shop_offers : "item_version_id"
    identity_users ||--o{ commerce_shop_offers : "created_by"
    commerce_shop_offers ||--o{ commerce_shop_offer_revisions : "shop_offer_id"
    commerce_currencies ||--o{ commerce_shop_offer_revisions : "currency_id"
    identity_users ||--o{ commerce_shop_offer_revisions : "approved_by"
    identity_users ||--o{ commerce_shop_orders : "buyer_user_id"
    commerce_shop_offer_revisions ||--o{ commerce_shop_orders : "offer_revision_id"
    commerce_ledger_transactions ||--o{ commerce_shop_orders : "settlement_transaction_id"
    commerce_shop_orders ||--o{ commerce_shop_order_lines : "order_id"
    commerce_item_versions ||--o{ commerce_shop_order_lines : "item_version_id"
```

- [commerce.avatar_rigs](tables/commerce.avatar_rigs.md) — Định nghĩa rig tương thích, phiên bản bất biến và GLB source.
- [commerce.item_definitions](tables/commerce.item_definitions.md) — Định danh loại vật phẩm, không phải quyền sở hữu.
- [commerce.item_versions](tables/commerce.item_versions.md) — Bản phát hành cosmetic/version/rig and binding policy.
- [commerce.item_version_assets](tables/commerce.item_version_assets.md) — N–N vật phẩm ↔ bản asset đã được duyệt.
- [commerce.equipment_slots](tables/commerce.equipment_slots.md) — Danh mục vị trí trang bị; không hardcode thành từng cột User.
- [commerce.item_slot_rules](tables/commerce.item_slot_rules.md) — Vị trí chiếm dụng/xung đột của vật phẩm theo revision.
- [commerce.inventory_instances](tables/commerce.inventory_instances.md) — Bản quyền sở hữu cá thể duy nhất, độc lập item definition/version.
- [commerce.avatar_loadouts](tables/commerce.avatar_loadouts.md) — Preset avatar/rig theo ngữ cảnh, không đổi collision trong game.
- [commerce.avatar_loadout_items](tables/commerce.avatar_loadout_items.md) — Vật phẩm đang trang bị; phải xác minh ownership và rig/slot.
- [commerce.currencies](tables/commerce.currencies.md) — Đơn vị tiền ảo earned Coin/Event Token; không có thanh toán tiền thật.
- [commerce.ledger_accounts](tables/commerce.ledger_accounts.md) — Tài khoản ledger theo currency và chủ thể, tách user/system.
- [commerce.ledger_transactions](tables/commerce.ledger_transactions.md) — Header immutable/idempotent giao dịch cân bằng; posted chỉ khi đủ entries.
- [commerce.ledger_entries](tables/commerce.ledger_entries.md) — Double-entry signed amount; tổng 0 theo transaction/currency phải kiểm tra atomically.
- [commerce.shop_offers](tables/commerce.shop_offers.md) — Đề nghị bán chính thức, không phải marketplace ngang hàng.
- [commerce.shop_offer_revisions](tables/commerce.shop_offer_revisions.md) — Bản giá/số lượng/kho hàng/version; không đổi giá đã dùng trong đơn.
- [commerce.shop_orders](tables/commerce.shop_orders.md) — Đơn mua với idempotency key, buyer, phiên bản giá và ledger settlement.
- [commerce.shop_order_lines](tables/commerce.shop_order_lines.md) — Receipt link item version và số lượng được giao; instance có thể tham chiếu dòng đơn.
