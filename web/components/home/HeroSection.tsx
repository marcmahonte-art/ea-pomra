import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Users, UserCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-12 lg:pt-12 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Col Gauche : Pitch & CTA */}
          <div className="lg:col-span-6 space-y-6">
            {/* Badge pilule vert clair */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#E8F6EF] border border-[#C5EBDA] text-[#1EA362] text-[12px] font-semibold">
              Plateforme d&apos;Orientation, de Mobilité et de Réussite Académique
            </div>

            {/* Gros Titre H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#0D2B4D] tracking-tight leading-[1.12]">
              Votre avenir académique,{" "}
              <span className="text-[#1EA362] block mt-1">notre mission.</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-[16px] sm:text-[17px] text-[#5B6776] leading-relaxed max-w-xl">
              EA-POMRA accompagne les étudiants africains à chaque étape de leur parcours : orientation, mobilité, suivi et réussite.
            </p>

            {/* Boutons CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Link
                href="/etudiant/dashboard"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0D2B4D] hover:bg-[#123B63] text-white text-[15px] font-bold transition-all shadow-sm cursor-pointer"
              >
                <UserCheck className="w-5 h-5" />
                <span>Commencer ma démarche</span>
              </Link>

              <Link
                href="#comment-ca-marche"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F7F9FB] text-[#0D2B4D] border border-[#E6E9EF] text-[15px] font-semibold transition-all shadow-sm cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full border border-[#0D2B4D] flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 text-[#0D2B4D] fill-current ml-0.5" />
                </div>
                <span>Découvrir la plateforme</span>
              </Link>
            </div>

            {/* Preuve sociale (Social Proof) */}
            <div className="flex items-center gap-3 pt-3">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#174A7C] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  👨🏾‍🎓
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#1EA362] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  👩🏾‍🎓
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#C89C2E] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  👨🏾‍💼
                </div>
              </div>

              <div className="text-[13px] text-[#5B6776]">
                <strong className="text-[#0D2B4D]">+10 000 étudiants accompagnés</strong>{" "}
                dans{" "}
                <span className="text-[#1EA362] font-bold">8 pays africains</span>
              </div>
            </div>
          </div>

          {/* Col Droite : Illustration Hero complète */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[530px] aspect-[550/410] rounded-2xl overflow-hidden shadow-eap-soft hover:shadow-eap-card transition-all">
              <Image
                src="/assets/mockup-hero-student.png"
                alt="Étudiant EA-POMRA avec tablette, carte de l'Afrique et badges ID-POMRA"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
