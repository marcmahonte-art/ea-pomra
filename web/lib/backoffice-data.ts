/**
 * Données et agrégations des back-offices Antenne et BEC — **module serveur**.
 *
 * Ne jamais importer ce fichier depuis un composant marqué "use client".
 *
 * Référence : `site/SPEC_BACKOFFICE_ANTENNE_BEC.md`.
 *
 * Deux principes structurants, tous deux exigés par la spec :
 *
 * 1. **Rien n'est agrégé côté interface** (§9.5 et §32 : « aucune statistique ne
 *    doit être calculée côté interface si elle nécessite de parcourir toute la
 *    base »). Recherche, filtres, tri, pagination et statistiques sont donc
 *    implémentés ici, et les composants ne reçoivent que des résultats.
 * 2. **Le périmètre est appliqué avant tout le reste** (§23 et §40). Chaque
 *    fonction de lecture commence par `scopeDossiers()`, et refuse par défaut
 *    lorsqu'un agent d'antenne n'a pas de pays de rattachement. Filtrer après
 *    coup serait la porte ouverte à un oubli.
 *
 * Le jeu de données est généré de façon **déterministe** à partir d'une graine
 * textuelle : deux rendus successifs produisent exactement les mêmes valeurs.
 * Une génération aléatoire ferait diverger le HTML serveur du rendu client.
 */
import type {
  ActivityEvent,
  BackofficeNotification,
  BackofficeRole,
  BackofficeScope,
  CountryCode,
  CountryStat,
  Distribution,
  Dossier,
  DossierDocument,
  DossierPage,
  DossierQuery,
  DossierState,
  EvolutionPoint,
  GlobalFilters,
  Kpi,
  NotificationKind,
  OperationalAlert,
  QuarterlyReport,
  ValidationQueueRow,
  WorkflowStep,
} from "./backoffice-types";
import { STATE_LABELS } from "./backoffice-types";
import { isDemoEnabled } from "./server/config";
import { currentPeriod, previousPeriod, referenceDateForScope } from "./server/temporal";

/* ------------------------------------------------------------------ *
 * 1. Utilitaires déterministes
 * ------------------------------------------------------------------ */

/** Hachage FNV-1a : stable, rapide, suffisant pour une graine de démonstration. */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(seed: string, values: readonly T[]): T {
  return values[hash(seed) % values.length];
}

function between(seed: string, min: number, max: number): number {
  return min + (hash(seed) % (max - min + 1));
}

/** Date de référence du jeu de démonstration. */
const REFERENCE_DATE = new Date("2026-09-19T10:42:00.000Z");

function shiftDays(days: number, hourSeed: string): Date {
  const d = new Date(REFERENCE_DATE.getTime() - days * 86_400_000);
  d.setUTCHours(between(`${hourSeed}-h`, 7, 18), between(`${hourSeed}-m`, 0, 59), 0, 0);
  return d;
}

