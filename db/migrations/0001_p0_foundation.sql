-- Board Game Universe · P0 FOUNDATION DEVELOPMENT MIGRATION

-- STATUS: REVIEW CANDIDATE, NOT PRODUCTION APPROVED. NO HOST SSO OR AUTH SCOPES WIRED.

-- Source: db/schema/p0_tables.json + docs/database/ERD_*.md; do not apply to KingDragonHub production.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS identity;

CREATE SCHEMA IF NOT EXISTS tenancy;

CREATE SCHEMA IF NOT EXISTS assets;

CREATE SCHEMA IF NOT EXISTS catalog;

CREATE SCHEMA IF NOT EXISTS gameplay;

CREATE SCHEMA IF NOT EXISTS publishing;

CREATE SCHEMA IF NOT EXISTS integration;

-- identity.users: Danh tính toàn cục của người dùng; không đồng nhất với external SSO subject.
CREATE TABLE identity.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_type text NOT NULL CHECK (account_type IN ('adult','student','service')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','limited','suspended','deactivated')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- identity.external_identities: Ánh xạ tài khoản bên KingDragonHub/OIDC sang user UUID nội bộ; không lưu password/token.
CREATE TABLE identity.external_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  provider text NOT NULL,
  provider_subject text NOT NULL,
  linked_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  UNIQUE (provider,provider_subject),
  UNIQUE (user_id,provider,provider_subject)
);

-- identity.profiles: Thông tin hiển thị với quyền riêng tư tách biệt danh tính đăng nhập.
CREATE TABLE identity.profiles (
  user_id uuid PRIMARY KEY REFERENCES identity.users(id) ON DELETE RESTRICT,
  display_name text NOT NULL CHECK (length(btrim(display_name)) BETWEEN 1 AND 80),
  locale text NOT NULL DEFAULT 'vi-VN',
  visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','organization','public_approved')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- identity.guardian_links: Quan hệ người giám hộ–học sinh; xác minh trước khi có quyền xem dữ liệu.
CREATE TABLE identity.guardian_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  student_user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','revoked')),
  verified_by uuid REFERENCES identity.users(id) ON DELETE RESTRICT,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (guardian_user_id <> student_user_id),
  UNIQUE (guardian_user_id,student_user_id)
);

-- identity.policy_acknowledgments: Bản ghi phiên bản chính sách đã xác nhận; không thay thế quy trình đồng ý hợp pháp.
CREATE TABLE identity.policy_acknowledgments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  policy_code text NOT NULL,
  policy_version text NOT NULL,
  acknowledged_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL CHECK (source IN ('web','guardian','organization','admin')),
  UNIQUE (user_id,policy_code,policy_version)
);

-- tenancy.organizations: Trường, CLB hoặc đơn vị vận hành; tách khỏi người dùng toàn cục.
CREATE TABLE tenancy.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('school','center','club','organizer','other')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- tenancy.organization_memberships: Thành viên trong tổ chức, có trạng thái riêng và FK toàn vẹn.
CREATE TABLE tenancy.organization_memberships (
  organization_id uuid NOT NULL REFERENCES tenancy.organizations(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','active','suspended','left')),
  joined_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id,user_id)
);

-- tenancy.roles: Vai trò nghiệp vụ theo code; không dùng một role global trong users.
CREATE TABLE tenancy.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- tenancy.permissions: Quyền chi tiết áp dụng bởi service, không mặc định do UI quyết định.
CREATE TABLE tenancy.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  resource_type text NOT NULL,
  description text NOT NULL
);

-- tenancy.role_permissions: Quan hệ N–N giữa vai trò và quyền.
CREATE TABLE tenancy.role_permissions (
  role_id uuid NOT NULL REFERENCES tenancy.roles(id) ON DELETE RESTRICT,
  permission_id uuid NOT NULL REFERENCES tenancy.permissions(id) ON DELETE RESTRICT,
  PRIMARY KEY (role_id,permission_id)
);

