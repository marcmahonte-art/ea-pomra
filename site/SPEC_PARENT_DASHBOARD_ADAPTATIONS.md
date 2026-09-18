# Portail Parent — écarts assumés par rapport à la spécification v1.0

**Date :** 18 septembre 2026
**Périmètre :** `web/app/parent/*`, `web/components/parent/*`, `web/lib/parent-*.ts`

La spécification `SPEC_PARENT_DASHBOARD.md` (v1.0) décrit un portail complet. Avant d'écrire la
moindre ligne, un audit du dépôt a été mené — la spécification le demande elle-même en ÉTAPE 1
(« NE PAS recréer ce qui existe déjà »). Cet audit a montré que **plusieurs briques supposées
présentes n'existent pas**. Ce document liste chaque écart, la décision prise, et ce qu'il reste à
faire.

---

## 1. Audit initial — ce que la spécification supposait

| Brique supposée | Réalité constatée | Conséquence |
|---|---|---|
| shadcn/ui (§59, ÉTAPE 9) | `components.json` **absent** | Aucun composant shadcn disponible |
| Framer Motion (§67–71, ÉTAPE 10) | **absent** de `package.json` | Aucune animation déclarative |
| Authentification + RBAC (§46–47, ÉTAPE 6) | **aucune** couche d'auth | `/parent/*` non protégeable « réellement » |
| `src/`, `hooks/`, `stores/`, `types/` (§61, ÉTAPE 1) | **absents** | Arborescence différente |
| Script `typecheck` (ÉTAPE 16) | **absent** (`dev`, `build`, `start`, `lint` seulement) | Utiliser `npx tsc --noEmit` |
| `tailwind.config.*` | **absent** — Tailwind v4 est *CSS-first* | Configuration dans `globals.css` |

**Ce qui existait réellement et a été réutilisé :** `components/ui/{Card,Button,Badge}.tsx`
(primitives maison), `lib/utils.ts` (`cn`, `formatCurrency`), `lib/types.ts`
(`NotificationItem`), la palette `--eap-*` de `globals.css`, et lucide-react.

---

## 2. Décisions prises, et pourquoi

### 2.1 Pas de shadcn/ui — les primitives existantes sont utilisées

Installer shadcn/ui aurait introduit une seconde bibliothèque de composants à côté des trois
primitives déjà présentes, avec deux systèmes de styles concurrents. La spécification elle-même
interdit par ailleurs d'ajouter des dépendances sans nécessité (§74, ÉTAPE 14).

**Décision :** construire les composants métier sur `Card`/`Button`/`Badge` + Tailwind + lucide-react.
Le résultat est visuellement conforme au design system EA-POMRA, qui est de toute façon la source
de vérité — shadcn n'aurait fait que l'envelopper.

*Si shadcn/ui est souhaité plus tard :* `npx shadcn@latest init` puis remplacer progressivement
`components/ui/*`. Les composants métier de `components/parent/*` n'auront pas à changer, puisqu'ils
consomment des props, pas des implémentations.

### 2.2 Pas de Framer Motion — transitions CSS

Le projet utilise déjà des transitions Tailwind (`transition-colors`, `animate-pulse`,
`transition-all`) et des classes maison (`shadow-eap-*`, `transition-eap`). Framer Motion
ajouterait ~35 ko au bundle pour des animations que la spécification décrit comme discrètes
(apparition, survol, ouverture de modale).

**Décision :** transitions CSS uniquement. L'état de chargement utilise `animate-pulse` — aucune
dépendance.

*Si les animations sont jugées insuffisantes :* Framer Motion peut être ajouté sans rien casser,
les composants étant déjà découpés.

### 2.3 RBAC — la couture existe, la sécurité n'existe pas

C'est le point le plus important de ce document.

La spécification exige un contrôle **côté serveur** (§47) et rappelle que « le frontend ne doit
jamais constituer la seule sécurité » (§46). Or aucune couche d'authentification n'existe dans le
projet : il n'y a donc rien à vérifier.

**Ce qui a été fait** — `lib/parent-session.ts` :

- la lecture du cookie de session (`eap_parent_session`) est **déjà implémentée** ;
- la fonction est `async` et appelée depuis le layout serveur : le contrôle ne peut pas être
  contourné depuis le navigateur ;
- **un contrôle de rattachement réel** est effectué dans `app/parent/layout.tsx` : la session porte
  la référence du seul dossier autorisé, et la page renvoie un 404 si la référence consultée diffère.
  Sans ce test, changer une référence dans l'URL suffirait à lire le dossier d'une autre famille ;
- il n'existe qu'**un seul point à modifier** le jour où l'authentification arrive (marqué `TODO AUTH`).

**Ce qui n'existe toujours pas :** la preuve d'identité. La session de démonstration est retournée
en l'absence de cookie, donc **`/parent/*` est aujourd'hui accessible à quiconque connaît l'URL**.
Une mention « Environnement de démonstration — accès non authentifié » est affichée dans la barre
latérale et sur la page Profil : il aurait été trompeur de laisser croire à un espace sécurisé.

