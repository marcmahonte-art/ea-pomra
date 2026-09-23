# Back-offices Antenne & BEC — écarts assumés par rapport à la spécification v1.0

**Date :** 23 septembre 2026
**Périmètre :** `web/app/antenne/*`, `web/app/bec/*`, `web/components/backoffice/*`,
`web/lib/backoffice-*.ts`
**Référence :** `site/SPEC_BACKOFFICE_ANTENNE_BEC.md` (v1.0, 44 sections)

La spécification décrit un back-office complet : 20 routes, 25 composants métier, JWT + RBAC,
API REST, PostgreSQL, exports CSV/XLSX/PDF, notifications WhatsApp/email. L'audit de la **PHASE 1**
— que la spécification exige avant toute écriture (§41 : *« Avant de coder : analyser le projet »*) —
a montré que **la majorité de ces briques n'existent pas**. Ce document liste chaque écart, la
décision prise, et ce qu'il reste à faire.

---

## 1. Audit initial — ce que la spécification supposait

| Brique supposée | Réalité constatée | Conséquence |
|---|---|---|
| shadcn/ui (§26) | `components.json` **absent** | Seuls `Badge`, `Button`, `Card` existent (primitives maison) |
| Framer Motion (§30) | **absent** de `package.json` | Aucune animation déclarative |
| JWT + RBAC (§23) | **aucune** couche d'authentification | Aucune autorisation vérifiable |
| `middleware.ts` (§23) | **absent** | Aucune garde au niveau du routage |
| `app/api/*` (§40) | **absent** | Aucune route serveur exposée |
| PostgreSQL + Prisma (§35) | **absents** | Aucun stockage persistant |
| Exports CSV/XLSX/PDF (§39) | **absents** | Aucun moteur de document |
| Notifications WhatsApp/email (§38) | **absents** | Aucun canal d'envoi |
| `src/`, `hooks/`, `stores/` (§34) | **absents** | Arborescence différente |
| Script `typecheck` | **absent** (`dev`, `build`, `start`, `lint`) | Utiliser `npx tsc --noEmit` |

**Ce qui existait réellement et a été réutilisé :** `components/ui/{Card,Button,Badge}.tsx`,
`components/ui/{EmptyState,SectionHeading}.tsx`, `lib/utils.ts` (`cn`), la palette `--eap-*` et
l'échelle de z-index de `globals.css`, lucide-react, et la convention de layout du portail Parent
(sidebar 248 px, header 76 px, conteneur 1184 px).

---

## 2. Décisions prises, et pourquoi

### 2.1 Aucune API inventée — la spécification l'exige

La spécification §41 est explicite : *« Si une donnée ou API nécessaire n'existe pas, indique
précisément ce qui manque au lieu d'inventer une API ou un modèle incompatible. »*

**Décision :** toutes les données proviennent de fonctions serveur (`lib/backoffice-data.ts`)
appelées directement par les composants serveur, sans route d'API intermédiaire. Un back-office
Next.js n'a pas besoin d'une API REST pour lire ses propres données : la couche serveur *est* le
backend. Créer `/api/dossiers` qui renverrait les mêmes objets aurait ajouté une surface d'attaque
(§40) sans apporter de fonctionnalité.

**Conséquence :** les actions de **mutation** (valider, refuser, transmettre, assigner, générer,
exporter) sont **affichées mais désactivées**, avec leur raison en clair dans l'interface. Un bouton
actif qui ne ferait rien serait plus trompeur qu'un bouton désactivé — et la spécification §15 exige
que toute action soit tracée dans l'historique, ce qu'aucune couche ne permet aujourd'hui.

### 2.2 RBAC — la couture est réelle, la sécurité ne l'est pas

C'est le point le plus important de ce document.

La spécification §23 impose un contrôle **côté serveur** et rappelle que *« le frontend ne constitue
jamais la sécurité »*.

**Ce qui a été fait** — `lib/backoffice-session.ts` + `lib/backoffice-data.ts` :

- **13 permissions** déclarées par rôle dans une table unique (`ROLE_PERMISSIONS`), jamais déduites
  dans un composant ;
- `requireBackofficeScope(role, permission)` appelé dans **chaque** layout et **chaque** page,
  avant toute lecture. En l'absence de permission, la page renvoie un **404** — et non un 403, qui
  confirmerait l'existence de la section ;
- **refus par défaut** dans `scopeDossiers()` : un agent d'antenne dont le pays n'est pas défini
  reçoit une liste vide, jamais la liste complète. Une fonction qui renvoie tout par défaut
  transformerait une erreur de configuration en fuite de données entre pays ;
