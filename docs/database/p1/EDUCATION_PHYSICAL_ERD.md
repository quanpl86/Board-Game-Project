# Education P1-A — Physical PostgreSQL ERD & Exact Constraint Overlay
**Status:** DEV/CI migration candidate; **NOT frozen / NOT deployed to production**.
**SQL:** `db/migrations/0002_p1a_education_candidate.sql`. **Test:** `db/tests/0002_p1a_education_smoke.sql`. Domain candidate metadata: `db/schema/p1_candidate_tables.json`.

This diagram shows all 11 Education tables, direct P0 foreign-key dependencies, **two additional composite FK gates** included in the physical migration, and column/type declarations. The 44-tab [P1 design Draw.io](diagrams/Board_Game_Universe_P1_Editable.drawio) is still a *candidate diagram*; it does not automatically represent additional physical constraints. Do not treat its older lines as a complete DDL snapshot.

```mermaid
erDiagram
    education_academic_terms {
      uuid id PK
      uuid organization_id FK
      text term_code
      text title
      date starts_on
      date ends_on
      text status
      timestamptz created_at
    }
    education_classes {
      uuid id PK
      uuid organization_id FK
      uuid academic_term_id FK
      text class_code
      text display_name
      uuid teacher_user_id FK
      text status
      timestamptz created_at
    }
    education_class_enrollments {
      uuid id PK
      uuid class_id FK
      uuid student_user_id FK
      text status
      timestamptz joined_at
      timestamptz left_at
      timestamptz created_at
    }
    education_courses {
      uuid id PK
      uuid owner_organization_id FK
      text course_code
      text title
      text status
      uuid created_by FK
      timestamptz created_at
    }
    education_lessons {
      uuid id PK
      uuid course_id FK
      text lesson_code
      integer revision
      text title
      text learning_goal
      uuid content_revision_id FK
      timestamptz published_at
      timestamptz created_at
    }
    education_rubrics {
      uuid id PK
      uuid lesson_id FK
      integer revision
      text title
      uuid approved_by FK
      timestamptz approved_at
      timestamptz created_at
    }
    education_rubric_criteria {
      uuid id PK
      uuid rubric_id FK
      text criterion_code
      text label
      numeric_8_3_ weight
      integer max_level
      integer sort_order
    }
    education_assignments {
      uuid id PK
      uuid class_id FK
      uuid lesson_id FK
      uuid rubric_id FK
      uuid assigned_by FK
      timestamptz opens_at
      timestamptz due_at
      text status
      timestamptz created_at
    }
    education_learning_attempts {
      uuid id PK
      uuid assignment_id FK
      uuid student_user_id FK
      integer attempt_no
      uuid match_result_id FK
      text status
      timestamptz submitted_at
      timestamptz created_at
    }
    education_learning_evidence {
      uuid id PK
      uuid attempt_id FK
      text evidence_type
      integer schema_version
      uuid source_match_command_id FK
      text evidence_sha256
      jsonb redacted_payload
      timestamptz created_at
    }
    education_rubric_assessments {
      uuid id PK
      uuid attempt_id FK
      uuid rubric_criterion_id FK
      uuid assessor_user_id FK
      integer assessment_revision
      integer awarded_level
      text private_feedback
      timestamptz reviewed_at
    }
    tenancy_organizations {
      uuid id PK
    }
    identity_users {
      uuid id PK
    }
    publishing_content_revisions {
      uuid id PK
    }
    gameplay_match_results {
      uuid id PK
    }
    gameplay_match_commands {
      uuid id PK
    }
    tenancy_organizations ||--o{ education_academic_terms : "organization_id"
    tenancy_organizations ||--o{ education_classes : "organization_id"
    education_academic_terms ||--o{ education_classes : "academic_term_id"
    identity_users ||--o{ education_classes : "teacher_user_id"
    education_classes ||--o{ education_class_enrollments : "class_id"
    identity_users ||--o{ education_class_enrollments : "student_user_id"
    tenancy_organizations ||--o{ education_courses : "owner_organization_id"
    identity_users ||--o{ education_courses : "created_by"
    education_courses ||--o{ education_lessons : "course_id"
    publishing_content_revisions ||--o{ education_lessons : "content_revision_id"
    education_lessons ||--o{ education_rubrics : "lesson_id"
    identity_users ||--o{ education_rubrics : "approved_by"
    education_rubrics ||--o{ education_rubric_criteria : "rubric_id"
    education_classes ||--o{ education_assignments : "class_id"
    education_lessons ||--o{ education_assignments : "lesson_id"
    education_rubrics ||--o{ education_assignments : "rubric_id"
    identity_users ||--o{ education_assignments : "assigned_by"
    education_assignments ||--o{ education_learning_attempts : "assignment_id"
    identity_users ||--o{ education_learning_attempts : "student_user_id"
    gameplay_match_results ||--o{ education_learning_attempts : "match_result_id"
    education_learning_attempts ||--o{ education_learning_evidence : "attempt_id"
    gameplay_match_commands ||--o{ education_learning_evidence : "source_match_command_id"
    education_learning_attempts ||--o{ education_rubric_assessments : "attempt_id"
    education_rubric_criteria ||--o{ education_rubric_assessments : "rubric_criterion_id"
    identity_users ||--o{ education_rubric_assessments : "assessor_user_id"
    education_academic_terms ||--o{ education_classes : "COMPOSITE academic_term_id+organization_id"
    education_rubrics ||--o{ education_assignments : "COMPOSITE rubric_id+lesson_id"
```

## Physical constraints added beyond the baseline candidate model
| Database table | Physical invariant | Enforcement and reason |
|---|---|---|
| `education.academic_terms` | `UNIQUE(id,organization_id)` | Enables consistent organization-scoped term reference |
| `education.classes` | `FOREIGN KEY (academic_term_id,organization_id)` → `education.academic_terms(id,organization_id)` | Blocks cross-org class/term mismatch even when both exist |
| `education.rubrics` | `UNIQUE(id,lesson_id)` | Enables assignment rubric to be tied to exact lesson version |
| `education.assignments` | `FOREIGN KEY (rubric_id,lesson_id)` → `education.rubrics(id,lesson_id)` | Blocks rubric from a different lesson |
| `education.learning_attempts` | `edu_attempt_scope` trigger | Requires active class enrollment and verified participant when attaching match result |
| `education.rubric_assessments` | `edu_grade_consistency` trigger | Enforces criterion belongs to assignment rubric and grade <= criterion max |
| `education.learning_evidence` and `rubric_assessments` | Append-only triggers | Historical evidence/grade corrections by new records, not overwriting |
| `education.lessons` / `rubrics` / `rubric_criteria` | Immutable when published/approved | Prevents retroactive changes to assessment authority |
| All 11 tables | `ENABLE ROW LEVEL SECURITY` + `FORCE ROW LEVEL SECURITY`, no policies | Default deny, pending SSO and guardian authorization |

## Explicit cross-layer limitations
- No exact KingDragonHub authenticated teacher principal or guardian consent service yet.
- Triggers validate referential / selected domain integrity, **not** teacher authority or PII retention.
- The migration does **not** grant SELECT/INSERT/UPDATE/DELETE to any runtime role, and creates **zero RLS allow policies**.
- P0 schema is required. No existing data backfill or production migration safety has been tested.
- UI must display no live grade/classroom functionality until authenticated Backend/domain policies and staging security tests are available.
