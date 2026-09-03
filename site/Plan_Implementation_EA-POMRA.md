# Plan d'implémentation — Plateforme web EA-POMRA

## 0. Résumé

EA-POMRA (Étudiant en Afrique — Plateforme d'Orientation, de Mobilité et de Réussite Académique) devient une web app sur mesure, multi-portails, couvrant 8 antennes nationales. Ce plan découpe le projet en phases livrables, avec pour chacune : objectif, périmètre technique, livrables et durée indicative.

**Approche générale** : développement itératif, chaque phase livre un incrément utilisable, testé avec de vrais utilisateurs (une antenne pilote) avant généralisation aux 8 pays.

---

## 1. Objectifs du projet

- Digitaliser le parcours candidat → orientation → mobilité → suivi → diplôme
- Donner à chaque acteur (étudiant, parent, antenne, BEC) une vue en temps réel de ce qui le concerne
- Sécuriser et tracer les transferts de scolarité (STSS)
- Préserver la confidentialité (identification par code ID-POMRA plutôt que par nom sur les canaux partagés)
- Poser les bases d'une couche IA (orientation, anti-fraude, écoute) sans bloquer le lancement du cœur métier

---

## 2. Architecture technique retenue

| Couche | Choix | Justification |
|---|---|---|
| Frontend | Next.js (React) + Tailwind CSS | SSR pour le site public, bon comportement sur connexions lentes, SPA pour les portails |
| Backend | NestJS (Node.js) *ou* Django (Python) | Gestion de rôles multiples, workflows de validation, admin auto-généré (Django) utile en phase 1 |
| Base de données | PostgreSQL | Relationnel, garanties transactionnelles nécessaires pour STSS |
| Auth | JWT + RBAC | Étudiant, Parent, Coordonnateur National, Trésorier National, Expert OCO, Responsable PAP, BEC/Admin |
| Paiements | API Mobile Money par pays (Airtel Money, Moov Money, à étendre) | Module isolé avec journal d'audit immuable |
| Notifications | WhatsApp Business API + email | Canal principal identifié dans le dossier fondateur |
| Hébergement | VPS/cloud à faible latence Afrique de l'Ouest/Centrale (OVH ou AWS Europe) | À arbitrer selon budget |

---

## 3. Modèle de données (vue d'ensemble)

Entités centrales à figer avant tout développement :

- **Utilisateur** (rôle, pays, antenne de rattachement)
- **Étudiant** ↔ **Parent** (relation 1-N ou N-N selon les cas de tuteurs multiples)
- **Antenne** (pays, coordonnateur, trésorier)
- **Dossier** (statut OCO, code ID-POMRA, pièces jointes)
- **Avis OCO** (favorable / sous réserve / défavorable, orientation suggérée)
- **Fiche PAP** (confidentielle, liée au Dossier, accès restreint au rôle PAP)
- **Transaction STSS** (montant, antenne source, antenne destination, preuve, commission, statut)
- **Rapport trimestriel** (généré, par antenne ou par étudiant)

> Cette étape (schéma relationnel détaillé, contraintes, migrations) doit être validée avant le début du développement — c'est la fondation dont dépendent presque tous les modules.

---

## 4. Phases d'implémentation

### Phase 0 — Cadrage (2 semaines)
- Validation du schéma de données définitif
- Choix définitif du stack (NestJS vs Django)
- Définition des maquettes UI/UX pour les 7 rôles (au moins les écrans clés)
- Choix de l'hébergeur et de l'opérateur Mobile Money pilote
- **Livrable** : cahier technique + maquettes validées

### Phase 1 — Fondations (3-4 semaines)
- Mise en place du repo, CI/CD, environnements (dev/staging/prod)
- Modèle de données + migrations
- Authentification par rôle (JWT + RBAC)
- Génération automatique du code ID-POMRA
- **Livrable** : socle technique fonctionnel, sans interface finale

### Phase 2 — Formulaires digitalisés (3 semaines)
- Formulaire 1 (candidature étudiant)
- Formulaire 2 (engagement parental)
- Formulaire 3 (fiche PAP confidentielle, accès restreint)
- Upload et stockage sécurisé des pièces jointes (diplômes, justificatifs)
- **Livrable** : les 3 formulaires remplaçant le papier, testés sur l'antenne pilote

### Phase 3 — Portails Étudiant et Parent (4 semaines)
- Portail Étudiant : statut du dossier, code ID-POMRA, demande PAP
- Portail Parent : suivi temps réel, rapports trimestriels, historique STSS
- Notifications WhatsApp/email aux étapes clés
- **Livrable** : portails utilisables en conditions réelles par les familles

### Phase 4 — Back-offices Antenne et BEC (4 semaines)
- Back-office Antenne : registre chronologique, gestion des dossiers du pays, rapport trimestriel
- Back-office BEC : vue consolidée des 8 pays, validation finale, statistiques globales
- File de traitement Expert OCO (avis technique, orientation)
- Espace Responsable PAP (alertes, mentorat, historique)
- **Livrable** : chaîne complète de traitement d'un dossier, de bout en bout

### Phase 5 — Module STSS (4-5 semaines, en parallèle possible avec Phase 4)
- Intégration API Mobile Money (pays pilote d'abord)
- Dépôt, transfert inter-antennes, preuve de paiement scannée
- Journal d'audit immuable, calcul de commission (1-3%)
- Conformité KYC/AML de base
- **Livrable** : premier transfert réel sécurisé, testé avec le Trésorier National pilote

### Phase 6 — Généralisation aux 8 antennes (3-4 semaines)
- Déploiement progressif pays par pays
- Formation des Coordonnateurs et Trésoriers Nationaux
- Migration des dossiers existants (papier → plateforme)
- **Livrable** : les 8 antennes opérationnelles sur la plateforme

### Phase 7 — Couche IA (phase ultérieure, non bloquante pour le lancement)
- Chatbot d'orientation (WhatsApp ou widget web)
- OCR de vérification des diplômes
- Agent d'écoute PAP avec détection de mots-clés de détresse
- Génération automatique des synthèses parentales trimestrielles
- **Livrable** : premières fonctionnalités IA en test sur un périmètre restreint

---

## 5. Estimation globale

| Phase | Durée indicative |
|---|---|
| 0. Cadrage | 2 semaines |
| 1. Fondations | 3-4 semaines |
| 2. Formulaires | 3 semaines |
| 3. Portails Étudiant/Parent | 4 semaines |
| 4. Back-offices Antenne/BEC | 4 semaines |
| 5. Module STSS | 4-5 semaines |
| 6. Généralisation 8 pays | 3-4 semaines |
| **Total avant IA** | **≈ 6-7 mois** |
| 7. Couche IA | phase ultérieure, à budgétiser séparément |

---

## 6. Équipe nécessaire (indicatif)

- 1 chef de projet / product owner (peut être Marc)
- 1-2 développeurs backend (NestJS/Django + PostgreSQL)
- 1 développeur frontend (Next.js)
- 1 designer UI/UX (maquettes des 7 portails)
- 1 intégrateur Mobile Money / conformité pour le module STSS (peut être un consultant ponctuel)
- Référents métier côté EA-POMRA (BEC, un Coordonnateur pilote) pour la validation fonctionnelle

---

## 7. Risques identifiés et mitigations

| Risque | Mitigation |
|---|---|
| Le module STSS prend du retard (complexité réglementaire) | Le découpler du reste : lancer les portails et formulaires sans attendre STSS |
| Connectivité faible dans certains pays | Prioriser le SSR (Next.js), formulaires courts, mode dégradé WhatsApp |
| Adoption faible côté antennes | Impliquer un Coordonnateur pilote dès la Phase 0, former avant généralisation |
| Confidentialité des fiches PAP | RBAC strict dès la Phase 1, jamais de nom affiché hors du rôle autorisé |
| Dérive de périmètre vers l'IA trop tôt | Phase 7 explicitement mise après la généralisation aux 8 pays |

---

## 8. Prochaines étapes immédiates

1. Valider le schéma de données détaillé (ERD)
2. Trancher NestJS vs Django
3. Choisir l'antenne pilote pour les tests Phases 2-5
4. Lancer les maquettes UI/UX des écrans prioritaires (Formulaire 1, Portail Étudiant, Portail Parent)