- **`getDossierForScope()` est le seul point d'accès à un dossier** : un dossier hors périmètre
  renvoie un 404, pas une fiche partiellement masquée (masquer laisserait deviner son existence) ;
- **`computeCountryStats()` applique désormais le périmètre** : elle était globale, et un agent
  d'antenne aurait pu lire les compteurs des sept autres pays en l'appelant. Corrigé.
- le rôle porté par le cookie **prime sur la route** : un agent d'antenne ne peut pas s'attribuer les
  droits BEC en changeant l'URL.

**Ce qui n'existe toujours pas :** la preuve d'identité. Le cookie est lu, jamais validé
cryptographiquement, et une session de démonstration est retournée en son absence. **`/antenne/*` et
`/bec/*` sont donc aujourd'hui accessibles à quiconque connaît l'URL.** Une mention
« Environnement de démonstration — données fictives, accès non authentifié » est affichée dans la
barre latérale.

**Avant toute mise en production, il faut :**
1. un service d'authentification émettant un cookie de session signé ;
2. une vérification cryptographique dans `getBackofficeScope()` (`TODO AUTH` dans le fichier) ;
3. la vérification que l'utilisateur appartient réellement à l'antenne dont il consulte les dossiers ;
4. un `middleware.ts` de garde au niveau du routage (§23) ;
5. le remplacement du repli de démonstration par une redirection vers la connexion.

### 2.3 Pas de shadcn/ui — les primitives existantes sont utilisées

§26 demande d'utiliser *« les composants existants du projet lorsqu'ils existent »* et interdit de
*« recréer une version parallèle d'un composant déjà présent »*. shadcn/ui n'étant pas installé,
l'installer aurait introduit une seconde bibliothèque à côté des primitives maison.

**Décision :** construire sur Tailwind + lucide-react. Deux composants ont été **déplacés** plutôt que
dupliqués, conformément à §26 :

| Avant | Après | Raison |
|---|---|---|
| `components/parent/EmptyState.tsx` | `components/ui/EmptyState.tsx` | État vide commun aux deux portails |
| `components/parent/SectionHeading.tsx` | `components/ui/SectionHeading.tsx` | Titre de section commun |

Les 4 imports concernés ont été mis à jour. Aucun composant parallèle n'a été créé.

### 2.4 Une seule coquille pour les deux back-offices

§27 liste `AntenneSidebar`, `AntenneHeader`, `BECSidebar`, `BECHeader`. Le dépôt ne contient qu'un
`BackofficeShell`, qui sert les deux rôles : la navigation est **dérivée du rôle** à partir des listes
`ANTENNE_NAV` (10 entrées, §6) et `BEC_NAV` (8 entrées, §7).

Deux coquilles séparées auraient divergé dès le premier correctif de responsive ou d'espacement. La
spécification §5 décrit d'ailleurs **un seul** layout (sidebar 248 px, header 76 px, conteneur
1184 px) pour les deux back-offices : les séparer aurait contredit §5 pour satisfaire §27.

### 2.5 Filtres globaux du BEC — réellement appliqués, pas décoratifs

§9.1 demande des filtres globaux *Période / Pays / Programme / Formation* sur le tableau de bord BEC.
Les afficher sans les raccorder aurait produit un tableau de bord faux.

**Décision :** `Pays`, `Programme` et `Formation` sont **réellement appliqués**, côté serveur, aux
**quatre** blocs de la page (indicateurs, vue des 8 pays, file de validation, évolution) via un
paramètre `GlobalFilters` ajouté aux fonctions d'agrégation. Un filtre appliqué à trois blocs sur
quatre produit un tableau de bord faux — c'est l'erreur la plus difficile à repérer à l'œil.

**`Période` n'est pas un sélecteur mais un affichage.** Le trimestre de référence est une constante
du module de données (`CURRENT_PERIOD`), et le rendre variable demande de paramétrer le calcul des
variations (§8.2). Tant que ce n'est pas fait, la période est affichée en clair. Un contrôle inerte
est plus trompeur qu'une information figée.

### 2.6 Filtres « Date » et « Étape » ajoutés à la couche de données

§10.2 et §10.3 exigent un filtre *Date*, §18 un filtre *Période* sur la page Suivi. Ces deux filtres
étaient absents de `DossierQuery`.

**Décision :** les implémenter côté serveur plutôt que de les omettre en silence.

- `date` — plage relative (`7 jours`, `30 jours`, trimestre en cours) portant sur la **date de
  réception** du dossier, pas sur sa dernière mise à jour : « les dossiers de la semaine » désigne ce
  qui est arrivé, non ce qui a bougé ;
