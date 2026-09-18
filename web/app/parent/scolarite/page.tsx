import type { Metadata } from "next";
import { buildParentDashboardData } from "@/lib/parent-data";
import { AcademicCard } from "@/components/parent/AcademicCard";

export const metadata: Metadata = {
  title: "Scolarité & résultats",
  description:
    "Assiduité, crédits validés, unités d'enseignement et commentaire du tuteur académique.",
};

/** Résultats académiques et assiduité de l'étudiant suivi. */
export default async function ParentScolaritePage() {
  const { academic, student } = await buildParentDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D2B4D] tracking-tight">
          Scolarité &amp; résultats
        </h1>
        <p className="text-sm text-[#5B6776] mt-1">
          {student.program} — {student.university}
        </p>
      </div>

      <AcademicCard academic={academic} />

      <p className="text-[11px] text-[#8E9BAA] leading-relaxed">
        Les notes sont publiées par l&apos;établissement d&apos;accueil, puis
        reportées ici par la coordination académique. Un décalage de quelques
        jours avec le relevé officiel est normal.
      </p>
    </div>
  );
}
