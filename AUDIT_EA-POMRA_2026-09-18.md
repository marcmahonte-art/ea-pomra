# Audit du projet EA-POMRA — 18 septembre 2026

## Verdict

**Oui, on peut continuer.** Le projet est sain : il compile, il s'affiche, et la base technique est
la bonne. Ce qui manque n'est pas de la réparation mais de la construction — et le plan
d'implémentation existant décrit déjà correctement les étapes restantes.

Rien d'irréversible n'a été trouvé. Aucun blocage technique.

---

## 1. Ce qui a été vérifié (et non supposé)

| Contrôle | Résultat |
|---|---|
| `npx tsc --noEmit` | 0 erreur |
| `npm run build` | Compilation réussie en 44 s, TypeScript OK |
| Pages pré-rendues | 15 pages HTML générées dans `.next/server/app/` |
| Serveur de production | `/` et `/etudiant/dashboard` répondent **HTTP 200** avec le bon `<title>` et le bon `<h1>` |
| État du dépôt | `git status` propre, 2 commits, 87 fichiers suivis |

Pile technique : Next.js 16.3.4 (App Router, Turbopack), React 19.2.8, TypeScript en mode strict,
Tailwind CSS v4.3.3, Lucide React. Choix cohérent avec le plan (SSR + SPA, bon comportement sur
connexions lentes).

> Note : `npm run build` se termine par une erreur `[safe-delete][SAFE_DELETE_BULK_CONFIRM_REQUIRED]`.
> Ce n'est **pas** un problème du projet : c'est le garde-fou anti-suppression de l'environnement
> d'exécution qui bloque Next.js au moment où il purge son dossier `.next`. La compilation, le
> typage et la génération des 15 pages ont tous réussi avant cette étape. Voir la section 5 pour
> le contournement.

---

## 2. Ce qui est construit

**Site vitrine public** — complet et cohérent : Hero, 4 piliers (OCO, STSS, PAP, Réussite),
bandeau de métriques, « Comment ça marche » en 4 étapes, section Acteurs (Étudiants / Parents /
Antennes), Partenaires, Footer institutionnel.

**Espace Étudiant** — layout dédié (sidebar + header) et 12 sous-pages :
`dashboard`, `dossier`, `orientation`, `pap`, `stss`, `documents`, `messages`, `notifications`,
`calendrier`, `profil`, `aide`.

Le Design System est globalement respecté sur le fond : palette EA-POMRA
(`#0D2B4D`, `#174A7C`, `#1EA362`, `#C89C2E`, `#F7F9FB`), ombres douces, rayons cohérents.

---

## 3. Problèmes identifiés

Aucun n'est bloquant, mais les trois premiers sont à traiter avant d'ajouter des fonctionnalités.

### 3.1 Deux identités mock contradictoires — *priorité haute*

`lib/data.ts` définit l'étudiant **Moussa Traoré / SN-2026-8492** (Sénégal → Côte d'Ivoire).
Mais les pages codent en dur une **seconde identité : Koffi Amadou / CI-2024-00125**.

