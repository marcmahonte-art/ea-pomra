# EA-POMRA — Design System

> **Plateforme d’Orientation, de Mobilité et de Réussite Académique**  
> Design system professionnel, soft, moderne et accessible, inspiré des principes UX de plateformes comme Uber et Airbnb, adapté à l’identité institutionnelle et panafricaine d’EA-POMRA.

---

## 1. Identité de marque

### 1.1 Nom

**EA-POMRA**

### 1.2 Signification

**Étudier en Afrique — Plateforme d’Orientation, de Mobilité et de Réussite Académique**

### 1.3 Promesse

Accompagner chaque étudiant africain dans son parcours :

**Orientation → Mobilité → Suivi → Réussite**

### 1.4 Principes de design

Le système visuel doit transmettre :

- **Confiance** — plateforme institutionnelle et sécurisée
- **Simplicité** — parcours compréhensibles même avec une faible expérience numérique
- **Humanité** — accompagnement et proximité
- **Mobilité** — circulation des étudiants entre les pays et les antennes
- **Réussite académique** — éducation, diplôme et avenir professionnel
- **Panafricanité** — identité africaine sans surcharge visuelle
- **Modernité** — interface digitale comparable aux meilleures plateformes SaaS
- **Accessibilité** — interface confortable sur ordinateur, tablette et mobile

---

# 2. Logo

## 2.1 Logo principal

Le logo EA-POMRA est composé de :

- la mention **EA-POMRA**
- la carte de l'Afrique
- un livre ouvert
- des éléments végétaux symbolisant la croissance et la réussite
- la mention **ÉTUDIER EN AFRIQUE**

### 2.2 Signification visuelle

| Élément | Signification |
|---|---|
| Afrique | Identité panafricaine |
| Livre ouvert | Éducation et connaissance |
| Laurier / feuillage | Réussite, croissance et excellence |
| Couleurs naturelles | Afrique, confiance et avenir |
| Cercle | Communauté, protection et accompagnement |

### 2.3 Utilisation

Le logo doit toujours conserver :

- ses proportions originales
- une zone de respiration suffisante
- une bonne lisibilité
- un contraste suffisant avec le fond

Éviter :

- de déformer le logo
- de changer arbitrairement ses couleurs
- de placer le logo sur un fond trop chargé
- d'ajouter des ombres excessives
- de couper le cercle du logo

---

# 3. Palette de couleurs

La palette principale est construite autour du **bleu institutionnel**, du **vert**, du **doré** et de tons neutres très doux.

## 3.1 Couleurs principales

| Nom | HEX | Utilisation |
|---|---|---|
| Navy | `#0D2B4D` | Navigation, titres, éléments institutionnels |
| Bleu EA-POMRA | `#174A7C` | Couleur principale de l'interface |
| Vert | `#1EA362` | Succès, validation, mobilité, actions positives |
| Or | `#C89C2E` | Accent premium, réussite, éléments de marque |

## 3.2 Couleurs neutres

| Nom | HEX | Utilisation |
|---|---|---|
| White | `#FFFFFF` | Arrière-plan principal |
| Background | `#F7F9FB` | Fond général de l'application |
| Gray 100 | `#E6E9EF` | Bordures et séparateurs |
| Gray 400 | `#A2AAB3` | Texte secondaire |
| Dark | `#1F2937` | Texte principal |

## 3.3 Couleurs sémantiques

| État | HEX | Utilisation |
|---|---|---|
| Success | `#22C55E` | Validé, terminé, paiement réussi |
| Information | `#3B82F6` | Information, notification |
| Warning | `#F59E0B` | En attente, attention |
| Error | `#EF4444` | Erreur, rejet, problème |

### Règle

Les couleurs sémantiques ne doivent pas remplacer les couleurs de marque. Elles servent uniquement à communiquer un **état fonctionnel**.

---

# 4. Dégradés

Les dégradés doivent rester subtils.

### Dégradé bleu/vert

```css
linear-gradient(135deg, #0D2B4D 0%, #1EA362 100%);
```

Utilisations :

