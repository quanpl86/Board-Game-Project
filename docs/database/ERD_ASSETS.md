# ERD domain: assets

**2 bảng thuộc domain, 3 FK trong/phụ thuộc domain.** Bảng ngoài domain trong hình là neighbor để mô tả quan hệ, không chuyển quyền sở hữu dữ liệu.

```mermaid
erDiagram
    assets_assets {
        uuid identifier PK
    }
    assets_asset_versions {
        uuid identifier PK
    }
    tenancy_organizations {
        uuid linked_id
    }
    identity_users {
        uuid linked_id
    }
    assets_assets }o--|| tenancy_organizations : "owner_organization_id"
    assets_assets }o--|| identity_users : "created_by"
    assets_asset_versions }o--|| assets_assets : "asset_id"
```

- [`assets.assets`](tables/assets.assets.md) — Danh mục asset source; không đại diện vật phẩm đã sở hữu.
- [`assets.asset_versions`](tables/assets.asset_versions.md) — Version/hash bất biến của GLB/ảnh/video; asset đã approve không cập nhật trong chỗ.
