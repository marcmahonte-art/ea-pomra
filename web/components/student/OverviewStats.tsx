import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Compass, FileCheck2, ArrowUpRight } from "lucide-react";
import { MOCK_ACTIVE_STUDENT } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export function OverviewStats() {
  const stats = [
    {
       title: "Scolarité STSS — simulation",
      value: formatCurrency(MOCK_ACTIVE_STUDENT.stssTransaction?.amount || 0),
       status: "SIMULATION",
      badgeVariant: "success" as const,
      icon: ShieldCheck,
      iconBg: "#E8F6EF",
      iconColor: "#1EA362",
      detail: "Réf: " + MOCK_ACTIVE_STUDENT.stssTransaction?.referenceCode,
       action: "Voir la simulation",
    },
    {
      title: "Orientation Pôle OCO",
      value: "Avis Favorable",
       status: "Simulation affichée",
      badgeVariant: "primary" as const,
      icon: Compass,
      iconBg: "#EBF3FA",
      iconColor: "#174A7C",
      detail: "Spécialité : IA & Systèmes Numériques",
      action: "Consulter la fiche OCO",
    },
    {
      title: "Pièces Justificatives",
       value: "5 / 5 aperçus",
       status: "Aperçu du dossier",
      badgeVariant: "neutral" as const,
      icon: FileCheck2,
      iconBg: "#F0F3F7",
      iconColor: "#0D2B4D",
      detail: "Diplômes certifiés conformes",
      action: "Gérer mes documents",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <Card key={idx} hoverEffect className="border-[#E6E9EF] flex flex-col justify-between">
            <CardContent className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: s.iconBg }}
                >
                  <Icon className="w-5 h-5" style={{ color: s.iconColor }} />
                </div>
                <Badge variant={s.badgeVariant} size="sm">
                  {s.status}
                </Badge>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#8E9BAA] block">
                  {s.title}
                </span>
                <div className="text-xl font-black text-[#0D2B4D] tracking-tight mt-0.5">
                  {s.value}
                </div>
                <p className="text-[11px] text-[#5B6776] mt-1 truncate">
                  {s.detail}
                </p>
              </div>

              <div className="pt-2 border-t border-[#EDF1F6]">
                <button className="text-xs font-bold text-[#174A7C] hover:text-[#0D2B4D] inline-flex items-center gap-1 transition-colors cursor-pointer">
                  <span>{s.action}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
