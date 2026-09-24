import { z } from "zod";
import type { BackofficeScope } from "@/lib/backoffice-types";
import { STSS_COUNTRIES, STSS_CURRENCIES, STSS_STATUSES, type StssTransferView } from "@/lib/stss-types";
import { query } from "./db";

const countryCode = z.enum(["SN", "CI", "CM", "GA", "BJ", "TG", "CG", "CD"]);
const currency = z.enum(STSS_CURRENCIES);
const status = z.enum(STSS_STATUSES);
const dateValue = z.union([z.date(), z.string().datetime({ offset: true })]);

const transferRowSchema = z.object({
  id: z.string().uuid(),
  dossier_id: z.string().uuid().nullable(),
  dossier_reference: z.string().nullable(),
  reference: z.string().min(1).max(100),
  source_antenna_id: z.string().min(1).max(100),
  source_antenna_name: z.string().min(1).max(200),
  source_country_code: countryCode,
  destination_antenna_id: z.string().min(1).max(100),
  destination_antenna_name: z.string().min(1).max(200),
  destination_country_code: countryCode,
  gross_amount_minor: z.coerce.bigint(),
  net_amount_minor: z.coerce.bigint(),
  commission_amount_minor: z.coerce.bigint(),
  commission_rate_bps: z.coerce.number().int().min(0).max(300),
  currency,
  status,
  is_simulation: z.boolean(),
  version: z.coerce.number().int().positive(),
  created_at: dateValue,
  updated_at: dateValue,
  completed_at: dateValue.nullable()
});

type TransferRow = z.infer<typeof transferRowSchema>;

function iso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function safeNumber(value: bigint): number {
  const result = Number(value);
  if (!Number.isSafeInteger(result)) throw new Error("STSS amount exceeds JavaScript safe integer range");
  return result;
}

function assertRealScope(scope: BackofficeScope): void {
  if (scope.isDemo || !scope.userId) {
    throw new Error("STSS PostgreSQL reading requires a real scoped session");
  }
  if (scope.role !== "ANTENNE" && scope.role !== "BEC") {
    throw new Error("STSS reading requires the ANTENNE or BEC role");
  }
  if (!scope.permissions.includes("dossiers.read")) {
    throw new Error("STSS reading requires dossiers.read permission");
  }
  if (
    scope.role === "ANTENNE" &&
    (!scope.antennaId ||
      !scope.countryCode ||
      !STSS_COUNTRIES.some((country) => country.code === scope.countryCode))
  ) {
    throw new Error("STSS antenna scope requires a valid antenna and country");
  }
}

function mapTransfer(row: TransferRow): StssTransferView {
  const country = STSS_COUNTRIES.find((item) => item.code === row.source_country_code);
  if (!country) throw new Error("unknown STSS source country");
  return {
    id: row.id,
    dossierId: row.dossier_id,
    dossierReference: row.dossier_reference,
    reference: row.reference,
    sourceAntennaId: row.source_antenna_id,
    sourceAntenna: row.source_antenna_name,
    sourceCountryCode: row.source_country_code,
    destinationAntennaId: row.destination_antenna_id,
    destinationAntenna: row.destination_antenna_name,
    destinationCountryCode: row.destination_country_code,
    grossAmountMinor: safeNumber(row.gross_amount_minor),
    netAmountMinor: safeNumber(row.net_amount_minor),
    commissionAmountMinor: safeNumber(row.commission_amount_minor),
    commissionRateBps: row.commission_rate_bps,
    currency: row.currency,
    status: row.status,
    isSimulation: row.is_simulation,
    version: row.version,
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    completedAt: row.completed_at ? iso(row.completed_at) : null
  };
}

export async function countStssTransfersForScope(scope: BackofficeScope): Promise<number> {
  assertRealScope(scope);
  const scopeValues = scope.role === "BEC" ? [] : [scope.antennaId, scope.countryCode];
  const scopeCondition =
    scope.role === "BEC"
      ? "TRUE"
      : `(
          $1::text IS NOT NULL AND $2::text IS NOT NULL AND d.id IS NOT NULL
          AND d.country_code = $2
          AND (
            (t.source_antenna_id = $1 AND t.source_country_code = $2)
            OR (t.destination_antenna_id = $1 AND t.destination_country_code = $2)
          )
        )`;
  const result = await query<{ total: string }>(
    `SELECT COUNT(*)::text AS total
     FROM stss_transfers t
     ${scope.role === "BEC" ? "LEFT" : "INNER"} JOIN dossiers d ON d.id = t.dossier_id
     WHERE ${scopeCondition}`,
    scopeValues
  );
  const total = Number(result.rows[0]?.total ?? 0);
  if (!Number.isSafeInteger(total) || total < 0) {
    throw new Error("STSS total exceeds JavaScript safe integer range");
  }
  return total;
}

export async function listStssTransfersForScope(
  scope: BackofficeScope,
  limit = 500,
  offset = 0
): Promise<StssTransferView[]> {
  assertRealScope(scope);
  if (!Number.isInteger(limit) || !Number.isInteger(offset) || limit < 1 || offset < 0) {
    throw new Error("STSS pagination must use positive limit and non-negative offset");
  }
  const boundedLimit = Math.min(limit, 500);
  const scopeValues = scope.role === "BEC" ? [] : [scope.antennaId, scope.countryCode];
  const limitPosition = scopeValues.length + 1;
  const offsetPosition = scopeValues.length + 2;
  const scopeCondition =
    scope.role === "BEC"
      ? "TRUE"
      : `(
          $1::text IS NOT NULL AND $2::text IS NOT NULL AND d.id IS NOT NULL
          AND d.country_code = $2
          AND (
            (t.source_antenna_id = $1 AND t.source_country_code = $2)
            OR (t.destination_antenna_id = $1 AND t.destination_country_code = $2)
          )
        )`;
  const result = await query<TransferRow>(
    `SELECT t.id, t.dossier_id, d.reference AS dossier_reference, t.reference,
      t.source_antenna_id, t.source_antenna_name, t.source_country_code,
      t.destination_antenna_id, t.destination_antenna_name, t.destination_country_code,
      t.gross_amount_minor, t.net_amount_minor, t.commission_amount_minor,
      t.commission_rate_bps, t.currency, t.status, t.is_simulation, t.version,
      t.created_at, t.updated_at, t.completed_at
     FROM stss_transfers t
     ${scope.role === "BEC" ? "LEFT" : "INNER"} JOIN dossiers d ON d.id = t.dossier_id
     WHERE ${scopeCondition}
     ORDER BY t.updated_at DESC, t.id
     LIMIT $${limitPosition} OFFSET $${offsetPosition}`,
    [...scopeValues, boundedLimit, offset]
  );
  return result.rows.map((row) => mapTransfer(transferRowSchema.parse(row)));
}
