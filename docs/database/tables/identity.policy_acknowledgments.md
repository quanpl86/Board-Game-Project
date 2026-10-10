# identity.policy_acknowledgments

**Purpose:** Bản ghi phiên bản chính sách đã xác nhận; không thay thế quy trình đồng ý hợp pháp.

**Data owner:** Identity/Safety · **Classification:** highly restricted · **Approval:** PROPOSED / NOT FROZEN · **Retention:** Review before production

## Relationship diagram — this table and every declared SQL FK neighbor
```mermaid
flowchart LR
    T["identity.policy_acknowledgments"]
    N0["identity.users"]
    T -->|"user_id → id"| N0
```

## Physical field declarations (canonical migration)
| # | Column / constraint | PostgreSQL definition |
|---:|---|---|
| 1 | `id` | `id uuid PRIMARY KEY DEFAULT gen_random_uuid()` |
| 2 | `user_id` | `user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT` |
| 3 | `policy_code` | `policy_code text NOT NULL` |
| 4 | `policy_version` | `policy_version text NOT NULL` |
| 5 | `acknowledged_at` | `acknowledged_at timestamptz NOT NULL DEFAULT now()` |
| 6 | `source` | `source text NOT NULL CHECK (source IN ('web','guardian','organization','admin'))` |
| 7 | `UNIQUE` | `UNIQUE (user_id,policy_code,policy_version)` |

## Outbound foreign keys (1)
- `user_id` → [`identity.users`](identity.users.md) (`id`)

## Inbound foreign keys (0)
No direct inbound FK.

## Indexes / uniqueness
Primary, uniqueness or composite constraints are defined inline in the migration.

## Runtime authorization, integrity and tests
- This table has **ENABLE + FORCE RLS with no access policies** in the proposed P0 migration. Service role grants and policy mapping cannot be activated before KingDragonHub provider/tenant authorization audit.
- All FK references are SQL-enforced; permission checks, business aggregate transitions and audit/outbox idempotency must also be tested at application layer.
- Tests: create/replay migration on disposable PostgreSQL, validate FK/unique/check errors, least-privilege access denial and no cross-tenant leakage once policies are authored.
- Historical update/delete or legal retention decisions require explicit owner review. No unapproved production migration.
