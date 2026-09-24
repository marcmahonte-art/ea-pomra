import type { Metadata } from "next";
import Link from "next/link";
import { buildParentDashboardData } from "@/lib/parent-data";
import { KpiRow } from "@/components/parent/KpiRow";
import { NextActionBanner } from "@/components/parent/NextActionBanner";
import { StudentSummaryCard } from "@/components/parent/StudentSummaryCard";
import { JourneyStepper } from "@/components/parent/JourneyTimeline";
import { AcademicCard } from "@/components/parent/AcademicCard";
import { FinanceCard } from "@/components/parent/FinanceCard";
import { DocumentsCard } from "@/components/parent/DocumentsCard";
import { NotificationsCard } from "@/components/parent/NotificationsCard";
import { MessagesCard } from "@/components/parent/MessagesCard";
import { QuickActions } from "@/components/parent/QuickActions";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description:
    "Vue d'ensemble du parcours de mobilité : avancement du dossier, assiduité, transferts de scolarité et accompagnement.",
};

/**
 * Tableau de bord du parent.
 *
 * Composant serveur : il lit les données autorisées du parent sans les données
 * de fiche PAP.
 */
export default async function ParentDashboardPage() {
  const data = await buildParentDashboardData();
  const currentStep = data.journey[data.student.currentStepIndex];

  return (
    <div className="space-y-6">
      {/* Le seul <h1> de la page : la salutation de la coquille est un <p>. */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D2B4D] tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-sm text-[#5B6776] mt-1">
          {data.student.displayName} · Dossier{" "}
          <span className="font-mono font-semibold">
            {data.student.reference}
          </span>{" "}
          · {data.student.academicYear}
        </p>
      </div>

      <NextActionBanner action={data.nextAction} />

      <KpiRow kpis={data.kpis} />

      <StudentSummaryCard student={data.student} />

      {/* Parcours compact + raccourcis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 space-y-5">
          <SectionHeading
            title="Avancement du parcours"
            description={
              currentStep
                ? `Étape en cours : ${currentStep.label} — ${currentStep.date ?? "à venir"}`
                : undefined
            }
            action={
              <Link
                href="/parent/parcours"
                className="text-xs font-bold text-[#174A7C] hover:underline"
              >
                Voir le détail →
              </Link>
            }
          />
          <JourneyStepper journey={data.journey} />
        </section>

        <div className="lg:col-span-5 space-y-4">
          <SectionHeading
            title="Accès rapides"
            description="Les démarches les plus fréquentes."
          />
          <QuickActions />
        </div>
      </div>

      {/* Scolarité et finances */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AcademicCard academic={data.academic} />
        <FinanceCard finance={data.finance} />
      </div>

      {/* Accompagnement, notifications et messages */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <NotificationsCard notifications={data.notifications.slice(0, 3)} />
          <MessagesCard messages={data.messages} max={2} />
        </div>
      </div>

      <DocumentsCard documents={data.documents} />
    </div>
  );
}