-- tenancy.role_assignments: Phân vai trò theo membership trong tổ chức, không tự cấp quyền qua SSO claim.
CREATE TABLE tenancy.role_assignments (
  organization_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role_id uuid NOT NULL REFERENCES tenancy.roles(id) ON DELETE RESTRICT,
  assigned_by uuid REFERENCES identity.users(id) ON DELETE RESTRICT,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id,user_id,role_id),
  FOREIGN KEY (organization_id,user_id) REFERENCES tenancy.organization_memberships(organization_id,user_id) ON DELETE RESTRICT
);

-- assets.assets: Danh mục asset source; không đại diện vật phẩm đã sở hữu.
CREATE TABLE assets.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_organization_id uuid REFERENCES tenancy.organizations(id) ON DELETE RESTRICT,
  created_by uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('model3d','texture','image','video','audio','other')),
  rights_status text NOT NULL DEFAULT 'unverified' CHECK (rights_status IN ('unverified','approved','restricted','revoked')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- assets.asset_versions: Version/hash bất biến của GLB/ảnh/video; asset đã approve không cập nhật trong chỗ.
CREATE TABLE assets.asset_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES assets.assets(id) ON DELETE RESTRICT,
  version integer NOT NULL CHECK (version > 0),
  sha256 text NOT NULL CHECK (sha256 ~ '^[a-f0-9]{64}$'),
  storage_key text NOT NULL,
  mime_type text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','approved','revoked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (asset_id,version)
);

-- catalog.games: Game Registry; danh mục game độc lập room, kết quả, phần thưởng.
CREATE TABLE catalog.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('board','card','puzzle','stem','coding','simulation','party')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_by uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- catalog.game_versions: Phiên bản luật và manifest được pin vào phòng/trận; published không sửa.
CREATE TABLE catalog.game_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES catalog.games(id) ON DELETE RESTRICT,
  version text NOT NULL,
  engine_api_version text NOT NULL,
  state_schema_version integer NOT NULL CHECK (state_schema_version > 0),
  rules_sha256 text NOT NULL CHECK (rules_sha256 ~ '^[a-f0-9]{64}$'),
  asset_manifest_sha256 text NOT NULL CHECK (asset_manifest_sha256 ~ '^[a-f0-9]{64}$'),
  manifest jsonb NOT NULL,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (game_id,version)
);

-- gameplay.game_rooms: Phòng chờ trước trận; một room có thể có nhiều trận rematch.
CREATE TABLE gameplay.game_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_version_id uuid NOT NULL REFERENCES catalog.game_versions(id) ON DELETE RESTRICT,
  organization_id uuid REFERENCES tenancy.organizations(id) ON DELETE RESTRICT,
  created_by uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','organization','classroom','public')),
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('draft','waiting','ready','in_match','closed','canceled','expired')),
  capacity integer NOT NULL CHECK (capacity BETWEEN 1 AND 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id,game_version_id)
);

