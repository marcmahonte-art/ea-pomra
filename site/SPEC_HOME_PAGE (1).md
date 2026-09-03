# SPEC_HOME_PAGE.md

# EA-POMRA — Spécification détaillée de la Home Page

> Spécification frontend de la page d'accueil publique EA-POMRA.
>
> Cette spécification combine le **Plan d'implémentation EA-POMRA**, le **Design System EA-POMRA** et la direction visuelle validée pour la Home Page. Le produit est une plateforme multi-portails couvrant 8 antennes nationales, avec un parcours public destiné à présenter l'orientation, la mobilité, le suivi et la réussite académique. Le plan retient Next.js + Tailwind pour le site public, avec SSR et une attention particulière aux connexions lentes. fileciteturn3file2L1-L17
>
> Le Design System impose une identité institutionnelle, digitale, humaine et africaine, avec une interface blanche et aérée, bleu profond, vert et doré, des cartes légèrement arrondies, des ombres douces et des animations discrètes. fileciteturn3file6L1-L17

---

# 1. OBJECTIF

La Home Page doit expliquer EA-POMRA en quelques secondes et orienter immédiatement le visiteur vers le bon parcours.

Objectifs UX :

1. comprendre ce qu'est EA-POMRA ;
2. comprendre sa promesse ;
3. identifier les principaux services ;
4. comprendre le parcours ;
5. identifier son espace : étudiant, parent ou professionnel ;
6. accéder rapidement à l'inscription / connexion ;
7. découvrir les antennes et partenaires ;
8. accéder aux ressources et actualités.

Le site public doit rester simple, rassurant et humain.

Le Design System définit comme règle d'or :

> « Je comprends où j'en suis, je sais quoi faire maintenant et je peux avancer sereinement. » fileciteturn3file0L1-L12

---

# 2. POSITIONNEMENT

## Nom

**EA-POMRA**

## Signification

**Étudiant en Afrique — Plateforme d'Orientation, de Mobilité et de Réussite Académique**

## Promesse

**Orientation → Mobilité → Suivi → Réussite**

Le projet vise notamment à digitaliser le parcours :

```text
Candidat
   ↓
Orientation
   ↓
Mobilité
   ↓
Suivi
   ↓
Diplôme / Réussite
```

Le plan d'implémentation confirme ce parcours produit. fileciteturn3file2L1-L8

---

# 3. DIRECTION ARTISTIQUE

Style général :

```text
Institutionnel
+
Digital
+
Humain
+
Africain
```

Références UX :

- simplicité inspirée des plateformes digitales modernes ;
- hiérarchie forte ;
- CTA immédiatement identifiable ;
- cartes aérées ;
- feedback clair ;
- confiance ;
- personnalisation.

Ne pas copier l'identité graphique d'Uber ou Airbnb.

Le Design System demande explicitement de reprendre leurs principes UX de simplicité, hiérarchie, confiance et feedback sans copier leur identité. fileciteturn3file1L1-L24

---

# 4. STACK

Utiliser l'architecture existante du projet.

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Lucide React
Framer Motion
```

Le site public doit privilégier SSR.

Le plan d'implémentation retient Next.js + Tailwind pour le frontend public et recommande le SSR pour le site public, notamment pour les connexions lentes. fileciteturn3file2L9-L17

---

# 5. VIEWPORTS DE RÉFÉRENCE

Maquettes principales :

```text
Desktop XL : 1440 × 900
Desktop    : 1280 × 800
Laptop     : 1024 × 768
Tablet     : 768 × 1024
Mobile     : 390 × 844
Mobile S   : 360 × 800
```

Tester impérativement :

```text
360px
390px
414px
768px
1024px
1280px
1440px
1536px
```

---

# 6. BREAKPOINTS

Utiliser les breakpoints du Design System :

```text
sm  : 640px
md  : 768px
lg  : 1024px
xl  : 1280px
2xl : 1536px
```

Le Design System impose une approche mobile-first. fileciteturn3file1L1-L18

---

# 7. CONTAINER

Desktop :

```css
max-width: 1280px;
margin-inline: auto;
padding-inline: 32px;
```

Laptop :

```text
padding-inline: 24px
```

Tablet :

```text
padding-inline: 20px
```

Mobile :

```text
padding-inline: 16px
```

À 1440px, le contenu utile ne doit jamais dépasser environ 1280px.

---

# 8. DESIGN TOKENS

## Couleurs officielles

```text
Navy        #0D2B4D
Primary     #174A7C
Green       #1EA362
Gold        #C89C2E

Background  #F7F9FB
White       #FFFFFF
Text        #1F2937
Muted       #A2AAB3
Border      #E6E9EF

