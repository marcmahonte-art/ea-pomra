import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PUBLIC_ROUTES } from "@/lib/site";
import { ArrowLeft, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "La page demandée n'existe pas ou a été déplacée.",
  robots: { index: false, follow: true },
};

/**
 * Page 404 du site.
 *
 * Sans ce fichier, Next.js sert sa page par défaut : en anglais, sans identité
 * de marque et sans moyen de revenir dans le site. `noindex` évite qu'une URL
 * erronée soit référencée ; `follow` permet en revanche de suivre les liens de
 * secours proposés ci-dessous.
 */
export default function NotFound() {
  // On ne propose que les rubriques publiques : inutile d'envoyer un visiteur
  // perdu vers l'espace étudiant, qui exige un compte.
  const suggestions = PUBLIC_ROUTES.filter((r) =>
    ["/programmes", "/antennes", "/contact"].includes(r.path)
  );

  return (
    <main className="min-h-screen bg-[#F7F9FB] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <Link href="/" className="inline-flex items-center gap-3 mb-8">
          <span className="w-12 h-12 rounded-full overflow-hidden bg-white border border-[#E6E9EF] flex items-center justify-center p-0.5 shrink-0">
            <Image
              src="/assets/logo-ea-pomra-round.png"
              alt="Logo EA-POMRA"
              width={44}
              height={44}
              className="object-contain"
            />
          </span>
          <span className="text-left">
            <span className="font-extrabold text-lg tracking-tight text-[#0D2B4D] block">
              EA-POMRA
            </span>
            <span className="text-[10px] text-[#5B6776] font-medium">
              ÉTUDIER EN AFRIQUE
            </span>
          </span>
        </Link>

        <p className="text-6xl font-black text-[#0D2B4D] tracking-tight">404</p>

        <h1 className="text-xl font-bold text-[#0D2B4D] mt-4">
          Cette page n&apos;existe pas
        </h1>
        <p className="text-sm text-[#5B6776] mt-2 leading-relaxed">
          Le lien est peut-être erroné, ou la page a été déplacée. Votre antenne
          nationale reste votre point de contact pour toute question.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#174A7C] hover:bg-[#123B63] text-white text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#E6E9EF] hover:border-[#174A7C] text-[#0D2B4D] text-sm font-bold transition-colors"
          >
            <Compass className="w-4 h-4" />
            Contacter une antenne
          </Link>
        </div>

        <nav className="mt-10 pt-6 border-t border-[#E6E9EF]">
          <p className="text-[11px] font-bold text-[#8E9BAA] uppercase tracking-wider mb-3">
            Rubriques
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            {suggestions.map((route) => (
              <li key={route.path}>
                <Link
                  href={route.path}
                  className="text-[#174A7C] font-semibold hover:underline"
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
