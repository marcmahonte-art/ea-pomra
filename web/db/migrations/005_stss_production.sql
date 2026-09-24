BEGIN;

ALTER TABLE audit_events
  DROP CONSTRAINT IF EXISTS audit_events_resource_type_check;
ALTER TABLE audit_events
  ADD CONSTRAINT audit_events_resource_type_check CHECK (
    resource_type IS NULL OR resource_type IN (
      'DOSSIER', 'DOCUMENT', 'REPORT', 'SESSION', 'SYSTEM',
      'OCO_REVIEW', 'OCO_ASSIGNMENT', 'PAP_CASE', 'PAP_ALERT',
      'PAP_INTERVENTION', 'PAP_ASSIGNMENT', 'STSS_TRANSFER',
      'STSS_PAYMENT_ATTEMPT', 'STSS_PROVIDER_EVENT', 'STSS_KYC_CHECK',
      'STSS_PROOF', 'STSS_COMMISSION_POLICY'
    )
  );

CREATE TABLE IF NOT EXISTS stss_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid REFERENCES dossiers(id) ON DELETE RESTRICT,
  reference text NOT NULL UNIQUE,
  idempotency_key text NOT NULL UNIQUE,
  source_antenna_id text NOT NULL,
  source_antenna_name text NOT NULL,
  source_country_code text NOT NULL,
  destination_antenna_id text NOT NULL,
  destination_antenna_name text NOT NULL,
  destination_country_code text NOT NULL,
  gross_amount_minor bigint NOT NULL,
  net_amount_minor bigint NOT NULL,
  commission_amount_minor bigint NOT NULL,
  commission_rate_bps integer NOT NULL,
  currency text NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT',
  is_simulation boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT stss_transfers_antenna_check CHECK (source_antenna_id <> destination_antenna_id),
  CONSTRAINT stss_transfers_amounts_check CHECK (
    gross_amount_minor > 0 AND net_amount_minor >= 0
    AND commission_amount_minor >= 0
    AND gross_amount_minor = net_amount_minor + commission_amount_minor
  ),
  CONSTRAINT stss_transfers_commission_bps_check CHECK (commission_rate_bps BETWEEN 0 AND 300),
  CONSTRAINT stss_transfers_currency_check CHECK (currency IN ('FCFA', 'XAF', 'USD', 'EUR', 'CAD')),
  CONSTRAINT stss_transfers_country_code_check CHECK (
    (source_country_code IN ('SN', 'CI', 'CM', 'GA', 'BJ', 'TG', 'CG', 'CD'))
    AND (destination_country_code IN ('SN', 'CI', 'CM', 'GA', 'BJ', 'TG', 'CG', 'CD'))
  ),
  CONSTRAINT stss_transfers_status_check CHECK (
    status IN ('DRAFT', 'PENDING_KYC', 'PENDING_PAYMENT', 'PAYMENT_CONFIRMED',
      'TRANSFER_PENDING', 'TRANSFER_CONFIRMED', 'FAILED', 'CANCELLED', 'SIMULATION')
  ),
  CONSTRAINT stss_transfers_version_check CHECK (version > 0),
  CONSTRAINT stss_transfers_completed_check CHECK (
    (status IN ('TRANSFER_CONFIRMED', 'FAILED', 'CANCELLED', 'SIMULATION') AND completed_at IS NOT NULL)
    OR (status NOT IN ('TRANSFER_CONFIRMED', 'FAILED', 'CANCELLED', 'SIMULATION') AND completed_at IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS stss_transfers_source_status_idx
  ON stss_transfers (source_antenna_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS stss_transfers_destination_status_idx
  ON stss_transfers (destination_antenna_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS stss_transfers_dossier_updated_idx
  ON stss_transfers (dossier_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS stss_transfers_status_updated_idx
  ON stss_transfers (status, updated_at DESC);
CREATE INDEX IF NOT EXISTS stss_transfers_commission_policy_idx
  ON stss_transfers (source_country_code, destination_country_code, currency, updated_at DESC);

CREATE OR REPLACE FUNCTION prevent_terminal_stss_transfer_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status IN ('TRANSFER_CONFIRMED', 'FAILED', 'CANCELLED', 'SIMULATION') THEN
    RAISE EXCEPTION 'terminal STSS transfer is immutable';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stss_transfers_no_terminal_mutation ON stss_transfers;
CREATE TRIGGER stss_transfers_no_terminal_mutation
  BEFORE UPDATE OR DELETE ON stss_transfers
  FOR EACH ROW EXECUTE FUNCTION prevent_terminal_stss_transfer_mutation();

CREATE OR REPLACE FUNCTION validate_stss_transfer_invariants() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  expected_commission bigint;
  terminal_status boolean;
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status <> 'DRAFT' THEN
    RAISE EXCEPTION 'STSS transfer must be inserted as DRAFT';
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'STSS transfer creation timestamp is immutable';
  END IF;
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_at := clock_timestamp();
  END IF;
  IF NEW.commission_rate_bps < 0 OR NEW.commission_rate_bps > 300 THEN
    RAISE EXCEPTION 'STSS commission rate must be between 0 and 300 bps';
  END IF;
  expected_commission :=
    (NEW.gross_amount_minor / 10000) * NEW.commission_rate_bps
    + (((NEW.gross_amount_minor % 10000) * NEW.commission_rate_bps + 5000) / 10000);
  IF NEW.commission_amount_minor <> expected_commission THEN
    RAISE EXCEPTION 'STSS commission amount does not match its exact rounded rate';
  END IF;
  IF NEW.gross_amount_minor <> NEW.net_amount_minor + NEW.commission_amount_minor THEN
    RAISE EXCEPTION 'STSS gross amount must equal net amount plus commission';
  END IF;
  IF (NEW.status = 'SIMULATION') IS DISTINCT FROM NEW.is_simulation THEN
    RAISE EXCEPTION 'STSS SIMULATION status and is_simulation must match';
  END IF;
  IF NEW.updated_at < NEW.created_at THEN
    RAISE EXCEPTION 'STSS update timestamp cannot precede creation timestamp';
  END IF;
  terminal_status := NEW.status IN ('TRANSFER_CONFIRMED', 'FAILED', 'CANCELLED', 'SIMULATION');
  IF terminal_status THEN
    NEW.completed_at := COALESCE(NEW.completed_at, NEW.updated_at);
    IF NEW.completed_at < NEW.created_at THEN
      RAISE EXCEPTION 'STSS completion timestamp cannot precede creation timestamp';
    END IF;
    IF NEW.completed_at > NEW.updated_at THEN
      RAISE EXCEPTION 'STSS completion timestamp cannot follow update timestamp';
    END IF;
  ELSIF NEW.completed_at IS NOT NULL THEN
    RAISE EXCEPTION 'STSS non-terminal transfer cannot have a completion timestamp';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION validate_stss_transfer_transition() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status AND NOT (
    (OLD.status = 'DRAFT' AND NEW.status IN ('PENDING_KYC', 'CANCELLED', 'SIMULATION'))
    OR (OLD.status = 'PENDING_KYC' AND NEW.status IN ('PENDING_PAYMENT', 'FAILED', 'CANCELLED', 'SIMULATION'))
    OR (OLD.status = 'PENDING_PAYMENT' AND NEW.status IN ('PAYMENT_CONFIRMED', 'FAILED', 'CANCELLED', 'SIMULATION'))
    OR (OLD.status = 'PAYMENT_CONFIRMED' AND NEW.status IN ('TRANSFER_PENDING', 'FAILED', 'CANCELLED', 'SIMULATION'))
    OR (OLD.status = 'TRANSFER_PENDING' AND NEW.status IN ('TRANSFER_CONFIRMED', 'FAILED', 'CANCELLED', 'SIMULATION'))
  ) THEN
    RAISE EXCEPTION 'invalid STSS transfer transition: % -> %', OLD.status, NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stss_transfers_a_validate_invariants ON stss_transfers;
CREATE TRIGGER stss_transfers_a_validate_invariants
  BEFORE INSERT OR UPDATE ON stss_transfers
  FOR EACH ROW EXECUTE FUNCTION validate_stss_transfer_invariants();
DROP TRIGGER IF EXISTS stss_transfers_b_validate_transition ON stss_transfers;
CREATE TRIGGER stss_transfers_b_validate_transition
  BEFORE INSERT OR UPDATE ON stss_transfers
  FOR EACH ROW EXECUTE FUNCTION validate_stss_transfer_transition();

ALTER TABLE stss_transfers
  DROP CONSTRAINT IF EXISTS stss_transfers_simulation_check;
ALTER TABLE stss_transfers
  ADD CONSTRAINT stss_transfers_simulation_check CHECK (
    (status = 'SIMULATION') = is_simulation
  );

CREATE TABLE IF NOT EXISTS stss_payment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id uuid NOT NULL REFERENCES stss_transfers(id) ON DELETE RESTRICT,
  provider text NOT NULL,
  provider_reference text,
  idempotency_key text NOT NULL UNIQUE,
  status text NOT NULL,
  amount_minor bigint NOT NULL,
  currency text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT stss_payment_attempts_amount_check CHECK (amount_minor > 0),
  CONSTRAINT stss_payment_attempts_currency_check CHECK (currency IN ('FCFA', 'XAF', 'USD', 'EUR', 'CAD')),
  CONSTRAINT stss_payment_attempts_status_check CHECK (status IN ('CREATED', 'PENDING', 'SUCCEEDED', 'FAILED', 'CANCELLED')),
  CONSTRAINT stss_payment_attempts_version_check CHECK (version > 0)
);

CREATE OR REPLACE FUNCTION validate_stss_payment_attempt_currency() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  transfer_currency text;
BEGIN
  SELECT currency INTO transfer_currency
  FROM stss_transfers
  WHERE id = NEW.transfer_id;
  IF transfer_currency IS NULL OR NEW.currency <> transfer_currency THEN
    RAISE EXCEPTION 'STSS payment attempt currency must match its transfer currency';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stss_payment_attempts_validate_currency ON stss_payment_attempts;
CREATE TRIGGER stss_payment_attempts_validate_currency
  BEFORE INSERT OR UPDATE OF transfer_id, currency ON stss_payment_attempts
  FOR EACH ROW EXECUTE FUNCTION validate_stss_payment_attempt_currency();

CREATE OR REPLACE FUNCTION prevent_stss_transfer_currency_change_with_attempts() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.currency IS DISTINCT FROM OLD.currency AND EXISTS (
    SELECT 1
    FROM stss_payment_attempts
    WHERE transfer_id = OLD.id
  ) THEN
    RAISE EXCEPTION 'STSS transfer currency cannot change after a payment attempt exists';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stss_transfers_prevent_payment_currency_change ON stss_transfers;
CREATE TRIGGER stss_transfers_prevent_payment_currency_change
  BEFORE UPDATE OF currency ON stss_transfers
  FOR EACH ROW EXECUTE FUNCTION prevent_stss_transfer_currency_change_with_attempts();

CREATE INDEX IF NOT EXISTS stss_payment_attempts_transfer_created_idx
  ON stss_payment_attempts (transfer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS stss_payment_attempts_status_idx
  ON stss_payment_attempts (status, updated_at DESC);

CREATE TABLE IF NOT EXISTS stss_provider_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id uuid REFERENCES stss_transfers(id) ON DELETE SET NULL,
  provider text NOT NULL,
  provider_event_id text NOT NULL,
  event_type text NOT NULL,
  provider_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  received_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT stss_provider_events_provider_event_unique UNIQUE (provider, provider_event_id)
);

CREATE INDEX IF NOT EXISTS stss_provider_events_transfer_received_idx
  ON stss_provider_events (transfer_id, received_at DESC);
CREATE INDEX IF NOT EXISTS stss_provider_events_received_idx
  ON stss_provider_events (received_at DESC);

CREATE TABLE IF NOT EXISTS stss_kyc_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id uuid NOT NULL REFERENCES stss_transfers(id) ON DELETE RESTRICT,
  status text NOT NULL,
  decision text,
  checked_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  CONSTRAINT stss_kyc_checks_status_check CHECK (status IN ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED')),
  CONSTRAINT stss_kyc_checks_decision_check CHECK (decision IS NULL OR decision IN ('APPROVED', 'REJECTED')),
  CONSTRAINT stss_kyc_checks_decision_status_check CHECK (
    (status IN ('PENDING', 'IN_REVIEW') AND decision IS NULL)
    OR (status = 'APPROVED' AND decision = 'APPROVED')
    OR (status = 'REJECTED' AND decision = 'REJECTED')
  ),
  CONSTRAINT stss_kyc_checks_version_check CHECK (version > 0)
);

ALTER TABLE stss_kyc_checks
  DROP CONSTRAINT IF EXISTS stss_kyc_checks_decision_status_check;
ALTER TABLE stss_kyc_checks
  ADD CONSTRAINT stss_kyc_checks_decision_status_check CHECK (
    (status IN ('PENDING', 'IN_REVIEW') AND decision IS NULL)
    OR (status = 'APPROVED' AND decision = 'APPROVED')
    OR (status = 'REJECTED' AND decision = 'REJECTED')
  );

CREATE INDEX IF NOT EXISTS stss_kyc_checks_transfer_status_idx
  ON stss_kyc_checks (transfer_id, status, checked_at DESC);

CREATE TABLE IF NOT EXISTS stss_proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id uuid NOT NULL REFERENCES stss_transfers(id) ON DELETE RESTRICT,
  proof_type text NOT NULL,
  object_key text NOT NULL UNIQUE,
  checksum_sha256 text,
  created_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  CONSTRAINT stss_proofs_type_check CHECK (proof_type IN ('PAYMENT', 'TRANSFER', 'KYC', 'OTHER')),
  CONSTRAINT stss_proofs_checksum_check CHECK (checksum_sha256 IS NULL OR checksum_sha256 ~ '^[0-9a-f]{64}$'),
  CONSTRAINT stss_proofs_version_check CHECK (version > 0)
);

CREATE INDEX IF NOT EXISTS stss_proofs_transfer_created_idx
  ON stss_proofs (transfer_id, created_at DESC);

CREATE TABLE IF NOT EXISTS stss_commission_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_country_code text NOT NULL,
  destination_country_code text NOT NULL,
  currency text NOT NULL,
  commission_rate_bps integer NOT NULL,
  effective_from date NOT NULL,
  effective_to date,
  active boolean NOT NULL DEFAULT true,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT stss_commission_policies_country_code_check CHECK (
    source_country_code IN ('SN', 'CI', 'CM', 'GA', 'BJ', 'TG', 'CG', 'CD')
    AND destination_country_code IN ('SN', 'CI', 'CM', 'GA', 'BJ', 'TG', 'CG', 'CD')
  ),
  CONSTRAINT stss_commission_policies_currency_check CHECK (currency IN ('FCFA', 'XAF', 'USD', 'EUR', 'CAD')),
  CONSTRAINT stss_commission_policies_bps_check CHECK (commission_rate_bps BETWEEN 0 AND 300),
  CONSTRAINT stss_commission_policies_dates_check CHECK (effective_to IS NULL OR effective_to >= effective_from),
  CONSTRAINT stss_commission_policies_version_check CHECK (version > 0)
);

CREATE OR REPLACE FUNCTION prevent_active_stss_commission_policy_overlap() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT NEW.active THEN
    RETURN NEW;
  END IF;
  PERFORM pg_advisory_xact_lock(
    hashtextextended(
      NEW.source_country_code || ':' || NEW.destination_country_code || ':' || NEW.currency,
      0
    )
  );
  IF EXISTS (
    SELECT 1
    FROM stss_commission_policies policy
    WHERE policy.active
      AND policy.source_country_code = NEW.source_country_code
      AND policy.destination_country_code = NEW.destination_country_code
      AND policy.currency = NEW.currency
      AND policy.id IS DISTINCT FROM NEW.id
      AND NEW.effective_from <= COALESCE(policy.effective_to, 'infinity'::date)
      AND COALESCE(NEW.effective_to, 'infinity'::date) >= policy.effective_from
  ) THEN
    RAISE EXCEPTION 'active STSS commission policies cannot overlap';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stss_commission_policies_no_active_overlap ON stss_commission_policies;
CREATE TRIGGER stss_commission_policies_no_active_overlap
  BEFORE INSERT OR UPDATE ON stss_commission_policies
  FOR EACH ROW EXECUTE FUNCTION prevent_active_stss_commission_policy_overlap();

CREATE UNIQUE INDEX IF NOT EXISTS stss_commission_policies_active_unique
  ON stss_commission_policies (source_country_code, destination_country_code, currency, effective_from)
  WHERE active;
CREATE INDEX IF NOT EXISTS stss_commission_policies_lookup_idx
  ON stss_commission_policies (source_country_code, destination_country_code, currency, effective_from DESC)
  WHERE active;

COMMIT;