- `step` — étape du workflow, utilisée par `/antenne/suivi` qui est une **vue filtrée** de la liste
  des dossiers et non une liste séparée. Sans ce champ, la page aurait dû réimplémenter sa propre
  pagination.

### 2.7 Centre de notifications dérivé, et non stocké

§38 énumère 8 types de notifications. Sept sont **dérivables** de l'état réel du workflow (nouveau
dossier, dossier à traiter, pièce à vérifier, avis reçu, validation demandée, dossier en attente,
rapport disponible).

**Décision :** les dériver côté serveur dans `computeNotifications(scope, role)`. Une notification ne
peut donc pas annoncer un dossier déjà traité, ni en oublier un — ce qu'une file séparée finit
toujours par faire.

**Non implémentés :** le 8ᵉ type (*erreur système non sensible*) — aucune supervision n'est branchée,
et une notification d'erreur inventée serait un faux positif permanent ; l'état **lu / non lu** —
il exige une persistance par utilisateur, qui n'existe pas ; les canaux **WhatsApp et email** — §38
les rattache au système de notifications global.

### 2.8 Rapport trimestriel — calculé, non exportable

§19 exige que la génération soit *« réalisée côté serveur »* et propose trois actions
(*Consulter / Générer / Télécharger*).

**Décision :** le contenu est **entièrement calculé et affiché** côté serveur à chaque rendu (volumes,
répartitions par statut, programme et formation). « Générer » et « Télécharger » sont **désactivés**
avec leur raison : il n'existe ni route d'API, ni moteur de rendu de document, ni stockage.

Un rapport figé en base finirait de toute façon par ne plus correspondre aux dossiers qu'il décrit.

### 2.9 Exports (§39) — non implémentés

§39 demande CSV/XLSX/PDF contrôlés par permissions, et rappelle qu'*« un simple paramètre URL ne doit
jamais contourner le RBAC »*. Aucun de ces formats n'est produit aujourd'hui. Les boutons d'export
sont désactivés et la permission `exports.run` est déclarée mais sans effet.

### 2.10 Arborescence — convention du projet respectée

§34 propose une arborescence et demande de *« l'adapter à l'architecture déjà présente »*.

| Spécification | Emplacement retenu |
|---|---|
| `app/antenne/*`, `app/bec/*` | **conforme** (20 routes) |
| types | `lib/backoffice-types.ts` |
| données | `lib/backoffice-data.ts` (module serveur) |
| session | `lib/backoffice-session.ts` |
| composants métier | `components/backoffice/*` |
| `src/` | *(non utilisé par le projet)* |

### 2.11 Tableaux responsive — cartes en dessous du point de rupture

§11 est catégorique : *« ne pas réduire un tableau desktop de façon illisible »*. Sous `lg`, chaque
ligne de dossier devient une `DossierCard` autonome (§11). Sous `md`, les tableaux secondaires
(Orientation, Mobilité, STSS, Documents) deviennent des cartes « libellé / valeur » construites à
partir des **mêmes colonnes**.

Le basculement se fait en **CSS** (`hidden lg:block` / `lg:hidden`) et non par une détection de
largeur en JavaScript : le serveur envoie les deux représentations, le navigateur choisit. Cela
évite un état d'hydratation divergent et un saut de mise en page au premier rendu client.

### 2.12 Statut jamais signalé par la couleur seule

§3 l'interdit. Chaque état de dossier (11), chaque statut de document (4) et chaque niveau de priorité
(3) porte donc une **icône et un libellé** en plus de sa teinte. Un daltonien, une impression noir et
blanc ou un lecteur d'écran reçoivent l'information complète.

### 2.13 Vue des 8 pays — aucun classement implicite

§9.3 précise que cette vue *« ne doit pas transformer automatiquement les données en classement de
performance »*. Trois décisions en découlent : ordre **alphabétique** (jamais par volume), aucun rang
ni médaille, mêmes quatre nombres pour chaque pays sans code couleur comparatif. Une note visible
rappelle la règle à l'écran.

### 2.14 Le squelette de zone est dans un groupe de routes — pour que le 404 reste un 404

C'est l'écart le moins visible et le plus coûteux à découvrir. Il mérite d'être expliqué en entier.

