import type { Metadata } from "next";
import { buildParentDashboardData } from "@/lib/parent-data";
import { PapCard } from "@/components/parent/PapCard";

export const metadata: Metadata = {
  title: "Accompagnement (PAP)",
  description:
    "Suivi humain et psychosocial : référent local, niveau d'accompagnement et canal d'écoute confidentiel.",
};

/** Suivi du Pôle PAP, dans sa version destinée à la famille. */
export default async function ParentPapPage() {
  const { pap, student } = await buildParentDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D2B4D] tracking-tight">
          Accompagnement (PAP)
        </h1>
        <p className="text-sm text-[#5B6776] mt-1">
          Le pôle Prévention, Accueil et Proximité suit {student.displayName} sur
          le plan humain, et non seulement académique.
        </p>
      </div>

      <PapCard pap={pap} />

      <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 space-y-3">
        <h2 className="text-sm font-bold text-[#0D2B4D]">
          Ce que vous recevez, et ce que vous ne recevez pas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs leading-relaxed">
          <div>
            <p className="font-bold text-[#1EA362] mb-1.5">
              Transmis à la famille
            </p>
            <ul className="space-y-1.5 text-[#5B6776] list-disc list-inside">
              <li>Le niveau d&apos;accompagnement en cours</li>
              <li>La date du dernier contact</li>
              <li>Le contact direct de la référente</li>
              <li>Tout événement de santé ou de sécurité grave</li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-[#5B6776] mb-1.5">
              Confidentiel par principe
            </p>
            <ul className="space-y-1.5 text-[#5B6776] list-disc list-inside">
              <li>Le contenu des entretiens avec la référente</li>
              <li>Les difficultés personnelles évoquées</li>
              <li>Les notes internes du pôle</li>
            </ul>
          </div>
        </div>
        <p className="text-[11px] text-[#8E9BAA] pt-2 border-t border-[#EDF1F6] leading-relaxed">
          Cette séparation est appliquée par le serveur : le contenu des
          entretiens n&apos;est jamais transmis à votre navigateur, il ne peut donc
          pas y être affiché par erreur.
        </p>
      </section>
    </div>
  );
}
