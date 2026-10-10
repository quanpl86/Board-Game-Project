# economy.wallet_balance_projections

> Design candidate — no physical migration.

Số dư Coin đọc nhanh; dẫn xuất từ ledger, không được là nguồn sự thật.

## Direct relationships
```mermaid
flowchart LR
    MAIN["economy.wallet_balance_projections"]
    OUT0["commerce.ledger_accounts"]
    MAIN -->|"ledger_account_id"| OUT0
```

## Proposed columns
| Column | Type | PK | FK | Nullable |
|---|---|---|---|---|
| `ledger_account_id` | `uuid` | Yes | commerce.ledger_accounts.id | No |
| `available_units` | `bigint` | No | — | No |
| `held_units` | `bigint` | No | — | No |
| `source_revision` | `bigint` | No | — | No |
| `calculated_at` | `timestamptz` | No | — | No |

## Business/security invariants
- projection rebuild from immutable posted ledger entries + active holds
- never mutate wallet balance from client/Agent

Student ownership, guardian permissions and least-privilege RLS require independent verification before enabling API writes.
