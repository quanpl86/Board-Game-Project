# commerce.ledger_transactions — P1 DATA DICTIONARY

**Status:** DRAFT / NOT MIGRATED · **Owner:** commerce · **Data classification:** restricted

Header immutable/idempotent giao dịch cân bằng; posted chỉ khi đủ entries.

## Direct relationship preview

![Editable relationship preview](../diagrams/previews/38_p1_table_commerce_ledger_transactions.svg)

## Columns (7)
| Column | Candidate PostgreSQL type | Key | Nullable | Default |
|---|---|---|---|---|
| `id` | `uuid` | PK | NO | — |
| `idempotency_key` | `text` | — | NO | — |
| `actor_user_id` | `uuid` | FK → [identity.users](../../tables/identity.users.md).`id` | YES | — |
| `transaction_type` | `text` | — | NO | — |
| `status` | `text` | — | NO | `pending` |
| `created_at` | `timestamptz` | — | NO | `now()` |
| `posted_at` | `timestamptz` | — | YES | — |

## Outbound foreign keys (1)
- `actor_user_id` → [identity.users](../../tables/identity.users.md).`id` (P0)

## Inbound foreign keys (2)
- [commerce.ledger_entries](commerce.ledger_entries.md).`transaction_id` → `id`
- [commerce.shop_orders](commerce.shop_orders.md).`settlement_transaction_id` → `id`

## Proposed integrity
**Unique constraints:** No additional scoped UNIQUE specified yet.

**Check/invariant and domain guard:**
- one posting transaction, immutable entries
- rollback with compensating transaction

**Indexes:** `(status,created_at)`

## Required implementation and review
- Evaluate tenant/organization scope and child PII, no direct browser/MCP SQL.
- Verify FK, composite tenant conditions, status machine, optimistic revision, immutable business history, RLS allow-policy **after** SSO source audit.
- Test authorized and unauthorized roles, concurrency and referential integrity in disposable PostgreSQL **only after migration PR exists**.
- Cross-check UI screen IDs/typed API contracts; log P0/P1 decision conflicts before freezing.
