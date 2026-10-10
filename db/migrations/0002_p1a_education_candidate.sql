-- Board Game Universe — P1-A Education PostgreSQL 16 candidate migration

-- FOR DISPOSABLE DEV/CI DATABASES ONLY. NOT APPROVED FOR STAGING / PRODUCTION.

-- Requires P0 0001 migration; no runtime SSO principal, grant, or RLS allow policy.

-- Schema is intentionally more constrained than the P1 design candidate (see ADR notes).

BEGIN;

CREATE SCHEMA education;

-- education.academic_terms: Niên khóa theo tổ chức, ngày bắt đầu/kết thúc theo UTC.
CREATE TABLE education.academic_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES tenancy.organizations(id) ON DELETE RESTRICT,
  term_code text NOT NULL,
  title text NOT NULL,
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id,term_code),
  CHECK (ends_on >= starts_on),
  CHECK (status IN ('draft','active','archived'))
);

-- education.classes: Lớp học thuộc tổ chức và niên khóa; phân quyền theo membership tổ chức.
CREATE TABLE education.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES tenancy.organizations(id) ON DELETE RESTRICT,
  academic_term_id uuid NOT NULL REFERENCES education.academic_terms(id) ON DELETE RESTRICT,
  class_code text NOT NULL,
  display_name text NOT NULL,
  teacher_user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id,academic_term_id,class_code),
  CHECK (status IN ('draft','active','archived'))
);

-- education.class_enrollments: Lịch sử tham gia lớp học; không suy quyền từ việc tồn tại dòng dữ liệu.
CREATE TABLE education.class_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES education.classes(id) ON DELETE RESTRICT,
  student_user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'invited',
  joined_at timestamptz,
  left_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (class_id,student_user_id),
  CHECK (status IN ('invited','active','left','revoked')),
  CHECK (left_at IS NULL OR joined_at IS NOT NULL),
  CHECK (left_at IS NULL OR left_at >= joined_at)
);

-- education.courses: Khóa/chương trình học dùng lại qua nhiều lớp; có thể do tổ chức sở hữu.
CREATE TABLE education.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_organization_id uuid REFERENCES tenancy.organizations(id) ON DELETE RESTRICT,
  course_code text NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  created_by uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status IN ('draft','review','published','archived'))
);

-- education.lessons: Bài học phiên bản hóa nội dung để giữ bằng chứng lịch sử.
CREATE TABLE education.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES education.courses(id) ON DELETE RESTRICT,
  lesson_code text NOT NULL,
  revision integer NOT NULL,
  title text NOT NULL,
  learning_goal text NOT NULL,
  content_revision_id uuid REFERENCES publishing.content_revisions(id) ON DELETE RESTRICT,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id,lesson_code,revision),
  CHECK (revision > 0)
);

-- education.rubrics: Bộ tiêu chí đánh giá có revision, liên kết chính xác bài học.
CREATE TABLE education.rubrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES education.lessons(id) ON DELETE RESTRICT,
  revision integer NOT NULL,
  title text NOT NULL,
  approved_by uuid REFERENCES identity.users(id) ON DELETE RESTRICT,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lesson_id,revision),
  CHECK (revision > 0),
  CHECK ((approved_by IS NULL) = (approved_at IS NULL))
);

-- education.rubric_criteria: Tiêu chí rubric riêng biệt; mức đánh giá cần diễn giải rõ.
CREATE TABLE education.rubric_criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rubric_id uuid NOT NULL REFERENCES education.rubrics(id) ON DELETE RESTRICT,
  criterion_code text NOT NULL,
  label text NOT NULL,
  weight numeric(8,3) NOT NULL,
  max_level integer NOT NULL,
  sort_order integer NOT NULL,
  UNIQUE (rubric_id,criterion_code),
  CHECK (weight >= 0),
  CHECK (max_level >= 1),
  CHECK (sort_order >= 0)
);

-- education.assignments: Giáo viên giao bài cho lớp; ràng buộc lesson/rubric revision.
CREATE TABLE education.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES education.classes(id) ON DELETE RESTRICT,
  lesson_id uuid NOT NULL REFERENCES education.lessons(id) ON DELETE RESTRICT,
  rubric_id uuid REFERENCES education.rubrics(id) ON DELETE RESTRICT,
  assigned_by uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  opens_at timestamptz,
  due_at timestamptz,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (opens_at IS NULL OR due_at IS NULL OR due_at > opens_at),
  CHECK (status IN ('draft','published','closed','archived'))
);

-- education.learning_attempts: Lượt nộp bài cá nhân; kết quả game chỉ là bằng chứng, không phải điểm học thuật.
CREATE TABLE education.learning_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES education.assignments(id) ON DELETE RESTRICT,
  student_user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  attempt_no integer NOT NULL,
  match_result_id uuid REFERENCES gameplay.match_results(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'in_progress',
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assignment_id,student_user_id,attempt_no),
  CHECK (attempt_no > 0),
  CHECK (status IN ('in_progress','submitted','under_review','assessed','withdrawn')),
  CHECK ((status NOT IN ('submitted','under_review','assessed') OR submitted_at IS NOT NULL))
);

