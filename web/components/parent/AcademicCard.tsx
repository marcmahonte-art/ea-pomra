import { BookOpen, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import type { AcademicSummary } from "@/lib/parent-types";

const COURSE_STATUS: Record<
  AcademicSummary["courses"][number]["status"],
  { label: string; className: string }
> = {
  VALIDATED: { label: "Validé", className: "bg-[#E8F6EF] text-[#1EA362]" },
  PENDING: { label: "En attente", className: "bg-[#F0F3F7] text-[#5B6776]" },
  RETAKE: { label: "À repasser", className: "bg-[#FDECEC] text-[#D9383A]" },
};

/**
 * Résultats académiques et assiduité.
 *
 * La moyenne et le dernier relevé peuvent être `null` : une note non publiée
 * n'est pas une note de zéro. Le composant affiche donc une attente explicite
 * plutôt que de convertir `null` en 0, ce qui laisserait croire à un échec.
 */
export function AcademicCard({ academic }: { academic: AcademicSummary }) {
  const progress =
    academic.creditsTotal > 0
      ? Math.round((academic.creditsValidated / academic.creditsTotal) * 100)
      : 0;

  return (
    <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 space-y-5">
      <header className="flex items-start justify-between gap-4 pb-4 border-b border-[#EDF1F6]">
        <div>
          <h2 className="text-sm font-bold text-[#0D2B4D]">
            Scolarité &amp; résultats
          </h2>
          <p className="text-xs text-[#5B6776] mt-0.5">{academic.semester}</p>
        </div>
        <BookOpen className="w-5 h-5 text-[#8E9BAA] shrink-0" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#E6E9EF] bg-[#FAFCFE] p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8E9BAA]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Moyenne générale</span>
          </div>
          {academic.average === null ? (
            <p className="text-xs text-[#5B6776] mt-2 leading-relaxed">
              Relevé non encore publié
            </p>
          ) : (
            <p className="text-2xl font-black text-[#0D2B4D] mt-1">
              {academic.average.toFixed(2).replace(".", ",")}
              <span className="text-sm font-bold text-[#8E9BAA]"> / 20</span>
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-[#E6E9EF] bg-[#FAFCFE] p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8E9BAA]">
            <Clock className="w-3.5 h-3.5" />
            <span>Taux de présence</span>
          </div>
          {academic.attendanceRate === null ? (
            <p className="text-xs text-[#5B6776] mt-2 leading-relaxed">
              Non mesuré pour l&apos;instant
            </p>
          ) : (
            <p className="text-2xl font-black text-[#0D2B4D] mt-1">
              {academic.attendanceRate}
              <span className="text-sm font-bold text-[#8E9BAA]"> %</span>
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-[#E6E9EF] bg-[#FAFCFE] p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8E9BAA]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Crédits validés</span>
          </div>
          <p className="text-2xl font-black text-[#0D2B4D] mt-1">
            {academic.creditsValidated}
            <span className="text-sm font-bold text-[#8E9BAA]">
              {" "}
              / {academic.creditsTotal}
            </span>
          </p>
          <div
            className="h-1.5 rounded-full bg-[#E6E9EF] mt-2 overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Crédits validés"
          >
            <div
              className="h-full rounded-full bg-[#1EA362]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {academic.tutorComment ? (
        <div className="rounded-2xl bg-[#EBF3FA] border border-[#D5E5F5] p-4">
          <p className="text-[11px] font-bold text-[#174A7C] uppercase tracking-wider">
            Commentaire du tuteur académique
          </p>
          <p className="text-xs text-[#0D2B4D] leading-relaxed mt-1.5">
            {academic.tutorComment}
          </p>
          {academic.lastReportDate ? (
            <p className="text-[10px] text-[#5B6776] mt-2">
              Dernier relevé : {academic.lastReportDate}
            </p>
          ) : (
            <p className="text-[10px] text-[#5B6776] mt-2">
              Aucun relevé publié à ce jour — premier bulletin attendu en décembre.
            </p>
          )}
        </div>
      ) : null}

      {academic.courses.length > 0 ? (
        <div>
          <h3 className="text-xs font-bold text-[#0D2B4D] mb-3">
            Unités d&apos;enseignement du semestre
          </h3>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left border-collapse min-w-[440px]">
              <caption className="sr-only">
                Unités d&apos;enseignement, crédits, note et statut
              </caption>
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-[#8E9BAA]">
                  <th scope="col" className="py-2 font-bold">
                    Code
                  </th>
                  <th scope="col" className="py-2 font-bold">
                    Intitulé
                  </th>
                  <th scope="col" className="py-2 font-bold text-center">
                    Crédits
                  </th>
                  <th scope="col" className="py-2 font-bold text-center">
                    Note
                  </th>
                  <th scope="col" className="py-2 font-bold text-right">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {academic.courses.map((course) => {
                  const status = COURSE_STATUS[course.status];
                  return (
                    <tr
                      key={course.code}
                      className="border-t border-[#EDF1F6] text-xs"
                    >
                      <td className="py-2.5 font-mono text-[#5B6776]">
                        {course.code}
                      </td>
                      <td className="py-2.5 font-semibold text-[#0D2B4D]">
                        {course.title}
                      </td>
                      <td className="py-2.5 text-center text-[#5B6776]">
                        {course.credits}
                      </td>
                      <td className="py-2.5 text-center font-bold text-[#0D2B4D]">
                        {course.grade === null
                          ? "—"
                          : course.grade.toFixed(1).replace(".", ",")}
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default AcademicCard;
