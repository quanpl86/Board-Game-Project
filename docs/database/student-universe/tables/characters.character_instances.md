# characters.character_instances

> Design candidate — no physical migration.

Nhân vật riêng của học sinh; nhiều nhân vật với nickname được kiểm duyệt.

## Direct relationships
```mermaid
flowchart LR
    MAIN["characters.character_instances"]
    OUT0["student.student_profiles"]
    MAIN -->|"owner_user_id"| OUT0
    OUT1["characters.character_versions"]
    MAIN -->|"character_version_id"| OUT1
    IN0["characters.character_loadout_bindings"]
    IN0 -->|"character_instance_id"| MAIN
    IN1["characters.character_progress_events"]
    IN1 -->|"character_instance_id"| MAIN
    IN2["characters.pet_states"]
    IN2 -->|"character_instance_id"| MAIN
```

## Proposed columns
| Column | Type | PK | FK | Nullable |
|---|---|---|---|---|
| `id` | `uuid` | Yes | — | No |
| `owner_user_id` | `uuid` | No | student.student_profiles.user_id | No |
| `character_version_id` | `uuid` | No | characters.character_versions.id | No |
| `nickname` | `text` | No | — | No |
| `status` | `text` | No | — | No |
| `created_at` | `timestamptz` | No | — | No |

## Business/security invariants
- owner immutable except approved compensation
- one user can own multiple character instances
- no resale/trade among minors

Student ownership, guardian permissions and least-privilege RLS require independent verification before enabling API writes.
