-- All fixtures/roles rolled back; CI PostgreSQL 16 only.
\set ON_ERROR_STOP on
BEGIN;
DO $test$
DECLARE
 adult uuid;child uuid;other_child uuid;guardian uuid;link uuid;wrong_link uuid;
 student2 uuid; asset_id uuid; asset_version uuid; approved_asset_id uuid;
 rig uuid; def uuid; version_id uuid; character_id uuid; foreign_version uuid;
BEGIN
 INSERT INTO identity.users(account_type) VALUES ('adult') RETURNING id INTO adult;
 INSERT INTO identity.users(account_type) VALUES ('adult') RETURNING id INTO guardian;
 INSERT INTO identity.users(account_type) VALUES ('student') RETURNING id INTO child;
 INSERT INTO identity.users(account_type) VALUES ('student') RETURNING id INTO other_child;
 BEGIN
  INSERT INTO student.student_profiles(user_id,display_alias) VALUES (adult,'wrong account');
  RAISE EXCEPTION 'adult student profile accepted';
 EXCEPTION WHEN check_violation THEN NULL; END;
 INSERT INTO student.student_profiles(user_id,display_alias) VALUES (child,'Learner One');
 INSERT INTO student.student_profiles(user_id,display_alias) VALUES (other_child,'Learner Two');
 SELECT user_id INTO student2 FROM student.student_profiles WHERE user_id=other_child;
 INSERT INTO student.privacy_settings(student_user_id) VALUES(child);
 IF NOT EXISTS(SELECT 1 FROM student.privacy_settings
   WHERE student_user_id=child AND public_profile_mode='private'
     AND leaderboard_mode='hidden' AND allow_invites=false) THEN
  RAISE EXCEPTION 'privacy not default private';
 END IF;
 BEGIN
  UPDATE student.privacy_settings SET public_profile_mode='public_approved'
   WHERE student_user_id=child;
  RAISE EXCEPTION 'public privacy without guardian accepted';
 EXCEPTION WHEN check_violation THEN NULL; END;
 INSERT INTO identity.guardian_links(guardian_user_id,student_user_id,status,verified_by,verified_at)
  VALUES(guardian,other_child,'verified',adult,now()) RETURNING id INTO wrong_link;
 BEGIN
  UPDATE student.privacy_settings SET guardian_link_id=wrong_link
   WHERE student_user_id=child;
  RAISE EXCEPTION 'guardian link of different child accepted';
 EXCEPTION WHEN check_violation THEN NULL; END;
 INSERT INTO identity.guardian_links(guardian_user_id,student_user_id,status)
  VALUES(guardian,child,'pending') RETURNING id INTO link;
 BEGIN
  UPDATE student.privacy_settings SET guardian_link_id=link
   WHERE student_user_id=child;
  RAISE EXCEPTION 'unverified guardian accepted';
 EXCEPTION WHEN check_violation THEN NULL; END;
 UPDATE identity.guardian_links SET status='verified',verified_by=adult,verified_at=now()
  WHERE id=link;
 UPDATE student.privacy_settings SET guardian_link_id=link,
  character_gallery_mode='organization' WHERE student_user_id=child;

 INSERT INTO commerce.avatar_rigs(rig_code,revision,skeleton_sha256)
  VALUES('base-humanoid',1,repeat('a',64)) RETURNING id INTO rig;
 BEGIN
  INSERT INTO commerce.avatar_rigs(rig_code,revision,skeleton_sha256)
    VALUES('base-humanoid',1,repeat('a',64));
  RAISE EXCEPTION 'duplicate rig revision accepted';
 EXCEPTION WHEN unique_violation THEN NULL; END;
 BEGIN
  UPDATE commerce.avatar_rigs SET rig_code='modified' WHERE id=rig;
  RAISE EXCEPTION 'rig modified';
 EXCEPTION WHEN SQLSTATE '55000' THEN NULL; END;

 INSERT INTO assets.assets(slug,kind,created_by,rights_status)
  VALUES('unlicensed-bot','model3d',adult,'unverified') RETURNING id INTO asset_id;
 INSERT INTO assets.asset_versions(asset_id,version,sha256,storage_key,mime_type,status)
  VALUES(asset_id,1,repeat('b',64),'local/bot-draft.glb','model/gltf-binary','draft')
  RETURNING id INTO asset_version;
 INSERT INTO characters.character_definitions(code,category,status,created_by)
  VALUES('learner-bot','robot','published',adult) RETURNING id INTO def;
 INSERT INTO characters.character_versions(definition_id,revision,rig_id,base_asset_version_id,manifest_sha256)
  VALUES(def,1,rig,asset_version,repeat('c',64)) RETURNING id INTO version_id;
 BEGIN
  UPDATE characters.character_versions SET published_at=now() WHERE id=version_id;
  RAISE EXCEPTION 'unapproved GLB published';
 EXCEPTION WHEN check_violation THEN NULL; END;
 BEGIN
  INSERT INTO characters.character_instances(owner_user_id,character_version_id,nickname)
  VALUES(child,version_id,'Illegal draft');
  RAISE EXCEPTION 'draft character granted';
 EXCEPTION WHEN check_violation THEN NULL; END;
 UPDATE assets.assets SET rights_status='approved' WHERE id=asset_id;
 UPDATE assets.asset_versions SET status='approved' WHERE id=asset_version;
 UPDATE characters.character_versions SET published_at=now() WHERE id=version_id;
 BEGIN
  UPDATE characters.character_versions SET manifest_sha256=repeat('d',64) WHERE id=version_id;
  RAISE EXCEPTION 'published template edited';
 EXCEPTION WHEN SQLSTATE '55000' THEN NULL; END;
 INSERT INTO characters.character_instances(owner_user_id,character_version_id,nickname)
  VALUES(child,version_id,'My robot') RETURNING id INTO character_id;
 INSERT INTO characters.character_instances(owner_user_id,character_version_id,nickname)
  VALUES(child,version_id,'Robot 2');
 BEGIN
  UPDATE characters.character_instances SET owner_user_id=other_child WHERE id=character_id;
  RAISE EXCEPTION 'character reassigned';
 EXCEPTION WHEN SQLSTATE '55000' THEN NULL; END;
 BEGIN
  DELETE FROM characters.character_instances WHERE id=character_id;
  RAISE EXCEPTION 'character deleted instead of revoked';
 EXCEPTION WHEN SQLSTATE '55000' THEN NULL; END;
 UPDATE characters.character_instances SET status='revoked' WHERE id=character_id;
 BEGIN
  UPDATE characters.character_instances SET status='owned' WHERE id=character_id;
  RAISE EXCEPTION 'revoked character reactivated';
 EXCEPTION WHEN SQLSTATE '55000' THEN NULL; END;

 IF (SELECT count(*) FROM pg_catalog.pg_tables
     WHERE schemaname IN ('student','characters')) <> 5 THEN
   RAISE EXCEPTION 'expected five student/character core tables';
 END IF;
END $test$;

-- Granted ordinary readonly role still has no SELECT-visible profile/characters.
CREATE ROLE bgu_student_untrusted NOLOGIN;
GRANT USAGE ON SCHEMA student,characters,commerce TO bgu_student_untrusted;
GRANT SELECT ON student.student_profiles,student.privacy_settings,
  characters.character_instances,characters.character_versions,commerce.avatar_rigs
  TO bgu_student_untrusted;
SET ROLE bgu_student_untrusted;
DO $deny$
BEGIN
 IF EXISTS(SELECT 1 FROM student.student_profiles)
    OR EXISTS(SELECT 1 FROM student.privacy_settings)
    OR EXISTS(SELECT 1 FROM characters.character_instances)
    OR EXISTS(SELECT 1 FROM commerce.avatar_rigs) THEN
   RAISE EXCEPTION 'student identity or character leaked across RLS';
 END IF;
END $deny$;
RESET ROLE;
ROLLBACK;
\echo 'Student + Character Core candidate smoke PASS (rollback complete)'
