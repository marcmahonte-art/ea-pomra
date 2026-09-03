# SPEC_ETUDIANTS_PAGE.md

# EA-POMRA — Spécification détaillée de la page « Espace Étudiant »

> Document de référence destiné à l'implémentation frontend de l'espace étudiant EA-POMRA.
>
> Cette spécification reprend le plan d'implémentation EA-POMRA et le Design System défini pour la plateforme. Le plan prévoit notamment un portail étudiant avec statut du dossier, code ID-POMRA et demande PAP, ainsi que les notifications WhatsApp/email aux étapes clés. fileciteturn2file0L35-L46

---

## 1. Objectif de la page

Créer un **dashboard étudiant moderne, professionnel, rassurant et très lisible**.

L'étudiant doit comprendre en moins de 5 secondes :

1. où il se trouve ;
2. l'état actuel de son dossier ;
3. son identifiant ID-POMRA ;
4. l'étape actuelle de son parcours ;
5. ce qu'il peut faire maintenant ;
6. les notifications importantes.

Le dashboard ne doit pas ressembler à un back-office administratif dense.

### Direction visuelle

Référence UX :

- simplicité de navigation inspirée des meilleures plateformes digitales ;
- cartes aérées ;
- hiérarchie visuelle forte ;
- actions principales immédiatement visibles ;
- feedback immédiat ;
- animations discrètes ;
- identité EA-POMRA conservée.

Ne pas copier visuellement Uber ou Airbnb. S'inspirer uniquement de leurs principes UX de simplicité, clarté et confiance.

---

# 2. Stack obligatoire

## Frontend

- Next.js / React
- TypeScript
- Tailwind CSS
- composants shadcn/ui
- Lucide React pour les icônes
- Framer Motion pour les animations
- Responsive mobile-first

## Architecture

La page doit être composée de composants réutilisables.

```text
app/
  (student)/
    dashboard/
      page.tsx

components/
  student/
    StudentSidebar.tsx
    StudentHeader.tsx
    StudentIdentityCard.tsx
    JourneyProgress.tsx
    OverviewStats.tsx
    ApplicationTimeline.tsx
    QuickActions.tsx
    NotificationsCard.tsx
    ResourcesCard.tsx
    HelpBanner.tsx
    StatusBadge.tsx
    MobileBottomNav.tsx
```

---

# 3. Dimensions globales

## Desktop

Référence principale :

```text
Viewport cible : 1440 × 900 px
```

### Sidebar

```text
width: 240px
min-width: 240px
height: 100vh
position: fixed
left: 0
top: 0
```

### Zone principale

```text
margin-left: 240px
width: calc(100vw - 240px)
min-height: 100vh
```

### Container

```text
max-width: 1280px
margin-inline: auto
padding-inline: 32px
```

### Padding vertical

```text
top: 28px
bottom: 40px
```

---

# 4. Z-index

Utiliser une hiérarchie stricte.

```text
z-0   : contenu normal
z-10  : cartes flottantes / éléments décoratifs
z-20  : header desktop
z-30  : dropdown / popover
z-40  : sidebar mobile / drawer
z-50  : modal / dialog
z-[60]: toast / notifications globales
z-[70]: overlays critiques
```

Ne pas utiliser de z-index arbitraires du type `z-[9999]`.

---

# 5. Design tokens Tailwind

## Couleurs

```ts
colors: {
  ea: {
    navy: "#0D2B4D",
    primary: "#174A7C",
    green: "#1EA362",
    gold: "#C89C2E",
  },

  background: "#F7F9FB",

  foreground: "#1F2937",

  muted: "#A2AAB3",

  border: "#E6E9EF",

  success: "#22C55E",
  info: "#3B82F6",
  warning: "#F59E0B",
  error: "#EF4444",
}
```

## Tailwind mapping recommandée

```text
bg-ea-navy
bg-ea-primary
bg-ea-green
bg-ea-gold

text-ea-navy
text-ea-primary
text-ea-green
text-ea-gold

bg-background
text-foreground
text-muted-foreground
border-border
```

---

# 6. Espacements

Échelle obligatoire :

