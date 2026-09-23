# EA-POMRA — SPECIFICATION FONCTIONNELLE & UI/UX
# BACK-OFFICES ANTENNE & BEC

**Version :** 1.0  
**Projet :** EA-POMRA — Étudiant en Afrique, Plateforme d’Orientation, de Mobilité et de Réussite Académique  
**Phase :** Phase 4 — Back-offices Antenne et BEC  
**Durée indicative du plan :** 4 semaines  
**Statut :** Spécification de conception et d’implémentation

---

## 1. OBJECTIF DU DOCUMENT

Ce document définit précisément les écrans, comportements, composants, règles métier, permissions, responsive design, architecture frontend et consignes d’implémentation des deux back-offices :

- **Back-office Antenne** : gestion opérationnelle des dossiers d’un pays/antenne, registre chronologique et rapports trimestriels.
- **Back-office BEC** : supervision consolidée des 8 pays, validation finale et statistiques globales.

Le plan d’implémentation EA-POMRA définit la Phase 4 comme suit :

- Antenne : registre chronologique, gestion des dossiers du pays, rapport trimestriel.
- BEC : vue consolidée des 8 pays, validation finale, statistiques globales.
- File Expert OCO : avis technique et orientation.
- Espace Responsable PAP : alertes, mentorat et historique.
- Livrable attendu : chaîne complète de traitement d’un dossier de bout en bout.

Cette spécification se concentre sur les **Back-offices Antenne et BEC**. Les modules OCO/PAP disposent d’une spécification séparée.

---

# 2. PÉRIMÈTRE FONCTIONNEL

## 2.1 Back-office Antenne

Le rôle Antenne doit pouvoir :

1. consulter les dossiers de son périmètre ;
2. rechercher un étudiant/dossier ;
3. filtrer les dossiers ;
4. consulter le détail d’un dossier ;
5. vérifier les pièces ;
6. suivre le statut du dossier ;
7. consulter l’historique chronologique ;
8. préparer/transmettre les éléments nécessaires à l’orientation ;
9. suivre la mobilité et le suivi du dossier ;
10. consulter/générer les rapports trimestriels selon ses droits ;
11. consulter les notifications et alertes opérationnelles ;
12. préparer les informations STSS lorsque le module est disponible.

## 2.2 Back-office BEC

Le BEC doit pouvoir :

1. consulter les dossiers des 8 pays selon ses droits ;
2. disposer d’une vue consolidée ;
3. rechercher et filtrer globalement ;
4. consulter le détail d’un dossier ;
5. effectuer les validations finales autorisées ;
6. suivre les dossiers en attente ;
7. consulter les statistiques globales ;
8. comparer les volumes par pays sans produire de classement métier implicite ;
9. consulter les rapports ;
10. suivre les activités récentes ;
11. contrôler les actions sensibles via l’historique/audit.

---

# 3. PRINCIPES UX

L’interface doit être :

- professionnelle ;
- institutionnelle ;
- claire ;
- moderne ;
- sobre ;
- responsive ;
- utilisable sur une connexion faible ;
- orientée traitement opérationnel ;
- cohérente avec le design system EA-POMRA ;
- accessible au clavier autant que possible ;
- lisible sur écran 1366×768 minimum.

Éviter :

- les dashboards surchargés ;
- les animations longues ;
- les tableaux illisibles sur mobile ;
- le chargement de milliers de dossiers côté client ;
- les couleurs utilisées comme seul indicateur de statut ;
- les informations confidentielles visibles sans contrôle RBAC.

---

# 4. DESIGN SYSTEM EA-POMRA

## 4.1 Couleurs

```text
Navy       #0D2B4D
Blue       #174A7C
Green      #1EA362
Gold       #C89C2E
Background #F7F9FB
White      #FFFFFF
Text       #1F2937
Muted      #667085
Border     #E6E9EF
Success    #22C55E
Info       #3B82F6
Warning    #F59E0B
Error      #EF4444
```

## 4.2 Typographie

Police principale : **Plus Jakarta Sans**.

```text
Page title       28–32 px / 700
Section title    18–20 px / 700
Card title       15–16 px / 700
Body             14–15 px / 400–500
Small            12–13 px / 400–500
Table            13–14 px
```

## 4.3 Rayons

```text
Card             16px
Button           10px
Input            10px
Dialog           18px
Badge            9999px
Avatar           9999px
```

