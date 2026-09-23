# EA-POMRA — SPEC_BACKOFFICE_OCO_PAP.md

## 1. Objet

Cette spécification définit les interfaces et règles fonctionnelles du **File de traitement Expert OCO** et de l'**Espace Responsable PAP**.

Elle s'inscrit dans la Phase 4 du plan d'implémentation EA-POMRA. Le plan prévoit :
- une file Expert OCO pour les **avis techniques et l'orientation** ;
- un espace Responsable PAP pour les **alertes, le mentorat et l'historique** ;
- une chaîne complète de traitement d'un dossier de bout en bout.

Source : Plan d'implémentation EA-POMRA. fileciteturn8file0L1-L7

---

# 2. Rôles concernés

## 2.1 Expert OCO

L'Expert OCO traite les dossiers qui nécessitent un avis technique.

Ses fonctions principales :

- consulter les dossiers qui lui sont affectés ;
- examiner les informations et pièces disponibles ;
- produire un avis OCO ;
- proposer une orientation ;
- ajouter des observations ;
- consulter l'historique du dossier ;
- transmettre le dossier à l'étape suivante selon les droits définis.

Le modèle de données prévu comprend une entité **Avis OCO** avec :
- avis favorable ;
- avis sous réserve ;
- avis défavorable ;
- orientation suggérée.

Source : modèle de données du plan EA-POMRA. fileciteturn8file1L9-L18

## 2.2 Responsable PAP

Le Responsable PAP dispose d'un espace dédié aux informations PAP.

Fonctions prévues :

- consulter les alertes ;
- assurer le suivi/mentorat ;
- consulter l'historique des interventions autorisées ;
- suivre les dossiers PAP qui lui sont accessibles.

La **Fiche PAP est confidentielle** et son accès est restreint au rôle PAP. fileciteturn8file1L9-L18

---

# 3. Principes UX communs

L'interface doit rester cohérente avec le design system EA-POMRA :

- professionnel ;
- institutionnel ;
- moderne ;
- simple ;
- lisible ;
- responsive ;
- adapté aux connexions faibles.

Le plan EA-POMRA recommande notamment le SSR Next.js, des formulaires courts et un mode dégradé WhatsApp pour les environnements à connectivité limitée. fileciteturn8file12L1-L8

---

# 4. Design tokens

## Couleurs

| Token | Valeur |
|---|---|
| Navy | `#0D2B4D` |
| Blue | `#174A7C` |
| Green | `#1EA362` |
| Gold | `#C89C2E` |
| Background | `#F7F9FB` |
| White | `#FFFFFF` |
| Text | `#1F2937` |
| Muted | `#667085` |
| Border | `#E6E9EF` |
| Success | `#22C55E` |
| Info | `#3B82F6` |
| Warning | `#F59E0B` |
| Error | `#EF4444` |

### Typographie

Police principale :

`Plus Jakarta Sans`

---

# 5. Layout Desktop

Référence : **1440 × 900 px**

```text
┌──────────────────────────────────────────────────────────────┐
│                         HEADER 76px                          │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│   SIDEBAR     │                 MAIN CONTENT                 │
│    248px      │                                              │
│               │             max-width: 1184px               │
│               │             padding: 32px                    │
│               │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

### Sidebar

- largeur : 248 px ;
- position : fixed ;
- `z-index: 30` ;
- fond blanc ;
- bordure droite `#E6E9EF` ;
- padding horizontal : 16 px ;
- padding vertical : 20 px.

### Header

- hauteur : 76 px ;
- sticky ;
- `z-index: 20` ;
- fond blanc ;
- bordure basse.

### Main

- padding desktop : 32 px ;
- largeur maximale : 1184 px ;
- gap entre sections : 24 px.

---

# 6. BACK-OFFICE EXPERT OCO

## Route principale

```text
/oco
```

## Routes

```text
/oco
/oco/dossiers
/oco/dossiers/[id]
/oco/avis
/oco/historique
```

---

# 7. Dashboard OCO

## 7.1 Objectif

Donner à l'Expert OCO une vue immédiate de son travail :

- dossiers à examiner ;
- dossiers urgents ;
- avis en attente ;
- dossiers récemment traités.

## 7.2 KPI

Afficher quatre cartes :

### Dossiers à examiner

Nombre de dossiers actuellement dans la file OCO.

### Avis en brouillon

Avis commencés mais non transmis.

### Avis à finaliser

Dossiers dont l'analyse est disponible mais dont l'avis doit encore être finalisé.

### Dossiers traités

