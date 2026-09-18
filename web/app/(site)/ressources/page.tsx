import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import {
  BookOpen,
  FolderCheck,
  MessageSquare,
  Newspaper,
  Building,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Ressources",
  "Guides, documents attendus et réponses aux questions les plus fréquentes des étudiants et de leurs familles avant le départ."
);

const RESSOURCES = [
  {
    icon: BookOpen,
    titre: "Guide du parcours étudiant",
    texte: "Les quatre étapes de la candidature à l'installation sur le campus d'accueil.",
    href: "/programmes",
  },
  {
    icon: FolderCheck,
    titre: "Documents utiles",
    texte: "Pièces justificatives attendues et suivi des documents déposés dans votre dossier.",
    href: "/etudiant/documents",
  },
  {
    icon: MessageSquare,
    titre: "Espace étudiant",
    texte: "Statut du dossier, avis OCO, quittances STSS et messagerie avec votre antenne.",
    href: "/etudiant/dashboard",
  },
  {
    icon: Building,
    titre: "Antennes nationales",
    texte: "Coordonnées et référents des huit antennes du réseau panafricain.",
    href: "/antennes",
  },
  {
    icon: Newspaper,
    titre: "Actualités du réseau",
    texte: "Ouvertures d'antennes, nouveaux partenariats et informations de rentrée.",
    href: "/actualites",
  },
];

const FAQ = [
  {
    question: "Qu'est-ce que le code ID-POMRA ?",
    reponse:
      "C'est l'identifiant unique attribué à chaque étudiant lors du dépôt de son dossier. Il remplace l'usage du nom sur les canaux partagés, afin de préserver la confidentialité des échanges et de rattacher chaque pièce à un dossier précis.",
  },
  {
    question: "Comment fonctionne le transfert sécurisé de scolarité (STSS) ?",
    reponse:
      "La famille dépose les frais de scolarité en monnaie locale auprès de l'antenne de départ, contre quittance légale. Les fonds sont ensuite virés directement à l'établissement d'accueil. Aucun intermédiaire ne détient l'argent, et chaque mouvement est horodaté dans le dossier.",
  },
  {
    question: "Que se passe-t-il si le comité OCO émet un avis défavorable ?",
    reponse:
      "L'avis est argumenté et transmis avec une orientation alternative. Comme l'avis intervient avant tout engagement financier, la famille peut réorienter le projet sans perte de frais de scolarité.",
  },
  {
    question: "Qui contacter en cas d'urgence une fois sur place ?",
    reponse:
      "Le pôle PAP met à disposition un référent local et un canal d'écoute confidentiel accessible 24 heures sur 24, 7 jours sur 7, ainsi qu'un parrainage par des étudiants plus avancés sur le même campus.",
  },
  {
    question: "Mes informations et celles de ma famille sont-elles confidentielles ?",
    reponse:
      "L'accès aux informations est restreint par rôle : l'étudiant, le parent référent, l'antenne et l'établissement d'accueil ne voient que ce qui les concerne. Les données sensibles d'accompagnement psychosocial ne sont accessibles qu'au pôle PAP.",
  },
  {
    question: "Puis-je régler les frais depuis un autre pays que celui de départ ?",
    reponse:
      "Oui. Le dépôt se fait auprès de l'antenne la plus proche de la famille, y compris si elle se trouve dans un autre pays du réseau. La quittance reste rattachée au code ID-POMRA de l'étudiant.",
  },
];

export default function RessourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ressources"
        breadcrumb="Ressources"
        title="Tout ce qu'il faut savoir avant de partir"
        description="Guides, documents attendus et réponses aux questions les plus fréquentes des étudiants et de leurs familles."
      />

      {/* Cartes de ressources */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RESSOURCES.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.titre}
                  href={item.href}
                  className="group bg-white rounded-2xl border border-[#E6E9EF] shadow-eap-soft p-6 space-y-3 transition-all duration-300 hover:shadow-eap-card hover:border-[#D5E5F5] hover:-translate-y-0.5"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#EBF3FA] text-[#174A7C] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0D2B4D]">{item.titre}</h3>
                  <p className="text-xs text-[#5B6776] leading-relaxed">{item.texte}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1EA362] pt-1">
                    Consulter
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-20 bg-[#F7F9FB] border-y border-[#E6E9EF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="mb-10 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B4D] tracking-tight">
              Questions fréquentes
            </h2>
            <p className="text-sm sm:text-base text-[#5B6776] leading-relaxed">
              Les réponses aux interrogations les plus courantes des familles avant le départ.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.question}
                className="group bg-white rounded-2xl border border-[#E6E9EF] shadow-eap-soft overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none">
                  <h3 className="text-sm font-bold text-[#0D2B4D]">{item.question}</h3>
                  <ChevronDown className="w-4 h-4 text-[#174A7C] shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-6 pb-5 text-sm text-[#5B6776] leading-relaxed">{item.reponse}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Vous ne trouvez pas votre réponse ?"
        description="Votre antenne nationale et le pôle PAP restent joignables pour toute question, avant comme après le départ."
      />
    </>
  );
}
