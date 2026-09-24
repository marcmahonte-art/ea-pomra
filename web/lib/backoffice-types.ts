/**
 * Types des back-offices Antenne et BEC.
 *
 * Référence : `site/SPEC_BACKOFFICE_ANTENNE_BEC.md` (§35 modèle de données,
 * §36 workflow, §23 RBAC).
 *
 * Règle de conception : le workflow du dossier est défini une seule fois ici, et
 * l'interface ne fait que l'afficher. La spec §36 l'exige explicitement — « le
 * statut affiché dans l'interface doit toujours provenir du workflow métier
 * enregistré côté serveur » — et créer des statuts côté interface est la
 * manière la plus sûre de faire diverger le front du métier.
 */

/** Rôle de l'utilisateur du back-office. */
export type BackofficeRole = "ANTENNE" | "BEC" | "EXPERT_OCO" | "RESPONSABLE_PAP";

export type CountryCode = "SN" | "CI" | "CM" | "GA" | "BJ" | "TG" | "CG" | "CD";

/**
 * Les cinq étapes du parcours (spec §36).
 * `DIPLOME` est l'étape terminale ; elle correspond à « RÉUSSITE » côté portail
 * parent. Les deux libellés désignent la même réalité métier.
 */
export type WorkflowStep =
  | "CANDIDATURE"
  | "ORIENTATION"
  | "MOBILITE"
  | "SUIVI"
  | "DIPLOME";

/**
 * État opérationnel d'un dossier.
 *
 * Distinct de `WorkflowStep` : l'étape dit *où en est* le dossier dans le
 * parcours, l'état dit *ce qu'il attend concrètement*. Un dossier peut être à
 * l'étape ORIENTATION et en état `INCOMPLET` — c'est justement ce que la file
 * opérationnelle doit faire remonter.
 */
export type DossierState =
  | "RECU"
  | "EN_VERIFICATION"
  | "INCOMPLET"
  | "TRANSMIS_OCO"
  | "AVIS_RECU"
  | "A_VALIDER"
  | "VALIDE"
  | "EN_MOBILITE"
  | "EN_SUIVI"
  | "DIPLOME"
  | "REJETE";

export type DocumentStatus = "MANQUANT" | "A_VERIFIER" | "VALIDE" | "REFUSE";

export type Priority = "HAUTE" | "NORMALE" | "BASSE";

export interface DossierDocument {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  /** `null` lorsque la pièce n'a pas encore été fournie. */
  addedAt: string | null;
  verifiedBy: string | null;
  updatedAt: string;
  comment: string | null;
  hasFile: boolean;
  version: number;
}

/**
 * Entrée du registre chronologique (spec §15 et §37).
 *
 * Immuable par construction : aucune interface ne propose de la modifier, et le
 * type ne comporte aucune fonction de mise à jour.
 */
export interface ActivityEvent {
  id: string;
  dossierId: string;
  /** Horodatage ISO, pour le tri. */
  at: string;
  /** Libellé affiché, au format `19/09/2026 10:42`. */
  atLabel: string;
  dossierRef: string;
  studentName: string;
  action: string;
  fromState: DossierState | null;
  toState: DossierState | null;
  user: string;
  userRole: string;
  comment: string | null;
}

export interface OrientationInfo {
  transmittedAt: string | null;
  verdict: "FAVORABLE" | "SOUS_RESERVE" | "DEFAVORABLE" | null;
  orientation: string | null;
  observations: string | null;
  reserves: string | null;
  avisDate: string | null;
  expertName: string | null;
}

export type OcoReviewStatus = "DRAFT" | "FINALIZED";
export type OcoVerdict = "FAVORABLE" | "SOUS_RESERVE" | "DEFAVORABLE";

export interface OcoReview {
  id: string;
  dossierId: string;
  verdict: OcoVerdict | null;
  orientation: string | null;
  analysis: string;
  observations: string;
  reserves: string;
  status: OcoReviewStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  finalizedAt: string | null;
  expertName: string | null;
}

