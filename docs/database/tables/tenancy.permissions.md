# tenancy.permissions

**Purpose:** Quyền chi tiết áp dụng bởi service, không mặc định do UI quyết định.

**Data owner:** IAM · **Classification:** restricted · **Approval:** PROPOSED / NOT FROZEN · **Retention:** Review before production

## Relationship diagram — this table and every declared SQL FK neighbor
```mermaid
flowchart LR
    T["tenancy.permissions"]
    N0["tenancy.role_permissions"]
    N0 -->|"permission_id → id"| T
```

## Physical field declarations (canonical migration)
| # | Column / constraint | PostgreSQL definition |
|---:|---|---|
| 1 | `id` | `id uuid PRIMARY KEY DEFAULT gen_random_uuid()` |
| 2 | `code` | `code text NOT NULL UNIQUE` |
| 3 | `resource_type` | `resource_type text NOT NULL` |
| 4 | `description` | `description text NOT NULL` |

## Outbound foreign keys (0)
No direct outbound FK.

## Inbound foreign keys (1)
- [`tenancy.role_permissions`](tenancy.role_permissions.md) via `permission_id` → `id`

## Indexes / uniqueness
Primary, uniqueness or composite constraints are defined inline in the migration.

## Runtime authorization, integrity and tests
- This table has **ENABLE + FORCE RLS with no access policies** in the proposed P0 migration. Service role grants and policy mapping cannot be activated before KingDragonHub provider/tenant authorization audit.
- All FK references are SQL-enforced; permission checks, business aggregate transitions and audit/outbox idempotency must also be tested at application layer.
- Tests: create/replay migration on disposable PostgreSQL, validate FK/unique/check errors, least-privilege access denial and no cross-tenant leakage once policies are authored.
- Historical update/delete or legal retention decisions require explicit owner review. No unapproved production migration.