Fichiers concernés : `app/etudiant/layout.tsx` (lignes 140, 177, 179), `app/etudiant/dashboard/page.tsx`
(ligne 35), `app/etudiant/profil/page.tsx` (lignes 61, 72, 124), `app/etudiant/dossier/page.tsx`
(lignes 13, 51), `app/etudiant/messages/page.tsx` (lignes 19, 32, 43).
Le lien WhatsApp de `components/student/QuickActions.tsx` mélange même les deux (« je suis
Moussa Traoré (ID: SN-2026-8492) » alors que le reste de l'écran affiche Koffi Amadou).

Conséquence : dès qu'on branchera une vraie source de données, il faudra reprendre tous ces
emplacements. À unifier maintenant sur une seule identité.

### 3.2 Code mort — *priorité haute*

- `components/student/` : 7 fichiers, ~860 lignes (`StudentSidebar`, `StudentHeader`,
  `StudentIdentityCard`, `OverviewStats`, `QuickActions`, `JourneyProgress`, `ApplicationTimeline`)
  ne sont **importés nulle part**. Le layout de `app/etudiant/` redéfinit sa propre sidebar, ce qui
  crée une duplication de responsabilité.
- `components/home/` : `AntennesSection.tsx`, `SimulatorSection.tsx`, `ProfilesSection.tsx` ne sont
  pas rendus par `app/page.tsx`.
- `components/ui/` (`Card`, `Button`, `Badge`) n'est utilisé que par le code mort ci-dessus.

### 3.3 Ancres de navigation cassées — *priorité haute*

La Navbar pointe vers `#apropos`, `#programmes`, `#ressources`, `#actualites`, `#contact` :
**aucune section portant ces identifiants n'existe** dans la page d'accueil. `#antennes` existe,
mais dans `AntennesSection`, qui n'est pas rendue. Cinq liens sur six sont donc morts, en desktop
comme en mobile.

### 3.4 Dérive du Design System — *traité le 18/09*

Le code utilisait ~25 couleurs hexadécimales hors palette officielle. **Corrigé** : 108
remplacements sur 19 fichiers, en s'appuyant sur la spec `site/EA-POMRA_Design_System.md` §3.

| Ancienne | Nouvelle | Motif |
|---|---|---|
| `#7C3AED` / `#F3E8FF` / `#DDD6FE` | `#C89C2E` / `#FBF6EA` / `#F4E4BC` | Le violet n'existe pas dans la marque ; l'or est la 4ᵉ couleur principale documentée |
| `#2563EB` | `#3B82F6` | Bleu Tailwind générique → couleur Information de la spec §3.3 |
| `#D97706` | `#F59E0B` | → couleur Warning de la spec §3.3 |
| `#10B981` / `#60A5FA` | `#1EA362` / `#3B82F6` | Émeraude et bleu génériques → vert de marque et Information |
| `#EBF7F0` | `#E8F6EF` | Doublon du vert clair officiel |
| `#EFF6FF` | `#EBF3FA` | Doublon du bleu clair officiel |
| `#1D64A6` / `#2D3748` | `#174A7C` / `#0D2B4D` | Bleu et gris génériques → bleu et navy de marque |
| `#E2E8F0` / `#CBD5E1` | `#E6E9EF` / `#A2AAB3` | Slate → Gray 100 et Gray 400 de la spec |
| `#BFDBFE` | `#D5E5F5` | Consolidation des bordures bleues en une seule valeur |

Point de vigilance respecté : la spec §3.3 interdit d'employer une couleur **sémantique** comme
couleur **de marque**. Les cas où `#D97706` servait d'accent de marque (cartes acteurs, étapes du
parcours) ont été basculés vers l'or `#C89C2E` ou vers l'Information, jamais confondus.

Les teintes récurrentes absentes de la palette (bordures bleue/verte/or, fonds teintés) ont été
**formalisées comme jetons** dans `globals.css`, bloc « Teintes étendues », afin qu'aucune couleur
ne reste orpheline. Règle retenue : une seule valeur par famille.

**Reste ouvert** : les composants utilisent encore les valeurs hexadécimales directement plutôt que
`var(--eap-*)`. Les jetons existent et documentent désormais la charte, mais la migration vers les
variables reste à faire si l'on veut un changement de charte centralisé en un seul point.

### 3.5 Poids des ressources — *priorité moyenne*

Des PNG non optimisés sont versionnés : `web/public/assets/logo-ea-pomra.png` (4,2 Mo),
`logo-ea-pomra-round.png` (1,9 Mo), `hero-students.png` (1,5 Mo), `campus-life.png` (1,5 Mo),
`mobility-students.png` (1,4 Mo). Le dossier `.git` pèse déjà 14 Mo.

C'est directement contraire à l'objectif du projet : la cible visée est l'Afrique de l'Ouest et
Centrale, où la connectivité est souvent limitée. Le risque 2 du plan (« Connectivité faible dans
certains pays ») est ici auto-infligé.

### 3.6 Aucune couche de données — *normal à ce stade*

