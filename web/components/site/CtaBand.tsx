import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CtaBandProps {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CtaBand({
  title,
  description,
  primaryLabel = "Accéder à mon espace",
  primaryHref = "/etudiant/dashboard",
  secondaryLabel = "Nous contacter",
  secondaryHref = "/contact",
}: CtaBandProps) {
  return (
    <section className="bg-[#F7F9FB] border-t border-[#E6E9EF] py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#0D2B4D] rounded-3xl px-6 sm:px-12 py-10 sm:py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1EA362] hover:bg-[#17824E] text-white text-sm font-bold transition-colors"
            >
              {primaryLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-transparent hover:bg-white/10 text-white border border-white/25 text-sm font-bold transition-colors"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