## 4.4 Espacements

```text
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 px
```

---

# 5. LAYOUT DESKTOP

Référence : **1440 × 900 px**.

```text
┌───────────────────────────────────────────────────────────────┐
│                         HEADER 76px                            │
├───────────────┬───────────────────────────────────────────────┤
│               │                                               │
│   SIDEBAR     │                  MAIN CONTENT                 │
│   248px       │                                               │
│               │                  max-width 1184px             │
│               │                  padding 32px                 │
│               │                                               │
└───────────────┴───────────────────────────────────────────────┘
```

## Sidebar

- largeur : 248px ;
- position : fixed ;
- hauteur : 100vh ;
- fond : `#FFFFFF` ;
- bordure droite : `#E6E9EF` ;
- z-index : 30 ;
- padding horizontal : 16px ;
- padding vertical : 20px.

## Header

- hauteur : 76px ;
- position : sticky ;
- top : 0 ;
- z-index : 20 ;
- fond blanc avec bordure inférieure ;
- contient : breadcrumb/titre, recherche éventuelle, notifications, profil utilisateur.

## Main

- margin-left : 248px ;
- padding : 32px ;
- max-width recommandé : 1184px ;
- width : 100% ;
- margin-right : auto.

---

# 6. SIDEBAR ANTENNE

Route principale : `/antenne`

Navigation :

```text
Tableau de bord
Dossiers
Orientation
Mobilité
Suivi
Documents
STSS
Rapports
Notifications
Historique
```

Bas de sidebar :

```text
Profil
Paramètres
Déconnexion
```

Le menu doit afficher uniquement les entrées autorisées par le rôle.

## États

- actif : fond léger + texte Navy/Blue ;
- hover : fond `#F7F9FB` ;
- disabled : opacité réduite ;
- badge : nombre de dossiers/alertes lorsque pertinent.

---

# 7. SIDEBAR BEC

Route principale : `/bec`

Navigation :

```text
Tableau de bord
Dossiers
Validation
Statistiques
Rapports
Activité
Notifications
Historique
```

Le BEC doit disposer d’une indication claire de son périmètre **global / 8 pays**.

---

# 8. DASHBOARD ANTENNE

Route :

```text
/antenne
```

## 8.1 Header

Afficher :

```text
Tableau de bord
[Nom de l’antenne / pays]
[Période]
```

Actions éventuelles :

- Actualiser ;
- Exporter rapport si autorisé.

## 8.2 KPI

Afficher quatre cartes :

### Dossiers reçus
Nombre de dossiers reçus sur la période sélectionnée.

### À traiter
Dossiers nécessitant une action de l’antenne.

### En attente
Dossiers bloqués/en attente d’un élément ou d’un acteur externe.

### Traités
Dossiers traités sur la période.

Chaque KPI doit comporter :

- valeur principale ;
- libellé ;
- période ;
- variation éventuelle si une donnée de comparaison existe réellement.

Ne pas inventer de variation si aucune donnée de comparaison n’est disponible.

## 8.3 File opérationnelle

Bloc : **Dossiers nécessitant une action**.

Colonnes :

```text
ID-POMRA
Étudiant
Type d’action
Statut
Dernière mise à jour
Priorité opérationnelle
Action
```

Actions :

```text
Consulter
Traiter
```

## 8.4 Alertes

Types :

- dossier incomplet ;
- document à vérifier ;
- dossier en attente ;
- délai opérationnel ;
- notification système.

## 8.5 Activité récente

Afficher les dernières actions :

```text
Date / heure
Utilisateur
Action
Dossier
Résultat
```

## 8.6 Rapport trimestriel

Carte permettant d’accéder au rapport de la période :

```text
Rapport trimestriel
[Voir]
[Générer]
[Télécharger]
```

Les boutons doivent dépendre des permissions.

---

# 9. DASHBOARD BEC

Route :

```text
/bec
```

## 9.1 Filtres globaux

En haut :

```text
[Période]
[Pays]
[Programme]
[Formation]
```

Boutons :

```text
Réinitialiser
Appliquer
```

## 9.2 KPI globaux

```text
Total dossiers
Dossiers en attente
Dossiers à valider
Dossiers validés
```

## 9.3 Vue des 8 pays

Composant : `CountryOverviewGrid`.

Pour chaque pays :

