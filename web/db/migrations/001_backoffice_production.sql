CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  password_hash text NOT NULL,
  display_name text NOT NULL,
  user_title text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_email_normalized CHECK (email = lower(email) AND length(email) BETWEEN 3 AND 320)
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (lower(email));

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role),
  CONSTRAINT user_roles_role_check CHECK (role IN ('ANTENNE', 'BEC'))
);

CREATE TABLE IF NOT EXISTS user_scopes (
  user_id uuid NOT NULL,
  role text NOT NULL,
  country_code text,
  country_name text,
  country_flag text,
  antenna_id text,
  antenna_city text,
  PRIMARY KEY (user_id, role),
  FOREIGN KEY (user_id, role) REFERENCES user_roles(user_id, role) ON DELETE CASCADE,
  CONSTRAINT user_scopes_role_check CHECK (role IN ('ANTENNE', 'BEC')),
  CONSTRAINT user_scopes_antenna_scope_check CHECK (
    (role = 'BEC' AND country_code IS NULL AND country_name IS NULL AND antenna_id IS NULL AND antenna_city IS NULL)
    OR
    (role = 'ANTENNE' AND country_code IS NOT NULL AND country_name IS NOT NULL AND antenna_id IS NOT NULL AND antenna_city IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  user_agent text,
  CONSTRAINT sessions_role_check CHECK (role IN ('ANTENNE', 'BEC')),
  CONSTRAINT sessions_expiry_check CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS sessions_user_active_idx ON sessions (user_id, expires_at) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions (expires_at) WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS dossiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  student_name text NOT NULL,
  student_initials text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  country_code text NOT NULL,
  country_name text NOT NULL,
  country_flag text NOT NULL,
  antenna_city text NOT NULL,
  program text NOT NULL,
  formation text NOT NULL,
  step text NOT NULL,
  state text NOT NULL,
  completeness smallint NOT NULL DEFAULT 0,
  priority text NOT NULL DEFAULT 'NORMALE',
  required_action text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  CONSTRAINT dossiers_step_check CHECK (step IN ('CANDIDATURE', 'ORIENTATION', 'MOBILITE', 'SUIVI', 'DIPLOME')),
  CONSTRAINT dossiers_state_check CHECK (state IN ('RECU', 'EN_VERIFICATION', 'INCOMPLET', 'TRANSMIS_OCO', 'AVIS_RECU', 'A_VALIDER', 'VALIDE', 'EN_MOBILITE', 'EN_SUIVI', 'DIPLOME', 'REJETE')),
  CONSTRAINT dossiers_completeness_check CHECK (completeness BETWEEN 0 AND 100),
  CONSTRAINT dossiers_priority_check CHECK (priority IN ('HAUTE', 'NORMALE', 'BASSE')),
  CONSTRAINT dossiers_version_check CHECK (version > 0)
);

CREATE INDEX IF NOT EXISTS dossiers_scope_updated_idx ON dossiers (country_code, updated_at DESC);
CREATE INDEX IF NOT EXISTS dossiers_state_idx ON dossiers (state, updated_at DESC);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES dossiers(id) ON DELETE CASCADE,
  name text NOT NULL,
  document_type text NOT NULL,
  status text NOT NULL,
  added_at timestamptz,
  verified_by uuid REFERENCES users(id) ON DELETE SET NULL,
  comment text,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT documents_status_check CHECK (status IN ('MANQUANT', 'A_VERIFIER', 'VALIDE', 'REFUSE')),
  CONSTRAINT documents_version_check CHECK (version > 0),
  UNIQUE (dossier_id, name)
);

CREATE INDEX IF NOT EXISTS documents_dossier_status_idx ON documents (dossier_id, status);

CREATE TABLE IF NOT EXISTS document_storage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL UNIQUE REFERENCES documents(id) ON DELETE CASCADE,
  provider text NOT NULL,
  object_key text NOT NULL UNIQUE,
  content_type text NOT NULL,
  byte_size bigint,
  checksum_sha256 text,
  encrypted boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT document_storage_size_check CHECK (byte_size IS NULL OR byte_size >= 0)
);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES dossiers(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN',
  due_at timestamptz NOT NULL,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tasks_status_check CHECK (status IN ('OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED'))
);

CREATE INDEX IF NOT EXISTS tasks_due_open_idx ON tasks (due_at) WHERE status IN ('OPEN', 'IN_PROGRESS');

CREATE TABLE IF NOT EXISTS audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid REFERENCES dossiers(id) ON DELETE RESTRICT,
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  actor_role text,
  action text NOT NULL,
  from_state text,
  to_state text,
  comment text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT audit_events_actor_role_check CHECK (actor_role IS NULL OR actor_role IN ('ANTENNE', 'BEC', 'SYSTEME'))
);

CREATE INDEX IF NOT EXISTS audit_events_dossier_time_idx ON audit_events (dossier_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS audit_events_time_idx ON audit_events (occurred_at DESC);

CREATE OR REPLACE FUNCTION prevent_audit_event_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_events is append-only';
END;
$$;

DO $$
BEGIN
  CREATE TRIGGER audit_events_no_update
    BEFORE UPDATE OR DELETE ON audit_events
    FOR EACH ROW EXECUTE FUNCTION prevent_audit_event_mutation();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  scope_role text NOT NULL,
  country_code text,
  year smallint NOT NULL,
  quarter smallint NOT NULL,
  snapshot jsonb NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reports_role_check CHECK (scope_role IN ('ANTENNE', 'BEC')),
  CONSTRAINT reports_quarter_check CHECK (quarter BETWEEN 1 AND 4),
  CONSTRAINT reports_year_check CHECK (year BETWEEN 2000 AND 2200)
);

CREATE INDEX IF NOT EXISTS reports_scope_time_idx ON reports (scope_user_id, generated_at DESC);

COMMIT;
