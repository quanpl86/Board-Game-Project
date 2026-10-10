# competition.tournament_rounds — P1 DATA DICTIONARY

**Status:** DRAFT / NOT MIGRATED · **Owner:** competition · **Data classification:** restricted

Vòng đấu thuộc giải, không trực tiếp đồng nhất với một trận.

## Direct relationship preview

![Editable relationship preview](../diagrams/previews/19_p1_table_competition_tournament_rounds.svg)

## Columns (5)
| Column | Candidate PostgreSQL type | Key | Nullable | Default |
|---|---|---|---|---|
| `id` | `uuid` | PK | NO | — |
| `tournament_id` | `uuid` | FK → [competition.tournaments](competition.tournaments.md).`id` | NO | — |
| `round_number` | `integer` | — | NO | — |
| `status` | `text` | — | NO | `draft` |
| `starts_at` | `timestamptz` | — | YES | — |

## Outbound foreign keys (1)
- `tournament_id` → [competition.tournaments](competition.tournaments.md).`id` (P1)

## Inbound foreign keys (1)
- [competition.tournament_fixtures](competition.tournament_fixtures.md).`round_id` → `id`

## Proposed integrity
**Unique constraints:** `(tournament_id,round_number)`

**Check/invariant and domain guard:**
- round_number >= 1

**Indexes:** `(tournament_id,status)`

## Required implementation and review
- Evaluate tenant/organization scope and child PII, no direct browser/MCP SQL.
- Verify FK, composite tenant conditions, status machine, optimistic revision, immutable business history, RLS allow-policy **after** SSO source audit.
- Test authorized and unauthorized roles, concurrency and referential integrity in disposable PostgreSQL **only after migration PR exists**.
- Cross-check UI screen IDs/typed API contracts; log P0/P1 decision conflicts before freezing.
