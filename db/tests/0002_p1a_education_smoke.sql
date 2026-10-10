-- P1-A Education isolated PostgreSQL 16 integrity and default-deny tests
-- All records and probe roles are rolled back; never run against real student data.
\set ON_ERROR_STOP on
BEGIN;
DO $edu$
DECLARE
  org1 uuid;org2 uuid; teacher uuid;student uuid;second_student uuid;outside_student uuid;
  term_id uuid;term_other uuid;class_id uuid;course_id uuid;lesson_id uuid;lesson2_id uuid;
  rubric_id uuid;rubric2_id uuid;criterion_id uuid;criterion2_id uuid;
  assignment_id uuid; attempt_id uuid; evidence_id uuid; grade_id uuid;
  game_id uuid;version_id uuid;room_id uuid;match_id uuid;result_id uuid;
BEGIN
  INSERT INTO identity.users(account_type) VALUES('adult') RETURNING id INTO teacher;
  INSERT INTO identity.users(account_type) VALUES('student') RETURNING id INTO student;
  INSERT INTO identity.users(account_type) VALUES('student') RETURNING id INTO second_student;
  INSERT INTO identity.users(account_type) VALUES('student') RETURNING id INTO outside_student;
  INSERT INTO tenancy.organizations(slug,display_name,kind)
    VALUES('edu-org-one','Education Org 1','school') RETURNING id INTO org1;
  INSERT INTO tenancy.organizations(slug,display_name,kind)
    VALUES('edu-org-two','Education Org 2','school') RETURNING id INTO org2;

  INSERT INTO education.academic_terms(organization_id,term_code,title,starts_on,ends_on,status)
    VALUES(org1,'2026-Fall','Học kỳ I','2026-09-01','2027-01-31','active') RETURNING id INTO term_id;
  INSERT INTO education.academic_terms(organization_id,term_code,title,starts_on,ends_on)
    VALUES(org2,'2026-Fall','Học kỳ I khác','2026-09-01','2027-01-31') RETURNING id INTO term_other;
  BEGIN
    INSERT INTO education.academic_terms(organization_id,term_code,title,starts_on,ends_on)
      VALUES(org1,'invalid-dates','Inverted','2027-02-01','2026-09-01');
    RAISE EXCEPTION 'invalid academic term accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    INSERT INTO education.classes(organization_id,academic_term_id,class_code,display_name,teacher_user_id)
      VALUES(org1,term_other,'wrong-tenant','Lớp sai tổ chức',teacher);
    RAISE EXCEPTION 'cross-org academic term accepted';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;
  INSERT INTO education.classes(organization_id,academic_term_id,class_code,display_name,teacher_user_id,status)
    VALUES(org1,term_id,'G1A','Lớp 1A',teacher,'active') RETURNING id INTO class_id;
  INSERT INTO education.class_enrollments(class_id,student_user_id,status,joined_at)
    VALUES(class_id,student,'active',now());
  INSERT INTO education.class_enrollments(class_id,student_user_id,status,joined_at)
    VALUES(class_id,second_student,'active',now());

  INSERT INTO education.courses(owner_organization_id,course_code,title,created_by)
    VALUES(org1,'we-do-p1a','WeDo test',teacher) RETURNING id INTO course_id;
  INSERT INTO education.lessons(course_id,lesson_code,revision,title,learning_goal)
    VALUES(course_id,'robot-car',1,'Xe robot','Giải thuật điều khiển') RETURNING id INTO lesson_id;
  INSERT INTO education.lessons(course_id,lesson_code,revision,title,learning_goal)
    VALUES(course_id,'robot-sensor',1,'Cảm biến','Đọc cảm biến') RETURNING id INTO lesson2_id;
  UPDATE education.lessons SET published_at=now() WHERE id=lesson_id;
  BEGIN
    UPDATE education.lessons SET learning_goal='secret edit' WHERE id=lesson_id;
    RAISE EXCEPTION 'published lesson can be changed';
  EXCEPTION WHEN SQLSTATE '55000' THEN NULL; END;
  INSERT INTO education.rubrics(lesson_id,revision,title) VALUES(lesson_id,1,'Rubric thiết kế') RETURNING id INTO rubric_id;
  INSERT INTO education.rubrics(lesson_id,revision,title) VALUES(lesson2_id,1,'Rubric cảm biến') RETURNING id INTO rubric2_id;
  INSERT INTO education.rubric_criteria(rubric_id,criterion_code,label,weight,max_level,sort_order)
    VALUES(rubric_id,'logic','Logic',1,4,1) RETURNING id INTO criterion_id;
  INSERT INTO education.rubric_criteria(rubric_id,criterion_code,label,weight,max_level,sort_order)
    VALUES(rubric2_id,'other','Other',1,4,1) RETURNING id INTO criterion2_id;
  BEGIN
    INSERT INTO education.assignments(class_id,lesson_id,rubric_id,assigned_by)
      VALUES(class_id,lesson_id,rubric2_id,teacher);
    RAISE EXCEPTION 'rubric from wrong lesson accepted';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;
  UPDATE education.rubrics SET approved_by=teacher,approved_at=now() WHERE id=rubric_id;
  BEGIN
    UPDATE education.rubric_criteria SET label='mutated after approval' WHERE id=criterion_id;
    RAISE EXCEPTION 'approved rubric criterion altered';
  EXCEPTION WHEN SQLSTATE '55000' THEN NULL; END;

  INSERT INTO education.assignments(class_id,lesson_id,rubric_id,assigned_by,opens_at,due_at,status)
    VALUES(class_id,lesson_id,rubric_id,teacher,now(),now()+interval '7 days','published')
    RETURNING id INTO assignment_id;
  BEGIN
    INSERT INTO education.learning_attempts(assignment_id,student_user_id,attempt_no)
      VALUES(assignment_id,outside_student,1);
    RAISE EXCEPTION 'non-enrolled student attempt accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
  INSERT INTO education.learning_attempts(assignment_id,student_user_id,attempt_no)
    VALUES(assignment_id,student,1) RETURNING id INTO attempt_id;
  BEGIN
    UPDATE education.assignments SET rubric_id=NULL WHERE id=assignment_id;
    RAISE EXCEPTION 'rubric detached after attempts';
  EXCEPTION WHEN SQLSTATE '55000' THEN NULL; END;
  BEGIN
    INSERT INTO education.rubric_assessments(attempt_id,rubric_criterion_id,assessor_user_id,assessment_revision,awarded_level)
      VALUES(attempt_id,criterion2_id,teacher,1,2);
    RAISE EXCEPTION 'criterion from wrong assignment rubric accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    INSERT INTO education.rubric_assessments(attempt_id,rubric_criterion_id,assessor_user_id,assessment_revision,awarded_level)
      VALUES(attempt_id,criterion_id,teacher,1,5);
    RAISE EXCEPTION 'out-of-bounds rubric grade accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
  INSERT INTO education.rubric_assessments(attempt_id,rubric_criterion_id,assessor_user_id,assessment_revision,awarded_level,private_feedback)
    VALUES(attempt_id,criterion_id,teacher,1,3,'Tốt') RETURNING id INTO grade_id;
  BEGIN
    UPDATE education.rubric_assessments SET awarded_level=4 WHERE id=grade_id;
    RAISE EXCEPTION 'grade revision changed';
  EXCEPTION WHEN SQLSTATE '55000' THEN NULL; END;
  INSERT INTO education.learning_evidence(attempt_id,evidence_type,schema_version,evidence_sha256,redacted_payload)
    VALUES(attempt_id,'robot',1,repeat('a',64),'{"verified":true}') RETURNING id INTO evidence_id;
  BEGIN
    UPDATE education.learning_evidence SET redacted_payload='{"verified":false}' WHERE id=evidence_id;
    RAISE EXCEPTION 'evidence overwritten';
  EXCEPTION WHEN SQLSTATE '55000' THEN NULL; END;

  -- Verify another student's P0 verified match-result is not reusable as learning evidence.
  INSERT INTO catalog.games(slug,title,kind,created_by)
    VALUES('edu-p1a-gomoku','Gomoku P1A','board',teacher) RETURNING id INTO game_id;
  INSERT INTO catalog.game_versions(game_id,version,engine_api_version,state_schema_version,rules_sha256,asset_manifest_sha256,manifest)
    VALUES(game_id,'1.0.0','1',1,repeat('1',64),repeat('2',64),'{}') RETURNING id INTO version_id;
  INSERT INTO gameplay.game_rooms(game_version_id,created_by,capacity)
    VALUES(version_id,teacher,2) RETURNING id INTO room_id;
  INSERT INTO gameplay.matches(room_id,game_version_id,status)
    VALUES(room_id,version_id,'finalized') RETURNING id INTO match_id;
  INSERT INTO gameplay.match_participants(match_id,user_id,seat)
    VALUES(match_id,student,0);
  INSERT INTO gameplay.match_results(match_id,rules_sha256,result_sha256,result)
    VALUES(match_id,repeat('1',64),repeat('3',64),'{"win":true}') RETURNING id INTO result_id;
  BEGIN
    INSERT INTO education.learning_attempts(assignment_id,student_user_id,attempt_no,match_result_id)
      VALUES(assignment_id,second_student,1,result_id);
    RAISE EXCEPTION 'student reused result of a different player';
  EXCEPTION WHEN check_violation THEN NULL; END;
  INSERT INTO education.learning_attempts(assignment_id,student_user_id,attempt_no,match_result_id)
    VALUES(assignment_id,student,2,result_id);

  IF (SELECT count(*) FROM pg_catalog.pg_tables WHERE schemaname='education') <> 11 THEN
    RAISE EXCEPTION 'P1-A table count must be 11';
  END IF;
END $edu$;

-- Role granted SELECT on protected Education tables must still see zero rows by default.
CREATE ROLE bgu_edu_untrusted NOLOGIN;
GRANT USAGE ON SCHEMA education TO bgu_edu_untrusted;
GRANT SELECT ON education.classes,education.class_enrollments,education.learning_attempts,education.rubric_assessments TO bgu_edu_untrusted;
SET ROLE bgu_edu_untrusted;
DO $deny$
BEGIN
  IF EXISTS(SELECT 1 FROM education.classes)
     OR EXISTS(SELECT 1 FROM education.class_enrollments)
     OR EXISTS(SELECT 1 FROM education.learning_attempts)
     OR EXISTS(SELECT 1 FROM education.rubric_assessments) THEN
    RAISE EXCEPTION 'RLS default-deny violated for Education';
  END IF;
END $deny$;
RESET ROLE;
ROLLBACK;
\echo 'P1-A Education smoke PASSED on disposable database (all fixture changes rolled back).'
