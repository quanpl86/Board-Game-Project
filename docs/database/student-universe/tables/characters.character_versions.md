# characters.character_versions

> Design candidate — no physical migration.

Phiên bản mẫu gắn rig canonical và asset GLB đã duyệt.

## Direct relationships
```mermaid
flowchart LR
    MAIN["characters.character_versions"]
    OUT0["characters.character_definitions"]
    MAIN -->|"definition_id"| OUT0
    OUT1["commerce.avatar_rigs"]
    MAIN -->|"rig_id"| OUT1
    OUT2["assets.asset_versions"]
    MAIN -->|"base_asset_version_id"| OUT2
    IN0["characters.character_instances"]
    IN0 -->|"character_version_id"| MAIN
```

## Proposed columns
| Column | Type | PK | FK | Nullable |
|---|---|---|---|---|
| `id` | `uuid` | Yes | — | No |
| `definition_id` | `uuid` | No | characters.character_definitions.id | No |
| `revision` | `integer` | No | — | No |
| `rig_id` | `uuid` | No | commerce.avatar_rigs.id | No |
| `base_asset_version_id` | `uuid` | No | assets.asset_versions.id | No |
| `manifest_sha256` | `text` | No | — | No |
| `published_at` | `timestamptz` | No | — | Yes |

## Business/security invariants
- asset rights approved; GLB rig compatible
- revision > 0; published row immutable
- never embed remote unapproved asset URLs

Student ownership, guardian permissions and least-privilege RLS require independent verification before enabling API writes.