export interface OcoAssignment {
  id: string;
  dossierId: string;
  expertUserId: string;
  assignedAt: string;
  active: boolean;
}

export interface OcoDossier {
  id: string;
  reference: string;
  studentName: string;
  studentInitials: string;
  countryCode: CountryCode;
  country: string;
  flag: string;
  antennaCity: string;
  program: string;
  formation: string;
  state: DossierState;
  step: WorkflowStep;
  completeness: number;
  priority: Priority;
  requiredAction: string | null;
  createdAt: string;
  createdAtLabel: string;
  updatedAt: string;
  updatedAtLabel: string;
  version: number;
  documents: DossierDocument[];
  review: OcoReview | null;
  assignment: OcoAssignment;
}

export interface MobiliteInfo {
  sourceCountry: string;
  targetCountry: string;
  targetCity: string;
  status: string;
  updatedAt: string;
}

import type { StssStatus } from "./stss-types";

export interface StssInfo {
  id: string;
  reference: string;
  sourceAntenna: string;
  targetAntenna: string;
  grossAmountMinor: number;
  netAmountMinor: number;
  commissionAmountMinor: number;
  commissionRateBps: number;
  currency: string;
  status: StssStatus;
  isSimulation: true;
  date: string;
}

export interface Dossier {
  id: string;
  /** Identifiant ID-POMRA, clé de corrélation des canaux partagés (spec §25). */
  reference: string;
  studentName: string;
  studentInitials: string;
  email: string;
  phone: string;
  countryCode: CountryCode;
  country: string;
  flag: string;
  antennaCity: string;
  program: string;
  formation: string;
  step: WorkflowStep;
  state: DossierState;
  /** Taux de complétude du dossier, de 0 à 100. */
  completeness: number;
  /** Date de réception du dossier — sert aux KPI de période et aux rapports. */
  createdAt: string;
  createdAtLabel: string;
  updatedAt: string;
  updatedAtLabel: string;
  version: number;
  priority: Priority;
  /** Action attendue de l'agent, ou `null` si le dossier n'attend rien. */
  requiredAction: string | null;
  documents: DossierDocument[];
  orientation: OrientationInfo | null;
  mobilite: MobiliteInfo | null;
  stss: StssInfo | null;
  overdueTaskCount: number;
}

/** Compteur d'une répartition (statut, programme, formation). */
export interface Distribution {
  label: string;
  value: number;
  /** Clé stable, pour la couleur et l'ancrage. */
  key: string;
}

export interface CountryStat {
  countryCode: CountryCode;
  country: string;
  flag: string;
  city: string;
  total: number;
  pending: number;
  toValidate: number;
  validated: number;
}

export interface EvolutionPoint {
  period: string;
  received: number;
  processed: number;
}

export interface Kpi {
  id: "received" | "toProcess" | "pending" | "processed" | "toValidate" | "validated";
  label: string;
  value: number;
  /** Période sur laquelle porte la valeur, affichée telle quelle. */
  period: string;
  /**
   * Variation par rapport à une période comparable, ou `null`.
   * Spec §8.2 : ne jamais inventer de variation si aucune comparaison réelle
   * n'existe. Le type autorise explicitement l'absence.
   */
  variation: { value: number; direction: "up" | "down" } | null;
}

export type AlertKind =
  | "DOSSIER_INCOMPLET"
  | "DOCUMENT_A_VERIFIER"
  | "DOSSIER_EN_ATTENTE"
  | "DELAI_OPERATIONNEL"
  | "SYSTEME";

export interface OperationalAlert {
  id: string;
  kind: AlertKind;
  title: string;
  detail: string;
  count: number;
  /** Route de traitement de l'alerte. */
  href: string;
  severity: "info" | "warning" | "error";
}

/** Ligne de la file de validation BEC (spec §9.4). */
export interface ValidationQueueRow {
  dossierId: string;
  reference: string;
  studentName: string;
  country: string;
  flag: string;
  program: string;
  state: DossierState;
  updatedAtLabel: string;
}

