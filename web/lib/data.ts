import { Antenne, StudentProfile, NotificationItem, TimelineEvent } from "./types";

export const ANTENNES_EA_POMRA: Antenne[] = [
  {
    id: "sn",
    code: "SN",
    country: "Sénégal",
    city: "Dakar",
    flag: "🇸🇳",
    coordinator: "Mme Aïssatou Diallo",
    phone: "+221 77 450 12 34",
    email: "antenne.senegal@ea-pomra.org",
    address: "Avenue Cheikh Anta Diop, Fann-Point E, Dakar",
    partnersCount: 14,
    studentsCount: 320,
  },
  {
    id: "ci",
    code: "CI",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    flag: "🇨🇮",
    coordinator: "Dr. Kouamé Brou",
    phone: "+225 07 88 12 45 90",
    email: "antenne.ci@ea-pomra.org",
    address: "Cocody Deux Plateaux, Boulevard des Martyrs, Abidjan",
    partnersCount: 18,
    studentsCount: 450,
  },
  {
    id: "cm",
    code: "CM",
    country: "Cameroun",
    city: "Douala & Yaoundé",
    flag: "🇨🇲",
    coordinator: "M. Paul Henri Mbarga",
    phone: "+237 699 34 56 78",
    email: "antenne.cameroun@ea-pomra.org",
    address: "Quartier Bonapriso, Rue Tokoto, Douala",
    partnersCount: 12,
    studentsCount: 290,
  },
  {
    id: "ga",
    code: "GA",
    country: "Gabon",
    city: "Libreville",
    flag: "🇬🇦",
    coordinator: "Mme Sylvie Ondo",
    phone: "+241 66 12 34 56",
    email: "antenne.gabon@ea-pomra.org",
    address: "Boulevard Triomphal Omar Bongo, Libreville",
    partnersCount: 8,
    studentsCount: 180,
  },
  {
    id: "bj",
    code: "BJ",
    country: "Bénin",
    city: "Cotonou",
    flag: "🇧🇯",
    coordinator: "M. Romuald Dossou",
    phone: "+229 97 23 45 67",
    email: "antenne.benin@ea-pomra.org",
    address: "Haie Vive, Avenue Mgr Steinmetz, Cotonou",
    partnersCount: 9,
    studentsCount: 210,
  },
  {
    id: "tg",
    code: "TG",
    country: "Togo",
    city: "Lomé",
    flag: "🇹🇬",
    coordinator: "Dr. Koffi Mensah",
    phone: "+228 90 12 34 56",
    email: "antenne.togo@ea-pomra.org",
    address: "Boulevard du 13 Janvier, Quartier Administratif, Lomé",
    partnersCount: 7,
    studentsCount: 165,
  },
  {
    id: "cg",
    code: "CG",
    country: "Congo (Brazzaville)",
    city: "Brazzaville",
    flag: "🇨🇬",
    coordinator: "M. Christian Makosso",
    phone: "+242 06 678 90 12",
    email: "antenne.congo@ea-pomra.org",
    address: "Centre-Ville, Avenue Amilcar Cabral, Brazzaville",
    partnersCount: 6,
    studentsCount: 140,
  },
  {
    id: "cd",
    code: "CD",
    country: "RD Congo",
    city: "Kinshasa",
    flag: "🇨🇩",
    coordinator: "Mme Chantal Kalala",
    phone: "+243 81 234 56 78",
    email: "antenne.rdc@ea-pomra.org",
    address: "Gombe, Boulevard du 30 Juin, Kinshasa",
    partnersCount: 15,
    studentsCount: 380,
  },
];

export const MOCK_ACTIVE_STUDENT: StudentProfile = {
  id: "std-001",
  idPombra: "SN-2026-8492",
  firstName: "Moussa",
  lastName: "Traoré",
  email: "moussa.traore@etudiant.ea-pomra.org",
  phone: "+221 77 821 90 44",
  whatsapp: "+221 77 821 90 44",
  originCountry: "Sénégal",
  originFlag: "🇸🇳",
  targetCountry: "Côte d'Ivoire",
  targetFlag: "🇨🇮",
  targetUniversity: "Institut National Polytechnique Félix Houphouët-Boigny (INP-HB)",
  program: "Master en Ingénierie des Systèmes Numériques & IA",
  degreeLevel: "Master 1",
  academicYear: "2026 - 2027",
  status: "STSS_CONFIRMED",
  statusLabel: "Scolarité sécurisée STSS • Parcours en cours",
  currentStepIndex: 2, // 0: Candidature, 1: OCO Validé, 2: Mobilité/STSS, 3: PAP/Arrivée
  ocoFeedback: {
    date: "18 Juillet 2026",
    verdict: "Favorable",
    expertName: "Dr. Amadou Ba (Conseiller OCO Sénégal)",
    comment: "Excellent dossier académique. Profil en parfaite adéquation avec le Master d'excellence visé. Recommandation pleine pour l'accueil à Yamoussoukro/Abidjan.",
  },
  stssTransaction: {
    id: "TX-STSS-2026-9810",
    amount: 1850000,
    currency: "FCFA",
    status: "Confirmé",
    tuitionPaidDate: "14 Août 2026",
    beneficiaryUniversity: "Agent comptable INP-HB (Trésor Public CI)",
    transferProofUrl: "/docs/attestation-stss-9810.pdf",
    referenceCode: "EA-STSS-INP-8492",
  },
  parentContact: {
    name: "M. Ibrahima Traoré (Père)",
    relation: "Parent référent",
    phone: "+221 70 334 55 66",
    email: "ibrahima.traore@famille.sn",
    hasPortalAccess: true,
  },
};