Nombre de dossiers traités sur la période sélectionnée.

---

# 8. File de traitement OCO

## Route

```text
/oco/dossiers
```

## Recherche

Recherche par :

- ID-POMRA ;
- numéro de dossier ;
- nom de l'étudiant ;
- formation ;
- pays ;
- antenne.

## Filtres

- statut OCO ;
- pays ;
- programme ;
- formation ;
- date de réception ;
- priorité ;
- complétude.

## Table Desktop

Colonnes :

| Colonne | Description |
|---|---|
| ID-POMRA | Identifiant du dossier |
| Étudiant | Nom affiché selon les droits |
| Pays | Pays/antenne |
| Programme | Programme concerné |
| Formation | Formation demandée |
| Statut OCO | État de traitement |
| Reçu le | Date d'affectation |
| Priorité | Priorité opérationnelle |
| Action | Ouvrir |

Hauteur minimale d'une ligne : **64 px**.

---

# 9. Statuts OCO

Utiliser des statuts explicites :

```text
EN_ATTENTE
EN_ANALYSE
BROUILLON
AVIS_A_FINALISER
AVIS_TRANSMIS
ORIENTATION_PROPOSEE
TRAITE
```

Les valeurs finales doivent être alignées avec les règles métier validées par EA-POMRA.

---

# 10. Détail d'un dossier OCO

## Route

```text
/oco/dossiers/[id]
```

Structure :

```text
┌────────────────────────────────────────────────────┐
│ Breadcrumb                                         │
│ ID-POMRA + statut                                  │
├────────────────────────────────────────────────────┤
│ Résumé du dossier                                  │
├────────────────────────────────────────────────────┤
│ Informations étudiant                              │
├────────────────────────────────────────────────────┤
│ Formation / programme                              │
├────────────────────────────────────────────────────┤
│ Documents                                          │
├────────────────────────────────────────────────────┤
│ Historique du dossier                              │
├────────────────────────────────────────────────────┤
│ Analyse OCO                                        │
├────────────────────────────────────────────────────┤
│ Avis technique                                     │
├────────────────────────────────────────────────────┤
│ Orientation suggérée                               │
├────────────────────────────────────────────────────┤
│ Actions                                            │
└────────────────────────────────────────────────────┘
```

---

# 11. Documents OCO

L'Expert doit pouvoir consulter les documents nécessaires à son analyse.

Chaque document affiche :

- type ;
- nom ;
- date ;
- statut ;
- aperçu si disponible ;
- action de consultation.

Statuts possibles :

```text
MANQUANT
A_VERIFIER
VALIDE
REFUSE
```

L'Expert OCO ne doit pas pouvoir contourner les règles de sécurité du stockage documentaire.

---

# 12. Analyse OCO

Créer une section dédiée :

```text
Analyse technique
```

Elle peut contenir :

- observations ;
- éléments examinés ;
- réserves éventuelles ;
- recommandations ;
- orientation suggérée.

### Éditeur

Utiliser :

- `Textarea`
- éventuellement plusieurs champs structurés ;
- compteur de caractères si nécessaire ;
- sauvegarde en brouillon.

---

# 13. Avis OCO

## Valeurs prévues par le modèle métier

```text
FAVORABLE
SOUS_RESERVE
DEFAVORABLE
```

Ces valeurs proviennent du modèle de données prévu dans le plan EA-POMRA. fileciteturn8file1L9-L18

## Formulaire

```text
Avis
[ Favorable ]
[ Sous réserve ]
[ Défavorable ]

Orientation suggérée
[ Select ]

Observations
[ Textarea ]

Réserves
[ Textarea ]

[ Enregistrer brouillon ]
[ Finaliser l'avis ]
```

---

# 14. Finalisation d'un avis

Avant la finalisation :

1. vérifier que les champs obligatoires sont remplis ;
2. afficher un résumé ;
3. demander confirmation ;
4. enregistrer la date ;
5. enregistrer l'utilisateur ;
6. enregistrer l'action dans l'historique ;
7. empêcher une modification silencieuse après transmission.

Exemple de confirmation :

```text
Finaliser l'avis OCO ?

Cette action enregistrera définitivement votre avis
et le transmettra à l'étape suivante du workflow.

[Annuler] [Finaliser]
```

---

# 15. Historique OCO

## Route

```text
/oco/historique
```

Afficher :

| Date | Dossier | Action | Avis | Utilisateur |
|---|---|---|---|---|

Chaque événement doit être traçable.

Exemples :

```text
Dossier reçu
Dossier ouvert
Analyse commencée
Avis enregistré
Avis modifié
Avis finalisé
Orientation proposée
Dossier transmis
```