```text
Pays
Nombre de dossiers
En attente
À valider
Validés
```

Cette vue sert au pilotage opérationnel et ne doit pas transformer automatiquement les données en classement de performance.

## 9.4 File de validation

Afficher les dossiers nécessitant une validation BEC.

Colonnes :

```text
ID-POMRA
Étudiant
Pays
Programme
Statut
Dernière mise à jour
Action
```

## 9.5 Statistiques

Afficher selon les données disponibles :

- volume de dossiers ;
- évolution temporelle ;
- répartition par pays ;
- répartition par statut ;
- répartition par programme ;
- répartition par formation ;
- dossiers en attente ;
- dossiers validés.

Aucune statistique ne doit être calculée côté interface si elle nécessite de parcourir toute la base. Utiliser des agrégations serveur.

---

# 10. GESTION DES DOSSIERS

Routes :

```text
/antenne/dossiers
/bec/dossiers
```

## 10.1 Recherche

Recherche serveur avec :

```text
Nom / prénom
ID-POMRA
Numéro de dossier
Email
Téléphone
```

La recherche doit être debouncée côté interface et paginée côté serveur.

## 10.2 Filtres Antenne

```text
Statut
Programme
Formation
Date
Complétude
```

## 10.3 Filtres BEC

```text
Pays / Antenne
Statut
Programme
Formation
Date
Complétude
```

## 10.4 Tableau desktop

Colonnes :

```text
ID-POMRA
Étudiant
Programme
Formation
Statut
Complétude
Dernière mise à jour
Antenne
Action
```

Pour BEC, la colonne Antenne/Pays est obligatoire.

### Dimensions

```text
Header : 44px minimum
Ligne : 64px minimum
Padding horizontal : 16px
```

## 10.5 Pagination

Afficher :

```text
Page précédente
Pages
Page suivante
Nombre de résultats
Taille de page
```

La pagination doit être serveur.

---

# 11. VERSION MOBILE DU TABLEAU

Ne pas réduire un tableau desktop de façon illisible.

À partir du breakpoint mobile, transformer chaque ligne en `DossierCard`.

Exemple :

```text
┌─────────────────────────────┐
│ ID-POMRA-000123             │
│ Nom Prénom                  │
│ Programme                   │
│                             │
│ Statut       À vérifier     │
│ Complétude   80 %           │
│ Mise à jour  Aujourd’hui    │
│                             │
│       [Consulter]           │
└─────────────────────────────┘
```

---

# 12. FILTRES RESPONSIVE

Desktop : filtres affichés horizontalement.

Tablet : filtres sur deux lignes ou dans un panneau.

Mobile : bouton :

```text
[Filtres]
```

qui ouvre un `Sheet` depuis le bas ou la droite.

---

# 13. DÉTAIL D’UN DOSSIER

Routes :

```text
/antenne/dossiers/[id]
/bec/dossiers/[id]
```

## 13.1 En-tête

Afficher :

```text
← Retour aux dossiers
ID-POMRA
Statut actuel
Dernière mise à jour
```

Actions autorisées :

```text
Modifier
Assigner
Transmettre
Valider
```

Ne jamais afficher une action simplement parce qu’elle existe dans le frontend : elle doit être validée côté serveur par RBAC.

## 13.2 Résumé

```text
Identité
Programme
Formation
Pays / Antenne
Date de candidature
Statut
Complétude
```

## 13.3 Sections

Utiliser des `Tabs` ou sections structurées :

```text
Résumé
Statut
Documents
Orientation
Mobilité
Suivi
STSS
Historique
```

---

# 14. GESTION DES DOCUMENTS

Route :

```text
/antenne/documents
```

Les documents sont des pièces sécurisées du dossier.

## Statuts

```text
Manquant
À vérifier
Validé
Refusé
```

## Tableau

```text
Document
Type
Statut
Date d’ajout
Vérifié par
Dernière mise à jour
Action
```

## Vérification

Utiliser `DocumentVerificationDialog`.

Contenu :

```text
Nom du document
Type
Date d’ajout
Aperçu
Statut
Commentaire
```

Actions :

```text
Valider
Refuser
Demander une nouvelle pièce
```

Toute action doit être enregistrée dans l’historique.

---

# 15. REGISTRE CHRONOLOGIQUE

Route :

```text
/antenne/historique
```

