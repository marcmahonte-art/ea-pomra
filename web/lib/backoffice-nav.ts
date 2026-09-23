/**
 * Chemins du back-office, dérivés du rôle.
 *
 * Les deux back-offices partagent exactement la même arborescence sous deux
 * préfixes. Écrire `/antenne/dossiers` en dur dans un composant qui sert aussi
 * le BEC est la manière la plus sûre d'envoyer un agent BEC vers une page
 * d'antenne — et, le jour où l'authentification arrivera, vers un 404.
 */
import type { BackofficeRole } from "./backoffice-types";

export function rootHref(role: BackofficeRole): string {
  return role === "BEC" ? "/bec" : "/antenne";
}

export function dossierHref(role: BackofficeRole, dossierId: string): string {
  return `${rootHref(role)}/dossiers/${dossierId}`;
}

export function dossiersHref(role: BackofficeRole): string {
  return `${rootHref(role)}/dossiers`;
}
