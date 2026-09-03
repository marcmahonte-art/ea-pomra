import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Clock, FileDown, ShieldCheck, UserCheck } from "lucide-react";
import { MOCK_TIMELINE_EVENTS } from "@/lib/data";

export function ApplicationTimeline() {
  return (
    <Card className="border-[#E6E9EF] shadow-eap-soft">
      <CardContent className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EDF1F6]">
          <div>
            <h3 className="text-lg font-bold text-[#0D2B4D]">
              Journal Chronologique du Dossier
            </h3>
            <p className="text-xs text-[#5B6776]">
              Traçabilité complète des étapes validées par les antennes et les comités.
            </p>
          </div>
          <Badge variant="primary" size="sm">
            Journal Immuable
          </Badge>
        </div>

        {/* Liste des événements */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E6E9EF]">
          {MOCK_TIMELINE_EVENTS.map((evt, idx) => {
            const isCompleted = evt.status === "completed";
            const isCurrent = evt.status === "current";

            return (
              <div key={idx} className="relative pl-9 space-y-1.5">
                {/* Icône sur la ligne */}
                <div
                  className={`absolute left-1.5 top-1 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                    isCompleted
                      ? "bg-[#1EA362] text-white"
                      : isCurrent
                      ? "bg-[#C89C2E] text-white animate-pulse"
                      : "bg-[#E6E9EF] text-[#8E9BAA]"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#0D2B4D]">{evt.title}</h4>
                    {evt.badgeText && (
                      <Badge
                        variant={isCompleted ? "success" : isCurrent ? "gold" : "outline"}
                        size="sm"
                      >
                        {evt.badgeText}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#8E9BAA]">{evt.date}</span>
                </div>

                <p className="text-xs text-[#5B6776] leading-relaxed max-w-3xl">
                  {evt.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-medium text-[#174A7C] flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-[#174A7C]" />
                    Opéré par : {evt.actor}
                  </span>

                  {isCompleted && evt.badgeText?.includes("STSS") && (
                    <button
                      onClick={() => alert("Téléchargement de l'attestation STSS officielle EA-POMRA (PDF signé électroniquement)")}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1EA362] hover:underline cursor-pointer bg-[#E8F6EF] px-2.5 py-1 rounded-lg border border-[#C5EBDA]"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Télécharger Quittance STSS</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
