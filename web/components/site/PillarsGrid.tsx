import React from "react";
import {
  Compass,
  ShieldCheck,
  HeartHandshake,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { PILLARS } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = {
  Compass,
  ShieldCheck,
  HeartHandshake,
  GraduationCap,
};

interface PillarsGridProps {
  detailed?: boolean;
}

export function PillarsGrid({ detailed = false }: PillarsGridProps) {
  return (
    <div className={detailed ? "space-y-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
      {PILLARS.map((pillar) => {
        const Icon = ICONS[pillar.icon] ?? Compass;
        return (
          <article
            key={pillar.id}
            className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 sm:p-8 space-y-4 transition-all duration-300 hover:shadow-eap-card hover:border-[#D5E5F5]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FA] text-[#174A7C] flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C89C2E]">
                  {pillar.tag}
                </span>
                <h3 className="text-lg font-bold text-[#0D2B4D] tracking-tight mt-0.5">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#8E9BAA] font-medium">{pillar.subtitle}</p>
              </div>
            </div>

            <p className="text-sm text-[#5B6776] leading-relaxed">{pillar.description}</p>

            <div className="pt-3 border-t border-[#EDF1F6] flex items-center gap-2 text-xs font-semibold text-[#1EA362]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1EA362]"></span>
              {pillar.highlight}
            </div>
          </article>
        );
      })}
    </div>
  );
}