Success     #22C55E
Info        #3B82F6
Warning     #F59E0B
Error       #EF4444
```

Ces tokens constituent la palette du Design System. fileciteturn3file5L1-L25

---

# 9. TAILWIND TOKENS

Exposer les tokens sous des noms cohérents :

```ts
theme: {
  extend: {
    colors: {
      ea: {
        navy: "#0D2B4D",
        primary: "#174A7C",
        green: "#1EA362",
        gold: "#C89C2E",
      },
      surface: "#F7F9FB",
    }
  }
}
```

Utiliser :

```text
bg-ea-navy
bg-ea-primary
bg-ea-green
bg-ea-gold

text-ea-navy
text-ea-primary
text-ea-green
text-ea-gold
```

Éviter les couleurs arbitraires dans les composants.

---

# 10. SPACING

Échelle 4px :

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
```

Le Design System définit cette échelle comme base de l'interface. fileciteturn3file0L1-L8

---

# 11. RAYONS

```text
4px   → très petit
8px   → inputs / petits boutons
12px  → petits composants
16px  → cartes standards
24px  → grands blocs / hero
9999px → badges / avatars / pills
```

---

# 12. OMBRES

Utiliser uniquement des ombres douces :

```text
sm:
0 1px 2px rgba(13,43,77,.06)

md:
0 4px 12px rgba(13,43,77,.08)

lg:
0 12px 24px rgba(13,43,77,.10)

xl:
0 24px 48px rgba(13,43,77,.12)
```

Éviter les ombres lourdes.

---

# 13. TYPOGRAPHIE

Police :

```text
Plus Jakarta Sans
```

Desktop :

```text
H1 : 56px / 64px / 700
H2 : 36px / 44px / 700
H3 : 24px / 32px / 700
Body : 16px / 24px
Small : 14px / 20px
```

Hero mobile :

```text
H1 : 34–38px / 42–46px
```

Ne jamais sacrifier la lisibilité au nombre de mots affichés sur une ligne.

---

# 14. Z-INDEX

Hiérarchie :

```text
z-0    contenu
z-10   décorations
z-20   header
z-30   dropdown / popover
z-40   mobile drawer
z-50   modal
z-60   toast
```

Ne pas utiliser de `z-[9999]`.

---

# 15. STRUCTURE DE LA HOME

Ordre exact :

```text
1. Header
2. Hero
3. Feature cards
4. Statistics strip
5. Comment ça marche ?
6. Une plateforme pour tous les acteurs
7. Ils nous font confiance
8. Footer
```

La Home doit être longue mais respirante.

---

# 16. HEADER

## Desktop

Hauteur :

```text
88px
```

Container :

```text
max-width: 1280px
height: 88px
```

Layout :

```text
Logo        Navigation                 CTA
```

### Logo

```text
width: 76px
height: 76px
object-fit: contain
```

Zone logo complète :

```text
width: 260px
```

Afficher sous / à côté :

```text
EA-POMRA
Étudier en Afrique, Réussir demain.
```

Le logo officiel ne doit jamais être déformé.

---

# 17. NAVIGATION DESKTOP

Items :

```text
Accueil
À propos
Programmes
Antennes
Ressources
Actualités
Contact
```

Gap :

```text
24–28px
```

Font :

```text
14px
font-weight: 500
```

Item actif :

```text
color: #174A7C
```

Ajouter un indicateur fin sous le lien actif :

```text
width: 24px
height: 2px
```

---

# 18. CTA HEADER

Texte :

```text
Se connecter
```

Dimensions :

```text
min-width: 118px
height: 46px
padding-inline: 20px
```

Rayon :

```text
9999px
```

Fond :

```text
#0D2B4D
```

Icône :

```text
UserRound
18 × 18px
```

---

# 19. HEADER MOBILE

Hauteur :

```text
68px
```

Logo :

```text
52 × 52px
```

Afficher :

```text
logo
notifications si nécessaire
menu hamburger
```

Navigation :

```text
Sheet
```

shadcn.

CTA connexion dans le menu mobile.

---

# 20. HEADER STICKY

Desktop :

```text
position: sticky
top: 0
z-index: 20
```

Fond :

```text
rgba(255,255,255,.92)
```

Avec :

```text
backdrop-blur
```

Ajouter une légère bordure inférieure.

Le header ne doit pas devenir visuellement lourd au scroll.

---

# 21. HERO

## Dimensions desktop

Zone :

```text
min-height: 520px
padding-top: 56px
padding-bottom: 48px
```

Grid :

```text
1fr 1fr
gap: 40px
```

---

# 22. HERO — COLONNE GAUCHE

Largeur maximale :

```text
600px
```

Ordre :

```text
Badge
↓
H1
↓
Description
↓
CTA principal + CTA secondaire
↓
Preuve sociale
```

---

# 23. HERO BADGE

Texte :

```text
Plateforme d’Orientation, de Mobilité et de Réussite Académique
```

Dimensions approximatives :

```text
height: 34px
padding-inline: 14px
```

Rayon :

```text
9999px
```

Fond :

```text
#E9F8F0
```

Texte :

```text
#16824E
```

Font :

```text
12–13px
```

---

# 24. HERO H1

