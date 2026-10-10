# assets.assets

**Purpose:** Danh mục asset source; không đại diện vật phẩm đã sở hữu.

**Data owner:** Asset Registry · **Classification:** restricted · **Approval:** PROPOSED / NOT FROZEN · **Retention:** Review before production

## Relationship diagram — this table and every declared SQL FK neighbor
```mermaid
flowchart LR
    T["assets.assets"]
    N0["assets.asset_versions"]
    N1["tenancy.organizations"]
    N2["identity.users"]
    T -->|"owner_organization_id → id"| N1
    T -->|"created_by → id"| N2
    N0 -->|"asset_id → id"| T
```

## Physical field declarations (canonical migration)
| # | Column / constraint | PostgreSQL definition |
|---:|---|---|
| 1 | `id` | `id uuid PRIMARY KEY DEFAULT gen_random_uuid()` |
| 2 | `owner_organization_id` | `owner_organization_id uuid REFERENCES tenancy.organizations(id) ON DELETE RESTRICT` |
| 3 | `created_by` | `created_by uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT` |
| 4 | `slug` | `slug text NOT NULL UNIQUE` |
| 5 | `kind` | `kind text NOT NULL CHECK (kind IN ('model3d','texture','image','video','audio','other'))` |
| 6 | `rights_status` | `rights_status text NOT NULL DEFAULT 'unverified' CHECK (rights_status IN ('unverified','approved','restricted','revoked'))` |
| 7 | `created_at` | `created_at timestamptz NOT NULL DEFAULT now()` |

## Outbound foreign keys (2)
- `owner_organization_id` → [`tenancy.organizations`](tenancy.organizations.md) (`id`)
- `created_by` → [`identity.users`](identity.users.md) (`id`)

## Inbound foreign keys (1)
- [`assets.asset_versions`](assets.asset_versions.md) via `asset_id` → `id`

## Indexes / uniqueness
Primary, uniqueness or composite constraints are defined inline in the migration.

## Runtime authorization, integrity and tests
- This table has **ENABLE + FORCE RLS with no access policies** in the proposed P0 migration. Service role grants and policy mapping cannot be activated before KingDragonHub provider/tenant authorization audit.
- All FK references are SQL-enforced; permission checks, business aggregate transitions and audit/outbox idempotency must also be tested at application layer.
- Tests: create/replay migration on disposable PostgreSQL, validate FK/unique/check errors, least-privilege access denial and no cross-tenant leakage once policies are authored.
- Historical update/delete or legal retention decisions require explicit owner review. No unapproved production migration.
