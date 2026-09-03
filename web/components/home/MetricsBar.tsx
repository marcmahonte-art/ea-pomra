import React from "react";
import { GraduationCap, Globe, FolderCheck, CheckCircle2, Users2 } from "lucide-react";

export function MetricsBar() {
  const stats = [
    {
      icon: GraduationCap,
      color: "#1EA362",
      bgColor: "rgba(30, 163, 98, 0.2)",
      value: "10 000+",
      label: "Étudiants accompagnés",
    },
    {
      icon: Globe,
      color: "#3B82F6",
      bgColor: "rgba(59, 130, 246, 0.2)",
      value: "8",
      label: "Antennes nationales",
    },
    {
      icon: FolderCheck,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.2)",
      value: "15 000+",
      label: "Dossiers traités",
    },
    {
      icon: CheckCircle2,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.2)",
      value: "98%",
      label: "Taux de satisfaction",
    },
    {
      icon: Users2,
      color: "#60A5FA",
      bgColor: "rgba(96, 165, 250, 0.2)",
      value: "120+",
      label: "Partenaires académiques",
    },
  ];

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#0D2B4D] text-white rounded-2xl p-6 sm:p-8 shadow-eap-card">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4 items-center">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: s.bgColor }}
                  >
                    <Icon className="w-6 h-6" style={{ color: s.color }} />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white leading-none">
                      {s.value}
                    </div>
                    <div className="text-[12px] text-slate-300 font-medium mt-1 leading-tight">
                      {s.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
