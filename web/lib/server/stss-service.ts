import { COUNTRIES_REFERENCE, computeStssDossiers } from "@/lib/backoffice-data";
import type { BackofficeScope, Dossier } from "@/lib/backoffice-types";
import {
  emptyStssAggregate,
  type StssAggregate,
  type StssTransferView
} from "@/lib/stss-types";
import { getDossiersForScope } from "./backoffice-service";
import { countStssTransfersForScope, listStssTransfersForScope } from "./stss-repository";

export const STSS_PAGE_LIMIT = 500;

export interface StssTransferPage {
  items: StssTransferView[];
  page: number;
  limit: number;
  total: number;
  aggregate: StssAggregate;
}

function demoTransfer(dossier: Dossier): StssTransferView | null {
  const stss = dossier.stss;
  if (!stss) return null;
  const destination = COUNTRIES_REFERENCE.find((country) => country.antenne === stss.targetAntenna);
  if (!destination) throw new Error("unknown demo STSS destination");
  return {
    id: stss.id,
    dossierId: dossier.id,
    dossierReference: dossier.reference,
    reference: stss.reference,
    sourceAntennaId: `${dossier.countryCode}-AN`,
    sourceAntenna: stss.sourceAntenna,
    sourceCountryCode: dossier.countryCode,
    destinationAntennaId: `${destination.code}-AN`,
    destinationAntenna: stss.targetAntenna,
    destinationCountryCode: destination.code,
    grossAmountMinor: stss.grossAmountMinor,
    netAmountMinor: stss.netAmountMinor,
    commissionAmountMinor: stss.commissionAmountMinor,
    commissionRateBps: stss.commissionRateBps,
    currency: stss.currency as StssTransferView["currency"],
    status: stss.status,
    isSimulation: stss.isSimulation,
    version: dossier.version,
    createdAt: dossier.createdAt,
    updatedAt: dossier.updatedAt,
    completedAt: stss.status === "SIMULATION" ? dossier.updatedAt : null
  };
}

export async function getStssTransfersPageForScope(
  scope: BackofficeScope,
  page = 1,
  limit = STSS_PAGE_LIMIT
): Promise<StssTransferPage> {
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
    throw new Error("STSS pagination must use a positive page and limit");
  }
  const boundedLimit = Math.min(limit, STSS_PAGE_LIMIT);
  const offset = (page - 1) * boundedLimit;

  if (scope.isDemo) {
    const dossiers = await getDossiersForScope(scope);
    const allTransfers = computeStssDossiers(scope, dossiers)
      .map(demoTransfer)
      .filter((transfer): transfer is StssTransferView => transfer !== null);
    const items = allTransfers.slice(offset, offset + boundedLimit);
    return {
      items,
      page,
      limit: boundedLimit,
      total: allTransfers.length,
      aggregate: aggregateStssTransfers(items)
    };
  }

  const [items, total] = await Promise.all([
    listStssTransfersForScope(scope, boundedLimit, offset),
    countStssTransfersForScope(scope)
  ]);
  return {
    items,
    page,
    limit: boundedLimit,
    total,
    aggregate: aggregateStssTransfers(items)
  };
}

export async function getStssTransfersForScope(scope: BackofficeScope): Promise<StssTransferView[]> {
  return (await getStssTransfersPageForScope(scope)).items;
}

function addSafeInteger(current: number, value: number, label: string): number {
  if (!Number.isSafeInteger(current) || !Number.isSafeInteger(value)) {
    throw new Error(`STSS ${label} exceeds JavaScript safe integer range`);
  }
  const result = current + value;
  if (!Number.isSafeInteger(result)) {
    throw new Error(`STSS ${label} cumulative total exceeds JavaScript safe integer range`);
  }
  return result;
}

export function aggregateStssTransfers(transfers: readonly StssTransferView[]): StssAggregate {
  const aggregate = emptyStssAggregate();
  const currencies = new Set<StssTransferView["currency"]>();
  for (const transfer of transfers) {
    const currency = aggregate.byCurrency[transfer.currency];
    aggregate.total = addSafeInteger(aggregate.total, 1, "transfer count");
    aggregate.byStatus[transfer.status] = addSafeInteger(
      aggregate.byStatus[transfer.status],
      1,
      `${transfer.status} count`
    );
    if (transfer.isSimulation) {
      aggregate.simulation = addSafeInteger(aggregate.simulation, 1, "simulation count");
    }
    currency.grossAmountMinor = addSafeInteger(
      currency.grossAmountMinor,
      transfer.grossAmountMinor,
      `${transfer.currency} gross amount`
    );
    currency.netAmountMinor = addSafeInteger(
      currency.netAmountMinor,
      transfer.netAmountMinor,
      `${transfer.currency} net amount`
    );
    currency.commissionAmountMinor = addSafeInteger(
      currency.commissionAmountMinor,
      transfer.commissionAmountMinor,
      `${transfer.currency} commission amount`
    );
    currencies.add(transfer.currency);
  }
  aggregate.currencies = [...currencies];
  return aggregate;
}

export async function getStssAggregateForScope(scope: BackofficeScope): Promise<StssAggregate> {
  return (await getStssTransfersPageForScope(scope)).aggregate;
}
