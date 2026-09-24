/**
 * Données de démonstration du portail Parent — **module réservé au serveur**.
 *
 * Ce fichier ne doit jamais être importé par un composant marqué "use client".
 * Deux raisons :
 *
 * Les données de démonstration du portail Parent sont réservées au serveur.
 * Les espaces hors PAP ne reçoivent pas de données de fiche PAP.
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
  ParentDashboardData,
  ParentProfile,
  StudentSummary,
} from "./parent-types";

/* ------------------------------------------------------------------ *
 * Données publiques du dossier.
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
    label: "Mobilité & simulation STSS",
    shortLabel: "Mobilité",
    description:
      "Scénario de transfert de la scolarité vers l'établissement d'accueil, sans mouvement financier ni quittance.",
    state: "completed",
    date: "22 Août 2026",
    actor: "Trésorerie STSS & Antenne Dakar",
    items: [
      { label: "Scénario de scolarité STSS", value: "850 000 FCFA simulés pour l'UCAD — aucun mouvement", ok: true },
      { label: "Document financier", value: "Aucun document disponible dans cet aperçu", ok: false },
      { label: "Visa & titre de séjour", value: "Dossier présenté dans le scénario", ok: true },
    ],
  },
  {
    id: "SUIVI",
    order: 4,
    label: "Suivi & accompagnement",
    shortLabel: "Suivi",
    description:
       "Accueil à l'arrivée, installation et suivi régulier de l'intégration.",
    state: "current",
    date: "Depuis le 15 Septembre 2026",
     actor: "Antenne Dakar",
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
  statusLabel: "Simulation de scénario — solde à échoir",
  nextDueDate: "15 Novembre 2026",
  beneficiary: "UCAD — établissement représenté dans le scénario",
  transactions: [
    {
      id: "TX-STSS-2026-4471",
      label: "Scénario de scolarité (STSS)",
      amount: 850_000,
      date: "22 Août 2026",
       status: "SIMULATION",
       reference: "EA-STSS-UCAD-0125",
    },
    {
      id: "TX-STSS-2026-4472",
      label: "Solde de scolarité (STSS)",
      amount: 400_000,
      date: "15 Novembre 2026",
       status: "SIMULATION",
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
    name: "Aperçu STSS — scénario de scolarité",
    category: "FINANCIER",
     status: "PENDING",
     uploadedAt: "22 Août 2026",
     sizeLabel: null,

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
    from: "Antenne Dakar",
    fromRole: "Service suivi",
    subject: "Arrivée et installation",
    preview: "Le suivi administratif de l'arrivée est terminé.",
    date: "15 Septembre 2026",
    read: false,
  },
  {
    id: "msg-2",
    from: "Service scolarité EA-POMRA",
    fromRole: "Trésorerie STSS",
    subject: "Échéance du solde de scolarité",
    preview:
      "Le solde de 400 000 FCFA est présenté comme une étape future dans l'aperçu, sans action financière.",
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
     title: "Aperçu STSS affiché",
     message:
       "Le scénario de versement est affiché dans l'espace finances. Aucun reçu réel n'est disponible.",
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
    detail: "Étapes validées — parcours en cours",
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
    label: "Scénario de scolarité",
    value: "68 %",
    detail: "850 000 sur 1 250 000 FCFA simulés — aucun mouvement",
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
  title: "Solde de scolarité à consulter",
  description:
     "Le solde de 400 000 FCFA est affiché comme scénario. Aucune action financière n'est demandée dans cette version.",
  dueDate: "15 Novembre 2026",
  href: "/parent/finances",
  ctaLabel: "Voir le détail de la simulation",
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
    // Les espaces hors PAP ne reçoivent pas de données de fiche PAP.
    documents: DOCUMENTS,
    messages: MESSAGES,
    notifications: NOTIFICATIONS,
    nextAction: NEXT_ACTION,
  })
);

/** Rappel à l'usage des composants serveur : jamais de nom complet inventé. */
export const PARENT_STUDENT_DISPLAY_NAME = STUDENT.displayName;
