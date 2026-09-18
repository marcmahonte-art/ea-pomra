import React from "react";
import Image from "next/image";

export function PartnersSection() {
  return (
    <section id="partenaires" className="py-14 bg-white border-t border-[#F0F5FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0D2B4D] tracking-tight">
            Ils nous font confiance
          </h2>
        </div>

        {/* Bandeau des logos partenaires */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-[#FAFCFE] border border-[#E6E9EF] p-4 sm:p-6 flex items-center justify-center">
          <div className="relative w-full max-w-5xl h-16 sm:h-20">
            <Image
              src="/assets/partners-logos.png"
              alt="Partenaires EA-POMRA : Universités d'excellence, Air Côte d'Ivoire, Airtel Money, Moov Money"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
