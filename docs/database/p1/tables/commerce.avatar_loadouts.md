# commerce.avatar_loadouts — P1 DATA DICTIONARY

**Status:** DRAFT / NOT MIGRATED · **Owner:** commerce · **Data classification:** restricted

Preset avatar/rig theo ngữ cảnh, không đổi collision trong game.

## Direct relationship preview

![Editable relationship preview](../diagrams/previews/34_p1_table_commerce_avatar_loadouts.svg)

## Columns (7)
| Column | Candidate PostgreSQL type | Key | Nullable | Default |
|---|---|---|---|---|
| `id` | `uuid` | PK | NO | — |
| `owner_user_id` | `uuid` | FK → [identity.users](../../tables/identity.users.md).`id` | NO | — |
| `rig_id` | `uuid` | FK → [commerce.avatar_rigs](commerce.avatar_rigs.md).`id` | NO | — |
| `context_game_id` | `uuid` | FK → [catalog.games](../../tables/catalog.games.md).`id` | YES | — |
| `label` | `text` | — | NO | — |
| `status` | `text` | — | NO | `draft` |
| `created_at` | `timestamptz` | — | NO | `now()` |

## Outbound foreign keys (3)
- `owner_user_id` → [identity.users](../../tables/identity.users.md).`id` (P0)
- `rig_id` → [commerce.avatar_rigs](commerce.avatar_rigs.md).`id` (P1)
- `context_game_id` → [catalog.games](../../tables/catalog.games.md).`id` (P0)

## Inbound foreign keys (1)
- [commerce.avatar_loadout_items](commerce.avatar_loadout_items.md).`loadout_id` → `id`

## Proposed integrity
**Unique constraints:** No additional scoped UNIQUE specified yet.

**Check/invariant and domain guard:**
- active preset uniqueness requires partial index context review

**Indexes:** `(owner_user_id,context_game_id)`

## Required implementation and review
- Evaluate tenant/organization scope and child PII, no direct browser/MCP SQL.
- Verify FK, composite tenant conditions, status machine, optimistic revision, immutable business history, RLS allow-policy **after** SSO source audit.
- Test authorized and unauthorized roles, concurrency and referential integrity in disposable PostgreSQL **only after migration PR exists**.
- Cross-check UI screen IDs/typed API contracts; log P0/P1 decision conflicts before freezing.