Objectif : fournir une trace chronologique des opérations du dossier et des actions réalisées dans le back-office.

Colonnes :

```text
Date / heure
ID-POMRA
Étudiant
Action
Ancien statut
Nouveau statut
Utilisateur
Commentaire
```

Exemple :

```text
19/09/2026 10:42
ID-POMRA-000245
Étudiant
Document validé
À vérifier → Validé
Agent Antenne
Diplôme vérifié
```

L’historique doit être consultable mais non modifiable par les utilisateurs standards.

---

# 16. ORIENTATION

Route :

```text
/antenne/orientation
```

Cette interface prépare et suit les dossiers nécessitant une orientation/avis OCO.

Afficher :

```text
Dossiers en attente d’avis
Dossiers transmis
Avis reçus
Dossiers à compléter
```

Pour chaque dossier :

```text
ID-POMRA
Programme
Formation
Statut
Date de transmission
Avis disponible ?
Action
```

L’antenne ne doit pas simuler un avis OCO. L’avis doit provenir du rôle et du workflow prévu.

---

# 17. MOBILITÉ

Route :

```text
/antenne/mobilite
```

Afficher les dossiers dont le parcours comporte une étape de mobilité.

Informations :

```text
ID-POMRA
Étudiant
Pays source
Pays destination
Formation
Statut mobilité
Dernière mise à jour
```

Le composant doit permettre de suivre l’état sans exposer de données auxquelles le rôle n’a pas accès.

---

# 18. SUIVI

Route :

```text
/antenne/suivi
```

Filtres :

```text
Pays
Programme
Formation
Statut
Période
```

Tableau :

```text
ID-POMRA
Étudiant
Programme
Formation
Statut
Dernière activité
Action
```

---

# 19. RAPPORTS TRIMESTRIELS

Route :

```text
/antenne/rapports
```

## Rapport

Sélecteurs :

```text
Année
Trimestre
```

Contenu possible :

```text
Nombre de dossiers reçus
Nombre de dossiers traités
Nombre de dossiers en attente
Répartition des statuts
Répartition des programmes
Répartition des formations
Activité de l’antenne
```

Actions :

```text
Consulter
Générer
Télécharger
```

La génération doit être réalisée côté serveur.

---

# 20. RAPPORTS BEC

Route :

```text
/bec/rapports
```

Le BEC peut consulter les rapports consolidés selon ses droits.

Filtres :

```text
Année
Trimestre
Pays
Programme
```

Le système doit distinguer :

```text
Rapport antenne
Rapport consolidé BEC
```

---

# 21. STATISTIQUES BEC

Route :

```text
/bec/statistiques
```

## Indicateurs

```text
Total dossiers
Dossiers par pays
Dossiers par statut
Dossiers par programme
Dossiers par formation
Évolution mensuelle/trimestrielle
Dossiers en attente
Dossiers validés
```

## Composants

```text
StatisticsKpiGrid
StatusDistribution
CountryOverviewGrid
ProgramDistribution
FormationDistribution
EvolutionChart
```

Les graphiques doivent avoir une alternative textuelle/tableau pour l’accessibilité.

---

# 22. STSS — INTÉGRATION AU BACK-OFFICE

Le plan EA-POMRA prévoit un module STSS séparé en Phase 5, potentiellement en parallèle avec la Phase 4.

Le Back-office Antenne peut donc prévoir l’emplacement/module sans dépendre de l’intégration Mobile Money finale.

Route :

```text
/antenne/stss
```

Informations prévues :

```text
Référence
ID-POMRA
Antenne source
Antenne destination
Statut
Preuve
Date
```

Ne pas implémenter de paiement réel dans le Back-office Phase 4 tant que l’intégration STSS n’est pas validée.

---

# 23. RBAC ET SÉCURITÉ

Le plan EA-POMRA impose JWT + RBAC et identifie plusieurs rôles, dont Antenne, BEC, Expert OCO et Responsable PAP.

Le contrôle doit porter sur :

```text
Utilisateur
Role
Pays
Antenne
Permission
Ressource
Action
```

## Exemple

```text
Agent Antenne Burkina
→ peut consulter les dossiers de son périmètre
→ peut réaliser les actions autorisées
→ ne peut pas accéder aux dossiers d’une autre antenne
→ ne peut pas modifier un historique
```

BEC :

```text
→ accès consolidé selon ses permissions
→ validation finale lorsque le rôle l’autorise
```

