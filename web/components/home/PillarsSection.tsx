import React from "react";
import { GraduationCap, Globe, Users, ShieldCheck } from "lucide-react";

export function PillarsSection() {
  const cards = [
    {
      title: "Orientation personnalisée",
      desc: "Des conseils académiques adaptés à votre profil et vos ambitions.",
      icon: GraduationCap,
      color: "#1EA362",
      bgColor: "#E8F6EF",
    },
    {
      title: "Mobilité académique",
      desc: "Étudiez dans les meilleures universités en Afrique.",
      icon: Globe,
      color: "#174A7C",
      bgColor: "#EBF3FA",
    },
    {
      title: "Accompagnement continu",
      desc: "Un suivi humain et digital à chaque étape de votre parcours.",
      icon: Users,
      color: "#C89C2E",
      bgColor: "#FBF6EA",
    },
    {
      title: "Sécurité & Confiance",
      desc: "Vos données sont protégées. Traçabilité et transparence garanties.",
      icon: ShieldCheck,
      color: "#C89C2E",
      bgColor: "#FBF6EA",
    },
  ];

  return (
    <section id="piliers" className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#E6E9EF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-eap-card hover:border-[#A2AAB3] transition-all duration-200 flex flex-col items-start"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 shrink-0"
                  style={{ backgroundColor: c.bgColor }}
                >
                  <Icon className="w-6 h-6" style={{ color: c.color }} />
                </div>

                <h3 className="text-[16px] font-bold text-[#0D2B4D] mb-1.5 leading-snug">
                  {c.title}
                </h3>

                <p className="text-[13px] text-[#5B6776] leading-relaxed">
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