Texte exact :

```text
Votre avenir académique,
notre mission.
```

Couleur :

```text
#0D2B4D
```

Le segment :

```text
notre mission.
```

est vert :

```text
#1EA362
```

Taille desktop :

```text
56px
line-height: 1.08
letter-spacing: -1.8px
```

Largeur maximale :

```text
580px
```

---

# 25. HERO DESCRIPTION

Texte :

```text
EA-POMRA accompagne les étudiants africains à chaque étape
de leur parcours : orientation, mobilité, suivi et réussite.
```

Dimensions :

```text
font-size: 17px
line-height: 28px
max-width: 570px
```

Couleur :

```text
#334155
```

Margin-top :

```text
20px
```

---

# 26. HERO CTA

Deux actions.

## CTA principal

```text
Commencer ma démarche
```

Dimensions :

```text
height: 52px
padding-inline: 24px
```

Fond :

```text
#0D2B4D
```

Rayon :

```text
12px
```

Icône :

```text
Users
18px
```

## CTA secondaire

```text
Découvrir la plateforme
```

Style :

```text
background: white
border: 1px solid #DCE2E8
```

Même hauteur.

---

# 27. HERO SOCIAL PROOF

Afficher une petite rangée de profils / avatars.

Texte :

```text
+10 000 étudiants accompagnés
dans 8 pays africains
```

Les chiffres doivent être pilotés par les données réelles lorsqu'elles seront disponibles.

Le projet est prévu pour 8 antennes nationales. fileciteturn3file2L1-L8

---

# 28. HERO — COLONNE DROITE

Zone :

```text
width: 100%
min-height: 440px
position: relative
```

L'illustration principale doit être alignée avec le centre vertical du Hero.

---

# 29. ILLUSTRATION HERO

Sujet :

```text
Jeune étudiant africain
peau foncée
cheveux courts / bouclés
expression positive
hoodie bleu
tablette en main
```

Dimensions :

```text
max-width: 520px
height: auto
```

Position :

```text
absolute
right: 0
bottom: 0
```

Ne pas couper le personnage.

---

# 30. DÉCOR HERO

Éléments :

```text
Carte stylisée de l'Afrique
bâtiment universitaire
globe / trajectoire
pin de localisation
feuillage abstrait
formes organiques pastel
```

Opacité des éléments décoratifs :

```text
0.65–0.90
```

Ils doivent rester secondaires.

---

# 31. CARTE ID-POMRA DANS LE HERO

Position :

```text
absolute
left: 0
bottom: 72px
```

Dimensions :

```text
184 × 108px
```

Fond :

```text
#FFFFFF
```

Radius :

```text
12px
```

Shadow :

```text
md
```

Contenu :

```text
ID-POMRA
CI-2024-00125
QR
Statut
En cours
```

Le code affiché dans la maquette est un exemple visuel ; en production il doit provenir des données réelles.

---

# 32. CARTE « PROCHAINE ÉTAPE »

Dimensions :

```text
186 × 88px
```

Position :

```text
left: 80px
bottom: 18px
```

Contenu :

```text
Prochaine étape
Étude OCO
En cours d'analyse
```

Utiliser un badge / icône verte.

Le parcours OCO fait partie du modèle métier EA-POMRA et peut produire un avis favorable, sous réserve ou défavorable ainsi qu'une orientation suggérée. fileciteturn3file2L18-L30

---

# 33. CARTE « ANTENNE »

Dimensions :

```text
186 × 88px
```

Position :

```text
right: 0
bottom: 18px
```

Contenu :

```text
Antenne
Côte d'Ivoire
```

Le pays est un exemple de maquette et doit être remplacé par une donnée réelle / dynamique.

---

# 34. FEATURE CARDS

Section :

```text
padding-top: 8px
padding-bottom: 40px
```

Grid :

```text
repeat(4, 1fr)
```

Gap :

```text
0
```

Les cartes sont réunies dans un grand conteneur.

---

# 35. FEATURE CONTAINER

Dimensions :

```text
min-height: 168px
```

Fond :

```text
#FFFFFF
```

Border :

```text
1px solid #E6E9EF
```

Radius :

```text
16px
```

Shadow :

```text
sm
```

---

# 36. FEATURE ITEMS

4 éléments :

### Orientation personnalisée

```text
Des conseils académiques adaptés
à votre profil et vos ambitions.
```

### Mobilité académique

```text
Étudiez dans les meilleures
universités en Afrique.
```

### Accompagnement continu

```text
Un suivi humain et digital à chaque
étape de votre parcours.
```

### Sécurité & Confiance

```text
Vos données sont protégées.
Traçabilité et transparence garanties.
```

Le contenu traduit les principes du Design System : confiance, mobilité, accompagnement et réussite.

---

# 37. FEATURE ICONS

Dimensions :

```text
48 × 48px
```

Radius :

```text
9999px
```

Utiliser :

```text
GraduationCap
Globe2
UsersRound
ShieldCheck
```