## Règle essentielle

Le frontend ne constitue **jamais** la sécurité.

Toutes les autorisations doivent être vérifiées côté serveur/API.

---

# 24. CONFIDENTIALITÉ PAP

Les fiches PAP sont confidentielles et leur accès est restreint au rôle PAP selon le plan d’implémentation.

Le Back-office Antenne/BEC ne doit donc pas afficher automatiquement le contenu confidentiel de la fiche PAP.

Si une référence PAP doit apparaître :

```text
Demande PAP : Oui
Statut : En cours
```

mais pas le contenu confidentiel sans permission explicite.

---

# 25. IDENTIFIANT ID-POMRA

Les canaux partagés doivent privilégier le code **ID-POMRA** conformément à l’objectif de confidentialité du projet.

L’interface peut afficher le nom lorsque le rôle et le contexte l’autorisent, mais les exports/notifications destinés à des canaux partagés doivent éviter d’exposer inutilement les informations personnelles.

---

# 26. COMPOSANTS SHADCN/UI

Utiliser les composants existants du projet lorsqu’ils existent.

Composants recommandés :

```text
Button
Card
Badge
Avatar
Select
Command
Popover
DropdownMenu
Sheet
Dialog
AlertDialog
Tabs
Table
Pagination
Input
Textarea
Checkbox
Calendar
Tooltip
Separator
Skeleton
Alert
ScrollArea
Breadcrumb
```

Ne pas recréer une version parallèle d’un composant déjà présent dans le repository.

---

# 27. COMPOSANTS MÉTIER

Créer ou réutiliser notamment :

```text
AntenneDashboard
BECDashboard
AntenneSidebar
AntenneHeader
BECSidebar
BECHeader
DashboardKpiGrid
CountryOverviewGrid
OperationalQueue
OperationalAlerts
DossierTable
DossierCard
DossierFilters
DossierSearch
DossierHeader
DossierSummary
DossierStatus
DossierDocuments
DocumentVerificationDialog
OrientationQueue
MobilitePanel
SuiviPanel
StssPanel
QuarterlyReportPanel
StatisticsPanel
ActivityLog
```

Chaque composant métier doit rester composable et éviter la logique métier critique uniquement côté client.

---

# 28. RESPONSIVE DESIGN

Breakpoints :

```text
sm   640px
md   768px
lg   1024px
xl   1280px
2xl  1536px
```

## Desktop ≥ 1024px

```text
Sidebar fixe 248px
Header 76px
Main padding 32px
KPI : 4 colonnes
```

## Tablet 768–1023px

```text
Sidebar → Sheet
Header 68–72px
Main padding 24px
KPI : 2 colonnes
Filtres : wrapping / Sheet
```

## Mobile < 768px

```text
Sidebar → Sheet
Header 64px
Main padding 16px
KPI : 1 colonne
Table → Cards
Filtres → Sheet
```

---

# 29. Z-INDEX

Utiliser une échelle contrôlée :

```text
Content          0
Decorations     10
Header          20
Sidebar         30
Bottom nav      30
Popover         40
Dropdown        40
Dialog          50
Toast           60
```

Éviter les `z-index: 9999` sans raison.

---

# 30. ANIMATIONS

Utiliser Framer Motion uniquement lorsque déjà présent dans le projet.

Entrée :

```text
opacity 0 → 1
y 8px → 0
300–400ms
```

Stagger des cartes :

```text
40–50ms
```

Hover :

```text
translateY(-1px)
```

Bouton actif :

```text
scale 0.98
```

Respecter `prefers-reduced-motion`.

Aucune animation ne doit ralentir le traitement d’un dossier.

---

# 31. LOADING / EMPTY / ERROR

## Loading

Utiliser des `Skeleton` correspondant à la structure finale.

Exemple :

```text
DashboardSkeleton
DossierTableSkeleton
DossierDetailSkeleton
StatisticsSkeleton
```

## Empty state

Exemple :

```text
Aucun dossier ne correspond aux filtres.
```

Actions :

```text
Réinitialiser les filtres
```

## Error state

Afficher :

```text
Une erreur est survenue.
Veuillez réessayer.
```

Bouton :

```text
Réessayer
```

Ne jamais afficher les détails techniques sensibles au simple utilisateur.

---

# 32. PERFORMANCE

