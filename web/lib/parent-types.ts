/**
 * Types du portail Parent.
 *
 * Volontairement séparés de `lib/types.ts` (espace Étudiant) : les deux espaces
 * ne partagent que `NotificationItem`, et mélanger leurs modèles ferait
 * diverger une même structure au gré des besoins de l'un ou de l'autre.
 *
 * Règle de conception : un type du portail Parent ne doit exposer que ce qu'un
 * parent a légitimement le droit de voir. La confidentialité du Pôle PAP se
 * joue donc ici, dans la forme du type — pas seulement dans l'affichage.
 */
import type { NotificationItem } from "./types";

/** Les cinq étapes du parcours, dans leur ordre chronologique. */
export type JourneyStatus =
  | "CANDIDATURE"
  | "ORIENTATION"
  | "MOBILITE"
  | "SUIVI"
  | "REUSSITE";

export type JourneyStepState = "completed" | "current" | "upcoming";

export interface JourneyStep {
  id: JourneyStatus;
  /** Position dans le parcours, à partir de 1. */
  order: number;
  label: string;
  /** Libellé court, pour la frise compacte du tableau de bord. */
  shortLabel: string;
  description: string;
  state: JourneyStepState;
  /** Date lisible (« 12 Mai 2026 »). Absente tant que l'étape n'est pas datée. */
  date?: string;
  /** Qui a agi à cette étape. */
  actor?: string;
  /** Pièces justificatives ou faits marquants rattachés à l'étape. */
  items?: JourneyStepItem[];
}

export interface JourneyStepItem {
  label: string;
  value: string;
  ok: boolean;
}

export interface StudentSummary {
  id: string;
  /** Référence de dossier, unique dans tout le réseau (ex. « BF-2026-00125 »). */
  reference: string;
  firstName: string;
  lastName: string;
  /**
   * Nom d'usage affiché dans l'interface. Le nom complet n'est pas systématique :
   * on n'affiche que ce que le parent a fourni au moment de l'inscription.
   */
  displayName: string;
  initials: string;
  originCountry: string;
  originFlag: string;
  hostCountry: string;
  hostFlag: string;
  hostCity: string;
  university: string;
  program: string;
  degreeLevel: string;
  academicYear: string;
  enrollmentDate: string;
  status: JourneyStatus;
  statusLabel: string;
  /** Index de l'étape en cours dans `journey`, à partir de 0. */
  currentStepIndex: number;
}

/** Indicateur de synthèse affiché en haut du tableau de bord. */
export interface KpiItem {
  /** Identifiant stable : le composant y associe une icône. Jamais un libellé. */
  id: "parcours" | "scolarite" | "finances" | "documents";
  label: string;
  value: string;
  detail: string;
  tone: "blue" | "green" | "gold" | "warning";
}

export type CourseStatus = "VALIDATED" | "PENDING" | "RETAKE";

export interface CourseResult {
  code: string;
  title: string;
  credits: number;
  /** `null` tant que la note n'est pas publiée — jamais 0, qui signifierait un échec. */
  grade: number | null;
  status: CourseStatus;
}

export interface AcademicSummary {
  semester: string;
  /** Moyenne générale, `null` si aucun relevé n'est encore publié. */
  average: number | null;
  /** Taux de présence en pourcentage, `null` si non mesuré. */
  attendanceRate: number | null;
  creditsValidated: number;
  creditsTotal: number;
  courses: CourseResult[];
  lastReportDate: string | null;
  /** Commentaire du tuteur académique, rédigé pour être lu par la famille. */
  tutorComment: string | null;
}

export type FinanceStatus = "SECURED" | "PENDING" | "OVERDUE";

export interface TransactionItem {
  id: string;
  label: string;
  amount: number;
  date: string;
  status: "Confirmé" | "En attente" | "Programmé";
  reference: string;
  /** Chemin de la quittance. Absent tant que la pièce n'est pas émise. */
  proofUrl?: string;
}

export interface FinanceSummary {
  currency: string;
  tuitionTotal: number;
  tuitionPaid: number;
  status: FinanceStatus;
  statusLabel: string;
  nextDueDate: string | null;
  beneficiary: string;
  transactions: TransactionItem[];
}

export type DocumentCategory =
  | "IDENTITE"
  | "ACADEMIQUE"
  | "FINANCIER"
  | "MOBILITE";

export type DocumentStatus = "VALIDATED" | "PENDING" | "MISSING";

export interface DocumentItem {
  id: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  uploadedAt: string | null;
  sizeLabel: string | null;
  /** Absent lorsque la pièce n'est pas encore fournie ou pas encore validée. */
  url?: string;
}

export interface MessagePreview {
  id: string;
  from: string;
  fromRole: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
}

export interface ParentProfile {
  id: string;
  fullName: string;
  relation: string;
  email: string;
  phone: string;
  /** Antenne de rattachement, pour le contact de proximité. */
  antenneCountry: string;
  antenneFlag: string;
  antennePhone: string;
  antenneEmail: string;
}

/** Agrégat complet consommé par le tableau de bord. */
export interface ParentDashboardData {
  parent: ParentProfile;
  student: StudentSummary;
  journey: JourneyStep[];
  kpis: KpiItem[];
  academic: AcademicSummary;
  finance: FinanceSummary;
  documents: DocumentItem[];
  messages: MessagePreview[];
  notifications: NotificationItem[];
  /**
   * Prochaine action attendue du parent, ou `null` s'il n'y en a aucune.
   * Piloté par les données : l'interface ne décide jamais qu'une action est due.
   */
  nextAction: NextAction | null;
}

export interface NextAction {
  title: string;
  description: string;
  dueDate: string | null;
  href: string;
  ctaLabel: string;
  severity: "info" | "warning";
}