Couleurs variables :

```text
green
blue
gold
purple très léger
```

Ne pas introduire une nouvelle couleur de marque dominante.

---

# 38. FEATURE DIVIDERS

Entre les cartes :

```text
1px solid #E6E9EF
height: 72px
```

Masquer les séparateurs sur mobile.

---

# 39. STATISTICS STRIP

Fond :

```text
#0D2B4D
```

Radius :

```text
14–16px
```

Hauteur :

```text
112px
```

Container :

```text
max-width: 1280px
```

Grid :

```text
repeat(5, 1fr)
```

---

# 40. STATISTICS

Afficher :

```text
10 000+
Étudiants accompagnés

8
Antennes nationales

15 000+
Dossiers traités

98%
Taux de satisfaction

120+
Partenaires académiques
```

Ces valeurs doivent être considérées comme **contenu de maquette** jusqu'à validation par les données officielles.

Ne pas inventer de nouvelles statistiques.

---

# 41. STAT ICONS

Dimensions :

```text
44 × 44px
```

Radius :

```text
9999px
```

Icônes :

```text
GraduationCap
Globe2
Folder
CircleCheck
Users
```

Couleurs :

```text
vert
bleu
or
```

---

# 42. SECTION « COMMENT ÇA MARCHE ? »

Padding :

```text
96px 0
```

Mobile :

```text
64px 0
```

Titre :

```text
Comment ça marche ?
```

Alignement :

```text
center
```

---

# 43. SECTION HEADING

Titre :

```text
36px / 44px / 700
```

Sous-titre facultatif :

```text
18px / 28px
```

Accent sous le titre :

```text
width: 40px
height: 3px
background: #1EA362
border-radius: 9999px
margin-top: 12px
```

---

# 44. PROCESS STEPPER

4 étapes :

```text
1. Soumettez votre dossier
2. Analyse OCO
3. Suivi & Accompagnement
4. Réussite
```

Grid :

```text
repeat(4, 1fr)
```

Gap :

```text
32px
```

---

# 45. PROCESS — ÉTAPE 1

Titre :

```text
Soumettez votre dossier
```

Description :

```text
Remplissez votre candidature
en ligne et téléchargez vos documents.
```

Icône :

```text
FileText
```

---

# 46. PROCESS — ÉTAPE 2

Titre :

```text
Analyse OCO
```

Description :

```text
Nos experts évaluent votre
dossier et vous proposent
une orientation.
```

Icône :

```text
UserRoundSearch
```

---

# 47. PROCESS — ÉTAPE 3

Titre :

```text
Suivi & Accompagnement
```

Description :

```text
Bénéficiez d'un suivi personnalisé
jusqu'à votre intégration et votre réussite.
```

Icône :

```text
MapPin
```

---

# 48. PROCESS — ÉTAPE 4

Titre :

```text
Réussite
```

Description :

```text
Atteignez vos objectifs
académiques et construisez
votre avenir.
```

Icône :

```text
GraduationCap
```

---

# 49. PROCESS CONNECTORS

Desktop :

```text
height: 1px
background: #DCE5EE
```

Utiliser une flèche légère.

Ne pas utiliser une ligne très sombre.

Mobile :

```text
vertical connector
```

---

# 50. SECTION « UNE PLATEFORME POUR TOUS LES ACTEURS »

Titre :

```text
Une plateforme pour tous les acteurs
```

Grid :

```text
repeat(3, 1fr)
```

Gap :

```text
16px
```

---

# 51. ACTEUR — ÉTUDIANTS

Titre :

```text
Étudiants
```

Description :

```text
Suivez votre dossier, accédez à vos
avis, demandez un accompagnement
et restez informé.
```

CTA :

```text
Accéder à mon espace →
```

Illustration :

```text
deux étudiants africains
```

---

# 52. ACTEUR — PARENTS

Titre :

```text
Parents
```

Description :

```text
Suivez l'évolution du parcours de
votre enfant en temps réel et recevez
des rapports réguliers.
```

CTA :

```text
Accéder à l'espace parent →
```

Illustration :

```text
parent(s) africain(s)
```

---

# 53. ACTEUR — ANTENNES & BEC

Titre :

```text
Antennes & BEC
```

Description :

```text
Gérez les dossiers, validez les étapes
et suivez les statistiques de votre pays.
```

CTA :

```text
Accéder à l'espace professionnel →
```

Illustration :

```text
bâtiment institutionnel / antenne
```

Le modèle de rôles du Design System prévoit notamment Étudiant, Parent, Coordonnateur National, Trésorier National, Expert OCO, Responsable PAP et BEC/Admin. fileciteturn3file7L1-L14

---

# 54. ACTOR CARDS

Hauteur :

```text
196px
```

Radius :

```text
16px
```

Padding :

```text
24px
```

Illustration :

```text
96 × 96px
```

Le texte doit rester prioritaire.

---

# 55. SECTION PARTENAIRES