-- gameplay.room_memberships: Thành viên và ghế của phòng; chỉ ghế active được unique.
CREATE TABLE gameplay.room_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES gameplay.game_rooms(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  seat integer CHECK (seat >= 0),
  status text NOT NULL DEFAULT 'joined' CHECK (status IN ('joined','ready','left','kicked')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (room_id,user_id)
);

-- gameplay.matches: Trận cụ thể pin game_version từ room; kết quả server xác minh.
CREATE TABLE gameplay.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL,
  game_version_id uuid NOT NULL REFERENCES catalog.game_versions(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created','active','paused','pending_review','finalized','aborted')),
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz,
  finalized_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (room_id,game_version_id) REFERENCES gameplay.game_rooms(id,game_version_id) ON DELETE RESTRICT
);

-- gameplay.match_participants: Người chơi/quan sát có định danh; ghế unique khi khác null.
CREATE TABLE gameplay.match_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES gameplay.matches(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  seat integer CHECK (seat >= 0),
  role text NOT NULL DEFAULT 'player' CHECK (role IN ('player','host','observer')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  CHECK (role = 'observer' OR seat IS NOT NULL),
  UNIQUE (match_id,user_id)
);

-- gameplay.match_commands: Lệnh đã được Game Server kiểm tra; append-only, idempotent.
CREATE TABLE gameplay.match_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES gameplay.matches(id) ON DELETE RESTRICT,
  actor_user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  seq bigint NOT NULL CHECK (seq > 0),
  idempotency_key text NOT NULL,
  command_type text NOT NULL,
  payload jsonb NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (match_id,seq),
  UNIQUE (match_id,actor_user_id,idempotency_key),
  FOREIGN KEY (match_id,actor_user_id) REFERENCES gameplay.match_participants(match_id,user_id) ON DELETE RESTRICT
);

-- gameplay.match_snapshots: Snapshot phiên bản state và hash để replay sau khi reconnect.
CREATE TABLE gameplay.match_snapshots (
  match_id uuid NOT NULL REFERENCES gameplay.matches(id) ON DELETE RESTRICT,
  state_revision bigint NOT NULL CHECK (state_revision >= 0),
  schema_version integer NOT NULL CHECK (schema_version > 0),
  state_sha256 text NOT NULL CHECK (state_sha256 ~ '^[a-f0-9]{64}$'),
  state jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (match_id,state_revision)
);

-- gameplay.match_results: Kết quả một lần cho một trận; sửa sai bằng dòng bù/version tương lai.
CREATE TABLE gameplay.match_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL UNIQUE REFERENCES gameplay.matches(id) ON DELETE RESTRICT,
  rules_sha256 text NOT NULL CHECK (rules_sha256 ~ '^[a-f0-9]{64}$'),
  result_sha256 text NOT NULL CHECK (result_sha256 ~ '^[a-f0-9]{64}$'),
  result jsonb NOT NULL,
  finalized_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id,match_id)
);

-- gameplay.match_result_entries: Điểm/địa vị trong kết quả, không phải bảng xếp hạng hay ví Coin.
CREATE TABLE gameplay.match_result_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id uuid NOT NULL,
  match_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  placement integer CHECK (placement > 0),
  score_numeric numeric(18,5),
  winner boolean NOT NULL DEFAULT false,
  FOREIGN KEY (result_id,match_id) REFERENCES gameplay.match_results(id,match_id) ON DELETE RESTRICT,
  FOREIGN KEY (match_id,user_id) REFERENCES gameplay.match_participants(match_id,user_id) ON DELETE RESTRICT,
  UNIQUE (result_id,user_id)
);

-- publishing.content_items: Trang/bài/khối nội dung; không trộn event/season/campaign.
CREATE TABLE publishing.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_organization_id uuid REFERENCES tenancy.organizations(id) ON DELETE RESTRICT,
  created_by uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  slug text NOT NULL,
  content_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- publishing.content_revisions: Nội dung theo revision, hash và người tạo, không ghi đè bản cũ.
CREATE TABLE publishing.content_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id uuid NOT NULL REFERENCES publishing.content_items(id) ON DELETE RESTRICT,
  revision integer NOT NULL CHECK (revision > 0),
  locale text NOT NULL DEFAULT 'vi-VN',
  schema_version integer NOT NULL DEFAULT 1 CHECK (schema_version > 0),
  body jsonb NOT NULL,
  body_sha256 text NOT NULL CHECK (body_sha256 ~ '^[a-f0-9]{64}$'),
  created_by uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (content_item_id,locale,revision)
);

-- publishing.content_publications: Con trỏ phát hành và cửa sổ thời gian; phải được phê duyệt đúng revision.
CREATE TABLE publishing.content_publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_id uuid NOT NULL REFERENCES publishing.content_revisions(id) ON DELETE RESTRICT,
  approved_by uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  channel text NOT NULL,
  target_policy jsonb NOT NULL DEFAULT '{}'::jsonb,
  priority integer NOT NULL DEFAULT 0,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','active','expired','revoked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR ends_at > starts_at)
);

