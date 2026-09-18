import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, ExternalLink } from "lucide-react";
import { buildParentDashboardData } from "@/lib/parent-data";

export const metadata: Metadata = {
  title: "Aide & FAQ",
  description:
    "Réponses aux questions fréquentes des parents : parcours, transferts STSS, accompagnement PAP et confidentialité.",
};

/**
 * Questions fréquentes.
 *
 * Rédigées en HTML natif (`<details>` / `<summary>`) : l'ouverture et la
 * fermeture sont gérées par le navigateur, donc accessibles au clavier et
 * annoncées correctement, sans le moindre JavaScript côté client.
 */
const FAQ = [
  {
    question: "Qui décide de l'établissement d'accueil de mon enfant ?",
    answer:
      "Le comité d'experts du pôle OCO analyse le dossier académique et le projet professionnel, puis émet un avis. La décision est expliquée et transmise à la famille avant tout engagement financier.",
  },
  {
    question: "Où va l'argent que je dépose pour la scolarité ?",
    answer:
      "Les fonds sont déposés auprès de l'antenne du pays d'origine, puis virés directement à l'établissement d'accueil. Aucun versement n'est remis à un intermédiaire. Chaque opération produit une quittance officielle téléchargeable depuis la section Documents.",
  },
  {
    question: "Que se passe-t-il si mon enfant a un problème sur place ?",
    answer:
      "Une référente du pôle PAP est rattachée au dossier dès l'arrivée. Elle est joignable directement et assure un suivi régulier. Tout événement grave de santé ou de sécurité vous est signalé sans délai.",
  },
  {
    question: "Pourquoi ne puis-je pas lire le contenu des entretiens ?",
    answer:
      "Parce que ces échanges appartiennent à votre enfant. Vous êtes informé du niveau d'accompagnement et de l'évolution de la situation, mais le détail des entretiens reste confidentiel — c'est la condition pour qu'un étudiant ose parler librement.",
  },
  {
    question: "Comment ajouter une pièce manquante au dossier ?",
    answer:
      "Les pièces sont déposées auprès de l'antenne, qui les vérifie avant de les intégrer au dossier officiel. Aucun document ne peut être ajouté directement depuis cet espace, précisément pour garantir cette vérification.",
  },
  {
    question: "Les notes affichées sont-elles définitives ?",
    answer:
      "Elles sont reportées depuis les relevés de l'établissement d'accueil. Un décalage de quelques jours avec le document officiel est normal ; seul le relevé de l'établissement fait foi.",
  },
];

export default async function ParentAidePage() {
  const { parent } = await buildParentDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D2B4D] tracking-tight">
          Aide &amp; FAQ
        </h1>
        <p className="text-sm text-[#5B6776] mt-1">
          Les questions que les familles nous posent le plus souvent.
        </p>
      </div>

      <section className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-6 sm:p-8">
        <h2 className="sr-only">Questions fréquentes</h2>
        <div className="divide-y divide-[#EDF1F6]">
          {FAQ.map((item) => (
            <details key={item.question} className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                <span className="text-sm font-bold text-[#0D2B4D]">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="text-[#8E9BAA] font-bold text-lg leading-none shrink-0 group-open:rotate-45 transition-transform"
                >
                  +
                </span>
              </summary>
              <p className="text-xs text-[#5B6776] leading-relaxed mt-2.5 pr-8">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-[#0D2B4D] rounded-3xl p-6 sm:p-8 text-white">
        <h2 className="text-base font-bold">
          Vous ne trouvez pas votre réponse ?
        </h2>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-2xl">
          Votre antenne {parent.antenneCountry} suit votre dossier au quotidien et
          répond sous 48 h ouvrées.
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          <a
            href={`tel:${parent.antennePhone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F7D070] hover:bg-[#e8c25f] text-[#0D2B4D] text-xs font-bold transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            {parent.antennePhone}
          </a>
          <a
            href={`mailto:${parent.antenneEmail}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            {parent.antenneEmail}
          </a>
          <Link
            href="/ressources"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Guides et ressources
          </Link>
        </div>
      </section>
    </div>
  );
}