-- education.learning_evidence: Minh chứng theo lượt và schema version, mặc định riêng tư.
CREATE TABLE education.learning_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES education.learning_attempts(id) ON DELETE RESTRICT,
  evidence_type text NOT NULL,
  schema_version integer NOT NULL,
  source_match_command_id uuid REFERENCES gameplay.match_commands(id) ON DELETE RESTRICT,
  evidence_sha256 text NOT NULL,
  redacted_payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (schema_version > 0),
  CHECK (evidence_sha256 ~ '^[a-f0-9]{64}$'),
  CHECK (jsonb_typeof(redacted_payload) = 'object')
);

-- education.rubric_assessments: Kết quả giáo viên nhận xét tiêu chí theo revision; lịch sử không ghi đè.
CREATE TABLE education.rubric_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES education.learning_attempts(id) ON DELETE RESTRICT,
  rubric_criterion_id uuid NOT NULL REFERENCES education.rubric_criteria(id) ON DELETE RESTRICT,
  assessor_user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  assessment_revision integer NOT NULL,
  awarded_level integer NOT NULL,
  private_feedback text,
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (attempt_id,rubric_criterion_id,assessment_revision),
  CHECK (assessment_revision > 0),
  CHECK (awarded_level >= 0)
);

CREATE INDEX edu_terms_org_status_idx ON education.academic_terms(organization_id,status,starts_on);

CREATE INDEX edu_classes_org_status_idx ON education.classes(organization_id,status);

CREATE INDEX edu_enrollment_student_idx ON education.class_enrollments(student_user_id,status);

CREATE INDEX edu_courses_status_idx ON education.courses(status,course_code);

CREATE INDEX edu_lessons_latest_idx ON education.lessons(course_id,lesson_code,revision DESC);

CREATE INDEX edu_rubrics_latest_idx ON education.rubrics(lesson_id,revision DESC);

CREATE INDEX edu_criteria_sort_idx ON education.rubric_criteria(rubric_id,sort_order);

CREATE INDEX edu_assignments_class_status_idx ON education.assignments(class_id,status,opens_at);

CREATE INDEX edu_attempts_student_idx ON education.learning_attempts(student_user_id,submitted_at DESC);

CREATE INDEX edu_evidence_attempt_idx ON education.learning_evidence(attempt_id,created_at);

CREATE INDEX edu_assessment_attempt_idx ON education.rubric_assessments(attempt_id,reviewed_at DESC);


-- Composite FK gates: classes cannot point at a term in another organization;
-- assignments cannot point at a rubric from a different lesson.
ALTER TABLE education.academic_terms ADD CONSTRAINT terms_id_organization_unique UNIQUE (id,organization_id);
ALTER TABLE education.classes ADD CONSTRAINT class_term_same_org
  FOREIGN KEY (academic_term_id,organization_id)
  REFERENCES education.academic_terms(id,organization_id) ON DELETE RESTRICT;
ALTER TABLE education.rubrics ADD CONSTRAINT rubric_id_lesson_unique UNIQUE (id,lesson_id);
ALTER TABLE education.assignments ADD CONSTRAINT assignment_rubric_lesson_consistency
  FOREIGN KEY (rubric_id,lesson_id) REFERENCES education.rubrics(id,lesson_id) ON DELETE RESTRICT;

-- Catalog/teaching revisions are immutable once they have been published or approved.
CREATE FUNCTION education.restrict_approved_revisions() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_TABLE_NAME = 'lessons' THEN
    IF OLD.published_at IS NOT NULL THEN
      RAISE EXCEPTION 'published lesson is immutable' USING ERRCODE='55000';
    END IF;
  ELSIF TG_TABLE_NAME = 'rubrics' THEN
    IF OLD.approved_at IS NOT NULL THEN
      RAISE EXCEPTION 'approved rubric is immutable' USING ERRCODE='55000';
    END IF;
  ELSE
    RAISE EXCEPTION 'unknown approved revision table' USING ERRCODE='55000';
  END IF;
  IF TG_OP='DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER edu_lessons_immutable BEFORE UPDATE OR DELETE ON education.lessons
  FOR EACH ROW EXECUTE FUNCTION education.restrict_approved_revisions();
CREATE TRIGGER edu_rubrics_immutable BEFORE UPDATE OR DELETE ON education.rubrics
  FOR EACH ROW EXECUTE FUNCTION education.restrict_approved_revisions();

-- Approved rubrics cannot have criteria altered after approval.
CREATE FUNCTION education.restrict_approved_criteria() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE key uuid;
BEGIN
  key := CASE WHEN TG_OP='DELETE' THEN OLD.rubric_id ELSE NEW.rubric_id END;
  IF EXISTS(SELECT 1 FROM education.rubrics WHERE id=key AND approved_at IS NOT NULL) THEN
    RAISE EXCEPTION 'approved rubric criteria immutable' USING ERRCODE='55000';
  END IF;
  IF TG_OP='UPDATE' AND OLD.rubric_id <> NEW.rubric_id
     AND EXISTS(SELECT 1 FROM education.rubrics WHERE id=OLD.rubric_id AND approved_at IS NOT NULL) THEN
    RAISE EXCEPTION 'approved rubric criteria immutable' USING ERRCODE='55000';
  END IF;
  IF TG_OP='DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER edu_criteria_immutable BEFORE INSERT OR UPDATE OR DELETE ON education.rubric_criteria
  FOR EACH ROW EXECUTE FUNCTION education.restrict_approved_criteria();

