-- Smoke tests for isolated PostgreSQL 16 CI. All fixture data is rolled back.
\set ON_ERROR_STOP on
BEGIN;
DO $test$
DECLARE
  u1 uuid; u2 uuid; u3 uuid; o uuid; role_id uuid; permission_id uuid;
  game_id uuid; v1 uuid; v2 uuid; room_id uuid; match_id uuid; result_id uuid;
  content_id uuid; content_revision_id uuid; asset_id uuid; asset_version_id uuid;
  bad_passed boolean;
BEGIN
  INSERT INTO identity.users(account_type) VALUES('adult') RETURNING id INTO u1;
  INSERT INTO identity.users(account_type) VALUES('adult') RETURNING id INTO u2;
  INSERT INTO identity.users(account_type) VALUES('student') RETURNING id INTO u3;
  INSERT INTO identity.external_identities(user_id,provider,provider_subject) VALUES(u1,'test-oidc','sub-A');
  BEGIN
    INSERT INTO identity.external_identities(user_id,provider,provider_subject) VALUES(u2,'test-oidc','sub-A');
    RAISE EXCEPTION 'duplicate external identity accepted';
  EXCEPTION WHEN unique_violation THEN NULL; END;

  INSERT INTO identity.profiles(user_id,display_name) VALUES(u3,'Người chơi mẫu');
  INSERT INTO identity.policy_acknowledgments(user_id,policy_code,policy_version,source) VALUES(u3,'community','draft-1','organization');
  BEGIN
    INSERT INTO identity.guardian_links(guardian_user_id,student_user_id) VALUES(u3,u3);
    RAISE EXCEPTION 'self-guardian accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
  INSERT INTO identity.guardian_links(guardian_user_id,student_user_id,status) VALUES(u1,u3,'pending');

  INSERT INTO tenancy.organizations(slug,display_name,kind) VALUES('school-test','Trường thử nghiệm','school') RETURNING id INTO o;
  INSERT INTO tenancy.roles(code,description) VALUES('teacher','Teacher') RETURNING id INTO role_id;
  INSERT INTO tenancy.permissions(code,resource_type,description) VALUES('class.read','class','Read classroom') RETURNING id INTO permission_id;
  INSERT INTO tenancy.role_permissions(role_id,permission_id) VALUES(role_id,permission_id);
  BEGIN
    INSERT INTO tenancy.role_assignments(organization_id,user_id,role_id) VALUES(o,u2,role_id);
    RAISE EXCEPTION 'role for nonmember accepted';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;
  INSERT INTO tenancy.organization_memberships(organization_id,user_id,status) VALUES(o,u2,'active');
  INSERT INTO tenancy.role_assignments(organization_id,user_id,role_id,assigned_by) VALUES(o,u2,role_id,u1);

  INSERT INTO assets.assets(slug,kind,created_by) VALUES('sprite-test','model3d',u1) RETURNING id INTO asset_id;
  INSERT INTO assets.asset_versions(asset_id,version,sha256,storage_key,mime_type,status)
    VALUES(asset_id,1,repeat('a',64),'dev/no-real-asset.glb','model/gltf-binary','approved') RETURNING id INTO asset_version_id;
  BEGIN
    UPDATE assets.asset_versions SET storage_key='replaced.glb' WHERE id=asset_version_id;
    RAISE EXCEPTION 'approved asset updated';
  EXCEPTION WHEN SQLSTATE '55000' THEN NULL; END;

  INSERT INTO catalog.games(slug,title,kind,created_by) VALUES('gomoku-p0-test','Cờ caro thử nghiệm','board',u1) RETURNING id INTO game_id;
  INSERT INTO catalog.game_versions(game_id,version,engine_api_version,state_schema_version,rules_sha256,asset_manifest_sha256,manifest,published_at)
    VALUES(game_id,'0.0.1','1',1,repeat('1',64),repeat('2',64),'{}',now()) RETURNING id INTO v1;
  INSERT INTO catalog.game_versions(game_id,version,engine_api_version,state_schema_version,rules_sha256,asset_manifest_sha256,manifest)
    VALUES(game_id,'0.0.2','1',1,repeat('3',64),repeat('4',64),'{}') RETURNING id INTO v2;
  BEGIN
    UPDATE catalog.game_versions SET rules_sha256=repeat('9',64) WHERE id=v1;
    RAISE EXCEPTION 'published rules updated';
  EXCEPTION WHEN SQLSTATE '55000' THEN NULL; END;

  INSERT INTO gameplay.game_rooms(game_version_id,organization_id,created_by,capacity)
    VALUES(v1,o,u1,2) RETURNING id INTO room_id;
  INSERT INTO gameplay.room_memberships(room_id,user_id,seat,status) VALUES(room_id,u1,0,'ready');
  BEGIN
    INSERT INTO gameplay.room_memberships(room_id,user_id,seat,status) VALUES(room_id,u2,0,'joined');
    RAISE EXCEPTION 'duplicate room seat accepted';
  EXCEPTION WHEN unique_violation THEN NULL; END;
  INSERT INTO gameplay.room_memberships(room_id,user_id,seat,status) VALUES(room_id,u2,1,'ready');

  BEGIN
    INSERT INTO gameplay.matches(room_id,game_version_id) VALUES(room_id,v2);
    RAISE EXCEPTION 'mismatched game_version accepted';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;
  INSERT INTO gameplay.matches(room_id,game_version_id,status) VALUES(room_id,v1,'active') RETURNING id INTO match_id;
  INSERT INTO gameplay.match_participants(match_id,user_id,seat) VALUES(match_id,u1,0);
  INSERT INTO gameplay.match_participants(match_id,user_id,seat) VALUES(match_id,u2,1);
  BEGIN
    INSERT INTO gameplay.match_participants(match_id,user_id,seat) VALUES(match_id,u3,1);
    RAISE EXCEPTION 'duplicate match seat accepted';
  EXCEPTION WHEN unique_violation THEN NULL; END;

  INSERT INTO gameplay.match_commands(match_id,actor_user_id,seq,idempotency_key,command_type,payload)
    VALUES(match_id,u1,1,'req-1','place','{"x":1,"y":1}');
  BEGIN
    INSERT INTO gameplay.match_commands(match_id,actor_user_id,seq,idempotency_key,command_type,payload)
      VALUES(match_id,u1,2,'req-1','place','{"x":2,"y":2}');
    RAISE EXCEPTION 'duplicate command accepted';
  EXCEPTION WHEN unique_violation THEN NULL; END;
  BEGIN
    INSERT INTO gameplay.match_commands(match_id,actor_user_id,seq,idempotency_key,command_type,payload)
      VALUES(match_id,u3,2,'req-2','place','{}');
    RAISE EXCEPTION 'nonparticipant command accepted';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;

  INSERT INTO gameplay.match_snapshots(match_id,state_revision,schema_version,state_sha256,state)
    VALUES(match_id,1,1,repeat('a',64),'{"turn":1}');
  INSERT INTO gameplay.match_results(match_id,rules_sha256,result_sha256,result)
    VALUES(match_id,repeat('1',64),repeat('c',64),'{"winner":0}') RETURNING id INTO result_id;
  BEGIN
    INSERT INTO gameplay.match_results(match_id,rules_sha256,result_sha256,result)
      VALUES(match_id,repeat('1',64),repeat('c',64),'{}');
    RAISE EXCEPTION 'second final result accepted';
  EXCEPTION WHEN unique_violation THEN NULL; END;
  INSERT INTO gameplay.match_result_entries(result_id,match_id,user_id,placement,score_numeric,winner)
    VALUES(result_id,match_id,u1,1,1,true);
  BEGIN
    INSERT INTO gameplay.match_result_entries(result_id,match_id,user_id) VALUES(result_id,match_id,u3);
    RAISE EXCEPTION 'nonparticipant result accepted';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;
  BEGIN
    UPDATE gameplay.match_results SET result='{}' WHERE id=result_id;
    RAISE EXCEPTION 'result changed';
  EXCEPTION WHEN SQLSTATE '55000' THEN NULL; END;

  INSERT INTO publishing.content_items(created_by,slug,content_type) VALUES(u1,'homepage','landing') RETURNING id INTO content_id;
  INSERT INTO publishing.content_revisions(content_item_id,revision,body,body_sha256,created_by)
    VALUES(content_id,1,'{"title":"Demo"}',repeat('5',64),u1) RETURNING id INTO content_revision_id;
  BEGIN
    INSERT INTO publishing.content_publications(revision_id,approved_by,channel,starts_at,ends_at)
      VALUES(content_revision_id,u2,'homepage',now(),now()-interval '1 hour');
    RAISE EXCEPTION 'inverted publication dates accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;

  INSERT INTO integration.domain_outbox(aggregate_type,aggregate_id,event_type,schema_version,dedupe_key,payload)
    VALUES('match',match_id,'match.finalized.v1',1,'match-finalized-test','{}');
  BEGIN
    INSERT INTO integration.domain_outbox(aggregate_type,aggregate_id,event_type,schema_version,dedupe_key,payload)
      VALUES('match',match_id,'match.finalized.v1',1,'match-finalized-test','{}');
    RAISE EXCEPTION 'duplicate outbox dedupe accepted';
  EXCEPTION WHEN unique_violation THEN NULL; END;
  BEGIN
    INSERT INTO integration.agent_approvals(requested_by,approved_by,tool_code,target_resource,revision_sha256,scope_hash,expires_at)
      VALUES(u1,u1,'cms.publish','content',repeat('f',64),repeat('a',64),now()+interval '1 hour');
    RAISE EXCEPTION 'self-approved agent tool accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
  INSERT INTO integration.agent_approvals(requested_by,approved_by,tool_code,target_resource,revision_sha256,scope_hash,expires_at)
    VALUES(u1,u2,'cms.publish','content',repeat('f',64),repeat('a',64),now()+interval '1 hour');
  INSERT INTO integration.audit_events(actor_type,actor_user_id,action_code,resource_type,correlation_id)
    VALUES('human',u1,'test.create','fixture',gen_random_uuid());

  IF (SELECT count(*) FROM pg_catalog.pg_tables WHERE schemaname IN ('identity','tenancy','assets','catalog','gameplay','publishing','integration')) <> 30 THEN
    RAISE EXCEPTION 'Expected exactly 30 P0 tables';
  END IF;
END $test$;

-- After GRANT SELECT, an untrusted application role still has zero visibility,
-- because every table is FORCE RLS and no read policy has been defined yet.
CREATE ROLE bgu_untrusted_probe NOLOGIN;
GRANT USAGE ON SCHEMA identity TO bgu_untrusted_probe;
GRANT SELECT ON identity.users TO bgu_untrusted_probe;
SET ROLE bgu_untrusted_probe;
DO $probe$
BEGIN
  IF (SELECT count(*) FROM identity.users) <> 0 THEN
    RAISE EXCEPTION 'Default-deny RLS violated: untrusted role sees users';
  END IF;
END $probe$;
RESET ROLE;
ROLLBACK;
\echo 'P0 database smoke passed: keys, FK, double-use, immutability, and default-deny RLS.'
