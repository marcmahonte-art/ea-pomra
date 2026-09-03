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

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Design System** : Palette EA-POMRA (`#0D2B4D`, `#174A7C`, `#1EA362`, `#C89C2E`, `#F7F9FB`)
- **Iconographie** : [Lucide React](https://lucide.dev/)

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v18+)
- npm ou yarn

### Installation & Lancement

```bash
# Aller dans le répertoire web
cd web

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000` (ou `http://localhost:3001`).

- **Site Vitrine Public** : `http://localhost:3000/`
- **Dashboard Étudiant (ID-POMRA)** : `http://localhost:3000/etudiant/dashboard`

---

## 📁 Architecture du Projet

```text
├── site/               # Spécifications fonctionnelles, Design System et maquettes UI/UX
├── web/                # Application web Next.js
│   ├── app/            # Routes App Router (Accueil, Dashboard Étudiant)
│   ├── components/     # Composants modulaires (Hero, Piliers, Acteurs, Dashboard)
│   ├── lib/            # Types TypeScript, Store de données mockées & utilitaires
│   └── public/         # Assets graphiques, logos officiels et illustrations
├── .gitignore          # Fichiers exclus du versionnement
└── README.md           # Documentation générale
```

---

## 📄 Licence & Propriété

Tous droits réservés © 2024 - 2026 **EA-POMRA**. Plateforme d'Orientation, de Mobilité et de Réussite Académique.