export interface QuarterlyReport {
  scopeLabel: string;
  year: number;
  quarter: number;
  periodLabel: string;
  generatedAtLabel: string;
  lines: { label: string; value: number }[];
  statusDistribution: Distribution[];
  programDistribution: Distribution[];
  formationDistribution: Distribution[];
}

export type ReportSnapshot = {
  filters: GlobalFilters;
  report: QuarterlyReport;
  rows: {
    reference: string;
    studentName: string;
    country: string;
    program: string;
    formation: string;
    state: DossierState;
    completeness: number;
  }[];
};

export interface StoredReport {
  id: string;
  generatedAt: string;
  generatedAtLabel: string;
  snapshot: ReportSnapshot;
}

/* ------------------------------------------------------------------ *
 * Notifications (spec §38)
 * ------------------------------------------------------------------ */

export type NotificationKind =
  | "NOUVEAU_DOSSIER"
  | "DOSSIER_A_TRAITER"
  | "DOCUMENT_A_VERIFIER"
  | "AVIS_RECU"
  | "VALIDATION_DEMANDEE"
  | "DOSSIER_EN_ATTENTE"
  | "RAPPORT_DISPONIBLE";

export const NOTIFICATION_KIND_LABELS: Record<NotificationKind, string> = {
  NOUVEAU_DOSSIER: "Nouveau dossier",
  DOSSIER_A_TRAITER: "Dossier à traiter",
  DOCUMENT_A_VERIFIER: "Document à vérifier",
  AVIS_RECU: "Avis reçu",
  VALIDATION_DEMANDEE: "Validation demandée",
  DOSSIER_EN_ATTENTE: "Dossier en attente",
  RAPPORT_DISPONIBLE: "Rapport disponible",
};

/**
 * Entrée du centre de notifications.
 *
 * Elle est **dérivée** de l'état du workflow, et non stockée : la plateforme
 * n'a ni table de notifications ni service d'envoi. Dériver la liste des
 * dossiers garantit qu'une notification ne peut pas mentir sur l'état d'un
 * dossier, ce qu'une file séparée finit toujours par faire.
 *
 * `read` est volontairement absent : l'état « lu / non lu » exige une
 * persistance par utilisateur, qui n'existe pas. Inventer un champ qui
 * reviendrait à `false` à chaque rechargement serait une fausse fonctionnalité.
 */
export interface BackofficeNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  detail: string;
  at: string;
  atLabel: string;
  href: string;
}

/* ------------------------------------------------------------------ *
 * RBAC (spec §23)
 * ------------------------------------------------------------------ */

export type Permission =
  | "dossiers.read"
  | "oco.read"
  | "oco.reviews.read"
  | "oco.reviews.write"
  | "oco.reviews.finalize"
  | "dossiers.update"
  | "dossiers.assign"
  | "dossiers.transmit"
  | "dossiers.validate"
  | "dossiers.reject"
  | "documents.read"
  | "documents.verify"
  | "reports.read"
  | "reports.generate"
  | "statistics.read"
  | "history.read"
  | "activity.read"
  | "exports.run"
  | "pap.read"
  | "pap.alerts.read"
  | "pap.alerts.write"
  | "pap.mentorat.read"
  | "pap.mentorat.write";

/**
 * Périmètre d'autorisation de l'utilisateur courant.
 *
 * `countryCode === null` signifie « aucun périmètre pays » : c'est le cas du BEC
 * (vue consolidée) **et** le cas d'un agent d'antenne mal configuré. Les
 * fonctions de filtrage refusent par défaut dans ce second cas — voir
 * `scopeDossiers()`.
 */
export interface BackofficeScope {
  userId: string | null;
  antennaId: string | null;
  role: BackofficeRole;
  countryCode: CountryCode | null;
  country: string | null;
  flag: string | null;
  antennaCity: string | null;
  userName: string;
  userTitle: string;
  permissions: Permission[];
  /** Vrai tant que la session provient du jeu de démonstration. */
  isDemo: boolean;
}

