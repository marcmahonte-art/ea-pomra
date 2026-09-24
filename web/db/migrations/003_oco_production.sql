BEGIN;

ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check CHECK (role IN ('ANTENNE', 'BEC', 'EXPERT_OCO'));

ALTER TABLE user_scopes DROP CONSTRAINT IF EXISTS user_scopes_role_check;
ALTER TABLE user_scopes DROP CONSTRAINT IF EXISTS user_scopes_antenna_scope_check;
UPDATE user_scopes SET country_flag = NULL WHERE role = 'BEC' AND country_flag IS NOT NULL;
ALTER TABLE user_scopes ADD CONSTRAINT user_scopes_role_check CHECK (role IN ('ANTENNE', 'BEC', 'EXPERT_OCO'));
ALTER TABLE user_scopes ADD CONSTRAINT user_scopes_antenna_scope_check CHECK (
  (role = 'BEC' AND country_code IS NULL AND country_name IS NULL AND country_flag IS NULL AND antenna_id IS NULL AND antenna_city IS NULL)
  OR
  (role = 'EXPERT_OCO' AND country_code IS NULL AND country_name IS NULL AND country_flag IS NULL AND antenna_id IS NULL AND antenna_city IS NULL)
  OR
  (role = 'ANTENNE' AND country_code IS NOT NULL AND country_name IS NOT NULL AND antenna_id IS NOT NULL AND antenna_city IS NOT NULL)
);

ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_role_check;
ALTER TABLE sessions ADD CONSTRAINT sessions_role_check CHECK (role IN ('ANTENNE', 'BEC', 'EXPERT_OCO'));

ALTER TABLE audit_events DROP CONSTRAINT IF EXISTS audit_events_actor_role_check;
ALTER TABLE audit_events ADD CONSTRAINT audit_events_actor_role_check CHECK (actor_role IS NULL OR actor_role IN ('ANTENNE', 'BEC', 'EXPERT_OCO', 'SYSTEME'));
ALTER TABLE audit_events DROP CONSTRAINT IF EXISTS audit_events_resource_type_check;
ALTER TABLE audit_events ADD CONSTRAINT audit_events_resource_type_check CHECK (resource_type IS NULL OR resource_type IN ('DOSSIER', 'DOCUMENT', 'REPORT', 'SESSION', 'SYSTEM', 'OCO_REVIEW', 'OCO_ASSIGNMENT'));

CREATE TABLE IF NOT EXISTS oco_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES dossiers(id) ON DELETE CASCADE,
  expert_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT oco_assignments_active_check CHECK (active = true OR active = false)
);

CREATE UNIQUE INDEX IF NOT EXISTS oco_assignments_active_dossier_unique
  ON oco_assignments (dossier_id) WHERE active;
CREATE INDEX IF NOT EXISTS oco_assignments_expert_active_idx
  ON oco_assignments (expert_user_id, assigned_at DESC) WHERE active;
CREATE INDEX IF NOT EXISTS oco_assignments_dossier_idx
  ON oco_assignments (dossier_id, active);

CREATE OR REPLACE FUNCTION validate_oco_expert_user() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = NEW.expert_user_id AND role = 'EXPERT_OCO') THEN
    RAISE EXCEPTION 'assigned user is not an expert OCO';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS oco_assignments_expert_role ON oco_assignments;
CREATE TRIGGER oco_assignments_expert_role
  BEFORE INSERT OR UPDATE OF expert_user_id ON oco_assignments
  FOR EACH ROW EXECUTE FUNCTION validate_oco_expert_user();

