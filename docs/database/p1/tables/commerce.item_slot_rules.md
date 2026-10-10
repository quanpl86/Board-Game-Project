# commerce.item_slot_rules — P1 DATA DICTIONARY

**Status:** DRAFT / NOT MIGRATED · **Owner:** commerce · **Data classification:** restricted

Vị trí chiếm dụng/xung đột của vật phẩm theo revision.

## Direct relationship preview

![Editable relationship preview](../diagrams/previews/32_p1_table_commerce_item_slot_rules.svg)

## Columns (5)
| Column | Candidate PostgreSQL type | Key | Nullable | Default |
|---|---|---|---|---|
| `id` | `uuid` | PK | NO | — |
| `item_version_id` | `uuid` | FK → [commerce.item_versions](commerce.item_versions.md).`id` | NO | — |
| `equipment_slot_id` | `uuid` | FK → [commerce.equipment_slots](commerce.equipment_slots.md).`id` | NO | — |
| `operation` | `text` | — | NO | — |
| `priority` | `integer` | — | NO | — |

## Outbound foreign keys (2)
- `item_version_id` → [commerce.item_versions](commerce.item_versions.md).`id` (P1)
- `equipment_slot_id` → [commerce.equipment_slots](commerce.equipment_slots.md).`id` (P1)

## Inbound foreign keys (0)
- None

## Proposed integrity
**Unique constraints:** `(item_version_id,equipment_slot_id)`

**Check/invariant and domain guard:**
- full suit must declare all occupied/hidden slots

**Indexes:** `(equipment_slot_id,priority)`

## Required implementation and review
- Evaluate tenant/organization scope and child PII, no direct browser/MCP SQL.
- Verify FK, composite tenant conditions, status machine, optimistic revision, immutable business history, RLS allow-policy **after** SSO source audit.
- Test authorized and unauthorized roles, concurrency and referential integrity in disposable PostgreSQL **only after migration PR exists**.
- Cross-check UI screen IDs/typed API contracts; log P0/P1 decision conflicts before freezing.