Titre :

```text
Ils nous font confiance
```

Alignement :

```text
center
```

Logo row :

```text
display: flex
align-items: center
justify-content: space-between
gap: 32px
```

Sur mobile :

```text
horizontal scroll
```

---

# 56. PARTENAIRES

La maquette peut afficher des logos de partenaires comme exemples visuels, mais la production doit utiliser uniquement les partenaires réellement confirmés.

Ne jamais inventer une relation commerciale ou institutionnelle.

---

# 57. FOOTER

Fond :

```text
#0D2B4D
```

Texte :

```text
white / white-muted
```

Padding desktop :

```text
56px 0 24px
```

---

# 58. FOOTER — COLONNES

### Colonne 1

```text
Logo
EA-POMRA
Étudier en Afrique, Réussir demain.

Plateforme d'Orientation, de Mobilité et
de Réussite Académique au service des
étudiants et des familles africaines.
```

### Colonne 2

```text
Plateforme

À propos
Programmes
Antennes
Actualités
Contact
```

### Colonne 3

```text
Ressources

Guide étudiant
FAQ
Documents utiles
Blog
Support
```

### Colonne 4

```text
Espace

Étudiant
Parent
Professionnel
BEC / Administration
```

---

# 59. NEWSLETTER

Titre :

```text
Restez informé
```

Texte :

```text
Recevez nos actualités et conseils directement
dans votre boîte mail.
```

Input :

```text
Votre adresse email
```

Bouton :

```text
S'inscrire
```

Input height :

```text
48px
```

Button height :

```text
48px
```

Sur mobile :

```text
stack
```

---

# 60. FOOTER BOTTOM

Afficher :

```text
© EA-POMRA. Tous droits réservés.
```

Liens :

```text
Mentions légales
Politique de confidentialité
Conditions d'utilisation
```

Border-top :

```text
1px solid rgba(255,255,255,.12)
```

---

# 61. RESPONSIVE — DESKTOP ≥ 1280

Header :

```text
88px
```

Hero :

```text
2 colonnes
```

Features :

```text
4 colonnes
```

Stats :

```text
5 colonnes
```

Process :

```text
4 colonnes
```

Actors :

```text
3 colonnes
```

---

# 62. RESPONSIVE — 1024–1279

Header :

```text
76px
```

Hero :

```text
grid 1fr 1fr
gap: 24px
```

H1 :

```text
46px
```

Features :

```text
2 × 2
```

Stats :

```text
3 + 2
```

Actors :

```text
3 colonnes
```

---

# 63. RESPONSIVE — TABLET 768–1023

Header :

```text
68px
```

Navigation desktop :

```text
cachée
```

Menu :

```text
Sheet
```

Hero :

```text
1 colonne
```

Ordre :

```text
texte
↓
CTA
↓
illustration
```

Features :

```text
2 colonnes
```

Stats :

```text
2 colonnes
```

Process :

```text
2 colonnes
```

Actors :

```text
1 colonne
```

---

# 64. RESPONSIVE — MOBILE < 768

Container :

```text
padding-inline: 16px
```

Hero :

```text
padding-top: 28px
padding-bottom: 32px
```

H1 :

```text
34–38px
line-height: 42–46px
```

CTA :

```text
width: 100%
```

Les deux boutons doivent être empilés si nécessaire.

Illustration :

```text
max-width: 340px
margin-inline: auto
```

---

# 65. MOBILE — HERO

Ordre :

```text
Badge
H1
Description
CTA principal
CTA secondaire
preuve sociale
illustration
```

Les cartes flottantes de l'illustration doivent être simplifiées ou repositionnées pour éviter tout débordement.

Ne jamais laisser une carte dépasser horizontalement du viewport.

---

# 66. MOBILE — FEATURES

```text
1 colonne
```

Chaque feature :

```text
padding: 20px
min-height: 140px
```

Masquer les séparateurs verticaux.

---

# 67. MOBILE — STATS

```text
2 colonnes
```

Chaque bloc :

```text
padding: 16px
min-height: 100px
```

À 360px, si le contenu devient trop serré :

```text
1 colonne
```

---

# 68. MOBILE — PROCESS

Utiliser une timeline verticale :

```text
● Soumettez votre dossier
│
● Analyse OCO
│
● Suivi & Accompagnement
│
● Réussite
```

---

# 69. MOBILE — PARTENAIRES

Utiliser :

```text
horizontal scroll
```

Ne pas réduire les logos à une taille illisible.

---

# 70. MOBILE — FOOTER

Colonnes :

```text
1 colonne
```

Sections repliables possibles avec `Accordion`.

Le logo reste visible.

Newsletter :

```text
input
↓
button
```

---

# 71. COMPOSANTS SHADCN À UTILISER

Réutiliser les composants existants.

```text
Button
Badge
Card
Avatar
Sheet
DropdownMenu
Accordion
Input
Separator
Tooltip
Skeleton
Alert
Sonner
```

