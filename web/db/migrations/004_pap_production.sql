BEGIN;

ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check CHECK (role IN ('ANTENNE', 'BEC', 'EXPERT_OCO', 'RESPONSABLE_PAP'));

ALTER TABLE user_scopes DROP CONSTRAINT IF EXISTS user_scopes_role_check;
ALTER TABLE user_scopes DROP CONSTRAINT IF EXISTS user_scopes_antenna_scope_check;
ALTER TABLE user_scopes ADD CONSTRAINT user_scopes_role_check CHECK (role IN ('ANTENNE', 'BEC', 'EXPERT_OCO', 'RESPONSABLE_PAP'));
ALTER TABLE user_scopes ADD CONSTRAINT user_scopes_antenna_scope_check CHECK (
  (role = 'BEC' AND country_code IS NULL AND country_name IS NULL AND country_flag IS NULL AND antenna_id IS NULL AND antenna_city IS NULL)
  OR
  (role = 'EXPERT_OCO' AND country_code IS NULL AND country_name IS NULL AND country_flag IS NULL AND antenna_id IS NULL AND antenna_city IS NULL)
  OR
  (role = 'RESPONSABLE_PAP' AND country_code IS NULL AND country_name IS NULL AND country_flag IS NULL AND antenna_id IS NULL AND antenna_city IS NULL)
  OR
  (role = 'ANTENNE' AND country_code IS NOT NULL AND country_name IS NOT NULL AND antenna_id IS NOT NULL AND antenna_city IS NOT NULL)
);

ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_role_check;
ALTER TABLE sessions ADD CONSTRAINT sessions_role_check CHECK (role IN ('ANTENNE', 'BEC', 'EXPERT_OCO', 'RESPONSABLE_PAP'));

ALTER TABLE audit_events DROP CONSTRAINT IF EXISTS audit_events_actor_role_check;
ALTER TABLE audit_events ADD CONSTRAINT audit_events_actor_role_check CHECK (actor_role IS NULL OR actor_role IN ('ANTENNE', 'BEC', 'EXPERT_OCO', 'RESPONSABLE_PAP', 'SYSTEME'));
ALTER TABLE audit_events DROP CONSTRAINT IF EXISTS audit_events_resource_type_check;
ALTER TABLE audit_events ADD CONSTRAINT audit_events_resource_type_check CHECK (resource_type IS NULL OR resource_type IN ('DOSSIER', 'DOCUMENT', 'REPORT', 'SESSION', 'SYSTEM', 'OCO_REVIEW', 'OCO_ASSIGNMENT', 'PAP_CASE', 'PAP_ALERT', 'PAP_INTERVENTION', 'PAP_ASSIGNMENT'));

CREATE TABLE IF NOT EXISTS pap_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES dossiers(id) ON DELETE CASCADE,
  responsable_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  reason text NOT NULL,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  unassign_reason text,
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT pap_assignments_reason_check CHECK (length(btrim(reason)) BETWEEN 3 AND 2000),
  CONSTRAINT pap_assignments_unassign_reason_check CHECK (unassign_reason IS NULL OR length(btrim(unassign_reason)) BETWEEN 3 AND 2000),
  CONSTRAINT pap_assignments_active_check CHECK (active = true OR active = false)
);

CREATE UNIQUE INDEX IF NOT EXISTS pap_assignments_active_dossier_unique ON pap_assignments (dossier_id) WHERE active;
CREATE INDEX IF NOT EXISTS pap_assignments_responsable_active_idx ON pap_assignments (responsable_user_id, assigned_at DESC) WHERE active;
CREATE INDEX IF NOT EXISTS pap_assignments_dossier_idx ON pap_assignments (dossier_id, active);

CREATE OR REPLACE FUNCTION validate_pap_responsable_user() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM users u
    JOIN user_roles ur ON ur.user_id = u.id
    WHERE u.id = NEW.responsable_user_id AND u.active = true AND ur.role = 'RESPONSABLE_PAP'
  ) THEN
    RAISE EXCEPTION 'assigned user is not an active responsable PAP';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pap_assignments_responsable_role ON pap_assignments;
CREATE TRIGGER pap_assignments_responsable_role
  BEFORE INSERT OR UPDATE OF responsable_user_id ON pap_assignments
  FOR EACH ROW EXECUTE FUNCTION validate_pap_responsable_user();

CREATE OR REPLACE FUNCTION prevent_pap_assignment_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.active = false THEN
    RAISE EXCEPTION 'released pap assignment is immutable';
  END IF;
  IF NEW.responsable_user_id <> OLD.responsable_user_id OR NEW.dossier_id <> OLD.dossier_id THEN
    RAISE EXCEPTION 'pap assignment resource is immutable';
  END IF;
  IF OLD.active = true AND NEW.active = false AND EXISTS (
    SELECT 1 FROM pap_cases
    WHERE dossier_id = OLD.dossier_id AND responsable_user_id = OLD.responsable_user_id AND status <> 'CLOSED'
  ) THEN
    RAISE EXCEPTION 'cannot release pap assignment with an open case';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pap_assignments_no_mutation ON pap_assignments;
