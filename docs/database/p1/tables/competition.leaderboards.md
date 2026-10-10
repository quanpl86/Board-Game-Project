# competition.leaderboards — P1 DATA DICTIONARY

**Status:** DRAFT / NOT MIGRATED · **Owner:** competition · **Data classification:** restricted

Định nghĩa bảng xếp hạng, không chứa đánh giá học thuật cá nhân công khai.

## Direct relationship preview

![Editable relationship preview](../diagrams/previews/24_p1_table_competition_leaderboards.svg)

## Columns (7)
| Column | Candidate PostgreSQL type | Key | Nullable | Default |
|---|---|---|---|---|
| `id` | `uuid` | PK | NO | — |
| `scoring_policy_id` | `uuid` | FK → [competition.scoring_policies](competition.scoring_policies.md).`id` | NO | — |
| `tournament_id` | `uuid` | FK → [competition.tournaments](competition.tournaments.md).`id` | YES | — |
| `scope` | `text` | — | NO | — |
| `visibility_policy` | `text` | — | NO | `restricted` |
| `status` | `text` | — | NO | `draft` |
| `created_at` | `timestamptz` | — | NO | `now()` |

## Outbound foreign keys (2)
- `scoring_policy_id` → [competition.scoring_policies](competition.scoring_policies.md).`id` (P1)
- `tournament_id` → [competition.tournaments](competition.tournaments.md).`id` (P1)

## Inbound foreign keys (1)
- [competition.leaderboard_entries](competition.leaderboard_entries.md).`leaderboard_id` → `id`

## Proposed integrity
**Unique constraints:** No additional scoped UNIQUE specified yet.

**Check/invariant and domain guard:**
- private learner grade excluded
- visible minors require policy

**Indexes:** `(scoring_policy_id,status)`

## Required implementation and review
- Evaluate tenant/organization scope and child PII, no direct browser/MCP SQL.
- Verify FK, composite tenant conditions, status machine, optimistic revision, immutable business history, RLS allow-policy **after** SSO source audit.
- Test authorized and unauthorized roles, concurrency and referential integrity in disposable PostgreSQL **only after migration PR exists**.
- Cross-check UI screen IDs/typed API contracts; log P0/P1 decision conflicts before freezing.
