# achievements.achievement_definitions

> Design candidate — no physical migration.

Bộ achievement/huy hiệu phiên bản hóa, tách ranking/game score.

## Direct relationships
```mermaid
flowchart LR
    MAIN["achievements.achievement_definitions"]
    OUT0["commerce.item_versions"]
    MAIN -->|"icon_item_version_id"| OUT0
    IN0["achievements.achievement_grants"]
    IN0 -->|"definition_id"| MAIN
```

## Proposed columns
| Column | Type | PK | FK | Nullable |
|---|---|---|---|---|
| `id` | `uuid` | Yes | — | No |
| `code` | `text` | No | — | No |
| `revision` | `integer` | No | — | No |
| `icon_item_version_id` | `uuid` | No | commerce.item_versions.id | Yes |
| `title` | `text` | No | — | No |
| `criteria_sha256` | `text` | No | — | No |
| `status` | `text` | No | — | No |

## Business/security invariants
- verified, published criteria immutable
- icon rights approved

Student ownership, guardian permissions and least-privilege RLS require independent verification before enabling API writes.