```text
4px   → 1
8px   → 2
12px  → 3
16px  → 4
20px  → 5
24px  → 6
32px  → 8
40px  → 10
48px  → 12
64px  → 16
80px  → 20
```

### Règles

```text
Page padding desktop : 32px
Gap entre grandes sections : 24px
Gap entre cartes : 16px
Padding carte : 20–24px
Gap titre / contenu : 8–12px
```

---

# 7. Rayons

```text
rounded-md  : 8px
rounded-lg  : 12px
rounded-xl  : 16px
rounded-2xl : 24px
rounded-full: 9999px
```

Utilisation :

| Élément | Rayon |
|---|---:|
| Input | 8px |
| Button | 8–10px |
| Badge | 9999px |
| Card | 16px |
| Identity card | 16px |
| Hero banner | 20–24px |
| Avatar | 9999px |

---

# 8. Ombres

```text
shadow-sm :
0 1px 2px rgba(13,43,77,.06)

shadow-card :
0 4px 12px rgba(13,43,77,.06)

shadow-md :
0 8px 24px rgba(13,43,77,.08)

shadow-lg :
0 16px 40px rgba(13,43,77,.10)
```

Les cartes standards utilisent `shadow-card`.

Ne pas utiliser d'ombres fortes sur chaque élément.

---

# 9. Typographie

Police :

```text
Plus Jakarta Sans
```

## Desktop

```text
Page H1 : 32px / 40px / 700
H2      : 20px / 28px / 700
H3      : 16px / 24px / 600
Body    : 14px / 20px / 400
Small   : 12px / 16px / 400
```

## Mobile

```text
H1 : 24px / 32px / 700
H2 : 18px / 26px / 700
Body : 14px / 20px
```

---

# 10. Layout général

```text
┌─────────────────────────────────────────────────────────────┐
│ Sidebar │ Header                                            │
│         ├───────────────────────────────────────────────────┤
│         │ Identité / ID-POMRA       │ Progression           │
│         ├───────────────────────────┴───────────────────────┤
│         │ Vue d'ensemble             │ Actions rapides      │
│         │                             │                      │
│         │ Statut du dossier          │ Notifications        │
│         ├───────────────────────────┬───────────────────────┤
│         │ Ressources                 │ Aide / accompagnement│
└─────────┴───────────────────────────┴───────────────────────┘
```

---

# 11. Sidebar desktop

## Dimensions

```text
width: 240px
padding: 16px
```

Fond :

```text
#0D2B4D
```

## Logo

Zone :

```text
height: 132px
padding-top: 20px
```

Logo :

```text
width: 72px
height: 72px
object-fit: contain
```

Sous le logo :

```text
EA-POMRA
ÉTUDIER EN AFRIQUE
```

## Navigation

Chaque item :

```text
height: 44px
padding-inline: 12px
border-radius: 8px
gap: 12px
```

Icône :

```text
20 × 20px
stroke-width: 2
```

### Navigation

```text
Tableau de bord
Mon dossier
Orientation OCO
Mes demandes PAP
Transferts STSS
Mes documents
Messages
Notifications
Calendrier
Mon profil
Aide & FAQ
```

Le plan prévoit bien un portail étudiant centré sur le statut du dossier, l'ID-POMRA et la demande PAP, tandis que le STSS fait partie du parcours global. fileciteturn2file0L18-L30

## Item actif

```text
background: rgba(255,255,255,.12)
color: #FFFFFF
```

Ajouter une barre active de :

```text
3px
```

sur le côté gauche.

---

# 12. Header

Hauteur :

```text
72px
```

Le header reste dans le flux desktop.

## Partie gauche

```text
Bonjour, Koffi Amadou 👋
Bienvenue dans votre espace étudiant EA-POMRA.
```

H1 :

```text
24px / 32px / 700
```

Sous-titre :

```text
14px / 20px
```

## Partie droite

Ordre :

```text
Sélecteur antenne
Notifications
Avatar
Nom
ID-POMRA
Menu profil
```

Gap :

```text
12–16px
```

---

# 13. Sélecteur d'antenne

Dimensions :

```text
width: 190px
height: 48px
```

Contenu :

```text
Drapeau
Antenne
Pays
Chevron
```

Utiliser `DropdownMenu` shadcn.

