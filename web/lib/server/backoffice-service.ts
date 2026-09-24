import { cache } from "react";
import { getAllScoped, parseDossierQuery, queryDossiers } from "@/lib/backoffice-data";
import type { ActivityEvent, BackofficeScope, Dossier, DossierPage, DossierQuery } from "@/lib/backoffice-types";
import { referenceDateForScope } from "./temporal";
import {
  getActivityForDossier as getActivityForDossierFromRepository,
  getActivityForScope as getActivityFromRepository,
  getDossierForScope as getDossierFromRepository,
  getPendingCount,
  listDossiersForScope,
  queryDossiersForScope
} from "./backoffice-repository";

export async function getDossiersForScope(scope: BackofficeScope): Promise<Dossier[]> {
  return scope.isDemo ? getAllScoped(scope) : listDossiersForScope(scope, 5000);
}

export async function queryDossierPageForScope(
  scope: BackofficeScope,
  query: DossierQuery
): Promise<DossierPage> {
  return scope.isDemo
    ? queryDossiers(scope, query, getAllScoped(scope))
    : queryDossiersForScope(scope, query, referenceDateForScope(scope));
}

export async function queryDossierPageFromSearchParams(
  scope: BackofficeScope,
  params: Record<string, string | string[] | undefined>
): Promise<DossierPage> {
  return queryDossierPageForScope(scope, parseDossierQuery(params));
}

const getDossierFromScopeCached = cache((scope: BackofficeScope, dossierId: string) =>
  getDossierFromRepository(scope, dossierId)
);

export async function getDossierForScope(
  scope: BackofficeScope,
  dossierId: string
): Promise<Dossier | null> {
  if (scope.isDemo) return getAllScoped(scope).find((dossier) => dossier.id === dossierId) ?? null;
  return getDossierFromScopeCached(scope, dossierId);
}

export async function getActivityForScope(
  scope: BackofficeScope,
  dossiers?: Dossier[]
): Promise<ActivityEvent[]> {
  if (scope.isDemo) {
    const { getActivityForScope: getMockActivity } = await import("@/lib/backoffice-data");
    return getMockActivity(scope, dossiers);
  }
  return getActivityFromRepository(scope);
}

export async function getActivityForDossier(
  scope: BackofficeScope,
  dossierId: string
): Promise<ActivityEvent[]> {
  if (scope.isDemo) {
    const dossier = getAllScoped(scope).find((row) => row.id === dossierId);
    if (!dossier) return [];
    const { getActivityForScope: getMockActivity } = await import("@/lib/backoffice-data");
    return getMockActivity(scope, [dossier]);
  }
  return getActivityForDossierFromRepository(scope, dossierId);
}

export async function getPendingCountForScope(scope: BackofficeScope): Promise<number> {
  if (scope.isDemo) {
    const { computeOperationalQueue, computeValidationQueue } = await import("@/lib/backoffice-data");
    const dossiers = getAllScoped(scope);
    return scope.role === "BEC"
      ? computeValidationQueue(scope, undefined, dossiers).length
      : computeOperationalQueue(scope, dossiers).length;
  }
  return getPendingCount(scope);
}
