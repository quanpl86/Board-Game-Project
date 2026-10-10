# P1 EDUCATION — Domain ERD · DESIGN PROPOSAL

11 proposed tables, 25 relations touching this domain. Other nodes included as P0/P1 dependencies.

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
```

- [education.academic_terms](tables/education.academic_terms.md) — Niên khóa theo tổ chức, ngày bắt đầu/kết thúc theo UTC.
- [education.classes](tables/education.classes.md) — Lớp học thuộc tổ chức và niên khóa; phân quyền theo membership tổ chức.
- [education.class_enrollments](tables/education.class_enrollments.md) — Lịch sử tham gia lớp học; không suy quyền từ việc tồn tại dòng dữ liệu.
- [education.courses](tables/education.courses.md) — Khóa/chương trình học dùng lại qua nhiều lớp; có thể do tổ chức sở hữu.
- [education.lessons](tables/education.lessons.md) — Bài học phiên bản hóa nội dung để giữ bằng chứng lịch sử.
- [education.rubrics](tables/education.rubrics.md) — Bộ tiêu chí đánh giá có revision, liên kết chính xác bài học.
- [education.rubric_criteria](tables/education.rubric_criteria.md) — Tiêu chí rubric riêng biệt; mức đánh giá cần diễn giải rõ.
- [education.assignments](tables/education.assignments.md) — Giáo viên giao bài cho lớp; ràng buộc lesson/rubric revision.
- [education.learning_attempts](tables/education.learning_attempts.md) — Lượt nộp bài cá nhân; kết quả game chỉ là bằng chứng, không phải điểm học thuật.
- [education.learning_evidence](tables/education.learning_evidence.md) — Minh chứng theo lượt và schema version, mặc định riêng tư.
- [education.rubric_assessments](tables/education.rubric_assessments.md) — Kết quả giáo viên nhận xét tiêu chí theo revision; lịch sử không ghi đè.