-- Student must be an active class enrollee at attempt creation; attached result must
-- be an authoritative match result where student is an actual playing participant.
CREATE FUNCTION education.guard_attempt_submission() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE cls uuid; matched uuid;
BEGIN
  SELECT class_id INTO cls FROM education.assignments WHERE id=NEW.assignment_id;
  IF NOT EXISTS(
    SELECT 1 FROM education.class_enrollments e
    WHERE e.class_id=cls AND e.student_user_id=NEW.student_user_id AND e.status='active'
  ) THEN
    RAISE EXCEPTION 'student not active in assignment class' USING ERRCODE='23514';
  END IF;
  IF NEW.match_result_id IS NOT NULL AND NOT EXISTS(
    SELECT 1 FROM gameplay.match_results r
    JOIN gameplay.match_participants p ON p.match_id=r.match_id
    WHERE r.id=NEW.match_result_id AND p.user_id=NEW.student_user_id AND p.role IN ('player','host')
  ) THEN
    RAISE EXCEPTION 'game result does not belong to submitting student' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER edu_attempt_scope BEFORE INSERT OR UPDATE OF assignment_id, student_user_id, match_result_id
  ON education.learning_attempts FOR EACH ROW EXECUTE FUNCTION education.guard_attempt_submission();

-- Once attempts exist, lesson and rubric assignment are pinned to preserve grade history.
CREATE FUNCTION education.guard_assignment_revision() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (OLD.lesson_id,OLD.rubric_id) IS DISTINCT FROM (NEW.lesson_id,NEW.rubric_id)
     AND EXISTS(SELECT 1 FROM education.learning_attempts WHERE assignment_id=OLD.id) THEN
    RAISE EXCEPTION 'assignment lesson/rubric pinned after attempts' USING ERRCODE='55000';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER edu_assignment_pins BEFORE UPDATE OF lesson_id,rubric_id
  ON education.assignments FOR EACH ROW EXECUTE FUNCTION education.guard_assignment_revision();

-- Grade must belong to the assignment's approved rubric and respect max_level.
-- Human assessor identity/organization permissions are NOT inferred from this trigger.
CREATE FUNCTION education.guard_assessment() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE expected_rubric uuid; criterion_rubric uuid; allowed_max integer;
BEGIN
  SELECT a.rubric_id INTO expected_rubric FROM education.learning_attempts at
    JOIN education.assignments a ON a.id=at.assignment_id WHERE at.id=NEW.attempt_id;
  SELECT c.rubric_id,c.max_level INTO criterion_rubric,allowed_max
    FROM education.rubric_criteria c WHERE c.id=NEW.rubric_criterion_id;
  IF expected_rubric IS NULL OR criterion_rubric IS DISTINCT FROM expected_rubric
     OR NEW.awarded_level > allowed_max THEN
    RAISE EXCEPTION 'rubric criterion not linked to assignment or level out of bounds' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER edu_grade_consistency BEFORE INSERT ON education.rubric_assessments
  FOR EACH ROW EXECUTE FUNCTION education.guard_assessment();

-- Immutable private evidence and grade revision records; correct through new revision.
CREATE TRIGGER edu_evidence_append_only BEFORE UPDATE OR DELETE ON education.learning_evidence
  FOR EACH ROW EXECUTE FUNCTION integration.prevent_append_mutation();
CREATE TRIGGER edu_assessment_append_only BEFORE UPDATE OR DELETE ON education.rubric_assessments
  FOR EACH ROW EXECUTE FUNCTION integration.prevent_append_mutation();

-- Prevent incomplete real-user access. No runtime GRANT or allow-policy is installed.
ALTER TABLE education.academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE education.academic_terms FORCE ROW LEVEL SECURITY;
ALTER TABLE education.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE education.classes FORCE ROW LEVEL SECURITY;
ALTER TABLE education.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE education.class_enrollments FORCE ROW LEVEL SECURITY;
ALTER TABLE education.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE education.courses FORCE ROW LEVEL SECURITY;
ALTER TABLE education.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE education.lessons FORCE ROW LEVEL SECURITY;
ALTER TABLE education.rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE education.rubrics FORCE ROW LEVEL SECURITY;
ALTER TABLE education.rubric_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE education.rubric_criteria FORCE ROW LEVEL SECURITY;
ALTER TABLE education.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE education.assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE education.learning_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE education.learning_attempts FORCE ROW LEVEL SECURITY;
ALTER TABLE education.learning_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE education.learning_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE education.rubric_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE education.rubric_assessments FORCE ROW LEVEL SECURITY;
COMMIT;

