# creations.student_project_versions

> Design candidate — no physical migration.

Lịch sử version của project: source editable và asset đầu ra được kiểm duyệt.

## Direct relationships
```mermaid
flowchart LR
    MAIN["creations.student_project_versions"]
    OUT0["creations.student_projects"]
    MAIN -->|"project_id"| OUT0
    OUT1["assets.asset_versions"]
    MAIN -->|"output_asset_version_id"| OUT1
    IN0["creations.project_review_events"]
    IN0 -->|"project_version_id"| MAIN
```

## Proposed columns
| Column | Type | PK | FK | Nullable |
|---|---|---|---|---|
| `id` | `uuid` | Yes | — | No |
| `project_id` | `uuid` | No | creations.student_projects.id | No |
| `revision` | `integer` | No | — | No |
| `source_hash` | `text` | No | — | No |
| `source_storage_key` | `text` | No | — | No |
| `output_asset_version_id` | `uuid` | No | assets.asset_versions.id | Yes |
| `created_at` | `timestamptz` | No | — | No |

## Business/security invariants
- immutable revision + object ownership
- source_storage_key private; signed access only
- GLB/texture licensing and safe content scanning

Student ownership, guardian permissions and least-privilege RLS require independent verification before enabling API writes.
