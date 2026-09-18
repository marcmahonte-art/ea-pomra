/**
 * Données de démonstration du portail Parent — **module réservé au serveur**.
 *
 * Ce fichier ne doit jamais être importé par un composant marqué "use client".
 * Deux raisons :
 *
 * 1. Il contient `RAW_PAP_RECORD`, l'enregistrement brut du suivi psychosocial,
 *    qui inclut des notes de séance. Les importer dans un composant client
 *    reviendrait à les envoyer au navigateur — c'est-à-dire à les divulguer.
 * 2. La projection `toPapSummary()` doit s'exécuter côté serveur pour que la
 *    confidentialité soit garantie par l'architecture, et non par une condition
 *    d'affichage que n'importe quel correctif pourrait retirer.
 *
 * Le jour où l'API réelle existera, seul le contenu de `buildParentDashboardData`
 * changera : les composants consomment déjà le type `ParentDashboardData`.
 */
import { cache } from "react";
import type { NotificationItem } from "./types";
import type {
  AcademicSummary,
  DocumentItem,
  FinanceSummary,
  JourneyStep,
  KpiItem,
  MessagePreview,
  NextAction,
  PapSummary,
  ParentDashboardData,
  ParentProfile,
  StudentSummary,
  WellbeingLevel,
} from "./parent-types";

/* ------------------------------------------------------------------ *
 * Étape 1 — l'enregistrement brut, côté serveur uniquement.
 * ------------------------------------------------------------------ */

/**
 * Forme interne du suivi PAP. Elle contient ce que le parent ne doit pas voir.
 * Non exportée : aucun autre module ne peut y accéder.
 */
interface RawPapRecord {
  referentName: string;
  referentTitle: string;
  referentPhone: string;
  referentEmail: string;
  lastCheckIn: string;
  wellbeingLevel: WellbeingLevel;
  supportPlanActive: boolean;
  exchangesCount: number;
  confidentialityNotice: string;
  /** Notes de séance rédigées par la référente. Jamais transmises au parent. */
  sessionNotes: string[];
  /** Signalements internes à destination du pôle. Jamais transmis au parent. */
  internalFlags: string[];
}

const RAW_PAP_RECORD: RawPapRecord = {
  referentName: "Mme Fatou Sarr",
  referentTitle: "Référente Pôle PAP — Antenne Dakar",
  referentPhone: "+221 77 512 44 08",
  referentEmail: "pap.dakar@ea-pomra.org",
  lastCheckIn: "15 Septembre 2026 — accueil à l'aéroport Blaise Diagne",
  wellbeingLevel: "SERENE",
  supportPlanActive: false,
  exchangesCount: 3,
  confidentialityNotice:
    "Le contenu des échanges entre votre enfant et sa référente reste strictement confidentiel. " +
    "Vous êtes informé du niveau d'accompagnement, jamais de son contenu.",
  // --- Champs volontairement retirés par toPapSummary() ---
  sessionNotes: [
    "Premier entretien : bonne capacité d'adaptation, exprime une légère appréhension sur le rythme universitaire.",
    "Deuxième entretien : logement stabilisé, budget mensuel clarifié avec la référente.",
  ],
  internalFlags: ["Suivi de proximité hebdomadaire pendant le premier mois"],
};

const WELLBEING_LABELS: Record<WellbeingLevel, string> = {
  SERENE: "Sereine et bien installée",
  ATTENTION: "Un point d'attention suivi par le pôle",
  RENFORCE: "Accompagnement renforcé en cours",
};

/**
 * Projette l'enregistrement brut vers la seule vue autorisée pour un parent.
 *
 * L'implémentation énumère explicitement les champs conservés — plutôt que de
 * recopier l'objet puis d'en supprimer — pour qu'un champ ajouté demain au
 * modèle interne soit **exclu par défaut** et non exposé par oubli.
 */
function toPapSummary(record: RawPapRecord): PapSummary {
  return {
    referentName: record.referentName,
    referentTitle: record.referentTitle,
    referentPhone: record.referentPhone,
    referentEmail: record.referentEmail,
    lastCheckIn: record.lastCheckIn,
    wellbeingLevel: record.wellbeingLevel,
    wellbeingLabel: WELLBEING_LABELS[record.wellbeingLevel],
    supportPlanActive: record.supportPlanActive,
    exchangesCount: record.exchangesCount,
    confidentialityNotice: record.confidentialityNotice,
  };
}