Attention : pour un étudiant, si l'antenne n'est pas modifiable selon les règles métier, afficher une version non interactive.

---

# 14. Notification button

Dimensions :

```text
44 × 44px
```

Icône :

```text
Bell
20 × 20px
```

Badge :

```text
18 × 18px
position: absolute
top: -2px
right: -2px
```

Couleur :

```text
#3B82F6
```

---

# 15. Avatar

```text
40 × 40px
border-radius: 9999px
```

Sur desktop :

```text
Nom : 13–14px SemiBold
ID : 11–12px Regular
```

---

# 16. Carte identité ID-POMRA

## Dimensions desktop

```text
width: 100%
height: 148px
```

Layout :

```text
grid-template-columns: 260px 1fr
```

## Bloc gauche

Fond :

```text
#0D2B4D
```

Padding :

```text
24px
```

Afficher :

```text
VOTRE IDENTIFIANT

CI-2024-00125

Code ID-POMRA

Utilisez ce code pour vos interactions officielles.
```

## QR Code

```text
72 × 72px
border-radius: 8px
background: white
```

## Bloc droit

Grid :

```text
2 colonnes
2 lignes
```

Informations :

```text
Statut du dossier
Antenne
Date d'inscription
Programme visé
```

---

# 17. Badge de statut

Utiliser le composant shadcn `Badge`.

Exemple :

```tsx
<Badge variant="secondary">
  En cours
</Badge>
```

Style personnalisé :

```text
background: #E9F8F0
color: #16824E
```

États :

```text
En cours
À compléter
En attente
Validé
Terminé
Refusé
```

---

# 18. Progression du parcours

## Carte

```text
padding: 24px
border-radius: 16px
background: white
```

Titre :

```text
Avancement de votre parcours
```

Action :

```text
Voir tout →
```

## Étapes

```text
1 Dépôt du dossier
2 Étude OCO
3 Orientation
4 Décision finale
```

Le plan prévoit un avis OCO pouvant être favorable, sous réserve ou défavorable, ainsi qu'une orientation suggérée. fileciteturn2file0L24-L30

### Desktop

```text
display: grid
grid-template-columns: repeat(4, 1fr)
```

### Cercle

```text
32 × 32px
border-radius: 9999px
```

### Étape active

```text
background: #174A7C
color: white
```

### Étape terminée

```text
background: #1EA362
color: white
```

### Étape future

```text
background: #E6E9EF
color: #6B7280
```

### Ligne

```text
height: 2px
```

---

# 19. Vue d'ensemble

## Grid

```text
grid-template-columns: repeat(4, 1fr)
gap: 16px
```

Chaque stat card :

```text
min-height: 132px
padding: 20px
border-radius: 16px
```

## Exemple

### Documents soumis

```text
7
Documents soumis
```

### Étapes terminées

```text
2
Étapes terminées
```

### Étape en cours

```text
1
Étape en cours
```

### Action en attente

```text
0
Action en attente
```

---

# 20. Stat cards — icônes

Icône :

```text
24 × 24px
```

Conteneur :

```text
44 × 44px
border-radius: 12px
```

Utiliser une couleur pastel correspondant au statut.

Exemples :

```text
Documents → bleu
Terminé → vert
En cours → or/orange
Attention → rouge
```

---

# 21. Statut de mon dossier

Grande carte.

```text
width: 100%
padding: 20px
border-radius: 16px
```

Chaque ligne :

```text
min-height: 64px
padding-block: 12px
border-bottom: 1px solid #E6E9EF
```

Contenu :

```text
Icon / numéro
Titre
Description
Badge statut
```

Exemple :

```text
✓ Dossier de candidature soumis
  12 Mars 2024 à 14:30
  [Terminé]

2 Étude par l'Expert OCO
  Votre dossier est en cours d'analyse.
  [En cours]

3 Orientation proposée
  Orientation académique et établissement recommandé.
  [À venir]

4 Décision finale BEC
  Validation finale et communication de la décision.
  [À venir]
```

---

# 22. Actions rapides

## Grid desktop

```text
grid-template-columns: repeat(2, 1fr)
gap: 12px
```

Chaque action :

```text
min-height: 88px
padding: 16px
border-radius: 12px
```

