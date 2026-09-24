import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ban, CheckCircle2, Globe2, ShieldCheck, WalletCards } from "lucide-react";

export const metadata: Metadata = {
  title: "STSS — Simulation de transfert de scolarité",
  description:
    "Découvrez le dispositif STSS d'EA-POMRA : étapes, pays et devises pris en charge dans une simulation sans paiement.",
  alternates: { canonical: "/stss" },
  openGraph: {
    title: "STSS — Simulation de transfert de scolarité",
    description: "Un espace public de simulation STSS, sans paiement ni donnée personnelle.",
    type: "website"
  }
};

const countries = ["Sénégal", "Côte d'Ivoire", "Cameroun", "Gabon", "Bénin", "Togo", "Congo", "RD Congo"];
const currencies = ["FCFA", "XAF", "EUR", "CAD", "USD"];

export default function StssPublicPage() {
  return (
    <div className="bg-white text-[#0D2B4D]">
      <section className="bg-[#F7F9FB] border-b border-[#E6E9EF]">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D9D4FF] bg-[#F4F3FF] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5B4BB7]">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              SIMULATION
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
               Comprendre le transfert de scolarité
            </h1>
            <p className="mt-6 text-lg text-[#5B6776] leading-relaxed max-w-2xl">
              STSS est le dispositif de simulation d&apos;EA-POMRA pour préparer un transfert de scolarité entre antennes. Cette page explique le parcours, les pays et les devises, sans collecte de données personnelles.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0D2B4D] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#174A7C]"
              >
                Poser une question
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <span className="inline-flex items-center gap-2 rounded-xl border border-[#D9D4FF] bg-white px-5 py-3 text-sm font-bold text-[#5B4BB7]">
                <Ban className="w-4 h-4" aria-hidden="true" />
                Aucun paiement en ligne
              </span>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">Le principe STSS</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">Un parcours lisible, sans mouvement financier</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#5B6776]">
                Le modèle prévoit une référence, un montant, une antenne source, une antenne destination et un statut. Cette interface de démonstration ne constitue ni une instruction de paiement, ni une quittance, ni une preuve de transfert.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E6E9EF] bg-[#F7F9FB] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <WalletCards className="h-6 w-6 text-[#1EA362]" aria-hidden="true" />
                <h3 className="text-lg font-bold">Montants et commission</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#5B6776]">
                Les montants sont stockés en unités mineures entières. La commission est exprimée en points de base et l&apos;invariant financier reste brut = net + commission.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#E6E9EF] bg-white p-4">
                  <span className="block text-xs text-[#98A2B3]">Brut</span>
                  <span className="mt-1 block text-lg font-black">1 000 000</span>
                </div>
                <div className="rounded-xl border border-[#E6E9EF] bg-white p-4">
                  <span className="block text-xs text-[#98A2B3]">Commission</span>
                  <span className="mt-1 block text-lg font-black">200 bps</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#E6E9EF] bg-[#F7F9FB]">
          <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">Les étapes</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">Le workflow STSS</h2>
            </div>
            <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                ["01", "Préparation", "Référence et antennes identifiées."],
                ["02", "Contrôle KYC", "Vérification prévue par le dispositif pilote."],
                ["03", "Paiement", "Étape décrite uniquement pour le futur pilote."],
                ["04", "Transfert", "Suivi prévu entre les antennes concernées."]
              ].map(([number, title, detail]) => (
                <li key={number} className="rounded-2xl border border-[#E6E9EF] bg-white p-5">
                  <span className="text-xs font-black text-[#5B4BB7]">{number}</span>
                  <h3 className="mt-4 text-base font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5B6776]">{detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#E6E9EF] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Globe2 className="h-6 w-6 text-[#174A7C]" aria-hidden="true" />
                <h2 className="text-2xl font-black">Pays et antennes</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#5B6776]">
                Le périmètre de démonstration couvre les huit pays du dispositif. La disponibilité réelle des opérations sera définie avec le pilote.
              </p>
              <ul className="mt-5 grid grid-cols-2 gap-2 text-sm text-[#1F2937]">
                {countries.map((country) => (
                  <li key={country} className="rounded-lg bg-[#F7F9FB] px-3 py-2">{country}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#E6E9EF] p-6 sm:p-8">
              <h2 className="text-2xl font-black">Devises simulées</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#5B6776]">
                Les devises présentes dans le modèle sont affichées pour préparer le pilote. Aucun taux de change ni paiement réel n&apos;est appliqué sur cette page.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {currencies.map((currency) => (
                  <span key={currency} className="rounded-full border border-[#D5E5F5] bg-[#EBF3FA] px-4 py-2 text-sm font-bold text-[#174A7C]">
                    {currency}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#E6E9EF] bg-[#0D2B4D] text-white">
          <div className="max-w-4xl mx-auto px-6 py-14 text-center sm:py-20">
            <ShieldCheck className="mx-auto h-8 w-8 text-[#8BE0B0]" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-black">STSS reste une simulation</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#D9E2EC]">
              Aucun paiement Mobile Money, aucun provider, aucun webhook et aucune donnée personnelle ne sont activés sur cette page. Le lancement opérationnel nécessitera un pilote conforme et une intégration provider validée.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs font-bold text-[#B9EFCF]">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#2D5976] px-3 py-2"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Aperçu public</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#2D5976] px-3 py-2"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Lecture seule</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#2D5976] px-3 py-2"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Aucune action financière</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
