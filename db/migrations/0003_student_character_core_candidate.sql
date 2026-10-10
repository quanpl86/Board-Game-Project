-- Board Game Universe / P1-D Student + Character Core (candidate for isolated DEV/CI only)
-- Requires 0001_p0_foundation.sql; P1-A Education is not required.
-- NOT FOR STAGING OR PRODUCTION; SSO, guardian authorization and RLS allow-policies are absent.
BEGIN;
CREATE SCHEMA student;
CREATE SCHEMA characters;
CREATE SCHEMA IF NOT EXISTS commerce;

-- This is the ONE proposed commerce.avatar_rigs foundation table from P1, not a second rig catalog.
-- Future P1-C migrations must reuse this table instead of CREATE TABLE again.
CREATE TABLE commerce.avatar_rigs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rig_code text NOT NULL CHECK(length(btrim(rig_code)) BETWEEN 2 AND 64),
  revision integer NOT NULL CHECK(revision > 0),
  skeleton_sha256 text NOT NULL CHECK(skeleton_sha256 ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (rig_code,revision)
);

CREATE TABLE student.student_profiles (
  user_id uuid PRIMARY KEY REFERENCES identity.users(id) ON DELETE RESTRICT,
  display_alias text NOT NULL CHECK(length(btrim(display_alias)) BETWEEN 3 AND 40),
  learning_stage text CHECK(learning_stage IS NULL OR learning_stage IN ('primary','middle','secondary','other')),
  onboarding_status text NOT NULL DEFAULT 'pending'
    CHECK(onboarding_status IN ('pending','guardian_review','active','restricted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE student.privacy_settings (
  student_user_id uuid PRIMARY KEY REFERENCES student.student_profiles(user_id) ON DELETE RESTRICT,
  public_profile_mode text NOT NULL DEFAULT 'private'
    CHECK(public_profile_mode IN ('private','organization','public_approved')),
  leaderboard_mode text NOT NULL DEFAULT 'hidden'
    CHECK(leaderboard_mode IN ('hidden','organization','public_approved')),
  character_gallery_mode text NOT NULL DEFAULT 'private'
    CHECK(character_gallery_mode IN ('private','organization','public_approved')),
  allow_invites boolean NOT NULL DEFAULT false,
  guardian_link_id uuid REFERENCES identity.guardian_links(id) ON DELETE RESTRICT,
  revised_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE characters.character_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE CHECK(code ~ '^[a-z][a-z0-9_-]{1,63}$'),
  category text NOT NULL CHECK(category IN ('base','mascot','robot','other')),
  status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','review','published','archived')),
  created_by uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE characters.character_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  definition_id uuid NOT NULL REFERENCES characters.character_definitions(id) ON DELETE RESTRICT,
  revision integer NOT NULL CHECK(revision > 0),
  rig_id uuid NOT NULL REFERENCES commerce.avatar_rigs(id) ON DELETE RESTRICT,
  base_asset_version_id uuid NOT NULL REFERENCES assets.asset_versions(id) ON DELETE RESTRICT,
  manifest_sha256 text NOT NULL CHECK(manifest_sha256 ~ '^[a-f0-9]{64}$'),
  published_at timestamptz,
  UNIQUE(definition_id,revision)
);
CREATE INDEX character_versions_definition_idx ON characters.character_versions(definition_id,revision DESC);

CREATE TABLE characters.character_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES student.student_profiles(user_id) ON DELETE RESTRICT,
  character_version_id uuid NOT NULL REFERENCES characters.character_versions(id) ON DELETE RESTRICT,
  nickname text NOT NULL CHECK(length(btrim(nickname)) BETWEEN 1 AND 48),
  status text NOT NULL DEFAULT 'owned' CHECK(status IN ('owned','revoked','archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX character_instances_owner_idx ON characters.character_instances(owner_user_id,status,created_at DESC);

-- The underlying accounts are authoritative: do not accept an adult account as a student.
CREATE FUNCTION student.guard_student_account() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM identity.users u
      WHERE u.id=NEW.user_id AND u.account_type='student' AND u.status IN ('active','limited')) THEN
    RAISE EXCEPTION 'student profile requires active student account' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER student_profile_account BEFORE INSERT OR UPDATE OF user_id
  ON student.student_profiles FOR EACH ROW EXECUTE FUNCTION student.guard_student_account();

-- These settings do not grant authorization. Real guardian link must be verified on every read.
CREATE FUNCTION student.guard_privacy_selection() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.guardian_link_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM identity.guardian_links g
    WHERE g.id=NEW.guardian_link_id AND g.student_user_id=NEW.student_user_id AND g.status='verified'
  ) THEN
    RAISE EXCEPTION 'guardian does not verify this learner' USING ERRCODE='23514';
  END IF;
  IF (NEW.public_profile_mode <> 'private' OR NEW.leaderboard_mode <> 'hidden'
    OR NEW.character_gallery_mode <> 'private' OR NEW.allow_invites)
    AND NEW.guardian_link_id IS NULL THEN
    RAISE EXCEPTION 'guardian verification required for visibility change' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER student_privacy_guard BEFORE INSERT OR UPDATE ON student.privacy_settings
  FOR EACH ROW EXECUTE FUNCTION student.guard_privacy_selection();

-- Published character templates/rigs are immutable in this candidate;
-- asset revocation later still requires checked read-models and entitlement review.
CREATE TRIGGER avatar_rig_append_only BEFORE UPDATE OR DELETE ON commerce.avatar_rigs
  FOR EACH ROW EXECUTE FUNCTION integration.prevent_append_mutation();

CREATE FUNCTION characters.guard_published_character_version() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
    IF OLD.published_at IS NOT NULL THEN
      RAISE EXCEPTION 'published character version is immutable' USING ERRCODE='55000';
    END IF;
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  END IF;
  IF NEW.published_at IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM assets.asset_versions av
    JOIN assets.assets a ON a.id=av.asset_id
    JOIN characters.character_definitions d ON d.id=NEW.definition_id
    WHERE av.id=NEW.base_asset_version_id AND av.status='approved'
      AND a.rights_status='approved' AND a.kind='model3d'
      AND d.status='published'
  ) THEN
    RAISE EXCEPTION 'character template requires approved 3D asset and published definition'
      USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER character_version_publish BEFORE INSERT OR UPDATE OR DELETE
  ON characters.character_versions FOR EACH ROW EXECUTE FUNCTION characters.guard_published_character_version();

CREATE FUNCTION characters.guard_character_instance() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP='UPDATE' THEN
    IF NEW.owner_user_id IS DISTINCT FROM OLD.owner_user_id OR
       NEW.character_version_id IS DISTINCT FROM OLD.character_version_id THEN
      RAISE EXCEPTION 'character owner/version immutable' USING ERRCODE='55000';
    END IF;
    IF OLD.status IN ('revoked','archived') AND NEW.status='owned' THEN
      RAISE EXCEPTION 'revoked/archived character may not reactivate' USING ERRCODE='55000';
    END IF;
  END IF;
  IF NOT EXISTS(
    SELECT 1 FROM student.student_profiles sp
    JOIN identity.users u ON u.id=sp.user_id
    WHERE sp.user_id=NEW.owner_user_id AND u.account_type='student'
       AND u.status IN ('active','limited')
  ) THEN
    RAISE EXCEPTION 'character owner must be a valid student' USING ERRCODE='23514';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM characters.character_versions v
      WHERE v.id=NEW.character_version_id AND v.published_at IS NOT NULL) THEN
    RAISE EXCEPTION 'character instance requires published template' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER character_instance_guard BEFORE INSERT OR UPDATE
  ON characters.character_instances FOR EACH ROW EXECUTE FUNCTION characters.guard_character_instance();
CREATE TRIGGER character_instance_no_delete BEFORE DELETE
  ON characters.character_instances FOR EACH ROW EXECUTE FUNCTION integration.prevent_append_mutation();

-- DENY BY DEFAULT: no user-facing application credentials, policies, roles, or GRANTs.
ALTER TABLE commerce.avatar_rigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce.avatar_rigs FORCE ROW LEVEL SECURITY;
ALTER TABLE student.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student.student_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE student.privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE student.privacy_settings FORCE ROW LEVEL SECURITY;
ALTER TABLE characters.character_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters.character_definitions FORCE ROW LEVEL SECURITY;
ALTER TABLE characters.character_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters.character_versions FORCE ROW LEVEL SECURITY;
ALTER TABLE characters.character_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters.character_instances FORCE ROW LEVEL SECURITY;
COMMIT;
