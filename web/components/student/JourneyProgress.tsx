"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Check, Clock, Compass, ShieldCheck, GraduationCap } from "lucide-react";

interface JourneyProgressProps {
  currentStepIndex?: number;
}

export function JourneyProgress({ currentStepIndex = 2 }: JourneyProgressProps) {
  const steps = [
    {
      index: 0,
      title: "1. Candidature & Pièces",
      subtitle: "Dépôt & vérification",
      desc: "Diplômes de Licence 3 et passeport contrôlés par l'antenne Dakar.",
      icon: Compass,
      status: "completed",
    },
    {
      index: 1,
      title: "2. Avis Pôle OCO",
      subtitle: "Orientation validée",
      desc: "Avis favorable délivré par Dr. Amadou Ba pour l'INP-HB.",
      icon: ShieldCheck,
      status: "completed",
    },
    {
      index: 2,
      title: "3. Mobilité & STSS",
      subtitle: "Scénario STSS affiché",
      desc: "1 850 000 FCFA simulés pour l'établissement, sans mouvement financier ni quittance.",
      icon: ShieldCheck,
      status: "completed",
    },
  ];

  return (
    <Card className="border-[#E6E9EF] shadow-eap-soft">
      <CardContent className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EDF1F6]">
          <div>
            <h3 className="text-lg font-bold text-[#0D2B4D]">
              Progression de votre Parcours Académique
            </h3>
               <p className="text-xs text-[#5B6776]">
               Étape actuelle : <strong>Phase 3 • Simulation STSS sans mouvement financier</strong>
             </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1EA362] bg-[#E8F6EF] px-3 py-1 rounded-full">
              75% du parcours validé
            </span>
          </div>
        </div>

        {/* Stepper Horizontal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const isCompleted = step.index < 3;
            const isCurrent = step.index === 3;
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className={`relative p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? "bg-[#E8F6EF]/40 border-[#C5EBDA]"
                    : isCurrent
                    ? "bg-[#FBF6EA] border-[#F4E4BC] shadow-sm"
                    : "bg-[#F7F9FB] border-[#E6E9EF] opacity-70"
                }`}
              >
                {/* Numéro et icône */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isCompleted
                        ? "bg-[#1EA362] text-white"
                        : isCurrent
                        ? "bg-[#C89C2E] text-white ring-4 ring-[#FBF6EA]"
                        : "bg-[#E6E9EF] text-[#8E9BAA]"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isCompleted
                        ? "text-[#1EA362]"
                        : isCurrent
                        ? "text-[#C89C2E]"
                        : "text-[#8E9BAA]"
                    }`}
                  >
                    {isCompleted ? "Validé" : isCurrent ? "En cours" : "À venir"}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#0D2B4D] leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs font-semibold text-[#174A7C] mt-0.5">
                  {step.subtitle}
                </p>
                <p className="text-[11px] text-[#5B6776] leading-relaxed mt-2">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
