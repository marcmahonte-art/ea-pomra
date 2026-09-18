import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function ActorsSection() {
  const actors = [
    {
      title: "Étudiants",
      desc: "Suivez votre dossier, accédez à vos avis, demandez un accompagnement et restez informé.",
      cta: "Accéder à mon espace",
      href: "/etudiant/dashboard",
      color: "#1EA362",
      bgColor: "#E8F6EF",
      imageSrc: "/assets/actor-students.png",
      alt: "Étudiants africains avec sacs à dos",
    },
    {
      title: "Parents",
      desc: "Suivez l'évolution du parcours de votre enfant en temps réel et recevez des rapports réguliers.",
      cta: "Accéder à l'espace parent",
      href: "/etudiant/dashboard",
      color: "#174A7C",
      bgColor: "#EEF5FC",
      imageSrc: "/assets/actor-parents.png",
      alt: "Parents d'étudiants",
    },
    {
      title: "Antennes & BEC",
      desc: "Gérez les dossiers, validez les étapes et suivez les statistiques de votre pays.",
      cta: "Accéder à l'espace professionnel",
      href: "#antennes",
      color: "#F59E0B",
      bgColor: "#FAF6EB",
      imageSrc: "/assets/actor-antennes.png",
      alt: "Bâtiment institutionnel antenne avec drapeau",
    },
  ];

  return (
    <section id="acteurs" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Titre avec petit trait vert */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B4D] tracking-tight">
            Une plateforme pour tous les acteurs
          </h2>
          <div className="w-10 h-1 bg-[#1EA362] rounded-full mx-auto mt-2.5"></div>
        </div>

        {/* 3 Cartes Acteurs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {actors.map((actor, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-eap-card transition-all duration-300"
              style={{ backgroundColor: actor.bgColor }}
            >
              {/* Illustration de l'acteur */}
              <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-5 bg-white/40">
                <Image
                  src={actor.imageSrc}
                  alt={actor.alt}
                  fill
                  className="object-cover object-center"
                />
              </div>

              {/* Texte */}
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-bold text-[#0D2B4D]">
                  {actor.title}
                </h3>
                <p className="text-[13px] text-[#5B6776] leading-relaxed">
                  {actor.desc}
                </p>
              </div>

              {/* Lien CTA */}
              <div className="pt-5 mt-2 border-t border-black/5">
                <Link
                  href={actor.href}
                  className="inline-flex items-center gap-1.5 text-[14px] font-bold transition-all hover:translate-x-1"
                  style={{ color: actor.color }}
                >
                  <span>{actor.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
