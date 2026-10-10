# education.academic_terms — P1 DATA DICTIONARY

**Status:** DRAFT / NOT MIGRATED · **Owner:** education · **Data classification:** restricted

Niên khóa theo tổ chức, ngày bắt đầu/kết thúc theo UTC.

## Direct relationship preview

![Editable relationship preview](../diagrams/previews/05_p1_table_education_academic_terms.svg)

## Columns (8)
| Column | Candidate PostgreSQL type | Key | Nullable | Default |
|---|---|---|---|---|
| `id` | `uuid` | PK | NO | — |
| `organization_id` | `uuid` | FK → [tenancy.organizations](../../tables/tenancy.organizations.md).`id` | NO | — |
| `term_code` | `text` | — | NO | — |
| `title` | `text` | — | NO | — |
| `starts_on` | `date` | — | NO | — |
| `ends_on` | `date` | — | NO | — |
| `status` | `text` | — | NO | `draft` |
| `created_at` | `timestamptz` | — | NO | `now()` |

## Outbound foreign keys (1)
- `organization_id` → [tenancy.organizations](../../tables/tenancy.organizations.md).`id` (P0)

## Inbound foreign keys (1)
- [education.classes](education.classes.md).`academic_term_id` → `id`

## Proposed integrity
**Unique constraints:** `(organization_id,term_code)`

**Check/invariant and domain guard:**
- ends_on >= starts_on

**Indexes:** `(organization_id,status,starts_on)`

## Required implementation and review
- Evaluate tenant/organization scope and child PII, no direct browser/MCP SQL.
- Verify FK, composite tenant conditions, status machine, optimistic revision, immutable business history, RLS allow-policy **after** SSO source audit.
- Test authorized and unauthorized roles, concurrency and referential integrity in disposable PostgreSQL **only after migration PR exists**.
- Cross-check UI screen IDs/typed API contracts; log P0/P1 decision conflicts before freezing.
