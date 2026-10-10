# gameplay.match_snapshots

**Purpose:** Snapshot phiên bản state và hash để replay sau khi reconnect.

**Data owner:** Game Runtime · **Classification:** restricted · **Approval:** PROPOSED / NOT FROZEN · **Retention:** Review before production

## Relationship diagram — this table and every declared SQL FK neighbor
```mermaid
flowchart LR
    T["gameplay.match_snapshots"]
    N0["gameplay.matches"]
    T -->|"match_id → id"| N0
```

## Physical field declarations (canonical migration)
| # | Column / constraint | PostgreSQL definition |
|---:|---|---|
| 1 | `match_id` | `match_id uuid NOT NULL REFERENCES gameplay.matches(id) ON DELETE RESTRICT` |
| 2 | `state_revision` | `state_revision bigint NOT NULL CHECK (state_revision >= 0)` |
| 3 | `schema_version` | `schema_version integer NOT NULL CHECK (schema_version > 0)` |
| 4 | `state_sha256` | `state_sha256 text NOT NULL CHECK (state_sha256 ~ '^[a-f0-9]{64}$')` |
| 5 | `state` | `state jsonb NOT NULL` |
| 6 | `created_at` | `created_at timestamptz NOT NULL DEFAULT now()` |
| 7 | `PK (composite)` | `PRIMARY KEY (match_id,state_revision)` |

## Outbound foreign keys (1)
- `match_id` → [`gameplay.matches`](gameplay.matches.md) (`id`)

## Inbound foreign keys (0)
No direct inbound FK.

## Indexes / uniqueness
Primary, uniqueness or composite constraints are defined inline in the migration.

## Runtime authorization, integrity and tests
- This table has **ENABLE + FORCE RLS with no access policies** in the proposed P0 migration. Service role grants and policy mapping cannot be activated before KingDragonHub provider/tenant authorization audit.
- All FK references are SQL-enforced; permission checks, business aggregate transitions and audit/outbox idempotency must also be tested at application layer.
- Tests: create/replay migration on disposable PostgreSQL, validate FK/unique/check errors, least-privilege access denial and no cross-tenant leakage once policies are authored.
- Historical update/delete or legal retention decisions require explicit owner review. No unapproved production migration.
