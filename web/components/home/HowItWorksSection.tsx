import React from "react";
import { FileText, User, MapPin, GraduationCap, ChevronRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      num: 1,
      numColor: "#1EA362",
      iconBg: "#E8F6EF",
      icon: FileText,
      iconColor: "#1EA362",
      title: "Soumettez votre dossier",
      desc: "Remplissez votre candidature en ligne et téléchargez vos documents.",
    },
    {
      num: 2,
      numColor: "#3B82F6",
      iconBg: "#EBF3FA",
      icon: User,
      iconColor: "#3B82F6",
      title: "Analyse OCO",
      desc: "Nos experts évaluent votre dossier et vous proposent une orientation.",
    },
    {
      num: 3,
      numColor: "#F59E0B",
      iconBg: "#FEF7EC",
      icon: MapPin,
      iconColor: "#F59E0B",
      title: "Suivi & Accompagnement",
      desc: "Bénéficiez d'un suivi personnalisé jusqu'à votre intégration et votre réussite.",
    },
    {
      num: 4,
      numColor: "#C89C2E",
      iconBg: "#FBF6EA",
      icon: GraduationCap,
      iconColor: "#C89C2E",
      title: "Réussite",
      desc: "Atteignez vos objectifs académiques et construisez votre avenir.",
    },
  ];

  return (
    <section id="comment-ca-marche" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Titre avec petit trait vert */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B4D] tracking-tight">
            Comment ça marche ?
          </h2>
          <div className="w-10 h-1 bg-[#1EA362] rounded-full mx-auto mt-2.5"></div>
        </div>

        {/* Stepper horizontal 4 étapes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center relative group">
                {/* Numéro et icône */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-[14px] font-bold"
                    style={{ color: step.numColor }}
                  >
                    {step.num}
                  </span>

                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105"
                    style={{ backgroundColor: step.iconBg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: step.iconColor }} />
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-4 top-6 text-[#A2AAB3]">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <h3 className="text-[16px] font-bold text-[#0D2B4D] mb-1.5">
                  {step.title}
                </h3>

                <p className="text-[13px] text-[#5B6776] leading-relaxed max-w-[220px]">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
