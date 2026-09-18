import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PillarsGrid } from "@/components/site/PillarsGrid";
import { CtaBand } from "@/components/site/CtaBand";
import {
  GraduationCap,
  BookOpen,
  Microscope,
  Cpu,
  Briefcase,
  Stethoscope,
  Scale,
  Sprout,
  FileText,
  Compass,
  ShieldCheck,
  Plane,
} from "lucide-react";

import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Programmes",
  "Quatre piliers complémentaires, trois niveaux d'études et un processus d'admission en quatre étapes pour sécuriser chaque parcours de mobilité académique."
);

const NIVEAUX = [
  {
    icon: BookOpen,
    titre: "Licence",
    texte:
      "Premier cycle universitaire. Accompagnement du choix de filière, de la candidature et de l'installation sur le campus d'accueil.",
  },
  {
    icon: GraduationCap,
    titre: "Master",
    texte:
      "Second cycle et spécialisation. Analyse d'adéquation du projet professionnel avec les débouchés réels du marché africain.",
  },
  {
    icon: Microscope,
    titre: "Doctorat & recherche",
    texte:
      "Accompagnement des profils de recherche : identification des laboratoires, mise en relation et suivi administratif.",
  },
];

const DOMAINES = [
  { icon: Cpu, nom: "Informatique & Numérique" },
  { icon: Briefcase, nom: "Commerce & Gestion" },
  { icon: Stethoscope, nom: "Médecine & Santé" },
  { icon: Scale, nom: "Droit & Sciences politiques" },
  { icon: Sprout, nom: "Agronomie & Environnement" },
  { icon: Microscope, nom: "Sciences & Ingénierie" },
];

const ETAPES = [
  {
    icon: FileText,
    titre: "1. Dépôt du dossier",
    texte:
      "Création du dossier en ligne et téléversement des pièces académiques auprès de l'antenne de départ.",
  },
  {
    icon: Compass,
    titre: "2. Avis d'orientation (OCO)",
    texte:
      "Analyse du profil par le comité d'experts et délivrance d'un avis d'orientation argumenté.",
  },
  {
    icon: ShieldCheck,
    titre: "3. Sécurisation STSS",
    texte:
      "Dépôt des frais de scolarité en monnaie locale et transfert certifié vers l'établissement d'accueil.",
  },
  {
    icon: Plane,
    titre: "4. Mobilité & accueil (PAP)",
    texte:
      "Prise en charge à l'arrivée, installation, parrainage par un aîné et suivi psychosocial continu.",
  },
];

export default function ProgrammesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Programmes"
        breadcrumb="Programmes"
        title="Un accompagnement structuré, de l'orientation au diplôme"
        description="Quatre piliers complémentaires, trois niveaux d'études et un processus d'admission en quatre étapes pour sécuriser chaque parcours de mobilité académique."
      />

      {/* Piliers détaillés */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B4D] tracking-tight">
              Les quatre piliers
            </h2>
            <p className="text-sm sm:text-base text-[#5B6776] leading-relaxed">
              Chaque pilier est opéré par un pôle dédié et activé au moment opportun du parcours.
            </p>
          </div>

          <PillarsGrid detailed />
        </div>
      </section>

      {/* Niveaux */}
      <section className="py-16 sm:py-20 bg-[#F7F9FB] border-y border-[#E6E9EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B4D] tracking-tight mb-12">
            Niveaux d'études accompagnés
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NIVEAUX.map((niveau) => {
              const Icon = niveau.icon;
              return (
                <div key={niveau.titre} className="bg-white rounded-3xl border border-[#E6E9EF] p-6 sm:p-8 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF3FA] text-[#174A7C] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0D2B4D]">{niveau.titre}</h3>
                  <p className="text-sm text-[#5B6776] leading-relaxed">{niveau.texte}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Domaines */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-10 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B4D] tracking-tight">
              Exemples de filières accompagnées
            </h2>
            <p className="text-sm sm:text-base text-[#5B6776] leading-relaxed">
              Liste indicative. L'avis d'orientation du pôle OCO détermine la filière réellement
              adaptée à chaque profil et aux débouchés du marché.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {DOMAINES.map((domaine) => {
              const Icon = domaine.icon;
              return (
                <div
                  key={domaine.nom}
                  className="bg-[#F7F9FB] rounded-2xl border border-[#E6E9EF] p-5 flex flex-col items-center text-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E6E9EF] text-[#174A7C] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-[#0D2B4D] leading-snug">
                    {domaine.nom}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-16 sm:py-20 bg-[#F7F9FB] border-t border-[#E6E9EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B4D] tracking-tight mb-12">
            Le processus d'admission en quatre étapes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ETAPES.map((etape) => {
              const Icon = etape.icon;
              return (
                <div key={etape.titre} className="bg-white rounded-2xl border border-[#E6E9EF] p-6 space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-[#E8F6EF] text-[#1EA362] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0D2B4D]">{etape.titre}</h3>
                  <p className="text-xs text-[#5B6776] leading-relaxed">{etape.texte}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand
        title="Prêt à construire votre projet académique ?"
        description="Déposez votre dossier auprès de votre antenne nationale et recevez un avis d'orientation sous 72 heures."
      />
    </>
  );
}