export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    title: "Attestation de Transfert STSS émise & Scolarité validée",
    date: "14 Août 2026",
    description: "Le versement de 1 850 000 FCFA a été viré directement et certifié auprès du compte de l'établissement d'accueil. Quittance officielle générée.",
    status: "completed",
    actor: "Trésorier National Antenne Sénégal & Côte d'Ivoire",
    badgeText: "STSS Certifié",
  },
  {
    title: "Avis d'Orientation Favorable (Comité OCO)",
    date: "18 Juillet 2026",
    description: "Validation du projet académique par la commission d'experts OCO. Dossier transmis à l'antenne ivoirienne pour facilitation d'hébergement.",
    status: "completed",
    actor: "Pôle Orientation OCO",
    badgeText: "Avis Favorable",
  },
  {
    title: "Dépôt initial du dossier & Pièces justificatives",
    date: "2 Juillet 2026",
    description: "Vérification des relevés de notes de Licence 3, passeport et lettre de motivation. Attribution de l'identifiant crypté ID-POMRA.",
    status: "completed",
    actor: "Étudiant & Antenne Dakar",
    badgeText: "ID-POMRA Actif",
  },
  {
    title: "Démarrage des cours & Suivi de rentrée",
    date: "18 Septembre 2026",
    description: "Intégration pédagogique et premier rapport de suivi trimestriel partagé avec la famille via l'Espace Parent.",
    status: "upcoming",
    actor: "Coordination Académique",
    badgeText: "Étape future",
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Votre attestation STSS est disponible",
    message: "Le reçu officiel certifié de votre scolarité (1 850 000 FCFA) est prêt à être téléchargé pour vos démarches de visa/résidence.",
    date: "Il y a 2 jours",
    read: false,
    type: "success",
    link: "#finances",
  },
  {
    id: "notif-3",
    title: "Espace Parent synchronisé",
    message: "Votre père M. Ibrahima Traoré a consulté le statut de votre inscription.",
    date: "Il y a 1 semaine",
    read: true,
    type: "info",
  },
];

export const KEY_METRICS = [
  { label: "Pays interconnectés", value: "8 pays", detail: "Afrique de l'Ouest et Centrale" },
  { label: "Étudiants accompagnés", value: "2 100+", detail: "Depuis la création du réseau" },
  { label: "Taux de réussite académique", value: "96.4%", detail: "Selon les données déclarées" },
  { label: "Fonds scolarité sécurisés (STSS)", value: "100%", detail: "Zéro litige, traçabilité totale" },
];

export const PILLARS = [
  {
    id: "orientation",
    tag: "Pilier 1",
    title: "Orientation & Choix de Filière",
    subtitle: "Pôle OCO (Orientation et Conseil aux Opportunités)",
    description: "Ne laissez rien au hasard. Des experts académiques analysent les débouchés réels, le niveau requis et valident l'adéquation de votre projet avant tout engagement financier.",
    icon: "Compass",
    highlight: "Avis officiel délivré sous 72h",
  },
  {
    id: "stss",
    tag: "Pilier 2",
    title: "Mobilité & Transfert Sécurisé (STSS)",
    subtitle: "Système de Transfert Sécurisé de Scolarité",
    description: "Les familles déposent les frais de scolarité auprès de l'antenne locale de départ. Les fonds sont virés directement à l'établissement d'accueil avec quittance légale instantanée.",
    icon: "ShieldCheck",
    highlight: "Protection anti-fraude & zéro détournement",
  },
  {
    id: "reussite",
    tag: "Pilier 3",
    title: "Suivi Continu & Réussite jusqu'au Diplôme",
    subtitle: "Transparence partagée Famille - Étudiant - Institution",
    description: "Rapports trimestriels réguliers, suivi des crédits validés et lien permanent avec les parents qui peuvent suivre la progression en temps réel sans intrusion.",
    icon: "GraduationCap",
    highlight: "96.4% de réussite au diplôme",
  },
];

/* ------------------------------------------------------------------ *
 * Dérivés — source unique de vérité pour l'espace Étudiant.
 * Les pages ne doivent jamais recoder ces valeurs en dur.
 * ------------------------------------------------------------------ */

export const STUDENT_FULL_NAME = `${MOCK_ACTIVE_STUDENT.firstName} ${MOCK_ACTIVE_STUDENT.lastName}`;

export const STUDENT_INITIALS = `${MOCK_ACTIVE_STUDENT.firstName.charAt(
  0
)}${MOCK_ACTIVE_STUDENT.lastName.charAt(0)}`;

/** Antenne du pays d'accueil (là où l'étudiant effectue sa mobilité). */
export const STUDENT_HOST_ANTENNE =
  ANTENNES_EA_POMRA.find(
    (antenne) => antenne.country === MOCK_ACTIVE_STUDENT.targetCountry
  ) ?? ANTENNES_EA_POMRA[0];

/** Antenne du pays d'origine (celle qui a reçu le dossier). */
export const STUDENT_HOME_ANTENNE =
  ANTENNES_EA_POMRA.find(
    (antenne) => antenne.country === MOCK_ACTIVE_STUDENT.originCountry
  ) ?? ANTENNES_EA_POMRA[0];