/* ------------------------------------------------------------------ *
 * Étape 2 — données publiques du dossier.
 * ------------------------------------------------------------------ */

const PARENT: ParentProfile = {
  id: "par-001",
  fullName: "M. Idrissa Kaboré",
  relation: "Père",
  email: "idrissa.kabore@famille.bf",
  phone: "+226 70 22 41 87",
  antenneCountry: "Burkina Faso",
  antenneFlag: "🇧🇫",
  antennePhone: "+226 25 33 18 90",
  antenneEmail: "antenne.burkina@ea-pomra.org",
};

const STUDENT: StudentSummary = {
  id: "std-002",
  reference: "BF-2026-00125",
  firstName: "Aïcha",
  lastName: "Kaboré",
  // Le parent a déclaré « Aïcha Kaboré » à l'inscription ; on n'affiche pas de
  // nom complet reconstitué qui ne figurerait sur aucune pièce officielle.
  displayName: "Aïcha K.",
  initials: "AK",
  originCountry: "Burkina Faso",
  originFlag: "🇧🇫",
  hostCountry: "Sénégal",
  hostFlag: "🇸🇳",
  hostCity: "Dakar",
  university: "Université Cheikh Anta Diop (UCAD)",
  program: "Licence Économie & Gestion — parcours Analyse économique",
  degreeLevel: "Licence 2",
  academicYear: "2026 - 2027",
  enrollmentDate: "12 Mai 2026",
  status: "SUIVI",
  statusLabel: "Installée à Dakar — suivi de rentrée en cours",
  currentStepIndex: 3,
};

const JOURNEY: JourneyStep[] = [
  {
    id: "CANDIDATURE",
    order: 1,
    label: "Candidature",
    shortLabel: "Candidature",
    description:
      "Constitution et dépôt du dossier auprès de l'antenne de proximité, puis attribution de la référence de dossier.",
    state: "completed",
    date: "12 Mai 2026",
    actor: "Antenne EA-POMRA Burkina Faso",
    items: [
      { label: "Pièces d'identité", value: "Passeport vérifié", ok: true },
      { label: "Relevés académiques", value: "Licence 1 — 2 semestres", ok: true },
      { label: "Référence attribuée", value: "BF-2026-00125", ok: true },
    ],
  },
  {
    id: "ORIENTATION",
    order: 2,
    label: "Orientation & avis OCO",
    shortLabel: "Orientation",
    description:
      "Analyse du projet académique par le comité d'experts du pôle OCO et délivrance d'un avis officiel.",
    state: "completed",
    date: "30 Juin 2026",
    actor: "Comité OCO — Pôle Orientation",
    items: [
      { label: "Verdict du comité", value: "Avis favorable", ok: true },
      { label: "Établissement retenu", value: "UCAD — Dakar", ok: true },
      { label: "Filière confirmée", value: "Licence 2 Économie & Gestion", ok: true },
    ],
  },
  {
    id: "MOBILITE",
    order: 3,
    label: "Mobilité & transfert sécurisé",
    shortLabel: "Mobilité",
    description:
      "Transfert de la scolarité par le dispositif STSS directement à l'établissement d'accueil, puis préparation du départ.",
    state: "completed",
    date: "22 Août 2026",
    actor: "Trésorerie STSS & Antenne Dakar",
    items: [
      { label: "1er versement STSS", value: "850 000 FCFA virés à l'UCAD", ok: true },
      { label: "Quittance officielle", value: "Émise le 22 Août 2026", ok: true },
      { label: "Visa & titre de séjour", value: "Dossier déposé", ok: true },
    ],
  },
  {
    id: "SUIVI",
    order: 4,
    label: "Suivi & accompagnement",
    shortLabel: "Suivi",
    description:
      "Accueil à l'arrivée, installation, rattachement à une référente PAP et suivi régulier de l'intégration.",
    state: "current",
    date: "Depuis le 15 Septembre 2026",
    actor: "Pôle PAP — Antenne Dakar",
    items: [
      { label: "Accueil à l'aéroport", value: "15 Septembre 2026", ok: true },
      { label: "Logement", value: "Résidence universitaire confirmée", ok: true },
      { label: "Certificat médical de rentrée", value: "Pièce à fournir", ok: false },
    ],
  },
  {
    id: "REUSSITE",
    order: 5,
    label: "Réussite & diplomation",
    shortLabel: "Réussite",
    description:
      "Suivi pédagogique trimestriel, validation des crédits et accompagnement jusqu'à l'obtention du diplôme.",
    state: "upcoming",
    date: "Juin 2027",
    actor: "Coordination académique",
  },
];