-- integration.domain_outbox: Thông điệp nghiệp vụ sau commit; consumer retry idempotent.
CREATE TABLE integration.domain_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  event_type text NOT NULL,
  schema_version integer NOT NULL CHECK (schema_version > 0),
  dedupe_key text UNIQUE,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

-- integration.audit_events: Lịch sử tác động append-only và redacted; không đưa token hoặc dữ liệu trẻ em vào payload.
CREATE TABLE integration.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_type text NOT NULL CHECK (actor_type IN ('human','agent','service')),
  actor_user_id uuid REFERENCES identity.users(id) ON DELETE RESTRICT,
  organization_id uuid REFERENCES tenancy.organizations(id) ON DELETE RESTRICT,
  action_code text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  correlation_id uuid NOT NULL,
  redacted_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

-- integration.agent_approvals: Human approval gắn với hash và phạm vi chính xác, có hạn dùng.
CREATE TABLE integration.agent_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  approved_by uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  organization_id uuid REFERENCES tenancy.organizations(id) ON DELETE RESTRICT,
  tool_code text NOT NULL,
  target_resource text NOT NULL,
  revision_sha256 text NOT NULL CHECK (revision_sha256 ~ '^[a-f0-9]{64}$'),
  scope_hash text NOT NULL CHECK (scope_hash ~ '^[a-f0-9]{64}$'),
  status text NOT NULL DEFAULT 'approved' CHECK (status IN ('approved','consumed','revoked','expired')),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (approved_by <> requested_by),
  CHECK ((status = 'consumed') = (consumed_at IS NOT NULL))
);

-- integration.agent_invocations: Một lần gọi typed tool và kết quả auditable; không cấp tool qua table này.
CREATE TABLE integration.agent_invocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initiated_by uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  approval_id uuid REFERENCES integration.agent_approvals(id) ON DELETE RESTRICT,
  organization_id uuid REFERENCES tenancy.organizations(id) ON DELETE RESTRICT,
  tool_code text NOT NULL,
  idempotency_key text NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','succeeded','failed','canceled')),
  started_at timestamptz,
  finished_at timestamptz,
  redacted_result jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (initiated_by,tool_code,idempotency_key)
);

CREATE INDEX external_identities_user_idx ON identity.external_identities(user_id);

CREATE INDEX memberships_by_user_idx ON tenancy.organization_memberships(user_id,status);

CREATE INDEX role_assignments_lookup_idx ON tenancy.role_assignments(user_id,organization_id);

CREATE INDEX asset_versions_asset_status_idx ON assets.asset_versions(asset_id,status);

CREATE INDEX room_status_idx ON gameplay.game_rooms(game_version_id,status,created_at DESC);

CREATE UNIQUE INDEX room_live_seat_unique ON gameplay.room_memberships(room_id,seat) WHERE seat IS NOT NULL AND status IN ('joined','ready');

CREATE INDEX matches_by_room_idx ON gameplay.matches(room_id,created_at DESC);

CREATE UNIQUE INDEX match_live_seat_unique ON gameplay.match_participants(match_id,seat) WHERE seat IS NOT NULL;

CREATE INDEX match_commands_recent_idx ON gameplay.match_commands(match_id,seq DESC);

CREATE UNIQUE INDEX content_global_slug_unique ON publishing.content_items(slug) WHERE owner_organization_id IS NULL;

CREATE UNIQUE INDEX content_org_slug_unique ON publishing.content_items(owner_organization_id,slug) WHERE owner_organization_id IS NOT NULL;

CREATE INDEX content_publication_lookup_idx ON publishing.content_publications(channel,status,starts_at,ends_at,priority DESC);