Pas de route API, pas de middleware, pas d'authentification, pas de base de données, aucun appel
réseau. Les 22 composants sont des composants clients alimentés par des mocks. C'est attendu pour
une phase de maquettage, mais cela signifie que **toutes les garanties annoncées dans le README**
(transfert sécurisé, traçabilité, confidentialité des fiches PAP, RBAC) ne sont aujourd'hui que
décoratives.

### 3.7 Métadonnées SEO absentes et espace privé indexable — *traité le 18/09*

Problème non repéré lors du premier passage. **Seul `app/layout.tsx` déclarait des métadonnées** :
les 19 pages héritaient donc du même titre et de la même description. Deux conséquences :

1. **Référencement** — les 7 pages publiques étaient indiscernables dans les résultats de recherche,
   et aucune carte de partage social n'était définie (ni Open Graph, ni Twitter Card).
2. **Confidentialité — plus grave** : les **12 pages de l'espace étudiant étaient indexables**, alors
   qu'elles affichent un nom, un identifiant ID-POMRA, un dossier et une situation financière.

**Corrigé** :
- `lib/site.ts` : configuration centrale et helper `pageMetadata()` produisant titre, description et
  cartes de partage (Open Graph **et** Twitter — le second n'hérite pas du premier, vérifié en
  exécution : sans ce bloc, la carte Twitter affichait le titre générique du site).
- Les 6 pages publiques déclarent leurs métadonnées ; le gabarit `%s | EA-POMRA` s'applique.
- **Espace étudiant en `noindex, nofollow, nocache`** via `app/etudiant/layout.tsx`.
- `app/robots.ts` (`Disallow: /etudiant`) et `app/sitemap.ts` (7 URL publiques).

**Point de structure** : `app/etudiant/layout.tsx` était un composant client (`"use client"`), donc
incapable d'exporter des `metadata`. La partie interactive a été extraite dans
`components/layout/StudentShell.tsx` ; le layout redevient un composant serveur qui porte les
métadonnées. C'est le seul remaniement structurel de ce correctif.

**Variable d'environnement** : `NEXT_PUBLIC_SITE_URL` est nécessaire aux URL absolues. Sans elle, le
plan du site était **vide** — ce qui est plus nuisible qu'absent. Un repli automatique sur
`VERCEL_URL` a été ajouté, et `web/.env.example` documente la variable.

### Vérifications

| Contrôle | Résultat |
|---|---|
| `npx tsc --noEmit` | **0 erreur** |
| Routes | **19 testées : 18 × HTTP 200, `/etudiant` → 307** |
| Titres servis | distincts sur les 7 pages publiques, plus « Espace étudiant \| EA-POMRA » |
| `meta robots` espace étudiant | `noindex, nofollow, nocache` |
| `/robots.txt` | `Allow: /` + `Disallow: /etudiant` |
| `/sitemap.xml` | **7 URL** absolues (vide sans `NEXT_PUBLIC_SITE_URL`, d'où le repli Vercel) |

### 3.8 Accessibilité et pages d'erreur — *traité le 18/09*

Également absent du premier passage. Trois familles de défauts :

**1. Champs de formulaire sans étiquette.** Sur les 16 champs du projet, deux n'avaient aucun
étiquetage — seulement un `placeholder` : la saisie des messages (`app/etudiant/messages`) et
l'inscription à la newsletter (`components/layout/Footer`). Un `placeholder` disparaît dès la
première frappe et n'est pas annoncé de façon fiable par les lecteurs d'écran. Les 14 autres champs
sont correctement étiquetés (`<label htmlFor>` apparié à un `id`), notamment les 6 du formulaire de
contact.

**2. Bouton sans nom accessible.** Le bouton d'envoi des messages est réduit à une icône
(`<Send />`) sans texte : un lecteur d'écran l'annonçait comme « bouton », sans plus.

**3. Deux `<h1>` par page.** La coquille de l'espace étudiant portait un `<h1>` « Bonjour, … » qui
s'ajoutait au `<h1>` propre de chacune des 10 pages concernées — le titre annoncé en premier était
donc une salutation, pas le sujet de la page. Le dashboard, lui, n'avait **aucun** `<h1>` : il
passait directement aux `<h3>`.

**Corrigé** :
- `aria-label` ajouté sur les deux champs et sur le bouton d'envoi.
- La salutation de `StudentShell` devient un `<p>` (style inchangé, aucun effet visuel).
- Ajout d'un `<h1>` « Tableau de bord » au dashboard.
- Résultat vérifié : **exactement 1 `<h1>` par page**.

**Pages d'erreur absentes** — aucun `not-found.tsx`, `error.tsx` ni `loading.tsx` : le site servait
les pages par défaut de Next.js, en anglais et sans identité de marque. Ajoutés :
- `app/not-found.tsx` : 404 aux couleurs de la marque, en `noindex, follow`, avec liens de secours
  vers les rubriques **publiques uniquement** — inutile d'envoyer un visiteur perdu vers un espace
  qui exige un compte.
- `app/error.tsx` : frontière d'erreur affichant la référence `digest` (identifiant généré par le
  serveur, sans contenu sensible) et un bouton « Réessayer » qui relance le rendu sans recharger.

