# ERD domain: publishing

**3 bảng thuộc domain, 6 FK trong/phụ thuộc domain.** Bảng ngoài domain trong hình là neighbor để mô tả quan hệ, không chuyển quyền sở hữu dữ liệu.

```mermaid
erDiagram
    publishing_content_items {
        uuid identifier PK
    }
    publishing_content_revisions {
        uuid identifier PK
    }
    publishing_content_publications {
        uuid identifier PK
    }
    tenancy_organizations {
        uuid linked_id
    }
    identity_users {
        uuid linked_id
    }
    publishing_content_items }o--|| tenancy_organizations : "owner_organization_id"
    publishing_content_items }o--|| identity_users : "created_by"
    publishing_content_revisions }o--|| publishing_content_items : "content_item_id"
    publishing_content_revisions }o--|| identity_users : "created_by"
    publishing_content_publications }o--|| publishing_content_revisions : "revision_id"
    publishing_content_publications }o--|| identity_users : "approved_by"
```

- [`publishing.content_items`](tables/publishing.content_items.md) — Trang/bài/khối nội dung; không trộn event/season/campaign.
- [`publishing.content_revisions`](tables/publishing.content_revisions.md) — Nội dung theo revision, hash và người tạo, không ghi đè bản cũ.
- [`publishing.content_publications`](tables/publishing.content_publications.md) — Con trỏ phát hành và cửa sổ thời gian; phải được phê duyệt đúng revision.