/* ------------------------------------------------------------------ *
 * Requêtes (spec §10 recherche/filtres/pagination, §32 côté serveur)
 * ------------------------------------------------------------------ */

export type CompletenessFilter = "all" | "complete" | "incomplete";

/**
 * Filtre de date (spec §10.2 et §10.3).
 *
 * La spec demande un filtre « Date » sans préciser sa forme. Un sélecteur de
 * plage relative est retenu plutôt qu'un calendrier : il couvre les besoins
 * opérationnels réels (« ce qui est arrivé cette semaine ») sans imposer une
 * saisie de dates ni un composant de calendrier que le dépôt ne fournit pas.
 *
 * Le filtre porte sur la **date de réception** du dossier, pas sur sa dernière
 * mise à jour : « les dossiers de la semaine » désigne ce qui est arrivé, non
 * ce qui a bougé.
 */
export type DateFilter = "all" | "7d" | "30d" | "quarter";

export const DATE_FILTER_LABELS: Record<DateFilter, string> = {
  all: "Toutes les dates",
  "7d": "7 derniers jours",
  "30d": "30 derniers jours",
  quarter: "Trimestre en cours",
};

/**
 * Filtres globaux du tableau de bord BEC (spec §9.1).
 *
 * Ils portent sur l'ensemble des blocs de la page — indicateurs, vue des pays,
 * file de validation, évolution — et sont appliqués **côté serveur** par les
 * fonctions d'agrégation, jamais dans le navigateur : la spec §9.5 interdit
 * qu'une statistique soit recalculée côté interface.
 *
 * La période n'y figure pas encore. Le quarter de référence est aujourd'hui une
 * constante du module de données (`CURRENT_PERIOD`), et le rendre variable
 * demande de paramétrer le calcul des variations. Tant que ce n'est pas fait,
 * l'interface affiche la période en clair plutôt que de proposer un sélecteur
 * sans effet — un contrôle inerte est plus trompeur qu'une information figée.
 */
export interface GlobalFilters {
  country?: CountryCode | "all";
  program?: string | "all";
  formation?: string | "all";
}

export interface DossierQuery {
  q: string;
  state: DossierState | "all";
  program: string | "all";
  formation: string | "all";
  country: CountryCode | "all";
  completeness: CompletenessFilter;
  date: DateFilter;
  /**
   * Étape du workflow. Utilisée par la page Suivi (spec §18), qui est une vue
   * filtrée de la liste des dossiers et non une liste séparée : sans ce champ,
   * la page aurait dû réimplémenter sa propre pagination.
   */
  step: WorkflowStep | "all";
  page: number;
  pageSize: number;
}

export interface DossierPage {
  rows: Dossier[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Libellés affichables. Source unique : aucune page ne réécrit ces textes. */
export const STATE_LABELS: Record<DossierState, string> = {
  RECU: "Reçu",
  EN_VERIFICATION: "En vérification",
  INCOMPLET: "Incomplet",
  TRANSMIS_OCO: "Transmis OCO",
  AVIS_RECU: "Avis reçu",
  A_VALIDER: "À valider",
  VALIDE: "Validé",
  EN_MOBILITE: "En mobilité",
  EN_SUIVI: "En suivi",
  DIPLOME: "Diplômé",
  REJETE: "Rejeté",
};

export const STEP_LABELS: Record<WorkflowStep, string> = {
  CANDIDATURE: "Candidature",
  ORIENTATION: "Orientation",
  MOBILITE: "Mobilité",
  SUIVI: "Suivi",
  DIPLOME: "Diplôme",
};

export const DOCUMENT_LABELS: Record<DocumentStatus, string> = {
  MANQUANT: "Manquant",
  A_VERIFIER: "À vérifier",
  VALIDE: "Validé",
  REFUSE: "Refusé",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  HAUTE: "Haute",
  NORMALE: "Normale",
  BASSE: "Basse",
};