Ne pas créer une implémentation maison lorsqu'un composant shadcn répond déjà au besoin.

---

# 72. COMPOSANTS EA-POMRA À CRÉER

```text
components/
  home/
    HomeHeader.tsx
    HeroSection.tsx
    HeroIllustration.tsx
    FeatureGrid.tsx
    FeatureCard.tsx
    StatisticsStrip.tsx
    HowItWorks.tsx
    ProcessStep.tsx
    AudienceSection.tsx
    AudienceCard.tsx
    PartnersSection.tsx
    NewsletterCard.tsx
    HomeFooter.tsx
```

---

# 73. ARCHITECTURE DE PAGE

```text
app/
  page.tsx

components/
  home/
  layout/
  ui/

data/
  home.ts
  partners.ts
  navigation.ts
```

Centraliser les contenus de la Home dans des fichiers de données lorsque cela facilite leur maintenance.

---

# 74. DONNÉES DE NAVIGATION

```ts
const navigation = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  { label: "Programmes", href: "/programmes" },
  { label: "Antennes", href: "/antennes" },
  { label: "Ressources", href: "/ressources" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" },
]
```

Avant création, vérifier les routes existantes.

Ne pas créer de liens morts.

---

# 75. ANIMATIONS — PRINCIPES

Les animations doivent rester discrètes.

Le Design System impose des animations légères et un état de feedback clair. fileciteturn3file1L1-L24

Utiliser Framer Motion.

---

# 76. ANIMATION HERO

Entrée :

```text
opacity: 0 → 1
y: 16 → 0
duration: 500ms
easeOut
```

Ordre :

```text
badge
h1
description
buttons
social proof
```

Stagger :

```text
70ms
```

---

# 77. ANIMATION HERO ILLUSTRATION

```text
opacity: 0 → 1
scale: .96 → 1
duration: 650ms
easeOut
```

Les éléments décoratifs peuvent avoir une légère translation de :

```text
4–8px
```

mais aucune animation infinie obligatoire.

---

# 78. ANIMATION FEATURE CARDS

Au scroll :

```text
opacity 0 → 1
y 18 → 0
duration 350ms
```

Stagger :

```text
60ms
```

---

# 79. ANIMATION BUTTONS

Hover :

```text
translateY(-1px)
duration: 150ms
```

Press :

```text
scale(.98)
duration: 100ms
```

Ne pas faire rebondir les boutons.

---

# 80. ANIMATION STATS

Les chiffres peuvent apparaître progressivement.

Éviter un compteur qui monopolise l'attention.

Durée maximale :

```text
800ms
```

---

# 81. REDUCED MOTION

Obligatoire :

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

# 82. IMAGES

Utiliser :

```text
next/image
```

Pour les illustrations :

```text
priority uniquement pour l'image Hero principale
loading="lazy" pour les images sous la ligne de flottaison
```

Formats préférés :

```text
WebP
AVIF
SVG pour icônes / logos vectoriels
```

---

# 83. LOGO

Utiliser le logo EA-POMRA officiel fourni dans les sources du projet.

Ne pas :

```text
déformer
recadrer
modifier les couleurs
ajouter une ombre lourde
```

Prévoir suffisamment d'espace autour du logo.

Le Design System exige le respect des proportions, de la lisibilité et de la zone de respiration du logo. fileciteturn3file6L18-L38

---

# 84. ILLUSTRATIONS

Direction :

```text
contemporaine
africaine
humaine
positive
inclusive
professionnelle
soft
```

Thèmes autorisés :

```text
étudiant africain
université
livre
diplôme
globe
mobilité
orientation
accompagnement
famille
technologie
```

Le Design System définit explicitement ces thèmes et interdit une direction trop enfantine ou caricaturale. fileciteturn3file7L15-L30

---

# 85. ACCESSIBILITÉ

Respecter :

```text
WCAG-friendly
```

Minimum :

- contraste lisible ;
- focus visible ;
- navigation clavier ;
- `aria-label` sur les icônes seules ;
- alt text ;
- boutons avec états ;
- pas d'information transmise uniquement par la couleur ;
- zones tactiles >= 44px.

---

# 86. SEO

La Home doit avoir :

```text
1 seul H1
H2 pour chaque grande section
H3 pour les sous-sections
```

Meta title recommandé :

```text
EA-POMRA — Orientation, Mobilité et Réussite Académique en Afrique
```

Meta description :

```text
EA-POMRA accompagne les étudiants africains dans leur orientation,
leur mobilité académique et leur réussite, de la candidature au suivi.
```

Adapter si une formulation officielle existe déjà.

---

# 87. PERFORMANCE

La page publique doit être conçue pour les connexions lentes.

Priorités :

```text
SSR
images optimisées
CSS minimal
lazy loading
pas de vidéo autoplay
pas de gros background vidéo
pas d'animations lourdes
```

