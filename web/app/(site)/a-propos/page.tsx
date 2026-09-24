import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PillarsGrid } from "@/components/site/PillarsGrid";
import { CtaBand } from "@/components/site/CtaBand";
import { ANTENNES_EA_POMRA, KEY_METRICS } from "@/lib/data";
import { ShieldCheck, Eye, MapPin, Users } from "lucide-react";

import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "À propos",
  "EA-POMRA accompagne les étudiants africains dans leur mobilité académique : orientation, aperçu du transfert de scolarité (STSS) et suivi psychosocial."
);

const ENGAGEMENTS = [
  {
    icon: ShieldCheck,
    title: "Simulation des frais",
    text: "Le site présente un scénario de frais, d'antenne de départ et d'établissement d'accueil, sans mouvement financier ni quittance.",
  },
  {
    icon: Eye,
    title: "Traçabilité totale",
    text: "Chaque étape du parcours est horodatée et consultable par l'étudiant, sa famille et l'établissement d'accueil.",
  },
  {
    icon: Users,
    title: "Proximité humaine",
    text: "Un référent local, un canal d'écoute confidentiel et un parrainage par des aînés dès l'arrivée sur le campus.",
  },
  {
    icon: MapPin,
    title: "Ancrage panafricain",
    text: "Huit antennes nationales dirigées par des équipes locales, au plus près des familles et des universités.",
  },
];

export default function AProposPage() {
  return (
    <>
      <PageHeader
        eyebrow="À propos"
        breadcrumb="À propos"
        title="Une association panafricaine au service des talents du continent"
         description="EA-POMRA — Étudier en Afrique — accompagne les étudiants africains dans leur parcours de mobilité académique : orientation, aperçu du transfert de scolarité (STSS), suivi psychosocial et lien de confiance entre l'étudiant, sa famille et l'institution d'accueil."
      />

      {/* Mission */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-6 space-y-5">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B4D] tracking-tight">
                Notre mission
              </h2>
              <p className="text-sm sm:text-base text-[#5B6776] leading-relaxed">
                Étudier loin de chez soi ne doit jamais rimer avec solitude ni avec prise de risque
                 financière. Le dispositif STSS présente un aperçu de la mobilité étudiante de l&apos;inscription jusqu&apos;au diplôme,
                en reliant les huit pays d&apos;Afrique de l&apos;Ouest et du Centre où nous sommes présents.
              </p>
              <p className="text-sm sm:text-base text-[#5B6776] leading-relaxed">
                Notre approche repose sur quatre piliers complémentaires : l&apos;orientation personnalisée,
                 l&apos;aperçu du transfert de scolarité (STSS), l&apos;accompagnement psychosocial et le suivi continu
                jusqu&apos;à l&apos;obtention du diplôme.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {KEY_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-[#F7F9FB] rounded-2xl border border-[#E6E9EF] p-5 space-y-1"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E9BAA]">
                    {metric.label}
                  </span>
                  <div className="text-2xl font-black text-[#0D2B4D]">{metric.value}</div>
                  <p className="text-[11px] text-[#5B6776] leading-snug">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Piliers */}
      <section className="py-16 sm:py-20 bg-[#F7F9FB] border-y border-[#E6E9EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B4D] tracking-tight">
               Les quatre piliers de l&apos;accompagnement
            </h2>
            <p className="text-sm sm:text-base text-[#5B6776] leading-relaxed">
               Chaque pilier répond à une inquiétude concrète des familles : choisir sa filière,
                sans action financière, ne pas rester seul, et réussir jusqu&apos;au diplôme.
            </p>
          </div>

          <PillarsGrid />
        </div>
      </section>

      {/* Réseau */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B4D] tracking-tight">
              Huit antennes nationales interconnectées
            </h2>
            <p className="text-sm sm:text-base text-[#5B6776] leading-relaxed">
               Chaque antenne dispose d&apos;une équipe locale chargée de la réception des familles, de la
               certification des pièces originales et de la relation avec les universités d&apos;accueil.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ANTENNES_EA_POMRA.map((antenne) => (
              <div
                key={antenne.id}
                className="bg-white rounded-2xl border border-[#E6E9EF] shadow-eap-soft p-5 space-y-3 transition-all duration-300 hover:shadow-eap-card"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{antenne.flag}</span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#0D2B4D] truncate">{antenne.country}</h3>
                    <p className="text-[11px] text-[#8E9BAA] truncate">{antenne.city}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#EDF1F6] flex items-center justify-between text-[11px]">
                  <span className="text-[#5B6776]">
                    <strong className="text-[#0D2B4D]">{antenne.partnersCount}</strong> universités
                  </span>
                  <span className="text-[#5B6776]">
                    <strong className="text-[#1EA362]">{antenne.studentsCount}</strong> étudiants
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-16 sm:py-20 bg-[#F7F9FB] border-t border-[#E6E9EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B4D] tracking-tight mb-12">
            Nos engagements
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ENGAGEMENTS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-2xl border border-[#E6E9EF] p-6 space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-[#E8F6EF] text-[#1EA362] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0D2B4D]">{item.title}</h3>
                  <p className="text-xs text-[#5B6776] leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand
        title="Vous préparez une mobilité académique ?"
        description="Créez votre dossier en ligne, échangez avec votre antenne locale et suivez chaque étape depuis votre espace personnel."
      />
    </>
  );
}
