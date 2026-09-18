import Link from "next/link";
import { GraduationCap, MapPin, CalendarDays, Hash } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { StudentSummary } from "@/lib/parent-types";

/**
 * Carte d'identité du dossier suivi.
 *
 * Les valeurs affichées proviennent toutes de `StudentSummary` — aucune n'est
 * recalculée ni reformatée ici, afin qu'une correction sur la donnée se
 * propage partout sans chasse aux doublons.
 */
export function StudentSummaryCard({ student }: { student: StudentSummary }) {
  return (
    <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Bloc identité */}
        <div className="bg-[#0D2B4D] text-white p-6 sm:w-[38%] flex flex-col justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#174A7C] text-[#F7D070] font-black text-lg flex items-center justify-center shrink-0">
              {student.initials}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold tracking-tight truncate">
                {student.displayName}
              </h2>
              <p className="text-[11px] text-slate-300">
                {student.degreeLevel} — {student.academicYear}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              Référence de dossier
            </p>
            <p className="text-base font-black font-mono tracking-tight mt-0.5">
              {student.reference}
            </p>
          </div>
        </div>

        {/* Bloc informations */}
        <div className="p-6 flex-1 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">{student.statusLabel}</Badge>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#8E9BAA] mt-0.5 shrink-0" />
              <div>
                <dt className="text-[11px] font-semibold text-[#8E9BAA]">
                  Parcours de mobilité
                </dt>
                <dd className="text-xs font-bold text-[#0D2B4D] mt-0.5">
                  {student.originFlag} {student.originCountry} → {student.hostFlag}{" "}
                  {student.hostCity}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <GraduationCap className="w-4 h-4 text-[#8E9BAA] mt-0.5 shrink-0" />
              <div>
                <dt className="text-[11px] font-semibold text-[#8E9BAA]">
                  Établissement d&apos;accueil
                </dt>
                <dd className="text-xs font-bold text-[#0D2B4D] mt-0.5">
                  {student.university}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:col-span-2">
              <Hash className="w-4 h-4 text-[#8E9BAA] mt-0.5 shrink-0" />
              <div>
                <dt className="text-[11px] font-semibold text-[#8E9BAA]">
                  Filière
                </dt>
                <dd className="text-xs font-bold text-[#0D2B4D] mt-0.5">
                  {student.program}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CalendarDays className="w-4 h-4 text-[#8E9BAA] mt-0.5 shrink-0" />
              <div>
                <dt className="text-[11px] font-semibold text-[#8E9BAA]">
                  Ouverture du dossier
                </dt>
                <dd className="text-xs font-bold text-[#0D2B4D] mt-0.5">
                  {student.enrollmentDate}
                </dd>
              </div>
            </div>
          </dl>

          <div className="pt-4 border-t border-[#EDF1F6] flex flex-wrap gap-3">
            <Link
              href="/parent/parcours"
              className="text-xs font-bold text-[#174A7C] hover:underline"
            >
              Voir le parcours détaillé →
            </Link>
            <Link
              href="/parent/documents"
              className="text-xs font-bold text-[#174A7C] hover:underline"
            >
              Consulter les pièces du dossier →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentSummaryCard;