---

# 16. ESPACE RESPONSABLE PAP

## Route principale

```text
/pap
```

## Routes

```text
/pap
/pap/alertes
/pap/mentorat
/pap/historique
```

---

# 17. Dashboard PAP

Le dashboard doit rester centré sur les informations nécessaires au suivi PAP.

## KPI

```text
Alertes actives
Suivis en cours
Mentorats actifs
Interventions récentes
```

---

# 18. Alertes PAP

## Route

```text
/pap/alertes
```

Afficher les alertes avec :

- date ;
- ID-POMRA ou identifiant autorisé ;
- niveau ;
- sujet ;
- statut ;
- dernière mise à jour ;
- action.

## Niveaux

```text
INFO
ATTENTION
URGENT
```

Les règles métier permettant de générer automatiquement les alertes devront être définies avec EA-POMRA.

---

# 19. Fiche de suivi PAP

## Route

```text
/pap/mentorat/[id]
```

Sections :

### Identification

Afficher uniquement les informations autorisées au rôle PAP.

### Situation de suivi

Résumé opérationnel.

### Mentorat

- date de début ;
- responsable ;
- objectifs ;
- observations ;
- prochaines actions.

### Historique

Chronologie des interventions autorisées.

---

# 20. Mentorat

Le module doit permettre de créer et suivre une action de mentorat.

```text
Nouveau suivi

Date
[ calendrier ]

Type
[ Select ]

Objectif
[ Textarea ]

Observation
[ Textarea ]

Prochaine action
[ Textarea ]

[ Enregistrer ]
```

---

# 21. Historique PAP

## Route

```text
/pap/historique
```

Afficher une timeline :

```text
19/09/2026
Suivi réalisé
        │
        ▼
12/09/2026
Entretien de mentorat
        │
        ▼
05/09/2026
Alerte créée
```

Chaque événement doit contenir :

- date ;
- utilisateur ;
- type d'action ;
- commentaire ;
- référence du dossier.

---

# 22. Confidentialité PAP

La confidentialité est une exigence centrale.

Le plan précise que :

> la Fiche PAP est confidentielle et son accès est restreint au rôle PAP.

fileciteturn8file1L9-L18

Donc :

- aucun accès PAP depuis une interface standard sans permission ;
- aucun affichage dans les listes publiques ;
- aucune donnée PAP dans les exports non autorisés ;
- aucun accès uniquement protégé par le frontend ;
- vérification RBAC côté serveur ;
- journalisation des accès sensibles.

Le plan recommande un **RBAC strict dès la Phase 1** et indique que les noms ne doivent jamais être affichés hors du rôle autorisé. fileciteturn8file12L5-L8

---

# 23. RBAC

Architecture minimale :

```text
User
 ├── role
 ├── country
 ├── antenna
 └── permissions
```

Rôles concernés :

```text
EXPERT_OCO
RESPONSABLE_PAP
COORDONNATEUR_NATIONAL
TRESORIER_NATIONAL
BEC
ADMIN
```

Le plan identifie ces rôles dans l'architecture d'authentification JWT + RBAC. fileciteturn8file2L15-L20

## Règle importante

Le frontend ne constitue jamais la sécurité.

Les API doivent vérifier :

```text
authenticated user
        ↓
role
        ↓
country / antenna scope
        ↓
permission
        ↓
resource access
```

---

# 24. Workflow global

Le traitement doit pouvoir s'inscrire dans le parcours :

```text
CANDIDATURE
     ↓
ORIENTATION
     ↓
AVIS OCO
     ↓
MOBILITÉ
     ↓
SUIVI
     ↓
DIPLÔME
```

Le plan EA-POMRA fixe explicitement cet objectif de digitalisation du parcours candidat → orientation → mobilité → suivi → diplôme. fileciteturn8file2L7-L13

Le livrable de la Phase 4 est une **chaîne complète de traitement d'un dossier de bout en bout**. fileciteturn8file0L1-L7

---

# 25. Composants Shadcn/ui

Réutiliser les composants existants du projet.

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

Ne pas recréer un composant déjà présent dans le repository.

---

# 26. Composants métier

```text
OcoDashboard
OcoSidebar
OcoHeader
OcoKpiGrid
OcoQueue
OcoFilters
OcoSearch
OcoDossierTable
OcoDossierCard
OcoDossierHeader
OcoDossierSummary
OcoDocumentList
OcoAnalysisPanel
OcoAvisForm
OcoOrientationPanel
OcoHistoryTimeline

PapDashboard
PapSidebar
PapHeader
PapKpiGrid
PapAlertList
PapAlertCard
PapMentoratPanel
PapFollowUpForm
PapHistoryTimeline
PapConfidentialSection
```

