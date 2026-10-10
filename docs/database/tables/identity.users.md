# identity.users

**Purpose:** Danh tính toàn cục của người dùng; không đồng nhất với external SSO subject.

**Data owner:** Identity · **Classification:** restricted · **Approval:** PROPOSED / NOT FROZEN · **Retention:** Review before production

## Relationship diagram — this table and every declared SQL FK neighbor
```mermaid
flowchart LR
    T["identity.users"]
    N0["identity.external_identities"]
    N1["identity.profiles"]
    N2["identity.guardian_links"]
    N3["identity.policy_acknowledgments"]
    N4["tenancy.organization_memberships"]
    N5["tenancy.role_assignments"]
    N6["assets.assets"]
    N7["catalog.games"]
    N8["gameplay.game_rooms"]
    N9["gameplay.room_memberships"]
    N10["gameplay.match_participants"]
    N11["gameplay.match_commands"]
    N12["gameplay.match_result_entries"]
    N13["publishing.content_items"]
    N14["publishing.content_revisions"]
    N15["publishing.content_publications"]
    N16["integration.audit_events"]
    N17["integration.agent_approvals"]
    N18["integration.agent_invocations"]
    N0 -->|"user_id → id"| T
    N1 -->|"user_id → id"| T
    N2 -->|"guardian_user_id → id"| T
    N2 -->|"student_user_id → id"| T
    N2 -->|"verified_by → id"| T
    N3 -->|"user_id → id"| T
    N4 -->|"user_id → id"| T
    N5 -->|"assigned_by → id"| T
    N6 -->|"created_by → id"| T
    N7 -->|"created_by → id"| T
    N8 -->|"created_by → id"| T
    N9 -->|"user_id → id"| T
    N10 -->|"user_id → id"| T
    N11 -->|"actor_user_id → id"| T
    N12 -->|"user_id → id"| T
    N13 -->|"created_by → id"| T
    N14 -->|"created_by → id"| T
    N15 -->|"approved_by → id"| T
    N16 -->|"actor_user_id → id"| T
    N17 -->|"requested_by → id"| T
    N17 -->|"approved_by → id"| T
    N18 -->|"initiated_by → id"| T
```

## Physical field declarations (canonical migration)
| # | Column / constraint | PostgreSQL definition |
|---:|---|---|
| 1 | `id` | `id uuid PRIMARY KEY DEFAULT gen_random_uuid()` |
| 2 | `account_type` | `account_type text NOT NULL CHECK (account_type IN ('adult','student','service'))` |
| 3 | `status` | `status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','limited','suspended','deactivated'))` |
| 4 | `created_at` | `created_at timestamptz NOT NULL DEFAULT now()` |
| 5 | `updated_at` | `updated_at timestamptz NOT NULL DEFAULT now()` |

## Outbound foreign keys (0)
No direct outbound FK.

## Inbound foreign keys (22)
- [`identity.external_identities`](identity.external_identities.md) via `user_id` → `id`
- [`identity.profiles`](identity.profiles.md) via `user_id` → `id`
- [`identity.guardian_links`](identity.guardian_links.md) via `guardian_user_id` → `id`
- [`identity.guardian_links`](identity.guardian_links.md) via `student_user_id` → `id`
- [`identity.guardian_links`](identity.guardian_links.md) via `verified_by` → `id`
- [`identity.policy_acknowledgments`](identity.policy_acknowledgments.md) via `user_id` → `id`
- [`tenancy.organization_memberships`](tenancy.organization_memberships.md) via `user_id` → `id`
- [`tenancy.role_assignments`](tenancy.role_assignments.md) via `assigned_by` → `id`
- [`assets.assets`](assets.assets.md) via `created_by` → `id`
- [`catalog.games`](catalog.games.md) via `created_by` → `id`
- [`gameplay.game_rooms`](gameplay.game_rooms.md) via `created_by` → `id`
- [`gameplay.room_memberships`](gameplay.room_memberships.md) via `user_id` → `id`
- [`gameplay.match_participants`](gameplay.match_participants.md) via `user_id` → `id`
- [`gameplay.match_commands`](gameplay.match_commands.md) via `actor_user_id` → `id`
- [`gameplay.match_result_entries`](gameplay.match_result_entries.md) via `user_id` → `id`
- [`publishing.content_items`](publishing.content_items.md) via `created_by` → `id`
- [`publishing.content_revisions`](publishing.content_revisions.md) via `created_by` → `id`
- [`publishing.content_publications`](publishing.content_publications.md) via `approved_by` → `id`
- [`integration.audit_events`](integration.audit_events.md) via `actor_user_id` → `id`
- [`integration.agent_approvals`](integration.agent_approvals.md) via `requested_by` → `id`
- [`integration.agent_approvals`](integration.agent_approvals.md) via `approved_by` → `id`
- [`integration.agent_invocations`](integration.agent_invocations.md) via `initiated_by` → `id`

## Indexes / uniqueness
Primary, uniqueness or composite constraints are defined inline in the migration.

## Runtime authorization, integrity and tests
- This table has **ENABLE + FORCE RLS with no access policies** in the proposed P0 migration. Service role grants and policy mapping cannot be activated before KingDragonHub provider/tenant authorization audit.
- All FK references are SQL-enforced; permission checks, business aggregate transitions and audit/outbox idempotency must also be tested at application layer.
- Tests: create/replay migration on disposable PostgreSQL, validate FK/unique/check errors, least-privilege access denial and no cross-tenant leakage once policies are authored.
- Historical update/delete or legal retention decisions require explicit owner review. No unapproved production migration.
