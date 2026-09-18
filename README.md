# EA-POMRA — Étudier en Afrique

> **Plateforme d'Orientation, de Mobilité et de Réussite Académique**  
> Plateforme panafricaine reliant 8 pays d'Afrique de l'Ouest et Centrale pour sécuriser la mobilité étudiante de l'inscription au diplôme.

---

## 🌟 Vision & Mission

EA-POMRA accompagne les étudiants africains dans leur parcours de mobilité académique à travers 4 piliers fondamentaux :

1. **Orientation personnalisée (Pôle OCO)** : Choix de filières adaptées aux talents et aux opportunités du marché africain avec avis d'experts certifié sous 72h.
2. **Mobilité & Scolarité Sécurisée (Dispositif STSS)** : Système de transfert sécurisé de scolarité permettant aux familles de verser les frais en monnaie locale auprès de l'antenne de départ avec quittance légale, éliminant tout risque de détournement.
3. **Accompagnement Psychosocial (Pôle PAP)** : Accueil dès l'aéroport, canal d'écoute confidentiel 24/7 et parrainage par des aînés.
4. **Réussite & Lien de Confiance** : Suivi académique trimestriel partagé en temps réel entre l'étudiant, sa famille et l'établissement d'accueil (96,4% de réussite).

---

## 🌍 8 Antennes Nationales Interconnectées

- 🇸🇳 **Sénégal** (Dakar)
- 🇨🇮 **Côte d'Ivoire** (Abidjan)
- 🇨🇲 **Cameroun** (Douala & Yaoundé)
- 🇬🇦 **Gabon** (Libreville)
- 🇧🇯 **Bénin** (Cotonou)
- 🇹🇬 **Togo** (Lomé)
- 🇨🇬 **Congo** (Brazzaville)
- 🇨🇩 **RD Congo** (Kinshasa)

---

## 💻 Stack Technique