---

# 27. Responsive Design

Breakpoints :

```text
sm  = 640px
md  = 768px
lg  = 1024px
xl  = 1280px
2xl = 1536px
```

## Desktop

- sidebar 248 px ;
- header 76 px ;
- contenu 32 px ;
- tables complètes.

## Tablet

- sidebar transformée en `Sheet` ;
- contenu 24 px ;
- KPI en 2 colonnes ;
- filtres adaptatifs.

## Mobile

- header 64 px ;
- contenu 16 px ;
- KPI 1 colonne ;
- tables transformées en cartes ;
- formulaire OCO en une colonne ;
- actions principales accessibles en bas de l'écran.

---

# 28. Z-index

```text
content       0
decorations  10
header       20
sidebar      30
bottom nav   30
popover      40
dialog       50
toast        60
```

Éviter les valeurs arbitraires comme `9999`.

---

# 29. Animations

Utiliser Framer Motion uniquement lorsqu'il apporte de la clarté.

Entrée :

```text
opacity: 0 → 1
y: 8 → 0
duration: 300–400ms
```

Cartes :

```text
stagger: 40–50ms
```

Hover :

```text
translateY(-1px)
```

Bouton :

```text
scale: .98
```

Respecter `prefers-reduced-motion`.

---

# 30. États d'interface

Chaque écran doit prévoir :

### Loading

Skeletons.

### Empty

Exemple :

```text
Aucun dossier à traiter

La file OCO ne contient actuellement
aucun dossier correspondant à vos filtres.
```

### Error

```text
Impossible de charger les dossiers.

[ Réessayer ]
```

### Success

Confirmation non bloquante après :

- sauvegarde ;
- transmission ;
- création d'un suivi ;
- ajout d'une observation.

---

# 31. Performance

Respecter les principes du projet :

- Server Components lorsque pertinent ;
- SSR lorsque pertinent ;
- pagination côté serveur ;
- filtrage côté serveur ;
- tri côté serveur ;
- chargement progressif ;
- ne jamais charger tous les dossiers côté client ;
- `next/image` pour les images ;
- lazy loading lorsque pertinent.

---

# 32. Architecture proposée

```text
app/
  oco/
    page.tsx
    dossiers/
      page.tsx
      [id]/
        page.tsx
    avis/
      page.tsx
    historique/
      page.tsx

  pap/
    page.tsx
    alertes/
      page.tsx
    mentorat/
      page.tsx
      [id]/
        page.tsx
    historique/
      page.tsx
```

Composants :

```text
components/
  oco/
  pap/
```

Services :

```text
lib/
  oco/
  pap/
```

---

# 33. Données principales

Le modèle central EA-POMRA doit notamment prendre en compte :

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

Ces entités sont explicitement identifiées dans le plan d'implémentation. fileciteturn8file1L9-L18

---

# 34. Audit

Les actions sensibles doivent être enregistrées.

Structure indicative :

```text
AuditLog
 ├── id
 ├── user_id
 ├── role
 ├── action
 ├── resource_type
 ├── resource_id
 ├── timestamp
 ├── metadata
 └── ip / session reference
```

Actions notamment :

```text
VIEW_DOSSIER
VIEW_PAP
CREATE_AVIS
UPDATE_AVIS
FINALIZE_AVIS
CREATE_MENTORAT
UPDATE_MENTORAT
VIEW_HISTORY
TRANSMIT_DOSSIER
```

---

# 35. Notifications

Les notifications WhatsApp et email sont prévues dans l'architecture EA-POMRA et doivent être déclenchées aux étapes clés du parcours. fileciteturn8file3L13-L18

Pour OCO :

```text
Nouveau dossier assigné
Avis demandé
Avis à finaliser
Dossier transmis
```

Pour PAP :

```text
Nouvelle alerte
Nouveau suivi
Rappel de mentorat
Mise à jour d'un dossier suivi
```

---

# 36. Ce qui ne doit PAS être développé dans ce module

Ne pas intégrer ici :

- Mobile Money ;
- commissions ;
- transferts STSS ;
- KYC/AML ;
- IA ;
- OCR automatique.

Le **STSS constitue la Phase 5** du plan, avec intégration Mobile Money, dépôt, transfert inter-antennes, preuve de paiement, audit immuable, commission et KYC/AML. fileciteturn8file0L8-L13