Actions :

1. Ajouter un document
2. Contacter mon antenne
3. Demander un accompagnement PAP
4. Demander un transfert STSS

Le plan prévoit explicitement les demandes PAP côté étudiant et le module STSS pour les transferts inter-antennes. fileciteturn2file0L35-L46

---

# 23. Quick action — interaction

Au hover :

```text
transform: translateY(-2px)
box-shadow: 0 6px 16px rgba(13,43,77,.08)
```

Durée :

```text
180ms
```

Easing :

```text
ease-out
```

Au press :

```text
transform: scale(.98)
```

---

# 24. Notifications récentes

Carte :

```text
padding: 20px
border-radius: 16px
```

Afficher maximum :

```text
3 à 5 notifications
```

Chaque notification :

```text
min-height: 58px
padding-block: 10px
```

Structure :

```text
indicateur
icône
message
temps
```

Exemples :

```text
Votre dossier est en cours d'étude par l'expert OCO.
Il y a 2 heures

Document « Relevé de notes » approuvé.
Il y a 1 jour

Nouveau message de votre antenne.
Il y a 2 jours
```

Le plan prévoit les notifications WhatsApp/email aux étapes clés du parcours. fileciteturn2file0L35-L46

---

# 25. Ressources utiles

Carte horizontale.

Éléments :

```text
Guide étudiant
Présentation EA-POMRA
Questions fréquentes
Nous écrire
```

Chaque ressource :

```text
display: flex
gap: 12px
```

Icône :

```text
40 × 40px
```

---

# 26. Banner d'aide

Carte avec illustration.

## Dimensions desktop

```text
height: 168px
```

Fond :

```text
#F3F7FB
```

Rayon :

```text
20px
```

Contenu :

```text
Illustration étudiant africain
Texte
Bouton Besoin d'aide ?
Illustration/map décorative
```

### Texte

> Votre réussite, notre mission.

> Nous sommes à vos côtés à chaque étape de votre parcours.

Bouton :

```text
Besoin d'aide ?
```

---

# 27. Illustrations

## Direction artistique

Les illustrations doivent être :

- africaines
- contemporaines
- positives
- inclusives
- professionnelles
- légèrement soft
- cohérentes avec EA-POMRA

## Illustration étudiant

Dimensions desktop :

```text
220 × 180px
```

Position :

```text
absolute
bottom: 0
left: 24px
```

## Illustration carte Afrique

```text
180 × 140px
position: absolute
right: 16px
bottom: 12px
opacity: .85
```

Les illustrations sont décoratives et ne doivent jamais empêcher la lecture.

---

# 28. Responsive — Desktop ≥ 1280px

```text
Sidebar : 240px
Page padding : 32px
Main grid : 2 colonnes
Gap : 24px
```

Structure principale :

```text
grid-template-columns: minmax(0, 1.6fr) minmax(320px, .9fr)
```

---

# 29. Responsive — Laptop 1024–1279px

Sidebar :

```text
220px
```

Container :

```text
padding-inline: 24px
```

Identity card :

```text
1 colonne si nécessaire
```

Stats :

```text
repeat(2, 1fr)
```

Actions :

```text
repeat(2, 1fr)
```

---

# 30. Responsive — Tablet 768–1023px

Sidebar desktop remplacée par navigation compacte.

Header :

```text
height: 64px
padding-inline: 20px
```

Container :

```text
padding-inline: 20px
```

Grid :

```text
1 colonne
```

Stats :

```text
repeat(2, 1fr)
```

---

# 31. Responsive — Mobile < 768px

La priorité absolue est la lisibilité.

### Sidebar

Cachée.

Utiliser :

```text
Sheet / Drawer
```

shadcn.

### Header

```text
height: 60px
padding-inline: 16px
```

Afficher :

```text
Logo compact
Notifications
Avatar/menu
```

### H1

```text
24px
line-height: 32px
```

### Container

```text
padding-inline: 16px
```

### Section gap

```text
16px
```

---

# 32. Mobile — ordre des blocs

Sur mobile, utiliser cet ordre :

```text
Header

Bonjour...

ID-POMRA

Avancement

Actions rapides

Vue d'ensemble

Statut du dossier

Notifications

Ressources

Aide
```