| Élément | Choix |
| --- | --- |
| Framework | [Next.js 16.3.4](https://nextjs.org/) — App Router + Turbopack |
| Langage | [TypeScript](https://www.typescriptlang.org/) (mode strict) |
| UI | [React 19.2](https://react.dev/) |
| Styling | [Tailwind CSS v4.3](https://tailwindcss.com/) |
| Design System | Palette EA-POMRA (`#0D2B4D`, `#174A7C`, `#1EA362`, `#C89C2E`, `#F7F9FB`) |
| Iconographie | [Lucide React](https://lucide.dev/) |

> ⚠️ **Attention** — Cette version de Next.js comporte des ruptures d'API par rapport aux versions antérieures.
> Consulter `web/node_modules/next/dist/docs/` avant d'écrire du code framework (voir `web/AGENTS.md`).

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v20+)
- npm

### Installation & Lancement

```bash
cd web
npm install
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

```bash
npm run build   # build de production
npm run start   # serveur de production
```

---

## 📁 Architecture du Projet

```text
├── site/                    # Spécifications fonctionnelles, Design System, maquettes UI/UX
├── assets-originaux/        # Sauvegarde des assets lourds d'origine (hors application)
├── web/                     # Application web Next.js
│   ├── app/
│   │   ├── (site)/          # Route group — site vitrine public (layout partagé)
│   │   ├── etudiant/        # Espace étudiant authentifié (ID-POMRA)
│   │   ├── parent/          # Portail parent — suivi du dossier de l'enfant
│   │   └── layout.tsx       # Layout racine
│   ├── components/
│   │   ├── home/            # Sections de la page d'accueil
│   │   ├── layout/          # Navbar, Footer, PageHeader
│   │   ├── parent/          # Composants du portail parent
│   │   ├── site/            # Composants des pages publiques secondaires
│   │   ├── student/         # Composants de l'espace étudiant
│   │   └── ui/              # Primitives (Badge, Button, Card)
│   ├── lib/                 # Types, données mockées et utilitaires
│   └── public/assets/       # Assets graphiques et logos officiels
├── .gitignore
└── README.md
```

Le dossier `app/(site)/` est un **route group** Next.js : les parenthèses excluent le segment de
l'URL. Il permet de partager un même `layout.tsx` (Navbar + Footer) entre toutes les pages
publiques sans dupliquer le code, et sans que `(site)` n'apparaisse dans les adresses.

---

## 🗺️ Cartographie des Routes

### Site vitrine public — 7 routes

| Route | Contenu |
| --- | --- |
| `/` | Accueil : Hero, 4 piliers, chiffres clés, méthode, acteurs, partenaires |
| `/a-propos` | Vision, mission, gouvernance |
| `/programmes` | Les 4 piliers détaillés (OCO, STSS, PAP, Réussite) |
| `/antennes` | Les 8 antennes nationales |
| `/ressources` | Documentation et guides |
| `/actualites` | Actualités du réseau |
| `/contact` | Formulaire de contact |

### Espace étudiant — 12 routes

| Route | Contenu |
| --- | --- |
| `/etudiant` | Point d'entrée / redirection |
| `/etudiant/dashboard` | Tableau de bord : parcours, échéances, notifications |
| `/etudiant/dossier` | Dossier de candidature et chronologie |
| `/etudiant/profil` | Identité, mobilité, statut STSS, référent PAP |
| `/etudiant/orientation` | Pôle OCO — avis d'orientation |
| `/etudiant/stss` | Dispositif STSS — transfert de scolarité sécurisé |
| `/etudiant/pap` | Pôle PAP — accompagnement psychosocial |
| `/etudiant/documents` | Pièces justificatives |
| `/etudiant/messages` | Messagerie |
| `/etudiant/calendrier` | Échéances et rendez-vous |
| `/etudiant/notifications` | Centre de notifications |
| `/etudiant/aide` | Aide et support |

### Portail parent — 10 routes

| Route | Contenu |
| --- | --- |
| `/parent` | Tableau de bord : avancement, indicateurs, prochaine action attendue |
| `/parent/parcours` | Les 5 étapes détaillées (Candidature → Orientation → Mobilité → Suivi → Réussite) |
| `/parent/scolarite` | Assiduité, crédits validés, unités d'enseignement, commentaire du tuteur |
| `/parent/finances` | Transferts STSS, quittances officielles, échéances |
| `/parent/pap` | Accompagnement humain — niveau agrégé, référent local, confidentialité |
| `/parent/documents` | Pièces justificatives et statut de vérification |
| `/parent/messages` | Messages reçus de l'antenne et de l'équipe d'accompagnement |
| `/parent/notifications` | Historique des alertes et actions attendues |
| `/parent/profil` | Coordonnées du parent, antenne de rattachement |
| `/parent/aide` | FAQ et contacts de l'antenne |

> Le portail parent est décrit par la spécification `site/SPEC_PARENT_DASHBOARD.md`. Les écarts
> assumés par rapport à celle-ci (shadcn/ui, Framer Motion, RBAC, arborescence) sont documentés et
> justifiés dans **`site/SPEC_PARENT_DASHBOARD_ADAPTATIONS.md`**.

> Aucun lien mort : l'ensemble des entrées de la Navbar et du Footer pointe vers une route réelle.

---

## 🗃️ Source Unique de Données

Toutes les données affichées proviennent de **`web/lib/data.ts`** (données mockées typées) :

- `ANTENNES_EA_POMRA` — les 8 antennes nationales
- `MOCK_ACTIVE_STUDENT` — l'étudiant de démonstration (Moussa Traoré / `SN-2026-8492`)
- `MOCK_TIMELINE_EVENTS` — la chronologie du dossier
- `MOCK_NOTIFICATIONS` — les notifications
- `KEY_METRICS`, `PILLARS` — contenus éditoriaux

Aucune page ne doit redéfinir ces valeurs en dur. Les constantes dérivées
(`STUDENT_FULL_NAME`, `STUDENT_INITIALS`, `STUDENT_HOST_ANTENNE`, `STUDENT_HOME_ANTENNE`)
sont exportées depuis le même module.

### Portail parent — `web/lib/parent-*.ts`

Le portail parent dispose de sa propre couche de données, **volontairement séparée** :

| Fichier | Rôle |
| --- | --- |
| `lib/parent-types.ts` | Types (`StudentSummary`, `JourneyStatus`, `JourneyStep`, `ParentDashboardData`…) |
| `lib/parent-data.ts` | Données de démonstration — **module serveur** |
| `lib/parent-session.ts` | Couture d'authentification (`TODO AUTH`) |

**`lib/parent-data.ts` ne doit jamais être importé par un composant `"use client"`.** Il contient
`RAW_PAP_RECORD` — les notes de séance du suivi psychosocial — et ne l'exporte pas. La fonction
`toPapSummary()` projette l'enregistrement vers la seule vue autorisée pour un parent, en
**énumérant les champs conservés** plutôt qu'en supprimant les champs sensibles : un champ ajouté
demain au modèle interne est donc exclu par défaut.

Autrement dit, le type `PapSummary` ne *possède pas* de champ libre. Aucun composant, même client,
ne peut afficher le contenu d'un entretien — la confidentialité est une propriété de l'architecture,
pas une condition d'affichage.

---

## 🔒 Accès et confidentialité

| Zone | Indexation | Session |
| --- | --- | --- |
| Site public | indexable | — |
| `/etudiant/*` | `noindex, nofollow, nocache` | non implémentée |
| `/parent/*` | `noindex, nofollow, nocache` | couture posée, **non authentifiée** |

⚠️ **Aucune couche d'authentification n'existe aujourd'hui.** `getParentSession()` renvoie une
session de démonstration en l'absence de cookie : `/parent/*` est donc accessible à quiconque
connaît l'URL. Le contrôle de *rattachement* (une session n'autorise qu'une seule référence de
dossier) est bien effectué côté serveur, mais la *preuve d'identité* manque. Voir la section 2.3 de
`site/SPEC_PARENT_DASHBOARD_ADAPTATIONS.md` pour la liste des prérequis avant mise en production.

---

## 🔍 SEO & Métadonnées

Chaque page publique déclare ses propres métadonnées : titre, description et carte de partage
social (Open Graph + Twitter). Sans cela, les 19 pages partageaient le titre du site.

| Élément | Emplacement |
| --- | --- |
| Configuration du site | `web/lib/site.ts` |
| Gabarit de titre | `web/app/layout.tsx` → `%s \| EA-POMRA` |
| Métadonnées par page | `export const metadata` dans chaque `page.tsx` |
| `robots.txt` | `web/app/robots.ts` → `/robots.txt` |
| Plan du site | `web/app/sitemap.ts` → `/sitemap.xml` |

**Les espaces nominatifs sont exclus de l'indexation** : `robots: noindex, nofollow, nocache` dans
`web/app/etudiant/layout.tsx` et `web/app/parent/layout.tsx`, complété par `Disallow: /etudiant` et
`Disallow: /parent` dans le `robots.txt`. La liste des préfixes privés est centralisée dans
`lib/site.ts` (`PRIVATE_ROUTE_PREFIXES`) pour qu'un espace ajouté plus tard ne puisse pas être oublié.

### Variable d'environnement requise

```bash
NEXT_PUBLIC_SITE_URL=https://votre-domaine.org
```

Elle sert de base aux URL absolues (partage social, plan du site). Sans elle, le plan du site est
vide. Sur Vercel, `VERCEL_URL` sert de repli automatique. Voir `web/.env.example`.

---

## 🖼️ Assets

Les logos et illustrations sont dans `web/public/assets/` et servis via `next/image`.

Les fichiers sources lourds remplacés par des versions optimisées sont conservés dans
`assets-originaux/` à la racine du projet (hors application, donc non compilés).

---

## 🧭 État d'Avancement

**Réalisé** — Site vitrine complet (7 pages), espace étudiant (12 pages), navigation sans lien mort,
palette alignée sur le design system, métadonnées SEO par page et exclusion de l'espace privé,
données mockées centralisées, build de production vérifié (22 pages).

**Prochain jalon** — Couche de données réelle : arbitrage NestJS vs Django, puis gel du
schéma de données (prérequis identifié de la quasi-totalité des modules métier).

---

## 📄 Licence & Propriété

Tous droits réservés © 2024 - 2026 **EA-POMRA**. Plateforme d'Orientation, de Mobilité et de Réussite Académique.