- Hero
- éléments marketing
- illustrations
- graphiques
- zones de mise en avant

### Dégradé bleu/or

```css
linear-gradient(135deg, #174A7C 0%, #C89C2E 100%);
```

Utilisations :

- statistiques importantes
- réussite académique
- badges premium
- éléments institutionnels

---

# 5. Typographie

## 5.1 Police principale

**Plus Jakarta Sans**

La typographie doit être :

- moderne
- lisible
- professionnelle
- chaleureuse
- adaptée aux interfaces web

## 5.2 Hiérarchie

| Niveau | Police | Graisse | Taille | Ligne |
|---|---|---:|---:|---:|
| H1 | Plus Jakarta Sans | Bold | 40px | 48px |
| H2 | Plus Jakarta Sans | Bold | 32px | 40px |
| H3 | Plus Jakarta Sans | SemiBold | 24px | 32px |
| H4 | Plus Jakarta Sans | SemiBold | 20px | 28px |
| Body Large | Plus Jakarta Sans | Regular | 16px | 24px |
| Body | Plus Jakarta Sans | Regular | 14px | 20px |
| Small | Plus Jakarta Sans | Regular | 12px | 16px |

## 5.3 Titres

Les titres doivent être :

- courts
- directs
- fortement contrastés
- orientés vers l'action ou la compréhension

Exemples :

> Bonjour, bienvenue sur votre espace étudiant

> Suivez votre parcours académique

> Vos dossiers en cours

---

# 6. Espacement

Utiliser une échelle d'espacement cohérente.

| Token | Valeur |
|---|---:|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |
| `space-20` | 80px |

### Principe

Les interfaces doivent privilégier :

**beaucoup d'espace + peu d'éléments + hiérarchie claire**

L'objectif est d'éviter l'effet « tableau administratif dense ».

---

# 7. Rayons de bordure

Le système utilise des coins légèrement arrondis.

| Token | Valeur | Utilisation |
|---|---:|---|
| `radius-sm` | 4px | petits éléments |
| `radius-md` | 8px | champs, boutons secondaires |
| `radius-lg` | 12px | cartes |
| `radius-xl` | 16px | grandes cartes |
| `radius-2xl` | 24px | blocs Hero / éléments principaux |
| `radius-full` | 9999px | badges, avatars, pills |

Le style général doit rester **soft**, sans excès de rondeur.

---

# 8. Ombres

Les ombres doivent être très légères.

```css
/* Small */
box-shadow: 0 1px 2px rgba(13, 43, 77, 0.06);

/* Medium */
box-shadow: 0 4px 12px rgba(13, 43, 77, 0.08);

/* Large */
box-shadow: 0 8px 24px rgba(13, 43, 77, 0.10);

/* Extra large */
box-shadow: 0 16px 40px rgba(13, 43, 77, 0.12);
```

### Règle

Les cartes ne doivent jamais sembler « flotter lourdement ».

Préférer :

- bordure très légère
- ombre douce
- espace blanc généreux

---

# 9. Boutons

## 9.1 Bouton primaire

Couleur :

`#174A7C`

Utilisation :

- Envoyer
- Continuer
- Valider
- Commencer
- Voir le dossier

Style :

```text
Hauteur : 44–48px
Rayon : 8–12px
Padding horizontal : 20px
Texte : 14–16px
Graisse : SemiBold
```

## 9.2 Bouton action positive

Couleur :

`#1EA362`

Utilisation :

- Confirmer
- Paiement
- Transfert
- Valider une étape

## 9.3 Bouton secondaire

Fond blanc avec :

- bordure `#174A7C`
- texte `#174A7C`

## 9.4 Bouton tertiaire

Fond neutre :

`#F7F9FB`

## 9.5 États

Chaque bouton doit prévoir :

- Normal
- Hover
- Focus
- Pressed
- Disabled
- Loading

### Exemple

```text
Normal    → couleur principale
Hover     → couleur légèrement plus sombre
Pressed   → contraste renforcé
Disabled  → gris + opacité réduite
Loading   → spinner + texte conservé
```