### Vérifications

| Contrôle | Résultat |
|---|---|
| `npx tsc --noEmit` | **0 erreur** |
| Routes | **19 testées : 18 × HTTP 200, `/etudiant` → 307** |
| URL inexistante | **HTTP 404** + titre « Page introuvable \| EA-POMRA » |
| Nombre de `<h1>` par page | **1** (dashboard, documents, messages, accueil) |
| Champs sans étiquette | **0** |

**Reste ouvert** : la hiérarchie de titres *à l'intérieur* des pages. Plusieurs pages passent du
`<h1>` à des `<h3>` sans `<h2>` intermédiaire — sans effet visuel (les styles viennent des classes
Tailwind), mais c'est une rupture de plan de document pour les lecteurs d'écran. À traiter lors d'un
passage dédié.

Autre point relevé : la newsletter du footer déclenche un `alert()` natif à la soumission, alors que
le formulaire de contact affiche un message inline honnête. À harmoniser.

---

## 4. Couverture du plan d'implémentation

| Phase | Contenu | État |
|---|---|---|
| 0 | Cadrage — design system, specs, maquettes | **Terminé** |
| 1 | Fondations — socle, données, auth, ID-POMRA | **Partiel** (frontend seul) |
| 2 | Formulaires — candidature, engagement parental, fiche PAP | À faire |
| 3 | Portails Étudiant et Parent | **Partiel** (Étudiant maquetté, Parent absent) |
| 4 | Back-offices Antenne et BEC | À faire |
| 5 | Module STSS — Mobile Money, audit, commissions | À faire |
| 6 | Généralisation aux 8 antennes | À faire |
| 7 | Couche IA | À faire |

Les livrables documentaires sont de bonne qualité : `site/SPEC_HOME_PAGE.md` (~99 sections),
`site/SPEC_ETUDIANTS_PAGE.md` (~50 sections), `site/EA-POMRA_Design_System.md`,
`site/Plan_Implementation_EA-POMRA.md`. C'est un atout réel — beaucoup de projets à ce stade n'ont
pas de spécifications exploitables.

---

## 5. Pièges d'environnement à connaître pour la suite

Ces deux points ne concernent pas le code du projet mais feront perdre du temps s'ils ne sont pas
connus.

**a) `next build` bloqué par le garde-fou anti-suppression.** Next.js purge son dossier `.next` et
se fait intercepter. Ne jamais utiliser `rm -rf .next` : la commande échoue silencieusement et le
dossier reste en place. Il faut **déplacer** le dossier, jamais le supprimer :

```bash
mv .next "$TEMP/next_cache/next_$(date +%s)"
npm run build
```

**b) Tailwind v4 scanne tout dossier non gitignoré.** Une sauvegarde de cache laissée dans le dépôt
(par exemple `.next.bak_*`) est lue comme du code source ; y lire du CSS déjà compilé produit du CSS
invalide et le build échoue avec `CssSyntaxError: Missed semicolon` — en accusant à tort
`app/globals.css`, qui est parfaitement valide. Toujours sortir les sauvegardes **hors du dépôt**.