CREATE INDEX outbox_pending_idx ON integration.domain_outbox(created_at) WHERE published_at IS NULL;

CREATE INDEX audit_time_idx ON integration.audit_events(occurred_at DESC);

CREATE INDEX agent_approvals_lookup_idx ON integration.agent_approvals(tool_code,status,expires_at);

CREATE INDEX agent_invocations_status_idx ON integration.agent_invocations(status,created_at);

CREATE OR REPLACE FUNCTION integration.prevent_append_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% is append-only', TG_TABLE_NAME USING ERRCODE='55000';
END $$;

CREATE TRIGGER immutable_match_commands BEFORE UPDATE OR DELETE ON gameplay.match_commands FOR EACH ROW EXECUTE FUNCTION integration.prevent_append_mutation();

CREATE TRIGGER immutable_match_snapshots BEFORE UPDATE OR DELETE ON gameplay.match_snapshots FOR EACH ROW EXECUTE FUNCTION integration.prevent_append_mutation();

CREATE TRIGGER immutable_match_results BEFORE UPDATE OR DELETE ON gameplay.match_results FOR EACH ROW EXECUTE FUNCTION integration.prevent_append_mutation();

CREATE TRIGGER immutable_match_result_entries BEFORE UPDATE OR DELETE ON gameplay.match_result_entries FOR EACH ROW EXECUTE FUNCTION integration.prevent_append_mutation();

CREATE TRIGGER immutable_content_revisions BEFORE UPDATE OR DELETE ON publishing.content_revisions FOR EACH ROW EXECUTE FUNCTION integration.prevent_append_mutation();

CREATE TRIGGER immutable_audit_events BEFORE UPDATE OR DELETE ON integration.audit_events FOR EACH ROW EXECUTE FUNCTION integration.prevent_append_mutation();

CREATE OR REPLACE FUNCTION integration.protect_published_game_version() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.published_at IS NOT NULL THEN
    RAISE EXCEPTION 'published game version is immutable' USING ERRCODE='55000';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER protect_published_game BEFORE UPDATE OR DELETE ON catalog.game_versions
FOR EACH ROW EXECUTE FUNCTION integration.protect_published_game_version();

CREATE OR REPLACE FUNCTION integration.protect_approved_asset_version() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status IN ('approved','revoked') THEN
    RAISE EXCEPTION 'approved or revoked asset version is immutable' USING ERRCODE='55000';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER protect_approved_asset BEFORE UPDATE OR DELETE ON assets.asset_versions
FOR EACH ROW EXECUTE FUNCTION integration.protect_approved_asset_version();

-- RLS DENY ALL: no runtime policies are installed until KingDragonHub SSO/service identity is audited.

-- CREATE/GRANT of application DB roles is NOT performed here; no app connection should use migration owner.

ALTER TABLE identity.users ENABLE ROW LEVEL SECURITY;

ALTER TABLE identity.users FORCE ROW LEVEL SECURITY;

ALTER TABLE identity.external_identities ENABLE ROW LEVEL SECURITY;

ALTER TABLE identity.external_identities FORCE ROW LEVEL SECURITY;

ALTER TABLE identity.profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE identity.profiles FORCE ROW LEVEL SECURITY;

ALTER TABLE identity.guardian_links ENABLE ROW LEVEL SECURITY;

ALTER TABLE identity.guardian_links FORCE ROW LEVEL SECURITY;

ALTER TABLE identity.policy_acknowledgments ENABLE ROW LEVEL SECURITY;

ALTER TABLE identity.policy_acknowledgments FORCE ROW LEVEL SECURITY;

ALTER TABLE tenancy.organizations ENABLE ROW LEVEL SECURITY;

ALTER TABLE tenancy.organizations FORCE ROW LEVEL SECURITY;

ALTER TABLE tenancy.organization_memberships ENABLE ROW LEVEL SECURITY;

ALTER TABLE tenancy.organization_memberships FORCE ROW LEVEL SECURITY;