const ACADEMIC: AcademicSummary = {
  semester: "Semestre 1 — 2026 / 2027",
  // Aucun relevé publié à ce stade de la rentrée : `null` et non 0.
  average: null,
  attendanceRate: 94,
  creditsValidated: 0,
  creditsTotal: 30,
  lastReportDate: null,
  tutorComment:
    "Aïcha a pris ses marques rapidement et participe régulièrement. Le premier relevé de notes est attendu fin décembre.",
  courses: [
    { code: "ECO-201", title: "Microéconomie II", credits: 6, grade: null, status: "PENDING" },
    { code: "ECO-202", title: "Macroéconomie II", credits: 6, grade: null, status: "PENDING" },
    { code: "STA-210", title: "Statistiques appliquées", credits: 6, grade: null, status: "PENDING" },
    { code: "MAT-205", title: "Mathématiques financières", credits: 6, grade: null, status: "PENDING" },
    { code: "ANG-201", title: "Anglais économique", credits: 6, grade: null, status: "PENDING" },
  ],
};

const FINANCE: FinanceSummary = {
  currency: "FCFA",
  tuitionTotal: 1_250_000,
  tuitionPaid: 850_000,
  status: "PENDING",
  statusLabel: "1er versement sécurisé — solde à échoir",
  nextDueDate: "15 Novembre 2026",
  beneficiary: "Agent comptable UCAD (Trésor Public du Sénégal)",
  transactions: [
    {
      id: "TX-STSS-2026-4471",
      label: "1er versement de scolarité (STSS)",
      amount: 850_000,
      date: "22 Août 2026",
      status: "Confirmé",
      reference: "EA-STSS-UCAD-0125",
      proofUrl: "/docs/quittance-stss-4471.pdf",
    },
    {
      id: "TX-STSS-2026-4472",
      label: "Solde de scolarité (STSS)",
      amount: 400_000,
      date: "15 Novembre 2026",
      status: "Programmé",
      reference: "EA-STSS-UCAD-0126",
    },
  ],
};

const DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-1",
    name: "Passeport — page d'identité",
    category: "IDENTITE",
    status: "VALIDATED",
    uploadedAt: "12 Mai 2026",
    sizeLabel: "1,2 Mo",
    url: "/docs/passeport-kabore.pdf",
  },
  {
    id: "doc-2",
    name: "Relevé de notes — Licence 1",
    category: "ACADEMIQUE",
    status: "VALIDATED",
    uploadedAt: "12 Mai 2026",
    sizeLabel: "820 Ko",
    url: "/docs/releve-l1-kabore.pdf",
  },
  {
    id: "doc-3",
    name: "Attestation de baccalauréat",
    category: "ACADEMIQUE",
    status: "VALIDATED",
    uploadedAt: "12 Mai 2026",
    sizeLabel: "640 Ko",
    url: "/docs/bac-kabore.pdf",
  },
  {
    id: "doc-4",
    name: "Quittance STSS — 1er versement",
    category: "FINANCIER",
    status: "VALIDATED",
    uploadedAt: "22 Août 2026",
    sizeLabel: "310 Ko",
    url: "/docs/quittance-stss-4471.pdf",
  },
  {
    id: "doc-5",
    name: "Attestation d'inscription UCAD",
    category: "MOBILITE",
    status: "PENDING",
    uploadedAt: "10 Septembre 2026",
    sizeLabel: "450 Ko",
  },
  {
    id: "doc-6",
    name: "Certificat médical de rentrée",
    category: "MOBILITE",
    status: "MISSING",
    uploadedAt: null,
    sizeLabel: null,
  },
];

