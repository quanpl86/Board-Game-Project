# gameplay.match_results

**Purpose:** Kết quả một lần cho một trận; sửa sai bằng dòng bù/version tương lai.

**Data owner:** Game Runtime · **Classification:** restricted · **Approval:** PROPOSED / NOT FROZEN · **Retention:** Review before production

## Relationship diagram — this table and every declared SQL FK neighbor
```mermaid
flowchart LR
    T["gameplay.match_results"]
    N0["gameplay.match_result_entries"]
    N1["gameplay.matches"]
    T -->|"match_id → id"| N1
    N0 -->|"result_id,match_id → id,match_id"| T
```

## Physical field declarations (canonical migration)
| # | Column / constraint | PostgreSQL definition |
|---:|---|---|
| 1 | `id` | `id uuid PRIMARY KEY DEFAULT gen_random_uuid()` |
| 2 | `match_id` | `match_id uuid NOT NULL UNIQUE REFERENCES gameplay.matches(id) ON DELETE RESTRICT` |
| 3 | `rules_sha256` | `rules_sha256 text NOT NULL CHECK (rules_sha256 ~ '^[a-f0-9]{64}$')` |
| 4 | `result_sha256` | `result_sha256 text NOT NULL CHECK (result_sha256 ~ '^[a-f0-9]{64}$')` |
| 5 | `result` | `result jsonb NOT NULL` |
| 6 | `finalized_at` | `finalized_at timestamptz NOT NULL DEFAULT now()` |
| 7 | `UNIQUE` | `UNIQUE (id,match_id)` |

## Outbound foreign keys (1)
- `match_id` → [`gameplay.matches`](gameplay.matches.md) (`id`)

## Inbound foreign keys (1)
- [`gameplay.match_result_entries`](gameplay.match_result_entries.md) via `result_id,match_id` → `id,match_id`

## Indexes / uniqueness
Primary, uniqueness or composite constraints are defined inline in the migration.

## Runtime authorization, integrity and tests
- This table has **ENABLE + FORCE RLS with no access policies** in the proposed P0 migration. Service role grants and policy mapping cannot be activated before KingDragonHub provider/tenant authorization audit.
- All FK references are SQL-enforced; permission checks, business aggregate transitions and audit/outbox idempotency must also be tested at application layer.
- Tests: create/replay migration on disposable PostgreSQL, validate FK/unique/check errors, least-privilege access denial and no cross-tenant leakage once policies are authored.
- Historical update/delete or legal retention decisions require explicit owner review. No unapproved production migration.