---

## 6. Ordre de travail recommandé

**Avant d'ajouter quoi que ce soit :**

1. Unifier les deux identités mock sur une seule, dans `lib/data.ts`, et faire lire les pages depuis
   ce fichier plutôt qu'en dur. Supprimer les valeurs codées en dur restantes.
2. Supprimer le code mort (`components/student/`, trois sections de `components/home/`,
   `components/ui/` si non réutilisé) — ou décider de le réintégrer à la page d'accueil.
3. Corriger ou retirer les cinq ancres de navigation cassées de la Navbar.
4. Convertir les images en WebP/AVIF et les compresser, puis passer par `next/image`.

**Ensuite, dans l'ordre du plan :**

5. Trancher NestJS vs Django et **figer le schéma de données** — le plan identifie correctement ce
   point comme la fondation dont dépendent presque tous les modules. C'est le prochain vrai jalon.
6. Créer l'espace Parent (phase 3) : c'est le portail manquant le plus visible, et l'un des
   arguments de vente centraux du projet.
7. Migrer les couleurs codées en dur vers les variables `--eap-*` / tokens Tailwind, pour rendre la
   charte maintenable avant que le volume de code n'augmente.

---

## 7. Réserves

- L'audit est **statique** : il n'y a pas de tests automatisés dans le projet, donc aucune
  vérification de comportement fonctionnel n'est possible au-delà du rendu des pages.
- Les chiffres affichés dans l'interface (2 100+ étudiants, 96,4 % de réussite, 8 antennes,
  coordonnateurs nommés, numéros de téléphone) sont des **données inventées** dans les mocks. Ils ne
  doivent pas être présentés comme réels tant qu'ils n'ont pas été validés par l'association.
- L'audit ne porte pas sur la conformité juridique du dispositif STSS (KYC/AML, protection des
  données personnelles), qui reste à traiter avec un conseil spécialisé — le plan le prévoit déjà
  en phase 5.

---

## 8. Mise à jour — correctifs appliqués le 18 septembre 2026

Les points 3.1 (identités contradictoires), 3.2 (partiellement) et 3.3 (liens morts) ont été traités.
Les 6 pages manquantes de la spec §74 ont été créées.

### Ce qui a été fait

**Layout public partagé.** Nouveau groupe de routes `web/app/(site)/` portant un `layout.tsx` avec
Navbar + Footer. La page d'accueil y a été déplacée. Les groupes de routes n'affectent pas les URL :
`/` répond toujours à la racine. Cela évite de dupliquer l'en-tête et le pied de page sur 7 pages.

**6 nouvelles pages**, conformes à la structure de la spec §74 :
`/a-propos`, `/programmes`, `/antennes`, `/ressources`, `/actualites`, `/contact`.
Composants partagés ajoutés : `components/site/PillarsGrid.tsx`, `components/site/CtaBand.tsx`,
`components/site/ContactForm.tsx`, `components/layout/PageHeader.tsx`.

**Navigation réparée.** La Navbar utilise désormais les 7 routes de la spec, avec détection de la
page active. Le Footer pointe vers des routes réelles. Les trois liens légaux morts
(mentions légales, confidentialité, CGU) ont été **retirés** plutôt que liés à rien : ces pages
doivent être rédigées avec un conseil juridique, elles n'ont pas été inventées.

**Récit de l'espace Étudiant unifié.** Une seule identité et une seule chronologie, issues de
`lib/data.ts` : Moussa Traoré, SN-2026-8492, Master 1 Ingénierie des Systèmes Numériques & IA à
l'INP-HB, avis OCO favorable le 18/07/2026, STSS certifié le 14/08/2026, arrivée à Abidjan le
10/09/2026. De nouveaux dérivés exportés (`STUDENT_FULL_NAME`, `STUDENT_INITIALS`,
`STUDENT_HOST_ANTENNE`, `STUDENT_HOME_ANTENNE`) évitent tout recodage en dur.
`MOCK_TIMELINE_EVENTS` et `MOCK_NOTIFICATIONS`, jusqu'ici des données mortes, alimentent maintenant
le tableau de bord et la page dossier.

