-- BOARD GAME UNIVERSE AI CONTROL PLANE, starter SQL, 2026-10-09
-- Illustrative *standalone* PostgreSQL 15+ slice. NOT a production migration.
-- Final migration MUST link principals/tenants to canonical base tables,
-- implement RLS, encryption, role checks, legal retention, and event outbox.
BEGIN;
CREATE SCHEMA IF NOT EXISTS bgu_ai;

CREATE TABLE IF NOT EXISTS bgu_ai.agent_definitions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_tenant_id uuid,
    code text NOT NULL,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','suspended','retired')),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE NULLS NOT DISTINCT (owner_tenant_id, code)
);
CREATE TABLE IF NOT EXISTS bgu_ai.agent_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id uuid NOT NULL REFERENCES bgu_ai.agent_definitions(id),
    version text NOT NULL,
    configuration jsonb NOT NULL,
    spec_sha256 text NOT NULL CHECK (length(spec_sha256)=64),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (agent_id, version)
);
CREATE TABLE IF NOT EXISTS bgu_ai.mcp_servers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_tenant_id uuid,
    name text NOT NULL,
    endpoint_url text NOT NULL,
    status text NOT NULL DEFAULT 'disabled' CHECK (status IN ('disabled','enabled','quarantined')),
    supported_protocols jsonb NOT NULL DEFAULT '["2026-07-28"]'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (owner_tenant_id, name)
);
CREATE TABLE IF NOT EXISTS bgu_ai.mcp_tools (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id uuid NOT NULL REFERENCES bgu_ai.mcp_servers(id),
    tool_name text NOT NULL,
    tool_version text NOT NULL,
    risk_level smallint NOT NULL CHECK (risk_level BETWEEN 0 AND 4),
    permission_code text NOT NULL,
    input_schema jsonb NOT NULL,
    output_schema jsonb NOT NULL,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','retired')),
    UNIQUE (server_id, tool_name, tool_version)
);
CREATE TABLE IF NOT EXISTS bgu_ai.workflow_definitions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_tenant_id uuid,
    workflow_code text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE NULLS NOT DISTINCT (owner_tenant_id, workflow_code)
);
CREATE TABLE IF NOT EXISTS bgu_ai.workflow_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id uuid NOT NULL REFERENCES bgu_ai.workflow_definitions(id),
    revision integer NOT NULL CHECK (revision > 0),
    graph jsonb NOT NULL,
    graph_sha256 text NOT NULL CHECK (length(graph_sha256)=64),
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','active','retired')),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (workflow_id, revision)
);
CREATE TABLE IF NOT EXISTS bgu_ai.workflow_runs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_version_id uuid NOT NULL REFERENCES bgu_ai.workflow_versions(id),
    tenant_id uuid,
    sponsor_principal_id uuid NOT NULL,
    idempotency_key text NOT NULL,
    run_state text NOT NULL DEFAULT 'queued'
      CHECK (run_state IN ('queued','running','waiting_approval','waiting_external','succeeded','failed','canceled')),
    trace_id text,
    created_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz,
    UNIQUE (workflow_version_id, idempotency_key)
);
CREATE TABLE IF NOT EXISTS bgu_ai.workflow_run_steps (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id uuid NOT NULL REFERENCES bgu_ai.workflow_runs(id) ON DELETE RESTRICT,
    step_key text NOT NULL,
    attempt integer NOT NULL DEFAULT 1 CHECK (attempt >= 1),
    step_state text NOT NULL CHECK (step_state IN ('queued','running','waiting_approval','succeeded','failed','canceled')),
    tool_id uuid REFERENCES bgu_ai.mcp_tools(id),
    input_sha256 text,
    started_at timestamptz,
    completed_at timestamptz,
    UNIQUE (run_id, step_key, attempt)
);
CREATE TABLE IF NOT EXISTS bgu_ai.action_approvals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id uuid REFERENCES bgu_ai.workflow_runs(id),
    action_code text NOT NULL,
    resource_id text NOT NULL,
    proposal_sha256 text NOT NULL CHECK (length(proposal_sha256)=64),
    expected_revision text NOT NULL,
    reviewer_principal_id uuid,
    state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','approved','rejected','expired','revoked')),
    reviewed_at timestamptz,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK ((state='approved' AND reviewer_principal_id IS NOT NULL AND reviewed_at IS NOT NULL) OR state <> 'approved')
);
CREATE TABLE IF NOT EXISTS bgu_ai.tool_invocation_audit (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id uuid NOT NULL REFERENCES bgu_ai.mcp_tools(id),
    actor_principal_id uuid NOT NULL,
    agent_version_id uuid REFERENCES bgu_ai.agent_versions(id),
    tenant_id uuid,
    request_id uuid NOT NULL,
    input_sha256 text NOT NULL,
    status text NOT NULL,
    approval_id uuid REFERENCES bgu_ai.action_approvals(id),
    trace_id text,
    invoked_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tool_id, request_id)
);
CREATE INDEX IF NOT EXISTS workflow_runs_tenant_time_idx
    ON bgu_ai.workflow_runs (tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS workflow_steps_lookup_idx
    ON bgu_ai.workflow_run_steps (run_id, step_key);
CREATE INDEX IF NOT EXISTS approvals_pending_expiry_idx
    ON bgu_ai.action_approvals (expires_at) WHERE state='pending';
CREATE INDEX IF NOT EXISTS tool_calls_tenant_time_idx
    ON bgu_ai.tool_invocation_audit (tenant_id, invoked_at DESC);
COMMIT;
-- IMPORTANT: ID references to tenant/user canonical tables are placeholders;
-- RLS policies intentionally not included here. Never expose this schema as-is.