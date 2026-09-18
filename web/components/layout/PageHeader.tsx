import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <section className="bg-[#0D2B4D] text-white py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs text-slate-300 mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            Accueil
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-white font-semibold">{breadcrumb ?? title}</span>
        </nav>

        {eyebrow && (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold uppercase tracking-wider text-white mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1EA362]"></span>
            {eyebrow}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] max-w-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-5 text-base sm:text-lg text-slate-200 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
