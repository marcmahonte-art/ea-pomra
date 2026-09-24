"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, CheckCircle2, ChevronRight } from "lucide-react";

export default function CalendrierPage() {
  const events = [
    {
      date: "2 Juillet 2026",
      title: "Dépôt initial de candidature",
      category: "Dossier",
      status: "passé",
      desc: "Soumission des pièces académiques auprès de l'antenne de Dakar et attribution du code ID-POMRA.",
    },
    {
      date: "18 Juillet 2026",
      title: "Avis d'orientation du comité OCO",
      category: "Académique",
      status: "passé",
      desc: "Avis favorable rendu par la commission d'experts et validation du projet académique.",
    },
    {
      date: "14 Août 2026",
       title: "Scénario STSS affiché",
       category: "Finances",
       status: "passé",
       desc: "Un scénario de transfert est affiché pour illustrer le parcours. Aucun paiement réel ni reçu officiel n'est fourni.",
    },
    {
      date: "10 Septembre 2026",
      title: "Accueil et arrivée à Abidjan",
       category: "Suivi local",
      status: "en cours",
      desc: "Prise en charge à l'aéroport Félix Houphouët-Boigny et installation en résidence.",
    },
    {
      date: "18 Septembre 2026",
      title: "Rentrée et début des cours",
      category: "Université",
      status: "à venir",
      desc: "Accueil pédagogique à l'Institut National Polytechnique Félix Houphouët-Boigny (INP-HB).",
    },
    {
      date: "15 Décembre 2026",
      title: "Bilan trimestriel partagé avec la famille",
      category: "Lien Famille",
      status: "à venir",
      desc: "Transmission du premier rapport d'assiduité et de bien-être sur l'Espace Parent.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="pb-4 border-b border-[#E6E9EF]">
        <div className="flex items-center gap-2 text-xs text-[#5B6776] mb-1">
          <Link href="/etudiant/dashboard" className="hover:text-[#0D2B4D]">Espace Étudiant</Link>
          <span>/</span>
          <span className="text-[#174A7C] font-semibold">Calendrier</span>
        </div>
        <h1 className="text-2xl font-black text-[#0D2B4D] tracking-tight flex items-center gap-3">
          <Calendar className="w-6 h-6 text-[#174A7C]" />
          Agenda Académique & Jalons de Mobilité
        </h1>
      </div>

      {/* Grille des événements */}
      <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 sm:p-8 shadow-eap-soft space-y-6">
        <h2 className="text-base font-bold text-[#0D2B4D]">Calendrier officiel de l&apos;année 2026 - 2027</h2>

        <div className="divide-y divide-[#EDF1F6]">
          {events.map((evt, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F0F5FA] border border-[#E6E9EF] flex flex-col items-center justify-center text-center shrink-0">
                  <span className="text-[10px] font-bold text-[#174A7C] uppercase">
                    {evt.date.split(" ")[1]}
                  </span>
                  <span className="text-base font-black text-[#0D2B4D] leading-none">
                    {evt.date.split(" ")[0]}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#0D2B4D]">{evt.title}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F0F3F7] text-[#5B6776]">
                      {evt.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B6776] mt-1 leading-relaxed">{evt.desc}</p>
                </div>
              </div>

              <div className="self-end sm:self-auto">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    evt.status === "passé"
                      ? "bg-[#E8F6EF] text-[#1EA362]"
                      : evt.status === "en cours"
                      ? "bg-[#EBF3FA] text-[#3B82F6]"
                      : "bg-[#FEF7EC] text-[#F59E0B]"
                  }`}
                >
                  {evt.status === "passé" ? "Achevé" : evt.status === "en cours" ? "En cours" : "Planifié"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