Le plan d'implémentation recommande explicitement SSR, formulaires courts et prise en compte des contraintes de connectivité. fileciteturn3file2L72-L79

---

# 88. SÉCURITÉ

La Home est publique.

Ne jamais exposer :

```text
JWT
secrets
clés API privées
données étudiants
fiches PAP
données financières
```

Les CTA doivent simplement rediriger vers les espaces sécurisés.

---

# 89. CONTENU DYNAMIQUE

Les éléments suivants doivent pouvoir devenir dynamiques :

```text
statistiques
partenaires
actualités
antennes
programmes
témoignages
```

Ne pas coupler la présentation à des données hardcodées si le backend existe déjà.

---

# 90. ÉTATS DE CHARGEMENT

Pour les sections dynamiques :

```text
Skeleton
```

Exemple :

```text
PartnerLogoSkeleton
NewsCardSkeleton
StatsSkeleton
```

Ne jamais afficher une page entièrement vide.

---

# 91. ÉTAT EMPTY

Exemple actualités :

```text
Aucune actualité disponible pour le moment.
```

Ne pas afficher d'espace vide sans explication.

---

# 92. ÉTAT ERREUR

Exemple :

```text
Impossible de charger les actualités.

[Réessayer]
```

Ne jamais afficher les erreurs internes.

---

# 93. CTA ET CONVERSION

CTA principaux :

```text
Commencer ma démarche
Se connecter
Découvrir la plateforme
Accéder à mon espace
```

Une section ne doit pas avoir 4 CTA concurrents.

Le CTA principal doit être visuellement dominant.

---

# 94. RÈGLE DE COPYWRITING

Le ton doit être :

```text
humain
professionnel
rassurant
direct
accessible
```

Éviter les phrases administratives complexes.

Préférer :

```text
Votre dossier est en cours d'étude.
```

à :

```text
Le traitement administratif relatif à votre dossier
est actuellement en phase d'instruction.
```

Cette règle reprend directement le principe rédactionnel du Design System.

---

# 95. NE PAS FAIRE

Interdictions visuelles :

```text
❌ gradients excessifs
❌ glassmorphism omniprésent
❌ néons
❌ ombres fortes
❌ trop de doré
❌ animations permanentes
❌ illustrations enfantines
❌ surcharge de cartes
❌ texte trop petit
❌ carousel automatique agressif
❌ vidéos autoplay
❌ couleurs hors palette sans justification
```

---

# 96. CHECKLIST DESKTOP

```text
[ ] Logo correct
[ ] Header 88px
[ ] Navigation alignée
[ ] CTA connexion
[ ] Hero 2 colonnes
[ ] H1 correct
[ ] Hero illustration non coupée
[ ] ID-POMRA visible
[ ] Feature cards 4 colonnes
[ ] Statistics 5 colonnes
[ ] Process 4 étapes
[ ] Actors 3 cartes
[ ] Partenaires
[ ] Footer
```

---

# 97. CHECKLIST MOBILE

```text
[ ] Header 68px
[ ] Menu Sheet
[ ] H1 lisible
[ ] CTA full width
[ ] Illustration non coupée
[ ] Aucun overflow horizontal
[ ] Feature cards empilées
[ ] Stats 2 colonnes
[ ] Process vertical
[ ] Actors 1 colonne
[ ] Logos partenaires scrollables
[ ] Footer 1 colonne
[ ] Newsletter adaptée
```

---

# 98. PROMPT OPENCODE — IMPLÉMENTATION

## PROMPT À COPIER DANS OPENCODE

Tu es un développeur frontend senior spécialisé en Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion et UX SaaS.

Tu dois implémenter la **Home Page publique EA-POMRA** en respectant STRICTEMENT :

```text
SPEC_HOME_PAGE.md
EA-POMRA_Design_System.md
Plan_Implementation_EA-POMRA.md
```

### CONTEXTE

EA-POMRA signifie :

**Étudiant en Afrique — Plateforme d'Orientation, de Mobilité et de Réussite Académique.**

La plateforme digitalise le parcours :

```text
Candidature
→ Orientation
→ Mobilité
→ Suivi
→ Réussite
```

Elle doit servir plusieurs acteurs :

```text
Étudiant
Parent
Antenne
BEC / Administration
```

Le projet est multi-antennes et le plan prévoit 8 antennes nationales.

---

## RÈGLE N°1 — INSPECTER AVANT DE CODER

Avant toute modification :

1. inspecte l'arborescence ;
2. inspecte `package.json` ;
3. identifie la version de Next.js ;
4. identifie Tailwind ;
5. identifie shadcn ;
6. identifie Framer Motion ;
7. identifie les routes existantes ;
8. identifie les composants existants ;
9. identifie les tokens existants ;
10. identifie les assets EA-POMRA ;
11. identifie le logo officiel ;
12. vérifie si une Home existe déjà.

**Ne réécris jamais inutilement l'architecture.**

**Réutilise les composants existants.**

---

## RÈGLE N°2 — NE PAS INVENTER