const MESSAGES: MessagePreview[] = [
  {
    id: "msg-1",
    from: "Mme Fatou Sarr",
    fromRole: "Référente PAP — Antenne Dakar",
    subject: "Bien arrivée et installée",
    preview:
      "Aïcha est bien arrivée. L'installation en résidence est terminée et la rentrée s'est déroulée sans difficulté.",
    date: "15 Septembre 2026",
    read: false,
  },
  {
    id: "msg-2",
    from: "Service scolarité EA-POMRA",
    fromRole: "Trésorerie STSS",
    subject: "Échéance du solde de scolarité",
    preview:
      "Le solde de 400 000 FCFA sera à déposer auprès de l'antenne de Ouagadougou avant le 15 novembre 2026.",
    date: "10 Septembre 2026",
    read: true,
  },
];

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "pnotif-1",
    title: "Aïcha est arrivée à Dakar",
    message:
      "L'accueil à l'aéroport a été assuré par l'antenne locale le 15 septembre. Le logement universitaire est confirmé.",
    date: "Il y a 3 jours",
    read: false,
    type: "success",
    link: "/parent/parcours",
  },
  {
    id: "pnotif-2",
    title: "Une pièce est manquante au dossier",
    message:
      "Le certificat médical de rentrée n'a pas encore été fourni. Il doit être transmis avant le 30 septembre 2026.",
    date: "Il y a 5 jours",
    read: false,
    type: "action_required",
    link: "/parent/documents",
  },
  {
    id: "pnotif-3",
    title: "Quittance STSS disponible",
    message:
      "Le reçu officiel du premier versement de 850 000 FCFA est téléchargeable depuis l'espace documents.",
    date: "Il y a 1 semaine",
    read: true,
    type: "info",
    link: "/parent/finances",
  },
];

const KPIS: KpiItem[] = [
  {
    id: "parcours",
    label: "Parcours",
    value: "4 / 5",
    detail: "Étapes validées — suivi de rentrée en cours",
    tone: "blue",
  },
  {
    id: "scolarite",
    label: "Assiduité",
    value: "94 %",
    detail: "Taux de présence — Semestre 1",
    tone: "green",
  },
  {
    id: "finances",
    label: "Scolarité sécurisée",
    value: "68 %",
    detail: "850 000 sur 1 250 000 FCFA transférés à l'UCAD",
    tone: "gold",
  },
  {
    id: "documents",
    label: "Documents",
    value: "2 à traiter",
    detail: "Sur 6 pièces du dossier",
    tone: "warning",
  },
];

const NEXT_ACTION: NextAction = {
  title: "Solde de scolarité à échoir",
  description:
    "Le solde de 400 000 FCFA doit être déposé auprès de l'antenne de Ouagadougou. Les fonds seront virés directement à l'UCAD, avec quittance officielle.",
  dueDate: "15 Novembre 2026",
  href: "/parent/finances",
  ctaLabel: "Voir le détail du transfert",
  severity: "info",
};

/* ------------------------------------------------------------------ *
 * Étape 3 — point d'entrée unique pour les pages serveur.
 * ------------------------------------------------------------------ */

/**
 * Construit l'agrégat complet du tableau de bord.
 *
 * Enveloppée dans `cache()` de React : le layout et la page l'appellent tous
 * les deux, et sans ce cache la construction serait exécutée deux fois par
 * requête. Le jour où l'implémentation interrogera une base de données, cette
 * enveloppe évitera une requête en double — sans qu'aucun appelant change.
 *
 * Déclarée `async` bien que synchrone : c'est la signature que conservera la
 * version connectée à l'API.
 */
export const buildParentDashboardData = cache(
  async (): Promise<ParentDashboardData> => ({
    parent: PARENT,
    student: STUDENT,
    journey: JOURNEY,
    kpis: KPIS,
    academic: ACADEMIC,
    finance: FINANCE,
    // Seul point de passage vers les données PAP : la projection garantit que
    // les notes de séance de RAW_PAP_RECORD n'atteignent jamais le client.
    pap: toPapSummary(RAW_PAP_RECORD),
    documents: DOCUMENTS,
    messages: MESSAGES,
    notifications: NOTIFICATIONS,
    nextAction: NEXT_ACTION,
  })
);

/** Rappel à l'usage des composants serveur : jamais de nom complet inventé. */
export const PARENT_STUDENT_DISPLAY_NAME = STUDENT.displayName;