---

# 10. Champs de saisie

## 10.1 Champ standard

Caractéristiques :

- hauteur : 44–48px
- rayon : 8px
- bordure : `#D9DEE7`
- fond : blanc
- texte : `#1F2937`

## 10.2 Focus

Le focus doit être clairement visible.

```css
border-color: #174A7C;
box-shadow: 0 0 0 3px rgba(23, 74, 124, 0.12);
```

## 10.3 Erreur

Utiliser :

`#EF4444`

Afficher :

- bordure rouge
- message d'erreur court
- indication directement sous le champ

Exemple :

> Ce champ est requis.

## 10.4 Succès

Utiliser :

`#22C55E`

Exemple :

> Document correctement envoyé.

---

# 11. Cartes

Les cartes constituent un composant majeur de la plateforme.

## Style

- fond blanc
- bordure légère
- rayon 12–16px
- ombre légère
- padding 20–24px

## Types de cartes

### Carte Orientation

Icône : livre / graduation

Titre :

> Orientation personnalisée

Description :

> Bénéficiez d'un accompagnement personnalisé pour choisir la meilleure voie.

### Carte Mobilité

Icône : globe

Titre :

> Mobilité académique

Description :

> Facilitez vos transferts et votre parcours académique à travers l'Afrique.

### Carte Accompagnement

Icône : personnes

Titre :

> Accompagnement continu

Description :

> Un suivi humain à chaque étape de votre parcours jusqu'à la réussite.

---

# 12. Icônes

## Style

Les icônes doivent être :

- Outline
- simples
- modernes
- cohérentes
- lisibles à petite taille

### Spécifications

```text
Style : Outline
Épaisseur : 2px
Arrondi : 2px
```

## Icônes principales

Prévoir notamment :

- Accueil
- Tableau de bord
- Dossier
- Étudiant
- Parent
- Orientation
- Mobilité
- Globe
- Éducation
- Diplôme
- Document
- Calendrier
- Notification
- Message
- Sécurité
- Validation
- Erreur
- Information
- Recherche
- Paramètres
- Téléchargement
- Transfert
- Paiement
- Rapports

---

# 13. Navigation

## 13.1 Sidebar

La sidebar est principalement utilisée dans les espaces authentifiés.

### Structure

```text
Logo EA-POMRA

Tableau de bord
Dossiers
Orientation
Mobilité
Transactions STSS
Messages
Rapports
Paramètres
```

## 13.2 Sidebar active

L'élément actif doit utiliser :

- fond bleu très clair
- texte bleu EA-POMRA
- icône bleue
- rayon 8px

## 13.3 Header

Le header doit contenir :

- recherche
- notifications
- profil utilisateur
- éventuellement changement de pays/antenne

Le header doit rester simple et peu chargé.

---

# 14. Dashboard

Le dashboard doit fonctionner comme un **centre de pilotage**, pas comme un tableau Excel.

## KPI prioritaires

Exemples :

```text
Dossiers en cours
128

Avis OCO
45

Transferts STSS
32

Étudiants accompagnés
568
```

Chaque KPI peut afficher :

- valeur principale
- évolution
- période
- mini graphique

---

# 15. Statuts

Les statuts doivent être immédiatement compréhensibles.

| Statut | Couleur | Exemple |
|---|---|---|
| Actif | Vert | Compte actif |
| En cours | Bleu | Dossier en traitement |
| En attente | Orange | Document attendu |
| Terminé | Vert | Dossier terminé |
| Refusé | Rouge | Avis défavorable |
| Information | Bleu | Nouvelle information |

Utiliser de préférence des **badges/pills**.

---

# 16. Progression d'un dossier

Le parcours doit être représenté visuellement.

Exemple :

```text
① Dépôt du dossier
        ↓
② Étude OCO
        ↓
③ Orientation
        ↓
④ Mobilité
        ↓
⑤ Suivi
        ↓
⑥ Réussite / Diplôme
```

La progression doit permettre de comprendre immédiatement :

- ce qui est terminé
- ce qui est en cours
- ce qui vient ensuite