La priorité doit rester sur le **statut du dossier et la prochaine action**.

---

# 33. Mobile — Stats

Passer de :

```text
4 colonnes
```

à :

```text
2 colonnes
```

Dimensions :

```text
min-height: 112px
```

Padding :

```text
16px
```

---

# 34. Mobile — Actions rapides

Deux colonnes si largeur suffisante :

```text
grid-template-columns: repeat(2, 1fr)
```

Pour très petits écrans :

```text
1 colonne
```

Breakpoint :

```text
< 420px
```

---

# 35. Mobile — ID-POMRA

Passer la carte en colonne.

```text
height: auto
padding: 20px
```

QR :

```text
64 × 64px
```

Ne jamais couper le code ID-POMRA.

Le code doit rester facilement copiable.

Ajouter :

```text
Copier
```

avec feedback :

```text
✓ Copié
```

---

# 36. Mobile — Progression

La progression horizontale peut devenir :

```text
vertical stepper
```

Structure :

```text
● Dépôt du dossier
│
● Étude OCO
│
○ Orientation
│
○ Décision finale
```

---

# 37. Mobile bottom navigation

Pour les actions principales :

```text
Accueil
Dossier
Messages
Notifications
Profil
```

Dimensions :

```text
height: 64px
```

Position :

```text
fixed
bottom: 0
left: 0
right: 0
z-index: 40
```

Fond :

```text
rgba(255,255,255,.96)
```

Ajouter :

```text
backdrop-blur
border-top
```

---

# 38. Animations

Les animations doivent être **subtiles**.

Ne pas utiliser d'animations permanentes ou distrayantes.

## Page entrance

```text
opacity: 0 → 1
y: 12 → 0
duration: 400ms
easeOut
```

Stagger :

```text
60ms
```

## Cards

```text
opacity: 0 → 1
y: 8 → 0
duration: 300ms
```

## Hover

```text
transform: translateY(-2px)
duration: 180ms
```

## Button press

```text
scale(.98)
duration: 100ms
```

## Progression

La ligne de progression peut s'animer :

```text
width: 0 → valeur réelle
duration: 800ms
ease-out
```

---

# 39. Accessibilité des animations

Respecter :

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Les animations ne doivent jamais être nécessaires pour comprendre une information.

---

# 40. Composants shadcn/ui à utiliser

Priorité aux composants shadcn :

```text
Button
Badge
Card
Avatar
DropdownMenu
Sheet
Dialog
Popover
Tooltip
Progress
Separator
Skeleton
Alert
Tabs
ScrollArea
Input
Textarea
Select
Command
Toast / Sonner
```

## Utilisation

### Card

Pour :

- identité
- statistiques
- dossier
- notifications
- ressources

### Badge

Pour les statuts.

### Sheet

Pour la sidebar mobile.

### DropdownMenu

Pour le profil.

### Progress

Pour l'avancement.

### Skeleton

Pour le chargement.

### Sonner

Pour :

- document ajouté
- copie ID-POMRA
- action réussie
- erreur

---

# 41. États de chargement

Chaque bloc asynchrone doit avoir un Skeleton.

Exemple :

```tsx
<Skeleton className="h-6 w-40" />
<Skeleton className="h-4 w-64" />
```

Ne jamais afficher un grand écran blanc pendant le chargement.

---

# 42. Empty states

### Aucun document

```text
Aucun document envoyé

Ajoutez les documents nécessaires à votre dossier.

[Ajouter un document]
```

### Aucune notification

```text
Vous êtes à jour

Aucune nouvelle notification.
```

### Aucun message

```text
Pas encore de messages

Votre antenne pourra vous contacter ici.
```

---

# 43. Erreurs

Exemple :

```text
Impossible de charger votre dossier.

Vérifiez votre connexion puis réessayez.

[Réessayer]
```

L'erreur doit rester compréhensible par un étudiant non technique.

Ne jamais afficher :

```text
500 Internal Server Error
Supabase error
JWT exception
PostgreSQL error
```

dans l'interface utilisateur.

---

# 44. Performance