Le contexte EA-POMRA doit prendre en compte les connexions faibles.

## Obligatoire

- Server Components lorsque pertinent ;
- SSR lorsque pertinent ;
- pagination serveur ;
- filtrage serveur ;
- tri serveur ;
- recherche serveur ;
- agrégations statistiques côté serveur ;
- chargement différé des modules lourds ;
- `next/image` lorsque pertinent ;
- SVG plutôt que grosses images raster pour les icônes ;
- ne jamais charger tous les dossiers dans le navigateur.

---

# 33. ACCESSIBILITÉ

Prévoir :

- labels explicites ;
- navigation clavier ;
- focus visible ;
- contraste suffisant ;
- `aria-label` pour les boutons icon-only ;
- confirmation pour les actions sensibles ;
- texte alternatif pour les graphiques ;
- ne pas utiliser la couleur seule pour représenter un statut.

---

# 34. ARCHITECTURE DES ROUTES

Structure recommandée :

```text
app/
  antenne/
    page.tsx
    dossiers/
      page.tsx
      [id]/
        page.tsx
    orientation/
      page.tsx
    mobilite/
      page.tsx
    suivi/
      page.tsx
    documents/
      page.tsx
    stss/
      page.tsx
    rapports/
      page.tsx
    notifications/
      page.tsx
    historique/
      page.tsx

  bec/
    page.tsx
    dossiers/
      page.tsx
      [id]/
        page.tsx
    validation/
      page.tsx
    statistiques/
      page.tsx
    rapports/
      page.tsx
    activite/
      page.tsx
    notifications/
      page.tsx
    historique/
      page.tsx
```

Adapter cette structure à l’architecture déjà présente dans le repository. Ne pas supprimer ou recréer des routes existantes sans audit préalable.

---

# 35. MODÈLE DE DONNÉES — PRINCIPES

Les entités centrales définies dans le plan sont notamment :

```text
Utilisateur
Étudiant
Parent
Antenne
Dossier
Avis OCO
Fiche PAP
Transaction STSS
Rapport trimestriel
```

Le dossier doit notamment pouvoir être relié à :

```text
ID-POMRA
statut
pièces jointes
programme
formation
antenne
historique
orientation
mobilité
suivi
```

Les contraintes relationnelles et migrations définitives doivent respecter le schéma de données validé du projet.

---

# 36. WORKFLOW DU DOSSIER

Le parcours global identifié dans le plan est :

```text
CANDIDATURE
      ↓
ORIENTATION
      ↓
MOBILITÉ
      ↓
SUIVI
      ↓
DIPLÔME
```

Le Back-office Antenne/BEC doit donc éviter de créer des statuts incompatibles avec ce parcours.

Le statut affiché dans l’interface doit toujours provenir du workflow métier enregistré côté serveur.

---

# 37. JOURNALISATION

Les actions sensibles doivent être enregistrées :

```text
Création
Modification
Transmission
Validation
Refus
Demande de document
Assignation
Changement de statut
Consultation sensible lorsque requise
```

Chaque événement peut contenir :

```text
id
user_id
role
resource_type
resource_id
action
created_at
metadata
```

Le journal ne doit pas être éditable par un utilisateur métier standard.

---

# 38. NOTIFICATIONS

Prévoir un centre de notifications :

```text
/antenne/notifications
/bec/notifications
```

Types :

```text
Nouveau dossier
Dossier à traiter
Document à vérifier
Avis reçu
Validation demandée
Dossier en attente
Rapport disponible
Erreur système non sensible
```

Le canal WhatsApp/email appartient au système de notifications global et doit respecter les règles de confidentialité.

---

# 39. EXPORTS

Les exports doivent être contrôlés par permissions.

Formats possibles :

```text
CSV
XLSX
PDF
```

Un export doit respecter exactement le périmètre de l’utilisateur :

```text
Antenne → données de son périmètre
BEC → données consolidées autorisées
```

Ne jamais permettre à un simple paramètre URL de contourner le RBAC.

---

# 40. RÈGLES DE SÉCURITÉ API

Toutes les routes doivent vérifier :

```text
Authentification
Rôle
Périmètre pays/antenne
Permission
ID du dossier
Action demandée
```

Exemple :

```text
GET /api/dossiers/:id
```

ne doit jamais retourner un dossier simplement parce que l’ID est connu.