---

# 17. Barre de progression

Utiliser une barre simple et fine.

Exemple :

```text
████████████████░░░░ 80%
```

Hauteur recommandée :

`6–8px`

Rayon :

`9999px`

---

# 18. Formulaires

Les formulaires sont importants dans le parcours EA-POMRA.

Ils doivent être :

- courts
- découpés en étapes
- faciles à comprendre
- adaptés au mobile
- sauvegardables lorsque nécessaire

## Formulaire étudiant

Prévoir notamment :

- informations personnelles
- parcours académique
- établissement
- documents
- choix d'orientation
- informations de mobilité

## Formulaire parent

Prévoir un parcours distinct et simple.

## Fiche PAP

La fiche PAP est confidentielle.

L'interface doit renforcer visuellement cette confidentialité :

- badge « Confidentiel »
- accès limité
- informations sensibles masquées lorsque nécessaire
- journalisation des accès

---

# 19. Confidentialité

EA-POMRA utilise le **code ID-POMRA** pour limiter l'exposition du nom de l'étudiant sur les canaux partagés.

## Règle UX

Ne jamais afficher inutilement :

- identité complète
- données sensibles
- fiche PAP
- informations financières

dans les espaces qui ne disposent pas des autorisations nécessaires.

La gestion des droits repose sur :

**RBAC — Role Based Access Control**

---

# 20. Rôles

Le design system doit pouvoir s'adapter aux différents portails :

1. Étudiant
2. Parent
3. Coordonnateur National
4. Trésorier National
5. Expert OCO
6. Responsable PAP
7. BEC / Administrateur

Chaque rôle doit voir uniquement les fonctionnalités correspondant à ses permissions.

---

# 21. Module STSS

Le module STSS doit avoir une interface particulièrement claire.

## Éléments

- montant
- antenne source
- antenne destination
- preuve de paiement
- commission
- statut
- date
- historique
- journal d'audit

## États

```text
Brouillon
En attente
En traitement
Transfert confirmé
Échec
Annulé
```

Les opérations financières doivent toujours être accompagnées d'une confirmation explicite.

---

# 22. Notifications

Les notifications doivent être courtes et actionnables.

### Exemple

**Votre dossier a été mis à jour**

> Votre dossier ID-POMRA #PMR-2048 a été transmis à l'Expert OCO.

Actions :

**Voir le dossier**

---

# 23. Illustrations

Les illustrations doivent respecter une direction artistique :

- contemporaine
- africaine
- humaine
- positive
- inclusive
- professionnelle
- légèrement soft

## Thèmes

- étudiant africain
- université
- livre
- diplôme
- globe
- mobilité
- orientation
- accompagnement
- famille
- technologie

Éviter les illustrations trop enfantines ou trop caricaturales.

---

# 24. Iconographie de marque

Les illustrations et icônes peuvent reprendre les couleurs :

- Navy
- Bleu
- Vert
- Or

Le doré doit rester un **accent**, pas la couleur dominante de l'interface.

---

# 25. Responsive design

Le design system doit être pensé **mobile-first**.

## Mobile

Priorités :

- navigation simple
- boutons facilement accessibles
- formulaires courts
- cartes empilées
- tableaux transformés en cartes lorsque nécessaire
- peu de texte simultanément

## Breakpoints recommandés

```text
sm  : 640px
md  : 768px
lg  : 1024px
xl  : 1280px
2xl : 1536px
```

---

# 26. Principes UX inspirés d'Uber et Airbnb

Sans copier leur identité graphique, EA-POMRA reprend certains principes d'expérience :

## Simplicité

Chaque écran doit avoir une action principale clairement identifiable.

## Hiérarchie

Un utilisateur doit comprendre en quelques secondes :

1. Où suis-je ?
2. Quel est mon statut ?
3. Que dois-je faire ?
4. Quelle est la prochaine étape ?

## Confiance

Les opérations sensibles doivent afficher :

- confirmation
- statut
- historique
- preuve
- date
- responsable lorsque pertinent

## Feedback immédiat

Après chaque action :

