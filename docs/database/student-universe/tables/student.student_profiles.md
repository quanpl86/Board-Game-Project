# student.student_profiles

> Design candidate — no physical migration.

Hồ sơ học sinh bảo mật theo user global; không sao chép họ tên, ngày sinh hoặc mật khẩu từ KingDragonHub.

## Direct relationships
```mermaid
flowchart LR
    MAIN["student.student_profiles"]
    OUT0["identity.users"]
    MAIN -->|"user_id"| OUT0
    IN0["student.privacy_settings"]
    IN0 -->|"student_user_id"| MAIN
    IN1["characters.character_instances"]
    IN1 -->|"owner_user_id"| MAIN
    IN2["creations.student_projects"]
    IN2 -->|"creator_user_id"| MAIN
    IN3["progress.student_game_progress"]
    IN3 -->|"student_user_id"| MAIN
    IN4["progress.student_game_progress_events"]
    IN4 -->|"student_user_id"| MAIN
    IN5["ownership.inventory_events"]
    IN5 -->|"owner_user_id"| MAIN
    IN6["ownership.inventory_stacks"]
    IN6 -->|"owner_user_id"| MAIN
    IN7["economy.reward_grants"]
    IN7 -->|"recipient_user_id"| MAIN
    IN8["economy.wallet_spending_limits"]
    IN8 -->|"recipient_user_id"| MAIN
    IN9["achievements.achievement_grants"]
    IN9 -->|"student_user_id"| MAIN
```

## Proposed columns
| Column | Type | PK | FK | Nullable |
|---|---|---|---|---|
| `user_id` | `uuid` | Yes | identity.users.id | No |
| `display_alias` | `text` | No | — | No |
| `learning_stage` | `text` | No | — | Yes |
| `onboarding_status` | `text` | No | — | No |
| `created_at` | `timestamptz` | No | — | No |
| `updated_at` | `timestamptz` | No | — | No |

## Business/security invariants
- account_type must be student; server validates SSO and guardian policy
- display_alias sanitized/non-identifying, 3-40 chars
- learning_stage is optional and NOT exact birthdate

Student ownership, guardian permissions and least-privilege RLS require independent verification before enabling API writes.