La couche IA est prévue ultérieurement en Phase 7 et ne doit pas bloquer le lancement du cœur métier. fileciteturn8file5L8-L12

---

# 37. PROMPT OPENCODE

```text
Tu travailles sur la plateforme EA-POMRA.

OBJECTIF
Implémenter le File de traitement Expert OCO et l'Espace Responsable PAP
sans casser les fonctionnalités existantes.

AVANT DE CODER

1. Audite le repository.
2. Identifie :
   - Next.js / React
   - Tailwind CSS
   - composants Shadcn/ui
   - Framer Motion
   - authentification
   - JWT
   - RBAC
   - API
   - PostgreSQL
   - routes existantes
   - layout existant
   - design tokens existants.
3. Cherche les composants déjà existants avant d'en créer.
4. Respecte strictement le design system EA-POMRA.
5. Ne recrée pas le système d'authentification si celui-ci existe déjà.

MODULE OCO

Créer :

/oco
/oco/dossiers
/oco/dossiers/[id]
/oco/avis
/oco/historique

Implémenter :

- dashboard ;
- KPI ;
- file de traitement ;
- recherche ;
- filtres ;
- détail dossier ;
- consultation documents ;
- analyse technique ;
- avis favorable ;
- avis sous réserve ;
- avis défavorable ;
- orientation suggérée ;
- brouillon ;
- finalisation ;
- historique ;
- audit.

MODULE PAP

Créer :

/pap
/pap/alertes
/pap/mentorat
/pap/mentorat/[id]
/pap/historique

Implémenter :

- dashboard ;
- alertes ;
- suivi ;
- mentorat ;
- historique ;
- timeline ;
- actions autorisées.

SÉCURITÉ

Le module PAP contient des données confidentielles.

Ne jamais se limiter à une protection frontend.

Toutes les API doivent vérifier :

authenticated user
→ role
→ country/antenna scope
→ permission
→ resource access.

L'Expert OCO ne doit pas avoir automatiquement accès aux informations PAP.

Le Responsable PAP ne doit pas accéder aux données non autorisées.

AUDIT

Journaliser les actions sensibles.

RESPONSIVE

Desktop :
sidebar 248px
header 76px
main padding 32px

Tablet :
sidebar Sheet
main padding 24px

Mobile :
header 64px
main padding 16px
tables → cards
KPI → 1 colonne

PERFORMANCE

Utiliser Server Components lorsque pertinent.
Utiliser SSR lorsque pertinent.
Pagination serveur.
Filtres serveur.
Tri serveur.
Ne jamais charger tous les dossiers côté client.

UX

Prévoir :
loading
empty state
error state
success state
skeletons

ANIMATION

Utiliser Framer Motion uniquement si déjà présent.
Respecter prefers-reduced-motion.

IMPORTANT

Ne pas développer STSS dans ce module.
Ne pas développer IA.
Ne pas modifier inutilement les modules Étudiant, Parent, Antenne ou BEC.

TESTS

À la fin :

npm run lint
npm run typecheck
npm run build

Corriger toutes les erreurs.

DEFINITION OF DONE

- OCO dashboard fonctionnel
- file OCO fonctionnelle
- détail dossier fonctionnel
- avis OCO fonctionnel
- orientation fonctionnelle
- historique OCO fonctionnel
- PAP dashboard fonctionnel
- alertes fonctionnelles
- mentorat fonctionnel
- historique PAP fonctionnel
- RBAC serveur fonctionnel
- audit fonctionnel
- responsive desktop/tablet/mobile
- loading/empty/error states
- aucune régression sur les modules existants
- lint OK
- typecheck OK
- build OK
```

---

# 38. Livrable attendu

À la fin de cette étape, EA-POMRA doit disposer de deux nouveaux espaces opérationnels :

```text
                    EA-POMRA
                       │
          ┌────────────┴────────────┐
          │                         │
       EXPERT OCO              RESPONSABLE PAP
          │                         │
    ┌─────┴─────┐             ┌─────┴─────┐
    │           │             │           │
 Avis        Orientation    Alertes    Mentorat
    │           │             │           │
    └─────┬─────┘             └─────┬─────┘
          │                         │
          └──────────┬──────────────┘
                     ↓
              HISTORIQUE / AUDIT
                     ↓
             CHAÎNE DU DOSSIER
```

Ce module complète la Phase 4 prévue dans le plan : **Back-office Antenne + BEC + OCO + PAP**, avec comme objectif une chaîne complète de traitement du dossier. fileciteturn8file0L1-L7