CREATE TRIGGER pap_assignments_no_mutation
  BEFORE UPDATE ON pap_assignments
  FOR EACH ROW EXECUTE FUNCTION prevent_pap_assignment_mutation();

CREATE TABLE IF NOT EXISTS pap_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES dossiers(id) ON DELETE CASCADE,
  responsable_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'OPEN',
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pap_cases_status_check CHECK (status IN ('OPEN', 'IN_PROGRESS', 'CLOSED')),
  CONSTRAINT pap_cases_version_check CHECK (version > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS pap_cases_dossier_responsable_unique ON pap_cases (dossier_id, responsable_user_id);
CREATE INDEX IF NOT EXISTS pap_cases_responsable_status_idx ON pap_cases (responsable_user_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS pap_cases_status_idx ON pap_cases (status, updated_at DESC);

CREATE TABLE IF NOT EXISTS pap_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES pap_cases(id) ON DELETE CASCADE,
  dossier_id uuid NOT NULL REFERENCES dossiers(id) ON DELETE CASCADE,
  responsable_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  level text NOT NULL,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN',
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pap_alerts_level_check CHECK (level IN ('INFO', 'ATTENTION', 'URGENT')),
  CONSTRAINT pap_alerts_status_check CHECK (status IN ('OPEN', 'ACKNOWLEDGED', 'CLOSED')),
  CONSTRAINT pap_alerts_subject_check CHECK (length(btrim(subject)) BETWEEN 3 AND 200),
  CONSTRAINT pap_alerts_version_check CHECK (version > 0)
);

CREATE INDEX IF NOT EXISTS pap_alerts_responsable_status_idx ON pap_alerts (responsable_user_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS pap_alerts_case_idx ON pap_alerts (case_id, created_at DESC);
CREATE INDEX IF NOT EXISTS pap_alerts_dossier_idx ON pap_alerts (dossier_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS pap_interventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES pap_cases(id) ON DELETE CASCADE,
  dossier_id uuid NOT NULL REFERENCES dossiers(id) ON DELETE CASCADE,
  responsable_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  intervention_date date NOT NULL,
  intervention_type text NOT NULL,
  objective text NOT NULL,
  observation text NOT NULL,
  next_action text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'PLANNED',
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pap_interventions_type_check CHECK (length(btrim(intervention_type)) BETWEEN 2 AND 100),
  CONSTRAINT pap_interventions_objective_check CHECK (length(btrim(objective)) BETWEEN 3 AND 2000),
  CONSTRAINT pap_interventions_observation_check CHECK (length(btrim(observation)) BETWEEN 3 AND 4000),
  CONSTRAINT pap_interventions_next_action_check CHECK (length(next_action) <= 2000),
  CONSTRAINT pap_interventions_status_check CHECK (status IN ('PLANNED', 'DONE', 'CANCELLED')),
  CONSTRAINT pap_interventions_version_check CHECK (version > 0)
);

CREATE INDEX IF NOT EXISTS pap_interventions_responsable_date_idx ON pap_interventions (responsable_user_id, intervention_date DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS pap_interventions_case_idx ON pap_interventions (case_id, intervention_date DESC);
CREATE INDEX IF NOT EXISTS pap_interventions_dossier_idx ON pap_interventions (dossier_id, updated_at DESC);

CREATE OR REPLACE FUNCTION validate_pap_case_assignment() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pap_assignments
    WHERE dossier_id = NEW.dossier_id AND responsable_user_id = NEW.responsable_user_id AND active
  ) THEN
    RAISE EXCEPTION 'pap case requires an active assignment';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pap_cases_assignment ON pap_cases;
CREATE TRIGGER pap_cases_assignment
  BEFORE INSERT OR UPDATE OF dossier_id, responsable_user_id ON pap_cases
  FOR EACH ROW EXECUTE FUNCTION validate_pap_case_assignment();

CREATE OR REPLACE FUNCTION validate_pap_case_child() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pap_cases c
    WHERE c.id = NEW.case_id AND c.dossier_id = NEW.dossier_id AND c.responsable_user_id = NEW.responsable_user_id
  ) THEN
    RAISE EXCEPTION 'pap child does not match assigned case';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pap_alerts_case_match ON pap_alerts;
CREATE TRIGGER pap_alerts_case_match
  BEFORE INSERT OR UPDATE OF case_id, dossier_id, responsable_user_id ON pap_alerts
  FOR EACH ROW EXECUTE FUNCTION validate_pap_case_child();

DROP TRIGGER IF EXISTS pap_interventions_case_match ON pap_interventions;
CREATE TRIGGER pap_interventions_case_match
  BEFORE INSERT OR UPDATE OF case_id, dossier_id, responsable_user_id ON pap_interventions
  FOR EACH ROW EXECUTE FUNCTION validate_pap_case_child();

COMMIT;
