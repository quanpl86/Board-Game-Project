# competition.tournament_registrations — P1 DATA DICTIONARY

**Status:** DRAFT / NOT MIGRATED · **Owner:** competition · **Data classification:** restricted

Đăng ký cá nhân; eligibility/consent kiểm tra bởi service.

## Direct relationship preview

![Editable relationship preview](../diagrams/previews/18_p1_table_competition_tournament_registrations.svg)

## Columns (6)
| Column | Candidate PostgreSQL type | Key | Nullable | Default |
|---|---|---|---|---|
| `id` | `uuid` | PK | NO | — |
| `tournament_id` | `uuid` | FK → [competition.tournaments](competition.tournaments.md).`id` | NO | — |
| `participant_user_id` | `uuid` | FK → [identity.users](../../tables/identity.users.md).`id` | NO | — |
| `status` | `text` | — | NO | `pending` |
| `eligibility_revision_hash` | `text` | — | NO | — |
| `registered_at` | `timestamptz` | — | NO | `now()` |

## Outbound foreign keys (2)
- `tournament_id` → [competition.tournaments](competition.tournaments.md).`id` (P1)
- `participant_user_id` → [identity.users](../../tables/identity.users.md).`id` (P0)

## Inbound foreign keys (0)
- None

## Proposed integrity
**Unique constraints:** `(tournament_id,participant_user_id)`

**Check/invariant and domain guard:**
- age/organization policy must be verified server-side

**Indexes:** `(tournament_id,status)`

## Required implementation and review
- Evaluate tenant/organization scope and child PII, no direct browser/MCP SQL.
- Verify FK, composite tenant conditions, status machine, optimistic revision, immutable business history, RLS allow-policy **after** SSO source audit.
- Test authorized and unauthorized roles, concurrency and referential integrity in disposable PostgreSQL **only after migration PR exists**.
- Cross-check UI screen IDs/typed API contracts; log P0/P1 decision conflicts before freezing.
