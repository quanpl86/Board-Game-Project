# identity.external_identities

**Purpose:** Ánh xạ tài khoản bên KingDragonHub/OIDC sang user UUID nội bộ; không lưu password/token.

**Data owner:** Identity · **Classification:** restricted · **Approval:** PROPOSED / NOT FROZEN · **Retention:** Review before production

## Relationship diagram — this table and every declared SQL FK neighbor
```mermaid
flowchart LR
    T["identity.external_identities"]
    N0["identity.users"]
    T -->|"user_id → id"| N0
```

## Physical field declarations (canonical migration)
| # | Column / constraint | PostgreSQL definition |
|---:|---|---|
| 1 | `id` | `id uuid PRIMARY KEY DEFAULT gen_random_uuid()` |
| 2 | `user_id` | `user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT` |
| 3 | `provider` | `provider text NOT NULL` |
| 4 | `provider_subject` | `provider_subject text NOT NULL` |
| 5 | `linked_at` | `linked_at timestamptz NOT NULL DEFAULT now()` |
| 6 | `revoked_at` | `revoked_at timestamptz` |
| 7 | `UNIQUE` | `UNIQUE (provider,provider_subject)` |
| 8 | `UNIQUE` | `UNIQUE (user_id,provider,provider_subject)` |

## Outbound foreign keys (1)
- `user_id` → [`identity.users`](identity.users.md) (`id`)

## Inbound foreign keys (0)
No direct inbound FK.

## Indexes / uniqueness
- `CREATE INDEX external_identities_user_idx ON identity.external_identities(user_id);`

## Runtime authorization, integrity and tests
- This table has **ENABLE + FORCE RLS with no access policies** in the proposed P0 migration. Service role grants and policy mapping cannot be activated before KingDragonHub provider/tenant authorization audit.
- All FK references are SQL-enforced; permission checks, business aggregate transitions and audit/outbox idempotency must also be tested at application layer.
- Tests: create/replay migration on disposable PostgreSQL, validate FK/unique/check errors, least-privilege access denial and no cross-tenant leakage once policies are authored.
- Historical update/delete or legal retention decisions require explicit owner review. No unapproved production migration.
