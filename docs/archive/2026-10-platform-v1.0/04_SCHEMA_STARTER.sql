-- Board Game Universe - representative PostgreSQL baseline (not full production schema).
-- NOTE: ownership, GRANTs, RLS, encryption, auth integration, retention policies require detailed implementation review.
-- Supports logical core: identity / tenant / game version / match / content revision / scores / outbox.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS tenancy;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS gameplay;
CREATE SCHEMA IF NOT EXISTS publishing;
CREATE SCHEMA IF NOT EXISTS competition;
CREATE SCHEMA IF NOT EXISTS integration;

CREATE TABLE identity.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_subject text UNIQUE,
  account_type text NOT NULL CHECK (account_type IN ('adult','student','service')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','disabled')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE identity.profiles (
  user_id uuid PRIMARY KEY REFERENCES identity.users(id) ON DELETE CASCADE,
  alias text NOT NULL,
  locale text NOT NULL DEFAULT 'vi-VN',
  avatar_asset_id uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE tenancy.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('school','center','club','event_organizer','other')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE tenancy.memberships (
  organization_id uuid NOT NULL REFERENCES tenancy.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('invited','active','suspended')),
  joined_at timestamptz,
  PRIMARY KEY (organization_id, user_id)
);
CREATE TABLE catalog.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('board','card','puzzle','stem','coding','simulation','party')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE catalog.game_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES catalog.games(id),
  version text NOT NULL,
  engine_api_version text NOT NULL,
  state_schema_version integer NOT NULL CHECK (state_schema_version > 0),
  rules_sha256 text NOT NULL CHECK (length(rules_sha256) = 64),
  asset_manifest_key text NOT NULL,
  manifest jsonb NOT NULL,
  published_at timestamptz,
  UNIQUE (game_id, version)
);
CREATE TABLE gameplay.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_version_id uuid NOT NULL REFERENCES catalog.game_versions(id),
  organization_id uuid REFERENCES tenancy.organizations(id),
  visibility text NOT NULL CHECK (visibility IN ('private','classroom','organization','public')),
  status text NOT NULL DEFAULT 'lobby',
  created_by uuid NOT NULL REFERENCES identity.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE gameplay.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES gameplay.rooms(id),
  game_version_id uuid NOT NULL REFERENCES catalog.game_versions(id),
  match_status text NOT NULL DEFAULT 'ready' CHECK (match_status IN ('ready','running','paused','completed','finalized','canceled','void')),
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  config_sha256 text,
  started_at timestamptz,
  finalized_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE gameplay.participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES gameplay.matches(id),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  seat integer NOT NULL CHECK (seat >= 0),
  role text NOT NULL DEFAULT 'player' CHECK (role IN ('player','observer','host')),
  UNIQUE (match_id, seat),
  UNIQUE (match_id, user_id)
);
CREATE TABLE gameplay.match_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES gameplay.matches(id),
  seq bigint NOT NULL CHECK (seq >= 1),
  actor_user_id uuid NOT NULL REFERENCES identity.users(id),
  idempotency_key text NOT NULL,
  command_type text NOT NULL,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (match_id, seq),
  UNIQUE (match_id, actor_user_id, idempotency_key)
);
CREATE INDEX match_commands_recent_idx ON gameplay.match_commands(match_id, seq DESC);
CREATE TABLE gameplay.match_snapshots (
  match_id uuid NOT NULL REFERENCES gameplay.matches(id),
  state_version bigint NOT NULL,
  schema_version integer NOT NULL CHECK (schema_version > 0),
  state_sha256 text NOT NULL,
  state jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (match_id, state_version)
);
CREATE TABLE gameplay.match_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL UNIQUE REFERENCES gameplay.matches(id),
  result_sha256 text NOT NULL,
  rules_sha256 text NOT NULL,
  result jsonb NOT NULL,
  finalized_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE publishing.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_organization_id uuid REFERENCES tenancy.organizations(id),
  slug text NOT NULL,
  content_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX content_global_slug_unique ON publishing.content_items(slug)
  WHERE owner_organization_id IS NULL;
CREATE UNIQUE INDEX content_tenant_slug_unique ON publishing.content_items(owner_organization_id, slug)
  WHERE owner_organization_id IS NOT NULL;
CREATE TABLE publishing.content_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id uuid NOT NULL REFERENCES publishing.content_items(id),
  revision integer NOT NULL CHECK (revision >= 1),
  locale text NOT NULL DEFAULT 'vi-VN',
  schema_version integer NOT NULL DEFAULT 1,
  body jsonb NOT NULL,
  body_sha256 text NOT NULL,
  created_by uuid NOT NULL REFERENCES identity.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (content_item_id, locale, revision)
);
CREATE TABLE publishing.publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id uuid NOT NULL REFERENCES publishing.content_revisions(id),
  channel text NOT NULL,
  target_policy jsonb NOT NULL DEFAULT '{}'::jsonb,
  priority integer NOT NULL DEFAULT 0,
  start_at timestamptz NOT NULL,
  end_at timestamptz,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','active','expired','revoked')),
  CHECK (end_at IS NULL OR end_at > start_at)
);
CREATE INDEX publications_resolve_idx ON publishing.publications(channel, status, start_at, end_at, priority DESC);
CREATE TABLE competition.ranking_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  unit text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('asc','desc'))
);
CREATE TABLE competition.score_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_result_id uuid NOT NULL REFERENCES gameplay.match_results(id),
  metric_id uuid NOT NULL REFERENCES competition.ranking_metrics(id),
  subject_user_id uuid REFERENCES identity.users(id),
  subject_team_id uuid,
  value_numeric numeric(18,5) NOT NULL,
  scoring_policy_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((subject_user_id IS NOT NULL) <> (subject_team_id IS NOT NULL))
);
CREATE TABLE integration.domain_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  event_type text NOT NULL,
  schema_version integer NOT NULL CHECK (schema_version > 0),
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
CREATE INDEX outbox_pending_idx ON integration.domain_outbox(created_at)
  WHERE published_at IS NULL;
COMMIT;

-- Suggested RLS pattern (conceptual, not activated here):
-- Tenant-scoped service queries must derive their tenant from server-authenticated principal;
-- client-supplied X-Tenant-ID alone cannot authorize access. RLS enables default-deny,
-- but owners and BYPASSRLS roles may bypass policies. Test policy paths with least-privilege DB roles.
-- Never give browser code privileged DB connection strings, and never use this DDL as a
-- drop-in final security configuration.