La page doit être optimisée pour les connexions lentes, car le plan d'implémentation demande de tenir compte de la connectivité faible et recommande SSR, formulaires courts et mode dégradé WhatsApp. fileciteturn2file0L72-L79

Priorités :

- images optimisées
- `next/image`
- lazy loading des illustrations
- éviter les grosses dépendances inutiles
- skeletons
- chargement progressif
- pas de vidéo automatique
- pas de background animé lourd

---

# 45. Sécurité UX

L'espace étudiant est soumis au RBAC.

Le plan prévoit une authentification JWT + RBAC avec plusieurs rôles et insiste sur la confidentialité des fiches PAP. fileciteturn2file0L18-L30

Le frontend ne doit jamais supposer qu'un utilisateur peut accéder à une ressource uniquement parce qu'un bouton existe.

Toujours :

```text
UI permission
+
Backend authorization
```

Pour les informations PAP :

```text
ne jamais afficher les données confidentielles dans le dashboard étudiant
```

sauf si explicitement autorisé par le workflow métier.

---

# 46. Architecture des données UI

Prévoir des interfaces TypeScript.

```ts
interface StudentDashboardData {
  student: {
    firstName: string
    avatarUrl?: string
    idPomra: string
    country: string
    antenna: string
    registrationDate: string
    targetProgram: string
  }

  application: {
    status: string
    currentStep: number
    progress: number
  }

  stats: {
    documentsSubmitted: number
    completedSteps: number
    currentSteps: number
    pendingActions: number
  }

  notifications: Notification[]
}
```

---

# 47. Routes

Le dashboard étudiant doit être accessible depuis :

```text
/espace-etudiant
```

ou, si l'architecture utilise une route dédiée :

```text
/etudiant/dashboard
```

Le choix final doit suivre l'architecture existante du projet.

Ne pas créer une deuxième authentification.

---

# 48. Navigation métier

Navigation recommandée :

```text
/espace-etudiant
/espace-etudiant/dossier
/espace-etudiant/orientation
/espace-etudiant/pap
/espace-etudiant/stss
/espace-etudiant/documents
/espace-etudiant/messages
/espace-etudiant/notifications
/espace-etudiant/calendrier
/espace-etudiant/profil
/espace-etudiant/aide
```

Si les routes existent déjà dans le projet, les réutiliser plutôt que les dupliquer.

---

# 49. Checklist visuelle

Avant validation :

- [ ] Logo EA-POMRA officiel utilisé
- [ ] Palette EA-POMRA respectée
- [ ] Plus Jakarta Sans
- [ ] Sidebar 240px desktop
- [ ] Header 72px
- [ ] Container max 1280px
- [ ] Padding desktop 32px
- [ ] Gap sections 24px
- [ ] Cards 16px radius
- [ ] Ombres très douces
- [ ] Boutons 44–48px
- [ ] ID-POMRA immédiatement visible
- [ ] Progression immédiatement visible
- [ ] Statut dossier visible
- [ ] Actions rapides visibles
- [ ] Notifications visibles
- [ ] Mobile responsive
- [ ] Sidebar transformée en Sheet mobile
- [ ] Bottom navigation mobile
- [ ] Reduced motion
- [ ] Skeleton states
- [ ] Empty states
- [ ] Error states
- [ ] Pas d'informations PAP confidentielles exposées

---

# 50. PROMPT OPENCODE — IMPLÉMENTATION

Copier le prompt ci-dessous dans OpenCode après avoir placé ce fichier dans le projet.

---

## Prompt

Tu es un développeur frontend senior spécialisé en Next.js, React, TypeScript, Tailwind CSS, shadcn/ui et UX SaaS.

Tu dois implémenter **l'Espace Étudiant EA-POMRA** en respectant STRICTEMENT le fichier `SPEC_ETUDIANTS_PAGE.md`.

### CONTEXTE PRODUIT

EA-POMRA signifie :

**Étudiant en Afrique — Plateforme d'Orientation, de Mobilité et de Réussite Académique.**

Le portail étudiant doit permettre notamment :

- consulter le statut du dossier ;
- consulter le code ID-POMRA ;
- suivre la progression OCO/orientation/décision ;
- gérer les documents ;
- demander un accompagnement PAP ;
- suivre les transferts STSS ;
- consulter les notifications ;
- contacter son antenne.