**Le symptôme.** `/antenne/dossiers/CI-0` (dossier ivoirien, hors périmètre d'un agent sénégalais) et
`/antenne/dossiers/XX-999` (identifiant inexistant) affichaient bien la page « introuvable » — mais
avec un statut **200**. Le corps de la réponse était identique dans les deux cas, la logique de
périmètre faisait donc son travail ; c'est le **statut** qui était faux. Un soft-404.

**La cause.** Un `loading.tsx` ne se contente pas d'afficher un squelette : il crée une frontière
`<Suspense>` autour de **tous** les descendants de son segment. Or Next.js remplit cette frontière et
envoie la réponse **avant** que la page n'ait fini de se rendre. À cet instant le statut HTTP est figé
à 200. Quand la page lève ensuite `notFound()`, Next.js l'attrape bien et écrit `res.statusCode = 404`
— mais l'en-tête est déjà parti. La page « introuvable » s'affiche dans le flux, le statut reste 200.

Vérifié en isolant les variables : retirer `app/antenne/loading.tsx` suffit à faire passer les deux
identifiants à 404, et `notFound()` déplacé dans `generateMetadata` ne change rien (la résolution des
métadonnées se produit elle aussi sous la frontière).

**La correction.** Le `loading.tsx` de chaque zone est descendu dans un groupe de routes `(espace)`,
ce qui place la frontière **sous** le chemin menant à `dossiers/[id]` — seul segment qui doit
conserver un 404 exact :

```text
app/antenne/layout.tsx              <- hors frontière : garde de zone
app/antenne/(espace)/loading.tsx    <- frontière (squelette)
app/antenne/(espace)/**             -> squelette appliqué (10 routes)
app/antenne/dossiers/[id]/page.tsx  -> hors frontière : 404 correct
```

Le groupe n'ajoute aucun segment d'URL : les 20 routes gardent exactement les mêmes chemins. §31
(squelettes) et §40 (ne pas révéler l'existence d'un dossier) sont donc satisfaits **ensemble**, au
lieu d'en sacrifier un.

**Second effet, sur le refus de rôle.** `requireBackofficeScope()` lève `notFound()` sur **toutes** les
routes d'une zone quand le rôle ne correspond pas — un agent BEC qui ouvre `/antenne/orientation`, par
exemple. Ces routes-là gardent leur squelette, donc le même soft-404 s'y appliquait. Les layouts de
zone sont, eux, **hors** de la frontière : la garde y est déjà appelée, et un `notFound()` levé à cet
endroit produit un vrai 404. Le refus de rôle est donc exact partout, sans rien déplacer de plus.

**Ce qu'il ne faut pas faire.** Remonter l'un des deux `loading.tsx` à la racine de sa zone. Le
fichier porte un avertissement en tête pour cette raison, et les layouts renvoient vers lui. Le
comportement n'est pas visible dans l'interface : seul un relevé de statuts le détecte.

---

## 3. Ce qui a été livré

**20 routes** — `app/antenne/*` (11) et `app/bec/*` (9), plus un `layout.tsx`, un `loading.tsx` et un
`error.tsx` par zone. Le `loading.tsx` de chaque zone vit dans un groupe de routes `(espace)` — voir
§2.14 — ce qui n'ajoute aucun segment d'URL.

| Antenne (§6) | BEC (§7) |
|---|---|
| `/antenne` — tableau de bord | `/bec` — tableau de bord |
| `/antenne/dossiers` | `/bec/dossiers` |
| `/antenne/dossiers/[id]` | `/bec/dossiers/[id]` |
| `/antenne/orientation` | `/bec/validation` |
| `/antenne/mobilite` | `/bec/statistiques` |
| `/antenne/suivi` | `/bec/rapports` |
| `/antenne/documents` | `/bec/activite` |
| `/antenne/stss` | `/bec/notifications` |
| `/antenne/rapports` | `/bec/historique` |
| `/antenne/notifications` | |
| `/antenne/historique` | |

**Composants métier** (`components/backoffice/`, 24 fichiers) : `BackofficeShell`, `PageHeader`,
`DashboardKpiGrid` (+ `StatisticsKpiGrid`), `BECDashboard`, `AntenneDashboard`, `CountryOverviewGrid`,
`OperationalQueue`, `OperationalAlerts`, `ActivityLog`, `DataTable` (+ `Panel`), `DossierTable`
(+ `DossierList`, `DossierLink`), `DossierCard`, `DossierFilters` (+ `ResetFiltersButton`),
`DossierSearch`, `DossierBrowser`, `Pagination`, `DossierHeader`, `DossierSummary`, `DossierDetail`,
`DossierStatus` (+ `CompletenessBar`, `WorkflowStepper`, `PriorityBadge`), `DossierDocuments`
(+ `DocumentStatusBadge`), `DocumentVerificationDialog`, `OrientationQueue` (+ `OrientationPanel`),
`MobilitePanel`, `SuiviPanel` *(via `DossierList`)*, `StssPanel`, `QuarterlyReportPanel`,
`StatisticsPanel`, `DistributionBars`, `EvolutionChart`, `NotificationsCenter`, `GlobalFiltersBar`,
`ReportPeriodSelector`, `DisabledAction`, `Skeletons`, `ErrorState`.

**Modules de données** : `lib/backoffice-types.ts`, `lib/backoffice-data.ts` (module serveur,
**48 dossiers** générés de façon déterministe sur 8 pays), `lib/backoffice-session.ts`,
`lib/backoffice-nav.ts`.

### Confidentialité PAP — appliquée par le type

§24 exige que le contenu des fiches PAP ne soit **jamais** affiché par le back-office Antenne/BEC.
Le type `PapReference` ne comporte que deux champs — `exists` et `status` — et **aucun champ libre**.
La confidentialité est donc appliquée par la structure de donnée, avant même d'atteindre l'affichage :
un composant ne pourrait pas rendre une note confidentielle, elle n'existe pas dans ce qu'il reçoit.

L'interface affiche « Demande PAP : Oui — en cours », jamais davantage.

### Repli de démonstration

L'agent d'antenne est rattaché au **Sénégal** — c'est ce qui rend le contrôle de périmètre
**observable** : consulter un dossier ivoirien renvoie un 404. Le BEC a `countryCode === null`, ce qui
est une propriété du **rôle** et non une absence de restriction (`scopeDossiers()` traite
explicitement le cas BEC avant le refus par défaut).

---

## 4. Vérification par exécution

| Contrôle | Résultat |
|---|---|
| `npx tsc --noEmit` | **0 erreur** |
| `npx eslint` (back-office) | **0 erreur, 0 avertissement** |
| `npx next build` | **20 routes back-office** en rendu dynamique `ƒ`, 0 erreur |
| `robots.txt` | `Disallow: /etudiant`, `/parent`, `/antenne`, `/bec` |
| `noindex` sur les pages | déclaré dans les deux layouts de zone |
| Fuite du contenu PAP | **0 occurrence** (voir §5) |
| **Statut d'un dossier hors périmètre** | **404** — `CI-0`, `CM-0`, `XX-999` |
| **Statut d'un dossier dans le périmètre** | **200** — `SN-0` |
| **Refus pour incompatibilité de rôle** | **404** — cookie BEC sur `/antenne/*` et inverse |
| Étanchéité du périmètre (antenne SN) | **0** dossier des 7 autres pays dans le HTML servi |
| Vue consolidée BEC | **8 pays** présents au tableau de bord |

> Les mesures HTTP sont consignées dans `AUDIT_EA-POMRA_2026-09-18.md`.

---

## 5. Points en suspens

1. **Authentification** — bloquant pour une mise en production (§2.2). C'est le point n°1.
2. **Mutations** — aucune action d'écriture n'est possible : valider, refuser, transmettre, assigner,
   générer et exporter sont affichés désactivés avec leur raison.
3. **Exports** — aucun format (CSV/XLSX/PDF) n'est produit (§2.9).
4. **Période** — le sélecteur de période des filtres globaux BEC n'existe pas ; le trimestre de
   référence est une constante (§2.5).
5. **Notifications** — état lu/non lu absent, canaux WhatsApp/email non branchés (§2.7).
6. **Stockage des pièces** — l'aperçu d'un document est explicitement indisponible : aucun fichier
   n'est téléversé ni servi.
7. **Données de démonstration** — 48 dossiers fictifs générés de façon déterministe, isolés dans un
   seul module. À remplacer par la couche de données réelle.
8. **Palette** — les composants utilisent des valeurs hexadécimales directes, comme le reste du
   projet. La migration vers `var(--eap-*)` reste à faire, globalement.
9. **`app/(site)/*`** — 23 erreurs de lint préexistantes, hors périmètre de ce chantier.
10. **Page 404 dans la coquille** — un agent qui suit un lien périmé quitte le back-office et atterrit
    sur la page 404 **publique** (logo du site, liens vers `/programmes`, `/antennes`, `/contact`).
    Une `not-found.tsx` par zone la garderait dans sa coquille, mais elle serait rendue sous le
    layout de zone : or c'est ce même layout qui lève `notFound()` en cas d'incompatibilité de rôle,
    ce qui peut boucler. À traiter avec un rendu de secours qui n'exige pas de périmètre valide.
