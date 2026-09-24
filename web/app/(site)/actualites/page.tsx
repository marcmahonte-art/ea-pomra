import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { CalendarDays, ArrowRight } from "lucide-react";

import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Actualités",
  "Ouvertures d'antennes, avancées du dispositif STSS, nouveaux partenariats et informations de rentrée du réseau EA-POMRA."
);

const UNE = {
  categorie: "Mobilité",
  date: "10 Septembre 2026",
  titre: "Rentrée 2026-2027 : les premiers étudiants pris en charge à Abidjan",
  extrait:
    "L'équipe de l'antenne ivoirienne a accueilli les étudiants arrivés pour la rentrée, de la prise en charge à l'aéroport jusqu'à l'installation en résidence et le premier briefing avec le pôle PAP.",
};

const ARTICLES = [
  {
    categorie: "Réseau",
    date: "12 Septembre 2026",
    titre: "L'antenne de Kinshasa accueille sa première promotion",
    extrait:
      "La RD Congo rejoint officiellement le réseau des antennes opérationnelles, avec une équipe locale dédiée à la réception des familles et à la certification documentaire.",
  },
  {
    categorie: "STSS",
    date: "28 Août 2026",
    titre: "STSS : aperçu du parcours de scolarité",
    extrait:
      "L'espace public présente un scénario rattaché au code ID-POMRA, sans mouvement financier, quittance ni consultation en temps réel.",
  },
  {
    categorie: "Partenariats",
    date: "18 Juillet 2026",
    titre: "Nouvelle convention avec un institut partenaire à Yamoussoukro",
    extrait:
      "Le pôle OCO élargit son réseau d'établissements d'accueil, ouvrant de nouvelles places en ingénierie des systèmes numériques.",
  },
  {
    categorie: "PAP",
    date: "2 Juillet 2026",
    titre: "Le pôle PAP étend son canal d'écoute confidentiel",
    extrait:
      "Le dispositif d'accompagnement psychosocial renforce le parrainage par les aînés et la disponibilité des référents sur chaque campus d'accueil.",
  },
];

export default function ActualitesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Actualités"
        breadcrumb="Actualités"
        title="La vie du réseau EA-POMRA"
        description="Ouvertures d'antennes, avancées du dispositif STSS, nouveaux partenariats et informations de rentrée."
      />

      {/* Article à la une */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <article className="bg-[#F7F9FB] rounded-3xl border border-[#E6E9EF] p-6 sm:p-10 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#174A7C] bg-[#EBF3FA] border border-[#D5E5F5] px-2.5 py-1 rounded-full">
                {UNE.categorie}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8E9BAA]">
                <CalendarDays className="w-3.5 h-3.5" />
                {UNE.date}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0D2B4D] tracking-tight leading-snug max-w-3xl">
              {UNE.titre}
            </h2>

            <p className="text-sm sm:text-base text-[#5B6776] leading-relaxed max-w-3xl">
              {UNE.extrait}
            </p>
          </article>

          {/* Liste */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            {ARTICLES.map((article) => (
              <article
                key={article.titre}
                className="bg-white rounded-2xl border border-[#E6E9EF] shadow-eap-soft p-6 space-y-3 transition-all duration-300 hover:shadow-eap-card hover:border-[#D5E5F5]"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#174A7C] bg-[#EBF3FA] border border-[#D5E5F5] px-2.5 py-1 rounded-full">
                    {article.categorie}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8E9BAA]">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {article.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0D2B4D] leading-snug">
                  {article.titre}
                </h3>

                <p className="text-xs text-[#5B6776] leading-relaxed">{article.extrait}</p>
              </article>
            ))}
          </div>

          <p className="mt-8 inline-flex items-center gap-2 text-xs text-[#8E9BAA]">
            <ArrowRight className="w-3.5 h-3.5" />
             Les publications détaillées seront accessibles depuis l&apos;espace étudiant.
          </p>
        </div>
      </section>

      <CtaBand
        title="Envie de suivre votre propre parcours ?"
        description="Créez votre dossier et suivez chaque étape de votre mobilité académique depuis votre espace personnel."
      />
    </>
  );
}