Le backend doit vérifier que l’utilisateur possède le droit d’accéder à cette ressource.

---

# 41. OPEN CODE — PROMPT D’IMPLÉMENTATION

Copier le prompt suivant dans OpenCode/Codex après avoir placé cette spécification dans le repository.

```text
Tu travailles sur la plateforme EA-POMRA.

OBJECTIF
Implémenter les Back-offices Antenne et BEC conformément à SPEC_BACKOFFICE_ANTENNE_BEC.md.

IMPORTANT
Avant toute modification, audite le repository existant.

Identifie :
- framework Next.js/React
- TypeScript
- Tailwind
- shadcn/ui
- Framer Motion
- architecture app/
- layouts existants
- design tokens
- composants existants
- système auth
- JWT
- RBAC
- API
- PostgreSQL
- modèles/migrations
- routes existantes
- middleware
- gestion des fichiers

NE RECRÉE PAS ce qui existe déjà.
Réutilise les composants et tokens existants lorsqu’ils sont compatibles.

PHASE 1 — AUDIT
1. Inspecter le repository.
2. Identifier les routes et composants existants.
3. Identifier le système d’authentification.
4. Identifier le système RBAC.
5. Identifier les modèles Dossier, Utilisateur, Antenne, Document, etc.
6. Identifier les API existantes.
7. Identifier les éventuels dashboards déjà développés.
8. Vérifier le design system EA-POMRA existant.

PHASE 2 — ANTENNE
Implémenter :
- /antenne
- /antenne/dossiers
- /antenne/dossiers/[id]
- /antenne/orientation
- /antenne/mobilite
- /antenne/suivi
- /antenne/documents
- /antenne/stss
- /antenne/rapports
- /antenne/notifications
- /antenne/historique

Dashboard Antenne :
- KPI dossiers reçus
- à traiter
- en attente
- traités
- file opérationnelle
- alertes
- activité récente
- rapport trimestriel

PHASE 3 — BEC
Implémenter :
- /bec
- /bec/dossiers
- /bec/dossiers/[id]
- /bec/validation
- /bec/statistiques
- /bec/rapports
- /bec/activite
- /bec/notifications
- /bec/historique

Dashboard BEC :
- filtres période/pays/programme/formation
- KPI globaux
- vue des 8 pays
- file de validation
- statistiques globales
- activité récente

PHASE 4 — DOSSIERS
Créer/réutiliser :
- DossierTable
- DossierCard
- DossierFilters
- DossierSearch
- DossierHeader
- DossierSummary
- DossierStatus
- DossierDocuments
- ActivityLog

Recherche et filtres côté serveur.
Pagination côté serveur.

PHASE 5 — DOCUMENTS
Créer/réutiliser :
- DocumentVerificationDialog

Statuts :
- Manquant
- À vérifier
- Validé
- Refusé

Toutes les actions doivent être journalisées.

PHASE 6 — RBAC
Ne jamais faire confiance au frontend.

Vérifier côté serveur :
- utilisateur
- rôle
- pays
- antenne
- permission
- ressource
- action

Un utilisateur Antenne ne doit pas pouvoir consulter arbitrairement une autre antenne.

BEC doit accéder uniquement aux données autorisées.

Les données PAP confidentielles ne doivent pas être exposées aux rôles standards Antenne/BEC.

PHASE 7 — RESPONSIVE
Desktop :
- sidebar 248px
- header 76px
- main padding 32px

Tablet :
- sidebar en Sheet
- KPI 2 colonnes

Mobile :
- sidebar en Sheet
- header 64px
- padding 16px
- KPI 1 colonne
- tableaux transformés en cards

PHASE 8 — PERFORMANCE
- Server Components quand pertinent
- SSR quand pertinent
- pagination serveur
- recherche serveur
- filtres serveur
- agrégations statistiques serveur
- lazy loading
- éviter les gros payloads
- ne jamais charger tous les dossiers côté client

PHASE 9 — UX
Implémenter :
- loading skeletons
- empty states
- error states
- confirmations d’actions sensibles
- accessibilité clavier
- focus visible
- reduced motion

PHASE 10 — DESIGN
Respecter les tokens EA-POMRA :
Navy #0D2B4D
Blue #174A7C
Green #1EA362
Gold #C89C2E
Background #F7F9FB
White #FFFFFF
Text #1F2937
Muted #667085
Border #E6E9EF
Success #22C55E
Info #3B82F6
Warning #F59E0B
Error #EF4444

Police : Plus Jakarta Sans.

PHASE 11 — STSS
Préparer l’emplacement /antenne/stss mais ne pas inventer une intégration Mobile Money si elle n’existe pas encore.
La vraie intégration STSS appartient à la phase suivante.

PHASE 12 — TESTS
Après implémentation :
- lint
- typecheck
- tests disponibles
- build production

Corriger toutes les erreurs introduites.

DEFINITION OF DONE
- Dashboard Antenne fonctionnel
- Dashboard BEC fonctionnel
- Recherche fonctionnelle
- Filtres fonctionnels
- Pagination serveur
- Détail dossier fonctionnel
- Documents fonctionnels
- Historique fonctionnel
- Orientation connectée au workflow existant
- Mobilité connectée au workflow existant
- Suivi fonctionnel
- Rapports fonctionnels selon droits
- Statistiques BEC fonctionnelles
- RBAC serveur appliqué
- Confidentialité PAP respectée
- Responsive desktop/tablet/mobile
- Loading/empty/error states
- lint OK
- typecheck OK
- build OK

Ne modifie pas les fonctionnalités existantes sans justification.
Si une donnée ou API nécessaire n’existe pas, indique précisément ce qui manque au lieu d’inventer une API ou un modèle incompatible.
```

