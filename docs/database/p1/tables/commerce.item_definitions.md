# commerce.item_definitions — P1 DATA DICTIONARY

**Status:** DRAFT / NOT MIGRATED · **Owner:** commerce · **Data classification:** restricted

Định danh loại vật phẩm, không phải quyền sở hữu.

## Direct relationship preview

![Editable relationship preview](../diagrams/previews/28_p1_table_commerce_item_definitions.svg)

## Columns (6)
| Column | Candidate PostgreSQL type | Key | Nullable | Default |
|---|---|---|---|---|
| `id` | `uuid` | PK | NO | — |
| `item_code` | `text` | — | NO | — |
| `item_type` | `text` | — | NO | — |
| `owner_organization_id` | `uuid` | FK → [tenancy.organizations](../../tables/tenancy.organizations.md).`id` | YES | — |
| `status` | `text` | — | NO | `draft` |
| `created_at` | `timestamptz` | — | NO | `now()` |

## Outbound foreign keys (1)
- `owner_organization_id` → [tenancy.organizations](../../tables/tenancy.organizations.md).`id` (P0)

## Inbound foreign keys (1)
- [commerce.item_versions](commerce.item_versions.md).`item_definition_id` → `id`

## Proposed integrity
**Unique constraints:** No additional scoped UNIQUE specified yet.

**Check/invariant and domain guard:**
- not equivalent to inventory instance

**Indexes:** `(item_type,status)`

## Required implementation and review
- Evaluate tenant/organization scope and child PII, no direct browser/MCP SQL.
- Verify FK, composite tenant conditions, status machine, optimistic revision, immutable business history, RLS allow-policy **after** SSO source audit.
- Test authorized and unauthorized roles, concurrency and referential integrity in disposable PostgreSQL **only after migration PR exists**.
- Cross-check UI screen IDs/typed API contracts; log P0/P1 decision conflicts before freezing.