- succès
- erreur
- chargement
- progression

doivent être visibles immédiatement.

## Personnalisation

Le dashboard doit présenter les informations pertinentes pour chaque rôle.

---

# 27. Architecture visuelle d'un écran

Structure recommandée :

```text
┌───────────────────────────────────────────────┐
│ Header                                       │
├──────────────┬────────────────────────────────┤
│              │                                │
│ Sidebar      │ Titre de page                  │
│              │ Sous-titre                     │
│ Navigation   │                                │
│              │ KPI / Actions principales      │
│              │                                │
│              │ Contenu principal              │
│              │                                │
└──────────────┴────────────────────────────────┘
```

---

# 28. Ton rédactionnel

Le langage doit être :

- clair
- humain
- professionnel
- rassurant
- direct

Éviter les formulations administratives complexes.

### Préférer

> Votre dossier est en cours d'étude.

### Éviter

> Le traitement administratif relatif à votre dossier est actuellement en phase d'instruction.

---

# 29. Accessibilité

Objectifs :

- contraste suffisant
- focus visible
- navigation clavier
- labels explicites
- messages d'erreur compréhensibles
- zones tactiles suffisamment grandes
- ne jamais transmettre une information uniquement par la couleur

Les composants importants doivent rester compréhensibles en niveaux de gris.

---

# 30. États système

Chaque composant interactif doit prévoir :

```text
Default
Hover
Focus
Active / Pressed
Disabled
Loading
Success
Error
Empty
```

---

# 31. Empty states

Les écrans sans données doivent être accueillants.

Exemple :

### Aucun dossier

> Vous n'avez encore aucun dossier.

**Commencer une candidature**

Éviter les écrans entièrement vides.

---

# 32. Loading states

Privilégier les **skeleton loaders** plutôt qu'un écran vide.

Exemple :

```text
████████████████
██████████
████████████████████
```

---

# 33. Messages d'erreur

Les erreurs doivent expliquer :

1. ce qui s'est passé
2. pourquoi lorsque c'est utile
3. comment résoudre le problème

Exemple :

> Impossible d'envoyer le document. Vérifiez votre connexion puis réessayez.

Action :

**Réessayer**

---

# 34. Design Tokens — résumé

```css
:root {
  --color-navy: #0D2B4D;
  --color-primary: #174A7C;
  --color-success-brand: #1EA362;
  --color-gold: #C89C2E;

  --color-background: #F7F9FB;
  --color-white: #FFFFFF;
  --color-border: #E6E9EF;
  --color-muted: #A2AAB3;
  --color-text: #1F2937;

  --color-success: #22C55E;
  --color-info: #3B82F6;
  --color-warning: #F59E0B;
  --color-error: #EF4444;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
}
```

---

# 35. Stack UI recommandé

Le design system doit être facilement intégrable avec :

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- composants accessibles
- icônes SVG / Lucide
- responsive design

L'architecture doit favoriser des composants réutilisables :

```text
Button
Input
Select
Textarea
Badge
Card
Modal
Alert
Toast
Tabs
Progress
Stepper
Avatar
Dropdown
Table
Pagination
Sidebar
Header
DashboardCard
StatusBadge
DocumentCard
Timeline
```

---

# 36. Règle d'or du design EA-POMRA

> **Faire simple, rassurant et humain.**

Chaque interface doit donner à l'utilisateur la sensation que :

**« Je comprends où j'en suis, je sais quoi faire maintenant et je peux avancer sereinement. »**

---

# 37. Direction artistique finale

Le produit EA-POMRA doit se situer entre :

**Institutionnel + Digital + Humain + Africain**

avec une esthétique :

- blanche et aérée
- bleu profond
- touches de vert
- touches de doré
- cartes légèrement arrondies
- ombres très douces
- typographie moderne
- icônes outline
- illustrations africaines contemporaines
- animations discrètes
- navigation extrêmement claire

Le design ne doit être ni froid comme un logiciel administratif, ni trop ludique.

Il doit donner l'impression d'une **plateforme africaine moderne, fiable et ambitieuse**.