ALTER TABLE tenancy.roles ENABLE ROW LEVEL SECURITY;

ALTER TABLE tenancy.roles FORCE ROW LEVEL SECURITY;

ALTER TABLE tenancy.permissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE tenancy.permissions FORCE ROW LEVEL SECURITY;

ALTER TABLE tenancy.role_permissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE tenancy.role_permissions FORCE ROW LEVEL SECURITY;

ALTER TABLE tenancy.role_assignments ENABLE ROW LEVEL SECURITY;

ALTER TABLE tenancy.role_assignments FORCE ROW LEVEL SECURITY;

ALTER TABLE assets.assets ENABLE ROW LEVEL SECURITY;

ALTER TABLE assets.assets FORCE ROW LEVEL SECURITY;

ALTER TABLE assets.asset_versions ENABLE ROW LEVEL SECURITY;

ALTER TABLE assets.asset_versions FORCE ROW LEVEL SECURITY;

ALTER TABLE catalog.games ENABLE ROW LEVEL SECURITY;

ALTER TABLE catalog.games FORCE ROW LEVEL SECURITY;

ALTER TABLE catalog.game_versions ENABLE ROW LEVEL SECURITY;

ALTER TABLE catalog.game_versions FORCE ROW LEVEL SECURITY;

ALTER TABLE gameplay.game_rooms ENABLE ROW LEVEL SECURITY;

ALTER TABLE gameplay.game_rooms FORCE ROW LEVEL SECURITY;

ALTER TABLE gameplay.room_memberships ENABLE ROW LEVEL SECURITY;

ALTER TABLE gameplay.room_memberships FORCE ROW LEVEL SECURITY;

ALTER TABLE gameplay.matches ENABLE ROW LEVEL SECURITY;

ALTER TABLE gameplay.matches FORCE ROW LEVEL SECURITY;

ALTER TABLE gameplay.match_participants ENABLE ROW LEVEL SECURITY;

ALTER TABLE gameplay.match_participants FORCE ROW LEVEL SECURITY;

ALTER TABLE gameplay.match_commands ENABLE ROW LEVEL SECURITY;

ALTER TABLE gameplay.match_commands FORCE ROW LEVEL SECURITY;

ALTER TABLE gameplay.match_snapshots ENABLE ROW LEVEL SECURITY;

ALTER TABLE gameplay.match_snapshots FORCE ROW LEVEL SECURITY;

ALTER TABLE gameplay.match_results ENABLE ROW LEVEL SECURITY;

ALTER TABLE gameplay.match_results FORCE ROW LEVEL SECURITY;

ALTER TABLE gameplay.match_result_entries ENABLE ROW LEVEL SECURITY;

ALTER TABLE gameplay.match_result_entries FORCE ROW LEVEL SECURITY;

ALTER TABLE publishing.content_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE publishing.content_items FORCE ROW LEVEL SECURITY;

ALTER TABLE publishing.content_revisions ENABLE ROW LEVEL SECURITY;

ALTER TABLE publishing.content_revisions FORCE ROW LEVEL SECURITY;

ALTER TABLE publishing.content_publications ENABLE ROW LEVEL SECURITY;

ALTER TABLE publishing.content_publications FORCE ROW LEVEL SECURITY;

ALTER TABLE integration.domain_outbox ENABLE ROW LEVEL SECURITY;

ALTER TABLE integration.domain_outbox FORCE ROW LEVEL SECURITY;

ALTER TABLE integration.audit_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE integration.audit_events FORCE ROW LEVEL SECURITY;

ALTER TABLE integration.agent_approvals ENABLE ROW LEVEL SECURITY;

ALTER TABLE integration.agent_approvals FORCE ROW LEVEL SECURITY;

ALTER TABLE integration.agent_invocations ENABLE ROW LEVEL SECURITY;

ALTER TABLE integration.agent_invocations FORCE ROW LEVEL SECURITY;

COMMIT;
