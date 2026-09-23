/**
 * Session et permissions du back-office — **couture d'authentification**, côté serveur.
 *
 * Référence : `site/SPEC_BACKOFFICE_ANTENNE_BEC.md` §23 (RBAC) et §40 (règles API).
 *
 * ÉTAT ACTUEL : la plateforme n'a **pas** de couche d'authentification, pas de
 * JWT, pas de middleware et pas d'API (voir l'audit de la PHASE 1). Les deux
 * back-offices ne sont donc **protégés par rien** aujourd'hui.
 *
 * Ce que ce fichier garantit malgré tout :
 *   - les fonctions sont asynchrones et appelées depuis des composants serveur :
 *     aucune autorisation ne peut être contournée depuis le navigateur ;
 *   - le périmètre est appliqué **avant** toute lecture, dans
 *     `scopeDossiers()` de `lib/backoffice-data.ts`, avec refus par défaut ;
 *   - il n'existe qu'un seul point à remplacer le jour où le JWT arrivera
 *     (`TODO AUTH` ci-dessous).
 *
 * Ce que ce fichier ne garantit PAS :
 *   - aucune vérification cryptographique : le cookie est lu, jamais validé ;
 *   - sans cookie, une session de démonstration est renvoyée. Un visiteur qui
 *     connaît l'URL accède donc aux back-offices ;
 *   - aucune vérification que l'utilisateur appartient réellement à l'antenne
 *     dont il consulte les dossiers. C'est l'authentification qui l'apportera.
 *
 * La spec §23 est explicite : « Le frontend ne constitue jamais la sécurité. »
 * Ce fichier est un emplacement, pas une sécurité.
 */
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { BackofficeRole, BackofficeScope, Permission } from "./backoffice-types";

export const BACKOFFICE_SESSION_COOKIE = "eap_backoffice_session";

/**
 * Permissions par rôle.
 *
 * Elles sont déclarées ici, et non déduites dans les composants : un composant
 * qui décide lui-même s'il a le droit d'afficher un bouton finit toujours par
 * diverger de la règle serveur.
 */
const ROLE_PERMISSIONS: Record<BackofficeRole, Permission[]> = {
  ANTENNE: [
    "dossiers.read",
    "dossiers.update",
    "dossiers.assign",
    "dossiers.transmit",
    "documents.read",
    "documents.verify",
    "reports.read",
    "reports.generate",
    "history.read",
    "activity.read",
    "exports.run",
  ],
  BEC: [
    "dossiers.read",
    "dossiers.validate",
    "documents.read",
    "reports.read",
    "reports.generate",
    "statistics.read",
    "history.read",
    "activity.read",
    "exports.run",
  ],
};

/**
 * Sessions de démonstration.
 *
 * L'agent d'antenne est rattaché au Sénégal : c'est ce qui rend le contrôle de
 * périmètre observable — consulter un dossier ivoirien doit renvoyer un 404.
 */
const DEMO_SCOPES: Record<BackofficeRole, BackofficeScope> = {
  ANTENNE: {
    role: "ANTENNE",
    countryCode: "SN",
    country: "Sénégal",
    flag: "🇸🇳",
    antennaCity: "Dakar",
    userName: "Mme Aïssatou Diallo",
    userTitle: "Coordonnatrice — Antenne Sénégal",
    permissions: ROLE_PERMISSIONS.ANTENNE,
    isDemo: true,
  },
  BEC: {
    role: "BEC",
    countryCode: null,
    country: null,
    flag: null,
    antennaCity: null,
    userName: "M. Marc Mahonte",
    userTitle: "Bureau Exécutif Central — vue consolidée",
    permissions: ROLE_PERMISSIONS.BEC,
    isDemo: true,
  },
};

/** Vrai si le périmètre porte la permission demandée. */
export function hasPermission(scope: BackofficeScope, permission: Permission): boolean {
  return scope.permissions.includes(permission);
}

/**
 * Lit la session du back-office pour le rôle demandé.
 *
 * `cookies()` rend les segments `/antenne` et `/bec` dynamiques : c'est le
 * comportement attendu pour un espace opérationnel, dont le contenu ne doit
 * jamais être mis en cache ni pré-généré.
 */
export async function getBackofficeScope(role: BackofficeRole): Promise<BackofficeScope> {
  const store = await cookies();
  const raw = store.get(BACKOFFICE_SESSION_COOKIE)?.value;

  if (!raw) {
    // TODO AUTH — remplacer ce repli par une redirection vers la connexion dès
    // que le service d'authentification émettra le cookie de session.
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[EA-POMRA] Aucune session back-office : repli sur la session de démonstration « ${role} ». ` +
          "Les back-offices /antenne et /bec ne sont pas authentifiés."
      );
    }
    return DEMO_SCOPES[role];
  }

  try {
    const decoded = JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as {
      role?: BackofficeRole;
      userName?: string;
      userTitle?: string;
      countryCode?: BackofficeScope["countryCode"];
      country?: string;
      flag?: string;
      antennaCity?: string;
    };

    if (!decoded.role || !(decoded.role in ROLE_PERMISSIONS)) return DEMO_SCOPES[role];

    // Le rôle porté par le cookie prime : c'est lui qui détermine les
    // permissions. Un agent d'antenne ne peut pas s'attribuer les droits BEC en
    // changeant l'URL, puisque le rôle vient de la session et non de la route.
    const sessionRole = decoded.role;
    return {
      ...DEMO_SCOPES[sessionRole],
      role: sessionRole,
      userName: decoded.userName ?? DEMO_SCOPES[sessionRole].userName,
      userTitle: decoded.userTitle ?? DEMO_SCOPES[sessionRole].userTitle,
      countryCode: sessionRole === "BEC" ? null : (decoded.countryCode ?? "SN"),
      country: sessionRole === "BEC" ? null : (decoded.country ?? "Sénégal"),
      flag: sessionRole === "BEC" ? null : (decoded.flag ?? "🇸🇳"),
      antennaCity: sessionRole === "BEC" ? null : (decoded.antennaCity ?? "Dakar"),
      permissions: ROLE_PERMISSIONS[sessionRole],
      isDemo: false,
    };
  } catch {
    // Cookie illisible : on refuse plutôt que de retomber sur la démonstration,
    // sinon un cookie corrompu ouvrirait l'accès.
    notFound();
  }
}

/**
 * Périmètre requis pour une page, avec contrôle de permission.
 *
 * En l'absence de la permission, la page renvoie un 404 : cela évite de
 * confirmer l'existence d'une section à un utilisateur qui n'y a pas droit.
 */
export async function requireBackofficeScope(
  role: BackofficeRole,
  permission?: Permission
): Promise<BackofficeScope> {
  const scope = await getBackofficeScope(role);

  if (scope.role !== role) {
    // Un agent d'antenne qui ouvre /bec, ou l'inverse.
    notFound();
  }

  if (permission && !hasPermission(scope, permission)) {
    notFound();
  }

  return scope;
}