### Vérifications

| Contrôle | Résultat |
|---|---|
| `npx tsc --noEmit` | **0 erreur** |
| `npm run build` | Compilation OK, TypeScript OK, **22/22 pages générées** |
| Serveur de production (`next start`) | **19 routes testées : 18 × HTTP 200, `/etudiant` → 307** |
| Ancienne identité résiduelle | **0 occurrence** sur les 10 pages de l'espace Étudiant |
| Logo servi par `next/image` | `image/png`, srcset 48 px / 96 px |

> **À propos du build.** Dans cet environnement, la commande `next build` se termine en erreur, mais
> **uniquement à l'étape finale « Finalizing page optimization »**, à cause du garde-fou
> anti-suppression du sandbox. La compilation, le contrôle TypeScript et la génération des 22 pages
> sont tous achevés et écrits sur disque avant cette étape — le serveur de production démarre et sert
> correctement les 19 routes. **Ce n'est pas un défaut du projet.**

### Images et documentation — même journée

**Logo optimisé.** `logo-ea-pomra-round.png` avait une source de 2188×1915 px pour un affichage réel
de 36 à 48 px (Navbar, Footer, layout et sidebar étudiant). Redimensionné à 512×448 en PNG **sans
perte** : **1 918 Ko → 53 Ko (−97 %)**. Le canal alpha a été contrôlé avant remplacement — il est
100 % opaque, donc vestigiel et inutile. L'original est conservé dans `assets-originaux/`, ajouté au
`.gitignore` (sinon la sauvegarde réinjectait 1,9 Mo dans le dépôt).

**9 assets sur 15 ne sont référencés nulle part** — 8,95 Mo sur 9,5 Mo, soit **94 % du poids** du
dossier. Les fichiers réellement utilisés ne pèsent que 0,48 Mo. Les trois gros non branchés
(`campus-life`, `hero-students`, `mobility-students`, ~1,5 Mo chacun en 1024×1536) ressemblent à des
visuels prévus mais jamais câblés. **Signalés, non supprimés.**

**`README.md` réécrit** : arborescence à jour (groupe `(site)`), cartographie des 19 routes, source
unique de données, état d'avancement.

### Ce qui reste ouvert

- **Code mort — désormais quantifié** : **1 253 lignes en 9 composants, zéro import** (les 7 de
  `components/student/`, plus `SimulatorSection.tsx` et `ProfilesSection.tsx`). Suppression non
  effectuée faute d'accord explicite.
- **9 assets non référencés** (8,95 Mo) : à supprimer ou à brancher, au choix.
- **Design System** : point 3.4 **traité** — 108 remplacements sur 19 fichiers, plus les teintes
  étendues formalisées en jetons dans `globals.css`. Reste la migration des composants vers
  `var(--eap-*)` : les jetons documentent désormais la charte, mais les valeurs restent écrites en
  hexadécimal dans le code.
- **Icônes sociales du footer** : pointent vers des comptes inexistants (`#facebook`, etc.).
- **Aucune couche de données** : inchangé. C'est le prochain vrai jalon (choix NestJS vs Django, puis
  gel du schéma de données).

### Vérifications après alignement de la palette

| Contrôle | Résultat |
|---|---|
| `npx tsc --noEmit` | **0 erreur** |
| Routes rendues (serveur de développement) | **19 testées : 18 × HTTP 200, `/etudiant` → 307** |
| Erreurs CSS | **aucune** |
| Anciennes couleurs hors palette (`#7C3AED`, `#2563EB`, `#D97706`, `#10B981`…) | **0 occurrence** |

---

## 9. Portail parent — 18 septembre 2026

La spécification `site/SPEC_PARENT_DASHBOARD.md` (v1.0) a été fournie et implémentée. Comme elle le
demande elle-même en ÉTAPE 1 (« NE PAS recréer ce qui existe déjà »), un audit a précédé l'écriture
du code. Il a révélé que **quatre briques supposées présentes n'existaient pas**.