/** Formatage manuel : indépendant de la base ICU du runtime, donc stable. */
function frLabel(date: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${p(date.getUTCDate())}/${p(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}` +
    ` ${p(date.getUTCHours())}:${p(date.getUTCMinutes())}`
  );
}

/* ------------------------------------------------------------------ *
 * 2. Référentiels
 * ------------------------------------------------------------------ */

interface CountryRef {
  code: CountryCode;
  country: string;
  flag: string;
  city: string;
  antenne: string;
  firstNames: readonly string[];
  lastNames: readonly string[];
}

const COUNTRIES: readonly CountryRef[] = [
  {
    code: "SN",
    country: "Sénégal",
    flag: "🇸🇳",
    city: "Dakar",
    antenne: "Antenne Sénégal",
    firstNames: ["Aïssatou", "Moussa", "Fatou", "Cheikh", "Ndèye", "Ousmane"],
    lastNames: ["Diallo", "Ndiaye", "Fall", "Sow", "Ba", "Sarr"],
  },
  {
    code: "CI",
    country: "Côte d'Ivoire",
    flag: "🇨🇮",
    city: "Abidjan",
    antenne: "Antenne Côte d'Ivoire",
    firstNames: ["Adjoua", "Kouassi", "Aya", "Yao", "Awa", "Konan"],
    lastNames: ["Koné", "Kouamé", "Traoré", "Bamba", "Yao", "N'Guessan"],
  },
  {
    code: "CM",
    country: "Cameroun",
    flag: "🇨🇲",
    city: "Douala",
    antenne: "Antenne Cameroun",
    firstNames: ["Ngo", "Éric", "Marie-Claire", "Samuel", "Solange", "Bertrand"],
    lastNames: ["Mbarga", "Nkoulou", "Fouda", "Atangana", "Ndongo", "Biya"],
  },
  {
    code: "GA",
    country: "Gabon",
    flag: "🇬🇦",
    city: "Libreville",
    antenne: "Antenne Gabon",
    firstNames: ["Sylvie", "Ange", "Nadia", "Patrick", "Léa", "Hervé"],
    lastNames: ["Ondo", "Mba", "Nzoghe", "Obame", "Bouyou", "Moussavou"],
  },
  {
    code: "BJ",
    country: "Bénin",
    flag: "🇧🇯",
    city: "Cotonou",
    antenne: "Antenne Bénin",
    firstNames: ["Romuald", "Clarisse", "Sènan", "Gildas", "Blandine", "Arnaud"],
    lastNames: ["Dossou", "Houngbédji", "Zinsou", "Adjovi", "Sagbo", "Tossou"],
  },
  {
    code: "TG",
    country: "Togo",
    flag: "🇹🇬",
    city: "Lomé",
    antenne: "Antenne Togo",
    firstNames: ["Koffi", "Akossiwa", "Yao", "Essi", "Komlan", "Afi"],
    lastNames: ["Mensah", "Adjallé", "Kpodar", "Amégashie", "Dogbé", "Lawson"],
  },
  {
    code: "CG",
    country: "Congo (Brazzaville)",
    flag: "🇨🇬",
    city: "Brazzaville",
    antenne: "Antenne Congo",
    firstNames: ["Christian", "Grâce", "Prince", "Rolf", "Divine", "Franck"],
    lastNames: ["Makosso", "Ngoma", "Bakala", "Samba", "Mouyabi", "Okemba"],
  },
  {
    code: "CD",
    country: "RD Congo",
    flag: "🇨🇩",
    city: "Kinshasa",
    antenne: "Antenne RD Congo",
    firstNames: ["Chantal", "Fiston", "Grâce", "Dieumerci", "Bijou", "Josué"],
    lastNames: ["Kalala", "Mukendi", "Ilunga", "Tshibangu", "Kasongo", "Mbuyi"],
  },
];

/** Programmes et formations rattachées (spec §10.2 : filtres Programme/Formation). */
const PROGRAM_FORMATIONS: readonly { program: string; formations: readonly string[] }[] = [
  {
    program: "Sciences & Ingénierie",
    formations: [
      "Licence Génie logiciel",
      "Master Systèmes numériques & IA",
      "Licence Génie civil",
      "Master Réseaux & Télécoms",
    ],
  },
  {
    program: "Économie & Gestion",
    formations: [
      "Licence Économie & Gestion",
      "Master Finance & Comptabilité",
      "Master Marketing & Commerce",
      "Licence Administration des entreprises",
    ],
  },
  {
    program: "Santé & Sciences de la vie",
    formations: [
      "Licence Sciences biomédicales",
      "Master Santé publique",
      "Licence Biologie",
      "Master Pharmacie industrielle",
    ],
  },
  {
    program: "Droit & Sciences politiques",
    formations: [
      "Licence Droit privé",
      "Master Droit des affaires",
      "Licence Relations internationales",
    ],
  },
  {
    program: "Lettres & Sciences humaines",
    formations: [
      "Licence Lettres modernes",
      "Master Sociologie du développement",
      "Licence Histoire",
    ],
  },
];

export const ALL_PROGRAMS: readonly string[] = PROGRAM_FORMATIONS.map((p) => p.program);
export const ALL_FORMATIONS: readonly string[] = PROGRAM_FORMATIONS.flatMap((p) =>
  p.formations.slice()
);

/** Pièces exigées pour qu'un dossier soit complet. */
const REQUIRED_DOCUMENTS: readonly { name: string; type: string }[] = [
  { name: "Passeport — page d'identité", type: "Identité" },
  { name: "Photo d'identité", type: "Identité" },
  { name: "Attestation de baccalauréat", type: "Diplôme" },
  { name: "Relevé de notes — 2 derniers semestres", type: "Relevé de notes" },
  { name: "Lettre de motivation", type: "Justificatif" },
  { name: "Certificat médical", type: "Certificat médical" },
  { name: "Justificatif de domicile", type: "Justificatif" },
];

/* ------------------------------------------------------------------ *
 * 3. Workflow (spec §36)
 * ------------------------------------------------------------------ */

/**
 * Étape déduite de l'état — jamais saisie en parallèle.
 * Détenir les deux indépendamment garantit qu'ils finiront par se contredire.
 */
const STATE_TO_STEP: Record<DossierState, WorkflowStep> = {
  RECU: "CANDIDATURE",
  EN_VERIFICATION: "CANDIDATURE",
  INCOMPLET: "CANDIDATURE",
  REJETE: "CANDIDATURE",
  TRANSMIS_OCO: "ORIENTATION",
  AVIS_RECU: "ORIENTATION",
  A_VALIDER: "ORIENTATION",
  VALIDE: "MOBILITE",
  EN_MOBILITE: "MOBILITE",
  EN_SUIVI: "SUIVI",
  DIPLOME: "DIPLOME",
};

/** Parcours nominal, dans l'ordre. Les états INCOMPLET et REJETE en dérivent. */
const NOMINAL_PATH: readonly DossierState[] = [
  "RECU",
  "EN_VERIFICATION",
  "TRANSMIS_OCO",
  "AVIS_RECU",
  "A_VALIDER",
  "VALIDE",
  "EN_MOBILITE",
  "EN_SUIVI",
  "DIPLOME",
];

const STATE_ACTION: Record<
  DossierState,
  { action: string; comment: string | null; actor: "ANTENNE" | "BEC" | "SYSTEME" }
> = {
  RECU: { action: "Dossier reçu et enregistré", comment: null, actor: "ANTENNE" },
  EN_VERIFICATION: {
    action: "Vérification des pièces ouverte",
    comment: null,
    actor: "ANTENNE",
  },
  INCOMPLET: {
    action: "Pièce manquante signalée",
    comment: "Relance transmise à la famille",
    actor: "ANTENNE",
  },
  TRANSMIS_OCO: {
    action: "Dossier transmis au comité OCO",
    comment: null,
    actor: "ANTENNE",
  },
  AVIS_RECU: { action: "Avis d'orientation reçu", comment: null, actor: "SYSTEME" },
  A_VALIDER: {
    action: "Validation finale demandée au BEC",
    comment: null,
    actor: "ANTENNE",
  },
  VALIDE: { action: "Dossier validé", comment: "Validation finale BEC", actor: "BEC" },
  EN_MOBILITE: { action: "Mobilité engagée", comment: null, actor: "ANTENNE" },
  EN_SUIVI: { action: "Suivi de rentrée ouvert", comment: null, actor: "ANTENNE" },
  DIPLOME: { action: "Diplôme enregistré", comment: null, actor: "BEC" },
  REJETE: {
    action: "Dossier rejeté",
    comment: "Motif communiqué à la famille",
    actor: "BEC",
  },
};

/** États qui attendent une action de l'agent d'antenne. */
const ACTION_REQUIRED_STATES: readonly DossierState[] = [
  "RECU",
  "EN_VERIFICATION",
  "INCOMPLET",
  "AVIS_RECU",
];

/** États considérés comme « en attente d'un tiers ». */
const PENDING_STATES: readonly DossierState[] = [
  "TRANSMIS_OCO",
  "A_VALIDER",
  "INCOMPLET",
];

const ACTION_FOR_STATE: Partial<Record<DossierState, string>> = {
  RECU: "Ouvrir la vérification des pièces",
  EN_VERIFICATION: "Poursuivre la vérification",
  INCOMPLET: "Relancer la famille pour la pièce manquante",
  AVIS_RECU: "Préparer la transmission au BEC",
};

/* ------------------------------------------------------------------ *
 * 4. Génération du jeu de démonstration
 * ------------------------------------------------------------------ */

const DOSSIERS_PER_COUNTRY = 6;

const STATE_ORDER: readonly DossierState[] = [
  "RECU",
  "EN_VERIFICATION",
  "INCOMPLET",
  "TRANSMIS_OCO",
  "AVIS_RECU",
  "A_VALIDER",
  "VALIDE",
  "EN_MOBILITE",
  "EN_SUIVI",
  "DIPLOME",
  "REJETE",
];

function buildDocuments(seed: string, state: DossierState): DossierDocument[] {
  const documents = REQUIRED_DOCUMENTS.map((doc, index) => {
    const docSeed = `${seed}-doc-${index}`;
    let status: DossierDocument["status"];

    if (state === "RECU") {
      // Dossier tout juste reçu : rien n'est encore vérifié.
      status = index % 3 === 2 ? "MANQUANT" : "A_VERIFIER";
    } else if (state === "VALIDE" || state === "EN_MOBILITE" || state === "EN_SUIVI" || state === "DIPLOME") {
      // Dossier validé : par définition, toutes les pièces l'ont été.
      status = "VALIDE";
    } else {
      status = pick(docSeed, ["VALIDE", "A_VERIFIER", "VALIDE", "REFUSE"] as const);
    }

    // Cohérence : un dossier INCOMPLET doit effectivement avoir une pièce
    // manquante, sinon le filtre « Complétude » et le statut se contrediraient.
    if (state === "INCOMPLET" && index === 1) status = "MANQUANT";

    const addedAt =
      status === "MANQUANT" ? null : frLabel(shiftDays(between(`${docSeed}-d`, 5, 120), docSeed));
    const verifiedBy = status === "VALIDE" ? pick(`${docSeed}-v`, ["Agent Antenne", "Coordonnateur"]) : null;

    return {
      id: `${seed}-doc-${index}`,
      name: doc.name,
      type: doc.type,
      status,
      addedAt,
      verifiedBy,
      updatedAt: addedAt ?? "—",
      comment:
        status === "REFUSE"
          ? "Document illisible : une nouvelle version est demandée."
          : status === "MANQUANT"
            ? "Pièce attendue auprès de la famille."
            : null,
      hasFile: status !== "MANQUANT",
      version: 1,
    };
  });

  return documents;
}

function buildHistory(
  seed: string,
  reference: string,
  studentName: string,
  country: CountryRef,
  state: DossierState,
  updatedAt: Date
): ActivityEvent[] {
  let path: DossierState[];
  if (state === "INCOMPLET") path = ["RECU", "EN_VERIFICATION", "INCOMPLET"];
  else if (state === "REJETE") path = ["RECU", "EN_VERIFICATION", "REJETE"];
  else path = NOMINAL_PATH.slice(0, NOMINAL_PATH.indexOf(state) + 1);

  const coordinator = `${pick(`${seed}-c`, country.firstNames)} ${pick(`${seed}-c2`, country.lastNames)}`;
  const agentName = `${pick(`${seed}-a`, country.firstNames)} ${pick(`${seed}-a2`, country.lastNames)}`;

  return path.map((step, index) => {
    const isLast = index === path.length - 1;
    // Le dernier événement porte la date de mise à jour du dossier ; les
    // précédents remontent dans le temps.
    const at = isLast
      ? updatedAt
      : shiftDays(between(`${seed}-h${index}`, (path.length - index) * 9, (path.length - index) * 9 + 14), `${seed}-h${index}`);
    const meta = STATE_ACTION[step];
    const previous = index > 0 ? path[index - 1] : null;

    return {
      id: `${seed}-ev-${index}`,
      dossierId: seed,
      at: at.toISOString(),
      atLabel: frLabel(at),
      dossierRef: reference,
      studentName,
      action: meta.action,
      fromState: previous,
      toState: step,
      user: meta.actor === "BEC" ? "Service validation BEC" : meta.actor === "SYSTEME" ? "Système" : `${agentName} (${coordinator})`,
      userRole: meta.actor === "BEC" ? "BEC" : meta.actor === "SYSTEME" ? "Système" : "Agent Antenne",
      comment: meta.comment,
    };
  });
}

function buildDossier(country: CountryRef, countryIndex: number, index: number): Dossier {
  const seed = `${country.code}-${index}`;
  const firstName = country.firstNames[index % country.firstNames.length];
  const lastName = country.lastNames[(index * 3 + 1) % country.lastNames.length];
  const studentName = `${firstName} ${lastName}`;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Répartition déterministe : chaque état apparaît, ce qui rend les filtres
  // réellement testables.
  const state = STATE_ORDER[(index * 4 + countryIndex * 5) % STATE_ORDER.length];
  const step = STATE_TO_STEP[state];

  const programEntry = PROGRAM_FORMATIONS[(index + countryIndex) % PROGRAM_FORMATIONS.length];
  const formation = programEntry.formations[(index * 2 + countryIndex) % programEntry.formations.length];

  const documents = buildDocuments(seed, state);
  const validated = documents.filter((d) => d.status === "VALIDE").length;
  const completeness = Math.round((validated / documents.length) * 100);

  const createdDaysAgo = between(`${seed}-cd`, 12, 320);
  const createdAt = shiftDays(createdDaysAgo, `${seed}-cd`);
  const updatedAt = shiftDays(Math.max(1, createdDaysAgo - between(`${seed}-ud`, 1, 10)), `${seed}-ud`);

  const reference = `ID-POMRA-${String(100 + countryIndex * 17 + index * 3).padStart(6, "0")}`;

  const targetIndex = (countryIndex + 3) % COUNTRIES.length;
  const target = COUNTRIES[targetIndex];
  const hasMobilite = state === "VALIDE" || state === "EN_MOBILITE" || state === "EN_SUIVI" || state === "DIPLOME";
  const requiredAction = ACTION_REQUIRED_STATES.includes(state)
    ? (ACTION_FOR_STATE[state] ?? null)
    : null;

  return {
    id: `${country.code}-${index}`,
    reference,
    studentName,
    studentInitials: initials,
    email: `${firstName.toLowerCase().replace(/[^a-z]/g, "")}.${lastName
      .toLowerCase()
      .replace(/[^a-z]/g, "")}@etudiant.ea-pomra.org`,
    phone: `+${between(`${seed}-p`, 200, 249)} ${between(`${seed}-p2`, 60, 99)} ${between(`${seed}-p3`, 100, 999)} ${between(`${seed}-p4`, 10, 99)} ${between(`${seed}-p5`, 10, 99)}`,
    countryCode: country.code,
    country: country.country,
    flag: country.flag,
    antennaCity: country.city,
    program: programEntry.program,
    formation,
    step,
    state,
    completeness,
    createdAt: createdAt.toISOString(),
    createdAtLabel: frLabel(createdAt),
    updatedAt: updatedAt.toISOString(),
    updatedAtLabel: frLabel(updatedAt),
    version: 1,
    priority:
      state === "INCOMPLET" || state === "RECU"
        ? "HAUTE"
        : state === "A_VALIDER" || state === "AVIS_RECU"
          ? "NORMALE"
          : "BASSE",
    requiredAction,
    documents,
    // Aucun contenu de fiche PAP n'est exposé : existence et statut seulement
    // (spec §24).
    pap: {
      exists: hash(`${seed}-pap`) % 3 === 0,
      status: hash(`${seed}-pap`) % 3 === 0 ? (hash(`${seed}-paps`) % 2 === 0 ? "EN_COURS" : "CLOTUREE") : null,
    },
    orientation: {
      transmittedAt:
        step === "ORIENTATION" || step === "MOBILITE" || step === "SUIVI" || step === "DIPLOME"
          ? frLabel(shiftDays(between(`${seed}-ot`, 20, 90), `${seed}-ot`))
          : null,
      verdict:
        state === "AVIS_RECU" || hasMobilite
          ? pick(`${seed}-ov`, ["FAVORABLE", "FAVORABLE", "SOUS_RESERVE"] as const)
          : null,
       orientation: null,
       observations: null,
       reserves: null,
       avisDate:
         step === "ORIENTATION" || step === "MOBILITE" || step === "SUIVI" || step === "DIPLOME"
           ? frLabel(shiftDays(between(`${seed}-ot`, 20, 90), `${seed}-ot`))
           : null,
       expertName:
         state === "AVIS_RECU" || hasMobilite
           ? `Dr. ${pick(`${seed}-oe`, ["Amadou Ba", "Clarisse Dossou", "Serge Ondo", "Awa Koné"])}`
           : null,
    },
    mobilite: hasMobilite
      ? {
          sourceCountry: country.country,
          targetCountry: target.country,
          targetCity: target.city,
          status: state === "DIPLOME" ? "Terminée" : state === "EN_SUIVI" ? "Installé et suivi" : "En préparation",
          updatedAt: updatedAt.toISOString(),
        }
      : null,
    stss:
      state === "EN_MOBILITE" || state === "EN_SUIVI" || state === "DIPLOME"
        ? {
            reference: `TX-STSS-2026-${between(`${seed}-s`, 1000, 9999)}`,
            sourceAntenna: country.antenne,
            targetAntenna: target.antenne,
            amount: between(`${seed}-sa`, 6, 24) * 100_000,
            currency: "FCFA",
            status: pick(`${seed}-ss`, ["Confirmé", "Confirmé", "Programmé", "En attente de preuve"] as const),
            proofUrl: hash(`${seed}-sp`) % 4 === 0 ? null : "/docs/quittance-stss.pdf",
            date: frLabel(shiftDays(between(`${seed}-sd`, 5, 40), `${seed}-sd`)),
          }
        : null,
    overdueTaskCount:
      requiredAction !== null && between(`${seed}-late`, 0, 3) === 0 ? 1 : 0,
  };
}

const ALL_DOSSIERS: readonly Dossier[] = COUNTRIES.flatMap((country, countryIndex) =>
  Array.from({ length: DOSSIERS_PER_COUNTRY }, (_, index) =>
    buildDossier(country, countryIndex, index)
  )
);

/* ------------------------------------------------------------------ *
 * 5. Périmètre (spec §23, §40)
 * ------------------------------------------------------------------ */

/**
 * Applique le périmètre de l'utilisateur.
 *
 * **Refus par défaut** : un agent d'antenne sans pays de rattachement ne voit
 * rien. C'est volontaire — dans le doute, on n'ouvre pas l'accès. Une fonction
 * qui renverrait tout par défaut transformerait une erreur de configuration en
 * fuite de données entre pays.
 */
export function assertMockDataAllowed(): void {
  if (!isDemoEnabled()) {
    throw new Error("Les données de démonstration sont désactivées");
  }
}

export function scopeDossiers(
  scope: BackofficeScope,
  dossiers?: readonly Dossier[]
): Dossier[] {
  if (!dossiers) assertMockDataAllowed();
  const source = dossiers ?? ALL_DOSSIERS;
  if (scope.role === "BEC") return [...source];
  if (!scope.countryCode) return [];
  return source.filter((d) => d.countryCode === scope.countryCode);
}

/**
 * Récupère un dossier **dans le périmètre uniquement**.
 *
 * Spec §40 : « GET /api/dossiers/:id ne doit jamais retourner un dossier
 * simplement parce que l'ID est connu ». Cette fonction est le seul point
 * d'accès à un dossier ; renvoyer `null` conduit la page à un 404.
 */
export function getDossierForScope(
  scope: BackofficeScope,
  id: string,
  dossiers?: readonly Dossier[]
): Dossier | null {
  const allowed = scopeDossiers(scope, dossiers);
  return allowed.find((d) => d.id === id) ?? null;
}

/** Tous les dossiers du périmètre, sans filtre. Réservé aux agrégations internes. */
export function getAllScoped(scope: BackofficeScope, dossiers?: readonly Dossier[]): Dossier[] {
  return scopeDossiers(scope, dossiers);
}

/**
 * Périmètre **puis** filtres globaux, dans cet ordre.
 *
 * L'ordre n'est pas anodin : le périmètre est une contrainte de sécurité, les
 * filtres une commodité d'affichage. Les appliquer dans l'autre sens laisserait
 * croire qu'un filtre peut élargir ce que le périmètre interdit — il ne le peut
 * pas, et cette fonction est le seul endroit où les deux se rencontrent.
 */
function scopedAndFiltered(
  scope: BackofficeScope,
  filters?: GlobalFilters,
  dossiers?: readonly Dossier[]
): Dossier[] {
  const rows = scopeDossiers(scope, dossiers);
  if (!filters) return rows;

  return rows.filter((dossier) => {
    if (filters.country && filters.country !== "all" && dossier.countryCode !== filters.country) {
      return false;
    }
    if (filters.program && filters.program !== "all" && dossier.program !== filters.program) {
      return false;
    }
    if (filters.formation && filters.formation !== "all" && dossier.formation !== filters.formation) {
      return false;
    }
    return true;
  });
}

export function getActivityForScope(
  scope: BackofficeScope,
  dossiers?: readonly Dossier[]
): ActivityEvent[] {
  const allowed = scopeDossiers(scope, dossiers);
  return allowed
    .flatMap((dossier) => {
      // L'historique complet d'un dossier est reconstruit à la demande, sans
      // être stocké sur l'objet : 48 dossiers × 9 événements alourdiraient
      // inutilement chaque réponse.
      const country = COUNTRIES.find((c) => c.code === dossier.countryCode)!;
      return buildHistory(
        dossier.id,
        dossier.reference,
        dossier.studentName,
        country,
        dossier.state,
        new Date(dossier.updatedAt)
      );
    })
    .sort((a, b) => b.at.localeCompare(a.at));
}

/* ------------------------------------------------------------------ *
 * 6. Recherche, filtres, tri, pagination (spec §10 et §32)
 * ------------------------------------------------------------------ */

export const DEFAULT_PAGE_SIZE = 10;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function parseDossierQuery(
  params: Record<string, string | string[] | undefined>
): DossierQuery {
  const first = (key: string): string | undefined => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const page = Number.parseInt(first("page") ?? "1", 10);
  const pageSize = Number.parseInt(first("pageSize") ?? String(DEFAULT_PAGE_SIZE), 10);

  return {
    q: first("q") ?? "",
    state: (first("state") as DossierQuery["state"]) ?? "all",
    program: first("program") ?? "all",
    formation: first("formation") ?? "all",
    country: (first("country") as DossierQuery["country"]) ?? "all",
    completeness: (first("completeness") as DossierQuery["completeness"]) ?? "all",
    date: (first("date") as DossierQuery["date"]) ?? "all",
    step: (first("step") as DossierQuery["step"]) ?? "all",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: [10, 25, 50].includes(pageSize) ? pageSize : DEFAULT_PAGE_SIZE,
  };
}

const DAY_MS = 86_400_000;

/**
 * Filtres globaux lus depuis les paramètres d'URL (spec §9.1).
 *
 * Réutilise les mêmes clés que la liste des dossiers (`country`, `program`,
 * `formation`) : un lien qui filtre le tableau de bord filtre donc aussi la
 * liste, sans traduction intermédiaire.
 */
export function parseGlobalFilters(
  params: Record<string, string | string[] | undefined>
): GlobalFilters {
  const first = (key: string): string | undefined => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    country: (first("country") as GlobalFilters["country"]) ?? "all",
    program: first("program") ?? "all",
    formation: first("formation") ?? "all",
  };
}

/**
 * Applique le filtre de date sur la **date de réception**.
 *
 * Les bornes sont calculées à partir de `REFERENCE_DATE` et non de `Date.now()` :
 * le jeu de démonstration est figé, et un filtre relatif à l'horloge réelle
 * viderait la liste dès que la date du jour s'éloigne de celle des données.
 */
function matchesDateFilter(
  dossier: Dossier,
  filter: DossierQuery["date"],
  referenceDate: Date
): boolean {
  if (filter === "all") return true;

  if (filter === "quarter") {
    const period = currentPeriod(referenceDate);
    return inQuarter(dossier.createdAt, period.year, period.quarter);
  }

  const days = filter === "7d" ? 7 : 30;
  const limit = referenceDate.getTime() - days * DAY_MS;
  return new Date(dossier.createdAt).getTime() >= limit;
}

/**
 * Recherche + filtres + tri + pagination, **côté serveur**.
 *
 * Renvoie la page demandée et le total. Le navigateur ne reçoit jamais
 * l'ensemble des dossiers (spec §32).
 */
export function queryDossiers(
  scope: BackofficeScope,
  query: DossierQuery,
  dossiers?: readonly Dossier[]
): DossierPage {
  const scoped = scopeDossiers(scope, dossiers);
  const needle = normalize(query.q);

  const filtered = scoped.filter((dossier) => {
    if (needle) {
      const haystack = normalize(
        [dossier.studentName, dossier.reference, dossier.email, dossier.phone].join(" ")
      );
      if (!haystack.includes(needle)) return false;
    }
    if (query.state !== "all" && dossier.state !== query.state) return false;
    if (query.program !== "all" && dossier.program !== query.program) return false;
    if (query.formation !== "all" && dossier.formation !== query.formation) return false;
    if (query.country !== "all" && dossier.countryCode !== query.country) return false;
    if (query.completeness === "complete" && dossier.completeness < 100) return false;
    if (query.completeness === "incomplete" && dossier.completeness === 100) return false;
    if (!matchesDateFilter(dossier, query.date, referenceDateForScope(scope))) return false;
    if (query.step !== "all" && dossier.step !== query.step) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, totalPages);
  const start = (page - 1) * query.pageSize;

  return {
    rows: sorted.slice(start, start + query.pageSize),
    total,
    page,
    pageSize: query.pageSize,
    totalPages,
  };
}

/* ------------------------------------------------------------------ *
 * 7. Agrégations (spec §8, §9, §19, §21)
 * ------------------------------------------------------------------ */

export const CURRENT_PERIOD = {
  year: 2026,
  quarter: 3,
  label: "3e trimestre 2026 (juil. – sept.)",
};
export const PREVIOUS_PERIOD = {
  year: 2026,
  quarter: 2,
  label: "2e trimestre 2026 (avr. – juin)",
};

function inQuarter(isoDate: string, year: number, quarter: number): boolean {
  const date = new Date(isoDate);
  if (date.getUTCFullYear() !== year) return false;
  return Math.floor(date.getUTCMonth() / 3) + 1 === quarter;
}

/**
 * Variation entre la période courante et la précédente.
 *
 * Renvoie `null` quand la période précédente est vide : spec §8.2, « ne pas
 * inventer de variation si aucune donnée de comparaison n'est disponible ».
 * Afficher « +100 % » parce que la base précédente est à zéro serait un
 * chiffre exact et un message faux.
 */
function variation(
  current: number,
  previous: number
): { value: number; direction: "up" | "down" } | null {
  if (previous === 0) return null;
  const delta = Math.round(((current - previous) / previous) * 100);
  if (delta === 0) return null;
  return { value: Math.abs(delta), direction: delta > 0 ? "up" : "down" };
}

export function computeKpis(
  scope: BackofficeScope,
  filters?: GlobalFilters,
  dossiers?: readonly Dossier[]
): Kpi[] {
  const scoped = scopedAndFiltered(scope, filters, dossiers);
  const isBec = scope.role === "BEC";
  const referenceDate = referenceDateForScope(scope);
  const period = currentPeriod(referenceDate);
  const previous = previousPeriod(referenceDate);

  const received = scoped.filter((d) => inQuarter(d.createdAt, period.year, period.quarter));
  const receivedPrev = scoped.filter((d) => inQuarter(d.createdAt, previous.year, previous.quarter));

  const processed = scoped.filter(
    (d) => inQuarter(d.updatedAt, period.year, period.quarter) && d.state !== "RECU"
  );
  const processedPrev = scoped.filter(
    (d) => inQuarter(d.updatedAt, previous.year, previous.quarter) && d.state !== "RECU"
  );

  const pending = scoped.filter((d) => PENDING_STATES.includes(d.state));
  const toProcess = scoped.filter((d) => ACTION_REQUIRED_STATES.includes(d.state));
  const toValidate = scoped.filter((d) => d.state === "A_VALIDER");
  const validated = scoped.filter((d) => d.state === "VALIDE" || d.state === "EN_MOBILITE" || d.state === "EN_SUIVI" || d.state === "DIPLOME");

  if (isBec) {
    return [
      {
        id: "received",
        label: "Total dossiers",
        value: scoped.length,
        period: "Toutes périodes",
        variation: null,
      },
      {
        id: "pending",
        label: "Dossiers en attente",
        value: pending.length,
        period: "État courant",
        variation: null,
      },
      {
        id: "toValidate",
        label: "Dossiers à valider",
        value: toValidate.length,
        period: "État courant",
        variation: null,
      },
      {
        id: "validated",
        label: "Dossiers validés",
        value: validated.length,
        period: "État courant",
        variation: null,
      },
    ];
  }

  return [
    {
      id: "received",
      label: "Dossiers reçus",
      value: received.length,
      period: period.label,
      variation: variation(received.length, receivedPrev.length),
    },
    {
      id: "toProcess",
      label: "À traiter",
      value: toProcess.length,
      period: "État courant",
      variation: null,
    },
    {
      id: "pending",
      label: "En attente",
      value: pending.length,
      period: "État courant",
      variation: null,
    },
    {
      id: "processed",
      label: "Traités",
      value: processed.length,
      period: period.label,
      variation: variation(processed.length, processedPrev.length),
    },
  ];
}

function toDistribution(
  counts: Map<string, number>,
  keyOf: (label: string) => string
): Distribution[] {
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value, key: keyOf(label) }))
    .sort((a, b) => b.value - a.value);
}

export function computeStatusDistribution(
  scope: BackofficeScope,
  filters?: GlobalFilters,
  dossiers?: readonly Dossier[]
): Distribution[] {
  const counts = new Map<string, number>();
  for (const dossier of scopedAndFiltered(scope, filters, dossiers)) {
    const label = STATE_LABELS[dossier.state];
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return toDistribution(counts, (label) => label);
}

export function computeProgramDistribution(
  scope: BackofficeScope,
  filters?: GlobalFilters,
  dossiers?: readonly Dossier[]
): Distribution[] {
  const counts = new Map<string, number>();
  for (const dossier of scopedAndFiltered(scope, filters, dossiers)) {
    counts.set(dossier.program, (counts.get(dossier.program) ?? 0) + 1);
  }
  return toDistribution(counts, (label) => label);
}

export function computeFormationDistribution(
  scope: BackofficeScope,
  filters?: GlobalFilters,
  dossiers?: readonly Dossier[]
): Distribution[] {
  const counts = new Map<string, number>();
  for (const dossier of scopedAndFiltered(scope, filters, dossiers)) {
    counts.set(dossier.formation, (counts.get(dossier.formation) ?? 0) + 1);
  }
  return toDistribution(counts, (label) => label);
}

/**
 * Vue consolidée des 8 pays (spec §9.3).
 *
 * Renvoie les compteurs **sans classement ni score** : la spec précise
 * explicitement que cette vue ne doit pas « transformer automatiquement les
 * données en classement de performance ». Le tri est donc par ordre
 * alphabétique de pays, jamais par volume.
 */
export function computeCountryStats(
  scope: BackofficeScope,
  filters?: GlobalFilters,
  dossiers?: readonly Dossier[]
): CountryStat[] {
  // Le périmètre est appliqué ici comme partout ailleurs : un agent d'antenne
  // ne doit pas pouvoir lire les compteurs des sept autres pays en appelant
  // cette fonction. Sans ce filtre, la vue consolidée aurait été une fuite
  // entre antennes.
  const allowed = new Set(
    scope.role === "BEC"
      ? COUNTRIES.map((country) => country.code)
      : scope.countryCode
        ? [scope.countryCode]
        : []
  );

  return COUNTRIES.filter((country) => allowed.has(country.code))
    .map((country) => {
      const rows = scopedAndFiltered(
        { ...scope, role: "BEC", countryCode: null },
        { ...filters, country: country.code },
        dossiers
      );
      return {
        countryCode: country.code,
        country: country.country,
        flag: country.flag,
        city: country.city,
        total: rows.length,
        pending: rows.filter((d) => PENDING_STATES.includes(d.state)).length,
        toValidate: rows.filter((d) => d.state === "A_VALIDER").length,
        validated: rows.filter((d) =>
          ["VALIDE", "EN_MOBILITE", "EN_SUIVI", "DIPLOME"].includes(d.state)
        ).length,
      };
    })
    .sort((a, b) => a.country.localeCompare(b.country, "fr"));
}

/** Évolution mensuelle sur les 9 derniers mois. */
export function computeEvolution(
  scope: BackofficeScope,
  filters?: GlobalFilters,
  dossiers?: readonly Dossier[]
): EvolutionPoint[] {
  const scoped = scopedAndFiltered(scope, filters, dossiers);
  const points: EvolutionPoint[] = [];
  const referenceDate = referenceDateForScope(scope);

  for (let offset = 8; offset >= 0; offset -= 1) {
    const cursor = new Date(referenceDate.getTime());
    cursor.setUTCDate(1);
    cursor.setUTCMonth(cursor.getUTCMonth() - offset);
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth();

    const inMonth = (iso: string) => {
      const d = new Date(iso);
      return d.getUTCFullYear() === year && d.getUTCMonth() === month;
    };

    points.push({
      period: `${String(month + 1).padStart(2, "0")}/${String(year).slice(2)}`,
      received: scoped.filter((d) => inMonth(d.createdAt)).length,
      processed: scoped.filter((d) => inMonth(d.updatedAt) && d.state !== "RECU").length,
    });
  }

  return points;
}

/** File opérationnelle : dossiers attendant une action de l'antenne (spec §8.3). */
export function computeOperationalQueue(
  scope: BackofficeScope,
  dossiers?: readonly Dossier[]
): Dossier[] {
  return scopeDossiers(scope, dossiers)
    .filter((d) => d.requiredAction !== null)
    .sort((a, b) => {
      const rank = { HAUTE: 0, NORMALE: 1, BASSE: 2 };
      return rank[a.priority] - rank[b.priority] || a.updatedAt.localeCompare(b.updatedAt);
    });
}

/** File de validation BEC (spec §9.4). */
export function computeValidationQueue(
  scope: BackofficeScope,
  filters?: GlobalFilters,
  dossiers?: readonly Dossier[]
): ValidationQueueRow[] {
  return scopedAndFiltered(scope, filters, dossiers)
    .filter((d) => d.state === "A_VALIDER")
    .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))
    .map((d) => ({
      dossierId: d.id,
      reference: d.reference,
      studentName: d.studentName,
      country: d.country,
      flag: d.flag,
      program: d.program,
      state: d.state,
      updatedAtLabel: d.updatedAtLabel,
    }));
}

/** Alertes opérationnelles (spec §8.4). */
export function computeAlerts(
  scope: BackofficeScope,
  dossiers?: readonly Dossier[]
): OperationalAlert[] {
  const scoped = scopeDossiers(scope, dossiers);

  const incomplete = scoped.filter((d) => d.state === "INCOMPLET").length;
  const toVerify = scoped.filter(
    (d) => d.documents.some((doc) => doc.status === "A_VERIFIER")
  ).length;
  const waiting = scoped.filter((d) => PENDING_STATES.includes(d.state)).length;
  const overdue = scoped.reduce((total, dossier) => total + dossier.overdueTaskCount, 0);

  const alerts: OperationalAlert[] = [
    {
      id: "incomplete",
      kind: "DOSSIER_INCOMPLET",
      title: "Dossiers incomplets",
      detail: "Une pièce manquante bloque la suite du traitement.",
      count: incomplete,
      href: "/antenne/dossiers?completeness=incomplete",
      severity: "error",
    },
    {
      id: "to-verify",
      kind: "DOCUMENT_A_VERIFIER",
      title: "Documents à vérifier",
      detail: "Des pièces attendent une décision de vérification.",
      count: toVerify,
      href: "/antenne/documents",
      severity: "warning",
    },
    {
      id: "waiting",
      kind: "DOSSIER_EN_ATTENTE",
      title: "Dossiers en attente d'un tiers",
      detail: "En attente d'un avis OCO ou d'une validation BEC.",
      count: waiting,
      href: "/antenne/dossiers?state=TRANSMIS_OCO",
      severity: "info",
    },
    {
      id: "overdue",
      kind: "DELAI_OPERATIONNEL",
      title: "Actions en retard",
      detail: "Dossiers dont l'action attendue n'a pas été traitée dans le délai.",
      count: overdue,
      href: "/antenne/dossiers",
      severity: "warning",
    },
  ];

  return alerts.filter((alert) => alert.count > 0);
}

/** Rapport trimestriel (spec §19). */
export function computeQuarterlyReport(
  scope: BackofficeScope,
  year: number,
  quarter: number,
  filters?: GlobalFilters,
  dossiers?: readonly Dossier[]
): QuarterlyReport {
  const scoped = scopedAndFiltered(scope, filters, dossiers).filter((d) =>
    inQuarter(d.createdAt, year, quarter)
  );

  const counts = new Map<string, number>();
  const programs = new Map<string, number>();
  const formations = new Map<string, number>();
  for (const dossier of scoped) {
    counts.set(STATE_LABELS[dossier.state], (counts.get(STATE_LABELS[dossier.state]) ?? 0) + 1);
    programs.set(dossier.program, (programs.get(dossier.program) ?? 0) + 1);
    formations.set(dossier.formation, (formations.get(dossier.formation) ?? 0) + 1);
  }

  const scopeLabel =
    scope.role === "BEC"
      ? "Rapport consolidé BEC — 8 pays"
      : `Rapport antenne — ${scope.country ?? "périmètre non défini"}`;

  return {
    scopeLabel,
    year,
    quarter,
    periodLabel: `${quarter}e trimestre ${year}`,
    generatedAtLabel: frLabel(referenceDateForScope(scope)),
    lines: [
      { label: "Dossiers reçus", value: scoped.length },
      {
        label: "Dossiers traités",
        value: scoped.filter((d) => d.state !== "RECU").length,
      },
      {
        label: "Dossiers en attente",
        value: scoped.filter((d) => PENDING_STATES.includes(d.state)).length,
      },
      {
        label: "Dossiers validés",
        value: scoped.filter((d) =>
          ["VALIDE", "EN_MOBILITE", "EN_SUIVI", "DIPLOME"].includes(d.state)
        ).length,
      },
    ],
    statusDistribution: toDistribution(counts, (label) => label),
    programDistribution: toDistribution(programs, (label) => label),
    formationDistribution: toDistribution(formations, (label) => label),
  };
}

/** Dossiers d'une étape donnée (orientation, mobilité, suivi). */
export function computeByStep(
  scope: BackofficeScope,
  step: WorkflowStep,
  dossiers?: readonly Dossier[]
): Dossier[] {
  return scopeDossiers(scope, dossiers)
    .filter((d) => d.step === step)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Dossiers porteurs d'un transfert STSS (spec §22). */
export function computeStssDossiers(
  scope: BackofficeScope,
  dossiers?: readonly Dossier[]
): Dossier[] {
  return scopeDossiers(scope, dossiers)
    .filter((d) => d.stss !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Dossiers dont au moins une pièce attend une vérification (spec §14). */
export function computeDocumentRows(scope: BackofficeScope, dossiers?: readonly Dossier[]) {
  return scopeDossiers(scope, dossiers)
    .flatMap((dossier) =>
      dossier.documents
        .filter((doc) => doc.status !== "VALIDE")
         .map((doc) => ({
           dossierId: dossier.id,
           version: dossier.version,
           reference: dossier.reference,
          studentName: dossier.studentName,
          country: dossier.country,
          flag: dossier.flag,
          document: doc,
        }))
    )
    .sort((a, b) => a.document.name.localeCompare(b.document.name, "fr"));
}

export const COUNTRIES_REFERENCE = COUNTRIES;

/* ------------------------------------------------------------------ *
 * 8. Notifications (spec §38)
 * ------------------------------------------------------------------ */

/**
 * Centre de notifications, dérivé de l'état réel du workflow.
 *
 * Les sept types que la spec énumère et qui dépendent d'un dossier sont
 * produits ici, dans l'ordre chronologique inverse. Le huitième — « erreur
 * système non sensible » — n'a pas de source : aucune supervision n'est
 * branchée, et une notification d'erreur inventée serait un faux positif
 * permanent.
 *
 * `role` détermine quels types sont pertinents : « validation demandée » ne
 * concerne que le BEC, « dossier à traiter » que l'antenne. Servir les deux
 * listes à tout le monde ferait apparaître dans la cloche d'un agent des
 * dossiers sur lesquels il ne peut rien faire.
 */
export function computeNotifications(
  scope: BackofficeScope,
  role: BackofficeRole,
  dossiers?: readonly Dossier[]
): BackofficeNotification[] {
  const scoped = scopeDossiers(scope, dossiers);
  const items: BackofficeNotification[] = [];

  const push = (
    dossier: Dossier,
    kind: NotificationKind,
    title: string,
    detail: string,
    at: string,
    href: string
  ) => {
    items.push({
      id: `${kind}-${dossier.id}`,
      kind,
      title,
      detail,
      at,
      atLabel: frLabel(new Date(at)),
      href,
    });
  };

  const base = role === "BEC" ? "/bec" : "/antenne";
  const detailHref = (dossier: Dossier) => `${base}/dossiers/${dossier.id}`;

  for (const dossier of scoped) {
    if (dossier.state === "RECU") {
      push(
        dossier,
        "NOUVEAU_DOSSIER",
        `Nouveau dossier — ${dossier.studentName}`,
        `${dossier.reference} reçu pour ${dossier.program}.`,
        dossier.createdAt,
        detailHref(dossier)
      );
    }

    if (role === "ANTENNE" && dossier.requiredAction) {
      push(
        dossier,
        "DOSSIER_A_TRAITER",
        `Action attendue — ${dossier.studentName}`,
        `${dossier.requiredAction} (${dossier.reference}).`,
        dossier.updatedAt,
        detailHref(dossier)
      );
    }

    const pendingDoc = dossier.documents.find((doc) => doc.status === "A_VERIFIER");
    if (pendingDoc) {
      push(
        dossier,
        "DOCUMENT_A_VERIFIER",
        `Pièce à vérifier — ${dossier.studentName}`,
        `${pendingDoc.name} attend une décision (${dossier.reference}).`,
        dossier.updatedAt,
        `${base}/documents`
      );
    }

    if (dossier.orientation?.verdict && dossier.state === "AVIS_RECU") {
      push(
        dossier,
        "AVIS_RECU",
        `Avis OCO reçu — ${dossier.studentName}`,
        `Avis ${dossier.orientation?.verdict?.replace(/_/g, " ").toLowerCase()} sur ${dossier.reference}.`,
        dossier.updatedAt,
        detailHref(dossier)
      );
    }

    if (role === "BEC" && dossier.state === "A_VALIDER") {
      push(
        dossier,
        "VALIDATION_DEMANDEE",
        `Validation demandée — ${dossier.studentName}`,
        `${dossier.reference} attend la validation du BEC.`,
        dossier.updatedAt,
        detailHref(dossier)
      );
    }

    if (PENDING_STATES.includes(dossier.state)) {
      push(
        dossier,
        "DOSSIER_EN_ATTENTE",
        `Dossier en attente — ${dossier.studentName}`,
        `${dossier.reference} est bloqué en attente d'un tiers.`,
        dossier.updatedAt,
        detailHref(dossier)
      );
    }
  }

  const referenceDate = referenceDateForScope(scope);
  const period = currentPeriod(referenceDate);
  items.push({
    id: "RAPPORT_DISPONIBLE",
    kind: "RAPPORT_DISPONIBLE",
    title: `Rapport du ${period.label}`,
    detail:
      role === "BEC"
        ? "Rapport consolidé des 8 pays disponible."
        : `Rapport de l'antenne ${scope.country ?? ""} disponible.`,
    at: referenceDate.toISOString(),
    atLabel: frLabel(referenceDate),
    href: `${base}/rapports`,
  });

  return items.sort((a, b) => b.at.localeCompare(a.at));
}
