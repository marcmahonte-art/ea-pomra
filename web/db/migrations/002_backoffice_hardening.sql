BEGIN;

CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  key_hash text NOT NULL,
  action text NOT NULL,
  bucket_start timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  expires_at timestamptz NOT NULL,
  CONSTRAINT rate_limit_buckets_pk PRIMARY KEY (key_hash, action, bucket_start),
  CONSTRAINT rate_limit_buckets_count_check CHECK (request_count > 0)
);

CREATE INDEX IF NOT EXISTS rate_limit_buckets_expiry_idx
  ON rate_limit_buckets (expires_at);

ALTER TABLE document_storage
  ADD COLUMN IF NOT EXISTS ciphertext bytea,
  ADD COLUMN IF NOT EXISTS initialization_vector bytea,
  ADD COLUMN IF NOT EXISTS authentication_tag bytea,
  ADD COLUMN IF NOT EXISTS aad_version integer NOT NULL DEFAULT 0;

ALTER TABLE document_storage
  DROP CONSTRAINT IF EXISTS document_storage_encrypted_payload_check;

ALTER TABLE document_storage
  ADD CONSTRAINT document_storage_encrypted_payload_check CHECK (
    provider <> 'POSTGRES_AES_GCM'
    OR (
      encrypted = true
      AND content_type IN ('application/pdf', 'image/jpeg', 'image/png')
      AND ciphertext IS NOT NULL
      AND octet_length(ciphertext) = byte_size
      AND octet_length(initialization_vector) = 12
      AND octet_length(authentication_tag) = 16
      AND byte_size BETWEEN 1 AND 15728640
      AND checksum_sha256 ~ '^[0-9a-f]{64}$'
      AND aad_version >= 0
    )
  );

ALTER TABLE audit_events
  ADD COLUMN IF NOT EXISTS resource_type text,
  ADD COLUMN IF NOT EXISTS resource_id uuid;

ALTER TABLE audit_events
  DROP CONSTRAINT IF EXISTS audit_events_resource_type_check;

ALTER TABLE audit_events
  ADD CONSTRAINT audit_events_resource_type_check CHECK (
    resource_type IS NULL OR resource_type IN ('DOSSIER', 'DOCUMENT', 'REPORT', 'SESSION', 'SYSTEM')
  );

CREATE OR REPLACE FUNCTION prevent_audit_event_truncate() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_events is append-only';
END;
$$;

DROP TRIGGER IF EXISTS audit_events_no_truncate ON audit_events;
CREATE TRIGGER audit_events_no_truncate
  BEFORE TRUNCATE ON audit_events
  FOR EACH STATEMENT EXECUTE FUNCTION prevent_audit_event_truncate();

ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS scope_key text
  GENERATED ALWAYS AS (COALESCE(country_code, '')) STORED,
  ADD COLUMN IF NOT EXISTS filter_key text;

UPDATE reports
SET filter_key = CONCAT(
  COALESCE(snapshot #>> '{filters,country}', 'all'), '|',
  COALESCE(snapshot #>> '{filters,program}', 'all'), '|',
  COALESCE(snapshot #>> '{filters,formation}', 'all')
)
WHERE filter_key IS NULL;

ALTER TABLE reports
  ALTER COLUMN filter_key SET NOT NULL;

DROP INDEX IF EXISTS reports_scope_period_unique;
CREATE UNIQUE INDEX IF NOT EXISTS reports_scope_period_unique
  ON reports (scope_user_id, scope_role, scope_key, year, quarter, filter_key);

ALTER TABLE dossiers
  DROP CONSTRAINT IF EXISTS dossiers_country_code_check;

ALTER TABLE dossiers
  ADD CONSTRAINT dossiers_country_code_check CHECK (
    country_code IN ('SN', 'CI', 'CM', 'GA', 'BJ', 'TG', 'CG', 'CD')
  );

ALTER TABLE documents
  DROP CONSTRAINT IF EXISTS documents_name_check,
  DROP CONSTRAINT IF EXISTS documents_comment_check;

ALTER TABLE documents
  ADD CONSTRAINT documents_name_check CHECK (length(btrim(name)) BETWEEN 1 AND 200),
  ADD CONSTRAINT documents_comment_check CHECK (comment IS NULL OR length(comment) <= 2000);

CREATE OR REPLACE FUNCTION purge_expired_rate_limit_buckets(requested_batch_size integer DEFAULT 10000)
RETURNS integer
LANGUAGE plpgsql AS $$
DECLARE
  deleted_count integer;
BEGIN
  IF requested_batch_size < 1 OR requested_batch_size > 100000 THEN
    RAISE EXCEPTION 'invalid rate limit purge batch size';
  END IF;
  WITH expired AS (
    SELECT ctid
    FROM rate_limit_buckets
    WHERE expires_at < now()
    ORDER BY expires_at
    LIMIT requested_batch_size
    FOR UPDATE SKIP LOCKED
  )
  DELETE FROM rate_limit_buckets
  USING expired
  WHERE rate_limit_buckets.ctid = expired.ctid;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

CREATE OR REPLACE FUNCTION purge_expired_sessions(requested_batch_size integer DEFAULT 10000)
RETURNS integer
LANGUAGE plpgsql AS $$
DECLARE
  deleted_count integer;
BEGIN
  IF requested_batch_size < 1 OR requested_batch_size > 100000 THEN
    RAISE EXCEPTION 'invalid session purge batch size';
  END IF;

  WITH expired AS (
    SELECT id
    FROM sessions
    WHERE expires_at < now() OR revoked_at < now() - interval '30 days'
    ORDER BY expires_at
    LIMIT requested_batch_size
    FOR UPDATE SKIP LOCKED
  )
  DELETE FROM sessions
  USING expired
  WHERE sessions.id = expired.id;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

COMMIT;