Le plan d'implémentation prévoit également une gestion par rôles JWT/RBAC et une forte confidentialité des informations PAP.

### OBJECTIF

Créer une interface qui donne immédiatement à l'étudiant :

1. son identité ;
2. son ID-POMRA ;
3. l'état de son dossier ;
4. l'étape actuelle ;
5. la prochaine action ;
6. ses notifications importantes.

L'interface doit être **professionnelle, soft, moderne, africaine et institutionnelle**.

Ne pas faire une interface administrative vieillissante.

Ne pas copier Uber ou Airbnb. S'inspirer uniquement de leurs principes de simplicité, hiérarchie et clarté.

---

## CONTRAINTES TECHNIQUES

Utiliser l'existant du projet.

Avant toute modification :

1. inspecter l'architecture ;
2. identifier le système d'authentification ;
3. identifier les routes existantes ;
4. identifier les composants UI existants ;
5. identifier les tokens Tailwind existants ;
6. identifier les composants shadcn déjà installés ;
7. identifier la manière dont Supabase/API est actuellement utilisé.

**Ne pas réécrire l'architecture du projet.**

**Ne pas créer une deuxième authentification.**

**Ne pas supprimer de fonctionnalité existante.**

---

## DESIGN

Implémenter exactement :

```text
Sidebar desktop : 240px
Header : 72px
Container max : 1280px
Padding desktop : 32px
Gap sections : 24px
Gap cartes : 16px
Card radius : 16px
Button height : 44–48px
Input height : 44–48px
```

Couleurs :

```text
Navy    #0D2B4D
Primary #174A7C
Green   #1EA362
Gold    #C89C2E

Background #F7F9FB
Text       #1F2937
Border     #E6E9EF
Muted      #A2AAB3

Success #22C55E
Info    #3B82F6
Warning #F59E0B
Error   #EF4444
```

Police :

```text
Plus Jakarta Sans
```

---

## STRUCTURE

Créer/reprendre les composants :

```text
StudentSidebar
StudentHeader
StudentIdentityCard
JourneyProgress
OverviewStats
ApplicationTimeline
QuickActions
NotificationsCard
ResourcesCard
HelpBanner
StatusBadge
MobileBottomNav
```

Utiliser des composants atomiques réutilisables.

---

## SHADCN

Utiliser autant que possible :

```text
Button
Badge
Card
Avatar
DropdownMenu
Sheet
Dialog
Popover
Tooltip
Progress
Separator
Skeleton
Alert
Tabs
ScrollArea
Input
Select
Command
Sonner
```

Ne pas réinventer un composant déjà disponible dans shadcn.

---

## SIDEBAR

Créer une sidebar desktop de :

```text
240px × 100vh
```

Fond :

```text
#0D2B4D
```

Logo EA-POMRA officiel.

Navigation :

```text
Tableau de bord
Mon dossier
Orientation OCO
Mes demandes PAP
Transferts STSS
Mes documents
Messages
Notifications
Calendrier
Mon profil
Aide & FAQ
```

L'item actif doit être clairement identifiable.

---

## DASHBOARD

Créer les sections suivantes :

### 1. Header

```text
Bonjour, [Prénom] 👋
Bienvenue dans votre espace étudiant EA-POMRA.
```

À droite :

```text
Antenne
Notifications
Avatar
Nom
ID-POMRA
Menu
```

### 2. Identity Card

Afficher :

```text
VOTRE IDENTIFIANT

[ID-POMRA]

Code ID-POMRA

Utilisez ce code pour vos interactions officielles.
```

Ajouter QR code uniquement si le backend ou les données existantes permettent de le générer correctement.

Ne pas inventer de données sensibles.

### 3. Progression

Afficher :

```text
Dossier soumis
Étude OCO
Orientation
Décision finale
```

Afficher clairement l'étape active.

### 4. Statistiques

Afficher :

```text
Documents soumis
Étapes terminées
Étape en cours
Action en attente
```

### 5. Statut du dossier

Afficher une timeline verticale/horizontale selon breakpoint.

### 6. Actions rapides

```text
Ajouter un document
Contacter mon antenne
Demander un accompagnement PAP
Demander un transfert STSS
```

