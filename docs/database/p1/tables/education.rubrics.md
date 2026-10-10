# education.rubrics — P1 DATA DICTIONARY

**Status:** DRAFT / NOT MIGRATED · **Owner:** education · **Data classification:** restricted

Bộ tiêu chí đánh giá có revision, liên kết chính xác bài học.

## Direct relationship preview

![Editable relationship preview](../diagrams/previews/10_p1_table_education_rubrics.svg)

## Columns (7)
| Column | Candidate PostgreSQL type | Key | Nullable | Default |
|---|---|---|---|---|
| `id` | `uuid` | PK | NO | — |
| `lesson_id` | `uuid` | FK → [education.lessons](education.lessons.md).`id` | NO | — |
| `revision` | `integer` | — | NO | — |
| `title` | `text` | — | NO | — |
| `approved_by` | `uuid` | FK → [identity.users](../../tables/identity.users.md).`id` | YES | — |
| `approved_at` | `timestamptz` | — | YES | — |
| `created_at` | `timestamptz` | — | NO | `now()` |

## Outbound foreign keys (2)
- `lesson_id` → [education.lessons](education.lessons.md).`id` (P1)
- `approved_by` → [identity.users](../../tables/identity.users.md).`id` (P0)

## Inbound foreign keys (2)
- [education.rubric_criteria](education.rubric_criteria.md).`rubric_id` → `id`
- [education.assignments](education.assignments.md).`rubric_id` → `id`

## Proposed integrity
**Unique constraints:** `(lesson_id,revision)`

**Check/invariant and domain guard:**
- revision > 0
- approved rubric immutable; confirm change process

**Indexes:** `(lesson_id,revision DESC)`

## Required implementation and review
- Evaluate tenant/organization scope and child PII, no direct browser/MCP SQL.
- Verify FK, composite tenant conditions, status machine, optimistic revision, immutable business history, RLS allow-policy **after** SSO source audit.
- Test authorized and unauthorized roles, concurrency and referential integrity in disposable PostgreSQL **only after migration PR exists**.
- Cross-check UI screen IDs/typed API contracts; log P0/P1 decision conflicts before freezing.