**Avant toute mise en production, il faut :**
1. un service d'authentification qui émet un cookie de session signé ;
2. une vérification cryptographique de ce cookie dans `getParentSession()` ;
3. une vérification que le parent authentifié est bien le tuteur légal enregistré du dossier ;
4. une page de connexion, puis remplacer le `notFound()` de `requireParentSession()` par une
   redirection.

### 2.4 Arborescence — convention du projet respectée

La spécification décrit `src/`, `hooks/`, `stores/`, `types/`. Le projet n'utilise pas `src/` et
place ses types dans `lib/`. Suivre la spécification aurait créé deux conventions concurrentes dans
le même dépôt.

**Décision :** respecter la convention existante.

| Spécification | Emplacement retenu |
|---|---|
| `src/types/parent.ts` | `lib/parent-types.ts` |
| `src/lib/mock-data.ts` | `lib/parent-data.ts` |
| `src/components/parent/*` | `components/parent/*` |
| `src/app/parent/*` | `app/parent/*` |
| `src/hooks/*` | *(aucun besoin identifié)* |
| `src/stores/*` | *(aucun état global nécessaire — tout est serveur)* |

`hooks/` et `stores/` sont sans objet ici : les pages sont des composants serveur et la seule
interactivité (route active, modale) tient dans un état local de la coquille.

### 2.5 Typographie — Plus Jakarta Sans, sans dépendance au build

La spécification impose Plus Jakarta Sans (§12). `next/font/google` télécharge la police **au
moment du build** : si le réseau est indisponible, le build échoue. La police est donc chargée par
une requête d'affichage dans `globals.css`, avec une pile de repli système.

Elle est appliquée via un utilitaire dédié (`font-jakarta`) **au seul portail Parent**, afin de ne
pas modifier la typographie des espaces public et étudiant — la spécification ne porte que sur le
portail Parent.

---

## 3. Ce qui a été livré

**11 routes** (`app/parent/`) : tableau de bord, parcours, scolarité, finances, accompagnement PAP,
documents, messages, notifications, profil, aide, plus `loading.tsx` et `error.tsx`.

**12 composants** (`components/parent/`) : `ParentShell`, `StudentSummaryCard`, `JourneyTimeline`
(+ `JourneyStepper`), `KpiRow`, `AcademicCard`, `FinanceCard`, `PapCard`, `DocumentsCard`,
`NotificationsCard`, `MessagesCard`, `QuickActions`, `NextActionBanner`, `SectionHeading`,
`EmptyState`.

**3 modules de données** : `lib/parent-types.ts`, `lib/parent-data.ts` (module serveur),
`lib/parent-session.ts`.

**Données de démonstration :** Aïcha K., dossier `BF-2026-00125` — Burkina Faso → Dakar (UCAD),
étape 4/5 (Suivi). Aucune donnée n'a été inventée en dehors de ce jeu de démonstration, isolé dans
un seul module et signalé comme tel dans l'interface.

### Confidentialité PAP — appliquée par l'architecture

`lib/parent-data.ts` contient `RAW_PAP_RECORD` (notes de séance, signalements internes) et ne
l'exporte pas. La fonction `toPapSummary()` **énumère les champs conservés** plutôt que de
supprimer les champs sensibles : un champ ajouté demain au modèle interne est donc exclu par défaut.

Le type `PapSummary` ne possède aucun champ libre — il ne *peut pas* transporter le contenu d'un
entretien. Aucun composant client n'importe ce module.

---

## 4. Vérification par exécution

| Contrôle | Résultat |
|---|---|
| `npx tsc --noEmit` | **0 erreur** |
| `npx next build` | **34 pages**, 0 erreur |
| Les 10 routes `/parent/*` | **HTTP 200** (dynamiques `ƒ`, attendu : lecture du cookie) |
| Les 7 routes publiques + `/robots.txt` + `/sitemap.xml` | **HTTP 200** (aucune régression) |
| `<h1>` par page | **1** sur les 10 pages |
| `noindex` sur les sous-pages | hérité du layout — **vérifié sur les 9** |
| `robots.txt` | `Disallow: /etudiant` **et** `Disallow: /parent` |
| Fuite des notes de séance dans le HTML | **0 occurrence** (6 motifs testés, sur `/parent` et `/parent/pap`) |

---

## 5. Points en suspens

1. **Authentification** — bloquant pour une mise en production (§2.3).
2. **Messagerie** — l'aperçu est en lecture seule ; l'envoi n'est pas implémenté. Plutôt qu'un champ
   de saisie inerte, la page oriente vers le téléphone et l'e-mail de l'antenne.
3. **Dépôt de documents** — impossible depuis le portail, volontairement : les pièces doivent être
   vérifiées par l'antenne avant d'entrer dans un dossier officiel.
4. **Données de démonstration** — coexistent avec celles de l'espace étudiant (Moussa Traoré). Deux
   étudiants fictifs distincts ; à remplacer par la couche de données réelle.
5. **Palette** — les composants du portail utilisent des valeurs hexadécimales directes, comme le
   reste du projet. La migration vers `var(--eap-*)` reste à faire, globalement.
