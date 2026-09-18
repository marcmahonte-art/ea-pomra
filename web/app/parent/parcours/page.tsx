import type { Metadata } from "next";
import { buildParentDashboardData } from "@/lib/parent-data";
import { JourneyTimeline } from "@/components/parent/JourneyTimeline";

export const metadata: Metadata = {
  title: "Parcours du dossier",
  description:
    "Les cinq étapes du parcours de mobilité : candidature, orientation OCO, transfert STSS, suivi sur place et réussite.",
};

/** Détail chronologique des cinq étapes du parcours. */
export default async function ParentParcoursPage() {
  const { journey, student } = await buildParentDashboardData();

  const completed = journey.filter((step) => step.state === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D2B4D] tracking-tight">
          Parcours du dossier
        </h1>
        <p className="text-sm text-[#5B6776] mt-1">
          {completed} étape{completed > 1 ? "s" : ""} validée
          {completed > 1 ? "s" : ""} sur {journey.length} — dossier{" "}
          <span className="font-mono font-semibold">{student.reference}</span>
        </p>
      </div>

      <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 sm:p-8">
        <JourneyTimeline journey={journey} />
      </section>
    </div>
  );
}