---

# 42. CHECKLIST D’ACCEPTATION

## Antenne

- [ ] Dashboard accessible
- [ ] KPI affichés avec données réelles
- [ ] Dossiers accessibles selon périmètre
- [ ] Recherche fonctionnelle
- [ ] Filtres fonctionnels
- [ ] Pagination fonctionnelle
- [ ] Détail dossier fonctionnel
- [ ] Documents consultables
- [ ] Documents vérifiables selon permission
- [ ] Historique consultable
- [ ] Orientation accessible
- [ ] Mobilité accessible
- [ ] Suivi accessible
- [ ] Rapport trimestriel accessible
- [ ] Notifications accessibles
- [ ] RBAC testé

## BEC

- [ ] Dashboard accessible
- [ ] Vue consolidée disponible
- [ ] Filtres pays/période/programme/formation
- [ ] Dossiers accessibles
- [ ] Validation finale selon permission
- [ ] Statistiques globales
- [ ] Rapports
- [ ] Activité
- [ ] Historique
- [ ] RBAC testé

## Sécurité

- [ ] API protégées
- [ ] Contrôle du périmètre serveur
- [ ] Pas de contournement via URL
- [ ] Actions sensibles journalisées
- [ ] Fiches PAP protégées
- [ ] Exports protégés

## Responsive

- [ ] Desktop 1440×900
- [ ] Laptop 1366×768
- [ ] Tablet 768–1023
- [ ] Mobile 390px
- [ ] Mobile 375px

## Qualité

- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Accessibilité
- [ ] Reduced motion
- [ ] Performance faible connexion
- [ ] Lint OK
- [ ] Typecheck OK
- [ ] Build OK

---

# 43. DEFINITION OF DONE — PHASE 4

La Phase 4 est considérée comme implémentée lorsque les Back-offices Antenne et BEC permettent de traiter et superviser les dossiers de manière opérationnelle, avec :

```text
Étudiant
   ↓
Dossier
   ↓
Antenne
   ↓
Orientation / OCO
   ↓
Validation BEC
   ↓
Mobilité
   ↓
Suivi
   ↓
Rapport / Historique
```

Le système doit conserver une trace des opérations et appliquer les permissions côté serveur.

Le livrable de Phase 4 doit contribuer à la chaîne complète de traitement d’un dossier de bout en bout, conformément au plan d’implémentation EA-POMRA.

---

# 44. DOCUMENTS ASSOCIÉS

Documents à maintenir séparément :

```text
SPEC_BACKOFFICE_OCO_PAP.md
SPEC_WORKFLOW_DOSSIER_EA-POMRA.md
SPEC_STSS.md
SPEC_RBAC_EA-POMRA.md
SPEC_NOTIFICATIONS_EA-POMRA.md
```

Le prochain document structurant recommandé après cette spécification est :

**SPEC_WORKFLOW_DOSSIER_EA-POMRA.md**

Il devra relier les différents acteurs et statuts afin d’assurer la cohérence de bout en bout du dossier.