CREATE TABLE IF NOT EXISTS oco_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES dossiers(id) ON DELETE CASCADE,
  expert_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  verdict text,
  orientation text,
  analysis text NOT NULL DEFAULT '',
  observations text NOT NULL DEFAULT '',
  reserves text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'DRAFT',
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  finalized_at timestamptz,
  CONSTRAINT oco_reviews_verdict_check CHECK (verdict IS NULL OR verdict IN ('FAVORABLE', 'SOUS_RESERVE', 'DEFAVORABLE')),
  CONSTRAINT oco_reviews_status_check CHECK (status IN ('DRAFT', 'FINALIZED')),
  CONSTRAINT oco_reviews_version_check CHECK (version > 0),
  CONSTRAINT oco_reviews_length_check CHECK (
    length(analysis) <= 10000 AND length(observations) <= 10000 AND length(reserves) <= 10000
    AND (orientation IS NULL OR length(orientation) BETWEEN 1 AND 200)
  )
);

ALTER TABLE oco_reviews DROP CONSTRAINT IF EXISTS oco_reviews_dossier_id_key;
ALTER TABLE oco_reviews DROP CONSTRAINT IF EXISTS oco_reviews_finalized_check;
ALTER TABLE oco_reviews ADD CONSTRAINT oco_reviews_finalized_check CHECK (
  (status = 'DRAFT' AND finalized_at IS NULL)
  OR
  (status = 'FINALIZED' AND finalized_at IS NOT NULL
    AND verdict IS NOT NULL
    AND length(trim(analysis)) >= 10
    AND length(trim(observations)) >= 10
    AND ((verdict IN ('FAVORABLE', 'SOUS_RESERVE') AND orientation IS NOT NULL AND length(trim(orientation)) > 0)
      OR verdict = 'DEFAVORABLE')
    AND ((verdict IN ('SOUS_RESERVE', 'DEFAVORABLE') AND reserves IS NOT NULL AND length(trim(reserves)) > 0)
      OR verdict = 'FAVORABLE'))
);

CREATE INDEX IF NOT EXISTS oco_reviews_dossier_expert_updated_idx
  ON oco_reviews (dossier_id, expert_user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS oco_reviews_expert_status_idx
  ON oco_reviews (expert_user_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS oco_reviews_status_idx
  ON oco_reviews (status, updated_at DESC);

DROP TRIGGER IF EXISTS oco_reviews_expert_role ON oco_reviews;
CREATE TRIGGER oco_reviews_expert_role
  BEFORE INSERT OR UPDATE OF expert_user_id ON oco_reviews
  FOR EACH ROW EXECUTE FUNCTION validate_oco_expert_user();

CREATE OR REPLACE FUNCTION prevent_finalized_oco_review_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status = 'FINALIZED' OR OLD.finalized_at IS NOT NULL THEN
    RAISE EXCEPTION 'finalized oco review is immutable';
  END IF
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS oco_reviews_no_finalized_mutation ON oco_reviews;
CREATE TRIGGER oco_reviews_no_finalized_mutation
  BEFORE UPDATE OR DELETE ON oco_reviews
  FOR EACH ROW EXECUTE FUNCTION prevent_finalized_oco_review_mutation();

CREATE OR REPLACE FUNCTION prevent_oco_assignment_assignment_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.expert_user_id <> OLD.expert_user_id THEN
    RAISE EXCEPTION 'oco assignment expert is immutable';
  END IF;
  IF OLD.active = false THEN
    RAISE EXCEPTION 'released oco assignment is immutable';
  END IF;
  IF OLD.active = true AND NEW.active = false AND EXISTS (
    SELECT 1 FROM oco_reviews
    WHERE dossier_id = OLD.dossier_id
      AND (status = 'FINALIZED' OR finalized_at IS NOT NULL)
  ) THEN
    RAISE EXCEPTION 'cannot release oco assignment after finalized review';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS oco_assignments_no_reassignment_mutation ON oco_assignments;
CREATE TRIGGER oco_assignments_no_reassignment_mutation
  BEFORE UPDATE ON oco_assignments
  FOR EACH ROW EXECUTE FUNCTION prevent_oco_assignment_assignment_mutation();

COMMIT;