### 7. Notifications

Afficher les notifications récentes.

### 8. Ressources

Afficher :

```text
Guide étudiant
Présentation EA-POMRA
Questions fréquentes
Nous écrire
```

### 9. Banner

Créer un bloc d'aide avec une illustration contemporaine d'un étudiant africain.

---

## RESPONSIVE

### ≥ 1280px

```text
Sidebar 240px
Main 2 colonnes
```

### 1024–1279px

Réduire sidebar à environ :

```text
220px
```

### 768–1023px

Utiliser navigation compacte / Sheet.

### < 768px

Masquer sidebar desktop.

Utiliser :

```text
Sheet
+
MobileBottomNav
```

Le contenu devient une colonne.

Stats :

```text
2 colonnes
```

Actions :

```text
2 colonnes
```

Sous 420px :

```text
1 colonne
```

---

## MOBILE

Le premier écran doit montrer rapidement :

```text
Bonjour
ID-POMRA
Statut / progression
```

Ne pas créer d'espaces verticaux inutiles.

Padding horizontal :

```text
16px
```

Header :

```text
60px
```

H1 :

```text
24px
```

---

## ANIMATIONS

Utiliser Framer Motion uniquement lorsque cela apporte de la clarté.

Page :

```text
opacity 0 → 1
y 12 → 0
duration 400ms
```

Cards :

```text
y 8 → 0
opacity 0 → 1
duration 300ms
```

Hover :

```text
translateY(-2px)
180ms
```

Button press :

```text
scale(.98)
100ms
```

Respecter `prefers-reduced-motion`.

---

## PERFORMANCE

EA-POMRA peut être utilisé avec une connectivité limitée.

Donc :

- utiliser `next/image` ;
- compresser les images ;
- lazy-load les illustrations ;
- éviter les gros backgrounds ;
- éviter les animations lourdes ;
- utiliser Skeleton ;
- éviter les appels API inutiles ;
- privilégier Server Components lorsque possible ;
- utiliser Client Components uniquement lorsqu'une interaction l'exige.

---

## DONNÉES

Ne pas hardcoder définitivement les données métier.

Créer des données mockées uniquement si le backend n'est pas encore disponible.

Structurer les données afin de pouvoir remplacer facilement :

```text
mock → API
```

Exemple :

```ts
StudentDashboardData
```

Prévoir :

```text
student
application
stats
notifications
documents
```

---

## SÉCURITÉ

Ne jamais afficher les informations PAP confidentielles dans le dashboard étudiant sauf si le workflow métier existant l'autorise explicitement.

Ne jamais faire confiance au frontend pour les permissions.

Le backend doit rester la source d'autorité.

Ne jamais afficher :

```text
JWT
tokens
secrets
stack traces
erreurs PostgreSQL
erreurs Supabase internes
```

---

## QUALITÉ CODE

Le code doit :

- être TypeScript strict ;
- être typé ;
- être composable ;
- éviter les duplications ;
- respecter les conventions existantes ;
- respecter ESLint ;
- ne pas utiliser `any` sans justification ;
- ne pas introduire de dépendance inutile.

---

## AVANT DE TERMINER

Effectuer :

```text
npm run lint
npm run build
```

ou les commandes équivalentes existantes dans le projet.

Corriger les erreurs.

Vérifier :

```text
Desktop 1440px
Laptop 1280px
Tablet 768px
Mobile 390px
Mobile 360px
```

Vérifier particulièrement :

- débordements horizontaux ;
- sidebar ;
- header ;
- cartes ;
- progression ;
- boutons ;
- textes longs ;
- notifications ;
- bottom navigation ;
- images ;
- responsive ;
- focus clavier ;
- reduced motion.

---

## RÈGLE FINALE

**Ne pas simplement produire une page qui ressemble à une maquette.**

Construire un véritable espace étudiant réutilisable, responsive, accessible, performant et connecté à l'architecture existante du projet EA-POMRA.

La priorité UX est :

**Statut → Progression → Prochaine action → Accompagnement.**

Ne pas ajouter de fonctionnalités non prévues par la spécification sans les isoler clairement et sans modifier le périmètre métier.