Ne pas inventer :

- partenaires ;
- chiffres officiels ;
- programmes ;
- pays supplémentaires ;
- témoignages ;
- prix ;
- coordonnées ;
- routes ;
- données utilisateurs.

Les chiffres présents dans la maquette tels que `10 000+`, `15 000+`, `98%` et `120+` sont des contenus de design à considérer comme exemples jusqu'à validation des données officielles.

---

## RÈGLE N°3 — DESIGN

Respecte exactement :

```text
Navy    #0D2B4D
Primary #174A7C
Green   #1EA362
Gold    #C89C2E

Background #F7F9FB
White      #FFFFFF
Text       #1F2937
Muted      #A2AAB3
Border     #E6E9EF
```

Police :

```text
Plus Jakarta Sans
```

Style :

```text
professionnel
soft
moderne
humain
africain
institutionnel
```

---

## RÈGLE N°4 — STRUCTURE

Implémente exactement :

```text
Header
Hero
Features
Statistics
Comment ça marche ?
Acteurs
Partenaires
Footer
```

---

## RÈGLE N°5 — HERO

Utiliser :

```text
Votre avenir académique,
notre mission.
```

`Votre avenir académique,` :

```text
#0D2B4D
```

`notre mission.` :

```text
#1EA362
```

Badge :

```text
Plateforme d’Orientation, de Mobilité et de Réussite Académique
```

Description :

```text
EA-POMRA accompagne les étudiants africains à chaque étape
de leur parcours : orientation, mobilité, suivi et réussite.
```

CTA :

```text
Commencer ma démarche
Découvrir la plateforme
```

---

## RÈGLE N°6 — ILLUSTRATION

Utiliser le logo EA-POMRA officiel fourni dans le projet.

Créer / intégrer une illustration Hero avec :

```text
étudiant africain
tablette
hoodie bleu
carte Afrique
université
globe
pin
feuillage
cartes ID-POMRA
```

L'illustration ne doit jamais être coupée.

Sur mobile, repositionner tous les éléments.

---

## RÈGLE N°7 — COMPOSANTS

Créer si nécessaire :

```text
HomeHeader
HeroSection
HeroIllustration
FeatureGrid
FeatureCard
StatisticsStrip
HowItWorks
ProcessStep
AudienceSection
AudienceCard
PartnersSection
NewsletterCard
HomeFooter
```

Utiliser shadcn/ui pour les primitives.

---

## RÈGLE N°8 — RESPONSIVE

Tester obligatoirement :

```text
360px
390px
414px
768px
1024px
1280px
1440px
1536px
```

À aucun moment :

```text
horizontal overflow
texte coupé
image coupée
CTA inaccessible
menu impossible à fermer
```

---

## RÈGLE N°9 — ANIMATIONS

Utiliser Framer Motion.

Animations :

```text
Hero fade + slide : 500ms
Cards : 350ms
Hover : 150ms
Press : 100ms
Stats : max 800ms
```

Respecter :

```text
prefers-reduced-motion
```

Aucune animation infinie obligatoire.

---

## RÈGLE N°10 — PERFORMANCE

Le site public doit être performant sur des connexions lentes.

Utiliser :

```text
SSR
next/image
lazy loading
SVG
WebP/AVIF
```

Ne pas utiliser :

```text
video background
autoplay lourd
gros bundle inutile
animation CPU intensive
```

---

## RÈGLE N°11 — ACCESSIBILITÉ

Respecter :

```text
focus visible
keyboard navigation
alt text
aria-label
contraste
touch targets >= 44px
```

Ne jamais communiquer une information uniquement par une couleur.

---

## RÈGLE N°12 — SEO

Une seule balise :

```text
H1
```

Utiliser :

```text
H2
H3
```

pour la hiérarchie.

Ajouter les metadata de la Home.

---

## RÈGLE N°13 — VALIDATION

À la fin :

```bash
npm run lint
npm run build
```

ou les commandes équivalentes du projet.

Puis vérifier visuellement :

```text
Desktop 1440
Laptop 1280
Tablet 768
Mobile 414
Mobile 390
Mobile 360
```

Corriger tous les problèmes de responsive.

---

## DEFINITION OF DONE

La Home est terminée uniquement si :

```text
✓ Design System respecté
✓ Logo officiel utilisé
✓ Hero conforme
✓ Navigation fonctionnelle
✓ CTA fonctionnels
✓ Sections complètes
✓ Responsive
✓ Accessible
✓ SEO correct
✓ Animations discrètes
✓ Reduced motion
✓ Images optimisées
✓ Aucun overflow
✓ Aucun texte coupé
✓ Aucun lien mort
✓ Aucun secret exposé
✓ npm run lint OK
✓ npm run build OK
```

**Priorité absolue : produire une Home Page qui donne immédiatement une impression de confiance, de modernité, d'accompagnement humain et d'ambition panafricaine, sans devenir visuellement chargée.**