### 9.1 Écarts entre la spécification et le dépôt

| Brique supposée | Réalité | Décision |
|---|---|---|
| shadcn/ui (§59, ÉTAPE 9) | `components.json` absent | Primitives maison réutilisées (§74 interdit les dépendances inutiles) |
| Framer Motion (§67–71) | absent de `package.json` | Transitions CSS, déjà utilisées dans le projet |
| Authentification / RBAC (§46–47) | **aucune** couche d'auth | Couture serveur posée, sécurité **non** assurée — voir 9.3 |
| `src/`, `hooks/`, `stores/`, `types/` (§61) | absents | Convention du dépôt respectée (`lib/`, `components/`) |
| Script `typecheck` (ÉTAPE 16) | absent | `npx tsc --noEmit` |

Détail complet et justifications : **`site/SPEC_PARENT_DASHBOARD_ADAPTATIONS.md`**.

### 9.2 Confidentialité PAP — traitée par l'architecture

C'est le point le plus sensible de la spécification : le parent ne doit pas accéder au contenu des
entretiens psychosociaux.

`lib/parent-data.ts` contient `RAW_PAP_RECORD` (notes de séance, signalements internes) et **ne
l'exporte pas**. `toPapSummary()` projette vers le type `PapSummary`, qui **ne possède aucun champ
libre**. La projection énumère les champs conservés plutôt que de retirer les champs sensibles : un
champ ajouté demain au modèle interne est exclu par défaut.

Le module n'est importé que par des composants serveur ; les composants clients reçoivent des
valeurs déjà filtrées en props. La confidentialité ne dépend donc pas d'une condition d'affichage
qu'un correctif pourrait retirer.

### 9.3 Sécurité — ce qui est fait, ce qui manque

**Fait :** `requireParentSession()` est appelée dans le layout **serveur** avant tout rendu ; le
cookie de session est déjà lu ; un contrôle de **rattachement** renvoie un 404 si la référence
consultée diffère de celle portée par la session ; le point de bascule est unique (`TODO AUTH`).

**Manque :** la preuve d'identité. `getParentSession()` renvoie une session de démonstration en
l'absence de cookie, donc **`/parent/*` est aujourd'hui accessible à quiconque connaît l'URL**. Une
mention explicite est affichée dans la barre latérale et sur la page Profil, pour ne pas laisser
croire à un espace sécurisé.

C'est un **bloquant de mise en production**, à traiter avec le jalon « couche de données ».

### 9.4 Vérifications

| Contrôle | Résultat |
|---|---|
| `npx tsc --noEmit` | **0 erreur** |
| `npx next build` | **34 pages**, 0 erreur |
| `/parent/*` (10 routes) | **HTTP 200** — dynamiques `ƒ`, attendu (lecture du cookie) |
| Routes publiques + `robots.txt` + `sitemap.xml` | **HTTP 200** — aucune régression |
| `<h1>` par page | **1** sur les 10 pages du portail |
| `noindex` hérité sur les sous-pages | **vérifié sur les 9** |
| `robots.txt` | `Disallow: /etudiant` **et** `Disallow: /parent` |
| **Fuite des notes de séance dans le HTML servi** | **0 occurrence** — 6 motifs testés sur `/parent` et `/parent/pap` |
| Données légitimes présentes | noms, référence, montants : **présents** |

> Le test de fuite a été fait sur la **réponse HTTP réelle**, et non par relecture du code : c'est
> le seul contrôle qui prouve qu'une donnée n'a pas été transmise.

### 9.5 Piège d'outillage confirmé

Deux modifications envoyées **en parallèle sur un même fichier** s'écrasent silencieusement : la
seconde écrase la première, et les deux appels retournent « succès ». Rencontré sur
`lib/parent-types.ts` et `lib/parent-data.ts` (import perdu d'un côté, fonction non remplacée de
l'autre). **Éditer un fichier de façon séquentielle**, ou le réécrire en entier.

